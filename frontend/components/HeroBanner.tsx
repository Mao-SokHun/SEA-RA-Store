'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Info, ShieldCheck } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    game: 'MOBILE LEGENDS',
    gameSub: 'BANG BANG',
    tagline: 'TOP UP DIAMONDS NOW!',
    description: 'បញ្ចូលទឹកប្រាក់តាមរបៀបងាយស្រួល | បញ្ចូលយ៉ាងប្រកិតតាម DIRECT API ត្រឹម 3 វិនាទី',
    accentColor: '#00a8ff',
    badge: '⚡ OFFICIAL AUTHORIZED DIRECT TOP-UP',
    discount: '20% OFF',
    bgGlow: 'rgba(0, 168, 255, 0.25)',
    btnLabel: 'បញ្ចូលទឹកប្រាក់ →',
    btn2Label: 'ស្វែងរករូបថត',
    bgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=80&fit=crop',
    logo: '💎',
  },
  {
    id: 2,
    game: 'GENSHIN IMPACT',
    gameSub: 'GENESIS CRYSTALS',
    tagline: 'BUY CRYSTALS NOW!',
    description: 'Primogems • Welkin Moon • Battle Pass | ទទួលបានភ្លាមៗ 100%',
    accentColor: '#10b981',
    badge: '⚡ OFFICIAL AUTHORIZED DIRECT TOP-UP',
    discount: '15% OFF',
    bgGlow: 'rgba(16, 185, 129, 0.25)',
    btnLabel: 'បញ្ចូលទឹកប្រាក់ →',
    btn2Label: 'ស្វែងរករូបថត',
    bgImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600&q=80&fit=crop',
    logo: '✨',
  },
  {
    id: 3,
    game: 'FREE FIRE',
    gameSub: 'DIAMONDS & ELITE PASS',
    tagline: 'GET DIAMONDS INSTANTLY!',
    description: 'Elite Pass • Characters • Bundles | ដឹកជញ្ជូនភ្លាមៗ ១០០%',
    accentColor: '#f97316',
    badge: '⚡ OFFICIAL AUTHORIZED DIRECT TOP-UP',
    discount: '25% OFF',
    bgGlow: 'rgba(249, 115, 22, 0.25)',
    btnLabel: 'បញ្ចូលទឹកប្រាក់ →',
    btn2Label: 'ស្វែងរករូបថត',
    bgImage: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1600&q=80&fit=crop',
    logo: '🔥',
  },
];

const particles = [
  { w: 4, h: 4, top: 10, left: 20, dur: 2 },
  { w: 3, h: 3, top: 25, left: 55, dur: 3 },
  { w: 5, h: 5, top: 40, left: 80, dur: 2.5 },
  { w: 2, h: 2, top: 60, left: 10, dur: 3.5 },
  { w: 4, h: 4, top: 75, left: 45, dur: 2 },
  { w: 3, h: 3, top: 15, left: 90, dur: 4 },
  { w: 6, h: 6, top: 85, left: 70, dur: 2.2 },
  { w: 2, h: 2, top: 50, left: 30, dur: 3.8 },
  { w: 4, h: 4, top: 30, left: 65, dur: 2.7 },
  { w: 3, h: 3, top: 70, left: 5, dur: 3 },
  { w: 5, h: 5, top: 90, left: 40, dur: 2.4 },
  { w: 2, h: 2, top: 5, left: 75, dur: 4.2 },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = (idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 200);
  };

  const prev = () => goTo((current - 1 + heroSlides.length) % heroSlides.length);
  const next = () => goTo((current + 1) % heroSlides.length);

  // Auto-slide every 5s
  useEffect(() => {
    const timer = setInterval(() => next(), 5000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const slide = heroSlides[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'calc(100vh - 64px)', minHeight: '500px', maxHeight: '700px', marginTop: '64px' }}
    >
      {/* ── FULL-WIDTH BACKGROUND IMAGE ── */}
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 w-full h-full transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={s.bgImage}
            alt={s.game}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.35) saturate(1.2)' }}
          />
        </div>
      ))}

      {/* ── GRADIENT OVERLAYS (left heavy, right fades) ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            100deg,
            rgba(4,11,26,0.98) 0%,
            rgba(4,11,26,0.85) 30%,
            rgba(4,11,26,0.45) 60%,
            rgba(4,11,26,0.15) 100%
          )`,
        }}
      />
      {/* Accent color glow from center-right */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 55% 70% at 72% 50%, ${slide.bgGlow}, transparent 70%)`,
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28"
        style={{ background: 'linear-gradient(0deg, var(--bg-primary) 0%, transparent 100%)' }}
      />

      {/* ── FLOATING PARTICLES ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.w}px`,
              height: `${p.h}px`,
              background: slide.accentColor,
              opacity: 0.35,
              top: `${p.top}%`,
              left: `${p.left}%`,
              animation: `pulse ${p.dur}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* ── GRID PATTERN ── */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* ── RIGHT SIDE: bright glow orb ── */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 80% 50%, ${slide.bgGlow}, transparent 70%)`,
        }}
      />

      {/* ── GAME LOGO CARD (top-right, like reference) ── */}
      <div
        className="absolute right-16 top-1/2 -translate-y-1/2 z-10 rounded-2xl flex flex-col items-center justify-center gap-2 hidden xl:flex"
        style={{
          width: '170px',
          height: '180px',
          background: 'rgba(10,20,50,0.75)',
          border: `2px solid ${slide.accentColor}50`,
          boxShadow: `0 0 40px ${slide.bgGlow}, inset 0 0 30px rgba(0,0,0,0.5)`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
          style={{ background: `${slide.accentColor}20`, border: `1.5px solid ${slide.accentColor}40` }}
        >
          <ShieldCheck size={36} style={{ color: slide.accentColor }} strokeWidth={1.5} />
        </div>
        <p className="font-black text-sm text-white text-center tracking-widest leading-tight">{slide.game}</p>
        <div className="h-px w-12" style={{ background: slide.accentColor }} />
        <p className="text-xs font-medium text-center" style={{ color: slide.accentColor }}>
          {slide.gameSub}
        </p>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-8 md:px-12">
          <div
            className="max-w-xl transition-all duration-500"
            style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateY(8px)' : 'translateY(0)' }}
          >
            {/* Official badge */}
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full"
                 style={{ background: `${slide.accentColor}15`, border: `1px solid ${slide.accentColor}40` }}>
              <span className="text-xs font-bold tracking-wider" style={{ color: slide.accentColor }}>
                {slide.badge}
              </span>
            </div>

            {/* Game title */}
            <h1 className="font-en font-black leading-none mb-1" style={{ fontSize: 'clamp(42px, 6vw, 72px)' }}>
              {slide.game}:
            </h1>
            <h1
              className="font-en font-black leading-none mb-5"
              style={{ fontSize: 'clamp(42px, 6vw, 72px)', color: slide.accentColor }}
            >
              {slide.gameSub}
            </h1>

            {/* Description */}
            <p className="font-km-body text-sm mb-8 leading-relaxed max-w-md" style={{ color: '#94a3b8' }}>
              {slide.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                className="btn-primary font-km flex items-center gap-2 text-sm"
                style={{ background: slide.accentColor === '#00a8ff'
                  ? 'linear-gradient(135deg, #f97316, #ef4444)'
                  : `linear-gradient(135deg, ${slide.accentColor}, ${slide.accentColor}cc)` }}
              >
                <Zap size={16} fill="white" />
                {slide.btnLabel}
              </button>
              <button className="btn-secondary font-km flex items-center gap-2 text-sm">
                <Info size={15} />
                {slide.btn2Label}
              </button>
            </div>

            {/* Slide dots */}
            <div className="flex items-center gap-2 mt-8">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="slide-dot transition-all duration-300"
                  style={i === current ? { width: '28px', background: slide.accentColor, borderRadius: '4px' } : {}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ARROW BUTTONS ── */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 nav-arrow"
        style={{ width: '36px', height: '36px' }}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 nav-arrow"
        style={{ width: '36px', height: '36px' }}
      >
        <ChevronRight size={18} />
      </button>
    </section>
  );
}
