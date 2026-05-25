'use client';

import { useMemo } from 'react';
import { Template } from '@/types/template';
import { useUIStore } from '@/store/uiStore';
import TemplateCard from './TemplateCard';

interface TemplateGridProps {
  templates: Template[];
}

export default function TemplateGrid({ templates }: TemplateGridProps) {
  const { activeFilter } = useUIStore();

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return templates;
    return templates.filter(t =>
      t.categories.includes(activeFilter as Template['categories'][0])
    );
  }, [templates, activeFilter]);

  if (filtered.length === 0) {
    return (
      <div className="py-20 text-center text-paper-faint">
        <p className="font-serif italic text-lg">No templates match this filter.</p>
        <p className="text-sm mt-2">Try a different category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
      {filtered.map(template => (
        <div key={template.id} className="bg-ink">
          <TemplateCard template={template} />
        </div>
      ))}
    </div>
  );
}
