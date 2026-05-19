import { motion } from 'framer-motion';
import { Activity, Camera, ChevronRight, Eye, Radar, ShieldCheck, Sparkles } from 'lucide-react';
import { ResultSummary } from '../types';
import { ConfidenceRing, StatusBadge, Waveform } from './DashboardPrimitives';

const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 17) % 84)}%`,
  top: `${12 + ((index * 23) % 70)}%`,
  delay: index * 0.18
}));

function formatDuration(seconds?: number) {
  if (!seconds) return '0s';
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return minutes > 0 ? `${minutes}m ${remaining}s` : `${remaining}s`;
}

export default function HeroPanel({ summary }: { summary: ResultSummary | null }) {
  const confidence = summary ? 96 : 91;

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#070910]/84 p-5 shadow-[0_36px_120px_rgba(0,0,0,0.38)] backdrop-blur-2xl lg:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(103,232,249,0.18),transparent_24%),radial-gradient(circle_at_78%_12%,rgba(167,139,250,0.14),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px] opacity-60" />
      <motion.div
        animate={{ x: ['-20%', '120%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-200/[0.055] to-transparent"
      />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute h-1 w-1 rounded-full bg-cyan-200/70 shadow-[0_0_18px_rgba(103,232,249,0.75)]"
          style={{ left: particle.left, top: particle.top }}
          animate={{ opacity: [0.15, 0.9, 0.15], y: [-6, 8, -6] }}
          transition={{ duration: 3.2, delay: particle.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label="AI recap system live" tone="emerald" pulse />
            <StatusBadge label="Static camera optimized" tone="cyan" />
          </div>

          <h2 className="mt-7 max-w-5xl text-4xl font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl xl:text-7xl">
            Transform hours of surveillance footage into intelligent incident recaps.
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            AI-powered timestamp extraction, motion tracking, and cinematic review compression for faster security investigation workflows.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#upload"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_60px_rgba(255,255,255,0.14)] transition hover:scale-[1.015] hover:bg-cyan-100"
            >
              Start recap
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#signals"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.055] px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-200/25 hover:bg-cyan-300/10 hover:text-white"
            >
              <Radar className="h-4 w-4" />
              View signal intelligence
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ['Frame reduction', summary ? `${summary.compressionRatio}x` : 'Pending', Activity],
              ['Review saved', summary ? formatDuration(summary.timeSavedSeconds) : 'Awaiting file', Eye],
              ['Output quality', summary ? 'Recap ready' : 'Model standing by', ShieldCheck]
            ].map(([label, value, Icon]) => {
              const TypedIcon = Icon as typeof Activity;
              return (
                <div key={label as string} className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                  <TypedIcon className="h-4 w-4 text-cyan-200" />
                  <p className="mt-4 text-xl font-semibold text-white">{value as string}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{label as string}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 22 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.68, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-8 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-black/35 p-4 shadow-[0_32px_100px_rgba(0,0,0,0.42)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Sector B preview</p>
                  <p className="text-xs text-slate-500">Incident compression model</p>
                </div>
              </div>
              <Sparkles className="h-5 w-5 text-violet-200" />
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950">
              <img src="/cctv-cover.png" alt="CCTV preview" className="h-[300px] w-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
              <motion.div
                animate={{ y: ['-20%', '120%'] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-transparent via-cyan-200/18 to-transparent"
              />
              <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <Waveform />
                <div className="rounded-2xl border border-white/[0.1] bg-black/55 p-3 backdrop-blur-xl">
                  <ConfidenceRing value={confidence} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
