import React from 'react';
import { ArrowLeft, ArrowRight, Car, Bike, Train, Bus, Plane } from 'lucide-react';

const modes = [
  { id: 'scooter', name: 'scooter / petrol', icon: <Bike size={24} />, ef: 0.035, label: 'km per week', unit: '~0.035 kg CO₂/km', ph: 'e.g. 80' },
  { id: 'bicycle', name: 'bicycle', icon: <Bike size={24} />, ef: 0, label: 'km per week', unit: 'zero direct emissions', ph: 'e.g. 30' },
  { id: 'carPetrol', name: 'car (petrol)', icon: <Car size={24} />, ef: 0.17, label: 'km per week', unit: '~0.17 kg CO₂/km', ph: 'e.g. 100' },
  { id: 'carEv', name: 'car (electric)', icon: <Car size={24} />, ef: 0.05, label: 'km per week', unit: '~0.05 kg CO₂/km', ph: 'e.g. 100' },
  { id: 'truck', name: 'truck / van', icon: <Car size={24} />, ef: 0.25, label: 'km per week', unit: '~0.25 kg CO₂/km', ph: 'e.g. 150' },
  { id: 'bus', name: 'bus', icon: <Bus size={24} />, ef: 0.089, label: 'km per week', unit: '~0.089 kg CO₂/km', ph: 'e.g. 60' },
  { id: 'metro', name: 'metro / subway', icon: <Train size={24} />, ef: 0.028, label: 'km per week', unit: '~0.028 kg CO₂/km', ph: 'e.g. 50' },
  { id: 'railway', name: 'train / railway', icon: <Train size={24} />, ef: 0.041, label: 'km per week', unit: '~0.041 kg CO₂/km', ph: 'e.g. 200' },
  { id: 'flightShort', name: 'short haul (<3h)', icon: <Plane size={24} />, ef: 0.255, label: 'flights per year', unit: '~0.255 kg CO₂/km avg', ph: 'e.g. 4' },
  { id: 'flightLong', name: 'long haul (>6h)', icon: <Plane size={24} />, ef: 0.195, label: 'flights per year', unit: '~0.195 kg CO₂/km avg', ph: 'e.g. 1' },
];

const TransportScreen = ({ data, updateData, goBack, goNext }) => {
  const toggleMode = (id) => {
    if (data[id] !== '') {
      updateData(id, ''); // Deselect by clearing value
    } else {
      updateData(id, '0'); // Select by setting to '0'
    }
  };

  const isActive = (id) => data[id] !== '';

  const renderSection = (title, icon, modeIds) => (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--green)' }}>{icon}</span> {title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {modeIds.map(id => {
          const m = modes.find(x => x.id === id);
          return (
            <div key={id} className={`selectable-card ${isActive(id) ? 'active' : ''}`} onClick={() => toggleMode(id)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: isActive(id) ? 'var(--green)' : 'var(--text2)' }}>{m.icon}</span>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `1.5px solid ${isActive(id) ? 'var(--green)' : 'var(--glass-border-hover)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive(id) ? 'var(--green)' : 'transparent', transition: 'all 0.2s' }}>
                  {isActive(id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginTop: '8px' }}>{m.name}</div>
              
              {isActive(id) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }} onClick={e => e.stopPropagation()}>
                  <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{m.label}</div>
                  <input 
                    type="number" 
                    min="0" 
                    placeholder={m.ph} 
                    value={data[id] === '0' ? '' : data[id]} 
                    onChange={e => updateData(id, e.target.value)}
                  />
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{m.unit}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--green)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>step 1 of 3</div>
        <h2 style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '8px' }}>how do you get around?</h2>
        <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.6 }}>Select all transport modes you use regularly. Enter weekly distance for each.</p>
      </div>

      {renderSection('personal vehicles', '🚗', ['scooter', 'bicycle', 'carPetrol', 'carEv', 'truck'])}
      {renderSection('public & shared transport', '🚌', ['bus', 'metro', 'railway'])}
      {renderSection('air travel (per year)', '✈️', ['flightShort', 'flightLong'])}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
        <button className="btn-secondary" onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={16} /> back</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', boxShadow: 'var(--shadow-glow)' }}></div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--bg4)' }}></div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--bg4)' }}></div>
        </div>
        <button className="btn-primary" onClick={goNext}>next: energy <ArrowRight size={16} /></button>
      </div>
    </div>
  );
};

export default TransportScreen;
