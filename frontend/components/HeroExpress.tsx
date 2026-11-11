'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { GAMES } from '@/data/games';
import { GameItem, PackageItem } from '@/types';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  QrCode,
  Flame,
  ChevronRight,
} from 'lucide-react';

export default function HeroExpress() {
  const { language, t, openTopUp, formatPrice, toKHR } = useApp();

  // State for Express Cockpit
  const [selectedGame, setSelectedGame] = useState<GameItem>(GAMES[0]);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem>(GAMES[0].packages[0]);
  const [accountId, setAccountId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedNick, setVerifiedNick] = useState<string | null>(null);

  const handleGameChange = (game: GameItem) => {
    setSelectedGame(game);
    setSelectedPackage(game.packages[0]);
    setVerifiedNick(null);
  };

  const handleVerify = () => {
    if (!accountId.trim() || accountId.length < 3) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const mocks: Record<string, string> = {
        mlbb: 'Slayer_ProKH',
        roblox: 'MetaverseHero',
        ff: 'Booyah_Sniper',
        pubg: 'Conqueror_KH',
        genshin: 'Traveler_Teyvat',
        valorant: 'TenZ_Fan_KH',
      };
      setVerifiedNick(mocks[selectedGame.id] || 'VerifiedPlayer_KH');
    }, 500);
  };

  const handleQuickCheckout = () => {
    openTopUp(selectedGame.id, selectedPackage.id);
  };

  return (
    <section className="relative pt-6 pb-12 select-none overflow-hidden">
      {/* Background Ambient Spotlights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-gradient-to-br from-[#E5B55E]/10 via-[#00D4FF]/5 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-gradient-to-bl from-[#00D4FF]/10 via-[#3B82F6]/5 to-transparent blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* =============================================================== */}
          {/* LEFT 7 COLS: HERO BRAND HEADLINE & VALUE PROPOSITION            */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* Publisher Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111726]/80 border border-[#E5B55E]/30 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#E5B55E]">
                {t.hero.tag}
              </span>
            </div>

            {/* Prestige Luxury Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                {t.hero.headlinePre}
              </h1>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#E5B55E] via-[#FDE047] to-[#00D4FF] leading-[1.15]">
                {t.hero.headlineGrad}
              </h2>
              <p className="text-lg sm:text-2xl font-bold tracking-wide text-neutral-300 pt-1">
                {t.hero.headlineSub}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
              {t.hero.desc}
            </p>

            {/* Key Value Guarantee Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-bold text-neutral-200">
                <Zap className="w-3.5 h-3.5 text-[#E5B55E]" />
                <span>{t.hero.speedPill}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-bold text-neutral-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.hero.zeroFeePill}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-bold text-neutral-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>{t.hero.safePill}</span>
              </div>
            </div>

            {/* Hero CTA Actions */}
            <div className="flex items-center gap-4 pt-3">
              <button
                type="button"
                onClick={() => openTopUp(selectedGame.id)}
                className="group px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#E5B55E] via-[#FBBF24] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-black font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(229,181,94,0.4)] hover:shadow-[0_0_35px_rgba(229,181,94,0.6)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{t.hero.ctaTopUp}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#game-catalog"
                className="px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.25] text-neutral-200 hover:text-white font-bold text-sm tracking-wide transition-all cursor-pointer"
              >
                {t.hero.ctaExplore}
              </a>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT 5 COLS: INTERACTIVE "EXPRESS TOP-UP STATION" COCKPIT       */}
          {/* =============================================================== */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-[#0F1424]/90 border border-white/[0.12] p-5 sm:p-6 shadow-2xl backdrop-blur-2xl">
              {/* Top Accent Rim */}
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#E5B55E] to-transparent opacity-80" />

              {/* Station Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E5B55E] to-[#C49740] flex items-center justify-center text-black font-black">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white tracking-wide">
                      {t.hero.expressTitle}
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      {t.hero.expressSub}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  ⚡ 3-SEC API
                </span>
              </div>

              {/* 1. Quick Game Switcher (Horizontal Thumbnails) */}
              <div className="space-y-1.5 mb-4">
                <label className="text-[11px] font-bold text-neutral-300 block">
                  1. {t.hero.selectGamePrompt}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {GAMES.slice(0, 4).map((game) => {
                    const isSelected = selectedGame.id === game.id;
                    return (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => handleGameChange(game)}
                        className={`p-2 rounded-xl border transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#18233C] border-[#E5B55E] ring-1 ring-[#E5B55E] shadow-md scale-[1.02]'
                            : 'bg-[#121828] border-white/[0.06] hover:border-white/[0.2]'
                        }`}
                      >
                        <img
                          src={game.coverImage}
                          alt={game.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <span className="text-[10px] font-black text-white truncate max-w-full">
                          {game.name.split(':')[0].split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Account Details Input with Inline IGN Verify */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-neutral-300">
                    2. {t.hero.enterIdPrompt}
                  </label>
                  {verifiedNick && (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
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
                        ? 'e.g. 12345678'
                        : selectedGame.id === 'roblox'
                        ? 'e.g. RobloxUsername'
                        : 'e.g. 192837465'
                    }
                    className="flex-1 bg-[#121828] border border-white/[0.1] focus:border-[#E5B55E] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none transition-all"
                  />

                  {selectedGame.accountFields.length > 1 && (
                    <input
                      type="text"
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      placeholder="Zone (2001)"
                      className="w-24 bg-[#121828] border border-white/[0.1] focus:border-[#E5B55E] rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none transition-all"
                    />
                  )}

                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isVerifying || !accountId.trim()}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-bold text-[#E5B55E] disabled:opacity-50 transition-all cursor-pointer shrink-0"
                  >
                    {isVerifying ? '...' : 'Verify'}
                  </button>
                </div>
              </div>

              {/* 3. Denomination Package Selector (4 Popular Items) */}
              <div className="space-y-1.5 mb-5">
                <label className="text-[11px] font-bold text-neutral-300 block">
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
                            ? 'bg-[#18233C] border-[#E5B55E] shadow-sm'
                            : 'bg-[#121828] border-white/[0.06] hover:border-white/[0.2]'
                        }`}
                      >
                        {pkg.badge && (
                          <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-[#E5B55E] text-black">
                            {pkg.badge}
                          </span>
                        )}
                        <p className="text-xs font-bold text-white line-clamp-1">
                          {pkg.name}
                        </p>
                        <p className="text-xs font-black text-[#E5B55E] mt-0.5">
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
                  <span className="text-[10px] text-neutral-400 block font-medium">
                    Total Due:
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-white">
                      {formatPrice(selectedPackage.priceUSD)}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      ≈ {toKHR(selectedPackage.priceUSD)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickCheckout}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#E5B55E] to-[#C49740] hover:from-[#FBBF24] hover:to-[#B45309] text-black font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
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
