import Link from 'next/link';
import { Sparkles, BookOpen, MessageCircle } from 'lucide-react';

const FORMATS = [
  {
    icon: Sparkles,
    title: 'Sparks',
    subtitle: 'Templates 01–08',
    description: 'High-energy micro-episodes for the curiosity-driven. Perfect for quick hits of mind-expanding content.',
    href: '/sparks',
    accentColor: '#C9582A',
  },
  {
    icon: BookOpen,
    title: 'Episodes',
    subtitle: 'Templates 09–14',
    description: 'Deep-dive chapter-based explorations. Science, body horror, conspiracy, and the paradoxes of the mind.',
    href: '/episodes',
    accentColor: '#D4A437',
  },
  {
    icon: MessageCircle,
    title: 'Dive',
    subtitle: 'Templates 15–20',
    description: 'Freeform conversations with a philosophical edge. Go anywhere — history, lost worlds, the hard problem of consciousness.',
    href: '/dive',
    accentColor: '#7A9CB0',
  },
];

export default function FormatCards() {
  return (
    <section
      className="py-20 px-6"
      style={{ borderTop: '1px solid var(--border-hairline)', background: 'var(--bg-sunken)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl text-ink-primary mb-3">Three formats, one obsession</h2>
          <p className="text-ink-muted text-sm font-sans">Find the depth that matches your curiosity.</p>
        </div>

        {/* Chapter ornament */}
        <div className="chapter-ornament mb-12">
          <span className="chapter-ornament-dot" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FORMATS.map(({ icon: Icon, title, subtitle, description, href, accentColor }) => (
            <Link
              key={title}
              href={href}
              className="group block rounded-lg border border-hairline bg-elevated p-6 hover:border-ink-line transition-colors duration-150"
              style={{ borderTopColor: `${accentColor}50`, borderTopWidth: '2px' }}
            >
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center mb-4"
                style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
              >
                <Icon className="w-5 h-5" style={{ color: accentColor }} />
              </div>
              <h3 className="font-serif text-xl text-ink-primary mb-1 group-hover:text-accent-rust transition-colors">
                {title}
              </h3>
              <p className="font-mono text-[0.65rem] mb-3" style={{ color: accentColor }}>
                {subtitle}
              </p>
              <p className="text-sm text-ink-muted font-sans leading-relaxed">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
