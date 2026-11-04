'use client';

import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import { LIVE_TRANSACTIONS } from '@/data/gamesData';

export default function LiveTicker() {
  return (
    <div className="w-full bg-[#070B14] border-b border-blue-500/10 py-1.5 overflow-hidden select-none relative z-30">
      <div className="max-w-[1320px] mx-auto px-4 flex items-center">
        {/* Left static badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#00F2FE] tracking-wider uppercase pr-4 border-r border-blue-500/20 flex-shrink-0 z-10 bg-[#070B14]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C0FF]" />
          </span>
          <span className="font-en">LIVE RECHARGES</span>
        </div>

        {/* Animated Marquee Ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-ticker flex items-center gap-8 pl-4">
            {LIVE_TRANSACTIONS.concat(LIVE_TRANSACTIONS).map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="flex items-center gap-2 text-xs text-[#94A3B8] whitespace-nowrap"
              >
                <span className="text-sm">{item.gameIcon}</span>
                <span className="text-white font-semibold font-en">{item.userMasked}</span>
                <span>just recharged</span>
                <span className="text-[#00F2FE] font-bold font-en">{item.amountText}</span>
                <span>in</span>
                <span className="text-slate-300 font-medium">{item.gameName}</span>
                <span className="text-[#64748B] text-[10px]">({item.timeAgo})</span>
                <span className="text-blue-500/30 text-xs pl-4">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 100% Direct API SLA */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#10B981] font-semibold pl-4 border-l border-blue-500/20 flex-shrink-0 z-10 bg-[#070B14]">
          <ShieldCheck size={13} />
          <span>Direct API: 3s Avg Delivery</span>
        </div>
      </div>
    </div>
  );
}
