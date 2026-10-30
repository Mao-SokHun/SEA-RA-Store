'use client';

import { ChevronLeft, ChevronRight, Star, Zap } from 'lucide-react';

const featuredGames = [
  {
    id: 1,
    name: 'Mobile Legends: Bang Bang',
    genre: 'MOBA • Diamonds & Pass',
    rating: 4.9,
    badge: 'INSTANT',
    color: '#00a8ff',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=500&fit=crop&q=80',
    overlayColor: 'rgba(0,80,180,0.35)',
  },
  {
    id: 2,
    name: 'Free Fire & Free Fire Max',
    genre: 'Battle Royale • Diamonds',
    rating: 4.8,
    badge: 'INSTANT',
    color: '#f97316',
    img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=500&fit=crop&q=80',
    overlayColor: 'rgba(180,50,0,0.35)',
  },
  {
    id: 3,
    name: 'PUBG Mobile',
    genre: 'Battle Royale • Unknown Cash (UC)',
    rating: 4.9,
    badge: 'INSTANT',
    color: '#facc15',
    img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=500&fit=crop&q=80',
    overlayColor: 'rgba(100,80,0,0.35)',
  },
  {
    id: 4,
    name: 'Roblox (Robux Direct)',
    genre: 'Metaverse / Sandbox • Robux Direct',
    rating: 4.9,
    badge: 'INSTANT',
    color: '#10b981',
    img: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=500&fit=crop&q=80',
    overlayColor: 'rgba(0,100,60,0.35)',
  },
  {
    id: 5,
    name: 'Genshin Impact',
    genre: 'RPG • Genesis Crystals',
    rating: 4.8,
    badge: 'INSTANT',
    color: '#8b5cf6',
    img: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=500&fit=crop&q=80',
    overlayColor: 'rgba(70,0,140,0.35)',
  },
];

export default function FeaturedGames() {
  return (
    <section className="py-10" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1400px] mx-auto px-4">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <span className="font-km" style={{ color: '#8b9ab4', fontWeight: 400 }}>ហ្គេមរំចប់ </span>
            <span className="font-en font-bold text-white">(FEATURED GAMES)</span>
          </h2>
          <div className="flex gap-2">
            <button className="nav-arrow"><ChevronLeft size={14} /></button>
            <button className="nav-arrow"><ChevronRight size={14} /></button>
          </div>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid #1a2a4a',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.border = `1px solid ${game.color}60`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${game.color}20`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.border = '1px solid #1a2a4a';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* ── Image area (tall, ~60% of card) ── */}
              <div className="relative overflow-hidden" style={{ height: '220px', flexShrink: 0 }}>
                {/* Background image */}
                <img
                  src={game.img}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ filter: 'brightness(0.75) saturate(1.3)' }}
                />

                {/* Color tint overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: game.overlayColor }}
                />

                {/* Bottom gradient fade into card bg */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-20"
                  style={{
                    background: 'linear-gradient(0deg, var(--bg-card) 0%, transparent 100%)',
                  }}
                />

                {/* ⚡ INSTANT badge top-left */}
                <div
                  className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md"
                  style={{
                    background: 'rgba(10,20,50,0.75)',
                    border: `1px solid ${game.color}50`,
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <Zap size={10} fill={game.color} color={game.color} />
                  <span
                    className="font-bold tracking-wider"
                    style={{ color: game.color, fontSize: '10px' }}
                  >
                    {game.badge}
                  </span>
                </div>
              </div>

              {/* ── Info area ── */}
              <div className="flex flex-col flex-1 px-4 pt-0 pb-4 gap-2">
                {/* Game name */}
                <p className="font-bold text-white text-sm leading-snug mt-1">
                  {game.name}
                </p>
                {/* Genre */}
                <p className="text-xs leading-tight" style={{ color: '#4a5a7a' }}>
                  {game.genre}
                </p>

                {/* Stars + rating */}
                <div className="flex items-center gap-1.5 mt-auto mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={11}
                      fill={s <= Math.floor(game.rating) ? '#facc15' : 'none'}
                      stroke={s <= Math.floor(game.rating) ? '#facc15' : '#4a5a7a'}
                    />
                  ))}
                  <span className="text-xs font-bold" style={{ color: '#facc15' }}>
                    {game.rating}
                  </span>
                </div>

                {/* TOP UP button */}
                <button
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-sm text-white tracking-wide transition-all duration-200 group-hover:brightness-110 font-km"
                  style={{
                    background: 'linear-gradient(135deg, #1e90ff 0%, #00bfff 100%)',
                    boxShadow: '0 2px 12px rgba(30,144,255,0.35)',
                  }}
                >
                  <Zap size={13} fill="white" />
                  បញ្ចូលយ៉ាង
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
