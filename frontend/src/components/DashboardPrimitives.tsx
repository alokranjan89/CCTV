import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export function Panel({
  children,
  className = '',
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.045] shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent opacity-70" />
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,0%),rgba(103,232,249,0.11),transparent_28%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </motion.section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
  compact = false
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 ${compact ? 'mb-4' : 'mb-6'}`}>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-200/85">
          {eyebrow}
        </p>
        <h2 className={`${compact ? 'text-xl' : 'text-2xl'} mt-2 font-semibold tracking-tight text-white`}>
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export function MetricTile({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'cyan'
}: {
  label: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
  tone?: 'cyan' | 'purple' | 'amber' | 'emerald' | 'rose';
}) {
  const tones = {
    cyan: 'text-cyan-200 bg-cyan-300/10',
    purple: 'text-violet-200 bg-violet-300/10',
    amber: 'text-amber-200 bg-amber-300/10',
    emerald: 'text-emerald-200 bg-emerald-300/10',
    rose: 'text-rose-200 bg-rose-300/10'
  };

  return (
    <article className="rounded-xl border border-white/[0.08] bg-black/20 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.055]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {detail && <p className="mt-3 text-sm leading-5 text-slate-400">{detail}</p>}
    </article>
  );
}

export function StatusBadge({
  label,
  tone = 'cyan',
  pulse = false
}: {
  label: string;
  tone?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate' | 'purple';
  pulse?: boolean;
}) {
  const tones = {
    cyan: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100',
    emerald: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100',
    amber: 'border-amber-300/20 bg-amber-300/10 text-amber-100',
    rose: 'border-rose-300/20 bg-rose-300/10 text-rose-100',
    slate: 'border-white/10 bg-white/[0.05] text-slate-300',
    purple: 'border-violet-300/20 bg-violet-300/10 text-violet-100'
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] ${tones[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full bg-current ${pulse ? 'animate-pulse' : ''}`} />
      {label}
    </span>
  );
}

export function ConfidenceRing({
  value,
  label = 'AI confidence'
}: {
  value: number;
  label?: string;
}) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, value) / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative grid h-28 w-28 place-items-center">
        <svg className="h-28 w-28 -rotate-90">
          <circle cx="56" cy="56" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
          <motion.circle
            cx="56"
            cy="56"
            r={radius}
            stroke="url(#confidenceGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="confidenceGradient" x1="0" x2="1">
              <stop stopColor="#67e8f9" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <p className="text-2xl font-semibold text-white">{value}%</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">score</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-1 text-sm leading-5 text-slate-400">
          Weighted by motion stability, object continuity, and recap quality.
        </p>
      </div>
    </div>
  );
}

export function Waveform({ active = true }: { active?: boolean }) {
  const bars = [30, 52, 38, 72, 48, 86, 44, 62, 35, 76, 58, 42, 68, 50, 82, 46, 60, 36];

  return (
    <div className="flex h-24 items-end gap-1.5 rounded-xl border border-white/[0.08] bg-black/20 p-4">
      {bars.map((height, index) => (
        <motion.span
          key={`${height}-${index}`}
          animate={active ? { height: [`${height * 0.55}%`, `${height}%`, `${height * 0.7}%`] } : { height: `${height * 0.5}%` }}
          transition={{ duration: 1.6 + index * 0.03, repeat: active ? Infinity : 0, repeatType: 'mirror', ease: 'easeInOut' }}
          className="w-full rounded-full bg-gradient-to-t from-cyan-400/25 via-cyan-200/70 to-violet-200"
        />
      ))}
    </div>
  );
}

export function ActivityHeatmap() {
  const cells = [
    0.2, 0.5, 0.18, 0.4, 0.72, 0.3, 0.62, 0.26, 0.34, 0.82, 0.45, 0.22,
    0.38, 0.7, 0.92, 0.54, 0.28, 0.66, 0.32, 0.58, 0.78, 0.44, 0.24, 0.52
  ];

  return (
    <div className="grid grid-cols-8 gap-2">
      {cells.map((opacity, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.015 }}
          className="aspect-square rounded-lg border border-white/[0.06] bg-cyan-300"
          style={{ opacity: 0.12 + opacity * 0.72 }}
        />
      ))}
    </div>
  );
}
