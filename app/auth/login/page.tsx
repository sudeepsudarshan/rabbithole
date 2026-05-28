import { Metadata } from 'next';
import Link from 'next/link';
import { Rabbit } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to save your rabbit holes and track episode progress.',
};

export default function LoginPage() {
  return (
    <div className="min-h-[80svh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--state-hover)', border: '1px solid var(--border-hairline)' }}
          >
            <Rabbit className="w-5 h-5 text-accent-rust" />
          </div>
          <span className="font-serif text-lg text-ink-primary">
            Down the Rabbit Hole
          </span>
        </div>

        {/* Card — the manga frame: one deliberate ink border per page */}
        <div
          className="rounded-lg p-8 space-y-6"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-ink)',
          }}
        >
          <div className="text-center">
            <h1 className="font-serif text-2xl text-ink-primary mb-2">Sign in</h1>
            <p className="text-xs text-ink-muted font-sans leading-relaxed">
              Save your rabbit holes, track episode progress, and access conversation history.
            </p>
          </div>

          {/* Auth coming soon notice */}
          <div
            className="rounded-md p-4 text-xs font-sans text-ink-secondary text-center leading-relaxed"
            style={{
              background: 'var(--state-hover)',
              border: '1px solid var(--border-hairline)',
            }}
          >
            Authentication requires Supabase configuration.
            <br />
            Connect your Supabase project to enable sign-in.
          </div>

          <p className="text-center text-xs text-ink-muted font-sans">
            No account?{' '}
            <Link href="/" className="text-accent-rust hover:text-ink-primary transition-colors">
              Explore without signing in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[0.65rem] text-ink-faint font-mono">
          Auth is optional — all content works without an account.
        </p>
      </div>
    </div>
  );
}
