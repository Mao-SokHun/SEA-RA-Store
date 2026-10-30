'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, CheckCircle2 } from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { TRANSLATIONS } from '@/i18n/translations';

export default function Footer() {
  const { language } = useOrderStore();
  const t = TRANSLATIONS[language].footer;

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-[#070B17] border-t border-[#2B6CFF]/30 text-neutral-400 select-none overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-[#3B82F6]/10 blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top 3-Part Section (Sample 2 Template Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-10 border-b border-white/[0.06]">
          {/* Left: Quick Navigation Links (2 Columns of 3 links) */}
          <div className="md:col-span-4 grid grid-cols-2 gap-y-2.5 text-xs font-bold text-neutral-300">
            <Link href="/" className="hover:text-[#22D3EE] transition-colors">
              {t.about}
            </Link>
            <a href="#featured-games" className="hover:text-[#22D3EE] transition-colors">
              {t.genres}
            </a>
            <Link href="/" className="hover:text-[#22D3EE] transition-colors">
              {t.careers}
            </Link>
            <a href="#live-orders" className="hover:text-[#22D3EE] transition-colors">
              {t.community}
            </a>
            <Link href="/" className="hover:text-[#22D3EE] transition-colors">
              {t.legal}
            </Link>
            <a href="https://t.me/seara_support_kh" target="_blank" className="hover:text-[#22D3EE] transition-colors">
              {t.support}
            </a>
          </div>

          {/* Center: Glowing Crest & Social Media Icons (Sample 2 Template Style) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22D3EE] via-[#3B82F6] to-[#FF7A18] p-[1.5px] shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-[#0A1022] rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L4 6V12C4 17.5 7.4 20.8 12 22C16.6 20.8 20 17.5 20 12V6L12 2Z"
                    fill="url(#foot-crest)"
                    stroke="#22D3EE"
                    strokeWidth="1.5"
                  />
                  <path d="M9 12L11 14L15 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="foot-crest" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#22D3EE" stopOpacity="0.4" />
                      <stop offset="1" stopColor="#3B82F6" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              {t.social}
            </span>

            {/* Social Icons (Telegram, Discord, Facebook, TikTok) */}
            <div className="flex items-center gap-3 pt-1 text-neutral-400">
              {/* Telegram */}
              <a href="https://t.me/seara_support_kh" target="_blank" className="hover:text-[#22D3EE] transition-colors p-1" aria-label="Telegram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </a>

              {/* Discord */}
              <a href="https://t.me/seara_support_kh" target="_blank" className="hover:text-[#22D3EE] transition-colors p-1" aria-label="Discord">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a href="https://t.me/seara_support_kh" target="_blank" className="hover:text-[#22D3EE] transition-colors p-1" aria-label="TikTok">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a href="https://t.me/seara_support_kh" target="_blank" className="hover:text-[#22D3EE] transition-colors p-1" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Subscribe for Updates */}
          <div className="md:col-span-4 space-y-2 text-right">
            <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider block">
              {t.subscribe}
            </span>

            <form onSubmit={handleSubscribe} className="relative flex items-center justify-end">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.subPlaceholder}
                className="w-full max-w-xs bg-[#0F1A35] border border-[#2B6CFF]/40 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#22D3EE]"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 w-7 h-7 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              >
                {subscribed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Send className="w-3.5 h-3.5 fill-current" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Logo & Copyright */}
        <div className="pt-6 flex flex-col items-center justify-center gap-2">
          <div className="font-black text-sm tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-[#22D3EE] to-[#3B82F6]">
            GAMEVERSE • SEA RA GAMING
          </div>
          <p className="text-[10px] text-neutral-400 text-center">
            {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

