export interface FactItem {
  value: string;      // e.g. '86B' or '20%' or 'Never'
  label: string;      // e.g. 'neurons in the human brain'
}

export interface InsightBox {
  label: string;      // Short heading, e.g. 'The closing thought'
  text: string;       // 60–100 word body
}

export interface RabbitHolePrompt {
  displayText: string;   // Short label shown on button
  fullPrompt: string;    // Full question sent to AI
}

export interface ChapterContent {
  narration: string;                    // HTML string — supports <strong> and <em>
  facts: [FactItem, FactItem, FactItem]; // Always exactly 3
  insight: InsightBox;
  prompts: [RabbitHolePrompt, RabbitHolePrompt]; // Always exactly 2
}

export interface Chapter {
  id: string;           // e.g. 'ch-01'
  number: number;
  title: string;        // e.g. 'The morning'
  context: string;      // e.g. 'June 28, 1914 — Sarajevo, 10:10 AM'
  content: ChapterContent;
}

export interface Episode {
  id: string;
  slug: string;         // URL-safe, e.g. 'sarajevo-wrong-turn'
  templateId: string;   // References template '05'
  title: string;
  subtitle: string;
  dateContext: string;  // e.g. 'June 28, 1914 → The 20th century'
  chapters: Chapter[];
  relatedEpisodes: string[];  // Episode slugs
}
