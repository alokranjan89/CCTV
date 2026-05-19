import {
  Clock3,
  FileVideo,
  Gauge,
  HardDrive,
  LucideIcon,
  TimerReset
} from 'lucide-react';
import { ResultSummary } from '../types';

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

function MetricCard({
  label,
  value,
  detail,
  icon: Icon
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-slate-500">{label}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{value}</h3>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-200/10 text-cyan-200">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-400">{detail}</p>
    </article>
  );
}

export default function AnalyticsPanel({
  summary
}: {
  summary: ResultSummary | null;
}) {
  const cards = summary
    ? [
        {
          label: 'Original duration',
          value: formatDuration(summary.input.durationSeconds),
          detail: `${summary.input.frameCount.toLocaleString()} frames at ${summary.input.fps} FPS`,
          icon: FileVideo
        },
        {
          label: 'Recap duration',
          value: formatDuration(summary.output.durationSeconds),
          detail: `${summary.compressionRatio}x shorter than the source`,
          icon: TimerReset
        },
        {
          label: 'Time saved',
          value: formatDuration(summary.timeSavedSeconds),
          detail: 'Estimated review time removed by the recap',
          icon: Clock3
        },
        {
          label: 'Processing time',
          value: formatDuration(summary.processingSeconds),
          detail: 'Backend runtime for this generated result',
          icon: Gauge
        },
        {
          label: 'Input size',
          value: formatBytes(summary.input.sizeBytes),
          detail: `${summary.input.width} x ${summary.input.height}`,
          icon: HardDrive
        },
        {
          label: 'Output size',
          value: formatBytes(summary.output.sizeBytes),
          detail: `${summary.output.width} x ${summary.output.height}`,
          icon: HardDrive
        }
      ]
    : [];

  return (
    <section className="rounded-2xl border border-white/10 bg-[#090d16]/90 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-cyan-200">Result analytics</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Measured after processing
          </h2>
        </div>
        <span className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs uppercase text-slate-400">
          {summary ? 'Ready' : 'Waiting'}
        </span>
      </div>

      {summary ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-sm leading-6 text-slate-400">
          Upload a video and generate a recap to see real duration, file size,
          frame count, compression ratio, and processing time.
        </div>
      )}
    </section>
  );
}
