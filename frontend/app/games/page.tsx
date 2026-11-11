'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GAMES } from '@/data/games';
import { useApp } from '@/context/AppContext';
import { Search, Flame, Zap, ArrowRight, ArrowLeft, Gamepad2 } from 'lucide-react';

export default function GamesCatalogPage() {
  const { language, openTopUp, formatPrice } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', labelKh: 'ទាំងអស់', labelEn: 'All Games' },
    { id: 'moba', labelKh: 'MOBA', labelEn: 'MOBA' },
    { id: 'metaverse', labelKh: 'Sandbox / Metaverse', labelEn: 'Metaverse' },
    { id: 'battle-royale', labelKh: 'Battle Royale', labelEn: 'Battle Royale' },
    { id: 'rpg', labelKh: 'Action RPG', labelEn: 'RPG' },
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
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Home'}</span>
      </Link>

      {/* Header */}
      <div className="space-y-4 mb-10 max-w-2xl">

        <h1 className="text-3xl sm:text-5xl font-black text-white">
          {language === 'km' ? 'កាតាឡុកហ្គេមផ្លូវការ' : 'Official Game Catalog'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300">
          {language === 'km'
            ? 'ជ្រើសរើសហ្គេមដែលអ្នកចូលចិត្តដើម្បីបញ្ចូលពេជ្រ និងកាក់ក្នុងតម្លៃពិសេសបំផុត'
            : 'Select your game to top-up instantly with 0% fee Bakong KHQR.'}
        </p>
      </div>

      {/* Search & Categories Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'km' ? 'ស្វែងរកតាមឈ្មោះហ្គេម...' : 'Search games...'}
            className="w-full bg-[#090E1E] border border-white/[0.12] focus:border-[#E5B55E] rounded-2xl pl-11 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-[#E5B55E] text-black shadow-md'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {language === 'km' ? c.labelKh : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => openTopUp(game.id)}
            style={{
              clipPath:
                'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
            }}
            className="group relative h-[420px] rounded-3xl overflow-hidden bg-[#0A101E] border border-white/[0.12] transition-all duration-300 flex flex-col justify-end cursor-pointer hover:-translate-y-1.5 shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          >
            <img
              src={game.coverImage}
              alt={game.name}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/70 via-45% to-black/30 pointer-events-none" />

            {/* Chamfered Brackets */}
            <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#E5B55E]/70 pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#E5B55E]/70 pointer-events-none" />

            <div className="relative z-10 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E5B55E]">
                  {game.publisher}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {game.packages.length} Packs
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-white group-hover:text-[#E5B55E] transition-colors leading-tight">
                  {game.name}
                </h3>
                <span className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                  <span>💎</span>
                  <span>{game.currencyName}</span>
                </span>
              </div>

              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-neutral-400 block font-mono">START FROM</span>
                  <span className="text-sm font-black text-white font-mono">
                    {formatPrice(game.packages[0]?.priceUSD || 0.95)}
                  </span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E5B55E] to-amber-500 text-black font-black text-xs uppercase tracking-wider group-hover:brightness-110 flex items-center gap-1">
                  <span>{language === 'km' ? 'បញ្ចូលលុយ' : 'Top Up'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
