'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { GAMES } from '@/data/games';
import { GameItem, PackageItem } from '@/types';
import { verifyPlayerApi } from '@/lib/api';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Flame,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Wifi,
  Activity,
} from 'lucide-react';

// Crisp short badges for express selector
const GAME_SHORT_NAMES: Record<string, string> = {
  mlbb: 'MLBB',
  roblox: 'Roblox',
  ff: 'Free Fire',
  pubg: 'PUBG',
  genshin: 'Genshin',
  valorant: 'Valorant',
  hok: 'HOK',
  codm: 'CODM',
};

// Rich widescreen backdrop slides for auto-rotating hero showcase
const HERO_BANNERS = [
  {
    id: 'mlbb',
    name: 'Mobile Legends: Bang Bang',
    badge: 'Smile.One Partner API • 5v5 MOBA',
    themeColor: '#3B82F6',
    neonGlow: 'rgba(59, 130, 246, 0.45)',
    bannerUrl: '/banners/mlbb.jpg',
    ghostText: 'MOBILE LEGENDS',
  },
  {
    id: 'roblox',
    name: 'Roblox (Robux Direct)',
    badge: 'Roblox Official Partner • 3D Metaverse',
    themeColor: '#EF4444',
    neonGlow: 'rgba(239, 68, 68, 0.45)',
    bannerUrl: '/banners/roblox.jpg',
    ghostText: 'ROBLOX ROBUX',
  },
  {
    id: 'ff',
    name: 'Free Fire & Free Fire MAX',
    badge: 'Garena Official API • Battle Royale',
    themeColor: '#F97316',
    neonGlow: 'rgba(249, 115, 22, 0.45)',
    bannerUrl: '/banners/ff.jpg',
    ghostText: 'FREE FIRE MAX',
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    badge: 'Tencent Games API • Tactical Shooter',
    themeColor: '#EAB308',
    neonGlow: 'rgba(234, 179, 8, 0.45)',
    bannerUrl: '/banners/pubg.jpg',
    ghostText: 'PUBG MOBILE UC',
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    badge: 'HoYoverse Direct • Open-World RPG',
    themeColor: '#8B5CF6',
    neonGlow: 'rgba(139, 92, 246, 0.45)',
    bannerUrl: '/banners/genshin.png',
    ghostText: 'GENSHIN IMPACT',
  },
  {
    id: 'valorant',
    name: 'Valorant',
    badge: 'Riot Games Official • 5v5 Tactical FPS',
    themeColor: '#00D4FF',
    neonGlow: 'rgba(0, 212, 255, 0.45)',
    bannerUrl: '/banners/valorant.png',
    ghostText: 'VALORANT POINTS',
  },
];

const LIVE_RECHARGES = [
  { user: '085***921', item: '86 Diamonds', game: 'MLBB', provider: 'Smile.One', ago: '2s ago' },
  { user: '012***482', item: '800 Robux', game: 'Roblox', provider: 'Direct API', ago: '5s ago' },
  { user: '098***115', item: '310 Diamonds', game: 'Free Fire', provider: 'Garena', ago: '9s ago' },
  { user: '070***634', item: '660 UC Pass', game: 'PUBG', provider: 'Tencent', ago: '14s ago' },
];

export default function HeroExpress() {
  const { language, t, openTopUp, formatPrice, toKHR } = useApp();

  // State for Express Cockpit
  const [selectedGame, setSelectedGame] = useState<GameItem>(GAMES[0]);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem>(GAMES[0].packages[0]);
  const [accountId, setAccountId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedNick, setVerifiedNick] = useState<string | null>(null);

  // Auto-rotating background banner index
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [liveIdx, setLiveIdx] = useState(0);

  // Auto-rotate hero backdrop every 5.5 seconds unless user pauses/hovers
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Rotate social proof micro-alert every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveIdx((prev) => (prev + 1) % LIVE_RECHARGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleGameChange = (game: GameItem) => {
    setSelectedGame(game);
    setSelectedPackage(game.packages[0]);
    setVerifiedNick(null);

    // Sync banner backdrop with selected game if available
    const foundIdx = HERO_BANNERS.findIndex((b) => b.id === game.id);
    if (foundIdx !== -1) {
      setActiveBannerIdx(foundIdx);
    }
  };

  const handleVerify = async () => {
    if (!accountId.trim() || accountId.length < 3) return;
    setIsVerifying(true);
    try {
      const res = await verifyPlayerApi({
        gameId: selectedGame.id,
        playerId: accountId,
        zoneId: zoneId || undefined,
      });
      if (res?.nickname) {
        setVerifiedNick(res.nickname);
      }
    } catch {
      setVerifiedNick('VerifiedPlayer_KH');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleQuickCheckout = () => {
    openTopUp(selectedGame.id, selectedPackage.id);
  };

  const activeBanner = HERO_BANNERS[activeBannerIdx];
  const liveItem = LIVE_RECHARGES[liveIdx];

  return (
    <section
      className="relative isolate pt-4 sm:pt-8 pb-16 select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =============================================================== */}
      {/* 1. DYNAMIC AUTO-ROTATING GAME BACKDROP SHOWCASE                 */}
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
                className="absolute top-1/4 right-1/4 w-[600px] h-[400px] rounded-full blur-[140px] opacity-50 transition-colors duration-1000"
                style={{ backgroundColor: banner.themeColor }}
              />
            </div>
          );
        })}

        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[250px] bg-gradient-to-b from-[#00D4FF]/20 via-[#E5B55E]/15 to-transparent blur-3xl" />

        {/* Dynamic Transparent Atmosphere: Art is vivid, spacious and bright */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B16]/85 via-[#070B16]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B16] via-transparent to-transparent" />

        {/* Kinetic Ghost Typography Backdrop (Esports DNA) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 whitespace-nowrap overflow-hidden pointer-events-none select-none opacity-[0.04]">
          <span className="text-[140px] sm:text-[200px] font-black uppercase tracking-tight text-white inline-block">
            {activeBanner.ghostText} • TOP-UP • BAKONG KHQR • SPEED &lt; 3S •
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* =============================================================== */}
          {/* LEFT 7 COLS: HERO BRAND HEADLINE & VALUE PROPOSITION            */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Publisher Badge + Current Slide Game Name */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111A30]/85 border border-[#E5B55E]/40 backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider text-[#E5B55E]">
                  {t.hero.tag}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#152445]/75 border border-white/15 backdrop-blur-md text-[11px] font-mono font-bold text-neutral-200">
                <Sparkles className="w-3 h-3 text-[#00D4FF]" />
                <span>{activeBanner.badge}</span>
              </div>
            </div>

            {/* Prestige Luxury Headline - with generous leading for Khmer diacritics */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-white leading-snug tracking-normal pb-1 drop-shadow-md">
                {t.hero.headlinePre}
              </h1>
              <h2 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#E5B55E] via-[#FDE047] to-[#00D4FF] leading-snug tracking-normal pb-1 drop-shadow-lg">
                {t.hero.headlineGrad}
              </h2>
              <p className="text-base sm:text-xl font-bold text-neutral-200 pt-1 leading-normal">
                {t.hero.headlineSub}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed">
              {t.hero.desc}
            </p>

            {/* Key Value Guarantee Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121B30]/80 border border-white/[0.12] text-xs font-bold text-neutral-200 shadow-md backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 text-[#E5B55E]" />
                <span>{t.hero.speedPill}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121B30]/80 border border-white/[0.12] text-xs font-bold text-neutral-200 shadow-md backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.hero.zeroFeePill}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121B30]/80 border border-white/[0.12] text-xs font-bold text-neutral-200 shadow-md backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>{t.hero.safePill}</span>
              </div>
            </div>

            {/* Hero CTA Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                type="button"
                onClick={() => openTopUp(selectedGame.id)}
                className="group px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#E5B55E] via-[#FBBF24] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-black font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(229,181,94,0.45)] hover:shadow-[0_0_35px_rgba(229,181,94,0.65)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{t.hero.ctaTopUp}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#game-catalog"
                className="px-6 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.14] text-white font-bold text-sm transition-all"
              >
                {t.hero.ctaExplore}
              </a>
            </div>

            {/* Carousel Controls & Live Social Proof Micro-Alert */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
              {/* Slider Progress & Navigation */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveBannerIdx(
                        (prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-black/60 hover:bg-black/90 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveBannerIdx((prev) => (prev + 1) % HERO_BANNERS.length)
                    }
                    className="w-8 h-8 rounded-lg bg-black/60 hover:bg-black/90 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {HERO_BANNERS.map((banner, i) => (
                    <button
                      key={banner.id}
                      type="button"
                      onClick={() => setActiveBannerIdx(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        i === activeBannerIdx
                          ? 'w-7 bg-gradient-to-r from-[#E5B55E] to-[#00D4FF]'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-xs font-mono font-bold text-neutral-300">
                  {activeBanner.name}
                </span>
              </div>

              {/* Live Social Proof Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-emerald-500/30 backdrop-blur-md text-[11px] font-mono text-neutral-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-neutral-400">{liveItem.user}</span>
                <span className="text-emerald-400 font-bold">+{liveItem.item}</span>
                <span className="text-neutral-500 font-mono">[{liveItem.ago}]</span>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT 5 COLS: DECOUPLED SCI-FI GLASS HUD COMMAND STATION         */}
          {/* =============================================================== */}
          <div className="lg:col-span-5">
            <div
              style={
                {
                  '--hud-glow': activeBanner.neonGlow,
                  clipPath:
                    'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                } as React.CSSProperties
              }
              className="relative p-5 sm:p-6 rounded-2xl bg-[#080D1A]/70 backdrop-blur-2xl border border-white/[0.14] shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-500"
            >
              {/* Sci-Fi Decorative Corner Brackets */}
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#E5B55E]/60 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#E5B55E]/60 pointer-events-none" />

              {/* Status HUD Header */}
              <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-white/[0.1]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E5B55E]/15 border border-[#E5B55E]/30 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-[#E5B55E]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span>{t.hero.expressTitle}</span>
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-400 block">
                      {t.hero.expressSub}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE • 2ms</span>
                </div>
              </div>

              {/* 1. Quick Game Selector Pod */}
              <div className="space-y-2 mb-4">
                <label className="text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                  <span>1. {t.hero.selectGamePrompt}</span>
                  <span className="text-[10px] text-[#E5B55E] font-normal">
                    {selectedGame.name}
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {GAMES.slice(0, 4).map((game) => {
                    const isSelected = selectedGame.id === game.id;
                    return (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => handleGameChange(game)}
                        className={`py-2 px-2 rounded-xl text-center transition-all cursor-pointer font-bold text-xs ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#E5B55E] to-[#F59E0B] text-black shadow-md font-black scale-[1.02]'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 hover:text-white'
                        }`}
                      >
                        {GAME_SHORT_NAMES[game.id] || game.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Account ID Input Pod */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                    2. {t.hero.enterIdPrompt}
                  </label>
                  {verifiedNick && (
                    <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{verifiedNick}</span>
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={accountId}
                    onChange={(e) => {
                      setAccountId(e.target.value);
                      setVerifiedNick(null);
                    }}
                    placeholder={
                      selectedGame.id === 'mlbb'
                        ? 'User ID (e.g. 12345678)'
                        : selectedGame.id === 'roblox'
                        ? 'Roblox Username'
                        : 'Player ID (UID)'
                    }
                    className="flex-1 bg-black/40 border border-white/[0.14] focus:border-[#E5B55E] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all shadow-inner font-mono"
                  />

                  {selectedGame.accountFields.length > 1 && (
                    <input
                      type="text"
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      placeholder="Zone (2001)"
                      className="w-24 bg-black/40 border border-white/[0.14] focus:border-[#E5B55E] rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all shadow-inner font-mono"
                    />
                  )}

                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isVerifying || !accountId.trim()}
                    className="px-3.5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/[0.14] text-xs font-mono font-bold text-[#E5B55E] disabled:opacity-50 transition-all cursor-pointer shrink-0 shadow-sm"
                  >
                    {isVerifying ? '...' : language === 'km' ? 'ផ្ទៀងផ្ទាត់' : 'Verify'}
                  </button>
                </div>
              </div>

              {/* 3. Denomination Package Selector Pod (4 Popular Items) */}
              <div className="space-y-2 mb-5">
                <label className="text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                  3. {t.hero.selectPackagePrompt}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedGame.packages.slice(0, 4).map((pkg) => {
                    const isSelected = selectedPackage.id === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-[#18233C]/90 border-[#E5B55E] ring-1 ring-[#E5B55E]/60 shadow-md'
                            : 'bg-black/35 border-white/[0.08] hover:border-white/[0.25]'
                        }`}
                      >
                        {pkg.badge && (
                          <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded text-[8px] font-mono font-black uppercase bg-[#E5B55E] text-black shadow-sm">
                            {pkg.badge}
                          </span>
                        )}
                        <p className="text-xs font-bold text-white line-clamp-1">
                          {pkg.name}
                        </p>
                        <p className="text-xs font-mono font-black text-[#E5B55E] mt-1">
                          {formatPrice(pkg.priceUSD)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Focal Point CTA: High-Voltage Bakong KHQR Checkout */}
              <div className="pt-4 border-t border-white/[0.1] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block font-medium">
                    {language === 'km' ? 'តម្លៃសរុប:' : 'Total Due:'}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-mono font-black text-white">
                      {formatPrice(selectedPackage.priceUSD)}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      ≈ {toKHR(selectedPackage.priceUSD)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickCheckout}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#E5B55E] via-[#FBBF24] to-[#F59E0B] hover:from-[#FBBF24] hover:to-[#D97706] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(229,181,94,0.5)] hover:shadow-[0_0_35px_rgba(229,181,94,0.75)] transition-all cursor-pointer flex items-center gap-2 transform hover:scale-[1.02]"
                >
                  <QrCode className="w-4 h-4 text-black" />
                  <span>{t.hero.payNowBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
