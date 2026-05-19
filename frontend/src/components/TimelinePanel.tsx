import { CheckCircle2, Clock3, FileVideo, Settings2 } from 'lucide-react';
import { ResultSummary } from '../types';

function formatDuration(seconds?: number) {
  if (!seconds) return '-';
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return minutes > 0 ? `${minutes}m ${remaining}s` : `${remaining}s`;
}

export default function TimelinePanel({
  summary
}: {
  summary: ResultSummary | null;
}) {
  const steps = summary
    ? [
        {
          label: 'Source analyzed',
          detail: `${summary.input.frameCount.toLocaleString()} frames scanned from the uploaded file`,
          icon: FileVideo
        },
        {
          label: 'Summary settings applied',
          detail: `Interval ${summary.settings.interval}s, minimum event duration ${summary.settings.minDuration}s`,
          icon: Settings2
        },
        {
          label: 'Recap generated',
          detail: `${formatDuration(summary.input.durationSeconds)} reduced to ${formatDuration(summary.output.durationSeconds)}`,
          icon: CheckCircle2
        }
      ]
    : [];

  return (
    <section
      aria-labelledby="timeline-heading"
      className="rounded-2xl border border-white/10 bg-[#090d16]/90 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-cyan-200">Processing timeline</p>
          <h2 id="timeline-heading" className="mt-2 text-2xl font-semibold text-white">
            What happened in this run
          </h2>
        </div>
        <Clock3 className="h-5 w-5 text-slate-400" />
      </div>

      {summary ? (
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-300 text-slate-950">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-500">Step {index + 1}</p>
                    <h3 className="mt-1 text-base font-semibold text-white">{step.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{step.detail}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-sm leading-6 text-slate-400">
          The timeline will populate after the backend finishes a recap job.
        </div>
      )}
    </section>
  );
}
