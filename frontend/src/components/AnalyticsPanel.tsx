import {
  Activity,
  AlertTriangle,
  Clock3,
  Eye,
  ShieldCheck,
  Sparkles,
  LucideIcon
} from 'lucide-react';

type Card = {
  title: string;
  value: string;
  icon: LucideIcon;
  accent: string;
};

const cards: Card[] = [
  {
    title: 'Frames analyzed',
    value: '12,842',
    icon: Eye,
    accent: 'from-orange-500 to-sky-400'
  },
  {
    title: 'Active objects',
    value: '18',
    icon: Activity,
    accent: 'from-sky-400 to-indigo-500'
  },
  {
    title: 'AI confidence',
    value: '98.6%',
    icon: ShieldCheck,
    accent: 'from-emerald-400 to-sky-400'
  },
  {
    title: 'Motion intensity',
    value: 'High',
    icon: Sparkles,
    accent: 'from-orange-500 to-red-500'
  },
  {
    title: 'Suspicious events',
    value: '7',
    icon: AlertTriangle,
    accent: 'from-red-500 to-orange-400'
  },
  {
    title: 'Processing speed',
    value: '0.42s/frame',
    icon: Clock3,
    accent: 'from-slate-400 to-slate-200'
  }
];

function MetricCard({ card }: { card: Card }) {
  const Icon = card.icon;

  return (
    <article
      className="
        group relative overflow-hidden rounded-3xl
        border border-white/10 bg-slate-950/80
        p-5 transition-all duration-300
        hover:-translate-y-1 hover:border-white/20
      "
    >
      {/* Top Accent */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`}
      />

      {/* Soft Glow */}
      <div
        className={`
          absolute -right-10 -top-10 h-32 w-32 rounded-full
          bg-gradient-to-br ${card.accent}
          opacity-10 blur-3xl transition-opacity duration-300
          group-hover:opacity-20
        `}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{card.title}</p>

          <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">
            {card.value}
          </h3>
        </div>

        <div
          className={`
            flex h-12 w-12 items-center justify-center rounded-2xl
            bg-gradient-to-br ${card.accent}
            shadow-lg
          `}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Real-time analytics
        </span>

        <span className="text-xs uppercase tracking-widest text-slate-500">
          Live
        </span>
      </div>
    </article>
  );
}

export default function AnalyticsPanel() {
  return (
    <section
      className="
        rounded-[36px] border border-white/10
        bg-[#060816]/90 p-6 backdrop-blur-xl
      "
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            AI Metrics
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Platform Intelligence
          </h2>
        </div>

        <div
          className="
            flex items-center gap-2 rounded-full
            border border-emerald-400/20
            bg-emerald-400/10 px-4 py-2
            text-xs uppercase tracking-[0.2em]
            text-emerald-300
          "
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <MetricCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}