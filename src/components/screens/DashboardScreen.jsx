import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ArrowLeft, RotateCcw, AlertTriangle, Lightbulb, Sun, ShieldCheck, Flame, Leaf, Trash2, ShoppingBag, Map } from 'lucide-react';

const DashboardScreen = ({ data, recalculate }) => {

  const results = useMemo(() => {
    // 1. Transport
    let transport = 0;
    const tData = data.transport;
    const tModes = {
      scooter: 0.035, bicycle: 0, carPetrol: 0.17, carEv: 0.05, truck: 0.25, 
      bus: 0.089, metro: 0.028, railway: 0.041, flightShort: 0.255, flightLong: 0.195
    };
    
    Object.keys(tModes).forEach(mode => {
      let val = parseFloat(tData[mode]) || 0;
      let ef = tModes[mode];
      let annual = 0;
      if (mode.startsWith('flightShort')) annual = val * 1200 * ef; // flights × avg 1200km
      else if (mode.startsWith('flightLong')) annual = val * 8000 * ef; // flights × avg 8000km
      else annual = val * 52 * ef / 1000; // weekly km × 52 weeks × ef / 1000 = tonnes
      transport += annual;
    });

    // 2. Energy
    const eData = data.energy;
    const elecKwh = parseFloat(eData.elecKwh) || 200;
    const elecEF = 0.82; // India grid avg kg CO2/kWh
    let elecGross = elecKwh * 12 * elecEF / 1000;
    
    let solarGen = 0;
    if (eData.hasSolar) {
      const solarKw = parseFloat(eData.solarKw) || 3;
      const sunHrs = parseFloat(eData.solarHours) || 5.5;
      solarGen = solarKw * sunHrs * 365 * 0.8 * elecEF / 1000;
    }
    const netElec = Math.max(0, elecGross - solarGen);
    
    const lpg = parseFloat(eData.lpgCylinders) || 0.5;
    const lpgCo2 = lpg * 12 * 42 / 1000;
    
    const acExtra = eData.acToggle ? 0.15 : 0;
    const dryerExtra = eData.dryerToggle ? 0.08 : 0;
    const ledSaving = eData.ledToggle ? -0.04 : 0;
    
    const energy = netElec + lpgCo2 + acExtra + dryerExtra + ledSaving;

    // 3. Food & Waste
    const fwData = data.foodWaste;
    const dietEFMap = { 'vegan': 0.7, 'plant-based': 1.0, 'vegetarian': 1.3, 'no-meat-fish': 1.5, 'mixed': 2.0, 'meat-heavy': 3.3 };
    const wasteEFMap = { 'low': 0.1, 'average': 0.5, 'high': 1.2 };
    
    const food = dietEFMap[fwData.diet] || 2.0;
    const waste = wasteEFMap[fwData.waste] || 0.5;
    
    let spend = parseFloat(fwData.shoppingSpend) || 2000;
    let shopping = spend * 12 * 0.000048;
    if (fwData.secondhandToggle) shopping *= 0.6;

    const total = transport + energy + food + waste + shopping;

    return { transport, energy, food, waste, shopping, total, elecGross, solarGen, netElec, hasSolar: eData.hasSolar };
  }, [data]);

  const { total, transport, energy, food, waste, shopping } = results;
  const annual = parseFloat(total.toFixed(2));
  const indiaAvg = 4.7, parisTarget = 2.0;
  
  const score = Math.max(0, Math.min(100, Math.round(100 - (annual - parisTarget) / (indiaAvg * 3 - parisTarget) * 100)));
  
  let color, rating, detail;
  if (annual <= 2.0) { color = 'var(--green)'; rating = 'exceptional 🌱'; detail = 'You\'re at or below the Paris 2°C target. You\'re in the top tier globally.'; }
  else if (annual <= 3.5) { color = '#86efac'; rating = 'below average 👍'; detail = 'Your footprint is well below the Indian average. A few more changes and you\'ll be near the Paris target.'; }
  else if (annual <= 4.7) { color = 'var(--amber)'; rating = 'near average ⚡'; detail = `You're close to the average Indian, but still ${(annual/parisTarget).toFixed(1)}× the Paris target. There's solid room to improve.`; }
  else if (annual <= 7.0) { color = '#fb923c'; rating = 'above average ⚠️'; detail = 'Your footprint exceeds the Indian average. Targeted changes to your top categories can make a big dent.'; }
  else { color = 'var(--red)'; rating = 'high impact 🔴'; detail = 'Your footprint is above the global average. Small consistent changes across transport, energy, and diet will have a major effect.'; }

  const ringData = {
    datasets: [{
      data: [score, 100 - score],
      backgroundColor: [color, 'rgba(255,255,255,0.05)'],
      borderWidth: 0,
      circumference: 280,
      rotation: -140
    }]
  };

  const donutData = {
    labels: ['Transport', 'Energy', 'Food', 'Waste', 'Shopping'],
    datasets: [{
      data: [transport, energy, food, waste, shopping].map(v => parseFloat(v.toFixed(3))),
      backgroundColor: ['var(--red)', 'var(--amber)', 'var(--green)', 'var(--blue)', 'var(--purple)'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // Find biggest opportunity
  const cats = [
    { id: 'transport', val: transport },
    { id: 'energy', val: energy },
    { id: 'food', val: food },
    { id: 'waste', val: waste },
    { id: 'shopping', val: shopping }
  ].sort((a, b) => b.val - a.val);
  const topCat = cats[0].id;
  
  const insightMap = {
    transport: 'Transport is your single biggest emitter. Switching 2 days/week to public transit or cycling for short trips could save 0.3–0.8 tCO₂e per year.',
    energy: 'Home energy is your biggest category. Raising your AC setpoint by 2°C, switching to LED, and checking for phantom loads could cut this by 15–25%.',
    food: 'Diet is your largest source. Even one meat-free day per week saves ~0.1–0.2 tCO₂e annually — and red meat substitution has the biggest impact.',
    waste: 'Household waste adds up. Composting food scraps and sorting recyclables consistently could reduce this by up to 60%.',
    shopping: 'Your consumption footprint is your biggest. Buying second-hand or refurbished and extending product lifetimes are the two highest-impact moves.'
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.02em' }}>your carbon footprint</h2>
          <div style={{ fontSize: '14px', color: 'var(--text2)', marginTop: '4px' }}>calculated just now</div>
        </div>
        <button className="btn-secondary" onClick={recalculate} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RotateCcw size={16} /> recalculate
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
          <Doughnut data={ringData} options={{ responsive: true, maintainAspectRatio: false, cutout: '80%', plugins: { tooltip: { enabled: false } } }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="font-mono" style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1, color }}>{score}</div>
            <div style={{ fontSize: '11px', color: 'var(--text2)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>eco score</div>
          </div>
        </div>
        
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '8px' }}>{rating}</div>
          <div style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.6 }}>{detail}</div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            {results.hasSolar && <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: 'var(--amber-dim)', color: 'var(--amber)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}><Sun size={14} /> solar powered</span>}
            {transport < 0.5 && <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: 'var(--green-dim2)', color: 'var(--green)', border: '1px solid rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}><Map size={14} /> low transport</span>}
            {food <= 1.3 && <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: 'var(--green-dim2)', color: 'var(--green)', border: '1px solid rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}><Leaf size={14} /> plant-forward</span>}
            {waste <= 0.1 && <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: 'var(--blue-dim)', color: 'var(--blue)', border: '1px solid rgba(96,165,250,0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} /> low waste</span>}
          </div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { icon: <Flame size={20} color="var(--red)" />, val: annual.toFixed(1), unit: 't', name: 'tCO₂e / year' },
          { icon: <Map size={20} color="var(--blue)" />, val: (annual/12).toFixed(2), unit: 't', name: 'tCO₂e / month' },
          { icon: <AlertTriangle size={20} color="var(--amber)" />, val: Math.abs(Math.round((annual/4.7-1)*100)), unit: '%', name: 'vs india avg (4.7t)', sub: annual < 4.7 ? <span style={{color:'var(--green)', fontSize:'12px'}}>↓ below average</span> : <span style={{color:'var(--red)', fontSize:'12px'}}>↑ above average</span> },
          { icon: <ShieldCheck size={20} color="var(--green)" />, val: (annual/2.0).toFixed(1), unit: '×', name: 'vs paris target (2t)' }
        ].map((m, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ marginBottom: '12px' }}>{m.icon}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="font-mono" style={{ fontSize: '28px', fontWeight: 700 }}>{m.val}</span>
              <span style={{ fontSize: '14px', color: 'var(--text3)' }}>{m.unit}</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '4px' }}>{m.name}</div>
            {m.sub && <div style={{ marginTop: '8px' }}>{m.sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--green-dim2)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '16px' }}>
        <Lightbulb size={24} color="var(--green)" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--green)', marginBottom: '6px' }}>biggest opportunity</div>
          <div style={{ fontSize: '14px', color: 'rgba(74,222,128,0.9)', lineHeight: 1.6 }}>{insightMap[topCat]}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.5rem' }}>emissions breakdown</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { name: 'transport', val: transport, color: 'var(--red)' },
              { name: 'energy', val: energy, color: 'var(--amber)' },
              { name: 'food', val: food, color: 'var(--green)' },
              { name: 'waste', val: waste, color: 'var(--blue)' },
              { name: 'shopping', val: shopping, color: 'var(--purple)' }
            ].map(c => {
              const max = Math.max(...cats.map(x => x.val), 0.1);
              return (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '13px', width: '80px', flexShrink: 0 }}>{c.name}</div>
                  <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round((c.val/max)*100)}%`, background: c.color, borderRadius: '4px', transition: 'width 1s ease-out' }}></div>
                  </div>
                  <div className="font-mono" style={{ fontSize: '12px', width: '50px', textAlign: 'right', color: 'var(--text2)' }}>{c.val.toFixed(2)}t</div>
                </div>
              );
            })}
          </div>

          <div style={{ height: '220px', marginTop: '2rem', position: 'relative' }}>
            <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false } } }} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.5rem' }}>you vs benchmarks</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { name: 'you', val: annual, color: 'var(--green)' },
              { name: 'india avg', val: 4.7, color: 'var(--amber)' },
              { name: 'global avg', val: 7.0, color: 'var(--red)' },
              { name: 'paris target', val: 2.0, color: 'var(--blue)' },
              { name: 'us avg', val: 14.5, color: 'var(--purple)' }
            ].map(b => {
              const max = 14.5;
              return (
                <div key={b.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text3)', marginBottom: '8px' }}>
                    <span>{b.name}</span>
                    <span className="font-mono">{b.val.toFixed(1)} tCO₂e</span>
                  </div>
                  <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(b.val/max)*100}%`, background: b.color, borderRadius: '6px', transition: 'width 1s ease-out' }}></div>
                  </div>
                </div>
              )
            })}
          </div>

          {results.hasSolar && (
            <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border-hover)' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Sun size={14} /> solar impact</div>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <div className="font-mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--amber)' }}>{results.solarGen.toFixed(2)}t</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>CO₂ offset / yr</div>
                </div>
                <div>
                  <div className="font-mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--green)' }}>{results.elecGross > 0 ? Math.min(100, Math.round(results.solarGen/results.elecGross*100)) : 0}%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>of elec needs</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default DashboardScreen;
