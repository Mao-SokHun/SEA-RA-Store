'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, CheckCircle2, Zap, ArrowUpRight, Crown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="relative bg-[#0b0e14] border-t border-white/[0.08] text-neutral-400 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-[#d4af37]/5 rounded-full blur-[140px]" />
        <div className="absolute top-0 right-10 w-[400px] h-[200px] bg-[#00e4f2]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffe088] via-[#d4af37] to-[#8f6b10] p-[1.5px] shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                <div className="w-full h-full bg-[#0b0e14] rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#f2ca50]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-[#f2ca50] tracking-wider">NEXUS</span>
                <span className="text-[10px] font-semibold text-[#00e4f2] tracking-widest uppercase">
                  {t('brandSub')}
                </span>
              </div>
            </Link>

            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              {language === 'kh'
                ? 'ផ្សារទិញ-លក់គណនីហ្គេមឈានមុខគេ ជាមួយប្រព័ន្ធ Escrow ការពារ ១០០% ផ្ទៀងផ្ទាត់ត្រឹមត្រូវ ទទួលគណនីភ្លាមៗ និងបង់ប្រាក់ស្រួលតាម KHQR។'
                : 'The premier trusted escrow marketplace for game accounts. Instant automated delivery, 100% anti-scam protection, and seamless KHQR payments.'}
            </p>

            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151a23] border border-white/[0.08]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold text-emerald-300">
                {language === 'kh' ? 'ប្រព័ន្ធការពារ Escrow សកម្ម' : 'Escrow Protection Online'}
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-[11px] text-neutral-400">{language === 'kh' ? 'សុវត្ថិភាព ១០០%' : '100% Safe'}</span>
            </div>
          </div>

          {/* Column 2: Marketplace */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              {language === 'kh' ? 'ទីផ្សារហ្គេម' : 'Marketplace'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/top-up" className="hover:text-[#f2ca50] transition-colors flex items-center gap-1.5 text-amber-400 font-bold">
                  <span>⚡</span>
                  <span>{language === 'kh' ? 'បញ្ចូលលុយ / ពេជ្រ ចូលហ្គេម (Top Up)' : 'Direct Game Top Up (New)'}</span>
                </Link>
              </li>
              {/* [DISABLED - Sell Account]
              <li>
                <Link href="/catalog" className="hover:text-[#f2ca50] transition-colors">
                  {language === 'kh' ? 'គណនីហ្គេមទាំងអស់' : 'All Game Accounts'}
                </Link>
              </li>
              <li>
                <Link href="/catalog?q=roblox" className="hover:text-[#f2ca50] transition-colors flex items-center gap-1.5 text-white font-medium">
                  <span>🧱</span>
                  <span>Roblox (Blox Fruits / Robux)</span>
                </Link>
              </li>
              <li>
                <Link href="/catalog?game=mlbb" className="hover:text-[#f2ca50] transition-colors">
                  Mobile Legends: Bang Bang
                </Link>
              </li>
              <li>
                <Link href="/catalog?game=pubg" className="hover:text-[#f2ca50] transition-colors">
                  PUBG Mobile
                </Link>
              </li>
              <li>
                <Link href="/catalog?game=freefire" className="hover:text-[#f2ca50] transition-colors">
                  Free Fire
                </Link>
              </li>
              <li>
                <Link href="/catalog?game=valorant" className="hover:text-[#f2ca50] transition-colors">
                  Valorant
                </Link>
              </li>
              */}
            </ul>
          </div>

          {/* Column 3: Platform Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              {language === 'kh' ? 'សេវាកម្ម & ជំនួយ' : 'Services & Help'}
            </h4>
            <ul className="space-y-2 text-sm">
              {/* [DISABLED - Sell Account]
              <li>
                <Link href="/sell" className="hover:text-[#f2ca50] transition-colors flex items-center gap-1">
                  <span>{t('navSell')}</span>
                  <ArrowUpRight className="w-3 h-3 text-[#d4af37]" />
                </Link>
              </li>
              */}
              {/* [DISABLED - Sell Account]
              <li>
                <Link href="/#how-it-works" className="hover:text-[#f2ca50] transition-colors">
                  {t('navHowItWorks')}
                </Link>
              </li>
              */}
              {/* [DISABLED - Sell Account]
              <li>
                <Link href="/warranty" className="hover:text-[#f2ca50] transition-colors">
                  {t('navWarranty')}
                </Link>
              </li>
              */}
              <li>
                <Link href="/wallet" className="hover:text-[#f2ca50] transition-colors">
                  {language === 'kh' ? 'កាបូបប្រាក់ & ការដកប្រាក់' : 'Wallet & Balance'}
                </Link>
              </li>
              {/* [DISABLED - Sell Account]
              <li>
                <Link href="/orders" className="hover:text-[#f2ca50] transition-colors">
                  {t('navOrders')}
                </Link>
              </li>
              */}
            </ul>
          </div>

          {/* Column 4: Security Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              {language === 'kh' ? 'ការធានាសុវត្ថិភាព' : 'Safety Guarantees'}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#151a23]/60 border border-white/[0.04]">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'kh' ? 'ប្រព័ន្ធ Escrow ការពារ ១០០%' : '100% Escrow Protection'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#151a23]/60 border border-white/[0.04]">
                <Zap className="w-4 h-4 text-[#f2ca50] shrink-0" />
                <span>{language === 'kh' ? 'ផ្ទេរគណនីស្វ័យប្រវត្តិក្នង ៣ វិនាទី' : 'Instant Account Reveal'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#151a23]/60 border border-white/[0.04]">
                <CheckCircle2 className="w-4 h-4 text-[#00e4f2] shrink-0" />
                <span>{language === 'kh' ? 'បង់ប្រាក់តាម Bakong KHQR' : 'Bakong KHQR Local Banking'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} NEXUS Gaming Marketplace. {language === 'kh' ? 'រក្សាសិទ្ធិគ្រប់យ៉ាង។' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Bakong KHQR</span>
            <Link href="/warranty" className="hover:text-white transition-colors">
              {language === 'kh' ? 'គោលការណ៍ធានា' : 'Warranty Terms'}
            </Link>
            <Link href="/#how-it-works" className="hover:text-white transition-colors">
              {language === 'kh' ? 'របៀបប្រើប្រាស់' : 'How It Works'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
