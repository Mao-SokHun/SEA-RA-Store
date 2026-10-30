'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function NewsAndStoreGameverse({
  onOpenTopUp,
}: {
  onOpenTopUp: (gameId: string) => void;
}) {
  return (
    <section className="mb-14 scroll-mt-24 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =================================================================== */}
        {/* LEFT 8 COLS: LATEST NEWS & UPDATES (3 Cards Side-by-Side)          */}
        {/* =================================================================== */}
        <div id="news-updates" className="lg:col-span-8 space-y-4 scroll-mt-24">
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
            LATEST NEWS & UPDATES
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* News 1 */}
            <div className="rounded-2xl overflow-hidden bg-[#0b101c] border border-white/[0.07] hover:border-white/[0.15] transition-all flex flex-col justify-between shadow-xl group">
              <div className="relative h-32 w-full overflow-hidden bg-black/40">
                <img
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80"
                  alt="Summer Sale"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b101c] via-transparent to-transparent" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#0070f3] text-white">
                  SUMMER SALE!
                </div>
              </div>
              <div className="p-3.5 space-y-2">
                <span className="text-[10px] text-neutral-400 block font-mono">
                  05. 23. 2026
                </span>
                <h4 className="text-xs font-black text-white group-hover:text-[#00e5ff] transition-colors line-clamp-1">
                  SEA RA Summer Sale!
                </h4>
                <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                  Get up to 40% bonus diamonds and robux on all verified Bakong KHQR reloads.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenTopUp('1')}
                  className="text-[10px] font-black uppercase text-[#00e5ff] hover:underline pt-1 cursor-pointer block"
                >
                  READ MORE
                </button>
              </div>
            </div>

            {/* News 2 */}
            <div className="rounded-2xl overflow-hidden bg-[#0b101c] border border-white/[0.07] hover:border-white/[0.15] transition-all flex flex-col justify-between shadow-xl group">
              <div className="relative h-32 w-full overflow-hidden bg-black/40">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80"
                  alt="Esports Season"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b101c] via-transparent to-transparent" />
              </div>
              <div className="p-3.5 space-y-2">
                <span className="text-[10px] text-neutral-400 block font-mono">
                  06. 23. 2026
                </span>
                <h4 className="text-xs font-black text-white group-hover:text-[#00e5ff] transition-colors line-clamp-1">
                  New Esports Season
                </h4>
                <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                  New Esports Season has arrived! Claim tournament skins and exclusive passes today.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenTopUp('1')}
                  className="text-[10px] font-black uppercase text-[#00e5ff] hover:underline pt-1 cursor-pointer block"
                >
                  READ MORE
                </button>
              </div>
            </div>

            {/* News 3 */}
            <div className="rounded-2xl overflow-hidden bg-[#0b101c] border border-white/[0.07] hover:border-white/[0.15] transition-all flex flex-col justify-between shadow-xl group">
              <div className="relative h-32 w-full overflow-hidden bg-black/40">
                <img
                  src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80"
                  alt="Patch Notes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b101c] via-transparent to-transparent" />
              </div>
              <div className="p-3.5 space-y-2">
                <span className="text-[10px] text-neutral-400 block font-mono">
                  06. 24. 2026
                </span>
                <h4 className="text-xs font-black text-white group-hover:text-[#00e5ff] transition-colors line-clamp-1">
                  Patch Notes 1.3
                </h4>
                <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                  Faster 3-second instant API fulfillment with direct Bakong KHQR connection.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenTopUp('7')}
                  className="text-[10px] font-black uppercase text-[#00e5ff] hover:underline pt-1 cursor-pointer block"
                >
                  READ MORE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT 4 COLS: GAME STORE (Deals & New Releases)                    */}
        {/* =================================================================== */}
        <div id="game-store" className="lg:col-span-4 space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
              GAME STORE
            </h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 cursor-pointer hover:text-white">
              <span>DEALS & NEW RELEASES</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Deal 1 */}
            <div
              onClick={() => onOpenTopUp('10')}
              className="rounded-2xl overflow-hidden bg-[#0b101c] border border-white/[0.07] p-2.5 flex flex-col justify-between hover:border-[#ff5500]/50 transition-all cursor-pointer group shadow-xl"
            >
              <div className="relative h-36 w-full rounded-xl overflow-hidden bg-black/40 mb-2">
                <img
                  src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=300&q=80"
                  alt="Valiant Force"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-red-600 text-white">
                  DEAL
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-white group-hover:text-[#f2ca50] transition-colors truncate">
                  Blood Strike Gold
                </p>
                <p className="text-[10px] text-neutral-400">NetEase</p>
                <p className="text-xs font-mono font-black text-emerald-400 mt-1">
                  $2.50
                </p>
              </div>
            </div>

            {/* Deal 2 */}
            <div
              onClick={() => onOpenTopUp('1')}
              className="rounded-2xl overflow-hidden bg-[#0b101c] border border-white/[0.07] p-2.5 flex flex-col justify-between hover:border-[#ff5500]/50 transition-all cursor-pointer group shadow-xl"
            >
              <div className="relative h-36 w-full rounded-xl overflow-hidden bg-black/40 mb-2">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80"
                  alt="Shadowfall"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <p className="text-xs font-black text-white group-hover:text-[#f2ca50] transition-colors truncate">
                  MLBB Weekly Pass
                </p>
                <p className="text-[10px] text-neutral-400">Moonton</p>
                <p className="text-xs font-mono font-black text-emerald-400 mt-1">
                  $1.85
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
