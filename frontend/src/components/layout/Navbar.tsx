'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Shield,
  Zap,
  Globe,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Crown,
  Menu,
  X,
  Sparkles,
  HelpCircle,
  Receipt,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/95 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffe088] via-[#d4af37] to-[#8f6b10] p-[1.5px] shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0b0e14] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#f2ca50] fill-[#f2ca50]" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-wider text-[#f2ca50]">NEXUS</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                TOP-UP
              </span>
            </div>
            <span className="text-[10px] font-medium text-neutral-400 tracking-wider">
              {t('brandSub')}
            </span>
          </div>
        </Link>

        {/* Center Pill: Clean Trust Indicators (No Login Needed) */}
        <div className="hidden lg:flex items-center gap-3 bg-[#151a23]/90 px-4 py-2 rounded-2xl border border-white/[0.08] shadow-inner">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>{language === 'kh' ? '✨ មិនបាច់បង្កើត Account' : '✨ No Account Needed'}</span>
          </div>
          <span className="text-neutral-600">•</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{language === 'kh' ? 'ស្កេន KHQR ចូលភ្លាម 3-5 វិនាទី' : 'Instant KHQR Delivery (3s)'}</span>
          </div>
        </div>

        {/* Right Section: Orders, Telegram Support, Language Toggle & User Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Track Orders Link for Guests & Users */}
          <Link
            href="/orders"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              pathname === '/orders'
                ? 'bg-[#f2ca50]/15 text-[#f2ca50] border-[#f2ca50]/40 shadow-[0_0_12px_rgba(242,202,80,0.2)]'
                : 'bg-[#151a23] hover:bg-[#1d2026] text-neutral-300 hover:text-[#f2ca50] border-white/[0.08]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-[#f2ca50]" />
            <span className="hidden sm:inline">{language === 'kh' ? 'តាមដានការកុម្ម៉ង់' : 'Track Orders'}</span>
            <span className="sm:hidden">{language === 'kh' ? 'វិក្កយបត្រ' : 'Orders'}</span>
          </Link>

          {/* Telegram Support Link */}
          <Link
            href="https://t.me/nexus_support_kh"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 bg-[#0088cc]/15 hover:bg-[#0088cc]/25 text-[#00e4f2] hover:text-white px-3 py-2 rounded-xl border border-[#0088cc]/30 text-xs font-bold transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            <span>{language === 'kh' ? 'ជំនួយ 24/7' : 'Support 24/7'}</span>
          </Link>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 bg-[#151a23] hover:bg-[#1d2026] px-2.5 py-2 rounded-xl border border-white/[0.08] text-xs font-bold text-neutral-300 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#00e4f2]" />
              <span>{language === 'kh' ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN'}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-36 bg-[#151a23] border border-white/[0.1] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setLangDropdownOpen(false)}
              >
                <button
                  onClick={() => setLanguage('kh')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-left transition-colors ${
                    language === 'kh'
                      ? 'bg-[#f2ca50] text-[#0b0e14]'
                      : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span>🇰🇭</span>
                  <span>ភាសាខ្មែរ (KH)</span>
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-left transition-colors mt-1 ${
                    language === 'en'
                      ? 'bg-[#f2ca50] text-[#0b0e14]'
                      : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span>🇺🇸</span>
                  <span>English (EN)</span>
                </button>
              </div>
            )}
          </div>

          {/* User Section (Subtle & Optional for Guests) */}
          {isAuthenticated ? (
            <>
              {/* Wallet Pill */}
              <Link
                href="/wallet"
                className="hidden sm:flex items-center gap-2 bg-[#151a23] hover:bg-[#1d2026] px-3 py-2 rounded-xl border border-[#d4af37]/25 shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all group"
              >
                <div className="w-2 h-2 rounded-full bg-[#00e4f2] animate-pulse" />
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  {t('navWalletVault')}
                </span>
                <span className="text-sm font-bold text-[#f2ca50] group-hover:text-white transition-colors">
                  ${Number(user?.wallet?.balance ?? 0).toFixed(2)}
                </span>
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-[#151a23] hover:bg-[#1d2026] p-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/[0.08] transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#00e4f2] p-[1.5px]">
                    <div className="w-full h-full bg-[#0b0e14] rounded-[7px] flex items-center justify-center">
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
                    className="absolute right-0 mt-2 w-56 bg-[#151a23] border border-white/[0.1] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
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
                      <Shield className="w-4 h-4 text-[#00e4f2]" />
                      {t('navWalletVault')}
                    </Link>

                    <div className="my-1 border-t border-white/[0.06]" />

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('navSignOut')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Profile & Saved IDs access icon */
            <Link
              href="/profile"
              title={language === 'kh' ? 'គណនី និងការកំណត់' : 'Profile & Settings'}
              className="p-2.5 rounded-xl text-neutral-400 hover:text-white bg-[#151a23] hover:bg-[#1d2026] border border-white/[0.08] transition-all flex items-center justify-center group"
            >
              <UserIcon className="w-4 h-4 text-neutral-400 group-hover:text-[#f2ca50] transition-colors" />
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#151a23] text-neutral-400 hover:text-white border border-white/[0.08]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean & Simple) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#10131a]/98 backdrop-blur-2xl border-b border-white/[0.08] px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-4">
          <div className="bg-[#181f2c] rounded-xl p-3 border border-white/[0.06] text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'kh' ? '✨ មិនបាច់បង្កើត Account ទេ' : '✨ No Account Needed'}</span>
            </div>
            <p className="text-neutral-400 text-[11px]">
              {language === 'kh'
                ? 'គ្រាន់តែជ្រើសរើសហ្គេម បញ្ចូល Player ID រួចស្កេន KHQR នោះពេជ្រនឹងចូលភ្លាម!'
                : 'Simply choose game, enter Player ID, and scan KHQR to get instant delivery!'}
            </p>
          </div>

          <Link
            href="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#171f2c] border border-white/[0.08] text-white hover:text-[#f2ca50] font-bold text-xs"
          >
            <Receipt className="w-4 h-4 text-[#f2ca50]" />
            <span>{language === 'kh' ? '🧾 ពិនិត្យប្រវត្តិបញ្ជាទិញ (Track Orders)' : '🧾 Track Orders / History'}</span>
          </Link>

          <Link
            href="https://t.me/nexus_support_kh"
            target="_blank"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 text-[#00e4f2] font-bold text-xs"
          >
            <span>✈️ {language === 'kh' ? 'ឆាតទៅកាន់ Telegram Support' : 'Telegram Support 24/7'}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
