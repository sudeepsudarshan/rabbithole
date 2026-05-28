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
  return (
    <div>
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

      {/* Chapter navigation */}
      <ChapterNav
        currentChapter={chapter.number}
        totalChapters={episode.chapters.length}
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
