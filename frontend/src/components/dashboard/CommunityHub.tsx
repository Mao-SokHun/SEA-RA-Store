'use client';

import React from 'react';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  Send,
  Zap,
  ExternalLink,
  Crown,
  ShieldCheck,
  CheckCircle2,
  Users,
  Gamepad2,
  Tag,
  ArrowRight,
} from 'lucide-react';

const TOP_WHALES = [
  {
    rank: 1,
    name: '⚡Shadow_Assassin⚡',
    badge: '👑 GOLD WHALE',
    badgeColor: 'from-amber-400 to-yellow-500 text-black',
    game: 'Mobile Legends',
    volume: '85,400 💎',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100',
  },
  {
    rank: 2,
    name: 'KuroNami_Pro',
    badge: '🥈 RADIANT VIP',
    badgeColor: 'from-cyan-400 to-blue-500 text-black',
    game: 'Valorant Points',
    volume: '24,500 VP',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
  },
  {
    rank: 3,
    name: 'Blox_King_KH',
    badge: '🥉 BLOX FRUITS',
    badgeColor: 'from-orange-400 to-red-500 text-white',
    game: 'Roblox Robux',
    volume: '45,000 R$',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
  },
  {
    rank: 4,
    name: 'Viper_Sniper',
    badge: 'MYTHIC GLORY',
    badgeColor: 'from-purple-400 to-indigo-500 text-white',
    game: 'MLBB Weekly Pass',
    volume: '28,000 💎',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    rank: 5,
    name: 'DragonLord_KH',
    badge: 'CONQUEROR',
    badgeColor: 'from-emerald-400 to-teal-500 text-black',
    game: 'PUBG Mobile UC',
    volume: '18,500 UC',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100',
  },
];

const FLASH_DEALS = [
  {
    id: '1',
    title: 'MLBB Weekly Diamond Pass',
    game: 'Mobile Legends: Bang Bang',
    badge: '🔥 -40% PROMO',
    price: '$1.85',
    origPrice: '$3.00',
    priceKHR: '7,500 ៛',
    bonus: '+400% Value (210 Diamonds)',
    icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150',
    gameId: '1',
  },
  {
    id: '7',
    title: 'Roblox 1,000 Robux Direct',
    game: 'Roblox',
    badge: '⚡ BEST SELLER',
    price: '$11.00',
    origPrice: '$13.50',
    priceKHR: '45,100 ៛',
    bonus: 'Direct to @Username',
    icon: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=150',
    gameId: '7',
  },
  {
    id: '2',
    title: 'PUBG 660 UC Royale Pass',
    game: 'PUBG Mobile',
    badge: '🪙 INSTANT UC',
    price: '$9.50',
    origPrice: '$11.00',
    priceKHR: '38,900 ៛',
    bonus: 'Unlock Season Royale Pass',
    icon: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150',
    gameId: '2',
  },
];

export default function CommunityHub({
  onSelectGame,
}: {
  onSelectGame: (gameId: string) => void;
}) {
  return (
    <section className="mb-14 scroll-mt-24">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00e4f2]" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
              COMMUNITY HUB & VIP LEADERBOARD
            </h2>
          </div>
          <p className="text-xs text-neutral-400">
            តារាងអ្នកលេងហ្គេម VIP ប្រចាំខែ • កញ្ចប់ប្រូម៉ូសិនពិសេស • ជំនួយអតិថិជន ២៤/៧
          </p>
        </div>
      </div>

      {/* 3-Widget Layout (Sample 1 & Sample 2 Composition) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* =================================================================== */}
        {/* WIDGET 1: TOP GAMERS / VIP WHALES LEADERBOARD (Sample 2 Style)     */}
        {/* =================================================================== */}
        <div className="bg-[#0c1018] rounded-3xl border border-white/[0.08] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  TOP GAMERS OF THE MONTH
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                OCTOBER 2026
              </span>
            </div>

            <div className="space-y-2">
              {TOP_WHALES.map((whale) => (
                <div
                  key={whale.rank}
                  className="flex items-center justify-between p-2 rounded-2xl bg-[#111724]/60 hover:bg-[#151c2c] border border-white/[0.04] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    {/* Rank Badge */}
                    <span
                      className={`w-5 h-5 rounded-lg flex items-center justify-center font-black text-[10px] ${
                        whale.rank === 1
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-black shadow-sm'
                          : whale.rank === 2
                          ? 'bg-slate-300 text-black'
                          : whale.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-white/[0.06] text-neutral-400'
                      }`}
                    >
                      {whale.rank}
                    </span>

                    {/* Avatar */}
                    <img
                      src={whale.avatar}
                      alt={whale.name}
                      className="w-7 h-7 rounded-xl object-cover border border-white/[0.1]"
                    />

                    <div>
                      <p className="text-xs font-black text-white group-hover:text-[#f2ca50] transition-colors truncate max-w-[110px] sm:max-w-[130px]">
                        {whale.name}
                      </p>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-gradient-to-r ${whale.badgeColor}`}>
                        {whale.badge}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-[#00e4f2] block">
                      {whale.volume}
                    </span>
                    <span className="text-[9px] text-neutral-400">
                      {whale.game}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-white/[0.06] text-center">
            <span className="text-[10px] text-neutral-400">
              ⚡ បញ្ចូលលុយដើម្បីឡើងចំណាត់ថ្នាក់ VIP Whales ប្រចាំខែ
            </span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* WIDGET 2: FLASH PROMO PACKAGES (Sample 1 Featured Deals Style)      */}
        {/* =================================================================== */}
        <div className="bg-[#0c1018] rounded-3xl border border-white/[0.08] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  EXCLUSIVE FLASH DEALS
                </h3>
              </div>
              <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full border border-orange-400/20">
                LIMITED
              </span>
            </div>

            <div className="space-y-3">
              {FLASH_DEALS.map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => onSelectGame(deal.gameId)}
                  className="p-2.5 rounded-2xl bg-[#111724]/80 hover:bg-[#151c2c] border border-white/[0.05] hover:border-[#f2ca50]/40 transition-all cursor-pointer group flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={deal.icon}
                      alt={deal.title}
                      className="w-10 h-10 rounded-xl object-cover border border-white/[0.08] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          {deal.badge}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-white group-hover:text-[#f2ca50] transition-colors line-clamp-1 mt-0.5">
                        {deal.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400 line-clamp-1">
                        {deal.bonus}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-[#f2ca50] block">
                      {deal.price}
                    </span>
                    <span className="text-[9px] text-neutral-500 line-through block leading-none">
                      {deal.origPrice}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold">
                      {deal.priceKHR}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectGame('1')}
            className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-amber-400/20 to-yellow-500/20 hover:from-amber-400/30 hover:to-yellow-500/30 border border-amber-400/30 text-amber-300 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>មើលកញ្ចប់ទាំងអស់ (VIEW ALL PACKAGES)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* =================================================================== */}
        {/* WIDGET 3: 24/7 SUPPORT CONCIERGE & TELEGRAM (Sample 1 Community)    */}
        {/* =================================================================== */}
        <div className="bg-[#0c1018] rounded-3xl border border-white/[0.08] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#0088cc] fill-current" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  24/7 SUPPORT CONCIERGE
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>2 Admins Online</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-[#111724]/90 rounded-2xl p-3.5 border border-white/[0.05] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Telegram Channel:</span>
                  <span className="font-mono text-cyan-400 font-bold">@seara_support_kh</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Average Response:</span>
                  <span className="font-bold text-emerald-400">&lt; 2 Minutes</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Service Hours:</span>
                  <span className="font-bold text-white">24 ម៉ោង / 7 ថ្ងៃ</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Security Guarantee:</span>
                  <span className="font-bold text-amber-300">100% Anti-Scam</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0088cc]/10 border border-[#0088cc]/25 text-xs text-neutral-300">
                <p className="leading-relaxed">
                  ត្រូវការជំនួយពិនិត្យ Player ID, វិក្កយបត្រ ឬចង់បានកញ្ចប់ Diamond ធំ? ឆាតផ្ទាល់ជាមួយ Admin ឥឡូវនេះ។
                </p>
              </div>
            </div>
          </div>

          <Link
            href="https://t.me/seara_support_kh"
            target="_blank"
            className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-[#0088cc] to-[#00a8ff] hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,136,204,0.35)] transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span>ឆាតទៅ Telegram Support 24/7</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
