'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
  ShoppingCart,
  PlusCircle,
  MessageCircle,
  Check,
  ChevronRight,
  Gamepad2,
  Lock,
  Flame,
} from 'lucide-react';
import AccountCard from '@/components/cards/AccountCard';
import Hero3DMarquee from '@/components/hero/Hero3DMarquee';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { GameAccount, Game } from '@/types';

// Curated Popular Games Metadata for instant rendering & beautiful cards
const POPULAR_GAMES = [
  {
    id: 'roblox',
    title: 'Roblox',
    shortName: 'Roblox',
    genre: 'Blox Fruits • Robux',
    badge: 'POPULAR 🔥',
    gradient: 'from-red-600/30 to-zinc-950/80',
    borderHover: 'hover:border-red-500/50',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80',
    icon: '🧱',
  },
  {
    id: 'mlbb',
    title: 'Mobile Legends: Bang Bang',
    shortName: 'MLBB',
    genre: 'MOBA • 5v5',
    badge: 'HOT 🔥',
    gradient: 'from-blue-600/30 to-indigo-950/80',
    borderHover: 'hover:border-blue-500/50',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    icon: '⚔️',
  },
  {
    id: 'freefire',
    title: 'Free Fire',
    shortName: 'Free Fire',
    genre: 'Survival Shooter',
    badge: 'TOP SELLER',
    gradient: 'from-orange-600/30 to-red-950/80',
    borderHover: 'hover:border-orange-500/50',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    icon: '🔥',
  },
  {
    id: 'pubg',
    title: 'PUBG Mobile',
    shortName: 'PUBG',
    genre: 'Battle Royale',
    badge: 'HOT',
    gradient: 'from-amber-600/30 to-orange-950/80',
    borderHover: 'hover:border-amber-500/50',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    icon: '🎯',
  },
  {
    id: 'valorant',
    title: 'Valorant',
    shortName: 'Valorant',
    genre: 'Tactical FPS',
    badge: 'PC ESPORTS',
    gradient: 'from-rose-600/30 to-red-950/80',
    borderHover: 'hover:border-rose-500/50',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    icon: '⚡',
  },
  {
    id: 'genshin',
    title: 'Genshin Impact',
    shortName: 'Genshin',
    genre: 'Action RPG',
    badge: 'WHALE',
    gradient: 'from-cyan-600/30 to-blue-950/80',
    borderHover: 'hover:border-cyan-500/50',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    icon: '✨',
  },
];

export default function HomePage() {
  const { t, language } = useLanguage();
  const router = useRouter();

  const [featuredAccounts, setFeaturedAccounts] = useState<GameAccount[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [gamesRes, accountsRes] = await Promise.all([
          api.games.list().catch(() => []),
          api.accounts.list({ limit: 8 }).catch(() => ({ accounts: [] })),
        ]);
        setGames(gamesRes || []);
        if (accountsRes?.accounts?.length) {
          setFeaturedAccounts(accountsRes.accounts);
        }
      } catch (err) {
        console.warn('Failed to fetch live listings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/catalog');
    }
  };

  const displayedAccounts =
    selectedGameId === 'all'
      ? featuredAccounts
      : featuredAccounts.filter((acc) => {
          const game = games.find((g) => g.id === acc.gameId);
          return (
            acc.gameId === selectedGameId ||
            acc.game?.slug === selectedGameId ||
            game?.title.toLowerCase().includes(selectedGameId.toLowerCase()) ||
            acc.game?.title.toLowerCase().includes(selectedGameId.toLowerCase())
          );
        });

  return (
    <div
      className={`relative min-h-screen bg-[#0b0e14] overflow-hidden ${
        language === 'kh' ? 'font-kantumruy' : ''
      }`}
    >
      {/* Subtle Ambient Background Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#d4af37]/10 via-[#00e4f2]/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[800px] -left-40 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10">
        {/* =========================================================================
            SECTION 1: HERO - CLEAN GAMING MARKETPLACE WITH PROMINENT SEARCH
        ========================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left 7 Cols: High-converting Copy & Search Bar */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-[#151a23] px-3.5 py-1.5 rounded-full border border-white/[0.08] shadow-md mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider">
                  {t('heroBadge1')}
                </span>
                <span className="text-neutral-600">|</span>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  {t('heroBadge2')}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-normal leading-[1.3] sm:leading-[1.3] mb-5 text-white">
                {t('heroTitlePrefix')}{' '}
                <span className="bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#00e4f2] bg-clip-text text-transparent">
                  {t('heroTitleElite')}
                </span>{' '}
                {t('heroTitleMid')}{' '}
                <span className="text-[#00e4f2]">{t('heroTitleZeroRisk')}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-neutral-300 mb-8 max-w-xl leading-relaxed">
                {t('heroSubtitle')}
              </p>

              {/* Prominent Search Bar with Cyber Glow */}
              <form onSubmit={handleSearchSubmit} className="w-full max-w-xl mb-4">
                <div className="relative flex items-center bg-[#151a23] border border-white/[0.12] hover:border-[#f2ca50]/60 focus-within:border-[#f2ca50] rounded-2xl p-1.5 shadow-[0_0_25px_rgba(212,175,55,0.08)] hover:shadow-[0_0_35px_rgba(212,175,55,0.25)] transition-all">
                  <div className="pl-3.5 pr-2 text-neutral-400">
                    <Search className="w-5 h-5 text-[#f2ca50]" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('quickSearchPlaceholder')}
                    className="w-full bg-transparent text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none py-2.5 font-normal"
                  />
                  <button
                    type="submit"
                    className="shrink-0 px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all flex items-center gap-1.5"
                  >
                    <span>{language === 'kh' ? 'ស្វែងរក' : 'Search'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Popular Search Quick Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-8 text-xs text-neutral-400">
                <span className="font-semibold text-neutral-500 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  {language === 'kh' ? 'ពេញនិយម:' : 'Popular:'}
                </span>
                {['Roblox', 'Mobile Legends', 'Free Fire', 'PUBG Mobile', 'Valorant'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => router.push(`/catalog?q=${encodeURIComponent(tag)}`)}
                    className="px-2.5 py-1 rounded-lg bg-[#151a23] hover:bg-[#1f2533] text-neutral-300 hover:text-[#f2ca50] border border-white/[0.06] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* 3 Simple Trust Value Badges Under Hero */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl">
                <div className="flex items-center gap-2.5 bg-[#151a23]/80 px-3.5 py-3 rounded-xl border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{t('slaInstant')}</span>
                    <span className="text-[11px] text-neutral-400 block">{t('slaInstantSub')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-[#151a23]/80 px-3.5 py-3 rounded-xl border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-lg bg-[#f2ca50]/10 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-[#f2ca50]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{t('slaBonds')}</span>
                    <span className="text-[11px] text-neutral-400 block">{t('slaBondsSub')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-[#151a23]/80 px-3.5 py-3 rounded-xl border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-lg bg-[#00e4f2]/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#00e4f2]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{t('slaAntiRecall')}</span>
                    <span className="text-[11px] text-neutral-400 block">{t('slaAntiRecallSub')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: 3D Staggered Infinite Marquee Animation */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <Hero3DMarquee />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: POPULAR GAMES CATEGORIES GRID (FRONT & CENTER)
        ========================================================================== */}
        <section className="border-t border-white/[0.08] bg-[#0e121a] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f2ca50] uppercase tracking-wider mb-2">
                  <Gamepad2 className="w-4 h-4" />
                  <span>{t('topGamesTitle')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {t('topGamesSubtitle')}
                </h2>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f2ca50] hover:text-white transition-colors"
              >
                <span>{language === 'kh' ? 'មើលហ្គេមទាំងអស់' : 'View All Games'}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Game Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {POPULAR_GAMES.map((game) => (
                <div
                  key={game.id}
                  onClick={() => router.push(`/catalog?game=${game.id}`)}
                  className={`group relative bg-[#151a23] hover:bg-[#1a202c] rounded-2xl border border-white/[0.08] ${game.borderHover} p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl`}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl">{game.icon}</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/[0.06] text-neutral-300">
                      {game.badge}
                    </span>
                  </div>

                  {/* Thumbnail Image */}
                  <div className="w-full h-24 rounded-xl overflow-hidden mb-3 relative bg-[#0b0e14]">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151a23] via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Title & Genre */}
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#f2ca50] transition-colors truncate">
                      {game.shortName}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{game.genre}</p>
                  </div>

                  {/* Bottom Action Indicator */}
                  <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#00e4f2] font-semibold">
                    <span>{language === 'kh' ? 'ចូលមើល' : 'Browse'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2.5: FEATURED DIRECT IN-GAME TOP-UP (NEW FEATURE)
        ========================================================================== */}
        <section className="py-16 border-t border-white/[0.08] bg-gradient-to-b from-[#0f141f] via-[#0b0e14] to-[#0b0e14] relative overflow-hidden">
          {/* Ambient Gold Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-[#d4af37]/5 blur-3xl rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <Zap className="w-3.5 h-3.5 animate-bounce" />
                  <span>{language === 'kh' ? 'មុខងារថ្មី • FEATURE TOP UP' : 'NEW FEATURE • DIRECT GAME TOP UP'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  {language === 'kh' ? (
                    <>
                      បញ្ចូលលុយ <span className="bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] bg-clip-text text-transparent">Robux & ពេជ្រហ្គេម</span> ចូល ID ភ្លាមៗ
                    </>
                  ) : (
                    <>
                      Instant <span className="bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] bg-clip-text text-transparent">In-Game Top Up</span> Direct to Player ID
                    </>
                  )}
                </h2>
                <p className="text-neutral-400 text-sm mt-2 max-w-2xl leading-relaxed">
                  {language === 'kh'
                    ? 'បញ្ចូល Robux, ពេជ្រ MLBB, Free Fire, PUBG UC ចូល ID ផ្ទាល់ ស្កេនបង់ប្រាក់តាម Bakong KHQR (ABA, Wing, Bakong...) ទទួលភ្លាមៗក្នុង ៣ វិនាទី មិនបាច់ប្រាប់ Password!'
                    : 'Reload Robux, MLBB Diamonds, Free Fire, and PUBG UC directly into your character. 100% automated delivery within 3 seconds via Bakong KHQR.'}
                </p>
              </div>

              <Link
                href="/top-up"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-black font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all shrink-0"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>{language === 'kh' ? 'ចូលទៅកាន់ទំព័រ Top Up ទាំងអស់' : 'Open Full Top Up Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Top-Up Cards Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Roblox Robux */}
              <div
                onClick={() => router.push('/top-up')}
                className="group relative bg-[#131824] hover:bg-[#182030] p-5 rounded-2xl border border-white/[0.08] hover:border-[#d4af37]/60 transition-all cursor-pointer shadow-xl flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🧱</span>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                        Roblox (Robux)
                      </h3>
                      <span className="text-[10px] text-neutral-400 font-mono">Instant Username Top Up</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    HOT 🔥
                  </span>
                </div>

                <div className="space-y-2 py-3 border-t border-b border-white/[0.06] text-xs">
                  <div className="flex justify-between items-center bg-[#0d111a] px-3 py-2 rounded-lg">
                    <span className="text-neutral-300 font-medium">800 Robux</span>
                    <span className="font-black text-[#f2ca50]">$8.90</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0d111a] px-3 py-2 rounded-lg">
                    <span className="text-neutral-300 font-medium">1,700 Robux</span>
                    <span className="font-black text-[#f2ca50]">$18.50</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span>{language === 'kh' ? 'បញ្ចូល Robux ឥឡូវនេះ' : 'Top Up Robux Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Card 2: MLBB Diamonds */}
              <div
                onClick={() => router.push('/top-up')}
                className="group relative bg-[#131824] hover:bg-[#182030] p-5 rounded-2xl border border-white/[0.08] hover:border-blue-500/60 transition-all cursor-pointer shadow-xl flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">⚔️</span>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                        Mobile Legends (MLBB)
                      </h3>
                      <span className="text-[10px] text-neutral-400 font-mono">Player ID + Zone ID</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    POPULAR
                  </span>
                </div>

                <div className="space-y-2 py-3 border-t border-b border-white/[0.06] text-xs">
                  <div className="flex justify-between items-center bg-[#0d111a] px-3 py-2 rounded-lg">
                    <span className="text-neutral-300 font-medium">Weekly Diamond Pass</span>
                    <span className="font-black text-[#f2ca50]">$1.85</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0d111a] px-3 py-2 rounded-lg">
                    <span className="text-neutral-300 font-medium">706 💎 (625 + 81 Bonus)</span>
                    <span className="font-black text-[#f2ca50]">$10.90</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span>{language === 'kh' ? 'បញ្ចូលពេជ្រ MLBB' : 'Top Up MLBB Diamonds'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Card 3: Free Fire */}
              <div
                onClick={() => router.push('/top-up')}
                className="group relative bg-[#131824] hover:bg-[#182030] p-5 rounded-2xl border border-white/[0.08] hover:border-orange-500/60 transition-all cursor-pointer shadow-xl flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors">
                        Free Fire
                      </h3>
                      <span className="text-[10px] text-neutral-400 font-mono">UID Direct Top Up</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    CHEAP
                  </span>
                </div>

                <div className="space-y-2 py-3 border-t border-b border-white/[0.06] text-xs">
                  <div className="flex justify-between items-center bg-[#0d111a] px-3 py-2 rounded-lg">
                    <span className="text-neutral-300 font-medium">520 💎 Diamonds</span>
                    <span className="font-black text-[#f2ca50]">$4.40</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0d111a] px-3 py-2 rounded-lg">
                    <span className="text-neutral-300 font-medium">1,060 💎 Diamonds</span>
                    <span className="font-black text-[#f2ca50]">$8.80</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span>{language === 'kh' ? 'បញ្ចូលពេជ្រ Free Fire' : 'Top Up Free Fire'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Card 4: PUBG Mobile UC */}
              <div
                onClick={() => router.push('/top-up')}
                className="group relative bg-[#131824] hover:bg-[#182030] p-5 rounded-2xl border border-white/[0.08] hover:border-amber-500/60 transition-all cursor-pointer shadow-xl flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🪙</span>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                        PUBG Mobile (UC)
                      </h3>
                      <span className="text-[10px] text-neutral-400 font-mono">Character ID Top Up</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    INSTANT
                  </span>
                </div>

                <div className="space-y-2 py-3 border-t border-b border-white/[0.06] text-xs">
                  <div className="flex justify-between items-center bg-[#0d111a] px-3 py-2 rounded-lg">
                    <span className="text-neutral-300 font-medium">325 UC (300+25)</span>
                    <span className="font-black text-[#f2ca50]">$4.80</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0d111a] px-3 py-2 rounded-lg">
                    <span className="text-neutral-300 font-medium">660 UC (600+60)</span>
                    <span className="font-black text-[#f2ca50]">$9.50</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span>{language === 'kh' ? 'បញ្ចូល UC PUBG Mobile' : 'Top Up PUBG Mobile'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: HOW IT WORKS - 3 SIMPLE STEPS (BUYER & SELLER TABS)
        ========================================================================== */}
        <section id="how-it-works" className="py-20 border-t border-white/[0.08] bg-[#0b0e14]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#f2ca50] uppercase tracking-widest block mb-2">
                {t('howItWorksTitle')}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {language === 'kh' ? 'ងាយស្រួលយល់ រហ័ស និងមានសុវត្ថិភាព ៣ ជំហាន' : '3 Simple Steps to Buy & Sell Safely'}
              </h2>
              <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
                {t('howItWorksSubtitle')}
              </p>

              {/* Buyer / Seller Toggle Buttons */}
              <div className="inline-flex p-1 bg-[#151a23] rounded-2xl border border-white/[0.08] mt-6">
                <button
                  onClick={() => setActiveTab('buy')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'buy'
                      ? 'bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t('tabBuyer')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('sell')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'sell'
                      ? 'bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t('tabSeller')}</span>
                </button>
              </div>
            </div>

            {/* Steps Cards */}
            {activeTab === 'buy' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="bg-[#151a23] p-7 rounded-2xl border border-white/[0.08] hover:border-[#f2ca50]/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#f2ca50]/10 border border-[#f2ca50]/20 flex items-center justify-center mb-5">
                      <span className="text-lg font-black text-[#f2ca50]">1</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{t('buyStep1Title')}</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      {t('buyStep1Desc')}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{language === 'kh' ? 'ពិនិត្យមើលរូបភាព និងព័ត៌មានលម្អិត' : 'Transparent account specs & screenshots'}</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-[#151a23] p-7 rounded-2xl border border-white/[0.08] hover:border-[#00e4f2]/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#00e4f2]/10 border border-[#00e4f2]/20 flex items-center justify-center mb-5">
                      <span className="text-lg font-black text-[#00e4f2]">2</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{t('buyStep2Title')}</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      {t('buyStep2Desc')}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-neutral-400">
                    <Shield className="w-4 h-4 text-[#00e4f2] shrink-0" />
                    <span>{language === 'kh' ? 'ប្រាក់ជាប់គាំងក្នុង Escrow មិនខ្លាចបោក' : 'Funds held securely in Escrow vault'}</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-[#151a23] p-7 rounded-2xl border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                      <span className="text-lg font-black text-emerald-400">3</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{t('buyStep3Title')}</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      {t('buyStep3Desc')}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-neutral-400">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{language === 'kh' ? 'ធានាសងប្រាក់វិញ ១០០% បើមានបញ្ហា' : '100% Anti-Recall Money-Back SLA'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="bg-[#151a23] p-7 rounded-2xl border border-white/[0.08] hover:border-[#f2ca50]/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#f2ca50]/10 border border-[#f2ca50]/20 flex items-center justify-center mb-5">
                      <span className="text-lg font-black text-[#f2ca50]">1</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{t('sellStep1Title')}</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      {t('sellStep1Desc')}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{language === 'kh' ? 'ដាក់លក់ងាយស្រួលក្នុងរយៈពេល ២ នាទី' : 'List in less than 2 minutes'}</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-[#151a23] p-7 rounded-2xl border border-white/[0.08] hover:border-[#00e4f2]/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#00e4f2]/10 border border-[#00e4f2]/20 flex items-center justify-center mb-5">
                      <span className="text-lg font-black text-[#00e4f2]">2</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{t('sellStep2Title')}</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      {t('sellStep2Desc')}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-neutral-400">
                    <Lock className="w-4 h-4 text-[#00e4f2] shrink-0" />
                    <span>{language === 'kh' ? 'ប្រព័ន្ធធានាប្រាក់មុនពេលផ្ទេរ' : 'Payment secured prior to handover'}</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-[#151a23] p-7 rounded-2xl border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                      <span className="text-lg font-black text-emerald-400">3</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{t('sellStep3Title')}</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      {t('sellStep3Desc')}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-neutral-400">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{language === 'kh' ? 'ដកប្រាក់តាម ABA / Bakong គ្មានកម្រៃសេវា' : 'Withdraw straight to local bank'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: FEATURED ACCOUNTS GRID & FILTER PILLS
        ========================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f2ca50] uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>{t('catalogSubtitle')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {t('catalogTitle')}
              </h2>
            </div>

            {/* Game Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full">
              <button
                onClick={() => setSelectedGameId('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                  selectedGameId === 'all'
                    ? 'bg-[#f2ca50] text-[#0b0e14] shadow-[0_0_15px_rgba(242,202,80,0.3)]'
                    : 'bg-[#151a23] text-neutral-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                {t('allGames')}
              </button>
              {games.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGameId(g.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                    selectedGameId === g.id
                      ? 'bg-[#f2ca50] text-[#0b0e14] shadow-[0_0_15px_rgba(242,202,80,0.3)]'
                      : 'bg-[#151a23] text-neutral-400 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  {g.title}
                </button>
              ))}
            </div>
          </div>

          {/* Accounts Grid */}
          {isLoading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-[#f2ca50] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-neutral-400 font-mono">
                {language === 'kh' ? 'កំពុងទាញយកទិន្នន័យគណនី...' : 'Loading verified listings...'}
              </p>
            </div>
          ) : displayedAccounts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedAccounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#151a23]/50 rounded-2xl border border-white/[0.06] p-8">
              <Shield className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-neutral-200">
                {language === 'kh' ? 'មិនមានគណនីក្នុងប្រភេទនេះនៅឡើយទេ' : 'No active listings found'}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                {language === 'kh'
                  ? 'អ្នកអាចក្លាយជាអ្នកដំបូងគេដែលដាក់លក់គណនីក្នុងប្រភេទហ្គេមនេះ ដោយមិនគិតថ្លៃសេវា!'
                  : 'Be the first to list an account under this game category with 0% platform fee!'}
              </p>
              <Link
                href="/sell"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#f2ca50] text-[#0b0e14]"
              >
                {t('ctaListAsset')}
              </Link>
            </div>
          )}

          {/* View Full Catalog Button */}
          <div className="mt-12 text-center">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#151a23] hover:bg-[#1d222e] text-[#f2ca50] hover:text-white border border-[#d4af37]/30 hover:border-[#d4af37] text-xs font-bold uppercase tracking-wider transition-all shadow-lg"
            >
              <span>{t('ctaExplore')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: WHY GAMERS TRUST NEXUS (TRUST PILLARS - NO CRYPTO JARGON)
        ========================================================================== */}
        <section className="bg-gradient-to-b from-[#10141d] to-[#0b0e14] border-t border-white/[0.06] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#00e4f2] uppercase tracking-widest block mb-2">
                100% SAFETY GUARANTEE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {t('whyTrustTitle')}
              </h2>
              <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
                {t('whyTrustSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] hover:border-[#f2ca50]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#f2ca50]/10 border border-[#f2ca50]/20 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-[#f2ca50]" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{t('trust1Title')}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{t('trust1Desc')}</p>
                </div>
                <span className="text-[10px] font-bold text-[#f2ca50] mt-4 uppercase tracking-wider">
                  {language === 'kh' ? 'ការពារអ្នកទិញ ១០០%' : '100% Buyer Protection'}
                </span>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] hover:border-[#00e4f2]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#00e4f2]/10 border border-[#00e4f2]/20 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-[#00e4f2]" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{t('trust2Title')}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{t('trust2Desc')}</p>
                </div>
                <span className="text-[10px] font-bold text-[#00e4f2] mt-4 uppercase tracking-wider">
                  {language === 'kh' ? 'ប្រព័ន្ធស្វ័យប្រវត្តិ ២៤/៧' : 'Automated Instant Delivery'}
                </span>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{t('trust3Title')}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{t('trust3Desc')}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 mt-4 uppercase tracking-wider">
                  {language === 'kh' ? 'គាំទ្រ ABA, Bakong, Wing' : 'Local Cambodian Banking'}
                </span>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] hover:border-[#dcb8ff]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#dcb8ff]/10 border border-[#dcb8ff]/20 flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6 text-[#dcb8ff]" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{t('trust4Title')}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{t('trust4Desc')}</p>
                </div>
                <span className="text-[10px] font-bold text-[#dcb8ff] mt-4 uppercase tracking-wider">
                  {language === 'kh' ? 'ឆ្លើយតបរហ័ស គ្រប់ពេល' : 'Instant Telegram Response'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: TELEGRAM SUPPORT & CALL TO ACTION
        ========================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#151a23] via-[#1c2230] to-[#151a23] border border-[#d4af37]/30 p-10 sm:p-14 text-center shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-[#f2ca50] uppercase tracking-widest block mb-3">
                {language === 'kh'
                  ? 'ចូលរួមជាមួយអ្នកលេងហ្គេមរាប់ពាន់នាក់'
                  : 'JOIN THOUSANDS OF TRUSTED GAMERS'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-4">
                {language === 'kh'
                  ? 'ត្រៀមខ្លួនទិញ ឬលក់គណនីហ្គេមរបស់អ្នកហើយឬនៅ?'
                  : 'Ready to Buy or Sell Your Game Account?'}
              </h2>
              <p className="text-neutral-300 text-xs sm:text-sm mb-8 leading-relaxed">
                {language === 'kh'
                  ? 'ស្វែងរកគណនីហ្គេមដែលបានផ្ទៀងផ្ទាត់ត្រឹមត្រូវ ឬដាក់លក់គណនីរបស់អ្នកជាមួយប្រព័ន្ធ Escrow ការពារ ១០០% និងដកប្រាក់បានភ្លាមៗ។'
                  : 'Browse verified game accounts or list your own account with full escrow protection and instant bank payouts.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/catalog"
                  className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t('ctaExplore')}</span>
                </Link>
                <Link
                  href="/sell"
                  className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0b0e14] text-neutral-200 hover:text-white border border-white/[0.1] hover:border-white/[0.2] transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-[#00e4f2]" />
                  <span>{t('ctaListAsset')}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
