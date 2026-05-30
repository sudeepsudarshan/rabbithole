'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import StepTopics from '@/components/curate/StepTopics';
import StepEmotions from '@/components/curate/StepEmotions';
import StepLenses from '@/components/curate/StepLenses';
import GeneratingState from '@/components/curate/GeneratingState';
import { TOPICS } from '@/lib/topics';

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

const STEP_LABELS = ['Topics', 'Feel', 'Lenses'];

export default function CuratePageClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [topics, setTopics] = useState<string[]>([]);
  const [registers, setRegisters] = useState<string[]>([]);
  const [lenses, setLenses] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);

  function toggleTopic(id: string) {
    setTopics(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function toggleRegister(id: string) {
    setRegisters(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function toggleLens(id: string) {
    setLenses(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleSkipTopics() {
    const random = pickRandom(TOPICS, 4).map(t => t.id);
    setTopics(random);
    setStep(1);
  }

  function handleFinish() {
    setGenerating(true);
    const prefs = { topics, registers, lenses, timestamp: Date.now() };
    try {
      localStorage.setItem('dtrh-curation', JSON.stringify(prefs));
    } catch { /* ignore */ }
    // Brief delay for UX animation
    setTimeout(() => router.push('/feed?mode=curated'), 2000);
  }

  function canAdvance(): boolean {
    if (step === 0) return topics.length >= 2;
    if (step === 1) return registers.length >= 1;
    if (step === 2) return lenses.length >= 2;
    return false;
  }

  if (generating) return <GeneratingState />;

  return (
    <div className="min-h-[100svh] px-5 pt-16 pb-24 max-w-2xl mx-auto" style={{ background: 'var(--bg-page)' }}>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className="h-px w-6 transition-all"
                style={{ background: i <= step ? 'var(--accent-rust)' : 'var(--border-hairline)' }}
              />
            )}
            <span
              className="font-mono text-[0.6rem] tracking-widest uppercase transition-colors"
              style={{ color: i === step ? 'var(--accent-rust)' : i < step ? 'var(--ink-muted)' : 'var(--ink-faint)' }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="mb-10">
        {step === 0 && (
          <StepTopics selected={topics} onToggle={toggleTopic} onSkip={handleSkipTopics} />
        )}
        {step === 1 && (
          <StepEmotions selected={registers} onToggle={toggleRegister} />
        )}
        {step === 2 && (
          <StepLenses selected={lenses} onToggle={toggleLens} />
        )}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 inset-x-0 flex items-center justify-between px-5 py-4"
        style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-hairline)' }}
      >
        <button
          onClick={() => setStep(s => s - 1)}
          className="flex items-center gap-1.5 font-mono text-[0.65rem] tracking-wide uppercase transition-colors hover:text-[var(--ink-primary)]"
          style={{ color: 'var(--ink-muted)', visibility: step === 0 ? 'hidden' : 'visible' }}
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </button>

        {step < 2 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canAdvance()}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full font-mono text-[0.68rem] tracking-wide uppercase transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: canAdvance() ? 'var(--accent-rust)' : 'var(--bg-elevated)',
              color: canAdvance() ? '#fff' : 'var(--ink-muted)',
              border: canAdvance() ? 'none' : '1px solid var(--border-hairline)',
            }}
          >
            Next <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={!canAdvance()}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full font-mono text-[0.68rem] tracking-wide uppercase transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: canAdvance() ? 'var(--accent-rust)' : 'var(--bg-elevated)',
              color: canAdvance() ? '#fff' : 'var(--ink-muted)',
              border: canAdvance() ? 'none' : '1px solid var(--border-hairline)',
            }}
          >
            Build my feed <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
