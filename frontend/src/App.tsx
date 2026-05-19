import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  BellRing,
  Camera,
  LayoutDashboard,
  Radar,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';

const HeroPanel = lazy(() => import('./components/HeroPanel'));
const UploadPanel = lazy(() => import('./components/UploadPanel'));
const AnalyticsPanel = lazy(() => import('./components/AnalyticsPanel'));
const TimelinePanel = lazy(() => import('./components/TimelinePanel'));
const HeatmapPanel = lazy(() => import('./components/HeatmapPanel'));

const navItems = [
  { label: 'Command', icon: LayoutDashboard },
  { label: 'Upload', icon: Camera },
  { label: 'Signals', icon: Radar },
  { label: 'Events', icon: BellRing }
];

const overviewStats = [
  { label: 'Engine', value: 'Online', icon: ShieldCheck, tone: 'text-emerald-300' },
  { label: 'Scan rate', value: '12.8K/min', icon: Zap, tone: 'text-cyan-200' },
  { label: 'Focus', value: '7 events', icon: Activity, tone: 'text-amber-200' }
];

function LoadingPanel() {
  return (
    <div className="h-[320px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
  );
}

function StatPill({
  label,
  value,
  icon: Icon,
  tone
}: {
  label: string;
  value: string;
  icon: typeof ShieldCheck;
  tone: string;
}) {
  return (
    <div className="min-w-[160px] rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06]">
          <Icon className={`h-4 w-4 ${tone}`} />
        </div>
        <div>
          <p className="text-[11px] uppercase text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <main className="min-h-screen bg-[#06070b] text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,rgba(12,19,33,0.96),rgba(6,7,11,1)_42%,rgba(17,24,39,0.98))]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_12%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_85%_5%,rgba(248,113,113,0.14),transparent_28%),radial-gradient(circle_at_70%_85%,rgba(251,191,36,0.10),transparent_32%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40" />

      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="sticky top-4 z-30 rounded-2xl border border-white/10 bg-[#080b12]/82 px-4 py-3 shadow-2xl shadow-black/25 backdrop-blur-2xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase text-slate-500">CCTV Recap AI</p>
                <h1 className="text-lg font-semibold text-white">Surveillance Command Suite</h1>
              </div>
            </div>

            <nav className="flex gap-2 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={`#${item.label.toLowerCase()}`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </motion.header>

        <section id="command" className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm uppercase text-cyan-200">Realtime incident compression</p>
            <h2 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-6xl">
              Turn hours of static camera footage into a focused security recap.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {overviewStats.map((item) => (
              <StatPill key={item.label} {...item} />
            ))}
          </div>
        </section>

        <Suspense fallback={<LoadingPanel />}>
          <HeroPanel />
        </Suspense>

        <div id="upload" className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <Suspense fallback={<LoadingPanel />}>
            <UploadPanel />
          </Suspense>

          <div id="signals" className="grid gap-6">
            <Suspense fallback={<LoadingPanel />}>
              <AnalyticsPanel />
            </Suspense>
            <Suspense fallback={<LoadingPanel />}>
              <TimelinePanel />
            </Suspense>
          </div>
        </div>

        <div id="events">
          <Suspense fallback={<LoadingPanel />}>
            <HeatmapPanel />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
