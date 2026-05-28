import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import FormatCards from '@/components/home/FormatCards';
import TopFive from '@/components/home/TopFive';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Explore',
  description:
    'Learn about Down the Rabbit Hole with AI — 20 templates, 3 formats, infinite rabbit holes.',
};

export default function ExplorePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FormatCards />
      <TopFive />

      {/* CTA Section */}
      <section
        className="py-24 px-6 text-center"
        style={{ borderTop: '1px solid var(--border-hairline)' }}
      >
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-ink-primary mb-4">
            Ready to go down the rabbit hole?
          </h2>
          <p className="text-ink-muted text-sm font-sans mb-8 leading-relaxed">
            Pick any of 20 templates, type a question, and watch where it goes.
            No account needed.
          </p>
          <Link href="/templates">
            <Button variant="primary" size="lg" className="gap-2.5">
              <Sparkles className="w-4 h-4" />
              Explore all templates
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
