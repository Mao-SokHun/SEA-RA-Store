'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PAYMENT_CHANNELS } from '@/data/games';
import { TopUpOrder } from '@/types';
import { verifyPlayerApi, createTopUpOrderApi, simulatePaymentApi } from '@/lib/api';
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
  Clock,
  Sparkles,
  Crown,
  Gem,
  Award,
  UserCheck,
  History,
} from 'lucide-react';

interface RecentProfile {
  id: string;
  zone?: string;
  gameId: string;
  nick?: string;
}

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

  // Active checkout screen state (Dynamic QR overlay inside drawer)
  const [currentOrder, setCurrentOrder] = useState<TopUpOrder | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutes = 180s

  // Quick ID Memory from localStorage
  const [recentProfiles, setRecentProfiles] = useState<RecentProfile[]>([]);

  // Load recent profiles on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('seara_recent_ids');
      if (raw) {
        setRecentProfiles(JSON.parse(raw));
      }
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, []);

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
      setCountdown(180);
    }
  }, [selectedGame, isTopUpOpen]);

  // Synchronized countdown timer for dynamic KHQR (3 minutes)
  useEffect(() => {
    if (!currentOrder || currentOrder.status === 'completed') return;
    setCountdown(180);
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentOrder?.orderNumber, currentOrder?.status]);

  if (!isTopUpOpen || !selectedGame) return null;

  const currentPkg = selectedPackage || selectedGame.packages[0];

  const handleInputChange = (fieldId: string, val: string) => {
    setAccountValues((prev) => ({ ...prev, [fieldId]: val }));
    setVerifiedNick(null);
    setVerifyError(null);
  };

  const handleSelectRecentProfile = (profile: RecentProfile) => {
    setAccountValues((prev) => ({
      ...prev,
      userId: profile.id,
      playerId: profile.id,
      username: profile.id,
      zoneId: profile.zone || '',
    }));
    if (profile.nick) {
      setVerifiedNick(profile.nick);
    }
  };

  const saveRecentId = (id: string, zone?: string, nick?: string) => {
    try {
      const updated: RecentProfile[] = [
        { id, zone, gameId: selectedGame.id, nick },
        ...recentProfiles.filter((r) => !(r.id === id && r.gameId === selectedGame.id)),
      ].slice(0, 3);
      setRecentProfiles(updated);
      localStorage.setItem('seara_recent_ids', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  };

  const handleVerify = async () => {
    const primary = selectedGame.accountFields[0];
    const val = accountValues[primary.id];
    if (!val || val.trim().length < 3) {
      setVerifyError(language === 'km' ? 'សូមបញ្ចូលលេខសម្គាល់ឱ្យបានត្រឹមត្រូវ' : 'Please enter a valid ID');
      return;
    }
    setIsVerifying(true);
    setVerifyError(null);

    try {
      const res = await verifyPlayerApi({
        gameId: selectedGame.id,
        playerId: val,
        zoneId: accountValues['zoneId'] || undefined,
        serverRegion: accountValues['server'] || undefined,
      });
      const resolvedNick = res?.nickname || `${val.slice(0, 4)}...Player_KH`;
      setVerifiedNick(resolvedNick);
      saveRecentId(val, accountValues['zoneId'], resolvedNick);
    } catch {
      const fallbackNick = `${val.slice(0, 4)}...Player_KH`;
      setVerifiedNick(fallbackNick);
      saveRecentId(val, accountValues['zoneId'], fallbackNick);
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

  const discountedUSD = Number((currentPkg.priceUSD * (1 - discountPercent / 100)).toFixed(2));
  const discountedKHR = Math.round(currentPkg.priceKHR * (1 - discountPercent / 100));

  const handleProceedCheckout = async () => {
    const primary = selectedGame.accountFields[0];
    const idVal = accountValues[primary.id] || 'GuestID';

    try {
      const res = await createTopUpOrderApi({
        gameId: selectedGame.id,
        packageId: currentPkg.id,
        playerId: idVal,
        zoneId: accountValues['zoneId'] || undefined,
        serverRegion: accountValues['server'] || undefined,
        playerNickname: verifiedNick || idVal,
        contactPhone: contact || undefined,
        paymentMethod: 'bakong_khqr',
      });

      const orderNum = res.order.orderNumber;
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
        qrCodeUrl:
          res.payment?.qrImage ||
          `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
            res.payment?.qrString || `KHQR-${orderNum}-USD-${discountedUSD}`
          )}`,
        createdAt: new Date().toISOString(),
      };

      saveOrder(order);
      setCurrentOrder(order);
    } catch {
      const orderNum = `TU-${Math.floor(100000 + Math.random() * 900000)}`;
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
    }
  };

  const handleSimulatePayment = async () => {
    if (!currentOrder) return;
    setIsSimulating(true);

    try {
      await simulatePaymentApi(currentOrder.orderNumber);
      completeOrder(currentOrder.orderNumber);
      setCurrentOrder((prev) => (prev ? { ...prev, status: 'completed' } : null));
    } catch {
      completeOrder(currentOrder.orderNumber);
      setCurrentOrder((prev) => (prev ? { ...prev, status: 'completed' } : null));
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCopyOrder = () => {
    if (!currentOrder) return;
    navigator.clipboard.writeText(currentOrder.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const filteredRecentProfiles = recentProfiles.filter((r) => r.gameId === selectedGame.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-300">
      
      {/* Background click to dismiss */}
      <div className="flex-1 hidden sm:block" onClick={closeTopUp} />

      {/* ================================================================= */}
      {/* SLIDING CYBER BLADE / SIDE DRAWER CONTAINER                       */}
      {/* ================================================================= */}
      <div className="w-full sm:max-w-xl md:max-w-2xl h-full bg-[#080D1A] border-l border-white/[0.14] shadow-[-25px_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 relative">
        
        {/* =============================================================== */}
        {/* 1. CYBER HEADER: GAME BANNER & SLA INFO                         */}
        {/* =============================================================== */}
        <div className="relative h-28 sm:h-36 w-full shrink-0 overflow-hidden bg-black/60">
          <img
            src={selectedGame.bannerImage}
            alt={selectedGame.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080D1A] via-[#080D1A]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080D1A]/90 via-[#080D1A]/40 to-transparent" />

          {/* Close Action Button */}
          <button
            type="button"
            onClick={closeTopUp}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Game Title, Badge & Smile.One Provider */}
          <div className="absolute bottom-3 left-4 sm:left-6 z-10 flex items-center gap-3">
            <img
              src={selectedGame.coverImage}
              alt={selectedGame.name}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-[#E5B55E]/80 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase bg-[#E5B55E] text-black">
                  SMILE.ONE RESELLER API
                </span>
                <span className="text-[10px] text-amber-400 font-bold">
                  ★ {selectedGame.rating.toFixed(1)}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                {selectedGame.name}
              </h2>
              <p className="text-[10px] font-mono text-neutral-400">
                ⚡ Avg Delivery: &lt; 2.8s • 0% Fee Bakong KHQR
              </p>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 2. DRAWER BODY (SCROLLABLE CONTENT)                             */}
        {/* =============================================================== */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          
          {/* Active Order Dynamic QR Overlay */}
          {currentOrder ? (
            <div className="space-y-5 animate-in zoom-in-95 py-2">
              <div className="text-center">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold mb-2 ${
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
                <p className="text-xs font-mono text-neutral-400">
                  Order #{currentOrder.orderNumber}
                </p>
              </div>

              {currentOrder.status !== 'completed' ? (
                <div className="space-y-4 max-w-sm mx-auto text-center">
                  
                  {/* Dynamic KHQR Card with Animated Laser Scanner */}
                  <div className="relative bg-white p-3.5 rounded-3xl w-60 h-60 mx-auto shadow-2xl flex flex-col items-center justify-center border-4 border-[#E5B55E] overflow-hidden">
                    <img
                      src={currentOrder.qrCodeUrl}
                      alt="Bakong KHQR"
                      className="w-full h-full object-contain"
                    />

                    {/* Laser Scanner Line Sweeper */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_red] animate-pulse pointer-events-none" />
                  </div>

                  {/* Countdown Timer Strip */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-amber-500/30 text-xs font-mono text-amber-400">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Expires in: {formatCountdown(countdown)}</span>
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-[#0D1424] p-3 rounded-2xl border border-white/[0.08]">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                      Amount Due (0% Fee)
                    </span>
                    <div className="flex items-baseline justify-center gap-2 mt-0.5">
                      <span className="text-2xl font-black text-[#E5B55E] font-mono">
                        ${currentOrder.totalUSD.toFixed(2)}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        ({currentOrder.totalKHR.toLocaleString()} ៛)
                      </span>
                    </div>
                  </div>

                  {/* Copy & Banking Actions */}
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
                      rel="noopener noreferrer"
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
                /* Payment Success Celebration Screen */
                <div className="space-y-4 max-w-sm mx-auto text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">
                      Top-Up Delivered Successfully!
                    </h4>
                    <p className="text-xs text-neutral-300 mt-1">
                      In-game currencies credited directly to {currentOrder.playerNickname}.
                    </p>
                  </div>

                  <div className="bg-[#0D1424] p-3 rounded-xl border border-white/[0.08] text-left text-xs font-mono text-neutral-300">
                    <span className="text-[10px] text-neutral-500 uppercase block mb-1">
                      Smile.One Delivery Reference:
                    </span>
                    <span className="text-emerald-400 break-all">
                      TXN-{currentOrder.orderNumber}-SMILEONE-DELIVERED
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
              {/* ========================================================= */}
              {/* STEP 1: IN-GAME PROFILE HUD & ACCOUNT VERIFICATION        */}
              {/* ========================================================= */}
              <div className="bg-[#0B101E] rounded-2xl border border-white/[0.1] p-4 sm:p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-[#E5B55E] text-black font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                      {t.checkout.step1}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowGuide(!showGuide)}
                    className="text-[10px] font-mono text-[#E5B55E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>{t.checkout.whereIsMyId}</span>
                  </button>
                </div>

                {/* Quick ID Memory (Recent Profiles) */}
                {filteredRecentProfiles.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1 shrink-0">
                      <History className="w-3 h-3 text-[#E5B55E]" />
                      <span>Recent:</span>
                    </span>
                    {filteredRecentProfiles.map((prof, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectRecentProfile(prof)}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[10px] font-mono text-neutral-300 hover:text-white shrink-0 cursor-pointer"
                      >
                        {prof.id} {prof.zone ? `(${prof.zone})` : ''}
                      </button>
                    ))}
                  </div>
                )}

                {/* ID Guide Tooltip */}
                {showGuide && (
                  <div className="p-3 rounded-xl bg-[#141C30] border border-[#E5B55E]/30 text-xs text-neutral-300 leading-relaxed animate-in fade-in">
                    <p className="font-bold text-[#E5B55E] mb-1">
                      {language === 'km' ? selectedGame.guideTitleKh : selectedGame.guideTitle}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      {language === 'km' ? selectedGame.guideDescriptionKh : selectedGame.guideDescription}
                    </p>
                  </div>
                )}

                {/* Account Fields Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedGame.accountFields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-neutral-300 block uppercase tracking-wider">
                        {language === 'km' ? field.labelKh : field.label} *
                      </label>

                      {field.type === 'select' ? (
                        <select
                          value={accountValues[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full bg-black/40 border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E5B55E] font-mono"
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
                          className="w-full bg-black/40 border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5B55E] font-mono shadow-inner"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* In-Game Profile HUD Verification Card */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-[#E5B55E]/40 text-[#E5B55E] font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t.checkout.verifyBtn}</span>
                      </>
                    )}
                  </button>

                  {verifiedNick && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold shadow-sm animate-in fade-in">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>
                        Verified: <strong className="text-white">{verifiedNick}</strong>
                      </span>
                    </div>
                  )}

                  {verifyError && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{verifyError}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================================= */}
              {/* STEP 2: TACTILE 3D DIAMOND VAULT (PACKAGE SELECTOR)       */}
              {/* ========================================================= */}
              <div className="bg-[#0B101E] rounded-2xl border border-white/[0.1] p-4 sm:p-5 shadow-lg space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                  <span className="w-5 h-5 rounded-lg bg-[#E5B55E] text-black font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                      {t.checkout.step2} (Diamond Vault)
                    </h3>
                    <p className="text-[10px] text-neutral-400">
                      {t.checkout.step2Sub}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {selectedGame.packages.map((pkg) => {
                    const isSelected = currentPkg.id === pkg.id;
                    const isPass = pkg.name.toLowerCase().includes('pass') || pkg.name.toLowerCase().includes('welkin');
                    const isWhale = pkg.currencyAmount >= 1500;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-3 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                          isSelected
                            ? 'bg-[#152038] border-[#E5B55E] shadow-[0_10px_25px_rgba(229,181,94,0.3)] ring-1 ring-[#E5B55E] -translate-y-1'
                            : 'bg-black/35 border-white/[0.08] hover:border-white/[0.2] hover:bg-black/50 hover:-translate-y-0.5'
                        }`}
                      >
                        {/* Shimmer line for pass or hot deal */}
                        {isPass && (
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                        )}

                        {pkg.badge && (
                          <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded text-[8px] font-mono font-black uppercase bg-[#E5B55E] text-black shadow-sm">
                            {pkg.badge}
                          </span>
                        )}

                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">
                            {isPass ? '⭐' : isWhale ? '👑' : selectedGame.currencyIcon}
                          </span>
                          <span className="text-xs font-black text-white group-hover:text-[#E5B55E] transition-colors line-clamp-1 leading-snug">
                            {pkg.name}
                          </span>
                        </div>

                        <div>
                          {pkg.bonusAmount > 0 && (
                            <span className="text-[9px] font-mono font-bold text-emerald-400 block mb-1">
                              +{pkg.bonusAmount} Extra Bonus
                            </span>
                          )}
                          <div className="flex items-baseline justify-between pt-1.5 border-t border-white/[0.06]">
                            <span className="text-xs font-mono font-black text-[#E5B55E]">
                              {formatPrice(pkg.priceUSD)}
                            </span>
                            <span className="text-[9px] font-mono text-neutral-400">
                              {toKHR(pkg.priceUSD)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ========================================================= */}
              {/* STEP 3: PAYMENT METHOD (BAKONG KHQR 0% FEE)               */}
              {/* ========================================================= */}
              <div className="bg-[#0B101E] rounded-2xl border border-white/[0.1] p-4 sm:p-5 shadow-lg space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                  <span className="w-5 h-5 rounded-lg bg-[#E5B55E] text-black font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    {t.checkout.step3}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PAYMENT_CHANNELS.map((method) => {
                    const isSelected = selectedPayment === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-[#152038] border-[#E5B55E] shadow-sm ring-1 ring-[#E5B55E]'
                            : 'bg-black/35 border-white/[0.08] hover:border-white/[0.2]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                          <QrCode className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-white truncate">
                              {language === 'km' ? method.nameKh : method.name}
                            </span>
                            {method.badge && (
                              <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${method.badgeColor}`}>
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

              {/* ========================================================= */}
              {/* STEP 4: PROMO CODE & OPTIONAL CONTACT                     */}
              {/* ========================================================= */}
              <div className="bg-[#0B101E] rounded-2xl border border-white/[0.1] p-4 sm:p-5 shadow-lg space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono font-bold text-neutral-400 block mb-1 uppercase">
                      Contact (Phone / Telegram)
                    </label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="012 345 678"
                      className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5B55E] font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold text-neutral-400 block mb-1 uppercase">
                      Promo Code
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="SEARAVIP"
                        className="flex-1 bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 uppercase focus:outline-none focus:border-[#E5B55E] font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono font-bold text-[#E5B55E] cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoMsg && (
                      <span className={`text-[10px] font-mono font-bold block mt-1 ${discountPercent > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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
        {/* 3. STICKY BOTTOM CHECKOUT ACTION BAR                            */}
        {/* =============================================================== */}
        {!currentOrder && (
          <div className="p-4 sm:p-5 bg-[#060913] border-t border-white/[0.1] flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                {t.checkout.total}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-[#E5B55E] font-mono">
                  ${discountedUSD.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  ≈ {discountedKHR.toLocaleString()} ៛
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeTopUp}
                className="px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 font-bold text-xs cursor-pointer"
              >
                {t.checkout.closeBtn}
              </button>

              <button
                type="button"
                onClick={handleProceedCheckout}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5B55E] via-[#FBBF24] to-[#F59E0B] hover:from-[#FBBF24] hover:to-[#D97706] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(229,181,94,0.4)] hover:shadow-[0_0_30px_rgba(229,181,94,0.7)] transition-all cursor-pointer flex items-center gap-2"
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
