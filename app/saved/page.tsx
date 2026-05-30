import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Sparks',
  description: 'Your saved Sparks, ready when you are.',
};

export default function SavedPage() {
  return (
    <div
      className="min-h-[100svh] flex flex-col items-center justify-center px-5 text-center"
      style={{ background: 'var(--bg-page)' }}
    >
      <p className="font-serif italic text-base mb-2" style={{ color: 'var(--ink-secondary)' }}>
        Your saved Sparks will appear here.
      </p>
      <p className="font-mono text-[0.6rem] tracking-widest uppercase" style={{ color: 'var(--ink-faint)' }}>
        Coming soon
      </p>
    </div>
  );
}
