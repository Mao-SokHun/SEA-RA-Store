'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();
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
    <footer className="relative bg-[#050811] border-t border-white/[0.08] text-neutral-400 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top 3-Part Section (Sample 2 Template Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-10 border-b border-white/[0.06]">
          {/* Left: Quick Navigation Links (2 Columns of 3 links) */}
          <div className="md:col-span-4 grid grid-cols-2 gap-y-2 text-xs font-semibold text-neutral-400">
            <Link href="/top-up" className="hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/top-up#featured-games" className="hover:text-white transition-colors">
              Genres
            </Link>
            <Link href="/top-up" className="hover:text-white transition-colors">
              Careers
            </Link>
            <Link href="/top-up" className="hover:text-white transition-colors">
              Community
            </Link>
            <Link href="/warranty" className="hover:text-white transition-colors">
              Legal
            </Link>
            <Link href="https://t.me/seara_support_kh" target="_blank" className="hover:text-white transition-colors">
              Support
            </Link>
          </div>

          {/* Center: Glowing Crest & Social Media Icons (Sample 2 Template Style) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-2">
            {/* Glowing Logo Crest */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00e5ff] via-[#3b82f6] to-[#f59e0b] p-[1.5px] shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L4 6V12C4 17.5 7.4 20.8 12 22C16.6 20.8 20 17.5 20 12V6L12 2Z"
                    fill="url(#footer-crest-grad)"
                    stroke="#00e5ff"
                    strokeWidth="1.5"
                  />
                  <path d="M9 12L11 14L15 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="footer-crest-grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00e5ff" stopOpacity="0.4" />
                      <stop offset="1" stopColor="#3b82f6" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Social Media
            </span>

            {/* Social Icons (Discord, Twitter, YouTube, Twitch) */}
            <div className="flex items-center gap-3 pt-1 text-neutral-400">
              {/* Discord */}
              <a href="https://t.me/seara_support_kh" target="_blank" className="hover:text-[#00e5ff] transition-colors p-1">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              {/* Twitter / X */}
              <a href="https://t.me/seara_support_kh" target="_blank" className="hover:text-[#00e5ff] transition-colors p-1">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://t.me/seara_support_kh" target="_blank" className="hover:text-[#00e5ff] transition-colors p-1">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* Twitch */}
              <a href="https://t.me/seara_support_kh" target="_blank" className="hover:text-[#00e5ff] transition-colors p-1">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Subscribe for Updates! (Sample 2 Template Style) */}
          <div className="md:col-span-4 space-y-2 text-right">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
              Subscribe for updates!
            </span>

            <form onSubmit={handleSubscribe} className="relative flex items-center justify-end">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your updates..."
                className="w-full max-w-xs bg-[#0b101c] border border-white/[0.1] rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00e5ff]"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 w-7 h-7 rounded-lg bg-[#0070f3] hover:bg-[#0088cc] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
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

        {/* Bottom Logo & Copyright (Sample 2: Centered GAMEVERSE) */}
        <div className="pt-6 flex flex-col items-center justify-center gap-2">
          <div className="font-black text-sm tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00e5ff] to-[#3b82f6]">
            SEA RA GAMING
          </div>
          <p className="text-[10px] text-neutral-500">
            © {new Date().getFullYear()} SEA RA GAMING. All rights reserved. Direct In-Game Top-Up Aggregator.
          </p>
        </div>
      </div>
    </footer>
  );
}
