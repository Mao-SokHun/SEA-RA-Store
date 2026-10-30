import TopUpClient from '@/components/TopUpClient';

export function generateStaticParams() {
  return [
    { slug: 'mobile-legends' },
    { slug: 'free-fire' },
    { slug: 'pubg-mobile' },
    { slug: 'genshin-impact' },
    { slug: 'roblox' },
    { slug: 'shadowfall' },
    { slug: 'valorant' },
  ];
}

export default async function GameTopUpPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || 'mobile-legends';

  return <TopUpClient slug={slug} />;
}
