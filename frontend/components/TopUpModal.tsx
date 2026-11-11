'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PAYMENT_CHANNELS } from '@/data/games';
import { TopUpOrder } from '@/types';
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
  ArrowRight,
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
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_CHANNELS[0].id);
  const [contact, setContact] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMsg, setPromoMsg] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Active checkout screen state (QR modal inside)
  const [currentOrder, setCurrentOrder] = useState<TopUpOrder | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset or initialize when modal opens or game changes
  useEffect(() => {
    if (selectedGame) {
      const initial: Record<string, string> = {};
      selectedGame.accountFields.forEach((f) => {
        initial[f.id] = f.type === 'select' && f.options ? f.options[0].value : '';
      });
      setAccountValues(initial);
      setVerifiedNick(null);
      setVerifyError(null);
      setCurrentOrder(null);
      setPromoCode('');
      setDiscountPercent(0);
      setPromoMsg(null);
      setShowGuide(false);
    }
  }, [selectedGame, isTopUpOpen]);

  if (!isTopUpOpen || !selectedGame) return null;

  const currentPkg = selectedPackage || selectedGame.packages[0];

  const handleInputChange = (fieldId: string, val: string) => {
    setAccountValues((prev) => ({ ...prev, [fieldId]: val }));
    setVerifiedNick(null);
    setVerifyError(null);
  };

  const handleVerify = () => {
    const primary = selectedGame.accountFields[0];
    const val = accountValues[primary.id];
    if (!val || val.trim().length < 3) {
      setVerifyError(language === 'km' ? 'សូមបញ្ចូលលេខសម្គាល់ឱ្យបានត្រឹមត្រូវ' : 'Please enter a valid ID');
      return;
    }
    setIsVerifying(true);
    setVerifyError(null);

    setTimeout(() => {
      setIsVerifying(false);
      const mocks: Record<string, string> = {
        mlbb: 'Slayer_ProKH',
        roblox: 'RobloxTycoon',
        ff: 'BooyahMaster_KH',
        pubg: 'AWM_Conqueror',
        genshin: 'Traveler_Teyvat',
        valorant: 'TenZ_Fan_KH',
      };
      setVerifiedNick(mocks[selectedGame.id] || 'VerifiedPlayer_KH');
    }, 600);
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

  const discountedUSD = Number((currentPkg.priceUSD * (1 - discountPercent / 100)).toFixed(2));
  const discountedKHR = Math.round(currentPkg.priceKHR * (1 - discountPercent / 100));

  const handleProceedCheckout = () => {
    const primary = selectedGame.accountFields[0];
    const idVal = accountValues[primary.id] || 'GuestID';
    const orderNum = `GV-${Math.floor(100000 + Math.random() * 900000)}`;

    const order: TopUpOrder = {
      orderNumber: orderNum,
      game: selectedGame,
      package: currentPkg,
      accountDetails: accountValues,
      playerNickname: verifiedNick || idVal,
      paymentMethod: selectedPayment,
      totalUSD: discountedUSD,
      totalKHR: discountedKHR,
      status: 'pending',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=KHQR-${orderNum}-USD-${discountedUSD}`,
      createdAt: new Date().toISOString(),
    };

    saveOrder(order);
    setCurrentOrder(order);
  };

  const handleSimulatePayment = () => {
    if (!currentOrder) return;
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      completeOrder(currentOrder.orderNumber);
      setCurrentOrder((prev) => (prev ? { ...prev, status: 'completed' } : null));
    }, 1000);
  };

  const handleCopyOrder = () => {
    if (!currentOrder) return;
    navigator.clipboard.writeText(currentOrder.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-[#0B101E] rounded-3xl border border-white/[0.12] w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* =============================================================== */}
        {/* MODAL HEADER: GAME BANNER & QUICK INFO                          */}
        {/* =============================================================== */}
        <div className="relative h-28 sm:h-36 w-full shrink-0 overflow-hidden bg-black/50">
          <img
            src={selectedGame.bannerImage}
            alt={selectedGame.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B101E] via-[#0B101E]/70 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={closeTopUp}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Game Title, Badge & Publisher in Banner */}
          <div className="absolute bottom-3 left-4 sm:left-6 z-10 flex items-center gap-3.5">
            <img
              src={selectedGame.coverImage}
              alt={selectedGame.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#E5B55E]/80 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#E5B55E] text-black">
                  OFFICIAL API
                </span>
                <span className="text-[10px] text-amber-400 font-bold">
                  ★ {selectedGame.rating.toFixed(1)}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-extrabold text-white leading-tight mt-0.5">
                {selectedGame.name}
              </h2>
              <p className="text-[11px] text-neutral-400">
                {selectedGame.publisher} • {selectedGame.currencyName}
              </p>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* MODAL BODY (SCROLLABLE)                                          */}
        {/* =============================================================== */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Active Order QR Overlay (When checkout is initiated) */}
          {currentOrder ? (
            <div className="space-y-5 animate-in zoom-in-95 py-2">
              <div className="text-center">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                    currentOrder.status === 'completed'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                  }`}
                >
                  {currentOrder.status === 'completed' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.checkout.orderSuccess}</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{t.checkout.orderPending}</span>
                    </>
                  )}
                </div>

                <h3 className="text-lg font-black text-white">
                  {selectedGame.name} • {currentOrder.package.name}
                </h3>
                <p className="text-xs text-neutral-400">
                  Order #{currentOrder.orderNumber}
                </p>
              </div>

              {currentOrder.status !== 'completed' ? (
                <div className="space-y-4 max-w-sm mx-auto text-center">
                  <div className="bg-white p-3.5 rounded-3xl w-56 h-56 mx-auto shadow-2xl flex flex-col items-center justify-center border-4 border-[#E5B55E]">
                    <img
                      src={currentOrder.qrCodeUrl}
                      alt="Bakong KHQR"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-[#121828] p-3 rounded-2xl border border-white/[0.08]">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                      Amount Due
                    </span>
                    <div className="flex items-baseline justify-center gap-2 mt-0.5">
                      <span className="text-xl font-black text-[#E5B55E] font-mono">
                        ${currentOrder.totalUSD.toFixed(2)}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        ({currentOrder.totalKHR.toLocaleString()} ៛)
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleCopyOrder}
                      className="py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? t.checkout.copied : t.checkout.copyOrder}</span>
                    </button>

                    <a
                      href="https://bakong.nbc.org.kh"
                      target="_blank"
                      className="py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>{t.checkout.openBank}</span>
                    </a>
                  </div>

                  {/* Instant Test Simulation Button */}
                  <div className="pt-2 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      disabled={isSimulating}
                      className="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      {isSimulating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{t.checkout.testSimulating}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                          <span>{t.checkout.testSimulate}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-sm mx-auto text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">
                      Top-Up Delivered Successfully!
                    </h4>
                    <p className="text-xs text-neutral-300 mt-1">
                      In-game currencies credited directly to {currentOrder.playerNickname}.
                    </p>
                  </div>

                  <div className="bg-[#121828] p-3 rounded-xl border border-white/[0.06] text-left text-xs font-mono text-neutral-300">
                    <span className="text-[10px] text-neutral-500 uppercase block mb-1">
                      API Delivery Reference:
                    </span>
                    <span className="text-emerald-400 break-all">
                      TXN-{currentOrder.orderNumber}-MOONTON-DELIVERED
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={closeTopUp}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E5B55E] to-[#C49740] text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    Done & Close
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* STEP 1: ACCOUNT DETAILS */}
              <div className="bg-[#0F1526] rounded-2xl border border-white/[0.08] p-4 sm:p-5 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#E5B55E] text-black font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-white">
                        {t.checkout.step1}
                      </h3>
                      <p className="text-[10px] text-neutral-400">
                        {t.checkout.step1Sub}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowGuide(!showGuide)}
                    className="text-[10px] font-bold text-[#E5B55E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>{t.checkout.whereIsMyId}</span>
                  </button>
                </div>

                {/* ID Guide Tooltip / Alert */}
                {showGuide && (
                  <div className="mb-4 p-3.5 rounded-xl bg-[#161F33] border border-[#E5B55E]/30 text-xs text-neutral-300 leading-relaxed animate-in fade-in">
                    <p className="font-bold text-[#E5B55E] mb-1">
                      {language === 'km' ? selectedGame.guideTitleKh : selectedGame.guideTitle}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      {language === 'km' ? selectedGame.guideDescriptionKh : selectedGame.guideDescription}
                    </p>
                  </div>
                )}

                {/* Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {selectedGame.accountFields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-300 block">
                        {language === 'km' ? field.labelKh : field.label}{' '}
                        <span className="text-red-400">*</span>
                      </label>

                      {field.type === 'select' ? (
                        <select
                          value={accountValues[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full bg-[#121828] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5B55E]"
                        >
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={accountValues[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={language === 'km' ? field.placeholderKh : field.placeholder}
                          className="w-full bg-[#121828] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#E5B55E]"
                        />
                      )}

                      {(field.helperText || field.helperTextKh) && (
                        <span className="text-[9px] text-neutral-400 block">
                          {language === 'km' ? field.helperTextKh : field.helperText}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Verify Button & Live Result */}
                <div className="mt-4 pt-3 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-[#E5B55E]/40 text-[#E5B55E] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{t.checkout.verifying}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t.checkout.verifyBtn}</span>
                      </>
                    )}
                  </button>

                  {verifiedNick && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {t.checkout.verified} <strong className="text-white">{verifiedNick}</strong>
                      </span>
                    </div>
                  )}

                  {verifyError && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{verifyError}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 2: SELECT PACKAGE */}
              <div className="bg-[#0F1526] rounded-2xl border border-white/[0.08] p-4 sm:p-5 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06] mb-4">
                  <span className="w-6 h-6 rounded-lg bg-[#E5B55E] text-black font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-white">
                      {t.checkout.step2}
                    </h3>
                    <p className="text-[10px] text-neutral-400">
                      {t.checkout.step2Sub}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedGame.packages.map((pkg) => {
                    const isSelected = currentPkg.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                          isSelected
                            ? 'bg-[#18233C] border-[#E5B55E] shadow-[0_0_18px_rgba(229,181,94,0.25)] ring-1 ring-[#E5B55E]'
                            : 'bg-[#121828] border-white/[0.06] hover:border-white/[0.2] hover:bg-[#151E33]'
                        }`}
                      >
                        {pkg.badge && (
                          <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-[#E5B55E] text-black">
                            {pkg.badge}
                          </span>
                        )}

                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-base">{selectedGame.currencyIcon}</span>
                          <span className="text-xs font-bold text-white group-hover:text-[#E5B55E] transition-colors line-clamp-1">
                            {pkg.name}
                          </span>
                        </div>

                        <div>
                          {pkg.bonusAmount > 0 && (
                            <span className="text-[9px] font-bold text-emerald-400 block mb-1">
                              +{pkg.bonusAmount} Bonus
                            </span>
                          )}
                          <div className="flex items-baseline justify-between pt-1.5 border-t border-white/[0.04]">
                            <span className="text-xs font-black text-[#E5B55E] font-mono">
                              {formatPrice(pkg.priceUSD)}
                            </span>
                            <span className="text-[9px] text-neutral-400 font-mono">
                              {toKHR(pkg.priceUSD)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 3: PAYMENT METHOD */}
              <div className="bg-[#0F1526] rounded-2xl border border-white/[0.08] p-4 sm:p-5 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06] mb-4">
                  <span className="w-6 h-6 rounded-lg bg-[#E5B55E] text-black font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-white">
                      {t.checkout.step3}
                    </h3>
                    <p className="text-[10px] text-neutral-400">
                      {t.checkout.step3Sub}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_CHANNELS.map((method) => {
                    const isSelected = selectedPayment === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'bg-[#18233C] border-[#E5B55E] shadow-sm ring-1 ring-[#E5B55E]'
                            : 'bg-[#121828] border-white/[0.06] hover:border-white/[0.2]'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                          <QrCode className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-black text-white truncate">
                              {language === 'km' ? method.nameKh : method.name}
                            </span>
                            {method.badge && (
                              <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded ${method.badgeColor}`}>
                                {method.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                            {language === 'km' ? method.subtitleKh : method.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 4: CONTACT & PROMO CODE */}
              <div className="bg-[#0F1526] rounded-2xl border border-white/[0.08] p-4 sm:p-5 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06] mb-4">
                  <span className="w-6 h-6 rounded-lg bg-[#E5B55E] text-black font-black text-xs flex items-center justify-center">
                    4
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-white">
                      {t.checkout.step4}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 block mb-1">
                      Contact (Phone / Telegram)
                    </label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={t.checkout.contactPlaceholder}
                      className="w-full bg-[#121828] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#E5B55E]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 block mb-1">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. SEARAVIP"
                        className="flex-1 bg-[#121828] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 uppercase focus:outline-none focus:border-[#E5B55E]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-[#E5B55E] cursor-pointer"
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
                </div>
              </div>
            </>
          )}

        </div>

        {/* =============================================================== */}
        {/* STICKY BOTTOM CHECKOUT FOOTER BAR                               */}
        {/* =============================================================== */}
        {!currentOrder && (
          <div className="p-4 sm:p-5 bg-[#090D18] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                  {t.checkout.total}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-black text-[#E5B55E] font-mono">
                    ${discountedUSD.toFixed(2)}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    ≈ {discountedKHR.toLocaleString()} ៛
                  </span>
                </div>
              </div>

              {discountPercent > 0 && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                  10% OFF
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={closeTopUp}
                className="px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 font-bold text-xs cursor-pointer"
              >
                {t.checkout.closeBtn}
              </button>

              <button
                type="button"
                onClick={handleProceedCheckout}
                className="flex-1 sm:flex-initial px-8 py-3 rounded-xl bg-gradient-to-r from-[#E5B55E] via-[#FBBF24] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(229,181,94,0.35)] hover:shadow-[0_0_28px_rgba(229,181,94,0.55)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>{t.checkout.payBtn}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
