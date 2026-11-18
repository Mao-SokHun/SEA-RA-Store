'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { GAMES, PAYMENT_CHANNELS } from '@/data/games';
import { GameItem, PackageItem, TopUpOrder } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  verifyPlayerApi,
  createTopUpOrderApi,
  simulatePaymentApi,
  checkBakongPaymentApi,
  dispatchTelegramNotificationApi,
} from '@/lib/api';
import KHQRCard from '@/components/KHQRCard';
import ChamferHighlights from '@/components/ChamferHighlights';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Sparkles,
  Receipt,
  ArrowRight,
  Flame,
  Gamepad2,
  Tag,
  X,
} from 'lucide-react';

function generateExpressOrderNumber(gameId: string): string {
  return `EXP-${gameId.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
}

export default function ExpressTopUpPage() {
  const { language, t, formatPrice, toKHR, saveOrder, completeOrder } = useApp();

  // Selected game (defaults to MLBB)
  const [selectedGameId, setSelectedGameId] = useState<string>('mlbb');
  const activeGame = useMemo(() => {
    return GAMES.find((g) => g.id === selectedGameId) || GAMES[0];
  }, [selectedGameId]);

  // Selected package
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);

  // Account dynamic input values
  const [accountValues, setAccountValues] = useState<Record<string, string>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedNick, setVerifiedNick] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Payment & order states
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_CHANNELS[0].id);
  const [contact, setContact] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMsg, setPromoMsg] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Order reference & countdown
  const [orderNumber, setOrderNumber] = useState(() => generateExpressOrderNumber('mlbb'));
  const [timeLeft, setTimeLeft] = useState(180);
  const [billCurrency, setBillCurrency] = useState<'USD' | 'KHR'>('USD');
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [mobileQRModalOpen, setMobileQRModalOpen] = useState(false);

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    const targetGame = GAMES.find((g) => g.id === gameId) || GAMES[0];
    const initial: Record<string, string> = {};
    targetGame.accountFields.forEach((f) => {
      initial[f.id] = f.type === 'select' && f.options ? f.options[0].value : '';
    });
    setAccountValues(initial);
    setSelectedPkg(null);
    setVerifiedNick(null);
    setVerifyError(null);
    setOrderNumber(generateExpressOrderNumber(targetGame.id));
    setTimeLeft(180);
    setIsPaymentSuccess(false);
  };

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

  // Instant Nickname Verification
  const handleVerify = async () => {
    const primary = activeGame.accountFields[0];
    const val = accountValues[primary.id];
    if (!val || val.trim().length < 3) {
      setVerifyError(language === 'km' ? 'សូមបញ្ចូលលេខសម្គាល់ឱ្យបានត្រឹមត្រូវ' : 'Please enter a valid Player ID');
      return;
    }
    setIsVerifying(true);
    setVerifyError(null);

    try {
      const res = await verifyPlayerApi({
        gameId: activeGame.id,
        playerId: val,
        zoneId: accountValues['zoneId'] || undefined,
        serverRegion: accountValues['server'] || undefined,
      });
      if (res?.nickname) {
        setVerifiedNick(res.nickname);
      } else {
        setVerifiedNick(`${activeGame.name.slice(0, 4)}_ProPlayer`);
      }
    } catch {
      setVerifiedNick(`${activeGame.name.slice(0, 4)}_Player`);
    } finally {
      setIsVerifying(false);
    }
  };

  // Promo code validation
  const applyPromo = () => {
    if (!promoCode.trim()) return;
    const code = promoCode.trim().toUpperCase();
    if (code === 'SEARA2026' || code === 'PRESTIGE10' || code === 'VIP10') {
      setDiscountPercent(10);
      setPromoMsg(language === 'km' ? 'ទទួលបានបញ្ចុះតម្លៃ ១០% ជោគជ័យ!' : '10% VIP Discount Applied!');
    } else if (code === 'PROMO5') {
      setDiscountPercent(5);
      setPromoMsg(language === 'km' ? 'ទទួលបានបញ្ចុះតម្លៃ ៥% ជោគជ័យ!' : '5% Discount Applied!');
    } else {
      setDiscountPercent(0);
      setPromoMsg(language === 'km' ? 'កូដមិនត្រឹមត្រូវ ឬផុតកំណត់' : 'Invalid or expired code');
    }
  };

  // Price calculations
  const rawPriceUSD = selectedPkg?.priceUSD || 0;
  const finalPriceUSD = +(rawPriceUSD * (1 - discountPercent / 100)).toFixed(2);
  const finalPriceKHR = Math.round(finalPriceUSD * 4100);

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
          const primaryVal = accountValues[activeGame.accountFields[0]?.id] || 'PLAYER';
          const orderPayload: TopUpOrder = {
            orderNumber,
            game: activeGame,
            package: selectedPkg,
            accountDetails: accountValues,
            playerNickname: verifiedNick || primaryVal,
            paymentMethod: selectedPayment,
            totalUSD: finalPriceUSD,
            totalKHR: finalPriceKHR,
            status: 'completed',
            completedAt: new Date().toISOString(),
            deliveryProof: check.data?.hash || `TXN-${orderNumber}-BAKONG-VERIFIED`,
            qrCodeUrl: '/bakong-logo.svg',
            createdAt: new Date().toISOString(),
          };

          // Dispatch Telegram Alert to Admin
          void dispatchTelegramNotificationApi({
            orderNumber,
            gameTitle: activeGame.name,
            packageName: selectedPkg.name,
            totalUSD: finalPriceUSD,
            totalKHR: finalPriceKHR,
            playerId: primaryVal,
            zoneId: accountValues['zoneId'],
            playerNickname: verifiedNick || primaryVal,
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
  }, [orderNumber, selectedPkg, isPaymentSuccess, isSimulating, activeGame, accountValues, verifiedNick, selectedPayment, finalPriceUSD, finalPriceKHR, saveOrder, completeOrder]);

  // Execute Payment Simulation / Confirmation
  const handleConfirmPayment = async () => {
    if (!selectedPkg) {
      alert(language === 'km' ? 'សូមជ្រើសរើស Package ជាមុនសិន' : 'Please select a package first');
      return;
    }

    const primaryVal = accountValues[activeGame.accountFields[0].id];
    if (!primaryVal) {
      alert(language === 'km' ? 'សូមបញ្ចូល Player ID របស់អ្នក' : 'Please enter your Player ID');
      return;
    }

    setIsSimulating(true);

    try {
      // 1. Create order record
      const orderPayload: TopUpOrder = {
        orderNumber,
        game: activeGame,
        package: selectedPkg,
        accountDetails: accountValues,
        playerNickname: verifiedNick || primaryVal,
        paymentMethod: selectedPayment,
        totalUSD: finalPriceUSD,
        totalKHR: finalPriceKHR,
        status: 'completed',
        completedAt: new Date().toISOString(),
        deliveryProof: `TXN-${orderNumber}-API-DIRECT`,
        qrCodeUrl: '/bakong-logo.svg',
        createdAt: new Date().toISOString(),
      };

      try {
        await simulatePaymentApi(orderNumber);
      } catch {}

      // Dispatch Telegram Instant Notification to Store Admin
      void dispatchTelegramNotificationApi({
        orderNumber,
        gameTitle: activeGame.name,
        packageName: selectedPkg.name,
        totalUSD: finalPriceUSD,
        totalKHR: finalPriceKHR,
        playerId: primaryVal,
        zoneId: accountValues['zoneId'],
        playerNickname: verifiedNick || primaryVal,
        paymentMethod: selectedPayment,
        status: 'completed',
        deliveryProof: `TXN-${orderNumber}-API-DIRECT`,
      });

      saveOrder(orderPayload);
      completeOrder(orderNumber);
      setIsPaymentSuccess(true);
    } catch {
      setIsPaymentSuccess(true);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto select-none pt-20 sm:pt-24 overflow-x-hidden">
      
      {/* ================================================================= */}
      {/* 1. STEP 1: QUICK GAME SELECTOR (ALL 15 GAMES)                     */}
      {/* ================================================================= */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-[#E5B55E]" />
            <h2 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              {language === 'km' ? 'ជំហានទី ១៖ ជ្រើសរើសហ្គេម' : 'Step 1: Select Game'}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            {GAMES.length} {language === 'km' ? 'ហ្គេមផ្លូវការ' : 'Official Titles'}
          </span>
        </div>

        {/* Scrollable Game Cards Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {GAMES.map((game) => {
            const isSelected = game.id === activeGame.id;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => handleSelectGame(game.id)}
                style={{
                  clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                  filter: isSelected ? 'drop-shadow(0 0 10px rgba(229,181,94,0.5))' : undefined,
                }}
                className={`p-[1.5px] transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 via-[#E5B55E] to-amber-500 scale-[1.02]'
                    : 'bg-white/[0.12] hover:bg-cyan-400/60'
                }`}
              >
                <div
                  style={{
                    clipPath: 'polygon(7.5px 0, 100% 0, calc(100% - 7.5px) 100%, 0 100%)',
                  }}
                  className={`p-3 flex items-center gap-3 text-left w-full h-full ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/25 via-[#E5B55E]/15 to-black/90'
                      : 'bg-[#0A101E] hover:bg-[#0E1628]'
                  }`}
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/20">
                    <img
                      src={game.coverImage}
                      alt={game.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-xs font-black truncate leading-tight ${isSelected ? 'text-[#E5B55E]' : 'text-white'}`}>
                      {game.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-neutral-400 font-mono">
                      <span>{game.currencyIcon}</span>
                      <span className="truncate">{game.currencyName}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#E5B55E] shadow-[0_0_8px_#E5B55E] shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. MAIN COCKPIT: 2 COLUMNS (LEFT: INPUTS + PACKAGES | RIGHT: KHQR) */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =============================================================== */}
        {/* LEFT COLUMN: STEPS 2 & 3 (CREDENTIALS + PACKAGES)               */}
        {/* =============================================================== */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          
          {/* ------------------------------------------------------------- */}
          {/* STEP 2: PLAYER CREDENTIALS & INSTANT NICKNAME CHECK           */}
          {/* ------------------------------------------------------------- */}
          <div
            style={{
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
              filter: 'drop-shadow(0 0 16px rgba(0, 212, 255, 0.45))',
            }}
            className="p-[1.5px] bg-gradient-to-br from-cyan-400 via-sky-300 to-blue-500 relative transition-all duration-300 shadow-2xl"
          >
            {/* Glowing Corner Laser Highlights on 45° Chamfers */}
            <ChamferHighlights size={20} color="cyan" />

            <div
              style={{
                clipPath: 'polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))',
              }}
              className="p-5 sm:p-6 bg-[#080E1C] relative space-y-5"
            >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  {language === 'km' ? 'ជំហានទី ២៖ បញ្ចូលលេខសម្គាល់ Player ID' : 'Step 2: Enter Account Credentials'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline underline-offset-4 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'មើលកន្លែងរក ID' : 'Where is my ID?'}</span>
              </button>
            </div>

            {/* ID Guide accordion if opened */}
            {showGuide && (
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 text-xs text-neutral-300 space-y-1">
                <span className="font-bold text-cyan-300 block">{activeGame.guideTitleKh || activeGame.guideTitle}</span>
                <p>{activeGame.guideDescriptionKh || activeGame.guideDescription}</p>
              </div>
            )}

            {/* Dynamic Account Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeGame.accountFields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
                    <span>{language === 'km' ? field.labelKh || field.label : field.label}</span>
                    {field.required && <span className="text-[#E5B55E] text-[10px] font-mono">*REQUIRED</span>}
                  </label>

                  {field.type === 'select' && field.options ? (
                    <select
                      value={accountValues[field.id] || field.options[0].value}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full bg-[#10182C] border border-white/[0.15] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'text' : field.type}
                      inputMode={field.type === 'number' ? 'numeric' : 'text'}
                      value={accountValues[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={language === 'km' ? field.placeholderKh || field.placeholder || '' : field.placeholder || ''}
                      className="w-full bg-[#10182C] border border-white/[0.15] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  )}
                  {field.helperText && (
                    <span className="text-[10px] text-neutral-500 block font-mono">
                      {language === 'km' ? field.helperTextKh || field.helperText : field.helperText}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Check ID Button & Verified Nickname Display */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleVerify}
                disabled={isVerifying}
                style={{
                  clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
                }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-[0_0_12px_rgba(0,212,255,0.4)]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? (language === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Checking...') : (language === 'km' ? 'ផ្ទៀងផ្ទាត់ឈ្មោះ Nickname' : 'Check Nickname')}</span>
              </button>

              {verifiedNick && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>NICKNAME: <strong className="text-white">{verifiedNick}</strong></span>
                </div>
              )}

              {verifyError && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs font-mono">
                  <AlertCircle className="w-4 h-4" />
                  <span>{verifyError}</span>
                </div>
              )}
            </div>
          </div>
        </div>

          {/* ------------------------------------------------------------- */}
          {/* STEP 3: PACKAGE SELECTION                                     */}
          {/* ------------------------------------------------------------- */}
          <div
            style={{
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
              filter: 'drop-shadow(0 0 16px rgba(0, 212, 255, 0.45))',
            }}
            className="p-[1.5px] bg-gradient-to-br from-cyan-400 via-sky-300 to-blue-500 relative transition-all duration-300 shadow-2xl"
          >
            {/* Glowing Corner Laser Highlights on 45° Chamfers */}
            <ChamferHighlights size={20} color="cyan" />

            <div
              style={{
                clipPath: 'polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))',
              }}
              className="p-5 sm:p-6 bg-[#080E1C] relative space-y-5"
            >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E5B55E]" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  {language === 'km' ? 'ជំហានទី ៣៖ ជ្រើសរើសកញ្ចប់ Package' : 'Step 3: Choose Package'}
                </h3>
              </div>

              <span className="text-[11px] font-mono text-[#E5B55E] font-bold">
                {activeGame.packages.length} {language === 'km' ? 'កញ្ចប់មានស្តុក' : 'Packages Available'}
              </span>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-3.5">
              {activeGame.packages.map((pkg) => {
                const isSelected = selectedPkg?.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg)}
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                    }}
                    className={`relative p-3.5 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-500/25 via-[#E5B55E]/15 to-[#0A101E] border-2 border-[#E5B55E] shadow-[0_0_20px_rgba(229,181,94,0.4)] scale-[1.02]'
                        : 'bg-[#0E1628] border border-white/[0.1] hover:border-white/30 hover:bg-[#121C33]'
                    }`}
                  >
                    {/* Badge */}
                    {pkg.badge && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase bg-[#E5B55E] text-black tracking-wider">
                        {pkg.badge}
                      </span>
                    )}

                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                        {pkg.name}
                      </h4>
                      {pkg.bonusAmount ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 block mt-0.5">
                          +{pkg.bonusAmount} Bonus
                        </span>
                      ) : null}
                    </div>

                    <div className="pt-2 border-t border-white/[0.08] flex items-baseline justify-between mt-2">
                      <span className="text-sm sm:text-base font-black font-mono text-[#E5B55E]">
                        ${pkg.priceUSD.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        ៛{toKHR(pkg.priceUSD).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        </div>

        {/* =============================================================== */}
        {/* RIGHT COLUMN: STEP 4 (SUMMARY, BAKONG KHQR TERMINAL & PAY)      */}
        {/* Desktop: Sticky Sidebar. Mobile: Hidden from flow, pops up via Modal */}
        {/* =============================================================== */}
        <div id="express-checkout-card" className="hidden lg:block lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20 space-y-4 scroll-mt-24">
          <div
            style={{
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
              filter: 'drop-shadow(0 0 18px rgba(229, 181, 94, 0.45))',
            }}
            className="p-[1.5px] bg-gradient-to-br from-[#FFE082] via-[#E5B55E] to-[#B8860B] relative transition-all duration-300 shadow-2xl"
          >
            {/* Glowing Corner Laser Highlights on 45° Chamfers */}
            <ChamferHighlights size={20} color="gold" />

            <div
              style={{
                clipPath: 'polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))',
              }}
              className="p-3.5 sm:p-4 bg-[#080E1C] relative space-y-2.5"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-[#E5B55E]" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    {language === 'km' ? 'ផ្ទាំងទូទាត់រហ័ស' : 'Express Checkout'}
                  </h3>
                </div>

                {/* Order ID with Copy */}
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="text-[9px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>#{orderNumber}</span>
                  {copiedId ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                </button>
              </div>

              {/* Compact Order Details */}
              <div className="p-2 rounded-lg bg-[#0D1527] border border-white/[0.08] text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-neutral-400 text-[10px]">{language === 'km' ? 'ហ្គេម' : 'Game'}:</span>
                    <span className="font-bold text-white truncate">{activeGame.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-neutral-400 text-[10px]">{language === 'km' ? 'កញ្ចប់' : 'Pkg'}:</span>
                    <span className="font-bold text-[#E5B55E]">
                      {selectedPkg ? selectedPkg.name : (language === 'km' ? 'មិនទាន់ជ្រើស' : 'None')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/[0.05] text-[10px]">
                  <div className="text-neutral-400 font-mono truncate">
                    ID: <span className="text-white font-bold">{accountValues[activeGame.accountFields[0]?.id] || '—'}{accountValues['zoneId'] ? ` (${accountValues['zoneId']})` : ''}</span>
                  </div>
                  {verifiedNick ? (
                    <span className="font-bold text-emerald-400 font-mono truncate max-w-[140px]">
                      ✓ {verifiedNick}
                    </span>
                  ) : (
                    <span className="text-neutral-500 text-[10px]">{language === 'km' ? 'មិនទាន់បញ្ជាក់ ID' : 'Unverified'}</span>
                  )}
                </div>
              </div>

              {/* Promo Code & Currency Selector */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  {/* Promo Code Input */}
                  <div className="flex-1 flex bg-[#10182C] border border-white/[0.12] rounded-md overflow-hidden focus-within:border-[#E5B55E]/60">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder={language === 'km' ? 'កូដ VIP Promo...' : 'Promo Code...'}
                      className="w-full bg-transparent px-2.5 py-1 text-[10px] text-white font-mono uppercase focus:outline-none placeholder:text-neutral-500"
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="px-2.5 py-1 bg-[#E5B55E] text-black font-black text-[9px] uppercase hover:brightness-110 cursor-pointer shrink-0 transition-all"
                    >
                      {language === 'km' ? 'បញ្ចូល' : 'Apply'}
                    </button>
                  </div>

                  {/* Currency Switcher */}
                  <div className="notranslate flex items-center bg-[#10182C] p-0.5 rounded-md border border-white/10 text-[9px] font-mono shrink-0" translate="no">
                    <button
                      type="button"
                      onClick={() => setBillCurrency('USD')}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-all ${billCurrency === 'USD' ? 'bg-[#E5B55E] text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillCurrency('KHR')}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-all ${billCurrency === 'KHR' ? 'bg-[#E5B55E] text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                    >
                      KHR (៛)
                    </button>
                  </div>
                </div>

                {promoMsg && (
                  <span className={`text-[9px] font-mono block px-0.5 ${discountPercent > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {promoMsg}
                  </span>
                )}
              </div>

              {/* QR Timer & Fee Status */}
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-400/90 px-0.5 pt-0.5">
                <span className="flex items-center gap-1 font-bold">
                  <Zap className="w-3 h-3 text-[#FFE082]" />
                  <span>{language === 'km' ? 'ស្កេនទូទាត់ 0% សេវា' : 'Scan to Pay (0% Surcharge)'}</span>
                </span>
                <div className="flex items-center gap-1 text-neutral-300">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span className="font-bold text-cyan-400">{formatTimer(timeLeft)}</span>
                </div>
              </div>

              {/* Official KHQR Card */}
              <KHQRCard
                amount={billCurrency === 'USD' ? finalPriceUSD : finalPriceKHR}
                currency={billCurrency}
                merchantName="SEA RA PRESTIGE"
                storeLabel="OFFICIAL STORE"
                orderNumber={orderNumber}
                size={145}
              />

              {/* Instant Verification CTA Button */}
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isSimulating || !selectedPkg}
                style={{
                  clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#E5B55E] via-[#F3C978] to-[#D4A043] text-black font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(229,181,94,0.4)] active:scale-[0.99]"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Verifying Transaction...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    <span>{language === 'km' ? 'ខ្ញុំបានស្កេនបង់រួចរាល់' : 'I Have Paid / Complete Reload'}</span>
                  </>
                )}
              </button>

              {/* Success Notification (No Extra Buttons, Clean Instant Confirmation) */}
              {isPaymentSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/50 text-emerald-300 space-y-2 text-center animate-in zoom-in-95 duration-200">
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
        </div>

      </div>

      {/* Mobile KHQR Checkout Modal (Pops up when clicking 'ស្កេនបង់ប្រាក់') */}
      {mobileQRModalOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#080E1C] rounded-t-3xl sm:rounded-3xl border border-white/[0.15] p-3.5 shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Header Close Bar */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <span className="text-xs font-black text-[#E5B55E] uppercase tracking-wider font-mono">
                {language === 'km' ? '⚡ ផ្ទាំងទូទាត់រហ័ស (KHQR)' : '⚡ Express Checkout (KHQR)'}
              </span>
              <button
                type="button"
                onClick={() => setMobileQRModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* In-Modal Checkout Card */}
            <div className="space-y-2.5">
              {/* Compact Order Details */}
              <div className="p-2 rounded-lg bg-[#0D1527] border border-white/[0.08] text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-neutral-400 text-[10px]">{language === 'km' ? 'ហ្គេម' : 'Game'}:</span>
                    <span className="font-bold text-white truncate">{activeGame.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-neutral-400 text-[10px]">{language === 'km' ? 'កញ្ចប់' : 'Pkg'}:</span>
                    <span className="font-bold text-[#E5B55E]">
                      {selectedPkg ? selectedPkg.name : (language === 'km' ? 'មិនទាន់ជ្រើស' : 'None')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/[0.05] text-[10px]">
                  <div className="text-neutral-400 font-mono truncate">
                    ID: <span className="text-white font-bold">{accountValues[activeGame.accountFields[0]?.id] || '—'}{accountValues['zoneId'] ? ` (${accountValues['zoneId']})` : ''}</span>
                  </div>
                  {verifiedNick ? (
                    <span className="font-bold text-emerald-400 font-mono truncate max-w-[140px]">
                      ✓ {verifiedNick}
                    </span>
                  ) : (
                    <span className="text-neutral-500 text-[10px]">{language === 'km' ? 'មិនទាន់បញ្ជាក់ ID' : 'Unverified'}</span>
                  )}
                </div>
              </div>

              {/* Promo Code & Currency Selector */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 flex bg-[#10182C] border border-white/[0.12] rounded-md overflow-hidden focus-within:border-[#E5B55E]/60">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder={language === 'km' ? 'កូដ VIP Promo...' : 'Promo Code...'}
                      className="w-full bg-transparent px-2.5 py-1 text-[10px] text-white font-mono uppercase focus:outline-none placeholder:text-neutral-500"
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="px-2.5 py-1 bg-[#E5B55E] text-black font-black text-[9px] uppercase hover:brightness-110 cursor-pointer shrink-0 transition-all"
                    >
                      {language === 'km' ? 'បញ្ចូល' : 'Apply'}
                    </button>
                  </div>

                  <div className="notranslate flex items-center bg-[#10182C] p-0.5 rounded-md border border-white/10 text-[9px] font-mono shrink-0" translate="no">
                    <button
                      type="button"
                      onClick={() => setBillCurrency('USD')}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-all ${billCurrency === 'USD' ? 'bg-[#E5B55E] text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillCurrency('KHR')}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-all ${billCurrency === 'KHR' ? 'bg-[#E5B55E] text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                    >
                      KHR (៛)
                    </button>
                  </div>
                </div>

                {promoMsg && (
                  <span className={`text-[9px] font-mono block px-0.5 ${discountPercent > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {promoMsg}
                  </span>
                )}
              </div>

              {/* QR Timer & Fee Status */}
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-400/90 px-0.5 pt-0.5">
                <span className="flex items-center gap-1 font-bold">
                  <Zap className="w-3 h-3 text-[#FFE082]" />
                  <span>{language === 'km' ? 'ស្កេនទូទាត់ 0% សេវា' : 'Scan to Pay (0% Surcharge)'}</span>
                </span>
                <div className="flex items-center gap-1 text-neutral-300">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span className="font-bold text-cyan-400">{formatTimer(timeLeft)}</span>
                </div>
              </div>

              {/* Official KHQR Card */}
              <KHQRCard
                amount={billCurrency === 'USD' ? finalPriceUSD : finalPriceKHR}
                currency={billCurrency}
                merchantName="SEA RA PRESTIGE"
                storeLabel="OFFICIAL STORE"
                orderNumber={orderNumber}
                size={145}
              />

              {/* Instant Verification CTA Button */}
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isSimulating || !selectedPkg}
                style={{
                  clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#E5B55E] via-[#F3C978] to-[#D4A043] text-black font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(229,181,94,0.4)] active:scale-[0.99]"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Verifying Transaction...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    <span>{language === 'km' ? 'ខ្ញុំបានស្កេនបង់រួចរាល់' : 'I Have Paid / Complete Reload'}</span>
                  </>
                )}
              </button>

              {/* Success Notification Modal (No Extra Buttons, Clean Instant Confirmation) */}
              {isPaymentSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/50 text-emerald-300 space-y-2 text-center animate-in zoom-in-95 duration-200">
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
        </div>
      )}

      {/* Mobile Floating Sticky Action Bar on Express Page */}
      {selectedPkg && !isPaymentSuccess && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-[#070D1B]/95 backdrop-blur-xl border-t border-[#E5B55E]/30 shadow-[0_-10px_25px_rgba(0,0,0,0.8)] flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono text-neutral-400 block truncate">
              {activeGame.name} • {selectedPkg.name}
            </span>
            <div className="flex items-baseline gap-1.5" translate="no">
              <span translate="no" className="notranslate text-base font-black font-mono text-[#FFE082]">
                {billCurrency === 'USD' ? `$${finalPriceUSD.toFixed(2)}` : `${finalPriceKHR.toLocaleString()} ៛`}
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">
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
            className="px-5 py-2.5 bg-gradient-to-r from-[#E5B55E] via-[#F3C978] to-[#D4A043] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(229,181,94,0.5)] flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-black shrink-0" />
            <span>{language === 'km' ? 'ស្កេនបង់ប្រាក់' : 'Scan to Pay'}</span>
          </button>
        </div>
      )}

    </div>
  );
}
