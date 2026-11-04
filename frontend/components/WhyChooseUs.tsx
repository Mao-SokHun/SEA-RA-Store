'use client';

import React from 'react';
import { Zap, ShieldCheck, QrCode, Headphones } from 'lucide-react';

const trustFeatures = [
  {
    icon: Zap,
    iconColor: 'text-[#00F2FE]',
    iconBg: 'bg-[#00F2FE]/10 border-[#00F2FE]/30',
    titleKh: 'ចូលលឿនត្រឹម ៣ វិនាទី',
    titleEn: 'Instant 3-Sec Delivery',
    descKh: 'ប្រព័ន្ធ API ស្វ័យប្រវត្តិកំពូលបញ្ចូលផ្ទាល់ចូលក្នុង Game ID ភ្លាមៗ ២៤ ម៉ោង។',
    descEn: 'Direct publisher API delivers diamonds and currency to your ID within seconds.',
  },
  {
    icon: ShieldCheck,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/30',
    titleKh: 'សុវត្ថិភាព ១០០% គ្មាន Password',
    titleEn: '100% Safe • No Password',
    descKh: 'បញ្ចូលតែ User ID ឬ Player ID ប៉ុណ្ណោះ មិនប៉ះពាល់ Password ឬគណនីឡើយ។',
    descEn: 'Requires only Player ID & Zone. Never asks for your passwords or credentials.',
  },
  {
    icon: QrCode,
    iconColor: 'text-[#FF5500]',
    iconBg: 'bg-[#FF5500]/10 border-[#FF5500]/30',
    titleKh: 'ស្កេន Bakong KHQR 0% ថ្លៃសេវា',
    titleEn: 'Bakong KHQR 0% Fee',
    descKh: 'ទូទាត់រហ័សតាម ABA, Wing, ACLEDA, Canadia និងគ្រប់ធនាគារទាំងអស់។',
    descEn: 'Universal scan-to-pay via Bakong KHQR with zero hidden processing charges.',
  },
  {
    icon: Headphones,
    iconColor: 'text-[#3B82F6]',
    iconBg: 'bg-[#3B82F6]/10 border-[#3B82F6]/30',
    titleKh: 'ក្រុមការងារជំនួយ ២៤/៧',
    titleEn: '24/7 Gamer Support',
    descKh: 'ក្រុមការងារឆ្លើយតបរហ័សតាម Telegram និង Live Desk ដោះស្រាយ ២៤ ម៉ោង។',
    descEn: 'Instant human assistance via Telegram and Discord whenever you need help.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-8 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 select-none">
      
      {/* ── Section Title & Subtitle ── */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
        <h2 className="font-heading font-black text-xl sm:text-2xl text-white tracking-wider uppercase">
          ហេតុអ្វីជ្រើសរើស GAMEVERSE?
        </h2>
        <p className="text-xs sm:text-[13px] text-[#7F92B0]">
          សេវាកម្មបញ្ចូលលុយហ្គេមឈានមុខគេនៅកម្ពុជា ជាមួយសុវត្ថិភាពខ្ពស់ ១០០%
        </p>
      </div>

      {/* ── 4 Feature Cards Grid matching image 2 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trustFeatures.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0A1026] border border-[#152248] hover:border-[#00F2FE]/50 transition-all duration-300 flex flex-col justify-between shadow-lg hover:-translate-y-1 group"
            >
              <div className="space-y-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.iconBg} group-hover:scale-105 transition-transform`}
                >
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>

                <div className="leading-tight">
                  <h3 className="font-heading font-bold text-sm text-white group-hover:text-[#00F2FE] transition-colors">
                    {item.titleKh}
                  </h3>
                  <span className="text-[10px] text-[#5A6E8D] uppercase tracking-wider block font-heading">
                    {item.titleEn}
                  </span>
                </div>

                <p className="text-xs text-[#7F92B0] leading-relaxed">
                  {item.descKh}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
