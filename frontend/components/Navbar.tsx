'use client';

import { useState } from 'react';
import { Search, Bell, ShoppingCart, Menu, X, ChevronDown, Zap, User } from 'lucide-react';

const navLinks = [
  { label: 'HOME', href: '#', active: true },
  { label: 'TOP UP GAMES', href: '#topup' },
  { label: 'DEALS', href: '#deals' },
  { label: 'COMMUNITY', href: '#community' },
  { label: 'STORE', href: '#store' },
  { label: 'SUPPORT', href: '#support' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(4,11,26,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,42,74,0.8)' }}>
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <Zap size={24} style={{ color: '#00a8ff' }} fill="#00a8ff" />
              <div className="absolute inset-0 blur-sm" style={{ background: '#00a8ff', borderRadius: '50%', opacity: 0.3 }} />
            </div>
            <span className="font-brand text-xl tracking-wider gradient-text">TOPUPVERSE</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-3 py-2 text-xs font-semibold tracking-wider transition-colors relative font-en ${link.active ? 'nav-active' : ''}`}
                style={{ color: link.active ? '#00a8ff' : '#8b9ab4' }}
                onMouseEnter={(e) => { if (!link.active) (e.target as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={(e) => { if (!link.active) (e.target as HTMLElement).style.color = '#8b9ab4'; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2" style={{ background: 'rgba(10,20,40,0.8)', border: '1px solid #1a2a4a', borderRadius: '8px', padding: '6px 12px' }}>
              <Search size={14} style={{ color: '#4a5a7a' }} />
              <input
                type="text"
                placeholder="Search games..."
                className="bg-transparent outline-none text-sm w-36"
                style={{ color: '#8b9ab4', fontSize: '13px' }}
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg transition-colors" style={{ color: '#8b9ab4' }}>
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
            </button>

            {/* Cart */}
            <button className="relative p-2 rounded-lg" style={{ color: '#8b9ab4' }}>
              <ShoppingCart size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center text-xs font-bold" style={{ background: '#00a8ff', fontSize: '10px' }}>3</span>
            </button>

            {/* User */}
            <div className="hidden md:flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00a8ff, #8b5cf6)' }}>
                <User size={15} color="white" />
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-white">Welcome,</p>
                <p className="text-xs" style={{ color: '#00a8ff' }}>TopUpKing!</p>
              </div>
              <ChevronDown size={12} style={{ color: '#8b9ab4' }} />
            </div>

            {/* Mobile menu */}
            <button className="lg:hidden p-2" style={{ color: '#8b9ab4' }} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden" style={{ background: 'rgba(4,11,26,0.98)', borderTop: '1px solid #1a2a4a' }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-6 py-3 text-sm font-semibold"
              style={{ color: link.active ? '#00a8ff' : '#8b9ab4', borderBottom: '1px solid rgba(26,42,74,0.5)' }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

