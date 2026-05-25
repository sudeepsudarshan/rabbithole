import Link from 'next/link';
import { getTopTemplates } from '@/lib/templates';
import EQBar from '@/components/ui/EQBar';
import Badge from '@/components/ui/Badge';

export default function TopFive() {
  const top5 = getTopTemplates(5);

  return (
    <section className="py-20 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <h2 className="font-serif italic text-3xl text-paper mb-2">Top 5 by Engagement</h2>
            <p className="text-paper-faint text-sm font-sans">Ranked by Engagement Quotient score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-border rounded-xl overflow-hidden">
          {top5.map((template, i) => (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              className="bg-ink-50 p-5 space-y-4 hover:bg-ink-100 transition-colors group"
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
                <h3 className="font-serif italic text-base text-paper group-hover:text-gold transition-colors leading-tight mb-1">
                  {template.name}
                </h3>
                <p className="font-mono text-[0.62rem] text-paper-faint line-clamp-2">
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
