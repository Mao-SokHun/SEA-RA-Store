'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, Zap } from 'lucide-react';
import { ALL_GAMES } from '@/data/gamesData';
import { useTopUp } from '@/context/TopUpContext';
import { GameCategory } from '@/types';

// The 4 iconic games from the master mockup
const defaultFeatured = [
  {
    id: 'cyberbound-2077',
    name: 'Cyberbound 2077',
    embossedTitle: 'CYBERBOUND 2077',
    titleColor: '#00FFE0',
    genre: 'Action • Sci-Fi',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=750&fit=crop&q=85',
    slug: 'mobile-legends',
    currencyName: 'Diamonds',
  },
  {
    id: 'mythic-heroes',
    name: 'Mythic Heroes',
    embossedTitle: 'MYTHIC HEROES',
    titleColor: '#FFD700',
    genre: 'RPG • Adventure',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=750&fit=crop&q=85',
    slug: 'free-fire',
    currencyName: 'Diamonds',
  },
  {
    id: 'star-drifters',
    name: 'Star Drifters',
    embossedTitle: 'STAR DRIFTERS',
    titleColor: '#FFFFFF',
    genre: 'Space • Shooter',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=750&fit=crop&q=85',
    slug: 'pubg-mobile',
    currencyName: 'UC',
  },
  {
    id: 'aegis-ascendant',
    name: 'Aegis Ascendant',
    embossedTitle: 'AEGIS ASCENDANT',
    titleColor: '#FFFFFF',
    genre: 'Action • RPG',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&h=750&fit=crop&q=85',
    slug: 'genshin-impact',
    currencyName: 'Crystals',
  },
];

const categoryTabs: { id: GameCategory; label: string; count: number }[] = [
  { id: 'all', label: 'All Games', count: 18 },
  { id: 'mobile', label: 'Mobile Games', count: 6 },
  { id: 'pc', label: 'PC / Console', count: 4 },
  { id: 'gift-card', label: 'Gift Cards', count: 4 },
  { id: 'direct', label: 'Direct Top-Up', count: 4 },
];

export default function FeaturedGames() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const { formatPrice } = useTopUp();

  // If "all", show the 4 featured games from the mockup, otherwise filter from ALL_GAMES
  const displayGames =
    selectedCategory === 'all'
      ? defaultFeatured
      : ALL_GAMES.filter((g) => g.category === selectedCategory).slice(0, 4).map((g) => ({
          id: g.id,
          name: g.name,
          embossedTitle: g.name.toUpperCase(),
          titleColor: '#00F2FE',
          genre: g.genre,
          rating: g.rating,
          img: g.poster,
          slug: g.slug,
          currencyName: g.currencyName,
        }));

  return (
    <section id="games" className="py-6 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 select-none">
      
      {/* ── Category Filter Tabs (Glowing Pills) ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-4">
        {categoryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-xl font-heading text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === tab.id
                ? 'bg-gradient-to-r from-[#00F2FE] to-[#3B82F6] text-black shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                : 'bg-[#0D142E] text-[#7F92B0] hover:text-white border border-[#152248] hover:border-[#00F2FE]/40'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] ${
                selectedCategory === tab.id ? 'bg-black/20 text-black' : 'bg-black/40 text-[#5A6E8D]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Section Header (FEATURED GAMES in Mockup) ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-wider uppercase">
          FEATURED GAMES
        </h2>

        {/* Carousel arrows */}
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Previous"
            className="w-7 h-7 rounded-md bg-[#0A1026] border border-[#16244C] hover:border-[#00A3FF] text-[#7F92B0] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            aria-label="Next"
            className="w-7 h-7 rounded-md bg-[#0A1026] border border-[#16244C] hover:border-[#00A3FF] text-[#7F92B0] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 4 Vertical Cards Grid Matching Mockup 100% ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {displayGames.map((game) => (
          <div
            key={game.id}
            className="group flex flex-col rounded-xl overflow-hidden bg-[#0A1026] border border-[#152248] hover:border-[#00A3FF]/70 hover:shadow-[0_8px_30px_rgba(0,163,255,0.25)] transition-all duration-300 hover:-translate-y-1"
          >
            {/* Card Cover Image with Embossed Game Title in artwork */}
            <div className="relative overflow-hidden w-full h-44 sm:h-52 bg-[#050C1E] flex flex-col justify-end p-3">
              <img
                src={game.img}
                alt={game.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                style={{ filter: 'brightness(0.85) contrast(1.1)' }}
              />

              {/* Bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026] via-transparent to-transparent opacity-90" />

              {/* Instant Delivery Floating Pill */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 border border-[#00F2FE]/40 text-[9px] font-heading font-black uppercase text-[#00F2FE] flex items-center gap-1 backdrop-blur-md">
                <Zap size={10} className="fill-current" />
                <span>INSTANT</span>
              </div>

              {/* Embossed Stylized Game Title in bottom of artwork (matching mockup) */}
              <div className="relative z-10 text-center w-full">
                <span
                  className="font-heading font-black text-xs sm:text-sm tracking-widest uppercase block drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] truncate"
                  style={{ color: game.titleColor }}
                >
                  {game.embossedTitle}
                </span>
              </div>
            </div>

            {/* Card Bottom: Info & Glowing PLAY / TOP UP Pill Button */}
            <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 gap-2.5">
              <div>
                <h3 className="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-[#00F2FE] transition-colors truncate">
                  {game.name}
                </h3>

                <div className="flex items-center justify-between text-[11px] text-[#7F92B0] mt-0.5">
                  <span className="truncate">{game.genre}</span>
                  {/* Rating Stars ★★★★☆ 4.5 */}
                  <div className="flex items-center gap-1 text-amber-400 font-bold shrink-0">
                    <Star size={11} className="fill-current text-amber-400" />
                    <span className="text-[10px] text-white font-heading">{game.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Glowing High-Tech Pill Button (Matches cyan PLAY button in mockup) */}
              <Link
                href={`/top-up/${game.slug}`}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-[#00A3FF] to-[#0055FF] hover:from-[#00C0FF] hover:to-[#0070FF] text-white font-heading font-black text-xs uppercase tracking-wider text-center transition-all shadow-[0_0_15px_rgba(0,163,255,0.4)] hover:shadow-[0_0_22px_rgba(0,163,255,0.65)] active:scale-[0.98] cursor-pointer"
              >
                TOP UP
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
