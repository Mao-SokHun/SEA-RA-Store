'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Gamepad2,
  UserCheck,
  Package,
  QrCode,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Clock,
  Sparkles,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function HowToBuyPage() {
  const { language, openTopUp } = useApp();

  const steps = [
    {
      step: '01',
      titleKh: 'ជ្រើសរើសហ្គេមដែលចង់បញ្ចូល',
      titleEn: 'Select Your Game',
      descKh: 'ជ្រើសរើសហ្គេមដែលអ្នកចូលចិត្តពីកាតាឡុកហ្គេមផ្លូវការរបស់យើង ដូចជា Mobile Legends, Roblox, Free Fire, PUBG Mobile ឬ Genshin Impact។',
      descEn: 'Pick your desired game from our official catalog including Mobile Legends, Roblox, Free Fire, PUBG Mobile, and Genshin Impact.',
      icon: Gamepad2,
      badgeColor: 'from-amber-400 to-[#E5B55E]',
      accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      tipKh: 'គន្លឹះ៖ អ្នកអាចស្វែងរកហ្គេមតាមឈ្មោះ ឬប្រភេទនៅផ្នែកខាងលើ Navbar។',
      tipEn: 'Tip: You can quickly search games using Ctrl+K or the search bar on top.',
    },
    {
      step: '02',
      titleKh: 'បញ្ចូលលេខសម្គាល់គណនី (User ID & Zone ID)',
      titleEn: 'Enter Your Account ID & Zone ID',
      descKh: 'វាយបញ្ចូលលេខសម្គាល់ Player ID / User ID និង Zone ID (សម្រាប់ MLBB) ឱ្យបានត្រឹមត្រូវ។ បន្ទាប់មកចុចប៊ូតុង "ផ្ទៀងផ្ទាត់" ដើម្បីពិនិត្យមើលឈ្មោះតួអង្គក្នុងហ្គេមរបស់អ្នក។',
      descEn: 'Type in your Player/User ID and Zone ID accurately. Click "Verify ID" to confirm your in-game character nickname before proceeding.',
      icon: UserCheck,
      badgeColor: 'from-cyan-400 to-blue-500',
      accentBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      tipKh: 'សុវត្ថិភាព 100%៖ យើងមិនដែលសួររក Password ឬ Email របស់លោកអ្នកឡើយ!',
      tipEn: '100% Safe: We NEVER ask for your password or sensitive credentials.',
    },
    {
      step: '03',
      titleKh: 'ជ្រើសរើសកញ្ចប់ពេជ្រ ឬកាក់ដែលចង់បាន',
      titleEn: 'Choose Your Package',
      descKh: 'ជ្រើសរើសចំនួនពេជ្រ (Diamonds), Robux, ឬ Pass ដែលអ្នកចង់បញ្ចូល។ តម្លៃទាំងអស់ត្រូវបានបង្ហាញយ៉ាងច្បាស់លាស់ទាំងប្រាក់ដុល្លារ ($ USD) និងប្រាក់រៀល (៛ KHR) ដោយគ្មានថ្លៃសេវាលាក់កំបាំង។',
      descEn: 'Select the diamond, Robux, or pass package you need. Clear pricing is displayed in both USD and KHR with zero hidden fees.',
      icon: Package,
      badgeColor: 'from-violet-400 to-purple-500',
      accentBg: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
      tipKh: 'កញ្ចប់ពិសេស៖ កញ្ចប់មួយចំនួនមានបន្ថែម Extra Bonus ពេជ្រដោយឥតគិតថ្លៃ!',
      tipEn: 'Bonus: Look for packs tagged with Extra Bonus diamonds!',
    },
    {
      step: '04',
      titleKh: 'ស្កេនទូទាត់តាម Bakong KHQR (0% ថ្លៃសេវា)',
      titleEn: 'Scan & Pay via Bakong KHQR (0% Fee)',
      descKh: 'ប្រព័ន្ធនឹងបង្ហាញកូដ Bakong KHQR ផ្លូវការដែលមានឈ្មោះហាង SEA RA PRESTIGE។ បើក App ធនាគារណាមួយនៅក្នុងទូរស័ព្ទរបស់អ្នក (ABA, Wing, ACLEDA, Canadia, Sathapana, Bakong) រួច Scan ទូទាត់ជាការស្រេច។',
      descEn: 'The official Bakong KHQR bill will appear with SEA RA PRESTIGE merchant name. Open any Cambodian banking app and scan to pay.',
      icon: QrCode,
      badgeColor: 'from-rose-500 to-red-500',
      accentBg: 'bg-red-500/10 border-red-500/30 text-red-400',
      tipKh: 'គាំទ្រគ្រប់ធនាគារ៖ គាំទ្រជាង 60+ កម្មវិធីធនាគារ និងកាបូបអេឡិចត្រូនិកនៅកម្ពុជា។',
      tipEn: 'Universal: Supported by over 60+ Cambodian banking and e-wallet apps.',
    },
    {
      step: '05',
      titleKh: 'ពេជ្រចូលគណនីស្វ័យប្រវត្តិក្នង 3 វិនាទី',
      titleEn: 'Instant 3-Second Delivery',
      descKh: 'ពេលទូទាត់ប្រាក់រួច ប្រព័ន្ធ API ផ្លូវការនឹងបញ្ចូលពេជ្រ ឬកាក់ទៅក្នុងគណនីហ្គេមរបស់អ្នកភ្លាមៗដោយស្វ័យប្រវត្តិ។ អ្នកអាចចូលទៅក្នុងហ្គេមដើម្បីពិនិត្យមើលសមតុល្យពេជ្របានភ្លាម!',
      descEn: 'Once payment completes, our direct API injects diamonds directly into your account in under 3 seconds. Open your game and enjoy!',
      icon: Zap,
      badgeColor: 'from-emerald-400 to-teal-500',
      accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      tipKh: 'មានវិក្កយបត្រ៖ អ្នកអាចរក្សាទុកលេខ Order ID ដើម្បីផ្ទៀងផ្ទាត់នៅទំព័រ "Track Order"។',
      tipEn: 'Receipt: Keep your Order ID to track transactions at any time.',
    },
  ];

  const gameIdGuides = [
    {
      game: 'Mobile Legends: Bang Bang',
      uidFormat: 'User ID (8-10 ខ្ទង់) + Zone ID (4-5 ខ្ទង់)',
      whereKh: 'ចុចលើ Avatar កម្រងរូបភាពរបស់អ្នកនៅជ្រុងខាងឆ្វេងផ្នែកខាងលើក្នុងហ្គេម។ អ្នកនឹងឃើញលេខ ID ដូចជា៖ 12345678 (2001)។',
      whereEn: 'Tap your in-game profile avatar at the top left. You will see your User ID followed by Zone ID in brackets, e.g. 12345678 (2001).',
    },
    {
      game: 'Roblox (Robux Direct)',
      uidFormat: 'Roblox Username ឬ User ID',
      whereKh: 'ចូលទៅកាន់ Profile របស់អ្នកក្នុងកម្មវិធី Roblox ឬនៅលើវិបសាយ roblox.com/users/.../profile ដើម្បីមើលលេខ ID ឬ Username។',
      whereEn: 'Go to your Roblox profile in-app or at roblox.com to copy your exact Username or User ID.',
    },
    {
      game: 'Free Fire / Free Fire MAX',
      uidFormat: 'Player UID (9-10 ខ្ទង់)',
      whereKh: 'ចុចលើ Profile របស់អ្នកនៅជ្រុងខាងឆ្វេងផ្នែកខាងលើក្នុងហ្គេម Free Fire។ លេខ UID ស្ថិតនៅក្រោមឈ្មោះតួអង្គរបស់អ្នក។',
      whereEn: 'Tap your profile icon at top-left. Your numeric UID is displayed right beneath your character name.',
    },
    {
      game: 'PUBG Mobile',
      uidFormat: 'Character ID (8-11 ខ្ទង់)',
      whereKh: 'បើកហ្គេម PUBG Mobile ចុចលើរូប Profile របស់អ្នក។ លេខ Character ID ស្ថិតនៅខាងលើឈ្មោះតួអង្គរបស់អ្នក។',
      whereEn: 'Open PUBG Mobile, tap your avatar at top-right. Your Character ID is shown above your character name.',
    },
    {
      game: 'Genshin Impact',
      uidFormat: 'UID (9 ខ្ទង់) + Server Region',
      whereKh: 'UID របស់អ្នកត្រូវបានបង្ហាញជានិច្ចនៅជ្រុងខាងស្តាំផ្នែកខាងក្រោមនៃអេក្រង់ហ្គេម ឬនៅក្នុងម៉ឺនុយ Paimon Menu។',
      whereEn: 'Your UID is always visible at the bottom-right corner of your screen or inside the Paimon Pause Menu.',
    },
  ];

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto select-none">
      
      {/* ================================================================= */}
      {/* 1. HERO BANNER                                                    */}
      {/* ================================================================= */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-14 pt-16 sm:pt-20">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {language === 'km' ? 'របៀបបញ្ចូលលុយហ្គេម' : 'How to Top-Up on SEA RA'}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-cyan-300 to-blue-400 mt-1">
            {language === 'km' ? 'ងាយស្រួល រហ័ស និងមានសុវត្ថិភាព 100%' : 'Fast, Easy & 100% Secure'}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          {language === 'km'
            ? 'ស្វែងយល់ពីរបៀបបញ្ចូលពេជ្រ និងកាក់ហ្គេមតាមរយៈប្រព័ន្ធស្វ័យប្រវត្តិ Bakong KHQR ដោយមិនចាំបាច់ប្រើ Password ឬ Email គណនីរបស់អ្នកឡើយ។'
            : 'Learn how to reload in-game currencies seamlessly using Cambodia’s National Bakong KHQR without sharing your password.'}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/games"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00D4FF] to-blue-500 hover:from-cyan-400 hover:to-blue-600 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,212,255,0.35)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{language === 'km' ? 'សាកល្បងបញ្ចូលឥឡូវនេះ' : 'Start Top-Up Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link
            href="/#game-catalog"
            className="px-6 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            {language === 'km' ? 'មើលកាតាឡុកហ្គេម' : 'Browse Catalog'}
          </Link>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. THE 5 EASY STEPS CONNECTED PIPELINE ROADMAP                    */}
      {/* "គួរតែ display របៀបជាផ្លូវចេញពីមួយចូលទៅមួយ វាមើលទៅទាក់ទាញជាង"       */}
      {/* ================================================================= */}
      <div className="space-y-8 mb-16">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
            {language === 'km' ? 'ផ្លូវដំណើរការ ៥ ជំហានក្នុងការបញ្ចូលលុយ' : '5-Step Connected Reload Journey'}
          </h2>
          <span className="text-[11px] font-mono text-cyan-400 font-bold hidden sm:inline tracking-wider">
            STEP 01 ➔ 02 ➔ 03 ➔ 04 ➔ 05 (COMPLETE)
          </span>
        </div>

        {/* Connected Highway / Path Container */}
        <div className="relative">
          
          {/* Glowing Animated Pipeline Track across all 5 steps on desktop */}
          <div className="hidden lg:block absolute top-[42px] left-[5%] right-[5%] h-[3px] bg-gradient-to-r from-amber-500 via-cyan-500 via-violet-500 via-red-500 to-emerald-400 z-0 opacity-40 shadow-[0_0_15px_rgba(0,212,255,0.5)]" />

          {/* 5 Connected Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              const isLast = idx === steps.length - 1;

              return (
                <div key={idx} className="relative flex flex-col group">
                  
                  {/* Step Milestone Card */}
                  <div className="relative rounded-2xl bg-[#090E1E] border border-white/[0.1] hover:border-cyan-400/60 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between h-full overflow-hidden">
                    
                    {/* Glowing Top Ambient Edge */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div>
                      {/* Connected Node Header with Indicator */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-11 h-11 rounded-2xl ${st.accentBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative z-10 border border-white/10`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-black text-white bg-black/60 px-2.5 py-1 rounded-lg border border-white/[0.15] shadow-inner">
                            {st.step}
                          </span>
                          {!isLast && (
                            <span className="hidden lg:inline-block text-cyan-400 text-xs font-black animate-pulse">
                              ➔
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                        {language === 'km' ? st.titleKh : st.titleEn}
                      </h3>

                      {/* Description */}
                      <p className="text-[11px] text-neutral-400 leading-relaxed mt-2">
                        {language === 'km' ? st.descKh : st.descEn}
                      </p>
                    </div>

                    {/* Bottom Status / Tip Tag */}
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-neutral-400 font-medium">
                      <span className="text-cyan-300/80 font-mono font-bold">
                        {idx === 0 ? 'START' : isLast ? 'DONE < 3S' : `STAGE 0${idx + 1}`}
                      </span>
                      <span className="text-neutral-500">
                        {isLast ? '⚡ Instant' : 'Proceed ➔'}
                      </span>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. HOW TO FIND PLAYER ID FOR POPULAR GAMES                        */}
      {/* ================================================================= */}
      <div className="space-y-6 mb-16">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-lg font-black text-white uppercase tracking-wider">
              {language === 'km' ? 'របៀបស្វែងរក User ID ក្នុងហ្គេមនីមួយៗ' : 'How to Locate Your In-Game User ID'}
            </h2>
          </div>
          <span className="text-xs text-neutral-400 hidden sm:inline">
            No Password Required
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gameIdGuides.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0D1426] border border-white/[0.08] hover:border-cyan-400/30 transition-all space-y-2.5 shadow-md"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E5B55E]" />
                  <span>{item.game}</span>
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-cyan-300 border border-white/[0.08]">
                  {item.uidFormat}
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {language === 'km' ? item.whereKh : item.whereEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 4. SECURITY & ASSURANCE GUARANTEES                                */}
      {/* ================================================================= */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0F172E] to-[#0A1020] border border-white/[0.1] p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5B55E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'km' ? 'សុវត្ថិភាពខ្ពស់ 100%' : '100% Safe & Authorized'}
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {language === 'km'
                  ? 'មិនត្រូវការ Password គណនីទេ។ ពេជ្របញ្ចូលតាមរយៈ Partner API ផ្លូវការដោយផ្ទាល់។'
                  : 'Zero password required. Inject directly through official developer APIs.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'km' ? 'ល្បឿនបញ្ចូល < 3 វិនាទី' : 'Under 3-Sec Delivery'}
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {language === 'km'
                  ? 'ដំណើរការស្វ័យប្រវត្តិតាម Bot Server 24 ម៉ោងក្នុងមួយថ្ងៃ គ្មានការពន្យារពេលឡើយ។'
                  : 'Automated 24/7 server pipeline with zero manual delay.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'km' ? 'សេវាបម្រើអតិថិជន VIP 24/7' : '24/7 VIP Support'}
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {language === 'km'
                  ? 'ប្រសិនបើមានបញ្ហា អ្នកអាចទាក់ទងមកកាន់ Telegram @sokhunmao បានគ្រប់ពេលវេលា។'
                  : 'Direct assistance via Telegram @sokhunmao anytime you need help.'}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
