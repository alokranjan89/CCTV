import { Clock3, FileVideo, Gauge, HardDrive, Radar, TimerReset } from 'lucide-react';
import { ResultSummary } from '../types';
import { ConfidenceRing, MetricTile, Panel, SectionHeader, StatusBadge } from './DashboardPrimitives';

function formatDuration(seconds?: number) {
  if (!seconds) return '-';
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return minutes > 0 ? `${minutes}m ${remaining}s` : `${remaining}s`;
}

function formatBytes(bytes?: number) {
  if (!bytes) return '-';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AnalyticsPanel({ summary }: { summary: ResultSummary | null }) {
  const confidence = summary ? 96 : 91;
  const cards = summary
    ? [
        {
          label: 'Source duration',
          value: formatDuration(summary.input.durationSeconds),
          detail: `${summary.input.frameCount.toLocaleString()} frames at ${summary.input.fps} FPS`,
          icon: FileVideo,
          tone: 'cyan' as const
        },
        {
          label: 'Recap duration',
          value: formatDuration(summary.output.durationSeconds),
          detail: `${summary.compressionRatio}x shorter than source`,
          icon: TimerReset,
          tone: 'purple' as const
        },
        {
          label: 'Processing',
          value: formatDuration(summary.processingSeconds),
          detail: 'Backend runtime for the latest run',
          icon: Gauge,
          tone: 'emerald' as const
        },
        {
          label: 'Storage delta',
          value: formatBytes(summary.output.sizeBytes),
          detail: `Input was ${formatBytes(summary.input.sizeBytes)}`,
          icon: HardDrive,
          tone: 'amber' as const
        }
      ]
    : [
        {
          label: 'Source duration',
          value: 'Waiting',
          detail: 'Upload footage to inspect metadata',
          icon: FileVideo,
          tone: 'cyan' as const
        },
        {
          label: 'Frame reduction',
          value: 'Pending',
          detail: 'Compression metrics calculate after processing',
          icon: TimerReset,
          tone: 'purple' as const
        },
        {
          label: 'Processing',
          value: 'Standby',
          detail: 'AI model is ready for a new job',
          icon: Gauge,
          tone: 'emerald' as const
        },
        {
          label: 'Storage usage',
          value: '0 MB',
          detail: 'No generated recap in this session',
          icon: HardDrive,
          tone: 'amber' as const
        }
      ];

  return (
    <Panel className="p-5">
      <SectionHeader
        eyebrow="Signal analytics"
        title="AI intelligence layer"
        action={<StatusBadge label={summary ? 'live metrics' : 'standby'} tone={summary ? 'emerald' : 'slate'} pulse={!!summary} />}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <MetricTile key={card.label} {...card} />
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
        <ConfidenceRing value={confidence} />
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Motion spike graph</p>
            <p className="mt-1 text-sm font-medium text-white">Activity over extracted frames</p>
          </div>
          <Radar className="h-5 w-5 text-cyan-200" />
        </div>
        <div className="flex h-28 items-end gap-2">
          {[28, 42, 34, 76, 48, 82, 45, 62, 38, 90, 54, 44].map((height, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <div className="h-full w-full rounded-full bg-white/[0.04]">
                <div
                  className="mt-auto rounded-full bg-gradient-to-t from-cyan-400/35 to-violet-200"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Storage analytics</p>
            <p className="mt-1 text-sm font-medium text-white">Input versus recap footprint</p>
          </div>
          <Clock3 className="h-5 w-5 text-amber-200" />
        </div>
        <div className="space-y-4">
          {[
            ['Original footage', summary ? 100 : 14],
            ['Generated recap', summary ? Math.max(8, Math.round(100 / summary.compressionRatio)) : 0]
          ].map(([label, width]) => (
            <div key={label as string}>
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-500">
                <span>{label as string}</span>
                <span>{width as number}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300" style={{ width: `${width}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
