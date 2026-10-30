'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, Zap } from 'lucide-react';

const featuredGames = [
  {
    id: 'mobile-legends',
    name: 'Cyberbound 2077',
    subName: 'Mobile Legends Bang Bang',
    genre: 'Game • MOBA Action',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=450&fit=crop&q=85',
  },
  {
    id: 'free-fire',
    name: 'Mythic Heroes',
    subName: 'Free Fire & FF Max',
    genre: 'Game • Battle Royale',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=450&fit=crop&q=85',
  },
  {
    id: 'pubg-mobile',
    name: 'Star Drifters',
    subName: 'PUBG Mobile UC',
    genre: 'Game • Sci-Fi Shooter',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=450&fit=crop&q=85',
  },
  {
    id: 'genshin-impact',
    name: 'Aegis Ascendant',
    subName: 'Genshin Impact Crystals',
    genre: 'Game • Open World RPG',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&h=450&fit=crop&q=85',
  },
];

export default function FeaturedGames() {
  return (
    <section id="games" className="py-10 bg-[#040b1a]">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header (Matches FEATURED GAMES in Reference) ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="font-en font-black text-lg sm:text-xl text-white tracking-wider uppercase">
              FEATURED GAMES
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

        {/* ── 4 Cards Grid Matching Reference 100% ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              className="group flex flex-col rounded-2xl overflow-hidden bg-[#0a1428] border border-[#1a335a] hover:border-[#00a8ff]/70 hover:shadow-[0_10px_35px_rgba(0,168,255,0.25)] transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* ── Card Image (Compact, 175px tall, character art) ── */}
              <div className="relative overflow-hidden w-full h-44 sm:h-48 flex-shrink-0 bg-[#050c1e]">
                <img
                  src={game.img}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  style={{ filter: 'brightness(0.9) contrast(1.1)' }}
                />

                {/* Subtle vignette shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1428] via-transparent to-black/20" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#040b1a]/80 border border-[#00a8ff]/30 backdrop-blur-sm">
                  <span className="text-[10px] font-bold text-[#00a8ff] font-en tracking-wider flex items-center gap-1">
                    <Zap size={9} fill="#00a8ff" /> TOP UP
                  </span>
                </div>
              </div>

              {/* ── Card Body (All info & button clearly visible) ── */}
              <div className="p-3.5 sm:p-4 pt-2 flex flex-col flex-1 justify-between gap-2.5">
                <div>
                  {/* Game Name */}
                  <h3 className="font-en font-black text-white text-base leading-tight group-hover:text-[#00a8ff] transition-colors truncate">
                    {game.name}
                  </h3>
                  
                  {/* Subtitle / Genre */}
                  <p className="font-km text-[11px] text-[#8b9ab4] mt-0.5 truncate">
                    {game.genre}
                  </p>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex items-center gap-0.5 text-[#facc15]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={11}
                          fill={s <= Math.floor(game.rating) ? '#facc15' : 'none'}
                          stroke={s <= Math.floor(game.rating) ? '#facc15' : '#4a5a7a'}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#facc15] font-en">
                      {game.rating}
                    </span>
                  </div>
                </div>

                {/* ── Glowing Electric-Blue Full-Width Button (Exact Match to Reference [PLAY] button) ── */}
                <Link
                  href={`/top-up/${game.id}`}
                  className="w-full py-2 sm:py-2.5 rounded-xl font-en font-black text-xs sm:text-sm text-white tracking-widest uppercase flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#1e6beb] to-[#00b4d8] hover:from-[#185adb] hover:to-[#009ec0] shadow-[0_4px_16px_rgba(0,168,255,0.4)] hover:shadow-[0_6px_22px_rgba(0,168,255,0.6)] transition-all active:scale-[0.98]"
                >
                  <Zap size={13} fill="white" />
                  <span>PLAY / TOP UP</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
