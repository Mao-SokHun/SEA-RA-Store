'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    titleMain: 'SHADOWFALL:',
    titleSub: 'LEGACY',
    tagline: 'THE JOURNEY BEGINS NOW!',
    primaryBtn: 'PLAY NOW',
    secondaryBtn: 'LEARN MORE',
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=85&fit=crop',
    targetLink: '/top-up/mobile-legends',
  },
  {
    id: 2,
    titleMain: 'CYBERBOUND:',
    titleSub: '2077',
    tagline: 'DIRECT INSTANT RECHARGES!',
    primaryBtn: 'PLAY NOW',
    secondaryBtn: 'LEARN MORE',
    bgImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=85&fit=crop',
    targetLink: '/top-up/free-fire',
  },
  {
    id: 3,
    titleMain: 'MYTHIC HEROES:',
    titleSub: 'AWAKENING',
    tagline: '2X DIAMOND BONUS EVENT ACTIVE!',
    primaryBtn: 'PLAY NOW',
    secondaryBtn: 'LEARN MORE',
    bgImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=85&fit=crop',
    targetLink: '/top-up/genshin-impact',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);
  const next = () => setCurrent((c) => (c + 1) % heroSlides.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 select-none">
      {/* Widescreen Hero Bounded Box matching Mockup 100% */}
      <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden border border-[#152248] shadow-2xl bg-[#050C1E]">
        
        {/* Carousel Background Images */}
        {heroSlides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Cinematic Background Artwork */}
            <img
              src={s.bgImage}
              alt={s.titleMain}
              className="w-full h-full object-cover object-center"
              style={{ filter: 'brightness(0.72) contrast(1.15)' }}
            />

            {/* Dark Left Vignette Fade for crystal clear text readability */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(3,7,18,0.92) 0%, rgba(3,7,18,0.75) 45%, rgba(3,7,18,0.25) 75%, transparent 100%)',
              }}
            />
          </div>
        ))}

        {/* Inner Hero Content (Exact coordinates & sizing from mockup) */}
        <div className="relative z-10 w-full h-full flex items-center justify-between px-6 sm:px-12 lg:px-16">
          
          {/* Left Text & CTA Buttons */}
          <div className="max-w-xl space-y-3 sm:space-y-4">
            
            {/* Title: SHADOWFALL: LEGACY */}
            <div>
              <h1 className="font-heading font-black text-white text-3xl sm:text-4xl lg:text-[44px] leading-[1.05] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                {slide.titleMain}
                <span className="block text-white">
                  {slide.titleSub}
                </span>
              </h1>
            </div>

            {/* Tagline */}
            <p className="font-heading font-bold text-xs sm:text-sm tracking-widest text-[#94A3B8] uppercase">
              {slide.tagline}
            </p>

            {/* Two Side-by-Side Action Buttons matching Mockup */}
            <div className="flex items-center gap-3.5 pt-2">
              {/* Vibrant Orange Solid Button */}
              <Link
                href={slide.targetLink}
                className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-lg bg-[#FF5500] hover:bg-[#E64C00] text-white font-heading font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(255,85,0,0.5)] hover:shadow-[0_6px_25px_rgba(255,85,0,0.7)] hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <span>{slide.primaryBtn}</span>
                <ArrowRight size={14} className="stroke-[2.5]" />
              </Link>

              {/* Cyan Outline Button */}
              <Link
                href="#games"
                className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-lg bg-[#00F2FE]/10 hover:bg-[#00F2FE]/20 text-[#00F2FE] hover:text-white border border-[#00F2FE]/70 hover:border-[#00F2FE] font-heading font-bold text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer backdrop-blur-sm"
              >
                {slide.secondaryBtn}
              </Link>
            </div>
          </div>

          {/* Top-Right: Embossed Game Title Watermark in Sky (matching mockup) */}
          <div className="hidden lg:flex flex-col items-end justify-start self-start pt-8 pr-4 pointer-events-none select-none opacity-85">
            <h2 className="font-heading font-black text-2xl xl:text-3xl tracking-widest text-white/90 drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] uppercase">
              {slide.titleMain}
            </h2>
            <span className="font-heading font-bold text-xs tracking-[0.4em] text-[#94A3B8] uppercase mt-0.5">
              — {slide.titleSub} —
            </span>
          </div>

        </div>

        {/* Carousel Navigation Arrows `<` and `>` */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#040816]/75 hover:bg-[#00A3FF] border border-[#16244C] hover:border-[#00A3FF] text-[#8FA0C0] hover:text-white flex items-center justify-center transition-all shadow-lg backdrop-blur-sm cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#040816]/75 hover:bg-[#00A3FF] border border-[#16244C] hover:border-[#00A3FF] text-[#8FA0C0] hover:text-white flex items-center justify-center transition-all shadow-lg backdrop-blur-sm cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>

        {/* Slide Indicators: `— • • • •` (Centered at bottom) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === current
                  ? 'w-6 h-1.5 bg-[#00F2FE] shadow-[0_0_10px_#00F2FE]'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
