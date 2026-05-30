import type { SourceId } from '@/types/sources';
import type { TopicId } from '@/types/topics';
import type { EmotionalRegister } from '@/lib/registers';
import type { TrendItem } from '@/types/trends';
import { truncate, slugify, logger } from '@/lib/utils';
import { sourceCache, TTL } from './cache';

const REDDIT_SCORE_CEILING = 10_000;

interface RedditPost {
  title: string;
  selftext: string;
  score: number;
  url: string;
  permalink: string;
  created_utc: number;
}

interface RedditApiResponse {
  data: {
    children: Array<{ data: RedditPost }>;
  };
}

export const REDDIT_SOURCES: Record<string, { subreddit: string; topicId: TopicId; registerHint: EmotionalRegister }> = {
  reddit_til:                { subreddit: 'todayilearned',      topicId: 'oddities',  registerHint: 'surprise' },
  reddit_science:            { subreddit: 'science',            topicId: 'science',   registerHint: 'education' },
  reddit_damnthatsinteresting:{ subreddit: 'Damnthatsinteresting', topicId: 'oddities', registerHint: 'surprise' },
  reddit_askhistorians:      { subreddit: 'AskHistorians',      topicId: 'history',   registerHint: 'education' },
  reddit_eli5:               { subreddit: 'explainlikeimfive',  topicId: 'science',   registerHint: 'education' },
  reddit_machinelearning:    { subreddit: 'MachineLearning',    topicId: 'ai',        registerHint: 'education' },
  reddit_physics:            { subreddit: 'Physics',            topicId: 'science',   registerHint: 'awe' },
  reddit_biology:            { subreddit: 'biology',            topicId: 'nature',    registerHint: 'awe' },
  reddit_space:              { subreddit: 'space',              topicId: 'space',     registerHint: 'awe' },
  reddit_natureismetal:      { subreddit: 'natureismetal',      topicId: 'nature',    registerHint: 'awe' },
  reddit_humansbros:         { subreddit: 'HumansBeingBros',    topicId: 'culture',   registerHint: 'warmth' },
  reddit_madesmile:          { subreddit: 'MadeMeSmile',        topicId: 'culture',   registerHint: 'warmth' },
  reddit_upliftingnews:      { subreddit: 'UpliftingNews',      topicId: 'culture',   registerHint: 'inspiration' },
  reddit_standup:            { subreddit: 'standupcomedy',      topicId: 'comedy',    registerHint: 'delight' },
  reddit_writingprompts:     { subreddit: 'WritingPrompts',     topicId: 'creativity',registerHint: 'inspiration' },
  reddit_books:              { subreddit: 'books',              topicId: 'literature',registerHint: 'education' },
  reddit_movies:             { subreddit: 'movies',             topicId: 'film',      registerHint: 'delight' },
  reddit_economics:          { subreddit: 'Economics',          topicId: 'economics', registerHint: 'education' },
  reddit_wsb:                { subreddit: 'wallstreetbets',     topicId: 'markets',   registerHint: 'surprise' },
  reddit_philosophy:         { subreddit: 'philosophy',         topicId: 'philosophy',registerHint: 'education' },
  reddit_etymology:          { subreddit: 'etymology',          topicId: 'language',  registerHint: 'surprise' },
  reddit_askscience:         { subreddit: 'AskScience',         topicId: 'science',   registerHint: 'education' },
  reddit_dataisbeautiful:    { subreddit: 'dataisbeautiful',    topicId: 'oddities',  registerHint: 'surprise' },
  reddit_architecture:       { subreddit: 'architecture',       topicId: 'design',    registerHint: 'awe' },
  reddit_earthporn:          { subreddit: 'EarthPorn',          topicId: 'nature',    registerHint: 'awe' },
  reddit_writing:            { subreddit: 'writing',            topicId: 'creativity',registerHint: 'inspiration' },
};

export async function fetchRedditSource(sourceId: SourceId): Promise<TrendItem[]> {
  const cached = sourceCache.get(sourceId);
  if (cached) return cached;

  const config = REDDIT_SOURCES[sourceId];
  if (!config) return [];

  try {
    const res = await fetch(
      `https://www.reddit.com/r/${config.subreddit}/top.json?t=day&limit=25`,
      { headers: { 'User-Agent': 'DTRH-App/1.0' } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json() as RedditApiResponse;
    const posts = json.data?.children ?? [];

    const items: TrendItem[] = posts
      .map(({ data: post }) => post)
      .filter(post =>
        post.score >= 500 &&
        post.selftext &&
        post.selftext !== '[removed]' &&
        post.selftext !== '[deleted]' &&
        post.title.length >= 15
      )
      .map((post): TrendItem => ({
        id: `${sourceId}-${slugify(post.title).slice(0, 40)}`,
        topicId: config.topicId,
        title: post.title,
        summary: truncate(post.selftext.replace(/\n+/g, ' ').trim(), 300),
        source: sourceId,
        sourceLabel: `Reddit r/${config.subreddit}`,
        url: `https://reddit.com${post.permalink}`,
        publishedAt: new Date(post.created_utc * 1000),
        score: Math.min(post.score / REDDIT_SCORE_CEILING, 1),
        registerHint: config.registerHint,
      }));

    sourceCache.set(sourceId, items, TTL.SOURCE);
    return items;
  } catch (err) {
    logger.warn(`Reddit source ${sourceId} failed:`, err);
    return [];
  }
}
