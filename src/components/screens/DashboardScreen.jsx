import { useState, useEffect, useRef } from 'react';
import { Leaf, ArrowRight, RefreshCw, Car, Zap, Salad, Trash2, Info, User, Check, Sparkles, MessageCircle, AlertTriangle, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateFootprintWithAI } from '../../services/aiService';
import CalculationJourney from '../CalculationJourney';
import { signInWithGoogle, subscribeToAuth } from '../../services/firebase';
import { isSupabaseConfigured, saveFootprintEstimate } from '../../services/supabase';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const MONTHLY_TARGET_KG = 2000 / 12;

const getHealthScore = (totalNum) => {
  return totalNum <= MONTHLY_TARGET_KG
    ? 100
    : Math.max(0, Math.min(100, Math.round((MONTHLY_TARGET_KG / totalNum) * 100)));
};

const getScoreBand = (healthScore) => {
  return healthScore >= 80 ? 'near target' : healthScore >= 50 ? 'moderate impact' : 'high impact';
};

const DashboardScreen = ({ data, goHome, recalculate }) => {
  const [selectedActions, setSelectedActions] = useState([]);
  const [footprintData, setFootprintData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [saveState, setSaveState] = useState('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [autoSavedKey, setAutoSavedKey] = useState('');
  const autoSavingKeyRef = useRef('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await calculateFootprintWithAI(data);
        setFootprintData(result);
      } catch (err) {
        console.error("Footprint calculation failed:", err);
        setError(err.message || "An error occurred while calculating your footprint.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [data]);

  useEffect(() => {
    return subscribeToAuth(setUser);
  }, []);

  useEffect(() => {
    if (!user || !footprintData || !isSupabaseConfigured) return;

    const totalNum = Number.parseFloat(footprintData.total);
    const key = `${user.uid}:${footprintData.total}:${JSON.stringify(footprintData.breakdown)}`;
    if (autoSavedKey === key || autoSavingKeyRef.current === key) return;
    autoSavingKeyRef.current = key;

    saveFootprintEstimate({
      firebaseUser: user,
      answers: data,
      result: {
        ...footprintData,
        healthScore: getHealthScore(totalNum),
        scoreBand: getScoreBand(getHealthScore(totalNum)),
      },
      selectedActions: [],
    })
      .then(() => {
        setAutoSavedKey(key);
        setSaveState('saved');
        setSaveMessage('Estimate saved to Supabase.');
      })
      .catch((err) => {
        console.error('Auto-saving estimate failed:', err);
        autoSavingKeyRef.current = '';
        setSaveState('error');
        setSaveMessage('Could not auto-save estimate. Check the Supabase function deployment.');
      });
  }, [autoSavedKey, data, footprintData, user]);

  const toggleAction = (id) => {
    if (selectedActions.includes(id)) {
      setSelectedActions(selectedActions.filter(a => a !== id));
    } else {
      setSelectedActions([...selectedActions, id]);
    }
  };

  const handleSaveEstimate = async () => {
    setSaveMessage('');

    if (!user) {
      try {
        await signInWithGoogle();
      } catch (err) {
        console.error('Google sign-in failed:', err);
        setSaveMessage('Sign in was cancelled.');
      }
      return;
    }

    if (!isSupabaseConfigured) {
      setSaveMessage('Add Supabase env vars to enable saving.');
      return;
    }

    try {
      setSaveState('saving');
      await saveFootprintEstimate({
        firebaseUser: user,
        answers: data,
        result: {
          ...footprintData,
          healthScore,
          scoreBand,
        },
        selectedActions,
      });
      setSaveState('saved');
      setSaveMessage('Estimate saved to Supabase.');
    } catch (err) {
      console.error('Saving estimate failed:', err);
      setSaveState('error');
      setSaveMessage('Could not save estimate. Check Supabase tables and policies.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <CalculationJourney subtitle="Applying transparent emission factors to your habits." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertTriangle size={48} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-4">Calculation Failed</h2>
        <p className="text-muted-foreground mb-8 max-w-md">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-magic group">
          <span className="btn-magic-glow"></span>
          <span className="btn-magic-inner gap-2 px-6">
            <RefreshCw size={16} /> Try Again
          </span>
        </button>
      </div>
    );
  }

  if (!footprintData) return null;

  const totalSavings = footprintData.actions
    .filter(a => selectedActions.includes(a.id))
    .reduce((sum, a) => sum + parseFloat(a.savings), 0);

  const totalNum = parseFloat(footprintData.total);
  const futureTotal = Math.max(0, totalNum - totalSavings).toFixed(2);
  const healthScore = getHealthScore(totalNum);
  const scoreBand = getScoreBand(healthScore);
  const selectedReductionPercent = totalNum > 0 ? (totalSavings / totalNum * 100).toFixed(1) : '0.0';
  const getCategoryPercent = (value) => totalNum > 0 ? Math.min(100, (value / totalNum) * 100) : 0;
  const categoryRows = [
    { name: 'Transport', icon: <Car size={16}/>, val: parseFloat(footprintData.breakdown.transport), color: 'bg-brand-green', accent: 'text-brand-green', bg: 'bg-brand-green/10', border: 'border-brand-green/20' },
    { name: 'Electricity', icon: <Zap size={16}/>, val: parseFloat(footprintData.breakdown.energy), color: 'bg-emerald-400', accent: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { name: 'Food', icon: <Salad size={16}/>, val: parseFloat(footprintData.breakdown.food), color: 'bg-brand-green', accent: 'text-brand-green', bg: 'bg-brand-green/10', border: 'border-brand-green/20' },
    { name: 'Waste', icon: <Trash2 size={16}/>, val: parseFloat(footprintData.breakdown.waste), color: 'bg-lime-500', accent: 'text-lime-600', bg: 'bg-lime-500/10', border: 'border-lime-500/20' }
  ];

  return (
    <div className="w-full px-4 sm:px-6 xl:px-10 2xl:px-12 py-8 xl:py-10 relative">
      
      {/* Top Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green mb-2">Your Monthly Baseline</div>
          <h1 className="text-4xl sm:text-5xl 2xl:text-6xl font-bold text-foreground tracking-tight text-shadow-glow">Here's where you stand.</h1>
        </div>
        <div className="max-w-xl text-sm text-muted-foreground leading-relaxed xl:text-right">
          Calculated with transparent emission factors. Treat this as a useful direction, not an exact inventory.
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
      >
        {categoryRows.map((cat) => (
          <motion.div key={cat.name} variants={itemVariants} className={`rounded-[24px] border ${cat.border} ${cat.bg} p-5 backdrop-blur-xl`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.04em] text-muted-foreground mb-2">{cat.name}</div>
                <div className="text-3xl font-extrabold text-foreground">{cat.val.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground mt-1">kg CO2e / month</div>
              </div>
              <div className={`h-11 w-11 rounded-full ${cat.bg} ${cat.accent} border ${cat.border} flex items-center justify-center`}>
                {cat.icon}
              </div>
            </div>
            <div className="mt-5 h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getCategoryPercent(cat.val)}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full ${cat.color} rounded-full`}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-12 gap-8"
      >
        {/* ================= LEFT COLUMN ================= */}
        <div className="col-span-1 xl:col-span-8 grid grid-cols-1 2xl:grid-cols-2 gap-8">
          
          {/* Hero Score Card */}
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[24px] p-8 sm:p-10 shadow-lg bg-white border border-border min-h-[360px] flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 to-transparent opacity-70"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-green/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-sm text-brand-green font-medium mb-4">
                <Leaf size={16} /> Estimated monthly footprint
              </div>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-[64px] sm:text-[80px] font-bold text-foreground leading-none tracking-tighter drop-shadow-lg">
                  {footprintData.total}
                </span>
                <span className="text-lg font-medium text-muted-foreground">kg CO2e</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm font-medium">
                <Sparkles size={16} className="text-amber-400" /> Biggest contributor: <span className="text-foreground capitalize">{footprintData.biggest}</span>
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-8">
              <div className="rounded-[24px] bg-white/80 border border-border p-4">
                <div className="text-2xl font-bold text-foreground">{futureTotal}</div>
                <div className="text-[10px] uppercase tracking-[0.04em] text-muted-foreground mt-1">future kg if selected</div>
              </div>
              <div className="rounded-[24px] bg-brand-green/10 border border-brand-green/20 p-4">
                <div className="text-2xl font-bold text-brand-green">-{totalSavings.toFixed(1)}</div>
                <div className="text-[10px] uppercase tracking-[0.04em] text-muted-foreground mt-1">selected savings</div>
              </div>
            </div>
          </motion.div>

          {/* Breakdown Card */}
          <motion.div variants={itemVariants} className="bg-white/85 backdrop-blur-xl border border-border rounded-[24px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 cursor-pointer group">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Your Breakdown</div>
                <h3 className="text-xl font-bold text-foreground">What shapes your total</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-accent group-hover:text-foreground transition-colors">
                <ArrowRight size={16} />
              </div>
            </div>

            <div className="space-y-6">
              {categoryRows.map((cat, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                      <span className={cat.accent}>{cat.icon}</span> {cat.name}
                    </div>
                    <div className="font-semibold text-foreground/90">{cat.val.toFixed(1)} <span className="text-xs text-muted-foreground font-normal">kg</span></div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${getCategoryPercent(cat.val)}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className={`h-full ${cat.color} rounded-full`}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Plan Card */}
          <motion.div variants={itemVariants} className="2xl:col-span-2 bg-white/85 backdrop-blur-xl border border-border rounded-[24px] p-8 shadow-sm">
            <div className="mb-8">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Climate Action Plan</div>
              <h3 className="text-xl font-bold text-foreground">Tailored recommendations</h3>
            </div>

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
              {footprintData.actions.map(action => {
                const isSelected = selectedActions.includes(action.id);
                return (
                  <div 
                    key={action.id}
                    onClick={() => toggleAction(action.id)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer flex gap-4 ${isSelected ? 'bg-brand-green/5 border-brand-green shadow-[0_0_15px_rgba(31,157,85,0.1)]' : 'bg-white/80 border-border hover:border-brand-green/30'}`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-brand-green border-brand-green text-white' : 'border-border bg-white'}`}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-brand-green' : 'text-muted-foreground'}`}>{action.category}</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${isSelected ? 'bg-brand-green/20 text-brand-green' : 'bg-secondary text-muted-foreground'}`}>{action.difficulty}</span>
                        </div>
                        <div className={`text-[11px] font-bold px-2 py-1 rounded-full ${isSelected ? 'bg-brand-green/20 text-brand-green' : 'bg-secondary text-muted-foreground'}`}>
                          -{action.savings} kg/mo
                        </div>
                      </div>
                      <h4 className={`text-base font-bold mb-1 ${isSelected ? 'text-brand-green' : 'text-foreground'}`}>{action.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{action.desc}</p>
                      
                      <div className={`p-3 rounded-lg text-xs leading-relaxed transition-colors ${isSelected ? 'bg-brand-green/10 text-brand-green/90' : 'bg-secondary text-muted-foreground'}`}>
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
          <motion.div variants={itemVariants} className="2xl:col-span-2 bg-white/85 backdrop-blur-xl border border-border rounded-[24px] p-8 shadow-sm">
            <div className="mb-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">What to know</div>
              <h3 className="text-xl font-bold text-foreground">This estimate stays honest.</h3>
            </div>
            <div className="space-y-3">
              {[
                "All results are calculated locally from transparent monthly emission factors.",
                "Transport factors are representative passenger-mode values and do not model exact vehicle occupancy details.",
                "Food and waste values are coarse behavioral proxies for relative coaching."
              ].map((text, i) => (
                <div key={i} className="flex gap-3 p-3 bg-secondary rounded-lg border border-border text-sm text-muted-foreground/90">
                  <Info size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="col-span-1 xl:col-span-4 flex flex-col gap-8 xl:sticky xl:top-28 self-start">
          
          {/* Health Score Card */}
          <motion.div variants={itemVariants} className="bg-white/85 backdrop-blur-xl border border-border rounded-[24px] p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Carbon Health Score</div>
              <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green border border-brand-green/30">
                <Leaf size={18} />
              </div>
            </div>
            <div className="text-[48px] font-bold text-foreground leading-none mb-4">{healthScore}</div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${healthScore}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-brand-green to-emerald-400 rounded-full"
              ></motion.div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your score is <span className="font-semibold text-foreground">{scoreBand}</span>. It compares your estimate with a 2 tCO2e annual lifestyle target.
            </p>
          </motion.div>

          {/* Compare Card */}
          <motion.div variants={itemVariants} className="bg-white/85 backdrop-blur-xl border border-border rounded-[24px] p-6 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Compare & Save</div>
            <h3 className="text-lg font-bold text-foreground mb-3">Where do you rank?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Firebase handles Google sign-in. Supabase stores your saved footprint estimates.
            </p>
            <button
              onClick={handleSaveEstimate}
              disabled={saveState === 'saving'}
              className="w-full py-3 rounded-xl bg-secondary border border-border hover:border-brand-green/30 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-foreground"
            >
              {user ? <Save size={16} /> : <User size={16} />}
              {saveState === 'saving' ? 'Saving...' : user ? 'Save estimate' : 'Sign in to save'}
            </button>
            {saveMessage && (
              <p className={`mt-3 text-xs ${saveState === 'error' ? 'text-red-500' : 'text-muted-foreground'}`}>
                {saveMessage}
              </p>
            )}
          </motion.div>

          {/* Impact Calculator Card (Interactive) */}
          <motion.div variants={itemVariants} className="bg-white/85 backdrop-blur-xl border border-brand-green/20 rounded-[24px] p-6 relative overflow-hidden shadow-sm">
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
                <div className="flex-1 bg-white border border-border rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="text-2xl font-bold text-foreground mb-1">{futureTotal}</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Future (kg CO2e)</div>
                </div>
                <div className="flex-1 bg-brand-green/10 border border-brand-green/20 rounded-xl p-4 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                  <div className="text-2xl font-bold text-brand-green mb-1">-{totalSavings.toFixed(1)}</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-brand-green">Monthly Savings</div>
                </div>
              </div>

              <div className="bg-secondary rounded-lg p-3 text-[10px] text-muted-foreground leading-relaxed">
                If you complete all selected recommendations, you will reduce your footprint by <span className="font-bold text-foreground">{selectedReductionPercent}%</span>.
              </div>
            </div>
          </motion.div>

          {/* Every Step Counts */}
          <motion.div variants={itemVariants} className="bg-white/85 backdrop-blur-xl border border-border rounded-[24px] p-8 flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center mb-6">
              <Leaf size={24} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">Every Step Counts</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Reducing your emissions isn't about perfection. It's about small, consistent adjustments to your everyday routine.
            </p>
            <button className="px-5 py-2 rounded-full bg-secondary text-foreground border border-border hover:bg-accent text-xs font-bold uppercase tracking-wider transition-colors">
              Climate Action Mode
            </button>
          </motion.div>

        </div>
      </motion.div>

      {/* Recalculate Top Bar / Bottom buttons */}
      <div className="flex flex-wrap justify-center gap-3 mt-12 mb-8">
        <button onClick={goHome} className="flex items-center gap-2 text-muted-foreground text-sm font-semibold px-4 py-2 rounded-full hover:bg-secondary hover:text-foreground transition-colors focus-visible:outline-none">
          <ArrowRight size={16} className="rotate-180" /> Home
        </button>
        <button onClick={recalculate} className="flex items-center gap-2 text-muted-foreground text-sm font-semibold px-4 py-2 rounded-full hover:bg-secondary hover:text-foreground transition-colors focus-visible:outline-none">
          <RefreshCw size={16} /> Update my answers
        </button>
      </div>

      {/* Sticky Coach Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-brand-green hover:bg-brand-green/90 text-white font-bold shadow-[0_0_20px_rgba(31,157,85,0.28)] transition-transform hover:scale-105 active:scale-95">
          <MessageCircle size={18} /> Chat with Trace
        </button>
      </div>

    </div>
  );
};

export default DashboardScreen;
