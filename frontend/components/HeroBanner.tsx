'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    titleMain: 'SHADOWFALL:',
    titleSub: 'LEGACY',
    tagline: 'THE JOURNEY BEGINS NOW!',
    description: 'ដំណើរកម្សាន្តចាប់ផ្ដើមឥឡូវនេះ! បញ្ចូលលុយស្វ័យប្រវត្តិតាម DIRECT API ត្រឹម 3 វិនាទី ទទួលបានពេជ្រភ្លាមៗ',
    primaryBtn: 'បញ្ចូលលុយឥឡូវនេះ',
    secondaryBtn: 'មើលកញ្ចប់ទាំងអស់',
    accentColor: '#00a8ff',
    badge: 'OFFICIAL AUTHORIZED DIRECT TOP-UP',
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=85&fit=crop',
    targetLink: '/top-up/shadowfall',
  },
  {
    id: 2,
    titleMain: 'MOBILE LEGENDS:',
    titleSub: 'BANG BANG',
    tagline: 'TOP UP DIAMONDS INSTANTLY!',
    description: 'បញ្ចូលពេជ្រ MLBB ផ្លូវការ 100% ទទួលស្គាល់ដោយ Moonton សុវត្ថិភាព គ្មានហានិភ័យ និងតម្លៃល្អបំផុត',
    primaryBtn: 'បញ្ចូលពេជ្រឥឡូវនេះ',
    secondaryBtn: 'មើលកញ្ចប់ពេជ្រ',
    accentColor: '#00a8ff',
    badge: 'OFFICIAL MOONTON PARTNER',
    bgImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=85&fit=crop',
    targetLink: '/top-up/mobile-legends',
  },
  {
    id: 3,
    titleMain: 'GENSHIN IMPACT:',
    titleSub: 'CRYSTALS',
    tagline: 'BUY GENESIS CRYSTALS & BLESSING',
    description: 'Primogems, Welkin Moon, Battle Pass ទទួលបានភ្លាមៗដោយគ្រាន់តែបញ្ចូល UID និង Server',
    primaryBtn: 'បញ្ចូល Crystals ឥឡូវនេះ',
    secondaryBtn: 'មើលកញ្ចប់ទាំងអស់',
    accentColor: '#10b981',
    badge: 'DIRECT UID TOP-UP',
    bgImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1920&q=85&fit=crop',
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
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative w-full overflow-hidden bg-[#040b1a] mt-16 select-none" style={{ minHeight: '520px', height: '62vh', maxHeight: '660px' }}>
      
      {/* ── Slide Backgrounds with Smooth Fade ── */}
      {heroSlides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Main Background Game Artwork */}
          <img
            src={s.bgImage}
            alt={s.titleMain}
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.55) contrast(1.15)' }}
          />

          {/* Left Dark Gradient Overlay (Keeps text ultra crisp & readable) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(4,11,26,0.96) 0%, rgba(4,11,26,0.85) 40%, rgba(4,11,26,0.45) 70%, rgba(4,11,26,0.15) 100%)',
            }}
          />

          {/* Bottom Fade to section below */}
          <div
            className="absolute bottom-0 left-0 right-0 h-28"
            style={{ background: 'linear-gradient(0deg, #040b1a 0%, transparent 100%)' }}
          />
        </div>
      ))}

      {/* ── Subtle Cyber Grid Overlay ── */}
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />

      {/* ── Main Content Container (Properly Indented so Arrows NEVER collide with text) ── */}
      <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-16 sm:px-20 lg:px-24 flex items-center justify-between">
        
        {/* Left Side: Hero Text & Actions */}
        <div className="max-w-xl py-8">
          
          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00a8ff]/15 border border-[#00a8ff]/35 mb-4 backdrop-blur-sm">
            <Zap size={13} className="text-[#00a8ff]" fill="#00a8ff" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#00a8ff] font-en uppercase">
              {slide.badge}
            </span>
          </div>

          {/* Hero Main Heading: SHADOWFALL: LEGACY */}
          <h1 className="font-en font-black text-white text-3xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight mb-2 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            {slide.titleMain}
            <span className="block text-[#00a8ff] drop-shadow-[0_0_25px_rgba(0,168,255,0.4)]">
              {slide.titleSub}
            </span>
          </h1>

          {/* Tagline */}
          <p className="font-en font-bold text-xs sm:text-sm tracking-widest text-[#f97316] mb-3 uppercase">
            {slide.tagline}
          </p>

          {/* Description */}
          <p className="font-km text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-7 max-w-lg">
            {slide.description}
          </p>

          {/* CTA Buttons (Matches Orange & Blue Outline Buttons from Reference) */}
          <div className="flex items-center gap-3.5 flex-wrap">
            <Link
              href={slide.targetLink}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white font-km font-bold text-sm shadow-[0_4px_22px_rgba(249,115,22,0.45)] hover:shadow-[0_6px_28px_rgba(249,115,22,0.65)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>{slide.primaryBtn}</span>
              <span className="text-base leading-none">→</span>
            </Link>

            <Link
              href="#games"
              className="px-7 py-3 rounded-xl bg-[#00a8ff]/10 hover:bg-[#00a8ff]/20 text-[#00a8ff] hover:text-white border border-[#00a8ff]/40 hover:border-[#00a8ff] font-km font-semibold text-sm transition-all"
            >
              {slide.secondaryBtn}
            </Link>
          </div>
        </div>

        {/* Right Side: Stylized Fantasy Game Title (matches top-right embossed text in Reference) */}
        <div className="hidden lg:flex flex-col items-end justify-center text-right pr-6 pointer-events-none select-none">
          <h2 className="font-en font-black text-3xl xl:text-4xl tracking-widest text-white/90 drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] uppercase">
            {slide.titleMain}
          </h2>
          <span className="font-en font-bold text-base tracking-[0.3em] text-[#00a8ff] uppercase mt-1">
            — {slide.titleSub} —
          </span>
        </div>

      </div>

      {/* ── Slide Navigation Arrows (Positioned cleanly at left & right edges with ample breathing room) ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-[#0a1428]/85 hover:bg-[#00a8ff] border border-[#1a335a] hover:border-[#00a8ff] text-[#8b9ab4] hover:text-white flex items-center justify-center transition-all shadow-xl backdrop-blur-sm"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-[#0a1428]/85 hover:bg-[#00a8ff] border border-[#1a335a] hover:border-[#00a8ff] text-[#8b9ab4] hover:text-white flex items-center justify-center transition-all shadow-xl backdrop-blur-sm"
      >
        <ChevronRight size={20} />
      </button>

      {/* ── Bottom Slide Indicator Dots (Centered like reference) ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-7 h-2 bg-[#00a8ff] shadow-[0_0_10px_#00a8ff]'
                : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

    </section>
  );
}
