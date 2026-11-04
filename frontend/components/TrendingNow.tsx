'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const trendingGames = [
  {
    id: 'valiant-force',
    name: 'Valiant Force',
    count: '3,070 players',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop&q=85',
    avatarImg: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&q=80',
    slug: 'mobile-legends',
  },
  {
    id: 'apex-legends',
    name: 'Apex Legends',
    count: '2,201 players',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=600&fit=crop&q=85',
    avatarImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&q=80',
    slug: 'pubg-mobile',
  },
  {
    id: 'lost-ark',
    name: 'Lost Ark',
    count: '2,307 players',
    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=600&fit=crop&q=85',
    avatarImg: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&q=80',
    slug: 'genshin-impact',
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    count: '5,691 players',
    img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&h=600&fit=crop&q=85',
    avatarImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80',
    slug: 'free-fire',
  },
  {
    id: 'mobile-legends',
    name: 'Mobile Legends',
    count: '14,890 players',
    img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=600&fit=crop&q=85',
    avatarImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80',
    slug: 'mobile-legends',
  },
  {
    id: 'roblox',
    name: 'Roblox Direct',
    count: '9,420 players',
    img: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&h=600&fit=crop&q=85',
    avatarImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&q=80',
    slug: 'roblox',
  },
];

export default function TrendingNow() {
  return (
    <section className="py-6 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 select-none">
      
      {/* ── Section Header (TRENDING NOW in Mockup) ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-wider uppercase">
          TRENDING NOW
        </h2>

        {/* Header Navigation Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Previous trending games"
            className="w-7 h-7 rounded-md bg-[#0A1026] border border-[#16244C] hover:border-[#00A3FF] text-[#7F92B0] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            aria-label="Next trending games"
            className="w-7 h-7 rounded-md bg-[#0A1026] border border-[#16244C] hover:border-[#00A3FF] text-[#7F92B0] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 6 Cards Grid Matching Mockup & Screenshot 100% ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {trendingGames.map((game) => (
          <Link
            key={game.id}
            href={`/top-up/${game.slug}`}
            className="group relative rounded-xl overflow-hidden aspect-[1/1] sm:aspect-[4/4.2] border border-[#152248] hover:border-[#00A3FF]/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,163,255,0.25)] block bg-[#0A1026]"
          >
            {/* Background Cover Artwork */}
            <img
              src={game.img}
              alt={game.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              style={{ filter: 'brightness(0.78) contrast(1.15)' }}
            />

            {/* Bottom Gradient for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#040816] via-[#040816]/55 to-transparent" />

            {/* Bottom Info Bar Overlay (Mini avatar on left + Game Title + Player count) */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 flex items-center gap-2 z-10">
              {/* Game Avatar Thumbnail */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-[#16244C] shrink-0 shadow-md">
                <img
                  src={game.avatarImg}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Player Count */}
              <div className="overflow-hidden leading-tight">
                <p className="font-heading font-bold text-xs sm:text-[13px] text-white group-hover:text-[#00A3FF] transition-colors truncate">
                  {game.name}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#7F92B0] font-normal truncate mt-0.5">
                  {game.count}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
