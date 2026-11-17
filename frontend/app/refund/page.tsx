'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import ChamferHighlights from '@/components/ChamferHighlights';
import {
  Sparkles,
  ShieldCheck,
  FileText,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  AlertCircle,
  Zap,
} from 'lucide-react';

export default function RefundPolicyPage() {
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
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-[0_0_15px_rgba(0,212,255,0.5)]'
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
      {/* 2. HERO BANNER: 100% REFUND GUARANTEE                             */}
      {/* ================================================================= */}
      <div className="relative mb-12 text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {language === 'km' ? 'គោលការណ៍បង្វិលប្រាក់ និងការធានា' : 'Gamer Refund Guarantee'}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 mt-1">
            {language === 'km' ? 'ការពារអតិថិជន ១០០% • ដោះស្រាយលឿន < ១៥ នាទី' : '100% Buyer Protection • Resolution < 15 Mins'}
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          {language === 'km'
            ? 'SEA RA PRESTIGE ផ្តល់ការធានាសងប្រាក់ 100% ជូនអ្នកលេងហ្គេមទាំងអស់ ប្រសិនបើប្រព័ន្ធមានបញ្ហាបច្ចេកទេស ឬពេជ្រមិនចូលគណនី។'
            : 'We stand 100% behind our automated top-up services. If any server outage prevents delivery, your funds are completely protected and refunded.'}
        </p>
      </div>

      {/* ================================================================= */}
      {/* 3. GLOWING EMERALD HUD ASSURANCE BANNER                           */}
      {/* ================================================================= */}
      <div
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
        }}
        className="p-6 sm:p-7 bg-gradient-to-r from-emerald-950/60 via-[#071318] to-cyan-950/60 border-2 border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.25)] mb-10 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left relative"
      >
        <ChamferHighlights size={20} color="emerald" />
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black text-white">
            {language === 'km' ? 'ការធានាសងប្រាក់ 100% ពេញលេញ ប្រសិនបើមានបញ្ហាប្រព័ន្ធ' : '100% Automatic Full Refund on System Failures'}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300">
            {language === 'km'
              ? 'ប្រសិនបើលោកអ្នកបានទូទាត់ប្រាក់ជោគជ័យ ប៉ុន្តែពេជ្រមិនបានចូលគណនីរបស់អ្នកដោយសារកំហុសបច្ចេកទេស ឬបញ្ហា Server ហ្គេម យើងខ្ញុំធានាសងប្រាក់ជូនវិញ 100% ភ្លាមៗ គ្មានកាត់កម្រៃជើងសារ!'
              : 'If payment was successfully debited but game currency was not delivered due to API downtime, you are eligible for an immediate 100% full refund with zero deductions.'}
          </p>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 4. COMPARISON: ELIGIBLE VS NON-ELIGIBLE SCENARIOS                 */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        {/* Box A: Eligible for Refund (Green) */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-6 bg-[#080E1C] border border-emerald-500/40 shadow-xl space-y-4 relative"
        >
          <ChamferHighlights size={16} color="emerald" />
          <div className="flex items-center gap-2 pb-3 border-b border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider">
              {language === 'km' ? 'ករណីទទួលបានការសងប្រាក់ ១០០%' : 'Eligible for 100% Full Refund'}
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-neutral-300">
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>
                <strong>{language === 'km' ? 'API Timeout លើសពី ៣០ នាទី៖' : 'System Timeout > 30 Mins:'}</strong>{' '}
                {language === 'km'
                  ? 'ការទូទាត់ប្រាក់ជោគជ័យ ប៉ុន្តែប្រព័ន្ធ API បរាជ័យក្នុងការបញ្ចូលពេជ្រលើសពី ៣០ នាទី។'
                  : 'Payment was verified but partner API failed to dispatch reload after 30 minutes.'}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>
                <strong>{language === 'km' ? 'កាត់ប្រាក់ស្ទួន (Double Charge)៖' : 'Accidental Duplicate Charge:'}</strong>{' '}
                {language === 'km'
                  ? 'អតិថិជនបានស្កេនបង់ប្រាក់ស្ទួន ២ ដងលើ Order ID តែមួយ។'
                  : 'Customer was accidentally charged twice for a single order transaction.'}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>
                <strong>{language === 'km' ? 'ហ្គេមបិទ Server ជួសជុលបន្ទាន់៖' : 'Emergency Game Server Outage:'}</strong>{' '}
                {language === 'km'
                  ? 'ហ្គេមស្ថិតក្នុងការបិទ Server Maintenance ធ្វើឱ្យប្រព័ន្ធមិនអាចបញ្ជូនពេជ្រចូលបាន។'
                  : 'Game publisher shut down authentication servers, making currency injection impossible.'}
              </span>
            </li>
          </ul>
        </div>

        {/* Box B: Non-Refundable (Amber/Red) */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-6 bg-[#080E1C] border border-amber-500/40 shadow-xl space-y-4 relative"
        >
          <ChamferHighlights size={16} color="gold" />
          <div className="flex items-center gap-2 pb-3 border-b border-amber-500/20">
            <XCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">
              {language === 'km' ? 'ករណីមិនអាចបង្វិលប្រាក់បាន' : 'Non-Refundable Scenarios'}
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-neutral-300">
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>
                <strong>{language === 'km' ? 'បញ្ចូល Player ID ឬ Zone ID ខុស៖' : 'Incorrect Player UID Entered:'}</strong>{' '}
                {language === 'km'
                  ? 'អតិថិជនបញ្ចូលលេខសម្គាល់ខុសដោយខ្លួនឯង ហើយពេជ្រត្រូវបានបញ្ជូនចូលគណនីនោះរួចរាល់។'
                  : 'Diamonds were already successfully injected into a third party account due to customer typo.'}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>
                <strong>{language === 'km' ? 'ការផ្លាស់ប្តូរចិត្តក្រោយពេលជោគជ័យ៖' : 'Change of Mind After Delivery:'}</strong>{' '}
                {language === 'km'
                  ? 'ការទិញខុសកញ្ចប់ដោយអតិថិជន បន្ទាប់ពីការបញ្ចូលពេជ្របានជោគជ័យពេញលេញ។'
                  : 'Buyer regret or accidental selection after the diamonds were already credited.'}
              </span>
            </li>
          </ul>
        </div>

      </div>

      {/* ================================================================= */}
      {/* 5. 3-STEP INSTANT REFUND PROTOCOL                                 */}
      {/* ================================================================= */}
      <div className="mb-10 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider text-center">
          {language === 'km' ? 'ដំណើរការស្នើសុំបង្វិលប្រាក់ ៣ ជំហានរហ័ស' : '3-Step Rapid Refund Dispatch Protocol'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
            className="p-5 bg-[#090F20] border border-white/[0.1] text-center space-y-2"
          >
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-400/30">
              STAGE 01
            </span>
            <h4 className="text-sm font-black text-white">{language === 'km' ? 'ចម្លងលេខ Order ID' : 'Copy Order ID'}</h4>
            <p className="text-xs text-neutral-400">
              {language === 'km' ? 'ចម្លងលេខសម្គាល់បញ្ជាទិញ (ឧ. TU-MLBB-92812)' : 'Copy your unique transaction reference'}
            </p>
          </div>

          <div
            style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
            className="p-5 bg-[#090F20] border border-white/[0.1] text-center space-y-2"
          >
            <span className="text-xs font-mono font-bold text-[#E5B55E] bg-amber-950/60 px-2 py-0.5 rounded border border-[#E5B55E]/30">
              STAGE 02
            </span>
            <h4 className="text-sm font-black text-white">{language === 'km' ? 'ថត Screenshot បង្កាន់ដៃផ្ទេរប្រាក់' : 'Bank Slip Screenshot'}</h4>
            <p className="text-xs text-neutral-400">
              {language === 'km' ? 'Screenshot បង្កាន់ដៃកាត់ប្រាក់ពី ABA, Wing ឬ Bakong' : 'Capture screenshot of your debit transaction'}
            </p>
          </div>

          <div
            style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
            className="p-5 bg-[#090F20] border border-white/[0.1] text-center space-y-2"
          >
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-400/30">
              STAGE 03
            </span>
            <h4 className="text-sm font-black text-white">{language === 'km' ? 'ផ្ញើទៅ Telegram @sokhunmao' : 'Telegram Dispatch'}</h4>
            <p className="text-xs text-neutral-400">
              {language === 'km' ? 'ទទួលបានការបង្វិលប្រាក់ត្រឡប់មកវិញក្នុង < ១៥ នាទី' : 'Funds reimbursed back to bank in < 15 mins'}
            </p>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 6. OFFICIAL CONTACT & TELEGRAM SUPPORT DISPATCH                   */}
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
            <span>24/7 VIP REFUND HOTLINE</span>
          </div>
          <h4 className="text-lg sm:text-xl font-black text-white">
            {language === 'km' ? 'ត្រូវការស្នើសុំបង្វិលប្រាក់បន្ទាន់?' : 'Need to Request an Immediate Refund?'}
          </h4>
          <p className="text-xs text-neutral-300 max-w-xl">
            {language === 'km'
              ? 'ទាក់ទងមកកាន់ក្រុមការងារ VIP Support របស់យើងខ្ញុំភ្លាមៗតាម Telegram @sokhunmao ជាមួយ Order ID របស់អ្នក។'
              : 'Message our official dispatch agent on Telegram @sokhunmao with your Order ID for rapid verification.'}
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
