'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#030612] border-t border-[#121c38] mt-12 pb-10 text-[#7F92B0] select-none">
      
      {/* ── Center Glowing Shield Crest Divider matching Mockup ── */}
      <div className="relative w-full flex items-center justify-center -translate-y-1/2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A3FF] via-[#3B82F6] to-[#A855F7] p-[1.5px] shadow-[0_0_24px_rgba(0,163,255,0.6)]">
          <div className="w-full h-full bg-[#050B1B] rounded-[10px] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 6V12C4 17.5 7.4 20.8 12 22C16.6 20.8 20 17.5 20 12V6L12 2Z"
                fill="url(#foot-crest)"
                stroke="#00F2FE"
                strokeWidth="1.5"
              />
              <path d="M9 12L11 14L15 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="foot-crest" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00F2FE" stopOpacity="0.5" />
                  <stop offset="0.5" stopColor="#3B82F6" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#A855F7" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* ── Main 3-Part Footer Layout matching Mockup 100% ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-8 border-b border-[#0F1836]">
          
          {/* Left: Quick Links (Two Columns of 3 links each) */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            <ul className="space-y-2.5 font-heading text-xs uppercase tracking-wider">
              <li>
                <Link href="#about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#legal" className="hover:text-white transition-colors">
                  Legal
                </Link>
              </li>
            </ul>

            <ul className="space-y-2.5 font-heading text-xs uppercase tracking-wider">
              <li>
                <Link href="#games" className="hover:text-white transition-colors">
                  Genres
                </Link>
              </li>
              <li>
                <Link href="#community" className="hover:text-white transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <a href="https://t.me/seara_support_kh" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Center: Social Media Title & Icons */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
            <h4 className="font-heading font-black text-xs text-white tracking-wider uppercase mb-3">
              Social Media
            </h4>

            {/* Social Icons: Discord, Twitter, YouTube, Twitch */}
            <div className="flex items-center gap-3">
              {/* Discord */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="w-8 h-8 rounded-lg bg-[#081026] border border-[#16244C] hover:border-[#00A3FF] hover:text-[#00A3FF] flex items-center justify-center transition-all text-xs font-heading font-bold"
              >
                👾
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-lg bg-[#081026] border border-[#16244C] hover:border-[#00A3FF] hover:text-[#00A3FF] flex items-center justify-center transition-all text-xs font-heading font-bold"
              >
                𝕏
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-[#081026] border border-[#16244C] hover:border-[#00A3FF] hover:text-[#00A3FF] flex items-center justify-center transition-all text-xs font-heading font-bold"
              >
                ▶
              </a>

              {/* Twitch */}
              <a
                href="https://twitch.tv"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitch"
                className="w-8 h-8 rounded-lg bg-[#081026] border border-[#16244C] hover:border-[#00A3FF] hover:text-[#00A3FF] flex items-center justify-center transition-all text-xs font-heading font-bold"
              >
                📡
              </a>
            </div>
          </div>

          {/* Right: Subscribe for Updates Form */}
          <div className="md:col-span-4 flex flex-col items-start md:items-end">
            <h4 className="font-heading font-black text-xs text-white tracking-wider uppercase mb-2">
              Subscribe for updates!
            </h4>

            <form onSubmit={handleSubscribe} className="w-full max-w-xs relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your updates..."
                className="w-full bg-[#0A1026] border border-[#16244C] focus:border-[#00A3FF] focus:outline-none rounded-lg text-xs text-white placeholder-[#4E6180] pl-3 pr-10 py-2.5 font-body transition-colors shadow-inner"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md bg-[#00A3FF] hover:bg-[#0077FF] text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
              >
                <Send size={13} />
              </button>
            </form>

            {isSubscribed && (
              <span className="text-[10px] text-[#00F2FE] mt-1 flex items-center gap-1 font-heading">
                <CheckCircle2 size={11} /> Subscribed successfully!
              </span>
            )}
          </div>

        </div>

        {/* ── Bottom Brand Tagline ── */}
        <div className="pt-6 text-center">
          <p className="font-heading font-black text-xs text-[#5A6E8D] uppercase tracking-[0.3em]">
            GAMEVERSE
          </p>
          <p className="text-[10px] text-[#3D4C63] mt-1 font-mono">
            © {new Date().getFullYear()} GameVerse SEA RA Platform. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
