'use client';

import React from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { GAMES } from '@/data/games';
import { TRANSLATIONS } from '@/i18n/translations';
import { ChevronLeft, ChevronRight, Star, Zap } from 'lucide-react';

export default function FeaturedGames() {
  const { language, openTopUp, selectedCategoryId } = useOrderStore();
  const t = TRANSLATIONS[language].featured;

  // Filter games if a category is selected, otherwise show top 4 featured
  const displayGames =
    selectedCategoryId === 'all'
      ? GAMES.slice(0, 4)
      : GAMES.filter((g) => g.categoryId === selectedCategoryId).slice(0, 4);

  return (
    <section id="featured-games" className="mb-14 scroll-mt-24 select-none">
      {/* Header: Title on Left, Controls on Right */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
          {t.title}
        </h2>

        {/* Carousel controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous featured games"
            className="w-7 h-7 rounded-lg bg-[#0F1A35] hover:bg-[#152347] border border-[#2B6CFF]/40 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Next featured games"
            className="w-7 h-7 rounded-lg bg-[#0F1A35] hover:bg-[#152347] border border-[#2B6CFF]/40 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Cards Grid (Sample 2 Template: Tall cards with cover + stars + cyan button) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {displayGames.map((game) => (
          <div
            key={game.id}
            onClick={() => openTopUp(game.id)}
            className="group rounded-2xl overflow-hidden bg-[#0F1A35] border border-[#2B6CFF]/35 hover:border-[#22D3EE]/70 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(43,108,255,0.25)] hover:scale-[1.02] cursor-pointer"
          >
            {/* Poster Art with subtle gradient */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black/40">
              <img
                src={game.cover}
                alt={game.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A35] via-transparent to-transparent" />

              {/* Instant Delivery Floating Pill */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#070B17]/85 border border-[#22D3EE]/40 text-[9px] font-black uppercase text-[#22D3EE] flex items-center gap-1 backdrop-blur-md">
                <Zap className="w-2.5 h-2.5 fill-current" />
                <span>INSTANT</span>
              </div>
            </div>

            {/* Info + Action */}
            <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between -mt-2 relative z-10">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-[#22D3EE] transition-colors line-clamp-1">
                  {game.name}
                </h3>
                <p className="text-[10px] text-neutral-400 font-medium truncate mt-0.5">
                  {game.category} • {game.currencyName}
                </p>

                {/* Star Ratings (Match Template: 5 Yellow Stars + 4.9) */}
                <div className="flex items-center gap-1 mt-1.5 text-amber-400">
                  <div className="flex items-center text-xs">
                    {'★★★★★'}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-300 ml-1">
                    {game.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Full-width High-Tech Button (Electric Cyan Gradient) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openTopUp(game.id);
                }}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-[#22D3EE] via-[#3B82F6] to-[#2563EB] hover:from-[#38BDF8] hover:to-[#1D4ED8] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.35)] transition-all cursor-pointer"
              >
                {t.topUpBtn}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
