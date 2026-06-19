import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const BrandSidebar = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full lg:w-[40%] 2xl:w-[36%] flex flex-col justify-between py-2 lg:py-8"
    >
      <div>
        <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-green/20 bg-brand-green/10 text-xs font-medium uppercase tracking-[0.04em] text-brand-green mb-8 backdrop-blur-sm">
          A clearer starting point
        </p>
        
        <h1 className="text-4xl sm:text-5xl lg:text-[64px] leading-[1.08] font-extrabold text-foreground mb-6 tracking-normal">
          Small choices,
          <br />
          one readable
          <br />
          <span className="text-gradient inline-block relative mt-2">
            footprint.
            <svg className="absolute -bottom-2 left-0 w-full h-3 z-[-1] opacity-50" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                d="M2 10C50 2 150 2 198 10" 
                stroke="var(--color-brand-green)"
                strokeWidth="4" 
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>
        
        <p className="text-muted-foreground text-base sm:text-lg max-w-md leading-relaxed mb-10">
          EcoTrace turns everyday habits into an explainable monthly estimate, then helps you focus on the changes that matter most.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="glass-card p-4">
            <div className="text-foreground font-extrabold text-2xl mb-1">4</div>
            <div className="text-muted-foreground text-xs leading-snug font-medium">clear categories</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-foreground font-extrabold text-2xl mb-1">100%</div>
            <div className="text-muted-foreground text-xs leading-snug font-medium">explainable</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-foreground font-extrabold text-2xl mb-1">5 min</div>
            <div className="text-muted-foreground text-xs leading-snug font-medium">to baseline</div>
          </div>
        </div>
      </div>

      <div className="glass-card border-brand-green/20 bg-brand-green/5 p-6 relative overflow-hidden group mt-auto">
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-brand-green/50 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-brand-green font-medium text-sm mb-2">
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
