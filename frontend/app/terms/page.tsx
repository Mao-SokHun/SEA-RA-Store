'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import ChamferHighlights from '@/components/ChamferHighlights';
import {
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  Zap,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  MessageCircle,
  Scale,
} from 'lucide-react';

export default function TermsOfServicePage() {
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
                    ? 'bg-gradient-to-r from-amber-500 via-[#E5B55E] to-yellow-500 text-black shadow-[0_0_15px_rgba(229,181,94,0.5)]'
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
      {/* 2. HERO BANNER: TERMS OF SERVICE                                  */}
      {/* ================================================================= */}
      <div className="relative mb-12 text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {language === 'km' ? 'លក្ខខណ្ឌនៃការប្រើប្រាស់សេវាកម្ម' : 'Terms of Engagement'}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E5B55E] via-amber-300 to-yellow-500 mt-1">
            {language === 'km' ? 'តម្លាភាព សុចរិតភាព និងសិទ្ធិអ្នកលេងហ្គេម' : 'Fair Play, Integrity & Gamer Rights'}
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          {language === 'km'
            ? 'រាល់ការបញ្ជាទិញនៅលើវេទិកា SEA RA PRESTIGE ត្រូវបានគ្រប់គ្រងដោយលក្ខខណ្ឌផ្លូវការ ដើម្បីធានាបាននូវការដឹកជញ្ជូនរហ័ស 3 វិនាទី និងតម្លៃសមរម្យ។'
            : 'By transacting through SEA RA PRESTIGE, you agree to these operational protocols designed to ensure lightning delivery and transparent gaming commerce.'}
        </p>
      </div>

      {/* ================================================================= */}
      {/* 3. TACTICAL TERMS CARDS (4 ENGAGEMENT PILLARS)                    */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        
        {/* Term 1: Direct Authorized Injections */}
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
              SERVICE PROTOCOL
            </span>
          </div>
          <h3 className="text-base font-black text-white group-hover:text-[#E5B55E] transition-colors">
            {language === 'km' ? '១. សេវាកម្មបញ្ចូលពេជ្រផ្លូវការ (3s Delivery)' : '1. Official API Reload & Delivery Speed'}
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {language === 'km'
              ? 'SEA RA PRESTIGE ផ្តល់សេវាកម្មបញ្ចូលរូបិយប័ណ្ណហ្គេមផ្លូវការ (MLBB, Roblox, Free Fire, PUBG, Genshin) តាម API ផ្ទាល់។ រយៈពេលបញ្ចូលជាមធ្យមក្រោម ៣ វិនាទី បន្ទាប់ពីការទូទាត់ប្រាក់ជោគជ័យ។'
              : 'SEA RA PRESTIGE delivers direct authorized reload for game currencies. Average fulfillment duration is under 3 seconds once payment verification confirms via Bakong KHQR.'}
          </p>
        </div>

        {/* Term 2: Customer Accuracy & Player ID */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-6 bg-[#080E1C] border border-amber-500/30 hover:border-amber-400 transition-all duration-300 shadow-xl group space-y-3 relative"
        >
          <ChamferHighlights size={16} color="gold" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              USER RESPONSIBILITY
            </span>
          </div>
          <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
            {language === 'km' ? '២. ទំនួលខុសត្រូវលើ Player ID' : '2. Player ID & Zone Accuracy'}
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {language === 'km'
              ? 'អតិថិជនមានកាតព្វកិច្ចពិនិត្យមើល Player ID និង Zone ID ឱ្យបានត្រឹមត្រូវមុនពេលបង់ប្រាក់។ ប្រសិនបើបញ្ចូលខុស ហើយពេជ្រចូលគណនីផ្សេង ប្រព័ន្ធមិនអាចដកហូត ឬបង្វិលប្រាក់វិញបានឡើយ។'
              : 'Gamers are responsible for inputting their accurate Player ID and Zone ID. Once items are successfully deposited into a third-party account due to user typo, transactions are non-reversible.'}
          </p>
        </div>

        {/* Term 3: Pricing & 0% Fee Policy */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-6 bg-[#080E1C] border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-xl group space-y-3 relative"
        >
          <ChamferHighlights size={16} color="cyan" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              ZERO SURCHARGE
            </span>
          </div>
          <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
            {language === 'km' ? '៣. តម្លៃ និងការទូទាត់ (0% Fee)' : '3. Pricing & 0% Surcharge Bakong KHQR'}
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {language === 'km'
              ? 'រាល់កញ្ចប់តម្លៃត្រូវបានបង្ហាញជា USD ($) និង KHR (៛) ដោយឥតគិតថ្លៃសេវាបន្ថែម (0% Fee)។ ការទូទាត់ប្រាក់ត្រូវធ្វើឡើងតាមរយៈ KHQR ដែលប្រព័ន្ធបង្កើតជូនផ្ទាល់។'
              : 'All prices are transparently displayed in USD and KHR with zero surcharge (0% fee). Transactions must be settled via the generated dynamic Bakong KHQR.'}
          </p>
        </div>

        {/* Term 4: Dispute Resolution & 24/7 VIP Support */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-6 bg-[#080E1C] border border-violet-500/30 hover:border-violet-400 transition-all duration-300 shadow-xl group space-y-3 relative"
        >
          <ChamferHighlights size={16} color="purple" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
              24/7 RESOLUTION
            </span>
          </div>
          <h3 className="text-base font-black text-white group-hover:text-violet-300 transition-colors">
            {language === 'km' ? '៤. ការដោះស្រាយបញ្ហា និងការធានា' : '4. Dispute Escalation & Live Support'}
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {language === 'km'
              ? 'ប្រសិនបើមានបញ្ហាបច្ចេកទេស ឬពេជ្រមិនទាន់ចូល ក្រុមការងារ Support របស់យើងរង់ចាំជួយដោះស្រាយ ២៤/៧។ អតិថិជនគ្រាន់តែរក្សាទុកលេខសម្គាល់ Order ID ជាការស្រេច។'
              : 'In case of rare API latency or maintenance interruption, our dedicated VIP success team is available 24/7 to guarantee delivery or initiate immediate full refund.'}
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
        className="p-6 sm:p-8 bg-gradient-to-r from-[#0A1022] via-[#0E162B] to-[#0A1022] border border-[#E5B55E]/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-[#E5B55E] text-xs font-mono font-bold">
            <MessageCircle className="w-4 h-4" />
            <span>24/7 VIP SUPPORT HOTLINE</span>
          </div>
          <h4 className="text-lg sm:text-xl font-black text-white">
            {language === 'km' ? 'ត្រូវការជំនួយអំពីលក្ខខណ្ឌ ឬការបញ្ជាទិញ?' : 'Need Help Regarding Orders or Terms?'}
          </h4>
          <p className="text-xs text-neutral-300 max-w-xl">
            {language === 'km'
              ? 'ទាក់ទងមកកាន់ក្រុមការងារ VIP Support ផ្លូវការរបស់យើងខ្ញុំតាម Telegram @sokhunmao គ្រប់ពេលវេលា។'
              : 'Contact our official support agent directly on Telegram @sokhunmao for urgent inquiry or order resolution.'}
          </p>
        </div>

        <a
          href="https://t.me/sokhunmao"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
          }}
          className="px-6 py-3 bg-gradient-to-r from-[#E5B55E] via-[#F3C978] to-[#D4A043] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(229,181,94,0.5)] shrink-0 transition-all hover:scale-105"
        >
          <span>Telegram @sokhunmao</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}
