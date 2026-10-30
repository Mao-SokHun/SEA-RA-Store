'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { TopUpGame, TopUpGameDetails, TopUpPackage, TopUpOrder } from '@/types';
import confetti from 'canvas-confetti';
import HeroGameverse from '@/components/gameverse/HeroGameverse';
import FeaturedGames from '@/components/gameverse/FeaturedGames';
import TrendingNow from '@/components/gameverse/TrendingNow';
import CommunityHubGameverse from '@/components/gameverse/CommunityHubGameverse';
import NewsAndStoreGameverse from '@/components/gameverse/NewsAndStoreGameverse';
import TopUpCockpitModal from '@/components/gameverse/TopUpCockpitModal';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
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
  TrendingUp,
  Star,
  Shield,
  Headphones,
  CheckCheck,
  ExternalLink,
  ChevronDown,
  Receipt,
  ArrowLeft,
} from 'lucide-react';

// Rich Curated Game Poster Metadata (Smile.One Game Catalog)
const GAME_POSTERS: Record<string, {
  poster: string;
  badge: string;
  badgeColor: string;
  publisher: string;
  rating: string;
  popularLabel: string;
}> = {
  'Mobile Legends: Bang Bang': {
    poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    badge: '🔥 BESTSELLER',
    badgeColor: 'from-amber-500 to-yellow-400 text-black',
    publisher: 'Moonton Official',
    rating: '4.9 ★★★★★',
    popularLabel: 'Weekly Pass & Diamonds',
  },
  'Free Fire': {
    poster: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    badge: '⚡ FLASH SALE',
    badgeColor: 'from-orange-500 to-red-500 text-white',
    publisher: 'Garena Official',
    rating: '4.8 ★★★★★',
    popularLabel: '100 - 2,180 Diamonds',
  },
  'PUBG Mobile': {
    poster: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    badge: '🪙 INSTANT UC',
    badgeColor: 'from-yellow-500 to-amber-600 text-black',
    publisher: 'Tencent Games',
    rating: '4.9 ★★★★★',
    popularLabel: 'Royale Pass & UC Packs',
  },
  'Roblox': {
    poster: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80',
    badge: '🛡️ NO PASSWORD',
    badgeColor: 'from-cyan-500 to-blue-500 text-white',
    publisher: 'Roblox Corporation',
    rating: '4.9 ★★★★★',
    popularLabel: '80 - 4,500 Robux Direct',
  },
  'Genshin Impact': {
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    badge: '💎 CRYSTALS',
    badgeColor: 'from-purple-500 to-indigo-500 text-white',
    publisher: 'HoYoverse',
    rating: '4.8 ★★★★★',
    popularLabel: 'Welkin Moon & Genesis',
  },
  'Honor of Kings': {
    poster: 'https://images.unsplash.com/photo-1612287233207-6b22998a445b?auto=format&fit=crop&w=600&q=80',
    badge: '👑 TOKENS',
    badgeColor: 'from-amber-400 to-orange-500 text-black',
    publisher: 'Level Infinite',
    rating: '4.8 ★★★★★',
    popularLabel: 'Tokens Direct Top-Up',
  },
  'Valorant': {
    poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    badge: '🎯 RIOT POINTS',
    badgeColor: 'from-rose-500 to-red-600 text-white',
    publisher: 'Riot Games',
    rating: '4.9 ★★★★★',
    popularLabel: 'Points for Weapon Skins',
  },
  'Call of Duty: Mobile': {
    poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    badge: '🪙 FAST CP',
    badgeColor: 'from-amber-500 to-yellow-600 text-black',
    publisher: 'Activision',
    rating: '4.9 ★★★★★',
    popularLabel: 'CP & Battle Pass',
  },
  'League of Legends: Wild Rift': {
    poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    badge: '💎 WILD CORES',
    badgeColor: 'from-sky-500 to-indigo-600 text-white',
    publisher: 'Riot Games',
    rating: '4.9 ★★★★★',
    popularLabel: 'Wild Cores & Pass',
  },
  'Blood Strike': {
    poster: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    badge: '⚡ HOT FPS',
    badgeColor: 'from-red-500 to-rose-600 text-white',
    publisher: 'NetEase Games',
    rating: '4.8 ★★★★★',
    popularLabel: 'Gold & Strike Pass',
  },
};

// Immediate zero-delay games data (Prevents 0 Games or blank screen on mount)
const DEFAULT_GAMES: TopUpGame[] = [
  {
    id: '1',
    title: 'Mobile Legends: Bang Bang',
    platform: 'Mobile',
    iconUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200',
    packageCount: 7,
    currencyName: 'Diamonds',
    currencyNameKh: 'Diamonds (ពេជ្រ)',
    currencyIcon: '💎',
  },
  {
    id: '7',
    title: 'Roblox',
    platform: 'Cross-platform',
    iconUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=200',
    packageCount: 7,
    currencyName: 'Robux',
    currencyNameKh: 'Robux (រ៉ូប៊ុក)',
    currencyIcon: '⚡',
  },
  {
    id: '3',
    title: 'Free Fire',
    platform: 'Mobile',
    iconUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200',
    packageCount: 7,
    currencyName: 'Diamonds',
    currencyNameKh: 'Diamonds (ពេជ្រ)',
    currencyIcon: '💎',
  },
  {
    id: '2',
    title: 'PUBG Mobile',
    platform: 'Mobile',
    iconUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200',
    packageCount: 6,
    currencyName: 'Unknown Cash (UC)',
    currencyNameKh: 'UC (យូស៊ី)',
    currencyIcon: '🪙',
  },
  {
    id: '8',
    title: 'Call of Duty: Mobile',
    platform: 'Mobile',
    iconUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200',
    packageCount: 6,
    currencyName: 'CP (COD Points)',
    currencyNameKh: 'CP (ស៊ីភី)',
    currencyIcon: '🪙',
  },
  {
    id: '5',
    title: 'Genshin Impact',
    platform: 'Cross-platform',
    iconUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=200',
    packageCount: 5,
    currencyName: 'Genesis Crystals',
    currencyNameKh: 'Genesis Crystals (គ្រីស្តាល់)',
    currencyIcon: '💎',
  },
  {
    id: '6',
    title: 'Valorant',
    platform: 'PC',
    iconUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200',
    packageCount: 4,
    currencyName: 'Valorant Points (VP)',
    currencyNameKh: 'Valorant Points (VP)',
    currencyIcon: '🎯',
  },
  {
    id: '9',
    title: 'League of Legends: Wild Rift',
    platform: 'Mobile',
    iconUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200',
    packageCount: 5,
    currencyName: 'Wild Cores',
    currencyNameKh: 'Wild Cores (វ៉ាយខ័រ)',
    currencyIcon: '💎',
  },
  {
    id: '4',
    title: 'Honor of Kings',
    platform: 'Mobile',
    iconUrl: 'https://images.unsplash.com/photo-1612287233207-6b22998a445b?w=200',
    packageCount: 5,
    currencyName: 'Tokens',
    currencyNameKh: 'Tokens (កាក់ហ្គេម)',
    currencyIcon: '👑',
  },
  {
    id: '10',
    title: 'Blood Strike',
    platform: 'Mobile',
    iconUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200',
    packageCount: 5,
    currencyName: 'Gold',
    currencyNameKh: 'Gold (មាស)',
    currencyIcon: '💰',
  },
];

export default function TopUpPage() {
  const { language, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  // State (Initialized with DEFAULT_GAMES so there is never 0 Games on mount)
  const [games, setGames] = useState<TopUpGame[]>(DEFAULT_GAMES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<TopUpGameDetails | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackage | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [gameCategory, setGameCategory] = useState<'all' | 'moba' | 'battle-royale' | 'rpg'>('all');

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

  // Modals
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [copiedOrder, setCopiedOrder] = useState<boolean>(false);

  // Cockpit scroll reference
  const cockpitRef = useRef<HTMLDivElement>(null);

  // Load games from backend
  useEffect(() => {
    async function loadGames() {
      try {
        const gameList = await api.topup.getGames();
        if (gameList && gameList.length > 0) {
          setGames(gameList);
        }

        // If user navigated with ?game=... in URL, auto select it
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const targetGame = params.get('game');
          if (targetGame) {
            const match = gameList.find(
              (g) => g.id === targetGame || g.title.toLowerCase().includes(targetGame.toLowerCase())
            );
            if (match) {
              setSelectedGameId(match.id);
            }
          }
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

  // Handle Game Selection with Smooth Scroll to Cockpit
  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    if (cockpitRef.current) {
      cockpitRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Check In-Game Nickname
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

      // Persist order number & user credentials locally for Guest tracking
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('seara_guest_orders') || localStorage.getItem('nexus_guest_orders');
          const list = raw ? JSON.parse(raw) : [];
          const updated = [
            {
              orderNumber: order.orderNumber,
              gameTitle: selectedGame?.title,
              packageName: selectedPackage.name,
              totalAmount: order.totalAmount,
              playerId: playerId.trim(),
              zoneId: zoneId.trim() || undefined,
              playerNickname: verifiedNickname || playerId.trim(),
              createdAt: new Date().toISOString(),
            },
            ...list.filter((item: any) => item.orderNumber !== order.orderNumber),
          ].slice(0, 30);
          localStorage.setItem('seara_guest_orders', JSON.stringify(updated));

          // Save player ID for 1-click reorder
          const savedPlayersRaw = localStorage.getItem('seara_saved_players') || localStorage.getItem('nexus_saved_players');
          const savedPlayers = savedPlayersRaw ? JSON.parse(savedPlayersRaw) : [];
          const updatedPlayers = [
            {
              gameTitle: selectedGame?.title,
              playerId: playerId.trim(),
              zoneId: zoneId.trim() || undefined,
              serverRegion: serverRegion || undefined,
              playerNickname: verifiedNickname || playerId.trim(),
              lastUsedAt: new Date().toISOString(),
            },
            ...savedPlayers.filter((p: any) => !(p.gameTitle === selectedGame?.title && p.playerId === playerId.trim())),
          ].slice(0, 10);
          localStorage.setItem('seara_saved_players', JSON.stringify(updatedPlayers));
        } catch (e) {
          console.warn('Could not save order to local storage', e);
        }
      }

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

  // Test Simulate Payment for Demo
  const handleSimulatePayment = async () => {
    if (!currentOrder) return;
    setIsSimulatingPayment(true);

    try {
      const res = await api.topup.simulatePayment(currentOrder.orderNumber);
      if (res.success) {
        const updated = await api.topup.getOrderStatus(currentOrder.orderNumber);
        setCurrentOrder(updated);

        confetti({
          particleCount: 150,
          spread: 85,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      alert(err.message || 'Simulation error');
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  // Convert USD to Khmer Riel
  const toKHR = (usd: number) => {
    return (usd * 4100).toLocaleString('km-KH') + ' ៛';
  };

  // Game Category mapping for trending filter
  const GAME_CATEGORIES: Record<string, 'moba' | 'battle-royale' | 'rpg'> = {
    'Mobile Legends: Bang Bang': 'moba',
    'Honor of Kings': 'moba',
    'League of Legends: Wild Rift': 'moba',
    'Free Fire': 'battle-royale',
    'PUBG Mobile': 'battle-royale',
    'Call of Duty: Mobile': 'battle-royale',
    'Blood Strike': 'battle-royale',
    'Valorant': 'battle-royale',
    'Roblox': 'rpg',
    'Genshin Impact': 'rpg',
  };

  // Filtered games by search and category
  const filteredGames = games.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      gameCategory === 'all' || GAME_CATEGORIES[g.title] === gameCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter packages by category
  const filteredPackages =
    selectedGame?.packages.filter((pkg) => {
      if (categoryFilter === 'all') return true;
      return pkg.category === categoryFilter;
    }) || [];

  return (
    <div className="min-h-screen bg-[#050811] text-white pt-20 pb-20 selection:bg-[#00e5ff] selection:text-black font-sans">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-[#0070f3]/10 via-[#00e5ff]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. CINEMATIC PANORAMIC HERO (Sample 2 Template: SHADOWFALL: LEGACY style) */}
        <HeroGameverse onOpenTopUp={handleSelectGame} />

        {/* 2. FEATURED GAMES (Sample 2 Template: 4 Column Cards with Blue Action Buttons) */}
        <FeaturedGames onOpenTopUp={handleSelectGame} />

        {/* 3. TRENDING NOW (Sample 2 Template: 5 Column Horizontal Cards with Player Counts) */}
        <TrendingNow onOpenTopUp={handleSelectGame} />

        {/* 4. COMMUNITY HUB (Sample 2 Template: Recent Forum Posts, Live Stream, Top Players) */}
        <CommunityHubGameverse />

        {/* 5. LATEST NEWS & UPDATES + GAME STORE (Sample 2 Template: 3 News Cards + 2 Game Store Deals) */}
        <NewsAndStoreGameverse onOpenTopUp={handleSelectGame} />
      </div>

      {/* ULTRA-RESPONSIVE TOP-UP COCKPIT MODAL (Opens when clicking any game / Play / Top Up) */}
      <TopUpCockpitModal
        isOpen={Boolean(selectedGame)}
        onClose={() => {
          setSelectedGame(null);
          setSelectedGameId("");
        }}
        selectedGame={selectedGame}
        selectedPackage={selectedPackage}
        setSelectedPackage={setSelectedPackage}
        playerId={playerId}
        setPlayerId={setPlayerId}
        zoneId={zoneId}
        setZoneId={setZoneId}
        serverRegion={serverRegion}
        setServerRegion={setServerRegion}
        contactPhone={contactPhone}
        setContactPhone={setContactPhone}
        isVerifying={isVerifying}
        handleVerifyPlayer={handleVerifyPlayer}
        verifiedNickname={verifiedNickname}
        verificationError={verificationError}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        filteredPackages={filteredPackages}
        isSubmitting={isSubmitting}
        handleCheckout={handleCheckout}
        paymentError={paymentError}
        toKHR={toKHR}
        language={language}
        isAuthenticated={isAuthenticated}
        walletBalance={Number(user?.wallet?.balance || 0)}
        onOpenGuide={() => setShowGuideModal(true)}
      />

      {/* ========================================================================= */}
      {/* BAKONG KHQR PAYMENT MODAL                                                 */}
      {/* ========================================================================= */}
      {showPaymentModal && currentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0f1422] rounded-3xl border border-white/[0.12] w-full max-w-md p-6 relative shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

            {/* Modal Title */}
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

            {/* Pending State: Display QR Code */}
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

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href={currentOrder.qrImage}
                    download={`KHQR-${currentOrder.orderNumber}.png`}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1a2234] border border-white/[0.08] hover:bg-[#222c42] text-white font-bold transition-all"
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
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1a2234] border border-white/[0.08] text-white font-bold"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{copiedOrder ? 'បានចម្លង!' : 'ចម្លងលេខ Order'}</span>
                    </button>
                  )}
                </div>

                {/* Test Simulate Payment Button */}
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
                        <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
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
                  <div className="bg-[#141926] p-3 rounded-xl border border-white/[0.06] text-left text-xs font-mono text-neutral-300">
                    <span className="text-[10px] text-neutral-500 uppercase block mb-1">
                      Delivery Proof Reference:
                    </span>
                    <span className="text-emerald-400 break-all">{currentOrder.deliveryProof}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-black text-xs uppercase tracking-wider cursor-pointer"
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
          <div className="bg-[#0f1422] rounded-3xl border border-white/[0.12] w-full max-w-md p-6 relative shadow-2xl">
            <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>{language === 'kh' ? selectedGame.guideTitleKh : selectedGame.guideTitle}</span>
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed bg-[#141926] p-4 rounded-xl border border-white/[0.06] mb-4">
              {language === 'kh' ? selectedGame.guideDescriptionKh : selectedGame.guideDescription}
            </p>
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1a2234] hover:bg-[#222c42] border border-white/[0.08] text-white font-bold text-xs cursor-pointer"
            >
              {language === 'kh' ? 'យល់ព្រម' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
