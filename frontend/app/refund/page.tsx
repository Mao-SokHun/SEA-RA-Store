'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { RefreshCw, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function RefundPolicyPage() {
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <RefreshCw className="w-4 h-4" />
          <span>SEA RA PRESTIGE • REFUND GUARANTEE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {language === 'km' ? 'គោលការណ៍បង្វិលប្រាក់' : 'Refund & Dispute Policy'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-mono">
          100% Protection for Cambodian Gamers
        </p>
      </div>

      <div className="bg-[#090E1E] rounded-3xl border border-white/[0.08] p-6 sm:p-8 space-y-8 text-neutral-300 text-xs sm:text-sm leading-relaxed shadow-xl">
        
        {/* Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5 text-emerald-400" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-white text-sm">
              {language === 'km' ? 'ការធានាសងប្រាក់ 100% ប្រសិនបើមានបញ្ហាប្រព័ន្ធ' : '100% Full Refund Guarantee on System Errors'}
            </h3>
            <p className="text-xs text-neutral-300">
              {language === 'km'
                ? 'ប្រសិនបើលោកអ្នកបានទូទាត់ប្រាក់ជោគជ័យ ប៉ុន្តែពេជ្រមិនបានចូលគណនីរបស់អ្នកដោយសារកំហុសបច្ចេកទេស ឬបញ្ហា Server ហ្គេម យើងខ្ញុំធានាសងប្រាក់ជូនវិញ 100% ភ្លាមៗ។'
                : 'If your payment was debited but currency delivery failed due to technical or game server outages, you are eligible for an immediate 100% full refund.'}
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E5B55E]" />
            <span>{language === 'km' ? '១. ករណីដែលអាចស្នើសុំបង្វិលប្រាក់បាន' : '1. Eligible Refund Scenarios'}</span>
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-2 text-neutral-300">
            <li>{language === 'km' ? 'ការទូទាត់ប្រាក់ជោគជ័យ ប៉ុន្តែប្រព័ន្ធ API បរាជ័យក្នុងការបញ្ចូលលើសពី ៣០ នាទី' : 'Payment completed but injection failed for over 30 minutes'}</li>
            <li>{language === 'km' ? 'ការកាត់ប្រាក់ស្ទួន (Double charge) លើវិក្កយបត្រតែមួយ' : 'Accidental duplicate payment on the same order reference'}</li>
            <li>{language === 'km' ? 'ហ្គេមស្ថិតក្នុងការបិទ Server ជួសជុល (Server Maintenance) ធ្វើឱ្យមិនអាចបញ្ចូលបាន' : 'Game server undergoing unannounced emergency maintenance'}</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>{language === 'km' ? '២. ករណីដែលមិនអាចបង្វិលប្រាក់បាន' : '2. Non-Refundable Scenarios'}</span>
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-2 text-neutral-300">
            <li>{language === 'km' ? 'អតិថិជនបញ្ចូលលេខសម្គាល់ Player ID ឬ Zone ID ខុសដោយខ្លួនឯង ហើយពេជ្រត្រូវបានបញ្ចូលរួចរាល់' : 'Customer provided an incorrect User ID / Zone ID and diamonds were successfully injected to that third-party account'}</li>
            <li>{language === 'km' ? 'ការទិញខុសកញ្ចប់ដោយអតិថិជន បន្ទាប់ពីការបញ្ចូលបានជោគជ័យ' : 'Change of mind after successful completion'}</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{language === 'km' ? '៣. របៀបស្នើសុំបង្វិលប្រាក់' : '3. How to Request a Refund'}</span>
          </h2>
          <p>
            {language === 'km'
              ? 'សូមផ្ញើភស្តុតាងវិក្កយបត្រ (Order ID) និងរូបភាព Screenshot ការកាត់ប្រាក់ពីធនាគារ មកកាន់ក្រុមការងារ Telegram VIP Support របស់យើងខ្ញុំ៖'
              : 'Please forward your Order ID and banking transaction slip to our official 24/7 VIP support channel:'}
          </p>
          <a
            href="https://t.me/sokhunmao"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#229ED9]/80 text-white text-xs font-bold transition-all shadow-lg"
          >
            <span>Contact Support: @sokhunmao</span>
          </a>
        </section>

      </div>
    </div>
  );
}
