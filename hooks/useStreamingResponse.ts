'use client';

import { useState, useCallback } from 'react';

type StreamState = 'idle' | 'loading' | 'streaming' | 'complete' | 'error';

interface UseStreamingResponseOptions {
  onComplete?: (text: string) => void;
  onError?: (error: string) => void;
}

interface UseStreamingResponseReturn {
  state: StreamState;
  text: string;
  error: string | null;
  startStreaming: (url: string, body: Record<string, unknown>) => Promise<void>;
  reset: () => void;
}

export function useStreamingResponse(
  options: UseStreamingResponseOptions = {}
): UseStreamingResponseReturn {
  const [state, setState] = useState<StreamState>('idle');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setState('idle');
    setText('');
    setError(null);
  }, []);

  const startStreaming = useCallback(
    async (url: string, body: Record<string, unknown>) => {
      setState('loading');
      setText('');
      setError(null);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          const errorMsg =
            response.status === 429
              ? "You've hit the limit for now — try again in a minute."
              : errorText || 'Something went wrong — check your connection.';
          setError(errorMsg);
          setState('error');
          options.onError?.(errorMsg);
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          const msg = 'No response stream available.';
          setError(msg);
          setState('error');
          options.onError?.(msg);
          return;
        }

        setState('streaming');
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setText(fullText);
        }

        if (!fullText.trim()) {
          const msg = "The AI didn't respond — try rephrasing your question.";
          setError(msg);
          setState('error');
          options.onError?.(msg);
          return;
        }

        setState('complete');
        options.onComplete?.(fullText);
      } catch {
        const msg = 'Something went wrong — check your connection.';
        setError(msg);
        setState('error');
        options.onError?.(msg);
      }
    },
    [options]
  );

  return { state, text, error, startStreaming, reset };
}
