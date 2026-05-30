import type { TopicId } from '@/types/topics';
import type { TrendItem } from '@/types/trends';
import { slugify, logger } from '@/lib/utils';
import { sourceCache, TTL } from './cache';

interface HNItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  time: number;
  text?: string;
}

function inferTopicId(title: string): TopicId {
  const lower = title.toLowerCase();
  if (/\b(ai|llm|gpt|machine learning|neural|openai|anthropic|gemini)\b/.test(lower)) return 'ai';
  if (/\b(finance|economic|stock|market|fund|banking|crypto)\b/.test(lower)) return 'finance';
  if (/\b(science|biology|physics|chemistry|research|study)\b/.test(lower)) return 'science';
  return 'tech';
}

export async function fetchHackerNews(): Promise<TrendItem[]> {
  const cached = sourceCache.get('hackernews');
  if (cached) return cached;

  try {
    const idsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
      headers: { 'User-Agent': 'DTRH-App/1.0' },
    });
    if (!idsRes.ok) throw new Error(`HTTP ${idsRes.status}`);

    const ids = await idsRes.json() as number[];
    const top30 = ids.slice(0, 30);

    const itemResults = await Promise.allSettled(
      top30.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
          headers: { 'User-Agent': 'DTRH-App/1.0' },
        }).then(r => r.json() as Promise<HNItem>)
      )
    );

    const items: TrendItem[] = itemResults
      .filter((r): r is PromiseFulfilledResult<HNItem> => r.status === 'fulfilled' && !!r.value?.url)
      .map(({ value: item }): TrendItem => ({
        id: `hackernews-${slugify(item.title).slice(0, 40)}`,
        topicId: inferTopicId(item.title),
        title: item.title,
        summary: item.text ? item.text.replace(/<[^>]+>/g, '').slice(0, 300) : item.title,
        source: 'hackernews',
        sourceLabel: 'Hacker News',
        url: item.url!,
        publishedAt: new Date(item.time * 1000),
        score: Math.min(item.score / 500, 1),
        registerHint: 'education',
      }));

    sourceCache.set('hackernews', items, TTL.SOURCE);
    return items;
  } catch (err) {
    logger.warn('HackerNews fetch failed:', err);
    return [];
  }
}
