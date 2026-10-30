'use client';

import React from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { LIVE_ORDERS_TICKER, TOP_BUYERS } from '@/data/news';
import { TRANSLATIONS } from '@/i18n/translations';
import { ChevronLeft, ChevronRight, Activity, ShieldCheck, Crown, Flame } from 'lucide-react';

export default function LiveOrdersAndTopBuyers() {
  const { language, openTopUp } = useOrderStore();
  const tOrders = TRANSLATIONS[language].liveOrders;
  const tBuyers = TRANSLATIONS[language].topBuyers;

  return (
    <section id="live-orders" className="mb-14 scroll-mt-24 select-none">
      {/* 3 Widgets Grid matching GameVerse Community Hub layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* =================================================================== */}
        {/* WIDGET 1 & 2 (LEFT 8 COLS): RECENT ORDERS TICKER & LIVE ACTIVITY   */}
        {/* =================================================================== */}
        <div className="lg:col-span-8 bg-[#0F1A35] rounded-3xl border border-[#2B6CFF]/35 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                    {tOrders.title}
                  </h3>
                  <p className="text-[10px] text-neutral-400">
                    {tOrders.subtitle}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                LIVE 24/7
              </span>
            </div>

            {/* List of Live Order Tickers */}
            <div className="space-y-3">
              {LIVE_ORDERS_TICKER.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openTopUp('1')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#0B1224] border border-white/[0.04] hover:border-[#22D3EE]/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.maskedUser}
                      className="w-9 h-9 rounded-xl object-cover border border-[#2B6CFF]/40"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white group-hover:text-[#22D3EE] transition-colors">
                          {item.maskedUser}
                        </span>
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          {tOrders.completed}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        {item.gameName} • <span className="text-neutral-300 font-bold">{item.packageName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-amber-400 font-mono">
                      +${item.amountUSD.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-neutral-400 block font-mono">
                      {language === 'km' ? item.timeAgoKh : item.timeAgo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>100% Guaranteed Official Moonton, Garena & Tencent APIs</span>
            </span>
            <span className="font-mono text-[#22D3EE]">AVG SPEED: 2.8s</span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* WIDGET 3 (RIGHT 4 COLS): TOP BUYERS LEADERBOARD                     */}
        {/* =================================================================== */}
        <div className="lg:col-span-4 bg-[#0F1A35] rounded-3xl border border-[#2B6CFF]/35 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                  {tBuyers.title}
                </h3>
              </div>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                WEEKLY VIP
              </span>
            </div>

            {/* Leaderboard rows 1 to 5 */}
            <div className="space-y-2.5">
              {TOP_BUYERS.map((buyer) => (
                <div
                  key={buyer.rank}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    buyer.rank === 1
                      ? 'bg-gradient-to-r from-amber-500/15 via-[#0B1224] to-[#0B1224] border-amber-400/40 shadow-md'
                      : 'bg-[#0B1224] border-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Rank Badge */}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                        buyer.rank === 1
                          ? 'bg-amber-400 text-black shadow-md'
                          : buyer.rank === 2
                          ? 'bg-neutral-300 text-black'
                          : buyer.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-[#152347] text-neutral-400'
                      }`}
                    >
                      {buyer.rank}
                    </div>

                    <img
                      src={buyer.avatar}
                      alt={buyer.name}
                      className="w-7 h-7 rounded-lg object-cover border border-[#2B6CFF]/30"
                    />

                    <div>
                      <p className="text-xs font-black text-white leading-tight">
                        {buyer.name}
                      </p>
                      <span className="text-[9px] font-bold text-neutral-400">
                        {buyer.badge}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-[#22D3EE] block">
                      ${buyer.totalSpentUSD.toFixed(2)}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400">
                      {buyer.points}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
            <span className="text-[10px] text-neutral-400">
              Reload now to climb the leaderboard & get VIP cashbacks!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
