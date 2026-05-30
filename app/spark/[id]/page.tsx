import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllSparks, getSparkById } from '@/lib/sparks';
import SparkPlayerClient from './SparkPlayerClient';

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllSparks().map(s => ({ id: s.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const spark = getSparkById(id);
  if (!spark) return { title: 'Spark not found' };
  return { title: spark.title, description: spark.hookLine };
}

export default async function SparkPlayerPage({ params }: Params) {
  const { id } = await params;
  const spark = getSparkById(id);
  if (!spark) notFound();
  return <SparkPlayerClient spark={spark} />;
}
