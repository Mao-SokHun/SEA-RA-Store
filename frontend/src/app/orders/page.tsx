'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { TopUpOrder } from '@/types';
import confetti from 'canvas-confetti';
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Gamepad2,
  Zap,
  Smartphone,
  Download,
  Flame,
  MessageSquare,
  HelpCircle,
  Filter,
} from 'lucide-react';

interface LocalGuestOrder {
  orderNumber: string;
  gameTitle?: string;
  packageName?: string;
  totalAmount?: number;
  playerId?: string;
  zoneId?: string;
  playerNickname?: string;
  createdAt?: string;
}

export default function GuestOrdersPage() {
  const { language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<TopUpOrder[]>([]);
  const [localOrders, setLocalOrders] = useState<LocalGuestOrder[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // KHQR Modal State for Pending Orders
  const [activeOrder, setActiveOrder] = useState<TopUpOrder | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulateSuccess, setSimulateSuccess] = useState(false);
  const [countdown, setCountdown] = useState(900);

  // Load recent guest orders from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('nexus_guest_orders');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLocalOrders(parsed);
          }
        }
      } catch (e) {
        console.warn('Failed to load local orders', e);
      }
    }
  }, []);

  // Countdown timer for active QR modal
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showQRModal && countdown > 0 && activeOrder?.paymentStatus === 'pending') {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showQRModal, countdown, activeOrder?.paymentStatus]);

  // Handle Search Submission
  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery !== undefined ? customQuery : searchQuery).trim();

    if (!query) {
      setSearchError(
        language === 'kh'
          ? 'សូមបញ្ចូល Player ID, លេខទូរស័ព្ទ ឬលេខកុម្ម៉ង់ TU-...'
          : 'Please enter Player ID, Phone number, or Order Number (TU-...)'
      );
      return;
    }

    if (query.length < 3) {
      setSearchError(
        language === 'kh'
          ? 'សូមបញ្ចូលយ៉ាងហោចណាស់ ៣ អក្សរដើម្បីស្វែងរក'
          : 'Please enter at least 3 characters to search'
      );
      return;
    }

    setIsLoading(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const res = await api.topup.trackGuestOrders(query);
      setOrders(res.orders || []);
    } catch (err: any) {
      setOrders([]);
      setSearchError(
        err.message ||
          (language === 'kh'
            ? 'មិនអាចស្វែងរកទិន្នន័យបានទេ សូមព្យាយាមម្តងទៀត'
            : 'Unable to track orders. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Open Bakong KHQR Modal for a pending order
  const handleOpenPayment = async (orderNumber: string) => {
    try {
      setIsLoading(true);
      const detailed = await api.topup.getOrderStatus(orderNumber);
      setActiveOrder(detailed);
      setShowQRModal(true);
      setCountdown(900);
      setSimulateSuccess(detailed.paymentStatus === 'paid');
    } catch (err: any) {
      alert(err.message || 'Failed to load order payment details');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate Payment for Demo
  const handleSimulatePayment = async () => {
    if (!activeOrder) return;
    setIsSimulating(true);
    try {
      await api.topup.simulatePayment(activeOrder.orderNumber);
      const updated = await api.topup.getOrderStatus(activeOrder.orderNumber);
      setActiveOrder(updated);
      setSimulateSuccess(true);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      // Update in current search results if exists
      setOrders((prev) =>
        prev.map((o) => (o.orderNumber === updated.orderNumber ? { ...o, ...updated } : o))
      );
    } catch (err: any) {
      alert(err.message || 'Payment simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  // 1-Click Copy
  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Filter orders
  const displayedOrders = orders.filter((o) => {
    if (activeFilter === 'completed') return o.paymentStatus === 'paid' || o.deliveryStatus === 'completed';
    if (activeFilter === 'pending') return o.paymentStatus === 'pending';
    if (activeFilter === 'failed') return o.paymentStatus === 'failed' || o.deliveryStatus === 'failed';
    return true;
  });

  const formatKHR = (usd: number) => {
    return Math.round(usd * 4100).toLocaleString('en-US');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#e1e2eb] pb-24 selection:bg-[#f2ca50] selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#f2ca50]/10 via-[#00e4f2]/5 to-transparent blur-[120px]" />
        <div className="absolute top-[300px] right-0 w-[450px] h-[450px] bg-[#d4af37]/5 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-6">
          <Link href="/top-up" className="hover:text-[#f2ca50] transition-colors flex items-center gap-1">
            <Gamepad2 className="w-3.5 h-3.5 text-[#f2ca50]" />
            <span>{language === 'kh' ? 'ទំព័រដើម Top-Up' : 'Home Top-Up'}</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-[#f2ca50]">
            {language === 'kh' ? 'តាមដានការកុម្ម៉ង់ (Track Orders)' : 'Track Orders'}
          </span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f2ca50]/10 border border-[#f2ca50]/30 text-[#f2ca50] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00e4f2]" />
            <span>{language === 'kh' ? '⚡ ពិនិត្យភ្លាមៗ • មិនបាច់ Login' : '⚡ Instant Guest Lookup • No Login'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {language === 'kh' ? (
              <>
                តាមដានស្ថានភាព <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#e5a910]">បញ្ជាទិញពេជ្រ</span>
              </>
            ) : (
              <>
                Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#e5a910]">Top-Up Orders</span>
              </>
            )}
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            {language === 'kh'
              ? 'ស្វែងរកតាមលេខទូរស័ព្ទ, Player ID ឬលេខវិក្កយបត្រ (Order Number) ដើម្បីមើលស្ថានភាព និងវិក្កយបត្រ'
              : 'Search by Phone Number, Player ID, or Order Number to check live status and receipts'}
          </p>
        </div>

        {/* Search Console Card */}
        <div className="bg-[#0e131d]/90 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-4 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.5)] mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'kh'
                    ? 'បញ្ចូល Player ID (UID), លេខទូរស័ព្ទ ឬលេខវិក្កយបត្រ TU-...'
                    : 'Enter Player ID (UID), Phone Number, or Order # (TU-...)'
                }
                className="w-full h-14 pl-12 pr-4 bg-[#151b26] border border-white/[0.08] rounded-2xl text-white placeholder-neutral-500 font-medium text-sm focus:outline-none focus:border-[#f2ca50] focus:ring-2 focus:ring-[#f2ca50]/20 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#c99516] hover:brightness-110 text-[#07090e] font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(242,202,80,0.35)] transition-all active:scale-[0.98] cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === 'kh' ? 'កំពុងស្វែងរក...' : 'Searching...'}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{language === 'kh' ? 'ស្វែងរកការកុម្ម៉ង់' : 'Track Order'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick-Search Chips from Recent Local Storage */}
          {localOrders.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#00e4f2]" />
                <span>{language === 'kh' ? 'ការកុម្ម៉ង់ថ្មីៗក្នុងម៉ាស៊ីននេះ:' : 'Recent in this browser:'}</span>
              </span>
              {localOrders.slice(0, 4).map((item) => (
                <button
                  key={item.orderNumber}
                  type="button"
                  onClick={() => {
                    setSearchQuery(item.orderNumber);
                    handleSearch(undefined, item.orderNumber);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#171f2c] hover:bg-[#202b3d] border border-white/[0.08] hover:border-[#f2ca50]/40 text-xs font-mono font-semibold text-neutral-300 hover:text-[#f2ca50] transition-all cursor-pointer"
                >
                  <span>{item.orderNumber}</span>
                  <span className="text-[10px] text-neutral-500 font-sans">({item.gameTitle || 'Game'})</span>
                </button>
              ))}
            </div>
          )}

          {/* Error Message */}
          {searchError && (
            <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        {orders.length > 0 && (
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeFilter === 'all'
                    ? 'bg-[#f2ca50] text-[#07090e] shadow-[0_0_15px_rgba(242,202,80,0.3)]'
                    : 'bg-[#151b26] text-neutral-300 hover:bg-[#1d2535] border border-white/[0.06]'
                }`}
              >
                {language === 'kh' ? 'ទាំងអស់' : 'All'} ({orders.length})
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeFilter === 'completed'
                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-[#151b26] text-neutral-300 hover:bg-[#1d2535] border border-white/[0.06]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'kh' ? 'ជោគជ័យ' : 'Completed'}</span>
              </button>
              <button
                onClick={() => setActiveFilter('pending')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeFilter === 'pending'
                    ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    : 'bg-[#151b26] text-neutral-300 hover:bg-[#1d2535] border border-white/[0.06]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{language === 'kh' ? 'រង់ចាំបង់ប្រាក់' : 'Pending'}</span>
              </button>
              <button
                onClick={() => setActiveFilter('failed')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeFilter === 'failed'
                    ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-[#151b26] text-neutral-300 hover:bg-[#1d2535] border border-white/[0.06]'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{language === 'kh' ? 'បរាជ័យ' : 'Failed'}</span>
              </button>
            </div>

            <span className="text-xs text-neutral-400 hidden sm:inline">
              {language === 'kh' ? `រកឃើញ ${displayedOrders.length} ការកុម្ម៉ង់` : `Found ${displayedOrders.length} orders`}
            </span>
          </div>
        )}

        {/* Results List */}
        {displayedOrders.length > 0 ? (
          <div className="space-y-4">
            {displayedOrders.map((order) => {
              const isPaid = order.paymentStatus === 'paid' || order.deliveryStatus === 'completed';
              const isPending = order.paymentStatus === 'pending';
              const isFailed = order.paymentStatus === 'failed' || order.deliveryStatus === 'failed';

              return (
                <div
                  key={order.orderNumber}
                  className="bg-[#0e131d]/90 backdrop-blur-xl border border-white/[0.08] hover:border-[#f2ca50]/40 rounded-3xl p-5 sm:p-6 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                    {/* Game & Package */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-cyan-400/20 border border-white/[0.1] flex items-center justify-center overflow-hidden shrink-0">
                        {order.gameIcon ? (
                          <img src={order.gameIcon} alt={order.gameTitle} className="w-full h-full object-cover" />
                        ) : (
                          <Gamepad2 className="w-6 h-6 text-[#f2ca50]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-white">{order.gameTitle}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-neutral-400 border border-white/[0.08] font-bold">
                            {order.packageCategory || 'Package'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#00e4f2] mt-0.5">{order.packageName}</p>
                      </div>
                    </div>

                    {/* Status Badge & Order Number */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {isPaid ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{language === 'kh' ? 'ជោគជ័យ - ពេជ្រចូលរួចរាល់' : 'Completed & Delivered'}</span>
                        </div>
                      ) : isPending ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold animate-pulse shadow-sm">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{language === 'kh' ? 'រង់ចាំបង់ប្រាក់ KHQR' : 'Pending Payment'}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-extrabold shadow-sm">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>{language === 'kh' ? 'ការទូទាត់បរាជ័យ' : 'Payment Failed'}</span>
                        </div>
                      )}

                      {/* Order Number with Copy */}
                      <button
                        type="button"
                        onClick={() => handleCopy(order.orderNumber, order.orderNumber)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#151b26] hover:bg-[#1d2535] border border-white/[0.08] text-xs font-mono font-bold text-neutral-300 hover:text-white transition-all cursor-pointer"
                        title="Copy Order #"
                      >
                        <span>{order.orderNumber}</span>
                        {copiedId === order.orderNumber ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-neutral-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
                    <div className="p-3 rounded-2xl bg-[#131924] border border-white/[0.04]">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
                        {language === 'kh' ? 'គណនីហ្គេម (Player ID)' : 'Player ID / UID'}
                      </span>
                      <span className="font-extrabold text-white">
                        {order.playerId}
                        {order.zoneId ? ` (${order.zoneId})` : ''}
                      </span>
                      {order.playerNickname && (
                        <span className="block text-[11px] text-[#f2ca50] truncate font-semibold mt-0.5">
                          {order.playerNickname}
                        </span>
                      )}
                    </div>

                    <div className="p-3 rounded-2xl bg-[#131924] border border-white/[0.04]">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
                        {language === 'kh' ? 'តម្លៃសរុប (Total)' : 'Total Price'}
                      </span>
                      <span className="font-extrabold text-white text-sm">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                      <span className="block text-[10px] text-neutral-400 font-semibold mt-0.5">
                        ~{formatKHR(Number(order.totalAmount))} ៛
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#131924] border border-white/[0.04]">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
                        {language === 'kh' ? 'វិធីទូទាត់' : 'Payment Channel'}
                      </span>
                      <span className="font-extrabold text-[#00e4f2] uppercase">
                        {order.paymentMethod === 'bakong_khqr' ? 'Bakong KHQR' : order.paymentMethod}
                      </span>
                      <span className="block text-[10px] text-neutral-400 mt-0.5">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Instant'}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#131924] border border-white/[0.04]">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
                        {language === 'kh' ? 'ភស្តុតាងបញ្ចូល (Proof)' : 'Delivery Proof'}
                      </span>
                      {order.deliveryProof ? (
                        <span className="font-mono text-[10px] text-emerald-400 truncate block font-bold" title={order.deliveryProof}>
                          {order.deliveryProof}
                        </span>
                      ) : (
                        <span className="text-neutral-500 font-medium">
                          {isPending ? (language === 'kh' ? 'រង់ចាំទូទាត់' : 'Awaiting payment') : 'Pending'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'kh' ? 'ប្រព័ន្ធស្វ័យប្រវត្តិ 24/7 គ្មានហានិភ័យ' : 'Automated 24/7 Direct Gateway'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Telegram Assistance with pre-filled Order ID */}
                      <Link
                        href={`https://t.me/nexus_support_kh?text=${encodeURIComponent(
                          `សួស្តី NEXUS! ខ្ញុំចង់សាកសួរពីការកុម្ម៉ង់លេខ ${order.orderNumber} (${order.gameTitle} - ${order.packageName})`
                        )}`}
                        target="_blank"
                        className="px-3 py-2 rounded-xl bg-[#0088cc]/15 hover:bg-[#0088cc]/25 text-[#00e4f2] hover:text-white border border-[#0088cc]/30 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{language === 'kh' ? 'ជំនួយការ' : 'Support'}</span>
                      </Link>

                      {/* Pay Now Button if Pending */}
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => handleOpenPayment(order.orderNumber)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center gap-1.5 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>{language === 'kh' ? 'បង់ប្រាក់បន្ត (KHQR)' : 'Pay Now (KHQR)'}</span>
                        </button>
                      )}

                      {/* 1-Click Reorder */}
                      <Link
                        href="/top-up"
                        className="px-4 py-2 rounded-xl bg-[#171f2c] hover:bg-[#202b3d] border border-white/[0.08] hover:border-[#f2ca50]/40 text-neutral-200 hover:text-[#f2ca50] text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span>{language === 'kh' ? 'ទិញម្ដងទៀត' : 'Reorder'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : hasSearched ? (
          /* Empty Search State */
          <div className="text-center py-16 px-4 bg-[#0e131d]/60 rounded-3xl border border-white/[0.06]">
            <div className="w-16 h-16 rounded-full bg-neutral-800/80 border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-white">
              {language === 'kh' ? 'រកមិនឃើញការកុម្ម៉ង់ឡើយ' : 'No Orders Found'}
            </h3>
            <p className="text-sm text-neutral-400 max-w-md mx-auto mt-1 mb-6">
              {language === 'kh'
                ? 'សូមពិនិត្យមើល Player ID, លេខទូរស័ព្ទ ឬលេខវិក្កយបត្រ (TU-xxxxxx) របស់អ្នកម្តងទៀត ឬទាក់ទងមកកាន់ក្រុមការងារ 24/7'
                : 'Please double-check your Player ID, Phone, or Order Number (TU-xxxxxx), or contact 24/7 support.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setHasSearched(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#151b26] hover:bg-[#1d2535] border border-white/[0.08] text-xs font-bold text-neutral-300"
              >
                {language === 'kh' ? 'សម្អាតការស្វែងរក' : 'Clear Search'}
              </button>
              <Link
                href="https://t.me/nexus_support_kh"
                target="_blank"
                className="px-5 py-2.5 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 text-[#00e4f2] border border-[#0088cc]/30 text-xs font-bold"
              >
                {language === 'kh' ? 'ទាក់ទងជំនួយ Telegram' : 'Chat Telegram Support'}
              </Link>
            </div>
          </div>
        ) : (
          /* Initial Guidance State */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-6 rounded-3xl bg-[#0e131d]/80 border border-white/[0.06] hover:border-[#f2ca50]/30 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300 mb-3 font-black text-sm">
                1
              </div>
              <h4 className="font-extrabold text-white text-sm mb-1">
                {language === 'kh' ? 'ស្វែងរកតាម Player ID / UID' : 'Search by Player ID / UID'}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {language === 'kh'
                  ? 'បញ្ចូលលេខសម្គាល់គណនីហ្គេមរបស់អ្នក ដូចជា MLBB User ID ឬ Free Fire UID ដើម្បីមើលរាល់ប្រវត្តិបញ្ចូលពេជ្រ។'
                  : 'Enter your in-game User ID or UID to see all past reload transactions for that account.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0e131d]/80 border border-white/[0.06] hover:border-[#00e4f2]/30 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-[#00e4f2] mb-3 font-black text-sm">
                2
              </div>
              <h4 className="font-extrabold text-white text-sm mb-1">
                {language === 'kh' ? 'ស្វែងរកតាមលេខទូរស័ព្ទ' : 'Search by Phone Number'}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {language === 'kh'
                  ? 'ប្រសិនបើអ្នកបានបំពេញលេខទូរស័ព្ទពេលកុម្ម៉ង់ អ្នកអាចវាយលេខទូរស័ព្ទដើម្បីបង្ហាញរាល់វិក្កយបត្រទាំងអស់ភ្លាមៗ។'
                  : 'If you provided a contact phone at checkout, enter it to instantly pull up all your orders.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0e131d]/80 border border-white/[0.06] hover:border-emerald-500/30 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300 mb-3 font-black text-sm">
                3
              </div>
              <h4 className="font-extrabold text-white text-sm mb-1">
                {language === 'kh' ? 'ស្វែងរកតាមលេខកុម្ម៉ង់ TU-...' : 'Search by Order Number'}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {language === 'kh'
                  ? 'ប្រើប្រាស់លេខកូដ TU-xxxxxx ដែលបង្ហាញលើអេក្រង់ QR ដើម្បីពិនិត្យ ឬបង់ប្រាក់បន្តនៅពេលក្រោយ។'
                  : 'Use your TU-xxxxxx receipt code to resume payment or view delivery proof anytime.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          BAKONG KHQR CHECKOUT / RESUME PAYMENT MODAL
      ========================================================================== */}
      {showQRModal && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0e131d] border border-white/[0.1] rounded-3xl p-6 shadow-2xl text-center">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                  KHQR
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-sm text-white">Bakong KHQR Payment</h3>
                  <span className="text-[10px] text-neutral-400 font-mono">#{activeOrder.orderNumber}</span>
                </div>
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {simulateSuccess ? (
              /* Success State */
              <div className="py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-extrabold text-white mb-1">
                  {language === 'kh' ? 'ការទូទាត់ជោគជ័យ!' : 'Payment Completed!'}
                </h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-6">
                  {language === 'kh'
                    ? 'ពេជ្រត្រូវបានបញ្ចូលដោយស្វ័យប្រវត្តិចូលក្នុងគណនីរបស់អ្នករួចរាល់'
                    : 'Game credits have been credited to your account via automated gateway.'}
                </p>

                <div className="p-3.5 rounded-2xl bg-[#141a24] border border-white/[0.06] text-left text-xs space-y-1.5 mb-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{language === 'kh' ? 'ហ្គេម:' : 'Game:'}</span>
                    <span className="font-extrabold text-white">{activeOrder.gameTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{language === 'kh' ? 'កញ្ចប់:' : 'Package:'}</span>
                    <span className="font-extrabold text-[#f2ca50]">{activeOrder.packageName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{language === 'kh' ? 'Player ID:' : 'Player ID:'}</span>
                    <span className="font-mono font-bold text-white">{activeOrder.playerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{language === 'kh' ? 'ទឹកប្រាក់:' : 'Total:'}</span>
                    <span className="font-extrabold text-emerald-400">${Number(activeOrder.totalAmount).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQRModal(false)}
                  className="w-full h-12 rounded-2xl bg-[#f2ca50] hover:bg-[#ffe088] text-black font-extrabold text-sm transition-all cursor-pointer"
                >
                  {language === 'kh' ? 'បិទផ្ទាំងនេះ' : 'Done'}
                </button>
              </div>
            ) : (
              /* Awaiting Payment State */
              <div>
                {/* QR Container */}
                <div className="bg-white p-4 rounded-2xl shadow-xl inline-block mb-3 border-4 border-red-600/30 relative">
                  {activeOrder.qrImage ? (
                    <img
                      src={activeOrder.qrImage}
                      alt="Bakong KHQR"
                      className="w-56 h-56 object-contain mx-auto"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-neutral-400 font-bold text-xs">
                      Loading QR...
                    </div>
                  )}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-md">
                    KHQR
                  </div>
                </div>

                {/* Amount Display */}
                <div className="mb-3">
                  <div className="text-2xl font-black text-white">
                    ${Number(activeOrder.totalAmount).toFixed(2)}
                  </div>
                  <div className="text-xs font-semibold text-neutral-400">
                    ≈ {formatKHR(Number(activeOrder.totalAmount))} KHR
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono font-bold mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(countdown)}</span>
                </div>

                {/* Interactive Simulation Sandbox Trigger */}
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isSimulating}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{language === 'kh' ? 'កំពុងតេស្តបង់ប្រាក់...' : 'Simulating Payment...'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-black fill-black" />
                      <span>{language === 'kh' ? '⚡ តេស្តស្កេនជោគជ័យភ្លាមៗ (Test Simulate)' : '⚡ Test Scan Success (Demo)'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
