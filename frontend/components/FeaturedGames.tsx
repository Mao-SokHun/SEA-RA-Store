'use client';

import { ChevronLeft, ChevronRight, Star, Zap } from 'lucide-react';

const featuredGames = [
  {
    id: 1,
    name: 'Mobile Legends',
    subtitle: 'Diamonds • Weekly Pass',
    rating: 4.9,
    reviews: '12.4k',
    price: 'From $0.99',
    badge: 'HOT',
    badgeColor: '#ef4444',
    color: '#00a8ff',
    img: 'https://placehold.co/200x250/040b1a/00a8ff?text=MLBB',
    currency: '💎 Diamonds',
  },
  {
    id: 2,
    name: 'Genshin Impact',
    subtitle: 'Genesis Crystals',
    rating: 4.8,
    reviews: '9.2k',
    price: 'From $1.49',
    badge: 'NEW',
    badgeColor: '#10b981',
    color: '#10b981',
    img: 'https://placehold.co/200x250/040b1a/10b981?text=GENSHIN',
    currency: '✨ Crystals',
  },
  {
    id: 3,
    name: 'Free Fire',
    subtitle: 'Diamonds • Elite Pass',
    rating: 4.7,
    reviews: '15.1k',
    price: 'From $0.79',
    badge: 'HOT',
    badgeColor: '#f97316',
    color: '#f97316',
    img: 'https://placehold.co/200x250/040b1a/f97316?text=FREE+FIRE',
    currency: '💎 Diamonds',
  },
  {
    id: 4,
    name: 'PUBG Mobile',
    subtitle: 'UC • Royale Pass',
    rating: 4.6,
    reviews: '8.7k',
    price: 'From $1.29',
    badge: 'DEAL',
    badgeColor: '#8b5cf6',
    color: '#8b5cf6',
    img: 'https://placehold.co/200x250/040b1a/8b5cf6?text=PUBG',
    currency: '🪙 UC',
  },
  {
    id: 5,
    name: 'Call of Duty',
    subtitle: 'CP Points • Battle Pass',
    rating: 4.8,
    reviews: '6.3k',
    price: 'From $0.99',
    badge: 'NEW',
    badgeColor: '#10b981',
    color: '#10b981',
    img: 'https://placehold.co/200x250/040b1a/10b981?text=COD',
    currency: '🔫 CP Points',
  },
];

export default function FeaturedGames() {
  return (
    <section className="py-10" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-xl text-white section-title">⚡ FEATURED TOP UPS</h2>
          </div>
          <div className="flex gap-2">
            <button className="nav-arrow"><ChevronLeft size={14} /></button>
            <button className="nav-arrow"><ChevronRight size={14} /></button>
          </div>
        </div>

        {/* Game cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {featuredGames.map((game) => (
            <div key={game.id} className="card-game group cursor-pointer">
              {/* Image */}
              <div className="relative overflow-hidden" style={{ height: '160px' }}>
                <img
                  src={game.img}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Badge */}
                <span
                  className="absolute top-2 left-2 text-white px-2 py-0.5 rounded text-xs font-bold"
                  style={{ background: game.badgeColor, fontSize: '10px' }}
                >
                  {game.badge}
                </span>
                {/* Overlay gradient */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(10,20,40,0.9) 0%, transparent 60%)' }} />
                {/* Currency badge */}
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-xs font-medium" style={{ color: game.color }}>{game.currency}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-bold text-white text-sm mb-0.5 truncate">{game.name}</h3>
                <p className="text-xs mb-2 truncate" style={{ color: '#4a5a7a' }}>{game.subtitle}</p>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      fill={i < Math.floor(game.rating) ? '#facc15' : 'none'}
                      stroke={i < Math.floor(game.rating) ? '#facc15' : '#4a5a7a'}
                    />
                  ))}
                  <span className="text-xs" style={{ color: '#4a5a7a' }}>({game.reviews})</span>
                </div>

                {/* Price + Button */}
                <p className="text-xs font-bold mb-2" style={{ color: '#facc15' }}>{game.price}</p>
                <button className="btn-topup flex items-center justify-center gap-1">
                  <Zap size={12} fill="white" />
                  TOP UP
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

