'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateOfficialKHQRString } from '@/lib/khqr';

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

  return (
    <div
      className={`bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-neutral-100/10 text-black max-w-[340px] sm:max-w-[360px] mx-auto select-none ${className}`}
    >
      {/* 1. Official Red Curved KHQR Banner with Authentic Bottom-Right 45° Notch */}
      <div
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
        }}
        className="bg-[#D11A2A] text-white py-3.5 px-6 text-center relative overflow-hidden"
      >
        <h3 className="font-black text-lg sm:text-xl tracking-[0.28em] text-white text-center font-sans uppercase">
          K H Q R
        </h3>
      </div>

      {/* 2. White Card Content */}
      <div className="p-5 sm:p-6 bg-white text-black space-y-3">
        {/* Merchant & Store Label */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-black text-xs sm:text-sm tracking-wide text-neutral-900 uppercase">
            {merchantName}
          </span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0">
            {storeLabel}
          </span>
        </div>

        {/* Big Bold Amount */}
        <div className="flex items-baseline gap-1.5 pt-0.5">
          <span className="text-3xl sm:text-4xl font-black font-mono text-neutral-950 tracking-tight leading-none">
            {currency === 'USD' ? amount.toFixed(2) : Math.round(amount).toLocaleString()}
          </span>
          <span className="text-xs font-bold font-mono text-neutral-800 uppercase tracking-wider">
            {currency}
          </span>
        </div>

        {/* Dashed Separator Line */}
        <div className="border-b border-dashed border-neutral-300 w-full pt-1" />

        {/* QR Code Container with Subtle Rounded Box */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex items-center justify-center relative">
          <QRCodeSVG
            value={actualQrString}
            size={220}
            level="M"
            includeMargin={false}
            className="w-full h-auto max-w-[220px]"
          />

          {/* Authentic Circular Red Bakong Emblem in Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#D11A2A] border-[2.5px] border-white flex items-center justify-center shadow-md pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-6 h-6 text-white" fill="none">
              <circle cx="50" cy="50" r="46" fill="#D11A2A" />
              <circle cx="50" cy="50" r="34" stroke="white" strokeWidth="3" />
              <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="8" fill="white" />
              <circle cx="50" cy="50" r="4" fill="#D11A2A" />
              {/* 8 white satellite dots */}
              <circle cx="50" cy="23" r="2.8" fill="white" />
              <circle cx="50" cy="77" r="2.8" fill="white" />
              <circle cx="23" cy="50" r="2.8" fill="white" />
              <circle cx="77" cy="50" r="2.8" fill="white" />
              <circle cx="31" cy="31" r="2.8" fill="white" />
              <circle cx="69" cy="31" r="2.8" fill="white" />
              <circle cx="31" cy="69" r="2.8" fill="white" />
              <circle cx="69" cy="69" r="2.8" fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
