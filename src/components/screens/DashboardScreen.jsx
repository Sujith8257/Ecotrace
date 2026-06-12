import React, { useState, useMemo } from 'react';
import { Leaf, ArrowRight, ArrowLeft, RefreshCw, Car, Zap, Salad, Map, Trash2, Info, User, Check, Sparkles, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const DashboardScreen = ({ data, recalculate }) => {
  const [selectedActions, setSelectedActions] = useState([]);

  // --- Mock Calculation Logic for Demo ---
  const calculations = useMemo(() => {
    // These are simplified mock calculations to give realistic-looking numbers
    let transport = 0;
    if (data.transport.carPetrol) transport += parseFloat(data.transport.carPetrol) * 4 * 0.17;
    if (data.transport.bus) transport += parseFloat(data.transport.bus) * 4 * 0.089;
    if (data.transport.flightShort) transport += parseFloat(data.transport.flightShort) * 150; // amortized monthly
    
    let energy = 0;
    if (data.energy.elecKwh) energy += parseFloat(data.energy.elecKwh) * 0.82;
    if (data.energy.lpgCylinders) energy += parseFloat(data.energy.lpgCylinders) * 42;
    if (data.energy.hasSolar && data.energy.solarKw) {
      energy -= parseFloat(data.energy.solarKw) * parseFloat(data.energy.solarHours) * 30 * 0.82;
      if (energy < 0) energy = 0;
    }

    let food = 0;
    if (data.foodWaste.diet === 'vegan') food = 60;
    else if (data.foodWaste.diet === 'vegetarian') food = 80;
    else if (data.foodWaste.diet === 'mixed') food = 150;
    else food = 220; // meat heavy

    let waste = 0;
    if (data.foodWaste.waste === 'low') waste = 10;
    else if (data.foodWaste.waste === 'average') waste = 30;
    else waste = 50;

    const total = transport + energy + food + waste;

    // Determine biggest contributor
    const cats = [
      { name: 'Transport', val: transport },
      { name: 'Energy', val: energy },
      { name: 'Food', val: food },
      { name: 'Waste', val: waste }
    ];
    cats.sort((a, b) => b.val - a.val);

    return {
      transport: transport.toFixed(2),
      energy: energy.toFixed(2),
      food: food.toFixed(2),
      waste: waste.toFixed(2),
      total: total.toFixed(2),
      biggest: cats[0].name
    };
  }, [data]);

  // Action Recommendations
  const actions = [
    {
      id: 'food_meatless',
      category: 'Food',
      difficulty: 'EASY',
      title: "Adopt 'Meatless Mondays' or Plant-Based Days",
      desc: "Substitute meat and dairy with local, plant-based proteins for several days each week.",
      tip: "Animal agriculture generates significantly higher lifecycle emissions. Choosing plant-based meals cuts down your food carbon footprint.",
      savings: 25.0
    },
    {
      id: 'energy_led',
      category: 'Electricity',
      difficulty: 'EASY',
      title: "Switch to Energy-Efficient LEDs",
      desc: "Upgrade traditional incandescent or CFL bulbs in your home to high-efficiency LEDs.",
      tip: "Replacing home bulbs with LEDs reduces electricity consumption by around 15%, saving 12.9 kg CO2e monthly.",
      savings: 12.9
    },
    {
      id: 'waste_sort',
      category: 'Waste',
      difficulty: 'MEDIUM',
      title: "Sort Recyclables & Compost Organic Waste",
      desc: "Separate paper, plastic, and glass for recycling, and compost your organic kitchen scraps to reduce landfill waste.",
      tip: "Moving from 'average' to low waste output avoids organic decomposition in landfills, saving 7.0 kg CO2e monthly.",
      savings: 7.0
    },
    {
      id: 'energy_ac',
      category: 'Electricity',
      difficulty: 'EASY',
      title: "Optimize AC Temperature to 24°C+",
      desc: "Keep your air conditioner set to 24°C or higher and keep filters clean to maximize cooling efficiency.",
      tip: "Raising your AC temperature by a couple of degrees can reduce your overall energy footprint by 6%, saving 5.2 kg CO2e.",
      savings: 5.2
    }
  ];

  const toggleAction = (id) => {
    if (selectedActions.includes(id)) {
      setSelectedActions(selectedActions.filter(a => a !== id));
    } else {
      setSelectedActions([...selectedActions, id]);
    }
  };

  const totalSavings = actions
    .filter(a => selectedActions.includes(a.id))
    .reduce((sum, a) => sum + a.savings, 0);

  const futureTotal = (parseFloat(calculations.total) - totalSavings).toFixed(2);
  const healthScore = Math.max(0, Math.min(100, Math.round(100 - (parseFloat(calculations.total) / 10))));

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 py-10 relative">
      
      {/* Top Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green mb-2">Your Monthly Baseline</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight text-shadow-glow">Here's where you stand.</h1>
        </div>
        <div className="max-w-xs text-xs text-muted-foreground leading-relaxed md:text-right">
          Estimated with factor set <span className="font-semibold text-foreground/80">india-demo-2025.1</span>. Treat this as a useful direction, not an exact inventory.
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* ================= LEFT COLUMN ================= */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-8">
          
          {/* Hero Score Card */}
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[24px] p-8 sm:p-12 shadow-2xl bg-black border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-transparent opacity-50"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-green/30 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-sm text-brand-green font-medium mb-4">
                <Leaf size={16} /> Estimated monthly footprint
              </div>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-[64px] sm:text-[80px] font-bold text-foreground leading-none tracking-tighter drop-shadow-lg">
                  {calculations.total}
                </span>
                <span className="text-lg font-medium text-muted-foreground">kg CO2e</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
                <Sparkles size={16} className="text-amber-400" /> Biggest contributor: <span className="text-foreground">{calculations.biggest}</span>
              </div>
            </div>
          </motion.div>

          {/* Breakdown Card */}
          <motion.div variants={itemVariants} className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[24px] p-8">
            <div className="flex items-center justify-between mb-8 cursor-pointer group">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Your Breakdown</div>
                <h3 className="text-xl font-bold text-foreground">What shapes your total</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground transition-colors">
                <ArrowRight size={16} />
              </div>
            </div>

            <div className="space-y-6">
              {[
                { name: 'Transport', icon: <Car size={14}/>, val: calculations.transport, color: 'bg-red-400' },
                { name: 'Electricity', icon: <Zap size={14}/>, val: calculations.energy, color: 'bg-amber-400' },
                { name: 'Food', icon: <Salad size={14}/>, val: calculations.food, color: 'bg-brand-green' },
                { name: 'Waste', icon: <Trash2 size={14}/>, val: calculations.waste, color: 'bg-blue-400' }
              ].map((cat, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                      <span className={cat.color.replace('bg-', 'text-')}>{cat.icon}</span> {cat.name}
                    </div>
                    <div className="font-semibold text-foreground/90">{cat.val} <span className="text-xs text-muted-foreground font-normal">kg</span></div>
                  </div>
                  <div className="h-2 bg-black/40 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (cat.val / calculations.total) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className={`h-full ${cat.color} rounded-full`}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Plan Card */}
          <motion.div variants={itemVariants} className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[24px] p-8">
            <div className="mb-8">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Climate Action Plan</div>
              <h3 className="text-xl font-bold text-foreground">Tailored recommendations</h3>
            </div>

            <div className="space-y-4">
              {actions.map(action => {
                const isSelected = selectedActions.includes(action.id);
                return (
                  <div 
                    key={action.id}
                    onClick={() => toggleAction(action.id)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer flex gap-4 ${isSelected ? 'bg-brand-green/5 border-brand-green shadow-[0_0_15px_rgba(74,222,128,0.1)]' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-brand-green border-brand-green text-black' : 'border-white/20 bg-transparent'}`}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-brand-green' : 'text-muted-foreground'}`}>{action.category}</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${isSelected ? 'bg-brand-green/20 text-brand-green' : 'bg-white/10 text-muted-foreground'}`}>{action.difficulty}</span>
                        </div>
                        <div className={`text-[11px] font-bold px-2 py-1 rounded-full ${isSelected ? 'bg-brand-green/20 text-brand-green' : 'bg-white/5 text-muted-foreground'}`}>
                          -{action.savings} kg/month
                        </div>
                      </div>
                      <h4 className={`text-base font-bold mb-1 ${isSelected ? 'text-brand-green' : 'text-foreground'}`}>{action.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{action.desc}</p>
                      
                      <div className={`p-3 rounded-lg text-xs leading-relaxed transition-colors ${isSelected ? 'bg-brand-green/10 text-brand-green/90' : 'bg-white/5 text-muted-foreground'}`}>
                        <Sparkles size={12} className="inline mr-1 -mt-0.5" />
                        {action.tip}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* What to know */}
          <motion.div variants={itemVariants} className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[24px] p-8">
            <div className="mb-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">What to know</div>
              <h3 className="text-xl font-bold text-foreground">This estimate stays honest.</h3>
            </div>
            <div className="space-y-3">
              {[
                "All results are estimates rather than a complete lifecycle inventory.",
                "Transport factors are representative passenger-mode values and do not model vehicle, fuel, or occupancy details.",
                "Food and waste values are coarse behavioral proxies for relative coaching."
              ].map((text, i) => (
                <div key={i} className="flex gap-3 p-3 bg-black/20 rounded-lg border border-white/5 text-sm text-muted-foreground/90">
                  <Info size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-8">
          
          {/* Health Score Card */}
          <motion.div variants={itemVariants} className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[24px] p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Carbon Health Score</div>
              <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green border border-brand-green/30">
                <Leaf size={18} />
              </div>
            </div>
            <div className="text-[48px] font-bold text-foreground leading-none mb-4">{healthScore}</div>
            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${healthScore}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-brand-green to-emerald-400 rounded-full"
              ></motion.div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your score is <span className="font-semibold text-foreground">high impact</span>. It compares your estimate with a 2 tCO2e annual lifestyle target.
            </p>
          </motion.div>

          {/* Compare Card */}
          <motion.div variants={itemVariants} className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[24px] p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Compare & Save</div>
            <h3 className="text-lg font-bold text-foreground mb-3">Where do you rank?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Sign in securely to save this estimate to your profile and unlock your community percentile rank.
            </p>
            <button className="w-full py-3 rounded-xl bg-black border border-white/10 hover:border-white/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-foreground">
              <User size={16} /> Sign In to Compare & Save
            </button>
          </motion.div>

          {/* Impact Calculator Card (Interactive) */}
          <motion.div variants={itemVariants} className="bg-card/40 backdrop-blur-xl border border-brand-green/20 rounded-[24px] p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-green/5"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green mb-1">
                <RefreshCw size={12} /> Impact Calculator
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">Future Footprint</h3>
              <p className="text-sm text-brand-green/80 leading-relaxed mb-6">
                Check actions on the left to see how much carbon you could save next month.
              </p>

              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="text-2xl font-bold text-foreground mb-1">{futureTotal}</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Future (kg CO2e)</div>
                </div>
                <div className="flex-1 bg-brand-green/10 border border-brand-green/20 rounded-xl p-4 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                  <div className="text-2xl font-bold text-brand-green mb-1">-{totalSavings.toFixed(1)}</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-brand-green">Monthly Savings</div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-3 text-[10px] text-muted-foreground leading-relaxed">
                If you complete all selected recommendations, you will reduce your footprint by <span className="font-bold text-foreground">{(totalSavings / calculations.total * 100).toFixed(1)}%</span>.
              </div>
            </div>
          </motion.div>

          {/* Every Step Counts */}
          <motion.div variants={itemVariants} className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[24px] p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center mb-6">
              <Leaf size={24} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">Every Step Counts</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Reducing your emissions isn't about perfection. It's about small, consistent adjustments to your everyday routine.
            </p>
            <button className="px-5 py-2 rounded-full bg-white/5 text-foreground border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors">
              Climate Action Mode
            </button>
          </motion.div>

        </div>
      </motion.div>

      {/* Recalculate Top Bar / Bottom buttons */}
      <div className="flex justify-center mt-12 mb-8">
        <button onClick={recalculate} className="flex items-center gap-2 text-muted-foreground text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/5 hover:text-foreground transition-colors focus-visible:outline-none">
          <RefreshCw size={16} /> Update my answers
        </button>
      </div>

      {/* Sticky Coach Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-brand-green hover:bg-brand-green/90 text-black font-bold shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-transform hover:scale-105 active:scale-95">
          <MessageCircle size={18} /> Chat with Trace
        </button>
      </div>

    </div>
  );
};

export default DashboardScreen;
