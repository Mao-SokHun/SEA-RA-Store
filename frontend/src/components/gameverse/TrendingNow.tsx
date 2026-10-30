'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

interface TrendingGameItem {
  id: string;
  gameId: string;
  title: string;
  publisher: string;
  playersCount: string;
  image: string;
  publisherIcon: string;
}

const TRENDING_GAMES: TrendingGameItem[] = [
  {
    id: 'valorant',
    gameId: '6',
    title: 'Valorant',
    publisher: 'Riot Games',
    playersCount: '12,450 players',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80',
    publisherIcon: '🎯',
  },
  {
    id: 'honor-of-kings',
    gameId: '4',
    title: 'Honor of Kings',
    publisher: 'Level Infinite',
    playersCount: '24,100 players',
    image: 'https://images.unsplash.com/photo-1612287233207-6b22998a445b?auto=format&fit=crop&w=500&q=80',
    publisherIcon: '👑',
  },
  {
    id: 'genshin',
    gameId: '5',
    title: 'Genshin Impact',
    publisher: 'HoYoverse',
    playersCount: '18,300 players',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=500&q=80',
    publisherIcon: '💎',
  },
  {
    id: 'codm',
    gameId: '8',
    title: 'Call of Duty: Mobile',
    publisher: 'Activision',
    playersCount: '15,677 players',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80',
    publisherIcon: '🪙',
  },
  {
    id: 'blood-strike',
    gameId: '10',
    title: 'Blood Strike',
    publisher: 'NetEase Games',
    playersCount: '9,204 players',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=500&q=80',
    publisherIcon: '⚡',
  },
];

export default function TrendingNow({
  onOpenTopUp,
}: {
  onOpenTopUp: (gameId: string) => void;
}) {
  return (
    <section className="mb-14 scroll-mt-24 select-none">
      {/* Section Header (Sample 2 Template Style) */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
          TRENDING NOW
        </h2>

        {/* Carousel controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous trending games"
            className="w-7 h-7 rounded-lg bg-[#0c121e] hover:bg-[#151f33] border border-white/[0.08] text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Next trending games"
            className="w-7 h-7 rounded-lg bg-[#0c121e] hover:bg-[#151f33] border border-white/[0.08] text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5-Column Grid (Sample 2 Template: 5 Horizontal Game Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {TRENDING_GAMES.map((game) => (
          <div
            key={game.id}
            onClick={() => onOpenTopUp(game.gameId)}
            className="group rounded-2xl overflow-hidden bg-[#0a0f1b] border border-white/[0.07] hover:border-[#00e5ff]/50 transition-all duration-300 flex flex-col justify-between shadow-lg cursor-pointer hover:-translate-y-1"
          >
            {/* Game Art Container */}
            <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-black/40">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1b] via-transparent to-transparent" />

              {/* Centered Game Logo / Title overlay */}
              <div className="absolute inset-0 flex items-center justify-center p-3 text-center pointer-events-none">
                <span className="text-sm font-black text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] tracking-wider">
                  {game.title}
                </span>
              </div>
            </div>

            {/* Bottom Info: Publisher Icon + Title + Player Count */}
            <div className="p-3 bg-[#0a0f1b] border-t border-white/[0.04] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-xs shrink-0">
                {game.publisherIcon}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-black text-white group-hover:text-[#00e5ff] transition-colors truncate">
                  {game.title}
                </p>
                <p className="text-[10px] text-neutral-400 truncate">
                  {game.playersCount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
