import { cn } from '@/lib/utils';
import StreamingText from '@/components/ui/StreamingText';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, isStreaming = false }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-lg px-4 py-3 text-sm border',
          isUser
            ? 'bg-[var(--state-active)] border-[var(--border-accent)] text-ink-primary font-sans rounded-tr-sm'
            : 'bg-elevated border-hairline rounded-tl-sm'
        )}
      >
        {isUser ? (
          <p className="leading-relaxed">{content}</p>
        ) : (
          <StreamingText
            text={content}
            isStreaming={isStreaming}
            className="text-[0.9rem] text-ink-primary leading-relaxed font-serif italic"
          />
        )}
      </div>
    </div>
  );
}
