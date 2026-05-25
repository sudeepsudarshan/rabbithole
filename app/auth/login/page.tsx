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
          <div className="w-10 h-10 rounded-full bg-gold-faint border border-gold/30 flex items-center justify-center">
            <Rabbit className="w-5 h-5 text-gold" />
          </div>
          <span className="font-serif italic text-lg text-paper">
            Down the Rabbit Hole
          </span>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-ink-50 p-8 space-y-6">
          <div className="text-center">
            <h1 className="font-serif italic text-2xl text-paper mb-2">Sign in</h1>
            <p className="text-xs text-paper-faint font-sans leading-relaxed">
              Save your rabbit holes, track episode progress, and access conversation history.
            </p>
          </div>

          {/* Auth coming soon notice */}
          <div className="rounded-lg border border-gold/20 bg-gold-faint p-4 text-xs font-sans text-paper-muted text-center leading-relaxed">
            Authentication requires Supabase configuration.
            <br />
            Connect your Supabase project to enable sign-in.
          </div>

          <p className="text-center text-xs text-paper-faint font-sans">
            No account?{' '}
            <Link href="/" className="text-gold hover:text-gold-bright transition-colors">
              Explore without signing in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[0.65rem] text-paper-faint font-mono">
          Auth is optional — all content works without an account.
        </p>
      </div>
    </div>
  );
}
