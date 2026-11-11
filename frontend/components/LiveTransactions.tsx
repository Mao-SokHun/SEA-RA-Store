'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { LIVE_ACTIVITIES } from '@/data/games';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function LiveTransactions() {
  const { language, t } = useApp();

  return (
    <div className="w-full bg-[#0B0F1B]/90 border-y border-white/[0.06] py-3 select-none overflow-hidden backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Ticker Title Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-300">
            {t.liveTicker.label}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono hidden md:inline">
            // 24/7 Verified Gateway
          </span>
        </div>

        {/* Live Items Display (Clean Flex Carousel) */}
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-0.5 w-full sm:w-auto">
          {LIVE_ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05] shrink-0 text-xs"
            >
              <img
                src={act.avatar}
                alt="user"
                className="w-5 h-5 rounded-full object-cover border border-white/[0.1]"
              />
              <span className="font-bold text-neutral-300">{act.maskedId}</span>
              <span className="text-neutral-400">•</span>
              <span className="text-white font-semibold">{act.gameName}</span>
              <span className="text-emerald-400 font-bold font-mono">
                +${act.amountUSD.toFixed(2)}
              </span>
              <span className="text-[10px] text-neutral-400">
                ({language === 'km' ? act.timeAgoKh : act.timeAgo})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
