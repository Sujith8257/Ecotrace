import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const BrandSidebar = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full lg:w-[45%] flex flex-col justify-between py-8 lg:py-12 pr-0 lg:pr-12"
    >
      <div>
        <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-green/20 bg-brand-green/5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand-green mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          A clearer starting point
        </p>
        
        <h1 className="text-4xl sm:text-5xl lg:text-[64px] leading-[1.05] font-bold text-foreground mb-8 tracking-tight">
          Small choices.<br />
          A footprint<br />
          <span className="text-gradient inline-block relative mt-2">
            you can actually understand.
            <svg className="absolute -bottom-2 left-0 w-full h-3 z-[-1] opacity-50" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                d="M2 10C50 2 150 2 198 10" 
                stroke="#4ade80" 
                strokeWidth="4" 
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>
        
        <p className="text-muted-foreground text-base sm:text-lg max-w-sm leading-relaxed mb-12">
          EcoTrace turns everyday habits into an explainable monthly estimate, then helps you focus on the changes that matter most.
        </p>

        <div className="flex gap-4 mb-12">
          <div className="glass-card p-4 flex-1 hover:-translate-y-1 transition-transform duration-300">
            <div className="text-foreground font-bold text-2xl mb-1 text-shadow-glow">4</div>
            <div className="text-muted-foreground text-xs leading-snug font-medium uppercase tracking-wider">clear<br/>categories</div>
          </div>
          <div className="glass-card p-4 flex-1 hover:-translate-y-1 transition-transform duration-300">
            <div className="text-foreground font-bold text-2xl mb-1 text-shadow-glow">100%</div>
            <div className="text-muted-foreground text-xs leading-snug font-medium uppercase tracking-wider">explainable</div>
          </div>
          <div className="glass-card p-4 flex-1 hover:-translate-y-1 transition-transform duration-300">
            <div className="text-foreground font-bold text-2xl mb-1 text-shadow-glow">5 min</div>
            <div className="text-muted-foreground text-xs leading-snug font-medium uppercase tracking-wider">to your<br/>baseline</div>
          </div>
        </div>
      </div>

      <div className="glass-card border-brand-green/20 bg-brand-green/5 p-6 relative overflow-hidden group mt-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green/0 via-brand-green/5 to-brand-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-brand-green font-bold text-sm mb-2">
            <Sparkles size={16} className="animate-pulse-glow" /> Built to trace, not judge
          </div>
          <p className="text-brand-green/80 text-sm leading-relaxed">
            Your result is an estimate with visible assumptions, never a hidden AI guess.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BrandSidebar;
