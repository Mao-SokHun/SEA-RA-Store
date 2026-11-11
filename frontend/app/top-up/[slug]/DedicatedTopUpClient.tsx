'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GameItem, PackageItem, TopUpOrder } from '@/types';
import { useApp } from '@/context/AppContext';
import { PAYMENT_CHANNELS } from '@/data/games';
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
  Smartphone,
  Zap,
} from 'lucide-react';

export default function DedicatedTopUpClient({ game }: { game: GameItem }) {
  const { language, t, formatPrice, toKHR, saveOrder, completeOrder } = useApp();

  const [selectedPkg, setSelectedPkg] = useState<PackageItem>(game.packages[0]);
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

  // Active Checkout Order State
  const [currentOrder, setCurrentOrder] = useState<TopUpOrder | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (id: string, val: string) => {
    setAccountValues((prev) => ({ ...prev, [id]: val }));
    setVerifiedNick(null);
    setVerifyError(null);
  };

  const handleVerify = () => {
    const primary = game.accountFields[0];
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
      setVerifiedNick(mocks[game.id] || 'VerifiedPlayer_KH');
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

  const discountedUSD = Number((selectedPkg.priceUSD * (1 - discountPercent / 100)).toFixed(2));
  const discountedKHR = Math.round(selectedPkg.priceKHR * (1 - discountPercent / 100));

  const handleProceedCheckout = () => {
    const primary = game.accountFields[0];
    const idVal = accountValues[primary.id] || 'GuestID';
    const orderNum = `GV-${Math.floor(100000 + Math.random() * 900000)}`;

    const order: TopUpOrder = {
      orderNumber: orderNum,
      game,
      package: selectedPkg,
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </Link>

      {/* Game Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0F1424] border border-white/[0.1] p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <img
            src={game.coverImage}
            alt={game.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-[#E5B55E]/80 shadow-2xl shrink-0"
          />
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#E5B55E] text-black font-black text-[10px] uppercase">
                OFFICIAL PARTNER
              </span>
              <span className="text-xs text-amber-400 font-bold">
                ★ {game.rating.toFixed(1)} / 5.0
              </span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                ⚡ 3-Sec Direct Injection
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {game.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              {game.publisher} • {game.currencyName} Top-Up via Bakong KHQR
            </p>
          </div>
        </div>
      </div>

      {currentOrder ? (
        /* Order Checkout Confirmation */
        <div className="max-w-md mx-auto bg-[#0F1424] rounded-3xl border border-white/[0.12] p-6 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
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
            {game.name} • {currentOrder.package.name}
          </h3>
          <p className="text-xs text-neutral-400">
            Order #{currentOrder.orderNumber}
          </p>

          {currentOrder.status !== 'completed' ? (
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-2xl w-56 h-56 mx-auto shadow-2xl flex flex-col items-center justify-center border-4 border-[#E5B55E]">
                <img
                  src={currentOrder.qrCodeUrl}
                  alt="Bakong KHQR"
                  className="w-full h-full object-contain"
                />
              </div>

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

              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isSimulating}
                className="w-full py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-emerald-400 fill-current" />
                <span>{isSimulating ? t.checkout.testSimulating : t.checkout.testSimulate}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-xs text-neutral-300">
                Currencies credited directly to {currentOrder.playerNickname}.
              </p>
              <Link
                href="/"
                className="block w-full py-3 rounded-xl bg-[#E5B55E] text-black font-black text-xs uppercase tracking-wider shadow-md"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* 3-Step Full-Page Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Account */}
            <div className="bg-[#0F1424] rounded-3xl border border-white/[0.08] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#E5B55E] text-black font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-extrabold text-white">
                    {t.checkout.step1}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuide(!showGuide)}
                  className="text-[11px] font-bold text-[#E5B55E] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t.checkout.whereIsMyId}</span>
                </button>
              </div>

              {showGuide && (
                <div className="p-3.5 rounded-xl bg-[#161F33] border border-[#E5B55E]/30 text-xs text-neutral-300">
                  <p className="font-bold text-[#E5B55E] mb-1">
                    {language === 'km' ? game.guideTitleKh : game.guideTitle}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    {language === 'km' ? game.guideDescriptionKh : game.guideDescription}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {game.accountFields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-300 block">
                      {language === 'km' ? field.labelKh : field.label} *
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
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-[#E5B55E]/40 text-[#E5B55E] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  <span>{isVerifying ? t.checkout.verifying : t.checkout.verifyBtn}</span>
                </button>

                {verifiedNick && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.checkout.verified} <strong className="text-white">{verifiedNick}</strong></span>
                  </span>
                )}
              </div>
            </div>

            {/* Step 2: Package */}
            <div className="bg-[#0F1424] rounded-3xl border border-white/[0.08] p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
                <span className="w-6 h-6 rounded-lg bg-[#E5B55E] text-black font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-extrabold text-white">
                  {t.checkout.step2}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {game.packages.map((pkg) => {
                  const isSelected = selectedPkg.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkg(pkg)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                        isSelected
                          ? 'bg-[#18233C] border-[#E5B55E] shadow-md ring-1 ring-[#E5B55E]'
                          : 'bg-[#121828] border-white/[0.06] hover:border-white/[0.2]'
                      }`}
                    >
                      {pkg.badge && (
                        <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-[#E5B55E] text-black">
                          {pkg.badge}
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-base">{game.currencyIcon}</span>
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

            {/* Step 3: Payment */}
            <div className="bg-[#0F1424] rounded-3xl border border-white/[0.08] p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
                <span className="w-6 h-6 rounded-lg bg-[#E5B55E] text-black font-black text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-extrabold text-white">
                  {t.checkout.step3}
                </h3>
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

          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-[#0F1424] rounded-3xl border border-white/[0.1] p-6 shadow-2xl space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white pb-3 border-b border-white/[0.06]">
                {t.checkout.summary}
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-neutral-300">
                  <span>{t.checkout.game}:</span>
                  <span className="font-bold text-white">{game.name}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>{t.checkout.package}:</span>
                  <span className="font-bold text-white">{selectedPkg.name}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Payment:</span>
                  <span className="font-bold text-emerald-400">Bakong KHQR (0% Fee)</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (e.g. SEARAVIP)"
                    className="flex-1 bg-[#121828] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-400 uppercase focus:outline-none focus:border-[#E5B55E]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-[#E5B55E] cursor-pointer"
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

              {/* Total Due */}
              <div className="pt-3 border-t border-white/[0.08] flex items-baseline justify-between">
                <span className="text-xs font-bold text-neutral-300">Total:</span>
                <div className="text-right">
                  <span className="text-xl font-black text-[#E5B55E] font-mono">
                    ${discountedUSD.toFixed(2)}
                  </span>
                  <span className="text-xs text-neutral-400 block font-mono">
                    ≈ {discountedKHR.toLocaleString()} ៛
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={handleProceedCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E5B55E] to-[#C49740] hover:from-[#FBBF24] hover:to-[#B45309] text-black font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>{t.checkout.payBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
