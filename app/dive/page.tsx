import { Metadata } from 'next';
import DivePageClient from './DivePageClient';
import { TEMPLATES } from '@/lib/templates';

export const metadata: Metadata = {
  title: 'Dive',
  description:
    'Freeform AI conversation. Pick any template persona and explore any topic — no structure, no chapters, just you and the rabbit hole.',
};

export default function DivePage() {
  return <DivePageClient templates={TEMPLATES} />;
}
