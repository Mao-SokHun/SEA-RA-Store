'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  ShoppingCart,
  User,
  ShieldCheck,
  ChevronDown,
  X,
  Menu,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useTopUp } from '@/context/TopUpContext';

const notificationsList = [
  { id: 1, title: '2x Diamond Bonus Active!', time: '10m ago', unread: true },
  { id: 2, title: 'Weekly Diamond Pass Renewed', time: '1h ago', unread: true },
  { id: 3, title: 'Bakong KHQR 0% Fee Promo', time: '5h ago', unread: true },
  { id: 4, title: 'Welcome to GameVerse Top-Up!', time: '1d ago', unread: false },
];

export default function Navbar() {
  const {
    currency,
    toggleCurrency,
    formatPrice,
    searchQuery,
    setSearchQuery,
    searchResults,
    userBalance,
    setIsSupportOpen,
  } = useTopUp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 left-0 w-full z-40 bg-[#070B19]/95 backdrop-blur-md border-b border-[#152248]/80 select-none transition-all">
      {/* Laser Cyan/Blue Bottom Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F2FE]/60 via-[#3B82F6]/60 to-transparent pointer-events-none" />

      {/* FULL-WIDTH CONTAINER AS REQUESTED BY USER */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 h-[68px] flex items-center justify-between gap-4">
        
        {/* =================================================================== */}
        {/* 1. BRAND LOGO (Matches Reference Screenshot)                        */}
        {/* =================================================================== */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#00F2FE] via-[#3B82F6] to-[#A855F7] p-[1.5px] shadow-[0_0_18px_rgba(0,242,254,0.4)] group-hover:shadow-[0_0_26px_rgba(0,242,254,0.6)] transition-all">
            <div className="w-full h-full bg-[#070D1F] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L4 6V12C4 17.5 7.4 20.8 12 22C16.6 20.8 20 17.5 20 12V6L12 2Z"
                  fill="url(#gv-crest)"
                  stroke="#00F2FE"
                  strokeWidth="1.5"
                />
                <path d="M9 12L11 14L15 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="gv-crest" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00F2FE" stopOpacity="0.4" />
                    <stop offset="0.5" stopColor="#3B82F6" stopOpacity="0.3" />
                    <stop offset="1" stopColor="#A855F7" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-heading font-black text-xl sm:text-2xl tracking-wider text-white">
                GAME<span className="text-[#00F2FE]">VERSE</span>
              </span>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#00F2FE] mt-0.5">
              SEA #1 TOP-UP PLATFORM // KH
            </span>
          </div>
        </Link>

        {/* =================================================================== */}
        {/* 2. CENTER NAV LINKS (Matches Mockup Navigation 100%)                */}
        {/* =================================================================== */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-heading text-xs font-bold tracking-wider uppercase">
          <Link
            href="/"
            className="text-[#00F2FE] relative py-2 after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-[#00F2FE] after:shadow-[0_0_8px_#00F2FE]"
          >
            HOME
          </Link>
          <a
            href="#games"
            className="text-[#94A3B8] hover:text-white transition-colors relative py-2 hover:after:absolute hover:after:bottom-[-20px] hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-[#3B82F6]"
          >
            EXPLORE GAMES
          </a>
          <a
            href="#news"
            className="text-[#94A3B8] hover:text-white transition-colors relative py-2 hover:after:absolute hover:after:bottom-[-20px] hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-[#3B82F6]"
          >
            NEWS
          </a>
          <a
            href="#community"
            className="text-[#94A3B8] hover:text-white transition-colors relative py-2 hover:after:absolute hover:after:bottom-[-20px] hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-[#3B82F6]"
          >
            COMMUNITY
          </a>
          <a
            href="#store"
            className="text-[#94A3B8] hover:text-white transition-colors relative py-2 hover:after:absolute hover:after:bottom-[-20px] hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-[#3B82F6]"
          >
            STORE
          </a>
          <button
            type="button"
            onClick={() => setIsSupportOpen(true)}
            className="text-[#94A3B8] hover:text-[#00F2FE] transition-colors relative py-2 flex items-center gap-1 cursor-pointer"
          >
            <span>SUPPORT</span>
            <ExternalLink className="w-3 h-3 text-[#5A6E8D]" />
          </button>
        </nav>

        {/* =================================================================== */}
        {/* 3. RIGHT CONTROLS: SEARCH, CURRENCY, AVATAR, BELL, CART             */}
        {/* =================================================================== */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          
          {/* Search Input with Autocomplete */}
          <div ref={searchRef} className="relative hidden md:block w-44 lg:w-56 xl:w-64">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#7F92B0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search games, passes..."
                className="w-full bg-[#0D142E] border border-[#152248] focus:border-[#00F2FE]/70 focus:outline-none text-xs text-white placeholder-[#5A6E8D] rounded-lg pl-8 pr-7 py-2 transition-all font-body shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7F92B0] hover:text-white cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Instant Search Dropdown Popover */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A1026] border border-[#152248] rounded-xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold text-[#5A6E8D] uppercase tracking-wider font-heading">
                      GAMES FOUND ({searchResults.length})
                    </div>
                    {searchResults.map((game) => (
                      <Link
                        key={game.id}
                        href={`/top-up/${game.slug}`}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#00F2FE]/10 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{game.currencyIcon}</span>
                          <div>
                            <p className="font-heading font-bold text-xs text-white group-hover:text-[#00F2FE] transition-colors">
                              {game.name}
                            </p>
                            <p className="text-[10px] text-[#7F92B0]">
                              {game.genre} • From {formatPrice(game.packages[0].priceUSD)}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#00F2FE] font-heading uppercase px-2 py-0.5 rounded bg-[#00F2FE]/10 border border-[#00F2FE]/20">
                          RECHARGE →
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-[#7F92B0]">
                    No games found. Try &ldquo;Mobile Legends&rdquo; or &ldquo;Roblox&rdquo;.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Currency Toggle (USD $ / KHR ៛) */}
          <button
            type="button"
            onClick={toggleCurrency}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0D142E] border border-[#152248] hover:border-[#00F2FE]/40 text-xs font-heading font-bold text-white transition-all cursor-pointer shadow-sm"
            title="Toggle between USD ($) and Khmer Riel (KHR ៛)"
          >
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                currency === 'USD'
                  ? 'bg-[#00F2FE] text-black font-black shadow-[0_0_8px_#00F2FE]'
                  : 'text-[#7F92B0]'
              }`}
            >
              $ USD
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                currency === 'KHR'
                  ? 'bg-[#00F2FE] text-black font-black shadow-[0_0_8px_#00F2FE]'
                  : 'text-[#7F92B0]'
              }`}
            >
              ៛ KHR
            </span>
          </button>

          {/* User Profile / Welcome BlazeRunner */}
          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#0D142E] border border-[#152248] hover:border-[#00F2FE]/40 transition-all cursor-pointer group"
            >
              {/* Circular Avatar */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00F2FE] to-[#3B82F6] p-[1px] overflow-hidden flex items-center justify-center shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&q=80"
                  alt="BlazeRunner Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Text: Welcome, BlazeRunner */}
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-[#7F92B0]">Welcome,</span>
                <span className="font-heading font-bold text-xs text-white group-hover:text-[#00F2FE] transition-colors mt-0.5">
                  BlazeRunner!
                </span>
              </div>
              <ChevronDown size={12} className="text-[#7F92B0] group-hover:text-white transition-colors" />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-60 bg-[#0A1026] border border-[#152248] rounded-xl shadow-2xl p-3 z-50">
                <div className="pb-2.5 mb-2.5 border-b border-[#152248]">
                  <p className="text-xs font-bold text-white font-heading">BlazeRunner #KH01</p>
                  <p className="text-[11px] text-[#7F92B0] truncate">blazerunner@gamer.kh</p>
                  <div className="mt-2 p-2 rounded-lg bg-[#070D1F] flex items-center justify-between">
                    <span className="text-[10px] text-[#7F92B0]">Wallet Balance:</span>
                    <span className="font-heading font-black text-xs text-[#00F2FE]">
                      {formatPrice(userBalance)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsSupportOpen(true);
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-lg text-[#94A3B8] hover:bg-[#00F2FE]/10 hover:text-white transition-all cursor-pointer"
                  >
                    24/7 Live Support Desk
                  </button>
                  <a
                    href="#games"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block w-full text-left py-1.5 px-2 rounded-lg text-[#94A3B8] hover:bg-[#00F2FE]/10 hover:text-white transition-all"
                  >
                    Explore Games &amp; Vouchers
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell with Badge */}
          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative w-8 h-8 rounded-lg bg-[#0D142E] border border-[#152248] hover:border-[#00F2FE]/40 flex items-center justify-center text-[#7F92B0] hover:text-white transition-all cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500]" />
            </button>

            {isNotificationOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-[#0A1026] border border-[#152248] rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#152248]">
                  <span className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                    NOTIFICATIONS
                  </span>
                  <span className="text-[10px] text-[#00F2FE] cursor-pointer hover:underline font-heading">
                    Mark read
                  </span>
                </div>
                <div className="space-y-2">
                  {notificationsList.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-lg bg-[#070D1F] hover:bg-[#00F2FE]/10 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-white">{item.title}</p>
                        {item.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE]" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#5A6E8D]">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Shopping Cart Icon with Badge */}
          <Link
            href="/top-up/mobile-legends"
            className="relative w-8 h-8 rounded-lg bg-[#0D142E] border border-[#152248] hover:border-[#00F2FE]/40 flex items-center justify-center text-[#7F92B0] hover:text-white transition-all cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingCart size={15} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5500] text-white text-[9px] font-black flex items-center justify-center shadow-[0_0_8px_#FF5500]">
              1
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#0D142E] border border-[#152248] text-[#7F92B0] hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A1026] border-b border-[#152248] px-5 py-4 space-y-3">
          <div className="flex items-center gap-4 text-xs font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#00F2FE] block py-1"
            >
              HOME
            </Link>
            <a
              href="#games"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-white"
            >
              EXPLORE GAMES
            </a>
            <a
              href="#news"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-white"
            >
              NEWS
            </a>
            <a
              href="#community"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-white"
            >
              COMMUNITY
            </a>
            <a
              href="#store"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-white"
            >
              STORE
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
