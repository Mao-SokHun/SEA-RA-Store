'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GAMES } from '@/data/games';
import { useApp } from '@/context/AppContext';
import ChamferHighlights from '@/components/ChamferHighlights';
import { Search, Flame, Zap, ArrowRight, ArrowLeft, Gamepad2 } from 'lucide-react';

export default function GamesCatalogPage() {
  const { language, openTopUp, formatPrice, t } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', labelKh: 'ទាំងអស់', labelEn: 'All Games' },
    { id: 'moba', labelKh: 'MOBA', labelEn: 'MOBA' },
    { id: 'battle-royale', labelKh: 'Battle Royale', labelEn: 'Battle Royale' },
    { id: 'rpg', labelKh: 'Action RPG', labelEn: 'RPG' },
    { id: 'fps', labelKh: 'FPS Shooters', labelEn: 'Shooters' },
    { id: 'sports', labelKh: 'Sports & Football', labelEn: 'Sports' },
    { id: 'strategy', labelKh: 'Strategy & Base', labelEn: 'Strategy' },
    { id: 'giftcards', labelKh: 'Cards & Wallet', labelEn: 'Gift Cards' },
  ];

  const filteredGames = GAMES.filter((g) => {
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.publisher.toLowerCase().includes(search.toLowerCase()) ||
      g.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none pt-20 sm:pt-24">
      
      {/* Header */}
      <div className="space-y-3 mb-10 max-w-2xl">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {language === 'km' ? 'កាតាឡុកហ្គេមផ្លូវការ' : 'Official Game Catalog'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          {language === 'km'
            ? 'ជ្រើសរើសហ្គេមដែលអ្នកចូលចិត្តដើម្បីបញ្ចូលពេជ្រ និងកាក់ក្នុងតម្លៃពិសេសបំផុតតាមរយៈ Bakong KHQR ដោយគ្មានថ្លៃសេវា។'
            : 'Select your game to top-up instantly with 0% fee Bakong KHQR. Verified official APIs only.'}
        </p>
      </div>

      {/* Search & Gaming Chamfered Categories Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'km' ? 'ស្វែងរកតាមឈ្មោះហ្គេម...' : 'Search games...'}
            className="w-full bg-[#090E1E] border border-white/[0.15] focus:border-cyan-400 rounded-xl pl-11 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              style={{
                clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
              }}
              className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black shadow-[0_0_20px_rgba(0,212,255,0.6)]'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 hover:border-cyan-400/50'
              }`}
            >
              {language === 'km' ? c.labelKh : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Game Cards Grid: Identical 5-Card Chamfered Grid Matching Home */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
        {filteredGames.map((game) => {
          const lowestPrice = Math.min(...game.packages.map((p) => p.priceUSD));

          return (
            <Link
              key={game.id}
              href={`/top-up/${game.slug}`}
              style={{
                clipPath:
                  'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
              }}
              className="group relative h-[420px] sm:h-[450px] overflow-hidden bg-[#0A101E] border border-white/[0.12] hover:border-[#E5B55E]/80 transition-all duration-500 flex flex-col justify-end cursor-pointer hover:-translate-y-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(229,181,94,0.4)]"
            >
              {/* Glowing Precision Laser Highlights on 45° Chamfered Corners */}
              <ChamferHighlights size={24} color={game.id === 'mlbb' ? 'cyan' : game.id === 'roblox' ? 'red' : 'gold'} className="opacity-75 group-hover:opacity-100 transition-opacity" />

              {/* Poster Image */}
              <img
                src={game.coverImage}
                alt={game.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/70 via-45% to-black/30 pointer-events-none" />

              {/* Color Bloom from Bottom */}
              <div className="absolute -bottom-8 inset-x-0 h-44 opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500 pointer-events-none bg-[#E5B55E]" />

              {/* Subtle Tech Grid */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Holographic Shimmer Foil Sweep */}
              <div className="absolute -inset-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
                <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.18] to-transparent transform -rotate-45 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </div>

              {/* Decorative Sci-Fi Corner Brackets */}
              <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#E5B55E]/70 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#E5B55E]/70 pointer-events-none" />

              {/* Bottom Card Content */}
              <div className="relative z-10 p-3.5 sm:p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#E5B55E] truncate">
                    {game.publisher}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400 font-bold shrink-0">
                    {game.packages.length} {language === 'km' ? 'កញ្ចប់' : 'Packs'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#E5B55E] transition-colors leading-tight line-clamp-1 drop-shadow-md">
                    {game.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs">
                    <span className="text-sm">{game.currencyIcon}</span>
                    <span className="font-bold text-[11px] truncate tracking-wide text-[#E5B55E]">
                      {game.currencyName}
                    </span>
                  </div>
                </div>

                {/* Price & Gold Chamfered TOP UP CTA */}
                <div className="pt-2.5 border-t border-white/[0.12] flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-neutral-400 font-mono tracking-widest uppercase font-bold">
                      {t.catalog.startingFrom}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base sm:text-lg font-black font-mono tracking-tight text-white drop-shadow">
                        ${lowestPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      clipPath:
                        'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                    }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#E5B55E] via-[#F3C978] to-[#D4A043] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(229,181,94,0.4)] group-hover:shadow-[0_0_22px_rgba(229,181,94,0.7)] group-hover:scale-105 active:scale-95 transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>{t.catalog.instantBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
