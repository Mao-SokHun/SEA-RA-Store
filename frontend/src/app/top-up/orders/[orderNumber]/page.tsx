'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { TopUpOrder } from '@/types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  QrCode,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export default function TopUpOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params?.orderNumber as string;
  const { language } = useLanguage();

  const [order, setOrder] = useState<TopUpOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Manual Bakong Check states (Quota preservation: 1 request per user click)
  const [isCheckingBakong, setIsCheckingBakong] = useState<boolean>(false);
  const [bakongCheckMessage, setBakongCheckMessage] = useState<string | null>(null);
  const [bakongCheckCooldown, setBakongCheckCooldown] = useState<number>(0);

  // Cooldown countdown timer for Bakong check button
  useEffect(() => {
    if (bakongCheckCooldown <= 0) return;
    const timer = setInterval(() => {
      setBakongCheckCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [bakongCheckCooldown]);

  const fetchOrder = async () => {
    if (!orderNumber) return;
    try {
      const data = await api.topup.getOrderStatus(orderNumber);
      setOrder(data);
      if (data.paymentStatus === 'paid' && data.deliveryStatus === 'completed') {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5 },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = async () => {
    if (!order) return;
    setIsSimulating(true);
    try {
      const res = await api.topup.simulatePayment(order.orderNumber);
      if (res.success) {
        await fetchOrder();
      }
    } catch (err: any) {
      alert(err.message || 'Payment simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  // Explicit User Trigger: "ខ្ញុំបានផ្ទេរប្រាក់រួចរាល់ (Check Payment)"
  // Consumes exactly 1 Bakong request per manual click!
  const handleCheckBakong = async () => {
    if (!order || isCheckingBakong || bakongCheckCooldown > 0) return;
    setIsCheckingBakong(true);
    setBakongCheckMessage(null);
    try {
      const res = await api.payments.checkBakongPayment(order.orderNumber);
      if (res.isPaid) {
        setBakongCheckMessage(res.message);
        await fetchOrder();
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

  const toKHR = (usd: number) => {
    return (usd * 4100).toLocaleString('km-KH') + ' ៛';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] text-white flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#d4af37] animate-spin" />
          <span className="text-sm font-bold text-neutral-400">Loading Order #{orderNumber}...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0b0e14] text-white flex items-center justify-center pt-20 px-4">
        <div className="bg-[#121721] rounded-2xl border border-red-500/30 p-8 max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Top-Up Order Not Found</h2>
          <p className="text-xs text-neutral-400">{error || 'The requested order number does not exist.'}</p>
          <Link
            href="/top-up"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Top Up</span>
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = order.paymentStatus === 'paid' && order.deliveryStatus === 'completed';

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white pt-24 pb-20 selection:bg-[#d4af37] selection:text-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/top-up"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'kh' ? 'ត្រឡប់ទៅទំព័រ Top Up' : 'Back to Top Up'}</span>
          </Link>

          <button
            onClick={fetchOrder}
            className="flex items-center gap-1.5 text-xs text-[#f2ca50] hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'kh' ? 'ផ្ទុកឡើងវិញ' : 'Refresh Status'}</span>
          </button>
        </div>

        {/* Main Receipt Card */}
        <div className="bg-[#121721] rounded-3xl border border-white/[0.1] shadow-2xl overflow-hidden relative">
          {/* Status Header Banner */}
          <div
            className={`p-6 sm:p-8 text-center relative ${
              isCompleted
                ? 'bg-gradient-to-b from-emerald-950/40 via-[#121721] to-[#121721] border-b border-emerald-500/20'
                : 'bg-gradient-to-b from-amber-950/40 via-[#121721] to-[#121721] border-b border-amber-500/20'
            }`}
          >
            {/* Status Icon */}
            <div
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 border ${
                isCompleted
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-400 animate-pulse'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-[#181f2c] border border-white/[0.1]">
              <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
              <span className={isCompleted ? 'text-emerald-400' : 'text-amber-400'}>
                {isCompleted
                  ? language === 'kh' ? 'ជោគជ័យ - បានបញ្ចូលរួចរាល់' : 'COMPLETED & DELIVERED'
                  : language === 'kh' ? 'រង់ចាំការបង់ប្រាក់ KHQR' : 'AWAITING PAYMENT'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {order.gameTitle} • {order.packageName}
            </h1>

            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-neutral-400">
              <span>Order Number:</span>
              <span className="font-mono text-white font-bold">{order.orderNumber}</span>
              <button
                onClick={() => handleCopy(order.orderNumber)}
                className="text-neutral-400 hover:text-white p-1"
                title="Copy order number"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* If Pending: Display KHQR to Pay */}
            {!isCompleted && order.qrImage && (
              <div className="bg-[#181f2c] rounded-2xl p-6 border border-white/[0.08] text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                  {language === 'kh' ? 'ស្កេនបង់ប្រាក់តាម KHQR ដើម្បីទទួលភ្លាមៗ' : 'Scan KHQR to complete top-up instantly'}
                </span>

                <div className="w-56 h-56 mx-auto bg-white p-3 rounded-2xl shadow-lg flex items-center justify-center">
                  <img src={order.qrImage} alt="Bakong KHQR" className="w-full h-full object-contain" />
                </div>

                <div className="text-center">
                  <span className="text-2xl font-black text-[#f2ca50] block">
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                  <span className="text-xs text-neutral-400">
                    ≈ {toKHR(Number(order.totalAmount))}
                  </span>
                </div>

                {/* Explicit "I Have Transferred" Button (1-Click Quota-Friendly) */}
                <div className="w-full max-w-sm mx-auto space-y-2 pt-1">
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
                        <RefreshCw className="w-4 h-4 animate-spin" />
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
                      isCompleted ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300' : 'bg-amber-950/40 border border-amber-500/30 text-amber-300'
                    }`}>
                      {bakongCheckMessage}
                    </div>
                  )}
                </div>

                {/* Simulate Payment Scan (Dev / Sandbox test) */}
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isSimulating}
                  className="w-full max-w-sm mx-auto py-2.5 rounded-xl bg-[#0b0e14] hover:bg-[#10131a] border border-[#00e4f2]/40 text-[#00e4f2] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  <span>{language === 'kh' ? '⚡ ធ្វើតេស្តស្កេនបង់ប្រាក់ (Simulate Payment)' : '⚡ Simulate Payment Scan'}</span>
                </button>
              </div>
            )}

            {/* In-Game Delivery Details */}
            <div className="bg-[#181f2c] rounded-2xl p-5 border border-white/[0.08] space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider pb-2 border-b border-white/[0.06]">
                {language === 'kh' ? 'ព័ត៌មានលម្អិតនៃគណនីហ្គេម' : 'In-Game Target Details'}
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-500 block mb-0.5">Player ID:</span>
                  <span className="font-mono text-white font-bold">{order.playerId}</span>
                </div>

                {order.zoneId && (
                  <div>
                    <span className="text-neutral-500 block mb-0.5">Zone ID:</span>
                    <span className="font-mono text-white font-bold">{order.zoneId}</span>
                  </div>
                )}

                <div>
                  <span className="text-neutral-500 block mb-0.5">Player Nickname:</span>
                  <span className="text-emerald-400 font-bold">{order.playerNickname || order.playerId}</span>
                </div>

                <div>
                  <span className="text-neutral-500 block mb-0.5">Payment Method:</span>
                  <span className="text-white font-bold capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Delivery Proof */}
            {order.deliveryProof && (
              <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/30 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  <FileCheck className="w-4 h-4" />
                  <span>Verified In-Game Delivery Confirmation</span>
                </div>
                <p className="font-mono text-neutral-300 break-all">{order.deliveryProof}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/top-up"
                className="flex-1 py-3.5 rounded-xl bg-[#d4af37] text-black font-black text-xs uppercase tracking-wider text-center hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>{language === 'kh' ? 'បញ្ចូលហ្គេមបន្ថែមទៀត' : 'Top Up Another Game'}</span>
              </Link>

              <Link
                href="/catalog"
                className="flex-1 py-3.5 rounded-xl bg-[#1e2738] hover:bg-[#253247] text-white font-bold text-xs uppercase tracking-wider text-center transition-all border border-white/[0.08]"
              >
                {language === 'kh' ? 'ចូលមើលគណនីលក់ទាំងអស់' : 'Browse Accounts Catalog'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
