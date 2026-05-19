import { lazy, Suspense, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Bell,
  Camera,
  Command,
  Cpu,
  LayoutDashboard,
  Radar,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import { ResultSummary } from './types';
import { MetricTile, StatusBadge } from './components/DashboardPrimitives';

const HeroPanel = lazy(() => import('./components/HeroPanel'));
const UploadPanel = lazy(() => import('./components/UploadPanel'));
const AnalyticsPanel = lazy(() => import('./components/AnalyticsPanel'));
const TimelinePanel = lazy(() => import('./components/TimelinePanel'));
const HeatmapPanel = lazy(() => import('./components/HeatmapPanel'));

const navItems = [
  { label: 'Command', href: '#command', icon: LayoutDashboard, active: true },
  { label: 'Upload', href: '#upload', icon: Camera },
  { label: 'Signals', href: '#signals', icon: Radar },
  { label: 'Events', href: '#events', icon: Bell }
];

function LoadingPanel() {
  return (
    <div className="h-[360px] animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.035]" />
  );
}

export default function App() {
  const [resultSummary, setResultSummary] = useState<ResultSummary | null>(null);

  const overviewStats = useMemo(
    () => [
      {
        label: 'Engine state',
        value: 'Online',
        detail: 'Recap service listening',
        icon: ShieldCheck,
        tone: 'emerald' as const
      },
      {
        label: 'Review saved',
        value: resultSummary ? `${Math.round(resultSummary.timeSavedSeconds)}s` : 'Awaiting file',
        detail: resultSummary ? 'Estimated manual review removed' : 'Upload footage to calculate',
        icon: Zap,
        tone: 'cyan' as const
      },
      {
        label: 'Compression',
        value: resultSummary ? `${resultSummary.compressionRatio}x` : 'Pending',
        detail: resultSummary ? 'Generated from latest recap' : 'Calculated after processing',
        icon: Activity,
        tone: 'amber' as const
      }
    ],
    [resultSummary]
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#030407] text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_82%_0%,rgba(139,92,246,0.12),transparent_30%),linear-gradient(135deg,#030407_0%,#070a12_48%,#030407_100%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:48px_48px] opacity-45" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.05] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_256_256%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.9%22_numOctaves=%224%22/%3E%3C/filter%3E%3Crect_width=%22256%22_height=%22256%22_filter=%22url(%23n)%22_opacity=%220.55%22/%3E%3C/svg%3E')]" />

      <div className="mx-auto flex max-w-[1540px] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-4 z-40 rounded-2xl border border-white/[0.1] bg-[#070910]/78 px-4 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <a href="#command" className="flex items-center gap-3">
              <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-200 to-cyan-200 text-slate-950 shadow-[0_0_40px_rgba(103,232,249,0.18)]">
                <Sparkles className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#070910] bg-emerald-300" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">CCTV Recap AI</p>
                <h1 className="text-lg font-semibold tracking-tight text-white">Surveillance Intelligence</h1>
              </div>
            </a>

            <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.035] p-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`relative inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition duration-300 ${
                      item.active
                        ? 'bg-white/[0.09] text-white shadow-lg shadow-black/20'
                        : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {item.active && (
                      <motion.span
                        layoutId="active-nav"
                        className="absolute inset-0 rounded-xl border border-cyan-200/15"
                      />
                    )}
                    <Icon className="relative h-4 w-4" />
                    <span className="relative">{item.label}</span>
                  </a>
                );
              })}
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge label="AI healthy" tone="emerald" pulse />
              <div className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.045] text-slate-300">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-300" />
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.045] px-3 py-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-200 to-violet-200 text-xs font-bold text-slate-950">
                  AI
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">Operator</p>
                  <p className="text-xs text-slate-500">Command access</p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        <section id="command">
          <Suspense fallback={<LoadingPanel />}>
            <HeroPanel summary={resultSummary} />
          </Suspense>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {overviewStats.map((item, index) => (
            <MetricTile key={item.label} {...item} icon={item.icon} tone={item.tone} />
          ))}
        </section>

        <section id="upload" className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <Suspense fallback={<LoadingPanel />}>
            <UploadPanel onResult={setResultSummary} />
          </Suspense>

          <div id="signals" className="grid gap-6">
            <Suspense fallback={<LoadingPanel />}>
              <AnalyticsPanel summary={resultSummary} />
            </Suspense>
            <Suspense fallback={<LoadingPanel />}>
              <TimelinePanel summary={resultSummary} />
            </Suspense>
          </div>
        </section>

        <section id="events" className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
          <Suspense fallback={<LoadingPanel />}>
            <HeatmapPanel summary={resultSummary} />
          </Suspense>

          <div className="grid gap-6">
            <div className="rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/85">System queue</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Processing center</h2>
                </div>
                <Cpu className="h-5 w-5 text-violet-200" />
              </div>
              <div className="space-y-3">
                {['Background extraction', 'Object continuity pass', 'Timestamp compositor'].map((item, index) => (
                  <div key={item} className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-white">{item}</span>
                      <span className="text-xs uppercase tracking-[0.14em] text-slate-500">
                        {index === 0 ? 'ready' : index === 1 ? 'queued' : 'standby'}
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${72 - index * 18}%` }}
                        transition={{ duration: 0.9, delay: index * 0.12 }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/85">Export center</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Smart delivery</h2>
                </div>
                <Command className="h-5 w-5 text-cyan-200" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {['Recap MP4', 'Incident JSON', 'Audit PDF'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-cyan-200/20 hover:bg-cyan-300/10 hover:text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
