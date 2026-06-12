import React from 'react';
import { ArrowRight, Leaf, Globe, Target } from 'lucide-react';

const HeroScreen = ({ goNext }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-20 text-center animate-fade-in">
      
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-brand-green/20 bg-brand-green/5 text-xs font-medium uppercase tracking-widest text-brand-green backdrop-blur-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <Leaf size={14} /> promptwars by google · carbon tracker
      </div>
      
      <h1 className="max-w-4xl mb-6 text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
        What's your <br className="hidden sm:block" />
        <span className="text-gradient inline-block relative">
          carbon footprint
          <svg className="absolute -bottom-2 left-0 w-full h-3 z-[-1] opacity-70" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 10C50 2 150 2 198 10" stroke="#4ade80" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </span> today?
      </h1>
      
      <p className="max-w-2xl mb-10 text-lg sm:text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '0.3s' }}>
        Answer a few questions about how you travel, use energy, eat, and manage waste. Get a personalised score and actions that actually move the needle.
      </p>
      
      <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <button onClick={goNext} className="btn-magic group">
          <span className="btn-magic-glow"></span>
          <span className="btn-magic-inner gap-2">
            Calculate Mine 
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </div>
      
      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 pt-16 mt-24 border-t border-white/10 sm:grid-cols-3 animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="flex flex-col items-center p-6 glass-card">
          <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-brand-green/10 text-brand-green">
            <Leaf size={24} />
          </div>
          <div className="font-mono text-4xl font-bold text-brand-green drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]">4.7t</div>
          <div className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">avg indian / yr</div>
        </div>
        <div className="flex flex-col items-center p-6 glass-card">
          <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-amber-500/10 text-amber-500">
            <Globe size={24} />
          </div>
          <div className="font-mono text-4xl font-bold text-amber-500">7.0t</div>
          <div className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">global avg / yr</div>
        </div>
        <div className="flex flex-col items-center p-6 glass-card">
          <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-500/10 text-blue-500">
            <Target size={24} />
          </div>
          <div className="font-mono text-4xl font-bold text-blue-500">2.0t</div>
          <div className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">paris target / yr</div>
        </div>
      </div>
    </div>
  );
};

export default HeroScreen;
