'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const trendingGames = [
  {
    id: 'valiant-force',
    name: 'Valiant Force',
    count: '3,070 players',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=400&fit=crop&q=80',
    avatarImg: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=60&h=60&fit=crop&q=80',
    targetLink: '/top-up/shadowfall',
  },
  {
    id: 'apex-legends',
    name: 'Apex Legends',
    count: '2,201 players',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=400&fit=crop&q=80',
    avatarImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&q=80',
    targetLink: '/top-up/pubg-mobile',
  },
  {
    id: 'lost-ark',
    name: 'Lost Ark',
    count: '2,307 players',
    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=400&fit=crop&q=80',
    avatarImg: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&h=60&fit=crop&q=80',
    targetLink: '/top-up/genshin-impact',
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    count: '3,691 players',
    img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&h=400&fit=crop&q=80',
    avatarImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&q=80',
    targetLink: '/top-up/free-fire',
  },
  {
    id: 'easinenme-saga',
    name: 'Easinenme Saga',
    count: '2,094 players',
    img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&h=400&fit=crop&q=80',
    avatarImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&q=80',
    targetLink: '/top-up/mobile-legends',
  },
];

export default function TrendingNow() {
  return (
    <section className="py-8 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">

      {/* ── Section Header (TRENDING NOW in Mockup) ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-en font-black text-lg sm:text-xl text-white tracking-wider uppercase">
          TRENDING NOW
        </h2>

        {/* Header Navigation Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Previous"
            className="w-7 h-7 rounded-md bg-[#0A1026] border border-[#16244C] hover:border-[#00A3FF] text-[#7F92B0] hover:text-white flex items-center justify-center transition-all"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            aria-label="Next"
            className="w-7 h-7 rounded-md bg-[#0A1026] border border-[#16244C] hover:border-[#00A3FF] text-[#7F92B0] hover:text-white flex items-center justify-center transition-all"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 5 Cards in a Row Matching Mockup Exactly ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {trendingGames.map((game) => (
          <Link
            key={game.id}
            href={game.targetLink}
            className="group relative rounded-xl overflow-hidden aspect-[1/1] sm:aspect-[4/4.2] border border-[#152248] hover:border-[#00A3FF]/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,163,255,0.25)] block bg-[#0A1026]"
          >
            {/* Background Cover Artwork */}
            <img
              src={game.img}
              alt={game.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              style={{ filter: 'brightness(0.75) contrast(1.1)' }}
            />

            {/* Bottom Gradient for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#040816] via-[#040816]/50 to-transparent" />

            {/* Bottom Info Bar Overlay (Mini avatar on left + Game Title + Player count) */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 flex items-center gap-2">
              {/* Game Avatar Thumbnail */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-[#16244C] flex-shrink-0 shadow-md">
                <img
                  src={game.avatarImg}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="flex flex-col min-w-0">
                <span className="font-en font-bold text-white text-xs leading-tight truncate group-hover:text-[#00A3FF] transition-colors">
                  {game.name}
                </span>
                <span className="font-en text-[10px] text-[#7F92B0] truncate mt-0.5">
                  {game.count}
                </span>
              </div>
            </div>

            {/* Subtle Hover Border Glow */}
            <div className="absolute inset-0 rounded-xl border border-[#00A3FF] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </Link>
        ))}
      </div>

    </section>
  );
}
