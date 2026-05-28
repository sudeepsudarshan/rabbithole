'use client';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type MutableRefObject,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  MessageCircle,
  Mic,
  Send,
  Loader2,
  RotateCcw,
  Play,
  Pause,
  ChevronDown,
  ArrowUpRight,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SparkCard } from '@/types/spark';
import { cn } from '@/lib/utils';
import { getPersonaForTemplate } from '@/lib/personas';

// ─── Types ───────────────────────────────────────────────────────────────────

export type PanelTab = 'deeper' | 'ask' | 'podcast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface PanelState {
  activeTab: PanelTab;
  ask: {
    messages: Message[];
    streaming: boolean;
    inputDraft: string;
  };
  podcast: {
    playing: boolean;
    progress: number;
    speed: number;
    loading: boolean;
    error: string | null;
  };
  deeper: {
    article: string | null;
    loading: boolean;
    error: string | null;
  };
}

export function defaultPanelState(tab: PanelTab = 'deeper'): PanelState {
  return {
    activeTab: tab,
    ask: { messages: [], streaming: false, inputDraft: '' },
    podcast: { playing: false, progress: 0, speed: 1, loading: false, error: null },
    deeper: { article: null, loading: false, error: null },
  };
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────

const TABS: { id: PanelTab; icon: typeof BookOpen; label: string }[] = [
  { id: 'deeper', icon: BookOpen, label: 'Deeper' },
  { id: 'ask', icon: MessageCircle, label: 'Ask' },
  { id: 'podcast', icon: Mic, label: 'Podcast' },
];

// ─── Deeper tab ──────────────────────────────────────────────────────────────

function DeeperTab({
  spark,
  state,
  onStateChange,
}: {
  spark: SparkCard;
  state: PanelState['deeper'];
  onStateChange: (update: Partial<PanelState['deeper']>) => void;
}) {
  const persona = getPersonaForTemplate(spark.templateId);

  const fetchArticle = useCallback(async () => {
    onStateChange({ loading: true, error: null });
    try {
      const res = await fetch('/api/deeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: spark.title,
          question: spark.question,
          answer: spark.answer,
          templateLabel: spark.templateLabel,
          hookLine: spark.hookLine,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      onStateChange({ article: data.article ?? null, loading: false });
    } catch {
      onStateChange({ loading: false, error: 'Couldn\'t generate the article. Try again.' });
    }
  }, [spark, onStateChange]);

  // Auto-fetch article for sparks without a pre-written episode
  useEffect(() => {
    if (!spark.episodeSlug && !state.article && !state.loading && !state.error) {
      fetchArticle();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero image */}
      <div className="relative w-full flex-shrink-0" style={{ height: '200px' }}>
        <Image src={spark.heroImage} alt="" fill className="object-cover" sizes="100vw" />
        <div
          className="absolute bottom-0 inset-x-0 h-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--bg-elevated), transparent)' }}
        />
      </div>

      {/* Article content */}
      <div className="px-5 pt-3 pb-6 space-y-4">
        {/* Template badge + host */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.6rem] font-mono uppercase tracking-wider border"
            style={{
              color: spark.accentColor,
              borderColor: `${spark.accentColor}50`,
              background: `${spark.accentColor}15`,
            }}
          >
            {spark.templateLabel}
          </span>
          {persona && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[0.55rem] font-bold flex-shrink-0"
                style={{ background: `${spark.accentColor}25`, color: spark.accentColor }}
              >
                {persona.name.charAt(0)}
              </span>
              <span className="text-[0.6rem] font-mono uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                {persona.name} · {persona.oneLiner}
              </span>
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-serif text-[1.25rem] leading-snug" style={{ color: 'var(--ink-primary)' }}>
          {spark.title}
        </h2>

        {/* Full answer */}
        <p className="text-[0.88rem] font-serif italic leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
          {spark.answer}
        </p>

        {/* Divider */}
        <div className="border-t border-[var(--border-hairline)]" />

        {/* Hook line pull-quote */}
        <blockquote className="pl-3 border-l-2" style={{ borderColor: spark.accentColor }}>
          <p className="text-[0.8rem] italic font-serif leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
            &ldquo;{spark.hookLine}&rdquo;
          </p>
        </blockquote>

        {/* For sparks with an episode — link to full episode */}
        {spark.episodeSlug && (
          <Link href={`/episodes/${spark.episodeSlug}`}>
            <div
              className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95"
              style={{ background: spark.accentColor, color: '#000' }}
            >
              <ArrowUpRight className="w-4 h-4" />
              Read full episode
            </div>
          </Link>
        )}

        {/* For sparks without an episode — show generated article */}
        {!spark.episodeSlug && (
          <>
            {state.loading && (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--ink-muted)' }} />
                <p className="text-sm font-serif italic" style={{ color: 'var(--ink-muted)' }}>Going deeper…</p>
              </div>
            )}
            {state.error && (
              <div className="flex flex-col items-center gap-3 py-8">
                <p className="text-sm text-center" style={{ color: 'var(--ink-secondary)' }}>{state.error}</p>
                <button
                  onClick={fetchArticle}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                  style={{ border: '1px solid var(--border-hairline)', color: 'var(--ink-secondary)' }}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Try again
                </button>
              </div>
            )}
            {state.article && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1" style={{ background: 'var(--border-hairline)' }} />
                  <span className="text-[0.58rem] font-mono uppercase tracking-widest" style={{ color: 'var(--ink-faint)' }}>
                    Deep dive
                  </span>
                  <div className="h-px flex-1" style={{ background: 'var(--border-hairline)' }} />
                </div>
                {state.article.split('\n\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-[0.86rem] font-serif leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                    {para}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Ask tab ─────────────────────────────────────────────────────────────────

function AskTab({
  spark,
  state,
  onStateChange,
}: {
  spark: SparkCard;
  state: PanelState['ask'];
  onStateChange: (update: Partial<PanelState['ask']>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages.length, state.streaming]);

  const handleSubmit = useCallback(async () => {
    const q = state.inputDraft.trim();
    if (!q || state.streaming) return;

    const userMsg: Message = { role: 'user', content: q };
    const history = [...state.messages, userMsg];
    onStateChange({
      messages: [...history, { role: 'assistant', content: '' }],
      streaming: true,
      inputDraft: '',
    });

    try {
      const res = await fetch('/api/rabbit-hole', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: spark.templateId,
          question: q,
          sparkTitle: spark.title,
          sparkAnswer: spark.answer,
          history: state.messages,
        }),
      });

      if (!res.ok || !res.body) throw new Error('Request failed');

      const reader = res.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let aiText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        onStateChange({
          messages: [...history, { role: 'assistant', content: aiText }],
          streaming: true,
        });
      }

      onStateChange({
        messages: [...history, { role: 'assistant', content: aiText }],
        streaming: false,
      });
    } catch {
      onStateChange({
        messages: [
          ...history,
          { role: 'assistant', content: 'Something went wrong. Try again.' },
        ],
        streaming: false,
      });
    }
  }, [state, spark, onStateChange]);

  const hasMessages = state.messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        <div className="rounded-xl px-4 py-3 mb-4"
          style={{ border: '1px solid var(--border-hairline)', background: 'var(--state-hover)' }}>
          <p className="text-[0.6rem] font-mono uppercase tracking-wider mb-1" style={{ color: spark.accentColor }}>
            Exploring
          </p>
          <p className="text-[0.78rem] font-serif italic leading-snug line-clamp-2 text-[var(--ink-secondary)]">
            {spark.title}
          </p>
        </div>

        {!hasMessages && (
          <div className="space-y-2">
            <p className="text-[0.6rem] font-mono uppercase tracking-wider px-1 text-[var(--ink-faint)]">
              Start here
            </p>
            {spark.suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  onStateChange({ inputDraft: q });
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-[0.8rem] leading-snug transition-all active:scale-[0.98]"
                style={{
                  border: '1px solid var(--border-hairline)',
                  background: 'var(--state-hover)',
                  color: 'var(--ink-secondary)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--state-active)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--state-hover)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-secondary)';
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {state.messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          const isLastAI = !isUser && i === state.messages.length - 1 && state.streaming;
          return (
            <div key={i} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[88%] px-4 py-3 rounded-2xl text-[0.83rem] leading-relaxed',
                  isUser ? 'rounded-br-sm font-sans' : 'rounded-bl-sm font-serif italic'
                )}
                style={
                  isUser
                    ? {
                        background: spark.accentColor + '28',
                        border: `1px solid ${spark.accentColor}40`,
                        color: 'var(--ink-primary)',
                      }
                    : {
                        background: 'var(--state-hover)',
                        border: '1px solid var(--border-hairline)',
                        color: 'var(--ink-primary)',
                      }
                }
              >
                {msg.content || (isLastAI && <span style={{ color: 'var(--ink-faint)' }}>…</span>)}
                {isLastAI && msg.content && (
                  <span className="streaming-cursor" aria-hidden="true" />
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 flex gap-2 items-center flex-shrink-0"
        style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <input
          ref={inputRef}
          type="text"
          value={state.inputDraft}
          onChange={(e) => onStateChange({ inputDraft: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Ask anything about this…"
          maxLength={500}
          disabled={state.streaming}
          className="flex-1 rounded-xl px-4 py-2.5 text-[0.83rem] focus:outline-none transition-colors"
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-hairline)',
            color: 'var(--ink-primary)',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!state.inputDraft.trim() || state.streaming}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
          style={state.inputDraft.trim() && !state.streaming
            ? { background: spark.accentColor }
            : { background: 'var(--state-hover)', border: '1px solid var(--border-hairline)' }
          }
        >
          {state.streaming
            ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--ink-muted)' }} />
            : <Send className="w-4 h-4" style={{ color: state.inputDraft.trim() ? '#000' : 'var(--ink-muted)' }} />
          }
        </button>
      </div>
    </div>
  );
}

// ─── Podcast tab — audio narration player ────────────────────────────────────

const SPEEDS = [0.75, 1, 1.25, 1.5] as const;

function PodcastTab({
  spark,
  state,
  onStateChange,
  deeperState,
  onDeeper,
}: {
  spark: SparkCard;
  state: PanelState['podcast'];
  onStateChange: (update: Partial<PanelState['podcast']>) => void;
  deeperState: PanelState['deeper'];
  onDeeper: (update: Partial<PanelState['deeper']>) => void;
}) {
  const chunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef(0);
  const activeRef = useRef(true);

  // Split article text into ≤250-char sentence chunks (iOS Safari compatibility)
  const buildChunks = (text: string): string[] => {
    const sentences = text.match(/[^.!?]+[.!?]+[\s]*/g) ?? [text];
    const chunks: string[] = [];
    let current = '';
    for (const s of sentences) {
      if ((current + s).length > 250 && current) {
        chunks.push(current.trim());
        current = s;
      } else {
        current += s;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks.length ? chunks : [text];
  };

  const playFrom = useCallback((index: number, speed: number, article: string) => {
    if (!activeRef.current || typeof window === 'undefined' || !window.speechSynthesis) return;
    if (index >= chunksRef.current.length) {
      onStateChange({ playing: false, progress: 1 });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunksRef.current[index]);
    utterance.rate = speed;
    utterance.lang = 'en-US';

    utterance.onend = () => {
      if (!activeRef.current) return;
      const nextIndex = index + 1;
      chunkIndexRef.current = nextIndex;
      const prog = nextIndex / chunksRef.current.length;
      onStateChange({ progress: Math.min(prog, 1) });
      playFrom(nextIndex, speed, article);
    };

    utterance.onerror = () => {
      if (!activeRef.current) return;
      onStateChange({ playing: false });
    };

    window.speechSynthesis.speak(utterance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onStateChange]);

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Cancel on unmount or tab switch
  useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false;
      stopSpeech();
      onStateChange({ playing: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If deeper article isn't loaded yet, trigger generation
  const fetchArticle = useCallback(async () => {
    onDeeper({ loading: true, error: null });
    try {
      const res = await fetch('/api/deeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: spark.title,
          question: spark.question,
          answer: spark.answer,
          templateLabel: spark.templateLabel,
          hookLine: spark.hookLine,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      onDeeper({ article: data.article ?? null, loading: false });
    } catch {
      onDeeper({ loading: false, error: 'Couldn\'t load the article. Try again.' });
    }
  }, [spark, onDeeper]);

  useEffect(() => {
    if (!deeperState.article && !deeperState.loading && !deeperState.error) {
      fetchArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayPause = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const article = deeperState.article;
    if (!article) return;

    if (state.playing) {
      stopSpeech();
      onStateChange({ playing: false });
    } else {
      // Fresh start or restart from beginning
      chunksRef.current = buildChunks(article);
      chunkIndexRef.current = 0;
      onStateChange({ playing: true, progress: 0 });
      playFrom(0, state.speed, article);
    }
  };

  const handleSpeed = (speed: number) => {
    onStateChange({ speed });
    if (state.playing) {
      // Restart from beginning with new speed
      stopSpeech();
      const article = deeperState.article;
      if (!article) return;
      chunksRef.current = buildChunks(article);
      chunkIndexRef.current = 0;
      onStateChange({ playing: true, progress: 0, speed });
      playFrom(0, speed, article);
    }
  };

  const handleRegenerate = () => {
    stopSpeech();
    onStateChange({ playing: false, progress: 0 });
    onDeeper({ article: null, loading: false, error: null });
    fetchArticle();
  };

  const isLoading = deeperState.loading || (!deeperState.article && !deeperState.error);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {/* Cover art */}
        <div className="relative w-full rounded-2xl overflow-hidden flex-shrink-0" style={{ height: '160px' }}>
          <Image src={spark.heroImage} alt="" fill className="object-cover saturate-[0.85]" sizes="100vw" />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-[0.52rem] font-mono uppercase tracking-widest mb-0.5" style={{ color: spark.accentColor }}>
              {state.playing ? 'Now playing' : 'Ready to play'}
            </p>
            <p className="text-white font-serif text-sm leading-snug line-clamp-2">
              {spark.title}
            </p>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--ink-muted)' }} />
            <p className="text-sm font-serif italic" style={{ color: 'var(--ink-muted)' }}>
              Preparing narration…
            </p>
          </div>
        )}

        {/* Error state */}
        {deeperState.error && !isLoading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <p className="text-sm text-center" style={{ color: 'var(--ink-secondary)' }}>
              {deeperState.error}
            </p>
            <button
              onClick={handleRegenerate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              style={{ border: '1px solid var(--border-hairline)', color: 'var(--ink-secondary)' }}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Try again
            </button>
          </div>
        )}

        {/* Player — article loaded */}
        {deeperState.article && !isLoading && (
          <>
            {/* Play/pause */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handlePlayPause}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95"
                style={{ background: spark.accentColor }}
              >
                {state.playing
                  ? <Pause className="w-6 h-6 text-black" />
                  : <Play className="w-6 h-6 text-black fill-black" />
                }
              </button>
              <p className="text-[0.6rem] font-mono uppercase tracking-widest" style={{ color: 'var(--ink-faint)' }}>
                {state.playing ? 'Tap to pause' : state.progress > 0 ? 'Tap to replay' : 'Tap to play'}
              </p>
            </div>

            {/* Progress bar */}
            <div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border-hairline)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(state.progress * 100)}%`, background: spark.accentColor }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-mono text-[0.52rem]" style={{ color: 'var(--ink-faint)' }}>
                  {Math.round(state.progress * 100)}%
                </span>
                <span className="font-mono text-[0.52rem]" style={{ color: 'var(--ink-faint)' }}>
                  ~{Math.round((deeperState.article.split(' ').length / 150) * (1 / state.speed))} min
                </span>
              </div>
            </div>

            {/* Speed selector */}
            <div className="flex items-center gap-2">
              <span className="text-[0.58rem] font-mono text-[var(--ink-faint)] mr-1">Speed</span>
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeed(s)}
                  className="px-2.5 py-1 rounded-full text-[0.62rem] font-mono transition-all"
                  style={
                    state.speed === s
                      ? { background: spark.accentColor, color: '#000' }
                      : { border: '1px solid var(--border-hairline)', color: 'var(--ink-muted)' }
                  }
                >
                  {s}×
                </button>
              ))}
              <button
                onClick={handleRegenerate}
                className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.62rem] font-mono transition-all"
                style={{ border: '1px solid var(--border-hairline)', color: 'var(--ink-muted)' }}
              >
                <RotateCcw className="w-2.5 h-2.5" />
                New
              </button>
            </div>

            {/* Article preview */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: 'var(--border-hairline)' }} />
                <span className="text-[0.52rem] font-mono uppercase tracking-widest" style={{ color: 'var(--ink-faint)' }}>
                  Transcript
                </span>
                <div className="h-px flex-1" style={{ background: 'var(--border-hairline)' }} />
              </div>
              <p className="text-[0.78rem] font-serif italic leading-relaxed line-clamp-6" style={{ color: 'var(--ink-muted)' }}>
                {deeperState.article}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main SparkPanel ──────────────────────────────────────────────────────────

interface SparkPanelProps {
  spark: SparkCard | null;
  open: boolean;
  initialTab: PanelTab;
  panelCache: MutableRefObject<Map<string, PanelState>>;
  onClose: () => void;
}

export default function SparkPanel({
  spark,
  open,
  initialTab,
  panelCache,
  onClose,
}: SparkPanelProps) {
  const getState = useCallback((): PanelState => {
    if (!spark) return defaultPanelState();
    const cached = panelCache.current.get(spark.id);
    if (cached) return cached;
    const fresh = defaultPanelState(initialTab);
    panelCache.current.set(spark.id, fresh);
    if (panelCache.current.size > 10) {
      const firstKey = panelCache.current.keys().next().value;
      if (firstKey) panelCache.current.delete(firstKey);
    }
    return fresh;
  }, [spark, initialTab, panelCache]);

  const [localState, setLocalState] = useState<PanelState>(getState);

  useEffect(() => {
    if (open && spark) {
      const s = getState();
      const updated = { ...s, activeTab: initialTab };
      panelCache.current.set(spark.id, updated);
      setLocalState(updated);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, spark?.id, initialTab]);

  const setTab = (tab: PanelTab) => {
    if (!spark) return;
    const updated = { ...localState, activeTab: tab };
    panelCache.current.set(spark.id, updated);
    setLocalState(updated);
  };

  const updateAsk = useCallback((update: Partial<PanelState['ask']>) => {
    setLocalState((prev) => {
      const updated = { ...prev, ask: { ...prev.ask, ...update } };
      if (spark) panelCache.current.set(spark.id, updated);
      return updated;
    });
  }, [spark, panelCache]);

  const updatePodcast = useCallback((update: Partial<PanelState['podcast']>) => {
    setLocalState((prev) => {
      const updated = { ...prev, podcast: { ...prev.podcast, ...update } };
      if (spark) panelCache.current.set(spark.id, updated);
      return updated;
    });
  }, [spark, panelCache]);

  const updateDeeper = useCallback((update: Partial<PanelState['deeper']>) => {
    setLocalState((prev) => {
      const updated = { ...prev, deeper: { ...prev.deeper, ...update } };
      if (spark) panelCache.current.set(spark.id, updated);
      return updated;
    });
  }, [spark, panelCache]);

  if (!spark) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] backdrop-blur-sm"
            style={{ background: 'var(--bg-overlay)' }}
            onClick={onClose}
          />

          <motion.div
            key="panel-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[61] flex flex-col rounded-t-3xl overflow-hidden"
            style={{
              background: 'var(--bg-elevated)',
              borderTop: '1px solid var(--border-hairline)',
              height: '88vh',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle + back strip — full-width tap target to dismiss */}
            <button
              onClick={onClose}
              className="flex flex-col items-center pt-3 pb-2 px-4 flex-shrink-0 w-full transition-colors active:bg-[var(--state-hover)]"
              aria-label="Back to spark"
            >
              {/* Drag handle */}
              <div className="w-10 h-1 rounded-full mb-3" style={{ background: 'var(--ink-faint)' }} />
              {/* Back row */}
              <div className="flex items-center gap-2 w-full">
                <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--ink-muted)' }} />
                <span className="font-mono text-[0.6rem] uppercase tracking-widest flex-shrink-0" style={{ color: 'var(--ink-muted)' }}>
                  Back to spark
                </span>
                <span className="font-serif italic text-[0.78rem] leading-snug line-clamp-1 flex-1 text-right" style={{ color: 'var(--ink-faint)' }}>
                  {spark.title}
                </span>
              </div>
            </button>

            {/* Tab bar */}
            <div className="flex flex-shrink-0 px-4"
              style={{ borderBottom: '1px solid var(--border-hairline)' }}>
              {TABS.map(({ id, icon: Icon, label }) => {
                const isActive = localState.activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className="flex-1 flex flex-col items-center gap-1 py-2.5 relative transition-colors"
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: isActive ? spark.accentColor : 'var(--ink-muted)' }}
                    />
                    <span
                      className="text-[0.58rem] font-mono uppercase tracking-wider"
                      style={{ color: isActive ? spark.accentColor : 'var(--ink-muted)' }}
                    >
                      {label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                        style={{ background: spark.accentColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden relative">
              <div className={localState.activeTab === 'deeper' ? 'h-full overflow-y-auto' : 'hidden'}>
                <DeeperTab spark={spark} state={localState.deeper} onStateChange={updateDeeper} />
              </div>
              <div className={localState.activeTab === 'ask' ? 'h-full flex flex-col' : 'hidden'}>
                <AskTab spark={spark} state={localState.ask} onStateChange={updateAsk} />
              </div>
              <div className={localState.activeTab === 'podcast' ? 'h-full flex flex-col' : 'hidden'}>
                <PodcastTab
                  spark={spark}
                  state={localState.podcast}
                  onStateChange={updatePodcast}
                  deeperState={localState.deeper}
                  onDeeper={updateDeeper}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
