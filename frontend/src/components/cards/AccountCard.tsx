'use client';

import React from 'react';
import Link from 'next/link';
import { GameAccount } from '@/types';
import { Shield, Zap, Lock, Eye, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AccountCardProps {
  account: GameAccount;
}

export default function AccountCard({ account }: AccountCardProps) {
  const { t, language } = useLanguage();

  const coverImage =
    account.images?.find((img) => img.isCover)?.imageUrl ||
    account.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';

  const cleanBind = account.binds?.find((b) => b.bindType === 'clean');

  return (
    <div className={`group relative bg-[#151a23] hover:bg-[#1a202c] rounded-2xl border border-white/[0.08] hover:border-[#d4af37]/50 shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all duration-300 flex flex-col overflow-hidden ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      {/* Top Media Viewport */}
      <div className="relative w-full h-48 bg-[#0b0e14] overflow-hidden">
        <img
          src={coverImage}
          alt={account.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151a23] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#0b0e14]/90 text-[#f2ca50] border border-[#d4af37]/30 shadow-md">
            {account.game?.title || 'Game Asset'}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#00e4f2]/15 text-[#00e4f2] border border-[#00e4f2]/30 backdrop-blur-md shadow-md">
            {account.tierRank}
          </span>
        </div>

        {/* Status / Delivery Pill */}
        <div className="absolute top-3 right-3 z-10">
          {account.deliveryType === 'instant' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              <Zap className="w-3 h-3 text-emerald-400" />
              {t('instantDelivery')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              <Lock className="w-3 h-3 text-amber-400" />
              {t('escrowChat')}
            </span>
          )}
        </div>

        {/* Bottom image overlay specs */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-neutral-300">
          <span className="flex items-center gap-1 font-medium bg-[#0b0e14]/70 px-2 py-0.5 rounded backdrop-blur-sm">
            <CheckCircle2 className="w-3 h-3 text-[#00e4f2]" />
            {cleanBind ? t('cleanFirstMail') : t('changeableBinds')}
          </span>
          <span className="text-[10px] font-mono text-neutral-400">
            {account.serverRegion}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm text-neutral-100 group-hover:text-[#f2ca50] transition-colors line-clamp-1">
            {account.title}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
            {account.description ||
              (language === 'kh'
                ? 'គណនីបានផ្ទៀងផ្ទាត់ត្រឹមត្រូវ រួចរាល់សម្រាប់ការផ្ទេរភ្លាមៗ។'
                : 'Verified game account. Ready for immediate handover.')}
          </p>
        </div>

        {/* Seller & Escrow Verification Tag */}
        <div className="flex items-center justify-between py-2 border-y border-white/[0.06] text-xs">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Shield className="w-3.5 h-3.5 text-[#00e4f2]" />
            <span className="truncate max-w-[110px]">
              {account.seller?.username || 'Verified Seller'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <span>{language === 'kh' ? 'ធានា ១០០% សុវត្ថិភាព' : '100% SLA Guard'}</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
              {t('priceTag')}
            </span>
            <span className="text-lg font-black text-[#f2ca50] tracking-tight">
              ${Number(account.price).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/accounts/${account.id}`}
              className="p-2 rounded-xl bg-[#1d2026] hover:bg-[#272a31] text-neutral-300 hover:text-white transition-colors"
              title={t('inspectButton')}
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Link
              href={`/checkout/${account.id}`}
              className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_20px_rgba(212,175,55,0.45)] transition-all flex items-center gap-1 group-hover:translate-x-0.5"
            >
              {t('buyButton')}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
