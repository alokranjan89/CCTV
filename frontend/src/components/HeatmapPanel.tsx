import { motion } from 'framer-motion';
import { Eye, Radar } from 'lucide-react';

const zones = [
  {
    label: 'Entry corridor',
    state: 'Active',
    badge: 'bg-sky-400/20 text-sky-200'
  },
  {
    label: 'Vehicle approach',
    state: 'Monitored',
    badge: 'bg-orange-400/15 text-orange-300'
  },
  {
    label: 'Storage zone',
    state: 'Restricted',
    badge: 'bg-red-400/15 text-red-300'
  }
];

const hotspots = [
  {
    position: 'left-[12%] top-[18%]',
    size: 'h-10 w-10',
    glow: 'border-sky-300/30 bg-sky-300/10'
  },
  {
    position: 'right-[14%] top-[30%]',
    size: 'h-16 w-16',
    glow: 'border-orange-400/30 bg-orange-400/10'
  },
  {
    position: 'left-[30%] bottom-[20%]',
    size: 'h-14 w-14',
    glow: 'border-red-400/25 bg-red-400/10'
  }
];

function ZoneCard({
  label,
  state,
  badge
}: {
  label: string;
  state: string;
  badge: string;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-white">
            {label}
          </h4>

          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-slate-500">
            {state}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${badge}`}
        >
          {state}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        AI attention is currently focused on this area.
      </p>
    </article>
  );
}

export default function HeatmapPanel() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        rounded-[36px] border border-white/10
        bg-[#070B17]/90 p-6 backdrop-blur-xl
      "
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Surveillance heatmap
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Motion Intelligence Overlay
          </h2>
        </div>

        <div
          className="
            inline-flex items-center gap-2 rounded-full
            border border-white/10 bg-slate-900/70
            px-4 py-2 text-xs uppercase
            tracking-[0.22em] text-slate-300
          "
        >
          <Radar className="h-4 w-4 text-cyan-300" />
          Sensor fusion
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {/* Heatmap */}
        <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-5">
          <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.06),transparent_32%)]" />

            {/* Hotspots */}
            {hotspots.map((spot, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.08, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
                className={`
                  absolute rounded-full border
                  ${spot.position}
                  ${spot.size}
                  ${spot.glow}
                `}
              />
            ))}

            {/* Scan lines */}
            <motion.div
              animate={{
                x: ['-20%', '120%']
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="
                absolute top-[30%] h-[2px] w-40
                bg-gradient-to-r from-transparent
                via-sky-300/70 to-transparent
              "
            />
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4 rounded-[28px] bg-slate-950/80 p-5 ring-1 ring-white/5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Zone definitions
              </p>

              <h3 className="mt-2 text-lg font-semibold text-white">
                Active security sectors
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-300">
              <Eye className="h-4 w-4 text-sky-300" />
              99% coverage
            </div>
          </div>

          {/* Zone Cards */}
          <div className="space-y-3">
            {zones.map((zone) => (
              <ZoneCard key={zone.label} {...zone} />
            ))}
          </div>

          {/* Telemetry */}
          <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">
              Telemetry tail
            </p>

            <div className="mt-4 space-y-3">
              {[
                ['Threat vector stabilization', 'Stable'],
                ['Processing cadence', 'Real-time']
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl bg-slate-950/80 p-3"
                >
                  <span className="text-sm text-slate-300">
                    {label}
                  </span>

                  <strong className="text-sm text-white">
                    {value}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}