'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GAMES } from '@/data/games';
import { useApp } from '@/context/AppContext';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const SHOWCASE_STORIES: Record<
  string,
  {
    tagline: string;
    taglineKh: string;
    description: string;
    descriptionKh: string;
    cardBadge: string;
    themeGradient: string;
    accentColor: string;
  }
> = {
  mlbb: {
    tagline: 'OFFICIAL 5V5 MOBA DIRECT DIAMONDS INJECTION',
    taglineKh: 'ប្រព័ន្ធបញ្ចូលពេជ្រហ្គេម 5V5 MOBA ផ្លូវការលឿនរហ័ស',
    description:
      'Mobile Legends: Bang Bang is the premier 5v5 mobile esports title. Team up with friends, dominate lanes, and secure your Mythic Glory. Top up Diamonds instantly via our direct Smile.One official partner API with zero-fee Bakong KHQR. 100% safe, no password required.',
    descriptionKh:
      'Mobile Legends: Bang Bang គឺជាហ្គេម 5v5 MOBA ដ៏ពេញនិយមបំផុតទូទាំងពិភពលោក។ បញ្ចូលពេជ្រ Diamonds ភ្លាមៗក្នុងរយៈពេល 3 វិនាទីតាមរយៈប្រព័ន្ធ API ផ្លូវការ Smile.One និងទូទាត់ប្រាក់តាម Bakong KHQR មិនគិតថ្លៃសេវា 0% សុវត្ថិភាព 100% មិនបាច់ប្រើលេខសម្ងាត់ឡើយ។',
    cardBadge: 'TOP UP DIAMONDS',
    themeGradient: 'from-cyan-500 via-blue-600 to-indigo-600',
    accentColor: '#00D4FF',
  },
  roblox: {
    tagline: 'OFFICIAL 3D METAVERSE DIRECT ROBUX DELIVERY',
    taglineKh: 'បញ្ចូល ROBUX ផ្លូវការផ្ទាល់ទៅក្នុងគណនីភ្លាមៗ',
    description:
      'Roblox is the ultimate virtual universe that lets you create, share experiences with friends, and be anything you can imagine. Get Robux directly credited to your Roblox account with direct publisher injection and instant confirmation.',
    descriptionKh:
      'Roblox គឺជាពិភពនិម្មិត 3D ដ៏ធំទូលាយបំផុតដែលអនុញ្ញាតឱ្យអ្នកបង្កើត និងលេងហ្គេមរាប់លានជាមួយមិត្តភក្តិ។ បញ្ចូល Robux ដោយផ្ទាល់ទៅក្នុង Username របស់អ្នកដោយស្វ័យប្រវត្តិតាមប្រព័ន្ធសុវត្ថិភាពខ្ពស់។',
    cardBadge: 'GET ROBUX DIRECT',
    themeGradient: 'from-amber-500 via-orange-600 to-red-600',
    accentColor: '#F59E0B',
  },
  ff: {
    tagline: 'OFFICIAL GARENA BATTLE ROYALE RELOAD API',
    taglineKh: 'បញ្ចូលពេជ្រ GARENA FREE FIRE ផ្លូវការរហ័ស 3 វិនាទី',
    description:
      'Free Fire & Free Fire MAX deliver fast-paced 10-minute battle royale survival on remote islands. Top up Diamonds and Elite Passes instantly via your Player ID with 0% fee Bakong KHQR.',
    descriptionKh:
      'Free Fire & Free Fire MAX គឺជាហ្គេមបាញ់ប្រយុទ្ធ Survival ដ៏ល្បីល្បាញ។ បញ្ចូលពេជ្រ និងទិញកញ្ចប់ប្រចាំសប្តាហ៍បានយ៉ាងងាយស្រួលដោយគ្រាន់តែបញ្ចូល Player ID និងស្កេន Bakong KHQR។',
    cardBadge: 'FREE FIRE PASS',
    themeGradient: 'from-red-500 via-orange-600 to-amber-600',
    accentColor: '#EF4444',
  },
  pubg: {
    tagline: 'OFFICIAL TENCENT TACTICAL SHOOTER UC INJECTION',
    taglineKh: 'បញ្ចូល PUBG MOBILE UC ផ្លូវការផ្ទាល់តាម CHARACTER ID',
    description:
      'PUBG Mobile delivers intense 100-player tactical combat on iconic maps like Erangel and Miramar. Reload Unknown Cash (UC) directly to your Character ID within 3 seconds.',
    descriptionKh:
      'PUBG Mobile ផ្ដល់ជូននូវបទពិសោធន៍បាញ់ប្រយុទ្ធយុទ្ធសាស្ត្របែបពិតៗ។ បញ្ចូល Unknown Cash (UC) ដោយផ្ទាល់ទៅកាន់ Character ID របស់អ្នកភ្លាមៗដោយសុវត្ថិភាព 100%។',
    cardBadge: 'PUBG MOBILE UC',
    themeGradient: 'from-amber-400 via-yellow-600 to-stone-800',
    accentColor: '#EAB308',
  },
  genshin: {
    tagline: 'HOYOVERSE OPEN-WORLD TEYVAT GENESIS RELOAD',
    taglineKh: 'បញ្ចូល GENESIS CRYSTALS & WELKIN MOON តាម UID',
    description:
      'Step into the majestic fantasy world of Teyvat. Top up Genesis Crystals and Blessing of the Welkin Moon directly with your UID and Server selection.',
    descriptionKh:
      'ធ្វើដំណើរផ្សងព្រេងក្នុងពិភព Teyvat ដ៏អស្ចារ្យ។ បញ្ចូល Genesis Crystals និង Welkin Moon ដោយផ្ទាល់តាមរយៈ UID របស់អ្នកជាមួយការបញ្ចុះតម្លៃពិសេស។',
    cardBadge: 'GENESIS CRYSTALS',
    themeGradient: 'from-purple-500 via-violet-600 to-indigo-700',
    accentColor: '#8B5CF6',
  },
  valorant: {
    tagline: 'RIOT GAMES OFFICIAL 5V5 TACTICAL FPS POINTS',
    taglineKh: 'បញ្ចូល VALORANT POINTS សម្រាប់ SKINS & BATTLE PASS',
    description:
      'Blend sharp gunplay with game-changing agent abilities in Riot Games tactical FPS. Top up Valorant Points directly for exclusive weapon skin bundles.',
    descriptionKh:
      'ហ្គេមបាញ់ប្រយុទ្ធយុទ្ធសាស្ត្រ 5v5 ពី Riot Games។ បញ្ចូល Valorant Points (VP) ដើម្បីដោះសោ Skins កាំភ្លើងស្អាតៗ និង Battle Pass ភ្លាមៗ។',
    cardBadge: 'VALORANT POINTS',
    themeGradient: 'from-cyan-400 via-teal-500 to-emerald-600',
    accentColor: '#00D4FF',
  },
};

export default function GameShowcase() {
  const { language, formatPrice } = useApp();
  const [activeIdx, setActiveIdx] = useState(0);

  const activeGame = GAMES[activeIdx] || GAMES[0];
  const story = SHOWCASE_STORIES[activeGame.id] || {
    tagline: 'OFFICIAL IN-GAME TOP-UP PARTNER',
    taglineKh: 'ផ្លេតហ្វមបញ្ចូលលុយហ្គេមផ្លូវការ',
    description: `${activeGame.name} instant top-up via official partner API with Bakong KHQR 0% fee.`,
    descriptionKh: `បញ្ចូលលុយហ្គេម ${activeGame.name} ភ្លាមៗតាមរយៈប្រព័ន្ធ API ផ្លូវការ និង Bakong KHQR 0% សេវា។`,
    cardBadge: `${activeGame.currencyName} TOP-UP`,
    themeGradient: 'from-cyan-500 to-blue-600',
    accentColor: '#00D4FF',
  };

  const lowestPrice = Math.min(...activeGame.packages.map((p) => p.priceUSD));

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % GAMES.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + GAMES.length) % GAMES.length);
  };

  return (
    <section className="relative py-8 sm:py-14 bg-[#050811] overflow-hidden select-none border-t border-b border-white/[0.06]">
      
      {/* Sci-Fi Background Ambient Flare */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center">
          
          {/* ============================================================= */}
          {/* 1. LEFT COLUMN: COMPACT GAME STORY, TITLE & DIRECT CTAS       */}
          {/* ============================================================= */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-3 sm:space-y-4">
            
            {/* Small Category Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 text-[10px] sm:text-xs tracking-widest font-black uppercase">
                ABOUT
              </span>
              <div className="h-[1.5px] w-8 sm:w-12 bg-gradient-to-r from-cyan-400 to-transparent" />
            </div>

            {/* Clean, High-Impact Game Title */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-[0_8px_25px_rgba(0,0,0,0.9)] leading-tight">
              {activeGame.name}
            </h2>

            {/* Tagline */}
            <p className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#E5B55E] uppercase truncate">
              {language === 'km' ? story.taglineKh : story.tagline}
            </p>

            {/* Compact Description (Clamped on mobile so it doesn't push down services) */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none max-w-xl">
              {language === 'km' ? story.descriptionKh : story.description}
            </p>

            {/* Primary Action Buttons (Compact side-by-side row on mobile) */}
            <div className="flex flex-row items-center gap-2 sm:gap-3 pt-1">
              <Link
                href={`/top-up/${activeGame.slug}`}
                style={{
                  clipPath:
                    'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                }}
                className="flex-1 sm:flex-initial px-4 sm:px-7 py-2.5 sm:py-3 bg-gradient-to-r from-[#00D4FF] via-[#0284C7] to-[#2563EB] hover:from-[#38BDF8] hover:to-[#1D4ED8] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,255,0.5)] hover:shadow-[0_0_30px_rgba(0,212,255,0.8)] transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer text-center"
              >
                <span>{language === 'km' ? 'បញ្ចូលលុយឥឡូវនេះ' : 'TOP UP NOW'}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>

              <a
                href="#game-catalog"
                style={{
                  clipPath:
                    'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                }}
                className="flex-1 sm:flex-initial px-3.5 sm:px-6 py-2.5 sm:py-3 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-cyan-400/40 hover:border-cyan-300 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer text-center"
              >
                <span>{language === 'km' ? 'មើលកញ្ចប់ទាំងអស់' : 'VIEW PACKAGES'}</span>
              </a>
            </div>

            {/* Quick Game Switcher Chips + Mobile Controls */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9.5px] font-mono text-neutral-400 font-bold uppercase tracking-wider">
                  POPULAR DIRECT RELOAD
                </span>
                
                {/* Inline Slider Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="w-6 h-6 rounded-md bg-black/50 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
                    aria-label="Previous Game"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-6 h-6 rounded-md bg-black/50 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
                    aria-label="Next Game"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-neutral-400 font-bold ml-1">
                    0{activeIdx + 1}/0{GAMES.length}
                  </span>
                </div>
              </div>

              {/* Horizontal Scrollable Chips Bar */}
              <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-0.5">
                {GAMES.slice(0, 6).map((g, i) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    style={{
                      clipPath:
                        'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                    }}
                    className={`px-2.5 py-1 text-[9.5px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                      i === activeIdx
                        ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,212,255,0.6)] font-black'
                        : 'bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white border border-white/[0.1]'
                    }`}
                  >
                    {g.name.split(':')[0]}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ============================================================= */}
          {/* 2. RIGHT COLUMN: COMPACT GAMING HUD CARDS (Mobile-Optimized) */}
          {/* ============================================================= */}
          <div className="lg:col-span-6 xl:col-span-7 flex items-center justify-center lg:justify-start w-full overflow-hidden">
            <div className="flex items-center justify-center gap-3 sm:gap-4 select-none w-full">
              {[
                { game: activeGame, pos: 0, targetIdx: activeIdx },
                { game: GAMES[(activeIdx + 1) % GAMES.length], pos: 1, targetIdx: (activeIdx + 1) % GAMES.length },
                { game: GAMES[(activeIdx + 2) % GAMES.length], pos: 2, targetIdx: (activeIdx + 2) % GAMES.length },
              ].map(({ game, pos, targetIdx }) => {
                const isLeading = pos === 0;
                const isSecondary = pos === 1;
                const lowest = Math.min(...game.packages.map((p) => p.priceUSD));
                const itemStory = SHOWCASE_STORIES[game.id] || story;

                return (
                  <div
                    key={`${game.id}-${pos}`}
                    onClick={() => {
                      if (!isLeading) setActiveIdx(targetIdx);
                    }}
                    className={`relative transition-all duration-500 shrink-0 ${
                      isLeading
                        ? 'w-full max-w-[420px] sm:max-w-[340px] h-[175px] sm:h-[340px] md:h-[430px] z-30 cursor-default mx-auto sm:mx-0'
                        : isSecondary
                        ? 'w-56 h-[380px] z-20 opacity-75 hover:opacity-100 hover:scale-[1.02] cursor-pointer hidden md:block'
                        : 'w-48 h-[340px] z-10 opacity-50 hover:opacity-90 hover:scale-[1.02] cursor-pointer hidden xl:block'
                    }`}
                  >
                    {/* True Gaming Chamfered Outer Border Shell */}
                    <div
                      style={{
                        clipPath:
                          'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
                      }}
                      className={`relative w-full h-full p-[1.5px] transition-all duration-500 ${
                        isLeading
                          ? 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 shadow-[0_0_25px_rgba(0,212,255,0.4)]'
                          : 'bg-white/[0.15] hover:bg-cyan-400/50'
                      }`}
                    >
                      {/* Inner Card Container */}
                      <div
                        style={{
                          clipPath:
                            'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
                        }}
                        className="relative w-full h-full bg-[#080D1A] overflow-hidden"
                      >
                        {/* Background Poster Image */}
                        <img
                          src={game.bannerImage || game.coverImage}
                          alt={game.name}
                          className="w-full h-full object-cover object-center transform transition-transform duration-700"
                        />

                        {/* Top-Right Glowing Cyber Angle Bracket Line (HUD Accent) */}
                        <div className="absolute top-0 right-0 w-10 h-10 pointer-events-none">
                          <div
                            className={`w-14 h-[2px] transform rotate-45 translate-x-2 -translate-y-2 shadow-[0_0_8px_#00D4FF] ${
                              isLeading ? 'bg-cyan-300' : 'bg-white/40'
                            }`}
                          />
                        </div>

                        {/* Gradient Shadow Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 via-40% to-transparent pointer-events-none" />

                        {/* Top Publisher Pill Badge with Cyber Accent */}
                        <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10">
                          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-black/80 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-mono font-black text-white uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isLeading ? 'bg-cyan-400 animate-pulse' : 'bg-neutral-400'
                              }`}
                            />
                            <span>{game.publisher.split(' ')[0]}</span>
                          </span>
                        </div>

                        {/* Edge-to-Edge Sleek Frosted Glass Bottom Banner */}
                        <div className="absolute inset-x-0 bottom-0 z-10">
                          <Link
                            href={`/top-up/${game.slug}`}
                            className={`block p-2.5 sm:p-3.5 bg-gradient-to-r from-black/85 via-black/75 to-black/85 backdrop-blur-xl border-t transition-all group/btn ${
                              isLeading
                                ? 'border-cyan-400/60 hover:border-cyan-300'
                                : 'border-white/20'
                            }`}
                            onClick={(e) => {
                              if (!isLeading) {
                                e.preventDefault();
                                setActiveIdx(targetIdx);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-white truncate group-hover/btn:text-cyan-300 transition-colors">
                                  {game.name}
                                </p>
                                <span className="text-[10px] sm:text-[11px] text-cyan-300 font-mono font-bold block mt-0.5 truncate">
                                  {formatPrice(lowest)} • {itemStory.cardBadge}
                                </span>
                              </div>
                              <div
                                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg flex items-center gap-1 font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider shadow-md transition-all shrink-0 ${
                                  isLeading
                                    ? 'bg-cyan-400 group-hover/btn:bg-cyan-300 text-black shadow-[0_0_12px_rgba(0,212,255,0.5)]'
                                    : 'bg-white/10 text-white group-hover/btn:bg-white/20'
                                }`}
                              >
                                <span>{language === 'km' ? 'បញ្ចូល' : 'TOP UP'}</span>
                                <Zap className="w-3 h-3 fill-current shrink-0" />
                              </div>
                            </div>
                          </Link>
                        </div>

                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
