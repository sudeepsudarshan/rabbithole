import type { SourceId } from '@/types/sources';
import type { TrendItem } from '@/types/trends';
import { fetchRedditSource, REDDIT_SOURCES } from './reddit';
import { fetchWikipediaSource } from './wikipedia';
import { fetchArxivSource } from './arxiv';
import { fetchHackerNews } from './hackernews';
import { fetchNasaApod } from './nasa';
import { fetchINaturalist } from './inaturalist';
import { fetchRssSource } from './rss';

export const SOURCE_WEIGHTS: Record<SourceId, number> = {
  quanta:                     1.5,
  aeon:                       1.4,
  arxiv:                      1.4,
  marginalian:                1.3,
  naturepicks:                1.3,
  nasa_apod:                  1.3,
  reddit_askhistorians:       1.3,
  phys_org:                   1.2,
  longreads:                  1.2,
  hackernews:                 1.1,
  lithub:                     1.1,
  inaturalist:                1.1,
  wikipedia_top:              1.0,
  wikipedia_onthisday:        1.0,
  reddit_science:             1.0,
  reddit_til:                 0.9,
  wikipedia_unusual:          0.9,
  reddit_eli5:                0.9,
  reddit_machinelearning:     1.0,
  reddit_physics:             1.0,
  reddit_biology:             1.0,
  reddit_space:               0.9,
  reddit_natureismetal:       0.9,
  reddit_humansbros:          0.8,
  reddit_madesmile:           0.8,
  reddit_upliftingnews:       0.8,
  reddit_standup:             0.9,
  reddit_writingprompts:      0.9,
  reddit_books:               0.9,
  reddit_movies:              0.9,
  reddit_economics:           0.9,
  reddit_wsb:                 0.7,
  reddit_philosophy:          0.9,
  reddit_etymology:           0.9,
  reddit_askscience:          1.0,
  reddit_dataisbeautiful:     0.9,
  reddit_architecture:        0.9,
  reddit_earthporn:           0.8,
  reddit_writing:             0.9,
  reddit_damnthatsinteresting:0.8,
};

const REDDIT_SOURCE_IDS = new Set(Object.keys(REDDIT_SOURCES) as SourceId[]);
const WIKIPEDIA_SOURCE_IDS: SourceId[] = ['wikipedia_top', 'wikipedia_onthisday', 'wikipedia_unusual'];
const RSS_SOURCE_IDS: SourceId[] = ['aeon', 'quanta', 'longreads', 'lithub', 'marginalian', 'naturepicks', 'phys_org'];

export async function fetchSource(sourceId: SourceId): Promise<TrendItem[]> {
  if (REDDIT_SOURCE_IDS.has(sourceId)) return fetchRedditSource(sourceId);
  if (WIKIPEDIA_SOURCE_IDS.includes(sourceId)) return fetchWikipediaSource(sourceId);
  if (RSS_SOURCE_IDS.includes(sourceId)) return fetchRssSource(sourceId);

  switch (sourceId) {
    case 'arxiv':     return fetchArxivSource();
    case 'hackernews':return fetchHackerNews();
    case 'nasa_apod': return fetchNasaApod();
    case 'inaturalist':return fetchINaturalist();
    default:          return [];
  }
}

export { fetchRedditSource, fetchWikipediaSource, fetchArxivSource, fetchHackerNews, fetchNasaApod, fetchINaturalist, fetchRssSource };
