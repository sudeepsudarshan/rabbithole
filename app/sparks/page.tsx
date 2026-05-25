import { Metadata } from 'next';
import { SPARKS } from '@/lib/sparks';
import SparksPageClient from './SparksPageClient';

export const metadata: Metadata = {
  title: 'Sparks',
  description:
    '60-second vertical swipeable micro-episodes. One jaw-dropping fact, one AI exchange, one hook. Swipe through the best of Down the Rabbit Hole.',
};

export default function SparksPage() {
  return <SparksPageClient sparks={SPARKS} />;
}
