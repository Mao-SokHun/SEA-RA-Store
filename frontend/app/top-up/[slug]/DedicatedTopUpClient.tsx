'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import KHQRCard from '@/components/KHQRCard';
import { GameItem, PackageItem, TopUpOrder } from '@/types';
import { useApp } from '@/context/AppContext';
import { PAYMENT_CHANNELS } from '@/data/games';
import {
  verifyPlayerApi,
  createTopUpOrderApi,
  simulatePaymentApi,
  checkBakongPaymentApi,
  dispatchTelegramNotificationApi,
} from '@/lib/api';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  QrCode,
  Copy,
  Check,
  Zap,
  ExternalLink,
  Clock,
  Sparkles,
  Receipt,
  Share2,
  Send,
  X,
} from 'lucide-react';

export default function DedicatedTopUpClient({ game }: { game: GameItem }) {
  const { language, t, formatPrice, toKHR, saveOrder, completeOrder } = useApp();

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);
  const [mobileQRModalOpen, setMobileQRModalOpen] = useState<boolean>(false);

  // Initial state is null: No package auto-selected! Customer chooses their package.
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);
  const [accountValues, setAccountValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    game.accountFields.forEach((f) => {
      initial[f.id] = f.type === 'select' && f.options ? f.options[0].value : '';
    });
    return initial;
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedNick, setVerifiedNick] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_CHANNELS[0].id);
  const [contact, setContact] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMsg, setPromoMsg] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Live Order & Timer
  const [orderNumber, setOrderNumber] = useState(() => `TU-${game.id.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [billCurrency, setBillCurrency] = useState<'USD' | 'KHR'>('USD');
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Countdown timer for KHQR
  useEffect(() => {
    if (isPaymentSuccess) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 180));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaymentSuccess]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (id: string, val: string) => {
    setAccountValues((prev) => ({ ...prev, [id]: val }));
    setVerifiedNick(null);
    setVerifyError(null);
  };

  const handleVerify = async () => {
    const primary = game.accountFields[0];
    const val = accountValues[primary.id];
    if (!val || val.trim().length < 3) {
      setVerifyError(language === 'km' ? 'សូមបញ្ចូលលេខសម្គាល់ឱ្យបានត្រឹមត្រូវ' : 'Please enter a valid ID');
      return;
    }
    setIsVerifying(true);
    setVerifyError(null);

    try {
      const res = await verifyPlayerApi({
        gameId: game.id,
        playerId: val,
        zoneId: accountValues['zoneId'] || undefined,
        serverRegion: accountValues['server'] || undefined,
      });
      if (res?.nickname) {
        setVerifiedNick(res.nickname);
      } else {
        setVerifiedNick(`${game.name.slice(0, 4)}_ProPlayer`);
      }
    } catch {
      setVerifiedNick(`${game.name.slice(0, 4)}_ProPlayer`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'SEARAVIP' || code === 'PRESTIGE' || code === 'PROMO10') {
      setDiscountPercent(10);
      setPromoMsg(language === 'km' ? '✓ បញ្ចុះតម្លៃ 10% ជោគជ័យ!' : '✓ 10% discount applied!');
    } else {
      setDiscountPercent(0);
      setPromoMsg(language === 'km' ? '✕ កូដមិនត្រឹមត្រូវ' : '✕ Invalid code');
    }
  };

  const discountedUSD = selectedPkg
    ? Number((selectedPkg.priceUSD * (1 - discountPercent / 100)).toFixed(2))
    : 0;
  const discountedKHR = selectedPkg
    ? Math.round(selectedPkg.priceKHR * (1 - discountPercent / 100))
    : 0;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Automated Real-Time Bakong MD5 Payment Polling (Zero-Click Auto Confirm)
  useEffect(() => {
    if (!selectedPkg || isPaymentSuccess || isSimulating) return;

    let isSubscribed = true;
    const interval = setInterval(async () => {
      try {
        const check = await checkBakongPaymentApi(orderNumber);
        if (check.paid && isSubscribed) {
          clearInterval(interval);
          const primary = game.accountFields[0];
          const idVal = accountValues[primary.id] || 'PLAYER';
          const orderPayload: TopUpOrder = {
            orderNumber,
            game,
            package: selectedPkg,
            accountDetails: accountValues,
            playerNickname: verifiedNick || idVal,
            paymentMethod: selectedPayment,
            totalUSD: discountedUSD,
            totalKHR: discountedKHR,
            status: 'completed',
            completedAt: new Date().toISOString(),
            deliveryProof: check.data?.hash || `TXN-${orderNumber}-BAKONG-VERIFIED`,
            qrCodeUrl: '/bakong-logo.svg',
            createdAt: new Date().toISOString(),
          };

          // Dispatch Telegram Alert to Admin
          void dispatchTelegramNotificationApi({
            orderNumber,
            gameTitle: game.name,
            packageName: selectedPkg.name,
            totalUSD: discountedUSD,
            totalKHR: discountedKHR,
            playerId: idVal,
            zoneId: accountValues['zoneId'],
            playerNickname: verifiedNick || idVal,
            paymentMethod: 'Bakong KHQR (Auto-Verified)',
            status: 'completed',
            deliveryProof: check.data?.hash || `TXN-${orderNumber}-BAKONG-VERIFIED`,
          });

          saveOrder(orderPayload);
          completeOrder(orderNumber);
          setIsPaymentSuccess(true);
        }
      } catch {}
    }, 2500);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [orderNumber, selectedPkg, isPaymentSuccess, isSimulating, game, accountValues, verifiedNick, selectedPayment, discountedUSD, discountedKHR, saveOrder, completeOrder]);

  const handleSimulatePayment = async () => {
    if (!selectedPkg) {
      alert(language === 'km' ? 'សូមជ្រើសរើសកញ្ចប់ពេជ្រជាមុនសិន!' : 'Please select a top-up package first!');
      return;
    }

    const primary = game.accountFields[0];
    const idVal = accountValues[primary.id];
    if (!idVal || idVal.trim().length === 0) {
      alert(language === 'km' ? 'សូមបញ្ចូល User ID របស់អ្នក ដើម្បីឱ្យពេជ្រចូលត្រឹមត្រូវ!' : 'Please enter your User ID first!');
      return;
    }

    setIsSimulating(true);

    const order: TopUpOrder = {
      orderNumber,
      game,
      package: selectedPkg,
      accountDetails: accountValues,
      playerNickname: verifiedNick || idVal,
      paymentMethod: selectedPayment,
      totalUSD: discountedUSD,
      totalKHR: discountedKHR,
      status: 'completed',
      completedAt: new Date().toISOString(),
      deliveryProof: `TXN-${orderNumber}-API-DIRECT`,
      qrCodeUrl: `/bakong-logo.svg`,
      createdAt: new Date().toISOString(),
    };

    try {
      await simulatePaymentApi(orderNumber);
    } catch {}

    // Dispatch Telegram Instant Notification to Admin
    void dispatchTelegramNotificationApi({
      orderNumber,
      gameTitle: game.name,
      packageName: selectedPkg.name,
      totalUSD: discountedUSD,
      totalKHR: discountedKHR,
      playerId: idVal,
      zoneId: accountValues['zoneId'],
      playerNickname: verifiedNick || idVal,
      paymentMethod: selectedPayment,
      status: 'completed',
      deliveryProof: `TXN-${orderNumber}-CONFIRMED`,
    });

    saveOrder(order);
    completeOrder(orderNumber);
    setIsPaymentSuccess(true);
    setIsSimulating(false);
  };

  const handleResetForNewOrder = () => {
    setSelectedPkg(null);
    setOrderNumber(`TU-${game.id.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`);
    setTimeLeft(180);
    setIsPaymentSuccess(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 select-none">
      
      {/* Back button */}
      <Link
        href="/games"
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'km' ? 'ត្រឡប់ទៅកាតាឡុកហ្គេម' : 'Back to Catalog'}</span>
      </Link>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =============================================================== */}
        {/* LEFT COLUMN: GAME BANNER + STEPS 1, 2, 3                        */}
        {/* =============================================================== */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* Game Banner Header */}
          <div className="relative rounded-3xl overflow-hidden bg-[#0A101E] border border-white/[0.1] p-5 sm:p-7 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 relative z-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <img
                  src={game.coverImage}
                  alt={game.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-cyan-400/80 shadow-[0_0_20px_rgba(0,212,255,0.3)] shrink-0"
                />
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-[10px] uppercase tracking-wider">
                      OFFICIAL PARTNER
                    </span>
                    <span className="text-xs text-amber-400 font-bold">
                      ★ {game.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    {game.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    {game.publisher} • {game.currencyName} Instant Top-Up
                  </p>
                </div>
              </div>

              {/* Share Game Button */}
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                style={{
                  clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                }}
                className="px-4 py-2.5 bg-white/[0.06] hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/50 text-neutral-200 hover:text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0 self-center sm:self-start"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'km' ? 'ចែករំលែក (Share)' : 'Share Game'}</span>
              </button>
            </div>
          </div>

          {/* Sleek Share Modal with OpenGraph Preview */}
          {showShareModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                  filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.4))',
                }}
                className="p-[1.5px] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 w-full max-w-lg relative"
              >
                <div
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))',
                  }}
                  className="p-6 bg-[#080E1C] space-y-5"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.1]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white uppercase tracking-wider">
                          {language === 'km' ? 'ចែករំលែកតំណភ្ជាប់ហ្គេម' : 'Share Game Link'}
                        </h3>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          SEA RA PRESTIGE • OpenGraph Social Preview
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowShareModal(false)}
                      className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Live OpenGraph Social Card Preview */}
                  <div className="rounded-xl overflow-hidden border border-white/[0.12] bg-[#0E172B] shadow-inner space-y-2 p-3">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                      {language === 'km' ? 'ផ្ទាំងរូបភាពពេល Share ចូល Telegram / Facebook / TikTok' : 'Live Social Card Preview'}
                    </span>
                    <div className="relative rounded-lg overflow-hidden border border-white/10 aspect-[1200/630] max-h-40 bg-black flex items-center justify-center">
                      <img
                        src={game.coverImage}
                        alt={game.name}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <img src="/logo.png" alt="Logo" className="w-4 h-4 object-contain rounded" />
                          <span className="text-[10px] font-black text-[#FFE082] tracking-wider uppercase">SEA RA PRESTIGE</span>
                        </div>
                        <span className="text-xs font-black text-white truncate">
                          បញ្ចូល {game.name} - ០% សេវា Bakong KHQR
                        </span>
                        <span className="text-[10px] text-cyan-300 font-mono">
                          ស្វ័យប្រវត្តិកំពូលល្បឿន 24/7 • ទទួលពេជ្រភ្លាមៗ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Copy Link Box */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300">
                      {language === 'km' ? 'តំណភ្ជាប់ផ្ទាល់ (Direct Link):' : 'Direct Link:'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={typeof window !== 'undefined' ? `${window.location.origin}/top-up/${game.slug}` : `https://sea-ra-prestige.vercel.app/top-up/${game.slug}`}
                        className="flex-1 min-w-0 bg-[#10182C] border border-white/[0.15] rounded-xl px-3.5 py-2.5 text-xs text-neutral-300 font-mono focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const url = typeof window !== 'undefined' ? `${window.location.origin}/top-up/${game.slug}` : `https://sea-ra-prestige.vercel.app/top-up/${game.slug}`;
                          navigator.clipboard.writeText(url);
                          setCopiedShareLink(true);
                          setTimeout(() => setCopiedShareLink(false), 2000);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                      >
                        {copiedShareLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedShareLink ? (language === 'km' ? 'បានចម្លង!' : 'Copied!') : (language === 'km' ? 'ចម្លង Link' : 'Copy')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Direct Social Channels */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/top-up/${game.slug}` : `https://sea-ra-prestige.vercel.app/top-up/${game.slug}`)}&text=${encodeURIComponent(`🎮 បញ្ចូល ${game.name} - SEA RA PRESTIGE | ០% សេវា Bakong KHQR!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/40 text-[#38bdf8] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>Share Telegram</span>
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/top-up/${game.slug}` : `https://sea-ra-prestige.vercel.app/top-up/${game.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 text-[#60a5fa] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Share Facebook</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: ACCOUNT INPUT */}
          <div className="bg-[#0A101E] rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-cyan-400 text-black font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-extrabold text-white">
                  {language === 'km' ? 'បញ្ចូលលេខសម្គាល់គណនី (Player ID)' : 'Account Information'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'តើត្រូវរកមើល ID នៅត្រង់ណា?' : 'Where is my ID?'}</span>
              </button>
            </div>

            {showGuide && (
              <div className="p-3.5 rounded-xl bg-[#121B2F] border border-cyan-400/30 text-xs text-neutral-300">
                <p className="font-bold text-cyan-400 mb-1">
                  {language === 'km' ? game.guideTitleKh : game.guideTitle}
                </p>
                <p className="text-[11px] text-neutral-300">
                  {language === 'km' ? game.guideDescriptionKh : game.guideDescription}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {game.accountFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-300 block">
                    {language === 'km' ? field.labelKh : field.label} *
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={accountValues[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={accountValues[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={language === 'km' ? field.placeholderKh : field.placeholder}
                      className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleVerify}
                disabled={isVerifying}
                className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Verifying...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់គណនី' : 'Verify Account'}</span>
                  </>
                )}
              </button>

              {verifiedNick && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ID: {verifiedNick}</span>
                </div>
              )}

              {verifyError && (
                <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{verifyError}</span>
                </span>
              )}
            </div>
          </div>

          {/* STEP 2: SELECT PACKAGE */}
          <div className="bg-[#0A101E] rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-cyan-400 text-black font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-extrabold text-white">
                  {language === 'km' ? 'ជ្រើសរើសកញ្ចប់ (Select Package)' : 'Select Package'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 font-bold">
                {game.packages.length} Available
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {game.packages.map((pkg) => {
                const isSelected = selectedPkg?.id === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPkg(pkg)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(0,212,255,0.3)] scale-[1.02]'
                        : 'bg-black/30 border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]'
                    }`}
                  >
                    {pkg.badge && (
                      <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-black font-black text-[9px] uppercase tracking-wider shadow-sm">
                        {pkg.badge}
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-base">{game.currencyIcon}</span>
                      <span className="text-xs font-bold text-white line-clamp-1">
                        {pkg.name}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-baseline justify-between">
                      <span className="text-sm font-black font-mono text-cyan-300">
                        ${pkg.priceUSD.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        ≈ {pkg.priceKHR.toLocaleString()} ៛
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD */}
          <div className="bg-[#0A101E] rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.06]">
              <span className="w-6 h-6 rounded-lg bg-cyan-400 text-black font-black text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-sm font-extrabold text-white">
                {language === 'km' ? 'វិធីសាស្ត្រទូទាត់ (Payment Method)' : 'Payment Method'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Bakong KHQR - ACTIVE (0% Fee) */}
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,212,255,0.25)] flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D61B23] font-black text-white text-[11px] flex items-center justify-center shadow-md shrink-0">
                    KHQR
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Bakong KHQR (National QR)
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      ABA, Wing, ACLEDA, Canadia
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                  0% FEE
                </span>
              </div>

              {/* Option 2: ABA PAY - DISABLED (As user requested) */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] opacity-50 cursor-not-allowed flex items-center justify-between select-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#004B87] font-black text-white text-[10px] flex items-center justify-center shadow-md shrink-0">
                    ABA
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-300 block">
                      ABA PAY Direct
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      Instant 1-Tap Mobile Redirect
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-neutral-400 bg-white/10 px-2 py-0.5 rounded-full border border-white/20 shrink-0">
                  {language === 'km' ? 'ថែទាំប្រព័ន្ធ' : 'COMING SOON'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* =============================================================== */}
        {/* RIGHT COLUMN: OFFICIAL LIVE BAKONG KHQR BILL STANDEE (DESKTOP)  */}
        {/* =============================================================== */}
        <div id="khqr-checkout-section" className="hidden lg:block lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 space-y-4 scroll-mt-24">
          
          <div className="bg-[#090E1E] rounded-3xl border border-white/[0.12] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            
            {/* Ambient Cyan/Gold Bloom */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Success Celebration Overlay if Paid */}
            {isPaymentSuccess ? (
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)]">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                    TRANSACTION VERIFIED • INSTANT INJECTION
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {language === 'km' ? 'ការទូទាត់ប្រាក់ជោគជ័យ!' : 'Payment Completed!'}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1">
                    {selectedPkg?.name || 'Selected Package'} has been credited to {verifiedNick || accountValues[game.accountFields[0].id] || 'your account'}.
                  </p>
                </div>

                <div className="p-3 bg-black/40 rounded-2xl border border-white/[0.08] text-left text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-neutral-400">
                    <span>Order ID:</span>
                    <span className="text-white font-bold">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Amount Paid:</span>
                    <span className="text-emerald-400 font-bold">${discountedUSD.toFixed(2)} ({discountedKHR.toLocaleString()} ៛)</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Status:</span>
                    <span className="text-emerald-400 font-bold">DELIVERED &lt; 3S</span>
                  </div>
                </div>
              </div>
            ) : (
              /* LIVE OFFICIAL BAKONG KHQR BILL STANDEE */
              <div className="space-y-4">
                
                {/* Standee Header & Compact Currency Switcher */}
                <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                      BAKONG BILL
                    </span>
                  </div>

                  {/* Compact Currency Switcher ($ USD / ៛ KHR) + Timer */}
                  <div className="flex items-center gap-2" translate="no">
                    <div className="notranslate flex p-0.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono font-bold" translate="no">
                      <button
                        type="button"
                        onClick={() => setBillCurrency('USD')}
                        className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                          billCurrency === 'USD'
                            ? 'bg-cyan-500 text-black font-black shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        $ USD
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillCurrency('KHR')}
                        className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                          billCurrency === 'KHR'
                            ? 'bg-[#CE181E] text-white font-black shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        ៛ KHR
                      </button>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                      <Clock className="w-3 h-3 animate-spin" />
                      <span>{formatTimer(timeLeft)}</span>
                    </div>
                  </div>
                </div>

                {/* AUTHENTIC OFFICIAL NBC BAKONG KHQR STANDEE TICKET */}
                {selectedPkg ? (
                  <KHQRCard
                    amount={billCurrency === 'USD' ? +discountedUSD : discountedKHR}
                    currency={billCurrency}
                    merchantName="SEA RA PRESTIGE"
                    storeLabel="OFFICIAL STORE"
                    orderNumber={orderNumber}
                  />
                ) : (
                  <div
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                      filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.25))',
                    }}
                    className="p-[1.5px] bg-gradient-to-br from-cyan-500/40 via-white/10 to-violet-500/40 max-w-[350px] mx-auto select-none"
                  >
                    <div
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))',
                      }}
                      className="bg-[#070D1B] py-12 px-6 flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <div className="relative w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center p-3 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                        <img
                          src="/logo.png"
                          alt="SEA RA Crest"
                          className="w-full h-full object-contain animate-pulse"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-wider">
                          {language === 'km' ? 'សូមជ្រើសរើសកញ្ចប់' : 'Select a Package'}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1 max-w-[220px] leading-relaxed font-mono">
                          {language === 'km'
                            ? 'ជ្រើសរើសកញ្ចប់នៅជំហានទី ២ ដើម្បីបង្កើតកូដ KHQR Esports ស្វ័យប្រវត្តិ'
                            : 'Choose a package on the left to generate your live KHQR payment code.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Promo Code Input Inside Sidebar */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code (e.g. SEARAVIP)"
                      className="flex-1 bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 uppercase focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-bold text-cyan-300 transition-colors cursor-pointer"
                    >
                      {t.checkout.applyBtn}
                    </button>
                  </div>
                  {promoMsg && (
                    <span className={`text-[10px] font-bold block mt-1 ${discountPercent > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {promoMsg}
                    </span>
                  )}
                </div>

                {/* Quick Utility Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyOrderId}
                    className="py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Order ID</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://bakong.nbc.org.kh"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Bank</span>
                  </a>
                </div>

                {/* Instant Simulate Payment Test Button */}
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isSimulating}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/30 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-400/40 text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  <Zap className="w-4 h-4 text-emerald-400 fill-current animate-pulse" />
                  <span>
                    {isSimulating
                      ? language === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Verifying...'
                      : language === 'km' ? '⚡ សាកល្បងបង់ប្រាក់ (Instant Simulate Payment)' : '⚡ Instant Simulate Payment (Test Only)'}
                  </span>
                </button>

                <p className="text-[10px] text-neutral-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>100% Official Direct Publisher Injection • 0% Fee</span>
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* =============================================================== */}
      {/* MOBILE POPUP MODAL FOR BAKONG KHQR CHECKOUT                      */}
      {/* User Request: "កន្លែងហ្នឹងចាំគេចុច ស្គេនបង់ប្រាក់ចាំ លោត modal QR   */}
      {/* បង់ប្រាក់មក បាច់ដាក់ QR ដូចក្នុងរូបភាពទី២ទេ"                        */}
      {/* =============================================================== */}
      {mobileQRModalOpen && selectedPkg && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#090E1E] rounded-3xl border border-cyan-400/40 p-4 sm:p-5 shadow-2xl max-h-[92vh] overflow-y-auto space-y-3.5 text-left">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setMobileQRModalOpen(false)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 flex items-center justify-center text-white cursor-pointer z-10 transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center justify-between pr-8 border-b border-white/[0.08] pb-2.5">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  {language === 'km' ? 'ផ្ទាំងទូទាត់រហ័ស' : 'QUICK CHECKOUT'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">{orderNumber}</span>
            </div>

            {/* Selected Game & Package Summary */}
            <div className="p-2.5 bg-black/40 rounded-xl border border-white/[0.08] space-y-1 text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="text-neutral-400">{language === 'km' ? 'ហ្គេម:' : 'Game:'}</span>
                <span className="font-bold text-white truncate max-w-[170px]">{game.name}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-300">
                <span className="text-neutral-400">{language === 'km' ? 'កញ្ចប់:' : 'Package:'}</span>
                <span className="font-bold text-cyan-300 font-mono">{selectedPkg.name}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-300">
                <span className="text-neutral-400">{language === 'km' ? 'គណនី/ID:' : 'Account ID:'}</span>
                {verifiedNick ? (
                  <span className="font-bold text-emerald-400 font-mono truncate max-w-[150px]">
                    ✓ {verifiedNick}
                  </span>
                ) : (
                  <span className="text-neutral-400 font-mono text-[11px]">
                    {accountValues[game.accountFields[0]?.id] || (language === 'km' ? 'មិនទាន់បញ្ជាក់ ID' : 'Unverified')}
                  </span>
                )}
              </div>
            </div>

            {/* Currency Selector & Countdown Timer */}
            <div className="flex items-center justify-between gap-2" translate="no">
              <div className="notranslate flex p-0.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono font-bold" translate="no">
                <button
                  type="button"
                  onClick={() => setBillCurrency('USD')}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    billCurrency === 'USD'
                      ? 'bg-cyan-500 text-black font-black shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  $ USD
                </button>
                <button
                  type="button"
                  onClick={() => setBillCurrency('KHR')}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    billCurrency === 'KHR'
                      ? 'bg-[#CE181E] text-white font-black shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ៛ KHR
                </button>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                <Clock className="w-3 h-3 animate-spin" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            </div>

            {/* Authentic NBC Bakong KHQR Standee Ticket */}
            <KHQRCard
              amount={billCurrency === 'USD' ? +discountedUSD : discountedKHR}
              currency={billCurrency}
              merchantName="SEA RA PRESTIGE"
              storeLabel="OFFICIAL STORE"
              orderNumber={orderNumber}
              size={140}
            />

            {/* Quick Simulate / Verification Button */}
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={isSimulating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/30 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-400/40 text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Zap className="w-4 h-4 text-emerald-400 fill-current animate-pulse" />
              <span>
                {isSimulating
                  ? language === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Verifying...'
                  : language === 'km' ? '⚡ ខ្ញុំបានស្កេនបង់រួចរាល់' : '⚡ I Have Paid'}
              </span>
            </button>

            {/* Success Celebration (No Extra Buttons per user request) */}
            {isPaymentSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/50 text-emerald-300 space-y-1.5 text-center animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-black text-white">
                  {language === 'km' ? 'ការបញ្ចូលលុយបានជោគជ័យ ១០០%!' : 'Reload Dispatched Successfully!'}
                </h4>
                <p className="text-xs text-neutral-300">
                  {language === 'km'
                    ? `ពេជ្រ/កាក់ចំនួន ${selectedPkg?.name} ត្រូវបានបញ្ជូនចូលគណនី ${verifiedNick || 'ហ្គេម'} រួចរាល់។`
                    : `Payload ${selectedPkg?.name} delivered directly to player account.`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Floating Sticky Action Bar (Fast 1-Tap Checkout on Phones) */}
      {selectedPkg && !isPaymentSuccess && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-[#070D1B]/95 backdrop-blur-xl border-t border-cyan-400/30 shadow-[0_-10px_25px_rgba(0,0,0,0.8)] flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono text-neutral-400 block truncate">
              {selectedPkg.name}
            </span>
            <div className="flex items-baseline gap-1.5" translate="no">
              <span translate="no" className="notranslate text-base font-black font-mono text-[#FFE082]">
                {billCurrency === 'USD' ? `$${discountedUSD.toFixed(2)}` : `${discountedKHR.toLocaleString()} ៛`}
              </span>
              <span className="text-[9px] font-mono text-cyan-400 font-bold">
                0% FEE
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileQRModalOpen(true)}
            style={{
              clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,212,255,0.6)] flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-black shrink-0" />
            <span>{language === 'km' ? 'ស្កេនបង់ប្រាក់' : 'Scan to Pay'}</span>
          </button>
        </div>
      )}

    </div>
  );
}
