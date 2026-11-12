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
}

export default function KHQRCard({
  amount,
  currency = 'USD',
  merchantName = 'SEA RA PRESTIGE',
  storeLabel = 'OFFICIAL STORE',
  qrString,
  orderNumber = 'SEARA-ORDER',
  className = '',
}: KHQRCardProps) {
  const [copied, setCopied] = useState(false);

  // Generate 100% compliant official NBC EMVCo KHQR payload (000201010212...)
  // Recognized by all Cambodian mobile banking apps (ABA Mobile, Wing, ACLEDA, Bakong)
  const actualQrString =
    qrString ||
    generateOfficialKHQRString({
      merchantName,
      merchantCity: 'Phnom Penh',
      bakongAccount: 'sokhun_mao@abaa',
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
        clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))',
        filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.4))',
      }}
      className={`p-[1.5px] bg-gradient-to-br from-cyan-400 via-[#FFE082] to-violet-600 max-w-[350px] sm:max-w-[370px] mx-auto select-none relative transition-all duration-300 shadow-2xl ${className}`}
    >
      {/* 45° Corner Highlights */}
      <ChamferHighlights size={22} color="cyan" />

      <div
        style={{
          clipPath: 'polygon(0 0, calc(100% - 21px) 0, 100% 21px, 100% 100%, 21px 100%, 0 calc(100% - 21px))',
        }}
        className="bg-[#070D1B] text-white overflow-hidden relative"
      >
        {/* Subtle Esports Background Grid & Ambient Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* =============================================================== */}
        {/* 1. TOP ESPORTS GATEWAY HEADER                                    */}
        {/* =============================================================== */}
        <div className="px-5 pt-4 pb-3 border-b border-white/[0.08] bg-gradient-to-r from-black/60 via-[#0A1224]/80 to-black/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Official SEA RA Crest */}
            <div className="w-8 h-8 rounded-lg shadow-[0_0_12px_rgba(0,212,255,0.5)] shrink-0">
              <img
                src="/logo.png"
                alt="SEA RA Crest"
                className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(229,181,94,0.6)]"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-xs tracking-wider text-white uppercase font-sans">
                  {merchantName}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#FFE082] px-1.5 py-0.5 rounded bg-[#E5B55E]/15 border border-[#E5B55E]/40">
                  KHQR
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold block mt-0.5">
                0% សេវា • SECURE GATEWAY
              </span>
            </div>
          </div>

          {/* Live Scanner Pulse Badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE SCAN</span>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 2. AMOUNT DISPLAY (CYBER HUD)                                    */}
        {/* =============================================================== */}
        <div className="px-5 pt-4 pb-2 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#FFE082] fill-[#FFE082]" />
              <span>ទឹកប្រាក់ត្រូវទូទាត់:</span>
            </span>
            <button
              type="button"
              onClick={handleCopyOrder}
              className="text-[10px] text-neutral-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>#{orderNumber}</span>
              {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
            </button>
          </div>

          {/* Big Electric Gold Amount */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-[#FFE082] tracking-tight drop-shadow-[0_0_15px_rgba(255,224,130,0.4)]">
              {currency === 'USD' ? `$${amount.toFixed(2)}` : `${Math.round(amount).toLocaleString()} ៛`}
            </span>
            <span className="text-xs font-black font-mono text-cyan-400 uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30">
              {currency}
            </span>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 3. HIGH-CONTRAST ESPORTS QR PLATE WITH TARGETING HUD             */}
        {/* (Pure white plate guarantees 100% instant phone scanability)     */}
        {/* =============================================================== */}
        <div className="px-5 py-3">
          <div className="relative rounded-2xl bg-white p-3.5 sm:p-4 shadow-[0_0_35px_rgba(0,212,255,0.25)] flex items-center justify-center overflow-hidden border border-white">
            
            {/* 4 Cyberpunk Corner Targeting Brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-500 z-10 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-500 z-10 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-500 z-10 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-500 z-10 pointer-events-none" />

            {/* Subtle Futuristic Scan Laser Bar */}
            <div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none z-10 opacity-70 animate-pulse"
              style={{ top: '48%' }}
            />

            {/* Official EMVCo Standard QR Code with Level Q Error Correction */}
            <QRCodeSVG
              value={actualQrString}
              size={215}
              level="Q"
              includeMargin={false}
              className="w-full h-auto max-w-[215px] z-0"
            />

            {/* Center Gaming Shield Crest Emblem */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#070D1B] border-2 border-[#E5B55E] flex items-center justify-center shadow-[0_0_15px_rgba(229,181,94,0.7)] z-20 pointer-events-none p-1">
              <img
                src="/logo.png"
                alt="SEA RA Emblem"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 4. SUPPORTED CAMBODIAN BANKING NETWORK DOCK                      */}
        {/* =============================================================== */}
        <div className="px-5 pb-4 pt-1 space-y-2">
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {[
              { name: 'ABA PAY', color: 'bg-[#004B87]/30 border-[#004B87] text-[#38bdf8]' },
              { name: 'Wing Bank', color: 'bg-[#91C73E]/20 border-[#91C73E]/50 text-[#bef264]' },
              { name: 'Bakong App', color: 'bg-[#D61B23]/20 border-[#D61B23]/50 text-[#fca5a5]' },
              { name: 'ACLEDA', color: 'bg-[#183883]/30 border-[#183883] text-[#93c5fd]' },
              { name: 'Canadia', color: 'bg-[#D32F2F]/20 border-[#D32F2F]/50 text-[#fca5a5]' },
            ].map((bank, idx) => (
              <span
                key={idx}
                className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${bank.color}`}
              >
                {bank.name}
              </span>
            ))}
          </div>

          <div className="text-center pt-1 border-t border-white/[0.06]">
            <p className="text-[10px] text-neutral-400 font-mono flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>ស្កេនបានគ្រប់ធនាគារទាំងអស់នៅកម្ពុជា • ទទួលពេជ្រស្វ័យប្រវត្តិ &lt; 2s</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
