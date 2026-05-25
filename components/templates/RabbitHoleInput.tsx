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
              'relative rounded-md border transition-all duration-200',
              focused
                ? 'border-gold/50 bg-ink-100/80'
                : 'border-border bg-ink-50/50 hover:border-border-strong'
            )}
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
              className="w-full bg-transparent px-3 py-2.5 pr-12 text-sm text-paper placeholder:text-paper-faint resize-none focus:outline-none font-sans leading-relaxed"
              aria-label={`Ask ${template.name} a question`}
            />
            <button
              onClick={() => handleSubmit()}
              disabled={!question.trim()}
              className={cn(
                'absolute right-2 bottom-2 p-1.5 rounded transition-all',
                question.trim()
                  ? 'text-gold hover:bg-gold-faint'
                  : 'text-paper-faint cursor-not-allowed'
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
                    className="text-[0.65rem] text-paper-faint hover:text-gold border border-border hover:border-gold/30 rounded px-2 py-0.5 transition-all font-mono"
                  >
                    {topic}
                  </button>
                ))}
              </div>
              <span className="text-[0.65rem] text-paper-faint font-mono">
                {question.length}/500
              </span>
            </div>
          )}

          {isError && error && (
            <p className="text-xs text-rust px-1" role="alert">
              {error}
            </p>
          )}
        </div>
      )}

      {/* Response panel */}
      {(isActive || isDone) && (
        <div className="space-y-3">
          {/* Question echo */}
          <div className="text-xs text-paper-faint font-mono px-1 italic">
            ↳ {submittedQuestion}
          </div>

          {/* Streaming response */}
          <div
            className={cn(
              'rounded-lg p-4 border transition-all',
              isActive
                ? 'border-gold/20 bg-gold-faint'
                : 'border-border bg-ink-50/50'
            )}
          >
            {state === 'loading' && !text && (
              <div className="flex items-center gap-2 text-paper-faint">
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse [animation-delay:0.4s]" />
              </div>
            )}

            <StreamingText
              text={text}
              isStreaming={isActive}
              className="text-[0.92rem] text-paper leading-relaxed"
            />
          </div>

          {/* Post-completion actions */}
          {isDone && (
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-paper-faint hover:text-paper gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                Try another
              </Button>
              <Link href={`/templates/${template.id}`}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-gold hover:text-gold-bright">
                  Open full episode
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
