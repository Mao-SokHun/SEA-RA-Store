'use client';

import React from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { TRANSLATIONS } from '@/i18n/translations';
import { Zap, ShieldCheck, QrCode, Headphones } from 'lucide-react';

export default function WhyChooseUs() {
  const { language } = useOrderStore();
  const t = TRANSLATIONS[language].whyUs;

  const features = [
    {
      icon: Zap,
      iconColor: 'text-[#22D3EE]',
      iconBg: 'bg-[#22D3EE]/15 border-[#22D3EE]/30',
      title: t.badge1Title,
      desc: t.badge1Desc,
    },
    {
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30',
      title: t.badge2Title,
      desc: t.badge2Desc,
    },
    {
      icon: QrCode,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/15 border-red-500/30',
      title: t.badge3Title,
      desc: t.badge3Desc,
    },
    {
      icon: Headphones,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15 border-blue-500/30',
      title: t.badge4Title,
      desc: t.badge4Desc,
    },
  ];

  return (
    <section className="mb-14 select-none">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
          {t.title}
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0F1A35] border border-[#2B6CFF]/30 hover:border-[#22D3EE]/60 transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.iconBg}`}
                >
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <h3 className="text-sm font-black text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
