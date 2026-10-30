'use client';

import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

const trendingGames = [
  {
    id: 1,
    name: 'Mobile Legends',
    players: '2.4M sold',
    color: '#00a8ff',
    img: 'https://placehold.co/280x160/040b1a/00a8ff?text=MLBB',
    icon: '💎',
  },
  {
    id: 2,
    name: 'Genshin Impact',
    players: '1.8M sold',
    color: '#10b981',
    img: 'https://placehold.co/280x160/040b1a/10b981?text=GENSHIN',
    icon: '✨',
  },
  {
    id: 3,
    name: 'Free Fire',
    players: '3.1M sold',
    color: '#f97316',
    img: 'https://placehold.co/280x160/040b1a/f97316?text=FREEFIRE',
    icon: '🔥',
  },
  {
    id: 4,
    name: 'Fortnite',
    players: '890K sold',
    color: '#8b5cf6',
    img: 'https://placehold.co/280x160/040b1a/8b5cf6?text=FORTNITE',
    icon: '⚡',
  },
  {
    id: 5,
    name: 'Valorant',
    players: '1.2M sold',
    color: '#ef4444',
    img: 'https://placehold.co/280x160/040b1a/ef4444?text=VALORANT',
    icon: '🎯',
  },
];

export default function TrendingNow() {
  return (
    <section className="py-10" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl text-white section-title">🔥 TRENDING NOW</h2>
          <div className="flex gap-2">
            <button className="nav-arrow"><ChevronLeft size={14} /></button>
            <button className="nav-arrow"><ChevronRight size={14} /></button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {trendingGames.map((game, idx) => (
            <div
              key={game.id}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              style={{ height: '140px', border: `1px solid ${game.color}30` }}
            >
              <img
                src={game.img}
                alt={game.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, rgba(4,11,26,0.9) 0%, transparent 50%)` }} />

              {/* Rank badge */}
              <div className="absolute top-2 left-2">
                <span className={`rank-badge rank-${idx < 3 ? idx + 1 : 'other'} text-xs`} style={{ width: '22px', height: '22px', fontSize: '11px' }}>
                  #{idx + 1}
                </span>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{game.icon}</span>
                  <div>
                    <p className="font-bold text-white text-xs truncate">{game.name}</p>
                    <div className="flex items-center gap-1">
                      <Users size={9} style={{ color: game.color }} />
                      <p className="text-xs" style={{ color: game.color, fontSize: '10px' }}>{game.players}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover glow border */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{ boxShadow: `inset 0 0 0 2px ${game.color}60` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

