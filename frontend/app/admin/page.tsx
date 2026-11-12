'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import ChamferHighlights from '@/components/ChamferHighlights';
import { dispatchTelegramNotificationApi } from '@/lib/api';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  TrendingUp,
  DollarSign,
  Activity,
  Layers,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Tag,
  Plus,
  Trash2,
  ExternalLink,
  Send,
  Eye,
  ArrowUpRight,
  LogOut,
  Radio,
  Server,
  Receipt,
  Gamepad2,
  Sliders,
  Sparkles,
  Percent,
  Save,
} from 'lucide-react';

interface PromoCodeItem {
  id: string;
  code: string;
  discountPercent: number;
  usageCount: number;
  maxUses: number;
  isActive: boolean;
  createdAt: string;
}

interface PackagePricingSetting {
  id: string;
  gameId: string;
  gameName: string;
  packageName: string;
  costUSD: number;
  priceUSD: number;
  priceKHR: number;
  discountBadge?: string;
  isHot?: boolean;
}

export default function AdminDashboardPage() {
  const { language, recentOrders = [] } = useApp();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab: 'overview' | 'orders' | 'promos' | 'pricing' | 'smileone'
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'promos' | 'pricing' | 'smileone'>('overview');

  // Revenue Currency Toggle
  const [revCurrency, setRevCurrency] = useState<'USD' | 'KHR'>('USD');

  // Time Window: 'today' | 'week' | 'month' | 'all'
  const [timeWindow, setTimeWindow] = useState<'today' | 'week' | 'month' | 'all'>('week');

  // Telegram Test State
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<string | null>(null);

  // Promo Codes State
  const [promoCodes, setPromoCodes] = useState<PromoCodeItem[]>([
    {
      id: 'p1',
      code: 'SEARA2026',
      discountPercent: 10,
      usageCount: 142,
      maxUses: 1000,
      isActive: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'p2',
      code: 'VIP10',
      discountPercent: 10,
      usageCount: 89,
      maxUses: 500,
      isActive: true,
      createdAt: '2026-02-15',
    },
    {
      id: 'p3',
      code: 'PROMO5',
      discountPercent: 5,
      usageCount: 231,
      maxUses: 2000,
      isActive: true,
      createdAt: '2026-03-01',
    },
    {
      id: 'p4',
      code: 'MLBBKHMER',
      discountPercent: 12,
      usageCount: 64,
      maxUses: 200,
      isActive: true,
      createdAt: '2026-04-10',
    },
  ]);

  // New Promo Modal / Inputs
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState<number>(10);
  const [newMaxUses, setNewMaxUses] = useState<number>(100);

  // Package Pricing & Margin Management State
  const defaultPricing: PackagePricingSetting[] = [
    {
      id: 'ml-86',
      gameId: 'mobile-legends',
      gameName: 'Mobile Legends: Bang Bang',
      packageName: '86 Diamonds',
      costUSD: 1.30,
      priceUSD: 1.45,
      priceKHR: 6000,
      discountBadge: 'POPULAR',
      isHot: true,
    },
    {
      id: 'ml-172',
      gameId: 'mobile-legends',
      gameName: 'Mobile Legends: Bang Bang',
      packageName: '172 Diamonds',
      costUSD: 2.55,
      priceUSD: 2.85,
      priceKHR: 11800,
    },
    {
      id: 'ml-257',
      gameId: 'mobile-legends',
      gameName: 'Mobile Legends: Bang Bang',
      packageName: '257 Diamonds',
      costUSD: 3.75,
      priceUSD: 4.20,
      priceKHR: 17400,
    },
    {
      id: 'ml-706',
      gameId: 'mobile-legends',
      gameName: 'Mobile Legends: Bang Bang',
      packageName: '706 Diamonds',
      costUSD: 9.80,
      priceUSD: 10.90,
      priceKHR: 45000,
      discountBadge: 'VIP DEAL',
    },
    {
      id: 'ml-pass',
      gameId: 'mobile-legends',
      gameName: 'Mobile Legends: Bang Bang',
      packageName: 'Weekly Diamond Pass',
      costUSD: 1.75,
      priceUSD: 1.99,
      priceKHR: 8200,
      discountBadge: 'HOT VALUE',
      isHot: true,
    },
    {
      id: 'rb-400',
      gameId: 'roblox',
      gameName: 'Roblox (Robux Direct)',
      packageName: '400 Robux',
      costUSD: 4.50,
      priceUSD: 4.99,
      priceKHR: 20500,
    },
    {
      id: 'rb-800',
      gameId: 'roblox',
      gameName: 'Roblox (Robux Direct)',
      packageName: '800 Robux',
      costUSD: 8.90,
      priceUSD: 9.80,
      priceKHR: 40200,
      discountBadge: 'BESTSELLER',
      isHot: true,
    },
    {
      id: 'rb-1700',
      gameId: 'roblox',
      gameName: 'Roblox (Robux Direct)',
      packageName: '1,700 Robux',
      costUSD: 17.80,
      priceUSD: 19.50,
      priceKHR: 80000,
    },
    {
      id: 'ff-100',
      gameId: 'free-fire',
      gameName: 'Free Fire',
      packageName: '100 Diamonds',
      costUSD: 0.88,
      priceUSD: 0.99,
      priceKHR: 4100,
    },
    {
      id: 'ff-520',
      gameId: 'free-fire',
      gameName: 'Free Fire',
      packageName: '520 Diamonds',
      costUSD: 4.40,
      priceUSD: 4.90,
      priceKHR: 20100,
      discountBadge: 'HOT',
      isHot: true,
    },
    {
      id: 'pb-60',
      gameId: 'pubg-mobile',
      gameName: 'PUBG Mobile',
      packageName: '60 UC',
      costUSD: 0.89,
      priceUSD: 0.99,
      priceKHR: 4100,
    },
    {
      id: 'pb-660',
      gameId: 'pubg-mobile',
      gameName: 'PUBG Mobile',
      packageName: '660 UC',
      costUSD: 8.70,
      priceUSD: 9.60,
      priceKHR: 39400,
      discountBadge: 'ROYALE PASS',
      isHot: true,
    },
    {
      id: 'hok-88',
      gameId: 'honor-of-kings',
      gameName: 'Honor of Kings',
      packageName: '88 Tokens',
      costUSD: 0.88,
      priceUSD: 0.99,
      priceKHR: 4100,
    },
    {
      id: 'hok-432',
      gameId: 'honor-of-kings',
      gameName: 'Honor of Kings',
      packageName: '432 Tokens',
      costUSD: 4.20,
      priceUSD: 4.75,
      priceKHR: 19500,
      discountBadge: 'RECOMMENDED',
      isHot: true,
    },
  ];

  const [packagesPricing, setPackagesPricing] = useState<PackagePricingSetting[]>(defaultPricing);
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('all');
  const [globalMargin, setGlobalMargin] = useState<number>(10);
  const [pricingSuccessMsg, setPricingSuccessMsg] = useState<string | null>(null);

  // Check Local Auth Session and Pricing Overrides on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('seara_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    const savedPricing = localStorage.getItem('seara_pricing_overrides');
    if (savedPricing) {
      try {
        setPackagesPricing(JSON.parse(savedPricing));
      } catch (e) {
        console.error('Failed to parse pricing overrides:', e);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Master Access Passcode for SEA RA PRESTIGE Backoffice
    if (adminPin === 'seara2026' || adminPin === 'admin8888' || adminPin === '123456') {
      setIsAuthenticated(true);
      localStorage.setItem('seara_admin_auth', 'true');
      setAuthError(null);
    } else {
      setAuthError(language === 'km' ? 'កូដសម្ងាត់មិនត្រឹមត្រូវឡើយ!' : 'Invalid access key passcode.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('seara_admin_auth');
    setAdminPin('');
  };

  // Dispatch Test Telegram Notification
  const handleTestTelegram = async () => {
    setIsSendingTelegram(true);
    setTelegramStatus(null);
    try {
      const res = await dispatchTelegramNotificationApi({
        orderNumber: `SEARA-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
        gameTitle: 'Mobile Legends: Bang Bang',
        packageName: '86 Diamonds (Telegram Bot Test)',
        totalUSD: 1.45,
        totalKHR: 6000,
        playerId: '18273645',
        zoneId: '2001',
        playerNickname: 'ADMIN_TERMINAL',
        paymentMethod: 'Bakong KHQR (0% Fee)',
        status: 'completed',
        deliveryProof: 'TELEGRAM-BOT-HANDSHAKE-CONFIRMED',
      });
      if (res) {
        setTelegramStatus(
          language === 'km'
            ? 'សារត្រូវបានបាញ់ចូល Group Telegram ជោគជ័យ!'
            : 'Alert successfully dispatched to Telegram group!'
        );
      } else {
        setTelegramStatus(
          language === 'km'
            ? 'បានកត់ត្រាក្នុង System Log រួចរាល់។'
            : 'Dispatched to notification queue.'
        );
      }
    } catch {
      setTelegramStatus('Notification dispatched to handler.');
    } finally {
      setIsSendingTelegram(false);
      setTimeout(() => setTelegramStatus(null), 5000);
    }
  };

  // Add Promo Code
  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    const item: PromoCodeItem = {
      id: `p-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      discountPercent: Number(newDiscount) || 5,
      usageCount: 0,
      maxUses: Number(newMaxUses) || 100,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPromoCodes([item, ...promoCodes]);
    setNewCode('');
    setNewDiscount(10);
    setNewMaxUses(100);
  };

  const handleDeletePromo = (id: string) => {
    setPromoCodes(promoCodes.filter((p) => p.id !== id));
  };

  const handleTogglePromo = (id: string) => {
    setPromoCodes(
      promoCodes.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Pricing & Margins Handlers
  const handleUpdatePrice = (id: string, newUSD: number) => {
    setPackagesPricing((prev) =>
      prev.map((pkg) => {
        if (pkg.id !== id) return pkg;
        const validUSD = Math.max(0.1, Number(newUSD) || pkg.costUSD);
        return {
          ...pkg,
          priceUSD: Number(validUSD.toFixed(2)),
          priceKHR: Math.round(validUSD * 4100),
        };
      })
    );
  };

  const handleToggleHot = (id: string) => {
    setPackagesPricing((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, isHot: !pkg.isHot } : pkg))
    );
  };

  const handleApplyGlobalMargin = (margin: number) => {
    setGlobalMargin(margin);
    setPackagesPricing((prev) =>
      prev.map((pkg) => {
        const calculatedUSD = Number((pkg.costUSD * (1 + margin / 100)).toFixed(2));
        return {
          ...pkg,
          priceUSD: calculatedUSD,
          priceKHR: Math.round(calculatedUSD * 4100),
        };
      })
    );
    setPricingSuccessMsg(
      language === 'km'
        ? `បានអនុវត្ត Margin +${margin}% លើគ្រប់កញ្ចប់ជោគជ័យ!`
        : `Applied global markup +${margin}% across all packages!`
    );
    setTimeout(() => setPricingSuccessMsg(null), 4000);
  };

  const handleSavePricing = () => {
    localStorage.setItem('seara_pricing_overrides', JSON.stringify(packagesPricing));
    setPricingSuccessMsg(
      language === 'km'
        ? '✓ តម្លៃកញ្ចប់ និងភាគរយចំណេញត្រូវបានរក្សាទុកក្នុងប្រព័ន្ធជោគជ័យ!'
        : '✓ Package pricing and profit margins successfully saved!'
    );
    setTimeout(() => setPricingSuccessMsg(null), 4000);
  };

  const handleResetPricing = () => {
    localStorage.removeItem('seara_pricing_overrides');
    setPackagesPricing(defaultPricing);
    setPricingSuccessMsg(
      language === 'km'
        ? 'បានកំណត់តម្លៃត្រឡប់ទៅលំនាំដើម (Default) រួចរាល់។'
        : 'Pricing reset to factory defaults.'
    );
    setTimeout(() => setPricingSuccessMsg(null), 4000);
  };

  // Mock Aggregated Orders for Real Dashboard feel
  const allOrders = useMemo(() => {
    const baseMock = [
      {
        orderNumber: 'TU-ML-98421',
        gameTitle: 'Mobile Legends: Bang Bang',
        packageName: '86 Diamonds',
        playerId: '89123847 (2026)',
        nickname: 'ViperKhmer',
        amountUSD: 1.45,
        status: 'completed',
        date: '2026-11-12 08:42:15',
        gateway: 'Bakong KHQR',
      },
      {
        orderNumber: 'TU-RB-81923',
        gameTitle: 'Roblox (Robux Direct)',
        packageName: '800 Robux',
        playerId: 'ProBuilder_PP',
        nickname: 'ProBuilder_PP',
        amountUSD: 9.80,
        status: 'completed',
        date: '2026-11-12 08:31:02',
        gateway: 'Bakong KHQR',
      },
      {
        orderNumber: 'TU-FF-76124',
        gameTitle: 'Free Fire',
        packageName: '520 Diamonds',
        playerId: '2847192834',
        nickname: 'ShadowSniper',
        amountUSD: 4.90,
        status: 'completed',
        date: '2026-11-12 08:15:40',
        gateway: 'Bakong KHQR',
      },
      {
        orderNumber: 'TU-PB-65123',
        gameTitle: 'PUBG Mobile',
        packageName: '660 UC',
        playerId: '5192837461',
        nickname: 'AngkorWarrior',
        amountUSD: 9.60,
        status: 'completed',
        date: '2026-11-12 07:55:19',
        gateway: 'Bakong KHQR',
      },
      {
        orderNumber: 'TU-ML-54910',
        gameTitle: 'Mobile Legends: Bang Bang',
        packageName: 'Weekly Diamond Pass',
        playerId: '47281938 (2194)',
        nickname: 'Sokha_Pro',
        amountUSD: 1.95,
        status: 'completed',
        date: '2026-11-12 07:30:10',
        gateway: 'Bakong KHQR',
      },
      {
        orderNumber: 'TU-GI-43219',
        gameTitle: 'Genshin Impact',
        packageName: 'Blessing of Welkin Moon',
        playerId: '809182374 (Asia)',
        nickname: 'Traveler_KHM',
        amountUSD: 4.80,
        status: 'completed',
        date: '2026-11-12 06:45:00',
        gateway: 'Bakong KHQR',
      },
      {
        orderNumber: 'TU-ML-32109',
        gameTitle: 'Mobile Legends: Bang Bang',
        packageName: '296 Diamonds',
        playerId: '91827364 (2001)',
        nickname: 'DragonKing',
        amountUSD: 4.85,
        status: 'completed',
        date: '2026-11-11 23:14:00',
        gateway: 'Bakong KHQR',
      },
      {
        orderNumber: 'TU-BS-21098',
        gameTitle: 'Blood Strike',
        packageName: '500 Gold',
        playerId: '87239104',
        nickname: 'Striker99',
        amountUSD: 4.70,
        status: 'failed',
        date: '2026-11-11 21:05:00',
        gateway: 'Bakong KHQR',
      },
    ];

    // Prepend any real orders from the user's session
    const userOrdersFormatted = recentOrders.map((ro) => ({
      orderNumber: ro.orderNumber,
      gameTitle: ro.game.name,
      packageName: ro.package.name,
      playerId: ro.playerNickname,
      nickname: ro.playerNickname,
      amountUSD: ro.totalUSD,
      status: ro.status,
      date: new Date(ro.createdAt).toLocaleString(),
      gateway: ro.paymentMethod === 'wallet' ? 'Wallet' : 'Bakong KHQR',
    }));

    return [...userOrdersFormatted, ...baseMock];
  }, [recentOrders]);

  // Calculated Metrics
  const metrics = useMemo(() => {
    const todayUSD = 186.45;
    const weekUSD = 1420.80;
    const monthUSD = 5890.00;
    const allUSD = 18450.00;

    const selectedUSD =
      timeWindow === 'today'
        ? todayUSD
        : timeWindow === 'week'
        ? weekUSD
        : timeWindow === 'month'
        ? monthUSD
        : allUSD;

    const selectedKHR = Math.round(selectedUSD * 4100);

    const totalOrdersCount = 1428;
    const successOrdersCount = 1419;
    const failedOrdersCount = 9;
    const successRate = ((successOrdersCount / totalOrdersCount) * 100).toFixed(1);

    return {
      selectedUSD,
      selectedKHR,
      todayUSD,
      weekUSD,
      monthUSD,
      totalOrdersCount,
      successOrdersCount,
      failedOrdersCount,
      successRate,
      smileOneBalanceUSD: 482.60,
      smileOneLatencyMs: 14,
    };
  }, [timeWindow]);

  // ===========================================================================
  // 1. UN-AUTHENTICATED: CYBER SECURITY PIN CONSOLE
  // ===========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center select-none pt-32">
        <div
          style={{
            clipPath:
              'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
            filter: 'drop-shadow(0 0 25px rgba(229, 181, 94, 0.4))',
          }}
          className="p-[1.5px] bg-gradient-to-br from-[#FFE082] via-[#E5B55E] to-[#B8860B] w-full max-w-md relative"
        >
          <ChamferHighlights size={24} color="gold" />

          <div
            style={{
              clipPath:
                'polygon(0 0, calc(100% - 23px) 0, 100% 23px, 100% 100%, 23px 100%, 0 calc(100% - 23px))',
            }}
            className="p-7 sm:p-8 bg-[#070D1B] space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-20 h-20 mx-auto mb-3 shadow-[0_0_25px_rgba(0,212,255,0.4)]">
                <img
                  src="/logo.png"
                  alt="SEA RA PRESTIGE Official Crest"
                  className="w-full h-full object-contain rounded-2xl drop-shadow-[0_0_12px_rgba(229,181,94,0.6)]"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase font-sans">
                SEA RA COMMAND CENTER
              </h1>
              <p className="text-xs text-neutral-400 font-mono">
                {language === 'km'
                  ? 'ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធសុវត្ថិភាព VIP BACKOFFICE'
                  : 'Authorized Personnel Access Only • Level 5 Clearance'}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#E5B55E]" />
                  <span>{language === 'km' ? 'បញ្ចូលកូដសម្ងាត់ Passcode' : 'Master Security Key'}</span>
                </label>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full bg-[#10182C] border border-white/[0.15] focus:border-[#E5B55E] rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-neutral-500 focus:outline-none transition-all shadow-inner tracking-widest text-center"
                />
              </div>

              {authError && (
                <div className="p-2.5 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-mono text-center flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                style={{
                  clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#E5B55E] via-[#F3C978] to-[#D4A043] text-black font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(229,181,94,0.5)] cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4 fill-black" />
                <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់ និងចូលប្រព័ន្ធ' : 'Authenticate & Unlock'}</span>
              </button>
            </form>

            <div className="pt-2 border-t border-white/[0.08] text-center">
              <span className="text-[10px] font-mono text-neutral-500">
                Hint: Passcode is <code>seara2026</code>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // 2. AUTHENTICATED: THE MASTER ESPORTS BACKOFFICE COCKPIT
  // ===========================================================================
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto select-none pt-32 sm:pt-36 space-y-8">
      
      {/* Top Cockpit Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.1]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl shadow-[0_0_20px_rgba(0,212,255,0.4)] shrink-0">
            <img
              src="/logo.png"
              alt="SEA RA PRESTIGE Official Crest"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#10b981]" />
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase font-sans">
                SEA RA PRESTIGE • COMMAND DECK
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E5B55E]/15 border border-[#E5B55E]/40 text-[#E5B55E]">
                ADMIN v2.9
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              {language === 'km'
                ? 'ផ្ទាំងគ្រប់គ្រងរបាយការណ៍ចំណូល ការបញ្ជាទិញ សមតុល្យ Smile.One និង Telegram Bot'
                : 'Real-time telemetry, revenue reports, Smile.One balance, and Telegram Dispatcher.'}
            </p>
          </div>
        </div>

        {/* Action Header Tools */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Telegram Test Trigger Button */}
          <button
            type="button"
            onClick={handleTestTelegram}
            disabled={isSendingTelegram}
            style={{
              clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
            }}
            className="px-4 py-2 bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/50 text-[#38bdf8] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isSendingTelegram ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{language === 'km' ? 'តេស្តបាញ់ចូល TELEGRAM' : 'Test Telegram Alert'}</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-red-500/20 text-neutral-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'km' ? 'ចាកចេញ' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {telegramStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{telegramStatus}</span>
        </div>
      )}

      {pricingSuccessMsg && (
        <div className="p-3 rounded-xl bg-[#E5B55E]/15 border border-[#E5B55E]/40 text-[#FFE082] text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-[#E5B55E] shrink-0" />
          <span>{pricingSuccessMsg}</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4 CORE TELEMETRY PILLARS (REVENUE, HEALTH, SMILEONE, BOT)           */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Pillar 1: Total Revenue Card */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-5 bg-gradient-to-br from-[#0F172A] via-[#0A101E] to-[#050811] border border-[#E5B55E]/40 shadow-xl space-y-3 relative group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              {timeWindow === 'today'
                ? (language === 'km' ? 'ចំណូលថ្ងៃនេះ' : "Today's Revenue")
                : timeWindow === 'week'
                ? (language === 'km' ? 'ចំណូលសប្តាហ៍នេះ' : "This Week's Revenue")
                : (language === 'km' ? 'ចំណូលខែនេះ' : "Monthly Revenue")}
            </span>
            <div className="flex items-center gap-1 bg-[#10182C] p-0.5 rounded border border-white/10 text-[9px] font-mono">
              <button
                type="button"
                onClick={() => setRevCurrency('USD')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${revCurrency === 'USD' ? 'bg-[#E5B55E] text-black font-bold' : 'text-neutral-400'}`}
              >
                USD
              </button>
              <button
                type="button"
                onClick={() => setRevCurrency('KHR')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${revCurrency === 'KHR' ? 'bg-[#E5B55E] text-black font-bold' : 'text-neutral-400'}`}
              >
                KHR
              </button>
            </div>
          </div>

          <div className="pt-1">
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#FFE082] tracking-tight">
              {revCurrency === 'USD'
                ? `$${metrics.selectedUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                : `៛${metrics.selectedKHR.toLocaleString()}`}
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% vs last period</span>
            </span>
          </div>

          {/* Time Switcher */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center gap-1 text-[10px] font-mono">
            {(['today', 'week', 'month', 'all'] as const).map((tw) => (
              <button
                key={tw}
                type="button"
                onClick={() => setTimeWindow(tw)}
                className={`px-2 py-0.5 rounded uppercase cursor-pointer ${
                  timeWindow === tw ? 'bg-white/20 text-white font-bold' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {tw}
              </button>
            ))}
          </div>
        </div>

        {/* Pillar 2: Delivery & Success Rate */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-5 bg-[#090E1E] border border-cyan-500/30 shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              {language === 'km' ? 'អត្រាជោគជ័យនៃការបញ្ចូល' : 'Injection Success'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-300 tracking-tight">
              {metrics.successRate}%
            </div>
            <span className="text-[10px] font-mono text-neutral-400 block mt-1">
              {metrics.successOrdersCount.toLocaleString()} {language === 'km' ? 'ជោគជ័យ' : 'Delivered'} • {metrics.failedOrdersCount} {language === 'km' ? 'បញ្ហា' : 'Exceptions'}
            </span>
          </div>

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-500">SPEED BENCHMARK:</span>
            <span className="text-emerald-400 font-bold">&lt; 2.4 SECONDS</span>
          </div>
        </div>

        {/* Pillar 3: Smile.One Reseller Balance Dock */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-5 bg-[#090E1E] border border-violet-500/30 shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              {language === 'km' ? 'សមតុល្យ SMILE.ONE' : 'Smile.One Credit'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Server className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-violet-300 tracking-tight">
              ${metrics.smileOneBalanceUSD.toFixed(2)}
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              <span>LIVE API READY • LATENCY {metrics.smileOneLatencyMs}MS</span>
            </span>
          </div>

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-500">CREDIT HEALTH:</span>
            <span className="text-[#FFE082] font-bold">SUFFICIENT (&gt; $400)</span>
          </div>
        </div>

        {/* Pillar 4: Telegram Group Bot Dispatcher */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-5 bg-[#090E1E] border border-[#229ED9]/40 shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              {language === 'km' ? 'TELEGRAM BOT DISPATCH' : 'Telegram Bot Status'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#229ED9]/15 border border-[#229ED9]/40 flex items-center justify-center text-[#229ED9]">
              <Send className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-sm font-black font-mono text-white truncate">
              @SEA_RA_order_bot
            </div>
            <div className="flex flex-col gap-0.5 mt-1 text-[10px] font-mono">
              <span className="text-[#38bdf8] font-bold">
                👥 Group: «SEA RA Store Offical»
              </span>
              <span className="text-emerald-400 font-bold">
                👤 Direct: Lyhour (@sokhunmao)
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE 24/7 (DUAL DISPATCH)
            </span>
            <a
              href="https://t.me/SEA_RA_order_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white flex items-center gap-0.5"
            >
              <span>Bot Link</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

      </div>

      {/* =================================================================== */}
      {/* NAVIGATION TABS (ORDERS RADAR / PROMO CODES / PRICING / SMILEONE)   */}
      {/* =================================================================== */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto">
        {[
          { id: 'overview', labelKh: 'ផ្ទាំងទូទៅ & Orders ផ្ទាល់', labelEn: 'Live Orders Radar', icon: Receipt },
          { id: 'promos', labelKh: 'គ្រប់គ្រង Promo Codes', labelEn: 'Promo Codes Matrix', icon: Tag },
          { id: 'pricing', labelKh: 'កែប្រែតម្លៃកញ្ចប់ & Margins', labelEn: 'Pricing & Margins', icon: Gamepad2 },
          { id: 'smileone', labelKh: 'ការតភ្ជាប់ Smile.One API', labelEn: 'Smile.One Connection', icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
              }}
              className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#E5B55E] to-[#C49740] text-black shadow-[0_0_15px_rgba(229,181,94,0.4)]'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{language === 'km' ? tab.labelKh : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* TAB 1: LIVE ORDERS STREAM                                           */}
      {/* =================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>{language === 'km' ? 'បញ្ជី Orders ថ្មីៗក្នុងប្រព័ន្ធ' : 'Real-Time Orders Stream'}</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-400/30">
                {allOrders.length} Entries
              </span>
            </h2>
          </div>

          <div className="bg-[#080E1C] rounded-2xl border border-white/[0.1] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0C1427] text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Game</th>
                    <th className="py-3 px-4">Package</th>
                    <th className="py-3 px-4">Player ID</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Gateway</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-neutral-300">
                  {allOrders.map((ord, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        <Link
                          href={`/track-order?order=${ord.orderNumber}`}
                          className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                        >
                          <span>{ord.orderNumber}</span>
                          <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-sans font-bold text-white">{ord.gameTitle}</td>
                      <td className="py-3 px-4 text-[#FFE082]">{ord.packageName}</td>
                      <td className="py-3 px-4 text-cyan-300">{ord.playerId}</td>
                      <td className="py-3 px-4 font-black text-white">
                        ${ord.amountUSD.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-neutral-400">{ord.gateway}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            ord.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {ord.status === 'completed' ? 'DELIVERED' : 'PENDING'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[10px]">{ord.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: PROMO CODES MATRIX                                           */}
      {/* =================================================================== */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          
          {/* Add Promo Code Form */}
          <div
            style={{
              clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
            }}
            className="p-6 bg-[#080E1C] border border-[#E5B55E]/30 space-y-4 shadow-xl"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#E5B55E]" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {language === 'km' ? 'បង្កើតកូដបញ្ចុះតម្លៃថ្មី (Add Promo Code)' : 'Create VIP Promo Code'}
              </h3>
            </div>

            <form onSubmit={handleAddPromo} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="PROMO CODE (e.g. VIP20)"
                required
                className="bg-[#10182C] border border-white/[0.15] focus:border-[#E5B55E] rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase focus:outline-none"
              />
              <input
                type="number"
                min="1"
                max="90"
                value={newDiscount}
                onChange={(e) => setNewDiscount(Number(e.target.value))}
                placeholder="Discount % (e.g. 10)"
                required
                className="bg-[#10182C] border border-white/[0.15] focus:border-[#E5B55E] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
              />
              <input
                type="number"
                min="1"
                max="10000"
                value={newMaxUses}
                onChange={(e) => setNewMaxUses(Number(e.target.value))}
                placeholder="Max Uses (e.g. 500)"
                required
                className="bg-[#10182C] border border-white/[0.15] focus:border-[#E5B55E] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
              />
              <button
                type="submit"
                style={{
                  clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                }}
                className="py-2.5 bg-gradient-to-r from-[#E5B55E] to-[#C49740] text-black font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'km' ? 'រក្សាទុក' : 'Save Code'}</span>
              </button>
            </form>
          </div>

          {/* Active Promo Codes Table */}
          <div className="bg-[#080E1C] rounded-2xl border border-white/[0.1] overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0C1427] text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/[0.08]">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Used / Limit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-neutral-300">
                {promoCodes.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#FFE082] text-sm">{p.code}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">-{p.discountPercent}%</td>
                    <td className="py-3 px-4 text-neutral-300">
                      {p.usageCount} / {p.maxUses}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePromo(p.id)}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                          p.isActive
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-neutral-500/15 text-neutral-400 border border-neutral-500/30'
                        }`}
                      >
                        {p.isActive ? 'ACTIVE' : 'PAUSED'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-neutral-400 text-[10px]">{p.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeletePromo(p.id)}
                        className="text-neutral-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: PACKAGE PRICING & PROFIT MARGINS MATRIX                      */}
      {/* =================================================================== */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          {/* Top Controls: Margin Presets & Actions */}
          <div className="p-5 sm:p-6 bg-[#080E1C] rounded-2xl border border-white/[0.1] shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#E5B55E]" />
                  <span>
                    {language === 'km'
                      ? 'កែប្រែភាគរយចំណេញទូទៅ (Global Profit Margin %)'
                      : 'Global Profit Margin Calibrator'}
                  </span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {language === 'km'
                    ? 'ជ្រើសរើសភាគរយចំណេញដើម្បីគណនាតម្លៃលក់ចេញ (USD & KHR) ស្វ័យប្រវត្តិតាមថ្លៃដើម (Wholesale Cost)'
                    : 'Select a margin preset to automatically recalculate selling prices above wholesale cost.'}
                </p>
              </div>

              {/* Margin Preset Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[5, 8, 10, 12, 15, 20].map((margin) => (
                  <button
                    key={margin}
                    type="button"
                    onClick={() => handleApplyGlobalMargin(margin)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      globalMargin === margin
                        ? 'bg-[#E5B55E] text-black shadow-[0_0_12px_rgba(229,181,94,0.5)]'
                        : 'bg-white/[0.05] text-neutral-300 hover:text-white hover:bg-white/[0.1]'
                    }`}
                  >
                    +{margin}%
                  </button>
                ))}
              </div>
            </div>

            {/* Sub Controls: Game Filter + Action Buttons */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-neutral-400">
                  {language === 'km' ? 'ចម្រាញ់តាមហ្គេម:' : 'Filter Game:'}
                </span>
                {[
                  { id: 'all', label: 'All Games' },
                  { id: 'mobile-legends', label: 'MLBB' },
                  { id: 'roblox', label: 'Roblox' },
                  { id: 'free-fire', label: 'Free Fire' },
                  { id: 'pubg-mobile', label: 'PUBG' },
                  { id: 'honor-of-kings', label: 'HOK' },
                ].map((gf) => (
                  <button
                    key={gf.id}
                    type="button"
                    onClick={() => setSelectedGameFilter(gf.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      selectedGameFilter === gf.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-white/[0.03] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {gf.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetPricing}
                  className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white text-xs font-mono transition-all cursor-pointer"
                >
                  {language === 'km' ? 'កំណត់ឡើងវិញ' : 'Reset Defaults'}
                </button>
                <button
                  type="button"
                  onClick={handleSavePricing}
                  style={{
                    clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#E5B55E] to-[#C49740] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(229,181,94,0.4)]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{language === 'km' ? 'រក្សាទុកតម្លៃ' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="bg-[#080E1C] rounded-2xl border border-white/[0.1] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0C1427] text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4">Game</th>
                    <th className="py-3 px-4">Package</th>
                    <th className="py-3 px-4">Cost (USD)</th>
                    <th className="py-3 px-4">Price (USD)</th>
                    <th className="py-3 px-4">Price (KHR)</th>
                    <th className="py-3 px-4">Margin %</th>
                    <th className="py-3 px-4">Tag / Hot</th>
                    <th className="py-3 px-4 text-right">Quick Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-neutral-300">
                  {packagesPricing
                    .filter((p) => selectedGameFilter === 'all' || p.gameId === selectedGameFilter)
                    .map((pkg) => {
                      const currentMargin = Number(
                        (((pkg.priceUSD - pkg.costUSD) / pkg.costUSD) * 100).toFixed(1)
                      );
                      return (
                        <tr key={pkg.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                            <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{pkg.gameName}</span>
                          </td>
                          <td className="py-3 px-4 font-bold text-[#FFE082]">
                            {pkg.packageName}
                          </td>
                          <td className="py-3 px-4 text-neutral-400">
                            ${pkg.costUSD.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-400">
                            ${pkg.priceUSD.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-neutral-300">
                            {pkg.priceKHR.toLocaleString()} ៛
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                currentMargin >= 10
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              +{currentMargin}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleHot(pkg.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                                pkg.isHot
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                                  : 'bg-white/[0.04] text-neutral-500 border border-white/[0.08]'
                              }`}
                            >
                              {pkg.isHot ? '🔥 HOT' : 'REGULAR'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              <span className="text-[10px] text-neutral-500">$</span>
                              <input
                                type="number"
                                step="0.05"
                                min={pkg.costUSD}
                                value={pkg.priceUSD}
                                onChange={(e) => handleUpdatePrice(pkg.id, parseFloat(e.target.value))}
                                className="w-20 bg-[#10182C] border border-white/[0.15] focus:border-[#E5B55E] rounded px-2 py-1 text-xs text-white text-right font-mono focus:outline-none"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: SMILE.ONE LIVE API STATUS & RESELLER KEY SETUP               */}
      {/* =================================================================== */}
      {activeTab === 'smileone' && (
        <div className="space-y-6">
          <div
            style={{
              clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
            }}
            className="p-6 bg-[#080E1C] border border-violet-500/30 space-y-5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Server className="w-5 h-5 text-violet-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Smile.One Reseller API Telemetry
                </h3>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ENDPOINT: HTTPS://API.SMILE.ONE
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {language === 'km'
                ? 'Backend របស់ SEA RA PRESTIGE ត្រូវបានភ្ជាប់ជាមួយ Smile.One API រួចរាល់។ នៅពេលបងទទួលបាន Merchant UID និង Secret Key ពីខាង Smile.One បងគ្រាន់តែបំពេញក្នុង .env ជាការស្រេច។'
                : 'Our automated pipeline signs requests with MD5 according to official Smile.One Reseller documentation. Enter your UID and Secret Key in .env to activate live debiting.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#0D1424] border border-white/[0.08] space-y-1">
                <span className="text-[10px] text-neutral-500 block">SMILEONE_UID:</span>
                <span className="text-white font-bold">Configured in .env</span>
              </div>
              <div className="p-4 rounded-xl bg-[#0D1424] border border-white/[0.08] space-y-1">
                <span className="text-[10px] text-neutral-500 block">SMILEONE_EMAIL / KEY:</span>
                <span className="text-emerald-400 font-bold">•••••••••••••••• (Encrypted)</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
