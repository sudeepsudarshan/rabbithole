'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, BookOpen, Mic, Play, Pause,
  Loader2, RotateCcw, MessageSquare, ChevronDown, ChevronUp, Heart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SparkCard } from '@/types/spark';
import { getPersonaForTemplate } from '@/lib/personas';
import AskDrawer from '@/components/sparks/AskDrawer';
import { useSavedStore } from '@/store/savedStore';

interface ArticleState {
  article: string | null;
  loading: boolean;
  error: string | null;
}

const SPEEDS = [0.75, 1, 1.25, 1.5] as const;

// ─── Inline podcast player ────────────────────────────────────────────────────

function PodcastPlayer({ spark, article }: { spark: SparkCard; article: string }) {
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
    return () => {
      activeRef.current = false;
      if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    };
  }, []);

  function handlePlayPause() {
    if (playing) { window.speechSynthesis?.cancel(); setPlaying(false); }
    else {
      chunksRef.current = buildChunks(article);
      setPlaying(true); setProgress(0);
      playFrom(0, speed);
    }
  }

  function handleSpeed(s: number) {
    setSpeed(s);
    if (playing) {
      window.speechSynthesis?.cancel();
      chunksRef.current = buildChunks(article);
      setPlaying(true); setProgress(0);
      playFrom(0, s);
    }
  }

  return (
    <div className="space-y-4 px-5 py-4 rounded-2xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-hairline)' }}>
      <div className="flex flex-col items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayPause}
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: spark.accentColor }}
        >
          {playing
            ? <Pause className="w-6 h-6 text-black" />
            : <Play className="w-6 h-6 text-black fill-black" />
          }
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
            ~{Math.round((article.split(' ').length / 150) * (1 / speed))} min
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
    </div>
  );
}

// ─── Main player ─────────────────────────────────────────────────────────────

export default function SparkPlayerClient({ spark }: { spark: SparkCard }) {
  const [askOpen, setAskOpen] = useState(false);
  const [episodeOpen, setEpisodeOpen] = useState(false);
  const [podcastOpen, setPodcastOpen] = useState(false);
  const [articleState, setArticleState] = useState<ArticleState>({ article: null, loading: false, error: null });
  const hasFetched = useRef(false);
  const persona = getPersonaForTemplate(spark.templateId);
  const { toggle, isSaved } = useSavedStore();
  const saved = isSaved(spark.id);

  const fetchArticle = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;
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
      hasFetched.current = false;
      setArticleState({ article: null, loading: false, error: 'Couldn\'t generate the episode. Try again.' });
    }
  }, [spark]);

  // Fetch when either expander is first opened
  useEffect(() => {
    if ((episodeOpen || podcastOpen) && !articleState.article && !articleState.loading && !articleState.error) {
      fetchArticle();
    }
  }, [episodeOpen, podcastOpen]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <button
          onClick={() => toggle(spark.id)}
          className="p-2 transition-all active:scale-90"
          aria-label={saved ? 'Remove from saved' : 'Save spark'}
        >
          <Heart
            className="w-4 h-4 transition-colors"
            style={{ color: saved ? '#E24B4A' : 'var(--ink-muted)' }}
            fill={saved ? '#E24B4A' : 'none'}
          />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Hero */}
        <div className="relative w-full" style={{ height: '240px' }}>
          <Image src={spark.heroImage} alt="" fill className="object-cover saturate-[0.88]" sizes="100vw" priority />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-page) 5%, transparent 60%)' }} />
        </div>

        {/* Spark content */}
        <div className="px-5 pt-4 space-y-4 max-w-2xl mx-auto">
          {/* Lens byline */}
          {persona && (
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[0.5rem] font-bold flex-shrink-0"
                style={{ background: `${spark.accentColor}20`, color: spark.accentColor, boxShadow: `0 0 0 1px ${spark.accentColor}55` }}
              >
                {persona.mark}
              </div>
              <span className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                {persona.displayName} · {persona.tagline}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="font-serif text-[1.45rem] leading-snug" style={{ color: 'var(--ink-primary)' }}>
            {spark.title}
          </h1>

          {/* Q&A exchange */}
          <div className="space-y-3">
            <div
              className="px-4 py-3 rounded-2xl rounded-br-sm text-[0.85rem] font-sans"
              style={{ background: `${spark.accentColor}18`, border: `1px solid ${spark.accentColor}35`, color: 'var(--ink-primary)' }}
            >
              {spark.question}
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-sm text-[0.88rem] font-serif italic leading-relaxed"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-hairline)', color: 'var(--ink-primary)' }}
            >
              {spark.answer}
            </div>
          </div>

          {/* Hook line */}
          <p
            className="font-serif italic text-[1.05rem] leading-relaxed text-center py-1"
            style={{ color: 'var(--ink-secondary)' }}
          >
            &ldquo;{spark.hookLine}&rdquo;
          </p>

          <div className="border-t" style={{ borderColor: 'var(--border-hairline)' }} />

          {/* ── Continue to Episode expander ──────────────────────── */}
          <div>
            <button
              onClick={() => setEpisodeOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all active:scale-[0.98]"
              style={{ border: '1px solid var(--border-hairline)', background: 'var(--bg-elevated)' }}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: spark.accentColor }} />
                <span className="font-mono text-[0.72rem] uppercase tracking-wide" style={{ color: 'var(--ink-secondary)' }}>
                  Continue to Episode
                </span>
              </div>
              {episodeOpen
                ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
                : <ChevronDown className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
              }
            </button>

            {episodeOpen && (
              <div className="mt-3 space-y-4">
                {articleState.loading && (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--ink-muted)' }} />
                    <p className="text-sm font-serif italic" style={{ color: 'var(--ink-muted)' }}>Going deeper…</p>
                  </div>
                )}
                {articleState.error && !articleState.loading && (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <p className="text-sm text-center" style={{ color: 'var(--ink-secondary)' }}>{articleState.error}</p>
                    <button
                      onClick={() => { hasFetched.current = false; fetchArticle(); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                      style={{ border: '1px solid var(--border-hairline)', color: 'var(--ink-secondary)' }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Try again
                    </button>
                  </div>
                )}
                {articleState.article && !articleState.loading && (
                  <div className="space-y-4">
                    {articleState.article.split('\n\n').filter(Boolean).map((para, i) => (
                      <p key={i} className="text-[0.88rem] font-serif leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Listen to Podcast expander ────────────────────────── */}
          <div className="pb-4">
            <button
              onClick={() => setPodcastOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all active:scale-[0.98]"
              style={{ border: '1px solid var(--border-hairline)', background: 'var(--bg-elevated)' }}
            >
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4" style={{ color: spark.accentColor }} />
                <span className="font-mono text-[0.72rem] uppercase tracking-wide" style={{ color: 'var(--ink-secondary)' }}>
                  Listen to Podcast
                </span>
              </div>
              {podcastOpen
                ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
                : <ChevronDown className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
              }
            </button>

            {podcastOpen && (
              <div className="mt-3">
                {articleState.loading && (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--ink-muted)' }} />
                    <p className="text-sm font-serif italic" style={{ color: 'var(--ink-muted)' }}>Preparing narration…</p>
                  </div>
                )}
                {articleState.error && !articleState.loading && (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <p className="text-sm text-center" style={{ color: 'var(--ink-secondary)' }}>{articleState.error}</p>
                    <button
                      onClick={() => { hasFetched.current = false; fetchArticle(); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                      style={{ border: '1px solid var(--border-hairline)', color: 'var(--ink-secondary)' }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Try again
                    </button>
                  </div>
                )}
                {articleState.article && !articleState.loading && (
                  <PodcastPlayer spark={spark} article={articleState.article} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Floating draggable Ask FAB ────────────────────────────── */}
      <motion.button
        drag
        dragMomentum={false}
        dragElastic={0.1}
        whileDrag={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed z-50 w-13 h-13 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: spark.accentColor,
          bottom: 88,
          right: 24,
          width: 52,
          height: 52,
        }}
        onClick={() => setAskOpen(true)}
        aria-label="Ask AI"
      >
        <MessageSquare className="w-5 h-5 text-black" />
      </motion.button>

      <AskDrawer open={askOpen} onClose={() => setAskOpen(false)} spark={spark} />
    </div>
  );
}
