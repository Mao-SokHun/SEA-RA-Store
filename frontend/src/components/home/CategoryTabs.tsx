'use client';

import React from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { CATEGORIES } from '@/data/games';
import { TRANSLATIONS } from '@/i18n/translations';

export default function CategoryTabs() {
  const { language, selectedCategoryId, setSelectedCategoryId } = useOrderStore();
  const t = TRANSLATIONS[language].categories;

  return (
    <section className="mb-10 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
            <span>{t.sectionTitle}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Horizontal scrolling pill chips */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`group px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] text-black font-black shadow-[0_0_18px_rgba(34,211,238,0.4)] scale-[1.02]'
                  : 'bg-[#0F1A35] hover:bg-[#152347] border border-[#2B6CFF]/30 text-neutral-300 hover:text-white hover:border-[#22D3EE]/50'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{language === 'km' ? cat.labelKh : cat.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

