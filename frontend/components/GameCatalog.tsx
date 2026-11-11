'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { GAMES } from '@/data/games';
import { GameItem } from '@/types';
import {
  Flame,
  Star,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function GameCatalog() {
  const {
    language,
    t,
    openTopUp,
    selectedCategory,
    setSelectedCategory,
    formatPrice,
    searchQuery,
  } = useApp();

  const categories = [
    { id: 'all', label: t.catalog.all },
    { id: 'moba', label: t.catalog.moba },
    { id: 'battle-royale', label: t.catalog.battleRoyale },
    { id: 'rpg', label: t.catalog.rpg },
    { id: 'shooter', label: t.catalog.shooter },
  ];

  const filteredGames = GAMES.filter((game) => {
    const matchesCategory =
      selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.currencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="game-catalog" className="py-12 select-none scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-[#E5B55E] rounded-full" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                {t.catalog.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 pl-3.5">
              {t.catalog.subtitle}
            </p>
          </div>

          {/* Luxury Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#E5B55E] to-[#C49740] text-black shadow-md scale-[1.02]'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Game Cards Grid (2 cols mobile, 3 tablet, 4 desktop) */}
        {filteredGames.length === 0 ? (
          <div className="py-16 text-center bg-[#0F1424]/50 border border-white/[0.08] rounded-3xl">
            <p className="text-neutral-400 text-sm">
              {language === 'km' ? 'រកមិនឃើញហ្គេមត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ' : 'No games match your search query.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredGames.map((game) => {
              const lowestPrice = Math.min(...game.packages.map((p) => p.priceUSD));
              return (
                <div
                  key={game.id}
                  onClick={() => openTopUp(game.id)}
                  className="group relative rounded-3xl overflow-hidden bg-[#0F1424] border border-white/[0.08] hover:border-[#E5B55E]/60 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_12px_32px_rgba(229,181,94,0.18)] hover:-translate-y-1 cursor-pointer"
                >
                  {/* Poster Image with Specular Gradient */}
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black/40">
                    <img
                      src={game.coverImage}
                      alt={game.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1424] via-[#0F1424]/40 to-transparent" />

                    {/* Instant Speed Top Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/75 border border-white/20 backdrop-blur-md text-[9px] font-black uppercase text-emerald-400 flex items-center gap-1 shadow-sm">
                      <Zap className="w-2.5 h-2.5 fill-current" />
                      <span>⚡ 3s API</span>
                    </div>

                    {/* Today Reloads Count */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/70 border border-white/10 backdrop-blur-md text-[9px] font-bold text-neutral-300">
                      {game.ordersToday.toLocaleString()} {t.catalog.ordersTodaySuffix}
                    </div>
                  </div>

                  {/* Card Content & Action Area */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between -mt-3 relative z-10">
                    <div>
                      {/* Publisher Subtitle */}
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 truncate">
                        {game.publisher}
                      </p>

                      {/* Game Title */}
                      <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-[#E5B55E] transition-colors line-clamp-1 mt-0.5">
                        {game.name}
                      </h3>

                      {/* Currency & Package Count */}
                      <div className="flex items-center justify-between text-xs text-neutral-300 font-semibold mt-1">
                        <span className="text-[#00D4FF] text-[11px] font-bold">
                          {game.currencyName}
                        </span>
                        <span className="text-neutral-400 text-[10px]">
                          {game.packages.length} Packs
                        </span>
                      </div>
                    </div>

                    {/* Bottom Pricing & Top-Up Button */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400 font-medium">
                          {t.catalog.startingFrom}
                        </span>
                        <span className="text-xs sm:text-sm font-black text-[#E5B55E]">
                          {formatPrice(lowestPrice)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openTopUp(game.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.06] group-hover:bg-[#E5B55E] group-hover:text-black border border-white/[0.1] group-hover:border-[#E5B55E] text-xs font-black text-neutral-200 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <span>{t.catalog.instantBtn}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
