'use client';

import React from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { TRANSLATIONS } from '@/i18n/translations';
import { PAYMENT_METHODS } from '@/data/payments';
import {
  X,
  Zap,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  QrCode,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function TopUpFlowModal() {
  const {
    language,
    isModalOpen,
    closeTopUp,
    activeGame,
    activePackage,
    setActivePackage,
    accountData,
    setAccountField,
    isVerifying,
    verifiedNickname,
    verificationError,
    verifyPlayerId,
    paymentMethodId,
    setPaymentMethodId,
    contactInfo,
    setContactInfo,
    promoCode,
    setPromoCode,
    applyPromoCode,
    promoDiscountPercent,
    promoMessage,
    submitOrder,
  } = useOrderStore();

  const t = TRANSLATIONS[language].topupFlow;

  if (!isModalOpen || !activeGame) return null;

  const discountMultiplier = (100 - promoDiscountPercent) / 100;
  const currentPriceUSD = activePackage
    ? Number((activePackage.priceUSD * discountMultiplier).toFixed(2))
    : 0;
  const currentPriceKHR = activePackage
    ? Math.round(activePackage.priceKHR * discountMultiplier)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-[#0B1224] rounded-3xl border border-[#2B6CFF]/40 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Top Header Gradient Banner */}
        <div className="relative h-28 sm:h-36 w-full shrink-0 overflow-hidden bg-black/50">
          <img
            src={activeGame.banner}
            alt={activeGame.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1224] via-[#0B1224]/70 to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={closeTopUp}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Game Title & Meta in Banner */}
          <div className="absolute bottom-3 left-4 sm:left-6 z-10 flex items-center gap-3.5">
            <img
              src={activeGame.cover}
              alt={activeGame.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#22D3EE]/80 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#22D3EE] text-black">
                  INSTANT API
                </span>
                <span className="text-[10px] text-amber-400 font-bold">
                  ★ {activeGame.rating.toFixed(1)}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white leading-tight mt-0.5">
                {activeGame.name}
              </h2>
              <p className="text-[11px] text-neutral-400">
                {activeGame.category} • {activeGame.currencyName}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* =============================================================== */}
          {/* STEP 1: ACCOUNT DETAILS                                         */}
          {/* =============================================================== */}
          <div className="bg-[#0F1A35] rounded-2xl border border-[#2B6CFF]/30 p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06] mb-4">
              <span className="w-6 h-6 rounded-lg bg-[#22D3EE] text-black font-black text-xs flex items-center justify-center">
                1
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white">
                  {t.step1Title}
                </h3>
                <p className="text-[10px] text-neutral-400">
                  {t.step1Desc}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {activeGame.accountFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="text-[11px] font-black text-neutral-300 block">
                    {language === 'km' ? field.labelKh : field.label}{' '}
                    <span className="text-red-400">*</span>
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={accountData[field.id] || ''}
                      onChange={(e) => setAccountField(field.id, e.target.value)}
                      className="w-full bg-[#0B1224] border border-[#2B6CFF]/40 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#22D3EE]"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        value={accountData[field.id] || ''}
                        onChange={(e) => setAccountField(field.id, e.target.value)}
                        placeholder={
                          language === 'km'
                            ? field.placeholderKh
                            : field.placeholder
                        }
                        className="w-full bg-[#0B1224] border border-[#2B6CFF]/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#22D3EE]"
                      />
                    </div>
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
                onClick={verifyPlayerId}
                disabled={isVerifying}
                className="px-4 py-2 rounded-xl bg-[#152347] hover:bg-[#1E3060] border border-[#22D3EE]/50 text-[#22D3EE] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{t.verifying}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.verifyBtn}</span>
                  </>
                )}
              </button>

              {verifiedNickname && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {t.verified} <strong className="text-white">{verifiedNickname}</strong>
                  </span>
                </div>
              )}

              {verificationError && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{verificationError}</span>
                </div>
              )}
            </div>
          </div>

          {/* =============================================================== */}
          {/* STEP 2: SELECT PACKAGE                                          */}
          {/* =============================================================== */}
          <div className="bg-[#0F1A35] rounded-2xl border border-[#2B6CFF]/30 p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06] mb-4">
              <span className="w-6 h-6 rounded-lg bg-[#22D3EE] text-black font-black text-xs flex items-center justify-center">
                2
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white">
                  {t.step2Title}
                </h3>
                <p className="text-[10px] text-neutral-400">
                  {t.step2Desc}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {activeGame.packages.map((pkg) => {
                const isSelected = activePackage?.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setActivePackage(pkg)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#152347] border-[#22D3EE] shadow-[0_0_18px_rgba(34,211,238,0.35)] scale-[1.02] ring-1 ring-[#22D3EE]'
                        : 'bg-[#0B1224] border-white/[0.06] hover:border-[#22D3EE]/50 hover:bg-[#111A33]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-base">{activeGame.currencyIcon}</span>
                      {pkg.badge && (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-[#FF7A18] text-black">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-black text-white group-hover:text-[#22D3EE] transition-colors line-clamp-1">
                        {pkg.label}
                      </p>
                      {pkg.bonus > 0 && (
                        <span className="text-[9px] font-bold text-emerald-400 block mt-0.5">
                          +{pkg.bonus} Bonus Included
                        </span>
                      )}
                      <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/[0.04]">
                        <span className="text-xs font-mono font-black text-amber-300">
                          ${pkg.priceUSD.toFixed(2)}
                        </span>
                        <span className="text-[9px] text-neutral-400 font-mono">
                          {pkg.priceKHR.toLocaleString()} ៛
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =============================================================== */}
          {/* STEP 3: PAYMENT METHOD                                          */}
          {/* =============================================================== */}
          <div className="bg-[#0F1A35] rounded-2xl border border-[#2B6CFF]/30 p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06] mb-4">
              <span className="w-6 h-6 rounded-lg bg-[#22D3EE] text-black font-black text-xs flex items-center justify-center">
                3
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white">
                  {t.step3Title}
                </h3>
                <p className="text-[10px] text-neutral-400">
                  {t.step3Desc}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethodId === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethodId(method.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#152347] border-[#22D3EE] shadow-[0_0_18px_rgba(34,211,238,0.25)] ring-1 ring-[#22D3EE]'
                        : 'bg-[#0B1224] border-white/[0.06] hover:border-white/[0.2]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${method.iconBg} ${method.iconColor}`}
                    >
                      <QrCode className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-white truncate">
                          {language === 'km' ? method.nameKh : method.name}
                        </span>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded ${method.badgeColor}`}>
                          {method.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                        {language === 'km' ? method.tagKh : method.tag}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =============================================================== */}
          {/* STEP 4: CONTACT & PROMO CODE                                    */}
          {/* =============================================================== */}
          <div className="bg-[#0F1A35] rounded-2xl border border-[#2B6CFF]/30 p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06] mb-4">
              <span className="w-6 h-6 rounded-lg bg-[#22D3EE] text-black font-black text-xs flex items-center justify-center">
                4
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white">
                  {t.step4Title}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 block mb-1">
                  Contact Info (Optional)
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder={t.contactPlaceholder}
                  className="w-full bg-[#0B1224] border border-[#2B6CFF]/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#22D3EE]"
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
                    placeholder={t.promoPlaceholder}
                    className="flex-1 bg-[#0B1224] border border-[#2B6CFF]/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 uppercase focus:outline-none focus:border-[#22D3EE]"
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="px-4 py-2.5 rounded-xl bg-[#22D3EE] text-black font-black text-xs hover:bg-[#38BDF8] transition-all cursor-pointer"
                  >
                    {t.applyPromo}
                  </button>
                </div>
                {promoMessage && (
                  <span
                    className={`text-[10px] font-bold block mt-1 ${
                      promoDiscountPercent > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {promoMessage}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Order Summary & Proceed Bar */}
        <div className="p-4 sm:p-5 bg-[#070B17] border-t border-[#2B6CFF]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                {t.total}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  ${currentPriceUSD.toFixed(2)}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  ≈ {currentPriceKHR.toLocaleString()} ៛
                </span>
              </div>
            </div>

            {promoDiscountPercent > 0 && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                10% OFF
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={closeTopUp}
              className="px-5 py-3 rounded-xl bg-[#0F1A35] hover:bg-[#152347] border border-white/10 text-neutral-300 font-bold text-xs cursor-pointer"
            >
              {t.close}
            </button>

            <button
              type="button"
              onClick={submitOrder}
              disabled={!activePackage}
              className="flex-1 sm:flex-initial px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF7A18] via-[#FF8A00] to-[#FFA000] hover:from-[#FF8A00] hover:to-[#FFB000] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(255,122,24,0.45)] hover:shadow-[0_0_28px_rgba(255,122,24,0.65)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t.payNow}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

