'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Mic, Play, Pause, Loader2, RotateCcw, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { SparkCard } from '@/types/spark';
import { getPersonaForTemplate } from '@/lib/personas';
import AskDrawer from '@/components/sparks/AskDrawer';

type Mode = 'spark' | 'read' | 'listen';

interface SparkPlayerClientProps {
  spark: SparkCard;
}

// ─── Deeper article ───────────────────────────────────────────────────────────

interface ArticleState {
  article: string | null;
  loading: boolean;
  error: string | null;
}

function ReadMode({ spark, state, onRetry }: { spark: SparkCard; state: ArticleState; onRetry: () => void }) {
  const persona = getPersonaForTemplate(spark.templateId);

  return (
    <div className="px-5 py-6 space-y-5 max-w-2xl mx-auto">
      {/* Byline */}
      {persona && (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[0.55rem] font-bold flex-shrink-0"
            style={{ background: `${spark.accentColor}20`, color: spark.accentColor, boxShadow: `0 0 0 1px ${spark.accentColor}55` }}
          >
            {persona.mark}
          </div>
          <span className="font-mono text-[0.62rem] uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>
            {persona.displayName} · {persona.tagline}
          </span>
        </div>
      )}

      <h1 className="font-serif text-[1.4rem] leading-snug" style={{ color: 'var(--ink-primary)' }}>
        {spark.title}
      </h1>

      <p className="font-serif italic text-[0.9rem] leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
        {spark.answer}
      </p>

      <blockquote className="pl-3 border-l-2" style={{ borderColor: spark.accentColor }}>
        <p className="text-[0.82rem] italic font-serif leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
          &ldquo;{spark.hookLine}&rdquo;
        </p>
      </blockquote>

      <div className="border-t border-[var(--border-hairline)]" />

      {state.loading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--ink-muted)' }} />
          <p className="text-sm font-serif italic" style={{ color: 'var(--ink-muted)' }}>Going deeper…</p>
        </div>
      )}

      {state.error && !state.loading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-center" style={{ color: 'var(--ink-secondary)' }}>{state.error}</p>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            style={{ border: '1px solid var(--border-hairline)', color: 'var(--ink-secondary)' }}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Try again
          </button>
        </div>
      )}

      {state.article && !state.loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'var(--border-hairline)' }} />
            <span className="text-[0.58rem] font-mono uppercase tracking-widest" style={{ color: 'var(--ink-faint)' }}>
              Deep dive
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--border-hairline)' }} />
          </div>
          {state.article.split('\n\n').filter(Boolean).map((para, i) => (
            <p key={i} className="text-[0.88rem] font-serif leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Listen mode ─────────────────────────────────────────────────────────────

const SPEEDS = [0.75, 1, 1.25, 1.5] as const;

function ListenMode({ spark, articleState, onFetchArticle }: {
  spark: SparkCard;
  articleState: ArticleState;
  onFetchArticle: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState<number>(1);
  const chunksRef = useRef<string[]>([]);
  const activeRef = useRef(true);

  function buildChunks(text: string): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+[\s]*/g) ?? [text];
    const chunks: string[] = [];
    let current = '';
    for (const s of sentences) {
      if ((current + s).length > 250 && current) { chunks.push(current.trim()); current = s; }
      else current += s;
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks.length ? chunks : [text];
  }

  const playFrom = useCallback((index: number, spd: number) => {
    if (!activeRef.current || typeof window === 'undefined' || !window.speechSynthesis) return;
    if (index >= chunksRef.current.length) { setPlaying(false); setProgress(1); return; }
    const u = new SpeechSynthesisUtterance(chunksRef.current[index]);
    u.rate = spd; u.lang = 'en-US';
    u.onend = () => {
      if (!activeRef.current) return;
      const next = index + 1;
      setProgress(Math.min(next / chunksRef.current.length, 1));
      playFrom(next, spd);
    };
    u.onerror = () => { if (activeRef.current) setPlaying(false); };
    window.speechSynthesis.speak(u);
  }, []);

  useEffect(() => {
    activeRef.current = true;
    return () => { activeRef.current = false; if (typeof window !== 'undefined') window.speechSynthesis?.cancel(); };
  }, []);

  useEffect(() => {
    if (!articleState.article && !articleState.loading && !articleState.error) onFetchArticle();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handlePlayPause() {
    if (!articleState.article) return;
    if (playing) { window.speechSynthesis?.cancel(); setPlaying(false); }
    else {
      chunksRef.current = buildChunks(articleState.article);
      setPlaying(true); setProgress(0);
      playFrom(0, speed);
    }
  }

  function handleSpeed(s: number) {
    setSpeed(s);
    if (playing && articleState.article) {
      window.speechSynthesis?.cancel();
      chunksRef.current = buildChunks(articleState.article);
      setPlaying(true); setProgress(0);
      playFrom(0, s);
    }
  }

  const isLoading = articleState.loading || (!articleState.article && !articleState.error);

  return (
    <div className="px-5 py-6 space-y-5 max-w-md mx-auto">
      {/* Cover art */}
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: '160px' }}>
        <Image src={spark.heroImage} alt="" fill className="object-cover saturate-[0.85]" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-[0.52rem] font-mono uppercase tracking-widest mb-0.5" style={{ color: spark.accentColor }}>
            {playing ? 'Now playing' : 'Ready to play'}
          </p>
          <p className="text-white font-serif text-sm leading-snug line-clamp-2">{spark.title}</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--ink-muted)' }} />
          <p className="text-sm font-serif italic" style={{ color: 'var(--ink-muted)' }}>Preparing narration…</p>
        </div>
      )}

      {articleState.error && !isLoading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-center" style={{ color: 'var(--ink-secondary)' }}>{articleState.error}</p>
          <button onClick={onFetchArticle} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            style={{ border: '1px solid var(--border-hairline)', color: 'var(--ink-secondary)' }}>
            <RotateCcw className="w-3.5 h-3.5" /> Try again
          </button>
        </div>
      )}

      {articleState.article && !isLoading && (
        <>
          <div className="flex flex-col items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: spark.accentColor }}
            >
              {playing ? <Pause className="w-7 h-7 text-black" /> : <Play className="w-7 h-7 text-black fill-black" />}
            </motion.button>
            <p className="text-[0.6rem] font-mono uppercase tracking-widest" style={{ color: 'var(--ink-faint)' }}>
              {playing ? 'Tap to pause' : progress > 0 ? 'Tap to replay' : 'Tap to play'}
            </p>
          </div>

          <div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border-hairline)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round(progress * 100)}%`, background: spark.accentColor }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[0.52rem]" style={{ color: 'var(--ink-faint)' }}>{Math.round(progress * 100)}%</span>
              <span className="font-mono text-[0.52rem]" style={{ color: 'var(--ink-faint)' }}>
                ~{Math.round((articleState.article.split(' ').length / 150) * (1 / speed))} min
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[0.58rem] font-mono" style={{ color: 'var(--ink-faint)' }}>Speed</span>
            {SPEEDS.map(s => (
              <button key={s} onClick={() => handleSpeed(s)}
                className="px-2.5 py-1 rounded-full text-[0.62rem] font-mono transition-all"
                style={speed === s
                  ? { background: spark.accentColor, color: '#000' }
                  : { border: '1px solid var(--border-hairline)', color: 'var(--ink-muted)' }}>
                {s}×
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main player ─────────────────────────────────────────────────────────────

export default function SparkPlayerClient({ spark }: SparkPlayerClientProps) {
  const [mode, setMode] = useState<Mode>('spark');
  const [askOpen, setAskOpen] = useState(false);
  const [articleState, setArticleState] = useState<ArticleState>({ article: null, loading: false, error: null });

  // Read initial mode from hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as Mode;
    if (hash === 'read' || hash === 'listen') setMode(hash);
  }, []);

  function switchMode(m: Mode) {
    setMode(m);
    history.replaceState(null, '', m === 'spark' ? window.location.pathname : `#${m}`);
  }

  const fetchArticle = useCallback(async () => {
    setArticleState(s => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch('/api/deeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: spark.title, question: spark.question, answer: spark.answer,
          templateLabel: spark.templateLabel, hookLine: spark.hookLine,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setArticleState({ article: data.article ?? null, loading: false, error: null });
    } catch {
      setArticleState({ article: null, loading: false, error: 'Couldn\'t generate the article. Try again.' });
    }
  }, [spark]);

  // Auto-fetch when switching to read/listen for the first time
  useEffect(() => {
    if ((mode === 'read' || mode === 'listen') && !articleState.article && !articleState.loading && !articleState.error) {
      fetchArticle();
    }
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const MODE_TABS: { id: Mode; icon: typeof BookOpen; label: string }[] = [
    { id: 'spark', icon: Play, label: 'Spark' },
    { id: 'read', icon: BookOpen, label: 'Read' },
    { id: 'listen', icon: Mic, label: 'Listen' },
  ];

  return (
    <div className="min-h-[100svh] flex flex-col" style={{ background: 'var(--bg-page)' }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 h-12 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border-hairline)', background: 'var(--bg-elevated)' }}
      >
        <Link
          href="/feed"
          className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-wide transition-colors hover:text-[var(--ink-primary)]"
          style={{ color: 'var(--ink-muted)' }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>

        {/* Mode tabs */}
        <div className="flex items-center gap-0.5">
          {MODE_TABS.map(({ id, icon: Icon, label }) => {
            const isActive = mode === id;
            return (
              <button
                key={id}
                onClick={() => switchMode(id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md transition-all text-[0.62rem] font-mono uppercase tracking-wide"
                style={{
                  background: isActive ? `${spark.accentColor}20` : 'transparent',
                  color: isActive ? spark.accentColor : 'var(--ink-muted)',
                  border: isActive ? `1px solid ${spark.accentColor}40` : '1px solid transparent',
                }}
              >
                <Icon className="w-3 h-3" /> {label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setAskOpen(true)}
          className="flex items-center gap-1 font-mono text-[0.62rem] uppercase tracking-wide transition-colors"
          style={{ color: 'var(--ink-muted)' }}
        >
          Ask <MessageSquare className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {mode === 'spark' && (
          <div>
            {/* Hero */}
            <div className="relative w-full" style={{ height: '260px' }}>
              <Image src={spark.heroImage} alt="" fill className="object-cover saturate-[0.88]" sizes="100vw" priority />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-page) 5%, transparent 60%)' }} />
            </div>

            {/* Spark content */}
            <div className="px-5 pt-4 pb-10 max-w-2xl mx-auto space-y-4">
              <h1 className="font-serif text-[1.5rem] leading-snug" style={{ color: 'var(--ink-primary)' }}>
                {spark.title}
              </h1>

              {/* Q&A exchange */}
              <div className="space-y-3">
                <div
                  className="px-4 py-3 rounded-2xl rounded-br-sm text-[0.85rem] font-sans"
                  style={{
                    background: `${spark.accentColor}18`,
                    border: `1px solid ${spark.accentColor}35`,
                    color: 'var(--ink-primary)',
                  }}
                >
                  {spark.question}
                </div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-sm text-[0.85rem] font-serif italic leading-relaxed"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-hairline)',
                    color: 'var(--ink-primary)',
                  }}
                >
                  {spark.answer}
                </div>
              </div>

              {/* Hook line */}
              <p
                className="font-serif italic text-[1.05rem] leading-relaxed text-center py-2"
                style={{ color: 'var(--ink-secondary)' }}
              >
                &ldquo;{spark.hookLine}&rdquo;
              </p>

              {/* Depth CTAs */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => switchMode('read')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[0.78rem] font-mono uppercase tracking-wide transition-all active:scale-[0.98]"
                  style={{ border: '1px solid var(--border-hairline)', color: 'var(--ink-secondary)', background: 'var(--bg-elevated)' }}
                >
                  <BookOpen className="w-3.5 h-3.5" /> Continue to Episode →
                </button>
                <button
                  onClick={() => switchMode('listen')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[0.78rem] font-mono uppercase tracking-wide transition-all active:scale-[0.98]"
                  style={{ border: '1px solid var(--border-hairline)', color: 'var(--ink-secondary)', background: 'var(--bg-elevated)' }}
                >
                  <Mic className="w-3.5 h-3.5" /> Listen to Podcast →
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === 'read' && (
          <ReadMode spark={spark} state={articleState} onRetry={fetchArticle} />
        )}

        {mode === 'listen' && (
          <ListenMode spark={spark} articleState={articleState} onFetchArticle={fetchArticle} />
        )}
      </div>

      <AskDrawer open={askOpen} onClose={() => setAskOpen(false)} spark={spark} />
    </div>
  );
}
