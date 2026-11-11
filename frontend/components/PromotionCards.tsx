'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowRight, Tag, Gift, Flame } from 'lucide-react';

export default function PromotionCards() {
  const { language, t, openTopUp, formatPrice, toKHR } = useApp();

  return (
    <section className="py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#E5B55E]" />
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                {t.promotions.title}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 pl-6">
              {t.promotions.subtitle}
            </p>
          </div>
        </div>

        {/* 2 Big Luxury Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Promo Card 1: MLBB Weekly Pass Bonus */}
          <div
            onClick={() => openTopUp('mlbb', 'ml-pass')}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1A1810] via-[#121624] to-[#0A0D18] border border-[#E5B55E]/30 p-6 flex flex-col justify-between hover:border-[#E5B55E]/70 transition-all cursor-pointer shadow-xl hover:shadow-[0_10px_30px_rgba(229,181,94,0.15)]"
          >
            <div className="space-y-3 relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-[#E5B55E]/20 border border-[#E5B55E]/40 text-[#E5B55E] text-[10px] font-black uppercase tracking-wider">
                {t.promotions.badge1}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-[#E5B55E] transition-colors leading-snug">
                {t.promotions.title1}
              </h3>
              <p className="text-xs text-neutral-300 max-w-md leading-relaxed">
                {t.promotions.desc1}
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between relative z-10 border-t border-white/[0.08] mt-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-black text-[#E5B55E]">
                  {formatPrice(1.85)}
                </span>
                <span className="text-[11px] text-neutral-400">
                  ≈ {toKHR(1.85)}
                </span>
              </div>
              <span className="px-4 py-2 rounded-xl bg-[#E5B55E] text-black font-black text-xs uppercase tracking-wider group-hover:bg-[#FBBF24] transition-all flex items-center gap-1.5 shadow-sm">
                <span>{t.promotions.action}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Promo Card 2: Roblox Robux Special */}
          <div
            onClick={() => openTopUp('roblox', 'rbx-800')}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F1E28] via-[#101726] to-[#0A0D18] border border-[#00D4FF]/30 p-6 flex flex-col justify-between hover:border-[#00D4FF]/70 transition-all cursor-pointer shadow-xl hover:shadow-[0_10px_30px_rgba(0,212,255,0.15)]"
          >
            <div className="space-y-3 relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] text-[10px] font-black uppercase tracking-wider">
                {t.promotions.badge2}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-[#00D4FF] transition-colors leading-snug">
                {t.promotions.title2}
              </h3>
              <p className="text-xs text-neutral-300 max-w-md leading-relaxed">
                {t.promotions.desc2}
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between relative z-10 border-t border-white/[0.08] mt-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-black text-[#00D4FF]">
                  800 Robux • {formatPrice(9.50)}
                </span>
                <span className="text-[11px] text-neutral-400">
                  ≈ {toKHR(9.50)}
                </span>
              </div>
              <span className="px-4 py-2 rounded-xl bg-[#00D4FF] text-black font-black text-xs uppercase tracking-wider group-hover:bg-[#38BDF8] transition-all flex items-center gap-1.5 shadow-sm">
                <span>{t.promotions.action}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
