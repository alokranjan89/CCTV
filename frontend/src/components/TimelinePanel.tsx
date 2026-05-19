import { motion } from 'framer-motion';
import {
  Clock3,
  MapPin,
  ShieldCheck,
  LucideIcon
} from 'lucide-react';

/* =========================
   Types
========================= */

type EventItem = {
  time: string;
  label: string;
  status: string;
  tone: string;
  confidence: number;
};

/* =========================
   Data
========================= */

const events: EventItem[] = [
  {
    time: '00:23',
    label: 'Perimeter breach',
    status: 'Threat',
    tone: 'text-red-300',
    confidence: 96
  },
  {
    time: '01:08',
    label: 'Object cluster',
    status: 'Monitoring',
    tone: 'text-orange-300',
    confidence: 82
  },
  {
    time: '02:14',
    label: 'Person anomaly',
    status: 'Investigate',
    tone: 'text-sky-300',
    confidence: 91
  },
  {
    time: '03:52',
    label: 'Heat spike',
    status: 'Alert',
    tone: 'text-amber-300',
    confidence: 74
  }
];

/* =========================
   Animations
========================= */

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18
  },
  visible: {
    opacity: 1,
    y: 0
  }
};

/* =========================
   Components
========================= */

function LiveBadge() {
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

      <Clock3 className="h-4 w-4" />

      Live feed
    </div>
  );
}

function ConfidenceBar({
  confidence
}: {
  confidence: number;
}) {
  return (
    <div className="rounded-[24px] bg-slate-900/80 p-4">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>Confidence</span>

        <span className="text-white">
          {confidence}%
        </span>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.8 }}
          className="
            h-full rounded-full
            bg-gradient-to-r
            from-orange-500 to-sky-400
          "
        />
      </div>
    </div>
  );
}

function TimelineCard({
  event
}: {
  event: EventItem;
}) {
  return (
    <motion.article
      variants={fadeUp}
      className="
        rounded-[30px] border border-white/10
        bg-slate-950/80 p-5
        backdrop-blur-xl
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
            {event.time}
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {event.label}
          </h3>
        </div>

        <span
          className={`
            rounded-full bg-white/5 px-3 py-1
            text-[11px] font-semibold uppercase
            tracking-[0.22em] ${event.tone}
          `}
        >
          {event.status}
        </span>
      </div>

      {/* Content */}
      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_0.68fr]">
        {/* Description */}
        <div className="rounded-[24px] bg-slate-900/80 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MapPin className="h-4 w-4 text-sky-300" />

            Tactical zone: Sector B
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            AI grouped multiple motion vectors and elevated this checkpoint as a sustained anomaly.
          </p>
        </div>

        {/* Confidence */}
        <ConfidenceBar confidence={event.confidence} />
      </div>
    </motion.article>
  );
}

/* =========================
   Main Component
========================= */

export default function TimelinePanel() {
  return (
    <section
      aria-labelledby="timeline-heading"
      className="
        rounded-[36px] border border-white/5
        bg-[#060816]/90 p-6
        backdrop-blur-xl
      "
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Smart timeline
          </p>

          <h2
            id="timeline-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-white"
          >
            Event clustering
          </h2>
        </div>

        <LiveBadge />
      </div>

      {/* Timeline */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {events.map((event) => (
          <TimelineCard
            key={event.time}
            event={event}
          />
        ))}
      </motion.div>
    </section>
  );
}