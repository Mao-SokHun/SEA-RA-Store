'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Shield,
  Search,
  Wallet as WalletIcon,
  User as UserIcon,
  PlusCircle,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Globe,
  Sparkles,
  ShoppingBag,
  Award,
  Crown,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // FEATURE FLAGS: Only TopUp is active. Sell Account & Rent for Fee are DISABLED.
  // To re-enable, uncomment the relevant nav items below.
  const navLinks = [
    // [DISABLED - Sell Account] { label: t('navCatalog'), href: '/catalog', icon: ShoppingBag },
    { label: t('navTopUp'), href: '/top-up', icon: Zap, badge: '⚡' },
    // [DISABLED - Sell Account] { label: t('navSell'), href: '/sell', icon: PlusCircle },
    // [DISABLED - Sell Account] { label: t('navHowItWorks'), href: '/#how-it-works', icon: Sparkles },
    // [DISABLED - Sell Account] { label: t('navWarranty'), href: '/warranty', icon: Shield },
    // [DISABLED - Sell Account] { label: t('navOrders'), href: '/orders', icon: CheckCircle2 },
    ...(user?.role === 'admin' ? [{ label: t('navAdmin'), href: '/admin', icon: Crown }] : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/95 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffe088] via-[#d4af37] to-[#8f6b10] p-[1.5px] shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0b0e14] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#f2ca50]" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-wider text-[#f2ca50]">NEXUS</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#00e4f2]/10 text-[#00e4f2] border border-[#00e4f2]/20">
                MARKET
              </span>
            </div>
            <span className="text-[10px] font-medium text-neutral-400 tracking-wider">
              {t('brandSub')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#151a23]/80 p-1.5 rounded-xl border border-white/[0.06]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-[0_0_15px_rgba(212,175,55,0.35)] font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0b0e14]' : 'text-[#f2ca50]'}`} />}
                <span>{link.label}</span>
                {(link as any).badge && (
                  <span className="text-[9px] font-black tracking-wider px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-sm animate-pulse">
                    {(link as any).badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Language Toggle, Wallet Balance & User Menu */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 bg-[#151a23] hover:bg-[#1d2026] px-2.5 py-2 rounded-xl border border-white/[0.08] text-xs font-bold text-neutral-300 hover:text-white transition-all shadow-sm"
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
                  className="flex items-center gap-2 bg-[#151a23] hover:bg-[#1d2026] p-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/[0.08] transition-all"
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

                    {/* [DISABLED - Sell Account]
                    <Link
                      href="/orders"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#00e4f2]" />
                      {t('navOrders')}
                    </Link>
                    */}

                    <Link
                      href="/wallet"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                    >
                      <WalletIcon className="w-4 h-4 text-[#f2ca50]" />
                      {t('navWalletVault')}
                    </Link>

                    {/* [DISABLED - Sell Account]
                    <Link
                      href="/sell"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-400" />
                      {t('navSell')}
                    </Link>
                    */}

                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#f2ca50] font-semibold hover:bg-white/[0.05] rounded-lg transition-colors"
                      >
                        <Shield className="w-4 h-4 text-[#f2ca50]" />
                        {t('navAdmin')}
                      </Link>
                    )}

                    <div className="my-1 border-t border-white/[0.06]" />

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('navSignOut')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white bg-[#151a23] hover:bg-[#1d2026] border border-white/[0.08] transition-all"
              >
                {t('navSignIn')}
              </Link>
              <Link
                href="/auth/register"
                className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#0b0e14] bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all"
              >
                {t('navGetStarted')}
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-[#151a23] text-neutral-400 hover:text-white border border-white/[0.08]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#10131a]/98 backdrop-blur-2xl border-b border-white/[0.08] px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wider uppercase text-neutral-300 hover:text-[#f2ca50] hover:bg-white/[0.04]"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <div className="pt-2 border-t border-white/[0.08]">
              <Link
                href="/wallet"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#151a23] border border-[#d4af37]/30 text-[#f2ca50] font-bold text-sm"
              >
                <span>{t('navWalletVault')}</span>
                <span>${Number(user?.wallet?.balance ?? 0).toFixed(2)}</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
