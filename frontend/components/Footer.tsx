'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  const { language, t, openTrack } = useApp();

  return (
    <footer className="relative bg-[#070912] border-t border-white/[0.08] text-neutral-400 select-none overflow-hidden">
      {/* Top subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-20 bg-[#E5B55E]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Row 1: Brand & Publisher Partners */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E5B55E] to-[#C49740] flex items-center justify-center text-black font-black text-xs">
                SR
              </div>
              <span className="font-extrabold text-lg text-white tracking-wider">
                SEA RA PRESTIGE
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {t.footer.desc}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Direct API Verified Gateway</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              {t.footer.quickLinks}
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-semibold text-neutral-300">
              <a href="#game-catalog" className="hover:text-[#E5B55E] transition-colors">
                {t.nav.games}
              </a>
              <button
                type="button"
                onClick={openTrack}
                className="text-left hover:text-[#E5B55E] transition-colors cursor-pointer"
              >
                {t.nav.trackOrder}
              </button>
              <a
                href="https://t.me/seara_support_kh"
                target="_blank"
                className="hover:text-[#E5B55E] transition-colors flex items-center gap-1"
              >
                <span>{t.nav.support}</span>
                <ExternalLink className="w-3 h-3 text-neutral-500" />
              </a>
            </div>
          </div>

          {/* Official Game Publisher Gateways */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              {t.footer.officialPartners}
            </h4>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                'Moonton API',
                'Garena API',
                'Tencent Games',
                'Roblox Corp',
                'HoYoverse',
                'Riot Games',
                'Activision CODM',
              ].map((partner) => (
                <span
                  key={partner}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] font-bold text-neutral-300"
                >
                  {partner}
                </span>
              ))}
            </div>

            {/* Payment Partners */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-neutral-400 block mb-1.5 uppercase tracking-wider">
                {t.footer.bankingPartners}:
              </span>
              <div className="flex flex-wrap items-center gap-2">
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
                    className="px-2 py-0.5 rounded-md bg-[#111726] border border-white/[0.06] text-[10px] font-mono text-[#E5B55E]"
                  >
                    {bank}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>{t.footer.copyright}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>24/7 Security Hotline</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
