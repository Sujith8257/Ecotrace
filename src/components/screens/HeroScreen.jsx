import { ArrowRight, BarChart3, Check, ClipboardList, Footprints, Leaf, Lightbulb, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '../../assets/hero.png';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const howItWorks = [
  {
    icon: ClipboardList,
    title: 'Answer everyday questions',
    text: 'Add travel, home energy, food, shopping, and waste habits in a few focused steps.',
  },
  {
    icon: BarChart3,
    title: 'See your monthly baseline',
    text: 'EcoTrace converts your inputs into a readable estimate with category-level breakdowns.',
  },
  {
    icon: Lightbulb,
    title: 'Choose practical actions',
    text: 'Your result highlights the changes likely to matter most for your actual footprint.',
  },
];

const HeroScreen = ({ goNext }) => {
  return (
    <div className="w-full">
      <section className="relative isolate flex min-h-[calc(100vh-80px)] items-center overflow-hidden">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/88 via-white/78 to-background" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_12%,rgba(31,157,85,0.22),transparent_32rem)]" />

        <div className="section-container flex w-full flex-col items-center justify-center py-16 text-center sm:py-20 lg:py-24">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="mx-auto flex max-w-5xl flex-col items-center"
          >
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.04em] text-brand-green shadow-sm backdrop-blur"
            >
              <Sparkles size={14} /> Practical climate baseline
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-5xl text-[48px] font-extrabold leading-[0.98] tracking-normal text-foreground sm:text-[72px] lg:text-[96px]"
            >
              EcoTrace AI
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg"
            >
              Turn everyday choices into an explainable carbon footprint estimate, then see the clearest places to reduce impact without guessing.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={goNext} className="btn-magic group">
                <span className="btn-magic-glow"></span>
                <span className="btn-magic-inner gap-2 px-7">
                  Start calculator <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-white/85 px-6 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
              >
                How it works
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ['4 categories', 'transport, energy, food, waste'],
                ['5 minutes', 'quick monthly baseline'],
                ['Visible logic', 'no hidden black box totals'],
              ].map(([value, label]) => (
                <div key={value} className="rounded-[24px] border border-border bg-white/80 p-5 shadow-sm backdrop-blur">
                  <div className="text-2xl font-extrabold text-foreground">{value}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="section-container scroll-mt-28 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.04em] text-brand-green">How it works</div>
          <h2 className="text-3xl font-extrabold text-foreground sm:text-5xl">From habits to a clear action plan.</h2>
          <p className="mt-5 text-base text-muted-foreground">
            EcoTrace keeps the flow simple: gather the right inputs, calculate a useful estimate, and show what you can change next.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {howItWorks.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[24px] border border-border bg-white/85 p-6 shadow-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/20 bg-brand-green/10 text-brand-green">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="carbon-footprint" className="scroll-mt-28 border-y border-border bg-white/60 py-16 sm:py-20">
        <div className="section-container grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.04em] text-brand-green">What is a carbon footprint?</div>
            <h2 className="text-3xl font-extrabold text-foreground sm:text-5xl">A footprint is the climate impact of daily activity.</h2>
            <p className="mt-5 text-base text-muted-foreground">
              It is usually shown as carbon dioxide equivalent, or CO2e. That lets different greenhouse gases and activities be compared in one common unit.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ['Travel', 'Fuel, flights, public transport, and vehicle use.'],
              ['Home energy', 'Electricity, cooking fuel, solar offsets, and appliance habits.'],
              ['Food', 'Diet patterns and lifecycle emissions from food production.'],
              ['Waste', 'Shopping, reuse, landfill, and household waste behavior.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[24px] border border-border bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-green">
                  <Check size={16} /> {title}
                </div>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why-ecotrace" className="section-container scroll-mt-28 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[24px] border border-brand-green/20 bg-brand-green/10 p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-green shadow-sm">
              <Leaf size={26} />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">Built to trace, not judge.</h2>
            <p className="mt-4 text-muted-foreground">
              The goal is not perfection. It is to make the biggest sources visible so your next step feels obvious and achievable.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              [ShieldCheck, 'Transparent assumptions', 'Your estimate includes caveats and visible logic.'],
              [Zap, 'Fast baseline', 'Get a practical monthly view without a full audit.'],
              [Footprints, 'Action-focused', 'Recommendations are tied to your actual categories.'],
              [BarChart3, 'Readable breakdown', 'See category shares before choosing what to change.'],
            ].map(([Icon, title, text]) => (
              <div key={title} className="rounded-[24px] border border-border bg-white/85 p-5 shadow-sm">
                <Icon size={20} className="mb-4 text-brand-green" />
                <h3 className="font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-[24px] border border-border bg-white/85 p-6 text-center shadow-sm sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">Ready to calculate your baseline?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Start with your normal month and adjust answers anytime.</p>
          </div>
          <button onClick={goNext} className="btn-magic group shrink-0">
            <span className="btn-magic-glow"></span>
            <span className="btn-magic-inner gap-2 px-7">
              Start now <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HeroScreen;
