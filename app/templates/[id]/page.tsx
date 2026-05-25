import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Clock, Zap } from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';
import { EPISODES } from '@/lib/episodes';
import RabbitHoleInput from '@/components/templates/RabbitHoleInput';
import Badge from '@/components/ui/Badge';
import EQBar from '@/components/ui/EQBar';
import TemplateCard from '@/components/templates/TemplateCard';

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  return TEMPLATES.map(t => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const template = TEMPLATES.find(t => t.id === params.id);
  if (!template) return {};

  return {
    title: `${template.name} — Template ${template.id}`,
    description: template.description,
  };
}

export default function TemplatePage({ params }: Props) {
  const template = TEMPLATES.find(t => t.id === params.id);

  if (!template) {
    redirect('/templates');
  }

  const relatedEpisode = EPISODES.find(e => e.templateId === template.id);
  const relatedTemplates = TEMPLATES.filter(
    t => t.id !== template.id && t.categories.some(c => template.categories.includes(c))
  ).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back */}
      <Link
        href="/templates"
        className="flex items-center gap-1.5 text-xs text-paper-faint hover:text-paper transition-colors font-sans mb-8"
      >
        <span>←</span> All templates
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="font-mono text-[0.65rem]"
            style={{ color: template.accentColor }}
          >
            Template {template.id}
          </span>
          <Badge variant="accent" accentColor={template.accentColor}>
            {template.badge}
          </Badge>
        </div>

        <h1
          className="font-serif italic text-4xl md:text-5xl text-paper leading-tight mb-4"
          style={{ borderLeft: `3px solid ${template.accentColor}`, paddingLeft: '1rem' }}
        >
          {template.name}
        </h1>

        <p className="font-serif italic text-lg text-paper-muted mb-4 leading-relaxed">
          {template.tagline}
        </p>

        <p className="font-sans text-sm text-paper-faint leading-relaxed max-w-2xl mb-6">
          {template.description}
        </p>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-paper-faint" />
            <span className="font-mono text-[0.65rem] text-paper-faint">
              {template.durationRange}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-gold" />
            <EQBar score={template.eqScore} className="w-32" />
          </div>
        </div>
      </div>

      {/* Main rabbit hole input */}
      <div
        className="rounded-xl border p-6 mb-10"
        style={{ borderColor: `${template.accentColor}30`, background: `${template.accentColor}08` }}
      >
        <h2 className="font-serif italic text-lg text-paper mb-4">
          Ask anything. Start the rabbit hole.
        </h2>
        <RabbitHoleInput template={template} />
      </div>

      {/* Example topics */}
      <div className="mb-10">
        <h2 className="font-mono text-[0.65rem] text-gold uppercase tracking-wide mb-4">
          Best topics for this template
        </h2>
        <div className="flex flex-wrap gap-2">
          {template.exampleTopics.map(topic => (
            <span
              key={topic}
              className="px-3 py-1.5 rounded-md text-xs font-sans border border-border text-paper-muted bg-ink-50 cursor-default"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Related episode */}
      {relatedEpisode && (
        <div className="mb-10 p-5 rounded-xl border border-border bg-ink-50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[0.65rem] text-gold uppercase tracking-wide block mb-2">
                Full episode available
              </span>
              <h3 className="font-serif italic text-lg text-paper mb-1">
                {relatedEpisode.title}
              </h3>
              <p className="text-xs text-paper-faint font-sans">
                {relatedEpisode.chapters.length} chapters · {relatedEpisode.dateContext}
              </p>
            </div>
            <Link href={`/episodes/${relatedEpisode.slug}`}>
              <button
                className="flex items-center gap-1.5 text-xs font-sans text-gold hover:text-gold-bright transition-colors whitespace-nowrap"
                aria-label={`Read episode: ${relatedEpisode.title}`}
              >
                Read episode
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Related templates */}
      {relatedTemplates.length > 0 && (
        <div>
          <h2 className="font-mono text-[0.65rem] text-gold uppercase tracking-wide mb-4">
            You might also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTemplates.map(t => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
