'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Zap,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  User,
  Heart,
  Share2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { GameAccount } from '@/types';

export default function AccountDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [account, setAccount] = useState<GameAccount | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedWarranty, setSelectedWarranty] = useState<string>('7_days');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAccount() {
      if (!id) return;
      try {
        const data = await api.accounts.getById(id);
        setAccount(data);
        const cover =
          data.images?.find((img) => img.isCover)?.imageUrl ||
          data.images?.[0]?.imageUrl ||
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
        setSelectedImage(cover);
      } catch (err: any) {
        setError(err.message || 'Account not found');
      } finally {
        setIsLoading(false);
      }
    }
    loadAccount();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#f2ca50] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-400 font-mono">
          {language === 'kh' ? 'កំពុងទាញយកព័ត៌មានគណនី...' : `Loading vaulted asset #${id}...`}
        </p>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-4 text-center">
        <Shield className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-white">
          {language === 'kh' ? 'មិនមានគណនីនេះទេ' : 'Listing Unavailable'}
        </h2>
        <p className="text-xs text-neutral-400 mt-1 max-w-sm">
          {error || (language === 'kh' ? 'គណនីនេះប្រហែលជាត្រូវបានទិញរួចរាល់ហើយ។' : 'This listing does not exist or has already been purchased.')}
        </p>
        <Link
          href="/catalog"
          className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#f2ca50] text-[#0b0e14]"
        >
          {t('pdpBack')}
        </Link>
      </div>
    );
  }

  const warrantyOptions = [
    {
      id: 'none',
      label: language === 'kh' ? 'ការធានាស្តង់ដារ ២៤ ម៉ោង' : 'Basic SLA Inspection',
      price: 0,
      desc: language === 'kh' ? 'រួមបញ្ចូលការត្រួតពិនិត្យគណនីក្នុងរយៈពេល ២៤ ម៉ោង' : 'Standard 24-hour handover inspection',
    },
    {
      id: '7_days',
      label: language === 'kh' ? 'ធានារ៉ាប់រង ៧ ថ្ងៃ' : '7-Day Shield',
      price: 9.99,
      desc: language === 'kh' ? 'សងប្រាក់វិញ ១០០% ប្រសិនបើមានបញ្ហាក្នុង ៧ ថ្ងៃ' : 'Full recall reimbursement for 7 days',
    },
    {
      id: '30_days',
      label: language === 'kh' ? 'ធានារ៉ាប់រង ៣០ ថ្ងៃ' : '30-Day Elite Shield',
      price: 24.99,
      desc: language === 'kh' ? 'ការសម្របសម្រួលអាទិភាពខ្ពស់ និងសងប្រាក់វិញ ១០០%' : 'Priority mediation + 100% money back',
    },
    {
      id: 'lifetime',
      label: language === 'kh' ? 'ធានារ៉ាប់រងពេញមួយជីវិត' : 'Lifetime Anti-Recall Bond',
      price: 59.99,
      desc: language === 'kh' ? 'ការការពារអចិន្ត្រៃយ៍ពីមូលនិធិបម្រុង $1,000,000' : 'Permanent platform insurance bond',
    },
  ];

  const selectedWarrantyPrice = warrantyOptions.find((w) => w.id === selectedWarranty)?.price || 0;
  const totalPrice = (Number(account.price) + selectedWarrantyPrice).toFixed(2);

  const handleProceedToCheckout = () => {
    router.push(`/checkout/${account.id}?warranty=${selectedWarranty}`);
  };

  return (
    <div className={`min-h-screen bg-[#0b0e14] py-8 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
          <Link href="/catalog" className="hover:text-white transition-colors">
            {t('navCatalog')}
          </Link>
          <span>/</span>
          <span className="text-neutral-300">{account.game?.title}</span>
          <span>/</span>
          <span className="text-[#f2ca50] font-semibold truncate max-w-xs">{account.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (7 cols): Gallery & Account Verification Specs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Stage Viewport */}
            <div className="relative w-full h-[360px] sm:h-[460px] bg-[#151a23] rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl group">
              <img
                src={selectedImage}
                alt={account.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14]/80 via-transparent to-transparent pointer-events-none" />

              {/* Status Floating Pill */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#0b0e14]/90 text-[#f2ca50] border border-[#d4af37]/30 shadow-lg">
                  {account.game?.title}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#00e4f2]/20 text-[#00e4f2] border border-[#00e4f2]/30 backdrop-blur-md">
                  {account.tierRank}
                </span>
              </div>

              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2.5 rounded-xl bg-[#0b0e14]/80 hover:bg-[#0b0e14] text-neutral-300 hover:text-[#f2ca50] border border-white/[0.08] backdrop-blur-md transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Image Specs */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-neutral-200">
                <div className="flex items-center gap-2 bg-[#0b0e14]/80 px-3 py-1.5 rounded-lg border border-white/[0.08] backdrop-blur-md">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">{t('vaultDecryptedTitle')}</span>
                </div>
                <div className="bg-[#0b0e14]/80 px-3 py-1.5 rounded-lg border border-white/[0.08] font-mono text-[11px] text-neutral-300">
                  {account.serverRegion}
                </div>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {account.images && account.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {account.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.imageUrl)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img.imageUrl
                        ? 'border-[#f2ca50] shadow-[0_0_15px_rgba(242,202,80,0.3)] scale-105'
                        : 'border-white/[0.08] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Account Inventory & Description */}
            <div className="bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f2ca50]" />
                {language === 'kh' ? 'ព័ត៌មានលម្អិត & បញ្ជី Skins ក្នុងគណនី' : 'Account Details & Inventory'}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                {account.description || (language === 'kh' ? 'គណនីនេះត្រូវបានត្រួតពិនិត្យ និងផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិតាមស្តង់ដារសុវត្ថិភាព។' : 'Full account credentials, skins, and stats verified by platform automated audit.')}
              </p>
            </div>

            {/* Account Binds Verification Matrix */}
            <div className="bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00e4f2]" />
                {t('pdpAccountBindsHealth')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {account.binds?.length ? (
                  account.binds.map((bind) => (
                    <div
                      key={bind.id}
                      className="p-3 rounded-xl bg-[#0b0e14] border border-white/[0.06] flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-neutral-300 uppercase">
                        {bind.provider}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          bind.bindType === 'clean'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : bind.bindType === 'changeable'
                            ? 'bg-[#00e4f2]/15 text-[#00e4f2] border border-[#00e4f2]/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {bind.bindType}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-[#0b0e14] border border-white/[0.06] flex items-center justify-between col-span-2">
                    <span className="text-xs text-neutral-400">{t('pdpOriginalMail')}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {t('cleanFirstMail')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Checkout Box & Warranty Selector */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#151a23] p-6 rounded-2xl border border-[#d4af37]/30 shadow-2xl space-y-6 sticky top-24">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                  VAULT ASSET #{account.id.substring(0, 8)}
                </span>
                <h1 className="text-2xl font-black text-white leading-tight">{account.title}</h1>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline justify-between p-4 rounded-xl bg-[#0b0e14] border border-white/[0.08]">
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider block">
                    {language === 'kh' ? 'តម្លៃទូទាត់សរុប' : 'Total Checkout'}
                  </span>
                  <span className="text-3xl font-black text-[#f2ca50]">${totalPrice}</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <Zap className="w-3.5 h-3.5" />
                    {t('instantDelivery')}
                  </span>
                  <span className="text-[10px] text-neutral-500 block">Bakong KHQR / Wallet</span>
                </div>
              </div>

              {/* Warranty Shield Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center justify-between">
                  <span>{t('pdpSelectWarranty')}</span>
                  <span className="text-[10px] text-[#00e4f2]">
                    {language === 'kh' ? 'ណែនាំ' : 'Recommended'}
                  </span>
                </label>
                <div className="space-y-2">
                  {warrantyOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedWarranty(opt.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedWarranty === opt.id
                          ? 'bg-[#1d222e] border-[#f2ca50] shadow-[0_0_15px_rgba(242,202,80,0.15)]'
                          : 'bg-[#0b0e14] border-white/[0.06] hover:border-white/[0.15]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{opt.label}</span>
                          {opt.price === 0 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-bold">
                              {language === 'kh' ? 'ឥតគិតថ្លៃ' : 'Included'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{opt.desc}</p>
                      </div>
                      <span className="text-xs font-bold text-[#f2ca50]">
                        {opt.price === 0 ? '+$0' : `+$${opt.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 15-Minute Concurrency Reservation Notice */}
              <div className="p-3 rounded-xl bg-[#00e4f2]/5 border border-[#00e4f2]/20 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#00e4f2] shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {language === 'kh' ? (
                    <>
                      ការចុចទិញនឹងចាក់សោគណនីនេះ <strong className="text-white">១៥ នាទី</strong> តាមរយៈ Redis Redlock។ គ្មានអ្នកទិញណាផ្សេងអាចទិញបានឡើយក្នុងអំឡុងពេលនេះ។
                    </>
                  ) : (
                    <>
                      Clicking purchase holds this account for <strong className="text-white">15 minutes</strong> via Redis Redlock. No other buyer can take it while you complete payment.
                    </>
                  )}
                </p>
              </div>

              {/* Instant Purchase Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <span>{t('pdpProceedCheckout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Seller Verification Card */}
              <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#151a23] border border-white/[0.08] flex items-center justify-center">
                    <User className="w-4 h-4 text-[#f2ca50]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {account.seller?.username || 'Verified Sovereign Seller'}
                    </span>
                    <span className="text-[10px] text-emerald-400 block">
                      ✓ {t('slaBonds')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#f2ca50] block">100% Score</span>
                  <span className="text-[10px] text-neutral-400 block">0 Disputes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
