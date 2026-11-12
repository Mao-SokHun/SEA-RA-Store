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
  Crosshair,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';

export default function HowToBuyPage() {
  const { language, openTopUp } = useApp();

  const steps = [
    {
      step: '01',
      stage: 'STAGE: 01 // TARGET',
      titleKh: 'ជ្រើសរើសហ្គេមដែលចង់បញ្ចូល',
      titleEn: 'Target Acquisition: Pick Game',
      descKh: 'ជ្រើសរើសហ្គេមដែលអ្នកចូលចិត្តពីកាតាឡុកហ្គេមផ្លូវការរបស់យើង ដូចជា Mobile Legends, Roblox, Free Fire, PUBG Mobile, Genshin Impact ឬ 15+ ហ្គេមល្បីៗផ្សេងទៀត។',
      descEn: 'Select your preferred title from 15+ official blockbuster games including Mobile Legends, Roblox, Free Fire, PUBG, and Genshin Impact.',
      icon: Gamepad2,
      badgeColor: 'from-amber-400 to-[#E5B55E]',
      accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      telemetry: 'CATALOG: 15 VERIFIED',
      actionKh: 'ដំណាក់កាល ០១',
      actionEn: 'STAGE 01',
    },
    {
      step: '02',
      stage: 'STAGE: 02 // CREDENTIALS',
      titleKh: 'បញ្ចូលលេខសម្គាល់គណនី (User ID)',
      titleEn: 'Sync Player ID & Server Zone',
      descKh: 'វាយបញ្ចូលលេខសម្គាល់ Player ID / User ID និង Zone ID (សម្រាប់ MLBB) ឱ្យបានត្រឹមត្រូវ។ បន្ទាប់មកចុច "ផ្ទៀងផ្ទាត់" ដើម្បីពិនិត្យមើលឈ្មោះតួអង្គក្នុងហ្គេម។',
      descEn: 'Enter your Player/User ID and Zone ID. Hit "Verify ID" to authenticate your character nickname directly from the game server.',
      icon: UserCheck,
      badgeColor: 'from-cyan-400 to-blue-500',
      accentBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      telemetry: 'ENCRYPTION: 100% SAFE',
      actionKh: 'ដំណាក់កាល ០២',
      actionEn: 'STAGE 02',
    },
    {
      step: '03',
      stage: 'STAGE: 03 // LOADOUT',
      titleKh: 'ជ្រើសរើសកញ្ចប់ពេជ្រ ឬកាក់',
      titleEn: 'Arm Loadout: Choose Package',
      descKh: 'ជ្រើសរើសចំនួនពេជ្រ (Diamonds), Robux, Pass ឬ UC ដែលអ្នកចង់បញ្ចូល។ តម្លៃបង្ហាញច្បាស់លាស់ទាំង USD ($) និង KHR (៛) គ្មានថ្លៃលាក់កំបាំង។',
      descEn: 'Arm your account with diamonds, Robux, passes, or UC. Transparent pricing in USD and KHR with zero surcharge.',
      icon: Package,
      badgeColor: 'from-violet-400 to-purple-500',
      accentBg: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
      telemetry: 'TIER: OFFICIAL PRICING',
      actionKh: 'ដំណាក់កាល ០៣',
      actionEn: 'STAGE 03',
    },
    {
      step: '04',
      stage: 'STAGE: 04 // KHQR MATRIX',
      titleKh: 'ស្កេនទូទាត់តាម Bakong KHQR',
      titleEn: 'Scan Bakong KHQR Matrix (0% Fee)',
      descKh: 'ប្រព័ន្ធនឹងបង្កើតកូដ Bakong KHQR ផ្លូវការដែលមានឈ្មោះហាង SEA RA PRESTIGE។ បើក App ធនាគារណាមួយនៅកម្ពុជា (ABA, Wing, ACLEDA, Canadia...) រួច Scan ទូទាត់។',
      descEn: 'The system renders an instant Bakong KHQR under SEA RA PRESTIGE. Open ABA, Wing, ACLEDA, or any of 60+ Cambodian banks and scan to pay.',
      icon: QrCode,
      badgeColor: 'from-rose-500 to-red-500',
      accentBg: 'bg-red-500/10 border-red-500/30 text-red-400',
      telemetry: 'GATEWAY: BAKONG_NBC',
      actionKh: 'ដំណាក់កាល ០៤',
      actionEn: 'STAGE 04',
    },
    {
      step: '05',
      stage: 'STAGE: 05 // INJECTION',
      titleKh: 'ពេជ្រចូលគណនីស្វ័យប្រវត្តិ < 3 វិនាទី',
      titleEn: 'Direct API Injection: < 3 Seconds',
      descKh: 'ពេលទូទាត់ប្រាក់រួច ប្រព័ន្ធ API នឹងបញ្ចូលពេជ្រ ឬកាក់ទៅក្នុងគណនីហ្គេមរបស់អ្នកភ្លាមៗដោយស្វ័យប្រវត្តិ។ បើកហ្គេមរបស់អ្នកដើម្បីរីករាយភ្លាមៗ!',
      descEn: 'Once payment completes, our high-speed API directly delivers diamonds into your player account in under 3 seconds. Game on!',
      icon: Zap,
      badgeColor: 'from-emerald-400 to-teal-500',
      accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      telemetry: 'SPEED: < 3.0 SECONDS',
      actionKh: 'សម្រេចជោគជ័យ',
      actionEn: 'PAYLOAD DELIVERED',
    },
  ];

  const gameIdGuides = [
    {
      game: 'Mobile Legends: Bang Bang',
      slug: 'mobile-legends',
      image: '/banners/mlbb.jpg',
      uidFormat: 'USER ID (8-10 DIGITS) + ZONE ID (4-5 DIGITS)',
      whereKh: 'ចុចលើ Avatar កម្រងរូបភាពរបស់អ្នកនៅជ្រុងខាងឆ្វេងផ្នែកខាងលើក្នុងហ្គេម។ អ្នកនឹងឃើញលេខ ID ដូចជា៖ 12345678 (2001)។ 12345678 គឺជា User ID ហើយ 2001 គឺជា Zone ID។',
      whereEn: 'Tap your in-game profile avatar at the top left. You will see your User ID followed by Zone ID in brackets, e.g. 12345678 (2001).',
      sample: '12345678 (2001)',
    },
    {
      game: 'Roblox (Robux Direct)',
      slug: 'roblox',
      image: '/banners/roblox.jpg',
      uidFormat: 'ROBLOX LOGIN USERNAME / USER ID',
      whereKh: 'ចូលទៅកាន់ Profile របស់អ្នកក្នុងកម្មវិធី Roblox ឬនៅលើវិបសាយ roblox.com/users/profile ដើម្បីចម្លងឈ្មោះ Login Username ពិតប្រាកដ (មិនមែន Display Name)។',
      whereEn: 'Go to your Roblox profile in-app or at roblox.com to copy your exact login Username (not your display nickname).',
      sample: 'GamerKnight99',
    },
    {
      game: 'Free Fire & Free Fire MAX',
      slug: 'free-fire',
      image: '/banners/ff.jpg',
      uidFormat: 'PLAYER NUMERIC UID (9-10 DIGITS)',
      whereKh: 'ចុចលើ Profile របស់អ្នកនៅជ្រុងខាងឆ្វេងផ្នែកខាងលើក្នុងហ្គេម Free Fire។ លេខ UID ស្ថិតនៅក្រោមឈ្មោះតួអង្គរបស់អ្នកដោយផ្ទាល់។',
      whereEn: 'Tap your profile icon at top-left in Free Fire. Your numeric UID is displayed right beneath your character name with a quick copy button.',
      sample: '1098765432',
    },
    {
      game: 'PUBG Mobile',
      slug: 'pubg-mobile',
      image: '/banners/pubg.jpg',
      uidFormat: 'CHARACTER ID (8-11 DIGITS)',
      whereKh: 'បើកហ្គេម PUBG Mobile ចុចលើរូប Profile របស់អ្នកនៅខាងលើ។ លេខ Character ID ស្ថិតនៅខាងលើឈ្មោះតួអង្គរបស់អ្នក។',
      whereEn: 'Open PUBG Mobile, tap your avatar at top-right. Your numeric Character ID is shown clearly above your character nickname.',
      sample: '5123456789',
    },
    {
      game: 'Genshin Impact',
      slug: 'genshin-impact',
      image: '/banners/genshin.png',
      uidFormat: 'UID (9 DIGITS) + SERVER REGION',
      whereKh: 'UID របស់អ្នកត្រូវបានបង្ហាញជានិច្ចនៅជ្រុងខាងស្តាំផ្នែកខាងក្រោមនៃអេក្រង់ហ្គេម ឬនៅក្នុងម៉ឺនុយ Paimon Pause Menu។',
      whereEn: 'Your UID is permanently rendered at the bottom-right corner of your screen and inside the Paimon Pause Menu.',
      sample: '801234567 (Asia)',
    },
    {
      game: 'Valorant',
      slug: 'valorant',
      image: '/banners/valorant.png',
      uidFormat: 'RIOT ID (USERNAME#TAGLINE)',
      whereKh: 'បើក Riot Client ឬចុចលើ Profile ក្នុងហ្គេម Valorant។ ចម្លងឈ្មោះ Riot ID របស់អ្នករួមទាំង Tagline (ឧ. Player#SEA)។',
      whereEn: 'Open Riot Client or check in-game. Copy your Riot ID complete with the hashtag tag (e.g. Phoenix#AP1).',
      sample: 'ValorantPro#SEA1',
    },
    {
      game: 'Honor of Kings',
      slug: 'honor-of-kings',
      image: '/banners/hok.jpg',
      uidFormat: 'ROLE ID / PLAYER UID (10-18 DIGITS)',
      whereKh: 'ចុចលើ Avatar Profile នៅជ្រុងខាងឆ្វេងលើក្នុងហ្គេម HOK រួចចូល Settings។ លេខ Role ID / Player UID បង្ហាញនៅខាងក្រោម។',
      whereEn: 'Tap your avatar profile at the top left in Honor of Kings, go to Settings. Copy your Role ID / Player UID at the bottom.',
      sample: '10928374659283',
    },
    {
      game: 'Call of Duty: Mobile',
      slug: 'codm',
      image: '/banners/codm.jpg',
      uidFormat: 'PLAYER UID (19 DIGITS) + OPENID',
      whereKh: 'បើក CODM ចូល Profile ចុចលើ Tab ទីពីរ (Basic)។ លេខ UID ស្ថិតនៅខាងក្រោមរូបតំណាង Avatar របស់អ្នក។',
      whereEn: 'Open CODM, tap your profile at top-left, select the BASIC tab. Your numeric UID is displayed right under your player avatar.',
      sample: '6742918274619283741',
    },
    {
      game: 'EA Sports FC Mobile',
      slug: 'fc-mobile',
      image: '/banners/fcmobile.jpg',
      uidFormat: 'UID / USER ID (8-12 DIGITS)',
      whereKh: 'បើក FC Mobile ចុចលើរូបកង់ Settings នៅជ្រុងខាងស្តាំលើ រួចជ្រើសរើស User Info ដើម្បីចម្លងលេខ UID របស់អ្នក។',
      whereEn: 'Open FC Mobile, tap the Settings gear icon at top-right, then select User Info to copy your unique numeric UID.',
      sample: '9823471928',
    },
    {
      game: 'League of Legends: Wild Rift',
      slug: 'wild-rift',
      image: '/banners/wildrift.jpg',
      uidFormat: 'RIOT ID (USERNAME#TAGLINE)',
      whereKh: 'បើកហ្គេម Wild Rift ចុចលើ Profile របស់អ្នកនៅជ្រុងខាងឆ្វេងលើ។ ចម្លង Riot ID និង Tagline (ឧ. Yasuo#SEA)។',
      whereEn: 'Open League of Legends: Wild Rift, tap your profile banner at top-left. Copy your Riot ID and Tagline (e.g. Yasuo#SEA).',
      sample: 'Yasuo#SEA855',
    },
    {
      game: 'Honkai: Star Rail',
      slug: 'honkai-star-rail',
      image: '/banners/starrail.jpg',
      uidFormat: 'UID (9 DIGITS) + SERVER REGION',
      whereKh: 'UID របស់អ្នកបង្ហាញនៅជ្រុងខាងស្តាំខាងក្រោមអេក្រង់ក្នុងហ្គេមជានិច្ច និងក្នុង Phone Menu (9 ខ្ទង់) + ជ្រើសរើស Server Region។',
      whereEn: 'Your UID is visible at the bottom-right corner of the screen and inside the Phone Menu (9 digits) + select your Server Region.',
      sample: '809182374 (Asia)',
    },
    {
      game: 'Blood Strike',
      slug: 'blood-strike',
      image: '/banners/bloodstrike.jpg',
      uidFormat: 'USER ID (8 DIGITS)',
      whereKh: 'បើក Blood Strike ចុចលើរូប Profile នៅជ្រុងខាងឆ្វេងលើ។ លេខ User ID ស្ថិតនៅក្រោមឈ្មោះតួអង្គរបស់អ្នក។',
      whereEn: 'Open Blood Strike, tap your profile avatar at top-left. Your numeric User ID is shown right below your character name.',
      sample: '87239104',
    },
    {
      game: 'Clash of Clans',
      slug: 'clash-of-clans',
      image: '/banners/clashofclans.jpg',
      uidFormat: 'PLAYER TAG WITH # (e.g. #P9L8CY88)',
      whereKh: 'បើក Clash of Clans ចុចលើ Level Profile badge នៅជ្រុងឆ្វេងលើ។ Player Tag ចាប់ផ្តើមដោយសញ្ញា # (ឧ. #P9L8CY88)។',
      whereEn: 'Open Clash of Clans, tap your XP level badge at top-left. Your Player Tag starts with # (e.g. #P9L8CY88).',
      sample: '#P9L8CY88',
    },
    {
      game: 'Steam Wallet (USD)',
      slug: 'steam-wallet',
      image: '/banners/steam.jpg',
      uidFormat: 'STEAM USERNAME / PROFILE URL',
      whereKh: 'បញ្ចូលឈ្មោះ Steam Account Login Username ឬ Steam Profile URL របស់អ្នក។ កូដកាតនឹងបញ្ជូនភ្លាមៗ។',
      whereEn: 'Enter your Steam Account Username or Steam Custom Profile URL. Digital redemption code applies instantly.',
      sample: 'GamerCambodia2026',
    },
    {
      game: 'Arena of Valor (RoV)',
      slug: 'arena-of-valor',
      image: '/banners/aov.jpg',
      uidFormat: 'OPENID / PLAYER UID (16-32 CHARS)',
      whereKh: 'បើកហ្គេម RoV / AoV ចុចលើរូប Profile នៅឆ្វេងលើ រួចជ្រើសរើស Settings ចូល OpenID ឬ Player UID។',
      whereEn: 'Open Arena of Valor, tap your profile icon at top-left, go to Settings to find your OpenID or Player UID.',
      sample: '9834710928347192',
    },
  ];

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none pt-20 sm:pt-24">
      
      {/* ================================================================= */}
      {/* 1. HERO HEADER                                                    */}
      {/* ================================================================= */}
      <div className="relative mb-14 text-center space-y-4 max-w-4xl mx-auto">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Clean, High-Impact Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          {language === 'km' ? 'របៀបបញ្ចូលលុយហ្គេម' : 'How to Top-Up on SEA RA'}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 mt-1">
            {language === 'km' ? 'ល្បឿនលឿន 3 វិនាទី និងសុវត្ថិភាព 100%' : 'Fast, Secure & Zero Password'}
          </span>
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          {language === 'km'
            ? 'ស្វែងយល់ពីរបៀបបញ្ចូលពេជ្រ និងកាក់ហ្គេមតាមរយៈប្រព័ន្ធស្វ័យប្រវត្តិ Bakong KHQR ដោយផ្ទាល់ 0% ថ្លៃសេវា និងមិនបាច់ប្រើ Password គណនីរបស់អ្នកឡើយ។'
            : 'Reload in-game currencies seamlessly using Cambodia’s National Bakong KHQR with zero fee and instant automated injection.'}
        </p>

        {/* Dual Chamfered Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/games"
            style={{
              clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)',
            }}
            className="px-7 py-3 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,212,255,0.6)] active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span>{language === 'km' ? 'ចាប់ផ្តើមបញ្ចូលឥឡូវនេះ' : 'Start Top-Up Now'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-black" />
          </Link>
          
          <button
            type="button"
            onClick={() => openTopUp()}
            style={{
              clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)',
            }}
            className="px-7 py-3 bg-[#0A1020]/90 hover:bg-[#121B33] border border-cyan-400/40 hover:border-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{language === 'km' ? 'បើកផ្ទាំងបញ្ចូលរហ័ស' : 'Express Top-Up'}</span>
          </button>
        </div>

      </div>

      {/* ================================================================= */}
      {/* 2. THE 5-STAGE CONNECTED RELOAD PIPELINE                          */}
      {/* ================================================================= */}
      <div className="space-y-6 mb-20">
        
        {/* Subheader */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.1]">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,0.9)]" />
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
              {language === 'km' ? 'ដំណើរការ ៥ ជំហានក្នុងការបញ្ចូលលុយ' : '5-Step Connected Reload Journey'}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold hidden sm:inline tracking-wider">
            STEP 01 ➔ 02 ➔ 03 ➔ 04 ➔ 05 (COMPLETE)
          </span>
        </div>

        {/* Connected Highway / Path Container */}
        <div className="relative">
          
          {/* Laser Neon Energy Track (desktop) */}
          <div className="hidden lg:block absolute top-[48px] left-[5%] right-[5%] h-[3px] bg-gradient-to-r from-amber-400 via-cyan-400 via-violet-400 via-red-400 to-emerald-400 z-0 opacity-50 shadow-[0_0_15px_rgba(0,212,255,0.7)]" />

          {/* 5 Connected Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              const isLast = idx === steps.length - 1;

              return (
                <div key={idx} className="relative flex flex-col group">
                  
                  {/* Chamfered Milestone Card */}
                  <div
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                    }}
                    className="relative bg-[#070D1B]/95 hover:bg-[#0B152B] border border-white/[0.12] hover:border-cyan-400/80 p-5 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between h-full overflow-hidden"
                  >
                    
                    {/* Glowing Top Cyber Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />

                    <div>
                      {/* Top Meta: Stage Code & Milestone Icon */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-11 h-11 ${st.accentBg} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform relative z-10 border border-white/20`}
                          style={{
                            clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-950/60 px-2 py-0.5 border border-cyan-400/30">
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

                    {/* Bottom Status & Telemetry Tag */}
                    <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono">
                      <span className="text-cyan-400 font-bold">
                        {idx === 0 ? 'START' : isLast ? 'DONE < 3S' : `STAGE 0${idx + 1}`}
                      </span>
                      <span className="text-neutral-500 font-bold group-hover:text-white transition-colors">
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
      {/* 3. IN-GAME USER ID GUIDE                                          */}
      {/* ================================================================= */}
      <div className="space-y-6 mb-20">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.1] gap-2">
          <div className="flex items-center gap-2.5">
            <Crosshair className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
              {language === 'km' ? 'របៀបស្វែងរក USER ID ក្នុងហ្គេមនីមួយៗ' : 'How to Locate Your In-Game User ID'}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30">
            ✓ Public ID Only • No Password Required
          </span>
        </div>

        {/* Tactical ID Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {gameIdGuides.map((item, idx) => (
            <div
              key={idx}
              style={{
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              }}
              className="p-5 bg-[#080E1C] border border-white/[0.12] hover:border-cyan-400/60 transition-all duration-300 hover:-translate-y-1 space-y-3.5 shadow-xl group"
            >
              {/* Card Header with Game Thumbnail */}
              <div className="flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 shrink-0">
                  <img
                    src={item.image}
                    alt={item.game}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-extrabold text-white uppercase truncate group-hover:text-cyan-300 transition-colors">
                    {item.game}
                  </h4>
                  <span className="inline-block mt-1 font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-black/60 text-cyan-300 border border-cyan-500/30 tracking-wider">
                    {item.uidFormat}
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <p className="text-xs text-neutral-300 leading-relaxed">
                {language === 'km' ? item.whereKh : item.whereEn}
              </p>

              {/* Sample Format Callout */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
                <span className="text-neutral-500">FORMAT SAMPLE:</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {item.sample}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 4. SECURITY & ASSURANCE CONSOLE                                   */}
      {/* ================================================================= */}
      <div
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
        }}
        className="bg-gradient-to-br from-[#0B132B] via-[#070D1D] to-[#040812] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-12"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">
                {language === 'km' ? 'សុវត្ថិភាពខ្ពស់ 100%' : '100% Safe & Authorized'}
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {language === 'km'
                  ? 'មិនត្រូវការ Password គណនីទេ។ ពេជ្របញ្ចូលតាមរយៈ Partner API ផ្លូវការដោយផ្ទាល់។'
                  : 'Zero password required. Inject directly through official developer APIs.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
            >
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">
                {language === 'km' ? 'ល្បឿនបញ្ចូល < 3 វិនាទី' : 'Under 3-Sec Delivery'}
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {language === 'km'
                  ? 'ដំណើរការស្វ័យប្រវត្តិតាម Bot Server 24 ម៉ោងក្នុងមួយថ្ងៃ គ្មានការពន្យារពេលឡើយ។'
                  : 'Automated 24/7 server pipeline with zero manual delay.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
            >
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">
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
