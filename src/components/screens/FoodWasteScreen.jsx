import { ArrowLeft, ArrowRight, Salad, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const dietOptions = [
  { id: 'vegan', name: 'Vegan', desc: 'No animal products', ef: 0.7 },
  { id: 'plant-based', name: 'Plant-based', desc: 'Mostly plants, rare exceptions', ef: 1.0 },
  { id: 'vegetarian', name: 'Vegetarian', desc: 'No meat, yes dairy/eggs', ef: 1.3 },
  { id: 'no-meat-fish', name: 'No red meat/fish', desc: 'Poultry only', ef: 1.5 },
  { id: 'mixed', name: 'Mixed', desc: 'A bit of everything', ef: 2.0 },
  { id: 'meat-heavy', name: 'Meat most days', desc: 'Red meat regularly', ef: 3.3 },
];

const wasteOptions = [
  { id: 'low', name: 'Low', desc: 'Reuse, sort, compost', ef: 0.1 },
  { id: 'average', name: 'Average', desc: 'Some sorting & reuse', ef: 0.5 },
  { id: 'high', name: 'High', desc: 'Frequent disposables', ef: 1.2 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const FoodWasteScreen = ({ data, updateData, goBack, calculate }) => {
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
          <span>Step 4 of 5</span>
          <span>Food & Waste</span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: "60%" }}
            animate={{ width: "80%" }}
            transition={{ duration: 1 }}
            className="h-full bg-brand-green rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"
          ></motion.div>
        </div>
      </div>

      <motion.div variants={itemVariants} className="mb-10">
        <h2 className="text-[32px] sm:text-[40px] font-bold text-foreground leading-[1.1] mb-4 tracking-tight text-shadow-glow">Food & waste habits</h2>
        <p className="text-muted-foreground text-[16px] leading-relaxed">These use broad behaviour bands. Your result will show the range and assumptions.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 text-brand-green"><Salad size={20} /></span>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Diet</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Which best matches what you eat most days?</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {dietOptions.map(opt => {
            const active = data.diet === opt.id;
            return (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={opt.id} 
                className={`p-4 rounded-xl border cursor-pointer transition-colors duration-200 ${active ? 'bg-brand-green/10 border-brand-green shadow-[0_0_10px_rgba(31,157,85,0.15)]' : 'bg-white/80 border-border hover:border-brand-green/40'}`}
                onClick={() => updateData('diet', opt.id)}
              >
                <div className={`font-medium text-sm ${active ? 'text-brand-green' : 'text-foreground/90'}`}>{opt.name}</div>
                <div className={`text-xs mt-1 ${active ? 'text-brand-green/80' : 'text-muted-foreground'}`}>{opt.desc}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div variants={itemVariants} className="flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400"><Trash2 size={20} /></span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Household Waste</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">How would you describe your waste habits?</p>
          
          <div className="flex flex-col gap-3 flex-1">
            {wasteOptions.map(opt => {
              const active = data.waste === opt.id;
              return (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={opt.id} 
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors duration-200 ${active ? 'bg-brand-green/10 border-brand-green shadow-[0_0_10px_rgba(31,157,85,0.15)]' : 'bg-white/80 border-border hover:border-brand-green/40'}`}
                  onClick={() => updateData('waste', opt.id)}
                >
                  <div>
                    <div className={`font-medium text-sm ${active ? 'text-brand-green' : 'text-foreground/90'}`}>{opt.name}</div>
                    <div className={`text-[11px] mt-0.5 ${active ? 'text-brand-green/80' : 'text-muted-foreground'}`}>{opt.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${active ? 'border-brand-green bg-brand-green' : 'border-border bg-white'}`}>
                    {active && <motion.div layoutId="wasteActive" className="w-2 h-2 bg-white rounded-full"></motion.div>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-300"><ShoppingBag size={20} /></span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Shopping</h3>
          </div>
          
          <div className="mb-4 p-5 rounded-xl border border-border bg-white/85 shadow-sm">
            <label className="block text-sm font-medium text-foreground mb-3">Monthly spend on new clothing & electronics</label>
            <div className="relative mb-2">
              <input type="number" min="0" placeholder="e.g. 2000" value={data.shoppingSpend} onChange={e => updateData('shoppingSpend', e.target.value)} className="w-full bg-white border border-border rounded-lg pl-4 pr-16 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green transition-all shadow-sm" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">₹/mo</span>
            </div>
            <p className="text-[11px] text-muted-foreground">approx ₹1000/mo → ~0.04 tCO₂e/yr from manufacturing</p>
          </div>

          <motion.div 
            whileHover={{ backgroundColor: "rgba(237, 248, 238, 0.9)" }}
            className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-white/85 cursor-pointer hover:border-brand-green/30 transition-colors shadow-sm"
            onClick={() => updateData('secondhandToggle', !data.secondhandToggle)}
          >
            <div>
              <div className="text-sm font-medium text-foreground">Buy second-hand / refurbished</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Reduces shopping footprint by ~40%</div>
            </div>
            <label className="relative inline-flex items-center pointer-events-none">
              <input type="checkbox" className="sr-only peer" checked={data.secondhandToggle} readOnly />
              <div className="w-9 h-5 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-green shadow-inner"></div>
            </label>
          </motion.div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="pt-6 mt-auto border-t border-border flex items-center justify-between sticky bottom-0 bg-card/90 backdrop-blur-md pb-2 z-20">
        <button onClick={goBack} className="flex items-center gap-2 text-muted-foreground text-sm font-semibold px-4 py-2 rounded-full hover:bg-secondary transition-colors focus-visible:outline-none">
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={calculate} className="btn-magic group">
          <span className="btn-magic-glow"></span>
          <span className="btn-magic-inner gap-2 px-6">
            Continue <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default FoodWasteScreen;
