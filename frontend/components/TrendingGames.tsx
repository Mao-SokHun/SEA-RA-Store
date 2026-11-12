'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GAMES } from '@/data/games';
import { useApp } from '@/context/AppContext';
import { ArrowRight, Flame, Sparkles, ChevronRight } from 'lucide-react';

export default function TrendingGames() {
  const { language } = useApp();
  const [startIndex, setStartIndex] = useState(0);

  // Take the 5 top trending games
  const trendingList = GAMES.slice(0, 5);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % GAMES.length);
  };

  return (
    <section className="relative py-14 sm:py-20 bg-gradient-to-b from-[#0C061E] via-[#120829] to-[#080415] overflow-hidden select-none border-t border-b border-pink-500/20">
      
      {/* Ambient Neon Magenta Glow Bloom */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Stepped Angular Cyber Neon Magenta Top Border Line (Matches Reference Image) */}
      <div className="absolute top-0 left-0 w-48 sm:w-80 h-[3px] bg-gradient-to-r from-pink-500 to-rose-400 shadow-[0_0_12px_#ec4899]" />
      
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        
        {/* Section Header: Title + Stepped Accent Line + NEXT Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 relative">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]" />
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                TRENDING GAMES
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-neutral-400 pl-5">
              {language === 'km'
                ? 'ហ្គេមដែលពេញនិយម និងមានអ្នកបញ្ចូលលុយច្រើនជាងគេបំផុត'
                : 'Most popular games with the highest reload volume today.'}
            </p>
          </div>

          {/* Stepped Angular Line & NEXT Button (Matching Reference Image) */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="hidden md:block w-32 h-[2px] bg-gradient-to-r from-transparent via-pink-500/40 to-pink-500" />
            
            <Link
              href="/games"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.45)] hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] transition-all flex items-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <span>{language === 'km' ? 'បន្ទាប់' : 'NEXT'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* 5-Card Vertical Poster Row (Authentic Gaming Chamfer HUD Shape) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {trendingList.map((game, idx) => {
            const lowestPrice = Math.min(...game.packages.map((p) => p.priceUSD));

            return (
              <Link
                key={game.id}
                href={`/top-up/${game.slug}`}
                className="group relative transition-all duration-300 hover:-translate-y-2 select-none"
              >
                {/* Outer Gaming Chamfer 2px Gradient Shell (Traces 45-degree angle perfectly) */}
                <div
                  style={{
                    clipPath:
                      'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))',
                  }}
                  className="p-[2px] bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 shadow-[0_0_15px_rgba(236,72,153,0.35)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] transition-all"
                >
                  {/* Inner Card Container Matching the Chamfer Cut */}
                  <div
                    style={{
                      clipPath:
                        'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))',
                    }}
                    className="relative bg-[#0A0518] overflow-hidden flex flex-col justify-between"
                  >
                    {/* Top-Right Glowing Cyber Angle Bracket Line (HUD Accent) */}
                    <div className="absolute top-0 right-0 w-10 h-10 pointer-events-none z-20">
                      <div className="w-14 h-[2px] bg-pink-300 transform rotate-45 translate-x-1.5 -translate-y-1.5 shadow-[0_0_8px_#ec4899]" />
                    </div>

                    {/* Poster Artwork (Aspect Ratio 3:4 Vertical Poster) */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                      <img
                        src={game.bannerImage || game.coverImage}
                        alt={game.name}
                        className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Top-Left Gaming Parallelogram Rank Badge */}
                      <div
                        style={{
                          clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
                        }}
                        className="absolute top-2.5 left-2.5 px-3 py-1 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-mono text-[11px] font-black tracking-wider shadow-lg z-20"
                      >
                        #0{idx + 1}
                      </div>

                      {/* Gradient Overlay for Text Legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0518] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                      {/* Hover Quick Action Badge */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] z-20">
                        <span
                          style={{
                            clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform"
                        >
                          <span>⚡ TOP UP</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Bottom Meta */}
                    <div className="p-3.5 sm:p-4 bg-[#0A0518] space-y-1 relative z-10 border-t border-pink-500/20">
                      <h3 className="text-xs sm:text-sm font-extrabold uppercase text-white truncate group-hover:text-pink-300 transition-colors">
                        {game.name}
                      </h3>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400 font-mono">
                          From <span className="text-pink-400 font-bold">${lowestPrice.toFixed(2)}</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          0% FEE
                        </span>
                      </div>
                    </div>

                    {/* Pink/Magenta Neon Bottom Underline Bar */}
                    <div className="w-full h-[3px] bg-gradient-to-r from-pink-600 via-rose-400 to-pink-600 shadow-[0_0_10px_#ec4899]" />

                  </div>
                </div>

              </Link>
            );
          })}
        </div>

        {/* Stepped Angular Cyber Neon Bottom Line */}
        <div className="mt-12 flex items-center justify-end">
          <div className="w-64 sm:w-96 h-[3px] bg-gradient-to-l from-pink-500 via-rose-400 to-transparent shadow-[0_0_12px_#ec4899]" />
        </div>

      </div>

    </section>
  );
}
