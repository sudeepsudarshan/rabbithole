import type { EmotionalRegister } from '@/lib/registers';
import type { TrendItem } from '@/types/trends';
import { slugify, logger } from '@/lib/utils';
import { sourceCache, TTL } from './cache';

interface INatTaxon {
  name: string;
  rank: string;
  wikipedia_url?: string;
}

interface INatObservation {
  id: number;
  description?: string;
  faves_count: number;
  uri: string;
  taxon?: INatTaxon;
  observed_on?: string;
}

interface INatResponse {
  results: INatObservation[];
}

export async function fetchINaturalist(): Promise<TrendItem[]> {
  const cached = sourceCache.get('inaturalist');
  if (cached) return cached;

  try {
    const res = await fetch(
      'https://api.inaturalist.org/v1/observations?quality_grade=research&order=desc&order_by=votes&per_page=20',
      { headers: { 'User-Agent': 'DTRH-App/1.0' } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json() as INatResponse;

    const items: TrendItem[] = (data.results ?? [])
      .filter(obs => obs.taxon)
      .map((obs): TrendItem => {
        const taxon = obs.taxon!;
        const speciesLevel = ['species', 'genus'].includes(taxon.rank);
        const registerHint: EmotionalRegister = speciesLevel ? 'awe' : 'delight';
        const title = taxon.name;
        const summary = obs.description?.slice(0, 300) ?? `A research-grade observation of ${taxon.name}.`;

        return {
          id: `inaturalist-${slugify(title).slice(0, 40)}-${obs.id}`,
          topicId: 'nature',
          title,
          summary,
          source: 'inaturalist',
          sourceLabel: 'iNaturalist',
          url: obs.uri,
          publishedAt: obs.observed_on ? new Date(obs.observed_on) : new Date(),
          score: Math.min(obs.faves_count / 100, 1),
          registerHint,
        };
      });

    sourceCache.set('inaturalist', items, TTL.SOURCE);
    return items;
  } catch (err) {
    logger.warn('iNaturalist fetch failed:', err);
    return [];
  }
}
