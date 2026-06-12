import React from 'react';
import { ArrowLeft, ArrowRight, Zap, Flame, Home, Sun } from 'lucide-react';

const EnergyScreen = ({ data, updateData, goBack, goNext }) => {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--green)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>step 2 of 3</div>
        <h2 style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '8px' }}>home energy use</h2>
        <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.6 }}>Your electricity bill and cooking setup determine a big chunk of your footprint.</p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--amber)' }}><Zap size={18} /></span> electricity
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '14px', color: 'var(--text)' }}>monthly electricity bill</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '180px' }}>
              <input type="number" min="0" placeholder="e.g. 200" value={data.elecKwh} onChange={e => updateData('elecKwh', e.target.value)} />
            </div>
            <span style={{ fontSize: '14px', color: 'var(--text3)' }}>kWh / month</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>check your EB bill — look for "units consumed" (1 unit = 1 kWh)</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--glass-border-hover)' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}><Sun size={16} color="var(--amber)" /> i have solar panels</div>
            <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '2px' }}>we'll calculate your offset and net consumption</div>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={data.hasSolar} onChange={e => updateData('hasSolar', e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {data.hasSolar && (
          <div className="animate-fade-in" style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border-hover)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text)' }}>panel capacity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="number" min="0" placeholder="e.g. 3" value={data.solarKw} onChange={e => updateData('solarKw', e.target.value)} />
                <span style={{ fontSize: '13px', color: 'var(--text3)', whiteSpace: 'nowrap' }}>kWp</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text)' }}>sunshine hours</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="number" min="0" step="0.5" placeholder="5.5" value={data.solarHours} onChange={e => updateData('solarHours', e.target.value)} />
                <span style={{ fontSize: '13px', color: 'var(--text3)', whiteSpace: 'nowrap' }}>hrs/day</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--red)' }}><Flame size={18} /></span> cooking fuel
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text)' }}>LPG cylinders used per month</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '180px' }}>
              <input type="number" min="0" step="0.1" placeholder="e.g. 0.5" value={data.lpgCylinders} onChange={e => updateData('lpgCylinders', e.target.value)} />
            </div>
            <span style={{ fontSize: '14px', color: 'var(--text3)' }}>cylinders / mo</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>one 14.2 kg cylinder ≈ 42 kg CO₂e</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--blue)' }}><Home size={18} /></span> home setup
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--glass-border-hover)' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500 }}>use air conditioning regularly</div>
            <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '2px' }}>5+ hours daily during summer</div>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={data.acToggle} onChange={e => updateData('acToggle', e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--glass-border-hover)' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500 }}>use a clothes dryer</div>
            <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '2px' }}>as opposed to line-drying</div>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={data.dryerToggle} onChange={e => updateData('dryerToggle', e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500 }}>LED lighting throughout home</div>
            <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '2px' }}>reduces lighting energy by ~75%</div>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={data.ledToggle} onChange={e => updateData('ledToggle', e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
        <button className="btn-secondary" onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={16} /> back</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green3)' }}></div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', boxShadow: 'var(--shadow-glow)' }}></div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--bg4)' }}></div>
        </div>
        <button className="btn-primary" onClick={goNext}>next: food & waste <ArrowRight size={16} /></button>
      </div>
    </div>
  );
};

export default EnergyScreen;
