import Link from 'next/link';
import { Sparkles, BookOpen, MessageCircle } from 'lucide-react';

const FORMATS = [
  {
    icon: Sparkles,
    title: 'Sparks',
    subtitle: 'Templates 01–08',
    description: 'High-energy micro-episodes for the curiosity-driven. Perfect for quick hits of mind-expanding content.',
    href: '/sparks',
    accentColor: '#D85A30',
  },
  {
    icon: BookOpen,
    title: 'Episodes',
    subtitle: 'Templates 09–14',
    description: 'Deep-dive chapter-based explorations. Science, body horror, conspiracy, and the paradoxes of the mind.',
    href: '/episodes',
    accentColor: '#C9A84C',
  },
  {
    icon: MessageCircle,
    title: 'Dive',
    subtitle: 'Templates 15–20',
    description: 'Freeform conversations with a philosophical edge. Go anywhere — history, lost worlds, the hard problem of consciousness.',
    href: '/dive',
    accentColor: '#7F77DD',
  },
];

export default function FormatCards() {
  return (
    <section className="py-20 px-6 border-t border-border bg-ink-50/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif italic text-3xl text-paper mb-3">Three formats, one obsession</h2>
          <p className="text-paper-faint text-sm font-sans">Find the depth that matches your curiosity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FORMATS.map(({ icon: Icon, title, subtitle, description, href, accentColor }) => (
            <Link
              key={title}
              href={href}
              className="group block rounded-xl border border-border bg-ink-50 p-6 hover:border-border-strong transition-all duration-200 hover:-translate-y-0.5"
              style={{ borderTopColor: `${accentColor}40`, borderTopWidth: '2px' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
              >
                <Icon className="w-5 h-5" style={{ color: accentColor }} />
              </div>
              <h3 className="font-serif italic text-xl text-paper mb-1 group-hover:text-gold transition-colors">
                {title}
              </h3>
              <p className="font-mono text-[0.65rem] mb-3" style={{ color: accentColor }}>
                {subtitle}
              </p>
              <p className="text-sm text-paper-faint font-sans leading-relaxed">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
