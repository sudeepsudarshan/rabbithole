export type TemplateCategory =
  | 'history' | 'science' | 'philosophy'
  | 'comedy' | 'short' | 'high-engagement';

export interface Template {
  id: string;                    // '01' through '20'
  name: string;
  tagline: string;               // One-line hook
  description: string;           // 2–3 sentence description
  badge: string;                 // e.g. 'Viral potential'
  categories: TemplateCategory[];
  eqScore: number;               // 0–100 engagement quotient
  accentColor: string;           // Hex — for card accent
  durationRange: string;         // e.g. '8–15 min'
  systemPrompt: string;          // Full AI system prompt
  inputPlaceholder: string;      // Example question for the input
  exampleTopics: string[];       // 4–5 best-fit topics
}
