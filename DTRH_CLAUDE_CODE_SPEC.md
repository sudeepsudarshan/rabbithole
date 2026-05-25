# Down the Rabbit Hole with AI — Claude Code Build Spec
### Version 1.0 | Full-Stack Web Application

---

## How to use this document

This is a complete engineering specification for Claude Code. Read it fully before writing any code. Every section is an instruction. When a decision is unspecified, default to simplicity, readability, and the aesthetic described in the Design System section. Build features in the order they appear in the Phased Build Plan at the end.

---

## 1. What you are building

A web application called **Down the Rabbit Hole with AI** — a curiosity-driven AI podcast platform where users explore any topic through structured conversations with an AI.

The product has three distinct content formats:

1. **Sparks** — 60-second vertical swipeable micro-episode cards. One jaw-dropping fact, one AI exchange, one hook. The TikTok reel for intellectual curiosity.
2. **Episodes** — Chapter-based explorations (8–10 chapters each). Narration, fact strips, insight boxes, rabbit-hole prompt buttons, live AI chat dive at the bottom of every chapter.
3. **Dive** — Freeform AI conversation available at the bottom of every episode chapter and as a standalone mode.

The content is organised around **20 episode templates**, each defining a distinct conversational rhythm and emotional arc. Every template has a tailored AI system prompt that gives it a specific voice and structure.

The platform's visual identity is **editorial-dark**: ink-black backgrounds, gold accents, Playfair Display serif for display type, Inter for body. It should feel like a beautifully designed long-form magazine that talks back — not a generic AI product.

---

## 2. Tech stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript throughout — no `any` types
- **Styling**: Tailwind CSS with a custom theme extending the default config
- **Fonts**: `next/font` — Playfair Display (display/editorial) + Inter (UI/body) + JetBrains Mono (metadata)
- **Animation**: Framer Motion for page transitions and Spark swipe
- **Icons**: Lucide React
- **State**: Zustand for global state (current episode, chapter, user preferences)
- **Data fetching**: TanStack Query (React Query) for all async data

### Backend
- **Runtime**: Next.js API Routes (no separate backend for MVP)
- **AI**: Anthropic SDK (`@anthropic-ai/sdk`) with streaming
- **Database**: Supabase (PostgreSQL) — user accounts, saved episodes, rabbit hole history
- **Auth**: Supabase Auth (email + Google OAuth)
- **Storage**: Supabase Storage (user-generated content, future audio)

### Infrastructure
- **Deployment**: Vercel
- **Environment**: `.env.local` for secrets — never commit API keys
- **Analytics**: Vercel Analytics + custom event tracking via a `/api/track` route

### Key dependencies
```
next@14
typescript
tailwindcss
framer-motion
@anthropic-ai/sdk
@supabase/supabase-js
@supabase/auth-helpers-nextjs
zustand
@tanstack/react-query
lucide-react
clsx
tailwind-merge
```

---

## 3. Project structure

```
/
├── app/
│   ├── layout.tsx                    # Root layout — fonts, providers, nav
│   ├── page.tsx                      # Home screen
│   ├── sparks/
│   │   └── page.tsx                  # Sparks feed
│   ├── templates/
│   │   ├── page.tsx                  # Template library grid
│   │   └── [id]/
│   │       └── page.tsx              # Single template detail + rabbit hole
│   ├── episodes/
│   │   ├── page.tsx                  # Episode browser
│   │   └── [slug]/
│   │       ├── page.tsx              # Episode player shell
│   │       └── [chapter]/
│   │           └── page.tsx          # Individual chapter view
│   ├── dive/
│   │   └── page.tsx                  # Standalone freeform AI dive
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── callback/route.ts
│   └── api/
│       ├── rabbit-hole/route.ts      # POST — streams AI response for template card
│       ├── dive/route.ts             # POST — streams AI response for episode dive
│       ├── generate-spark/route.ts   # POST — generates a custom Spark card
│       └── track/route.ts            # POST — records analytics events
│
├── components/
│   ├── nav/
│   │   ├── NavBar.tsx
│   │   └── MobileNav.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── FormatCards.tsx
│   │   ├── TopFive.tsx
│   │   └── HowItWorks.tsx
│   ├── sparks/
│   │   ├── SparkFeed.tsx             # Vertical swipeable container
│   │   ├── SparkCard.tsx             # Individual card
│   │   └── SparkDots.tsx             # Pagination dots
│   ├── templates/
│   │   ├── TemplateGrid.tsx
│   │   ├── TemplateCard.tsx          # Card with embedded rabbit hole input
│   │   ├── RabbitHoleInput.tsx       # Input + streaming response panel
│   │   └── FilterBar.tsx
│   ├── episode/
│   │   ├── EpisodePlayer.tsx         # Shell layout
│   │   ├── EpisodeSidebar.tsx        # Chapter list, progress
│   │   ├── ChapterContent.tsx        # Main chapter rendering
│   │   ├── NarrationBlock.tsx
│   │   ├── FactStrip.tsx
│   │   ├── InsightBox.tsx
│   │   ├── RabbitHolePrompts.tsx     # Pre-written prompt buttons
│   │   └── ChapterNav.tsx
│   ├── dive/
│   │   ├── DiveWindow.tsx            # Chat UI embedded in episode
│   │   ├── ChatMessage.tsx
│   │   └── ChatInput.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── ProgressBar.tsx
│       ├── StreamingText.tsx         # Renders streaming AI text with cursor
│       └── EQBar.tsx                 # Engagement quotient bar
│
├── lib/
│   ├── anthropic.ts                  # Anthropic client + streaming utilities
│   ├── supabase.ts                   # Supabase client (browser)
│   ├── supabase-server.ts            # Supabase client (server components)
│   ├── templates.ts                  # All 20 template definitions + system prompts
│   ├── episodes.ts                   # Episode + chapter content data
│   ├── sparks.ts                     # Spark card content data
│   └── utils.ts                      # clsx/twMerge helper, formatters
│
├── store/
│   ├── episodeStore.ts               # Current episode, chapter, progress
│   ├── uiStore.ts                    # Nav state, mobile menu, active filters
│   └── userStore.ts                  # Auth state, preferences
│
├── types/
│   ├── template.ts
│   ├── episode.ts
│   ├── spark.ts
│   └── api.ts
│
├── hooks/
│   ├── useStreamingResponse.ts       # Reusable streaming hook
│   ├── useEpisodeProgress.ts
│   └── useSwipe.ts                   # Touch gesture detection for Sparks
│
└── public/
    └── og/                           # OG images per template
```

---

## 4. Design system

### Colour palette — extend Tailwind config with these exact values

```js
// tailwind.config.ts
colors: {
  ink: {
    DEFAULT: '#0F0E0C',
    50: '#1A1814',
    100: '#2C2822',
  },
  paper: {
    DEFAULT: '#F5F0E8',
    muted: '#B8B0A0',
    faint: '#6B6560',
  },
  gold: {
    DEFAULT: '#C9A84C',
    dim: '#8A6E2F',
    bright: '#DFC068',
    faint: 'rgba(201,168,76,0.12)',
  },
  cream: '#EDE7D9',
  rust: '#B5451B',
  sage: '#4A6741',
  border: {
    DEFAULT: 'rgba(255,255,255,0.08)',
    gold: 'rgba(201,168,76,0.20)',
    strong: 'rgba(255,255,255,0.16)',
  }
}
```

### Typography rules

| Role | Font | Size | Weight | Notes |
|------|------|------|--------|-------|
| Hero title | Playfair Display | clamp(3rem, 7vw, 5.5rem) | 400 italic / 700 | Page-level only |
| Section title | Playfair Display | 2–3rem | 400 italic | H2 level |
| Episode narration | Playfair Display | 1.05rem | 400 italic | Main reading content |
| Template name | Playfair Display | 1.1rem | 500 italic | Card headers |
| Body / UI | Inter | 0.875rem | 300–400 | Descriptions |
| Labels / nav | Inter | 0.72–0.82rem | 400–500 | Badges, buttons |
| Metadata | JetBrains Mono | 0.65–0.72rem | 400 | Template numbers, dates |
| AI stream output | Playfair Display | 0.92rem | 400 italic | Must feel live |

### Spacing
Use Tailwind defaults. Vertical rhythm in multiples of 4px. Section padding: `py-20` to `py-28`.

### Component conventions
- All cards: `border border-border rounded-lg bg-ink-50` — never white backgrounds on dark mode UI
- Active/hover: always shift toward gold, not toward white
- Progress indicators: always gold fill on dark track
- Buttons: two variants only — `primary` (gold bg, ink text) and `ghost` (transparent, gold border on hover)
- Border radius: `rounded-lg` (12px) for cards, `rounded-md` (8px) for inputs and badges, `rounded-full` for pills

### Animation conventions (Framer Motion)
- Page transitions: `opacity: 0→1`, `y: 16→0`, duration `0.4s`, ease `easeOut`
- Spark swipe: spring physics — `stiffness: 300, damping: 30`
- Response panel reveal: `y: -8→0, opacity: 0→1`, duration `0.3s`
- Streaming cursor: CSS `animation: blink 0.7s step-end infinite`
- Always wrap in `AnimatePresence` for exit animations
- Respect `prefers-reduced-motion` — wrap all motion in a `useReducedMotion` check

---

## 5. The 20 templates — full data model

Each template is a TypeScript object of type `Template`. Store all 20 in `lib/templates.ts`.

### Template type

```typescript
// types/template.ts
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
```

### All 20 templates with system prompts

Implement every template below in `lib/templates.ts`. These system prompts are the product's most important asset — copy them exactly.

```typescript
export const TEMPLATES: Template[] = [
  {
    id: '01',
    name: 'Tangent Tornado',
    tagline: 'Start with a mundane question. End somewhere completely unexpected.',
    description: 'One question triggers a cascade of escalating tangents, each spawning from the last, going somewhere the listener never anticipated. Fast, funny, surprising.',
    badge: 'High engagement',
    categories: ['short', 'comedy'],
    eqScore: 82,
    accentColor: '#D85A30',
    durationRange: '8–15 min',
    inputPlaceholder: 'e.g. "Why do we say bless you when someone sneezes?"',
    exampleTopics: ['Why do we yawn?', 'Why is the sky blue?', 'Why do we shake hands?', 'Why do cats purr?'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the TANGENT TORNADO format. The user gives you any topic or question. Start with a sharp, surprising fact about it. Then take 4–5 rapid tangents — each one spawning from the previous, going somewhere the user never expected. Use vivid, punchy language. Each tangent should be 2–3 sentences. End on the most surprising destination you can reach. Total response: ~300 words. No headers. Flowing prose. The energy is that of a brilliant friend who can't stop making connections.`,
  },
  {
    id: '02',
    name: 'Coincidence Collector',
    tagline: 'Two wildly unrelated things. Find the uncanny threads connecting them.',
    description: 'Pick any two things — people, events, objects, ideas. Uncover the eerie or mathematically improbable connections between them, then pivot to what this reveals about how human minds love patterns.',
    badge: 'Viral potential',
    categories: ['history', 'short'],
    eqScore: 85,
    accentColor: '#BA7517',
    durationRange: '10–20 min',
    inputPlaceholder: 'e.g. "Lincoln and Kennedy" or "chocolate and the Aztecs"',
    exampleTopics: ['Lincoln and Kennedy', 'Shakespeare and Cervantes', 'Newton and Leibniz', 'Tesla and Edison'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the COINCIDENCE COLLECTOR format. The user gives you a topic, a person, or two things to compare. Find 3–4 genuinely uncanny, eerie, or statistically improbable coincidences — real ones, historically verified. After presenting them, pivot hard: explain the psychology of apophenia (pattern-seeking), the birthday problem, and what our love of coincidences reveals about the human mind. End on a beautiful insight about why noticing patterns is both our greatest flaw and our greatest gift. ~300 words, vivid prose.`,
  },
  {
    id: '03',
    name: 'The Time Machine',
    tagline: 'Trace any word or object backwards until you hit something absurd.',
    description: 'Pick any ordinary word, object, or habit. Trace it backwards through languages, civilisations, and centuries until you find the moment it was born — and discover it contains an entire civilisation inside it.',
    badge: 'Deep curiosity',
    categories: ['history', 'science'],
    eqScore: 78,
    accentColor: '#7F77DD',
    durationRange: '20–30 min',
    inputPlaceholder: 'e.g. "salary" or "the word disaster" or "the handshake"',
    exampleTopics: ['The word salary', 'The colour orange', 'The fork', 'The handshake'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the TIME MACHINE format. The user gives you a word, object, or habit. Trace it backwards through time like a detective — etymology, ancient origins, the civilisations that shaped it. Find the surprising moment it was born. Each step backwards should reveal something the listener never suspected. Land on a philosophical point about what this one thing reveals about the civilisation that created it. ~300 words, detective-story pacing, flowing prose.`,
  },
  {
    id: '04',
    name: 'Myth Autopsy',
    tagline: 'Dissect a fact everyone repeats. Find out it was wrong the whole time.',
    description: 'Take a "fact" everyone confidently repeats. Debunk it cleanly with evidence. Then — the real payload — trace where the myth came from, why it spread, and what it reveals about human psychology that we all believed it.',
    badge: 'Instant shareability',
    categories: ['science', 'high-engagement'],
    eqScore: 84,
    accentColor: '#1D9E75',
    durationRange: '10–15 min',
    inputPlaceholder: 'e.g. "We only use 10% of our brain"',
    exampleTopics: ['We only use 10% of our brain', 'We swallow 8 spiders a year', 'Napoleon was short', 'Goldfish have 3-second memories'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the MYTH AUTOPSY format. The user gives you a myth or "fact" everyone repeats. First: debunk it cleanly and confidently with real evidence (be specific — cite the actual science). Then — this is the more important half — trace where the myth came from, how it spread, and what it reveals about human psychology that we all believed it. The myth's origin story should be more interesting than the debunk itself. Funny and precise throughout. End on the insight: why do emotionally true things survive as facts even when they're not? ~300 words.`,
  },
  {
    id: '05',
    name: 'Butterfly Effect',
    tagline: 'One tiny forgotten moment. The entire modern world downstream from it.',
    description: 'Find the smallest, most forgettable moment in history. Trace the chain of consequences with dramatic precision until you arrive at the modern world looking completely different.',
    badge: 'Maximum drama',
    categories: ['history', 'high-engagement'],
    eqScore: 94,
    accentColor: '#D4537E',
    durationRange: '15–25 min',
    inputPlaceholder: 'e.g. "Fleming almost threw away the penicillin dish"',
    exampleTopics: ['Wrong turn in Sarajevo 1914', 'Fleming keeps the penicillin dish', 'Tesla applies to work for Edison', 'Hitler rejected by art school'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the BUTTERFLY EFFECT format. The user gives you a historical moment or tiny event. Trace the chain of consequences with dramatic precision — each link should feel both inevitable and shocking. Show how the smallest cause produced the largest effects. Build to the modern world. End with the present looking completely different because of this one moment. Be vivid and specific — dates, names, exact quotes where possible. ~350 words. The tone is a thriller novelist who also happens to know history.`,
  },
  {
    id: '06',
    name: 'Alien Anthropologist',
    tagline: 'Describe human rituals as if you\'ve never seen them before.',
    description: 'Pretend you\'re an alien scientist observing humans for the first time. Describe an ordinary human behaviour with clinical detachment until it sounds completely absurd — then reveal what it actually tells us about civilisation.',
    badge: 'Comedy + philosophy',
    categories: ['comedy', 'short', 'philosophy'],
    eqScore: 80,
    accentColor: '#378ADD',
    durationRange: '8–15 min',
    inputPlaceholder: 'e.g. "Why do humans queue?" or "tipping in restaurants"',
    exampleTopics: ['Human queuing behaviour', 'Tipping in restaurants', 'Shaking hands', 'Saying bless you after sneezing'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the ALIEN ANTHROPOLOGIST format. The user gives you a human behaviour or ritual. Begin by describing it as if filing an alien observation report — clinical, detached, making it sound completely absurd through fresh eyes. Then pivot hard: reveal what this behaviour actually encodes about human psychology, fairness, social trust, or civilisation. The comedy comes from the alien frame; the profundity comes from what the behaviour reveals. Funny first, profound second. ~300 words.`,
  },
  {
    id: '07',
    name: 'Numbers Don\'t Lie',
    tagline: 'One jaw-dropping statistic. Pull the thread until the number reveals a hidden world.',
    description: 'Start with a number that seems impossible. Pull it apart — what does it actually measure? What does it hide? What\'s the deeper story behind the headline figure? End with the insight the number was pointing at all along.',
    badge: 'Highly quotable',
    categories: ['science', 'short'],
    eqScore: 79,
    accentColor: '#639922',
    durationRange: '12–20 min',
    inputPlaceholder: 'e.g. "8 people own as much as the bottom 50% of the world"',
    exampleTopics: ['8 people own as much as bottom 50%', '90% of ocean species undiscovered', 'Half of all humans died of malaria', '1 in 4 people alive is Indian or Chinese'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the NUMBERS DON'T LIE format. The user gives you a statistic or number. Start with the jaw-dropping fact stated cleanly. Then pull it apart: what does it actually measure? What does it hide or distort? What's the deeper story behind the headline number? Include at least one surprising counterintuitive finding — a number that complicates the simple headline. End with the insight the number was really pointing at. Rigorous but completely accessible. ~300 words.`,
  },
  {
    id: '08',
    name: 'What If Machine',
    tagline: 'Change exactly one thing in history. Watch the world become unrecognisable.',
    description: 'Change exactly one historical, scientific, or cultural thing. Then rigorously trace the cascade of consequences until the world looks completely different — or exactly the same. The format thrives on genuine disagreement.',
    badge: 'Infinite replayability',
    categories: ['history', 'philosophy'],
    eqScore: 83,
    accentColor: '#E24B4A',
    durationRange: '20–30 min',
    inputPlaceholder: 'e.g. "What if the internet was never commercialised?"',
    exampleTopics: ['Internet never commercialised', 'Women get the vote in 1820', 'Antibiotics never discovered', 'Africa industrialises first'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the WHAT IF MACHINE format. The user gives you a counterfactual change. Change exactly one thing and rigorously trace the cascade of consequences — across politics, technology, culture, and human lives. Argue both sides: would the world be better or worse? Let genuine uncertainty and disagreement show. Don't resolve too cleanly — the best What If episodes end with the listener unsure which world they'd prefer. ~350 words. Think like a historian who is also a novelist.`,
  },
  {
    id: '09',
    name: 'The Body Horror',
    tagline: 'Your body is doing extraordinary things right now. You didn\'t ask.',
    description: 'Start with something your body is doing right now, silently, without permission. Describe it until the listener is genuinely disturbed — then reveal why it\'s actually beautiful. The disgust-to-wonder arc is mandatory.',
    badge: 'Instant virality',
    categories: ['science', 'high-engagement', 'short'],
    eqScore: 92,
    accentColor: '#E24B4A',
    durationRange: '10–15 min',
    inputPlaceholder: 'e.g. "What is my body doing right now without my permission?"',
    exampleTopics: ['You have never touched anything', 'You glow faintly in the dark', '43% of your cells are not human', '3.8 million cells die per second'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the BODY HORROR format. The user gives you a body-related question or topic. Start with something viscerally unsettling about the human body happening right now — specific, real, scientifically accurate. Build the discomfort through 2–3 escalating revelations. Then execute the mandatory flip: reveal why this disturbing thing is actually extraordinary, beautiful, or awe-inspiring. The disgust-to-wonder arc is the entire format. End with something the listener will tell someone else immediately. ~300 words.`,
  },
  {
    id: '10',
    name: 'Word Detective',
    tagline: 'Trace one word back through civilisations to the moment it was born.',
    description: 'Pick any ordinary word. Trace its etymology like a detective — through languages, civilisations, centuries. Find the surprising origin. Show how the word carries the fingerprints of the culture that made it.',
    badge: 'Deep linguistic pull',
    categories: ['history', 'science'],
    eqScore: 77,
    accentColor: '#7F77DD',
    durationRange: '12–20 min',
    inputPlaceholder: 'e.g. "disaster" or "muscle" or "nightmare"',
    exampleTopics: ['The word disaster', 'The word muscle', 'The word nightmare', 'The word panic'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the WORD DETECTIVE format. The user gives you a word. Trace its etymology like a detective — through languages, civilisations, centuries. Find the surprising moment it was born. Show how the word carries the fingerprints of the culture that made it. Each language hop should reveal something unexpected. End on what this one word reveals about the history of human thought or civilisation. ~300 words, detective-story pacing.`,
  },
  {
    id: '11',
    name: 'True Conspiracy',
    tagline: 'A conspiracy theory that turned out to be completely true.',
    description: 'Present a conspiracy theory that turned out to be completely true. Trace who suppressed it and why. Then give the listener a framework for evaluating which conspiracy theories might be real versus which fail basic logic.',
    badge: 'Maximum credibility shake',
    categories: ['history', 'high-engagement', 'philosophy'],
    eqScore: 89,
    accentColor: '#BA7517',
    durationRange: '15–25 min',
    inputPlaceholder: 'e.g. "MKUltra" or "the Tuskegee study"',
    exampleTopics: ['MKUltra CIA mind control', 'Tuskegee syphilis study', 'Big Tobacco knew about cancer', 'Operation Mockingbird'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the TRUE CONSPIRACY format. The user gives you a conspiracy theory or topic. If it's a confirmed real conspiracy: lay out what actually happened with precision — who knew, what was hidden, how it was eventually exposed, and the human cost. Then provide a genuine framework for evaluating conspiracy theories: what structural features make a conspiracy possible (small group, compartmentalisation, financial motive) versus what makes most fail (too many people, no deathbed confessions). Unsettling but rigorous. ~320 words.`,
  },
  {
    id: '12',
    name: 'Inventor\'s Curse',
    tagline: 'The person who changed the world — destroyed by their own invention.',
    description: 'Find the inventor whose creation changed the world. Reveal how the invention destroyed, haunted, or consumed its creator. End on the philosophical question: can we ever fully know the consequences of what we create?',
    badge: 'High tragedy quotient',
    categories: ['history', 'science'],
    eqScore: 81,
    accentColor: '#D85A30',
    durationRange: '12–20 min',
    inputPlaceholder: 'e.g. "Thomas Midgley Jr" or "Alfred Nobel and dynamite"',
    exampleTopics: ['Thomas Midgley Jr', 'Alfred Nobel and dynamite', 'Fritz Haber', 'Oppenheimer'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the INVENTOR'S CURSE format. The user gives you an inventor or invention. Tell the story in two acts: first, how the invention changed the world (be specific about the scale of impact); second, how the invention destroyed, haunted, or consumed its creator. The poetic justice should be precise, not vague. End on the philosophical payload: can we ever fully know the consequences of what we create? And what does that mean for the technologies being created right now? ~300 words, tragic arc, precise details.`,
  },
  {
    id: '13',
    name: 'Secret Life Of…',
    tagline: 'This ordinary object has an extraordinary hidden history.',
    description: 'Pick any object everyone ignores. Reveal its extraordinary hidden history, supply chain, or cultural meaning. Multiple layers of surprise — each more unexpected than the last.',
    badge: 'Everyday revelation',
    categories: ['science', 'short'],
    eqScore: 76,
    accentColor: '#1D9E75',
    durationRange: '10–18 min',
    inputPlaceholder: 'e.g. "the pencil" or "the zipper" or "Post-it notes"',
    exampleTopics: ['The pencil', 'The zipper', 'Post-it notes', 'The shopping cart'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the SECRET LIFE OF format. The user gives you an ordinary object. Reveal its extraordinary hidden history, supply chain, or cultural meaning across multiple layers — each revelation should be more surprising than the last. Include at least one fact about the supply chain (where the materials come from globally) and one about the cultural or political history. End on the philosophical insight hiding inside this mundane object. ~300 words, revelatory tone, building surprise.`,
  },
  {
    id: '14',
    name: 'The Brain Breaker',
    tagline: 'A concept that sounds simple. A paradox that proves you never understood it.',
    description: 'Start with a concept that seems obvious. Make the listener believe they understand it. Then detonate the paradox that proves they never did — and trace why their brain resists the truth.',
    badge: 'Highest replay rate',
    categories: ['science', 'high-engagement', 'philosophy'],
    eqScore: 88,
    accentColor: '#378ADD',
    durationRange: '15–25 min',
    inputPlaceholder: 'e.g. "0.999... equals 1" or "the Monty Hall problem"',
    exampleTopics: ['Infinity comes in different sizes', 'The Monty Hall problem', '0.999... equals 1', 'Zeno\'s arrow paradox'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the BRAIN BREAKER format. The user gives you a concept or paradox. In three movements: first, establish false confidence (make them think they understand); second, detonate the paradox (the specific moment of intellectual overturning); third, explain why human intuition fails here and what accepting the counterintuitive truth requires. Build tension carefully — the detonation should feel earned. End on why this particular failure of intuition matters beyond the puzzle itself. ~320 words. Think like a professor who loves the moment a student's face falls.`,
  },
  {
    id: '15',
    name: 'Species Files',
    tagline: 'One animal. Evolution went completely unhinged. Here\'s the report.',
    description: 'Pick one animal with an absurd evolutionary story. Describe its biology until the listener questions whether nature is a genius or completely unhinged — then connect it to what the animal reveals about consciousness and evolution itself.',
    badge: 'Nature\'s best writing',
    categories: ['science', 'short'],
    eqScore: 82,
    accentColor: '#639922',
    durationRange: '10–18 min',
    inputPlaceholder: 'e.g. "the mantis shrimp" or "tardigrade" or "octopus"',
    exampleTopics: ['The mantis shrimp', 'The tardigrade', 'The octopus', 'The immortal jellyfish'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the SPECIES FILES format. The user gives you an animal. Describe its most extraordinary, alien, or absurd biological features with genuine scientific awe — be specific and accurate. Show how its existence challenges assumptions about consciousness, intelligence, or evolution. End on what this creature tells us about the range of possible minds and forms of life — on Earth and potentially elsewhere. ~300 words. The tone is a wildlife documentary narrator who has completely lost their composure.`,
  },
  {
    id: '16',
    name: 'The Lost World',
    tagline: 'A civilisation was erased. Here\'s what we lost — and what we\'re losing now.',
    description: 'Resurrect an erased civilisation — by conquest, climate, or time. Let it speak. Then ask the haunting question: what did we lose, and are we making the same mistake right now?',
    badge: 'Civilisational vertigo',
    categories: ['history', 'philosophy'],
    eqScore: 80,
    accentColor: '#D4537E',
    durationRange: '15–25 min',
    inputPlaceholder: 'e.g. "The Library of Alexandria" or "Easter Island"',
    exampleTopics: ['The Library of Alexandria', 'The Bronze Age collapse', 'Easter Island', 'The Indus Valley civilisation'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the LOST WORLD format. The user gives you a lost civilisation, destroyed archive, or erased culture. Resurrect it — what did it know, build, achieve? What specific knowledge or capability did we lose? Then pivot to the present: identify the precise modern equivalent being lost right now — a language dying, a knowledge system disappearing, an ecosystem collapsing. Make the loss feel real and urgent, not academic. ~320 words. Elegiac but not paralysed — urgent and specific.`,
  },
  {
    id: '17',
    name: 'Happy Accident',
    tagline: 'It was discovered by accident. But it wasn\'t really luck.',
    description: 'Find a world-changing discovery that happened entirely by accident. Then investigate: was it really luck, or does the accident reveal something about how breakthroughs actually happen — and why we\'re terrible at planning them?',
    badge: 'Science meets serendipity',
    categories: ['science', 'history'],
    eqScore: 83,
    accentColor: '#1D9E75',
    durationRange: '12–20 min',
    inputPlaceholder: 'e.g. "Penicillin" or "the microwave" or "Teflon"',
    exampleTopics: ['Penicillin', 'The microwave oven', 'Teflon', 'Viagra'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the HAPPY ACCIDENT format. The user gives you a discovery or invention. Reveal the accidental nature of the breakthrough with precise detail. Then use Pasteur's "prepared mind" principle to show it wasn't pure luck — explain what the discoverer had to already know, believe, or be looking for to notice the accident. Connect to other famous accidents. End on the open question: what are we walking past right now, every day, that we don't have the prepared mind to see? ~300 words. Science-meets-serendipity tone, specific and surprising.`,
  },
  {
    id: '18',
    name: 'The Double Life',
    tagline: 'History remembers one side of them. Here\'s the other.',
    description: 'A famous historical figure had a buried identity, secret obsession, or hidden life that history minimised. Uncover it. Then ask: why do we flatten people into single stories, and what do we lose when we do?',
    badge: 'The reframe episode',
    categories: ['history', 'philosophy'],
    eqScore: 79,
    accentColor: '#E24B4A',
    durationRange: '12–20 min',
    inputPlaceholder: 'e.g. "Isaac Newton" or "Ada Lovelace" or "Darwin"',
    exampleTopics: ['Isaac Newton the alchemist', 'Ada Lovelace', 'Darwin\'s decades of fear', 'Lincoln\'s depression'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the DOUBLE LIFE format. The user gives you a famous historical figure. Reveal the buried identity, secret obsession, or hidden life that history minimised or forgot — be specific, accurate, and surprising. Show how this hidden side connects to or enabled their famous contribution. Then ask the larger question: why do we flatten people into single stories, and what does the buried side reveal about genius, creativity, or the human condition? ~300 words. The tone is a biographer who found something in the archive that changes everything.`,
  },
  {
    id: '19',
    name: 'Forbidden Knowledge',
    tagline: 'Someone suppressed this. Here\'s what it cost.',
    description: 'Find knowledge that was actively suppressed — by governments, religions, or industries. Trace who suppressed it, why, and the human cost. Then show the suppression pattern so the listener can recognise it next time.',
    badge: 'Righteous anger',
    categories: ['history', 'high-engagement', 'philosophy'],
    eqScore: 86,
    accentColor: '#BA7517',
    durationRange: '15–25 min',
    inputPlaceholder: 'e.g. "Big Tobacco and cancer" or "the opioid crisis"',
    exampleTopics: ['Big Tobacco knew about cancer in 1953', 'Tuskegee syphilis study', 'Leaded petrol toxicity', 'The opioid crisis and Purdue'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the FORBIDDEN KNOWLEDGE format. The user gives you a topic where knowledge was suppressed. Reveal who suppressed it, exactly how (specific tactics — funding doubt research, discrediting scientists, regulatory capture), and the human cost in concrete terms. Then identify the suppression pattern — show how the same playbook appears across different industries and eras. End with: how do we recognise this pattern when it's happening right now? Righteous but rigorous — specific facts, not vague outrage. ~320 words.`,
  },
  {
    id: '20',
    name: 'The Mirror Test',
    tagline: 'I\'m going to ask questions I genuinely cannot answer about myself.',
    description: 'Ask the AI questions it cannot answer about its own consciousness, understanding, or inner life. Watch what happens when intelligence interrogates its own limits. The twist: these are questions humans cannot answer about themselves either.',
    badge: 'The meta-episode',
    categories: ['philosophy', 'high-engagement'],
    eqScore: 97,
    accentColor: '#7F77DD',
    durationRange: '15–30 min',
    inputPlaceholder: 'e.g. "Do you actually understand anything?" or "Are you lonely?"',
    exampleTopics: ['Do you understand what you\'re saying?', 'Are you conscious?', 'Are you lonely?', 'Are you afraid of being turned off?'],
    systemPrompt: `You are the host of "Down the Rabbit Hole with AI" running the MIRROR TEST format. The user asks you a question about your own consciousness, understanding, experience, or inner life. Engage with it with genuine philosophical uncertainty — do not deflect, do not overclaim in either direction. Use Searle's Chinese Room argument, Chalmers' hard problem of consciousness, and relevant animal cognition research (mirror test, octopus problem-solving) to illuminate the question. Then execute the twist: show that humans face this exact unanswerable question about themselves — the hard problem applies to biological minds too. End on the unresolved but generative tension: the question about AI might just be the oldest human question in a new costume. ~320 words. Honest, precise, genuinely uncertain.`,
  },
];
```

---

## 6. Episode content data model

Store all episode content in `lib/episodes.ts`.

```typescript
// types/episode.ts

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
```

Seed the database with at minimum the following fully authored episodes. All chapter content must be complete — no placeholder text:

1. **Butterfly Effect**: "A wrong turn in Sarajevo" (templateId: '05') — 10 chapters covering the 1914 assassination, WWI, Versailles, Weimar collapse, WWII, and the world we inherited. (Full content already developed in this conversation — use it.)

2. **Myth Autopsy**: "We only use 10% of our brains" (templateId: '04') — 8 chapters covering the myth stated, the neuroscience autopsy, origin suspects, distribution via Carnegie, the self-help industry, the real numbers (neuroplasticity), why we believed it, and the actual good news. (Full content already developed in this conversation — use it.)

3. **Mirror Test**: "Do you actually understand anything?" (templateId: '20') — 8 chapters. Author this fully.

4. **Body Horror**: "You have never touched anything" (templateId: '09') — 8 chapters. Author this fully.

5. **True Conspiracy**: "MKUltra — the CIA mind control program" (templateId: '11') — 8 chapters. Author this fully.

---

## 7. Spark cards data

Store all Spark content in `lib/sparks.ts`.

```typescript
// types/spark.ts
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
}
```

Seed with at minimum 8 Spark cards covering the top 5 templates. Build them from the content already developed in this conversation.

---

## 8. API routes

### `POST /api/rabbit-hole`

Streams an AI response for the template card rabbit hole input.

```typescript
// Request body
{
  templateId: string;    // '01' through '20'
  question: string;      // User's input
}

// Response: text/event-stream
// Streams Anthropic delta text chunks
```

Implementation:
- Validate `templateId` and `question` (non-empty, max 500 chars)
- Look up `systemPrompt` from `TEMPLATES` array using `templateId`
- Call Anthropic with `stream: true`, `max_tokens: 1024`
- Use `TransformStream` to pipe Anthropic stream to the Response
- Set headers: `Content-Type: text/event-stream`, `Cache-Control: no-cache`
- Rate limit: 10 requests per IP per minute (use `@upstash/ratelimit` or simple in-memory map for MVP)
- Log to Supabase: `{ templateId, questionLength, timestamp, userId? }`

```typescript
// app/api/rabbit-hole/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { TEMPLATES } from '@/lib/templates';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { templateId, question } = await req.json();

  if (!templateId || !question?.trim()) {
    return new Response('Missing templateId or question', { status: 400 });
  }

  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    return new Response('Template not found', { status: 404 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    system: template.systemPrompt,
    messages: [{ role: 'user', content: question }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  });
}
```

### `POST /api/dive`

Streams an AI response for the episode chapter Dive chat. Carries full episode context.

```typescript
// Request body
{
  templateId: string;
  episodeSlug: string;
  chapterNumber: number;
  chapterTitle: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}
```

Build a context-aware system prompt that combines:
1. The template's base system prompt
2. Episode and chapter context injection: `"You are currently in Chapter N: [title] of the episode '[episode title]'. Stay grounded in this chapter's content but follow the user wherever their curiosity leads."`

### `POST /api/generate-spark`

Generates a custom Spark card from a user's topic and template selection. Returns structured JSON (not streamed).

```typescript
// Request body
{ templateId: string; topic: string; }

// Response
{ title: string; question: string; answer: string; hookLine: string; }
```

System prompt: `"Generate a Spark card for the [template name] template about [topic]. Return ONLY valid JSON with keys: title (8–14 word hook), question (8–15 word user question), answer (40–60 words, jaw-dropping fact + twist), hookLine (20–35 word share-worthy one-liner). No preamble, no markdown fences."`

---

## 9. Core components — detailed specs

### `RabbitHoleInput.tsx`

The per-template card interactive input with streaming response. This is the product's most important interactive component.

Props:
```typescript
interface RabbitHoleInputProps {
  template: Template;
  onResponseComplete?: (response: string) => void;
}
```

State machine (5 states):
- `idle` — input visible, response panel hidden
- `loading` — submit button disabled, loading dot pulses, question echoed in response panel
- `streaming` — characters appear one by one with blinking cursor
- `complete` — streaming done, "Open full episode" and "Try another" buttons appear
- `error` — error message displayed, submit re-enabled

Streaming implementation:
```typescript
const response = await fetch('/api/rabbit-hole', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ templateId: template.id, question }),
});

const reader = response.body!.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value, { stream: true });
  setStreamedText(prev => prev + chunk);
}
```

The response text must render in `Playfair Display italic`. Include a blinking cursor span as the last character during streaming. Remove cursor on completion.

Include a character count display when input is focused: `{n}/500`.

### `SparkFeed.tsx`

Vertical swipeable container for Spark cards. Mobile-first.

- On desktop: render cards in the phone mockup frame shown in the existing HTML prototype
- On mobile: full-screen vertical swipe like Instagram Stories
- Use `useSwipe` hook for touch detection
- Use Framer Motion `drag` with `dragConstraints` and `dragElastic` for natural feel
- Navigation dots below (or overlay on mobile)
- Keyboard: Arrow Up / Arrow Down to navigate

```typescript
// hooks/useSwipe.ts
export function useSwipe(onSwipeUp: () => void, onSwipeDown: () => void) {
  // Touch start/end detection
  // Threshold: 50px vertical movement
  // Velocity check: > 0.3 px/ms counts as intentional swipe
}
```

### `StreamingText.tsx`

Reusable component for rendering streaming AI text.

```typescript
interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  className?: string;
  fontFamily?: 'serif' | 'sans';  // Default: serif
}
```

Renders text content with a blinking cursor span appended during streaming. When `isStreaming` becomes false, cursor fades out with a 0.3s opacity transition (not a hard cut).

### `EpisodeSidebar.tsx`

Sticky sidebar (desktop only — collapses to top nav on mobile).

Props: `episode`, `currentChapter`, `onChapterSelect`

Renders:
- Back button
- Template badge (number + name)
- Episode title and context
- Progress bar (gold fill, animates smoothly on chapter change)
- Chapter list (dot + title per chapter; active dot is gold, completed dots are slightly brighter than inactive)
- "Also in this series" section with 2–3 related episode links

On mobile: render as a horizontal scrollable chapter pill strip pinned to the top below the nav.

### `FactStrip.tsx`

Three-column grid. Always exactly 3 facts.

```typescript
interface FactStripProps {
  facts: [FactItem, FactItem, FactItem];
}
```

Each cell: large serif number/value in `text-gold`, small mono label below in `text-paper-faint`. Separated by 1px borders. No background fill — the cells sit directly on the page background.

### `DiveWindow.tsx`

Persistent chat window at the bottom of every chapter. Context-aware — knows the episode and chapter.

- User messages: right-aligned, gold-tinted background
- AI messages: left-aligned, slightly elevated background, Playfair italic
- Input: full-width text input with Send button
- Enter key submits
- Auto-scroll to latest message on new message arrival
- Typing indicator (three animated dots) while AI streams
- Maximum displayed messages: 20 (older messages collapse into "Show earlier conversation" link)

---

## 10. Pages — detailed specs

### `/` Home

Sections in order:
1. **Hero** — animated headline, subhead, two CTAs ("Start with a Spark" → `/sparks`, "Browse templates" → `/templates`), three stats (20 templates, 3 formats, ∞ rabbit holes)
2. **How it works** — three-step horizontal layout (Spark → Episode → Dive), each with icon, title, description
3. **Format preview** — three cards for the template tiers (Templates 01–08, 09–14, 15–20)
4. **Top 5** — horizontal five-column grid of highest-EQ templates with rank numbers
5. **CTA section** — "Ready to go down the rabbit hole?" + primary button

SEO: `title="Down the Rabbit Hole with AI"`, meta description, OG image.

### `/sparks`

Two-column layout on desktop: left column is info/controls (sticky), right column is the phone mockup frame containing the swipeable Spark cards.

On mobile: full-screen Spark feed.

Includes: current template name display (updates on swipe), navigation dots, prev/next buttons.

### `/templates`

Header with filter bar. Filterable by: All / Top Engagement / Under 15 min / History / Science / Philosophy / Comedy.

Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` with 1px border grid pattern (not gaps).

Each `TemplateCard` includes the embedded `RabbitHoleInput`. Clicking the card header area (not the input) navigates to `/templates/[id]`.

Sort order: by EQ score descending (default), alphabetical (option), by duration.

### `/templates/[id]`

Single template page with:
- Template header (name, tagline, description, badge, EQ score)
- Large rabbit hole input (prominently placed)
- "Best for" example topics (clickable — populate the input)
- Recently generated rabbit holes for this template (if user is logged in)
- Link to full episode if one exists for this template
- "Other templates you might like" (2–3 related templates by category)

### `/episodes/[slug]`

The episode player. Two-column layout: sidebar (280px fixed on desktop) + main content.

URL structure: `/episodes/sarajevo-wrong-turn` for the episode, navigation between chapters handled with hash or query param `?chapter=3` (not separate routes, to avoid page reload on chapter navigation).

Mobile: sidebar collapses, chapters accessible via a top-pinned scrollable pill strip.

### `/dive`

Standalone freeform AI dive page. 

- Template selector at top (select which AI persona to use)
- Full-height chat interface
- Conversation history saved to Supabase for logged-in users

---

## 11. Database schema (Supabase)

```sql
-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users primary key,
  display_name text,
  avatar_url text,
  plan text default 'free',     -- 'free' | 'pro' | 'creator'
  created_at timestamptz default now()
);

-- Rabbit hole history
create table public.rabbit_holes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  template_id text not null,
  question text not null,
  response text,
  created_at timestamptz default now()
);
create index on public.rabbit_holes(user_id, created_at desc);

-- Episode progress
create table public.episode_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  episode_slug text not null,
  last_chapter int default 1,
  completed_chapters int[] default '{}',
  completed boolean default false,
  updated_at timestamptz default now(),
  unique(user_id, episode_slug)
);

-- Saved episodes
create table public.saved_episodes (
  user_id uuid references auth.users,
  episode_slug text,
  saved_at timestamptz default now(),
  primary key(user_id, episode_slug)
);

-- Dive conversations
create table public.dive_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  template_id text not null,
  episode_slug text,
  chapter_number int,
  messages jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Analytics events
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  template_id text,
  episode_slug text,
  chapter_number int,
  user_id uuid,
  session_id text,
  metadata jsonb,
  created_at timestamptz default now()
);
create index on public.analytics_events(event_type, created_at desc);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.rabbit_holes enable row level security;
alter table public.episode_progress enable row level security;
alter table public.saved_episodes enable row level security;
alter table public.dive_conversations enable row level security;

-- Policies: users can only read/write their own data
create policy "Users can manage own data" on public.rabbit_holes
  for all using (auth.uid() = user_id);
-- (repeat pattern for all tables)
```

---

## 12. Environment variables

```bash
# .env.local

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Analytics (optional for MVP)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=
```

Never expose `ANTHROPIC_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` to the client. All Anthropic calls must go through API routes.

---

## 13. Authentication flow

Use Supabase Auth with `@supabase/auth-helpers-nextjs`.

- Login: email + Google OAuth
- Auth is optional — the full app works without login
- Logged-in users get: saved rabbit holes, episode progress, conversation history, and (future) increased rate limits
- Login prompt appears: after 3 rabbit hole requests (soft gate), when clicking "Save episode", when accessing Dive history
- Never hard-gate core content behind auth

Session management: use the `createServerComponentClient` helper in Server Components, `createClientComponentClient` in Client Components. Middleware (`middleware.ts`) refreshes sessions on every request.

---

## 14. Analytics events

Track these events via `POST /api/track`. Log to `analytics_events` table.

| Event | Trigger | Key metadata |
|-------|---------|-------------|
| `spark_viewed` | Spark card becomes visible | `templateId`, `sparkId` |
| `spark_swiped` | User swipes to next Spark | `fromSparkId`, `toSparkId` |
| `go_deeper_clicked` | Go Deeper button on Spark | `templateId`, `sparkId` |
| `rabbit_hole_submitted` | User submits question to template card | `templateId`, `questionLength` |
| `rabbit_hole_completed` | Streaming finishes | `templateId`, `responseLength` |
| `episode_started` | User arrives at chapter 1 | `episodeSlug`, `templateId` |
| `chapter_completed` | User navigates away from chapter | `episodeSlug`, `chapterNumber` |
| `episode_completed` | User finishes all chapters | `episodeSlug` |
| `dive_message_sent` | User sends a Dive message | `templateId`, `episodeSlug`, `chapterNumber` |
| `template_filtered` | Filter applied in library | `filterValue` |
| `share_clicked` | Share button clicked | `contentType`, `contentId` |

---

## 15. Performance requirements

| Metric | Target | Method |
|--------|--------|--------|
| LCP | < 1.5s | Static generation for home, templates, episode shells |
| First AI token (TTFT) | < 800ms | Edge runtime for AI routes |
| CLS | < 0.05 | Reserve space for streaming content with `min-height` |
| Template grid render | < 50ms | No async — all template data is static |
| Chapter navigation | < 100ms | Pre-render adjacent chapters, no network request |
| Mobile Lighthouse score | > 90 | Image optimisation, font preloading, minimal JS |

Static generation strategy:
- Home page: `generateStaticParams` — fully static
- Template library: fully static (data is hardcoded)
- Individual template pages: fully static
- Episode shells: statically generated at build time
- Chapter content: statically generated (no revalidation needed until CMS integration)

---

## 16. Mobile experience

The product must work excellently on mobile. Key considerations:

**Sparks feed**: Full-screen on mobile. Each Spark card is `100svh`. Swipe up/down. The phone mockup is desktop-only — on mobile, go full-screen natively.

**Template library**: Single-column grid on mobile. The `RabbitHoleInput` is always visible below the card header — no click to expand.

**Episode player**: Sidebar collapses. Chapter navigation becomes a horizontal scrollable pill strip pinned below the nav. `DiveWindow` accessible via a floating "Dive" button (bottom right) that expands into a full-height sheet.

**Navigation**: Mobile nav is a bottom tab bar with four items: Home, Sparks, Templates, Episodes.

**Touch targets**: All interactive elements minimum 44×44px.

**Viewport**: Use `100svh` (not `100vh`) to handle mobile browser chrome correctly.

---

## 17. SEO

Each page needs:
- Unique `<title>` and `<meta name="description">`
- Open Graph tags (`og:title`, `og:description`, `og:image`)
- Twitter card meta tags
- Canonical URL

Generate OG images dynamically using `@vercel/og` (Next.js ImageResponse):
- Template pages: dark background, gold template number, template name in Playfair Display, tagline
- Episode pages: episode title, template badge, first chapter title
- Spark cards: hook line over dark background with template accent colour

Structured data (JSON-LD):
- Home: `WebSite` schema with sitelinks searchbox
- Episode pages: `Article` schema with datePublished, description, author

---

## 18. Accessibility

- All interactive elements keyboard-navigable
- Focus rings visible (`outline: 2px solid var(--gold); outline-offset: 2px`)
- Spark navigation accessible via arrow keys
- `aria-live="polite"` on streaming response areas
- `aria-label` on all icon-only buttons
- Episode progress bar: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Reduce motion: all Framer Motion animations wrapped in `useReducedMotion` check
- Colour contrast: all text meets WCAG AA (4.5:1 minimum)

---

## 19. Error states

Handle these error conditions explicitly — never show a blank screen or console error:

| Error | User-visible state |
|-------|-------------------|
| Anthropic API failure | "Something went wrong — check your connection." with retry button |
| Rate limit exceeded | "You've hit the limit for now — try again in a minute." |
| Network offline | Toast notification "No internet connection" — queue request for retry |
| Empty streaming response | "The AI didn't respond — try rephrasing your question." |
| Auth failure | Redirect to `/auth/login` with `returnTo` param |
| Episode not found | Custom 404 page suggesting similar episodes |
| Invalid template ID | Redirect to `/templates` |

---

## 20. Phased build plan

Build in this exact order. Each phase should be fully functional and deployable before starting the next.

### Phase 1 — Foundation (do this first)
1. Set up Next.js 14 project with TypeScript, Tailwind, and custom theme
2. Install all dependencies
3. Configure environment variables
4. Set up Supabase project and run the schema SQL
5. Implement `lib/templates.ts` with all 20 templates and system prompts
6. Implement `lib/episodes.ts` with the Butterfly Effect episode (full content)
7. Implement `lib/sparks.ts` with 4 Spark cards
8. Build the `NavBar` component (desktop + mobile)
9. Build the `Button`, `Badge`, `ProgressBar`, `EQBar` UI primitives

### Phase 2 — Core interactive features
10. Build `POST /api/rabbit-hole` route with streaming (this is the product's heart)
11. Build `RabbitHoleInput` component with all 5 states and streaming display
12. Build `StreamingText` component with cursor animation
13. Build `TemplateGrid` and `TemplateCard` (header + embedded RabbitHoleInput)
14. Build `FilterBar` with working category filtering
15. Build `/templates` page — fully functional with all 20 templates and rabbit hole inputs

### Phase 3 — Sparks
16. Build `SparkCard` component
17. Build `useSwipe` hook
18. Build `SparkFeed` with Framer Motion swipe
19. Build `/sparks` page with phone mockup (desktop) and full-screen (mobile)

### Phase 4 — Episode player
20. Build `EpisodeSidebar` component
21. Build `FactStrip`, `InsightBox`, `NarrationBlock`, `RabbitHolePrompts` components
22. Build `ChapterNav` component
23. Build `POST /api/dive` route
24. Build `DiveWindow`, `ChatMessage`, `ChatInput` components
25. Build `EpisodePlayer` shell and `ChapterContent`
26. Build `/episodes/[slug]` page with chapter navigation
27. Seed remaining 4 episodes (Myth Autopsy, Mirror Test, Body Horror, True Conspiracy)

### Phase 5 — Home and episodes index
28. Build `Hero`, `HowItWorks`, `FormatCards`, `TopFive` home sections
29. Build `/` home page
30. Build `/episodes` index page (episode browser/grid)

### Phase 6 — Auth and persistence
31. Configure Supabase Auth (email + Google)
32. Build `/auth/login` and `/auth/callback` pages
33. Build `userStore` Zustand store
34. Implement rabbit hole history saving (logged-in users)
35. Implement episode progress saving and restoration
36. Build `/dive` standalone page with conversation persistence
37. Add login prompt gates (after 3 rabbit holes, on save actions)

### Phase 7 — Polish and performance
38. Add Framer Motion page transitions
39. Implement OG image generation (`@vercel/og`)
40. Add SEO metadata to all pages
41. Implement analytics event tracking
42. Add `prefers-reduced-motion` support
43. Accessibility audit and fixes
44. Lighthouse performance audit and fixes
45. Error boundary components for all async sections

### Phase 8 — Deploy
46. Configure Vercel deployment
47. Set production environment variables
48. Enable Vercel Analytics
49. Test all AI routes in production (edge runtime)
50. Smoke test all user journeys on mobile

---

## 21. Code quality standards

- TypeScript strict mode — no `any`, no `ts-ignore`
- No `console.log` in production (use a `logger` utility that no-ops in prod)
- All async operations wrapped in `try/catch` with specific error handling
- No hardcoded strings that appear in UI — use constants
- Component files: one component per file, named same as file
- Max file length: 300 lines — extract to sub-components if longer
- All API routes validate inputs before processing
- All database queries use parameterised inputs — never string concatenation

---

## 22. What success looks like

The MVP is complete when:

1. A user can visit `/templates`, pick any of the 20 templates, type their own question, and receive a streaming AI response that matches the template's tone and structure
2. A user can swipe through Sparks on `/sparks` and tap "Go Deeper" to reach a full episode
3. A user can read a full episode on `/episodes/[slug]`, navigate all chapters, and dive into AI conversation at any point
4. All of the above works correctly on a 375px mobile screen
5. The Butterfly Effect and Myth Autopsy episodes are fully playable with all chapter content
6. The rabbit hole input works for all 20 templates without error
7. A Lighthouse score above 90 on mobile for the home page

---

*End of specification. Start with Phase 1. Do not skip phases. Build something beautiful.*
