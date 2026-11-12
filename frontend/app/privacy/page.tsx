'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import ChamferHighlights from '@/components/ChamferHighlights';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Server,
  Zap,
  HelpCircle,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { language } = useApp();
  const pathname = usePathname();

  const policyTabs = [
    { nameEn: 'Privacy Policy', nameKh: 'គោលការណ៍ឯកជនភាព', href: '/privacy', icon: ShieldCheck },
    { nameEn: 'Terms of Service', nameKh: 'លក្ខខណ្ឌនៃការប្រើប្រាស់', href: '/terms', icon: FileText },
    { nameEn: 'Refund Policy', nameKh: 'គោលការណ៍បង្វិលប្រាក់', href: '/refund', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto select-none pt-20 sm:pt-24">
      
      {/* ================================================================= */}
      {/* 1. TOP NAVIGATION / BACK & POLICY TABS SWITCHER                   */}
      {/* ================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{language === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Home'}</span>
        </Link>

        {/* Gaming Policy Tabs Bar */}
        <div className="flex items-center gap-2 bg-[#090E1E] p-1.5 rounded-2xl border border-white/[0.1] overflow-x-auto">
          {policyTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
                }}
                className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'km' ? tab.nameKh : tab.nameEn}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. HERO BANNER: CYBER SECURITY PROTOCOL                           */}
      {/* ================================================================= */}
      <div className="relative mb-12 text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {language === 'km' ? 'គោលការណ៍ឯកជនភាព និងសុវត្ថិភាព' : 'Privacy & Security Matrix'}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 mt-1">
            {language === 'km' ? 'គ្មានការសួររក Password • សុវត្ថិភាពខ្ពស់ ១០០%' : 'Zero Password Policy • 100% Gamer Protection'}
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          {language === 'km'
            ? 'យើងខ្ញុំប្តេជ្ញាចិត្តយ៉ាងម៉ឺងម៉ាត់ក្នុងការការពារគណនីហ្គេម និងទិន្នន័យឯកជនភាពរបស់អ្នកលេងហ្គេមទាំងអស់នៅកម្ពុជា ស្របតាមស្តង់ដារសុវត្ថិភាពអន្តរជាតិ។'
            : 'SEA RA PRESTIGE is engineered with strict player confidentiality, direct publisher API connections, and official Bakong KHQR encryption.'}
        </p>
      </div>

      {/* ================================================================= */}
      {/* 3. CORE GAMING PRIVACY PILLARS (4 TACTICAL CARDS)                 */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        
        {/* Pillar 1: Zero Password Guarantee */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-6 bg-[#080E1C] border border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 shadow-xl group space-y-3 relative"
        >
          <ChamferHighlights size={16} color="emerald" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              CRITICAL PROTOCOL
            </span>
          </div>
          <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
            {language === 'km' ? '១. គោលការណ៍គ្មាន Password (Zero Password)' : '1. Zero Password Guarantee'}
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {language === 'km'
              ? 'វេទិការបស់យើងមិនដែលទាមទារ Password ហ្គេម, Password Facebook, Email, ឬលេខកូដសម្ងាត់ធនាគារឡើយ។ រាល់ការបញ្ចូលពេជ្រធ្វើឡើងតាមតែលេខ Player ID សាធារណៈប៉ុណ្ណោះ។'
              : 'We NEVER ask for, record, or require your game passwords, social logins, emails, or banking OTPs. All in-game injection is executed purely through public Player IDs.'}
          </p>
        </div>

        {/* Pillar 2: Public Data Only */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-6 bg-[#080E1C] border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-xl group space-y-3 relative"
        >
          <ChamferHighlights size={16} color="cyan" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              DATA INTEGRITY
            </span>
          </div>
          <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
            {language === 'km' ? '២. ព័ត៌មានដែលយើងប្រមូល' : '2. Minimal Public Data Collection'}
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {language === 'km'
              ? 'យើងប្រមូលតែទិន្នន័យចាំបាច់ដើម្បីបញ្ជូនពេជ្រប៉ុណ្ណោះ៖ Player/User ID, Zone ID, ឈ្មោះហៅក្រៅ Nickname សម្រាប់ផ្ទៀងផ្ទាត់ និងលេខសម្គាល់វិក្កយបត្របញ្ជាទិញ។'
              : 'We strictly gather essential delivery identifiers: public Player/User ID, Zone ID or Server Region, in-game Nickname for verification, and transaction timestamps.'}
          </p>
        </div>

        {/* Pillar 3: Official Bakong KHQR Security */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-6 bg-[#080E1C] border border-red-500/30 hover:border-red-400 transition-all duration-300 shadow-xl group space-y-3 relative"
        >
          <ChamferHighlights size={16} color="red" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Server className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              NBC COMPLIANT
            </span>
          </div>
          <h3 className="text-base font-black text-white group-hover:text-red-300 transition-colors">
            {language === 'km' ? '៣. សុវត្ថិភាពហិរញ្ញវត្ថុ Bakong KHQR' : '3. Official National KHQR Gateway'}
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {language === 'km'
              ? 'រាល់ការទូទាត់ប្រាក់ទាំងអស់ត្រូវបានការពារដោយស្វ័យប្រវត្តិតាមរយៈប្រព័ន្ធជាតិ Bakong KHQR របស់ធនាគារជាតិនៃកម្ពុជា។ យើងមិនរក្សាទុកព័ត៌មានកាតធនាគារណាមួយឡើយ។'
              : 'All financial settlements run securely via the National Bakong KHQR framework. SEA RA PRESTIGE never handles or stores debit/credit cards or raw banking accounts.'}
          </p>
        </div>

        {/* Pillar 4: Direct Publisher Delivery & No Leak */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-6 bg-[#080E1C] border border-[#E5B55E]/30 hover:border-[#E5B55E] transition-all duration-300 shadow-xl group space-y-3 relative"
        >
          <ChamferHighlights size={16} color="gold" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#E5B55E]/10 border border-[#E5B55E]/30 flex items-center justify-center text-[#E5B55E]">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-[#E5B55E] bg-[#E5B55E]/10 px-2 py-0.5 rounded border border-[#E5B55E]/20">
              ZERO LEAK
            </span>
          </div>
          <h3 className="text-base font-black text-white group-hover:text-[#E5B55E] transition-colors">
            {language === 'km' ? '៤. ការពារការបែកធ្លាយទិន្នន័យ (No Data Selling)' : '4. Zero Third-Party Monetization'}
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {language === 'km'
              ? 'យើងខ្ញុំមិនលក់ មិនចែកចាយ ឬជួលទិន្នន័យអ្នកលេងហ្គេមទៅកាន់ភាគីទីបីជាដាច់ខាត។ ទិន្នន័យទាំងអស់ប្រើប្រាស់តែមួយគត់សម្រាប់បញ្ជូនទំនិញក្នុងប្រព័ន្ធ។'
              : 'We strictly maintain zero third-party monetization. Your player contact and IDs will never be sold, leased, or broadcasted to any advertising networks.'}
          </p>
        </div>

      </div>

      {/* ================================================================= */}
      {/* 4. OFFICIAL CONTACT & TELEGRAM SUPPORT DISPATCH                   */}
      {/* ================================================================= */}
      <div
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
        }}
        className="p-6 sm:p-8 bg-gradient-to-r from-[#0A1022] via-[#0E162B] to-[#0A1022] border border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
            <MessageCircle className="w-4 h-4" />
            <span>24/7 DEDICATED PRIVACY DISPATCH</span>
          </div>
          <h4 className="text-lg sm:text-xl font-black text-white">
            {language === 'km' ? 'មានចម្ងល់អំពីឯកជនភាព និងសុវត្ថិភាព?' : 'Have Questions Regarding Security?'}
          </h4>
          <p className="text-xs text-neutral-300 max-w-xl">
            {language === 'km'
              ? 'ទាក់ទងមកកាន់ក្រុមការងារ VIP Support របស់យើងខ្ញុំភ្លាមៗតាម Telegram ផ្លូវការ @sokhunmao (ឆ្លើយតបក្នុងរយៈពេល < 1 នាទី)'
              : 'Direct message our official security and support officer on Telegram @sokhunmao for instant resolution.'}
          </p>
        </div>

        <a
          href="https://t.me/sokhunmao"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
          }}
          className="px-6 py-3 bg-[#229ED9] hover:bg-[#229ED9]/80 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(34,158,217,0.5)] shrink-0 transition-all hover:scale-105"
        >
          <span>Telegram @sokhunmao</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}
