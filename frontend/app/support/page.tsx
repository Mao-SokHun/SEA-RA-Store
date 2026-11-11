'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Headphones,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowLeft,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export default function SupportPage() {
  const { language } = useApp();

  const faqs = [
    {
      qKh: 'តើការបញ្ចូលពេជ្រប្រើរយៈពេលប៉ុន្មាន?',
      qEn: 'How long does in-game delivery take?',
      aKh: 'ជាទូទៅពេជ្រ ឬកាក់នឹងចូលគណនីរបស់អ្នកស្វ័យប្រវត្តិក្នងរយៈពេលតិចជាង ៣ វិនាទី បន្ទាប់ពីការទូទាត់តាម Bakong KHQR បានជោគជ័យ។',
      aEn: 'Usually delivery is instant and takes less than 3 seconds after payment verification.',
    },
    {
      qKh: 'តើខ្ញុំចាំបាច់ត្រូវផ្តល់ Password ឬ Email ដែរឬទេ?',
      qEn: 'Do I need to share my account password?',
      aKh: 'មិនបាច់ទេ! SEA RA PRESTIGE មិនដែលសួររក Password ឬ Email របស់លោកអ្នកឡើយ។ យើងត្រូវការត្រឹមតែ Player ID និង Zone ID ជាសាធារណៈប៉ុណ្ណោះ។',
      aEn: 'Never! We strictly only require your public Player ID and Zone ID. No password needed.',
    },
    {
      qKh: 'តើខ្ញុំអាចទូទាត់តាមធនាគារណាខ្លះ?',
      qEn: 'Which banks are supported?',
      aKh: 'លោកអ្នកអាចប្រើប្រាស់កម្មវិធីធនាគារ និងកាបូបអេឡិចត្រូនិកទាំងអស់នៅកម្ពុជាដែលគាំទ្រ Bakong KHQR ដូចជា ABA Mobile, Wing Bank, ACLEDA ToanChet, Canadia Bank, Sathapana និងជាង 60+ ស្ថាប័នហិរញ្ញវត្ថុផ្សេងទៀត។',
      aEn: 'All Cambodian banks supporting Bakong KHQR, including ABA Mobile, Wing, ACLEDA, Canadia, Sathapana, and 60+ institutions.',
    },
    {
      qKh: 'ចុះបើខ្ញុំបញ្ចូលខុស ID តើអាចប្តូរវិញបានទេ?',
      qEn: 'Can I reverse an order if I entered the wrong ID?',
      aKh: 'ប្រសិនបើពេជ្រត្រូវបានបញ្ចូលជោគជ័យទៅក្នុងគណនីនោះរួចហើយ ប្រព័ន្ធហ្គេមមិនអាចដកហូតមកវិញបានទេ។ ដូច្នេះសូមមេត្តាពិនិត្យ និងចុច "ផ្ទៀងផ្ទាត់" ឈ្មោះតួអង្គមុនពេលទូទាត់ប្រាក់ជានិច្ច។',
      aEn: 'Once diamonds are credited to an account, publisher policies prevent reversal. Please verify your nickname prior to paying.',
    },
  ];

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto select-none">
      
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Home'}</span>
      </Link>

      <div className="space-y-4 mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>24/7 VIP LIVE CUSTOMER SUPPORT</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          {language === 'km' ? 'មជ្ឈមណ្ឌលជំនួយ VIP' : '24/7 VIP Support Hub'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          {language === 'km'
            ? 'ក្រុមការងារជំនួយការផ្លូវការរបស់ SEA RA PRESTIGE រង់ចាំបម្រើ និងដោះស្រាយបញ្ហារបស់លោកអ្នក ២៤ ម៉ោងក្នុងមួយថ្ងៃ ៧ ថ្ងៃក្នុងមួយសប្តាហ៍។'
            : 'Our dedicated customer success team is online 24/7/365 to assist with orders and inquiries.'}
        </p>
      </div>

      {/* Official Direct Contact Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
        
        {/* Telegram Card */}
        <div className="rounded-3xl bg-[#090E1E] border border-white/[0.1] hover:border-[#229ED9]/50 p-6 shadow-xl transition-all space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#229ED9]/15 border border-[#229ED9]/30 flex items-center justify-center text-[#229ED9]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Telegram VIP Support
              </h3>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online 24/7 • Fast Response</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {language === 'km'
              ? 'ទាក់ទងមកកាន់គណនី Telegram ផ្លូវការ @sokhunmao ដើម្បីសាកសួរព័ត៌មាន ដោះស្រាយបញ្ហា Order ឬស្នើសុំជំនួយបន្ទាន់។'
              : 'Direct message our official support agent @sokhunmao for urgent order status, billing, or platform guidance.'}
          </p>
          <a
            href="https://t.me/sokhunmao"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-[#229ED9] hover:bg-[#229ED9]/80 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <span>Chat via Telegram (@sokhunmao)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Facebook Page Card */}
        <div className="rounded-3xl bg-[#090E1E] border border-white/[0.1] hover:border-[#1877F2]/50 p-6 shadow-xl transition-all space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1877F2]/15 border border-[#1877F2]/30 flex items-center justify-center text-[#1877F2]">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Official Facebook Page
              </h3>
              <p className="text-xs text-neutral-400 font-semibold mt-0.5">
                SEA RA PRESTIGE Community
              </p>
            </div>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {language === 'km'
              ? 'តាមដានទំព័រហ្វេសប៊ុកផ្លូវការ ដើម្បីទទួលបានព័ត៌មានថ្មីៗ ប្រូម៉ូសិនពិសេស និងការផ្តល់ជូនកាដូហ្គេមជាប្រចាំ។'
              : 'Follow our official Facebook page for the latest updates, event announcements, and exclusive community giveaways.'}
          </p>
          <a
            href="https://www.facebook.com/share/1FNKuGBCrq/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-[#1877F2] hover:bg-[#1877F2]/80 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <span>Visit Facebook Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
          <HelpCircle className="w-4 h-4 text-[#E5B55E]" />
          <h2 className="text-lg font-black text-white uppercase tracking-wider">
            {language === 'km' ? 'សំណួរដែលសួរញឹកញាប់ (FAQ)' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#090E1E] border border-white/[0.08] space-y-2 shadow-md"
            >
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-[#E5B55E]">Q:</span>
                <span>{language === 'km' ? faq.qKh : faq.qEn}</span>
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed pl-5">
                {language === 'km' ? faq.aKh : faq.aEn}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
