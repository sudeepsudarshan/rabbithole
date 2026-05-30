import type { EmotionalRegister } from '@/lib/registers';
import type { SourceId } from '@/types/sources';

export type TopicId =
  // Knowledge & wonder
  | 'science' | 'space' | 'nature' | 'history' | 'archaeology' | 'philosophy'
  // Human ingenuity
  | 'tech' | 'ai' | 'design' | 'engineering' | 'medicine'
  // Mind & meaning
  | 'psychology' | 'neuroscience' | 'language' | 'creativity'
  // Money & systems
  | 'finance' | 'economics' | 'business' | 'markets'
  // Culture & joy
  | 'comedy' | 'music' | 'film' | 'literature' | 'sports' | 'food'
  // World & people
  | 'geopolitics' | 'culture' | 'biography' | 'oddities';

export interface Topic {
  id: TopicId;
  name: string;
  description: string;
  registers: EmotionalRegister[];
  accentId: 'rust' | 'mustard' | 'sage' | 'rose' | 'sky' | 'plum';
  sources: SourceId[];
  searchTerms: string[];
}
