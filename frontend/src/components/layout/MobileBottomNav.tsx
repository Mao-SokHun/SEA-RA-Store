'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Zap, Gamepad2, Receipt, User as UserIcon } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { language } = useLanguage();

  const isHome = pathname === '/' || pathname === '/top-up';
  const isOrders = pathname === '/orders';
  const isProfile = pathname === '/profile';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0a0d14]/95 backdrop-blur-2xl border-t border-white/[0.08] px-3 py-2 shadow-[0_-10px_25px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Tab 1: Top-Up Home */}
        <Link
          href="/top-up"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            isHome && !pathname.includes('#')
              ? 'text-[#f2ca50]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isHome
                ? 'bg-[#f2ca50]/15 border border-[#f2ca50]/30 shadow-[0_0_12px_rgba(242,202,80,0.25)]'
                : 'bg-transparent'
            }`}
          >
            <Zap className={`w-5 h-5 ${isHome ? 'fill-[#f2ca50] text-[#f2ca50]' : ''}`} />
          </div>
          <span className="text-[10px] font-extrabold tracking-wide">
            {language === 'kh' ? 'បញ្ចូលលុយ' : 'Top-Up'}
          </span>
        </Link>

        {/* Tab 2: Hot Games */}
        <Link
          href="/top-up#hot-games"
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-neutral-400 hover:text-[#00e4f2] transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-transparent">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-extrabold tracking-wide">
            {language === 'kh' ? 'ហ្គេមទាំងអស់' : 'Games'}
          </span>
        </Link>

        {/* Tab 3: Track Orders (Guest lookup) */}
        <Link
          href="/orders"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            isOrders
              ? 'text-[#f2ca50]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all relative ${
              isOrders
                ? 'bg-[#f2ca50]/15 border border-[#f2ca50]/30 shadow-[0_0_12px_rgba(242,202,80,0.25)]'
                : 'bg-transparent'
            }`}
          >
            <Receipt className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[10px] font-extrabold tracking-wide">
            {language === 'kh' ? 'វិក្កយបត្រ' : 'Orders'}
          </span>
        </Link>

        {/* Tab 4: Profile & Saved IDs */}
        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            isProfile
              ? 'text-[#f2ca50]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isProfile
                ? 'bg-[#f2ca50]/15 border border-[#f2ca50]/30 shadow-[0_0_12px_rgba(242,202,80,0.25)]'
                : 'bg-transparent'
            }`}
          >
            <UserIcon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-extrabold tracking-wide">
            {language === 'kh' ? 'គណនី' : 'Profile'}
          </span>
        </Link>
      </div>
    </nav>
  );
}
