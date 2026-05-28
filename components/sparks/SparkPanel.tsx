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
  X,
  BookOpen,
  MessageCircle,
  Mic,
  Send,
  Loader2,
  RotateCcw,
  Play,
  SkipForward,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
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

interface PodcastTurn {
  host: 'Jay' | 'Maya';
  text: string;
}

export interface PanelState {
  activeTab: PanelTab;
  ask: {
    messages: Message[];
    streaming: boolean;
    inputDraft: string;
  };
  podcast: {
    turns: PodcastTurn[];
    visibleCount: number;
    loading: boolean;
    error: string | null;
  };
}

export function defaultPanelState(tab: PanelTab = 'deeper'): PanelState {
  return {
    activeTab: tab,
    ask: { messages: [], streaming: false, inputDraft: '' },
    podcast: { turns: [], visibleCount: 0, loading: false, error: null },
  };
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────

const TABS: { id: PanelTab; icon: typeof BookOpen; label: string }[] = [
  { id: 'deeper', icon: BookOpen, label: 'Deeper' },
  { id: 'ask', icon: MessageCircle, label: 'Ask' },
  { id: 'podcast', icon: Mic, label: 'Podcast' },
];

// ─── Deeper tab ──────────────────────────────────────────────────────────────

function DeeperTab({ spark }: { spark: SparkCard }) {
  const href = spark.episodeSlug
    ? `/episodes/${spark.episodeSlug}`
    : `/templates/${spark.templateId}`;
  const label = spark.episodeSlug ? 'Read full episode' : 'Try this template';
  const persona = getPersonaForTemplate(spark.templateId);

  return (
    <div className="px-5 py-5 space-y-5">
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
      <h2 className="font-serif italic text-[1.2rem] leading-snug text-[var(--ink-primary)]">
        {spark.title}
      </h2>

      {/* Full answer */}
      <p className="text-[0.88rem] font-serif italic leading-relaxed text-[var(--ink-secondary)]">
        {spark.answer}
      </p>

      {/* Divider */}
      <div className="border-t border-[var(--border-hairline)]" />

      {/* Hook line pull-quote */}
      <blockquote className="pl-3 border-l-2" style={{ borderColor: spark.accentColor }}>
        <p className="text-[0.8rem] italic font-serif leading-relaxed text-[var(--ink-secondary)]">
          &ldquo;{spark.hookLine}&rdquo;
        </p>
      </blockquote>

      {/* CTA */}
      <Link href={href}>
        <div
          className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95"
          style={{ background: spark.accentColor, color: '#000' }}
        >
          <ArrowUpRight className="w-4 h-4" />
          {label}
        </div>
      </Link>
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

  // Scroll to bottom on new messages
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
      {/* Conversation thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {/* Spark context strip */}
        <div className="rounded-xl px-4 py-3 mb-4"
          style={{ border: '1px solid var(--border-hairline)', background: 'var(--state-hover)' }}>
          <p className="text-[0.6rem] font-mono uppercase tracking-wider mb-1" style={{ color: spark.accentColor }}>
            Exploring
          </p>
          <p className="text-[0.78rem] font-serif italic leading-snug line-clamp-2 text-[var(--ink-secondary)]">
            {spark.title}
          </p>
        </div>

        {/* Suggested questions — shown when thread is empty */}
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

        {/* Messages */}
        {state.messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          const isLastAI = !isUser && i === state.messages.length - 1 && state.streaming;
          return (
            <div key={i} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[88%] px-4 py-3 rounded-2xl text-[0.83rem] leading-relaxed',
                  isUser
                    ? 'rounded-br-sm font-sans'
                    : 'rounded-bl-sm font-serif italic'
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

      {/* Input bar */}
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

// ─── Podcast tab ─────────────────────────────────────────────────────────────

const HOST_STYLE = {
  Jay: { emoji: '🎙', role: 'The Curious One' },
  Maya: { emoji: '🧠', role: 'The Deep Diver' },
};

function PodcastTab({
  spark,
  state,
  onStateChange,
}: {
  spark: SparkCard;
  state: PanelState['podcast'];
  onStateChange: (update: Partial<PanelState['podcast']>) => void;
}) {
  const fetchPodcast = useCallback(async () => {
    onStateChange({ loading: true, error: null, turns: [], visibleCount: 0 });
    try {
      const res = await fetch('/api/podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: spark.title,
          question: spark.question,
          answer: spark.answer,
          templateLabel: spark.templateLabel,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      onStateChange({ turns: data.turns ?? [], visibleCount: 1, loading: false });
    } catch {
      onStateChange({ loading: false, error: 'Couldn\'t generate the episode. Try again.' });
    }
  }, [spark, onStateChange]);

  // Auto-fetch when tab opened and no turns yet
  useEffect(() => {
    if (state.turns.length === 0 && !state.loading && !state.error) {
      fetchPodcast();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-advance
  useEffect(() => {
    if (state.visibleCount === 0 || state.visibleCount >= state.turns.length) return;
    const t = setTimeout(() => {
      onStateChange({ visibleCount: Math.min(state.visibleCount + 1, state.turns.length) });
    }, 7500);
    return () => clearTimeout(t);
  }, [state.visibleCount, state.turns.length, onStateChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Hosts strip */}
      {state.turns.length > 0 && (
        <div className="flex gap-4 px-5 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border-hairline)' }}>
          {(['Jay', 'Maya'] as const).map((host) => (
            <div key={host} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                style={{ background: 'var(--state-hover)', border: '1px solid var(--border-hairline)' }}>
                {HOST_STYLE[host].emoji}
              </div>
              <div>
                <p className="text-[0.58rem] font-mono uppercase tracking-wider leading-none"
                  style={{ color: 'var(--ink-muted)' }}>{host}</p>
                <p className="text-[0.58rem] leading-none" style={{ color: 'var(--ink-faint)' }}>
                  {HOST_STYLE[host].role}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Turns */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {state.loading && (
          <div className="flex flex-col items-center gap-3 py-16">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--ink-muted)' }} />
            <p className="text-sm font-serif italic" style={{ color: 'var(--ink-muted)' }}>Generating episode…</p>
          </div>
        )}
        {state.error && (
          <div className="flex flex-col items-center gap-3 py-16">
            <p className="text-sm text-center" style={{ color: 'var(--ink-secondary)' }}>{state.error}</p>
            <button
              onClick={fetchPodcast}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              style={{ border: '1px solid var(--border-hairline)', color: 'var(--ink-secondary)' }}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Try again
            </button>
          </div>
        )}
        <AnimatePresence>
          {state.turns.slice(0, state.visibleCount).map((turn, i) => {
            const isJay = turn.host === 'Jay';
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn('flex gap-2.5', isJay ? 'flex-row' : 'flex-row-reverse')}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                  style={{ background: 'var(--state-hover)', border: '1px solid var(--border-hairline)' }}>
                  {HOST_STYLE[turn.host].emoji}
                </div>
                <div
                  className={cn(
                    'flex-1 rounded-2xl px-4 py-3 border max-w-[88%]',
                    isJay ? 'rounded-tl-sm' : 'rounded-tr-sm'
                  )}
                  style={
                    isJay
                      ? { background: 'rgba(201,168,76,0.1)', borderColor: 'rgba(201,168,76,0.2)' }
                      : { background: `${spark.accentColor}12`, borderColor: `${spark.accentColor}30` }
                  }
                >
                  <p className="text-[0.58rem] font-mono uppercase tracking-wider mb-1.5"
                    style={{ color: isJay ? '#C9A84C' : spark.accentColor }}>
                    {turn.host}
                  </p>
                  <p className="text-[0.83rem] font-serif italic leading-relaxed"
                    style={{ color: 'var(--ink-primary)' }}>
                    {turn.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {state.turns.length > 0 && (
        <div className="px-5 py-3 flex items-center gap-3 flex-shrink-0"
          style={{ borderTop: '1px solid var(--border-hairline)' }}>
          <div className="flex-1 h-0.5 rounded-full overflow-hidden"
            style={{ background: 'var(--border-hairline)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(state.visibleCount / state.turns.length) * 100}%`,
                background: spark.accentColor,
              }}
            />
          </div>
          <span className="font-mono text-[0.58rem]" style={{ color: 'var(--ink-faint)' }}>
            {state.visibleCount}/{state.turns.length}
          </span>
          {state.visibleCount < state.turns.length ? (
            <button
              onClick={() => onStateChange({ visibleCount: state.visibleCount + 1 })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-black"
              style={{ background: spark.accentColor }}
            >
              <Play className="w-3 h-3 fill-current" /> Next
            </button>
          ) : (
            <button
              onClick={fetchPodcast}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ border: '1px solid var(--border-hairline)', color: 'var(--ink-secondary)' }}
            >
              <SkipForward className="w-3 h-3" /> New ep
            </button>
          )}
        </div>
      )}
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
  // Get or create panel state for this spark
  const getState = useCallback((): PanelState => {
    if (!spark) return defaultPanelState();
    const cached = panelCache.current.get(spark.id);
    if (cached) return cached;
    const fresh = defaultPanelState(initialTab);
    panelCache.current.set(spark.id, fresh);
    // LRU: keep max 10 entries
    if (panelCache.current.size > 10) {
      const firstKey = panelCache.current.keys().next().value;
      if (firstKey) panelCache.current.delete(firstKey);
    }
    return fresh;
  }, [spark, initialTab, panelCache]);

  const [localState, setLocalState] = useState<PanelState>(getState);

  // Sync tab when panel opens for a different spark / different tab
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

  if (!spark) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
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

          {/* Panel */}
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
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--ink-faint)' }} />
            </div>

            {/* Top bar: close + spark title */}
            <div className="flex items-center gap-3 px-4 pt-1 pb-3 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                style={{
                  background: 'var(--state-hover)',
                  border: '1px solid var(--border-hairline)',
                }}
                aria-label="Back to spark"
              >
                <X className="w-3.5 h-3.5" style={{ color: 'var(--ink-secondary)' }} />
              </button>
              <p className="font-serif italic text-[0.82rem] leading-snug line-clamp-1 flex-1"
                style={{ color: 'var(--ink-secondary)' }}>
                {spark.title}
              </p>
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--ink-faint)' }} />
            </div>

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

            {/* Tab content — all tabs always mounted, hidden via CSS */}
            <div className="flex-1 overflow-hidden relative">
              <div className={localState.activeTab === 'deeper' ? 'h-full overflow-y-auto' : 'hidden'}>
                <DeeperTab spark={spark} />
              </div>
              <div className={localState.activeTab === 'ask' ? 'h-full flex flex-col' : 'hidden'}>
                <AskTab spark={spark} state={localState.ask} onStateChange={updateAsk} />
              </div>
              <div className={localState.activeTab === 'podcast' ? 'h-full flex flex-col' : 'hidden'}>
                <PodcastTab spark={spark} state={localState.podcast} onStateChange={updatePodcast} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
