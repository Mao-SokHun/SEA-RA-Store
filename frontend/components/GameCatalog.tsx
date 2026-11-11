'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { GAMES } from '@/data/games';
import { GameItem } from '@/types';
import {
  Flame,
  Zap,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Wifi,
} from 'lucide-react';

// Game-specific theme accents for dynamic Cyberpunk HUD glow
const GAME_THEMES: Record<
  string,
  {
    themeColor: string;
    neonGlow: string;
    borderAccent: string;
    badgeBg: string;
    serial: string;
    ping: string;
  }
> = {
  mlbb: {
    themeColor: '#3B82F6',
    neonGlow: 'rgba(59, 130, 246, 0.45)',
    borderAccent: 'group-hover:border-[#3B82F6]/80',
    badgeBg: 'bg-[#3B82F6]/20 text-[#60A5FA] border-[#3B82F6]/40',
    serial: 'SMILE.ONE // 01-MLBB',
    ping: '2ms',
  },
  roblox: {
    themeColor: '#EF4444',
    neonGlow: 'rgba(239, 68, 68, 0.45)',
    borderAccent: 'group-hover:border-[#EF4444]/80',
    badgeBg: 'bg-[#EF4444]/20 text-[#F87171] border-[#EF4444]/40',
    serial: 'ROBLOX-CORP // 02-RBX',
    ping: '3ms',
  },
  ff: {
    themeColor: '#F97316',
    neonGlow: 'rgba(249, 115, 22, 0.45)',
    borderAccent: 'group-hover:border-[#F97316]/80',
    badgeBg: 'bg-[#F97316]/20 text-[#FB923C] border-[#F97316]/40',
    serial: 'GARENA-API // 03-FF',
    ping: '2ms',
  },
  pubg: {
    themeColor: '#EAB308',
    neonGlow: 'rgba(234, 179, 8, 0.45)',
    borderAccent: 'group-hover:border-[#EAB308]/80',
    badgeBg: 'bg-[#EAB308]/20 text-[#FACC15] border-[#EAB308]/40',
    serial: 'TENCENT-PUBG // 04-UC',
    ping: '3ms',
  },
  genshin: {
    themeColor: '#A855F7',
    neonGlow: 'rgba(168, 85, 247, 0.45)',
    borderAccent: 'group-hover:border-[#A855F7]/80',
    badgeBg: 'bg-[#A855F7]/20 text-[#C084FC] border-[#A855F7]/40',
    serial: 'HOYOVERSE // 05-GI',
    ping: '4ms',
  },
  valorant: {
    themeColor: '#00D4FF',
    neonGlow: 'rgba(0, 212, 255, 0.45)',
    borderAccent: 'group-hover:border-[#00D4FF]/80',
    badgeBg: 'bg-[#00D4FF]/20 text-[#38BDF8] border-[#00D4FF]/40',
    serial: 'RIOT-DIRECT // 06-VAL',
    ping: '2ms',
  },
  hok: {
    themeColor: '#F59E0B',
    neonGlow: 'rgba(245, 158, 11, 0.45)',
    borderAccent: 'group-hover:border-[#F59E0B]/80',
    badgeBg: 'bg-[#F59E0B]/20 text-[#FBBF24] border-[#F59E0B]/40',
    serial: 'INFINITE // 07-HOK',
    ping: '3ms',
  },
  codm: {
    themeColor: '#10B981',
    neonGlow: 'rgba(16, 185, 129, 0.45)',
    borderAccent: 'group-hover:border-[#10B981]/80',
    badgeBg: 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40',
    serial: 'ACTIVISION // 08-CODM',
    ping: '3ms',
  },
};

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
              <div className="w-1.5 h-5 bg-[#E5B55E] rounded-full shadow-[0_0_12px_rgba(229,181,94,0.6)]" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
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
              {language === 'km'
                ? 'រកមិនឃើញហ្គេមត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ'
                : 'No games match your search query.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredGames.map((game) => {
              const lowestPrice = Math.min(...game.packages.map((p) => p.priceUSD));
              const theme =
                GAME_THEMES[game.id] || {
                  themeColor: '#E5B55E',
                  neonGlow: 'rgba(229, 181, 94, 0.4)',
                  borderAccent: 'group-hover:border-[#E5B55E]/80',
                  badgeBg: 'bg-[#E5B55E]/20 text-[#E5B55E] border-[#E5B55E]/40',
                  serial: 'GAME-DIRECT // API',
                  ping: '3ms',
                };

              return (
                <div
                  key={game.id}
                  onClick={() => openTopUp(game.id)}
                  style={
                    {
                      '--card-glow': theme.neonGlow,
                      clipPath:
                        'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                    } as React.CSSProperties
                  }
                  className={`group relative h-[420px] sm:h-[450px] overflow-hidden bg-[#0A101E] border border-white/[0.12] ${theme.borderAccent} transition-all duration-500 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_-10px_var(--card-glow)]`}
                >
                  {/* ========================================================= */}
                  {/* 1. FULL-BLEED POSTER BACKGROUND WITH 3D DEPTH ZOOM       */}
                  {/* ========================================================= */}
                  <img
                    src={game.coverImage}
                    alt={game.name}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Dark Vignette Overlay: Crystal-clear readability at bottom, vivid art at top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/70 via-45% to-black/30 pointer-events-none" />

                  {/* Dynamic Color Bloom from Bottom matching Game Theme */}
                  <div
                    className="absolute -bottom-8 inset-x-0 h-44 opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: theme.themeColor }}
                  />

                  {/* Cyberpunk Tech Scanline / Subtle Grid Overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  {/* ========================================================= */}
                  {/* 2. HOLOGRAPHIC SHIMMER FOIL SWEEP                        */}
                  {/* ========================================================= */}
                  <div className="absolute -inset-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
                    <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.18] to-transparent transform -rotate-45 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  </div>

                  {/* ========================================================= */}
                  {/* 3. TOP SCI-FI HUD BAR (PING, LIVE RELOADS & SERIAL)       */}
                  {/* ========================================================= */}
                  <div className="relative z-10 p-3 flex items-start justify-between gap-2">
                    {/* Signal Ping & Instant API Status */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/85 border border-emerald-500/40 backdrop-blur-md shadow-md">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <Zap className="w-2.5 h-2.5 text-emerald-400 fill-current" />
                      <span className="text-[9px] font-mono font-black text-emerald-400 tracking-wider">
                        &lt; 3S API
                      </span>
                    </div>

                    {/* Today Reloads Count in Monospace */}
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-black/80 border border-white/15 backdrop-blur-md text-[9px] font-mono text-neutral-300 shadow-sm">
                      <Flame className="w-3 h-3 text-[#E5B55E]" />
                      <span className="font-bold">
                        {game.ordersToday.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Cyber Serial Watermark (HUD Aesthetic) */}
                  <div className="absolute top-12 left-3 z-10 font-mono text-[8px] tracking-widest text-white/35 uppercase pointer-events-none">
                    {theme.serial}
                  </div>

                  {/* Decorative Sci-Fi HUD Corner Brackets */}
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#E5B55E]/50 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#E5B55E]/50 pointer-events-none" />

                  {/* ========================================================= */}
                  {/* 4. BOTTOM FLOATING HUD: GAME INFO & ESPORTS ACTION BAR    */}
                  {/* ========================================================= */}
                  <div className="relative z-10 p-3.5 sm:p-4 space-y-2.5">
                    {/* Publisher / API Provider */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#E5B55E] truncate">
                        {game.publisher}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-400 font-bold shrink-0">
                        {game.packages.length} Packs
                      </span>
                    </div>

                    {/* Game Title */}
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#E5B55E] transition-colors leading-tight line-clamp-1 drop-shadow-md">
                        {game.name}
                      </h3>
                      {/* Currency Badge */}
                      <div className="flex items-center gap-1.5 mt-1 text-xs">
                        <span className="text-sm">{game.currencyIcon}</span>
                        <span
                          className="font-bold text-[11px] truncate tracking-wide"
                          style={{ color: theme.themeColor }}
                        >
                          {game.currencyName}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Pricing & Full-width Esports Action Bar */}
                    <div className="pt-2.5 border-t border-white/[0.12] flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                          {t.catalog.startingFrom}
                        </span>
                        <span className="text-base sm:text-lg font-mono font-black text-white tracking-tight">
                          {formatPrice(lowestPrice)}
                        </span>
                      </div>

                      {/* Angled High-Energy Esports Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openTopUp(game.id);
                        }}
                        className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#E5B55E] to-[#F59E0B] hover:from-[#FBBF24] hover:to-[#D97706] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(229,181,94,0.35)] group-hover:shadow-[0_0_25px_rgba(229,181,94,0.65)] transition-all cursor-pointer flex items-center gap-1.5 shrink-0 transform group-hover:scale-105"
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
