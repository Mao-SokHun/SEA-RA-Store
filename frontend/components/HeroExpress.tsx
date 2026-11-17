'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Rich widescreen backdrop slides for auto-rotating hero showcase
const HERO_BANNERS = [
  {
    id: 'mlbb',
    slug: 'mobile-legends',
    name: 'Mobile Legends: Bang Bang',
    badge: 'Smile.One Partner API • 5v5 MOBA',
    themeColor: '#3B82F6',
    neonGlow: 'rgba(59, 130, 246, 0.45)',
    bannerUrl: '/banners/mlbb.jpg',
    ghostText: 'MOBILE LEGENDS',
  },
  {
    id: 'roblox',
    slug: 'roblox',
    name: 'Roblox (Robux Direct)',
    badge: 'Roblox Official Partner • 3D Metaverse',
    themeColor: '#EF4444',
    neonGlow: 'rgba(239, 68, 68, 0.45)',
    bannerUrl: '/banners/roblox.jpg',
    ghostText: 'ROBLOX ROBUX',
  },
  {
    id: 'ff',
    slug: 'free-fire',
    name: 'Free Fire & Free Fire MAX',
    badge: 'Garena Official API • Battle Royale',
    themeColor: '#F97316',
    neonGlow: 'rgba(249, 115, 22, 0.45)',
    bannerUrl: '/banners/ff.jpg',
    ghostText: 'FREE FIRE MAX',
  },
  {
    id: 'pubg',
    slug: 'pubg-mobile',
    name: 'PUBG Mobile',
    badge: 'Tencent Games API • Tactical Shooter',
    themeColor: '#EAB308',
    neonGlow: 'rgba(234, 179, 8, 0.45)',
    bannerUrl: '/banners/pubg.jpg',
    ghostText: 'PUBG MOBILE UC',
  },
  {
    id: 'genshin',
    slug: 'genshin-impact',
    name: 'Genshin Impact',
    badge: 'HoYoverse Direct • Open-World RPG',
    themeColor: '#8B5CF6',
    neonGlow: 'rgba(139, 92, 246, 0.45)',
    bannerUrl: '/banners/genshin.png',
    ghostText: 'GENSHIN IMPACT',
  },
  {
    id: 'valorant',
    slug: 'valorant',
    name: 'Valorant',
    badge: 'Riot Games Official • 5v5 Tactical FPS',
    themeColor: '#00D4FF',
    neonGlow: 'rgba(0, 212, 255, 0.45)',
    bannerUrl: '/banners/valorant.png',
    ghostText: 'VALORANT POINTS',
  },
];

export default function HeroExpress() {
  const { language, t } = useApp();

  // Auto-rotating background banner index
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate hero backdrop every 6 seconds unless user pauses/hovers
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeBanner = HERO_BANNERS[activeBannerIdx];

  return (
    <section
      className="relative isolate w-full min-h-[85vh] sm:min-h-[92vh] flex flex-col justify-center items-center select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =============================================================== */}
      {/* 1. DYNAMIC AUTO-ROTATING FULL-BLEED GAME BACKDROP SHOWCASE      */}
      {/* =============================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {HERO_BANNERS.map((banner, idx) => {
          const isActive = idx === activeBannerIdx;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={banner.bannerUrl}
                alt={banner.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Colorful specular ambient bloom matching each game */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full blur-[140px] opacity-40 transition-colors duration-1000 pointer-events-none"
                style={{ backgroundColor: banner.themeColor }}
              />
            </div>
          );
        })}

        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-cyan-400/20 via-blue-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* Pure Transparent Gradient: Top is completely clear so game art shows behind transparent navbar! */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/45 via-60% to-[#070B16] pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Kinetic Ghost Typography Backdrop (Esports DNA) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 whitespace-nowrap overflow-hidden pointer-events-none select-none opacity-[0.04]">
          <span className="text-[140px] sm:text-[220px] font-black uppercase tracking-tight text-white inline-block">
            {activeBanner.ghostText} • TOP-UP • BAKONG KHQR • SPEED &lt; 3S •
          </span>
        </div>
      </div>

      {/* =============================================================== */}
      {/* 2. CENTERED SCI-FI HEADLINE, SUBTITLE & CTAS                    */}
      {/* Matching User's Reference: media_1794438012507_0e07a51c.jpg      */}
      {/* =============================================================== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center justify-center pt-28 sm:pt-36 pb-14">
        {/* Huge Sci-Fi Centered Headline with Authentic Gaming Font Matching Reference Image */}
        <div className="space-y-4 mb-6">
          <h1 className="tracking-tight text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-white drop-shadow-[0_12px_45px_rgba(0,0,0,0.95)] leading-tight select-none">
            THE NEXT <br />
            <span className="text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.45)]">
              GENERATION
            </span>
          </h1>
        </div>

        {/* Centered Description Subtitle */}
        <p className="text-xs sm:text-sm md:text-base font-bold text-neutral-200 max-w-2xl mx-auto mb-8 sm:mb-9 uppercase tracking-wider leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] px-2 sm:px-0">
          {language === 'km'
            ? 'បញ្ចូលពេជ្រ និងកាក់ហ្គេមផ្ទាល់តាមរយៈប្រព័ន្ធ NBC BAKONG KHQR មិនគិតថ្លៃសេវា 0% សុវត្ថិភាព 100% មិនបាច់ប្រើលេខសម្ងាត់'
            : 'YOU CAN RELOAD DIAMONDS, ROBUX, UC & CRYSTALS DIRECTLY WITH 0% FEE BAKONG KHQR. NO PASSWORD REQUIRED.'}
        </p>

        {/* Two Sci-Fi Chamfered Action Buttons Centered Side-by-Side (Matches Reference Image) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-6 mb-10 sm:mb-12 w-full sm:w-auto px-2 sm:px-0">
          {/* Button 1: TOP UP NOW */}
          <Link
            href={`/top-up/${activeBanner.slug || 'mobile-legends'}`}
            style={{
              clipPath:
                'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
            }}
            className="w-full sm:w-auto px-7 sm:px-11 py-3 sm:py-4 bg-gradient-to-r from-[#00D4FF] via-[#0284C7] to-[#2563EB] hover:from-[#38BDF8] hover:to-[#1D4ED8] text-black font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_35px_rgba(0,212,255,0.7)] hover:shadow-[0_0_55px_rgba(0,212,255,0.95)] transition-all flex items-center justify-center gap-2.5 transform hover:scale-105 active:scale-95 cursor-pointer text-center"
          >
            <Zap className="w-4 h-4 fill-black text-black shrink-0" />
            <span className="tracking-widest">
              {language === 'km' ? 'បញ្ចូលលុយឥឡូវនេះ' : 'TOP UP NOW'}
            </span>
          </Link>

          {/* Button 2: EXPLORE MORE */}
          <a
            href="#game-catalog"
            style={{
              clipPath:
                'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
            }}
            className="w-full sm:w-auto px-7 sm:px-11 py-3 sm:py-4 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-cyan-400/50 hover:border-cyan-300 text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)] text-center"
          >
            <span>{language === 'km' ? 'មើលកាតាឡុក' : 'EXPLORE MORE'}</span>
          </a>
        </div>

        {/* =============================================================== */}
        {/* 3. CENTERED CAROUSEL SLIDER CONTROLS & ACTIVE GAME TICKER       */}
        {/* =============================================================== */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/[0.12] w-full max-w-md mx-auto">
          <button
            type="button"
            onClick={() =>
              setActiveBannerIdx(
                (prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length
              )
            }
            className="w-8 h-8 rounded-lg bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {HERO_BANNERS.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => setActiveBannerIdx(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === activeBannerIdx
                    ? 'w-7 bg-gradient-to-r from-[#00D4FF] to-[#E5B55E]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveBannerIdx((prev) => (prev + 1) % HERO_BANNERS.length)
            }
            className="w-8 h-8 rounded-lg bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-bold text-neutral-300 ml-2 truncate max-w-[150px]">
            {activeBanner.name}
          </span>
        </div>

      </div>
    </section>
  );
}
