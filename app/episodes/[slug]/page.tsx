import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EPISODES } from '@/lib/episodes';
import { getTemplateById } from '@/lib/templates';
import EpisodePageClient from './EpisodePageClient';

interface Props {
  params: { slug: string };
  searchParams: { chapter?: string };
}

export async function generateStaticParams() {
  return EPISODES.map(e => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const episode = EPISODES.find(e => e.slug === params.slug);
  if (!episode) return {};

  const template = getTemplateById(episode.templateId);
  return {
    title: episode.title,
    description: episode.subtitle,
    openGraph: {
      title: episode.title,
      description: episode.subtitle,
    },
  };
}

export default function EpisodePage({ params, searchParams }: Props) {
  const episode = EPISODES.find(e => e.slug === params.slug);
  if (!episode) notFound();

  const template = getTemplateById(episode.templateId);
  if (!template) notFound();

  const initialChapter = Math.max(
    1,
    Math.min(
      episode.chapters.length,
      parseInt(searchParams.chapter || '1', 10) || 1
    )
  );

  return (
    <EpisodePageClient
      episode={episode}
      template={template}
      initialChapter={initialChapter}
    />
  );
}
