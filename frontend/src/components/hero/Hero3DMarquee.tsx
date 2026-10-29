'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface TopUpMarqueeItem {
  game: string;
  item: string;
  badge: string;
  badgeColor: string;
  price: string;
  priceKHR: string;
  image: string;
}

const column1Items: TopUpMarqueeItem[] = [
  {
    game: 'MLBB',
    item: 'Weekly Diamond Pass',
    badge: '🔥 +400% VALUE',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    price: '$1.85',
    priceKHR: '~7,500 ៛',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
  },
  {
    game: 'ROBLOX',
    item: '800 Robux Direct',
    badge: '⚡ 3S NO PASS',
    badgeColor: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
    price: '$8.90',
    priceKHR: '~36,500 ៛',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80',
  },
  {
    game: 'FREE FIRE',
    item: '520 Diamonds Pack',
    badge: '💎 POPULAR',
    badgeColor: 'bg-orange-400/20 text-orange-300 border-orange-400/30',
    price: '$4.40',
    priceKHR: '~18,000 ៛',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
  },
  {
    game: 'CODM',
    item: '880 CP + Battle Pass',
    badge: '🪙 FAST CP',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    price: '$9.50',
    priceKHR: '~38,900 ៛',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
  },
];

const column2Items: TopUpMarqueeItem[] = [
  {
    game: 'PUBG MOBILE',
    item: '660 UC Royale Pass',
    badge: '🪙 INSTANT UC',
    badgeColor: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
    price: '$9.50',
    priceKHR: '~38,900 ៛',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
  },
  {
    game: 'GENSHIN',
    item: 'Welkin Moon + 300 GC',
    badge: '✨ +600% VALUE',
    badgeColor: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
    price: '$4.70',
    priceKHR: '~19,200 ៛',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
  },
  {
    game: 'WILD RIFT',
    item: '1,000 Wild Cores',
    badge: '💎 HOT SKINS',
    badgeColor: 'bg-sky-400/20 text-sky-300 border-sky-400/30',
    price: '$9.80',
    priceKHR: '~40,000 ៛',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  },
  {
    game: 'MLBB',
    item: '706 Diamonds (625+81)',
    badge: '🔥 BEST SELLER',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    price: '$10.90',
    priceKHR: '~44,600 ៛',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
  },
];

const column3Items: TopUpMarqueeItem[] = [
  {
    game: 'VALORANT',
    item: '2,050 VP Bundle',
    badge: '🎯 RIOT POINTS',
    badgeColor: 'bg-rose-400/20 text-rose-300 border-rose-400/30',
    price: '$19.00',
    priceKHR: '~77,900 ៛',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  },
  {
    game: 'HOK',
    item: '800 Tokens Pack',
    badge: '👑 TOKENS',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    price: '$8.90',
    priceKHR: '~36,500 ៛',
    image: 'https://images.unsplash.com/photo-1612287233207-6b22998a445b?auto=format&fit=crop&w=600&q=80',
  },
  {
    game: 'BLOOD STRIKE',
    item: '1,000 Gold + Pass',
    badge: '⚡ FAST TOP-UP',
    badgeColor: 'bg-red-400/20 text-red-300 border-red-400/30',
    price: '$8.90',
    priceKHR: '~36,500 ៛',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
  },
  {
    game: 'ROBLOX',
    item: '1,700 Robux Direct',
    badge: '💎 WHALE PACK',
    badgeColor: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
    price: '$18.50',
    priceKHR: '~75,800 ៛',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80',
  },
];

function TopUpMiniCard({ item }: { item: TopUpMarqueeItem }) {
  return (
    <a
      href="#hot-games"
      className="w-full bg-[#0d121c]/95 hover:bg-[#141b28] rounded-2xl border border-white/[0.08] hover:border-[#f2ca50]/70 p-3 shadow-lg hover:shadow-[0_0_25px_rgba(242,202,80,0.3)] transition-all duration-300 transform hover:scale-[1.03] flex flex-col gap-2 shrink-0 group cursor-pointer block"
    >
      <div className="relative w-full h-24 rounded-xl overflow-hidden bg-[#07090e]">
        <img
          src={item.image}
          alt={item.item}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d121c] via-transparent to-black/30" />
        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-[#07090e]/90 text-[#f2ca50] border border-[#f2ca50]/30 shadow-sm">
          {item.game}
        </span>
        <span className={`absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border backdrop-blur-sm ${item.badgeColor}`}>
          {item.badge}
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-extrabold text-white group-hover:text-[#f2ca50] transition-colors truncate">
          {item.item}
        </h4>
        <div className="flex items-center justify-between text-[10px]">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>KHQR 3s</span>
          </span>
          <div className="text-right">
            <span className="font-black text-[#f2ca50] text-sm block leading-none">{item.price}</span>
            <span className="text-[9px] text-neutral-400 font-semibold">{item.priceKHR}</span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function Hero3DMarquee() {
  return (
    <div className="relative w-full h-[520px] overflow-hidden rounded-3xl hero-3d-wrapper flex items-center justify-center pointer-events-auto">
      {/* Background Cyber Glow & Radial Energy Grid */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00e4f2]/10 via-[#f2ca50]/10 to-transparent rounded-3xl pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#f2ca50]/15 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#00e4f2]/15 rounded-full blur-[80px] pointer-events-none animate-pulse" />

      {/* Floating Live Indicator Badge */}
      <div className="absolute top-3 z-20 px-3.5 py-1 rounded-full bg-[#0d121c]/95 border border-[#f2ca50]/30 backdrop-blur-md shadow-lg flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[10px] font-black tracking-wider uppercase text-amber-300">
          ⚡ 100% AUTOMATED INSTANT RELOADS
        </span>
      </div>

      {/* 3D Staggered Animated Grid */}
      <div className="w-full h-[680px] grid grid-cols-3 gap-3 hero-3d-grid">
        {/* Column 1: Moves Down */}
        <div className="flex flex-col gap-3 animate-marquee-down pause-hover">
          {[...column1Items, ...column1Items, ...column1Items].map((item, idx) => (
            <TopUpMiniCard key={`col1-${idx}`} item={item} />
          ))}
        </div>

        {/* Column 2: Moves Up */}
        <div className="flex flex-col gap-3 animate-marquee-up pause-hover">
          {[...column2Items, ...column2Items, ...column2Items].map((item, idx) => (
            <TopUpMiniCard key={`col2-${idx}`} item={item} />
          ))}
        </div>

        {/* Column 3: Moves Down Slow */}
        <div className="flex flex-col gap-3 animate-marquee-down-slow pause-hover">
          {[...column3Items, ...column3Items, ...column3Items].map((item, idx) => (
            <TopUpMiniCard key={`col3-${idx}`} item={item} />
          ))}
        </div>
      </div>

      {/* Top & Bottom seamless gradient masks */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#07090e] via-[#07090e]/80 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#07090e] via-[#07090e]/80 to-transparent pointer-events-none z-10" />
    </div>
  );
}
