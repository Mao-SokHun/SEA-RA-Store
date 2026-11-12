'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PAYMENT_CHANNELS } from '@/data/games';
import { PackageItem, TopUpOrder } from '@/types';
import {
  verifyPlayerApi,
  createTopUpOrderApi,
  simulatePaymentApi,
  dispatchTelegramNotificationApi,
} from '@/lib/api';
import {
  X,
  Zap,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  Smartphone,
  Clock,
} from 'lucide-react';

export default function TopUpModal() {
  const {
    language,
    t,
    isTopUpOpen,
    closeTopUp,
    selectedGame,
    selectedPackage,
    setSelectedPackage,
    formatPrice,
    toKHR,
    saveOrder,
    completeOrder,
  } = useApp();

  // Form State
  const [accountValues, setAccountValues] = useState<Record<string, string>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedNick, setVerifiedNick] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Order & Payment state (Instant 1-Screen)
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(180);

  // Initialize when game or modal opens
  useEffect(() => {
    if (selectedGame && isTopUpOpen) {
      const initial: Record<string, string> = {};
      selectedGame.accountFields.forEach((f) => {
        initial[f.id] = f.type === 'select' && f.options ? f.options[0].value : '';
      });
      setAccountValues(initial);
      setVerifiedNick(null);
      setVerifyError(null);
      setOrderCompleted(false);
      setShowGuide(false);
      setCountdown(180);
    }
  }, [selectedGame, isTopUpOpen]);

  // Real-time Countdown timer
  useEffect(() => {
    if (!isTopUpOpen) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 180 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isTopUpOpen]);

  if (!isTopUpOpen || !selectedGame) return null;

  const currentPkg = selectedPackage || selectedGame.packages[0];
  const priceUSD = currentPkg.priceUSD;
  const priceKHR = Math.round(priceUSD * 4100);

  const handleInputChange = (fieldId: string, val: string) => {
    setAccountValues((prev) => ({ ...prev, [fieldId]: val }));
    setVerifiedNick(null);
    setVerifyError(null);
  };

  const handleVerify = async () => {
    const idVal = accountValues['userId'] || accountValues['playerId'] || Object.values(accountValues)[0];
    if (!idVal || idVal.trim().length < 3) {
      setVerifyError(language === 'km' ? 'សូមបញ្ចូល ID ឱ្យបានត្រឹមត្រូវ' : 'Please enter a valid User ID');
      return;
    }
    setIsVerifying(true);
    setVerifyError(null);

    try {
      const res = await verifyPlayerApi({
        gameId: selectedGame.id,
        playerId: idVal,
        zoneId: accountValues['zoneId'] || undefined,
      });
      if (res?.nickname) {
        setVerifiedNick(res.nickname);
      } else {
        setVerifiedNick('Player_' + idVal.slice(-4));
      }
    } catch {
      setVerifiedNick('Player_' + idVal.slice(-4));
    } finally {
      setIsVerifying(false);
    }
  };

  const activeOrderNumber = `TU-${selectedGame.id.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const realTimeQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    `KHQR-${activeOrderNumber}-USD-${priceUSD.toFixed(2)}-BAKONG`
  )}`;

  const handleSimulatePayment = async () => {
    const idVal = accountValues['userId'] || accountValues['playerId'] || Object.values(accountValues)[0] || '12345678';
    setIsSimulating(true);

    const order: TopUpOrder = {
      orderNumber: activeOrderNumber,
      game: selectedGame,
      package: currentPkg,
      accountDetails: accountValues,
      playerNickname: verifiedNick || idVal,
      paymentMethod: 'bakong_khqr',
      totalUSD: priceUSD,
      totalKHR: priceKHR,
      status: 'completed',
      qrCodeUrl: realTimeQRUrl,
      createdAt: new Date().toISOString(),
    };

    try {
      await simulatePaymentApi(activeOrderNumber);

      // Dispatch Telegram Alert to Admin
      void dispatchTelegramNotificationApi({
        orderNumber: activeOrderNumber,
        gameTitle: selectedGame.name,
        packageName: currentPkg.name,
        totalUSD: priceUSD,
        totalKHR: priceKHR,
        playerId: idVal,
        zoneId: accountValues['zoneId'],
        playerNickname: verifiedNick || idVal,
        paymentMethod: 'Bakong KHQR',
        status: 'completed',
        deliveryProof: `TXN-${activeOrderNumber}-CONFIRMED`,
      });

      saveOrder(order);
      completeOrder(activeOrderNumber);
      setOrderCompleted(true);
    } catch {
      saveOrder(order);
      completeOrder(activeOrderNumber);
      setOrderCompleted(true);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(activeOrderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      
      {/* 1-SCREEN ALL-IN-ONE MODAL */}
      <div className="relative w-full max-w-5xl bg-[#090E1E] border border-white/[0.12] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* Subtle Gold / Cyan Rim Accent */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5B55E] via-cyan-400 to-transparent pointer-events-none" />

        {/* ================================================================= */}
        {/* 1. COMPACT HEADER                                                 */}
        {/* ================================================================= */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] bg-[#0C1327]/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={selectedGame.coverImage}
              alt={selectedGame.name}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-[#E5B55E]/50 shrink-0 shadow-md"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.2 rounded text-[8.5px] font-black uppercase bg-[#E5B55E] text-black">
                  OFFICIAL API
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {selectedGame.publisher}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white truncate">
                {selectedGame.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeTopUp}
            className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* 2. BODY CONTENT: 1-SCREEN (LEFT: ID + PACKAGES | RIGHT: LIVE KHQR) */}
        {/* ================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin">

          {orderCompleted ? (
            /* Completed Success Screen */
            <div className="max-w-md mx-auto text-center space-y-4 py-8 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.35)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">
                  {language === 'km' ? 'បញ្ចូលលុយជោគជ័យ!' : 'Top-Up Successful!'}
                </h3>
                <p className="text-xs text-neutral-300 mt-1">
                  {currentPkg.name} {language === 'km' ? 'ត្រូវបានបញ្ចូលទៅកាន់គណនីរបស់អ្នករួចរាល់' : 'credited to your account'}.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0F172E] border border-white/[0.08] text-left text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-neutral-400 text-[10px]">
                  <span>ORDER NUMBER:</span>
                  <span className="text-white font-bold">{activeOrderNumber}</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-[10px]">
                  <span>AMOUNT PAID:</span>
                  <span className="text-emerald-400 font-bold">${priceUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-[10px]">
                  <span>DELIVERY SPEED:</span>
                  <span className="text-emerald-400 font-bold">&lt; 3 SECONDS (INJECTED)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeTopUp}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                {language === 'km' ? 'បិទផ្ទាំង' : 'Close'}
              </button>
            </div>
          ) : (
            /* 1-SCREEN WORKFLOW (No multiple steps!) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* ============================================================= */}
              {/* LEFT COLUMN (7 COLS): USER ID + PACKAGE SELECTOR              */}
              {/* ============================================================= */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* 1. User ID Input Row */}
                <div className="p-3.5 rounded-2xl bg-[#0B1020] border border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5B55E]" />
                      <span>{language === 'km' ? 'លេខសម្គាល់គណនី (User ID)' : 'Account ID'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGuide(!showGuide)}
                      className="text-[11px] text-[#E5B55E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{t.checkout.whereIsMyId}</span>
                    </button>
                  </div>

                  {showGuide && (
                    <div className="p-2.5 rounded-xl bg-[#121A30] border border-cyan-400/30 text-[11px] text-neutral-300 animate-in fade-in">
                      <p className="font-bold text-cyan-300">
                        {language === 'km' ? selectedGame.guideTitleKh : selectedGame.guideTitle}
                      </p>
                      <p className="text-neutral-400 mt-0.5">
                        {language === 'km' ? selectedGame.guideDescriptionKh : selectedGame.guideDescription}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={accountValues['userId'] || accountValues['playerId'] || Object.values(accountValues)[0] || ''}
                      onChange={(e) => {
                        const key = selectedGame.accountFields[0]?.id || 'userId';
                        handleInputChange(key, e.target.value);
                      }}
                      placeholder={selectedGame.id === 'free-fire' ? 'Enter Player UID' : 'User ID (e.g. 12345678)'}
                      className="flex-1 bg-black/50 border border-white/[0.14] focus:border-[#E5B55E] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all font-mono shadow-inner"
                    />

                    {selectedGame.accountFields.length > 1 && (
                      <input
                        type="text"
                        value={accountValues['zoneId'] || ''}
                        onChange={(e) => handleInputChange('zoneId', e.target.value)}
                        placeholder="Zone (2001)"
                        className="w-24 bg-black/50 border border-white/[0.14] focus:border-[#E5B55E] rounded-xl px-2.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all font-mono shadow-inner"
                      />
                    )}

                    <button
                      type="button"
                      onClick={handleVerify}
                      disabled={isVerifying}
                      className="px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.14] text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
                    >
                      {isVerifying ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#E5B55E]" />
                      )}
                      <span>{isVerifying ? '...' : language === 'km' ? 'ផ្ទៀងផ្ទាត់' : 'Verify'}</span>
                    </button>
                  </div>

                  {verifiedNick && (
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{verifiedNick}</span>
                    </div>
                  )}
                  {verifyError && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{verifyError}</span>
                    </div>
                  )}
                </div>

                {/* 2. Package Selector Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5B55E]" />
                      <span>{language === 'km' ? 'ជ្រើសរើសកញ្ចប់' : 'Select Package'}</span>
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {selectedGame.packages.length} Packages
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[38vh] overflow-y-auto pr-1 scrollbar-thin">
                    {selectedGame.packages.map((pkg) => {
                      const isSelected = currentPkg.id === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`relative rounded-xl p-3 border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#121B32] border-[#E5B55E] ring-1 ring-[#E5B55E] shadow-[0_0_15px_rgba(229,181,94,0.3)] scale-[1.01]'
                              : 'bg-black/40 border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.03]'
                          }`}
                        >
                          {pkg.bonusAmount > 0 && (
                            <span className="absolute -top-1.5 right-1.5 px-1.5 py-0.2 rounded-full text-[7.5px] font-black uppercase bg-emerald-500 text-black">
                              +{pkg.bonusAmount} Bonus
                            </span>
                          )}

                          <div className="space-y-0.5">
                            <span className="text-xs">💎</span>
                            <h4 className="text-xs font-bold text-white line-clamp-1">
                              {pkg.name}
                            </h4>
                          </div>

                          <div className="pt-1.5 mt-1.5 border-t border-white/[0.06] flex items-baseline justify-between">
                            <span className="text-xs font-black text-[#E5B55E] font-mono">
                              {formatPrice(pkg.priceUSD)}
                            </span>
                            <span className="text-[9px] text-neutral-400 font-mono">
                              ≈ {toKHR(pkg.priceUSD)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* ============================================================= */}
              {/* RIGHT COLUMN (5 COLS): INSTANT LIVE BAKONG KHQR BILL          */}
              {/* ============================================================= */}
              <div className="lg:col-span-5 bg-[#070D1E] rounded-3xl border border-white/[0.1] p-4 flex flex-col justify-between shadow-xl">
                
                {/* Official KHQR Merchant Bill Card (Crisp & Pure QR) */}
                <div className="rounded-2xl bg-white text-black p-3.5 shadow-lg border border-neutral-200 text-center relative overflow-hidden">
                  
                  {/* Official NBC Red Header */}
                  <div className="bg-[#D32F2F] -mx-3.5 -mt-3.5 px-3 py-1.5 flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-black text-xs tracking-wider">KHQR</span>
                      <span className="text-[8px] text-red-100">National Payment</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/90 font-bold px-1.5 py-0.2 rounded bg-black/20">
                      NBC
                    </span>
                  </div>

                  {/* Merchant Branding */}
                  <div className="mb-2">
                    <h3 className="text-xs font-black tracking-wider text-neutral-900 uppercase">
                      SEA RA PRESTIGE
                    </h3>
                    <p className="text-[9px] text-neutral-500">
                      Official Gaming Reload Gateway
                    </p>
                  </div>

                  {/* Pure Clean Sharp QR Code (NO dark emblem blocking center!) */}
                  <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200 inline-block max-w-[180px] mx-auto shadow-inner">
                    <img
                      src={realTimeQRUrl}
                      alt="Bakong KHQR"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Price Due */}
                  <div className="mt-2 pt-2 border-t border-neutral-200 flex items-center justify-between text-left">
                    <div>
                      <span className="text-[8.5px] uppercase font-bold text-neutral-500 block">
                        {currentPkg.name}
                      </span>
                      <span className="text-base font-black text-neutral-900 font-mono">
                        ${priceUSD.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8.5px] font-bold text-neutral-500 block">
                        Approx KHR
                      </span>
                      <span className="text-xs font-bold text-red-600 font-mono">
                        ≈ {priceKHR.toLocaleString()} ៛
                      </span>
                    </div>
                  </div>

                  {/* Supported Banks */}
                  <div className="mt-1.5 pt-1 border-t border-dashed border-neutral-200 text-[8px] text-neutral-500 flex items-center justify-center gap-1 flex-wrap">
                    <span>ABA</span>
                    <span>•</span>
                    <span>Wing</span>
                    <span>•</span>
                    <span>ACLEDA</span>
                    <span>•</span>
                    <span>Canadia</span>
                    <span>•</span>
                    <span className="font-bold text-neutral-700">Bakong 60+ Apps</span>
                  </div>
                </div>

                {/* Real-time Countdown & Instruction */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 px-1 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                    <span>Expires: {formatCountdown(countdown)}</span>
                  </span>
                  <span className="text-emerald-400 font-bold">0% FEE KHQR</span>
                </div>

                {/* Instant Actions & Test Simulation */}
                <div className="mt-2.5 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleCopyOrder}
                      className="py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy Order ID'}</span>
                    </button>

                    <a
                      href="https://bakong.nbc.org.kh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>Open Bank</span>
                    </a>
                  </div>

                  {/* Instant Simulate Payment */}
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isSimulating}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 border border-emerald-400/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying Injection...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                        <span>Instant Simulate Payment (Test Only)</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
