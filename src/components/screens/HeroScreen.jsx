import React, { useState, useEffect } from 'react';
import { ArrowRight, CloudSun, Sparkles, Footprints, Check, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroScreen = ({ goNext }) => {
  const [factIndex, setFactIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const facts = [
    "Food accounts for 10-30% of a household's carbon footprint, with meat and dairy having the highest lifecycle emissions.",
    "The average global carbon footprint is about 4.7 tonnes of CO2 per year, but the target to avoid 2°C warming is under 2 tonnes.",
    "Replacing a domestic short-haul flight with a train journey reduces travel carbon emissions by up to 80-90%."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setFactIndex((prev) => (prev + 1) % facts.length);
        setFade(true);
      }, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Ambient Glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-green/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Progress Header */}
      <div className="mb-10 relative z-10">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
          <span>Step 1 of 5</span>
          <span>Welcome</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "20%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-brand-green rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"
          ></motion.div>
        </div>
      </div>

      <div className="flex-1 relative z-10 max-w-xl">
        {/* Icon Bubble */}
        <div className="w-16 h-16 rounded-2xl bg-brand-green/10 border border-brand-green/20 text-brand-green flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(74,222,128,0.15)]">
          <CloudSun size={32} />
        </div>

        {/* Did you know card */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex items-start gap-4 mb-10 hover:border-white/10 transition-colors">
          <div className="mt-0.5 bg-brand-green/20 text-brand-green rounded-lg w-8 h-8 flex items-center justify-center shrink-0 border border-brand-green/20">
            <Sparkles size={16} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green/80">Did you know?</span>
              <span className="text-[10px] font-mono text-muted-foreground">{factIndex + 1} / {facts.length}</span>
            </div>
            <p className={`text-sm text-foreground/90 leading-relaxed transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              {facts[factIndex]}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex items-center gap-2 text-brand-green text-[11px] font-bold uppercase tracking-widest mb-4">
          <Footprints size={14} /> Your Baseline
        </div>
        <h2 className="text-[32px] sm:text-[40px] font-bold text-foreground leading-[1.1] mb-4 tracking-tight text-shadow-glow">
          Let's make carbon feel less abstract.
        </h2>
        <p className="text-muted-foreground text-[16px] leading-relaxed mb-8">
          We'll ask about travel, home electricity, food, and waste. You'll get a monthly estimate, a clear breakdown, and the biggest place to start.
        </p>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {[
            "No account needed",
            "Assumptions stay visible",
            "Change answers anytime",
            "AI never invents totals"
          ].map((text, i) => (
            <motion.div 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              key={i} 
              className="flex items-center gap-3 border border-white/5 rounded-xl px-4 py-3 bg-black/20 cursor-default transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0">
                <Check size={12} className="text-brand-green" />
              </div>
              <span className="text-sm font-medium text-foreground/90">{text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 mt-auto flex items-center justify-between relative z-10 border-t border-white/5">
        <button className="flex items-center gap-2 text-muted-foreground text-sm font-semibold px-4 py-2 rounded-full opacity-50 cursor-not-allowed">
          <ArrowLeft size={16} /> Back
        </button>
        
        <button onClick={goNext} className="btn-magic group">
          <span className="btn-magic-glow"></span>
          <span className="btn-magic-inner gap-2 px-6">
            Continue <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default HeroScreen;
