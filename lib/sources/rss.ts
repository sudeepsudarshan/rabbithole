// TODO: Replace regex XML parser with fast-xml-parser if accuracy issues arise in production
import type { SourceId } from '@/types/sources';
import type { TopicId } from '@/types/topics';
import type { EmotionalRegister } from '@/lib/registers';
import type { TrendItem } from '@/types/trends';
import { slugify, logger } from '@/lib/utils';
import { sourceCache, TTL } from './cache';

type RssSourceId = 'aeon' | 'quanta' | 'longreads' | 'lithub' | 'marginalian' | 'naturepicks' | 'phys_org';

const RSS_SOURCES: Record<RssSourceId, { feedUrl: string; topicIds: TopicId[]; registerHint: EmotionalRegister; label: string }> = {
  aeon:        { feedUrl: 'https://aeon.co/feed.rss',                      topicIds: ['philosophy', 'psychology', 'culture'],     registerHint: 'education',    label: 'Aeon' },
  quanta:      { feedUrl: 'https://www.quantamagazine.org/feed/',           topicIds: ['science', 'space', 'ai'],                  registerHint: 'awe',          label: 'Quanta Magazine' },
  longreads:   { feedUrl: 'https://longreads.com/feed/',                    topicIds: ['culture', 'biography', 'literature'],      registerHint: 'warmth',       label: 'Longreads' },
  lithub:      { feedUrl: 'https://lithub.com/feed/',                       topicIds: ['literature', 'film'],                      registerHint: 'inspiration',  label: 'Literary Hub' },
  marginalian: { feedUrl: 'https://www.themarginalian.org/feed/',           topicIds: ['philosophy', 'culture'],                   registerHint: 'inspiration',  label: 'The Marginalian' },
  naturepicks: { feedUrl: 'https://www.nature.com/nature.rss',              topicIds: ['science', 'nature'],                       registerHint: 'education',    label: 'Nature' },
  phys_org:    { feedUrl: 'https://phys.org/rss-feed/',                     topicIds: ['science', 'engineering', 'medicine'],      registerHint: 'education',    label: 'Phys.org' },
};

function stripCdata(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

interface RssItem {
  title: string;
  summary: string;
  url: string;
  pubDate: string;
}

function parseRssItems(xml: string): RssItem[] {
  const isAtom = xml.includes('<feed');
  const items: RssItem[] = [];

  if (isAtom) {
    const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
    let m: RegExpExecArray | null;
    while ((m = entryRe.exec(xml)) !== null) {
      const block = m[1];
      const title = stripCdata(block.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? '');
      const summary = stripCdata(block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)?.[1] ?? block.match(/<content[^>]*>([\s\S]*?)<\/content>/)?.[1] ?? '');
      const urlMatch = block.match(/<link[^>]+href="([^"]+)"/);
      const url = urlMatch?.[1] ?? '';
      const pubDate = block.match(/<updated[^>]*>([\s\S]*?)<\/updated>/)?.[1] ?? '';
      if (title && url) items.push({ title: stripHtml(title), summary: stripHtml(summary), url, pubDate });
    }
  } else {
    const itemRe = /<item>([\s\S]*?)<\/item>/g;
    let m: RegExpExecArray | null;
    while ((m = itemRe.exec(xml)) !== null) {
      const block = m[1];
      const title = stripCdata(block.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? '');
      const summary = stripCdata(block.match(/<description[^>]*>([\s\S]*?)<\/description>/)?.[1] ?? '');
      const urlDirect = block.match(/<link[^>]*>\s*(https?:\/\/[^\s<]+)\s*<\/link>/)?.[1] ?? '';
      const urlHref = block.match(/<link[^>]+href="([^"]+)"/)?.[1] ?? '';
      const url = urlDirect || urlHref;
      const pubDate = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/)?.[1] ?? '';
      if (title && url) items.push({ title: stripHtml(title), summary: stripHtml(summary), url, pubDate });
    }
  }

  return items;
}

export async function fetchRssSource(sourceId: SourceId): Promise<TrendItem[]> {
  const cached = sourceCache.get(sourceId);
  if (cached) return cached;

  const config = RSS_SOURCES[sourceId as RssSourceId];
  if (!config) return [];

  try {
    const res = await fetch(config.feedUrl, { headers: { 'User-Agent': 'DTRH-App/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const xml = await res.text();
    const parsed = parseRssItems(xml);
    const topicId = config.topicIds[0];

    const items: TrendItem[] = parsed.slice(0, 20).map((entry): TrendItem => ({
      id: `${sourceId}-${slugify(entry.title).slice(0, 40)}`,
      topicId,
      title: entry.title,
      summary: entry.summary.slice(0, 400) || entry.title,
      source: sourceId,
      sourceLabel: config.label,
      url: entry.url,
      publishedAt: entry.pubDate ? new Date(entry.pubDate) : new Date(),
      score: 0.8,
      registerHint: config.registerHint,
    }));

    sourceCache.set(sourceId, items, TTL.SOURCE);
    return items;
  } catch (err) {
    logger.warn(`RSS source ${sourceId} failed:`, err);
    return [];
  }
}
