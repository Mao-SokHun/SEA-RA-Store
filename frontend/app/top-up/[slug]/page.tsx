import { GAMES } from '@/data/games';
import { notFound } from 'next/navigation';
import DedicatedTopUpClient from './DedicatedTopUpClient';

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export default async function TopUpPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = GAMES.find((g) => g.slug === slug);

  if (!game) {
    notFound();
  }

  return <DedicatedTopUpClient game={game} />;
}
