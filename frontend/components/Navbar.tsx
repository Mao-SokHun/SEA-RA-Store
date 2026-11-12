'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { GAMES } from '@/data/games';
import {
  Search,
  Globe,
  Receipt,
  ExternalLink,
  Menu,
  X,
  Zap,
  Sparkles,
  Command,
  Gamepad2,
  Home,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';

const SEARCH_SUGGESTIONS = [
  'Mobile Legends Diamonds...',
  'Roblox Robux & Blox Fruits...',
  'Free Fire Diamonds...',
  'PUBG Mobile UC...',
  'Genshin Genesis Crystals...',
  'Valorant Points...',
];

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
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const activeNav = 
    pathname.startsWith('/games') ? 'games' :
    pathname.startsWith('/express') ? 'express' :
    pathname.startsWith('/track-order') ? 'track' :
    pathname.startsWith('/how-to-buy') ? 'faq' :
    pathname.startsWith('/support') ? 'support' :
    pathname.startsWith('/top-up') ? 'express' :
    pathname === '/' ? 'home' : '';

  // Track scroll position to enhance seamless glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycling search placeholder every 2.8s
  useEffect(() => {
    const timer = setInterval(() => {
      setSuggestionIdx((prev) => (prev + 1) % SEARCH_SUGGESTIONS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

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

  // Keyboard shortcut Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = searchContainerRef.current?.querySelector('input');
        input?.focus();
      }
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full select-none transition-all duration-300 ${
        scrolled
          ? 'bg-[#060913]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.7)]'
          : 'bg-transparent border-b border-transparent shadow-none'
      }`}
    >
      {/* Cyberpunk Neon Rim Light: Only appears smoothly on scroll */}
      {scrolled && (
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-violet-500/50 via-cyan-400/50 to-transparent pointer-events-none transition-opacity duration-300" />
      )}

      {/* ================================================================= */}
      {/* MINIMAL INTEGRATED TOPBAR / CENTERED-LINK HEADER CONTAINER        */}
      {/* ================================================================= */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 h-16 sm:h-[72px] flex items-center justify-between gap-4 lg:gap-6">
        
        {/* ================================================================= */}
        {/* 1. LEFT: BRAND LOGO & VERIFICATION CREST                          */}
        {/* ================================================================= */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
          {/* Cyber Shield with Violet & Gold Halo */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500 via-[#E5B55E] to-[#1E293B] p-[1px] shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_28px_rgba(139,92,246,0.55)] transition-all">
            <div className="w-full h-full bg-[#090E1B] rounded-[11px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 via-transparent to-[#E5B55E]/15 pointer-events-none" />
              <svg className="w-5 h-5 text-[#E5B55E]" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L3 7V13C3 18.5 6.8 21.8 12 23C17.2 21.8 21 18.5 21 13V7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 7L16 11L12 15L8 11L12 7Z"
                  fill="#E5B55E"
                  fillOpacity="0.85"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="font-black text-base sm:text-lg tracking-wider text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-violet-200 group-hover:to-cyan-200 transition-colors">
                SEA RA
              </span>
              <span className="font-mono font-black text-[9px] uppercase px-1.5 py-0.5 rounded bg-gradient-to-r from-violet-500/25 via-[#E5B55E]/20 to-transparent border border-violet-400/40 text-violet-300 tracking-widest shadow-sm">
                PRESTIGE
              </span>
            </div>
          </div>
        </Link>

        {/* ================================================================= */}
        {/* 2. CENTER: CENTER-ALIGNED NAVIGATION MENU LINKS WITH NEON GLOW   */}
        {/* ================================================================= */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-3.5 2xl:gap-5 shrink-0 whitespace-nowrap">
          {/* Link 1: Home */}
          <Link
            href="/"
            className={`relative px-3.5 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
              activeNav === 'home'
                ? 'text-white'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="whitespace-nowrap">{language === 'km' ? 'ទំព័រដើម' : 'Home'}</span>
            {activeNav === 'home' && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 shadow-[0_0_12px_rgba(139,92,246,0.9)] animate-pulse" />
            )}
          </Link>

          {/* Link 2: Games Catalog */}
          <Link
            href="/games"
            className={`relative px-3.5 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
              activeNav === 'games'
                ? 'text-white'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="whitespace-nowrap">{language === 'km' ? 'កាតាឡុកហ្គេម' : 'Games'}</span>
            {activeNav === 'games' && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 shadow-[0_0_12px_rgba(139,92,246,0.9)]" />
            )}
          </Link>

          {/* Link 3: Dedicated Full-Screen Express Top-Up Page */}
          <Link
            href="/express"
            className={`relative px-3.5 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
              activeNav === 'express'
                ? 'text-white'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="whitespace-nowrap">{language === 'km' ? 'បញ្ចូលរហ័ស' : 'Express Top-Up'}</span>
            </span>
            {activeNav === 'express' && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 shadow-[0_0_12px_rgba(139,92,246,0.9)]" />
            )}
          </Link>

          {/* Link 4: Track Order */}
          <Link
            href="/track-order"
            className={`relative px-3.5 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
              activeNav === 'track'
                ? 'text-white'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Receipt className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="whitespace-nowrap">{t.nav.trackOrder}</span>
            </span>
            {activeNav === 'track' && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 shadow-[0_0_12px_rgba(139,92,246,0.9)]" />
            )}
          </Link>

          {/* Link 5: How to Buy */}
          <Link
            href="/how-to-buy"
            className={`relative px-3.5 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
              activeNav === 'faq'
                ? 'text-white'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="whitespace-nowrap">
                {language === 'km' ? 'របៀបទិញ' : 'How to Buy'}
              </span>
            </span>
            {activeNav === 'faq' && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 shadow-[0_0_12px_rgba(139,92,246,0.9)]" />
            )}
          </Link>

          {/* Link 6: 24/7 VIP Support */}
          <Link
            href="/support"
            className={`px-3.5 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
              activeNav === 'support'
                ? 'text-emerald-400 bg-white/[0.06]'
                : 'text-neutral-400 hover:text-emerald-400 hover:bg-white/[0.04]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="whitespace-nowrap">{t.nav.support}</span>
          </Link>
        </nav>

        {/* ================================================================= */}
        {/* 3. RIGHT: UTILITY & ACTION GROUP (SEARCH, CURRENCY, GRADIENT CTA) */}
        {/* ================================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Integrated Search Bar with Ctrl+K */}
          <div ref={searchContainerRef} className="relative hidden xl:block w-40 xl:w-48">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder={language === 'km' ? 'ស្វែងរកហ្គេម...' : 'Search games...'}
                className="w-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/[0.08] focus:border-violet-500/80 rounded-xl pl-9 pr-12 py-1.5 sm:py-2 text-xs text-white placeholder-neutral-400 focus:outline-none transition-all backdrop-blur-md shadow-inner"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-neutral-400 hover:text-white text-xs p-0.5 cursor-pointer"
                  >
                    ✕
                  </button>
                ) : (
                  <div className="hidden xl:flex items-center gap-0.5 px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[9px] font-mono text-neutral-400">
                    <Command className="w-2.5 h-2.5" />
                    <span>K</span>
                  </div>
                )}
              </div>
            </div>

            {/* Search Dropdown Results Popover */}
            {searchFocused && searchQuery.trim() && (
              <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-[#090E1B]/95 backdrop-blur-2xl border border-white/[0.14] rounded-2xl shadow-2xl p-2 z-50 overflow-hidden">
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider border-b border-white/[0.06] flex items-center justify-between">
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
                      <Link
                        key={game.id}
                        href={`/top-up/${game.slug}`}
                        onClick={() => {
                          setSearchQuery('');
                          setSearchFocused(false);
                        }}
                        className="p-2.5 flex items-center justify-between hover:bg-white/[0.06] rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={game.coverImage}
                            alt={game.name}
                            className="w-9 h-9 rounded-lg object-cover border border-white/[0.1]"
                          />
                          <div>
                            <p className="text-xs font-bold text-white">{game.name}</p>
                            <span className="text-[10px] text-cyan-400 font-mono">
                              {game.currencyName}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          ⚡ 3s
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language Switcher (KM / EN) */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-neutral-200 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'km' ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN'}</span>
          </button>

          {/* SCI-FI CHAMFERED CTA BUTTON (PLAY NOW / TOP UP) */}
          <Link
            href="/games"
            style={{
              clipPath:
                'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}
            className="relative px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#00D4FF] via-[#0284C7] to-[#2563EB] hover:from-[#38BDF8] hover:to-[#1D4ED8] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,212,255,0.55)] hover:shadow-[0_0_35px_rgba(0,212,255,0.85)] transition-all flex items-center gap-1.5 active:scale-95 group shrink-0"
          >
            <Zap className="w-3.5 h-3.5 text-black fill-current animate-pulse shrink-0" />
            <span className="font-extrabold tracking-wider text-black">
              {language === 'km' ? 'បញ្ចូលលុយ' : 'TOP UP'}
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#070B16]/95 backdrop-blur-2xl px-4 py-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'km' ? 'ស្វែងរកហ្គេម...' : 'Search games...'}
              className="w-full bg-[#10182C] border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col space-y-1 pt-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                activeNav === 'home'
                  ? 'text-white bg-white/[0.08]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>{language === 'km' ? 'ទំព័រដើម' : 'Home'}</span>
              {activeNav === 'home' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </Link>

            <Link
              href="/games"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                activeNav === 'games'
                  ? 'text-white bg-white/[0.08]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>{language === 'km' ? 'កាតាឡុកហ្គេម' : 'Games Catalog'}</span>
              {activeNav === 'games' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </Link>

            <Link
              href="/express"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                activeNav === 'express'
                  ? 'text-white bg-white/[0.08]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>{language === 'km' ? 'បញ្ចូលលុយរហ័ស' : 'Express Top-Up'}</span>
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            </Link>

            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                activeNav === 'track'
                  ? 'text-white bg-white/[0.08]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>{t.nav.trackOrder}</span>
              <Receipt className="w-3.5 h-3.5 text-cyan-400" />
            </Link>

            <Link
              href="/how-to-buy"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                activeNav === 'faq'
                  ? 'text-white bg-white/[0.08]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>{language === 'km' ? 'របៀបទិញ (How to Buy)' : 'How to Buy / FAQ'}</span>
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            </Link>

            <Link
              href="/support"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                activeNav === 'support'
                  ? 'text-emerald-400 bg-white/[0.08]'
                  : 'text-neutral-300 hover:text-emerald-400 hover:bg-white/[0.04]'
              }`}
            >
              <span>{t.nav.support}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </Link>

            <a
              href="https://t.me/sokhunmao"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center justify-between"
            >
              <span>{t.nav.support} (Telegram 24/7)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
