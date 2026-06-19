// Deterministic carbon-footprint calculator (used as final fallback)
const WEEKS_PER_MONTH = 52 / 12;
const SHORT_HAUL_FLIGHT_KM = 900;
const LONG_HAUL_FLIGHT_KM = 6500;
const SHOPPING_KG_PER_RUPEE_MONTHLY = 0.04 / 12;

const transportFactors = { scooter: 0.035, bicycle: 0, carPetrol: 0.17, carEv: 0.05, truck: 0.25, bus: 0.089, metro: 0.028, railway: 0.041 };
const flightFactors = { flightShort: 0.255 * SHORT_HAUL_FLIGHT_KM / 12, flightLong: 0.195 * LONG_HAUL_FLIGHT_KM / 12 };
const dietMonthlyFactors = { vegan: 58, 'plant-based': 75, vegetarian: 95, 'no-meat-fish': 112, mixed: 150, 'meat-heavy': 205 };
const wasteMonthlyFactors = { low: 8, average: 24, high: 48 };

const toNumber = (value) => { const parsed = Number.parseFloat(value); return Number.isFinite(parsed) && parsed > 0 ? parsed : 0; };
const round = (value, places = 2) => Number(value.toFixed(places));
const format = (value) => round(value).toFixed(2);
const clampSavings = (value, categoryTotal) => format(Math.max(0, Math.min(value, categoryTotal)));
const getBiggest = (breakdown) => Object.entries(breakdown).reduce((largest, entry) => entry[1] > largest[1] ? entry : largest)[0];

const calculateTransport = (transport) => {
  const ground = Object.entries(transportFactors).reduce((total, [field, factor]) => total + toNumber(transport[field]) * factor * WEEKS_PER_MONTH, 0);
  const flights = Object.entries(flightFactors).reduce((total, [field, factor]) => total + toNumber(transport[field]) * factor, 0);
  return ground + flights;
};

const calculateEnergy = (energy) => {
  const gridElectricity = toNumber(energy.elecKwh) * 0.71;
  const solarOffset = energy.hasSolar ? Math.min(gridElectricity, toNumber(energy.solarKw) * toNumber(energy.solarHours) * 30 * 0.71) : 0;
  const lpg = toNumber(energy.lpgCylinders) * 42;
  const applianceAdjustments = (energy.acToggle ? 35 : 0) + (energy.dryerToggle ? 18 : 0) - (energy.ledToggle ? 10 : 0);
  return Math.max(0, gridElectricity - solarOffset + lpg + applianceAdjustments);
};

const calculateFood = (foodWaste) => dietMonthlyFactors[foodWaste.diet] ?? dietMonthlyFactors.mixed;

const calculateWaste = (foodWaste) => {
  const waste = wasteMonthlyFactors[foodWaste.waste] ?? wasteMonthlyFactors.average;
  const shopping = toNumber(foodWaste.shoppingSpend) * SHOPPING_KG_PER_RUPEE_MONTHLY;
  const secondhandReduction = foodWaste.secondhandToggle ? shopping * 0.4 : 0;
  return Math.max(0, waste + shopping - secondhandReduction);
};

const createActions = ({ userData, breakdown }) => {
  const actions = [];
  const transport = userData.transport;
  const energy = userData.energy;
  const foodWaste = userData.foodWaste;
  const carKm = toNumber(transport.carPetrol) + toNumber(transport.truck) + toNumber(transport.scooter);
  const flightCount = toNumber(transport.flightShort) + toNumber(transport.flightLong);

  if (carKm > 0) {
    actions.push({
      id: 'shift-car-trips', category: 'Transport', difficulty: 'MEDIUM', title: 'Replace two fuel-vehicle trips each week',
      desc: 'Move a small share of scooter, petrol car, or van travel to metro, bus, cycling, or trip-chaining.', tip: 'Fuel vehicles compound quickly because weekly kilometres repeat every month.',
      savings: clampSavings(Math.min(breakdown.transport * 0.18, carKm * 0.17 * WEEKS_PER_MONTH * 0.25), breakdown.transport),
    });
  } else if (flightCount > 0) {
    actions.push({
      id: 'trim-flight-impact', category: 'Transport', difficulty: 'HARD', title: 'Replace one short flight or combine trips',
      desc: 'If one annual flight can become rail travel or be combined with another trip, your monthly average drops.', tip: 'Flights look occasional, but annual flights still add to every monthly baseline.',
      savings: clampSavings(Math.min(breakdown.transport * 0.22, 18), breakdown.transport),
    });
  } else {
    actions.push({
      id: 'keep-low-carbon-mobility', category: 'Transport', difficulty: 'EASY', title: 'Protect your low-carbon travel pattern',
      desc: 'Your transport inputs are already light. Keep recurring trips on public transit, rail, cycling, or walking.', tip: 'The best transport saving is often preserving a habit before high-emission alternatives creep in.',
      savings: clampSavings(breakdown.transport * 0.08, breakdown.transport),
    });
  }

  if (toNumber(energy.elecKwh) > 120 || energy.acToggle || energy.dryerToggle) {
    actions.push({
      id: 'reduce-home-electricity', category: 'Electricity', difficulty: 'EASY', title: 'Cut peak home electricity use by 10%',
      desc: 'Tune AC temperature, line-dry when practical, and switch off standby loads during high-use hours.', tip: 'A modest kWh reduction is reliable because it attacks a repeated monthly source.',
      savings: clampSavings(Math.max(8, breakdown.energy * 0.12), breakdown.energy),
    });
  } else {
    actions.push({
      id: 'maintain-efficient-home', category: 'Electricity', difficulty: 'EASY', title: 'Keep the efficient-home basics locked in',
      desc: 'Your home energy profile is already restrained. Maintain LED lighting and watch for seasonal AC spikes.', tip: 'Small homes can jump sharply during hot months, so tracking kWh is useful.',
      savings: clampSavings(breakdown.energy * 0.06, breakdown.energy),
    });
  }

  if (foodWaste.diet === 'meat-heavy' || foodWaste.diet === 'mixed') {
    actions.push({
      id: 'lower-meat-frequency', category: 'Food', difficulty: 'MEDIUM', title: 'Make three meals per week plant-forward',
      desc: 'Replace a few meat-heavy meals with dal, legumes, paneer alternatives, grains, or seasonal vegetables.', tip: 'Diet changes have strong leverage because food emissions repeat every day.',
      savings: clampSavings(Math.max(18, breakdown.food * 0.16), breakdown.food),
    });
  } else {
    actions.push({
      id: 'reduce-food-waste', category: 'Food', difficulty: 'EASY', title: 'Plan perishables before the week starts',
      desc: 'Buy fresh items against a short meal plan and use leftovers before shopping again.', tip: 'Even lower-carbon diets lose impact when food is discarded.',
      savings: clampSavings(Math.max(8, breakdown.food * 0.08), breakdown.food),
    });
  }

  if (toNumber(foodWaste.shoppingSpend) > 0 || foodWaste.waste !== 'low') {
    actions.push({
      id: 'lower-shopping-waste', category: 'Waste', difficulty: 'EASY', title: 'Move one purchase to repair, reuse, or refurbished',
      desc: 'Delay one new clothing or electronics purchase each month, or choose second-hand when quality is comparable.', tip: 'Manufacturing emissions are hidden inside spending, so avoiding new purchases can beat small recycling wins.',
      savings: clampSavings(Math.max(6, breakdown.waste * 0.18), breakdown.waste),
    });
  } else {
    actions.push({
      id: 'keep-waste-low', category: 'Waste', difficulty: 'EASY', title: 'Keep sorting, reuse, and low-disposable habits',
      desc: 'Your waste band is already low. Keep composting, sorting, and avoiding single-use products.', tip: 'Consistency matters more than chasing tiny one-off savings here.',
      savings: clampSavings(breakdown.waste * 0.08, breakdown.waste),
    });
  }

  return actions.slice(0, 4);
};

export async function calculateFootprint(userData) {
  const breakdown = {
    transport: round(calculateTransport(userData.transport)),
    energy: round(calculateEnergy(userData.energy)),
    food: round(calculateFood(userData.foodWaste)),
    waste: round(calculateWaste(userData.foodWaste)),
  };
  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  return {
    total: format(total),
    biggest: getBiggest(breakdown),
    breakdown: {
      transport: format(breakdown.transport),
      energy: format(breakdown.energy),
      food: format(breakdown.food),
      waste: format(breakdown.waste),
    },
    actions: createActions({ userData, breakdown }),
  };
}

// AI Fallback Configuration
const FALLBACK_MODELS = [
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'meta-llama/Llama-3.3-70B-Instruct',
  'meta-llama/llama-3.1-8b-instant',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.6-27b',
  'Qwen/Qwen3-32B'
];

export async function calculateFootprintWithAI(userData) {
  const rawKeys = import.meta.env.VITE_AI_API_KEYS || '';
  const apiKeys = rawKeys.split(',').map(k => k.trim()).filter(Boolean);

  if (apiKeys.length === 0) {
    console.warn("No AI API keys found. Falling back to deterministic calculator.");
    return calculateFootprint(userData);
  }

  const prompt = `Analyze this user's lifestyle and return a JSON payload with their monthly carbon footprint in kg CO2e.
  UserData: ${JSON.stringify(userData)}
  
  Format MUST be exactly:
  {
    "total": "450.50",
    "biggest": "transport",
    "breakdown": { "transport": "150.00", "energy": "100.00", "food": "150.50", "waste": "50.00" },
    "actions": [
      {
        "id": "unique-id",
        "category": "Transport",
        "difficulty": "EASY|MEDIUM|HARD",
        "title": "Action title",
        "desc": "Action description",
        "tip": "Why this works",
        "savings": "25.50"
      }
    ]
  }
  Output ONLY valid JSON.`;

  for (const key of apiKeys) {
    for (const model of FALLBACK_MODELS) {
      try {
        console.log(\`Attempting AI inference with key \${key.slice(0,4)}... and model \${model}\`);
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': \`Bearer \${key}\`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" }
          })
        });

        if (response.status === 429) {
          console.warn(\`Rate limited on \${model} with key \${key.slice(0,4)}...\`);
          continue; // Fallback to next model/key
        }

        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}\`);
        }

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
      } catch (e) {
        console.error(\`AI inference failed for \${model}:\`, e.message);
        // Continue loop to try next fallback
      }
    }
  }

  console.warn("All AI fallbacks failed. Using deterministic calculator.");
  return calculateFootprint(userData);
}
