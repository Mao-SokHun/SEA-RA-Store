import type { Metadata } from 'next';
import { GAMES } from '@/data/games';
import { notFound } from 'next/navigation';
import DedicatedTopUpClient from './DedicatedTopUpClient';

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = GAMES.find((g) => g.slug === slug);

  if (!game) {
    return {
      title: 'Game Not Found • SEA RA PRESTIGE',
    };
  }

  const minPrice = Math.min(...game.packages.map((p) => p.priceUSD));
  const title = `បញ្ចូល ${game.name} - SEA RA PRESTIGE | ០% សេវា Bakong KHQR`;
  const description = `បញ្ចូល ${game.currencyName} ហ្គេម ${game.name} តម្លៃពិសេសចាប់ពី $${minPrice.toFixed(2)} តាម Bakong KHQR ០% សេវា ពេជ្រចូលគណនីស្វ័យប្រវត្តិក្នង < 3 វិនាទី!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://frontend-silk-one-22.vercel.app/top-up/${game.slug}`,
      siteName: 'SEA RA PRESTIGE',
      images: [
        {
          url: game.coverImage,
          width: 1200,
          height: 630,
          alt: `${game.name} Top-Up SEA RA PRESTIGE`,
        },
      ],
      locale: 'km_KH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [game.coverImage],
    },
  };
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
