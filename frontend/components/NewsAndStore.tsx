'use client';

import Link from 'next/link';
import { ChevronRight, Zap, Tag } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    title: 'GameVerse Summer Sale!',
    date: '05.11.2025',
    desc: 'The biggest gaming festival is here with up to 50% discount on all top-up packages.',
    img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=450&h=250&fit=crop&q=80',
    badge: 'SUMMER SALE',
    badgeBg: 'from-amber-500 to-orange-500',
  },
  {
    id: 2,
    title: 'New Esports Season Live',
    date: '01.20.2025',
    desc: 'Watch the best teams battle for glory and earn exclusive in-game rewards & bonuses.',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=450&h=250&fit=crop&q=80',
    badge: 'ESPORTS',
    badgeBg: 'from-blue-600 to-cyan-500',
  },
  {
    id: 3,
    title: 'Patch Notes 1.3 Update',
    date: '06.21.2025',
    desc: 'New balance changes, enhanced direct API speed, and zero fee Bakong KHQR checkout.',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=450&h=250&fit=crop&q=80',
    badge: 'UPDATE',
    badgeBg: 'from-purple-600 to-pink-500',
  },
];

const storeDeals = [
  {
    id: 'valiant-force',
    name: 'Valiant Force',
    category: 'Gems',
    price: '$2.50',
    original: '$4.99',
    badge: 'DEAL',
    img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=380&fit=crop&q=80',
  },
  {
    id: 'shadowfall',
    name: 'Shadowfall',
    category: 'Fantasy',
    price: '$7.50',
    original: '$12.00',
    badge: 'HOT',
    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=380&fit=crop&q=80',
  },
];

export default function NewsAndStore() {
  return (
    <section className="py-10 bg-[#040b1a]">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ── Left: LATEST NEWS & UPDATES (8 cols on lg) ── */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-en font-black text-lg sm:text-xl text-white tracking-wider uppercase">
                  LATEST NEWS &amp; UPDATES
                </h2>
              </div>

              {/* 3 News Cards in a row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {newsItems.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col rounded-2xl overflow-hidden bg-[#0a1428] border border-[#1a335a] hover:border-[#00a8ff]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,168,255,0.2)]"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full h-32 overflow-hidden bg-[#050c1e]">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        style={{ filter: 'brightness(0.85)' }}
                      />
                      <span
                        className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black font-en text-white uppercase tracking-wider bg-gradient-to-r ${item.badgeBg}`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                      <div>
                        <span className="font-en text-[10px] text-[#5a6f90]">
                          {item.date}
                        </span>
                        <h3 className="font-en font-black text-xs sm:text-sm text-white group-hover:text-[#00a8ff] transition-colors leading-snug mt-1 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="font-km text-[11px] text-[#8b9ab4] leading-relaxed mt-1 line-clamp-2">
                          {item.desc}
                        </p>
                      </div>

                      <button className="flex items-center gap-1 font-en font-bold text-xs text-[#00a8ff] group-hover:translate-x-1 transition-transform mt-2">
                        <span>READ MORE</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: GAME STORE (4 cols on lg) ── */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-en font-black text-lg sm:text-xl text-white tracking-wider uppercase">
                  GAME STORE
                </h2>
                <Link
                  href="#deals"
                  className="font-en font-bold text-xs text-[#00a8ff] hover:underline flex items-center gap-0.5"
                >
                  <span>DEALS &amp; NEW RELEASES</span>
                  <ChevronRight size={12} />
                </Link>
              </div>

              {/* 2 Side-by-Side Vertical Deal Cards */}
              <div className="grid grid-cols-2 gap-3.5">
                {storeDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="group flex flex-col rounded-2xl overflow-hidden bg-[#0a1428] border border-[#1a335a] hover:border-[#00a8ff]/60 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Deal Image */}
                    <div className="relative w-full h-36 overflow-hidden bg-[#050c1e]">
                      <img
                        src={deal.img}
                        alt={deal.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        style={{ filter: 'brightness(0.85)' }}
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black font-en text-white uppercase tracking-wider bg-[#ef4444]">
                        {deal.badge}
                      </span>
                    </div>

                    {/* Deal Info */}
                    <div className="p-3 flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="font-en font-black text-xs sm:text-sm text-white group-hover:text-[#00a8ff] transition-colors truncate">
                          {deal.name}
                        </h4>
                        <span className="font-en text-[10px] text-[#5a6f90]">
                          {deal.category}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-en font-black text-sm text-[#facc15]">
                          {deal.price}
                        </span>
                        <span className="font-en text-[10px] text-[#5a6f90] line-through">
                          {deal.original}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="#store"
              className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1e6beb] to-[#00b4d8] hover:from-[#185adb] hover:to-[#009ec0] text-white font-en font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(0,168,255,0.35)] transition-all"
            >
              <Zap size={13} fill="white" />
              <span>VIEW ALL STORE PACKAGES</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
