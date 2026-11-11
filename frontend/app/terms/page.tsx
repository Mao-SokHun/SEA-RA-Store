'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { FileText, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  const { language } = useApp();

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

      <div className="space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5B55E]/10 border border-[#E5B55E]/30 text-[#E5B55E] text-xs font-bold">
          <FileText className="w-4 h-4" />
          <span>SEA RA PRESTIGE • TERMS & CONDITIONS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {language === 'km' ? 'លក្ខខណ្ឌនៃការប្រើប្រាស់' : 'Terms of Service'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-mono">
          Effective Date: November 2026 • Legal Terms
        </p>
      </div>

      <div className="bg-[#090E1E] rounded-3xl border border-white/[0.08] p-6 sm:p-8 space-y-8 text-neutral-300 text-xs sm:text-sm leading-relaxed shadow-xl">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E5B55E]" />
            <span>{language === 'km' ? '១. ការយល់ព្រមលើលក្ខខណ្ឌ' : '1. Agreement to Terms'}</span>
          </h2>
          <p>
            {language === 'km'
              ? 'ដោយការចូលប្រើប្រាស់ និងបញ្ជាទិញនៅលើវេទិកា SEA RA PRESTIGE លោកអ្នកយល់ព្រមគោរពតាមលក្ខខណ្ឌ និងគោលការណ៍ទាំងឡាយដែលមានចែងក្នុងឯកសារនេះ។ ប្រសិនបើលោកអ្នកមិនយល់ព្រមទេ សូមកុំប្រើប្រាស់សេវាកម្មរបស់យើង។'
              : 'By accessing and ordering through SEA RA PRESTIGE, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please refrain from using our platform.'}
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{language === 'km' ? '២. សេវាកម្មបញ្ចូលលុយហ្គេម' : '2. Top-Up Services & Delivery'}</span>
          </h2>
          <p>
            {language === 'km'
              ? 'SEA RA PRESTIGE ផ្តល់សេវាកម្មបញ្ចូលរូបិយប័ណ្ណហ្គេមផ្លូវការ (ដូចជា Mobile Legends Diamonds, Robux, Free Fire Diamonds, PUBG UC, Genshin Genesis Crystals) ដោយផ្ទាល់តាមរយៈ API ផ្លូវការ។ រយៈពេលបញ្ចូលជាមធ្យមគឺតិចជាង ៣ វិនាទី បន្ទាប់ពីការទូទាត់ប្រាក់ជោគជ័យតាម Bakong KHQR។'
              : 'SEA RA PRESTIGE provides direct authorized reload services for in-game currencies. Average delivery takes under 3 seconds once payment is verified across the Bakong KHQR network.'}
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{language === 'km' ? '៣. ការទទួលខុសត្រូវលើលេខសម្គាល់គណនី (ID)' : '3. Customer ID Accuracy'}</span>
          </h2>
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              {language === 'km'
                ? 'អតិថិជនមានទំនួលខុសត្រូវក្នុងការបញ្ចូលលេខសម្គាល់ Player ID និង Zone ID ឱ្យបានត្រឹមត្រូវ។ ប្រសិនបើអតិថិជនបញ្ចូល ID ខុស ហើយប្រព័ន្ធបានបញ្ជូនពេជ្រទៅគណនីនោះរួចរាល់ ក្រុមហ៊ុនមិនអាចដកហូត ឬបង្វិលប្រាក់វិញបានឡើយ។'
                : 'Users are strictly responsible for verifying their Player ID and Zone ID before paying. Orders successfully delivered to an incorrectly provided ID cannot be reversed or refunded.'}
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{language === 'km' ? '៤. ការទូទាត់ និងតម្លៃ' : '4. Pricing & Payments'}</span>
          </h2>
          <p>
            {language === 'km'
              ? 'តម្លៃទាំងអស់ត្រូវបានកំណត់ជាប្រាក់ដុល្លារ ($ USD) និងប្រាក់រៀល (៛ KHR) ដោយឥតគិតថ្លៃសេវាបន្ថែម (0% Fee)។ ការទូទាត់ប្រាក់ត្រូវតែធ្វើឡើងតាមរយៈលេខកូដ QR ផ្លូវការដែលបានបង្កើតនៅលើអេក្រង់។'
              : 'All prices are shown in USD and KHR with zero surcharge (0% fee). Payments must be settled using the unique dynamic KHQR generated for that order.'}
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>{language === 'km' ? '៥. ជំនួយ និងការដោះស្រាយបញ្ហា' : '5. Dispute Support'}</span>
          </h2>
          <p>
            {language === 'km'
              ? 'ក្រុមការងារសេវាកម្មអតិថិជន VIP របស់យើងរង់ចាំជួយដោះស្រាយបញ្ហា 24 ម៉ោងក្នុងមួយថ្ងៃ តាមរយៈ Telegram ផ្លូវការ៖'
              : 'Our 24/7 VIP Customer Support is available around the clock via our official channel:'}
          </p>
          <a
            href="https://t.me/sokhunmao"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#229ED9]/15 border border-[#229ED9]/40 text-[#38bdf8] text-xs font-bold hover:bg-[#229ED9]/25 transition-all"
          >
            <span>Telegram Support: @sokhunmao</span>
          </a>
        </section>

      </div>
    </div>
  );
}
