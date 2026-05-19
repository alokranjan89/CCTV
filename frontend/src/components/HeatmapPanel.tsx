import { motion } from 'framer-motion';
import { FileVideo, Maximize2, TimerReset } from 'lucide-react';
import { ResultSummary } from '../types';

function percent(input: number, output: number) {
  if (!input) return 0;
  return Math.min(100, Math.round((output / input) * 100));
}

export default function HeatmapPanel({
  summary
}: {
  summary: ResultSummary | null;
}) {
  const retained = summary
    ? percent(summary.input.durationSeconds, summary.output.durationSeconds)
    : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl border border-white/10 bg-[#090d16]/90 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase text-cyan-200">Review reduction</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Recap output compared with source footage
          </h2>
        </div>
        <span className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs uppercase text-slate-400">
          {summary ? `${retained}% retained` : 'No result yet'}
        </span>
      </div>

      {summary ? (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Original footage</span>
              <span>{Math.round(summary.input.durationSeconds)}s</span>
            </div>
            <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-full rounded-full bg-slate-500/70" />
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
              <span>Generated recap</span>
              <span>{Math.round(summary.output.durationSeconds)}s</span>
            </div>
            <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-amber-300"
                style={{ width: `${retained}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3">
            {[
              {
                label: 'Resolution',
                value: `${summary.output.width} x ${summary.output.height}`,
                icon: Maximize2
              },
              {
                label: 'Output frames',
                value: summary.output.frameCount.toLocaleString(),
                icon: FileVideo
              },
              {
                label: 'Compression',
                value: `${summary.compressionRatio}x`,
                icon: TimerReset
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-cyan-200" />
                    <div>
                      <p className="text-xs uppercase text-slate-500">{item.label}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-sm leading-6 text-slate-400">
          This section will compare original duration against generated recap
          duration after you process a video.
        </div>
      )}
    </motion.section>
  );
}
