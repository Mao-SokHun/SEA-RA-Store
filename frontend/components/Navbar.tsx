'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, ShoppingCart, Globe, ExternalLink, ShieldCheck, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'ទំព័រដើម', href: '/', active: true },
  { label: 'ស្វែងរកហ្គេម', href: '#games', active: false },
  { label: 'ប្រូម៉ូសិន', href: '#deals', active: false },
  { label: 'តាមដានការកុម្ម៉ង់', href: '#orders', active: false },
  { label: 'ជំនួយ ២៤/៧', href: '#support', active: false, external: true },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#040b1a]/95 backdrop-blur-md border-b border-[#00a8ff]/15">
      {/* Full width container edge-to-edge */}
      <div className="w-full px-4 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* ── Left: Brand Logo ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Shield Logo with glowing cyan border */}
            <div className="w-10 h-10 rounded-xl bg-[#00a8ff]/10 border border-[#00a8ff]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,168,255,0.25)] group-hover:border-[#00a8ff] group-hover:shadow-[0_0_20px_rgba(0,168,255,0.4)] transition-all">
              <ShieldCheck className="w-6 h-6 text-[#00a8ff]" strokeWidth={2.2} />
            </div>
            
            {/* Brand Title + Subtitle */}
            <div className="flex flex-col">
              <span className="font-en font-black text-lg tracking-wider text-white leading-none">
                GAME <span className="text-[#00a8ff]">VERSE</span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-[#00a8ff]/80 uppercase mt-0.5">
                SEA RA TOP-UP PLATFORM // KH
              </span>
            </div>
          </Link>
        </div>

        {/* ── Center-Left: Desktop Navigation Links (Khmer) ── */}
        <nav className="hidden xl:flex items-center gap-6 flex-shrink-0">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`font-km text-[13px] font-medium transition-all duration-200 flex items-center gap-1 relative py-1 ${
                item.active
                  ? 'text-[#00a8ff] font-bold'
                  : 'text-[#8b9ab4] hover:text-white'
              }`}
            >
              {item.label}
              {item.external && <ExternalLink size={12} className="opacity-70" />}
              {item.active && (
                <span className="absolute bottom-[-18px] left-0 right-0 h-[2.5px] bg-[#00a8ff] rounded-full shadow-[0_0_10px_#00a8ff]" />
              )}
            </Link>
          ))}
        </nav>

        {/* ── Center-Right: Search Input ── */}
        <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm mx-2">
          <div className="w-full relative flex items-center">
            <Search className="w-4 h-4 text-[#8b9ab4] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកហ្គេម (MLBB, Roblox, Free..."
              className="w-full bg-[#0a1428]/90 border border-[#1a335a] hover:border-[#00a8ff]/40 focus:border-[#00a8ff] focus:outline-none text-xs text-white placeholder-[#5a6f90] rounded-full pl-9 pr-4 py-2 transition-all font-km"
            />
          </div>
        </div>

        {/* ── Right Actions: Language, User Profile, Notification, Cart ── */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          
          {/* Language Switcher */}
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a1428] border border-[#1a335a] hover:border-[#00a8ff]/50 text-xs text-[#8b9ab4] hover:text-white transition-all font-km">
            <Globe size={13} className="text-[#00a8ff]" />
            <span className="font-medium">KH ខ្មែរ</span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00a8ff]/15 border border-[#00a8ff]/30 hover:border-[#00a8ff]/60 cursor-pointer transition-all">
            <div className="w-6 h-6 rounded-lg bg-[#00a8ff] flex items-center justify-center text-white">
              <span className="text-[11px] font-bold">👤</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-[#8b9ab4] leading-tight font-en">Welcome,</span>
              <span className="text-xs font-bold text-white leading-tight font-en">Slayer</span>
            </div>
          </div>

          {/* Notification Bell */}
          <button className="relative w-9 h-9 rounded-xl bg-[#0a1428] border border-[#1a335a] hover:border-[#00a8ff]/40 flex items-center justify-center text-[#8b9ab4] hover:text-white transition-all">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f97316] shadow-[0_0_8px_#f97316]" />
          </button>

          {/* Cart Icon */}
          <button className="relative w-9 h-9 rounded-xl bg-[#0a1428] border border-[#1a335a] hover:border-[#00a8ff]/40 flex items-center justify-center text-[#8b9ab4] hover:text-white transition-all">
            <ShoppingCart size={16} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00a8ff] text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_#00a8ff]">
              1
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 h-9 rounded-xl bg-[#0a1428] border border-[#1a335a] flex items-center justify-center text-white"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {mobileMenuOpen && (
        <div className="xl:hidden w-full bg-[#040b1a]/98 border-t border-[#1a335a] px-6 py-4 flex flex-col gap-3">
          <div className="mb-2">
            <div className="w-full relative flex items-center">
              <Search className="w-4 h-4 text-[#8b9ab4] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ស្វែងរកហ្គេម..."
                className="w-full bg-[#0a1428] border border-[#1a335a] text-xs text-white placeholder-[#5a6f90] rounded-full pl-9 pr-4 py-2 font-km"
              />
            </div>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-km text-sm py-2 px-3 rounded-lg flex items-center justify-between ${
                item.active
                  ? 'bg-[#00a8ff]/10 text-[#00a8ff] font-bold'
                  : 'text-[#8b9ab4] hover:bg-[#0a1428] hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {item.external && <ExternalLink size={14} />}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
