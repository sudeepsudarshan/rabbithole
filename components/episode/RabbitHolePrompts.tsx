'use client';
import { useState } from 'react';
import { RabbitHolePrompt } from '@/types/episode';
import { cn } from '@/lib/utils';
import { GitBranch } from 'lucide-react';

interface RabbitHolePromptsProps {
  prompts: [RabbitHolePrompt, RabbitHolePrompt];
  onPromptClick: (prompt: RabbitHolePrompt) => void;
  className?: string;
}

export default function RabbitHolePrompts({ prompts, onPromptClick, className }: RabbitHolePromptsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn('rounded-lg border p-4', className)}
      style={{
        background: 'var(--bg-sunken)',
        borderColor: 'var(--border-hairline)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <GitBranch className="w-3.5 h-3.5 text-accent-rust" />
        <span className="font-mono text-[0.65rem] text-accent-rust tracking-wide">
          Down the rabbit hole
        </span>
      </div>
      <p className="font-mono text-[0.6rem] mb-3" style={{ color: 'var(--ink-faint)' }}>
        Each question opens a new AI conversation
      </p>
      <div className="space-y-2">
        {prompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onPromptClick(prompt)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              'w-full text-left px-4 py-3 rounded-md border transition-colors duration-150 text-sm font-sans min-h-[44px]',
              hoveredIndex === i
                ? 'border-[var(--border-accent)] bg-[var(--state-active)] text-ink-primary'
                : 'border-hairline bg-[var(--bg-elevated)] text-ink-secondary hover:text-ink-primary hover:bg-[var(--state-hover)]'
            )}
          >
            <span className="text-accent-rust mr-2">↳</span>
            {prompt.displayText}
          </button>
        ))}
      </div>
    </div>
  );
}
