'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { TopUpGame, TopUpGameDetails, TopUpPackage, TopUpOrder } from '@/types';
import confetti from 'canvas-confetti';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  QrCode,
  Wallet,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Info,
  RefreshCw,
  Copy,
  Download,
  AlertCircle,
  Flame,
  Award,
  Gamepad2,
} from 'lucide-react';

export default function TopUpPage() {
  const { language, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  // State
  const [games, setGames] = useState<TopUpGame[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<TopUpGameDetails | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackage | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Input states
  const [playerId, setPlayerId] = useState<string>('');
  const [zoneId, setZoneId] = useState<string>('');
  const [serverRegion, setServerRegion] = useState<string>('Asia');
  const [contactPhone, setContactPhone] = useState<string>('');

  // Verification state
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifiedNickname, setVerifiedNickname] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'bakong_khqr' | 'wallet'>('bakong_khqr');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<TopUpOrder | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Guide modal state
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [copiedOrder, setCopiedOrder] = useState<boolean>(false);

  // Load games list
  useEffect(() => {
    async function loadGames() {
      try {
        const gameList = await api.topup.getGames();
        setGames(gameList);
        if (gameList.length > 0) {
          // Default to Roblox or first game
          const defaultGame = gameList.find((g) => g.title.toLowerCase().includes('roblox')) || gameList[0];
          setSelectedGameId(defaultGame.id);
        }
      } catch (err) {
        console.error('Failed to load top-up games:', err);
      }
    }
    loadGames();
  }, []);

  // Load game packages when selected game changes
  useEffect(() => {
    if (!selectedGameId) return;

    async function loadDetails() {
      try {
        const details = await api.topup.getGameDetails(selectedGameId);
        setSelectedGame(details);
        // Default select first package
        if (details.packages && details.packages.length > 0) {
          setSelectedPackage(details.packages[0]);
        }
        // Reset player verification
        setVerifiedNickname(null);
        setVerificationError(null);
      } catch (err) {
        console.error('Failed to load game top-up details:', err);
      }
    }
    loadDetails();
  }, [selectedGameId]);

  // Handle player ID verification
  const handleVerifyPlayer = async () => {
    if (!playerId.trim()) {
      setVerificationError(language === 'kh' ? 'សូមបញ្ចូល Player ID ឬ Username' : 'Please enter Player ID or Username');
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const res = await api.topup.verifyPlayer({
        gameId: selectedGameId,
        playerId: playerId.trim(),
        zoneId: zoneId.trim() || undefined,
        serverRegion: serverRegion || undefined,
      });

      setVerifiedNickname(res.nickname);
    } catch (err: any) {
      setVerificationError(err.message || 'Player verification failed. Check your ID.');
      setVerifiedNickname(null);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Checkout / Top Up submission
  const handleCheckout = async () => {
    if (!playerId.trim()) {
      setVerificationError(language === 'kh' ? 'សូមបញ្ចូល Player ID របស់អ្នក' : 'Please enter your Player ID');
      return;
    }

    if (!selectedPackage) {
      alert(language === 'kh' ? 'សូមជ្រើសរើសកញ្ចប់ដែលចង់បញ្ចូល' : 'Please select a top-up package');
      return;
    }

    setIsSubmitting(true);
    setPaymentError(null);

    try {
      const order = await api.topup.createOrder({
        gameId: selectedGameId,
        packageId: selectedPackage.id,
        playerId: playerId.trim(),
        zoneId: zoneId.trim() || undefined,
        serverRegion: serverRegion || undefined,
        playerNickname: verifiedNickname || playerId.trim(),
        contactPhone: contactPhone.trim() || undefined,
        paymentMethod,
      });

      setCurrentOrder(order);
      setShowPaymentModal(true);

      // If paid instantly via wallet
      if (order.paymentStatus === 'paid') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Failed to create top-up order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate payment for demo/sandbox testing
  const handleSimulatePayment = async () => {
    if (!currentOrder) return;
    setIsSimulatingPayment(true);

    try {
      const res = await api.topup.simulatePayment(currentOrder.orderNumber);
      if (res.success) {
        // Refresh status
        const updated = await api.topup.getOrderStatus(currentOrder.orderNumber);
        setCurrentOrder(updated);

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      alert(err.message || 'Simulation error');
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  // Format currency in Khmer Riel
  const toKHR = (usd: number) => {
    return (usd * 4100).toLocaleString('km-KH') + ' ៛';
  };

  // Filter packages by category
  const filteredPackages = selectedGame?.packages.filter((pkg) => {
    if (categoryFilter === 'all') return true;
    return pkg.category === categoryFilter;
  }) || [];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white pt-24 pb-20 selection:bg-[#d4af37] selection:text-black">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-[#d4af37]/10 via-[#00e4f2]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-yellow-400/10 to-amber-500/10 border border-[#d4af37]/30 text-[#f2ca50] text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>{t('topUpNavBadge')}</span>
            <span className="text-neutral-500">•</span>
            <span className="text-white">100% AUTOMATED DELIVERY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            {language === 'kh' ? (
              <>
                បញ្ចូលលុយ <span className="bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] bg-clip-text text-transparent">Robux & ពេជ្រហ្គេម</span> ចូល ID ផ្ទាល់
              </>
            ) : (
              <>
                DIRECT IN-GAME <span className="bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] bg-clip-text text-transparent">GAME TOP UP</span>
              </>
            )}
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            {t('topUpPageSubtitle')}
          </p>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-neutral-300">
            <div className="flex items-center gap-1.5 bg-[#151a23]/70 px-3 py-1.5 rounded-lg border border-white/[0.06]">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'kh' ? 'ចូលភ្លាមៗក្នុង ៣ វិនាទី' : 'Instant 3s Delivery'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#151a23]/70 px-3 py-1.5 rounded-lg border border-white/[0.06]">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'kh' ? 'ស្កេនបង់ Bakong KHQR' : 'Bakong KHQR Supported'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#151a23]/70 px-3 py-1.5 rounded-lg border border-white/[0.06]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'kh' ? 'សុវត្ថិភាព មិនប៉ះពាល់ Password' : 'Zero Password Required'}</span>
            </div>
          </div>
        </div>

        {/* Game Selector Tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-[#f2ca50]" />
              <span>{t('topUpSelectGame')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {games.map((g) => {
              const isSelected = g.id === selectedGameId;
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedGameId(g.id);
                  }}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 text-center group ${
                    isSelected
                      ? 'bg-[#1a2130] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.25)] scale-[1.02]'
                      : 'bg-[#12161f] border-white/[0.07] hover:border-white/[0.2] hover:bg-[#161c28]'
                  }`}
                >
                  {/* Active Indicator Top Accent */}
                  {isSelected && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-b-full shadow-sm" />
                  )}

                  <div className="w-14 h-14 rounded-xl overflow-hidden mb-2 relative p-[1px] bg-gradient-to-br from-white/10 to-transparent">
                    <img
                      src={g.iconUrl || 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=200'}
                      alt={g.title}
                      className="w-full h-full object-cover rounded-[10px] group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <span className="text-xs font-bold text-white line-clamp-1 mb-0.5">
                    {g.title}
                  </span>
                  <span className="text-[10px] text-amber-400/90 font-medium">
                    {g.currencyName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Top-Up Interactive Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input ID + Packages (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: In-Game Account Identification */}
            <div className="bg-[#121721] rounded-2xl border border-white/[0.08] p-5 sm:p-6 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ffe088] to-[#8f6b10] flex items-center justify-center font-black text-black text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {t('topUpStep1Title')}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {language === 'kh'
                        ? 'បញ្ចូលលេខសម្គាល់គណនីរបស់អ្នក ដើម្បីប្រព័ន្ធបញ្ចូលលុយចូលតួអង្គត្រឹមត្រូវ'
                        : 'Enter your game credentials to receive currencies directly into your character.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowGuideModal(true)}
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t('topUpGuideBtn')}</span>
                </button>
              </div>

              {/* Dynamic Inputs for Selected Game */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Primary Player ID / Username */}
                  <div className={selectedGame?.inputConfig?.some((c) => c.key === 'zoneId' || c.key === 'serverRegion') ? 'sm:col-span-8' : 'sm:col-span-9'}>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                      {language === 'kh'
                        ? selectedGame?.inputConfig?.[0]?.labelKh || 'Player ID'
                        : selectedGame?.inputConfig?.[0]?.label || 'Player ID'}
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={playerId}
                        onChange={(e) => {
                          setPlayerId(e.target.value);
                          setVerifiedNickname(null);
                        }}
                        placeholder={selectedGame?.inputConfig?.[0]?.placeholder || 'Enter ID'}
                        className="w-full bg-[#181f2c] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Secondary Input: Zone ID (e.g. MLBB) */}
                  {selectedGame?.inputConfig?.some((c) => c.key === 'zoneId') && (
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                        Zone ID <span className="text-red-400 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={zoneId}
                        onChange={(e) => {
                          setZoneId(e.target.value);
                          setVerifiedNickname(null);
                        }}
                        placeholder="ឧ. 2026"
                        className="w-full bg-[#181f2c] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-mono"
                      />
                    </div>
                  )}

                  {/* Secondary Input: Server Region (e.g. Genshin) */}
                  {selectedGame?.inputConfig?.some((c) => c.key === 'serverRegion') && (
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                        Server <span className="text-red-400 ml-1">*</span>
                      </label>
                      <select
                        value={serverRegion}
                        onChange={(e) => setServerRegion(e.target.value)}
                        className="w-full bg-[#181f2c] border border-white/[0.1] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-all"
                      >
                        <option value="Asia">Asia (អាស៊ី)</option>
                        <option value="America">America</option>
                        <option value="Europe">Europe</option>
                        <option value="TW_HK_MO">TW / HK / MO</option>
                      </select>
                    </div>
                  )}

                  {/* Verify Action Button */}
                  <div className="sm:col-span-3 flex items-end">
                    <button
                      type="button"
                      onClick={handleVerifyPlayer}
                      disabled={isVerifying || !playerId.trim()}
                      className="w-full h-[46px] bg-[#1e2738] hover:bg-[#253147] disabled:opacity-50 text-white rounded-xl text-xs font-bold tracking-wider transition-all border border-white/[0.1] flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>{t('topUpVerifying')}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{t('topUpVerifyBtn')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Verified Nickname Banner */}
                {verifiedNickname && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] text-emerald-300 uppercase tracking-widest font-bold">
                          {t('topUpVerifiedSuccess')}
                        </span>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{verifiedNickname}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                            ID: {playerId} {zoneId ? `(${zoneId})` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400 hidden sm:inline">
                      {language === 'kh' ? 'រួចរាល់សម្រាប់បញ្ចូល' : 'Ready to receive'}
                    </span>
                  </div>
                )}

                {/* Verification Error */}
                {verificationError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Denomination Selection */}
            <div className="bg-[#121721] rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] mb-5 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ffe088] to-[#8f6b10] flex items-center justify-center font-black text-black text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {t('topUpStep2Title')}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {language === 'kh'
                        ? 'ជ្រើសរើសបរិមាណទឹកប្រាក់ ឬកញ្ចប់ Pass ដែលអ្នកចង់បញ្ចូល'
                        : 'Choose the amount of currency or passes you wish to reload.'}
                    </p>
                  </div>
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-1.5 bg-[#181f2c] p-1 rounded-xl border border-white/[0.06] text-xs">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      categoryFilter === 'all'
                        ? 'bg-[#d4af37] text-black shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {language === 'kh' ? 'ទាំងអស់' : 'All'}
                  </button>
                  <button
                    onClick={() => setCategoryFilter('currency')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      categoryFilter === 'currency'
                        ? 'bg-[#d4af37] text-black shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {selectedGame?.currencyName || 'Currency'}
                  </button>
                  <button
                    onClick={() => setCategoryFilter('pass')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      categoryFilter === 'pass'
                        ? 'bg-[#d4af37] text-black shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Pass & Bundles
                  </button>
                </div>
              </div>

              {/* Packages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {filteredPackages.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#1c2434] to-[#161c28] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.22)] scale-[1.02]'
                          : 'bg-[#151a24] border-white/[0.08] hover:border-white/[0.2] hover:bg-[#181f2c]'
                      }`}
                    >
                      {/* Badge if present */}
                      {pkg.badge && (
                        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md flex items-center gap-1">
                          {pkg.badge.includes('HOT') && <Flame className="w-2.5 h-2.5" />}
                          <span>{pkg.badge}</span>
                        </div>
                      )}

                      <div>
                        {/* Currency Icon & Name */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{selectedGame?.currencyIcon || '⚡'}</span>
                          <span className="font-black text-sm text-white line-clamp-1">
                            {pkg.name}
                          </span>
                        </div>

                        {pkg.bonusAmount > 0 && (
                          <div className="text-[11px] text-emerald-400 font-semibold mb-2">
                            +{pkg.bonusAmount} Bonus Included
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/[0.06] flex items-end justify-between">
                        <div>
                          {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                            <span className="text-[11px] text-neutral-500 line-through block">
                              ${Number(pkg.originalPrice).toFixed(2)}
                            </span>
                          )}
                          <span className="text-base font-black text-[#f2ca50]">
                            ${Number(pkg.price).toFixed(2)}
                          </span>
                        </div>

                        <span className="text-[10px] text-neutral-400 font-medium">
                          {toKHR(Number(pkg.price))}
                        </span>
                      </div>

                      {/* Selected Indicator Checkmark */}
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#d4af37] rounded-tl-lg rounded-br-2xl flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-[#121721] rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.06] mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ffe088] to-[#8f6b10] flex items-center justify-center font-black text-black text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {t('topUpStep3Title')}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {language === 'kh'
                      ? 'ជ្រើសរើសវិធីសាស្ត្របង់ប្រាក់តាម KHQR គ្រប់ធនាគារ ឬកាបូបប្រាក់'
                      : 'Choose to pay seamlessly with Bakong KHQR or your platform wallet.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Bakong KHQR */}
                <div
                  onClick={() => setPaymentMethod('bakong_khqr')}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-start gap-3.5 ${
                    paymentMethod === 'bakong_khqr'
                      ? 'bg-[#1b2230] border-[#00e4f2] shadow-[0_0_20px_rgba(0,228,242,0.2)]'
                      : 'bg-[#151a24] border-white/[0.08] hover:border-white/[0.2]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">
                        Bakong KHQR (All Banks)
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        INSTANT
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      {language === 'kh'
                        ? 'ស្កេនទូទាត់ភ្លាមៗជាមួយ ABA, Wing, Bakong, ACLEDA, Sathapana...'
                        : 'Scan & pay with any Cambodian banking app instantly.'}
                    </p>
                  </div>
                </div>

                {/* Option 2: NEXUS Wallet */}
                <div
                  onClick={() => setPaymentMethod('wallet')}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-start gap-3.5 ${
                    paymentMethod === 'wallet'
                      ? 'bg-[#1b2230] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                      : 'bg-[#151a24] border-white/[0.08] hover:border-white/[0.2]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">
                        NEXUS Wallet
                      </span>
                      {isAuthenticated && user?.wallet && (
                        <span className="text-xs font-mono font-bold text-[#f2ca50]">
                          ${Number(user.wallet.balance || 0).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      {isAuthenticated
                        ? language === 'kh'
                          ? 'កាត់ប្រាក់ចេញពីកាបូបរបស់អ្នកដោយផ្ទាល់'
                          : 'Deduct directly from your platform balance.'
                        : language === 'kh'
                        ? 'សូមចូលគណនីដើម្បីបង់តាម Wallet'
                        : 'Sign in to use your wallet balance.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Optional Phone/Telegram field for receipt */}
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  {language === 'kh'
                    ? 'លេខទូរស័ព្ទ ឬ Telegram (ស្រេចចិត្ត - សម្រាប់ទទួលវិក្កយបត្រ)'
                    : 'Phone or Telegram (Optional - for order notification)'}
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 012 345 678 / @telegram_username"
                  className="w-full bg-[#181f2c] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary & Sticky Action (4 Columns) */}
          <div className="lg:col-span-4 space-y-5 sticky top-28">
            <div className="bg-[#121721] rounded-2xl border border-white/[0.1] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
              {/* Gold Top Light */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

              <h3 className="font-bold text-base text-white mb-4 flex items-center justify-between">
                <span>{t('topUpOrderSummary')}</span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
                  LIVE CHECKOUT
                </span>
              </h3>

              {/* Selected Game & Package Snapshot */}
              <div className="bg-[#181f2c] rounded-xl p-3.5 mb-4 border border-white/[0.06] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">{language === 'kh' ? 'ហ្គេម' : 'Game'}:</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span>{selectedGame?.title}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">{language === 'kh' ? 'កញ្ចប់' : 'Package'}:</span>
                  <span className="font-black text-amber-400">
                    {selectedPackage ? selectedPackage.name : '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Player ID:</span>
                  <span className="font-mono text-white">
                    {playerId || '—'} {zoneId ? `(${zoneId})` : ''}
                  </span>
                </div>

                {verifiedNickname && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.06]">
                    <span className="text-neutral-400">{language === 'kh' ? 'ឈ្មោះតួអង្គ' : 'Nickname'}:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{verifiedNickname}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 py-3 border-t border-b border-white/[0.06] text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>{language === 'kh' ? 'តម្លៃដើម' : 'Subtotal'}</span>
                  <span>${selectedPackage ? Number(selectedPackage.price).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>{language === 'kh' ? 'ថ្លៃសេវាប្រព័ន្ធ' : 'Platform Fee'}</span>
                  <span className="text-emerald-400 font-bold">{language === 'kh' ? 'ឥតគិតថ្លៃ ($0.00)' : 'FREE ($0.00)'}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>{language === 'kh' ? 'វិធីសាស្ត្របង់ប្រាក់' : 'Payment Method'}</span>
                  <span className="font-semibold text-white capitalize">
                    {paymentMethod === 'bakong_khqr' ? 'Bakong KHQR' : 'NEXUS Wallet'}
                  </span>
                </div>
              </div>

              {/* Total Due */}
              <div className="pt-4 mb-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    {language === 'kh' ? 'ទឹកប្រាក់សរុប' : 'Total Due'}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#f2ca50]">
                      ${selectedPackage ? Number(selectedPackage.price).toFixed(2) : '0.00'}
                    </span>
                    <span className="block text-xs text-neutral-400 font-medium">
                      ≈ {toKHR(selectedPackage ? Number(selectedPackage.price) : 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="bg-[#181f2c] rounded-xl p-3 mb-5 text-[11px] text-neutral-400 leading-relaxed border border-white/[0.06] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t('topUpInstantNotice')}</span>
              </div>

              {/* Error message */}
              {paymentError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitting || !selectedPackage || !playerId.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-[#0b0e14] font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>{language === 'kh' ? 'កំពុងដំណើរការ...' : 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-black fill-black" />
                    <span>{t('topUpSubmitBtn')}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>

            {/* Support info */}
            <div className="text-center">
              <Link
                href="https://t.me/nexus_support_kh"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <span>{language === 'kh' ? 'ត្រូវការជំនួយបន្ទាន់?' : 'Need instant support?'}</span>
                <span className="text-cyan-400 underline font-semibold">Telegram @nexus_support_kh</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Payment KHQR Modal */}
      {showPaymentModal && currentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#121721] rounded-3xl border border-white/[0.12] w-full max-w-md p-6 relative shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-amber-400 to-yellow-300" />

            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {currentOrder.paymentStatus === 'paid'
                    ? language === 'kh'
                      ? 'ជោគជ័យ! បានបញ្ចូលរួចរាល់'
                      : 'SUCCESS! TOP UP COMPLETED'
                    : language === 'kh'
                    ? 'រង់ចាំការបង់ប្រាក់ KHQR'
                    : 'Awaiting KHQR Payment'}
                </span>
              </div>
              <h3 className="text-lg font-black text-white">
                {currentOrder.gameTitle} • {currentOrder.packageName}
              </h3>
              <p className="text-xs text-neutral-400">
                Order #{currentOrder.orderNumber}
              </p>
            </div>

            {/* If Payment is Pending: Show KHQR Card */}
            {currentOrder.paymentStatus === 'pending' && currentOrder.qrImage && (
              <div className="space-y-4">
                {/* QR Code Container */}
                <div className="bg-white p-4 rounded-2xl shadow-inner flex flex-col items-center justify-center relative">
                  <div className="w-56 h-56 relative flex items-center justify-center">
                    <img
                      src={currentOrder.qrImage}
                      alt="Bakong KHQR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs font-black text-red-600 tracking-wider uppercase">
                      KHQR • SCAN WITH ANY BANK
                    </span>
                  </div>
                </div>

                {/* Amount Due Details */}
                <div className="bg-[#181f2c] rounded-xl p-3 border border-white/[0.08] flex items-center justify-between text-xs">
                  <span className="text-neutral-400">{language === 'kh' ? 'ទឹកប្រាក់ត្រូវបង់' : 'Amount Due'}:</span>
                  <div className="text-right">
                    <span className="font-black text-base text-[#f2ca50]">
                      ${Number(currentOrder.totalAmount).toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-neutral-400">
                      ≈ {toKHR(Number(currentOrder.totalAmount))}
                    </span>
                  </div>
                </div>

                {/* Receiver Info */}
                <div className="bg-[#181f2c] rounded-xl p-3 border border-white/[0.08] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Player Target:</span>
                    <span className="font-bold text-white">
                      {currentOrder.playerNickname || currentOrder.playerId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Delivery SLA:</span>
                    <span className="text-emerald-400 font-bold">
                      3-10 Seconds Automatic
                    </span>
                  </div>
                </div>

                {/* Sandbox / Testing Simulator Button */}
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isSimulatingPayment}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-black font-black text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSimulatingPayment ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>
                    {language === 'kh'
                      ? '⚡ ធ្វើតេស្តស្កេនបង់ប្រាក់ (Simulate Payment Scan)'
                      : '⚡ Simulate KHQR Payment (Test Instant Delivery)'}
                  </span>
                </button>
              </div>
            )}

            {/* If Payment is Paid & Delivered */}
            {currentOrder.paymentStatus === 'paid' && (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white">
                    {language === 'kh' ? 'បញ្ចូលរួចរាល់ដោយជោគជ័យ!' : 'Top Up Successful!'}
                  </h4>
                  <p className="text-xs text-neutral-300">
                    {language === 'kh'
                      ? `ទឹកប្រាក់ ${currentOrder.packageName} ត្រូវបានបញ្ចូលចូលក្នុងគណនី ${currentOrder.playerNickname || currentOrder.playerId} រួចរាល់។`
                      : `${currentOrder.packageName} has been directly credited to ${currentOrder.playerNickname || currentOrder.playerId}.`}
                  </p>
                </div>

                {/* Proof Reference */}
                {currentOrder.deliveryProof && (
                  <div className="bg-[#181f2c] rounded-xl p-3 border border-emerald-500/30 text-left text-xs font-mono text-emerald-300 space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-sans font-bold">
                      Delivery Proof Reference:
                    </span>
                    <span className="break-all">{currentOrder.deliveryProof}</span>
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      // Clear form
                      setPlayerId('');
                      setVerifiedNickname(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-[#1e2738] hover:bg-[#28354c] text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    {language === 'kh' ? 'បញ្ចូលបន្តទៀត' : 'Top Up Another'}
                  </button>

                  <Link
                    href={`/top-up/orders/${currentOrder.orderNumber}`}
                    className="flex-1 py-3 rounded-xl bg-[#d4af37] text-black font-black text-xs uppercase tracking-wider hover:brightness-110 flex items-center justify-center gap-1"
                  >
                    <span>{language === 'kh' ? 'មើលវិក្កយបត្រ' : 'View Receipt'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Close Button Top Right */}
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Guide Modal: Where to find Player ID */}
      {showGuideModal && selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#121721] rounded-3xl border border-white/[0.12] w-full max-w-lg p-6 relative shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>
                {language === 'kh' ? selectedGame.guideTitleKh : selectedGame.guideTitle}
              </span>
            </h3>

            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              {language === 'kh' ? selectedGame.guideDescriptionKh : selectedGame.guideDescription}
            </p>

            {/* Visual Guide Box */}
            <div className="bg-[#181f2c] rounded-2xl p-4 border border-white/[0.08] space-y-3">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {language === 'kh' ? 'ឧទាហរណ៍ជាក់ស្តែង' : 'Practical Example'}:
              </div>
              <div className="space-y-2 text-xs font-mono text-neutral-300">
                {selectedGame.inputConfig.map((cfg) => (
                  <div key={cfg.key} className="bg-[#10141d] p-2.5 rounded-lg border border-white/[0.05]">
                    <span className="text-cyan-400 font-bold block mb-1">
                      {language === 'kh' ? cfg.labelKh : cfg.label}:
                    </span>
                    <span className="text-neutral-400 text-[11px] block">
                      {language === 'kh' ? cfg.helpTextKh : cfg.helpText}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110"
              >
                {language === 'kh' ? 'យល់ព្រម' : 'Got it'}
              </button>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
