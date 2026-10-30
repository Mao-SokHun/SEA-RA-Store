'use client';

import React from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { GAMES } from '@/data/games';
import { TRANSLATIONS } from '@/i18n/translations';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

export default function TrendingRow() {
  const { language, openTopUp } = useOrderStore();
  const t = TRANSLATIONS[language].trending;

  // Use games 5 to 10 for trending row
  const trendingGames = GAMES.slice(4);

  return (
    <section className="mb-14 scroll-mt-24 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
          {t.title}
        </h2>

        {/* Carousel controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous trending games"
            className="w-7 h-7 rounded-lg bg-[#0F1A35] hover:bg-[#152347] border border-[#2B6CFF]/40 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Next trending games"
            className="w-7 h-7 rounded-lg bg-[#0F1A35] hover:bg-[#152347] border border-[#2B6CFF]/40 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5-Column Grid / Horizontal Scroll */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {trendingGames.map((game) => (
          <div
            key={game.id}
            onClick={() => openTopUp(game.id)}
            className="group rounded-2xl overflow-hidden bg-[#0F1A35] border border-[#2B6CFF]/30 hover:border-[#22D3EE]/70 transition-all p-2.5 flex flex-col justify-between cursor-pointer hover:scale-[1.03] hover:shadow-[0_8px_25px_rgba(43,108,255,0.2)]"
          >
            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-black/40 mb-2.5">
              <img
                src={game.cover}
                alt={game.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A35]/90 via-transparent to-transparent" />
              <div className="absolute top-1.5 left-1.5 text-base">
                {game.currencyIcon}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-white group-hover:text-[#22D3EE] transition-colors line-clamp-1">
                {game.name}
              </h4>
              <div className="flex items-center gap-1 text-[10px] text-[#22D3EE] font-mono mt-0.5">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>
                  {game.ordersToday.toLocaleString()}{' '}
                  {language === 'km' ? 'ការកុម្ម៉ង់' : 'orders'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

