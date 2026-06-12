import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Calculator, Map, Zap, Salad } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const ReviewScreen = ({ data, goBack, calculate }) => {
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      calculate();
    }, 1500); // Fake calculating delay for dramatic effect
  };

  // Helper to safely format numbers or return default text
  const formatVal = (val, unit) => val && val !== '0' ? `${val} ${unit}` : 'None';

  return (
    <motion.div 
      className="flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Progress Header */}
      <div className="mb-8 relative z-10 sticky top-0 bg-card/90 backdrop-blur-md pt-2 pb-4 z-20">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
          <span>Step 5 of 5</span>
          <span>Review</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: "80%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
            className="h-full bg-brand-green rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"
          ></motion.div>
        </div>
      </div>

      <motion.div variants={itemVariants} className="mb-8">
        <div className="inline-flex items-center gap-2 text-brand-green text-[11px] font-bold uppercase tracking-widest mb-4">
          <Calculator size={14} /> One Last Look
        </div>
        <h2 className="text-[32px] sm:text-[40px] font-bold text-foreground leading-[1.1] mb-4 tracking-tight text-shadow-glow">Ready for your baseline?</h2>
        <p className="text-muted-foreground text-[16px] leading-relaxed">Your estimate uses versioned factors and will include important caveats alongside the result.</p>
      </motion.div>

      {/* Summary List */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3 mb-8">
        
        <div className="p-4 rounded-xl border border-white/5 bg-black/20 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-red-400 font-semibold text-sm mb-2"><Map size={16}/> Transport</div>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-muted-foreground">Personal Vehicles</div>
            <div className="text-right font-medium text-foreground">
              {data.transport.carPetrol || data.transport.scooter || data.transport.carEv ? 'Active' : 'None'}
            </div>
            <div className="text-muted-foreground">Public Transit</div>
            <div className="text-right font-medium text-foreground">
              {data.transport.bus || data.transport.metro || data.transport.railway ? 'Active' : 'None'}
            </div>
            <div className="text-muted-foreground">Flights</div>
            <div className="text-right font-medium text-foreground">
              {formatVal((parseFloat(data.transport.flightShort||0) + parseFloat(data.transport.flightLong||0)).toString(), 'per year')}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-black/20 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm mb-2"><Zap size={16}/> Energy</div>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-muted-foreground">Electricity</div>
            <div className="text-right font-medium text-foreground">{formatVal(data.energy.elecKwh, 'kWh/mo')}</div>
            <div className="text-muted-foreground">Solar Powered</div>
            <div className="text-right font-medium text-foreground">{data.energy.hasSolar ? 'Yes' : 'No'}</div>
            <div className="text-muted-foreground">Cooking LPG</div>
            <div className="text-right font-medium text-foreground">{formatVal(data.energy.lpgCylinders, 'cyl/mo')}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-black/20 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-brand-green font-semibold text-sm mb-2"><Salad size={16}/> Food & Waste</div>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-muted-foreground">Diet Type</div>
            <div className="text-right font-medium text-foreground capitalize">{data.foodWaste.diet.replace('-', ' ')}</div>
            <div className="text-muted-foreground">Waste Habit</div>
            <div className="text-right font-medium text-foreground capitalize">{data.foodWaste.waste}</div>
            <div className="text-muted-foreground">Shopping Spend</div>
            <div className="text-right font-medium text-foreground">{formatVal(data.foodWaste.shoppingSpend, '₹/mo')}</div>
          </div>
        </div>

      </motion.div>

      <motion.div variants={itemVariants} className="pt-6 mt-auto border-t border-white/5 flex items-center justify-between sticky bottom-0 bg-card/90 backdrop-blur-md pb-2 z-20">
        <button 
          onClick={goBack} 
          disabled={isCalculating}
          className="flex items-center gap-2 text-muted-foreground text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/5 transition-colors focus-visible:outline-none disabled:opacity-50"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button 
          onClick={handleCalculate} 
          disabled={isCalculating}
          className="btn-magic group disabled:opacity-80"
        >
          <span className="btn-magic-glow"></span>
          <span className="btn-magic-inner gap-2 text-sm px-6">
            {isCalculating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </>
            ) : (
              <>
                Calculate My Baseline <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ReviewScreen;
