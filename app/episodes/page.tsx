import { Metadata } from 'next';
import Link from 'next/link';
import { EPISODES } from '@/lib/episodes';
import { getTemplateById } from '@/lib/templates';
import Badge from '@/components/ui/Badge';
import { BookOpen, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Episodes',
  description:
    'Deep-dive chapter-based explorations. From Sarajevo 1914 to AI consciousness — each episode goes somewhere unexpected.',
};

export default function EpisodesPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-accent-rust" />
          <span className="font-mono text-[0.65rem] text-ink-muted tracking-widest">
            {EPISODES.length} Episodes
          </span>
        </div>
        <h1 className="font-serif text-4xl text-ink-primary mb-3">
          Episode Library
        </h1>
        <p className="text-ink-muted text-sm font-sans leading-relaxed max-w-xl">
          Chapter-based explorations with narration, facts, and AI dive conversations.
          Each episode follows a template's conversational rhythm from start to finish.
        </p>
      </div>

      {/* Episode list */}
      <div className="space-y-3">
        {EPISODES.map(episode => {
          const template = getTemplateById(episode.templateId);
          return (
            <Link
              key={episode.id}
              href={`/episodes/${episode.slug}`}
              className="group block rounded-lg border border-hairline bg-elevated p-6 hover:border-ink-line transition-colors duration-150"
              style={template ? { borderTopColor: `${template.accentColor}50`, borderTopWidth: '2px' } : {}}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    {template && (
                      <Badge variant="accent" accentColor={template.accentColor}>
                        {template.name}
                      </Badge>
                    )}
                    <span className="font-mono text-[0.65rem] text-ink-muted">
                      {episode.chapters.length} chapters
                    </span>
                  </div>

                  <h2 className="font-serif text-xl text-ink-primary group-hover:text-accent-rust transition-colors mb-2 leading-snug">
                    {episode.title}
                  </h2>

                  <p className="text-sm text-ink-muted font-sans mb-3 leading-relaxed line-clamp-2">
                    {episode.subtitle}
                  </p>

                  <span className="font-mono text-[0.65rem] text-ink-faint">
                    {episode.dateContext}
                  </span>
                </div>

                <ChevronRight className="w-5 h-5 text-ink-muted group-hover:text-accent-rust transition-colors shrink-0 mt-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
