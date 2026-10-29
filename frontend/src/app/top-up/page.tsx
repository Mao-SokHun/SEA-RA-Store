'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  Download,
  Smartphone,
  RefreshCw,
  AlertCircle,
  Flame,
  Gamepad2,
  Copy,
  TrendingUp,
  Award,
} from 'lucide-react';

// Hero promotional banners (Smile.One style carousel)
const PROMO_BANNERS = [
  {
    id: 1,
    title: 'Mobile Legends: Bang Bang',
    subtitle: 'Weekly Diamond Pass & 86-2195 Diamonds',
    tag: '⚡ HOT EVENT',
    discount: '+10% Bonus Diamonds',
    bgGradient: 'from-amber-600/30 via-yellow-500/10 to-transparent',
    borderColor: 'border-amber-500/30',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    gameTitleMatch: 'Mobile Legends',
  },
  {
    id: 2,
    title: 'Roblox Robux & Blox Fruits',
    subtitle: 'Direct In-Game Crediting into @Username',
    tag: '🔥 BESTSELLER',
    discount: 'Instant Automated 3s',
    bgGradient: 'from-cyan-600/30 via-blue-500/10 to-transparent',
    borderColor: 'border-cyan-500/30',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800',
    gameTitleMatch: 'Roblox',
  },
  {
    id: 3,
    title: 'Free Fire & PUBG Mobile',
    subtitle: 'Diamonds & Unknown Cash (UC) Reload',
    tag: '👑 100% OFFICIAL',
    discount: 'Bakong KHQR Zero Fee',
    bgGradient: 'from-rose-600/30 via-orange-500/10 to-transparent',
    borderColor: 'border-rose-500/30',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    gameTitleMatch: 'Free Fire',
  },
];

// Live recent transaction ticker (Smile.One style social proof)
const LIVE_RELOADS = [
  { id: '1', user: '012***48', game: 'MLBB', item: 'Weekly Diamond Pass', time: 'ទើបតែបញ្ជាទិញ' },
  { id: '2', user: '098***12', game: 'Roblox', item: '800 Robux', time: '1 នាទីមុន' },
  { id: '3', user: '070***95', game: 'Free Fire', item: '520 Diamonds', time: '2 នាទីមុន' },
  { id: '4', user: '085***33', game: 'PUBG', item: '660 UC', time: '3 នាទីមុន' },
  { id: '5', user: '016***77', game: 'MLBB', item: '257 Diamonds', time: '4 នាទីមុន' },
];

export default function TopUpPage() {
  const { language, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  // State
  const [games, setGames] = useState<TopUpGame[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<TopUpGameDetails | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackage | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Carousel banner state
  const [activeBannerIndex, setActiveBannerIndex] = useState<number>(0);

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

  // Auto-scroll banner timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load games list
  useEffect(() => {
    async function loadGames() {
      try {
        const gameList = await api.topup.getGames();
        setGames(gameList);
        if (gameList.length > 0) {
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
        if (details.packages && details.packages.length > 0) {
          setSelectedPackage(details.packages[0]);
        }
        setVerifiedNickname(null);
        setVerificationError(null);
      } catch (err) {
        console.error('Failed to load game top-up details:', err);
      }
    }
    loadDetails();
  }, [selectedGameId]);

  // Check In-Game Nickname via Provider
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

  // 1-Click Guest Checkout
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

  // Test Simulate Payment in Demo
  const handleSimulatePayment = async () => {
    if (!currentOrder) return;
    setIsSimulatingPayment(true);

    try {
      const res = await api.topup.simulatePayment(currentOrder.orderNumber);
      if (res.success) {
        const updated = await api.topup.getOrderStatus(currentOrder.orderNumber);
        setCurrentOrder(updated);

        confetti({
          particleCount: 140,
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

  // Filtered games based on search
  const filteredGames = games.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter packages by category
  const filteredPackages =
    selectedGame?.packages.filter((pkg) => {
      if (categoryFilter === 'all') return true;
      return pkg.category === categoryFilter;
    }) || [];

  return (
    <div className="min-h-screen bg-[#080b11] text-white pt-20 pb-24 selection:bg-[#d4af37] selection:text-black">
      {/* Ambient Cyber-Gold Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-amber-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================== */}
        {/* 1. CREATIVE PROMOTIONAL BANNER CAROUSEL (Smile.One Inspired)  */}
        {/* ============================================================== */}
        <div className="pt-3 pb-6">
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.1] bg-[#10141e] shadow-2xl">
            {/* Banner Content */}
            <div className="relative h-48 sm:h-64 lg:h-72 w-full overflow-hidden">
              {PROMO_BANNERS.map((banner, index) => {
                const isActive = index === activeBannerIndex;
                return (
                  <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-between p-6 sm:p-10 ${
                      isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    {/* Background Artwork with Overlay */}
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="absolute inset-0 w-full h-full object-cover object-center opacity-30 filter brightness-75 scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#080b11] via-[#080b11]/80 to-transparent" />

                    {/* Text & Call-To-Action */}
                    <div className="relative z-10 max-w-xl space-y-2.5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-black uppercase tracking-wider">
                        <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                        <span>{banner.tag}</span>
                        <span className="text-white/40">•</span>
                        <span className="text-white">{banner.discount}</span>
                      </div>

                      <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                        {banner.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2">
                        {banner.subtitle}
                      </p>

                      <div className="pt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const found = games.find((g) =>
                              g.title.toLowerCase().includes(banner.gameTitleMatch.toLowerCase())
                            );
                            if (found) setSelectedGameId(found.id);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] hover:brightness-110 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-black" />
                          <span>{language === 'kh' ? 'បញ្ចូលលុយភ្លាម' : 'Top Up Now'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <span className="text-[11px] text-emerald-400 font-bold hidden sm:inline flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'kh' ? 'មិនបាច់ Login' : 'No Account Needed'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Banner Navigation Controls */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/[0.1]">
              <button
                type="button"
                onClick={() =>
                  setActiveBannerIndex(
                    (prev) => (prev - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length
                  )
                }
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 px-1">
                {PROMO_BANNERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveBannerIndex(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === activeBannerIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setActiveBannerIndex((prev) => (prev + 1) % PROMO_BANNERS.length)
                }
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. LIVE RECENT TOP-UP ACTIVITY TICKER (Smile.One Social Proof) */}
        {/* ============================================================== */}
        <div className="mb-6 bg-[#10141e]/80 border border-white/[0.06] rounded-2xl p-2.5 px-4 flex items-center justify-between text-xs overflow-hidden">
          <div className="flex items-center gap-2 text-amber-300 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="hidden sm:inline">⚡ {language === 'kh' ? 'ប្រតិបត្តិការផ្ទាល់' : 'Live Reloads'}:</span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap text-[11px] text-neutral-300 px-2">
            {LIVE_RELOADS.map((item) => (
              <div key={item.id} className="flex items-center gap-1.5 shrink-0">
                <span className="font-mono text-neutral-400">{item.user}</span>
                <span className="text-white font-bold">{item.game}</span>
                <span className="text-amber-400 font-medium">({item.item})</span>
                <span className="text-emerald-400 text-[10px]">✓ {item.time}</span>
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-1 text-[11px] text-neutral-400 shrink-0">
            <span>Powered by</span>
            <span className="text-amber-400 font-black">Smile.One API</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. SEARCH BAR & TRENDING GAMES TICKER                          */}
        {/* ============================================================== */}
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Live Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'kh' ? 'ស្វែងរកហ្គេម (MLBB, Roblox, FF...)' : 'Search game title...'}
              className="w-full bg-[#121620] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Trending Game Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs pb-1 md:pb-0">
            <span className="text-[11px] text-neutral-500 font-semibold shrink-0 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'kh' ? 'ពេញនិយម' : 'Trending'}:</span>
            </span>
            {['Mobile Legends', 'Roblox', 'Free Fire', 'PUBG Mobile', 'Genshin'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  const match = games.find((g) => g.title.toLowerCase().includes(tag.toLowerCase()));
                  if (match) setSelectedGameId(match.id);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#141924] hover:bg-[#1c2333] border border-white/[0.06] text-neutral-300 hover:text-white font-medium text-[11px] transition-colors shrink-0 cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. STEP 1: GAME SELECTION GRID (Smile.One Catalog Style)       */}
        {/* ============================================================== */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-black text-xs flex items-center justify-center shadow-md">
                1
              </span>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                {language === 'kh' ? 'ជ្រើសរើសហ្គេមដែលចង់បញ្ចូល' : 'Select Game'}
              </h2>
            </div>
            <span className="text-[11px] text-neutral-400 font-medium">
              {filteredGames.length} {language === 'kh' ? 'ហ្គេមគាំទ្រ' : 'Games Available'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {filteredGames.map((g) => {
              const isSelected = g.id === selectedGameId;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGameId(g.id)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 text-center group cursor-pointer ${
                    isSelected
                      ? 'bg-[#182030] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.35)] scale-[1.02]'
                      : 'bg-[#11151e] border-white/[0.06] hover:border-white/[0.2] hover:bg-[#151a26]'
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

        {/* ============================================================== */}
        {/* 5. MAIN INTERACTIVE TOP-UP COCKPIT (Steps 2, 3, 4)             */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 Cols): Input ID + Select Package + Payment Method */}
          <div className="lg:col-span-8 space-y-6">
            {/* ------------------------------------------------------------ */}
            {/* Step 2: Account Identification (Player ID / Zone ID)        */}
            {/* ------------------------------------------------------------ */}
            <div className="bg-[#11151e] rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-black text-xs flex items-center justify-center shadow-md">
                    2
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      {language === 'kh' ? 'បញ្ចូលលេខសម្គាល់គណនី (Player ID)' : 'Enter Account Details'}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {language === 'kh'
                        ? 'បញ្ចូលតែ Player ID ប៉ុណ្ណោះ មិនទាមទារ Password ឡើយ'
                        : 'Only in-game ID is required. Zero password needed.'}
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
                  {/* Primary Player ID */}
                  <div
                    className={
                      selectedGame?.inputConfig?.some(
                        (c) => c.key === 'zoneId' || c.key === 'serverRegion'
                      )
                        ? 'sm:col-span-5'
                        : 'sm:col-span-8'
                    }
                  >
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
                      className="w-full bg-[#161c28] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-mono"
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
                        className="w-full bg-[#161c28] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-mono"
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
                        className="w-full bg-[#161c28] border border-white/[0.1] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-all"
                      >
                        <option value="Asia">Asia (អាស៊ី)</option>
                        <option value="America">America</option>
                        <option value="Europe">Europe</option>
                        <option value="TW_HK_MO">TW / HK / MO</option>
                      </select>
                    </div>
                  )}

                  {/* Real-time Check Nickname Button */}
                  <div className="sm:col-span-4 flex items-end">
                    <button
                      type="button"
                      onClick={handleVerifyPlayer}
                      disabled={isVerifying || !playerId.trim()}
                      className="w-full h-[46px] bg-[#1a2232] hover:bg-[#222c42] disabled:opacity-50 text-white rounded-xl text-xs font-bold tracking-wider transition-all border border-white/[0.1] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
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
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
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
                      {language === 'kh' ? 'រួចរាល់សម្រាប់បញ្ចូល' : 'Ready to credit'}
                    </span>
                  </div>
                )}

                {/* Error Notice */}
                {verificationError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3 flex items-center gap-2 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Step 3: Select Package Denomination (Smile.One Cards)       */}
            {/* ------------------------------------------------------------ */}
            <div className="bg-[#11151e] rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-xl">
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
                <div className="flex items-center gap-1.5 bg-[#161c28] p-1 rounded-xl border border-white/[0.06] text-xs">
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

              {/* Package Tiles Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {filteredPackages.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-[#182030] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.35)] scale-[1.02]'
                          : 'bg-[#151a26] border-white/[0.06] hover:border-white/[0.2] hover:bg-[#1a2232]'
                      }`}
                    >
                      {/* Popular / Best Deal Badge */}
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

            {/* ------------------------------------------------------------ */}
            {/* Step 4: Payment Channel (Bakong KHQR - 100% Guest Scan)     */}
            {/* ------------------------------------------------------------ */}
            <div className="bg-[#11151e] rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-xl">
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
                      ? 'bg-[#182030] border-[#00e4f2] shadow-[0_0_20px_rgba(0,228,242,0.2)]'
                      : 'bg-[#151a26] border-white/[0.06] hover:border-white/[0.2]'
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
                      ? 'bg-[#182030] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                      : 'bg-[#151a26] border-white/[0.06] hover:border-white/[0.2]'
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
                  className="w-full bg-[#161c28] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* Right Column (4 Cols - Sticky Cockpit): Order Summary & CTA */}
          <div className="lg:col-span-4 space-y-4 sticky top-24">
            <div className="bg-[#11151e] rounded-3xl border border-white/[0.1] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
              {/* Gold Top Light Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

              <h3 className="font-black text-sm uppercase tracking-wider text-white mb-4 flex items-center justify-between">
                <span>{language === 'kh' ? 'សេចក្តីសង្ខេបការបញ្ជាទិញ' : 'Order Summary'}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                  GUEST CHECKOUT
                </span>
              </h3>

              {/* Selected Game & Package Detail Box */}
              <div className="bg-[#161c28] rounded-2xl p-4 mb-4 border border-white/[0.06] space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">{language === 'kh' ? 'ហ្គេម' : 'Game'}:</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span>{selectedGame?.title}</span>
                  </span>
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
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-[#0b0e14] font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 cursor-pointer"
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

      {/* ============================================================== */}
      {/* 6. BAKONG KHQR PAYMENT MODAL                                   */}
      {/* ============================================================== */}
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
                  <div className="bg-[#161c28] p-3 rounded-xl border border-white/[0.06] text-left text-xs font-mono text-neutral-300">
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
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
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
            <p className="text-xs text-neutral-300 leading-relaxed bg-[#161c28] p-4 rounded-xl border border-white/[0.06] mb-4">
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
