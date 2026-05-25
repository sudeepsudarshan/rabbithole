import { cn } from '@/lib/utils';

interface NarrationBlockProps {
  html: string;
  className?: string;
}

export default function NarrationBlock({ html, className }: NarrationBlockProps) {
  return (
    <div
      className={cn('episode-narration', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
