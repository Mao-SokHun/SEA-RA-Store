'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Server,
  ArrowRight,
} from 'lucide-react';

interface LiveFeedItem {
  id: string;
  game: string;
  currency: string;
  player: string;
  timeAgo: string;
  amount: string;
  icon: string;
  color: string;
}

const INITIAL_FEEDS: LiveFeedItem[] = [
  {
    id: '1',
    game: 'Mobile Legends',
    currency: '706 Diamonds (625+81)',
    player: '⚡Shadow_***',
    timeAgo: '刚刚 (2s ago)',
    amount: '$10.90',
    icon: '💎',
    color: 'text-amber-400',
  },
  {
    id: '2',
    game: 'Roblox',
    currency: '800 Robux Direct',
    player: 'Blox_Pro***',
    timeAgo: '12s ago',
    amount: '$8.90',
    icon: '⚡',
    color: 'text-cyan-400',
  },
  {
    id: '3',
    game: 'PUBG Mobile',
    currency: '660 UC Royale Pass',
    player: 'Sniper_***',
    timeAgo: '28s ago',
    amount: '$9.50',
    icon: '🪙',
    color: 'text-yellow-400',
  },
  {
    id: '4',
    game: 'Free Fire',
    currency: '520 Diamonds Pack',
    player: 'Booyah_***',
    timeAgo: '45s ago',
    amount: '$4.40',
    icon: '🔥',
    color: 'text-orange-400',
  },
  {
    id: '5',
    game: 'Valorant',
    currency: '2,050 Riot Points (VP)',
    player: 'Jett_Ace***',
    timeAgo: '1m ago',
    amount: '$19.00',
    icon: '🎯',
    color: 'text-rose-400',
  },
];

export default function LiveActivitySidebar({
  onSelectGame,
}: {
  onSelectGame?: (gameId: string) => void;
}) {
  const [feeds, setFeeds] = useState(INITIAL_FEEDS);

  // Subtle live feed update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setFeeds((prev) => {
        const first = prev[0];
        const rest = prev.slice(1);
        return [...rest, { ...first, timeAgo: 'ទើបតែបញ្ចូល (Just now)' }];
      });
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* ------------------------------------------------------------------- */}
      {/* 1. LIVE TOP-UP TICKER (Sample 1 Right Column Activity Style)         */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-[#0c1018] rounded-3xl border border-white/[0.08] p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              LIVE TOP-UP FEED
            </h3>
          </div>
          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            KHQR REAL-TIME
          </span>
        </div>

        <div className="space-y-2.5">
          {feeds.slice(0, 4).map((feed, idx) => (
            <div
              key={`${feed.id}-${idx}`}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-[#111724]/70 hover:bg-[#151c2c] border border-white/[0.04] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-sm shrink-0">
                  {feed.icon}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white group-hover:text-[#f2ca50] transition-colors truncate max-w-[120px]">
                      {feed.game}
                    </span>
                    <span className="text-[9px] text-neutral-500">• {feed.timeAgo}</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-mono truncate max-w-[130px]">
                    {feed.currency}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-black text-[#f2ca50] block">
                  {feed.amount}
                </span>
                <span className="text-[9px] text-emerald-400 font-bold flex items-center justify-end gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Success</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. DIRECT API SYSTEM STATUS MONITOR                                */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-[#0c1018] rounded-3xl border border-white/[0.08] p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-[#00e4f2]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              API GATEWAY STATUS
            </h3>
          </div>
          <span className="text-[9px] font-bold text-cyan-400">
            ALL ONLINE
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
            <span className="text-neutral-300 font-semibold">Moonton MLBB API</span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              99.9% Online
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
            <span className="text-neutral-300 font-semibold">Bakong KHQR Gateway</span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Instant 3s
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
            <span className="text-neutral-300 font-semibold">Roblox Direct API</span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Operational
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
            <span className="text-neutral-300 font-semibold">Tencent & Garena API</span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
