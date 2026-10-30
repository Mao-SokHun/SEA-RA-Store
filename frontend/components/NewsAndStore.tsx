'use client';

import Link from 'next/link';

const newsItems = [
  {
    id: 1,
    title: 'GameVerse Summer Sale!',
    date: '05.11.2023',
    desc: 'GameVerse Summer Sale is back with amazing discounts on top-up packages.',
    img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=450&h=260&fit=crop&q=80',
    bannerText: 'SUMMER SALE!',
  },
  {
    id: 2,
    title: 'New Esports Season',
    date: '01.20.2023',
    desc: 'New Esports Season has kicked off with thrilling tournaments & rewards.',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=450&h=260&fit=crop&q=80',
    bannerText: 'ESPORTS',
  },
  {
    id: 3,
    title: 'Patch Notes 1.3',
    date: '06.21.2023',
    desc: 'Patch Notes 1.3 introduces instant direct API and zero fee Bakong KHQR checkout.',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=450&h=260&fit=crop&q=80',
    bannerText: 'UPDATE',
  },
];

const storeDeals = [
  {
    id: 'valiant-force',
    name: 'Valiant Force',
    category: 'Gems',
    price: '$2.50',
    badge: 'DEAL',
    img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=400&fit=crop&q=80',
    targetLink: '/top-up/shadowfall',
  },
  {
    id: 'shadowfall',
    name: 'Shadowfall',
    category: 'Fantasy',
    price: '$7.50',
    badge: null,
    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=400&fit=crop&q=80',
    targetLink: '/top-up/shadowfall',
  },
];

export default function NewsAndStore() {
  return (
    <section id="store" className="py-8 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ── Left: LATEST NEWS & UPDATES (8 cols on lg) ── */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-en font-black text-lg sm:text-xl text-white tracking-wider uppercase">
                LATEST NEWS &amp; UPDATES
              </h2>
            </div>

            {/* 3 News Cards in a Row Matching Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col rounded-xl overflow-hidden bg-[#0A1026] border border-[#152248] hover:border-[#00A3FF]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,163,255,0.2)]"
                >
                  {/* Thumbnail Image with Banner Graphic */}
                  <div className="relative w-full h-28 sm:h-32 overflow-hidden bg-[#050C1E] flex items-center justify-center">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      style={{ filter: 'brightness(0.75) contrast(1.1)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026] via-transparent to-transparent opacity-80" />
                    
                    {/* Centered Graphic Banner Text */}
                    <span className="relative z-10 font-en font-black text-xs sm:text-sm tracking-wider text-white bg-black/60 px-2.5 py-1 rounded border border-white/20 uppercase drop-shadow-md">
                      {item.bannerText}
                    </span>
                  </div>

                  {/* Content Area */}
                  <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
                    <div>
                      <span className="font-en text-[10px] text-[#5A6E8D]">
                        {item.date}
                      </span>
                      <h3 className="font-en font-bold text-xs sm:text-sm text-white group-hover:text-[#00A3FF] transition-colors leading-snug mt-0.5 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="font-en text-[11px] text-[#7F92B0] leading-relaxed mt-1 line-clamp-2">
                        {item.desc}
                      </p>
                    </div>

                    <button className="font-en font-bold text-[11px] text-[#00A3FF] hover:underline self-start mt-1">
                      READ MORE
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-en font-black text-lg sm:text-xl text-white tracking-wider uppercase">
                GAME STORE
              </h2>
            </div>

            {/* Dark Container Box for Store Deals */}
            <div className="p-4 rounded-xl bg-[#0A1026] border border-[#152248] flex flex-col justify-between">
              
              {/* Deals & New Releases Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#152248]">
                <span className="font-en font-bold text-xs text-[#7F92B0] tracking-wider uppercase">
                  DEALS &amp; NEW RELEASES
                </span>
                <span className="font-en font-bold text-xs text-[#00A3FF] hover:underline cursor-pointer">
                  &gt;
                </span>
              </div>

              {/* 2 Vertical Deal Cards Side-by-Side */}
              <div className="grid grid-cols-2 gap-3">
                {storeDeals.map((deal) => (
                  <Link
                    key={deal.id}
                    href={deal.targetLink}
                    className="group flex flex-col rounded-lg overflow-hidden bg-[#070D20] border border-[#16244C] hover:border-[#00A3FF]/70 transition-all duration-300 hover:-translate-y-1 block"
                  >
                    {/* Deal Image */}
                    <div className="relative w-full h-28 sm:h-32 overflow-hidden bg-[#050C1E]">
                      <img
                        src={deal.img}
                        alt={deal.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        style={{ filter: 'brightness(0.85)' }}
                      />
                      {deal.badge && (
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-sm text-[8px] font-black font-en text-white uppercase tracking-wider bg-[#E63946]">
                          {deal.badge}
                        </span>
                      )}
                    </div>

                    {/* Deal Info */}
                    <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="font-en font-bold text-xs text-white group-hover:text-[#00A3FF] transition-colors truncate">
                          {deal.name}
                        </h4>
                        <span className="font-en text-[10px] text-[#5A6E8D] block">
                          {deal.category}
                        </span>
                      </div>

                      <span className="font-en font-black text-xs sm:text-sm text-white mt-1.5">
                        {deal.price}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
