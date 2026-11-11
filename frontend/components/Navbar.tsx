'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { GAMES } from '@/data/games';
import {
  Search,
  Globe,
  Receipt,
  ExternalLink,
  Menu,
  X,
  Shield,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export default function Navbar() {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
    openTopUp,
    openTrack,
    searchQuery,
    setSearchQuery,
  } = useApp();

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

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        const input = searchContainerRef.current?.querySelector('input');
        input?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = searchQuery.trim()
    ? GAMES.filter(
        (g) =>
          g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.currencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#090C15]/90 backdrop-blur-xl border-b border-white/[0.08] transition-all select-none">
      {/* Subtle luxury metallic hairline highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5B55E]/40 via-[#00D4FF]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* ================================================================= */}
        {/* BRAND EMBLEM: SEA RA PRESTIGE                                    */}
        {/* ================================================================= */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          {/* Luxury Geometric Diamond Crest */}
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E5B55E] via-[#C49740] to-[#1E293B] p-[1px] shadow-[0_0_20px_rgba(229,181,94,0.25)] group-hover:shadow-[0_0_28px_rgba(229,181,94,0.45)] transition-all">
            <div className="w-full h-full bg-[#0D121E] rounded-[15px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#E5B55E]/15 to-transparent pointer-events-none" />
              <svg className="w-6 h-6 text-[#E5B55E]" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L3 7V13C3 18.5 6.8 21.8 12 23C17.2 21.8 21 18.5 21 13V7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 7L16 11L12 15L8 11L12 7Z"
                  fill="#E5B55E"
                  fillOpacity="0.8"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-snug">
              <span className="font-extrabold text-xl tracking-wider text-white">
                SEA RA
              </span>
              <span className="font-black text-xs uppercase px-1.5 py-0.5 rounded bg-gradient-to-r from-[#E5B55E]/20 to-[#E5B55E]/10 border border-[#E5B55E]/40 text-[#E5B55E] tracking-widest">
                PRESTIGE
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-medium tracking-wide mt-0.5">
              {language === 'km' ? 'សេវាបញ្ចូលលុយហ្គេមផ្លូវការ' : 'Official Game Reload'}
            </span>
          </div>
        </Link>

        {/* ================================================================= */}
        {/* CENTER SEARCH BAR WITH AUTO-SUGGEST & SHORTCUT                    */}
        {/* ================================================================= */}
        <div ref={searchContainerRef} className="relative hidden md:block flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full bg-[#111726]/80 hover:bg-[#141C30] focus:bg-[#141C30] border border-white/[0.1] focus:border-[#E5B55E]/80 rounded-2xl pl-10 pr-12 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none transition-all shadow-inner"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-neutral-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              ) : (
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold text-neutral-400 bg-white/[0.06] border border-white/[0.1] rounded">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Search Dropdown Results Popover */}
          {searchFocused && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F1524] border border-white/[0.12] rounded-2xl shadow-2xl p-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-white/[0.06] flex items-center justify-between">
                <span>{language === 'km' ? 'ហ្គេមដែលត្រូវគ្នា' : 'Matched Games'}</span>
                <span>{searchResults.length}</span>
              </div>
              {searchResults.length === 0 ? (
                <p className="p-4 text-xs text-neutral-400 text-center">
                  {language === 'km' ? 'រកមិនឃើញហ្គេមនេះទេ' : 'No matching games found.'}
                </p>
              ) : (
                <div className="max-h-64 overflow-y-auto divide-y divide-white/[0.04]">
                  {searchResults.map((game) => (
                    <div
                      key={game.id}
                      onClick={() => {
                        openTopUp(game.id);
                        setSearchQuery('');
                        setSearchFocused(false);
                      }}
                      className="p-2.5 flex items-center justify-between hover:bg-white/[0.05] rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={game.coverImage}
                          alt={game.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/[0.1]"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{game.name}</p>
                          <span className="text-[10px] text-[#E5B55E]">
                            {game.currencyName} • {game.packages.length} Packs
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        ⚡ 3s
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* RIGHT DOCK: TRACK ORDER, CURRENCY & LANGUAGE TOGGLES             */}
        {/* ================================================================= */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Track Order Button */}
          <button
            type="button"
            onClick={openTrack}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#E5B55E]/50 text-xs font-semibold text-neutral-200 transition-all cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-[#E5B55E]" />
            <span className="hidden sm:inline">{t.nav.trackOrder}</span>
          </button>

          {/* Currency Toggle (USD $ / KHR ៛) */}
          <div className="hidden sm:flex items-center bg-[#111726] border border-white/[0.08] rounded-xl p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded-lg transition-all ${
                currency === 'USD'
                  ? 'bg-[#E5B55E] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
            <button
              type="button"
              onClick={() => setCurrency('KHR')}
              className={`px-2 py-1 rounded-lg transition-all ${
                currency === 'KHR'
                  ? 'bg-[#E5B55E] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ៛ KHR
            </button>
          </div>

          {/* Language Switcher (KM / EN) */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111726] hover:bg-[#182035] border border-white/[0.08] text-xs font-bold text-neutral-200 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>{language === 'km' ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN'}</span>
          </button>

          {/* 24/7 VIP Concierge Support Pill */}
          <a
            href="https://t.me/seara_support_kh"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0088cc]/15 to-[#0088cc]/5 hover:from-[#0088cc]/25 hover:to-[#0088cc]/15 border border-[#0088cc]/30 text-xs font-bold text-white transition-all shadow-sm group"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-300 group-hover:text-white">
              {t.nav.support}
            </span>
            <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-white" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D121E] border-b border-white/[0.1] p-4 space-y-4 animate-in slide-in-from-top-2">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full bg-[#141C30] border border-white/[0.1] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-400"
            />
          </div>

          {/* Mobile Links */}
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setCurrency(currency === 'USD' ? 'KHR' : 'USD');
              }}
              className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-neutral-200 flex items-center justify-between"
            >
              <span>Currency:</span>
              <span className="text-[#E5B55E]">{currency}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                openTrack();
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-neutral-200 flex items-center gap-2"
            >
              <Receipt className="w-4 h-4 text-[#E5B55E]" />
              <span>{t.nav.trackOrder}</span>
            </button>
          </div>

          <a
            href="https://t.me/seara_support_kh"
            target="_blank"
            className="block text-center p-3 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 text-xs font-bold text-white"
          >
            {t.nav.support} (Telegram 24/7)
          </a>
        </div>
      )}
    </header>
  );
}
