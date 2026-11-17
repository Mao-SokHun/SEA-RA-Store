'use client';

import React from 'react';
import Link from 'next/link';
import { GAMES } from '@/data/games';
import { useApp } from '@/context/AppContext';
import { ChevronRight, Zap } from 'lucide-react';

export default function TrendingGames() {
  const { language } = useApp();

  // Take the 5 top trending games
  const trendingList = GAMES.slice(0, 5);

  return (
    <section className="relative py-5 sm:py-8 bg-gradient-to-b from-[#0C061E] via-[#120829] to-[#080415] overflow-hidden select-none border-t border-b border-pink-500/20">
      
      {/* Ambient Neon Magenta Glow Bloom */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[200px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Stepped Angular Cyber Neon Magenta Top Accent Line */}
      <div className="absolute top-0 left-0 w-36 sm:w-64 h-[2px] bg-gradient-to-r from-pink-500 to-rose-400 shadow-[0_0_10px_#ec4899]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Section Header */}
        <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/[0.06] relative">
          
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899] animate-pulse" />
              <h2 className="text-base sm:text-xl font-black uppercase tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                TRENDING GAMES
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-neutral-400 pl-4">
              {language === 'km'
                ? 'ហ្គេមដែលពេញនិយម និងមានអ្នកបញ្ចូលលុយច្រើនបំផុត'
                : 'Top reload titles with the highest volume today.'}
            </p>
          </div>

          {/* Stepped Angular Line & NEXT Button */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-24 h-[1.5px] bg-gradient-to-r from-transparent via-pink-500/30 to-pink-500" />
            
            <Link
              href="/games"
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
            >
              <span>{language === 'km' ? 'បន្ទាប់' : 'NEXT'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* 5-Card Compact Grid (Sleek, Refined, Non-Intrusive) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3.5">
          {trendingList.map((game, idx) => {
            const lowestPrice = Math.min(...game.packages.map((p) => p.priceUSD));

            return (
              <Link
                key={game.id}
                href={`/top-up/${game.slug}`}
                className="group relative transition-all duration-300 hover:-translate-y-1 select-none"
              >
                {/* Outer Gaming Chamfer 1.5px Gradient Shell */}
                <div
                  style={{
                    clipPath:
                      'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                  }}
                  className="p-[1.5px] bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 shadow-[0_0_10px_rgba(236,72,153,0.25)] group-hover:shadow-[0_0_20px_rgba(236,72,153,0.55)] transition-all"
                >
                  {/* Inner Card Container */}
                  <div
                    style={{
                      clipPath:
                        'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                    }}
                    className="relative bg-[#0A0518] overflow-hidden flex flex-col justify-between"
                  >
                    {/* Top-Right Glowing Cyber Corner Line */}
                    <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none z-20">
                      <div className="w-10 h-[1.5px] bg-pink-300 transform rotate-45 translate-x-1 -translate-y-1 shadow-[0_0_6px_#ec4899]" />
                    </div>

                    {/* Compact Poster Artwork (Aspect 16/10) */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                      <img
                        src={game.bannerImage || game.coverImage}
                        alt={game.name}
                        className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-108"
                      />

                      {/* Rank Tag */}
                      <div
                        style={{
                          clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)',
                        }}
                        className="absolute top-2 left-2 px-2 py-0.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-mono text-[10px] font-black tracking-wider shadow-md z-20"
                      >
                        #0{idx + 1}
                      </div>

                      {/* Subtle Bottom Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0518] via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity" />

                      {/* Hover Quick Action Badge */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px] z-20">
                        <span
                          style={{
                            clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)',
                          }}
                          className="px-3 py-1 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3 fill-white" />
                          <span>TOP UP</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Bottom Meta (Compact) */}
                    <div className="p-2.5 sm:p-3 bg-[#0A0518] space-y-1 relative z-10 border-t border-pink-500/20">
                      <h3 className="text-xs font-bold uppercase text-white truncate group-hover:text-pink-300 transition-colors">
                        {game.name}
                      </h3>
                      <div className="flex items-center justify-between text-[11px] pt-0.5">
                        <span className="text-neutral-400 font-mono text-[10px]">
                          From <span className="text-pink-400 font-bold font-mono">${lowestPrice.toFixed(2)}</span>
                        </span>
                        <span className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          0% FEE
                        </span>
                      </div>
                    </div>

                    {/* Neon Bottom Accent Bar */}
                    <div className="w-full h-[2px] bg-gradient-to-r from-pink-600 via-rose-400 to-pink-600 shadow-[0_0_8px_#ec4899]" />

                  </div>
                </div>

              </Link>
            );
          })}
        </div>

        {/* Stepped Angular Cyber Neon Bottom Line */}
        <div className="mt-6 flex items-center justify-end">
          <div className="w-full max-w-[200px] sm:max-w-xs h-[2px] bg-gradient-to-l from-pink-500 via-rose-400 to-transparent shadow-[0_0_10px_#ec4899]" />
        </div>

      </div>

    </section>
  );
}
