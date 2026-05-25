import { Sparkles, BookOpen, MessageCircle } from 'lucide-react';

const STEPS = [
  {
    icon: Sparkles,
    title: 'Spark',
    description: '60-second vertical cards. One jaw-dropping fact, one AI exchange, one hook. The TikTok reel for intellectual curiosity.',
    number: '01',
  },
  {
    icon: BookOpen,
    title: 'Episode',
    description: 'Chapter-based explorations with narration, fact strips, and insight boxes. 8-10 chapters of structured deep-dives.',
    number: '02',
  },
  {
    icon: MessageCircle,
    title: 'Dive',
    description: 'Freeform AI conversation at the bottom of every chapter. Follow your curiosity wherever it leads.',
    number: '03',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif italic text-3xl text-paper mb-3">How it works</h2>
          <p className="text-paper-faint font-sans text-sm">Three formats, one relentless curiosity engine.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
          {STEPS.map(({ icon: Icon, title, description, number }) => (
            <div key={title} className="bg-ink-50 p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold-faint border border-gold/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <span className="font-mono text-[0.65rem] text-paper-faint">{number}</span>
              </div>
              <h3 className="font-serif italic text-xl text-paper">{title}</h3>
              <p className="text-sm text-paper-faint font-sans leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
