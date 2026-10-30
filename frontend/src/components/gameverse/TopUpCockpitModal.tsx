'use client';

import React from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Wallet,
  ArrowRight,
} from 'lucide-react';
import { TopUpGameDetails, TopUpPackage } from '@/types';

interface TopUpCockpitModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGame: TopUpGameDetails | null;
  selectedPackage: TopUpPackage | null;
  setSelectedPackage: (pkg: TopUpPackage) => void;
  playerId: string;
  setPlayerId: (id: string) => void;
  zoneId: string;
  setZoneId: (id: string) => void;
  serverRegion: string;
  setServerRegion: (region: string) => void;
  contactPhone: string;
  setContactPhone: (phone: string) => void;
  isVerifying: boolean;
  handleVerifyPlayer: () => void;
  verifiedNickname: string | null;
  verificationError: string | null;
  paymentMethod: 'bakong_khqr' | 'wallet';
  setPaymentMethod: (method: 'bakong_khqr' | 'wallet') => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  filteredPackages: TopUpPackage[];
  isSubmitting: boolean;
  handleCheckout: () => void;
  paymentError: string | null;
  toKHR: (usd: number) => string;
  language: 'kh' | 'en';
  isAuthenticated: boolean;
  walletBalance: number;
  onOpenGuide: () => void;
}

export default function TopUpCockpitModal({
  isOpen,
  onClose,
  selectedGame,
  selectedPackage,
  setSelectedPackage,
  playerId,
  setPlayerId,
  zoneId,
  setZoneId,
  serverRegion,
  setServerRegion,
  contactPhone,
  setContactPhone,
  isVerifying,
  handleVerifyPlayer,
  verifiedNickname,
  verificationError,
  paymentMethod,
  setPaymentMethod,
  categoryFilter,
  setCategoryFilter,
  filteredPackages,
  isSubmitting,
  handleCheckout,
  paymentError,
  toKHR,
  language,
  isAuthenticated,
  walletBalance,
  onOpenGuide,
}: TopUpCockpitModalProps) {
  if (!isOpen || !selectedGame) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-[#0b101c] rounded-3xl border border-white/[0.12] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden animate-in zoom-in-95">
        {/* Top Header Laser Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00e5ff] via-[#3b82f6] to-[#f59e0b]" />

        {/* Modal Top Bar: Game Banner & Close Button */}
        <div className="p-4 sm:p-6 bg-[#0e1424] border-b border-white/[0.08] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-[#00e5ff] to-[#3b82f6] shadow-md shrink-0">
              <img
                src={selectedGame.iconUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200'}
                alt={selectedGame.title}
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/30">
                  ⚡ INSTANT RELOAD
                </span>
                <span className="text-xs text-neutral-400 font-bold">
                  {selectedGame.currencyNameKh || selectedGame.currencyName}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {selectedGame.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenGuide}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>{language === 'kh' ? 'របៀបមើល ID?' : 'Find ID?'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/[0.08]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns: Step 1 (Player ID) + Step 2 (Packages) */}
            <div className="lg:col-span-8 space-y-6">
              {/* ------------------------------------------------------------- */}
              {/* STEP 1: USER INFORMATION                                      */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-[#0f1526] rounded-2xl border border-white/[0.08] p-4 sm:p-5 shadow-lg">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-6 h-6 rounded-lg bg-[#00e5ff] text-black font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    {language === 'kh' ? 'បញ្ចូលលេខសម្គាល់គណនី (Player ID)' : 'Step 1: Enter Player ID'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Primary Player ID */}
                  <div
                    className={
                      selectedGame.inputConfig?.some((c) => c.key === 'zoneId' || c.key === 'serverRegion')
                        ? 'sm:col-span-5'
                        : 'sm:col-span-8'
                    }
                  >
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1 uppercase tracking-wider">
                      {selectedGame.inputConfig?.[0]?.label || 'Player ID'}
                      <span className="text-amber-400 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={playerId}
                      onChange={(e) => setPlayerId(e.target.value)}
                      placeholder={selectedGame.inputConfig?.[0]?.placeholder || 'Enter ID'}
                      className="w-full bg-[#141c30] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00e5ff] font-mono shadow-inner"
                    />
                  </div>

                  {/* Zone ID for MLBB */}
                  {selectedGame.inputConfig?.some((c) => c.key === 'zoneId') && (
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1 uppercase tracking-wider">
                        Zone ID <span className="text-amber-400 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        placeholder="ឧ. 2026"
                        className="w-full bg-[#141c30] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00e5ff] font-mono shadow-inner"
                      />
                    </div>
                  )}

                  {/* Server Region for Genshin */}
                  {selectedGame.inputConfig?.some((c) => c.key === 'serverRegion') && (
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1 uppercase tracking-wider">
                        Server <span className="text-amber-400 ml-1">*</span>
                      </label>
                      <select
                        value={serverRegion}
                        onChange={(e) => setServerRegion(e.target.value)}
                        className="w-full bg-[#141c30] border border-white/[0.1] rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00e5ff]"
                      >
                        <option value="Asia">Asia</option>
                        <option value="America">America</option>
                        <option value="Europe">Europe</option>
                      </select>
                    </div>
                  )}

                  {/* Verify Button */}
                  <div className="sm:col-span-4 flex items-end">
                    <button
                      type="button"
                      onClick={handleVerifyPlayer}
                      disabled={isVerifying || !playerId.trim()}
                      className="w-full h-[40px] bg-[#1a253d] hover:bg-[#223150] disabled:opacity-50 text-white rounded-xl text-xs font-bold tracking-wider transition-all border border-white/[0.08] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>Checking...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{language === 'kh' ? 'ពិនិត្យឈ្មោះ' : 'Check IGN'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Nickname confirmation pill */}
                {verifiedNickname && (
                  <div className="mt-3 bg-emerald-500/10 border border-emerald-500/35 rounded-xl p-3 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="text-xs">
                        <span className="text-[10px] text-emerald-400 uppercase font-black tracking-widest block">
                          VERIFIED IGN:
                        </span>
                        <span className="font-black text-white">{verifiedNickname}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">100% Accurate</span>
                  </div>
                )}

                {verificationError && (
                  <div className="mt-3 bg-red-500/10 border border-red-500/35 rounded-xl p-3 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* STEP 2: SELECT PACKAGE DENOMINATION                           */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-[#0f1526] rounded-2xl border border-white/[0.08] p-4 sm:p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#00e5ff] text-black font-black text-xs flex items-center justify-center">
                      2
                    </span>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      {language === 'kh' ? 'ជ្រើសរើសកញ្ចប់ (Select Package)' : 'Step 2: Choose Denomination'}
                    </h3>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1">
                    {['all', 'diamonds', 'bundles'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                          categoryFilter === cat
                            ? 'bg-[#00e5ff] text-black'
                            : 'bg-white/[0.05] text-neutral-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredPackages.map((pkg) => {
                    const isSelected = selectedPackage?.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                          isSelected
                            ? 'bg-[#18233c] border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.3)] ring-1 ring-[#00e5ff]'
                            : 'bg-[#12192b] border-white/[0.06] hover:border-white/[0.2] hover:bg-[#151e33]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-lg">{selectedGame.currencyIcon || '💎'}</span>
                          {pkg.badge ? (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
                              {pkg.badge}
                            </span>
                          ) : pkg.bonusAmount > 0 ? (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">
                              +{pkg.bonusAmount}
                            </span>
                          ) : null}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white group-hover:text-[#00e5ff] transition-colors line-clamp-1">
                            {pkg.name}
                          </p>
                          <div className="flex items-baseline justify-between mt-1">
                            <span className="text-xs font-mono font-black text-amber-300">
                              ${Number(pkg.price).toFixed(2)}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              ≈ {toKHR(Number(pkg.price))}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Step 3 (Payment Method & Order Summary) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Payment Method Selector */}
              <div className="bg-[#0f1526] rounded-2xl border border-white/[0.08] p-4 shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#00e5ff] text-black font-black text-[10px] flex items-center justify-center">
                    3
                  </span>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    {language === 'kh' ? 'វិធីទូទាត់ប្រាក់' : 'Payment Method'}
                  </h4>
                </div>

                {/* Bakong KHQR Option */}
                <div
                  onClick={() => setPaymentMethod('bakong_khqr')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'bakong_khqr'
                      ? 'bg-[#18233c] border-[#00e5ff] shadow-sm'
                      : 'bg-[#12192b] border-white/[0.06] hover:bg-[#151e33]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-red-400 font-black text-xs px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                      KHQR
                    </span>
                    <div>
                      <p className="text-xs font-black text-white">Bakong KHQR</p>
                      <p className="text-[9px] text-neutral-400">ABA, Wing, ACLEDA (0% Fee)</p>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>

                {/* SEA RA Wallet Option */}
                <div
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'wallet'
                      ? 'bg-[#18233c] border-[#00e5ff] shadow-sm'
                      : 'bg-[#12192b] border-white/[0.06] hover:bg-[#151e33]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Wallet className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-xs font-black text-white">SEA RA Wallet</p>
                      <p className="text-[9px] text-neutral-400">
                        {isAuthenticated ? `$${Number(walletBalance).toFixed(2)} available` : 'Requires sign-in'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary & Buy Action */}
              <div className="bg-[#0f1526] rounded-2xl border border-white/[0.08] p-4 shadow-lg space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider pb-2 border-b border-white/[0.06]">
                  {language === 'kh' ? 'សង្ខេបវិក្កយបត្រ' : 'Order Summary'}
                </h4>

                <div className="space-y-1.5 text-xs text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Game:</span>
                    <span className="font-bold text-white truncate max-w-[130px]">{selectedGame.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Package:</span>
                    <span className="font-bold text-amber-300 truncate max-w-[130px]">
                      {selectedPackage ? selectedPackage.name : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Player ID:</span>
                    <span className="font-mono text-cyan-400 font-bold truncate max-w-[130px]">
                      {playerId.trim() || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/[0.06]">
                    <span className="font-black text-white uppercase">Total Due:</span>
                    <div className="text-right">
                      <span className="font-black text-base text-amber-400 block font-mono">
                        ${selectedPackage ? Number(selectedPackage.price).toFixed(2) : '0.00'}
                      </span>
                      <span className="text-[10px] text-neutral-400 block">
                        ≈ {toKHR(selectedPackage ? Number(selectedPackage.price) : 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {paymentError && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-[11px] text-red-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isSubmitting || !selectedPackage || !playerId.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff5e00] to-[#ff8c00] hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:pointer-events-none text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,94,0,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Generating QR...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>TOP UP NOW (${selectedPackage ? Number(selectedPackage.price).toFixed(2) : '0.00'})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-neutral-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Safe • Bakong KHQR Instant Fulfillment</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
