import { Metadata } from 'next';
import { Suspense } from 'react';
import FeedPageClient from './FeedPageClient';

export const metadata: Metadata = {
  title: 'Your Feed',
  description: 'Swipe through Sparks pulled from across the curious internet.',
};

export default function FeedPage() {
  return (
    <Suspense>
      <FeedPageClient />
    </Suspense>
  );
}
