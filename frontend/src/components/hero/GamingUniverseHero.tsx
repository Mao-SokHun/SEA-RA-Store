'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  Gamepad2,
  QrCode,
  Flame,
  Star,
  Receipt,
  Send,
  Sparkles,
} from 'lucide-react';

interface SlideData {
  id: string;
  tag: string;
  tagColor: string;
  headlinePrefix: string;
  headlineHighlight: string;
  headlineSuffix: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  badgeAccent: string;
  bgGradient: string;
  glowColor: string;
  characters: {
    leftImg: string;
    centerImg: string;
    rightImg: string;
    leftTitle: string;
    centerTitle: string;
    rightTitle: string;
  };
}

const HERO_SLIDES: SlideData[] = [
  {
    id: 'universe',
    tag: '⚡ 100% AUTOMATED • INSTANT 3 SECONDS',
    tagColor: 'from-[#00e4f2]/20 to-[#f2ca50]/20 text-[#f2ca50] border-[#f2ca50]/40',
    headlinePrefix: 'THE ULTIMATE',
    headlineHighlight: 'GAMING TOP-UP',
    headlineSuffix: 'UNIVERSE',
    subtitle:
      'វេទិកាបញ្ចូលលុយហ្គេមស្វ័យប្រវត្តិតាម Bakong KHQR លឿនត្រឹម ៣ វិនាទី មិនបាច់ Login មិនប៉ះពាល់ Password សុវត្ថិភាព ១០០% គ្រប់ធនាគារក្នុងប្រទេសកម្ពុជា។',
    ctaText: 'ជ្រើសរើសហ្គេមបញ្ចូលលុយ',
    ctaLink: '#hot-games',
    badgeAccent: '#f2ca50',
    bgGradient: 'from-[#080d16] via-[#090e18] to-[#07090e]',
    glowColor: 'rgba(242,202,80,0.18)',
    characters: {
      leftImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=700&q=80',
      centerImg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=700&q=80',
      rightImg: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=700&q=80',
      leftTitle: 'MLBB / MOBA',
      centerTitle: 'VALORANT / FPS',
      rightTitle: 'PUBG / COMBAT',
    },
  },
  {
    id: 'roblox',
    tag: '⚡ FASTEST ROBUX IN CAMBODIA • NO PASSWORD',
    tagColor: 'from-[#00e4f2]/20 to-[#0088cc]/20 text-[#00e4f2] border-[#00e4f2]/40',
    headlinePrefix: 'ROBLOX ROBUX &',
    headlineHighlight: 'BLOX FRUITS',
    headlineSuffix: 'DIRECT RELOAD',
    subtitle:
      'បញ្ចូល Robux ផ្ទាល់ចូលគណនី @Username មិនបាច់ Password ទទួល Robux ភ្លាមៗក្នុង ៣ វិនាទី តាមរយៈ Bakong KHQR សុវត្ថិភាពខ្ពស់បំផុត។',
    ctaText: 'បញ្ចូល ROBUX ឥឡូវនេះ',
    ctaLink: '/top-up?game=7',
    badgeAccent: '#00e4f2',
    bgGradient: 'from-[#07131d] via-[#091522] to-[#07090e]',
    glowColor: 'rgba(0,228,242,0.18)',
    characters: {
      leftImg: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=700&q=80',
      centerImg: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=700&q=80',
      rightImg: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=700&q=80',
      leftTitle: 'ROBLOX 80-4500 R$',
      centerTitle: 'FREE FIRE DIAMONDS',
      rightTitle: 'GENSHIN CRYSTALS',
    },
  },
  {
    id: 'mlbb',
    tag: '🔥 MOONTON OFFICIAL DIRECT API • 400% VALUE',
    tagColor: 'from-amber-500/20 to-orange-500/20 text-[#ffe088] border-amber-400/40',
    headlinePrefix: 'MOBILE LEGENDS',
    headlineHighlight: 'WEEKLY PASS &',
    headlineSuffix: 'DIAMONDS',
    subtitle:
      'ទិញ Weekly Diamond Pass ចំណេញ 400% ឬកញ្ចប់ពេជ្រពេញនិយម 706 Diamonds ចូលក្នុង Player ID ភ្លាមៗ មិនបាច់រង់ចាំយូរ ធានាដោយ Moonton Direct API។',
    ctaText: 'បញ្ចូលពេជ្រ MLBB ឥឡូវនេះ',
    ctaLink: '/top-up?game=1',
    badgeAccent: '#ffe088',
    bgGradient: 'from-[#140f09] via-[#100d08] to-[#07090e]',
    glowColor: 'rgba(255,159,28,0.18)',
    characters: {
      leftImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=700&q=80',
      centerImg: 'https://images.unsplash.com/photo-1612287233207-6b22998a445b?auto=format&fit=crop&w=700&q=80',
      rightImg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=700&q=80',
      leftTitle: 'WEEKLY PASS $1.85',
      centerTitle: 'HONOR OF KINGS',
      rightTitle: 'WILD RIFT CORES',
    },
  },
];

export default function GamingUniverseHero({
  onSelectGame,
}: {
  onSelectGame?: (gameId: string) => void;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto rotate carousel every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] mb-10 transition-all select-none"
    >
      {/* Dynamic Ambient Background Laser Grid & Radial Glow */}
      <div
        className="absolute inset-0 bg-gradient-to-r opacity-90 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${slide.glowColor} 0%, transparent 70%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17]/80 via-[#07090e]/95 to-[#07090e] pointer-events-none" />

      {/* High-Tech Laser Beam Accent along top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00e4f2] via-[#f2ca50] to-transparent" />

      {/* ------------------------------------------------------------------------- */}
      {/* HERO CONTAINER (Sample 1 & Sample 2 Composition)                          */}
      {/* ------------------------------------------------------------------------- */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-14 pt-10 sm:pt-14 pb-8 min-h-[460px] sm:min-h-[500px] flex flex-col justify-between">
        {/* Top Header Tag & Carousel Arrows */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-md bg-gradient-to-r ${slide.tagColor} shadow-md`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{slide.tag}</span>
          </div>

          {/* Carousel Arrows (Sample 1 & 2 Style `< >`) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous slide"
              className="w-9 h-9 rounded-xl bg-[#111723]/80 hover:bg-[#1a2336] border border-white/[0.1] hover:border-[#f2ca50] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next slide"
              className="w-9 h-9 rounded-xl bg-[#111723]/80 hover:bg-[#1a2336] border border-white/[0.1] hover:border-[#f2ca50] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main 2-Column Split: Text on Left, 3-Character Panel on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
          {/* Left 7 Columns: Epic Cinematic Typography */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#00e4f2] block">
                SEA RA // OFFICIAL GAMING AGGREGATOR
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08] drop-shadow-md">
                {slide.headlinePrefix}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#ff9f1c]">
                  {slide.headlineHighlight}
                </span>{' '}
                {slide.headlineSuffix}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium max-w-xl">
              {slide.subtitle}
            </p>

            {/* Action Buttons (Sample 1 & 2 Style) */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <a
                href={slide.ctaLink}
                onClick={(e) => {
                  if (slide.ctaLink.includes('game=')) {
                    const gameId = slide.ctaLink.split('game=')[1];
                    if (onSelectGame && gameId) {
                      e.preventDefault();
                      onSelectGame(gameId);
                    }
                  }
                }}
                className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#ff9f1c] hover:brightness-110 active:scale-95 text-[#07090e] font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_30px_rgba(242,202,80,0.45)] transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-black text-black" />
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/orders"
                className="px-5 sm:px-6 py-3.5 rounded-2xl bg-[#111724]/90 hover:bg-[#182133] border border-white/[0.12] hover:border-[#00e4f2]/50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
              >
                <Receipt className="w-4 h-4 text-[#00e4f2]" />
                <span>តាមដានការកុម្ម៉ង់ (TRACK ORDERS)</span>
              </Link>

              <Link
                href="https://t.me/seara_support_kh"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-[#0088cc]/15 hover:bg-[#0088cc]/25 text-[#00e4f2] hover:text-white border border-[#0088cc]/30 text-xs font-bold transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
                <span>Telegram 24/7</span>
              </Link>
            </div>
          </div>

          {/* Right 5 Columns: 3-Character Composite Showcase (Sample 1 Style) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/[0.1] bg-[#0c1018] shadow-2xl p-1.5 group">
              {/* 3 Split Panels Side-by-Side (Yellow Accent, Cyan Warrior, Dark Knight) */}
              <div className="w-full h-full grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
                {/* Left Panel */}
                <div className="relative h-full overflow-hidden group/p1">
                  <img
                    src={slide.characters.leftImg}
                    alt={slide.characters.leftTitle}
                    className="w-full h-full object-cover group-hover/p1:scale-110 transition-transform duration-500 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <span className="absolute bottom-2 inset-x-1 text-center text-[9px] font-black uppercase tracking-wider text-amber-300 truncate px-1">
                    {slide.characters.leftTitle}
                  </span>
                </div>

                {/* Center Panel (Highlighted with Neon Border) */}
                <div className="relative h-full overflow-hidden border-x border-[#00e4f2]/40 group/p2">
                  <img
                    src={slide.characters.centerImg}
                    alt={slide.characters.centerTitle}
                    className="w-full h-full object-cover group-hover/p2:scale-110 transition-transform duration-500 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00e4f2]/30 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-[#00e4f2] text-black">
                    HOT
                  </span>
                  <span className="absolute bottom-2 inset-x-1 text-center text-[9px] font-black uppercase tracking-wider text-[#00e4f2] truncate px-1">
                    {slide.characters.centerTitle}
                  </span>
                </div>

                {/* Right Panel */}
                <div className="relative h-full overflow-hidden group/p3">
                  <img
                    src={slide.characters.rightImg}
                    alt={slide.characters.rightTitle}
                    className="w-full h-full object-cover group-hover/p3:scale-110 transition-transform duration-500 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <span className="absolute bottom-2 inset-x-1 text-center text-[9px] font-black uppercase tracking-wider text-neutral-300 truncate px-1">
                    {slide.characters.rightTitle}
                  </span>
                </div>
              </div>

              {/* Laser Frame Corner Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#f2ca50] rounded-tl pointer-events-none" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00e4f2] rounded-tr pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00e4f2] rounded-bl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#f2ca50] rounded-br pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bottom Carousel Indicator Dots & Quick Trust Signals */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 4 Official Trust Signals (Sample 1 & 2 Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-xs text-neutral-300 font-bold w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>3 វិនាទីស្វ័យប្រវត្តិ (3s)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00e4f2] shrink-0" />
              <span>គ្មាន Password សុវត្ថិភាព</span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-3.5 h-3.5 text-[#f2ca50] shrink-0" />
              <span>Bakong KHQR 60+ ធនាគារ</span>
            </div>
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>10+ Official Game API</span>
            </div>
          </div>

          {/* Dots Pagination */}
          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? 'w-7 h-2 bg-gradient-to-r from-[#ffe088] to-[#f2ca50] shadow-[0_0_10px_#f2ca50]'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
