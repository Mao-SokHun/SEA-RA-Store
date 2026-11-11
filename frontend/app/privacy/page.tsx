'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>SEA RA PRESTIGE • PRIVACY & SECURITY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {language === 'km' ? 'គោលការណ៍ឯកជនភាព' : 'Privacy Policy'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-mono">
          Last Updated: November 2026 • Official Platform Document
        </p>
      </div>

      <div className="bg-[#090E1E] rounded-3xl border border-white/[0.08] p-6 sm:p-8 space-y-8 text-neutral-300 text-xs sm:text-sm leading-relaxed shadow-xl">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E5B55E]" />
            <span>{language === 'km' ? '១. សេចក្តីផ្តើមអំពីវេទិកា' : '1. Introduction'}</span>
          </h2>
          <p>
            {language === 'km'
              ? 'សូមស្វាគមន៍មកកាន់ SEA RA PRESTIGE (https://searaprestige.kh)។ យើងខ្ញុំប្តេជ្ញាចិត្តយ៉ាងមុតមាំក្នុងការការពារឯកជនភាព និងសុវត្ថិភាពទិន្នន័យផ្ទាល់ខ្លួនរបស់អតិថិជនទាំងអស់ដែលប្រើប្រាស់សេវាកម្មបញ្ចូលលុយហ្គេមរបស់យើង។'
              : 'Welcome to SEA RA PRESTIGE. We are committed to safeguarding the privacy and confidential data of all gamers utilizing our automated in-game reload services.'}
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{language === 'km' ? '២. ព័ត៌មានដែលយើងប្រមូល' : '2. Information We Collect'}</span>
          </h2>
          <p>
            {language === 'km'
              ? 'ដើម្បីដំណើរការការបញ្ចូលពេជ្រ ឬកាក់ហ្គេម យើងប្រមូលតែព័ត៌មានជាសាធារណៈដែលចាំបាច់បំផុតប៉ុណ្ណោះ រួមមាន៖'
              : 'To process game reloads accurately, we strictly collect only public and essential order data, including:'}
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-neutral-400">
            <li>{language === 'km' ? 'លេខសម្គាល់ហ្គេមជាសាធារណៈ (Player ID / User ID / UID)' : 'Public Game Player ID / User ID / UID'}</li>
            <li>{language === 'km' ? 'លេខសម្គាល់តំបន់ (Zone ID / Server Region)' : 'Zone ID / Server Region (e.g. for MLBB)'}</li>
            <li>{language === 'km' ? 'លេខវិក្កយបត្របញ្ជាទិញ និងប្រវត្តិទូទាត់ប្រាក់ Bakong KHQR' : 'Order reference numbers and Bakong KHQR transaction logs'}</li>
            <li>{language === 'km' ? 'ឈ្មោះតួអង្គក្នុងហ្គេម (In-game nickname) សម្រាប់ផ្ទៀងផ្ទាត់' : 'In-game nickname used strictly for verification'}</li>
          </ul>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <Lock className="w-4 h-4 shrink-0" />
            <span>
              <strong>{language === 'km' ? 'ការធានាសុវត្ថិភាព 100%៖' : '100% Security Guarantee:'}</strong>{' '}
              {language === 'km'
                ? 'យើងមិនដែលសួររក ឬរក្សាទុក Password, Email, លេខសម្ងាត់ធនាគារ ឬកាត ATM របស់លោកអ្នកឡើយ!'
                : 'We NEVER ask for, record, or store account passwords, emails, or banking credentials.'}
            </span>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span>{language === 'km' ? '៣. សុវត្ថិភាពទូទាត់ប្រាក់តាម Bakong KHQR' : '3. Payment Infrastructure'}</span>
          </h2>
          <p>
            {language === 'km'
              ? 'រាល់ប្រតិបត្តិការទូទាត់ប្រាក់ទាំងអស់ត្រូវបានអនុវត្តដោយផ្ទាល់តាមរយៈប្រព័ន្ធទូទាត់ជាតិ Bakong KHQR ក្រោមការត្រួតពិនិត្យរបស់ធនាគារជាតិនៃកម្ពុជា (NBC)។ SEA RA PRESTIGE មិនរក្សាទុកលេខកាតឥណទាន ឬទិន្នន័យហិរញ្ញវត្ថុណាមួយលើ Server របស់យើងឡើយ។'
              : 'All financial settlements are transacted directly through the National Bakong KHQR payment gateway under the supervision of the National Bank of Cambodia (NBC). SEA RA PRESTIGE does not hold or store credit card details or bank logins.'}
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{language === 'km' ? '៤. ការទាក់ទងមកកាន់យើងខ្ញុំ' : '4. Contact for Privacy Inquiries'}</span>
          </h2>
          <p>
            {language === 'km'
              ? 'ប្រសិនបើលោកអ្នកមានសំណួរ ឬកង្វល់អំពីគោលការណ៍ឯកជនភាពនេះ សូមទាក់ទងមកកាន់ក្រុមការងារគាំទ្ររបស់យើងតាមរយៈ Telegram ផ្លូវការ៖'
              : 'If you have questions regarding this privacy policy, please reach out to our official VIP support channel:'}
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
