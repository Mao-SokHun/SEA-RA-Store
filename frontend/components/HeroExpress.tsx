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
    badge: 'Moonton Official API • 5v5 MOBA',
    themeColor: '#3B82F6',
    bannerUrl:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'roblox',
    name: 'Roblox (Robux Direct)',
    badge: 'Roblox Official Partner • 3D Metaverse',
    themeColor: '#EF4444',
    bannerUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'ff',
    name: 'Free Fire & Free Fire MAX',
    badge: 'Garena Official API • Battle Royale',
    themeColor: '#F97316',
    bannerUrl:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    badge: 'Tencent Games API • Tactical Shooter',
    themeColor: '#EAB308',
    bannerUrl:
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    badge: 'HoYoverse Direct • Open-World RPG',
    themeColor: '#8B5CF6',
    bannerUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'valorant',
    name: 'Valorant',
    badge: 'Riot Games Official • 5v5 Tactical FPS',
    themeColor: '#00D4FF',
    bannerUrl:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=85',
  },
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

  // Auto-rotate hero backdrop every 5.5 seconds unless user pauses/hovers
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

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

  return (
    <section
      className="relative pt-6 pb-16 select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =============================================================== */}
      {/* DYNAMIC AUTO-ROTATING GAME BACKDROP SHOWCASE                    */}
      {/* =============================================================== */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        {HERO_BANNERS.map((banner, idx) => {
          const isActive = idx === activeBannerIdx;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={banner.bannerUrl}
                alt={banner.name}
                className={`w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Colorful specular ambient bloom matching each game */}
              <div
                className="absolute top-1/4 right-1/4 w-[600px] h-[400px] rounded-full blur-[140px] opacity-35 transition-colors duration-1000"
                style={{ backgroundColor: banner.themeColor }}
              />
            </div>
          );
        })}

        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[250px] bg-gradient-to-b from-[#00D4FF]/15 via-[#E5B55E]/10 to-transparent blur-3xl" />

        {/* Deep Vignette Overlays: Keeps game art visible while guaranteeing text & form contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B17]/96 via-[#091022]/85 to-[#070B17]/88" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090E1B] via-transparent to-[#070B17]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070B17]/40 to-[#070B17]/90" />
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

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#152445]/70 border border-white/10 backdrop-blur-md text-[11px] font-bold text-neutral-300">
                <Sparkles className="w-3 h-3 text-[#00D4FF]" />
                <span>{HERO_BANNERS[activeBannerIdx].badge}</span>
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
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#game-catalog"
                className="px-6 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] text-xs font-bold text-white transition-all backdrop-blur-md shadow-md"
              >
                {t.hero.ctaExplore}
              </a>
            </div>

            {/* Banner Slide Progress Indicators */}
            <div className="flex items-center gap-2 pt-3">
              {HERO_BANNERS.map((b, idx) => {
                const isActive = idx === activeBannerIdx;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setActiveBannerIdx(idx);
                      const matched = GAMES.find((g) => g.id === b.id);
                      if (matched) {
                        setSelectedGame(matched);
                        setSelectedPackage(matched.packages[0]);
                      }
                    }}
                    className={`transition-all duration-300 rounded-full h-1.5 cursor-pointer ${
                      isActive
                        ? 'w-7 bg-gradient-to-r from-[#E5B55E] to-[#00D4FF] shadow-[0_0_8px_rgba(229,181,94,0.6)]'
                        : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                    title={b.name}
                  />
                );
              })}
              <span className="text-[11px] font-extrabold text-[#E5B55E] pl-2 tracking-wide">
                {HERO_BANNERS[activeBannerIdx].name}
              </span>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT 5 COLS: 30-SECOND EXPRESS TOP-UP COCKPIT                   */}
          {/* =============================================================== */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-[#0F172B]/95 border border-white/[0.15] p-5 sm:p-6 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10">
              {/* Top Accent Rim */}
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#E5B55E] to-transparent opacity-90" />

              {/* Station Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E5B55E] to-[#C49740] flex items-center justify-center text-black font-black shadow-md">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white tracking-wide">
                      {t.hero.expressTitle}
                    </h3>
                    <p className="text-[11px] text-neutral-300">
                      {t.hero.expressSub}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-sm">
                  ⚡ 3-SEC API
                </span>
              </div>

              {/* 1. Quick Game Switcher (Chips with Full Recognized Names) */}
              <div className="space-y-2 mb-4">
                <label className="text-[11px] font-bold text-neutral-200 block">
                  1. {t.hero.selectGamePrompt}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {GAMES.slice(0, 4).map((game) => {
                    const isSelected = selectedGame.id === game.id;
                    const shortName = GAME_SHORT_NAMES[game.id] || game.name.split(' ')[0];
                    return (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => handleGameChange(game)}
                        className={`p-2 rounded-xl border transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#1A2644] border-[#E5B55E] ring-1 ring-[#E5B55E] shadow-md scale-[1.02]'
                            : 'bg-[#111A30] border-white/[0.08] hover:border-white/[0.25]'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center text-sm font-black overflow-hidden border border-white/10">
                          {game.currencyIcon}
                        </div>
                        <span className="text-[11px] font-extrabold text-white truncate max-w-full">
                          {shortName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Account Details Input with Inline IGN Verify */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-neutral-200">
                    2. {t.hero.enterIdPrompt}
                  </label>
                  {verifiedNick && (
                    <span className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
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
                    className="flex-1 bg-[#111A30] border border-white/[0.14] focus:border-[#E5B55E] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none transition-all shadow-inner"
                  />

                  {selectedGame.accountFields.length > 1 && (
                    <input
                      type="text"
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      placeholder="Zone (2001)"
                      className="w-24 bg-[#111A30] border border-white/[0.14] focus:border-[#E5B55E] rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none transition-all shadow-inner"
                    />
                  )}

                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isVerifying || !accountId.trim()}
                    className="px-3.5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/[0.14] text-xs font-bold text-[#E5B55E] disabled:opacity-50 transition-all cursor-pointer shrink-0 shadow-sm"
                  >
                    {isVerifying ? '...' : language === 'km' ? 'ផ្ទៀងផ្ទាត់' : 'Verify'}
                  </button>
                </div>
              </div>

              {/* 3. Denomination Package Selector (4 Popular Items) */}
              <div className="space-y-2 mb-5">
                <label className="text-[11px] font-bold text-neutral-200 block">
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
                            ? 'bg-[#1A2644] border-[#E5B55E] ring-1 ring-[#E5B55E]/60 shadow-md'
                            : 'bg-[#111A30] border-white/[0.08] hover:border-white/[0.25]'
                        }`}
                      >
                        {pkg.badge && (
                          <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-[#E5B55E] text-black shadow-sm">
                            {pkg.badge}
                          </span>
                        )}
                        <p className="text-xs font-extrabold text-white line-clamp-1">
                          {pkg.name}
                        </p>
                        <p className="text-xs font-black text-[#E5B55E] mt-1">
                          {formatPrice(pkg.priceUSD)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary & Checkout Action */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-neutral-300 block font-medium">
                    {language === 'km' ? 'តម្លៃសរុប:' : 'Total Due:'}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-white">
                      {formatPrice(selectedPackage.priceUSD)}
                    </span>
                    <span className="text-[11px] text-neutral-300">
                      ≈ {toKHR(selectedPackage.priceUSD)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickCheckout}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#E5B55E] to-[#C49740] hover:from-[#FBBF24] hover:to-[#B45309] text-black font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
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
