'use client';

import React, { useState } from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  QrCode,
  Smartphone,
  Copy,
  Check,
  Zap,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function OrderStatusModal() {
  const {
    language,
    currentOrder,
    showSuccessModal,
    closeSuccessModal,
    simulatePaymentSuccess,
    isSimulating,
  } = useOrderStore();

  const [copied, setCopied] = useState(false);

  if (!showSuccessModal || !currentOrder) return null;

  const isPaid = currentOrder.status === 'paid' || currentOrder.status === 'delivered';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentOrder.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-[#0B1224] rounded-3xl border border-[#2B6CFF]/45 w-full max-w-md p-6 relative shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Neon laser top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#22D3EE] via-[#3B82F6] to-[#FF7A18]" />

        {/* Close button */}
        <button
          type="button"
          onClick={closeSuccessModal}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2.5 ${
              isPaid
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
            }`}
          >
            {isPaid ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {language === 'km' ? 'ជោគជ័យ! បានបញ្ចូលរួចរាល់' : 'PAID & DELIVERED'}
                </span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>
                  {language === 'km' ? 'រង់ចាំការស្កេនបង់ប្រាក់ KHQR' : 'Awaiting Payment'}
                </span>
              </>
            )}
          </div>

          <h3 className="text-lg font-black text-white">
            {currentOrder.game.name}
          </h3>
          <p className="text-xs text-neutral-400">
            {currentOrder.package.label} • Order #{currentOrder.orderNumber}
          </p>
        </div>

        {/* Status Timeline (Pending → Paid → Processing → Delivered) */}
        <div className="mb-6 bg-[#070B17] p-3.5 rounded-2xl border border-white/[0.06]">
          <div className="grid grid-cols-4 gap-1 text-center">
            {[
              { label: 'Pending', labelKh: 'រង់ចាំ', active: true, done: isPaid },
              { label: 'Paid', labelKh: 'បានបង់', active: isPaid, done: isPaid },
              { label: 'Processing', labelKh: 'ដំណើរការ', active: isPaid, done: isPaid },
              { label: 'Delivered', labelKh: 'ជោគជ័យ', active: isPaid, done: isPaid },
            ].map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div
                  className={`w-full h-1.5 rounded-full ${
                    step.done
                      ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]'
                      : step.active
                      ? 'bg-amber-400'
                      : 'bg-white/10'
                  }`}
                />
                <span
                  className={`text-[9px] font-bold block ${
                    step.done
                      ? 'text-emerald-400'
                      : step.active
                      ? 'text-white'
                      : 'text-neutral-500'
                  }`}
                >
                  {language === 'km' ? step.labelKh : step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Awaiting State: KHQR Code Display */}
        {!isPaid && (
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-2xl w-56 h-56 mx-auto shadow-2xl flex flex-col items-center justify-center border-4 border-[#22D3EE]">
              <img
                src={currentOrder.qrCodeUrl}
                alt="Bakong KHQR"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Price Pill */}
            <div className="text-center bg-[#070B17] p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                Total Payment Amount
              </span>
              <div className="flex items-baseline justify-center gap-2 mt-0.5">
                <span className="text-xl font-black text-amber-400 font-mono">
                  ${currentOrder.totalUSD.toFixed(2)}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  ({currentOrder.totalKHR.toLocaleString()} ៛)
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCopy}
                className="py-2.5 rounded-xl bg-[#152347] border border-white/10 hover:border-[#22D3EE]/50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Order #'}</span>
              </button>

              <a
                href="https://bakong.nbc.org.kh"
                target="_blank"
                className="py-2.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Open Bank App</span>
              </a>
            </div>

            {/* Simulate Payment Test Button */}
            <div className="pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={simulatePaymentSuccess}
                disabled={isSimulating}
                className="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying test simulated payment...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span>🧪 Test Simulate Payment (Auto-Deliver)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Paid / Delivered State */}
        {isPaid && (
          <div className="space-y-4 text-center py-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h4 className="text-base font-black text-white">
                {language === 'km' ? 'បញ្ចូលពេជ្រជោគជ័យ ១០០%!' : 'Top-Up Fulfilled Successfully!'}
              </h4>
              <p className="text-xs text-neutral-300 mt-1">
                {language === 'km'
                  ? `ពេជ្រ/កាក់ត្រូវបានបញ្ចូលទៅក្នុងគណនី ${currentOrder.playerNickname} រួចរាល់។`
                  : `Currencies have been directly credited to ${currentOrder.playerNickname}.`}
              </p>
            </div>

            <div className="bg-[#070B17] p-3 rounded-xl border border-white/[0.06] text-left text-xs font-mono text-neutral-300">
              <span className="text-[10px] text-neutral-500 uppercase block mb-1">
                API Delivery Reference:
              </span>
              <span className="text-emerald-400 break-all">
                TXN-{currentOrder.orderNumber}-MOONTON-OK
              </span>
            </div>

            <button
              type="button"
              onClick={closeSuccessModal}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#22D3EE] via-[#3B82F6] to-[#2563EB] text-black font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              {language === 'km' ? 'រួចរាល់ (បិទផ្ទាំង)' : 'Done & Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

