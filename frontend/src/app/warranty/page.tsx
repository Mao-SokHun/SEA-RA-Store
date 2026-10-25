'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Clock,
  ArrowRight,
  FileText,
  DollarSign,
  Building2,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';

export default function WarrantyClaimPortalPage() {
  const { t, language } = useLanguage();

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [incidentReason, setIncidentReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [emergencyLocked, setEmergencyLocked] = useState(false);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setClaimModalOpen(false);
      setClaimSubmitted(false);
      setOrderNumber('');
      setIncidentReason('');
    }, 2500);
  };

  const handleEmergencyLockout = () => {
    const confirmLock = confirm(
      language === 'kh'
        ? 'ការព្រមានចាក់សោគណនីបន្ទាន់:\n\nប្រព័ន្ធនឹងបង្កកប្រាក់តម្កល់របស់អ្នកលក់ភ្លាមៗ និងបើកការត្រួតពិនិត្យអាទិភាពក្នុងរយៈពេល ៤៥ នាទី។ តើអ្នកចង់បន្តទេ?'
        : 'EMERGENCY LOCKOUT WARNING:\n\nThis will immediately freeze seller collateral bonds and initiate 45-minute priority claim review. Proceed?'
    );
    if (confirmLock) {
      setEmergencyLocked(true);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0b0e14] py-10 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Telemetry Header Banner */}
        <section className="relative w-full rounded-2xl bg-[#151a23] p-6 sm:p-8 border border-white/[0.08] shadow-2xl overflow-hidden mb-10">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f2ca50] to-transparent opacity-80" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-widest uppercase">
                <span className="text-[#00e4f2]">TERMINAL</span>
                <span className="text-neutral-500">/</span>
                <span className="text-neutral-300">GUARANTEE & INDEMNITY</span>
                <span className="text-neutral-500">/</span>
                <span className="text-[#f2ca50] font-bold">RECALL WARRANTY DESK</span>
                <span className="px-2 py-0.5 rounded bg-[#00e4f2]/10 text-[#00e4f2] text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e4f2] animate-ping" />
                  BAKONG AUDITED
                </span>
              </div>

              <h1 className="text-3xl font-black text-white tracking-tight">
                {t('warrantyHeroTitle')}
              </h1>
              <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
                {t('warrantyHeroDesc')}
              </p>

              {/* Reserve Pool Chips */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#f2ca50]" />
                  <span>
                    {language === 'kh' ? 'មូលនិធិបម្រុង:' : 'Reserve Pool:'} <strong className="text-white">$1,000,000.00 USD</strong>
                  </span>
                </div>
                <span className="text-neutral-600">•</span>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#00e4f2]" />
                  <span>
                    {language === 'kh' ? 'គោលការណ៍សកម្ម:' : 'Active Policies:'} <strong className="text-[#00e4f2]">48 Policies</strong>
                  </span>
                </div>
                <span className="text-neutral-600">•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    {language === 'kh' ? 'អត្រាគ្មានការលួចយកវិញ:' : 'Zero-Recall Ratio:'} <strong className="text-emerald-400">99.98%</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={handleEmergencyLockout}
                className="px-5 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>{emergencyLocked ? (language === 'kh' ? 'បានចាក់សោបន្ទាន់' : 'LOCKOUT ENGAGED') : t('emergencyLockoutBtn')}</span>
              </button>
              <button
                onClick={() => setClaimModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>{t('fileClaimBtn')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3 Warranty Tiers Showcase */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#f2ca50]" />
            {language === 'kh' ? 'កញ្ចប់ធានារ៉ាប់រងគណនី' : 'Underwritten Protection Packages'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Package 1 */}
            <div className="bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  STANDARD SLA
                </span>
                <h3 className="text-lg font-bold text-white mt-2">
                  {language === 'kh' ? 'ធានារ៉ាប់រង ៧ ថ្ងៃ' : '7-Day Recall Shield'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {language === 'kh'
                    ? 'ស័ក្តិសមសម្រាប់គណនីទូទៅ។ ធានាសងប្រាក់វិញ ១០០% ប្រសិនបើមានបញ្ហាផ្លាស់ប្តូរលេខសម្ងាត់ក្នុងសប្តាហ៍ដំបូង។'
                    : 'Ideal for casual and mid-tier accounts. Covers first-week credential change attempts or email recovery anomalies.'}
                </p>
                <div className="text-2xl font-black text-[#f2ca50] mt-4 font-mono">$9.99</div>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300 border-t border-white/[0.06] pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'kh' ? 'សងប្រាក់វិញ ១០០% ក្នុងរយៈពេល ៧ ថ្ងៃ' : '100% money back within 7 days'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'kh' ? 'ដោះស្រាយវិវាទក្នុងរយៈពេល < ៤៥ នាទី' : '<45 min automated claim review'}</span>
                </li>
              </ul>
            </div>

            {/* Package 2 */}
            <div className="bg-[#151a23] p-6 rounded-2xl border border-[#00e4f2]/40 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#00e4f2] text-[#0b0e14] text-[9px] font-bold uppercase px-3 py-0.5 rounded-bl-lg">
                {language === 'kh' ? 'ពេញនិយមបំផុត' : 'MOST POPULAR'}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#00e4f2]/20 text-[#00e4f2]">
                  PRO TIER
                </span>
                <h3 className="text-lg font-bold text-white mt-2">
                  {language === 'kh' ? 'ធានារ៉ាប់រង ៣០ ថ្ងៃ' : '30-Day Elite Insurance'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {language === 'kh'
                    ? 'ការការពារពេញមួយខែសម្រាប់គណនីប្រកួតប្រជែង Rank ខ្ពស់ ជាមួយក្រុមការងារសម្របសម្រួលផ្ទាល់។'
                    : 'Full month coverage for competitive tournament and high-value ranking accounts with dedicated concierge arbitration.'}
                </p>
                <div className="text-2xl font-black text-[#00e4f2] mt-4 font-mono">$24.99</div>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300 border-t border-white/[0.06] pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'kh' ? 'ការធានារ៉ាប់រងពេញលេញ ៣០ ថ្ងៃ' : 'Full 30-day recall guarantee'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'kh' ? 'បណ្តាញដោះស្រាយវិវាទអាទិភាពខ្ពស់' : 'Priority dispute mediation channel'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'kh' ? 'ជំនួយការផ្លាស់ប្តូរអ៊ីមែល OGO' : 'Includes email OGO change assistance'}</span>
                </li>
              </ul>
            </div>

            {/* Package 3 */}
            <div className="bg-[#151a23] p-6 rounded-2xl border border-[#d4af37]/40 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f2ca50]">
                  ULTIMATE WHALE
                </span>
                <h3 className="text-lg font-bold text-white mt-2">
                  {language === 'kh' ? 'ធានារ៉ាប់រងអចិន្ត្រៃយ៍មួយជីវិត' : 'Lifetime Sovereign Bond'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {language === 'kh'
                    ? 'ការការពារជាអចិន្ត្រៃយ៍សម្រាប់គណនីប្រមូលកម្រ ($1,000+)។ ធានាដោយប្រាក់តម្កល់របស់អ្នកលក់។'
                    : 'Permanent coverage for collector accounts ($1,000+). Underwritten directly against seller security deposit collateral.'}
                </p>
                <div className="text-2xl font-black text-[#f2ca50] mt-4 font-mono">$59.99</div>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300 border-t border-white/[0.06] pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'kh' ? 'ការការពារអចិន្ត្រៃយ៍គ្មានថ្ងៃផុតកំណត់' : 'Indefinite permanent protection'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'kh' ? 'បង្កកប្រាក់តម្កល់អ្នកលក់ $2,000 ភ្លាមៗ' : '$2,000 seller bond frozen upon dispute'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'kh' ? 'ប្តូរគណនីថ្មី ឬសងប្រាក់វិញ ១០០%' : 'Instant replacement or full refund'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Claim Submission Modal */}
        {claimModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#151a23] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 text-[#f2ca50]">
                  <Shield className="w-5 h-5" />
                  <h3 className="font-bold text-white text-base">
                    {t('fileClaimBtn')}
                  </h3>
                </div>
                <button
                  onClick={() => setClaimModalOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {claimSubmitted ? (
                <div className="p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">
                    {language === 'kh' ? 'ពាក្យទាមទារកំពុងត្រូវបានត្រួតពិនិត្យ!' : 'Claim Under Review!'}
                  </h4>
                  <p className="text-xs text-neutral-300">
                    {language === 'kh'
                      ? 'ក្រុមការងារ Concierge កំពុងត្រួតពិនិត្យភស្តុតាង និងប្រាក់តម្កល់របស់អ្នកលក់។'
                      : 'SLA Priority #CLM-892 active. Concierge is reviewing evidence against seller collateral bond.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleClaimSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {t('orderNumber')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ORD-179275"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {language === 'kh' ? 'មូលហេតុនៃការទាមទារ' : 'Reason for Claim'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={language === 'kh' ? 'រៀបរាប់ពីបញ្ហា (ឧ. លេខសម្ងាត់ត្រូវបានប្តូរ, ម្ចាស់ដើមទាញគណនីយកវិញ)...' : 'Describe what occurred (e.g. password changed, original owner initiated recovery)...'}
                      value={incidentReason}
                      onChange={(e) => setIncidentReason(e.target.value)}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {language === 'kh' ? 'តំណភ្ជាប់រូបថតភស្តុតាង (ស្រេចចិត្ត)' : 'Evidence Screenshot Link (Optional)'}
                    </label>
                    <input
                      type="url"
                      placeholder="https://imgur.com/..."
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-md hover:shadow-[0_0_15px_rgba(212,175,55,0.35)] transition-all"
                  >
                    {language === 'kh' ? 'បញ្ជូនពាក្យទាមទារសំណង' : 'Submit Claim for Payout'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
