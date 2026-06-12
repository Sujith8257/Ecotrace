import React from 'react';
import { ArrowLeft, ArrowRight, Zap, Flame, Home, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const EnergyScreen = ({ data, updateData, goBack, goNext }) => {
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
          <span>Step 3 of 5</span>
          <span>Energy</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: "40%" }}
            animate={{ width: "60%" }}
            transition={{ duration: 1 }}
            className="h-full bg-brand-green rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"
          ></motion.div>
        </div>
      </div>

      <motion.div variants={itemVariants} className="mb-10">
        <h2 className="text-[32px] sm:text-[40px] font-bold text-foreground leading-[1.1] mb-4 tracking-tight text-shadow-glow">Home energy use</h2>
        <p className="text-muted-foreground text-[16px] leading-relaxed">Your electricity bill and cooking setup determine a big chunk of your footprint.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500"><Zap size={20} /></span>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Electricity</h3>
        </div>
        
        <div className="mb-6 p-5 rounded-xl border border-white/5 bg-black/20">
          <label className="block text-sm font-medium text-foreground mb-3">Monthly electricity bill (units / kWh)</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <input type="number" min="0" placeholder="e.g. 200" value={data.elecKwh} onChange={e => updateData('elecKwh', e.target.value)} className="w-full bg-background border border-white/10 rounded-lg pl-4 pr-16 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green transition-all shadow-sm" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">kWh</span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> check your EB bill — look for "units consumed"
            </div>
          </div>
        </div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20 hover:border-white/10 transition-colors cursor-pointer"
          onClick={() => updateData('hasSolar', !data.hasSolar)}
        >
          <div className="flex gap-4 items-center">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20"><Sun size={18} /></div>
            <div>
              <div className="font-medium text-foreground">I have solar panels</div>
              <div className="text-xs text-muted-foreground mt-1">Calculate your offset and net consumption</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
            <input type="checkbox" className="sr-only peer" checked={data.hasSolar} readOnly />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green shadow-inner"></div>
          </label>
        </motion.div>

        <AnimatePresence>
          {data.hasSolar && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Panel capacity</label>
                  <div className="relative">
                    <input type="number" min="0" placeholder="e.g. 3" value={data.solarKw} onChange={e => updateData('solarKw', e.target.value)} className="w-full bg-background border border-white/10 rounded-lg pl-4 pr-16 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-sm" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">kWp</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Sunshine hours</label>
                  <div className="relative">
                    <input type="number" min="0" step="0.5" placeholder="5.5" value={data.solarHours} onChange={e => updateData('solarHours', e.target.value)} className="w-full bg-background border border-white/10 rounded-lg pl-4 pr-20 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-sm" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">hrs/day</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div variants={itemVariants} className="flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500"><Flame size={20} /></span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cooking Fuel</h3>
          </div>
          <div className="p-5 rounded-xl border border-white/5 bg-black/20 flex-1">
            <label className="block text-sm font-medium text-foreground mb-3">LPG cylinders used per month</label>
            <div className="relative mb-3">
              <input type="number" min="0" step="0.1" placeholder="e.g. 0.5" value={data.lpgCylinders} onChange={e => updateData('lpgCylinders', e.target.value)} className="w-full bg-background border border-white/10 rounded-lg pl-4 pr-20 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">cyl/mo</span>
            </div>
            <p className="text-xs text-muted-foreground">One 14.2 kg cylinder ≈ 42 kg CO₂e</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500"><Home size={20} /></span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Home Setup</h3>
          </div>
          <div className="space-y-3">
            {[
              { id: 'acToggle', title: 'Air conditioning', desc: '5+ hours daily in summer' },
              { id: 'dryerToggle', title: 'Clothes dryer', desc: 'As opposed to line-drying' },
              { id: 'ledToggle', title: 'LED lighting', desc: 'Throughout the entire home' }
            ].map(item => (
              <motion.div 
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                key={item.id} 
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-black/20 cursor-pointer hover:border-white/10 transition-colors"
                onClick={() => updateData(item.id, !data[item.id])}
              >
                <div>
                  <div className="text-sm font-medium text-foreground">{item.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</div>
                </div>
                <label className="relative inline-flex items-center pointer-events-none">
                  <input type="checkbox" className="sr-only peer" checked={data[item.id]} readOnly />
                  <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-green shadow-inner"></div>
                </label>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="pt-6 mt-auto border-t border-white/5 flex items-center justify-between sticky bottom-0 bg-card/90 backdrop-blur-md pb-2 z-20">
        <button onClick={goBack} className="flex items-center gap-2 text-muted-foreground text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/5 transition-colors focus-visible:outline-none">
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={goNext} className="btn-magic group">
          <span className="btn-magic-glow"></span>
          <span className="btn-magic-inner gap-2 px-6">
            Continue <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default EnergyScreen;
