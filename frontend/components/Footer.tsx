'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="w-full bg-[#030612] border-t border-[#121c38] mt-12 pb-10 text-[#7F92B0] select-none">
      
      {/* ── Center Glowing Shield Flame Crest Divider ── */}
      <div className="relative w-full flex items-center justify-center -translate-y-1/2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00A3FF] to-[#0055FF] p-[1.5px] shadow-[0_0_20px_rgba(0,163,255,0.5)]">
          <div className="w-full h-full bg-[#050B1B] rounded-[10px] flex items-center justify-center">
            <span className="text-base">🔥</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* ── Main Footer Columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pb-8">
          
          {/* Left: Quick Links (Two Columns) */}
          <div className="grid grid-cols-2 gap-6">
            <ul className="space-y-2.5 font-en text-xs">
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

            <ul className="space-y-2.5 font-en text-xs">
              <li>
                <Link href="#games" className="hover:text-white transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link href="#community" className="hover:text-white transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#support" className="hover:text-white transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Center: Social Media */}
          <div className="flex flex-col items-center justify-center text-center">
            <h4 className="font-en font-black text-xs text-white tracking-wider uppercase mb-3">
              Social Media
            </h4>

            {/* Icons: Discord, Twitter, YouTube, Twitch */}
            <div className="flex items-center gap-3">
              {/* Discord */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="w-8 h-8 rounded-lg bg-[#081026] border border-[#16244C] hover:border-[#00A3FF] hover:text-[#00A3FF] flex items-center justify-center transition-all text-xs font-en font-bold"
              >
                👾
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-lg bg-[#081026] border border-[#16244C] hover:border-[#00A3FF] hover:text-[#00A3FF] flex items-center justify-center transition-all text-xs font-en font-bold"
              >
                𝕏
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-[#081026] border border-[#16244C] hover:border-[#E63946] hover:text-[#E63946] flex items-center justify-center transition-all text-xs font-en font-bold"
              >
                ▶
              </a>

              {/* Twitch */}
              <a
                href="https://twitch.tv"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitch"
                className="w-8 h-8 rounded-lg bg-[#081026] border border-[#16244C] hover:border-[#9146FF] hover:text-[#9146FF] flex items-center justify-center transition-all text-xs font-en font-bold"
              >
                🎮
              </a>
            </div>
          </div>

          {/* Right: Subscribe for updates! */}
          <div className="flex flex-col items-start md:items-end">
            <h4 className="font-en font-black text-xs text-white tracking-wider uppercase mb-3">
              Subscribe for updates!
            </h4>

            <div className="w-full max-w-xs flex items-center relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your updates"
                className="w-full bg-[#081026] border border-[#16244C] focus:border-[#00A3FF] text-xs text-white placeholder-[#526484] rounded-lg pl-3 pr-10 py-2.5 outline-none font-en transition-all"
              />
              <button
                aria-label="Subscribe"
                className="absolute right-1 w-7 h-7 rounded-md bg-[#00A3FF] hover:bg-[#008DD6] text-white flex items-center justify-center transition-all shadow-[0_0_8px_#00A3FF]"
              >
                <Send size={13} />
              </button>
            </div>
          </div>

        </div>

        {/* ── Bottom Center GAMEVERSE Brand Copyright ── */}
        <div className="pt-6 border-t border-[#0D152C] flex flex-col items-center justify-center text-center">
          <span className="font-en font-black text-xs tracking-[0.25em] text-[#00A3FF] uppercase">
            GAMEVERSE
          </span>
          <span className="text-[10px] text-[#45536C] font-en mt-1">
            © 2026 GameVerse Top-Up Platform. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  );
}
