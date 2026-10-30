'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface FeaturedGameItem {
  id: string;
  gameId: string;
  title: string;
  subtitle: string;
  rating: number;
  image: string;
  currency: string;
}

const FEATURED_GAMES: FeaturedGameItem[] = [
  {
    id: 'cyberbound',
    gameId: '1',
    title: 'Mobile Legends: Bang Bang',
    subtitle: 'Moonton • MOBA',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    currency: 'Weekly Pass & Diamonds',
  },
  {
    id: 'mythic-heroes',
    gameId: '7',
    title: 'Roblox Robux & Blox Fruits',
    subtitle: 'Roblox Corp • Cross-Platform',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80',
    currency: '80 - 4,500 Robux Direct',
  },
  {
    id: 'star-drifters',
    gameId: '3',
    title: 'Free Fire & Free Fire MAX',
    subtitle: 'Garena • Battle Royale',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    currency: '100 - 2,180 Diamonds',
  },
  {
    id: 'aegis-ascendant',
    gameId: '2',
    title: 'PUBG Mobile',
    subtitle: 'Tencent Games • Battle Royale',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    currency: 'Royale Pass & Instant UC',
  },
];

export default function FeaturedGames({
  onOpenTopUp,
}: {
  onOpenTopUp: (gameId: string) => void;
}) {
  return (
    <section id="featured-games" className="mb-14 scroll-mt-24 select-none">
      {/* Section Header (Sample 2 Template: Title on Left, < > on Right) */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
          FEATURED GAMES
        </h2>

        {/* Carousel controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous featured games"
            className="w-7 h-7 rounded-lg bg-[#0c121e] hover:bg-[#151f33] border border-white/[0.08] text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Next featured games"
            className="w-7 h-7 rounded-lg bg-[#0c121e] hover:bg-[#151f33] border border-white/[0.08] text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4-Column Card Grid (Sample 2 Template Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {FEATURED_GAMES.map((game) => (
          <div
            key={game.id}
            onClick={() => onOpenTopUp(game.gameId)}
            className="group rounded-2xl overflow-hidden bg-[#0a0f1b] border border-white/[0.07] hover:border-[#0070f3]/60 transition-all duration-300 flex flex-col justify-between shadow-xl cursor-pointer hover:-translate-y-1"
          >
            {/* Top Cover Image */}
            <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-black/40">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1b] via-[#0a0f1b]/20 to-transparent" />
            </div>

            {/* Bottom Content (Title, Subtitle, Rating, Blue Button) */}
            <div className="p-4 space-y-2.5">
              <div>
                <h3 className="text-sm font-black text-white group-hover:text-[#00e5ff] transition-colors line-clamp-1">
                  {game.title}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                  {game.subtitle}
                </p>
              </div>

              {/* Star Rating (Sample 2: ★★★★☆) */}
              <div className="flex items-center gap-1 text-[#f59e0b] text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]"
                  />
                ))}
                <span className="text-[10px] text-neutral-400 font-bold ml-1">
                  {game.rating}
                </span>
              </div>

              {/* Action Button: Bright Gradient Blue Button (Sample 2 Template Style) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTopUp(game.gameId);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0066ee] to-[#00a6ff] hover:brightness-110 active:scale-98 text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,102,238,0.4)] cursor-pointer"
              >
                PLAY NOW
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
