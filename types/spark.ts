import type { TopicId } from '@/types/topics';
import type { EmotionalRegister } from '@/lib/registers';

export interface SparkCard {
  id: string;
  templateId: string;
  templateLabel: string;      // e.g. 'Body Horror · Template 09'
  accentColor: string;
  title: string;              // 8–14 word hook
  question: string;           // The user's question (displayed in exchange)
  answer: string;             // 60–90 word Vsauce-voice answer
  hookLine: string;           // 20–30 word gut-punch one-liner
  episodeSlug?: string;       // Links to full episode if it exists
  heroImage: string;          // Curated Unsplash CDN URL for full-bleed background
  suggestedQuestions: string[]; // 3 pre-seeded follow-up questions for the Ask tab
  // optional depth-content fields
  topicId?: TopicId;
  registers?: EmotionalRegister[];
  episode?: {
    sections: Array<{ heading: string; body: string }>;
    readTimeMin: number;
    generatedAt: string;
  };
  podcast?: {
    turns: Array<{ host: string; text: string }>;
    durationSec: number;
    generatedAt: string;
  };
}
