import React from 'react';
import { ArrowLeft, ArrowRight, Salad, Trash2, ShoppingBag } from 'lucide-react';

const dietOptions = [
  { id: 'vegan', name: 'vegan', desc: 'no animal products', ef: 0.7 },
  { id: 'plant-based', name: 'plant-based', desc: 'mostly plants, rare exceptions', ef: 1.0 },
  { id: 'vegetarian', name: 'vegetarian', desc: 'no meat, yes dairy/eggs', ef: 1.3 },
  { id: 'no-meat-fish', name: 'no red meat/fish', desc: 'poultry only', ef: 1.5 },
  { id: 'mixed', name: 'mixed', desc: 'a bit of everything', ef: 2.0 },
  { id: 'meat-heavy', name: 'meat most days', desc: 'red meat regularly', ef: 3.3 },
];

const wasteOptions = [
  { id: 'low', name: 'low', desc: 'reuse, sort, compost', ef: 0.1 },
  { id: 'average', name: 'average', desc: 'some sorting & reuse', ef: 0.5 },
  { id: 'high', name: 'high', desc: 'frequent disposables', ef: 1.2 },
];

const FoodWasteScreen = ({ data, updateData, goBack, calculate }) => {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--green)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>step 3 of 3</div>
        <h2 style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '8px' }}>food & waste habits</h2>
        <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.6 }}>These use broad behaviour bands. Your result will show the range and explain the assumptions.</p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--green)' }}><Salad size={18} /></span> diet
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '1.5rem' }}>which best matches what you eat most days?</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {dietOptions.map(opt => (
            <div 
              key={opt.id} 
              className={`selectable-card ${data.diet === opt.id ? 'active' : ''}`}
              onClick={() => updateData('diet', opt.id)}
            >
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{opt.name}</div>
              <div style={{ fontSize: '12px', color: data.diet === opt.id ? 'var(--green)' : 'var(--text3)', marginTop: '4px', opacity: data.diet === opt.id ? 0.8 : 1 }}>{opt.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text3)' }}><Trash2 size={18} /></span> household waste
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '1.5rem' }}>how would you describe your waste habits?</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {wasteOptions.map(opt => (
            <div 
              key={opt.id} 
              className={`selectable-card ${data.waste === opt.id ? 'active' : ''}`}
              onClick={() => updateData('waste', opt.id)}
            >
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{opt.name}</div>
              <div style={{ fontSize: '12px', color: data.waste === opt.id ? 'var(--green)' : 'var(--text3)', marginTop: '4px', opacity: data.waste === opt.id ? 0.8 : 1 }}>{opt.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--purple)' }}><ShoppingBag size={18} /></span> shopping & consumption
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '14px', color: 'var(--text)' }}>monthly spend on new clothing & electronics</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '180px' }}>
              <input type="number" min="0" placeholder="e.g. 2000" value={data.shoppingSpend} onChange={e => updateData('shoppingSpend', e.target.value)} />
            </div>
            <span style={{ fontSize: '14px', color: 'var(--text3)' }}>₹ / month</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>approx ₹1000 → ~0.04 tCO₂e/yr from manufacturing</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--glass-border-hover)' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500 }}>buy second-hand / refurbished often</div>
            <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '2px' }}>reduces shopping footprint by ~40%</div>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={data.secondhandToggle} onChange={e => updateData('secondhandToggle', e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
        <button className="btn-secondary" onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={16} /> back</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green3)' }}></div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green3)' }}></div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', boxShadow: 'var(--shadow-glow)' }}></div>
        </div>
        <button className="btn-primary" onClick={calculate}>see my results <ArrowRight size={16} /></button>
      </div>
    </div>
  );
};

export default FoodWasteScreen;
