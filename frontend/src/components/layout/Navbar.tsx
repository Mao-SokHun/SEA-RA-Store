'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Gamepad2,
  Zap,
  Globe,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Crown,
  Menu,
  X,
  Receipt,
  Search,
  ShieldCheck,
  Send,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all select-none font-sans">
      {/* High-Tech Gaming Glass Bar */}
      <div className="bg-[#07090e]/95 backdrop-blur-2xl border-b border-white/[0.08] relative">
        {/* Neon Cyber Laser Runner along bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#f2ca50]/60 via-[#00e4f2]/40 to-transparent opacity-80" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* ========================================================================= */}
          {/* BRAND LOGO: CYBER-HUD EMBLEM                                              */}
          {/* ========================================================================= */}
          <Link href="/top-up" className="flex items-center gap-3 shrink-0 group">
            {/* Chamfered Cyber Shield Icon */}
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ffe088] via-[#f2ca50] to-[#8f6b10] p-[1.5px] shadow-[0_0_20px_rgba(242,202,80,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_28px_rgba(242,202,80,0.55)]">
                <div className="w-full h-full bg-[#0a0d14] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                  {/* Subtle Hex grid glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#f2ca50]/15 to-transparent pointer-events-none" />
                  <Gamepad2 className="w-5 h-5 text-[#f2ca50] transition-transform duration-300 group-hover:rotate-[-6deg]" />
                </div>
              </div>
              {/* Online pulse pip */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#07090e] shadow-[0_0_8px_#10b981]" />
            </div>

            {/* Brand Typography */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-wider text-white group-hover:text-[#f2ca50] transition-colors">
                  NEXUS
                </span>
                <span className="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/40 shadow-[0_0_10px_rgba(242,202,80,0.15)]">
                  TOP-UP
                </span>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 tracking-wider flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e4f2]" />
                <span>{language === 'kh' ? 'សេវាបញ្ចូលលុយហ្គេម 24/7' : 'Instant Game Reload 24/7'}</span>
              </span>
            </div>
          </Link>

          {/* ========================================================================= */}
          {/* CENTER: GAMING HUD NAV TABS (NO AI SPARKLES)                              */}
          {/* ========================================================================= */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0d121c]/90 px-3 py-1.5 rounded-2xl border border-white/[0.08] shadow-inner">
            {/* Hot Games Tab */}
            <Link
              href="/top-up#hot-games"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                pathname === '/top-up'
                  ? 'bg-gradient-to-r from-[#ffe088]/20 via-[#f2ca50]/20 to-[#f2ca50]/10 text-[#f2ca50] border border-[#f2ca50]/30 shadow-[0_0_14px_rgba(242,202,80,0.15)]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#f2ca50]" />
              <span>{language === 'kh' ? 'ហ្គេមទាំងអស់' : 'All Games'}</span>
            </Link>

            {/* Track Orders Tab */}
            <Link
              href="/orders"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                pathname === '/orders'
                  ? 'bg-gradient-to-r from-[#ffe088]/20 via-[#f2ca50]/20 to-[#f2ca50]/10 text-[#f2ca50] border border-[#f2ca50]/30 shadow-[0_0_14px_rgba(242,202,80,0.15)]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-[#f2ca50]" />
              <span>{language === 'kh' ? 'តាមដានការកុម្ម៉ង់' : 'Track Orders'}</span>
            </Link>

            {/* Technical Trust Badge (Direct API reload, zero password) */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141b28] border border-white/[0.05] text-[11px] font-bold text-neutral-300 ml-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'kh' ? 'Moonton & Publishers Direct API' : 'Direct API • No Password'}</span>
            </div>
          </nav>

          {/* ========================================================================= */}
          {/* RIGHT: TACTICAL COMMS, LANGUAGE & PROFILE DOCK                             */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Telegram 24/7 Comms Button */}
            <Link
              href="https://t.me/nexus_support_kh"
              target="_blank"
              className="flex items-center gap-2 bg-[#0088cc]/15 hover:bg-[#0088cc]/25 text-[#00e4f2] hover:text-white px-3.5 py-2 rounded-xl border border-[#0088cc]/35 text-xs font-black tracking-wider transition-all shadow-[0_0_15px_rgba(0,136,204,0.15)] group"
            >
              <Send className="w-3.5 h-3.5 fill-[#00e4f2] text-[#00e4f2] group-hover:translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">{language === 'kh' ? 'Telegram ជំនួយ 24/7' : 'Telegram Support'}</span>
              <span className="sm:hidden">Support</span>
            </Link>

            {/* Language Toggle (Clean Segmented Pill) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 bg-[#0f1420] hover:bg-[#161d2d] px-3 py-2 rounded-xl border border-white/[0.1] text-xs font-black text-neutral-200 hover:text-white transition-all shadow-sm cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#f2ca50]" />
                <span>{language === 'kh' ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN'}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 bg-[#0f1420] border border-white/[0.12] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setLangDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setLanguage('kh')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black text-left transition-colors ${
                      language === 'kh'
                        ? 'bg-[#f2ca50] text-black shadow-md'
                        : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>🇰🇭</span>
                    <span>ភាសាខ្មែរ (KH)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black text-left transition-colors mt-1 ${
                      language === 'en'
                        ? 'bg-[#f2ca50] text-black shadow-md'
                        : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>🇺🇸</span>
                    <span>English (EN)</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile / Guest Saved IDs Shortcut */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-[#0f1420] hover:bg-[#161d2d] p-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/[0.1] transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f2ca50] to-[#00e4f2] p-[1.5px]">
                    <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-[#f2ca50]" />
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-neutral-200 truncate max-w-[100px]">
                      {user?.username}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#00e4f2] font-semibold">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-[#0f1420] border border-white/[0.12] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                      <p className="text-xs text-neutral-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                    </div>

                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#f2ca50] font-semibold hover:bg-white/[0.05] rounded-lg transition-colors"
                      >
                        <Crown className="w-4 h-4 text-[#f2ca50]" />
                        {t('navAdmin')}
                      </Link>
                    )}

                    <Link
                      href="/wallet"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                    >
                      <Zap className="w-4 h-4 text-[#00e4f2]" />
                      {t('navWalletVault')}
                    </Link>

                    <div className="my-1 border-t border-white/[0.06]" />

                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('navSignOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/profile"
                title={language === 'kh' ? 'គណនី និង ID ដែលបានរក្សាទុក' : 'Saved Player IDs & Settings'}
                className="p-2.5 rounded-xl text-neutral-400 hover:text-white bg-[#0f1420] hover:bg-[#161d2d] border border-white/[0.1] transition-all flex items-center justify-center group"
              >
                <UserIcon className="w-4 h-4 text-neutral-400 group-hover:text-[#f2ca50] transition-colors" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#0f1420] text-neutral-400 hover:text-white border border-white/[0.1]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07090e]/98 backdrop-blur-2xl border-b border-white/[0.08] px-4 pt-3 pb-5 space-y-2.5 animate-in slide-in-from-top-4">
          <Link
            href="/top-up#hot-games"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 w-full py-3 px-4 rounded-xl bg-[#0f1420] border border-white/[0.08] text-white hover:text-[#f2ca50] font-black text-xs"
          >
            <Gamepad2 className="w-4 h-4 text-[#f2ca50]" />
            <span>{language === 'kh' ? '🎮 ហ្គេមទាំងអស់ (Hot Games)' : '🎮 All Games'}</span>
          </Link>

          <Link
            href="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 w-full py-3 px-4 rounded-xl bg-[#0f1420] border border-white/[0.08] text-white hover:text-[#f2ca50] font-black text-xs"
          >
            <Receipt className="w-4 h-4 text-[#f2ca50]" />
            <span>{language === 'kh' ? '🧾 តាមដានការកុម្ម៉ង់ (Track Orders)' : '🧾 Track Orders'}</span>
          </Link>

          <Link
            href="https://t.me/nexus_support_kh"
            target="_blank"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 text-[#00e4f2] font-black text-xs"
          >
            <Send className="w-3.5 h-3.5 fill-[#00e4f2]" />
            <span>{language === 'kh' ? 'ឆាតទៅកាន់ Telegram Support 24/7' : 'Telegram Support 24/7'}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
