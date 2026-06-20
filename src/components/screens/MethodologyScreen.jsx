import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Database, Target, Leaf } from 'lucide-react';

const sources = [
  {
    category: 'Transport',
    source: 'DEFRA (UK Department for Environment, Food & Rural Affairs) Transport Conversion Factors',
    usage: 'Per-km emissions for passenger vehicles, two-wheelers, and public transit.',
    link: 'https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting'
  },
  {
    category: 'Energy',
    source: 'EPA (US Environmental Protection Agency) & IEA (International Energy Agency)',
    usage: 'Grid electricity averages and LPG cylinder combustion estimates.',
    link: 'https://www.epa.gov/energy/greenhouse-gases-equivalencies-calculator-calculations-and-references'
  },
  {
    category: 'Food',
    source: 'IPCC (Intergovernmental Panel on Climate Change) & Academic averages',
    usage: 'Dietary archetypes (vegan to meat-heavy) lifecycle emissions.',
    link: 'https://www.ipcc.ch/srccl/'
  },
  {
    category: 'Waste',
    source: 'Global Carbon Project',
    usage: 'Household waste to landfill and consumer spending carbon intensities.',
    link: 'https://www.globalcarbonproject.org/'
  }
];

const methodologyFactors = [
  { item: 'Petrol Car', value: '0.17 kg CO₂e / km' },
  { item: 'EV Car', value: '0.05 kg CO₂e / km' },
  { item: 'Bus', value: '0.089 kg CO₂e / km' },
  { item: 'Metro', value: '0.028 kg CO₂e / km' },
  { item: 'Scooter (Petrol)', value: '0.035 kg CO₂e / km' },
  { item: 'Grid Electricity', value: '0.71 kg CO₂e / kWh' },
  { item: 'LPG Cylinder', value: '42.0 kg CO₂e / cylinder' },
  { item: 'Short Haul Flight (< 1000km)', value: '230 kg CO₂e / flight' },
];

const MethodologyScreen = ({ goBack }) => {
  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <button
          onClick={goBack}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.04em] text-brand-green mb-4">
            <BookOpen size={14} /> Transparency
          </div>
          <h1 className="text-3xl font-extrabold text-foreground sm:text-5xl mb-4">Carbon Methodology</h1>
          <p className="text-lg text-muted-foreground">
            EcoTrace AI functions as a sustainability coach. To provide reliable advice, our baseline calculations rely on deterministic formulas based on globally recognized scientific standards. Here is exactly how we calculate your footprint.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground mb-6">
            <Database size={24} className="text-brand-green" /> Scientific Sources
          </h2>
          <div className="grid gap-4">
            {sources.map((src, i) => (
              <div key={i} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{src.category}</h3>
                  <a href={src.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-brand-green hover:underline">
                    View Source ↗
                  </a>
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">{src.source}</div>
                <div className="text-sm text-muted-foreground">{src.usage}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground mb-6">
            <Target size={24} className="text-brand-green" /> Hardcoded Emission Factors
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            To ensure trust and repeatability, our core engine does not use AI to guess raw emission numbers. We use strict multipliers. AI is only used to personalize your coaching and generate your action plan.
          </p>
          <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Activity</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Carbon Multiplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {methodologyFactors.map((factor, i) => (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">{factor.item}</td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">{factor.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green/20 text-brand-green">
                <Leaf size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Why Deterministic Math?</h3>
                <p className="text-sm text-muted-foreground">
                  LLMs (Large Language Models) are exceptional at interpreting context, translating data into advice, and engaging users in conversation. However, they are prone to "hallucinating" numbers during complex math. By combining a deterministic math engine with an AI coaching layer, EcoTrace AI offers the best of both worlds: uncompromised accuracy with deeply personalized guidance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MethodologyScreen;
