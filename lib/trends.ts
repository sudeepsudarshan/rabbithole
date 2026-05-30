import type { TopicId } from '@/types/topics';
import type { EmotionalRegister } from '@/lib/registers';
import type { TrendItem } from '@/types/trends';
import type { SourceId } from '@/types/sources';
import { getTopicById } from '@/lib/topics';
import { fetchSource, SOURCE_WEIGHTS } from '@/lib/sources/index';
import { feedCache, TTL } from '@/lib/sources/cache';
import { logger } from '@/lib/utils';

const QUALITY_FILTERS = {
  MIN_TITLE_LENGTH: 15,
  MIN_SUMMARY_LENGTH: 20,
  MIN_SCORE: 0.1,
  DOOM_PATTERN: /outrage|slammed|destroyed|crisis|disaster|worst ever|you won't believe/i,
  MAX_ITEMS_PER_SOURCE: 3,
  MAX_ITEMS_PER_TOPIC: 4,
  MIN_REGISTER_COUNT: 4,
  SOURCE_TIMEOUT_MS: 5000,
} as const;

function feedCacheKey(topics: TopicId[]): string {
  return [...topics].sort().join(',');
}

export async function fetchTrends(
  topics: TopicId[],
  options: { limit?: number; minRegisters?: EmotionalRegister[] } = {}
): Promise<TrendItem[]> {
  const cacheKey = feedCacheKey(topics);
  const cached = feedCache.get(cacheKey);
  if (cached) return cached;

  // 1. Collect deduplicated source IDs
  const seenSources = new Set<string>();
  const sourceIds: SourceId[] = [];
  for (const id of topics) {
    for (const src of (getTopicById(id)?.sources ?? [])) {
      if (!seenSources.has(src)) { seenSources.add(src); sourceIds.push(src as SourceId); }
    }
  }

  // 2. Fetch all sources in parallel with per-source timeout
  const results = await Promise.allSettled(
    sourceIds.map(sourceId => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), QUALITY_FILTERS.SOURCE_TIMEOUT_MS);
      // TODO: Thread AbortController signal into each adapter's fetch() calls for true cancellation
      return fetchSource(sourceId)
        .catch(err => { logger.warn(`Source ${sourceId} failed:`, err); return [] as TrendItem[]; })
        .finally(() => clearTimeout(timer));
    })
  );

  const allItems = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

  // 3. Quality filter
  const filtered = allItems.filter(item =>
    item.title.length >= QUALITY_FILTERS.MIN_TITLE_LENGTH &&
    item.summary.length > QUALITY_FILTERS.MIN_SUMMARY_LENGTH &&
    item.score >= QUALITY_FILTERS.MIN_SCORE &&
    !QUALITY_FILTERS.DOOM_PATTERN.test(item.title)
  );

  // 4. Sort by score × source weight
  const sorted = [...filtered].sort((a, b) => {
    const scoreA = a.score * (SOURCE_WEIGHTS[a.source] ?? 1.0);
    const scoreB = b.score * (SOURCE_WEIGHTS[b.source] ?? 1.0);
    return scoreB - scoreA;
  });

  // 5. Single-pass diversification
  const sourceCounts = new Map<SourceId, number>();
  const topicCounts = new Map<TopicId, number>();
  const registersSeen = new Set<EmotionalRegister>();
  const selected: TrendItem[] = [];
  const remainder: TrendItem[] = [];

  for (const item of sorted) {
    const sc = sourceCounts.get(item.source) ?? 0;
    const tc = topicCounts.get(item.topicId) ?? 0;
    if (sc >= QUALITY_FILTERS.MAX_ITEMS_PER_SOURCE || tc >= QUALITY_FILTERS.MAX_ITEMS_PER_TOPIC) {
      remainder.push(item);
      continue;
    }
    sourceCounts.set(item.source, sc + 1);
    topicCounts.set(item.topicId, tc + 1);
    if (item.registerHint) registersSeen.add(item.registerHint);
    selected.push(item);
  }

  // 6. Register diversity second pass — pull one extra item per missing register
  if (registersSeen.size < QUALITY_FILTERS.MIN_REGISTER_COUNT) {
    for (const item of remainder) {
      if (!item.registerHint || registersSeen.has(item.registerHint)) continue;
      if (registersSeen.size >= QUALITY_FILTERS.MIN_REGISTER_COUNT) break;
      registersSeen.add(item.registerHint);
      selected.push(item);
    }
  }

  const final = selected.slice(0, options.limit ?? 50);
  feedCache.set(cacheKey, final, TTL.FEED);
  return final;
}

export async function fetchTrendsByRegister(
  topics: TopicId[],
  registers: EmotionalRegister[]
): Promise<TrendItem[]> {
  const all = await fetchTrends(topics);
  return all.filter(item => item.registerHint && registers.includes(item.registerHint));
}
