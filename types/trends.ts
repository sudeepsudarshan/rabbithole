import type { TopicId } from '@/types/topics';
import type { SourceId } from '@/types/sources';
import type { EmotionalRegister } from '@/lib/registers';

export interface TrendItem {
  id: string;
  topicId: TopicId;
  title: string;
  summary: string;
  source: SourceId;
  sourceLabel: string;
  url: string;
  publishedAt: Date;
  score: number;
  registerHint?: EmotionalRegister;
  rawContent?: string;
}
