'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  className?: string;
  fontFamily?: 'serif' | 'sans';
}

export default function StreamingText({
  text,
  isStreaming,
  className,
  fontFamily = 'serif',
}: StreamingTextProps) {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isStreaming && cursorRef.current) {
      cursorRef.current.style.transition = 'opacity 0.3s';
      cursorRef.current.style.opacity = '0';
    }
  }, [isStreaming]);

  return (
    <span
      className={cn(
        fontFamily === 'serif' ? 'font-serif italic' : 'font-sans',
        'leading-relaxed',
        className
      )}
      aria-live="polite"
      aria-atomic="false"
    >
      {text}
      {isStreaming && (
        <span
          ref={cursorRef}
          className="streaming-cursor"
          aria-hidden="true"
        />
      )}
    </span>
  );
}
