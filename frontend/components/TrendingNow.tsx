'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

const trendingGames = [
  {
    id: 'valiant-force',
    name: 'Valiant Force',
    count: '3,070 players',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=350&fit=crop&q=80',
    iconText: 'VF',
    iconBg: '#f97316',
  },
  {
    id: 'apex-legends',
    name: 'Apex Legends',
    count: '2,201 players',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=350&fit=crop&q=80',
    iconText: 'A',
    iconBg: '#ef4444',
  },
  {
    id: 'lost-ark',
    name: 'Lost Ark',
    count: '2,307 players',
    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=350&fit=crop&q=80',
    iconText: 'LA',
    iconBg: '#ca8a04',
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    count: '3,691 players',
    img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&h=350&fit=crop&q=80',
    iconText: 'FN',
    iconBg: '#8b5cf6',
  },
  {
    id: 'mobile-legends',
    name: 'Mobile Legends',
    count: '5,840 players',
    img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&h=350&fit=crop&q=80',
    iconText: 'ML',
    iconBg: '#00a8ff',
  },
];

export default function TrendingNow() {
  return (
    <section className="py-10 bg-[#040b1a]">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header (TRENDING NOW in Reference) ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="font-en font-black text-lg sm:text-xl text-white tracking-wider uppercase">
              TRENDING NOW
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

        {/* ── 5 Cards in a Row Matching Reference 100% ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {trendingGames.map((game) => (
            <Link
              key={game.id}
              href={`/top-up/${game.id}`}
              className="group relative rounded-xl overflow-hidden aspect-[16/11] border border-[#1a335a] hover:border-[#00a8ff]/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,168,255,0.25)] block bg-[#0a1428]"
            >
              {/* Background Cover Art */}
              <img
                src={game.img}
                alt={game.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                style={{ filter: 'brightness(0.7) contrast(1.1)' }}
              />

              {/* Bottom Gradient for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040b1a] via-[#040b1a]/40 to-transparent" />

              {/* Bottom Info Bar Overlay (Matches Reference Bottom Banner) */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 flex items-center gap-2">
                {/* Game Mini Icon Thumbnail */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white font-en flex-shrink-0 shadow-md"
                  style={{ background: game.iconBg }}
                >
                  {game.iconText}
                </div>

                {/* Text Info */}
                <div className="flex flex-col min-w-0">
                  <span className="font-en font-bold text-white text-xs leading-tight truncate group-hover:text-[#00a8ff] transition-colors">
                    {game.name}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Users size={10} className="text-[#8b9ab4]" />
                    <span className="font-en text-[10px] text-[#8b9ab4] truncate">
                      {game.count}
                    </span>
                  </div>
                </div>
              </div>

              {/* Glowing Outline on Hover */}
              <div className="absolute inset-0 rounded-xl border border-[#00a8ff] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
