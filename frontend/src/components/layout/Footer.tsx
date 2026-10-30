'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Clock, QrCode, Headphones, CheckCircle2, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="relative bg-[#090c10] border-t border-white/[0.08] text-neutral-400 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[250px] bg-amber-500/5 rounded-full blur-[140px]" />
        <div className="absolute top-0 right-10 w-[400px] h-[200px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand & Value Proposition */}
          <div className="space-y-3.5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ffe088] via-[#d4af37] to-[#8f6b10] p-[1.5px] shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                <div className="w-full h-full bg-[#0b0e14] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#f2ca50] fill-[#f2ca50]" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base text-[#f2ca50] tracking-wider">NEXUS</span>
                  <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                    TOP-UP
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">
                  {language === 'kh' ? 'សេវាកម្មបញ្ចូលលុយហ្គេមរហ័សទាន់ចិត្ត' : 'Direct Game Top Up Platform'}
                </span>
              </div>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {language === 'kh'
                ? 'វេទិកាបញ្ចូលពេជ្រ និងកាក់ហ្គេមស្វ័យប្រវត្តិតាម Bakong KHQR លឿនត្រឹម ៣ វិនាទី មិនបាច់ Login មិនប៉ះពាល់ Password សុវត្ថិភាព ១០០%។'
                : 'Instant 24/7 automated in-game currency reload via Bakong KHQR. Zero login required, zero password needed, 100% safe & trusted.'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151a23] border border-white/[0.08] text-[11px] text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{language === 'kh' ? 'ប្រព័ន្ធ API ដំណើរការ ២៤/៧' : 'API Systems 100% Operational'}</span>
            </div>
          </div>

          {/* Supported Popular Games */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'kh' ? 'ហ្គេមពេញនិយម' : 'Supported Games'}
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span>💎</span>
                <span>Mobile Legends: Bang Bang (Diamonds & Pass)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span>🔥</span>
                <span>Free Fire & Free Fire Max (Diamonds)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span>🪙</span>
                <span>PUBG Mobile (Unknown Cash - UC)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span>⚡</span>
                <span>Roblox (Robux Direct)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span>💎</span>
                <span>Genshin Impact, Valorant & Honor of Kings</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span>🎯</span>
                <span>CODM, Wild Rift & Blood Strike</span>
              </li>
              <li className="pt-1.5">
                <Link href="/orders" className="text-[#f2ca50] hover:underline font-bold flex items-center gap-1">
                  <span>🧾</span>
                  <span>{language === 'kh' ? 'ពិនិត្យប្រវត្តិបញ្ជាទិញ (Track Orders)' : 'Track Orders & Receipts'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'kh' ? 'វិធីសាស្ត្របង់ប្រាក់' : 'Payment Gateways'}
            </h4>
            <p className="text-xs text-neutral-400">
              {language === 'kh'
                ? 'គាំទ្រការស្កេនបង់ប្រាក់តាម Bakong KHQR គ្រប់ធនាគារក្នុងប្រទេសកម្ពុជា៖'
                : 'Supports one-click Bakong KHQR scans from all major Cambodian banks:'}
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-neutral-300">
              <div className="bg-[#151a23] px-2.5 py-1.5 rounded-lg border border-white/[0.06] flex items-center gap-1.5">
                <span className="text-red-400 font-black">KHQR</span>
                <span>Bakong Pay</span>
              </div>
              <div className="bg-[#151a23] px-2.5 py-1.5 rounded-lg border border-white/[0.06] flex items-center gap-1.5">
                <span className="text-cyan-400 font-bold">ABA</span>
                <span>ABA Mobile</span>
              </div>
              <div className="bg-[#151a23] px-2.5 py-1.5 rounded-lg border border-white/[0.06] flex items-center gap-1.5">
                <span className="text-lime-400 font-bold">WING</span>
                <span>Wing Bank</span>
              </div>
              <div className="bg-[#151a23] px-2.5 py-1.5 rounded-lg border border-white/[0.06] flex items-center gap-1.5">
                <span className="text-blue-400 font-bold">ACLEDA</span>
                <span>ACLEDA Pay</span>
              </div>
            </div>
          </div>

          {/* 24/7 Support & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'kh' ? 'ជំនួយអតិថិជន ២៤/៧' : 'Customer Support'}
            </h4>
            <p className="text-xs text-neutral-400">
              {language === 'kh'
                ? 'មានបញ្ហា ឬត្រូវការជំនួយបន្ទាន់? ក្រុមការងារយើងខ្ញុំប្រចាំការរង់ចាំឆ្លើយតបរហ័សទាន់ចិត្ត ២៤ ម៉ោង។'
                : 'Got questions or need urgent top-up assistance? Our dedicated support team is available 24/7.'}
            </p>
            <div className="space-y-2">
              <Link
                href="https://t.me/nexus_support_kh"
                target="_blank"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0088cc]/15 hover:bg-[#0088cc]/25 border border-[#0088cc]/30 text-[#00e4f2] text-xs font-bold transition-all"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                <span>Telegram: @nexus_support_kh</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} NEXUS TOP-UP. All rights reserved. Automated Gaming Aggregator.</p>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span>Powered by Official Direct Reload API</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
