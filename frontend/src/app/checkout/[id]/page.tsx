'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Clock,
  QrCode,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  Zap,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { GameAccount, Order, KHQRPaymentData } from '@/types';

function CheckoutContent() {
  const { t, language } = useLanguage();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const accountId = params?.id as string;
  const warrantyParam = searchParams.get('warranty') || '7_days';

  const { user, isAuthenticated } = useAuth();

  const [account, setAccount] = useState<GameAccount | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [khqrData, setKhqrData] = useState<KHQRPaymentData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'khqr' | 'wallet'>('khqr');
  const [discountAmount, setDiscountAmount] = useState(0);

  const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // 15 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bakong Manual Verification State (Quota-friendly)
  const [isCheckingBakong, setIsCheckingBakong] = useState(false);
  const [bakongCheckMessage, setBakongCheckMessage] = useState<string | null>(null);
  const [bakongCheckCooldown, setBakongCheckCooldown] = useState<number>(0);

  // Poller interval ref
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch account & initiate checkout reservation
  useEffect(() => {
    async function initCheckout() {
      if (!accountId) return;
      try {
        const acc = await api.accounts.getById(accountId);
        setAccount(acc);

        // If authenticated, reserve account via checkout endpoint
        if (isAuthenticated) {
          const newOrder = await api.orders.checkout({
            gameAccountId: accountId,
            warrantyPackage: warrantyParam,
          });
          setOrder(newOrder);

          // Generate KHQR immediately
          const khqr = await api.payments.generateKHQR(newOrder.orderNumber);
          setKhqrData(khqr);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to initiate order reservation');
      }
    }
    initCheckout();
  }, [accountId, isAuthenticated, warrantyParam]);

  // 2. Countdown timer for 15-min reservation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cooldown countdown for manual Bakong check button
  useEffect(() => {
    if (bakongCheckCooldown <= 0) return;
    const timer = setInterval(() => {
      setBakongCheckCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [bakongCheckCooldown]);

  // Explicit User Trigger: "ខ្ញុំបានផ្ទេរប្រាក់រួចរាល់ (Check Payment)"
  const handleCheckBakong = async () => {
    if (!order || isCheckingBakong || bakongCheckCooldown > 0) return;
    setIsCheckingBakong(true);
    setBakongCheckMessage(null);
    try {
      const res = await api.payments.checkBakongPayment(order.orderNumber);
      if (res.isPaid) {
        setBakongCheckMessage(res.message);
        handlePaymentSuccess();
      } else {
        setBakongCheckMessage(res.message);
        setBakongCheckCooldown(res.waitSeconds || 8);
      }
    } catch (err: any) {
      setBakongCheckMessage(err.message || 'Error verifying with Bakong');
      setBakongCheckCooldown(6);
    } finally {
      setIsCheckingBakong(false);
    }
  };

  // 3. Status Poller for Local DB confirmation (Zero Bakong Quota Used!)
  useEffect(() => {
    if (!order || isPaid) return;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const status = await api.payments.getStatus(order.orderNumber);
        if (status.isPaid || status.orderStatus === 'in_escrow' || status.orderStatus === 'completed') {
          handlePaymentSuccess();
        }
      } catch {
        // continue polling
      }
    }, 4000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [order, isPaid]);

  const handlePaymentSuccess = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setIsPaid(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      if (order) {
        router.push(`/orders/${order.orderNumber}`);
      }
    }, 2000);
  };

  // Pay with Wallet
  const handleWalletPay = async () => {
    if (!order) return;
    setIsProcessing(true);
    setError(null);
    try {
      await api.payments.payWithWallet(order.orderNumber);
      handlePaymentSuccess();
    } catch (err: any) {
      setError(err.message || 'Wallet payment failed. Please ensure sufficient balance.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Sandbox simulation payment (instant bypass for development test)
  const handleSimulatePayment = async () => {
    if (!order) return;
    setIsProcessing(true);
    try {
      await api.payments.simulateSuccess(order.orderNumber);
      handlePaymentSuccess();
    } catch (err: any) {
      setError(err.message || 'Simulation error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format countdown mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-[#0b0e14] flex items-center justify-center p-4 text-center ${language === 'kh' ? 'font-kantumruy' : ''}`}>
        <div className="bg-[#151a23] p-8 rounded-2xl border border-white/[0.08] max-w-md w-full space-y-4">
          <Shield className="w-12 h-12 text-[#f2ca50] mx-auto" />
          <h2 className="text-xl font-bold text-white">
            {language === 'kh' ? 'តម្រូវឱ្យចូលប្រើប្រាស់ជាមុន' : 'Authentication Required'}
          </h2>
          <p className="text-xs text-neutral-400">
            {language === 'kh'
              ? 'សូមចូលប្រើប្រាស់ ឬចុះឈ្មោះគណនី ដើម្បីដំណើរការការចាក់សោកក់ទុក Escrow រយៈពេល ១៥ នាទី។'
              : 'Please sign in or create an account to activate the 15-minute escrow reservation lock.'}
          </p>
          <div className="flex gap-3 pt-2">
            <Link
              href="/auth/login"
              className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#f2ca50] text-[#0b0e14]"
            >
              {t('navSignIn')}
            </Link>
            <Link
              href="/auth/register"
              className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0b0e14] text-white border border-white/[0.1]"
            >
              {t('navGetStarted')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#0b0e14] py-10 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header with 15-Minute Reservation Timer */}
        <div className="bg-[#151a23] p-4 sm:p-6 rounded-2xl border border-white/[0.08] mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00e4f2]/10 border border-[#00e4f2]/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#00e4f2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {t('checkoutTitle')}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[11px] text-neutral-400">
                {t('checkoutSubtitle')}
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="bg-[#0b0e14] px-4 py-2 rounded-xl border border-[#d4af37]/30 flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono">
              {language === 'kh' ? 'នៅសល់:' : 'REMAINDER:'}
            </span>
            <span className={`text-lg font-black font-mono tracking-wider ${timeLeft < 180 ? 'text-rose-400 animate-pulse' : 'text-[#f2ca50]'}`}>
              {formattedTime}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-6">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isPaid ? (
          <div className="bg-[#151a23] p-10 rounded-2xl border border-emerald-500/40 text-center space-y-4 shadow-2xl animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-white">
              {language === 'kh' ? 'ការទូទាត់ប្រាក់ជោគជ័យ!' : 'Payment Confirmed!'}
            </h2>
            <p className="text-sm text-neutral-300 max-w-md mx-auto">
              {language === 'kh'
                ? 'ទឹកប្រាក់ត្រូវបានរក្សាទុកក្នុង Escrow ប្រកបដោយសុវត្ថិភាព។ កំពុងរៀបចំដោះសោលេខសម្ងាត់...'
                : 'Your funds are held securely in platform escrow. Decrypting zero-knowledge credentials now...'}
            </p>
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mt-4" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column (7 cols): Payment Method & Bakong KHQR QR Display */}
            <div className="md:col-span-7 bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] space-y-6">
              {/* Payment Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-[#0b0e14] p-1 rounded-xl border border-white/[0.06]">
                <button
                  onClick={() => setPaymentMethod('khqr')}
                  className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'khqr'
                      ? 'bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  Bakong KHQR
                </button>
                <button
                  onClick={() => setPaymentMethod('wallet')}
                  className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'wallet'
                      ? 'bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  {language === 'kh' ? 'កាបូបរបស់ខ្ញុំ' : 'My Wallet'}
                </button>
              </div>

              {/* KHQR View */}
              {paymentMethod === 'khqr' && (
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative p-4 bg-white rounded-2xl shadow-2xl border-4 border-[#d4af37]/40 w-64 h-64 flex items-center justify-center">
                    {khqrData?.qrImage ? (
                      <img
                        src={khqrData.qrImage}
                        alt="Bakong KHQR Payment"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] text-neutral-800 font-mono">
                          {language === 'kh' ? 'កំពុងបង្កើត KHQR...' : 'Generating KHQR...'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      {t('khqrScanTitle')}
                    </span>
                    <p className="text-[11px] text-neutral-400">
                      {t('khqrSupportedBanks')}
                    </p>
                  </div>

                  {/* Explicit "I Have Transferred" Button (1-Click Quota-Friendly) */}
                  <div className="w-full space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCheckBakong}
                      disabled={isCheckingBakong || bakongCheckCooldown > 0}
                      className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                        bakongCheckCooldown > 0
                          ? 'bg-neutral-800 text-neutral-400 border border-neutral-700 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 active:scale-[0.99]'
                      }`}
                    >
                      {isCheckingBakong ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{language === 'kh' ? 'កំពុងផ្ទៀងផ្ទាត់ជាមួយ Bakong...' : 'Checking with Bakong...'}</span>
                        </>
                      ) : bakongCheckCooldown > 0 ? (
                        <span>{language === 'kh' ? `សូមរង់ចាំ ${bakongCheckCooldown} វិនាទី` : `Wait ${bakongCheckCooldown}s to retry`}</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{language === 'kh' ? 'ខ្ញុំបានផ្ទេរប្រាក់រួចរាល់ (Check Payment)' : 'I Have Paid (Check Payment)'}</span>
                        </>
                      )}
                    </button>

                    {bakongCheckMessage && (
                      <div className={`p-2.5 rounded-lg text-[11px] leading-relaxed text-center font-medium ${
                        isPaid ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300' : 'bg-amber-950/40 border border-amber-500/30 text-amber-300'
                      }`}>
                        {bakongCheckMessage}
                      </div>
                    )}
                  </div>

                  {/* Dev Sandbox Quick Simulation Pill */}
                  <div className="pt-2 w-full border-t border-white/[0.06]">
                    <button
                      onClick={handleSimulatePayment}
                      disabled={isProcessing}
                      className="w-full py-2.5 rounded-xl bg-[#0b0e14] hover:bg-[#10131a] border border-[#00e4f2]/40 text-[#00e4f2] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {t('simulateTest')}
                    </button>
                  </div>
                </div>
              )}

              {/* Wallet Balance View */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#0b0e14] border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-neutral-400 uppercase tracking-wider block">
                        {t('walletBalance')}
                      </span>
                      <span className="text-2xl font-black text-[#f2ca50]">
                        ${Number(user?.wallet?.balance ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <Link
                      href="/wallet"
                      className="text-xs text-[#00e4f2] hover:underline font-semibold"
                    >
                      {language === 'kh' ? 'បញ្ចូលប្រាក់ក្នុងកាបូប' : 'Top-up Wallet'}
                    </Link>
                  </div>

                  <button
                    onClick={handleWalletPay}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    <span>{t('payWithWallet')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Column (5 cols): Order Summary Box */}
            <div className="md:col-span-5 bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {t('checkoutSummary')}
                </h3>

                {account && (
                  <div className="flex gap-3 pb-4 border-b border-white/[0.06]">
                    <img
                      src={account.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80'}
                      alt={account.title}
                      className="w-16 h-16 rounded-xl object-cover border border-white/[0.08]"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-[#f2ca50] font-bold uppercase block">
                        {account.game?.title}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">{account.title}</h4>
                      <span className="text-[11px] text-neutral-400 block">{account.tierRank}</span>
                    </div>
                  </div>
                )}

                {/* Line Items */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-300">
                    <span>{t('checkoutBasePrice')}</span>
                    <span className="font-mono">${Number(account?.price ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>{language === 'kh' ? 'ការធានារ៉ាប់រង Anti-Recall' : 'Anti-Recall Warranty'}</span>
                    <span className="font-mono text-emerald-400">
                      {language === 'kh' ? 'រួមបញ្ចូល' : 'Included'}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>{t('checkoutEscrowFee')}</span>
                    <span className="font-mono text-[#00e4f2]">
                      {language === 'kh' ? 'ឥតគិតថ្លៃ' : 'Free'}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount Coupon</span>
                      <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-white/[0.06] flex justify-between text-sm font-bold text-white">
                    <span>{t('checkoutTotalDue')}</span>
                    <span className="text-lg font-black text-[#f2ca50] font-mono">
                      ${Number(order?.totalAmount ?? account?.price ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Escrow Guarantee Pill */}
              <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-white/[0.06] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {language === 'kh' ? 'ការការពារ Escrow ១០០%' : '100% Escrow Protection'}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  {language === 'kh'
                    ? 'អ្នកលក់មិនទាន់ទទួលបានប្រាក់ទេ រហូតដល់អ្នកបានពិនិត្យលេខសម្ងាត់ និងចុចបញ្ជាក់ការទទួលបាន។'
                    : 'Seller does NOT receive funds until you inspect the decrypted credentials and click "Confirm Received".'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-[#f2ca50] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-neutral-400 font-mono">Initializing Escrow Checkout Session...</p>
        </div>
      }
    >
      <CheckoutContent />
    </React.Suspense>
  );
}
