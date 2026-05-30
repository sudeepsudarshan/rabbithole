// TODO: Replace regex XML parser with fast-xml-parser if accuracy issues arise in production
import type { SourceId } from '@/types/sources';
import type { TopicId } from '@/types/topics';
import type { TrendItem } from '@/types/trends';
import { slugify, logger } from '@/lib/utils';
import { sourceCache, TTL } from './cache';

const ARXIV_CATEGORIES: Array<{ cat: string; topicId: TopicId }> = [
  { cat: 'astro-ph', topicId: 'space' },
  { cat: 'physics',  topicId: 'science' },
  { cat: 'q-bio',    topicId: 'nature' },
  { cat: 'cs.AI',    topicId: 'ai' },
  { cat: 'cs.LG',    topicId: 'ai' },
  { cat: 'cond-mat', topicId: 'science' },
];

function extractField(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m?.[1]?.replace(/<[^>]+>/g, '').trim() ?? '';
}

function parseAtomEntries(xml: string, topicId: TopicId): TrendItem[] {
  const items: TrendItem[] = [];
  const entryPattern = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;

  while ((match = entryPattern.exec(xml)) !== null) {
    const block = match[1];
    const title = extractField(block, 'title');
    const summary = extractField(block, 'summary');
    const link = extractField(block, 'id');   // arXiv uses <id> for the abs URL
    const published = extractField(block, 'published');

    if (!title || !summary || !link) continue;

    // Skip math-heavy abstracts
    if ((summary.match(/\$/g) ?? []).length > 3) continue;

    items.push({
      id: `arxiv-${slugify(title).slice(0, 40)}`,
      topicId,
      title,
      summary: summary.slice(0, 400),
      source: 'arxiv',
      sourceLabel: 'arXiv',
      url: link,
      publishedAt: published ? new Date(published) : new Date(),
      score: 0.75,
      registerHint: topicId === 'ai' ? 'education' : 'awe',
    });
  }

  return items;
}

export async function fetchArxivSource(): Promise<TrendItem[]> {
  const cached = sourceCache.get('arxiv');
  if (cached) return cached;

  const allItems: TrendItem[] = [];

  await Promise.allSettled(
    ARXIV_CATEGORIES.map(async ({ cat, topicId }) => {
      try {
        const res = await fetch(`http://export.arxiv.org/rss/${cat}`, {
          headers: { 'User-Agent': 'DTRH-App/1.0' },
        });
        if (!res.ok) return;
        const xml = await res.text();
        allItems.push(...parseAtomEntries(xml, topicId));
      } catch (err) {
        logger.warn(`arXiv category ${cat} failed:`, err);
      }
    })
  );

  sourceCache.set('arxiv', allItems, TTL.SOURCE);
  return allItems;
}
