'use client';

import { useState, useRef } from 'react';
import { ArrowRight, RotateCcw, ChevronRight } from 'lucide-react';
import { Template } from '@/types/template';
import { useStreamingResponse } from '@/hooks/useStreamingResponse';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import StreamingText from '@/components/ui/StreamingText';
import Link from 'next/link';

interface RabbitHoleInputProps {
  template: Template;
  onResponseComplete?: (response: string) => void;
}

export default function RabbitHoleInput({
  template,
  onResponseComplete,
}: RabbitHoleInputProps) {
  const [question, setQuestion] = useState('');
  const [focused, setFocused] = useState(false);
  const [submittedQuestion, setSubmittedQuestion] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { state, text, error, startStreaming, reset } = useStreamingResponse({
    onComplete: onResponseComplete,
  });

  const handleSubmit = async (q: string = question) => {
    if (!q.trim() || state === 'streaming' || state === 'loading') return;
    setSubmittedQuestion(q);
    await startStreaming('/api/rabbit-hole', {
      templateId: template.id,
      question: q.trim(),
    });
  };

  const handleReset = () => {
    reset();
    setQuestion('');
    setSubmittedQuestion('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isIdle = state === 'idle';
  const isActive = state === 'loading' || state === 'streaming';
  const isDone = state === 'complete';
  const isError = state === 'error';

  return (
    <div className="space-y-3">
      {/* Input area — shown when idle or error */}
      {(isIdle || isError) && (
        <div className="space-y-2">
          <div
            className={cn(
              'relative rounded-md border transition-colors duration-150',
              focused
                ? 'border-ink-line'
                : 'border-hairline hover:border-[var(--ink-muted)]'
            )}
            style={{
              background: 'var(--bg-input)',
              boxShadow: focused
                ? '0 0 0 3px color-mix(in srgb, var(--state-focus-ring) 25%, transparent)'
                : 'none',
            }}
          >
            <textarea
              ref={inputRef}
              value={question}
              onChange={e => setQuestion(e.target.value.slice(0, 500))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={template.inputPlaceholder}
              rows={2}
              className="w-full bg-transparent px-3.5 py-2.5 pr-12 text-sm text-ink-primary placeholder:text-ink-muted resize-none focus:outline-none font-sans leading-relaxed"
              aria-label={`Ask ${template.name} a question`}
            />
            <button
              onClick={() => handleSubmit()}
              disabled={!question.trim()}
              className={cn(
                'absolute right-2 bottom-2 p-1.5 rounded-sm transition-colors',
                question.trim()
                  ? 'text-accent-rust hover:bg-[var(--state-hover)]'
                  : 'text-ink-faint cursor-not-allowed'
              )}
              aria-label="Submit question"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {focused && (
            <div className="flex items-center justify-between px-1">
              <div className="flex flex-wrap gap-1">
                {template.exampleTopics.slice(0, 2).map(topic => (
                  <button
                    key={topic}
                    onClick={() => {
                      setQuestion(topic);
                      handleSubmit(topic);
                    }}
                    className="text-[0.65rem] text-ink-muted hover:text-accent-rust border border-hairline hover:border-[var(--border-accent)] rounded-sm px-2 py-0.5 transition-colors font-mono"
                  >
                    {topic}
                  </button>
                ))}
              </div>
              <span className="text-[0.65rem] text-ink-faint font-mono">
                {question.length}/500
              </span>
            </div>
          )}

          {isError && error && (
            <p className="text-xs text-accent-rust px-1" role="alert">
              {error}
            </p>
          )}
        </div>
      )}

      {/* Response panel */}
      {(isActive || isDone) && (
        <div className="space-y-3">
          {/* Question echo */}
          <div className="text-xs text-ink-muted font-mono px-1">
            ↳ {submittedQuestion}
          </div>

          {/* Streaming response */}
          <div
            className={cn(
              'rounded-lg p-4 border transition-colors',
              isActive
                ? 'border-[var(--border-accent)]'
                : 'border-hairline'
            )}
            style={{ background: 'var(--bg-input)' }}
          >
            {state === 'loading' && !text && (
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-rust rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-accent-rust rounded-full animate-pulse [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-accent-rust rounded-full animate-pulse [animation-delay:0.4s]" />
              </div>
            )}

            <StreamingText
              text={text}
              isStreaming={isActive}
              className="text-[0.92rem] text-ink-primary leading-relaxed font-serif italic"
            />
          </div>

          {/* Post-completion actions */}
          {isDone && (
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
              >
                <RotateCcw className="w-3 h-3 mr-1.5" />
                Try another
              </Button>
              <Link href={`/templates/${template.id}`}>
                <Button variant="ghost" size="sm">
                  Open full template
                  <ChevronRight className="w-3 h-3 ml-1.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
