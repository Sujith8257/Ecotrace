// AI Service with Fallback Mechanism

const FALLBACK_MODELS = [
  "llama-3.3-70b-versatile",
  "qwen-32b-preview",
  "llama-3.1-8b-instant"
];

const DEFAULT_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Executes a chat completion request with automatic key fallback.
 * @param {string} prompt The system prompt/instructions
 * @param {object} userData The user data to analyze
 * @returns {Promise<object>} The parsed JSON payload
 */
export async function calculateFootprintWithAI(userData) {
  // Parse keys from comma-separated env var
  const keysEnv = import.meta.env.VITE_AI_API_KEYS || "";
  const apiKeys = keysEnv.split(',').map(k => k.trim()).filter(k => k.length > 0);
  
  if (apiKeys.length === 0) {
    console.error("No API keys found in VITE_AI_API_KEYS");
    throw new Error("API keys not configured.");
  }

  const systemPrompt = `You are an expert climate data scientist. 
The user will provide their lifestyle data in JSON format (transport, energy, food/waste).
Calculate their estimated monthly carbon footprint in kg CO2e.
Return ONLY a valid JSON object with the following structure:
{
  "total": "number (e.g., 280.92)",
  "biggest": "string (e.g., 'Food' or 'Transport')",
  "breakdown": {
    "transport": "number",
    "energy": "number",
    "food": "number",
    "waste": "number"
  },
  "actions": [
    {
      "id": "unique_string",
      "category": "Food|Electricity|Waste|Transport",
      "difficulty": "EASY|MEDIUM|HARD",
      "title": "Action title",
      "desc": "Action description",
      "tip": "Why this works",
      "savings": "number (estimated monthly kg CO2e saved)"
    }
  ]
}
The 'actions' array MUST contain exactly 4 highly tailored recommendations based specifically on the user's data. Be creative but scientifically accurate. Do not include markdown formatting like \`\`\`json in your response, just the raw JSON text.`;

  const userPrompt = JSON.stringify(userData, null, 2);

  // Attempt fetch using keys as fallbacks
  for (let i = 0; i < apiKeys.length; i++) {
    const key = apiKeys[i];
    // Try the first model, fallback to others if needed
    for (let j = 0; j < FALLBACK_MODELS.length; j++) {
      const model = FALLBACK_MODELS[j];
      
      try {
        console.log(`[AI Service] Attempting request with Key ${i + 1}/${apiKeys.length}, Model: ${model}`);
        const response = await fetch(DEFAULT_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.2,
            response_format: { type: "json_object" }
          })
        });

        if (!response.ok) {
          if (response.status === 429) {
            console.warn(`[AI Service] Rate limited on Key ${i + 1}, Model ${model}. Trying next...`);
            continue; // Try next model or next key
          }
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Parse the JSON
        const parsed = JSON.parse(content);
        return parsed;

      } catch (err) {
        console.error(`[AI Service] Error with Key ${i + 1}, Model ${model}:`, err.message);
        // If it's a JSON parse error, don't retry the key, just throw. 
        // If it's a network/rate limit error, the loop continues.
        if (err instanceof SyntaxError) {
           throw new Error("AI returned malformed JSON.");
        }
      }
    }
  }

  throw new Error("All API keys and fallback models failed.");
}
