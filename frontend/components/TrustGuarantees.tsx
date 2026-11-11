'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Zap, ShieldCheck, QrCode, Headphones } from 'lucide-react';

export default function TrustGuarantees() {
  const { t } = useApp();

  const features = [
    {
      icon: Zap,
      color: 'text-[#E5B55E]',
      bg: 'bg-[#E5B55E]/10 border-[#E5B55E]/25',
      title: t.trust.f1Title,
      desc: t.trust.f1Desc,
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/25',
      title: t.trust.f2Title,
      desc: t.trust.f2Desc,
    },
    {
      icon: QrCode,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/25',
      title: t.trust.f3Title,
      desc: t.trust.f3Desc,
    },
    {
      icon: Headphones,
      color: 'text-[#00D4FF]',
      bg: 'bg-[#00D4FF]/10 border-[#00D4FF]/25',
      title: t.trust.f4Title,
      desc: t.trust.f4Desc,
    },
  ];

  return (
    <section className="py-12 select-none border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with adequate spacing for Khmer script */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
            {t.trust.title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-normal">
            {t.trust.subtitle}
          </p>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#0F1424] border border-white/[0.08] hover:border-white/[0.2] transition-all flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.bg}`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
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
      </div>
    </section>
  );
}
