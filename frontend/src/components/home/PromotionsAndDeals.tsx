'use client';

import React from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { PROMOTIONS_NEWS, STORE_DEALS } from '@/data/news';
import { TRANSLATIONS } from '@/i18n/translations';
import { ChevronRight, Tag, ArrowRight } from 'lucide-react';

export default function PromotionsAndDeals() {
  const { language, openTopUp } = useOrderStore();
  const tNews = TRANSLATIONS[language].news;
  const tDeals = TRANSLATIONS[language].deals;

  return (
    <section id="promotions-news" className="mb-14 scroll-mt-24 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =================================================================== */}
        {/* LEFT 8 COLS: PROMOTIONS & NEWS (3 Cards Side-by-Side)               */}
        {/* =================================================================== */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
            {tNews.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PROMOTIONS_NEWS.map((item) => (
              <div
                key={item.id}
                onClick={() => openTopUp(item.gameId || '1')}
                className="rounded-2xl overflow-hidden bg-[#0F1A35] border border-[#2B6CFF]/30 hover:border-[#22D3EE]/70 transition-all flex flex-col justify-between shadow-xl group cursor-pointer hover:scale-[1.02]"
              >
                <div className="relative h-32 w-full overflow-hidden bg-black/40">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A35] via-transparent to-transparent" />
                  <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black uppercase ${item.tagColor}`}>
                    {item.tag}
                  </div>
                </div>

                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block font-mono">
                      {item.date}
                    </span>
                    <h4 className="text-xs font-black text-white group-hover:text-[#22D3EE] transition-colors line-clamp-1">
                      {language === 'km' ? item.titleKh : item.title}
                    </h4>
                    <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {language === 'km' ? item.summaryKh : item.summary}
                    </p>
                  </div>

                  <span className="text-[10px] font-black uppercase text-[#22D3EE] hover:underline pt-1 flex items-center gap-1">
                    <span>{tNews.readMore}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT 4 COLS: GAME STORE DEALS / BEST SELLERS                      */}
        {/* =================================================================== */}
        <div id="game-store" className="lg:col-span-4 space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
              {tDeals.title}
            </h2>
            <div
              onClick={() => openTopUp('1')}
              className="flex items-center gap-1 text-[10px] font-bold text-[#22D3EE] cursor-pointer hover:underline"
            >
              <span>DEALS & NEW RELEASES</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {STORE_DEALS.map((deal) => (
              <div
                key={deal.id}
                onClick={() => openTopUp(deal.gameId)}
                className="rounded-2xl overflow-hidden bg-[#0F1A35] border border-[#2B6CFF]/30 p-2.5 flex flex-col justify-between hover:border-[#FF7A18]/60 transition-all cursor-pointer group shadow-xl hover:scale-[1.02]"
              >
                <div className="relative h-36 w-full rounded-xl overflow-hidden bg-black/40 mb-2">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A35] via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#FF7A18] text-black shadow-md">
                    {deal.badge}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-[#22D3EE] transition-colors line-clamp-1">
                    {deal.title}
                  </h4>
                  <p className="text-[10px] text-neutral-400 truncate">
                    {deal.subtitle}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs font-black text-[#22D3EE] font-mono">
                      ${deal.priceUSD.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-neutral-400 line-through font-mono">
                      ${deal.originalPriceUSD.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

