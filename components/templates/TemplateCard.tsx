'use client';

import Link from 'next/link';
import { Template } from '@/types/template';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import EQBar from '@/components/ui/EQBar';
import RabbitHoleInput from './RabbitHoleInput';

interface TemplateCardProps {
  template: Template;
  featured?: boolean;
}

export default function TemplateCard({ template, featured = false }: TemplateCardProps) {
  return (
    <article
      className={cn(
        'border border-border bg-ink-50 flex flex-col transition-all duration-200 hover:border-border-strong',
        featured ? 'rounded-xl' : 'rounded-lg'
      )}
      style={{
        borderTopColor: `${template.accentColor}30`,
        borderTopWidth: '2px',
      }}
    >
      {/* Card header — clickable */}
      <Link
        href={`/templates/${template.id}`}
        className="block p-5 pb-3 hover:bg-white/[0.02] transition-colors rounded-t-lg group"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className="font-mono text-[0.65rem] font-normal"
            style={{ color: template.accentColor }}
          >
            Template {template.id}
          </span>
          <Badge variant="accent" accentColor={template.accentColor}>
            {template.badge}
          </Badge>
        </div>

        <h3 className="font-serif italic text-[1.1rem] text-paper leading-tight mb-2 group-hover:text-gold transition-colors">
          {template.name}
        </h3>
        <p className="text-xs text-paper-faint leading-relaxed font-sans line-clamp-2">
          {template.tagline}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[0.65rem] font-mono text-paper-faint">
            {template.durationRange}
          </span>
          <EQBar score={template.eqScore} className="w-24" />
        </div>
      </Link>

      {/* Separator */}
      <div className="h-px bg-border mx-5" />

      {/* Rabbit hole input */}
      <div className="p-4 pt-3">
        <RabbitHoleInput template={template} />
      </div>
    </article>
  );
}
