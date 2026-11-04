'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowLeft,
  QrCode,
  HelpCircle,
  X,
  Clock,
  Check,
  Share2,
  Printer,
  Download,
} from 'lucide-react';
import { useTopUp } from '@/context/TopUpContext';
import { ALL_GAMES, PAYMENT_METHODS } from '@/data/gamesData';
import { GameItem, GamePackage, PaymentMethod } from '@/types';

export default function TopUpClient({ slug }: { slug: string }) {
  const { currency, formatPrice } = useTopUp();

  // Find game from ALL_GAMES or fallback
  const game: GameItem =
    ALL_GAMES.find((g) => g.slug === slug || g.id === slug) || ALL_GAMES[0];

  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<GamePackage>(game.packages[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);

  // Modals
  const [showIdHelp, setShowIdHelp] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'pending' | 'verifying' | 'delivered'>('pending');
  const [countdown, setCountdown] = useState(600); // 10 minutes

  // Countdown timer for KHQR
  useEffect(() => {
    if (!showQrModal || orderStatus === 'delivered') return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showQrModal, orderStatus]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = () => {
    if (!userId.trim()) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedName('Slayer_Pro_KH (ID Verified ✓)');
    }, 700);
  };

  const handleStartPayment = () => {
    if (!userId.trim()) return;
    setOrderStatus('pending');
    setCountdown(600);
    setShowQrModal(true);
  };

  const handleSimulatePayment = () => {
    setOrderStatus('verifying');
    setTimeout(() => {
      setOrderStatus('delivered');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between select-none">
      <Navbar />

      <main className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex-1">
        
        {/* ── Breadcrumbs ── */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#7F92B0]">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-[#00F2FE] transition-colors font-heading uppercase"
          >
            <ArrowLeft size={13} />
            <span>Home</span>
          </Link>
          <span className="text-[#3D4C63]">/</span>
          <span className="text-neutral-400 font-heading uppercase">Direct Top-Up</span>
          <span className="text-[#3D4C63]">/</span>
          <span className="text-white font-heading font-bold">{game.name}</span>
        </div>

        {/* ── Game Hero Panorama Banner ── */}
        <div className="relative rounded-2xl overflow-hidden mb-8 border border-[#152248] bg-[#0A1026] shadow-2xl">
          <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-[#050C1E]">
            <img
              src={game.banner}
              alt={game.name}
              className="w-full h-full object-cover object-center"
              style={{ filter: 'brightness(0.6) contrast(1.15)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026] via-[#0A1026]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-[#030712]/50 to-transparent" />

            {/* Info Overlay */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between flex-wrap gap-4 z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#070D1F] border-2 border-[#00F2FE]/70 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(0,242,254,0.35)] shrink-0">
                  {game.currencyIcon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-heading font-black bg-[#00F2FE]/15 border border-[#00F2FE]/30 text-[#00F2FE] uppercase tracking-wider">
                      OFFICIAL DIRECT API
                    </span>
                    <span className="text-xs text-amber-400 font-heading font-bold">
                      ★ {game.rating} ({game.reviewsCount})
                    </span>
                  </div>
                  <h1 className="font-heading font-black text-xl sm:text-3xl text-white">
                    {game.name}
                  </h1>
                  <p className="text-xs text-[#7F92B0] mt-0.5 font-body">
                    {game.developer} • 3-Second Automatic Delivery via Bakong KHQR
                  </p>
                </div>
              </div>

              {/* Online SLA Badge */}
              <div className="hidden md:flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-[#030712]/80 border border-[#00F2FE]/20 backdrop-blur-md text-right">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-heading font-bold uppercase">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>API Server Online</span>
                  </div>
                  <span className="text-[10px] text-[#5A6E8D] font-mono">Response Speed: 0.6s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Two-Column Top-Up Cockpit ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Multi-Step Top-Up Flow */}
          <div className="lg:col-span-2 space-y-6">

            {/* =============================================================== */}
            {/* STEP 1: Player Credentials Input                                 */}
            {/* =============================================================== */}
            <div className="p-6 rounded-2xl bg-[#0A1026] border border-[#152248] shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00F2FE] to-[#0072FF] text-black font-heading font-black text-sm flex items-center justify-center shadow-[0_0_12px_#00F2FE]">
                    1
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider">
                      STEP 1: Enter Player Credentials
                    </h3>
                    <p className="text-xs text-[#7F92B0]">
                      Provide your User ID to verify your in-game nickname (IGN)
                    </p>
                  </div>
                </div>

                {/* Where to find ID Guide Button */}
                <button
                  type="button"
                  onClick={() => setShowIdHelp(true)}
                  className="flex items-center gap-1 text-xs text-[#00F2FE] hover:underline font-heading font-bold cursor-pointer"
                >
                  <HelpCircle size={14} />
                  <span>Where is my ID?</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#94A3B8] mb-1.5 uppercase">
                    User ID *
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => {
                      setUserId(e.target.value);
                      setVerifiedName(null);
                    }}
                    placeholder="e.g. 12345678"
                    className="w-full bg-[#050C1E] border border-[#152248] focus:border-[#00F2FE] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#4E6180] outline-none font-mono transition-all"
                  />
                  <span className="block text-[10px] text-[#5A6E8D] mt-1 font-body">
                    Located in Game Profile &gt; Basic Info
                  </span>
                </div>

                {game.requiresZoneId && (
                  <div>
                    <label className="block text-xs font-heading font-bold text-[#94A3B8] mb-1.5 uppercase">
                      Server / Zone ID *
                    </label>
                    <input
                      type="text"
                      value={zoneId}
                      onChange={(e) => {
                        setZoneId(e.target.value);
                        setVerifiedName(null);
                      }}
                      placeholder="e.g. 2001 (or Asia)"
                      className="w-full bg-[#050C1E] border border-[#152248] focus:border-[#00F2FE] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#4E6180] outline-none font-mono transition-all"
                    />
                    <span className="block text-[10px] text-[#5A6E8D] mt-1 font-body">
                      Numbers in bracket e.g. (2001) or Region
                    </span>
                  </div>
                )}
              </div>

              {/* Verify Button & Status */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={!userId.trim() || isVerifying}
                  className="px-4 py-2 rounded-xl bg-[#00F2FE]/15 hover:bg-[#00F2FE] border border-[#00F2FE]/40 text-[#00F2FE] hover:text-black font-heading text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isVerifying ? 'Checking API...' : '🔍 Check & Verify ID'}
                </button>

                {verifiedName && (
                  <span className="text-xs text-emerald-400 font-heading font-bold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 size={14} />
                    {verifiedName}
                  </span>
                )}
              </div>
            </div>

            {/* =============================================================== */}
            {/* STEP 2: Select Recharge Package / SKU                            */}
            {/* =============================================================== */}
            <div className="p-6 rounded-2xl bg-[#0A1026] border border-[#152248] shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00F2FE] to-[#0072FF] text-black font-heading font-black text-sm flex items-center justify-center shadow-[0_0_12px_#00F2FE]">
                  2
                </span>
                <div>
                  <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider">
                    STEP 2: Select Denomination Package
                  </h3>
                  <p className="text-xs text-[#7F92B0]">
                    Select your desired diamonds, currency, or battle pass package
                  </p>
                </div>
              </div>

              {/* Packages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {game.packages.map((pkg) => {
                  const isSelected = selectedPackage.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative p-3.5 rounded-xl cursor-pointer transition-all border flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#00F2FE]/15 border-[#00F2FE] shadow-[0_0_20px_rgba(0,242,254,0.35)] -translate-y-1'
                          : 'bg-[#050C1E] border-[#152248] hover:border-[#00F2FE]/50'
                      }`}
                    >
                      {pkg.badge && (
                        <div
                          className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[9px] font-heading font-black text-white shadow-md uppercase tracking-wider"
                          style={{ background: pkg.badgeColor || '#FF5500' }}
                        >
                          {pkg.badge}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-base">{game.currencyIcon}</span>
                          <span className="font-heading font-black text-sm text-white">
                            {pkg.name}
                          </span>
                        </div>

                        {pkg.bonus ? (
                          <span className="inline-block text-[10px] text-emerald-400 font-heading font-bold mb-2">
                            +{pkg.bonus} Bonus Diamonds
                          </span>
                        ) : (
                          <span className="inline-block text-[10px] text-[#5A6E8D] font-heading mb-2">
                            Standard Package
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#152248] flex items-center justify-between">
                        <span className="font-heading font-black text-sm text-[#00F2FE]">
                          {formatPrice(pkg.priceUSD)}
                        </span>
                        {isSelected && (
                          <CheckCircle2 size={15} className="text-[#00F2FE]" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =============================================================== */}
            {/* STEP 3: Select Payment Method                                    */}
            {/* =============================================================== */}
            <div className="p-6 rounded-2xl bg-[#0A1026] border border-[#152248] shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00F2FE] to-[#0072FF] text-black font-heading font-black text-sm flex items-center justify-center shadow-[0_0_12px_#00F2FE]">
                  3
                </span>
                <div>
                  <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider">
                    STEP 3: Select Payment Method
                  </h3>
                  <p className="text-xs text-[#7F92B0]">
                    Local Cambodian QR and international cards with 0% fee
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = selectedPayment.id === pm.id;
                  return (
                    <div
                      key={pm.id}
                      onClick={() => setSelectedPayment(pm)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#00F2FE]/15 border-[#00F2FE] shadow-[0_0_18px_rgba(0,242,254,0.25)]'
                          : 'bg-[#050C1E] border-[#152248] hover:border-[#00F2FE]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#070D1F] border border-[#152248] flex items-center justify-center text-lg shadow-sm">
                          {pm.iconType === 'bakong' && '🇰🇭'}
                          {pm.iconType === 'aba' && '💳'}
                          {pm.iconType === 'wing' && '🦅'}
                          {pm.iconType === 'visa' && '🌐'}
                          {pm.iconType === 'crypto' && '⚡'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-sm text-white">
                              {pm.name}
                            </span>
                            {pm.badge && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-heading font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {pm.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#7F92B0] block">
                            {pm.subText} • <span className="text-[#00F2FE]">{pm.feeText}</span>
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-[#00F2FE] bg-[#00F2FE]' : 'border-[#4E6180]'
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-black" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Order Summary & Instant Checkout */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-[#0A1026] border border-[#152248] shadow-2xl space-y-4">
              
              <h3 className="font-heading font-bold text-base text-white pb-3 border-b border-[#152248] flex items-center justify-between">
                <span>ORDER SUMMARY</span>
                <span className="text-xs text-[#00F2FE] font-mono">SECURE</span>
              </h3>

              <div className="space-y-3 text-xs border-b border-[#152248] pb-4">
                <div className="flex justify-between text-[#7F92B0]">
                  <span>Game:</span>
                  <span className="text-white font-bold font-heading">{game.name}</span>
                </div>

                <div className="flex justify-between text-[#7F92B0]">
                  <span>Package:</span>
                  <span className="text-white font-bold font-heading">
                    {selectedPackage.name}
                  </span>
                </div>

                <div className="flex justify-between text-[#7F92B0]">
                  <span>User ID:</span>
                  <span className="text-white font-mono font-bold">
                    {userId.trim() || '(Pending)'}
                  </span>
                </div>

                {game.requiresZoneId && (
                  <div className="flex justify-between text-[#7F92B0]">
                    <span>Zone ID:</span>
                    <span className="text-white font-mono font-bold">
                      {zoneId.trim() || '(Pending)'}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[#7F92B0]">
                  <span>Payment Method:</span>
                  <span className="text-emerald-400 font-bold font-heading">
                    {selectedPayment.name}
                  </span>
                </div>

                <div className="flex justify-between text-[#7F92B0]">
                  <span>Processing Fee:</span>
                  <span className="text-emerald-400 font-bold">0% (FREE)</span>
                </div>
              </div>

              {/* Total Price Display */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <span className="block text-xs text-[#7F92B0] font-heading uppercase">
                    Total Payable:
                  </span>
                  <span className="text-[11px] text-[#5A6E8D] font-mono">
                    ≈ {Math.round(selectedPackage.priceUSD * 4100).toLocaleString()} ៛ (KHR)
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-heading font-black text-2xl text-[#00F2FE]">
                    {formatPrice(selectedPackage.priceUSD)}
                  </span>
                </div>
              </div>

              {/* Instant Pay Button */}
              <button
                type="button"
                onClick={handleStartPayment}
                disabled={!userId.trim()}
                className="w-full py-3.5 rounded-xl font-heading font-black text-sm text-white bg-gradient-to-r from-[#FF5500] to-[#E64C00] hover:from-[#FF7A18] hover:to-[#FF5500] shadow-[0_4px_20px_rgba(255,85,0,0.5)] hover:shadow-[0_6px_25px_rgba(255,85,0,0.7)] flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] uppercase tracking-wider"
              >
                <QrCode size={18} />
                <span>Pay Now • {formatPrice(selectedPackage.priceUSD)}</span>
              </button>

              {/* Guarantees */}
              <div className="pt-3 border-t border-[#152248] flex items-center justify-center gap-4 text-[#7F92B0] text-[11px]">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-400" /> 100% Safe
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Zap size={13} className="text-[#00F2FE]" /> 3s Delivery
                </span>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* =================================================================== */}
      {/* MODAL 1: "WHERE TO FIND YOUR ID?"                                   */}
      {/* =================================================================== */}
      {showIdHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none animate-in fade-in">
          <div className="bg-[#0A1026] border border-[#152248] rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowIdHelp(false)}
              className="absolute top-4 right-4 text-[#7F92B0] hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="font-heading font-black text-base text-white uppercase tracking-wider">
              Where to find your Game ID?
            </h3>

            <div className="p-4 rounded-xl bg-[#050C1E] border border-[#152248] space-y-3 text-xs text-[#94A3B8]">
              <p>
                1. Open your game lobby and click your <strong>Avatar / Profile Picture</strong> in the top-left corner.
              </p>
              <p>
                2. Navigate to <strong>&ldquo;Basic Info&rdquo;</strong>.
              </p>
              <p>
                3. Your <strong>User ID</strong> is the long number, and your <strong>Zone ID</strong> is the 4-5 digit number inside brackets. Example: <code className="text-[#00F2FE] font-mono">12345678 (2001)</code>.
              </p>
            </div>

            <button
              onClick={() => setShowIdHelp(false)}
              className="w-full py-2.5 rounded-xl bg-[#00F2FE] text-black font-heading font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: BAKONG KHQR ORDER TIMELINE & INVOICE                       */}
      {/* =================================================================== */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-in fade-in">
          <div className="bg-[#0A1026] border border-[#00F2FE]/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-[#7F92B0] hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-heading font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                BAKONG KHQR ZERO FEE CHECKOUT
              </span>
              <h3 className="font-heading font-black text-lg text-white">
                Scan with any Bank App
              </h3>
              <p className="text-xs text-[#7F92B0]">
                ABA Mobile, Wing Bank, ACLEDA, Canadia, TrueMoney
              </p>
            </div>

            {/* Order Timeline Status */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#152248] text-center text-xs font-heading font-bold">
              <div className="text-emerald-400">
                <span className="block text-[10px] text-[#5A6E8D]">STEP 1</span>
                <span>✓ ID Verified</span>
              </div>
              <div className={orderStatus === 'pending' ? 'text-[#00F2FE] animate-pulse' : 'text-emerald-400'}>
                <span className="block text-[10px] text-[#5A6E8D]">STEP 2</span>
                <span>{orderStatus === 'pending' ? '● Awaiting Pay' : '✓ Paid'}</span>
              </div>
              <div className={orderStatus === 'delivered' ? 'text-emerald-400' : 'text-[#5A6E8D]'}>
                <span className="block text-[10px] text-[#5A6E8D]">STEP 3</span>
                <span>{orderStatus === 'delivered' ? '✓ Delivered' : 'Processing'}</span>
              </div>
            </div>

            {orderStatus !== 'delivered' ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Dynamic QR Display */}
                <div className="p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center relative">
                  <div className="w-48 h-48 bg-neutral-900 rounded-xl flex items-center justify-center p-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bakong://pay?merchant=GameVerseKH&amount=${selectedPackage.priceUSD}&currency=USD`}
                      alt="Bakong KHQR Code"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="mt-2 text-center text-neutral-800 font-heading font-bold text-xs uppercase tracking-wider">
                    BAKONG KHQR • {formatPrice(selectedPackage.priceUSD)}
                  </div>
                </div>

                {/* Countdown */}
                <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-mono">
                  <Clock size={14} className="text-[#00F2FE]" />
                  <span>QR Code expires in: <strong className="text-white">{formatTimer(countdown)}</strong></span>
                </div>

                {/* Simulate Payment for Testing */}
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                >
                  Simulate Bank Transfer (Instant Complete)
                </button>
              </div>
            ) : (
              /* Success / Delivered Screen */
              <div className="text-center space-y-4 py-4 animate-in zoom-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                  <Check size={32} />
                </div>

                <div>
                  <h4 className="font-heading font-black text-xl text-white uppercase">
                    Items Delivered Successfully!
                  </h4>
                  <p className="text-xs text-[#7F92B0] mt-1">
                    Your {selectedPackage.name} has been credited to Player ID <strong className="text-white">{userId}</strong>.
                  </p>
                </div>

                {/* Invoice Details */}
                <div className="p-4 rounded-xl bg-[#050C1E] border border-[#152248] text-xs text-left space-y-1.5 font-mono text-[#94A3B8]">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="text-white">GV-{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction Method:</span>
                    <span className="text-emerald-400">Bakong KHQR (0% Fee)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="text-[#00F2FE] font-bold">{formatPrice(selectedPackage.priceUSD)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="w-full py-2.5 rounded-xl bg-[#00F2FE] text-black font-heading font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  Done &amp; Continue Shopping
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
