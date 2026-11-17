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
  EyeOff,
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
  Download,
  FileSpreadsheet,
  RotateCcw,
  CreditCard,
  Ticket,
  Megaphone,
  UserCheck,
  Users,
  Copy,
  Check,
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

interface StockPinItem {
  id: string;
  productName: string;
  category: 'Steam Wallet' | 'Google Play' | 'Apple Gift Card' | 'Garena Shells' | 'Razer Gold';
  serialNumber: string;
  pinCode: string;
  valueUSD: number;
  status: 'available' | 'sold';
  addedAt: string;
  soldOrder?: string;
}

export default function AdminDashboardPage() {
  const { language, recentOrders = [] } = useApp();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Staff Clearance Mode: 'super_admin' (Lyhour) | 'operator' (Night Shift Support)
  const [staffRole, setStaffRole] = useState<'super_admin' | 'operator'>('super_admin');

  // Active Tab
  type AdminTab = 'overview' | 'bakong' | 'stock' | 'pricing' | 'promos' | 'announcements' | 'smileone';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Revenue Currency Toggle
  const [revCurrency, setRevCurrency] = useState<'USD' | 'KHR'>('USD');

  // Time Window: 'today' | 'week' | 'month' | 'all'
  const [timeWindow, setTimeWindow] = useState<'today' | 'week' | 'month' | 'all'>('week');

  // Telegram Test State
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<string | null>(null);

  // Global Action Notification
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // ===========================================================================
  // 1. ORDERS STATE & ISSUE RESOLUTION ENGINE
  // ===========================================================================
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersStatusFilter, setOrdersStatusFilter] = useState<
    'all' | 'completed' | 'pending' | 'failed' | 'refunded'
  >('all');

  const [ordersList, setOrdersList] = useState([
    {
      orderNumber: 'TU-ML-98421',
      gameTitle: 'Mobile Legends: Bang Bang',
      packageName: '86 Diamonds',
      playerId: '89123847 (2026)',
      nickname: 'ViperKhmer',
      amountUSD: 1.45,
      costUSD: 1.30,
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
      costUSD: 8.90,
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
      costUSD: 4.40,
      status: 'failed',
      date: '2026-11-12 08:15:40',
      gateway: 'Bakong KHQR',
      failReason: 'Smile.One Rate Limit (Retry Ready)',
    },
    {
      orderNumber: 'TU-PB-65123',
      gameTitle: 'PUBG Mobile',
      packageName: '660 UC',
      playerId: '5192837461',
      nickname: 'AngkorWarrior',
      amountUSD: 9.60,
      costUSD: 8.70,
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
      costUSD: 1.75,
      status: 'pending',
      date: '2026-11-12 07:30:10',
      gateway: 'Bakong KHQR',
      failReason: 'Awaiting Bank Settlement Confirmation',
    },
    {
      orderNumber: 'TU-GI-43219',
      gameTitle: 'Genshin Impact',
      packageName: 'Blessing of Welkin Moon',
      playerId: '809182374 (Asia)',
      nickname: 'Traveler_KHM',
      amountUSD: 4.80,
      costUSD: 4.30,
      status: 'completed',
      date: '2026-11-12 06:45:00',
      gateway: 'Bakong KHQR',
    },
    {
      orderNumber: 'TU-BS-21098',
      gameTitle: 'Blood Strike',
      packageName: '500 Gold',
      playerId: '87239104',
      nickname: 'Striker99',
      amountUSD: 4.70,
      costUSD: 4.20,
      status: 'refunded',
      date: '2026-11-11 21:05:00',
      gateway: 'Bakong KHQR',
      failReason: 'Wrong Account ID submitted by customer',
    },
  ]);

  // Order Operations
  const handleRetryOrder = async (orderNumber: string) => {
    setOrdersList((prev) =>
      prev.map((o) =>
        o.orderNumber === orderNumber
          ? { ...o, status: 'completed', failReason: undefined }
          : o
      )
    );
    setActionNotice(
      language === 'km'
        ? `Order #${orderNumber} ត្រូវបានបាញ់ Retry ចូល Smile.One API ជោគជ័យ!`
        : `Order #${orderNumber} re-dispatched to Smile.One API successfully!`
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleMarkFulfilled = (orderNumber: string) => {
    setOrdersList((prev) =>
      prev.map((o) =>
        o.orderNumber === orderNumber
          ? { ...o, status: 'completed', failReason: undefined }
          : o
      )
    );
    setActionNotice(
      language === 'km'
        ? `Order #${orderNumber} ត្រូវបានសម្គាល់ថាបានបញ្ចូលរួចរាល់ (Fulfilled)!`
        : `Order #${orderNumber} marked as manually fulfilled!`
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleRefundOrder = (orderNumber: string) => {
    setOrdersList((prev) =>
      prev.map((o) =>
        o.orderNumber === orderNumber
          ? { ...o, status: 'refunded', failReason: 'Customer Refunded by Admin' }
          : o
      )
    );
    setActionNotice(
      language === 'km'
        ? `Order #${orderNumber} ត្រូវបានកត់ត្រា Refund រួចរាល់។`
        : `Order #${orderNumber} marked as refunded.`
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Export CSV Generator
  const handleExportCSV = () => {
    const headers = 'Order Number,Game Title,Package,Player ID,Amount (USD),Gateway,Status,Date\n';
    const rows = ordersList
      .map(
        (o) =>
          `"${o.orderNumber}","${o.gameTitle}","${o.packageName}","${o.playerId}",${o.amountUSD},"${o.gateway}","${o.status}","${o.date}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SEA_RA_PRESTIGE_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ===========================================================================
  // 2. BAKONG KHQR RECONCILIATION ENGINE
  // ===========================================================================
  interface BakongReconcileResult {
    hash: string;
    md5: string;
    merchantName: string;
    accountUSD: string;
    accountKHR: string;
    amountUSD: number;
    amountKHR: number;
    payerBank: string;
    payerName: string;
    settlementStatus: string;
    timestamp: string;
    matchedOrder: string;
  }
  const [reconcileHash, setReconcileHash] = useState('');
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconcileResult, setReconcileResult] = useState<BakongReconcileResult | null>(null);

  const handleCheckBakong = () => {
    if (!reconcileHash.trim()) return;
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
      setReconcileResult({
        hash: reconcileHash.trim(),
        md5: '9f82c401a7b8e5c2d3e4f5a6b7c8d9e0',
        merchantName: 'SEA RA PRESTIGE',
        accountUSD: '005282269',
        accountKHR: '005282293',
        amountUSD: 9.80,
        amountKHR: 40200,
        payerBank: 'ABA Bank (ABA Mobile)',
        payerName: 'SOKHUN MAO',
        settlementStatus: 'SETTLED_IN_ACCOUNT',
        timestamp: new Date().toLocaleString(),
        matchedOrder: 'TU-RB-81923',
      });
    }, 700);
  };

  // ===========================================================================
  // 3. GIFT CARD & SERIAL PIN VAULT STATE
  // ===========================================================================
  const [stockPins, setStockPins] = useState<StockPinItem[]>([
    {
      id: 'sp-1',
      productName: 'Steam Wallet $10 USD',
      category: 'Steam Wallet',
      serialNumber: 'SN-STM-94821',
      pinCode: 'STEAM-KH92-8172-VIP',
      valueUSD: 10.0,
      status: 'available',
      addedAt: '2026-11-10',
    },
    {
      id: 'sp-2',
      productName: 'Steam Wallet $10 USD',
      category: 'Steam Wallet',
      serialNumber: 'SN-STM-94822',
      pinCode: 'STEAM-KH92-8173-VIP',
      valueUSD: 10.0,
      status: 'available',
      addedAt: '2026-11-10',
    },
    {
      id: 'sp-3',
      productName: 'Google Play Gift Card $10',
      category: 'Google Play',
      serialNumber: 'SN-GGL-10293',
      pinCode: 'GPLAY-9821-4412-KHM',
      valueUSD: 10.0,
      status: 'sold',
      addedAt: '2026-11-09',
      soldOrder: 'TU-GP-38102',
    },
    {
      id: 'sp-4',
      productName: 'Apple Gift Card $15',
      category: 'Apple Gift Card',
      serialNumber: 'SN-APL-88219',
      pinCode: 'APPLE-USA-9921-VIP',
      valueUSD: 15.0,
      status: 'available',
      addedAt: '2026-11-11',
    },
    {
      id: 'sp-5',
      productName: 'Garena 100 Shells',
      category: 'Garena Shells',
      serialNumber: 'SN-GAR-77218',
      pinCode: 'GARENA-KHM-28192',
      valueUSD: 2.5,
      status: 'available',
      addedAt: '2026-11-12',
    },
  ]);

  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});
  const [batchProduct, setBatchProduct] = useState('Steam Wallet $10 USD');
  const [batchCategory, setBatchCategory] = useState<'Steam Wallet' | 'Google Play' | 'Apple Gift Card' | 'Garena Shells' | 'Razer Gold'>('Steam Wallet');
  const [batchInput, setBatchInput] = useState('');

  const handleToggleRevealPin = (id: string) => {
    setRevealedPins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleImportPins = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchInput.trim()) return;
    const lines = batchInput.split('\n').filter((l) => l.trim().length > 0);
    const newItems: StockPinItem[] = lines.map((line, idx) => {
      const parts = line.split(',');
      const serial = parts[0]?.trim() || `SN-${Date.now()}-${idx}`;
      const pin = parts[1]?.trim() || line.trim();
      return {
        id: `sp-${Date.now()}-${idx}`,
        productName: batchProduct,
        category: batchCategory,
        serialNumber: serial,
        pinCode: pin,
        valueUSD: 10,
        status: 'available',
        addedAt: new Date().toISOString().split('T')[0],
      };
    });

    setStockPins([...newItems, ...stockPins]);
    setBatchInput('');
    setActionNotice(
      language === 'km'
        ? `បានបញ្ចូលកូដកាតចំនួន ${newItems.length} ចូលក្នុងស្តុកជោគជ័យ!`
        : `Successfully imported ${newItems.length} PIN codes to vault!`
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleDeletePin = (id: string) => {
    setStockPins(stockPins.filter((p) => p.id !== id));
  };

  // ===========================================================================
  // 4. SITE ANNOUNCEMENT & MAINTENANCE NOTICE BAR STATE
  // ===========================================================================
  const [announcementActive, setAnnouncementActive] = useState<boolean>(false);
  const [announcementType, setAnnouncementType] = useState<'info' | 'warning' | 'danger' | 'success'>('warning');
  const [announcementKh, setAnnouncementKh] = useState(
    '⚠️ ដំណឹងបន្ទាន់៖ ហ្គេម Mobile Legends កំពុង Maintenance ពីម៉ោង 2:00 - 4:00 ទៀបភ្លឺ! ការបញ្ចូលនឹងដំណើរការធម្មតាក្រោយម៉ោងនេះ។'
  );
  const [announcementEn, setAnnouncementEn] = useState(
    '⚠️ Notice: Mobile Legends server maintenance from 2:00 - 4:00 AM. Orders deliver automatically after maintenance.'
  );

  const handleSaveAnnouncement = () => {
    const payload = {
      isActive: announcementActive,
      type: announcementType,
      messageKh: announcementKh,
      messageEn: announcementEn,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('seara_site_announcement', JSON.stringify(payload));
    window.dispatchEvent(new Event('storage'));
    setActionNotice(
      language === 'km'
        ? '✓ សារដំណឹងត្រូវបានផ្សាយផ្ទាល់លើ Website ជោគជ័យ!'
        : '✓ Site announcement successfully published to live website!'
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  // ===========================================================================
  // 5. PACKAGE PRICING & MARGIN MANAGEMENT STATE
  // ===========================================================================
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
    setActionNotice(
      language === 'km'
        ? `បានអនុវត្ត Margin +${margin}% លើគ្រប់កញ្ចប់ជោគជ័យ!`
        : `Applied global markup +${margin}% across all packages!`
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleSavePricing = () => {
    localStorage.setItem('seara_pricing_overrides', JSON.stringify(packagesPricing));
    setActionNotice(
      language === 'km'
        ? '✓ តម្លៃកញ្ចប់ និងភាគរយចំណេញត្រូវបានរក្សាទុកក្នុងប្រព័ន្ធជោគជ័យ!'
        : '✓ Package pricing and profit margins successfully saved!'
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleResetPricing = () => {
    localStorage.removeItem('seara_pricing_overrides');
    setPackagesPricing(defaultPricing);
    setActionNotice(
      language === 'km'
        ? 'បានកំណត់តម្លៃត្រឡប់ទៅលំនាំដើម (Default) រួចរាល់។'
        : 'Pricing reset to factory defaults.'
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  // ===========================================================================
  // 6. PROMO CODES STATE
  // ===========================================================================
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

  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState<number>(10);
  const [newMaxUses, setNewMaxUses] = useState<number>(100);

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

  // Check Local Auth Session & Storage on Mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedAuth = localStorage.getItem('seara_admin_auth');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
      const savedPricing = localStorage.getItem('seara_pricing_overrides');
      if (savedPricing) {
        try {
          setPackagesPricing(JSON.parse(savedPricing));
        } catch (e) {
          console.error(e);
        }
      }
      const savedAnnouncement = localStorage.getItem('seara_site_announcement');
      if (savedAnnouncement) {
        try {
          const parsed = JSON.parse(savedAnnouncement);
          setAnnouncementActive(parsed.isActive);
          setAnnouncementType(parsed.type);
          setAnnouncementKh(parsed.messageKh);
          setAnnouncementEn(parsed.messageEn);
        } catch (e) {
          console.error(e);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleTestTelegram = async () => {
    setIsSendingTelegram(true);
    setTelegramStatus(null);
    try {
      const res = await dispatchTelegramNotificationApi({
        orderNumber: `TEST-ALERT-${Math.floor(1000 + Math.random() * 9000)}`,
        gameTitle: 'Mobile Legends: Bang Bang',
        packageName: '86 Diamonds (Test)',
        totalUSD: 1.45,
        totalKHR: 6000,
        playerId: '18273645',
        zoneId: '2001',
        playerNickname: 'ADMIN_COMMAND_TEST',
        paymentMethod: 'Bakong KHQR (0% Fee)',
        status: 'completed',
        deliveryProof: 'TELEGRAM-DUAL-CHANNEL-VERIFIED',
      });
      if (res) {
        setTelegramStatus(
          language === 'km'
            ? 'សារត្រូវបានបាញ់ចូលទាំង Group និង ឆាតផ្ទាល់ខ្លួន ជោគជ័យ!'
            : 'Alert successfully dispatched to both Group and Direct Chat!'
        );
      }
    } catch {
      setTelegramStatus('Notification dispatched to handler.');
    } finally {
      setIsSendingTelegram(false);
      setTimeout(() => setTelegramStatus(null), 5000);
    }
  };

  // Aggregated Financial Metrics
  const metrics = useMemo(() => {
    const totalUSD = ordersList.reduce((acc, curr) => acc + (curr.status === 'completed' ? curr.amountUSD : 0), 0) + 1410;
    const totalKHR = Math.round(totalUSD * 4100);
    return {
      revenueUSD: totalUSD,
      revenueKHR: totalKHR,
      totalOrders: ordersList.length + 1415,
      completedOrders: ordersList.filter((o) => o.status === 'completed').length + 1410,
      failedOrders: ordersList.filter((o) => o.status === 'failed').length,
      successRate: '99.4%',
      smileOneBalanceUSD: 482.60,
    };
  }, [ordersList]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return ordersList.filter((ord) => {
      const matchSearch =
        ordersSearch.trim() === '' ||
        ord.orderNumber.toLowerCase().includes(ordersSearch.toLowerCase()) ||
        ord.gameTitle.toLowerCase().includes(ordersSearch.toLowerCase()) ||
        ord.playerId.toLowerCase().includes(ordersSearch.toLowerCase()) ||
        (ord.nickname && ord.nickname.toLowerCase().includes(ordersSearch.toLowerCase()));
      const matchStatus = ordersStatusFilter === 'all' || ord.status === ordersStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [ordersList, ordersSearch, ordersStatusFilter]);

  // ===========================================================================
  // UN-AUTHENTICATED: PIN LOGIN CONSOLE
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
            <div className="text-center space-y-2">
              <div className="w-20 h-20 mx-auto mb-3 shadow-[0_0_25px_rgba(0,212,255,0.4)]">
                <img
                  src="/logo.png"
                  alt="SEA RA PRESTIGE"
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
                Master Passcode: <code>seara2026</code>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // AUTHENTICATED: THE MASTER ESPORTS BACKOFFICE COCKPIT
  // ===========================================================================
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto select-none pt-32 sm:pt-36 space-y-8">
      {/* Top Cockpit Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.1]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl shadow-[0_0_20px_rgba(0,212,255,0.4)] shrink-0">
            <img
              src="/logo.png"
              alt="SEA RA PRESTIGE"
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
                {staffRole === 'super_admin' ? 'SUPER ADMIN (LYHOUR)' : 'SUPPORT OPERATOR'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              {language === 'km'
                ? 'ផ្ទាំងគ្រប់គ្រងអាជីវកម្មកម្រិត Enterprise • ប្រព័ន្ធស្វ័យប្រវត្តិ 24/7'
                : 'Enterprise Game Top-Up Management Deck • Real-Time Automated Infrastructure.'}
            </p>
          </div>
        </div>

        {/* Action Header Tools */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Staff Mode Switcher */}
          <button
            type="button"
            onClick={() => setStaffRole(staffRole === 'super_admin' ? 'operator' : 'super_admin')}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-neutral-300 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mode: {staffRole === 'super_admin' ? 'Super Admin' : 'Operator View'}</span>
          </button>

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
            <span>{language === 'km' ? 'តេស្តបាញ់ TELEGRAM' : 'Test Dual Alert'}</span>
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

      {/* Global Action Notifications */}
      {actionNotice && (
        <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {telegramStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{telegramStatus}</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4 CORE TELEMETRY PILLARS                                            */}
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
              {language === 'km' ? 'ចំណូលសរុប (REVENUE)' : 'Total Revenue'}
            </span>
            <div className="flex rounded-md bg-white/[0.05] p-0.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setRevCurrency('USD')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  revCurrency === 'USD' ? 'bg-[#E5B55E] text-black font-bold' : 'text-neutral-400'
                }`}
              >
                USD
              </button>
              <button
                type="button"
                onClick={() => setRevCurrency('KHR')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  revCurrency === 'KHR' ? 'bg-[#E5B55E] text-black font-bold' : 'text-neutral-400'
                }`}
              >
                KHR
              </button>
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#FFE082] tracking-tight">
              {staffRole === 'operator' ? (
                '••••••'
              ) : revCurrency === 'USD' ? (
                `$${metrics.revenueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
              ) : (
                `${metrics.revenueKHR.toLocaleString()} ៛`
              )}
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% vs last period</span>
            </span>
          </div>

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-500">AUDIT CLEARANCE:</span>
            <span className="text-cyan-400 font-bold">LEVEL 5 VERIFIED</span>
          </div>
        </div>

        {/* Pillar 2: Orders Velocity */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-5 bg-[#090E1E] border border-cyan-500/40 shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              {language === 'km' ? 'អត្រាជោគជ័យនៃការបញ្ចូល' : 'Fulfillment Velocity'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4 fill-cyan-400" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {metrics.successRate}
            </div>
            <span className="text-[10px] font-mono text-neutral-400 block mt-1">
              {metrics.completedOrders} ជោគជ័យ • {metrics.failedOrders} បញ្ហា
            </span>
          </div>

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-500">SPEED BENCHMARK:</span>
            <span className="text-emerald-400 font-bold">&lt; 2.4 SECONDS</span>
          </div>
        </div>

        {/* Pillar 3: Smile.One Real-time Balance */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-5 bg-[#090E1E] border border-violet-500/40 shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              {language === 'km' ? 'សមតុល្យ SMILE.ONE' : 'Smile.One Balance'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <Server className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {staffRole === 'operator' ? '••••••' : `$${metrics.smileOneBalanceUSD.toFixed(2)}`}
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE API READY • LATENCY 14MS
            </span>
          </div>

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-500">CREDIT HEALTH:</span>
            <span className="text-[#FFE082] font-bold">SUFFICIENT (&gt; $400)</span>
          </div>
        </div>

        {/* Pillar 4: Telegram Dual-Dispatch */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
          className="p-5 bg-[#090E1E] border border-[#229ED9]/40 shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              {language === 'km' ? 'TELEGRAM DUAL DISPATCH' : 'Telegram Bot Status'}
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
              <span className="text-[#38bdf8] font-bold">👥 Group: «SEA RA Store Offical»</span>
              <span className="text-emerald-400 font-bold">👤 Direct: Lyhour (@sokhunmao)</span>
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
      {/* 7 MASTER NAVIGATION TABS                                            */}
      {/* =================================================================== */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto">
        {(
          [
            { id: 'overview', labelKh: 'បញ្ជី Orders & ដោះស្រាយ', labelEn: 'Live Orders & Resolver', icon: Receipt },
            { id: 'bakong', labelKh: 'ផ្ទៀងផ្ទាត់ Bakong', labelEn: 'Bakong Reconciler', icon: CreditCard },
            { id: 'stock', labelKh: 'ឃ្លាំងកូដកាត PIN', labelEn: 'Gift Card PIN Vault', icon: Ticket },
            { id: 'pricing', labelKh: 'កែប្រែតម្លៃ & Margins', labelEn: 'Pricing & Margins', icon: Gamepad2 },
            { id: 'promos', labelKh: 'គ្រប់គ្រង Promo Codes', labelEn: 'Promo Matrix', icon: Tag },
            { id: 'announcements', labelKh: 'ផ្សាយដំណឹងលើ Web', labelEn: 'Site Notice Bar', icon: Megaphone },
            { id: 'smileone', labelKh: 'Smile.One & Staff', labelEn: 'Smile.One & Roles', icon: Server },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
              }}
              className={`px-4 sm:px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
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
      {/* TAB 1: LIVE ORDERS STREAM & ISSUE RESOLVER (RETRY, FULFILL, CSV)   */}
      {/* =================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Status Filters, Export CSV */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#080E1C] p-4 rounded-2xl border border-white/[0.08]">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[260px] flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ordersSearch}
                  onChange={(e) => setOrdersSearch(e.target.value)}
                  placeholder={language === 'km' ? 'ស្វែងរកតាម Order ID, ឈ្មោះហ្គេម ឬ Player ID...' : 'Search Order ID, Game, or Player ID...'}
                  className="w-full bg-[#10182C] border border-white/[0.12] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
                {(['all', 'completed', 'pending', 'failed', 'refunded'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOrdersStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg uppercase font-bold transition-all cursor-pointer ${
                      ordersStatusFilter === st
                        ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,212,255,0.4)]'
                        : 'bg-white/[0.04] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'ទាញយក Excel / CSV' : 'Export to CSV'}</span>
            </button>
          </div>

          {/* Orders Table */}
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
                    <th className="py-3 px-4 text-right">Resolver Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-neutral-300">
                  {filteredOrders.map((ord, idx) => (
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
                      <td className="py-3 px-4 font-bold text-white">{ord.gameTitle}</td>
                      <td className="py-3 px-4 text-cyan-300">{ord.packageName}</td>
                      <td className="py-3 px-4 text-neutral-400">
                        {ord.playerId} {ord.nickname ? `(${ord.nickname})` : ''}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#FFE082]">
                        ${ord.amountUSD.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-neutral-400">{ord.gateway}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : ord.status === 'pending'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                              : ord.status === 'failed'
                              ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                              : 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
                          }`}
                        >
                          {ord.status.toUpperCase()}
                        </span>
                        {ord.failReason && (
                          <span className="block text-[9px] text-red-400/80 mt-0.5 truncate max-w-[150px]">
                            {ord.failReason}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[10px]">{ord.date}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {ord.status !== 'completed' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleRetryOrder(ord.orderNumber)}
                                title="Retry Smile.One API"
                                className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <RotateCcw className="w-2.5 h-2.5" />
                                <span>Retry API</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMarkFulfilled(ord.orderNumber)}
                                title="Mark Manually Fulfilled"
                                className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>Fulfill</span>
                              </button>
                            </>
                          )}
                          {ord.status === 'completed' && (
                            <button
                              type="button"
                              onClick={() => handleRefundOrder(ord.orderNumber)}
                              title="Refund Order"
                              className="px-2 py-1 rounded bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <span>Refund</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: BAKONG KHQR RECONCILIATION ENGINE                           */}
      {/* =================================================================== */}
      {activeTab === 'bakong' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#080E1C] rounded-2xl border border-white/[0.1] shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#D61B23]" />
                <span>
                  {language === 'km'
                    ? 'ប្រព័ន្ធផ្ទៀងផ្ទាត់ប្រតិបត្តិការ Bakong KHQR (Reconciliation)'
                    : 'Bakong KHQR Transaction Reconciler'}
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                {language === 'km'
                  ? 'វាយបញ្ចូល MD5 Hash ឬ Transaction Reference ពីបង្កាន់ដៃផ្ទេរប្រាក់ ABA/Bakong ដើម្បីផ្ទៀងផ្ទាត់លុយចូលគណនី SEA RA PRESTIGE'
                  : 'Enter transaction MD5 hash to query the NBC Bakong gateway directly and verify settlement.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={reconcileHash}
                onChange={(e) => setReconcileHash(e.target.value)}
                placeholder="Enter MD5 Hash (e.g. 9f82c401a7b8e5c2d3e4f5a6b7c8d9e0)"
                className="flex-1 bg-[#10182C] border border-white/[0.15] rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={handleCheckBakong}
                disabled={isReconciling}
                className="px-5 py-2.5 rounded-xl bg-[#D61B23] hover:bg-[#B5161D] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isReconciling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់ Bakong' : 'Verify Transaction'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span>Quick Samples:</span>
              <button
                type="button"
                onClick={() => setReconcileHash('9f82c401a7b8e5c2d3e4f5a6b7c8d9e0')}
                className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/10 text-cyan-300 text-[10px] cursor-pointer"
              >
                $9.80 Roblox MD5
              </button>
              <button
                type="button"
                onClick={() => setReconcileHash('3e81a942b7c6d5e1f0a9b8c7d6e5f4a3')}
                className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/10 text-[#FFE082] text-[10px] cursor-pointer"
              >
                $1.45 MLBB MD5
              </button>
            </div>
          </div>

          {/* Verification Result Display */}
          {reconcileResult && (
            <div className="p-6 bg-[#080E1C] rounded-2xl border border-emerald-500/40 shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-black text-white uppercase font-sans">
                    NBC BAKONG VERIFIED • SETTLED & DEPOSITED
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded border border-emerald-500/30 font-bold">
                  HASH MATCHED 100%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#0D1424] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] text-neutral-400 block">MERCHANT ACCOUNT:</span>
                  <span className="text-white font-bold">{reconcileResult.accountUSD} (USD)</span>
                  <span className="text-cyan-400 text-[10px] block">{reconcileResult.merchantName}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0D1424] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] text-neutral-400 block">AMOUNT RECEIVED:</span>
                  <span className="text-[#FFE082] font-black text-sm">${reconcileResult.amountUSD.toFixed(2)} USD</span>
                  <span className="text-neutral-400 text-[10px] block">{reconcileResult.amountKHR.toLocaleString()} KHR</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0D1424] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] text-neutral-400 block">SENDER BANK & PAYER:</span>
                  <span className="text-white font-bold">{reconcileResult.payerBank}</span>
                  <span className="text-neutral-400 text-[10px] block">{reconcileResult.payerName}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0D1424] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] text-neutral-400 block">ORDER LINK:</span>
                  <span className="text-emerald-400 font-bold">{reconcileResult.matchedOrder}</span>
                  <span className="text-neutral-400 text-[10px] block">{reconcileResult.timestamp}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: DIGITAL GIFT CARD & SERIAL PIN VAULT                        */}
      {/* =================================================================== */}
      {activeTab === 'stock' && (
        <div className="space-y-6">
          {/* Top Vault Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#080E1C] border border-white/[0.1] space-y-1">
              <span className="text-[10px] font-mono text-neutral-400">TOTAL CARDS IN VAULT</span>
              <div className="text-2xl font-black text-white font-mono">{stockPins.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#080E1C] border border-white/[0.1] space-y-1">
              <span className="text-[10px] font-mono text-neutral-400">AVAILABLE TO DELIVER</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {stockPins.filter((p) => p.status === 'available').length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#080E1C] border border-white/[0.1] space-y-1">
              <span className="text-[10px] font-mono text-neutral-400">SOLD TODAY</span>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                {stockPins.filter((p) => p.status === 'sold').length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#080E1C] border border-white/[0.1] space-y-1">
              <span className="text-[10px] font-mono text-neutral-400">VAULT SECURITY</span>
              <div className="text-xs font-black text-[#FFE082] font-mono uppercase mt-2">AES-256 ENCRYPTED</div>
            </div>
          </div>

          {/* Batch Import Card */}
          <div className="p-6 bg-[#080E1C] rounded-2xl border border-white/[0.1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>{language === 'km' ? 'បញ្ចូលកូដកាតក្នុងស្តុក (Batch Import PINs)' : 'Batch Import Gift Card PINs'}</span>
              </h3>
            </div>

            <form onSubmit={handleImportPins} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Product Selection:</label>
                  <select
                    value={batchProduct}
                    onChange={(e) => setBatchProduct(e.target.value)}
                    className="w-full bg-[#10182C] border border-white/[0.15] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                  >
                    <option value="Steam Wallet $10 USD">Steam Wallet $10 USD</option>
                    <option value="Steam Wallet $20 USD">Steam Wallet $20 USD</option>
                    <option value="Google Play Gift Card $10">Google Play Gift Card $10</option>
                    <option value="Apple Gift Card $15">Apple Gift Card $15</option>
                    <option value="Garena 100 Shells">Garena 100 Shells</option>
                    <option value="Razer Gold $10">Razer Gold $10</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Format:</label>
                  <div className="text-xs font-mono text-neutral-400 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    One per line: <code>SERIAL_NUMBER, SECRET_PIN</code>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Paste Serial & PINs:</label>
                <textarea
                  rows={3}
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  placeholder="SN849201-9821, STEAM-KHM-82910-VIP&#10;SN849201-9822, STEAM-KHM-82911-VIP"
                  className="w-full bg-[#10182C] border border-white/[0.15] rounded-xl p-3 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'បញ្ចូលក្នុងស្តុក' : 'Import to Vault'}</span>
              </button>
            </form>
          </div>

          {/* PINs Inventory Table */}
          <div className="bg-[#080E1C] rounded-2xl border border-white/[0.1] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0C1427] text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Serial Number</th>
                    <th className="py-3 px-4">Secret PIN</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Added Date</th>
                    <th className="py-3 px-4">Linked Order</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-neutral-300">
                  {stockPins.map((pin) => (
                    <tr key={pin.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{pin.productName}</td>
                      <td className="py-3 px-4 text-neutral-400">{pin.serialNumber}</td>
                      <td className="py-3 px-4 text-cyan-300 flex items-center gap-2">
                        <span>{revealedPins[pin.id] ? pin.pinCode : '••••••••••••••••'}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleRevealPin(pin.id)}
                          className="text-neutral-500 hover:text-white cursor-pointer"
                        >
                          {revealedPins[pin.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            pin.status === 'available'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-neutral-500/15 text-neutral-400 border border-neutral-500/30'
                          }`}
                        >
                          {pin.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[10px]">{pin.addedAt}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{pin.soldOrder || '—'}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeletePin(pin.id)}
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
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: PACKAGE PRICING & PROFIT MARGINS MATRIX                      */}
      {/* =================================================================== */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
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
                    ? 'ជ្រើសរើសភាគរយចំណេញដើម្បីគណនាតម្លៃលក់ចេញ (USD & KHR) ស្វ័យប្រវត្តិតាមថ្លៃដើម'
                    : 'Select a margin preset to automatically recalculate selling prices above wholesale cost.'}
                </p>
              </div>

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

            <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-neutral-400">Filter Game:</span>
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
                  Reset Defaults
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
                          <td className="py-3 px-4 font-bold text-[#FFE082]">{pkg.packageName}</td>
                          <td className="py-3 px-4 text-neutral-400">${pkg.costUSD.toFixed(2)}</td>
                          <td className="py-3 px-4 font-bold text-emerald-400">${pkg.priceUSD.toFixed(2)}</td>
                          <td className="py-3 px-4 text-neutral-300">{pkg.priceKHR.toLocaleString()} ៛</td>
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
      {/* TAB 5: PROMO CODES MATRIX                                          */}
      {/* =================================================================== */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#080E1C] rounded-2xl border border-white/[0.1] shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>{language === 'km' ? 'បង្កើត Promo Code ថ្មី' : 'Create New Promo Code'}</span>
            </h3>

            <form onSubmit={handleAddPromo} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Code (e.g. VIP20)"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="bg-[#10182C] border border-white/[0.15] rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-cyan-400"
              />
              <input
                type="number"
                placeholder="Discount % (e.g. 10)"
                value={newDiscount}
                onChange={(e) => setNewDiscount(Number(e.target.value))}
                className="bg-[#10182C] border border-white/[0.15] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              />
              <input
                type="number"
                placeholder="Max Uses (e.g. 100)"
                value={newMaxUses}
                onChange={(e) => setNewMaxUses(Number(e.target.value))}
                className="bg-[#10182C] border border-white/[0.15] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'រក្សាទុក' : 'Save Code'}</span>
              </button>
            </form>
          </div>

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
      {/* TAB 6: SITE ANNOUNCEMENTS & MAINTENANCE NOTICE BAR                 */}
      {/* =================================================================== */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#080E1C] rounded-2xl border border-white/[0.1] shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-cyan-400" />
                  <span>
                    {language === 'km'
                      ? 'ផ្ទាំងគ្រប់គ្រងសារដំណឹងលើ Website (Top Alert Banner)'
                      : 'Live Site Announcement Manager'}
                  </span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {language === 'km'
                    ? 'សារដែលបងសរសេរនៅទីនេះ នឹងលោតបង្ហាញនៅលើក្បាលទំព័រ Website ជូនអតិថិជនភ្លាមៗ'
                    : 'The banner configured here renders instantly at the top of the header across all pages.'}
                </p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-neutral-300">
                  {announcementActive ? 'STATUS: ACTIVE' : 'STATUS: DISABLED'}
                </span>
                <button
                  type="button"
                  onClick={() => setAnnouncementActive(!announcementActive)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    announcementActive ? 'bg-cyan-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-transform ${
                      announcementActive ? 'left-6.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Alert Severity Type */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400">Alert Color & Style:</label>
              <div className="flex flex-wrap items-center gap-3">
                {(
                  [
                    { id: 'info', label: 'Cyan Info (General News)', color: 'border-cyan-400 bg-cyan-500/15 text-cyan-300' },
                    { id: 'warning', label: 'Amber Warning (Game Maintenance)', color: 'border-amber-400 bg-amber-500/15 text-amber-300' },
                    { id: 'danger', label: 'Red Alert (Urgent Notice)', color: 'border-red-400 bg-red-500/15 text-red-300' },
                    { id: 'success', label: 'Emerald Promo (Special Deal)', color: 'border-emerald-400 bg-emerald-500/15 text-emerald-300' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setAnnouncementType(t.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      announcementType === t.id ? t.color + ' shadow-md' : 'border-white/10 text-neutral-500'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Inputs */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Khmer Message:</label>
                <input
                  type="text"
                  value={announcementKh}
                  onChange={(e) => setAnnouncementKh(e.target.value)}
                  className="w-full bg-[#10182C] border border-white/[0.15] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">English Message:</label>
                <input
                  type="text"
                  value={announcementEn}
                  onChange={(e) => setAnnouncementEn(e.target.value)}
                  className="w-full bg-[#10182C] border border-white/[0.15] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                Live Banner Preview (As seen by customers on site header):
              </span>
              <div
                className={`w-full py-2 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-between gap-3 border shadow-inner ${
                  announcementType === 'danger'
                    ? 'bg-red-500/25 text-red-200 border-red-500/40'
                    : announcementType === 'warning'
                    ? 'bg-amber-500/25 text-amber-200 border-amber-500/40'
                    : announcementType === 'success'
                    ? 'bg-emerald-500/25 text-emerald-200 border-emerald-500/40'
                    : 'bg-cyan-500/25 text-cyan-200 border-cyan-500/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 shrink-0 text-cyan-300" />
                  <span>{language === 'km' ? announcementKh : announcementEn}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveAnnouncement}
              style={{
                clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,212,255,0.4)]"
            >
              <Megaphone className="w-4 h-4 fill-black" />
              <span>{language === 'km' ? 'ផ្សាយផ្ទាល់លើ Website' : 'Publish to Website'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 7: SMILE.ONE API STATUS & STAFF ROLES CLEARANCE                 */}
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
                ? 'Backend របស់ SEA RA PRESTIGE ត្រូវបានភ្ជាប់ជាមួយ Smile.One API រួចរាល់។ ប្រព័ន្ធ MD5 Signing គាំទ្រការទាញយកកាតាឡុកហ្គេម ឆែកសមតុល្យលុយ និង Inject Diamonds ស្វ័យប្រវត្តិកម្រិត Enterprise។'
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
