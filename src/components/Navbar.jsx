import React from 'react';
import { Leaf, User } from 'lucide-react';

const Navbar = ({ setCurrentScreen }) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setCurrentScreen(0)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-white/5 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]">
            <Leaf size={20} className="text-brand-green" />
          </div>
          <div>
            <div className="font-sans text-lg font-bold tracking-tight text-foreground">
              EcoTrace AI
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              Your practical climate guide
            </div>
          </div>
        </div>
        
        <div>
          <button className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            <User size={16} /> Sign in
          </button>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
