'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, ShoppingCart, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'HOME', href: '/', active: true },
  { label: 'EXPLORE GAMES', href: '#games', active: false },
  { label: 'NEWS', href: '#news', active: false },
  { label: 'COMMUNITY', href: '#community', active: false },
  { label: 'STORE', href: '#store', active: false },
  { label: 'SUPPORT', href: '#support', active: false },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#040816]/95 backdrop-blur-md border-b border-[#121c38]">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-4">
        
        {/* ── Left: GAMEVERSE Logo (Shield with Flame) ── */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          {/* Flame Shield Icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00A3FF] to-[#0055FF] p-[1.5px] shadow-[0_0_15px_rgba(0,163,255,0.4)] group-hover:shadow-[0_0_22px_rgba(0,163,255,0.7)] transition-all">
            <div className="w-full h-full bg-[#050B1B] rounded-[10px] flex items-center justify-center">
              <span className="text-base select-none">🔥</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="font-en font-black text-xl tracking-wider text-white leading-none">
              GAME<span className="text-[#00A3FF]">VERSE</span>
            </span>
            <span className="text-[8px] font-bold tracking-[0.25em] text-[#00A3FF]/80 uppercase mt-0.5">
              TOP-UP PLATFORM
            </span>
          </div>
        </Link>

        {/* ── Center: Navigation Links with Active Indicator ── */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`font-en text-xs xl:text-[13px] font-bold tracking-wider transition-all duration-200 relative py-2 ${
                link.active
                  ? 'text-white'
                  : 'text-[#7F92B0] hover:text-white'
              }`}
            >
              {link.label}
              {link.active && (
                <span className="absolute bottom-[-18px] left-0 right-0 h-[2.5px] bg-[#00A3FF] rounded-full shadow-[0_0_10px_#00A3FF]" />
              )}
            </Link>
          ))}
        </nav>

        {/* ── Right: Search + User Profile + Bell + Cart ── */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          
          {/* Search Box */}
          <div className="hidden md:flex items-center relative w-44 lg:w-48 xl:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-[#081026] border border-[#16244C] focus:border-[#00A3FF] focus:outline-none text-xs text-white placeholder-[#526484] rounded-lg pl-3 pr-8 py-2 transition-all font-en"
            />
            <Search className="w-4 h-4 text-[#526484] absolute right-2.5 pointer-events-none" />
          </div>

          {/* User Profile (Avatar + Welcome, BlazeRunner!) */}
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#1C2C58] group-hover:border-[#00A3FF] transition-all">
              <img
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&q=80"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden xl:flex flex-col text-left leading-tight">
              <span className="text-[10px] text-[#6E82A5] font-en">Welcome,</span>
              <span className="text-xs font-bold text-white font-en group-hover:text-[#00A3FF] transition-colors">
                BlazeRunner!
              </span>
            </div>
          </div>

          {/* Notification Bell */}
          <button
            aria-label="Notifications"
            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[#7F92B0] hover:text-white transition-all"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500]" />
          </button>

          {/* Shopping Cart */}
          <button
            aria-label="Cart"
            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[#7F92B0] hover:text-white transition-all"
          >
            <ShoppingCart size={18} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00A3FF] text-white text-[9px] font-black font-en flex items-center justify-center shadow-[0_0_8px_#00A3FF]">
              0
            </span>
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* ── Mobile Menu Dropdown ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-[#040816]/98 border-t border-[#121c38] px-6 py-4 flex flex-col gap-3">
          <div className="mb-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-[#081026] border border-[#16244C] text-xs text-white placeholder-[#526484] rounded-lg pl-3 pr-8 py-2 font-en"
            />
            <Search className="w-4 h-4 text-[#526484] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-en text-sm font-bold py-2 px-3 rounded-lg flex items-center justify-between ${
                link.active
                  ? 'bg-[#00A3FF]/15 text-[#00A3FF]'
                  : 'text-[#7F92B0] hover:bg-[#081026] hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
