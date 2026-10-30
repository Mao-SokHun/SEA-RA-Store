'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

const trendingGames = [
  {
    id: 'mobile-legends',
    name: 'Mobile Legends',
    soldCount: '24,850+ ការបញ្ចូល',
    tag: 'MLBB',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=300&fit=crop&q=80',
    color: '#00a8ff',
    icon: '💎',
  },
  {
    id: 'free-fire',
    name: 'Free Fire',
    soldCount: '19,340+ ការបញ្ចូល',
    tag: 'FF MAX',
    img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&h=300&fit=crop&q=80',
    color: '#f97316',
    icon: '🔥',
  },
  {
    id: 'genshin-impact',
    name: 'Genshin Impact',
    soldCount: '12,500+ ការបញ្ចូល',
    tag: 'HOYOVERSE',
    img: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&h=300&fit=crop&q=80',
    color: '#10b981',
    icon: '✨',
  },
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile',
    soldCount: '16,200+ ការបញ្ចូល',
    tag: 'TENCENT',
    img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&h=300&fit=crop&q=80',
    color: '#facc15',
    icon: '🪙',
  },
  {
    id: 'valorant',
    name: 'Valorant',
    soldCount: '14,120+ ការបញ្ចូល',
    tag: 'RIOT GAMES',
    img: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&h=300&fit=crop&q=80',
    color: '#ef4444',
    icon: '🎯',
  },
];

export default function TrendingNow() {
  return (
    <section className="py-10 bg-[#070f24]/60">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="font-km font-bold text-lg sm:text-xl text-white">
              ហ្គេមពេញនិយមបំផុត{' '}
              <span className="font-en text-[#00a8ff] text-base sm:text-lg font-black uppercase tracking-wider">
                (TRENDING NOW)
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Previous"
              className="w-8 h-8 rounded-lg bg-[#0a1428] border border-[#1a335a] hover:border-[#00a8ff] text-[#8b9ab4] hover:text-white flex items-center justify-center transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              aria-label="Next"
              className="w-8 h-8 rounded-lg bg-[#0a1428] border border-[#1a335a] hover:border-[#00a8ff] text-[#8b9ab4] hover:text-white flex items-center justify-center transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ── Trending Cards (Wide Landscape Layout like Reference) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {trendingGames.map((game, idx) => (
            <Link
              key={game.id}
              href={`/top-up/${game.id}`}
              className="group relative rounded-xl overflow-hidden aspect-[16/11] border border-[#1a335a] hover:border-[#00a8ff]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,168,255,0.2)] block"
            >
              {/* Background Artwork */}
              <img
                src={game.img}
                alt={game.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                style={{ filter: 'brightness(0.6) contrast(1.1)' }}
              />

              {/* Gradient Shade for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040b1a] via-[#040b1a]/50 to-transparent" />

              {/* Top Rank Badge */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-en bg-[#040b1a]/85 border border-[#1a335a] text-[#00a8ff]">
                  #{idx + 1} HOT
                </span>
              </div>

              {/* Bottom Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2.5">
                {/* Game Mini Icon Thumbnail */}
                <div className="w-8 h-8 rounded-lg bg-[#0a1428]/90 border border-[#1a335a] flex items-center justify-center text-sm flex-shrink-0 shadow-md">
                  {game.icon}
                </div>

                {/* Text Info */}
                <div className="flex flex-col min-w-0">
                  <span className="font-km font-bold text-white text-xs sm:text-sm leading-tight truncate group-hover:text-[#00a8ff] transition-colors">
                    {game.name}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingUp size={11} className="text-[#00a8ff]" />
                    <span className="font-km text-[10px] text-[#8b9ab4] truncate">
                      {game.soldCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Glowing Outline on Hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-[#00a8ff] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
