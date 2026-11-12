'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Headphones,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Clock,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Radio,
  Zap,
  Terminal,
} from 'lucide-react';

export default function SupportPage() {
  const { language } = useApp();

  const faqs = [
    {
      code: 'Q-01',
      qKh: 'តើការបញ្ចូលពេជ្រប្រើរយៈពេលប៉ុន្មាន?',
      qEn: 'How long does in-game delivery take?',
      aKh: 'ជាទូទៅពេជ្រ ឬកាក់នឹងចូលគណនីរបស់អ្នកស្វ័យប្រវត្តិក្នងរយៈពេលតិចជាង ៣ វិនាទី បន្ទាប់ពីការទូទាត់តាម Bakong KHQR បានជោគជ័យ។',
      aEn: 'Usually delivery is instant and takes less than 3 seconds after payment verification via our automated API pipeline.',
    },
    {
      code: 'Q-02',
      qKh: 'តើខ្ញុំចាំបាច់ត្រូវផ្តល់ Password ឬ Email ដែរឬទេ?',
      qEn: 'Do I need to share my account password?',
      aKh: 'មិនបាច់ទេ! SEA RA PRESTIGE មិនដែលសួររក Password ឬ Email របស់លោកអ្នកឡើយ។ យើងត្រូវការត្រឹមតែ Player ID និង Zone ID ជាសាធារណៈប៉ុណ្ណោះ។',
      aEn: 'Never! We strictly only require your public Player ID and Zone ID. No passwords or private credentials are ever requested.',
    },
    {
      code: 'Q-03',
      qKh: 'តើខ្ញុំអាចទូទាត់តាមធនាគារណាខ្លះ?',
      qEn: 'Which banks are supported?',
      aKh: 'លោកអ្នកអាចប្រើប្រាស់កម្មវិធីធនាគារ និងកាបូបអេឡិចត្រូនិកទាំងអស់នៅកម្ពុជាដែលគាំទ្រ Bakong KHQR ដូចជា ABA Mobile, Wing Bank, ACLEDA ToanChet, Canadia Bank, Sathapana និងជាង 60+ ស្ថាប័នហិរញ្ញវត្ថុផ្សេងទៀត។',
      aEn: 'All Cambodian banking and e-wallet applications supporting Bakong KHQR, including ABA Mobile, Wing, ACLEDA, Canadia, Sathapana, and 60+ institutions.',
    },
    {
      code: 'Q-04',
      qKh: 'ចុះបើខ្ញុំបញ្ចូលខុស ID តើអាចប្តូរវិញបានទេ?',
      qEn: 'Can I reverse an order if I entered the wrong ID?',
      aKh: 'ប្រសិនបើពេជ្រត្រូវបានបញ្ចូលជោគជ័យទៅក្នុងគណនីនោះរួចហើយ ប្រព័ន្ធហ្គេមមិនអាចដកហូតមកវិញបានទេ។ ដូច្នេះសូមមេត្តាពិនិត្យ និងចុច "ផ្ទៀងផ្ទាត់" ឈ្មោះតួអង្គមុនពេលទូទាត់ប្រាក់ជានិច្ច។',
      aEn: 'Once diamonds are credited to an account, publisher policies prevent reversal. Please verify your nickname prior to paying.',
    },
  ];

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto select-none pt-20 sm:pt-24">
      
      {/* Header */}
      <div className="space-y-3 mb-12 text-center max-w-2xl mx-auto relative">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {language === 'km' ? 'មជ្ឈមណ្ឌលជំនួយ VIP' : '24/7 VIP Support Hub'}
        </h1>
        
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl mx-auto">
          {language === 'km'
            ? 'ក្រុមការងារជំនួយការផ្លូវការរបស់ SEA RA PRESTIGE រង់ចាំបម្រើ និងដោះស្រាយបញ្ហារបស់លោកអ្នក ២៤ ម៉ោងក្នុងមួយថ្ងៃ ៧ ថ្ងៃក្នុងមួយសប្តាហ៍។'
            : 'Our dedicated customer success team is standby 24/7/365 to assist with order verification, billing, and technical guidance.'}
        </p>
      </div>

      {/* Official Direct Contact Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        
        {/* Telegram Card */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          }}
          className="bg-[#070D1B] border border-white/[0.12] hover:border-[#229ED9]/80 p-6 sm:p-7 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 space-y-5 flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div
                style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                className="w-12 h-12 bg-[#229ED9]/15 border border-[#229ED9]/40 flex items-center justify-center text-[#229ED9] shadow-lg group-hover:scale-105 transition-transform"
              >
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {language === 'km' ? 'អនឡាញ ២៤/៧ • ឆ្លើយតបរហ័ស' : 'ONLINE 24/7 • LATENCY < 15MS'}
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                {language === 'km' ? 'សេវាជំនួយ VIP Telegram' : 'Telegram VIP Support'}
              </h3>
              <p className="font-mono text-[11px] text-cyan-400 font-bold mt-0.5">
                {language === 'km' ? 'គណនីផ្លូវការ: @sokhunmao' : 'Official Handle: @sokhunmao'}
              </p>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {language === 'km'
                ? 'ទាក់ទងមកកាន់គណនី Telegram ផ្លូវការ @sokhunmao ដើម្បីសាកសួរព័ត៌មាន ដោះស្រាយបញ្ហា Order ឬស្នើសុំជំនួយបន្ទាន់។'
                : 'Direct message our official support agent @sokhunmao for urgent order status, billing inquiry, or platform guidance.'}
            </p>
          </div>

          <a
            href="https://t.me/sokhunmao"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
            }}
            className="w-full py-3.5 bg-gradient-to-r from-[#229ED9] to-[#0088cc] hover:from-[#35abeb] hover:to-[#0099e6] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,158,217,0.5)] active:scale-95 cursor-pointer"
          >
            <span>{language === 'km' ? 'ទាក់ទងតាម TELEGRAM (@SOKHUNMAO)' : 'CONNECT TELEGRAM (@SOKHUNMAO)'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Facebook Page Card */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          }}
          className="bg-[#070D1B] border border-white/[0.12] hover:border-[#1877F2]/80 p-6 sm:p-7 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 space-y-5 flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div
                style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                className="w-12 h-12 bg-[#1877F2]/15 border border-[#1877F2]/40 flex items-center justify-center text-[#1877F2] shadow-lg group-hover:scale-105 transition-transform"
              >
                <Headphones className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30 font-bold flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                {language === 'km' ? 'សហគមន៍ផ្លូវការ SEA RA' : 'Verified Community Feed'}
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                {language === 'km' ? 'ទំព័រ Facebook ផ្លូវការ' : 'Official Facebook Page'}
              </h3>
              <p className="font-mono text-[11px] text-blue-400 font-bold mt-0.5">
                {language === 'km' ? 'សហគមន៍ SEA RA PRESTIGE' : 'SEA RA PRESTIGE Community'}
              </p>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {language === 'km'
                ? 'តាមដានទំព័រហ្វេសប៊ុកផ្លូវការ ដើម្បីទទួលបានព័ត៌មានថ្មីៗ ប្រូម៉ូសិនពិសេស និងការផ្តល់ជូនកាដូហ្គេមជាប្រចាំ។'
                : 'Follow our official Facebook page for the latest updates, event announcements, and exclusive community giveaways.'}
            </p>
          </div>

          <a
            href="https://www.facebook.com/share/1FNKuGBCrq/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
            }}
            className="w-full py-3.5 bg-gradient-to-r from-[#1877F2] to-[#0d5ac1] hover:from-[#2d84f8] hover:to-[#1166d8] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(24,119,242,0.5)] active:scale-95 cursor-pointer"
          >
            <span>{language === 'km' ? 'ចូលទៅកាន់ FACEBOOK PAGE' : 'ACCESS FACEBOOK DISPATCH'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

      {/* Cyber FAQ Console */}
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.1]">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
              {language === 'km' ? 'សំណួរដែលសួរញឹកញាប់ (FAQ)' : 'Frequently Asked Questions (FAQ)'}
            </h2>
          </div>
          <span className="font-mono text-[10px] text-cyan-400 font-bold">
            {language === 'km' ? '៤ សំណួរចម្លើយ' : '4 Entries'}
          </span>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              }}
              className="p-5 bg-[#080E1C] border border-white/[0.1] hover:border-cyan-400/50 transition-colors space-y-2 shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                  {faq.code}
                </span>
                <h4 className="text-sm font-extrabold text-white">
                  {language === 'km' ? faq.qKh : faq.qEn}
                </h4>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed pl-9">
                {language === 'km' ? faq.aKh : faq.aEn}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
