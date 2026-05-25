import { Metadata } from 'next';
import { TEMPLATES } from '@/lib/templates';
import TemplateGrid from '@/components/templates/TemplateGrid';
import FilterBar from '@/components/templates/FilterBar';

export const metadata: Metadata = {
  title: 'Templates',
  description:
    '20 AI podcast templates, each with a distinct conversational rhythm. From Tangent Tornado to The Mirror Test — find your rabbit hole.',
};

export default function TemplatesPage() {
  // Sort by EQ score descending
  const sorted = [...TEMPLATES].sort((a, b) => b.eqScore - a.eqScore);

  return (
    <div>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-2">
          <span className="font-mono text-[0.65rem] text-gold uppercase tracking-widest">
            20 Templates
          </span>
        </div>
        <h1 className="font-serif italic text-4xl text-paper mb-3">
          The Template Library
        </h1>
        <p className="text-paper-faint text-sm font-sans max-w-xl leading-relaxed mb-8">
          Each template is a distinct conversational format with its own AI voice, rhythm, and emotional arc.
          Pick any topic, drop it in, and see where it goes.
        </p>
        <FilterBar />
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        <TemplateGrid templates={sorted} />
      </div>
    </div>
  );
}
