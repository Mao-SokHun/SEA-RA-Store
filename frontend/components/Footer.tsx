'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Send, MessageCircle } from 'lucide-react';

export default function Footer() {
  const [subscribeText, setSubscribeText] = useState('');

  return (
    <footer className="w-full bg-[#030814] border-t border-[#1a2a4a]/80 pt-12 pb-8 text-[#8b9ab4]">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Main Footer Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-[#1a2a4a]/60">
          
          {/* ── Left Columns: Quick Links (5 cols on lg) ── */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <ul className="space-y-3 font-km text-xs sm:text-sm">
                <li>
                  <Link href="#about" className="hover:text-[#00a8ff] transition-colors">
                    អំពីយើង
                  </Link>
                </li>
                <li>
                  <Link href="#careers" className="hover:text-[#00a8ff] transition-colors">
                    ឱកាសការងារ
                  </Link>
                </li>
                <li>
                  <Link href="#terms" className="hover:text-[#00a8ff] transition-colors">
                    លក្ខខណ្ឌច្បាប់
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <ul className="space-y-3 font-km text-xs sm:text-sm">
                <li>
                  <Link href="#games" className="hover:text-[#00a8ff] transition-colors">
                    ប្រភេទហ្គេម
                  </Link>
                </li>
                <li>
                  <Link href="#community" className="hover:text-[#00a8ff] transition-colors">
                    សហគមន៍
                  </Link>
                </li>
                <li>
                  <Link href="#support" className="hover:text-[#00a8ff] transition-colors">
                    ជំនួយ ២៤/៧
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Center Column: Brand & Socials (4 cols on lg) ── */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
            {/* Logo */}
            <div className="w-12 h-12 rounded-2xl bg-[#00a8ff]/10 border border-[#00a8ff]/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,168,255,0.3)] mb-2">
              <ShieldCheck className="w-7 h-7 text-[#00a8ff]" strokeWidth={2.2} />
            </div>

            <p className="font-km font-bold text-xs text-white tracking-wider mb-3">
              បណ្ដាញសង្គម
            </p>

            {/* Social Icons (Telegram, Discord, TikTok, Facebook) */}
            <div className="flex items-center gap-3">
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="w-9 h-9 rounded-xl bg-[#0a1428] border border-[#1a335a] hover:border-[#00a8ff] text-[#8b9ab4] hover:text-[#00a8ff] flex items-center justify-center transition-all hover:scale-105 shadow-md"
              >
                <Send size={15} />
              </a>

              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="w-9 h-9 rounded-xl bg-[#0a1428] border border-[#1a335a] hover:border-[#5865f2] text-[#8b9ab4] hover:text-[#5865f2] flex items-center justify-center transition-all hover:scale-105 shadow-md"
              >
                <MessageCircle size={15} />
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-xl bg-[#0a1428] border border-[#1a335a] hover:border-[#ff0050] text-[#8b9ab4] hover:text-[#ff0050] flex items-center justify-center transition-all hover:scale-105 shadow-md text-xs font-bold font-en"
              >
                TK
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-[#0a1428] border border-[#1a335a] hover:border-[#1877f2] text-[#8b9ab4] hover:text-[#1877f2] flex items-center justify-center transition-all hover:scale-105 shadow-md text-xs font-bold font-en"
              >
                f
              </a>
            </div>
          </div>

          {/* ── Right Column: Newsletter Subscription (4 cols on lg) ── */}
          <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end text-left lg:text-right">
            <p className="font-km font-bold text-xs sm:text-sm text-white mb-2">
              ជាវដើម្បីទទួលបានដំណឹងប្រូម៉ូសិន!
            </p>
            
            <div className="w-full max-w-sm flex items-center relative">
              <input
                type="text"
                value={subscribeText}
                onChange={(e) => setSubscribeText(e.target.value)}
                placeholder="បញ្ចូលអ៊ីមែល ឬលេខទូរស័ព្ទ..."
                className="w-full bg-[#0a1428] border border-[#1a335a] focus:border-[#00a8ff] text-xs text-white placeholder-[#5a6f90] rounded-xl pl-4 pr-11 py-2.5 outline-none font-km transition-all"
              />
              <button
                aria-label="Subscribe"
                className="absolute right-1.5 w-8 h-8 rounded-lg bg-[#00a8ff] hover:bg-[#0090dd] text-white flex items-center justify-center transition-all shadow-[0_0_10px_#00a8ff]"
              >
                <Send size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* ── Bottom Copyright ── */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-en font-black text-xs tracking-widest text-[#00a8ff] uppercase">
            GAMEVERSE • SEA RA GAMING
          </p>
          <p className="font-km text-[11px] text-[#5a6f90]">
            © 2026 GameVerse by SEA RA. រក្សាសិទ្ធិគ្រប់យ៉ាង។ ប្រព័ន្ធបញ្ចូលលុយស្វ័យប្រវត្តិ។
          </p>
        </div>

      </div>
    </footer>
  );
}
