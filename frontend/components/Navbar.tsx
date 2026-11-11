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
  Zap,
  Sparkles,
  Command,
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

  // Track scroll position to enhance glassmorphism on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
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
      className={`sticky top-0 z-50 w-full select-none transition-all duration-300 ${
        scrolled
          ? 'bg-[#070B16]/75 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.65)]'
          : 'bg-[#070B16]/50 backdrop-blur-xl border-b border-white/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
      }`}
    >
      {/* Laser Gradient Accent Line along the bottom of the header */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5B55E]/40 via-[#00D4FF]/30 to-transparent pointer-events-none" />

      {/* ================================================================= */}
      {/* MAIN GLASS NAVBAR CONTENT CONTAINER                               */}
      {/* ================================================================= */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* ================================================================= */}
        {/* BRAND EMBLEM: SEA RA PRESTIGE                                    */}
        {/* ================================================================= */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
          {/* Cyber Diamond Crest with Gold Glow */}
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#E5B55E] via-[#C49740] to-[#1E293B] p-[1px] shadow-[0_0_20px_rgba(229,181,94,0.3)] group-hover:shadow-[0_0_28px_rgba(229,181,94,0.55)] transition-all">
            <div className="w-full h-full bg-[#090E1B] rounded-[11px] sm:rounded-[15px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#E5B55E]/20 to-transparent pointer-events-none" />
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5B55E]" viewBox="0 0 24 24" fill="none">
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
              <span className="font-black text-base sm:text-xl tracking-wider text-white">
                SEA RA
              </span>
              <span className="font-mono font-black text-[9px] sm:text-[10px] uppercase px-1.5 py-0.5 rounded bg-gradient-to-r from-[#E5B55E]/25 to-[#E5B55E]/10 border border-[#E5B55E]/50 text-[#E5B55E] tracking-widest shadow-sm">
                PRESTIGE
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-neutral-400 font-mono tracking-wide mt-0.5">
              {language === 'km' ? '⚡ ស្វ័យប្រវត្តិតាម Smile.One API' : '⚡ Smile.One Reseller API'}
            </span>
          </div>
        </Link>

        {/* ================================================================= */}
        {/* CENTER COMMAND SEARCH BAR WITH ROTATING PLACEHOLDER & CTRL+K     */}
        {/* ================================================================= */}
        <div ref={searchContainerRef} className="relative hidden md:block flex-1 max-w-md mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder={`ស្វែងរក ${SEARCH_SUGGESTIONS[suggestionIdx]}`}
              className="w-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/[0.08] focus:border-[#E5B55E]/70 rounded-xl sm:rounded-2xl pl-10 pr-16 py-2 sm:py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none transition-all backdrop-blur-md shadow-inner"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-neutral-400 hover:text-white text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              ) : (
                <div className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[9px] font-mono text-neutral-400">
                  <Command className="w-2.5 h-2.5" />
                  <span>K</span>
                </div>
              )}
            </div>
          </div>

          {/* Search Dropdown Results Popover */}
          {searchFocused && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#090E1B]/95 backdrop-blur-2xl border border-white/[0.14] rounded-2xl shadow-2xl p-2 z-50 overflow-hidden">
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
                    <div
                      key={game.id}
                      onClick={() => {
                        openTopUp(game.id);
                        setSearchQuery('');
                        setSearchFocused(false);
                      }}
                      className="p-2.5 flex items-center justify-between hover:bg-white/[0.06] rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={game.coverImage}
                          alt={game.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/[0.1]"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{game.name}</p>
                          <span className="text-[10px] text-[#E5B55E] font-mono">
                            {game.currencyName} • {game.packages.length} Packs
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        ⚡ 3s API
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* RIGHT DOCK: TRACK ORDER, SLIDING CURRENCY & LIVE VIP SUPPORT      */}
        {/* ================================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Track Order Button */}
          <button
            type="button"
            onClick={openTrack}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-[#E5B55E]/50 text-xs font-semibold text-neutral-200 backdrop-blur-md transition-all cursor-pointer shadow-sm"
          >
            <Receipt className="w-3.5 h-3.5 text-[#E5B55E]" />
            <span className="hidden sm:inline">{t.nav.trackOrder}</span>
          </button>

          {/* Smooth Sliding Toggle Pill for USD / KHR */}
          <div className="hidden sm:flex items-center relative bg-black/50 backdrop-blur-md p-0.5 rounded-xl border border-white/[0.08] shadow-inner">
            <div
              className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-lg bg-gradient-to-r from-[#E5B55E] to-[#F59E0B] shadow-sm transition-transform duration-300 ease-out ${
                currency === 'KHR' ? 'translate-x-full' : 'translate-x-0'
              }`}
            />
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`relative z-10 px-2.5 py-1 text-[11px] font-mono font-black transition-colors cursor-pointer ${
                currency === 'USD' ? 'text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
            <button
              type="button"
              onClick={() => setCurrency('KHR')}
              className={`relative z-10 px-2.5 py-1 text-[11px] font-mono font-black transition-colors cursor-pointer ${
                currency === 'KHR' ? 'text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              ៛ KHR
            </button>
          </div>

          {/* Language Switcher (KM / EN) */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] backdrop-blur-md text-xs font-bold text-neutral-200 transition-all cursor-pointer shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>{language === 'km' ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN'}</span>
          </button>

          {/* 24/7 Live VIP Support with Emerald Pulse Beam */}
          <a
            href="https://t.me/seara_support_kh"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              {t.nav.support}
            </span>
            <ExternalLink className="w-3 h-3 text-emerald-400/70 group-hover:text-emerald-300" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-7xl mx-auto px-4 pb-4">
          <div className="bg-[#090E1B]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-4 space-y-4 shadow-2xl">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ស្វែងរកហ្គេម..."
                className="w-full bg-[#10182C] border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#E5B55E]"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              <span className="text-xs font-bold text-neutral-400">Currency</span>
              <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-white/[0.1]">
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded text-xs font-mono font-black ${
                    currency === 'USD' ? 'bg-[#E5B55E] text-black' : 'text-neutral-400'
                  }`}
                >
                  USD
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('KHR')}
                  className={`px-3 py-1 rounded text-xs font-mono font-black ${
                    currency === 'KHR' ? 'bg-[#E5B55E] text-black' : 'text-neutral-400'
                  }`}
                >
                  KHR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
