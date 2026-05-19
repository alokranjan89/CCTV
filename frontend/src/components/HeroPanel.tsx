import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Camera,
  Gauge,
  MapPin,
  Play,
  RadioTower,
  ShieldCheck,
  Timer
} from 'lucide-react';

const cameraFeeds = [
  { name: 'North gate', status: 'Tracking', tone: 'text-cyan-200' },
  { name: 'Parking lane', status: 'Motion', tone: 'text-amber-200' },
  { name: 'Store room', status: 'Clear', tone: 'text-emerald-200' }
];

const eventMetrics = [
  { label: 'Objects grouped', value: '128', icon: Gauge },
  { label: 'Timeline saved', value: '94%', icon: Timer },
  { label: 'Review queue', value: '06', icon: AlertTriangle }
];

function FeedCard({ name, status, tone }: { name: string; status: string; tone: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-white">{name}</span>
        </div>
        <span className={`text-xs uppercase ${tone}`}>{status}</span>
      </div>
    </div>
  );
}

export default function HeroPanel() {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.35fr_0.75fr]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f19] shadow-2xl shadow-black/30"
      >
        <img
          src="/cctv-cover.png"
          alt="CCTV recap visual"
          className="absolute inset-0 h-full w-full object-cover opacity-42"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,13,0.98)_0%,rgba(6,8,13,0.82)_38%,rgba(6,8,13,0.38)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:38px_38px] opacity-35" />

        <motion.div
          animate={{ y: ['-20%', '120%'] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-transparent via-cyan-200/12 to-transparent"
        />

        <div className="relative z-10 grid min-h-[520px] gap-8 p-5 sm:p-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs uppercase text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                System armed
              </div>

              <h3 className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-5xl">
                Review every incident without watching every minute.
              </h3>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                The engine extracts moving objects, compresses timelines, and renders a single recap clip with timestamps for faster investigation.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {eventMetrics.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
                    <Icon className="h-5 w-5 text-amber-200" />
                    <p className="mt-4 text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-end">
            <div className="w-full rounded-2xl border border-white/10 bg-[#070b13]/86 p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-slate-500">Live camera matrix</p>
                  <h4 className="mt-1 text-xl font-semibold text-white">Sector B overview</h4>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-300 text-slate-950">
                  <Play className="h-5 w-5 fill-current" />
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black">
                <img src="/cctv-recap.png" alt="Recap interface preview" className="h-[230px] w-full object-cover opacity-85" />
              </div>

              <div className="mt-4 grid gap-3">
                {cameraFeeds.map((feed) => (
                  <FeedCard key={feed.name} {...feed} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="rounded-2xl border border-white/10 bg-[#090d16]/88 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-slate-500">Project workflow</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">What the app does</h3>
          </div>
          <RadioTower className="h-6 w-6 text-cyan-200" />
        </div>

        <div className="mt-6 space-y-3">
          {[
            ['Works best with fixed cameras', ShieldCheck, 'Ready'],
            ['Tracks moving object regions', MapPin, 'Engine'],
            ['Adds recap timestamps', Timer, 'Output'],
            ['Shortens manual review time', AlertTriangle, 'Goal']
          ].map(([label, Icon, value]) => {
            const TypedIcon = Icon as typeof ShieldCheck;
            return (
              <div key={label as string} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center gap-3">
                  <TypedIcon className="h-5 w-5 text-amber-200" />
                  <span className="text-sm text-slate-200">{label as string}</span>
                </div>
                <span className="text-xs uppercase text-slate-500">{value as string}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-cyan-300/8 p-5">
          <p className="text-sm leading-6 text-slate-300">
            Use a stable camera angle for the cleanest background subtraction and recap output.
          </p>
        </div>
      </motion.aside>
    </section>
  );
}
