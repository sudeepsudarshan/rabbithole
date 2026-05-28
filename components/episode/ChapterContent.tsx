'use client';
import { Episode, Chapter } from '@/types/episode';
import { Template } from '@/types/template';
import NarrationBlock from './NarrationBlock';
import FactStrip from './FactStrip';
import InsightBox from './InsightBox';
import RabbitHolePrompts from './RabbitHolePrompts';
import ChapterNav from './ChapterNav';
import DiveWindow from '@/components/dive/DiveWindow';
import { RabbitHolePrompt } from '@/types/episode';

interface ChapterContentProps {
  episode: Episode;
  chapter: Chapter;
  template: Template;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onPromptClick: (prompt: RabbitHolePrompt) => void;
}

export default function ChapterContent({
  episode,
  chapter,
  template,
  onPrevChapter,
  onNextChapter,
  onPromptClick,
}: ChapterContentProps) {
  const prevChapter = episode.chapters.find(c => c.number === chapter.number - 1);
  const nextChapter = episode.chapters.find(c => c.number === chapter.number + 1);

  return (
    <div>
      {/* Episode subtitle — shown only on chapter 1 to orient first-time readers */}
      {chapter.number === 1 && episode.subtitle && (
        <p
          className="font-serif italic text-sm leading-relaxed mb-6 pl-3 border-l-2"
          style={{ color: 'var(--ink-muted)', borderColor: template.accentColor }}
        >
          {episode.subtitle}
        </p>
      )}

      {/* Chapter header */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-mono text-[0.65rem] text-ink-muted">
            Chapter {chapter.number}
          </span>
          <span
            className="font-mono text-[0.65rem]"
            style={{ color: template.accentColor }}
          >
            {chapter.context}
          </span>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl text-ink-primary leading-tight">
          {chapter.title}
        </h1>
      </div>

      {/* Narration */}
      <NarrationBlock html={chapter.content.narration} className="mb-8" />

      {/* Fact strip */}
      <FactStrip facts={chapter.content.facts} className="mb-8" />

      {/* Insight box */}
      <InsightBox insight={chapter.content.insight} className="mb-8" />

      {/* Rabbit hole prompts */}
      <RabbitHolePrompts
        prompts={chapter.content.prompts}
        onPromptClick={onPromptClick}
        className="mb-8"
      />

      {/* Chapter progress + navigation */}
      <div className="mb-2 flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'var(--border-hairline)' }} />
        <span className="font-mono text-[0.58rem] tracking-wider" style={{ color: 'var(--ink-faint)' }}>
          {chapter.number} of {episode.chapters.length}
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border-hairline)' }} />
      </div>

      <ChapterNav
        currentChapter={chapter.number}
        totalChapters={episode.chapters.length}
        prevTitle={prevChapter?.title}
        nextTitle={nextChapter?.title}
        onPrev={onPrevChapter}
        onNext={onNextChapter}
        className="mb-0"
      />

      {/* Dive window */}
      <DiveWindow
        episode={episode}
        chapter={chapter}
        templateId={template.id}
      />
    </div>
  );
}
