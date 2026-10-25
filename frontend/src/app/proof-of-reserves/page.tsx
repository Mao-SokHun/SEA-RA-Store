'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, CheckCircle2, ExternalLink, ArrowRight, Activity, Database, Key } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ProofOfReservesPage() {
  const { t, language } = useLanguage();

  return (
    <div className={`min-h-screen bg-[#0b0e14] py-12 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00e4f2]/10 border border-[#00e4f2]/25 text-[11px] font-bold text-[#00e4f2] uppercase tracking-widest mb-3">
            <Activity className="w-3.5 h-3.5" />
            {t('proofTitle')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {language === 'kh' ? 'តម្លាភាពមូលនិធិបម្រុង & សមតុល្យ Escrow ១០០%' : '100% Cryptographic Solvency & Escrow Transparency'}
          </h1>
          <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
            {t('proofSubtitle')}
          </p>
        </div>

        {/* 3 Metric Solvency Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#151a23] p-6 rounded-2xl border border-emerald-500/30 shadow-xl">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              {t('proofSolvency')}
            </span>
            <div className="text-3xl font-black text-emerald-400 font-mono mb-1">118.4%</div>
            <span className="text-[11px] text-emerald-300">
              ✓ {language === 'kh' ? 'មានមូលនិធិបម្រុងលើសពី ១០០%' : 'Fully over-collateralized'}
            </span>
          </div>

          <div className="bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] shadow-xl">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              {t('proofTreasury')}
            </span>
            <div className="text-3xl font-black text-[#f2ca50] font-mono mb-1">$2,450,000</div>
            <span className="text-[11px] text-neutral-400">
              Bakong USD + Multi-sig Reserve
            </span>
          </div>

          <div className="bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] shadow-xl">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              {t('slaBonds')}
            </span>
            <div className="text-3xl font-black text-[#00e4f2] font-mono mb-1">$480,000</div>
            <span className="text-[11px] text-neutral-400">
              {language === 'kh' ? 'ប្រាក់តម្កល់ធានាសុវត្ថិភាពអ្នកលក់' : 'Locked against recall violations'}
            </span>
          </div>
        </div>

        {/* Multi-Sig Custody Matrix */}
        <div className="bg-[#151a23] rounded-2xl border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-xl mb-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#f2ca50]" />
            {language === 'kh' ? 'ហេដ្ឋារចនាសម្ព័ន្ធ Dual-Custody Vault' : 'Dual-Custody Vault Infrastructure'}
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0b0e14] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  Bakong EMVCo Payment Clearing Vault
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {language === 'kh' ? 'ប្រព័ន្ធទូទាត់បាគង ធនាគារជាតិនៃកម្ពុជា (NBC) • ទូទាត់ភ្លាមៗ' : 'National Bank of Cambodia (NBC) clearing integration • Real-time settlement'}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase">
                Audited Live
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0b0e14] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  AES-256-GCM Zero-Knowledge Key Isolation
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {language === 'kh' ? 'គ្មានការរក្សាទុកលេខសម្ងាត់ចំហរក្នុង Database • ដោះសោផ្ទាល់លើឧបករណ៍អ្នកទិញ' : 'Zero plaintext credentials stored in databases • Client ephemeral decryption'}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#00e4f2]/15 text-[#00e4f2] text-[10px] font-bold uppercase">
                Zero-Knowledge Proof
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0b0e14] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  Distributed Redlock Concurrency Engine
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {language === 'kh' ? 'ក្បួនដោះស្រាយ Redis Redlock ចាក់សោការកក់ទុក ១៥ នាទី ការពារការទិញជាន់គ្នា' : 'Redis Redlock algorithm guarantees zero double-spend race conditions'}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#ffe088]/15 text-[#f2ca50] text-[10px] font-bold uppercase">
                15-Min Hold Lock
              </span>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] font-bold text-xs uppercase tracking-widest shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
          >
            <span>{t('ctaExplore')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
