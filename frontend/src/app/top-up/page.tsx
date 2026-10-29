'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { TopUpGame, TopUpGameDetails, TopUpPackage, TopUpOrder } from '@/types';
import confetti from 'canvas-confetti';
import Hero3DMarquee from '@/components/hero/Hero3DMarquee';
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
    badge: '✨ NO PASSWORD',
    badgeColor: 'from-cyan-500 to-blue-500 text-white',
    publisher: 'Roblox Corporation',
    rating: '4.9 ★★★★★',
    popularLabel: '80 - 4,500 Robux Direct',
  },
  'Genshin Impact': {
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    badge: '✨ CRYSTALS',
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
    currencyIcon: '✨',
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
          const raw = localStorage.getItem('nexus_guest_orders');
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
          localStorage.setItem('nexus_guest_orders', JSON.stringify(updated));

          // Save player ID for 1-click reorder
          const savedPlayersRaw = localStorage.getItem('nexus_saved_players');
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
          localStorage.setItem('nexus_saved_players', JSON.stringify(updatedPlayers));
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

  // Filtered games
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
    <div className="min-h-screen bg-[#07090e] text-white pt-20 pb-28 selection:bg-[#d4af37] selection:text-black font-sans">
      {/* Background Ambient Cyber-Gold Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-[#d4af37]/8 via-[#00e4f2]/4 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* SECTION 1: HIGH-IMPACT 2-COLUMN HERO (TEXT ON LEFT, 3D ANIMATION ON RIGHT) */}
        {/* ========================================================================= */}
        <section className="pt-2 pb-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left 7 Columns: Typography, Value Proposition & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Glowing Guest Top-Up Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/15 via-[#f2ca50]/15 to-amber-400/15 border border-[#f2ca50]/35 text-[#f2ca50] text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(242,202,80,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-[#00e4f2] animate-bounce" />
                <span>{language === 'kh' ? '✨ មិនបាច់បង្កើត Account • មិនបាច់ Login' : '✨ 100% Guest Checkout • No Account Needed'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.18]">
                {language === 'kh' ? (
                  <>
                    បញ្ចូលលុយ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#c99516]">ពេជ្រ & កាក់ហ្គេម</span> ស្វ័យប្រវត្តិតាម Bakong KHQR
                  </>
                ) : (
                  <>
                    DIRECT IN-GAME <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#c99516]">TOP-UP PLATFORM</span> INSTANT DELIVERY
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed max-w-xl">
                {language === 'kh'
                  ? 'ជ្រើសរើសហ្គេម បញ្ចូល Player ID រួចស្កេនបង់ប្រាក់ ពេជ្រនឹងចូលគណនីរបស់អ្នកភ្លាមៗក្នុង ៣ វិនាទី! មិនប៉ះពាល់ Password សុវត្ថិភាពខ្ពស់ ១០០%។'
                  : 'Choose your game, enter your Player ID, and scan with Bakong KHQR for instant 3-second credit reload. No passwords required, 100% safe & trusted.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#hot-games"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#c99516] hover:brightness-110 active:scale-95 text-[#07090e] font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(242,202,80,0.35)] transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-black text-black" />
                  <span>{language === 'kh' ? 'បញ្ចូលលុយឥឡូវនេះ' : 'Top-Up Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/orders"
                  className="px-5 py-3.5 rounded-2xl bg-[#141b28] hover:bg-[#1c2638] border border-white/[0.08] hover:border-[#f2ca50]/40 text-neutral-200 hover:text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
                >
                  <Receipt className="w-4 h-4 text-[#f2ca50]" />
                  <span>{language === 'kh' ? 'តាមដានការកុម្ម៉ង់' : 'Track Orders'}</span>
                </Link>
              </div>

              {/* 3 Trust Signals */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-white/[0.06] max-w-lg text-[11px] font-bold text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{language === 'kh' ? 'ចូលលឿន (3 វិនាទី)' : 'Instant 3s'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00e4f2] shrink-0" />
                  <span>{language === 'kh' ? 'គ្មាន Password' : 'No Password'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{language === 'kh' ? 'Bakong KHQR' : 'Bakong KHQR'}</span>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: 3D Animated Game Display with Perspective & Continuous Scroll */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <Hero3DMarquee />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: SEARCH BAR & TRENDING TAGS BAR                                 */}
        {/* ========================================================================= */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0d111a] p-4 rounded-3xl border border-white/[0.08]">
          {/* Live Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'kh' ? 'ស្វែងរកហ្គេម (MLBB, Roblox, Free Fire...)' : 'Search game title...'}
              className="w-full bg-[#141926] border border-white/[0.1] rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Trending Game Tags */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs pb-1 md:pb-0">
            <span className="text-xs text-neutral-400 font-bold shrink-0 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>{language === 'kh' ? 'ហ្គេមពេញនិយម' : 'Trending'}:</span>
            </span>
            {['Mobile Legends', 'Roblox', 'Free Fire', 'PUBG Mobile', 'Genshin Impact'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  const match = games.find((g) => g.title.toLowerCase().includes(tag.toLowerCase()));
                  if (match) handleSelectGame(match.id);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#141926] hover:bg-[#1f273b] border border-white/[0.08] text-neutral-200 hover:text-amber-300 font-bold text-xs transition-all shrink-0 cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: HOT GAMES CATALOG (Smile.One Rich Poster Cards)                 */}
        {/* ========================================================================= */}
        <section id="hot-games" className="mb-14 scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                  {language === 'kh' ? '🔥 ហ្គេមពេញនិយមបំផុត (Hot Games)' : '🔥 Hot Games'}
                </h2>
              </div>
              <p className="text-xs text-neutral-400">
                {language === 'kh'
                  ? 'ចុចលើហ្គេមដែលអ្នកចង់បញ្ចូល ដើម្បីមើលកញ្ចប់ពេជ្រ និងតម្លៃពិសេស'
                  : 'Click on any game to start instant top-up with zero login required.'}
              </p>
            </div>

            <span className="text-xs text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/25">
              {filteredGames.length} {language === 'kh' ? 'ហ្គេម' : 'Titles'}
            </span>
          </div>

          {/* High-Resolution Game Poster Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredGames.map((g) => {
              const isSelected = g.id === selectedGameId;
              const meta = GAME_POSTERS[g.title] || {
                poster: g.iconUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
                badge: '⚡ INSTANT',
                badgeColor: 'from-amber-400 to-yellow-400 text-black',
                publisher: 'Official Partner',
                rating: '4.9 ★★★★★',
                popularLabel: g.currencyName,
              };

              return (
                <div
                  key={g.id}
                  onClick={() => handleSelectGame(g.id)}
                  className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#d4af37] bg-[#141b2a] shadow-[0_0_35px_rgba(212,175,55,0.4)] scale-[1.03] ring-2 ring-[#d4af37]/50'
                      : 'border-white/[0.08] bg-[#0d111a] hover:border-white/[0.25] hover:bg-[#121724] hover:shadow-2xl hover:scale-[1.02]'
                  }`}
                >
                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-gradient-to-r ${meta.badgeColor} shadow-md`}>
                      {meta.badge}
                    </span>
                  </div>

                  {/* Selected Indicator Checkmark */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-black shadow-lg animate-in zoom-in-50">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}

                  {/* Poster Image Container */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-black/40">
                    <img
                      src={meta.poster}
                      alt={g.title}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d111a] via-[#0d111a]/40 to-transparent" />
                  </div>

                  {/* Card Content & Action Button */}
                  <div className="p-4 sm:p-5 space-y-3 relative z-10 -mt-6 bg-[#0d111a] rounded-t-3xl border-t border-white/[0.04]">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">
                        {meta.publisher}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {g.title}
                      </h3>
                      <p className="text-[11px] text-amber-400/90 font-semibold line-clamp-1 mt-0.5">
                        {meta.popularLabel}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                      <div className="text-[11px] text-neutral-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>3s Direct Credit</span>
                      </div>

                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#d4af37] text-black shadow-md'
                            : 'bg-[#182030] text-amber-300 group-hover:bg-[#d4af37] group-hover:text-black'
                        }`}
                      >
                        <span>{language === 'kh' ? 'បញ្ចូល' : 'Top Up'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: STEP-BY-STEP TOP-UP COCKPIT (Shown ONLY when game is selected) */}
        {/* ========================================================================= */}
        {selectedGame && (
          <section ref={cockpitRef} className="pt-6 mb-16 scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Active Game Header Ribbon */}
            <div className="bg-[#0f1422] rounded-3xl border border-white/[0.1] p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-amber-400 to-yellow-500" />
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md shrink-0">
                  <img
                    src={selectedGame.iconUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200'}
                    alt={selectedGame.title}
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-1">
                    <span>⚡ 100% AUTOMATED RELOAD</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {selectedGame.title}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    {language === 'kh'
                      ? `បញ្ចូល ${selectedGame.currencyNameKh || selectedGame.currencyName} ផ្ទាល់ចូលក្នុង ID តួអង្គក្នុងហ្គេមរបស់អ្នក`
                      : `Direct in-game ${selectedGame.currencyName} reload`}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Back to All Games button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGame(null);
                    setSelectedGameId('');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-bold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-amber-400" />
                  <span>{language === 'kh' ? '← ជ្រើសរើសហ្គេមផ្សេង' : '← Change Game'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowGuideModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#182030] hover:bg-[#202b40] border border-white/[0.1] text-xs font-bold text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>{language === 'kh' ? 'របៀបមើល ID?' : 'How to find ID?'}</span>
                </button>
              </div>
            </div>

          {/* 3-Step Grid Board */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: Steps 1, 2, 3 */}
            <div className="lg:col-span-8 space-y-6">
              {/* ------------------------------------------------------------------- */}
              {/* STEP 1: ENTER USER INFORMATION (Smile.One Step 1)                   */}
              {/* ------------------------------------------------------------------- */}
              <div className="bg-[#0d111a] rounded-3xl border border-white/[0.08] p-6 shadow-xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-black text-sm flex items-center justify-center shadow-md">
                      1
                    </span>
                    <div>
                      <h3 className="font-black text-base text-white">
                        {language === 'kh' ? 'បញ្ចូលលេខសម្គាល់គណនី (Enter User ID)' : 'Step 1: Enter User Info'}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {language === 'kh'
                          ? 'បញ្ចូលតែ Player ID ត្រឹមត្រូវ ពេជ្រនឹងចូលតួអង្គនោះភ្លាម (គ្មាន Password)'
                          : 'Zero password required. Only enter your public in-game Player ID.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
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
                        className="w-full bg-[#141926] border border-white/[0.1] rounded-2xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-mono shadow-inner"
                      />
                    </div>

                    {/* Zone ID for MLBB */}
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
                          className="w-full bg-[#141926] border border-white/[0.1] rounded-2xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-mono shadow-inner"
                        />
                      </div>
                    )}

                    {/* Server Region for Genshin */}
                    {selectedGame?.inputConfig?.some((c) => c.key === 'serverRegion') && (
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                          Server <span className="text-amber-400 ml-1">*</span>
                        </label>
                        <select
                          value={serverRegion}
                          onChange={(e) => setServerRegion(e.target.value)}
                          className="w-full bg-[#141926] border border-white/[0.1] rounded-2xl px-3 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-all shadow-inner"
                        >
                          <option value="Asia">Asia (អាស៊ី)</option>
                          <option value="America">America</option>
                          <option value="Europe">Europe</option>
                          <option value="TW_HK_MO">TW / HK / MO</option>
                        </select>
                      </div>
                    )}

                    {/* Check Nickname CTA */}
                    <div className="sm:col-span-4 flex items-end">
                      <button
                        type="button"
                        onClick={handleVerifyPlayer}
                        disabled={isVerifying || !playerId.trim()}
                        className="w-full h-[50px] bg-[#1a2234] hover:bg-[#232e47] disabled:opacity-50 text-white rounded-2xl text-xs font-bold tracking-wider transition-all border border-white/[0.1] flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        {isVerifying ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                            <span>{language === 'kh' ? 'កំពុងពិនិត្យ...' : 'Checking...'}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>{language === 'kh' ? 'ពិនិត្យឈ្មោះតួអង្គ' : 'Check Nickname'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Nickname Verified Confirmation Pill */}
                  {verifiedNickname && (
                    <div className="bg-emerald-500/10 border border-emerald-500/35 rounded-2xl p-4 flex items-center justify-between animate-in fade-in">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">
                            {language === 'kh' ? '✅ ឈ្មោះតួអង្គត្រឹមត្រូវ (Verified IGN)' : '✅ Verified Nickname'}
                          </span>
                          <div className="text-base font-black text-white flex items-center gap-2">
                            <span>{verifiedNickname}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono">
                              ID: {playerId} {zoneId ? `(${zoneId})` : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-400 font-bold hidden sm:inline">
                        {language === 'kh' ? 'រួចរាល់សម្រាប់បញ្ចូល' : 'Ready to reload'}
                      </span>
                    </div>
                  )}

                  {/* Verification Error Notice */}
                  {verificationError && (
                    <div className="bg-red-500/10 border border-red-500/35 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-red-300">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{verificationError}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ------------------------------------------------------------------- */}
              {/* STEP 2: SELECT RECHARGE DENOMINATION (Smile.One Step 2)             */}
              {/* ------------------------------------------------------------------- */}
              <div className="bg-[#0d111a] rounded-3xl border border-white/[0.08] p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] mb-5 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-black text-sm flex items-center justify-center shadow-md">
                      2
                    </span>
                    <div>
                      <h3 className="font-black text-base text-white">
                        {language === 'kh' ? 'ជ្រើសរើសចំនួនពេជ្រ / កញ្ចប់ (Select Package)' : 'Step 2: Choose Product'}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {language === 'kh'
                          ? 'ជ្រើសរើសចំនួនពេជ្រ ឬ Pass ដែលអ្នកចង់បញ្ចូល'
                          : 'Select diamond pack, tokens, or passes.'}
                      </p>
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 bg-[#141926] p-1.5 rounded-2xl border border-white/[0.06] text-xs">
                    <button
                      type="button"
                      onClick={() => setCategoryFilter('all')}
                      className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        categoryFilter === 'all'
                          ? 'bg-[#d4af37] text-black shadow-md'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {language === 'kh' ? 'ទាំងអស់' : 'All'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryFilter('currency')}
                      className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        categoryFilter === 'currency'
                          ? 'bg-[#d4af37] text-black shadow-md'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {selectedGame?.currencyName || 'Diamonds'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryFilter('pass')}
                      className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        categoryFilter === 'pass'
                          ? 'bg-[#d4af37] text-black shadow-md'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Pass & Bundles
                    </button>
                  </div>
                </div>

                {/* Package Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filteredPackages.map((pkg) => {
                    const isSelected = selectedPackage?.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`relative cursor-pointer rounded-2xl p-4.5 border transition-all duration-200 flex flex-col justify-between group ${
                          isSelected
                            ? 'bg-[#182030] border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.4)] scale-[1.02] ring-1 ring-[#d4af37]'
                            : 'bg-[#121622] border-white/[0.06] hover:border-white/[0.25] hover:bg-[#161c2b]'
                        }`}
                      >
                        {/* Hot Deal / Bonus Ribbon */}
                        {pkg.badge && (
                          <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                            {pkg.badge}
                          </div>
                        )}

                        <div className="space-y-1.5 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{selectedGame?.currencyIcon || '💎'}</span>
                            <span className="font-black text-sm text-white group-hover:text-amber-300 transition-colors">
                              {pkg.name}
                            </span>
                          </div>

                          {pkg.bonusAmount > 0 && (
                            <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                              <span>+ {pkg.bonusAmount} Bonus Included</span>
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
                            <span className="text-lg font-black text-[#f2ca50]">
                              ${Number(pkg.price).toFixed(2)}
                            </span>
                          </div>

                          <span className="text-[11px] text-neutral-400 font-semibold">
                            {toKHR(Number(pkg.price))}
                          </span>
                        </div>

                        {/* Selected Checkmark Corner */}
                        {isSelected && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#d4af37] rounded-tl-xl rounded-br-2xl flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ------------------------------------------------------------------- */}
              {/* STEP 3: PAYMENT METHOD (Smile.One Step 3 - Bakong KHQR)             */}
              {/* ------------------------------------------------------------------- */}
              <div className="bg-[#0d111a] rounded-3xl border border-white/[0.08] p-6 shadow-xl">
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06] mb-5">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-black text-sm flex items-center justify-center shadow-md">
                    3
                  </span>
                  <div>
                    <h3 className="font-black text-base text-white">
                      {language === 'kh' ? 'ជ្រើសរើសវិធីសាស្ត្រទូទាត់ប្រាក់ (Payment Method)' : 'Step 3: Select Payment Channel'}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {language === 'kh'
                        ? 'ស្កេនទូទាត់តាម Bakong KHQR គ្រប់ធនាគារក្នុងស្រុក (មិនបាច់ Login)'
                        : 'Instant QR code scan across all Cambodian mobile banking apps.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Bakong KHQR Card */}
                  <div
                    onClick={() => setPaymentMethod('bakong_khqr')}
                    className={`cursor-pointer rounded-2xl p-4.5 border transition-all flex items-start gap-4 ${
                      paymentMethod === 'bakong_khqr'
                        ? 'bg-[#182030] border-[#00e4f2] shadow-[0_0_25px_rgba(0,228,242,0.25)] ring-1 ring-[#00e4f2]'
                        : 'bg-[#121622] border-white/[0.06] hover:border-white/[0.2]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/35 flex items-center justify-center text-red-400 shrink-0 font-black">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-sm text-white">
                          Bakong KHQR
                        </span>
                        <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          NO LOGIN
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">
                        ABA Mobile, Wing Bank, ACLEDA, Bakong, Canadia...
                      </p>
                    </div>
                  </div>

                  {/* Wallet Card */}
                  <div
                    onClick={() => setPaymentMethod('wallet')}
                    className={`cursor-pointer rounded-2xl p-4.5 border transition-all flex items-start gap-4 ${
                      paymentMethod === 'wallet'
                        ? 'bg-[#182030] border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.25)] ring-1 ring-[#d4af37]'
                        : 'bg-[#121622] border-white/[0.06] hover:border-white/[0.2]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/35 flex items-center justify-center text-amber-400 shrink-0 font-black">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-sm text-white">
                          NEXUS Wallet
                        </span>
                        {isAuthenticated && user?.wallet && (
                          <span className="text-xs font-mono font-bold text-[#f2ca50]">
                            ${Number(user.wallet.balance || 0).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400">
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

                {/* Optional Phone / Telegram notification */}
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    {language === 'kh'
                      ? 'លេខទូរស័ព្ទ ឬ Telegram (ស្រេចចិត្ត - សម្រាប់ទទួលវិក្កយបត្រ)'
                      : 'Phone or Telegram Handle (Optional - for receipt delivery)'}
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. 012 345 678 / @telegram_username"
                    className="w-full bg-[#141926] border border-white/[0.08] rounded-2xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Sticky Order Checkout Cockpit */}
            <div className="lg:col-span-4 space-y-5 sticky top-24">
              <div className="bg-[#0d111a] rounded-3xl border border-white/[0.1] p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-sm uppercase tracking-wider text-white">
                    {language === 'kh' ? 'សេចក្តីសង្ខេបការបញ្ជាទិញ' : 'Order Summary'}
                  </h3>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                    1-CLICK GUEST SCAN
                  </span>
                </div>

                {/* Summary Box */}
                <div className="bg-[#141926] rounded-2xl p-4 mb-4 border border-white/[0.06] space-y-2.5 text-xs">
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

                {/* Price Breakdown */}
                <div className="space-y-2 py-3 border-t border-b border-white/[0.06] text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>{language === 'kh' ? 'តម្លៃដើម' : 'Subtotal'}</span>
                    <span>${selectedPackage ? Number(selectedPackage.price).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>{language === 'kh' ? 'កម្រៃសេវា' : 'Platform Fee'}</span>
                    <span className="text-emerald-400 font-bold">{language === 'kh' ? 'ឥតគិតថ្លៃ ($0.00)' : 'FREE'}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>{language === 'kh' ? 'វិធីទូទាត់' : 'Payment Channel'}</span>
                    <span className="font-semibold text-white">
                      {paymentMethod === 'bakong_khqr' ? 'Bakong KHQR' : 'NEXUS Wallet'}
                    </span>
                  </div>
                </div>

                {/* Total Price */}
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

                {/* Error Banner */}
                {paymentError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3 mb-4 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                {/* Main Action Buy Now Button */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isSubmitting || !selectedPackage || !playerId.trim()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-black font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 cursor-pointer"
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

                <p className="text-[10px] text-center text-neutral-400 mt-3 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'kh' ? 'សុវត្ថិភាព ១០០% • មិនបាច់បង្កើត Account' : '100% Safe • Zero Login Required'}</span>
                </p>
              </div>

              {/* Telegram Support Pill */}
              <div className="text-center">
                <Link
                  href="https://t.me/nexus_support_kh"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  <span>{language === 'kh' ? 'ត្រូវការជំនួយបន្ទាន់?' : 'Need urgent support?'}</span>
                  <span className="text-cyan-400 underline font-bold">Telegram @nexus_support_kh</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: WHY CHOOSE US (Smile.One Style Trust Pillars)                  */}
        {/* ========================================================================= */}
        <section className="mb-14 pt-6 border-t border-white/[0.08]">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white mb-2">
              {language === 'kh' ? 'ហេតុអ្វីជ្រើសរើសយើងខ្ញុំ?' : 'Why Choose NEXUS Top-Up?'}
            </h2>
            <p className="text-xs text-neutral-400">
              {language === 'kh'
                ? 'វេទិកាបញ្ចូលលុយហ្គេមទំនើប សុវត្ថិភាព និងរហ័សទាន់ចិត្តបំផុតនៅកម្ពុជា'
                : 'The premier direct game reload service in Cambodia with automated delivery.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#0d111a] border border-white/[0.08] p-5 rounded-3xl space-y-2.5 hover:border-amber-400/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-white">
                {language === 'kh' ? 'ចូលលឿនត្រឹម ៣ វិនាទី' : 'Instant 3-Second Delivery'}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {language === 'kh'
                  ? 'ប្រព័ន្ធ API ស្វ័យប្រវត្តិតភ្ជាប់ផ្ទាល់ទៅ Moonton & Game Publishers ពេជ្រចូលតួអង្គភ្លាមៗ។'
                  : 'Automated API integration sends diamonds directly to game accounts in seconds.'}
              </p>
            </div>

            <div className="bg-[#0d111a] border border-white/[0.08] p-5 rounded-3xl space-y-2.5 hover:border-cyan-400/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-white">
                {language === 'kh' ? 'ស្កេនបង់ Bakong KHQR' : 'Bakong KHQR Payments'}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {language === 'kh'
                  ? 'គាំទ្រការស្កេនបង់ប្រាក់ពីគ្រប់ Mobile Banking (ABA, Wing, ACLEDA, Bakong...) គ្មានកម្រៃសេវា។'
                  : 'Pay directly via any Cambodian mobile banking app with zero transaction charges.'}
              </p>
            </div>

            <div className="bg-[#0d111a] border border-white/[0.08] p-5 rounded-3xl space-y-2.5 hover:border-emerald-400/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-white">
                {language === 'kh' ? 'សុវត្ថិភាព ១០០% គ្មាន Password' : '100% Safe (Zero Password)'}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {language === 'kh'
                  ? 'បញ្ចូលតែ Player ID ប៉ុណ្ណោះ គ្មានការសួររក Password ឬចូល Email ធានាសុវត្ថិភាពតួអង្គដាច់ខាត។'
                  : 'No account passwords required. Your gaming profile is permanently protected.'}
              </p>
            </div>

            <div className="bg-[#0d111a] border border-white/[0.08] p-5 rounded-3xl space-y-2.5 hover:border-blue-400/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-blue-400/15 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-white">
                {language === 'kh' ? 'ជំនួយអតិថិជន ២៤/៧' : '24/7 Dedicated Support'}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {language === 'kh'
                  ? 'ក្រុមការងារប្រចាំការរង់ចាំដោះស្រាយ និងឆ្លើយតបរហ័សតាម Live Chat និង Telegram ២៤ ម៉ោង។'
                  : 'Live human assistance available around the clock on web chat and Telegram.'}
              </p>
            </div>
          </div>
        </section>
      </div>

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
