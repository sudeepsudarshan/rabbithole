import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BrowseCurateCards from '@/components/home/BrowseCurateCards';

export default function HomePage() {
  return (
    <div className="min-h-[100svh]" style={{ background: 'var(--bg-page)' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="px-5 pt-14 pb-10 max-w-3xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8" style={{ background: 'var(--ink-faint)' }} />
          <span className="font-mono text-[0.65rem] tracking-widest uppercase" style={{ color: 'var(--ink-faint)' }}>
            A nicer way to scroll
          </span>
          <div className="h-px w-8" style={{ background: 'var(--ink-faint)' }} />
        </div>

        {/* Brand headline */}
        <h1
          className="font-serif leading-none mb-6"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}
        >
          Down the<br />
          <span style={{ color: 'var(--accent-rust)' }}>Rabbit Hole</span><br />
          with AI
        </h1>

        {/* Subhead */}
        <p className="font-serif italic text-base leading-relaxed mb-3 max-w-lg" style={{ color: 'var(--ink-secondary)' }}>
          The internet is loud and mostly stressful. This isn't that.
        </p>
        <p className="font-serif italic text-base leading-relaxed mb-6 max-w-lg" style={{ color: 'var(--ink-secondary)' }}>
          We send you down rabbit holes that make the world feel bigger, stranger, funnier,
          and a little more wonderful — one Spark at a time.
        </p>

        {/* Manifesto negations */}
        <p
          className="font-mono text-[0.6rem] tracking-widest uppercase mb-10"
          style={{ color: 'var(--ink-faint)' }}
        >
          No doom · No outrage · No &ldquo;you won&rsquo;t believe&rdquo;
        </p>
      </section>

      {/* ── Browse / Curate cards ────────────────────────────── */}
      <BrowseCurateCards />

      {/* ── Refresh reminder ────────────────────────────────── */}
      <p
        className="text-center font-mono text-[0.58rem] tracking-widest uppercase pb-10"
        style={{ color: 'var(--ink-faint)' }}
      >
        Every Spark is new this week. &nbsp;Come back tomorrow — it refreshes.
      </p>

      {/* ── Manifesto link ──────────────────────────────────────── */}
      <div className="px-5 pb-10 text-center">
        <Link
          href="/manifesto"
          className="font-mono text-[0.65rem] tracking-widest uppercase transition-colors hover:text-[var(--ink-primary)]"
          style={{ color: 'var(--ink-faint)' }}
        >
          Why we built this <ArrowRight className="inline w-3 h-3" />
        </Link>
      </div>

      {/* ── Stats footer ──────────────────────────────────────── */}
      <section className="px-5 py-12 text-center" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="flex items-center justify-center gap-10 md:gap-16 mb-6">
          {[
            { value: '20', label: 'Templates' },
            { value: '40+', label: 'Sources' },
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
          &ldquo;The internet is loud. This isn&rsquo;t that.&rdquo;
        </p>
      </section>

    </div>
  );
}
