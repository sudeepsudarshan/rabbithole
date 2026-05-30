import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CARDS = [
  {
    label: 'INSTANT',
    title: "I'm curious. Show me something.",
    body: 'Random Sparks from across the world today. Pulled from science, history, comedy, money, space — whatever\'s interesting.',
    cta: 'Start',
    href: '/sparks',
    accentColor: '#C9582A',
  },
  {
    label: 'PERSONAL',
    title: 'Build my rabbit hole.',
    body: "Pick what you're into, how you want to feel, and the Lenses you trust. We assemble the rest.",
    cta: 'Build it',
    href: '/explore',
    accentColor: '#D4A437',
  },
];

export default function BrowseCurateCards() {
  return (
    <section className="px-5 pb-10 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CARDS.map(({ label, title, body, cta, href, accentColor }) => (
          <Link
            key={label}
            href={href}
            className="group block rounded-xl border p-6 transition-all hover:border-[var(--ink-line)] active:scale-[0.98]"
            style={{
              borderColor: 'var(--border-hairline)',
              background: 'var(--bg-elevated)',
              borderTopColor: `${accentColor}60`,
              borderTopWidth: '2px',
            }}
          >
            <p
              className="font-mono text-[0.6rem] tracking-widest uppercase mb-3"
              style={{ color: accentColor }}
            >
              {label}
            </p>
            <h2
              className="font-serif text-[1.15rem] leading-snug mb-3 group-hover:text-[var(--accent-rust)] transition-colors"
              style={{ color: 'var(--ink-primary)' }}
            >
              {title}
            </h2>
            <p
              className="font-sans text-sm leading-relaxed mb-5"
              style={{ color: 'var(--ink-muted)' }}
            >
              {body}
            </p>
            <div
              className="flex items-center gap-1.5 font-mono text-[0.65rem] tracking-wide transition-colors"
              style={{ color: accentColor }}
            >
              {cta} <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
