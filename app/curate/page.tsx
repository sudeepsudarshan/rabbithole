import { Metadata } from 'next';
import CuratePageClient from './CuratePageClient';

export const metadata: Metadata = {
  title: 'Curate Your Feed',
  description: 'Pick your topics, emotional register, and lenses. We do the rest.',
};

export default function CuratePage() {
  return <CuratePageClient />;
}
