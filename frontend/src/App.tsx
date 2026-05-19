import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  DownloadCloud,
  Sparkles
} from 'lucide-react';

/* =========================
   Lazy Loaded Sections
========================= */

const HeroPanel = lazy(
  () => import('./components/HeroPanel')
);

const UploadPanel = lazy(
  () => import('./components/UploadPanel')
);

const AnalyticsPanel = lazy(
  () => import('./components/AnalyticsPanel')
);

const TimelinePanel = lazy(
  () => import('./components/TimelinePanel')
);

const HeatmapPanel = lazy(
  () => import('./components/HeatmapPanel')
);

/* =========================
   Constants
========================= */

const overviewStats = [
  {
    label: 'Platform state',
    value: 'Live',
    tone: 'text-white'
  },
  {
    label: 'Confidence',
    value: '98.6%',
    tone: 'text-emerald-300'
  },
  {
    label: 'Threat load',
    value: '3 Active',
    tone: 'text-red-400'
  }
];

/* =========================
   Shared Components
========================= */

function LoadingPanel() {
  return (
    <div
      className="
        h-[320px] animate-pulse rounded-[32px]
        border border-white/5
        bg-slate-950/60
      "
    />
  );
}

function OverviewCard({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div
      className="
        rounded-3xl border border-white/5
        bg-slate-950/72 p-4
        backdrop-blur-xl
      "
    >
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>

      <h3 className={`mt-3 text-xl font-semibold ${tone}`}>
        {value}
      </h3>
    </div>
  );
}

/* =========================
   Main App
========================= */

export default function App() {
  return (
    <main
      className="
        min-h-screen overflow-hidden
        bg-[radial-gradient(circle_at_top_right,rgba(70,179,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,107,0,0.12),transparent_24%),linear-gradient(180deg,#05060d_0%,#020409_100%)]
        text-slate-100
      "
    >
      <div className="mx-auto flex max-w-[1560px] flex-col gap-10 px-6 py-8 lg:px-10">
        {/* =========================
            Header
        ========================= */}

        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            flex flex-col gap-6 rounded-[32px]
            border border-white/5
            bg-slate-950/75 p-6
            backdrop-blur-2xl
            md:flex-row md:items-center md:justify-between
          "
        >
          {/* Left */}
          <div className="flex items-start gap-4">
            <div
              className="
                grid h-16 w-16 place-items-center
                rounded-3xl
                bg-gradient-to-br
                from-orange-500 to-amber-400
              "
            >
              <Sparkles className="h-7 w-7 text-slate-950" />
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-300">
                CCTV Recap AI
              </p>

              <h1
                className="
                  mt-3 max-w-3xl text-3xl
                  font-semibold leading-tight
                  text-white sm:text-4xl
                "
              >
                Enterprise surveillance intelligence,
                reimagined for AI command centers.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Upload footage, monitor live threat
                signals, and generate cinematic AI
                incident recaps for modern security
                operations.
              </p>
            </div>
          </div>

          {/* Right Stats */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {overviewStats.map((item) => (
              <OverviewCard
                key={item.label}
                {...item}
              />
            ))}
          </div>
        </motion.header>

        {/* =========================
            Hero
        ========================= */}

        <Suspense fallback={<LoadingPanel />}>
          <HeroPanel />
        </Suspense>

        {/* =========================
            Main Grid
        ========================= */}

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
          {/* Upload */}
          <Suspense fallback={<LoadingPanel />}>
            <UploadPanel />
          </Suspense>

          {/* Side Panels */}
          <div className="grid gap-6">
            <Suspense fallback={<LoadingPanel />}>
              <AnalyticsPanel />
            </Suspense>

            <Suspense fallback={<LoadingPanel />}>
              <TimelinePanel />
            </Suspense>
          </div>
        </div>

        {/* =========================
            Heatmap
        ========================= */}

        <Suspense fallback={<LoadingPanel />}>
          <HeatmapPanel />
        </Suspense>

        {/* =========================
            Footer CTA
        ========================= */}

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="
            rounded-[32px] border border-white/5
            bg-slate-950/75 p-6
            backdrop-blur-2xl
          "
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Operational readiness
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                Always-on AI surveillance orchestration.
              </h2>
            </div>

            <button
              className="
                inline-flex items-center justify-center gap-2
                rounded-full bg-orange-500
                px-5 py-3 text-sm font-semibold
                text-slate-950 transition
                hover:bg-orange-400
              "
            >
              <DownloadCloud className="h-4 w-4" />

              Export security brief
            </button>
          </div>
        </motion.section>
      </div>
    </main>
  );
}