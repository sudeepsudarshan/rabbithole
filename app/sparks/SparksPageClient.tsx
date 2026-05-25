'use client';

import { SparkCard } from '@/types/spark';
import SparkFeed from '@/components/sparks/SparkFeed';
import { Sparkles } from 'lucide-react';

interface SparksPageClientProps {
  sparks: SparkCard[];
}

export default function SparksPageClient({ sparks }: SparksPageClientProps) {
  return (
    <div className="min-h-[100svh]">
      {/* Desktop two-column layout */}
      <div className="hidden md:flex max-w-6xl mx-auto px-6 py-10 gap-16 items-start">
        {/* Left info column */}
        <div className="sticky top-20 w-72 shrink-0 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="font-mono text-[0.65rem] text-gold uppercase tracking-widest">
                Sparks
              </span>
            </div>
            <h1 className="font-serif italic text-3xl text-paper leading-tight mb-3">
              60 seconds to somewhere unexpected
            </h1>
            <p className="text-paper-faint text-sm font-sans leading-relaxed">
              Swipe through micro-episodes. Each one starts with a jaw-dropping fact,
              ends with a hook that makes you want to go deeper.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-sans text-paper-faint">
              <span className="text-paper font-medium">↑ ↓</span> arrow keys to navigate
            </div>
            <div className="text-xs font-sans text-paper-faint">
              Swipe up or down on mobile
            </div>
            <div className="text-xs font-sans text-paper-faint">
              Tap "Go Deeper" to read the full episode
            </div>
          </div>
        </div>

        {/* Right phone mockup */}
        <div className="flex-1 flex justify-center">
          <div
            className="relative"
            style={{ width: '375px' }}
          >
            {/* Phone frame */}
            <div className="relative rounded-[2.5rem] border-4 border-paper-faint/20 bg-ink overflow-hidden shadow-2xl"
              style={{ height: '700px' }}
            >
              {/* Phone notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-ink-50 rounded-full z-20" />

              {/* Content */}
              <div className="absolute inset-0 pt-10">
                <SparkFeed sparks={sparks} className="h-full flex flex-col p-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile full-screen layout */}
      <div className="md:hidden h-[100svh] flex flex-col">
        <SparkFeed sparks={sparks} className="flex-1 flex flex-col p-4" />
      </div>
    </div>
  );
}
