'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateOfficialKHQRString } from '@/lib/khqr';
import ChamferHighlights from '@/components/ChamferHighlights';
import { Zap, ShieldCheck, Copy, Check, Radio, Sparkles } from 'lucide-react';

interface KHQRCardProps {
  amount: number;
  currency?: 'USD' | 'KHR';
  merchantName?: string;
  storeLabel?: string;
  qrString?: string;
  orderNumber?: string;
  className?: string;
  size?: number;
}

export default function KHQRCard({
  amount,
  currency = 'USD',
  merchantName = 'SEA RA PRESTIGE',
  storeLabel = 'OFFICIAL STORE',
  qrString,
  orderNumber = 'SEARA-ORDER',
  className = '',
  size = 145,
}: KHQRCardProps) {
  const [copied, setCopied] = useState(false);

  // Generate 100% compliant official NBC EMVCo KHQR payload (000201010212...)
  // Recognized by all Cambodian mobile banking apps (ABA Mobile, Wing, ACLEDA, Bakong)
  const actualQrString =
    qrString ||
    generateOfficialKHQRString({
      merchantName,
      merchantCity: 'Phnom Penh',
      bakongAccount: currency === 'USD' ? '005282269@abaa' : '005282293@abaa',
      amount,
      currency,
      orderNumber,
      storeLabel,
    });

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))',
        filter: 'drop-shadow(0 0 24px rgba(0, 212, 255, 0.35))',
      }}
      className={`p-[1.5px] bg-gradient-to-br from-cyan-400 via-[#FFE082] to-violet-600 max-w-[280px] sm:max-w-[300px] mx-auto select-none relative transition-all duration-300 shadow-xl ${className}`}
    >
      {/* 45° Corner Highlights */}
      <ChamferHighlights size={18} color="cyan" />

      <div
        style={{
          clipPath: 'polygon(0 0, calc(100% - 17px) 0, 100% 17px, 100% 100%, 17px 100%, 0 calc(100% - 17px))',
        }}
        className="bg-[#070D1B] text-white overflow-hidden relative"
      >
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* =============================================================== */}
        {/* 1. TOP COMPACT HEADER                                            */}
        {/* =============================================================== */}
        <div className="px-3.5 pt-2.5 pb-2 border-b border-white/[0.08] bg-gradient-to-r from-black/60 via-[#0A1224]/80 to-black/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md shadow-[0_0_8px_rgba(0,212,255,0.4)] shrink-0">
              <img
                src="/logo.png"
                alt="SEA RA Crest"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-black text-xs tracking-wider text-white uppercase font-sans">
              {merchantName}
            </span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE SCAN</span>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 2. COMPACT AMOUNT DISPLAY                                        */}
        {/* =============================================================== */}
        <div className="px-3.5 pt-2 pb-1 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#FFE082] tracking-tight drop-shadow-[0_0_12px_rgba(255,224,130,0.35)]">
              {currency === 'USD' ? `$${amount.toFixed(2)}` : `${Math.round(amount).toLocaleString()} ៛`}
            </span>
            <span className="text-[10px] font-black font-mono text-cyan-400 uppercase tracking-wider px-1 py-0.2 rounded bg-cyan-500/15 border border-cyan-400/30">
              {currency}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyOrder}
            className="text-[9px] font-mono text-neutral-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>#{orderNumber}</span>
            {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
          </button>
        </div>

        {/* =============================================================== */}
        {/* 3. HIGH-CONTRAST ESPORTS QR PLATE                                */}
        {/* =============================================================== */}
        <div className="px-3.5 py-1.5">
          <div className="relative rounded-xl bg-white p-2.5 shadow-[0_0_25px_rgba(0,212,255,0.2)] flex items-center justify-center overflow-hidden border border-white">
            {/* 4 Cyberpunk Corner Targeting Brackets */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-500 z-10 pointer-events-none" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-500 z-10 pointer-events-none" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-500 z-10 pointer-events-none" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-500 z-10 pointer-events-none" />

            {/* Official EMVCo Standard QR Code */}
            <QRCodeSVG
              value={actualQrString}
              size={size}
              level="Q"
              includeMargin={false}
              className="w-full h-auto max-w-[145px] z-0"
            />

            {/* Center Gaming Shield Crest Emblem */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#070D1B] border-2 border-[#E5B55E] flex items-center justify-center shadow-[0_0_10px_rgba(229,181,94,0.6)] z-20 pointer-events-none p-0.5">
              <img
                src="/logo.png"
                alt="SEA RA Emblem"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 4. COMPACT BANKING DOCK                                          */}
        {/* =============================================================== */}
        <div className="px-3.5 pb-2.5 pt-1 space-y-1.5">
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {[
              { name: 'ABA PAY', color: 'bg-[#004B87]/30 border-[#004B87] text-[#38bdf8]' },
              { name: 'Wing', color: 'bg-[#91C73E]/20 border-[#91C73E]/50 text-[#bef264]' },
              { name: 'Bakong', color: 'bg-[#D61B23]/20 border-[#D61B23]/50 text-[#fca5a5]' },
              { name: 'ACLEDA', color: 'bg-[#183883]/30 border-[#183883] text-[#93c5fd]' },
              { name: 'Canadia', color: 'bg-[#D32F2F]/20 border-[#D32F2F]/50 text-[#fca5a5]' },
            ].map((bank, idx) => (
              <span
                key={idx}
                className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${bank.color}`}
              >
                {bank.name}
              </span>
            ))}
          </div>

          <div className="text-center pt-0.5">
            <p className="text-[9px] text-neutral-400 font-mono flex items-center justify-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
              <span>ស្កេនបានគ្រប់ធនាគារ • ទទួលពេជ្រស្វ័យប្រវត្តិ &lt; 2s</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
