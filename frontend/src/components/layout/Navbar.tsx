'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useOrderStore } from '@/store/useOrderStore';
import { TRANSLATIONS } from '@/i18n/translations';
import { GAMES } from '@/data/games';
import {
  Search,
  Bell,
  ShoppingCart,
  User,
  Globe,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const {
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    openTopUp,
  } = useOrderStore();
  const t = TRANSLATIONS[language].nav;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search popover on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? GAMES.filter(
        (g) =>
          g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.currencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#070B17]/95 backdrop-blur-xl border-b border-[#2B6CFF]/30 select-none transition-all">
      {/* Laser Neon Blue Accent Runner */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#22D3EE]/80 via-[#3B82F6]/90 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        {/* =================================================================== */}
        {/* BRAND LOGO: Glowing Crest + GAMEVERSE                               */}
        {/* =================================================================== */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#22D3EE] via-[#3B82F6] to-[#FF7A18] p-[1.5px] shadow-[0_0_18px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_26px_rgba(34,211,238,0.6)] transition-all">
            <div className="w-full h-full bg-[#0A1022] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L4 6V12C4 17.5 7.4 20.8 12 22C16.6 20.8 20 17.5 20 12V6L12 2Z"
                  fill="url(#gv-crest)"
                  stroke="#22D3EE"
                  strokeWidth="1.5"
                />
                <path d="M9 12L11 14L15 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="gv-crest" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#22D3EE" stopOpacity="0.4" />
                    <stop offset="0.5" stopColor="#3B82F6" stopOpacity="0.3" />
                    <stop offset="1" stopColor="#FF7A18" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-xl tracking-wider text-white">GAME</span>
              <span className="font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#3B82F6]">
                VERSE
              </span>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#22D3EE] mt-0.5">
              SEA RA TOP-UP PLATFORM // KH
            </span>
          </div>
        </Link>

        {/* =================================================================== */}
        {/* NAV LINKS (Match Reference Layout)                                  */}
        {/* =================================================================== */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-black tracking-wider uppercase">
          <Link
            href="/"
            className="text-[#22D3EE] relative py-2 after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-[#22D3EE] after:shadow-[0_0_8px_#22D3EE]"
          >
            {t.home}
          </Link>
          <a
            href="#featured-games"
            className="text-neutral-300 hover:text-white transition-colors relative py-2 hover:after:absolute hover:after:bottom-[-20px] hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-[#3B82F6]"
          >
            {t.games}
          </a>
          <a
            href="#promotions-news"
            className="text-neutral-300 hover:text-white transition-colors relative py-2 hover:after:absolute hover:after:bottom-[-20px] hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-[#3B82F6]"
          >
            {t.promotions}
          </a>
          <a
            href="#live-orders"
            className="text-neutral-300 hover:text-white transition-colors relative py-2 hover:after:absolute hover:after:bottom-[-20px] hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-[#3B82F6]"
          >
            {t.orders}
          </a>
          <a
            href="https://t.me/seara_support_kh"
            target="_blank"
            className="text-neutral-300 hover:text-[#22D3EE] transition-colors relative py-2 flex items-center gap-1"
          >
            <span>{t.support}</span>
            <ExternalLink className="w-3 h-3 text-neutral-500" />
          </a>
        </nav>

        {/* =================================================================== */}
        {/* RIGHT CONTROLS: SEARCH BAR, LANG SWITCH, USER AVATAR, BELL, CART    */}
        {/* =================================================================== */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Integrated Pro Search Bar */}
          <div ref={searchContainerRef} className="relative hidden md:block w-48 xl:w-60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-[#0F1A35] hover:bg-[#152347] focus:bg-[#152347] border border-[#2B6CFF]/40 focus:border-[#22D3EE] rounded-xl pl-9 pr-7 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Instant Search Dropdown Popover */}
            {searchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0B1224] border border-[#2B6CFF]/50 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden">
                <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-white/[0.06] flex items-center justify-between">
                  <span>Matched Games</span>
                  <span>{searchResults.length}</span>
                </div>
                {searchResults.length === 0 ? (
                  <p className="p-3 text-xs text-neutral-400 text-center">No games found</p>
                ) : (
                  <div className="max-h-60 overflow-y-auto divide-y divide-white/[0.04]">
                    {searchResults.map((game) => (
                      <div
                        key={game.id}
                        onClick={() => {
                          openTopUp(game.id);
                          setSearchQuery('');
                          setSearchFocused(false);
                        }}
                        className="p-2 flex items-center gap-2.5 hover:bg-[#152347] rounded-xl cursor-pointer transition-colors"
                      >
                        <img src={game.cover} alt={game.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{game.name}</p>
                          <span className="text-[10px] text-[#22D3EE]">{game.currencyName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bilingual Language Switcher (KM / EN) */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0F1A35] hover:bg-[#152347] border border-[#2B6CFF]/40 text-xs font-bold text-neutral-200 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span className="text-[11px] font-mono">{language === 'km' ? '🇰🇭 ខ្មែរ' : '🇺🇸 ENG'}</span>
          </button>

          {/* User Avatar + Welcome Text */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#0F1A35] border border-[#2B6CFF]/30">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#3B82F6] to-[#22D3EE] flex items-center justify-center text-black font-black text-[10px]">
              <User className="w-3.5 h-3.5 text-black" />
            </div>
            <div className="text-left leading-none">
              <span className="text-[10px] text-neutral-400 block">Welcome,</span>
              <span className="text-xs font-black text-white">Slayer</span>
            </div>
          </div>

          {/* Notification Bell */}
          <button
            type="button"
            aria-label="Notifications"
            className="w-9 h-9 rounded-xl bg-[#0F1A35] hover:bg-[#152347] border border-[#2B6CFF]/30 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF7A18] animate-pulse" />
          </button>

          {/* Cart Icon */}
          <button
            type="button"
            onClick={() => openTopUp('1')}
            aria-label="Cart"
            className="w-9 h-9 rounded-xl bg-[#0F1A35] hover:bg-[#152347] border border-[#2B6CFF]/30 flex items-center justify-center text-neutral-300 hover:text-[#22D3EE] transition-all cursor-pointer relative"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#22D3EE] text-black font-black text-[9px] flex items-center justify-center">
              1
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl bg-[#0F1A35] border border-[#2B6CFF]/30 flex items-center justify-center text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A1022] border-b border-[#2B6CFF]/40 p-4 space-y-3">
          <div className="space-y-1 text-sm font-bold">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg text-[#22D3EE] bg-[#0F1A35]"
            >
              {t.home}
            </Link>
            <a
              href="#featured-games"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg text-neutral-300 hover:text-white"
            >
              {t.games}
            </a>
            <a
              href="#promotions-news"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg text-neutral-300 hover:text-white"
            >
              {t.promotions}
            </a>
            <a
              href="#live-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg text-neutral-300 hover:text-white"
            >
              {t.orders}
            </a>
            <a
              href="https://t.me/seara_support_kh"
              target="_blank"
              className="block p-2 rounded-lg text-neutral-300 hover:text-[#22D3EE]"
            >
              {t.support} (Telegram 24/7)
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
