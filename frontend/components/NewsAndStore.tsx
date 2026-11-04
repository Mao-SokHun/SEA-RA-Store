'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Tag } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    title: 'GameVerse Summer Sale!',
    date: '05.11.2023',
    desc: 'GameVerse Summer Sale is back with amazing bonus diamond packages and double points.',
    img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=450&h=260&fit=crop&q=80',
    bannerText: 'SUMMER SALE!',
  },
  {
    id: 2,
    title: 'New Esports Season',
    date: '01.20.2023',
    desc: 'New Esports Season has kicked off with thrilling tournaments & diamond pool rewards.',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=450&h=260&fit=crop&q=80',
    bannerText: 'ESPORTS',
  },
  {
    id: 3,
    title: 'Patch Notes 1.3',
    date: '06.21.2023',
    desc: 'Patch Notes 1.3 introduces instant direct API and zero-fee Bakong KHQR checkout.',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=450&h=260&fit=crop&q=80',
    bannerText: 'UPDATE',
  },
];

const storeDeals = [
  {
    id: 'valiant-force',
    name: 'Valiant Force',
    category: 'Gems & Pass',
    price: '$2.50',
    badge: 'DEAL',
    img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=400&fit=crop&q=80',
    slug: 'mobile-legends',
  },
  {
    id: 'shadowfall',
    name: 'Shadowfall',
    category: 'Fantasy Coins',
    price: '$7.50',
    badge: null,
    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=400&fit=crop&q=80',
    slug: 'free-fire',
  },
];

export default function NewsAndStore() {
  return (
    <section id="news" className="py-6 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 select-none">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ── Left: LATEST NEWS & UPDATES (8 cols on lg) ── */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-wider uppercase">
                LATEST NEWS &amp; UPDATES
              </h2>
            </div>

            {/* 3 News Cards in a Row Matching Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col rounded-xl overflow-hidden bg-[#0A1026] border border-[#152248] hover:border-[#00A3FF]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,163,255,0.2)]"
                >
                  {/* Thumbnail Image with Banner Graphic */}
                  <div className="relative w-full h-28 sm:h-32 overflow-hidden bg-[#050C1E] flex items-center justify-center">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      style={{ filter: 'brightness(0.75) contrast(1.1)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026] via-transparent to-transparent opacity-80" />
                    
                    {/* Centered Graphic Banner Text */}
                    <span className="relative z-10 font-heading font-black text-xs sm:text-sm tracking-wider text-white bg-black/60 px-2.5 py-1 rounded border border-white/20 uppercase drop-shadow-md">
                      {item.bannerText}
                    </span>
                  </div>

                  {/* Content Area */}
                  <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-[#5A6E8D] font-mono">
                        {item.date}
                      </span>
                      <h3 className="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-[#00A3FF] transition-colors leading-snug mt-0.5 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#7F92B0] leading-relaxed mt-1 line-clamp-2">
                        {item.desc}
                      </p>
                    </div>

                    {/* Cyan "READ MORE" Link */}
                    <span className="font-heading font-bold text-xs text-[#00A3FF] hover:text-[#00FFE0] transition-colors uppercase tracking-wider flex items-center gap-1 mt-1 cursor-pointer">
                      <span>READ MORE</span>
                      <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: GAME STORE & DEALS (4 cols on lg) ── */}
        <div id="store" className="lg:col-span-4 flex flex-col justify-between scroll-mt-24">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-wider uppercase">
                GAME STORE
              </h2>
              <Link
                href="/top-up/mobile-legends"
                className="font-heading font-bold text-xs text-[#00A3FF] hover:text-[#00FFE0] transition-colors tracking-wider uppercase flex items-center gap-0.5"
              >
                <span>DEALS &amp; NEW RELEASES</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            {/* 2 Store Deal Cards */}
            <div className="grid grid-cols-2 gap-3.5">
              {storeDeals.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/top-up/${deal.slug}`}
                  className="group relative flex flex-col rounded-xl overflow-hidden bg-[#0A1026] border border-[#152248] hover:border-[#FF5500]/70 hover:shadow-[0_8px_25px_rgba(255,85,0,0.25)] transition-all duration-300 hover:-translate-y-1 block"
                >
                  {/* Poster Thumbnail */}
                  <div className="relative w-full h-32 sm:h-36 overflow-hidden bg-[#050C1E]">
                    <img
                      src={deal.img}
                      alt={deal.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      style={{ filter: 'brightness(0.8) contrast(1.1)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026] via-transparent to-transparent opacity-85" />

                    {/* Red DEAL badge if present */}
                    {deal.badge && (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#FF5500] text-white font-heading font-black text-[9px] uppercase tracking-wider shadow-md">
                        {deal.badge}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-2.5 sm:p-3 leading-tight flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-heading font-bold text-xs sm:text-[13px] text-white group-hover:text-[#00A3FF] transition-colors truncate">
                        {deal.name}
                      </h4>
                      <p className="text-[10px] text-[#5A6E8D] mt-0.5 truncate">
                        {deal.category}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#121c38] flex items-center justify-between">
                      <span className="font-heading font-black text-xs sm:text-sm text-[#00F2FE]">
                        {deal.price}
                      </span>
                      <span className="text-[9px] font-heading font-bold uppercase text-[#FF5500] group-hover:translate-x-0.5 transition-transform flex items-center">
                        BUY →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
