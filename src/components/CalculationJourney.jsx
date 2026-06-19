import { Cloud, Factory, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { label: 'Leaf', icon: Leaf },
  { label: 'Power plant', icon: Factory },
  { label: 'CO2', icon: Cloud, text: 'CO2' },
  { label: 'Leaf', icon: Leaf },
];

const CalculationJourney = ({
  title = 'Computing your baseline...',
  subtitle = 'Tracing inputs through emissions and back to better choices.',
}) => {
  return (
    <div className="w-full max-w-md mx-auto rounded-[24px] border border-border bg-white/95 p-6 text-center shadow-lg">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/10">
        <div className="relative h-14 w-14">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-secondary border-t-brand-green"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          />
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={`loader-${step.label}-${index}`}
                className="absolute inset-0 flex items-center justify-center text-brand-green"
                initial={false}
                animate={{
                  opacity: [0, 0, 1, 1, 0],
                  scale: [0.72, 0.72, 1, 1, 0.72],
                  rotate: index === 1 ? [0, 0, -6, 6, 0] : 0,
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index,
                  times: [0, 0.1, 0.18, 0.78, 0.9],
                  ease: 'easeInOut',
                }}
              >
                {step.text ? (
                  <span className="font-mono text-sm font-bold tracking-normal text-brand-green">{step.text}</span>
                ) : (
                  <Icon size={26} strokeWidth={2.5} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mb-5 flex items-center justify-center gap-2">
        {steps.map((step, index) => (
          <motion.div
            key={`step-dot-${step.label}-${index}`}
            className="h-2 rounded-full bg-brand-green"
            animate={{ width: [8, 26, 8], opacity: [0.28, 1, 0.28] }}
            transition={{ duration: 4, repeat: Infinity, delay: index, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative mb-5 h-10 overflow-hidden rounded-full border border-border bg-secondary">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-brand-green/20"
          animate={{ width: ['18%', '46%', '72%', '100%', '18%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative z-10 grid h-full grid-cols-4 items-center">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={`${step.label}-${index}`} className="flex items-center justify-center">
                <motion.div
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-green shadow-sm"
                  animate={{
                    scale: [1, 1.18, 1],
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index,
                    ease: 'easeInOut',
                  }}
                >
                  {step.text ? (
                    <span className="font-mono text-[10px] font-bold tracking-normal text-brand-green">{step.text}</span>
                  ) : (
                    <Icon size={15} strokeWidth={2.5} />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <motion.h2
        className="text-lg font-bold text-foreground"
        animate={{ opacity: [0.72, 1, 0.72] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        {title}
      </motion.h2>
      <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default CalculationJourney;
