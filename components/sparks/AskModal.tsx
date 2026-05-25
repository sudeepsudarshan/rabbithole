'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, ChevronRight } from 'lucide-react';
import { SparkCard } from '@/types/spark';
import { cn } from '@/lib/utils';

interface AskModalProps {
  spark: SparkCard;
  open: boolean;
  onClose: () => void;
}

type State = 'idle' | 'loading' | 'streaming' | 'complete' | 'error';

export default function AskModal({ spark, open, onClose }: AskModalProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!question.trim() || state === 'loading' || state === 'streaming') return;

    setState('loading');
    setAnswer('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/rabbit-hole', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: spark.templateId, question: question.trim() }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Request failed');
      }

      if (!res.body) throw new Error('No response body');

      setState('streaming');
      const reader = res.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setAnswer((prev) => prev + decoder.decode(value, { stream: true }));
      }

      setState('complete');
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }, [question, spark.templateId, state]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleReset = () => {
    setQuestion('');
    setAnswer('');
    setState('idle');
    setErrorMsg('');
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const isStreaming = state === 'loading' || state === 'streaming';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="ask-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="ask-modal"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-[61] max-h-[90vh] flex flex-col bg-ink-50 border-t border-border rounded-t-3xl overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-start gap-3 px-5 pt-2 pb-4 border-b border-border">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border"
                style={{
                  background: `${spark.accentColor}18`,
                  borderColor: `${spark.accentColor}40`,
                }}
              >
                <ChevronRight className="w-5 h-5" style={{ color: spark.accentColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-mono text-[0.6rem] uppercase tracking-wider mb-0.5"
                  style={{ color: spark.accentColor }}
                >
                  {spark.templateLabel}
                </p>
                <h2 className="font-serif italic text-sm text-paper leading-snug line-clamp-2">
                  Ask about: {spark.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-paper-faint hover:text-paper transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Spark context */}
            <div className="px-5 py-3 border-b border-border bg-ink/30">
              <p className="text-xs text-paper-faint font-serif italic leading-relaxed line-clamp-2">
                "{spark.answer}"
              </p>
            </div>

            {/* Answer area */}
            {(answer || state === 'loading') && (
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {state === 'loading' && !answer && (
                  <div className="flex items-center gap-2 text-paper-faint">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-serif italic">Thinking…</span>
                  </div>
                )}
                {state === 'error' && (
                  <p className="text-sm text-rust font-sans">{errorMsg}</p>
                )}
                {answer && (
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-wider text-paper-faint mb-2">
                      Answer
                    </p>
                    <p className="font-serif italic text-paper text-sm leading-relaxed">
                      {answer}
                      {state === 'streaming' && (
                        <span className="streaming-cursor" aria-hidden="true" />
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Input area */}
            <div className={cn('px-5 py-4 border-t border-border', answer ? '' : 'flex-1 flex flex-col justify-end')}>
              {state === 'complete' && (
                <button
                  onClick={handleReset}
                  className="mb-3 text-xs text-paper-faint hover:text-paper font-mono underline"
                >
                  ← Ask another question
                </button>
              )}
              {(state === 'idle' || state === 'error') && (
                <div className="flex gap-2 items-end">
                  <textarea
                    ref={textareaRef}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Go deeper on: ${spark.title.split(' ').slice(0, 4).join(' ')}…`}
                    maxLength={500}
                    rows={2}
                    autoFocus
                    className={cn(
                      'flex-1 resize-none rounded-xl px-4 py-3 text-sm font-sans',
                      'bg-ink border border-border text-paper placeholder:text-paper-faint',
                      'focus:outline-none focus:border-gold/50 transition-colors',
                      'leading-relaxed'
                    )}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!question.trim() || isStreaming}
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      'transition-all duration-150',
                      question.trim() && !isStreaming
                        ? 'bg-gold text-ink hover:bg-gold-bright'
                        : 'bg-ink-100 text-paper-faint cursor-not-allowed'
                    )}
                    aria-label="Send question"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
              {isStreaming && (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 className="w-4 h-4 text-gold animate-spin" />
                  <span className="text-xs text-paper-faint font-mono">Streaming…</span>
                </div>
              )}
              <p className="mt-1.5 text-[0.6rem] text-paper-faint/60 font-mono text-right">
                {question.length}/500 · Enter to send
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
