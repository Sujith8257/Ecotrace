import React from 'react';
import { ArrowLeft, ArrowRight, Car, Bike, Train, Bus, Plane } from 'lucide-react';
import { motion } from 'framer-motion';

const modes = [
  { id: 'scooter', name: 'Scooter / Petrol', icon: <Bike size={24} />, label: 'km per week', unit: '~0.035 kg CO₂/km', ph: 'e.g. 80' },
  { id: 'bicycle', name: 'Bicycle', icon: <Bike size={24} />, label: 'km per week', unit: 'Zero direct emissions', ph: 'e.g. 30' },
  { id: 'carPetrol', name: 'Car (Petrol)', icon: <Car size={24} />, label: 'km per week', unit: '~0.17 kg CO₂/km', ph: 'e.g. 100' },
  { id: 'carEv', name: 'Car (Electric)', icon: <Car size={24} />, label: 'km per week', unit: '~0.05 kg CO₂/km', ph: 'e.g. 100' },
  { id: 'truck', name: 'Truck / Van', icon: <Car size={24} />, label: 'km per week', unit: '~0.25 kg CO₂/km', ph: 'e.g. 150' },
  { id: 'bus', name: 'Bus', icon: <Bus size={24} />, label: 'km per week', unit: '~0.089 kg CO₂/km', ph: 'e.g. 60' },
  { id: 'metro', name: 'Metro / Subway', icon: <Train size={24} />, label: 'km per week', unit: '~0.028 kg CO₂/km', ph: 'e.g. 50' },
  { id: 'railway', name: 'Train / Railway', icon: <Train size={24} />, label: 'km per week', unit: '~0.041 kg CO₂/km', ph: 'e.g. 200' },
  { id: 'flightShort', name: 'Short Haul (<3h)', icon: <Plane size={24} />, label: 'flights per year', unit: '~0.255 kg CO₂/km avg', ph: 'e.g. 4' },
  { id: 'flightLong', name: 'Long Haul (>6h)', icon: <Plane size={24} />, label: 'flights per year', unit: '~0.195 kg CO₂/km avg', ph: 'e.g. 1' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const TransportScreen = ({ data, updateData, goBack, goNext }) => {
  const toggleMode = (id) => {
    if (data[id] !== '') updateData(id, ''); 
    else updateData(id, '0');
  };

  const isActive = (id) => data[id] !== '';

  const renderSection = (title, icon, modeIds) => (
    <motion.div variants={itemVariants} className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-xl">{icon}</span>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {modeIds.map(id => {
          const m = modes.find(x => x.id === id);
          const active = isActive(id);
          return (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={id} 
              className={`relative overflow-hidden rounded-xl border transition-colors duration-300 cursor-pointer p-4 flex flex-col ${active ? 'bg-brand-green/10 border-brand-green shadow-[0_0_15px_rgba(74,222,128,0.15)]' : 'bg-black/20 border-white/5 hover:border-white/20'}`} 
              onClick={() => toggleMode(id)}
            >
              {active && <motion.div layoutId={`activeIndicator-${id}`} className="absolute top-0 left-0 w-1 h-full bg-brand-green"></motion.div>}
              <div className="flex items-center justify-between mb-3">
                <span className={active ? 'text-brand-green' : 'text-muted-foreground'}>{m.icon}</span>
                <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors ${active ? 'border-brand-green bg-brand-green text-black' : 'border-white/20 bg-transparent'}`}>
                  {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
              </div>
              <div className="text-sm font-medium text-foreground">{m.name}</div>
              
              <div className={`mt-4 flex flex-col gap-2 transition-all duration-300 origin-top ${active ? 'opacity-100 h-auto scale-y-100' : 'opacity-0 h-0 scale-y-0 overflow-hidden'}`} onClick={e => e.stopPropagation()}>
                <label className="text-xs text-muted-foreground">{m.label}</label>
                <input 
                  type="number" 
                  min="0" 
                  placeholder={m.ph} 
                  value={data[id] === '0' ? '' : data[id]} 
                  onChange={e => updateData(id, e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green transition-all"
                />
                <div className="text-[10px] text-muted-foreground/80">{m.unit}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

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
          <span>Step 2 of 5</span>
          <span>Transport</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: "20%" }}
            animate={{ width: "40%" }}
            transition={{ duration: 1 }}
            className="h-full bg-brand-green rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"
          ></motion.div>
        </div>
      </div>

      <motion.div variants={itemVariants} className="mb-10">
        <h2 className="text-[32px] sm:text-[40px] font-bold text-foreground leading-[1.1] mb-4 tracking-tight text-shadow-glow">How do you get around?</h2>
        <p className="text-muted-foreground text-[16px] leading-relaxed">Select all transport modes you use regularly. Enter weekly distance for each.</p>
      </motion.div>

      {renderSection('Personal Vehicles', '🚗', ['scooter', 'bicycle', 'carPetrol', 'carEv', 'truck'])}
      {renderSection('Public & Shared Transport', '🚌', ['bus', 'metro', 'railway'])}
      {renderSection('Air Travel (Per Year)', '✈️', ['flightShort', 'flightLong'])}

      <motion.div variants={itemVariants} className="pt-6 mt-8 border-t border-white/5 flex items-center justify-between sticky bottom-0 bg-card/90 backdrop-blur-md pb-2 z-20">
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

export default TransportScreen;
