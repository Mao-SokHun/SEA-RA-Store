'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowUp,
  Activity,
  Wifi,
  Receipt,
  QrCode,
  Lock,
} from 'lucide-react';

export default function Footer() {
  const { language, t, openTrack } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050811] border-t border-white/[0.1] text-neutral-400 select-none overflow-hidden pt-12 pb-8">
      
      {/* ================================================================= */}
      {/* 1. HORIZON LASER GLOW ACCENT BEAM                                 */}
      {/* ================================================================= */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5B55E]/60 via-[#00D4FF]/40 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#E5B55E]/10 via-[#00D4FF]/5 to-transparent blur-3xl pointer-events-none" />

      {/* ================================================================= */}
      {/* 2. GIANT FADED MEGATEXT WATERMARK (ESPORTS HORIZON)               */}
      {/* ================================================================= */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none select-none opacity-[0.03] z-0">
        <span className="text-[130px] sm:text-[200px] font-black uppercase tracking-tighter text-white inline-block">
          SEA RA PRESTIGE
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        

        {/* ================================================================= */}
        {/* 4. GLASS BENTO TRUST DOCK GRID                                    */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 pb-8 border-b border-white/[0.08]">
          
          {/* Card 1: Brand Authority (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E5B55E] via-[#C49740] to-[#1E293B] p-[1px] shadow-[0_0_20px_rgba(229,181,94,0.3)]">
                <div className="w-full h-full bg-[#090E1B] rounded-[11px] flex items-center justify-center">
                  <span className="font-black text-xs text-[#E5B55E]">SR</span>
                </div>
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-wider block">
                  SEA RA PRESTIGE
                </span>
                <span className="text-[10px] font-mono text-[#E5B55E] font-bold uppercase tracking-wider">
                  Automated Gaming Reload Gateway
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed max-w-sm">
              {t.footer.desc}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Official Smile.One API Authorized Gateway</span>
            </div>
          </div>

          {/* Card 2: Quick Operations (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1 h-3 bg-[#E5B55E] rounded-full" />
              <span>{t.footer.quickLinks}</span>
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-semibold text-neutral-300">
              <a href="#game-catalog" className="hover:text-[#E5B55E] transition-colors py-0.5 flex items-center gap-1.5">
                <span>{t.nav.games}</span>
              </a>
              <button
                type="button"
                onClick={openTrack}
                className="text-left hover:text-[#E5B55E] transition-colors cursor-pointer py-0.5 flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5 text-[#E5B55E]" />
                <span>{t.nav.trackOrder}</span>
              </button>
              <a
                href="https://t.me/seara_support_kh"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E5B55E] transition-colors flex items-center gap-1.5 py-0.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t.nav.support} (Telegram 24/7)</span>
                <ExternalLink className="w-3 h-3 text-neutral-500" />
              </a>
            </div>
          </div>

          {/* Card 3: Secured Payment Infrastructure (4 Cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1 h-3 bg-[#00D4FF] rounded-full" />
              <span>{t.footer.bankingPartners}</span>
            </h4>
            
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {[
                'National Bakong KHQR',
                'ABA Mobile',
                'Wing Bank',
                'ACLEDA ToanChet',
                'Canadia Bank',
                'USDT TRC20',
              ].map((bank) => (
                <span
                  key={bank}
                  className="px-2.5 py-1 rounded-lg bg-[#0D1424] border border-white/[0.08] text-[11px] font-mono font-bold text-[#E5B55E] shadow-sm"
                >
                  {bank}
                </span>
              ))}
            </div>

            <p className="text-[11px] text-neutral-400 pt-1 leading-normal font-sans">
              {language === 'km'
                ? 'គាំទ្រការទូទាត់រហ័ស 0% ថ្លៃសេវា តាមរយៈប្រព័ន្ធធនាគារកម្ពុជា Bakong KHQR'
                : 'Zero-fee instant settlement backed by Cambodia National Bakong KHQR Network.'}
            </p>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 5. PUBLISHER DISCLAIMER BAR (NO MOONTON DIRECT CLAIM)             */}
        {/* ================================================================= */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-[10px] sm:text-[11px] text-neutral-400 leading-relaxed font-mono">
          <p>
            <strong className="text-neutral-300">PUBLISHER TRADEMARK NOTICE:</strong> Mobile Legends: Bang Bang, Roblox, Free Fire, PUBG Mobile, Genshin Impact, and Valorant are registered trademarks of their respective publishers (Smile.One Reseller API, Garena, Tencent Games, Roblox Corp, HoYoverse, Riot Games). SEA RA Prestige operates as an independent authorized direct top-up reseller gateway in Cambodia.
          </p>
        </div>

        {/* ================================================================= */}
        {/* 6. BOTTOM COPYRIGHT & ASCEND BACK-TO-TOP ROCKET BUTTON            */}
        {/* ================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p>{t.footer.copyright}</p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            
            {/* ASCEND ROCKET BUTTON */}
            <button
              type="button"
              onClick={scrollToTop}
              className="px-3 py-1.5 rounded-lg bg-[#0F1626] hover:bg-[#E5B55E] hover:text-black border border-white/10 hover:border-[#E5B55E] text-neutral-300 font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm group"
            >
              <span>ASCEND</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
