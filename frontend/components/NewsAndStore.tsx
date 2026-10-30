'use client';

import { ChevronRight, ShoppingBag, Tag, Zap } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    badge: '💰 FLASH SALE',
    badgeColor: '#ef4444',
    title: 'TopUpVerse Summer Sale!',
    date: '02.11.2025',
    desc: 'TopUpVerse Summer Sale is back! Up to 50% off on selected games. Don\'t miss it!',
    img: 'https://placehold.co/300x160/040b1a/ef4444?text=SALE',
  },
  {
    id: 2,
    badge: '🆕 NEW GAME',
    badgeColor: '#10b981',
    title: 'New Season Rewards Added',
    date: '09.25.2025',
    desc: 'New Esports Season means new exclusive top up packages for your favorite games.',
    img: 'https://placehold.co/300x160/040b1a/10b981?text=NEW',
  },
  {
    id: 3,
    badge: '📢 UPDATE',
    badgeColor: '#8b5cf6',
    title: 'Platform Update 1.3',
    date: '06.23.2025',
    desc: 'Faster checkout, new payment methods, and exclusive bundle deals are now live.',
    img: 'https://placehold.co/300x160/040b1a/8b5cf6?text=UPDATE',
  },
];

const storeDeals = [
  {
    id: 1,
    name: 'ML Diamonds x500',
    price: '$2.50',
    original: '$3.50',
    game: 'Mobile Legends',
    badge: 'DEAL',
    color: '#00a8ff',
    img: 'https://placehold.co/130x90/040b1a/00a8ff?text=ML+x500',
  },
  {
    id: 2,
    name: 'Genshin Welkin',
    price: '$4.99',
    original: '$6.99',
    game: 'Genshin Impact',
    badge: 'HOT',
    color: '#10b981',
    img: 'https://placehold.co/130x90/040b1a/10b981?text=WELKIN',
  },
  {
    id: 3,
    name: 'FF Elite Pass',
    price: '$7.50',
    original: '$9.99',
    game: 'Free Fire',
    badge: 'NEW',
    color: '#f97316',
    img: 'https://placehold.co/130x90/040b1a/f97316?text=FF+PASS',
  },
];

export default function NewsAndStore() {
  return (
    <section className="py-10" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest News */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-xl text-white section-title">📰 LATEST NEWS &amp; UPDATES</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {newsItems.map((item) => (
                <div key={item.id} className="card-game group cursor-pointer">
                  <div className="relative overflow-hidden" style={{ height: '110px' }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span
                      className="absolute top-2 left-2 text-white px-2 py-0.5 rounded text-xs font-bold"
                      style={{ background: item.badgeColor, fontSize: '10px' }}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs mb-1" style={{ color: '#4a5a7a' }}>{item.date}</p>
                    <h3 className="text-sm font-bold text-white mb-1 leading-tight">{item.title}</h3>
                    <p className="text-xs mb-3 leading-relaxed" style={{ color: '#4a5a7a' }}>{item.desc}</p>
                    <button className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#00a8ff' }}>
                      READ MORE <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Up Store */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-xl text-white section-title flex items-center gap-2">
                <ShoppingBag size={18} style={{ color: '#00a8ff' }} />
                TOP UP STORE
              </h2>
              <button className="flex items-center gap-1 text-xs" style={{ color: '#00a8ff' }}>
                All Deals <ChevronRight size={12} />
              </button>
            </div>

            <div className="card-game p-4">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={14} style={{ color: '#facc15' }} />
                <span className="text-sm font-bold" style={{ color: '#facc15' }}>DEALS &amp; HOT PACKAGES</span>
              </div>

              <div className="space-y-3">
                {storeDeals.map((deal) => (
                  <div key={deal.id} className="flex gap-3 cursor-pointer group p-2 rounded-lg transition-colors"
                       style={{ background: 'rgba(0,0,0,0.2)' }}
                       onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,168,255,0.05)')}
                       onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.2)')}>
                    <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: '90px', height: '65px' }}>
                      <img src={deal.img} alt={deal.name} className="w-full h-full object-cover" />
                      <span
                        className="absolute top-1 left-1 text-white px-1 rounded font-bold"
                        style={{ background: deal.color, fontSize: '9px' }}
                      >
                        {deal.badge}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs" style={{ color: '#4a5a7a' }}>{deal.game}</p>
                      <p className="text-sm font-bold text-white leading-tight">{deal.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-sm" style={{ color: '#facc15' }}>{deal.price}</span>
                        <span className="text-xs line-through" style={{ color: '#4a5a7a' }}>{deal.original}</span>
                      </div>
                    </div>
                    <button className="self-center flex-shrink-0 p-1.5 rounded-lg transition-colors"
                            style={{ background: 'rgba(0,168,255,0.15)', color: '#00a8ff' }}>
                      <Zap size={14} fill="#00a8ff" />
                    </button>
                  </div>
                ))}
              </div>

              <button className="btn-topup mt-4">VIEW ALL PACKAGES</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

