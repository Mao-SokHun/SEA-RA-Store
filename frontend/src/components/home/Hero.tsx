'use client';

import React, { useState, useEffect } from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { TRANSLATIONS } from '@/i18n/translations';
import { ChevronLeft, ChevronRight, Zap, Shield, ArrowRight } from 'lucide-react';

interface Slide {
  id: string;
  gameId: string;
  titlePrimary: string;
  titleSecondary: string;
  tagline: string;
  taglineKh: string;
  logoText: string;
  logoSub: string;
  bannerImage: string;
}

const SLIDES: Slide[] = [
  {
    id: 'shadowfall',
    gameId: '1',
    titlePrimary: 'SHADOWFALL:',
    titleSecondary: 'LEGACY',
    tagline: 'THE JOURNEY BEGINS NOW! INSTANT 3-SECOND DIRECT RELOAD',
    taglineKh: 'ដំណើរផ្សងព្រេងចាប់ផ្តើមឥឡូវនេះ! បញ្ចូលលុយស្វ័យប្រវត្តិតាម DIRECT API ត្រឹម 3 វិនាទី',
    logoText: 'SHADOWFALL',
    logoSub: '— LEGACY —',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'roblox',
    gameId: '4',
    titlePrimary: 'ROBLOX:',
    titleSecondary: 'BLOX FRUITS',
    tagline: 'UNLOCK THE LEGENDARY AWAKENED FRUITS & ROBUX PACKS',
    taglineKh: 'ដោះសោផ្លែឈើទេព និងកញ្ចប់ ROBUX ស្វ័យប្រវត្តិតាមឈ្មោះ ROBLOX USERNAME',
    logoText: 'ROBLOX',
    logoSub: '— BLOX FRUITS —',
    bannerImage: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'mlbb',
    gameId: '1',
    titlePrimary: 'MOBILE LEGENDS:',
    titleSecondary: 'MYTHIC GLORY',
    tagline: 'GET WEEKLY PASS & BONUS DIAMONDS VIA OFFICIAL BAKONG KHQR',
    taglineKh: 'បញ្ចូលកាត WEEKLY PASS & ពេជ្រ MLBB បញ្ចូលភ្លាមៗ ០% ថ្លៃសេវា',
    logoText: 'MOBILE LEGENDS',
    logoSub: '— BANG BANG —',
    bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=85',
  },
];

export default function Hero() {
  const { language, openTopUp } = useOrderStore();
  const t = TRANSLATIONS[language].hero;

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
      className="relative w-full rounded-3xl overflow-hidden border border-[#2B6CFF]/35 bg-[#0B1224] shadow-2xl mb-12 select-none"
    >
      {/* Background Banner Image with Cinematic Overlay */}
      <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full overflow-hidden">
        <img
          src={slide.bannerImage}
          alt={slide.titlePrimary}
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out"
        />

        {/* Cinematic Multi-Layer Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B17] via-[#070B17]/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B17] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-[#070B17]/25 z-10" />

        {/* Ambient Glow Aura */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#22D3EE]/15 rounded-full blur-3xl pointer-events-none z-10" />

        {/* ================================================================= */}
        {/* BANNER CONTENT (Match Reference Screenshot Exactly)               */}
        {/* ================================================================= */}
        <div className="absolute inset-0 z-20 flex items-center justify-between px-6 sm:px-12 lg:px-16">
          {/* Left Column: Title, Tagline, Action Buttons, Dots */}
          <div className="max-w-xl space-y-5">
            {/* Publisher Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1A35]/85 border border-[#2B6CFF]/50 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-[#22D3EE] fill-[#22D3EE]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#22D3EE]">
                OFFICIAL AUTHORIZED DIRECT TOP-UP
              </span>
            </div>

            {/* Huge Cinematic Game Title */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none drop-shadow-md">
                {slide.titlePrimary}
              </h1>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#3B82F6] to-white leading-none">
                {slide.titleSecondary}
              </h2>
            </div>

            {/* Tagline */}
            <p className="text-xs sm:text-sm font-bold tracking-wider text-neutral-300 drop-shadow">
              {language === 'km' ? slide.taglineKh : slide.tagline}
            </p>

            {/* Action Buttons: [TOP UP NOW] (Orange) & [VIEW PACKAGES] (Cyan outline) */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => openTopUp(slide.gameId)}
                className="group relative px-7 py-3 rounded-xl bg-gradient-to-r from-[#FF7A18] via-[#FF8A00] to-[#FFA000] hover:from-[#FF8A00] hover:to-[#FFB000] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_24px_rgba(255,122,24,0.5)] hover:shadow-[0_0_32px_rgba(255,122,24,0.7)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{t.topUpNow}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => openTopUp(slide.gameId)}
                className="px-6 py-3 rounded-xl bg-[#0F1A35]/80 hover:bg-[#152347] border border-[#22D3EE]/60 hover:border-[#22D3EE] text-[#22D3EE] hover:text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer backdrop-blur-md"
              >
                {t.viewPackages}
              </button>
            </div>

            {/* Carousel Dots Indicator */}
            <div className="flex items-center gap-2 pt-4">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIdx === idx
                      ? 'w-8 bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]'
                      : 'w-2 bg-white/20 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Hero Metallic Crest & Title (As seen in Reference Screenshot) */}
          <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-2 shrink-0">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#22D3EE]/20 via-[#3B82F6]/20 to-transparent border border-[#2B6CFF]/40 backdrop-blur-xl flex items-center justify-center p-4 shadow-2xl">
              <svg className="w-16 h-16 text-[#22D3EE]" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L4 6V12C4 17.5 7.4 20.8 12 22C16.6 20.8 20 17.5 20 12V6L12 2Z"
                  stroke="#22D3EE"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M12 7V17M7 12H17" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-xl font-black uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-400 drop-shadow">
              {slide.logoText}
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#22D3EE]">
              {slide.logoSub}
            </div>
          </div>
        </div>

        {/* Carousel Left Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-xl bg-[#070B17]/70 hover:bg-[#0F1A35] border border-white/10 hover:border-[#22D3EE]/60 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Right Arrow */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next slide"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-xl bg-[#070B17]/70 hover:bg-[#0F1A35] border border-white/10 hover:border-[#22D3EE]/60 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

