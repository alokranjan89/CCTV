import { motion } from 'framer-motion';
import { Boxes, BrainCircuit, FileVideo, Maximize2, TimerReset } from 'lucide-react';
import { ResultSummary } from '../types';
import { ActivityHeatmap, MetricTile, Panel, SectionHeader, StatusBadge } from './DashboardPrimitives';

function percent(input: number, output: number) {
  if (!input) return 0;
  return Math.min(100, Math.round((output / input) * 100));
}

export default function HeatmapPanel({ summary }: { summary: ResultSummary | null }) {
  const retained = summary ? percent(summary.input.durationSeconds, summary.output.durationSeconds) : 0;

  const metrics = summary
    ? [
        {
          label: 'Resolution',
          value: `${summary.output.width} x ${summary.output.height}`,
          detail: 'Generated recap output',
          icon: Maximize2,
          tone: 'cyan' as const
        },
        {
          label: 'Output frames',
          value: summary.output.frameCount.toLocaleString(),
          detail: 'Frames retained in recap',
          icon: FileVideo,
          tone: 'purple' as const
        },
        {
          label: 'Compression',
          value: `${summary.compressionRatio}x`,
          detail: `${retained}% of source duration retained`,
          icon: TimerReset,
          tone: 'emerald' as const
        }
      ]
    : [
        {
          label: 'Resolution',
          value: 'Pending',
          detail: 'Output dimensions appear after render',
          icon: Maximize2,
          tone: 'cyan' as const
        },
        {
          label: 'Output frames',
          value: '0',
          detail: 'Waiting for recap generation',
          icon: FileVideo,
          tone: 'purple' as const
        },
        {
          label: 'Compression',
          value: 'Pending',
          detail: 'Calculated from source and output duration',
          icon: TimerReset,
          tone: 'emerald' as const
        }
      ];

  return (
    <Panel className="p-5 lg:p-6">
      <SectionHeader
        eyebrow="Incident intelligence"
        title="Activity density and recap reduction"
        action={<StatusBadge label={summary ? `${retained}% retained` : 'no result yet'} tone={summary ? 'cyan' : 'slate'} />}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_0.82fr]">
        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Activity density heatmap</p>
              <p className="mt-1 text-sm font-medium text-white">Motion concentration by scene region</p>
            </div>
            <BrainCircuit className="h-5 w-5 text-violet-200" />
          </div>
          <ActivityHeatmap />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['North gate', 'High density', '82%'],
              ['Parking lane', 'Moderate motion', '54%']
            ].map(([zone, label, value]) => (
              <div key={zone} className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4">
                <p className="text-sm font-medium text-white">{zone}</p>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
                <p className="mt-4 text-2xl font-semibold text-cyan-100">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {metrics.map((metric) => (
            <MetricTile key={metric.label} {...metric} />
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Smart recap timeline</p>
            <p className="mt-1 text-sm font-medium text-white">Original footage versus generated review</p>
          </div>
          <Boxes className="h-5 w-5 text-cyan-200" />
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
              <span>Original footage</span>
              <span>{summary ? `${Math.round(summary.input.durationSeconds)}s` : 'waiting'}</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div initial={{ width: 0 }} animate={{ width: summary ? '100%' : '12%' }} className="h-full rounded-full bg-slate-500/70" />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
              <span>Generated recap</span>
              <span>{summary ? `${Math.round(summary.output.durationSeconds)}s` : 'waiting'}</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${summary ? retained : 0}%` }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Event classification</p>
            <p className="mt-1 text-sm font-medium text-white">AI-labeled movement categories</p>
          </div>
          <StatusBadge label="beta" tone="purple" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['Human', '44%', 'cyan'],
            ['Vehicle', '38%', 'amber'],
            ['Unknown', '18%', 'rose']
          ].map(([label, value, tone]) => (
            <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
              <p className={`mt-3 text-2xl font-semibold ${tone === 'cyan' ? 'text-cyan-100' : tone === 'amber' ? 'text-amber-100' : 'text-rose-100'}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
