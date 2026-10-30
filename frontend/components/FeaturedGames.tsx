'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const featuredGames = [
  {
    id: 'cyberbound-2077',
    name: 'Cyberbound 2077',
    embossedTitle: 'CYBERBOUND 2077',
    titleColor: '#00FFE0',
    genre: 'Game • Rating',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=750&fit=crop&q=85',
    targetLink: '/top-up/mobile-legends',
  },
  {
    id: 'mythic-heroes',
    name: 'Mythic Heroes',
    embossedTitle: 'MYTHIC HEROES',
    titleColor: '#FFD700',
    genre: 'Game • Rating',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=750&fit=crop&q=85',
    targetLink: '/top-up/free-fire',
  },
  {
    id: 'star-drifters',
    name: 'Star Drifters',
    embossedTitle: 'STAR DRIFTERS',
    titleColor: '#FFFFFF',
    genre: 'Game • Rating',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=750&fit=crop&q=85',
    targetLink: '/top-up/pubg-mobile',
  },
  {
    id: 'aegis-ascendant',
    name: 'Aegis Ascendant',
    embossedTitle: 'AEGIS ASCENDANT',
    titleColor: '#FFFFFF',
    genre: 'Game • Rating',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&h=750&fit=crop&q=85',
    targetLink: '/top-up/genshin-impact',
  },
];

export default function FeaturedGames() {
  return (
    <section id="games" className="py-8 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">

      {/* ── Section Header (FEATURED GAMES in Mockup) ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-en font-black text-lg sm:text-xl text-white tracking-wider uppercase">
          FEATURED GAMES
        </h2>

        {/* Header Navigation Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Previous"
            className="w-7 h-7 rounded-md bg-[#0A1026] border border-[#16244C] hover:border-[#00A3FF] text-[#7F92B0] hover:text-white flex items-center justify-center transition-all"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            aria-label="Next"
            className="w-7 h-7 rounded-md bg-[#0A1026] border border-[#16244C] hover:border-[#00A3FF] text-[#7F92B0] hover:text-white flex items-center justify-center transition-all"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 4 Vertical Cards Grid Matching Mockup 100% ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {featuredGames.map((game) => (
          <div
            key={game.id}
            className="group flex flex-col rounded-xl overflow-hidden bg-[#0A1026] border border-[#152248] hover:border-[#00A3FF]/70 hover:shadow-[0_8px_30px_rgba(0,163,255,0.25)] transition-all duration-300 hover:-translate-y-1"
          >
            {/* ── Card Cover Image with Embossed Game Title ── */}
            <div className="relative overflow-hidden w-full h-44 sm:h-52 bg-[#050C1E] flex flex-col justify-end p-3">
              <img
                src={game.img}
                alt={game.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                style={{ filter: 'brightness(0.85) contrast(1.1)' }}
              />

              {/* Bottom vignette for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026] via-transparent to-transparent opacity-90" />

              {/* Embossed Stylized Game Title in bottom of artwork (matching mockup) */}
              <div className="relative z-10 text-center w-full">
                <span
                  className="font-en font-black text-xs sm:text-sm tracking-widest uppercase block drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                  style={{ color: game.titleColor }}
                >
                  {game.embossedTitle}
                </span>
              </div>
            </div>

            {/* ── Card Info Area ── */}
            <div className="p-3 sm:p-4 pt-2 flex flex-col flex-1 justify-between gap-3">
              <div>
                <h3 className="font-en font-bold text-white text-sm sm:text-base leading-tight group-hover:text-[#00A3FF] transition-colors truncate">
                  {game.name}
                </h3>
                
                <p className="font-en text-[11px] text-[#6E82A5] mt-0.5">
                  {game.genre}
                </p>

                {/* Stars Rating: ★★★★★ 4.5 */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="flex items-center gap-0.5 text-[#FFC107]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={11}
                        fill={s <= Math.floor(game.rating) ? '#FFC107' : 'none'}
                        stroke={s <= Math.floor(game.rating) ? '#FFC107' : '#4E5F80'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#FFC107] font-en">
                    {game.rating}
                  </span>
                </div>
              </div>

              {/* ── Full-Width Royal Blue to Cyan Button (PLAY / TOP UP) ── */}
              <Link
                href={game.targetLink}
                className="w-full py-2.5 rounded-lg font-en font-black text-xs sm:text-sm text-white tracking-widest uppercase flex items-center justify-center bg-gradient-to-r from-[#1B74E4] to-[#00A3FF] hover:from-[#1560C2] hover:to-[#008DD6] shadow-[0_4px_16px_rgba(0,163,255,0.4)] hover:shadow-[0_6px_22px_rgba(0,163,255,0.6)] transition-all active:scale-[0.98]"
              >
                PLAY / TOP UP
              </Link>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
