import { Metadata } from 'next';
import SparkFeedHome from '@/components/sparks/SparkFeedHome';

export const metadata: Metadata = {
  title: 'Down the Rabbit Hole with AI',
  description:
    'A curiosity-driven AI platform. Start with a Spark, go as deep as you dare. 20 templates, infinite rabbit holes.',
};

export default function HomePage() {
  return <SparkFeedHome />;
}
