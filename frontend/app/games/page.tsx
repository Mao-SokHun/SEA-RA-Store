'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GAMES } from '@/data/games';
import { useApp } from '@/context/AppContext';
import ChamferHighlights from '@/components/ChamferHighlights';
import { Search, ArrowRight } from 'lucide-react';

const GAME_THEMES: Record<string, { themeColor: string; neonGlow: string; borderAccent: string }> = {
  mlbb: { themeColor: '#00D4FF', neonGlow: 'rgba(0, 212, 255, 0.45)', borderAccent: 'group-hover:border-[#00D4FF]/80' },
  roblox: { themeColor: '#EF4444', neonGlow: 'rgba(239, 68, 68, 0.45)', borderAccent: 'group-hover:border-[#EF4444]/80' },
  ff: { themeColor: '#F97316', neonGlow: 'rgba(249, 115, 22, 0.45)', borderAccent: 'group-hover:border-[#F97316]/80' },
  pubg: { themeColor: '#EAB308', neonGlow: 'rgba(234, 179, 8, 0.45)', borderAccent: 'group-hover:border-[#EAB308]/80' },
  genshin: { themeColor: '#A855F7', neonGlow: 'rgba(168, 85, 247, 0.45)', borderAccent: 'group-hover:border-[#A855F7]/80' },
  valorant: { themeColor: '#00D4FF', neonGlow: 'rgba(0, 212, 255, 0.45)', borderAccent: 'group-hover:border-[#00D4FF]/80' },
  hok: { themeColor: '#F59E0B', neonGlow: 'rgba(245, 158, 11, 0.45)', borderAccent: 'group-hover:border-[#F59E0B]/80' },
  codm: { themeColor: '#10B981', neonGlow: 'rgba(16, 185, 129, 0.45)', borderAccent: 'group-hover:border-[#10B981]/80' },
};

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
    <div className="min-h-screen py-8 sm:py-14 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none pt-20 sm:pt-24">
      
      {/* Header */}
      <div className="space-y-1.5 mb-6 max-w-2xl">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 sm:h-5 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(0,212,255,0.6)]" />
          <h1 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {language === 'km' ? 'កាតាឡុកហ្គេមផ្លូវការ' : 'Official Game Catalog'}
          </h1>
        </div>
        <p className="text-[11px] sm:text-xs text-neutral-400 pl-3.5">
          {language === 'km'
            ? 'ជ្រើសរើសហ្គេមដែលអ្នកចូលចិត្តដើម្បីបញ្ចូលពេជ្រ និងកាក់ក្នុងតម្លៃពិសេសបំផុតតាមរយៈ Bakong KHQR ដោយគ្មានថ្លៃសេវា។'
            : 'Select your game to top-up instantly with 0% fee Bakong KHQR. Verified official APIs only.'}
        </p>
      </div>

      {/* Search & Gaming Chamfered Categories Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'km' ? 'ស្វែងរកតាមឈ្មោះហ្គេម...' : 'Search games...'}
            className="w-full bg-[#0A101E] border border-white/[0.12] focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              style={{
                clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
              }}
              className={`px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                selectedCategory === c.id
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black shadow-[0_0_15px_rgba(0,212,255,0.7)]'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 hover:border-cyan-400/50'
              }`}
            >
              {language === 'km' ? c.labelKh : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Game Cards Grid: Compact Thumb-Friendly 2-Col on Mobile Matching Home */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3.5 lg:gap-4">
        {filteredGames.map((game) => {
          const lowestPrice = Math.min(...game.packages.map((p) => p.priceUSD));
          const theme = GAME_THEMES[game.id] || {
            themeColor: '#E5B55E',
            neonGlow: 'rgba(229, 181, 94, 0.4)',
            borderAccent: 'group-hover:border-[#E5B55E]/80',
          };

          return (
            <Link
              key={game.id}
              href={`/top-up/${game.slug}`}
              style={{
                clipPath:
                  'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              }}
              className={`group relative h-[210px] sm:h-[240px] md:h-[270px] overflow-hidden bg-[#0A101E] border border-white/[0.12] ${theme.borderAccent} transition-all duration-300 flex flex-col justify-end cursor-pointer hover:-translate-y-1 shadow-[0_6px_20px_rgba(0,0,0,0.5)] select-none`}
            >
              {/* Glowing Precision Laser Highlights on 45° Chamfered Corners */}
              <ChamferHighlights size={16} color={game.id === 'mlbb' ? 'cyan' : game.id === 'roblox' ? 'red' : 'gold'} className="opacity-75 group-hover:opacity-100 transition-opacity" />

              {/* Poster Image */}
              <img
                src={game.coverImage}
                alt={game.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
              />

              {/* Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/75 via-50% to-black/30 pointer-events-none" />

              {/* Color Bloom from Bottom */}
              <div
                className="absolute -bottom-6 inset-x-0 h-32 opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300 pointer-events-none"
                style={{ backgroundColor: theme.themeColor }}
              />

              {/* Subtle Tech Grid */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Holographic Shimmer Foil Sweep */}
              <div className="absolute -inset-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
                <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent transform -rotate-45 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </div>

              {/* Decorative Sci-Fi Corner Brackets */}
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#E5B55E]/70 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#E5B55E]/70 pointer-events-none" />

              {/* Bottom Card Content */}
              <div className="relative z-10 p-2.5 sm:p-3.5 space-y-1 sm:space-y-1.5">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[8px] sm:text-[9.5px] font-mono font-extrabold uppercase tracking-wider text-[#E5B55E] truncate">
                    {game.publisher}
                  </span>
                  <span className="text-[7.5px] sm:text-[8.5px] font-mono text-neutral-300 font-bold shrink-0 bg-black/50 px-1.5 py-0.5 rounded border border-white/[0.08]">
                    {game.packages.length} {language === 'km' ? 'កញ្ចប់' : 'Packs'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-[#E5B55E] transition-colors leading-tight line-clamp-1 drop-shadow-md">
                    {game.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5 text-xs">
                    <span className="text-xs">{game.currencyIcon}</span>
                    <span
                      className="font-bold text-[9.5px] sm:text-[10.5px] truncate tracking-wide"
                      style={{ color: theme.themeColor }}
                    >
                      {game.currencyName}
                    </span>
                  </div>
                </div>

                {/* Price & Gold Chamfered TOP UP CTA */}
                <div className="pt-1.5 sm:pt-2 border-t border-white/[0.12] flex items-center justify-between gap-1.5">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[7.5px] sm:text-[8.5px] font-mono uppercase tracking-wider text-neutral-400 font-semibold truncate">
                      {t.catalog.startingFrom}
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-black text-white tracking-tight truncate">
                      {formatPrice(lowestPrice)}
                    </span>
                  </div>

                  <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-gradient-to-r from-[#E5B55E] to-[#F59E0B] group-hover:from-[#FBBF24] group-hover:to-[#D97706] text-black font-black text-[9.5px] sm:text-xs uppercase tracking-wider shadow-[0_0_10px_rgba(229,181,94,0.35)] group-hover:shadow-[0_0_20px_rgba(229,181,94,0.65)] transition-all flex items-center gap-1 shrink-0 transform group-hover:scale-105">
                    <span>{t.catalog.instantBtn}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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
