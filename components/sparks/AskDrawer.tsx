'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { SparkCard } from '@/types/spark';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AskDrawerProps {
  open: boolean;
  onClose: () => void;
  spark: SparkCard;
}

export default function AskDrawer({ open, onClose, spark }: AskDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputDraft, setInputDraft] = useState('');
  const [streaming, setStreaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, streaming]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      // Cancel any speech on open
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [open]);

  const handleSubmit = useCallback(async () => {
    const q = inputDraft.trim();
    if (!q || streaming) return;

    const userMsg: Message = { role: 'user', content: q };
    const history = [...messages, userMsg];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setStreaming(true);
    setInputDraft('');

    try {
      const res = await fetch('/api/rabbit-hole', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: spark.templateId,
          question: q,
          sparkTitle: spark.title,
          sparkAnswer: spark.answer,
          history: messages,
        }),
      });

      if (!res.ok || !res.body) throw new Error('Request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        setMessages([...history, { role: 'assistant', content: aiText }]);
      }

      setMessages([...history, { role: 'assistant', content: aiText }]);
    } catch {
      setMessages([
        ...history,
        { role: 'assistant', content: 'Something went wrong. Try again.' },
      ]);
    } finally {
      setStreaming(false);
    }
  }, [inputDraft, messages, streaming, spark]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="ask-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] backdrop-blur-sm"
            style={{ background: 'var(--bg-overlay)' }}
            onClick={onClose}
          />
          <motion.div
            key="ask-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[71] flex flex-col rounded-t-3xl overflow-hidden"
            style={{
              background: 'var(--bg-elevated)',
              borderTop: '1px solid var(--border-hairline)',
              height: '72vh',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border-hairline)' }}
            >
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest" style={{ color: spark.accentColor }}>
                  Ask
                </p>
                <p className="font-serif italic text-[0.78rem] leading-snug line-clamp-1" style={{ color: 'var(--ink-secondary)' }}>
                  {spark.title}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--ink-muted)' }}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-[0.6rem] font-mono uppercase tracking-wider" style={{ color: 'var(--ink-faint)' }}>
                    Start here
                  </p>
                  {spark.suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInputDraft(q)}
                      className="w-full text-left px-4 py-3 rounded-xl text-[0.8rem] leading-snug transition-all active:scale-[0.98]"
                      style={{
                        border: '1px solid var(--border-hairline)',
                        background: 'var(--state-hover)',
                        color: 'var(--ink-secondary)',
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => {
                const isUser = msg.role === 'user';
                const isLastAI = !isUser && i === messages.length - 1 && streaming;
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
                              background: `${spark.accentColor}28`,
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
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="px-4 py-3 flex gap-2 items-center flex-shrink-0"
              style={{ borderTop: '1px solid var(--border-hairline)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputDraft}
                onChange={e => setInputDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Ask anything about this…"
                maxLength={500}
                disabled={streaming}
                className="flex-1 rounded-xl px-4 py-2.5 text-[0.83rem] focus:outline-none transition-colors"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-hairline)',
                  color: 'var(--ink-primary)',
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={!inputDraft.trim() || streaming}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
                style={
                  inputDraft.trim() && !streaming
                    ? { background: spark.accentColor }
                    : { background: 'var(--state-hover)', border: '1px solid var(--border-hairline)' }
                }
              >
                {streaming
                  ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--ink-muted)' }} />
                  : <Send className="w-4 h-4" style={{ color: inputDraft.trim() ? '#000' : 'var(--ink-muted)' }} />
                }
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
