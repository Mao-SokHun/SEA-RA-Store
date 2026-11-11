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

            {/* Official Contact & Community Channels (Facebook & Telegram) */}
            <div className="pt-2 space-y-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5B55E]" />
                <span>{language === 'km' ? 'ទំនាក់ទំនង & សហគមន៍ផ្លូវការ' : 'Official Contact & Community'}</span>
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Facebook Page Button */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 hover:border-[#1877F2]/60 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(24,119,242,0.15)] hover:shadow-[0_0_22px_rgba(24,119,242,0.35)] group"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#1877F2] flex items-center justify-center shrink-0 shadow-sm">
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-white group-hover:text-[#60a5fa] transition-colors">
                      Facebook Page
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      @searacambodia
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors ml-0.5" />
                </a>

                {/* Telegram Contact & Support Button */}
                <a
                  href="https://t.me/seara_support_kh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 hover:border-[#229ED9]/60 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(34,158,217,0.15)] hover:shadow-[0_0_22px_rgba(34,158,217,0.35)] group"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#229ED9] flex items-center justify-center shrink-0 shadow-sm">
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.718-1.574 7.42-2.28 10.741-.299 1.405-.866 1.636-1.411 1.636-.928 0-1.633-.697-2.533-1.288-1.408-.925-2.204-1.499-3.572-2.4-1.58-1.042-.556-1.615.345-2.551.236-.245 4.331-3.971 4.41-4.309.01-.042.019-.2-.075-.283-.095-.083-.233-.055-.334-.032-.142.032-2.408 1.531-6.797 4.493-.643.442-1.226.657-1.748.646-.576-.012-1.684-.325-2.508-.593-1.01-.329-1.213-.503-1.143-.889.037-.202.327-.409.871-.622 3.415-1.488 5.694-2.469 6.837-2.943 3.256-1.354 3.933-1.59 4.375-1.598.097-.002.314.022.455.137.118.097.151.228.163.323.013.109.006.284-.002.392z" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                      Telegram Contact
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      @seara_support_kh
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors ml-0.5" />
                </a>
              </div>
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
