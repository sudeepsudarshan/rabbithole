import { Sparkles, BookOpen, MessageCircle } from 'lucide-react';

const STEPS = [
  {
    icon: Sparkles,
    title: 'Spark',
    description: '60-second vertical cards. One jaw-dropping fact, one AI exchange, one hook. The TikTok reel for intellectual curiosity.',
    number: '01',
    accentColor: '#C9582A',
  },
  {
    icon: BookOpen,
    title: 'Episode',
    description: 'Chapter-based explorations with narration, fact strips, and insight boxes. 8-10 chapters of structured deep-dives.',
    number: '02',
    accentColor: '#D4A437',
  },
  {
    icon: MessageCircle,
    title: 'Dive',
    description: 'Freeform AI conversation at the bottom of every chapter. Follow your curiosity wherever it leads.',
    number: '03',
    accentColor: '#7A9CB0',
  },
];

export default function HowItWorks() {
  return (
    <section
      className="py-20 px-6"
      style={{ borderTop: '1px solid var(--border-hairline)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl text-ink-primary mb-3">How it works</h2>
          <p className="text-ink-muted font-sans text-sm">Three formats, one relentless curiosity engine.</p>
        </div>

        <div className="chapter-ornament mb-12">
          <span className="chapter-ornament-dot" />
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border-hairline)' }}
        >
          {STEPS.map(({ icon: Icon, title, description, number, accentColor }, idx) => (
            <div
              key={title}
              className="p-8 space-y-4"
              style={{
                background: 'var(--bg-elevated)',
                borderRight: idx < STEPS.length - 1 ? '1px solid var(--border-hairline)' : undefined,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center"
                  style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: accentColor }} />
                </div>
                <span className="font-mono text-[0.65rem] text-ink-faint">{number}</span>
              </div>
              <h3 className="font-serif text-xl text-ink-primary">{title}</h3>
              <p className="text-sm text-ink-muted font-sans leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
