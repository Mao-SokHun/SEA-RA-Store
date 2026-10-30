'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Zap, Shield, ArrowRight } from 'lucide-react';

interface Slide {
  id: string;
  gameId: string;
  titlePrimary: string;
  titleSecondary: string;
  tagline: string;
  logoText: string;
  logoSub: string;
  bannerImage: string;
  playBtnText: string;
  learnBtnText: string;
}

const SLIDES: Slide[] = [
  {
    id: 'shadowfall',
    gameId: '1',
    titlePrimary: 'SHADOWFALL:',
    titleSecondary: 'LEGACY',
    tagline: 'THE JOURNEY BEGINS NOW!',
    logoText: 'SHADOWFALL',
    logoSub: '— LEGACY —',
    bannerImage:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=85',
    playBtnText: 'PLAY NOW',
    learnBtnText: 'LEARN MORE',
  },
  {
    id: 'roblox-bloxfruits',
    gameId: '7',
    titlePrimary: 'ROBLOX:',
    titleSecondary: 'BLOX FRUITS',
    tagline: 'UNLOCK THE LEGENDARY AWAKENED FRUITS!',
    logoText: 'ROBLOX',
    logoSub: '— BLOX FRUITS —',
    bannerImage:
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1920&q=85',
    playBtnText: 'TOP UP ROBUX',
    learnBtnText: 'VIEW PACKS',
  },
  {
    id: 'mlbb-mythic',
    gameId: '1',
    titlePrimary: 'MOBILE LEGENDS:',
    titleSecondary: 'BANG BANG',
    tagline: 'CLAIM WEEKLY DIAMOND PASS WITH +400% VALUE!',
    logoText: 'MOBILE LEGENDS',
    logoSub: '— BANG BANG —',
    bannerImage:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=85',
    playBtnText: 'GET DIAMONDS',
    learnBtnText: 'CHECK IGN',
  },
];

export default function HeroGameverse({
  onOpenTopUp,
}: {
  onOpenTopUp: (gameId: string) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = SLIDES[currentIdx];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full rounded-2xl overflow-hidden mb-12 shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-white/[0.08] select-none"
    >
      {/* Background Panoramic Game Art (Sample 2 Template Style) */}
      <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[580px] bg-[#070b14] overflow-hidden">
        <img
          src={slide.bannerImage}
          alt={slide.titlePrimary}
          className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.1] transition-transform duration-700 ease-out scale-100 hover:scale-[1.02]"
        />

        {/* Ambient Dark Cyan & Slate Gradients (Sample 2 Style) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a12]/95 via-[#060a12]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-transparent to-[#060a12]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(0,228,242,0.12)_0%,transparent_60%)] pointer-events-none" />

        {/* ------------------------------------------------------------------- */}
        {/* CAROUSEL ARROWS (< on left edge, > on right edge)                   */}
        {/* ------------------------------------------------------------------- */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0b1220]/70 hover:bg-[#121c32] text-neutral-300 hover:text-white border border-white/[0.1] hover:border-[#00e4f2]/60 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-95 shadow-xl"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next slide"
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0b1220]/70 hover:bg-[#121c32] text-neutral-300 hover:text-white border border-white/[0.1] hover:border-[#00e4f2]/60 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-95 shadow-xl"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* ------------------------------------------------------------------- */}
        {/* TOP RIGHT FANTASY METALLIC GAME TITLE (Sample 2 Template Style)      */}
        {/* ------------------------------------------------------------------- */}
        <div className="absolute top-8 sm:top-12 right-8 sm:right-16 hidden md:flex flex-col items-center pointer-events-none z-10 opacity-90 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          <div className="text-3xl lg:text-4xl font-serif font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white via-[#c7d9ee] to-[#7b92ad]">
            {slide.logoText}
          </div>
          <div className="text-[11px] font-mono tracking-[0.4em] text-[#00e4f2] uppercase font-bold mt-1">
            {slide.logoSub}
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* LEFT OVERLAY: HERO HEADLINE & ACTIONS (Sample 2 Template Style)      */}
        {/* ------------------------------------------------------------------- */}
        <div className="absolute inset-y-0 left-0 z-10 flex flex-col justify-center px-8 sm:px-14 lg:px-20 max-w-2xl text-left space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              <span>{slide.titlePrimary}</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f0f6ff] to-[#93b4d7]">
                {slide.titleSecondary}
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-300 pt-2">
              {slide.tagline}
            </p>
          </div>

          {/* Action Buttons: Vibrant Orange Button & Dark Cyan Ghost Button */}
          <div className="flex items-center gap-3.5 pt-3">
            <button
              type="button"
              onClick={() => onOpenTopUp(slide.gameId)}
              className="px-7 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#ff5e00] via-[#ff7700] to-[#ff9100] hover:brightness-110 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(255,102,0,0.45)] cursor-pointer flex items-center gap-2"
            >
              <span>{slide.playBtnText}</span>
            </button>

            <a
              href="#featured-games"
              className="px-6 sm:px-7 py-3.5 rounded-xl bg-[#09101d]/80 hover:bg-[#101b2f] border border-[#00e4f2]/50 hover:border-[#00e4f2] text-[#00e4f2] hover:text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all backdrop-blur-md cursor-pointer flex items-center gap-2"
            >
              <span>{slide.learnBtnText}</span>
            </a>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* BOTTOM PAGINATION DOTS (Sample 2 Template: — • • •)                 */}
        {/* ------------------------------------------------------------------- */}
        <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 cursor-pointer rounded-full ${
                currentIdx === idx
                  ? 'w-7 h-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                  : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
