'use client';
import { useState, KeyboardEvent, useRef } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled = false, placeholder = 'Ask anything...' }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div
      className="flex items-end gap-2 rounded-md border p-2 transition-colors duration-150"
      style={{
        background: 'var(--bg-input)',
        borderColor: focused ? 'var(--border-ink)' : 'var(--border-hairline)',
        boxShadow: focused
          ? '0 0 0 3px color-mix(in srgb, var(--state-focus-ring) 25%, transparent)'
          : 'none',
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={1}
        disabled={disabled}
        className="flex-1 bg-transparent text-sm text-ink-primary placeholder:text-ink-muted resize-none focus:outline-none py-1.5 px-2 font-sans leading-relaxed max-h-[120px] min-h-[40px]"
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className={cn(
          'p-2 rounded-sm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center',
          value.trim() && !disabled
            ? 'text-accent-rust hover:bg-[var(--state-hover)]'
            : 'text-ink-faint cursor-not-allowed'
        )}
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
