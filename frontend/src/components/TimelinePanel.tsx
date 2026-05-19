import { CheckCircle2, Clock3, FileVideo, ScanLine, Settings2, Siren } from 'lucide-react';
import { ResultSummary } from '../types';
import { Panel, SectionHeader, StatusBadge } from './DashboardPrimitives';

function formatDuration(seconds?: number) {
  if (!seconds) return '-';
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return minutes > 0 ? `${minutes}m ${remaining}s` : `${remaining}s`;
}

export default function TimelinePanel({ summary }: { summary: ResultSummary | null }) {
  const steps = summary
    ? [
        {
          label: 'Source analyzed',
          detail: `${summary.input.frameCount.toLocaleString()} frames scanned`,
          icon: FileVideo,
          status: 'Complete'
        },
        {
          label: 'Settings applied',
          detail: `Interval ${summary.settings.interval}s, minimum event ${summary.settings.minDuration}s`,
          icon: Settings2,
          status: 'Complete'
        },
        {
          label: 'Recap generated',
          detail: `${formatDuration(summary.input.durationSeconds)} reduced to ${formatDuration(summary.output.durationSeconds)}`,
          icon: CheckCircle2,
          status: 'Ready'
        }
      ]
    : [
        {
          label: 'Source intake',
          detail: 'Waiting for upload validation',
          icon: FileVideo,
          status: 'Standby'
        },
        {
          label: 'Motion extraction',
          detail: 'Background subtraction queued',
          icon: ScanLine,
          status: 'Queued'
        },
        {
          label: 'Incident recap',
          detail: 'Timestamp compositor idle',
          icon: CheckCircle2,
          status: 'Idle'
        }
      ];

  const incidents = [
    ['00:14', 'Vehicle motion', 'Medium'],
    ['01:02', 'Gate crossing', 'High'],
    ['02:37', 'Object linger', 'Low']
  ];

  return (
    <Panel className="p-5" delay={0.04}>
      <SectionHeader
        eyebrow="Smart timeline"
        title="Processing chronology"
        action={<StatusBadge label={summary ? 'resolved' : 'waiting'} tone={summary ? 'emerald' : 'slate'} />}
      />

      <div className="relative space-y-3">
        <div className="absolute bottom-6 left-[21px] top-6 w-px bg-gradient-to-b from-cyan-300/50 via-white/10 to-transparent" />
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article key={step.label} className="relative rounded-2xl border border-white/[0.08] bg-black/20 p-4">
              <div className="flex gap-4">
                <div className="z-10 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200 ring-4 ring-[#080b12]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Step {index + 1}</p>
                    <span className="text-xs uppercase tracking-[0.14em] text-cyan-200">{step.status}</span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold text-white">{step.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{step.detail}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Recent incident history</p>
            <p className="mt-1 text-sm font-medium text-white">Detected event markers</p>
          </div>
          <Siren className="h-5 w-5 text-amber-200" />
        </div>
        <div className="space-y-2">
          {incidents.map(([time, label, severity]) => (
            <div key={`${time}-${label}`} className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-white/[0.06] px-2 py-1 text-xs font-medium text-slate-300">{time}</span>
                <span className="text-sm text-white">{label}</span>
              </div>
              <span className="text-xs uppercase tracking-[0.14em] text-slate-500">{severity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Live system logs</p>
          <Clock3 className="h-4 w-4 text-slate-500" />
        </div>
        <div className="space-y-2 font-mono text-xs text-slate-400">
          <p><span className="text-cyan-200">12:04:18</span> model: motion field initialized</p>
          <p><span className="text-cyan-200">12:04:19</span> queue: awaiting source payload</p>
          <p><span className="text-cyan-200">12:04:21</span> export: recap writer standing by</p>
        </div>
      </div>
    </Panel>
  );
}
