'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface MarqueeCardData {
  title: string;
  game: string;
  tier: string;
  price: string;
  image: string;
  delivery: 'instant' | 'escrow';
  bind: string;
  query: string;
}

const sampleCardsColumn1: MarqueeCardData[] = [
  {
    title: 'Blox Fruits Max Lv 2550 + Perm Kitsune & Dough V2',
    game: 'ROBLOX',
    tier: 'MAX LEVEL 2550',
    price: '$35',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80',
    delivery: 'instant',
    bind: 'Clean First-Mail OGO',
    query: 'Roblox',
  },
  {
    title: 'Mythic Immortal 185★ All Collector Skins',
    game: 'MLBB',
    tier: 'MYTHIC GLORY',
    price: '$89',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    delivery: 'instant',
    bind: 'Moonton Clean',
    query: 'Mobile Legends',
  },
  {
    title: 'Old S1 Sakura + Hip Hop Bundle + Max EVO MP40',
    game: 'FREE FIRE',
    tier: 'HEROIC RANK',
    price: '$49',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    delivery: 'instant',
    bind: 'Clean Gmail Bind',
    query: 'Free Fire',
  },
];

const sampleCardsColumn2: MarqueeCardData[] = [
  {
    title: 'Adopt Me Mega Neon Shadow Dragon + Pet Sim 99',
    game: 'ROBLOX',
    tier: 'WHALE PETS',
    price: '$65',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    delivery: 'instant',
    bind: 'Pin Unset Clean',
    query: 'Roblox',
  },
  {
    title: 'Glacier M416 Lv7 Max + Pharaoh X-Suit 6-Star',
    game: 'PUBG MOBILE',
    tier: 'CONQUEROR',
    price: '$110',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    delivery: 'instant',
    bind: 'Single Twitter Bind',
    query: 'PUBG Mobile',
  },
  {
    title: 'Radiant #140 Kuronami Vandal + Arcane Sheriff',
    game: 'VALORANT',
    tier: 'RADIANT',
    price: '$120',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    delivery: 'instant',
    bind: 'Riot Clean OGO',
    query: 'Valorant',
  },
];

const sampleCardsColumn3: MarqueeCardData[] = [
  {
    title: 'King Legacy Max Lv + Dark Blade Perm + Robux',
    game: 'ROBLOX',
    tier: 'MAX BOUNTY',
    price: '$29',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80',
    delivery: 'instant',
    bind: '100% Anti-Recall',
    query: 'Roblox',
  },
  {
    title: 'AR 60 Whale C6 Furina + C6 Arlecchino',
    game: 'GENSHIN',
    tier: 'AR 60 WHALE',
    price: '$180',
    image: 'https://images.unsplash.com/photo-1612287233207-6b22998a445b?auto=format&fit=crop&w=600&q=80',
    delivery: 'instant',
    bind: 'Clean Hoyoverse',
    query: 'Genshin',
  },
  {
    title: 'Gusion Legend Skin + 550 Skins Full Emblems',
    game: 'MLBB',
    tier: 'MYTHIC IMMORTAL',
    price: '$75',
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80',
    delivery: 'instant',
    bind: 'Clean Moonton',
    query: 'Mobile Legends',
  },
];

function MiniCard({ card }: { card: MarqueeCardData }) {
  return (
    <Link
      href={`/catalog?q=${encodeURIComponent(card.query)}`}
      className="w-full bg-[#151a23]/95 hover:bg-[#1d222e] rounded-xl border border-white/[0.08] hover:border-[#d4af37]/70 p-3 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all duration-300 transform hover:scale-[1.03] flex flex-col gap-2 shrink-0 group cursor-pointer block"
    >
      <div className="relative w-full h-28 rounded-lg overflow-hidden bg-[#0b0e14]">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151a23] via-transparent to-black/25" />
        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-[#0b0e14]/90 text-[#f2ca50] border border-[#d4af37]/30 shadow-sm">
          {card.game}
        </span>
        <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-[#00e4f2]/20 text-[#00e4f2] border border-[#00e4f2]/30 backdrop-blur-sm">
          {card.tier}
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-bold text-neutral-100 group-hover:text-[#f2ca50] transition-colors truncate">
          {card.title}
        </h4>
        <div className="flex items-center justify-between text-[10px] text-neutral-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            {card.bind}
          </span>
          <span className="font-black text-[#f2ca50] text-sm">{card.price}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Hero3DMarquee() {
  return (
    <div className="relative w-full h-[540px] overflow-hidden rounded-3xl hero-3d-wrapper flex items-center justify-center pointer-events-auto">
      {/* Background Cyber Glow & Radial Energy Grid */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00e4f2]/10 via-[#d4af37]/10 to-transparent rounded-3xl pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#f2ca50]/15 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#00e4f2]/15 rounded-full blur-[80px] pointer-events-none animate-pulse" />

      {/* Floating Live Indicator Badge */}
      <div className="absolute top-4 z-20 px-3 py-1 rounded-full bg-[#151a23]/90 border border-white/[0.1] backdrop-blur-md shadow-lg flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-200">
          LIVE VERIFIED INVENTORY
        </span>
      </div>

      {/* 3D Staggered Animated Grid */}
      <div className="w-full h-[680px] grid grid-cols-3 gap-3.5 hero-3d-grid">
        {/* Column 1: Moves Down */}
        <div className="flex flex-col gap-3.5 animate-marquee-down pause-hover">
          {[...sampleCardsColumn1, ...sampleCardsColumn1, ...sampleCardsColumn1].map((card, idx) => (
            <MiniCard key={`col1-${idx}`} card={card} />
          ))}
        </div>

        {/* Column 2: Moves Up */}
        <div className="flex flex-col gap-3.5 animate-marquee-up pause-hover">
          {[...sampleCardsColumn2, ...sampleCardsColumn2, ...sampleCardsColumn2].map((card, idx) => (
            <MiniCard key={`col2-${idx}`} card={card} />
          ))}
        </div>

        {/* Column 3: Moves Down Slow */}
        <div className="flex flex-col gap-3.5 animate-marquee-down-slow pause-hover">
          {[...sampleCardsColumn3, ...sampleCardsColumn3, ...sampleCardsColumn3].map((card, idx) => (
            <MiniCard key={`col3-${idx}`} card={card} />
          ))}
        </div>
      </div>

      {/* Top & Bottom seamless gradient masks */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#0b0e14] via-[#0b0e14]/70 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/70 to-transparent pointer-events-none z-10" />
    </div>
  );
}
