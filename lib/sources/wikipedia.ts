import type { SourceId } from '@/types/sources';
import type { TrendItem } from '@/types/trends';
import { slugify, logger } from '@/lib/utils';
import { sourceCache, TTL } from './cache';

// ─── Wikipedia Top Reads ──────────────────────────────────────────────────────

interface WikiPageviewsResponse {
  items: Array<{
    articles: Array<{ article: string; views: number }>;
  }>;
}

async function fetchWikipediaTop(): Promise<TrendItem[]> {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');

  const res = await fetch(
    `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${yyyy}/${mm}/${dd}`,
    { headers: { 'User-Agent': 'DTRH-App/1.0' } }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json() as WikiPageviewsResponse;
  const articles = json.items?.[0]?.articles ?? [];

  const SKIP_PREFIXES = ['Main_Page', 'Special:', 'Wikipedia:', 'Portal:', 'Help:'];
  const filtered = articles.filter(a => !SKIP_PREFIXES.some(p => a.article.startsWith(p)));
  const maxViews = filtered[0]?.views ?? 1;

  return filtered.slice(0, 20).map((a): TrendItem => {
    const title = decodeURIComponent(a.article.replace(/_/g, ' '));
    return {
      id: `wikipedia_top-${slugify(title).slice(0, 40)}`,
      topicId: 'history',
      title,
      summary: `Currently trending on Wikipedia — ${a.views.toLocaleString()} reads today.`,
      source: 'wikipedia_top',
      sourceLabel: 'Wikipedia · Top Reads',
      url: `https://en.wikipedia.org/wiki/${a.article}`,
      publishedAt: new Date(),
      score: a.views / maxViews,
      registerHint: 'education',
    };
  });
}

// ─── Wikipedia On This Day ────────────────────────────────────────────────────

interface WikiOnThisDayResponse {
  onthisday: Array<{
    text: string;
    year: number;
    pages: Array<{
      title: string;
      extract: string;
      content_urls: { desktop: { page: string } };
    }>;
  }>;
}

async function fetchWikipediaOnThisDay(): Promise<TrendItem[]> {
  const now = new Date();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');

  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${mm}/${dd}`,
    { headers: { 'User-Agent': 'DTRH-App/1.0' } }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json() as WikiOnThisDayResponse;
  const events = json.onthisday ?? [];

  return events.slice(0, 15).map((event): TrendItem => {
    const page = event.pages?.[0];
    const title = event.text.length > 15
      ? event.text.slice(0, 120)
      : (page?.title ?? event.text);
    const summary = page?.extract ?? event.text;
    const url = page?.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(event.text)}`;

    return {
      id: `wikipedia_onthisday-${slugify(title).slice(0, 40)}`,
      topicId: 'history',
      title: `${event.year}: ${title}`,
      summary,
      source: 'wikipedia_onthisday',
      sourceLabel: 'Wikipedia · On This Day',
      url,
      publishedAt: new Date(),
      score: 0.7,
      registerHint: 'surprise',
    };
  });
}

// ─── Wikipedia Unusual Articles ───────────────────────────────────────────────

async function fetchWikipediaUnusual(): Promise<TrendItem[]> {
  const res = await fetch(
    'https://en.wikipedia.org/wiki/Wikipedia:Unusual_articles',
    { headers: { 'User-Agent': 'DTRH-App/1.0' } }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const html = await res.text();

  // Extract linked article titles from list items with wikilinks
  const linkPattern = /<li[^>]*>.*?<a[^>]+href="\/wiki\/([^":#]+)"[^>]*title="([^"]+)"[^>]*>/g;
  const items: TrendItem[] = [];
  const seen = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(html)) !== null && items.length < 30) {
    const article = match[1];
    const title = decodeURIComponent(match[2]);
    if (seen.has(article) || title.startsWith('Wikipedia:') || title.startsWith('Help:')) continue;
    seen.add(article);

    items.push({
      id: `wikipedia_unusual-${slugify(title).slice(0, 40)}`,
      topicId: 'oddities',
      title,
      summary: `A curated unusual Wikipedia article — things that shouldn't exist but somehow do.`,
      source: 'wikipedia_unusual',
      sourceLabel: 'Wikipedia · Unusual Articles',
      url: `https://en.wikipedia.org/wiki/${article}`,
      publishedAt: new Date(),
      score: 0.6,
      registerHint: 'surprise',
    });
  }

  return items;
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

type WikiSourceId = 'wikipedia_top' | 'wikipedia_onthisday' | 'wikipedia_unusual';

export async function fetchWikipediaSource(sourceId: SourceId): Promise<TrendItem[]> {
  const cached = sourceCache.get(sourceId);
  if (cached) return cached;

  const ttl = sourceId === 'wikipedia_unusual' ? TTL.WIKIPEDIA_UNUSUAL : TTL.SOURCE;

  try {
    let items: TrendItem[];
    switch (sourceId as WikiSourceId) {
      case 'wikipedia_top':      items = await fetchWikipediaTop(); break;
      case 'wikipedia_onthisday': items = await fetchWikipediaOnThisDay(); break;
      case 'wikipedia_unusual':  items = await fetchWikipediaUnusual(); break;
      default: return [];
    }
    sourceCache.set(sourceId, items, ttl);
    return items;
  } catch (err) {
    logger.warn(`Wikipedia source ${sourceId} failed:`, err);
    return [];
  }
}
