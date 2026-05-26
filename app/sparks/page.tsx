import { Metadata } from 'next';
import SparksPageClient from './SparksPageClient';

export const metadata: Metadata = {
  title: 'Sparks',
  description:
    '60-second vertical swipeable micro-episodes. One jaw-dropping fact, one AI exchange, one hook.',
};

export default function SparksPage() {
  return <SparksPageClient />;
}
