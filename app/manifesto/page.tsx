export const metadata = {
  title: 'Why We Built This — Down the Rabbit Hole',
};

export default function ManifestoPage() {
  return (
    <div className="min-h-[100svh] px-5 py-20 max-w-2xl mx-auto" style={{ background: 'var(--bg-page)' }}>
      <div className="flex items-center gap-3 mb-12">
        <div className="h-px w-8" style={{ background: 'var(--ink-faint)' }} />
        <span className="font-mono text-[0.65rem] tracking-widest uppercase" style={{ color: 'var(--ink-faint)' }}>
          Our manifesto
        </span>
        <div className="h-px w-8" style={{ background: 'var(--ink-faint)' }} />
      </div>

      <h1
        className="font-serif leading-tight mb-8"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--ink-primary)', letterSpacing: '-0.02em' }}
      >
        Why We Built This
      </h1>

      <div className="space-y-6">
        <p className="font-serif italic text-lg leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
          The internet is loud and mostly stressful. We wanted something different.
        </p>
        <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
          Full manifesto coming soon.
        </p>
      </div>
    </div>
  );
}
