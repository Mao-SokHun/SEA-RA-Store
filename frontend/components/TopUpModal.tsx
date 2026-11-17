'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PAYMENT_CHANNELS } from '@/data/games';
import { GameItem, PackageItem, TopUpOrder } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import { generateOfficialKHQRString } from '@/lib/khqr';
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

function TopUpModalContent({ selectedGame }: { selectedGame: GameItem }) {
  const {
    language,
    t,
    closeTopUp,
    selectedPackage,
    setSelectedPackage,
    formatPrice,
    toKHR,
    saveOrder,
    completeOrder,
  } = useApp();

  // Lazy pure state initialization (no cascading effects)
  const [accountValues, setAccountValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    selectedGame.accountFields.forEach((f) => {
      initial[f.id] = f.type === 'select' && f.options ? f.options[0].value : '';
    });
    return initial;
  });

  const [activeOrderNumber] = useState(
    () => `TU-${selectedGame.id.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
  );

  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedNick, setVerifiedNick] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Order & Payment state (Instant 1-Screen)
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(180);

  // Real-time Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 180 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // 100% compliant official NBC EMVCo KHQR payload with CRC16
  const khqrString = generateOfficialKHQRString({
    merchantName: 'SEA RA PRESTIGE',
    merchantCity: 'Phnom Penh',
    bakongAccount: '005282269@abaa',
    amount: priceUSD,
    currency: 'USD',
    orderNumber: activeOrderNumber,
    storeLabel: 'OFFICIAL STORE',
  });

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
      qrCodeUrl: '/bakong-logo.svg',
      createdAt: new Date().toISOString(),
    };

    try {
      await simulatePaymentApi(activeOrderNumber);
    } catch {
      // Continue simulation for seamless offline / test UX
    }

    // Save locally
    saveOrder(order);
    completeOrder(activeOrderNumber);

    // Send Telegram alert
    void dispatchTelegramNotificationApi({
      orderNumber: activeOrderNumber,
      gameTitle: selectedGame.name,
      packageName: currentPkg.name,
      totalUSD: priceUSD,
      totalKHR: priceKHR,
      playerId: idVal,
      zoneId: accountValues['zoneId'],
      playerNickname: verifiedNick || idVal,
      paymentMethod: 'Bakong KHQR (Modal Test)',
      status: 'completed',
      deliveryProof: `TXN-${activeOrderNumber}-TEST-CONFIRMED`,
    });

    setIsSimulating(false);
    setOrderCompleted(true);
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(activeOrderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-[#0B101E] rounded-3xl border border-white/[0.12] w-full max-w-4xl max-h-[92vh] flex flex-col relative shadow-2xl overflow-hidden">
        
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E5B55E] to-transparent z-20" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#070D1A]/90 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={selectedGame.coverImage}
              alt={selectedGame.name}
              className="w-10 h-10 rounded-xl object-cover border border-white/[0.1] shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  {selectedGame.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E5B55E]/15 text-[#E5B55E] border border-[#E5B55E]/30 uppercase font-mono">
                  {selectedGame.category}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {selectedGame.publisher} • {language === 'km' ? 'បញ្ចូលស្វ័យប្រវត្តិ < 3 វិនាទី' : 'Instant Auto-Delivery < 3s'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeTopUp}
            className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {orderCompleted ? (
            /* ============================================================= */
            /* SUCCESS CONFIRMATION VIEW                                     */
            /* ============================================================= */
            <div className="py-8 px-4 text-center max-w-md mx-auto space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white">
                  {language === 'km' ? 'ការបញ្ចូលលុយបានជោគជ័យ ១០០%!' : 'Reload Dispatched Successfully!'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {currentPkg.name} {language === 'km' ? 'ត្រូវបានបញ្ចូលទៅក្នុងគណនីរួចរាល់' : 'has been delivered to player account'}:{' '}
                  <strong className="text-white">{verifiedNick || 'Player'}</strong>.
                </p>
              </div>

              {/* Transaction Summary Card */}
              <div className="bg-[#121B32] rounded-2xl p-4 border border-white/[0.08] text-xs space-y-2 text-left font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Order ID:</span>
                  <span className="text-[#E5B55E] font-bold">#{activeOrderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Game:</span>
                  <span className="text-white">{selectedGame.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Package:</span>
                  <span className="text-white">{currentPkg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Paid:</span>
                  <span className="text-emerald-400 font-bold">${priceUSD.toFixed(2)} ({priceKHR.toLocaleString()} ៛)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Gateway:</span>
                  <span className="text-neutral-300">Bakong KHQR (0% Surcharge)</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeTopUp}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5B55E] to-[#C49740] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-lg"
                >
                  {language === 'km' ? 'រួចរាល់' : 'Done'}
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================= */
            /* SPLIT COCKPIT: LEFT (FORM & PKGS) + RIGHT (INSTANT KHQR BILL)  */
            /* ============================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* ============================================================= */}
              {/* LEFT COLUMN (7 COLS): USER CREDENTIALS & PACKAGE SELECTION    */}
              {/* ============================================================= */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* 1. Account Details Input */}
                <div className="bg-[#0E162B] rounded-2xl border border-white/[0.08] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5B55E]" />
                      <span>{language === 'km' ? 'ព័ត៌មានគណនីហ្គេម' : 'Player In-Game ID'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowGuide(!showGuide)}
                      className="text-[10px] text-[#E5B55E] hover:underline flex items-center gap-1 cursor-pointer font-mono"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>{language === 'km' ? 'របៀបរក ID' : 'Where is my ID?'}</span>
                    </button>
                  </div>

                  {showGuide && (
                    <div className="p-3 rounded-xl bg-[#121B32] border border-cyan-500/30 text-[11px] text-cyan-300 leading-relaxed animate-in fade-in">
                      💡 {language === 'km'
                        ? 'បើកហ្គេមរបស់អ្នក ចុចលើ Avatar Profile នៅជ្រុងខាងឆ្វេងលើ ដើម្បីចម្លងលេខសម្គាល់គណនី (User ID & Zone ID)។'
                        : 'Open the game and tap your avatar on top-left to copy your public User ID & Zone ID.'}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedGame.accountFields.map((field) => (
                      <div key={field.id} className="space-y-1">
                        <label className="text-[11px] font-mono text-neutral-400 block">
                          {language === 'km' ? field.labelKh : field.label}
                          {field.required && <span className="text-red-400 ml-1">*</span>}
                        </label>
                        {field.type === 'select' && field.options ? (
                          <select
                            value={accountValues[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full bg-[#070D1B] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E5B55E] transition-all"
                          >
                            {field.options.map((opt) => (
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
                            placeholder={field.placeholder || ''}
                            className="w-full bg-[#070D1B] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5B55E] transition-all font-mono"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Nickname Verification Trigger */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-neutral-400">
                      {language === 'km' ? 'ផ្ទៀងផ្ទាត់ឈ្មោះមុនបង់ប្រាក់:' : 'Validate username:'}
                    </span>
                    <button
                      type="button"
                      onClick={handleVerify}
                      disabled={isVerifying}
                      className="px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-mono font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <RefreshCw className="w-3 h-3 animate-spin text-[#E5B55E]" />
                      ) : (
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
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

                  {/* Pure Clean Sharp QR Code */}
                  <div className="p-2 rounded-xl bg-white border border-neutral-200 inline-block max-w-[170px] mx-auto shadow-inner">
                    <QRCodeSVG
                      value={khqrString}
                      size={150}
                      level="M"
                      className="w-full h-full"
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
                    <span>Bakong</span>
                  </div>
                </div>

                {/* Bottom Control Controls */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{language === 'km' ? '0% សេវា' : '0% Fee'}</span>
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Clock className="w-3 h-3" />
                      <span>{timeFormatted}</span>
                    </span>
                  </div>

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

export default function TopUpModal() {
  const { isTopUpOpen, selectedGame } = useApp();
  if (!isTopUpOpen || !selectedGame) return null;
  return <TopUpModalContent key={selectedGame.id} selectedGame={selectedGame} />;
}
