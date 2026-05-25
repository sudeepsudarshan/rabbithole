export interface SparkCard {
  id: string;
  templateId: string;
  templateLabel: string;      // e.g. 'Body Horror · Template 09'
  accentColor: string;
  title: string;              // 8–14 word hook
  question: string;           // The user's question (displayed in exchange)
  answer: string;             // 40–60 word AI answer (displayed in exchange)
  hookLine: string;           // 20–35 word share-worthy one-liner
  episodeSlug?: string;       // Links to full episode if it exists
  heroImage: string;          // Curated Unsplash CDN URL for full-bleed background
}
