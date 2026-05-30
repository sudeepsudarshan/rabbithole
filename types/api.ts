export interface RabbitHoleRequest {
  templateId: string;
  question: string;
}

export interface DiveRequest {
  templateId: string;
  episodeSlug: string;
  chapterNumber: number;
  chapterTitle: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface GenerateSparkRequest {
  templateId: string;
  topic: string;
  trendItem?: import('@/types/trends').TrendItem;
}

export interface GenerateSparkResponse {
  title: string;
  question: string;
  answer: string;
  hookLine: string;
  skip?: boolean;
  skipReason?: string;
}

export interface TrackEventRequest {
  event: string;
  templateId?: string;
  episodeSlug?: string;
  chapterNumber?: number;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export interface ApiError {
  message: string;
  code?: string;
}
