'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, Info } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    game: 'MOBILE LEGENDS: BANG BANG',
    tagline: 'TOP UP DIAMONDS NOW!',
    description: 'Instant delivery • Best prices • 100% safe',
    gradient: 'from-blue-900 via-purple-900 to-indigo-900',
    accentColor: '#00a8ff',
    badge: 'MOST POPULAR',
    discount: '20% OFF',
    bgGlow: 'rgba(0, 168, 255, 0.2)',
    emoji: '💎',
    image: 'https://placehold.co/700x400/040b1a/00a8ff?text=MOBILE+LEGENDS',
  },
  {
    id: 2,
    game: 'GENSHIN IMPACT',
    tagline: 'BUY GENESIS CRYSTALS',
    description: 'Primogems • Welkin Moon • Battle Pass',
    gradient: 'from-cyan-900 via-teal-900 to-blue-900',
    accentColor: '#10b981',
    badge: 'TOP SELLER',
    discount: '15% OFF',
    bgGlow: 'rgba(16, 185, 129, 0.2)',
    emoji: '✨',
    image: 'https://placehold.co/700x400/040b1a/10b981?text=GENSHIN+IMPACT',
  },
  {
    id: 3,
    game: 'FREE FIRE',
    tagline: 'GET DIAMONDS INSTANTLY',
    description: 'Elite Pass • Characters • Bundles',
    gradient: 'from-orange-900 via-red-900 to-rose-900',
    accentColor: '#f97316',
    badge: 'HOT DEAL',
    discount: '25% OFF',
    bgGlow: 'rgba(249, 115, 22, 0.2)',
    emoji: '🔥',
    image: 'https://placehold.co/700x400/040b1a/f97316?text=FREE+FIRE',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);
  const next = () => setCurrent((c) => (c + 1) % heroSlides.length);
  const slide = heroSlides[current];

  return (
    <section className="relative overflow-hidden" style={{ height: '480px', background: 'var(--bg-primary)', marginTop: '64px' }}>
      {/* Bg glow */}
      <div className="absolute inset-0 transition-all duration-700" style={{ background: `radial-gradient(ellipse 60% 60% at 70% 50%, ${slide.bgGlow}, transparent)` }} />
      <div className="absolute inset-0 grid-pattern" />

      {/* Floating particles */}
      <div className="particles-bg">
        {[
          { w: 4, h: 4, top: 10, left: 20, dur: 2 },
          { w: 3, h: 3, top: 25, left: 55, dur: 3 },
          { w: 5, h: 5, top: 40, left: 80, dur: 2.5 },
          { w: 2, h: 2, top: 60, left: 10, dur: 3.5 },
          { w: 4, h: 4, top: 75, left: 45, dur: 2 },
          { w: 3, h: 3, top: 15, left: 90, dur: 4 },
          { w: 6, h: 6, top: 85, left: 70, dur: 2.2 },
          { w: 2, h: 2, top: 50, left: 30, dur: 3.8 },
          { w: 4, h: 4, top: 30, left: 65, dur: 2.7 },
          { w: 3, h: 3, top: 70, left: 5,  dur: 3 },
          { w: 5, h: 5, top: 90, left: 40, dur: 2.4 },
          { w: 2, h: 2, top: 5,  left: 75, dur: 4.2 },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.w}px`,
              height: `${p.h}px`,
              background: slide.accentColor,
              opacity: 0.4,
              top: `${p.top}%`,
              left: `${p.left}%`,
              animation: `pulse ${p.dur}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Right side game visual */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-end pr-12">
          {/* Glow circle */}
          <div className="absolute right-24 w-72 h-72 rounded-full blur-3xl opacity-30" style={{ background: slide.accentColor }} />
          {/* Game art placeholder */}
          <div className="relative z-10 rounded-2xl overflow-hidden border opacity-90"
               style={{ width: '560px', height: '340px', borderColor: `${slide.accentColor}40`, boxShadow: `0 0 60px ${slide.bgGlow}` }}>
            <img
              src={slide.image}
              alt={slide.game}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, var(--bg-primary) 0%, transparent 30%)' }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1400px] mx-auto px-8 w-full">
          <div className="max-w-lg">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className="badge-hot text-xs">{slide.badge}</span>
              <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: '#facc15' }}>
                {slide.discount}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-black text-4xl md:text-5xl leading-tight mb-3" style={{ textShadow: `0 0 30px ${slide.bgGlow}` }}>
              {slide.game}
            </h1>
            <p className="text-xl font-bold mb-2" style={{ color: slide.accentColor }}>
              {slide.emoji} {slide.tagline}
            </p>
            <p className="text-sm mb-6" style={{ color: '#8b9ab4' }}>
              {slide.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <button className="btn-primary flex items-center gap-2">
                <Zap size={16} fill="white" />
                TOP UP NOW
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Info size={16} />
                VIEW PACKAGES
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-6">
              {[
                { label: 'Sold Today', value: '12,458' },
                { label: 'Rating', value: '4.9 ★' },
                { label: 'Delivery', value: 'Instant' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-bold text-white text-sm">{stat.value}</p>
                  <p className="text-xs" style={{ color: '#4a5a7a' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 nav-arrow">
        <ChevronLeft size={16} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 nav-arrow">
        <ChevronRight size={16} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`slide-dot ${i === current ? 'active' : ''}`}
          />
        ))}
      </div>
    </section>
  );
}
