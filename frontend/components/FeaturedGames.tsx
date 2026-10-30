'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, Zap } from 'lucide-react';

const featuredGames = [
  {
    id: 'mobile-legends',
    name: 'Mobile Legends: Bang Bang',
    genre: 'MOBA • Diamonds & Weekly Pass',
    rating: 4.9,
    badge: 'INSTANT API',
    color: '#00a8ff',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=650&fit=crop&q=85',
    overlayColor: 'rgba(0, 80, 180, 0.35)',
  },
  {
    id: 'free-fire',
    name: 'Free Fire & Free Fire Max',
    genre: 'Battle Royale • Diamonds',
    rating: 4.8,
    badge: 'INSTANT API',
    color: '#f97316',
    img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&h=650&fit=crop&q=85',
    overlayColor: 'rgba(180, 50, 0, 0.35)',
  },
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile',
    genre: 'Battle Royale • Unknown Cash (UC)',
    rating: 4.9,
    badge: 'INSTANT API',
    color: '#facc15',
    img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&h=650&fit=crop&q=85',
    overlayColor: 'rgba(120, 90, 0, 0.35)',
  },
  {
    id: 'genshin-impact',
    name: 'Genshin Impact',
    genre: 'RPG • Genesis Crystals & Welkin',
    rating: 4.8,
    badge: 'INSTANT API',
    color: '#8b5cf6',
    img: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&h=650&fit=crop&q=85',
    overlayColor: 'rgba(80, 20, 160, 0.35)',
  },
  {
    id: 'roblox',
    name: 'Roblox (Robux Direct)',
    genre: 'Sandbox • Robux Direct Transfer',
    rating: 4.9,
    badge: 'INSTANT API',
    color: '#10b981',
    img: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&h=650&fit=crop&q=85',
    overlayColor: 'rgba(0, 120, 70, 0.35)',
  },
];

export default function FeaturedGames() {
  return (
    <section id="games" className="py-12 bg-[#040b1a]">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="font-km font-bold text-lg sm:text-xl text-white">
              ហ្គេមពេញនិយម{' '}
              <span className="font-en text-[#00a8ff] text-base sm:text-lg font-black uppercase tracking-wider">
                (FEATURED GAMES)
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

        {/* ── Cards Grid (4 to 5 cards matching reference) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              className="group flex flex-col rounded-2xl overflow-hidden bg-[#0a1428] border border-[#1a335a] hover:border-[#00a8ff]/60 hover:shadow-[0_8px_30px_rgba(0,168,255,0.25)] transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* ── Card Image (Tall Portrait ~62%) ── */}
              <div className="relative overflow-hidden w-full h-56 sm:h-64 flex-shrink-0">
                <img
                  src={game.img}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  style={{ filter: 'brightness(0.85) contrast(1.05)' }}
                />

                {/* Color Tint Overlay */}
                <div className="absolute inset-0" style={{ background: game.overlayColor }} />

                {/* Bottom Fade Overlay into card background */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a1428] via-[#0a1428]/60 to-transparent" />

                {/* Top-Left Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#040b1a]/85 border border-[#00a8ff]/30 backdrop-blur-md">
                  <Zap size={10} className="text-[#00a8ff]" fill="#00a8ff" />
                  <span className="text-[10px] font-bold text-[#00a8ff] font-en tracking-wider">
                    {game.badge}
                  </span>
                </div>
              </div>

              {/* ── Card Content ── */}
              <div className="p-4 pt-1 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-km font-bold text-white text-sm leading-snug line-clamp-1 group-hover:text-[#00a8ff] transition-colors">
                    {game.name}
                  </h3>
                  <p className="font-km text-[11px] text-[#5a6f90] mt-0.5 line-clamp-1">
                    {game.genre}
                  </p>

                  {/* Stars Rating */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex items-center gap-0.5">
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

                {/* ── Blue Gradient Full-Width TOP UP button ── */}
                <Link
                  href={`/top-up/${game.id}`}
                  className="w-full py-2.5 rounded-xl font-km font-bold text-xs sm:text-sm text-white tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-[#0088ff] to-[#00c8ff] hover:from-[#0077ee] hover:to-[#00bbee] shadow-[0_4px_15px_rgba(0,168,255,0.35)] hover:shadow-[0_6px_22px_rgba(0,168,255,0.55)] transition-all active:scale-[0.98]"
                >
                  <Zap size={14} fill="white" />
                  <span>បញ្ចូលលុយ</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
