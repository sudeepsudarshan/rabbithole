import Link from 'next/link';
import { getTopTemplates } from '@/lib/templates';
import EQBar from '@/components/ui/EQBar';
import Badge from '@/components/ui/Badge';

export default function TopFive() {
  const top5 = getTopTemplates(5);

  return (
    <section
      className="py-20 px-6"
      style={{ borderTop: '1px solid var(--border-hairline)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl text-ink-primary mb-2">Top 5 by Engagement</h2>
            <p className="text-ink-muted text-sm font-sans">Ranked by Engagement Quotient score</p>
          </div>
        </div>

        <div className="chapter-ornament mb-10">
          <span className="chapter-ornament-dot" />
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-5 rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border-hairline)' }}
        >
          {top5.map((template, i) => (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              className="p-5 space-y-4 hover:bg-[var(--state-hover)] transition-colors group"
              style={{
                background: 'var(--bg-elevated)',
                borderRight: i < top5.length - 1 ? '1px solid var(--border-hairline)' : undefined,
              }}
            >
              <div className="flex items-start justify-between">
                <span
                  className="font-serif text-5xl font-bold leading-none"
                  style={{ color: `${template.accentColor}40` }}
                >
                  {i + 1}
                </span>
                <Badge variant="accent" accentColor={template.accentColor}>
                  EQ {template.eqScore}
                </Badge>
              </div>
              <div>
                <h3 className="font-serif text-base text-ink-primary group-hover:text-accent-rust transition-colors leading-tight mb-1">
                  {template.name}
                </h3>
                <p className="font-mono text-[0.62rem] text-ink-muted line-clamp-2">
                  {template.tagline}
                </p>
              </div>
              <EQBar score={template.eqScore} showLabel={false} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
