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
  }
> = {
  mlbb: {
    tagline: 'OFFICIAL 5V5 MOBA DIRECT DIAMONDS INJECTION',
    taglineKh: 'ប្រព័ន្ធបញ្ចូលពេជ្រហ្គេម 5V5 MOBA ផ្លូវការលឿនរហ័ស',
    description:
      'Mobile Legends: Bang Bang is the premier 5v5 mobile esports title. Team up with friends, dominate lanes, and secure your Mythic Glory. Top up Diamonds instantly via our direct Smile.One official partner API with zero-fee Bakong KHQR. 100% safe, no password required.',
    descriptionKh:
      'Mobile Legends: Bang Bang គឺជាហ្គេម 5v5 MOBA ដ៏ពេញនិយមបំផុតទូទាំងពិភពលោក។ បញ្ចូលពេជ្រ Diamonds ភ្លាមៗក្នុងរយៈពេល 3 វិនាទីតាមរយៈប្រព័ន្ធ API ផ្លូវការ Smile.One និងទូទាត់ប្រាក់តាម Bakong KHQR មិនគិតថ្លៃសេវា 0% សុវត្ថិភាព 100% មិនបាច់ប្រើលេខសម្ងាត់ឡើយ។',
    cardBadge: 'DIAMONDS TOP-UP',
  },
  roblox: {
    tagline: 'OFFICIAL 3D METAVERSE DIRECT ROBUX DELIVERY',
    taglineKh: 'បញ្ចូល ROBUX ផ្លូវការផ្ទាល់ទៅក្នុងគណនីភ្លាមៗ',
    description:
      'Roblox is the ultimate virtual universe that lets you create, share experiences with friends, and be anything you can imagine. Get Robux directly credited to your Roblox account with direct publisher injection and instant confirmation.',
    descriptionKh:
      'Roblox គឺជាពិភពនិម្មិត 3D ដ៏ធំទូលាយបំផុតដែលអនុញ្ញាតឱ្យអ្នកបង្កើត និងលេងហ្គេមរាប់លានជាមួយមិត្តភក្តិ។ បញ្ចូល Robux ដោយផ្ទាល់ទៅក្នុង Username របស់អ្នកដោយស្វ័យប្រវត្តិតាមប្រព័ន្ធសុវត្ថិភាពខ្ពស់។',
    cardBadge: 'ROBUX DIRECT',
  },
  ff: {
    tagline: 'OFFICIAL GARENA BATTLE ROYALE RELOAD API',
    taglineKh: 'បញ្ចូលពេជ្រ GARENA FREE FIRE ផ្លូវការរហ័ស 3 វិនាទី',
    description:
      'Free Fire & Free Fire MAX deliver fast-paced 10-minute battle royale survival on remote islands. Top up Diamonds and Elite Passes instantly via your Player ID with 0% fee Bakong KHQR.',
    descriptionKh:
      'Free Fire & Free Fire MAX គឺជាហ្គេមបាញ់ប្រយុទ្ធ Survival ដ៏ល្បីល្បាញ។ បញ្ចូលពេជ្រ និងទិញកញ្ចប់ប្រចាំសប្តាហ៍បានយ៉ាងងាយស្រួលដោយគ្រាន់តែបញ្ចូល Player ID និងស្កេន Bakong KHQR។',
    cardBadge: 'FREE FIRE PASS',
  },
  pubg: {
    tagline: 'OFFICIAL TENCENT TACTICAL SHOOTER UC INJECTION',
    taglineKh: 'បញ្ចូល PUBG MOBILE UC ផ្លូវការផ្ទាល់តាម CHARACTER ID',
    description:
      'PUBG Mobile delivers intense 100-player tactical combat on iconic maps like Erangel and Miramar. Reload Unknown Cash (UC) directly to your Character ID within 3 seconds.',
    descriptionKh:
      'PUBG Mobile ផ្ដល់ជូននូវបទពិសោធន៍បាញ់ប្រយុទ្ធយុទ្ធសាស្ត្របែបពិតៗ។ បញ្ចូល Unknown Cash (UC) ដោយផ្ទាល់ទៅកាន់ Character ID របស់អ្នកភ្លាមៗដោយសុវត្ថិភាព 100%។',
    cardBadge: 'PUBG MOBILE UC',
  },
  genshin: {
    tagline: 'HOYOVERSE OPEN-WORLD TEYVAT GENESIS RELOAD',
    taglineKh: 'បញ្ចូល GENESIS CRYSTALS & WELKIN MOON តាម UID',
    description:
      'Step into the majestic fantasy world of Teyvat. Top up Genesis Crystals and Blessing of the Welkin Moon directly with your UID and Server selection.',
    descriptionKh:
      'ធ្វើដំណើរផ្សងព្រេងក្នុងពិភព Teyvat ដ៏អស្ចារ្យ។ បញ្ចូល Genesis Crystals និង Welkin Moon ដោយផ្ទាល់តាមរយៈ UID របស់អ្នកជាមួយការបញ្ចុះតម្លៃពិសេស។',
    cardBadge: 'GENESIS CRYSTALS',
  },
  valorant: {
    tagline: 'RIOT GAMES OFFICIAL 5V5 TACTICAL FPS POINTS',
    taglineKh: 'បញ្ចូល VALORANT POINTS សម្រាប់ SKINS & BATTLE PASS',
    description:
      'Blend sharp gunplay with game-changing agent abilities in Riot Games tactical FPS. Top up Valorant Points directly for exclusive weapon skin bundles.',
    descriptionKh:
      'ហ្គេមបាញ់ប្រយុទ្ធយុទ្ធសាស្ត្រ 5v5 ពី Riot Games។ បញ្ចូល Valorant Points (VP) ដើម្បីដោះសោ Skins កាំភ្លើងស្អាតៗ និង Battle Pass ភ្លាមៗ។',
    cardBadge: 'VALORANT POINTS',
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
  };

  const lowestPrice = Math.min(...activeGame.packages.map((p) => p.priceUSD));

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % GAMES.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + GAMES.length) % GAMES.length);
  };

  return (
    <section className="relative py-16 sm:py-24 bg-[#050811] overflow-hidden select-none border-t border-b border-white/[0.06]">
      
      {/* Sci-Fi Background Grid & Ambient Flare */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 212, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ============================================================= */}
          {/* 1. LEFT COLUMN: GAME STORY, TITLE & DIRECT CTAS               */}
          {/* Matches User's Reference: media_1794438194304_e349fc7b.jpg     */}
          {/* ============================================================= */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-6">
            
            {/* Small Sci-Fi Category Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-gaming italic text-xs tracking-widest font-black uppercase">
                ABOUT
              </span>
              <div className="h-[2px] w-12 bg-gradient-to-r from-cyan-400 to-transparent" />
            </div>

            {/* Huge Futuristic Slanted Game Title */}
            <h2 className="font-gaming italic text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wider text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] leading-tight">
              {activeGame.name}
            </h2>

            {/* Tagline */}
            <p className="text-xs sm:text-sm font-mono font-bold tracking-widest text-[#E5B55E] uppercase">
              {language === 'km' ? story.taglineKh : story.tagline}
            </p>

            {/* Detailed Description */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              {language === 'km' ? story.descriptionKh : story.description}
            </p>

            {/* Primary Action Buttons (Sci-Fi Chamfered) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/top-up/${activeGame.slug}`}
                style={{
                  clipPath:
                    'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                }}
                className="px-7 sm:px-9 py-3 sm:py-3.5 bg-gradient-to-r from-[#00D4FF] via-[#0284C7] to-[#2563EB] hover:from-[#38BDF8] hover:to-[#1D4ED8] text-black font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(0,212,255,0.6)] hover:shadow-[0_0_40px_rgba(0,212,255,0.85)] transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{language === 'km' ? 'បញ្ចូលលុយឥឡូវនេះ' : 'TOP UP NOW'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#game-catalog"
                style={{
                  clipPath:
                    'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                }}
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-cyan-400/50 hover:border-cyan-300 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{language === 'km' ? 'មើលកញ្ចប់ទាំងអស់' : 'VIEW PACKAGES'}</span>
              </a>
            </div>

            {/* Secondary Sci-Fi Feature Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.08]">
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                ⚡ 3S DIRECT INJECTION
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                0% BAKONG FEE
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-[10px] font-mono text-[#E5B55E] font-bold uppercase tracking-wider">
                100% OFFICIAL API
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-[10px] font-mono text-neutral-300 font-bold uppercase tracking-wider">
                NO PASSWORD REQUIRED
              </span>
            </div>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrev}
                className="w-10 h-10 rounded-xl bg-black/50 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
                aria-label="Previous Game"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-10 h-10 rounded-xl bg-black/50 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
                aria-label="Next Game"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono text-neutral-400 font-bold ml-2">
                0{activeIdx + 1} / 0{GAMES.length}
              </span>
            </div>

          </div>

          {/* ============================================================= */}
          {/* 2. RIGHT COLUMN: CASCADING VERTICAL POSTER CAROUSEL CARDS     */}
          {/* Matches User's Reference: media_1794438194304_e349fc7b.jpg     */}
          {/* ============================================================= */}
          <div className="lg:col-span-6 xl:col-span-7 overflow-x-auto pb-4 pt-2 scrollbar-none">
            <div className="flex items-center gap-4 sm:gap-6 min-w-[700px]">
              {GAMES.map((game, idx) => {
                const isActive = idx === activeIdx;
                const lowest = Math.min(...game.packages.map((p) => p.priceUSD));
                const itemStory = SHOWCASE_STORIES[game.id];

                return (
                  <div
                    key={game.id}
                    onClick={() => setActiveIdx(idx)}
                    style={{
                      clipPath:
                        'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)',
                    }}
                    className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 shrink-0 select-none ${
                      isActive
                        ? 'w-72 sm:w-80 h-[450px] sm:h-[490px] border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,212,255,0.4)] scale-100 z-20'
                        : 'w-56 sm:w-64 h-[380px] sm:h-[420px] border border-white/[0.12] opacity-60 hover:opacity-90 hover:scale-[1.02] z-10'
                    }`}
                  >
                    {/* Background Poster Image */}
                    <img
                      src={game.coverImage}
                      alt={game.name}
                      className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
                    />

                    {/* Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 via-50% to-transparent pointer-events-none" />

                    {/* Cyan Chamfered Top-Right Cut Accent (From Reference Image) */}
                    <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
                      <div className="w-12 h-12 bg-cyan-400 transform rotate-45 -translate-y-6 translate-x-6" />
                    </div>

                    {/* Top Game Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                        {game.publisher}
                      </span>
                    </div>

                    {/* Bottom Frosted Glass Bar with Action Arrow */}
                    <div className="absolute bottom-4 inset-x-4 z-10">
                      <div className="p-3 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/[0.15] flex items-center justify-between shadow-xl">
                        <div>
                          <p className="text-xs font-black text-white truncate max-w-[150px]">
                            {game.name}
                          </p>
                          <span className="text-[10px] text-cyan-300 font-mono font-bold block mt-0.5">
                            {formatPrice(lowest)} • {game.currencyName}
                          </span>
                        </div>
                        <Link
                          href={`/top-up/${game.slug}`}
                          className="w-8 h-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center transition-colors shrink-0 shadow-md"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
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
