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
  ChevronDown,
  Info,
  RefreshCw,
  Copy,
  Download,
  AlertCircle,
  Flame,
  Award,
  Gamepad2,
  Check,
  ExternalLink,
  Smartphone,
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
          // Default to MLBB or first game
          const defaultGame =
            gameList.find((g) => g.title.toLowerCase().includes('mobile legends')) ||
            gameList.find((g) => g.title.toLowerCase().includes('roblox')) ||
            gameList[0];
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
        // Reset player verification when game changes
        setVerifiedNickname(null);
        setVerificationError(null);
      } catch (err) {
        console.error('Failed to load game top-up details:', err);
      }
    }
    loadDetails();
  }, [selectedGameId]);

  // Real-time Check In-Game Nickname
  const handleVerifyPlayer = async () => {
    if (!playerId.trim()) {
      setVerificationError(
        language === 'kh' ? 'សូមបញ្ចូល Player ID របស់អ្នកជាមុនសិន' : 'Please enter your Player ID first'
      );
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);
    setVerifiedNickname(null);

    try {
      const res = await api.topup.verifyPlayer({
        gameId: selectedGameId,
        playerId: playerId.trim(),
        zoneId: zoneId.trim() || undefined,
        serverRegion: serverRegion || undefined,
      });

      if (res.isValid) {
        setVerifiedNickname(res.nickname);
      } else {
        setVerificationError(
          res.message || (language === 'kh' ? 'រកមិនឃើញតួអង្គនេះទេ' : 'Player account not found')
        );
      }
    } catch (err: any) {
      setVerificationError(
        err.message || (language === 'kh' ? 'មិនអាចពិនិត្យឈ្មោះតួអង្គបានទេ' : 'Failed to verify player')
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Create Top-Up Order (1-Click Guest Checkout)
  const handleCheckout = async () => {
    if (!selectedPackage) {
      setPaymentError(
        language === 'kh' ? 'សូមជ្រើសរើសកញ្ចប់ពេជ្រដែលអ្នកចង់បញ្ចូល' : 'Please select a top-up package'
      );
      return;
    }

    if (!playerId.trim()) {
      setPaymentError(
        language === 'kh' ? 'សូមបញ្ចូល Player ID របស់គណនីហ្គេម' : 'Please enter your Player ID'
      );
      return;
    }

    if (paymentMethod === 'wallet' && !isAuthenticated) {
      setPaymentError(
        language === 'kh'
          ? 'សូមចូលគណនីដើម្បីទូទាត់តាមកាបូបលុយ Wallet ឬជ្រើសរើស Bakong KHQR (មិនបាច់ Login)'
          : 'Please sign in to pay with wallet balance or select Bakong KHQR for instant guest checkout'
      );
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

  // Simulate payment for demo/testing
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
  const filteredPackages =
    selectedGame?.packages.filter((pkg) => {
      if (categoryFilter === 'all') return true;
      return pkg.category === categoryFilter;
    }) || [];

  return (
    <div className="min-h-screen bg-[#090c10] text-white pt-20 pb-24 selection:bg-[#d4af37] selection:text-black">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-gradient-to-b from-amber-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple & Modern Hero Banner */}
        <div className="text-center max-w-3xl mx-auto pt-4 pb-8 space-y-3">
          {/* Glowing Guest Top-Up Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-400/15 to-amber-500/15 border border-amber-400/30 text-[#f2ca50] text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>{language === 'kh' ? '✨ មិនបាច់បង្កើត Account • មិនបាច់ Login' : '✨ No Login Required • 100% Guest Checkout'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            {language === 'kh' ? (
              <>
                បញ្ចូលលុយ <span className="bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] bg-clip-text text-transparent">ពេជ្រ & កាក់ហ្គេម</span> ចូល ID ផ្ទាល់
              </>
            ) : (
              <>
                DIRECT IN-GAME <span className="bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] bg-clip-text text-transparent">TOP UP PLATFORM</span>
              </>
            )}
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {language === 'kh'
              ? 'ជ្រើសរើសហ្គេម បញ្ចូល Player ID រួចស្កេនបង់ប្រាក់តាម Bakong KHQR ពេជ្រនឹងចូលតួអង្គរបស់អ្នកភ្លាមៗក្នុង ៣ វិនាទី!'
              : 'Choose your game, enter your Player ID, and scan with Bakong KHQR for instant 3-second delivery.'}
          </p>

          {/* 4 Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-2xl mx-auto text-xs">
            <div className="bg-[#131822] border border-white/[0.08] rounded-xl px-3 py-2 flex items-center justify-center gap-1.5 text-neutral-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'kh' ? 'ចូលលឿន (3 វិនាទី)' : 'Instant 3s Delivery'}</span>
            </div>
            <div className="bg-[#131822] border border-white/[0.08] rounded-xl px-3 py-2 flex items-center justify-center gap-1.5 text-neutral-300">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'kh' ? 'Bakong KHQR' : 'Bakong KHQR'}</span>
            </div>
            <div className="bg-[#131822] border border-white/[0.08] rounded-xl px-3 py-2 flex items-center justify-center gap-1.5 text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'kh' ? 'គ្មាន Password' : 'Zero Password'}</span>
            </div>
            <div className="bg-[#131822] border border-white/[0.08] rounded-xl px-3 py-2 flex items-center justify-center gap-1.5 text-neutral-300">
              <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>{language === 'kh' ? 'ស្វ័យប្រវត្តិ ២៤/៧' : '24/7 Automated'}</span>
            </div>
          </div>
        </div>

        {/* Step 1: Select Game (Visual Carousel Grid) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-black text-xs flex items-center justify-center shadow-md">
                1
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                {language === 'kh' ? 'ជ្រើសរើសហ្គេមដែលចង់បញ្ចូល' : 'Select Game'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {games.map((g) => {
              const isSelected = g.id === selectedGameId;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGameId(g.id)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 text-center group cursor-pointer ${
                    isSelected
                      ? 'bg-[#1a2232] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-[1.02]'
                      : 'bg-[#121620] border-white/[0.06] hover:border-white/[0.2] hover:bg-[#161c28]'
                  }`}
                >
                  {/* Selected Indicator Pill */}
                  {isSelected && (
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-[9px] font-black uppercase px-2 py-0.2 rounded-full shadow-md flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>{language === 'kh' ? 'បានជ្រើស' : 'Selected'}</span>
                    </div>
                  )}

                  <div className="w-14 h-14 rounded-xl overflow-hidden mb-2 relative p-[1px] bg-gradient-to-br from-white/10 to-transparent mt-1">
                    <img
                      src={g.iconUrl || 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=200'}
                      alt={g.title}
                      className="w-full h-full object-cover rounded-[10px] group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <span className="text-xs font-bold text-white line-clamp-1 mb-0.5">
                    {g.title}
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold">
                    {g.currencyName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Top-Up Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: ID Input + Packages + Payment Method (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 2: In-Game Identification */}
            <div className="bg-[#121620] rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-black text-xs flex items-center justify-center shadow-md">
                    2
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      {language === 'kh' ? 'បញ្ចូលលេខសម្គាល់គណនី (Player ID)' : 'Enter In-Game ID'}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {language === 'kh'
                        ? 'បញ្ចូលតែ Player ID ប៉ុណ្ណោះ មិនទាមទារ Password ឡើយ'
                        : 'Only Player ID is required. Zero password needed.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuideModal(true)}
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{language === 'kh' ? 'របៀបមើល ID?' : 'How to find ID?'}</span>
                </button>
              </div>

              {/* Dynamic Inputs for Selected Game */}
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Primary Player ID Input */}
                  <div className={selectedGame?.inputConfig?.some((c) => c.key === 'zoneId' || c.key === 'serverRegion') ? 'sm:col-span-5' : 'sm:col-span-8'}>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                      {language === 'kh'
                        ? selectedGame?.inputConfig?.[0]?.labelKh || 'Player ID'
                        : selectedGame?.inputConfig?.[0]?.label || 'Player ID'}
                      <span className="text-amber-400 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={playerId}
                      onChange={(e) => {
                        setPlayerId(e.target.value);
                        setVerifiedNickname(null);
                        setVerificationError(null);
                      }}
                      placeholder={selectedGame?.inputConfig?.[0]?.placeholder || 'Enter ID'}
                      className="w-full bg-[#171d2b] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-mono"
                    />
                  </div>

                  {/* Secondary Input: Zone ID (e.g. MLBB) */}
                  {selectedGame?.inputConfig?.some((c) => c.key === 'zoneId') && (
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                        Zone ID <span className="text-amber-400 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={zoneId}
                        onChange={(e) => {
                          setZoneId(e.target.value);
                          setVerifiedNickname(null);
                          setVerificationError(null);
                        }}
                        placeholder="ឧ. 2026"
                        className="w-full bg-[#171d2b] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-mono"
                      />
                    </div>
                  )}

                  {/* Secondary Input: Server Region (e.g. Genshin) */}
                  {selectedGame?.inputConfig?.some((c) => c.key === 'serverRegion') && (
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                        Server <span className="text-amber-400 ml-1">*</span>
                      </label>
                      <select
                        value={serverRegion}
                        onChange={(e) => setServerRegion(e.target.value)}
                        className="w-full bg-[#171d2b] border border-white/[0.1] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-all"
                      >
                        <option value="Asia">Asia (អាស៊ី)</option>
                        <option value="America">America</option>
                        <option value="Europe">Europe</option>
                        <option value="TW_HK_MO">TW / HK / MO</option>
                      </select>
                    </div>
                  )}

                  {/* Instant Check Nickname Button */}
                  <div className="sm:col-span-4 flex items-end">
                    <button
                      type="button"
                      onClick={handleVerifyPlayer}
                      disabled={isVerifying || !playerId.trim()}
                      className="w-full h-[46px] bg-[#1d2536] hover:bg-[#253046] disabled:opacity-50 text-white rounded-xl text-xs font-bold tracking-wider transition-all border border-white/[0.1] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>{language === 'kh' ? 'កំពុងពិនិត្យ...' : 'Checking...'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{language === 'kh' ? 'ពិនិត្យឈ្មោះតួអង្គ' : 'Check Nickname'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Nickname Verified Badge */}
                {verifiedNickname && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">
                          {language === 'kh' ? '✅ ឈ្មោះតួអង្គត្រឹមត្រូវ (Verified)' : '✅ Verified Nickname'}
                        </span>
                        <div className="text-sm font-black text-white flex items-center gap-2">
                          <span>{verifiedNickname}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                            ID: {playerId} {zoneId ? `(${zoneId})` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold hidden sm:inline">
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

            {/* Step 3: Select Package */}
            <div className="bg-[#121620] rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-white/[0.06] mb-5 gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-black text-xs flex items-center justify-center shadow-md">
                    3
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      {language === 'kh' ? 'ជ្រើសរើសកញ្ចប់ពេជ្រ / កាក់' : 'Select Package'}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {language === 'kh'
                        ? 'ជ្រើសរើសចំនួនពេជ្រ ឬកញ្ចប់ Pass ដែលអ្នកពេញចិត្ត'
                        : 'Choose diamond tier or bundle pass.'}
                    </p>
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 bg-[#171d2b] p-1 rounded-xl border border-white/[0.06] text-xs">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      categoryFilter === 'all'
                        ? 'bg-[#d4af37] text-black shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {language === 'kh' ? 'ទាំងអស់' : 'All'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('currency')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      categoryFilter === 'currency'
                        ? 'bg-[#d4af37] text-black shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {selectedGame?.currencyName || 'Diamonds'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('pass')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      categoryFilter === 'pass'
                        ? 'bg-[#d4af37] text-black shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Pass & Bundles
                  </button>
                </div>
              </div>

              {/* Packages Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {filteredPackages.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-[#1a2232] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-[1.02]'
                          : 'bg-[#161c28] border-white/[0.06] hover:border-white/[0.2] hover:bg-[#1b2230]'
                      }`}
                    >
                      {/* Popular / Hot Deal Badge */}
                      {pkg.badge && (
                        <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                          {pkg.badge}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{selectedGame?.currencyIcon || '💎'}</span>
                          <span className="font-black text-sm text-white group-hover:text-amber-300 transition-colors">
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
                            <span className="text-[10px] text-neutral-500 line-through block">
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
                          <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Payment Method (Default: 100% Instant Guest KHQR) */}
            <div className="bg-[#121620] rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2.5 pb-3.5 border-b border-white/[0.06] mb-4">
                <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-black text-xs flex items-center justify-center shadow-md">
                  4
                </span>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {language === 'kh' ? 'វិធីសាស្ត្រទូទាត់ប្រាក់' : 'Payment Method'}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {language === 'kh'
                      ? 'ស្កេនទូទាត់ភ្លាមៗតាម Bakong KHQR គ្រប់ធនាគារ (មិនបាច់ Login)'
                      : 'Scan & pay with Bakong KHQR across any Cambodian bank.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Option 1: Bakong KHQR (Primary - Guest Checkout) */}
                <div
                  onClick={() => setPaymentMethod('bakong_khqr')}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-start gap-3 ${
                    paymentMethod === 'bakong_khqr'
                      ? 'bg-[#1a2232] border-[#00e4f2] shadow-[0_0_20px_rgba(0,228,242,0.2)]'
                      : 'bg-[#161c28] border-white/[0.06] hover:border-white/[0.2]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">
                        Bakong KHQR
                      </span>
                      <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        NO LOGIN
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      {language === 'kh'
                        ? 'ABA, Wing, ACLEDA, Bakong, Canadia...'
                        : 'Instant scan with all banking apps'}
                    </p>
                  </div>
                </div>

                {/* Option 2: Platform Wallet (Only for logged in users) */}
                <div
                  onClick={() => setPaymentMethod('wallet')}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-start gap-3 ${
                    paymentMethod === 'wallet'
                      ? 'bg-[#1a2232] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                      : 'bg-[#161c28] border-white/[0.06] hover:border-white/[0.2]'
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
                    <p className="text-[11px] text-neutral-400 mt-1">
                      {isAuthenticated
                        ? language === 'kh'
                          ? 'កាត់ចេញពីកាបូបលុយរបស់អ្នក'
                          : 'Deduct from platform balance'
                        : language === 'kh'
                        ? 'សម្រាប់អ្នកមាន Account (ស្រេចចិត្ត)'
                        : 'Optional for registered accounts'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Optional Phone / Telegram receipt */}
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  {language === 'kh'
                    ? 'លេខទូរស័ព្ទ ឬ Telegram (ស្រេចចិត្ត - សម្រាប់ទទួលវិក្កយបត្រ)'
                    : 'Phone or Telegram (Optional - for receipt delivery)'}
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 012 345 678 / @telegram_username"
                  className="w-full bg-[#171d2b] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary (4 Cols - Sticky) */}
          <div className="lg:col-span-4 space-y-4 sticky top-24">
            <div className="bg-[#121620] rounded-2xl border border-white/[0.1] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
              {/* Gold Top Light Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

              <h3 className="font-black text-sm uppercase tracking-wider text-white mb-4 flex items-center justify-between">
                <span>{language === 'kh' ? 'សេចក្តីសង្ខេបការបញ្ជាទិញ' : 'Order Summary'}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                  GUEST CHECKOUT
                </span>
              </h3>

              {/* Selected Game & Package Detail Box */}
              <div className="bg-[#171d2b] rounded-xl p-3.5 mb-4 border border-white/[0.06] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">{language === 'kh' ? 'ហ្គេម' : 'Game'}:</span>
                  <span className="font-bold text-white">{selectedGame?.title}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">{language === 'kh' ? 'កញ្ចប់' : 'Package'}:</span>
                  <span className="font-black text-amber-400">
                    {selectedPackage ? selectedPackage.name : '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Player ID:</span>
                  <span className="font-mono text-white font-bold">
                    {playerId || '—'} {zoneId ? `(${zoneId})` : ''}
                  </span>
                </div>

                {verifiedNickname && (
                  <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                    <span className="text-neutral-400">{language === 'kh' ? 'ឈ្មោះតួអង្គ' : 'Nickname'}:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
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
                  <span>{language === 'kh' ? 'ថ្លៃសេវា' : 'Platform Fee'}</span>
                  <span className="text-emerald-400 font-bold">{language === 'kh' ? 'ឥតគិតថ្លៃ ($0.00)' : 'FREE'}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>{language === 'kh' ? 'វិធីទូទាត់' : 'Payment'}</span>
                  <span className="font-semibold text-white">
                    {paymentMethod === 'bakong_khqr' ? 'Bakong KHQR' : 'NEXUS Wallet'}
                  </span>
                </div>
              </div>

              {/* Total Due */}
              <div className="pt-3 mb-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    {language === 'kh' ? 'ទឹកប្រាក់ត្រូវបង់' : 'Total Due'}
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

              {/* Error Alert */}
              {paymentError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* 1-Click CTA Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitting || !selectedPackage || !playerId.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-[#0b0e14] font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>{language === 'kh' ? 'កំពុងបង្កើតវិក្កយបត្រ...' : 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-black fill-black" />
                    <span>
                      {language === 'kh'
                        ? `ស្កេន KHQR បញ្ចូលឥឡូវ ($${selectedPackage ? Number(selectedPackage.price).toFixed(2) : '0.00'})`
                        : `Scan KHQR to Top Up ($${selectedPackage ? Number(selectedPackage.price).toFixed(2) : '0.00'})`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-neutral-400 mt-3 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'kh' ? 'ទូទាត់សុវត្ថិភាព ១០០% • មិនបាច់បង្កើត Account' : '100% Safe • Zero Login Required'}</span>
              </p>
            </div>

            {/* Telegram 24/7 Support Pill */}
            <div className="text-center">
              <Link
                href="https://t.me/nexus_support_kh"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <span>{language === 'kh' ? 'ត្រូវការជំនួយ?' : 'Need instant support?'}</span>
                <span className="text-cyan-400 underline font-semibold">Telegram @nexus_support_kh</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bakong KHQR Payment Modal */}
      {showPaymentModal && currentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#121620] rounded-3xl border border-white/[0.12] w-full max-w-md p-6 relative shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {currentOrder.paymentStatus === 'paid'
                    ? language === 'kh'
                      ? 'ជោគជ័យ! បានបញ្ចូលរួចរាល់'
                      : 'SUCCESS! TOP UP COMPLETED'
                    : language === 'kh'
                    ? 'រង់ចាំការស្កេនបង់ប្រាក់ KHQR'
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

            {/* Pending Payment State: Display KHQR */}
            {currentOrder.paymentStatus === 'pending' && currentOrder.qrImage && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl mx-auto w-64 h-64 flex items-center justify-center shadow-lg relative">
                  <img
                    src={currentOrder.qrImage}
                    alt="Bakong KHQR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="text-center">
                  <div className="text-2xl font-black text-[#f2ca50]">
                    ${Number(currentOrder.totalAmount).toFixed(2)}
                  </div>
                  <div className="text-xs text-neutral-400">
                    ≈ {toKHR(Number(currentOrder.totalAmount))}
                  </div>
                </div>

                {/* KHQR Actions */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href={currentOrder.qrImage}
                    download={`KHQR-${currentOrder.orderNumber}.png`}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1a2232] border border-white/[0.08] hover:bg-[#20293d] text-white font-bold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'kh' ? 'ទាញយក QR' : 'Save QR'}</span>
                  </a>

                  {currentOrder.deepLink ? (
                    <a
                      href={currentOrder.deepLink}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 text-red-300 font-bold transition-all"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>{language === 'kh' ? 'បើក App ធនាគារ' : 'Open Bank App'}</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(currentOrder.orderNumber);
                        setCopiedOrder(true);
                        setTimeout(() => setCopiedOrder(false), 2000);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1a2232] border border-white/[0.08] text-white font-bold"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedOrder ? 'បានចម្លង!' : 'ចម្លងលេខ Order'}</span>
                    </button>
                  )}
                </div>

                {/* Instant Sandbox Payment Simulator (Allows one-click live testing) */}
                <div className="pt-2 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isSimulatingPayment}
                    className="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isSimulatingPayment ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{language === 'kh' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Verifying simulated payment...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{language === 'kh' ? '🧪 សាកល្បងបង់ប្រាក់ភ្លាមៗ (Test Simulate)' : '🧪 Test Simulate Payment'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Paid State: Success Confirmation */}
            {currentOrder.paymentStatus === 'paid' && (
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div>
                  <h4 className="text-base font-black text-white">
                    {language === 'kh' ? 'បញ្ចូលពេជ្រជោគជ័យ ១០០%!' : 'Top-Up Fulfilled Successfully!'}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    {language === 'kh'
                      ? `ពេជ្រ/កាក់ត្រូវបានបញ្ចូលទៅក្នុងគណនី ${currentOrder.playerNickname || currentOrder.playerId} រួចរាល់។`
                      : `Currencies have been directly credited to ${currentOrder.playerNickname || currentOrder.playerId}.`}
                  </p>
                </div>

                {currentOrder.deliveryProof && (
                  <div className="bg-[#171d2b] p-3 rounded-xl border border-white/[0.06] text-left text-xs font-mono text-neutral-300">
                    <span className="text-[10px] text-neutral-500 uppercase block mb-1">
                      Delivery Proof Reference:
                    </span>
                    <span className="text-emerald-400 break-all">{currentOrder.deliveryProof}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  {language === 'kh' ? 'បិទផ្ទាំង (រួចរាល់)' : 'Close & Done'}
                </button>
              </div>
            )}

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Guide Modal: Where to find ID */}
      {showGuideModal && selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#121620] rounded-3xl border border-white/[0.12] w-full max-w-md p-6 relative shadow-2xl">
            <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>{language === 'kh' ? selectedGame.guideTitleKh : selectedGame.guideTitle}</span>
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed bg-[#171d2b] p-4 rounded-xl border border-white/[0.06] mb-4">
              {language === 'kh' ? selectedGame.guideDescriptionKh : selectedGame.guideDescription}
            </p>
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1a2232] hover:bg-[#20293d] border border-white/[0.08] text-white font-bold text-xs cursor-pointer"
            >
              {language === 'kh' ? 'យល់ព្រម' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
