import Link from 'next/link';
import { Sparkles, BookOpen, MessageCircle, ArrowRight } from 'lucide-react';
import { EPISODES } from '@/lib/episodes';
import EpisodeCard from '@/components/home/EpisodeCard';
import FormatCards from '@/components/home/FormatCards';

const [featured, ...rest] = EPISODES;
const moreEpisodes = rest.slice(0, 3);

export default function HomePage() {
  return (
    <div className="min-h-[100svh]" style={{ background: 'var(--bg-page)' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="px-5 pt-14 pb-10 max-w-3xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8" style={{ background: 'var(--ink-faint)' }} />
          <span className="font-mono text-[0.65rem] tracking-widest uppercase" style={{ color: 'var(--ink-faint)' }}>
            AI-guided curiosity
          </span>
          <div className="h-px w-8" style={{ background: 'var(--ink-faint)' }} />
        </div>

        {/* Brand headline */}
        <h1
          className="font-serif leading-none mb-4"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}
        >
          Down the<br />
          <span style={{ color: 'var(--accent-rust)' }}>Rabbit Hole</span><br />
          with AI
        </h1>

        {/* Tagline */}
        <p className="font-serif italic text-base leading-relaxed mb-8 max-w-lg" style={{ color: 'var(--ink-secondary)' }}>
          Start with any question. End somewhere completely unexpected.
          AI-guided micro-documentaries, built for rabbit-hole brains.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href="/sparks"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all active:scale-95"
            style={{ background: 'var(--accent-rust)', color: '#fff' }}
          >
            <Sparkles className="w-4 h-4" />
            Browse Sparks
          </Link>
          <Link
            href="/episodes"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border transition-all hover:bg-[var(--state-hover)] active:scale-95"
            style={{ borderColor: 'var(--border-hairline)', color: 'var(--ink-secondary)' }}
          >
            <BookOpen className="w-4 h-4" />
            Browse Episodes
          </Link>
        </div>

        {/* How it works strip */}
        <div
          className="rounded-xl p-4 border"
          style={{ background: 'var(--bg-sunken)', borderColor: 'var(--border-hairline)' }}
        >
          <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-2" style={{ color: 'var(--accent-mustard)' }}>
            How it works
          </p>
          <p className="text-sm font-sans leading-relaxed mb-3" style={{ color: 'var(--ink-secondary)' }}>
            Pick a myth, accident, or idea. Read a short chapter-based episode — then jump to the AI and ask
            anything about it. Every story has a deep dive waiting, and the AI knows the whole thing.
          </p>
          <div className="flex items-center gap-5 flex-wrap">
            {[
              { icon: BookOpen, label: 'Read episodes' },
              { icon: MessageCircle, label: 'Ask the AI' },
              { icon: Sparkles, label: 'Browse Sparks' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 font-mono text-[0.6rem] tracking-wide" style={{ color: 'var(--ink-muted)' }}>
                <Icon className="w-3 h-3" style={{ color: 'var(--accent-rust)' }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured episode ────────────────────────────────────── */}
      {featured && (
        <section className="px-5 pb-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest" style={{ color: 'var(--ink-faint)' }}>
              Featured episode
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--border-hairline)' }} />
          </div>
          <EpisodeCard episode={featured} featured />
        </section>
      )}

      {/* ── More rabbit holes ───────────────────────────────────── */}
      {moreEpisodes.length > 0 && (
        <section className="px-5 pb-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest" style={{ color: 'var(--ink-faint)' }}>
                More rabbit holes
              </span>
              <div className="h-px w-12" style={{ background: 'var(--border-hairline)' }} />
            </div>
            <Link
              href="/episodes"
              className="flex items-center gap-1 font-mono text-[0.65rem] tracking-wide transition-colors hover:text-[var(--ink-primary)]"
              style={{ color: 'var(--ink-muted)' }}
            >
              All episodes <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {moreEpisodes.map(ep => (
              <EpisodeCard key={ep.slug} episode={ep} />
            ))}
          </div>
        </section>
      )}

      {/* ── Format cards ────────────────────────────────────────── */}
      <FormatCards />

      {/* ── Stats + tagline footer ──────────────────────────────── */}
      <section className="px-5 py-12 text-center" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="flex items-center justify-center gap-10 md:gap-16 mb-6">
          {[
            { value: '20', label: 'Templates' },
            { value: String(EPISODES.length), label: 'Episodes' },
            { value: '∞', label: 'Rabbit Holes' },
          ].map(({ value, label }, i) => (
            <div key={label} className="flex items-center gap-10 md:gap-16">
              {i > 0 && <div className="h-6 w-px" style={{ background: 'var(--border-hairline)' }} />}
              <div className="text-center">
                <div className="font-serif text-2xl mb-0.5" style={{ color: 'var(--accent-rust)' }}>{value}</div>
                <div className="font-mono text-[0.65rem] tracking-wide" style={{ color: 'var(--ink-muted)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="font-serif italic text-sm" style={{ color: 'var(--ink-faint)' }}>
          &ldquo;Start with any question. End somewhere completely unexpected.&rdquo;
        </p>
      </section>

    </div>
  );
}
