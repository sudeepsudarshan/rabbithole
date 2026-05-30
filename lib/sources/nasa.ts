import type { TrendItem } from '@/types/trends';
import { slugify, logger } from '@/lib/utils';
import { sourceCache, TTL } from './cache';

interface NasaApodItem {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  date: string;
}

export async function fetchNasaApod(): Promise<TrendItem[]> {
  const cached = sourceCache.get('nasa_apod');
  if (cached) return cached;

  const apiKey = (typeof process !== 'undefined' && process.env.NASA_API_KEY) || 'DEMO_KEY';

  try {
    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=5`,
      { headers: { 'User-Agent': 'DTRH-App/1.0' } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json() as NasaApodItem[];

    const items: TrendItem[] = data.map((apod): TrendItem => ({
      id: `nasa_apod-${slugify(apod.title).slice(0, 40)}`,
      topicId: 'space',
      title: apod.title,
      summary: apod.explanation.slice(0, 400),
      source: 'nasa_apod',
      sourceLabel: 'NASA APOD',
      url: apod.hdurl ?? apod.url,
      publishedAt: new Date(apod.date),
      score: 0.85,
      registerHint: 'awe',
      rawContent: apod.explanation,
    }));

    sourceCache.set('nasa_apod', items, TTL.SOURCE);
    return items;
  } catch (err) {
    logger.warn('NASA APOD fetch failed:', err);
    return [];
  }
}
