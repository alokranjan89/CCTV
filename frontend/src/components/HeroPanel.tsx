import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Cpu,
  MapPin,
  ShieldCheck,
  Tv,
  LucideIcon
} from 'lucide-react';

/* =========================
   Data
========================= */

type Stat = {
  label: string;
  value: string;
  tone: string;
};

type Insight = {
  label: string;
  value: string;
  icon: LucideIcon;
};

const stats: Stat[] = [
  {
    label: 'Motion detection',
    value: 'Active',
    tone: 'text-emerald-300'
  },
  {
    label: 'Suspicious zones',
    value: '4',
    tone: 'text-orange-300'
  },
  {
    label: 'AI confidence',
    value: '98.6%',
    tone: 'text-sky-300'
  }
];

const insights: Insight[] = [
  {
    label: 'Followed target',
    value: '22m',
    icon: MapPin
  },
  {
    label: 'Threat cluster',
    value: '3',
    icon: AlertTriangle
  },
  {
    label: 'Frame parse',
    value: '12K',
    icon: Cpu
  }
];

/* =========================
   Animations
========================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24
  },
  visible: {
    opacity: 1,
    y: 0
  }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

/* =========================
   Reusable Components
========================= */

function SectionBadge({ text }: { text: string }) {
  return (
    <div
      className="
        inline-flex items-center gap-2 rounded-full
        border border-white/10 bg-slate-900/70
        px-4 py-2 text-xs uppercase
        tracking-[0.22em] text-slate-300
      "
    >
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      {text}
    </div>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <motion.article
      variants={fadeUp}
      className="
        rounded-3xl border border-white/5
        bg-slate-950/70 p-4
      "
    >
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
        {stat.label}
      </p>

      <h3 className={`mt-3 text-2xl font-semibold ${stat.tone}`}>
        {stat.value}
      </h3>
    </motion.article>
  );
}

function InsightCard({ item }: { item: Insight }) {
  const Icon = item.icon;

  return (
    <motion.article
      variants={fadeUp}
      className="
        flex items-start gap-4 rounded-3xl
        border border-white/5 bg-slate-900/70 p-4
      "
    >
      <div
        className="
          grid h-12 w-12 place-items-center rounded-2xl
          bg-slate-800/80 text-cyan-300
        "
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
          {item.label}
        </p>

        <h4 className="mt-2 text-lg font-semibold text-white">
          {item.value}
        </h4>
      </div>
    </motion.article>
  );
}

function OperatorFeed() {
  return (
    <motion.div
      variants={fadeUp}
      className="
        relative overflow-hidden rounded-[28px]
        border border-white/10 bg-slate-900/75 p-5
      "
    >
      {/* Top Accent */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-500/60 via-transparent to-sky-400/40" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
            Operator feed
          </p>

          <h3 className="mt-2 text-xl font-semibold text-white">
            Zone 7
          </h3>
        </div>

        <SectionBadge text="Live" />
      </div>

      {/* Feed */}
      <div
        className="
          relative mt-5 h-[260px] overflow-hidden
          rounded-[24px] border border-white/10
          bg-slate-950
        "
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.2),rgba(7,12,22,0.95))]" />

        {/* Scan Area */}
        <div className="absolute inset-10 rounded-3xl border border-orange-400/20" />

        {/* Object */}
        <motion.div
          animate={{
            scale: [1, 1.04, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
          className="
            absolute left-10 top-16 h-24 w-40 rounded-3xl
            border border-sky-300/20 bg-sky-300/10
          "
        />

        {/* Target */}
        <motion.div
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity
          }}
          className="
            absolute right-14 top-28 flex h-14 w-24
            items-center justify-center rounded-2xl
            border border-emerald-300/20
            bg-emerald-300/10 text-xs text-emerald-200
          "
        >
          Target
        </motion.div>

        {/* Scan Line */}
        <motion.div
          animate={{
            y: ['-100%', '300%']
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="
            absolute inset-x-0 h-16
            bg-gradient-to-b
            from-transparent
            via-white/10
            to-transparent
          "
        />
      </div>
    </motion.div>
  );
}

function ThreatPanel() {
  return (
    <motion.div
      variants={fadeUp}
      className="
        rounded-[32px] border border-white/5
        bg-slate-950/75 p-6
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Threat intelligence
          </p>

          <h3 className="mt-3 text-2xl font-semibold text-white">
            Active anomaly clusters
          </h3>
        </div>

        <div className="rounded-full bg-slate-900/70 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-300">
          6 min ago
        </div>
      </div>

      {/* Threat */}
      <div className="mt-6 rounded-[28px] bg-slate-900/80 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">
              Highest-risk event
            </p>

            <h4 className="mt-2 text-lg font-semibold text-white">
              Perimeter breach detected
            </h4>
          </div>

          <div className="rounded-full bg-red-500/15 px-3 py-1 text-sm text-red-300">
            Threat
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <ShieldCheck className="h-4 w-4 text-sky-300" />
          Confidence 96.2%
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 rounded-[28px] bg-slate-900/80 p-5">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Frame ingestion</span>

          <span className="text-white">
            12,842 / min
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '72%' }}
            transition={{ duration: 1 }}
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-sky-400"
          />
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-orange-400" />
          Realtime anomaly scanning
        </div>
      </div>
    </motion.div>
  );
}

/* =========================
   Main Component
========================= */

export default function HeroPanel() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]"
    >
      {/* Left */}
      <motion.div
        variants={fadeUp}
        className="
          relative overflow-hidden rounded-[36px]
          border border-white/5
          bg-[#060816]/90 p-6 backdrop-blur-xl
        "
      >
        {/* Glow */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-orange-500/10 to-transparent" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Live surveillance preview
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                Cinematic AI Command Center
              </h1>
            </div>

            <SectionBadge text="Recon active" />
          </div>

          {/* Stats */}
          <motion.div
            variants={stagger}
            className="mt-6 grid gap-4 md:grid-cols-3"
          >
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </motion.div>

          {/* Feed + Insights */}
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <OperatorFeed />

            <motion.div
              variants={stagger}
              className="
                grid gap-4 rounded-[28px]
                bg-slate-950/80 p-4
                border border-white/5
              "
            >
              {insights.map((item) => (
                <InsightCard key={item.label} item={item} />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right */}
      <ThreatPanel />
    </motion.section>
  );
}