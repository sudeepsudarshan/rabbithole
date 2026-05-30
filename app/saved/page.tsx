'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useSavedStore } from '@/store/savedStore';
import { getSparkById } from '@/lib/sparks';

export default function SavedPage() {
  const { savedIds, toggle } = useSavedStore();
  const sparks = savedIds.map(id => getSparkById(id)).filter((s): s is NonNullable<typeof s> => s != null);

  return (
    <div className="min-h-[100svh] px-5 pt-16 pb-24" style={{ background: 'var(--bg-page)' }}>
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <p className="font-mono text-[0.6rem] tracking-widest uppercase mb-2" style={{ color: 'var(--ink-faint)' }}>
          Your collection
        </p>
        <h1 className="font-serif text-2xl" style={{ color: 'var(--ink-primary)' }}>
          Saved Sparks
        </h1>
      </div>

      {/* Empty state */}
      {sparks.length === 0 && (
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 py-20 text-center">
          <Heart className="w-8 h-8" style={{ color: 'var(--ink-faint)' }} />
          <p className="font-serif italic text-base" style={{ color: 'var(--ink-secondary)' }}>
            Nothing saved yet.
          </p>
          <p className="font-sans text-sm" style={{ color: 'var(--ink-muted)' }}>
            Tap the heart on any Spark to save it here.
          </p>
          <Link
            href="/feed"
            className="mt-2 font-mono text-[0.65rem] tracking-widest uppercase px-4 py-2 rounded-full transition-all active:scale-95"
            style={{ border: '1px solid var(--border-hairline)', color: 'var(--ink-secondary)' }}
          >
            Browse Sparks →
          </Link>
        </div>
      )}

      {/* Grid */}
      {sparks.length > 0 && (
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sparks.map(spark => (
            <div
              key={spark.id}
              className="relative rounded-xl overflow-hidden group"
              style={{ border: '1px solid var(--border-hairline)', background: 'var(--bg-elevated)' }}
            >
              {/* Hero thumbnail */}
              <Link href={`/spark/${spark.id}`} className="block">
                <div className="relative w-full" style={{ height: '120px' }}>
                  <Image
                    src={spark.heroImage}
                    alt=""
                    fill
                    className="object-cover saturate-[0.85]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, var(--bg-elevated) 0%, transparent 60%)' }}
                  />
                </div>

                {/* Text */}
                <div className="px-4 pt-2 pb-3">
                  <p
                    className="font-mono text-[0.55rem] tracking-wider uppercase mb-1"
                    style={{ color: spark.accentColor }}
                  >
                    {spark.templateLabel}
                  </p>
                  <h2
                    className="font-serif italic text-[0.95rem] leading-snug line-clamp-2"
                    style={{ color: 'var(--ink-primary)' }}
                  >
                    {spark.title}
                  </h2>
                </div>
              </Link>

              {/* Unsave button */}
              <button
                onClick={() => toggle(spark.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full transition-all active:scale-90"
                style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                aria-label="Remove from saved"
              >
                <Heart className="w-3.5 h-3.5" style={{ color: '#E24B4A' }} fill="#E24B4A" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
