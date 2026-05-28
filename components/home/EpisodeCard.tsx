import Link from 'next/link';
import { BookOpen, MessageCircle } from 'lucide-react';
import { Episode } from '@/types/episode';
import { getTemplateById } from '@/lib/templates';

interface EpisodeCardProps {
  episode: Episode;
  featured?: boolean;
}

// Approximate read time from chapter narration word count
function estimateReadTime(episode: Episode): string {
  const words = episode.chapters.reduce((acc, ch) => {
    return acc + ch.content.narration.replace(/<[^>]+>/g, '').split(/\s+/).length;
  }, 0);
  const mins = Math.round(words / 200);
  return `${mins}–${mins + 3} min`;
}

export default function EpisodeCard({ episode, featured = false }: EpisodeCardProps) {
  const template = getTemplateById(episode.templateId);
  const accentColor = template?.accentColor ?? '#E27044';
  const readTime = estimateReadTime(episode);

  if (featured) {
    return (
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-hairline)' }}
      >
        {/* Accent top stripe */}
        <div className="h-1 w-full" style={{ background: accentColor }} />
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.6rem] font-mono uppercase tracking-wider border"
              style={{ color: accentColor, borderColor: `${accentColor}50`, background: `${accentColor}12` }}
            >
              {template?.name ?? 'Episode'}
            </span>
            <span className="font-mono text-[0.6rem] text-ink-faint">{readTime} read</span>
          </div>

          <h2 className="font-serif text-2xl md:text-3xl text-ink-primary leading-tight mb-3">
            {episode.title}
          </h2>
          <p className="font-serif italic text-ink-secondary leading-relaxed mb-6 text-sm md:text-base">
            {episode.subtitle}
          </p>

          <p className="font-mono text-[0.6rem] text-ink-faint mb-6">{episode.dateContext}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/episodes/${episode.slug}`}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all active:scale-95"
              style={{ background: accentColor, color: '#000' }}
            >
              <BookOpen className="w-4 h-4" />
              Read episode
            </Link>
            <Link
              href={`/episodes/${episode.slug}?dive=open`}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border transition-all hover:bg-[var(--state-hover)] active:scale-95"
              style={{ borderColor: 'var(--border-hairline)', color: 'var(--ink-secondary)' }}
            >
              <MessageCircle className="w-4 h-4" />
              Ask the AI
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/episodes/${episode.slug}`}
      className="group block rounded-xl border p-4 transition-all hover:border-[var(--border-ink)] active:scale-[0.98]"
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-hairline)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.55rem] font-mono uppercase tracking-wider"
          style={{ color: accentColor, background: `${accentColor}12` }}
        >
          {template?.name ?? 'Episode'}
        </span>
        <span className="font-mono text-[0.55rem] text-ink-faint">{readTime}</span>
      </div>
      <h3 className="font-serif text-base text-ink-primary leading-snug mb-1.5 group-hover:text-accent-rust transition-colors">
        {episode.title}
      </h3>
      <p className="font-serif italic text-[0.8rem] text-ink-muted leading-snug line-clamp-2">
        {episode.subtitle}
      </p>
    </Link>
  );
}
