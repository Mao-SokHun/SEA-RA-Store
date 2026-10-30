'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Search,
  Globe,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Crown,
  Menu,
  X,
  Receipt,
  Zap,
  Send,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

// Curated quick search games with icons and aliases
const NAV_GAMES = [
  { id: '1', title: 'Mobile Legends: Bang Bang', alias: 'mlbb mobile legends diamonds', icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100', currency: 'Diamonds' },
  { id: '7', title: 'Roblox', alias: 'roblox robux blox fruits', icon: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=100', currency: 'Robux' },
  { id: '3', title: 'Free Fire', alias: 'ff free fire garena', icon: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100', currency: 'Diamonds' },
  { id: '2', title: 'PUBG Mobile', alias: 'pubg uc royale pass', icon: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100', currency: 'Unknown Cash (UC)' },
  { id: '8', title: 'Call of Duty: Mobile', alias: 'codm call of duty cp', icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100', currency: 'COD Points (CP)' },
  { id: '5', title: 'Genshin Impact', alias: 'genshin genesis crystals welkin', icon: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=100', currency: 'Genesis Crystals' },
  { id: '6', title: 'Valorant', alias: 'valorant riot points vp', icon: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100', currency: 'Valorant Points' },
  { id: '9', title: 'Wild Rift', alias: 'lol wild rift cores', icon: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100', currency: 'Wild Cores' },
  { id: '4', title: 'Honor of Kings', alias: 'hok honor of kings tokens', icon: 'https://images.unsplash.com/photo-1612287233207-6b22998a445b?w=100', currency: 'Tokens' },
  { id: '10', title: 'Blood Strike', alias: 'blood strike gold netease', icon: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100', currency: 'Gold' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNavGames = searchQuery.trim()
    ? NAV_GAMES.filter(
        (g) =>
          g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.alias.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectGame = (gameId: string) => {
    setSearchQuery('');
    setSearchFocused(false);
    setMobileSearchOpen(false);
    router.push(`/top-up?game=${gameId}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#080a0f] border-b border-[#161b26] transition-all font-sans select-none">
      {/* Subtle gold accent hairline along bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#f2ca50]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-4 sm:gap-6">
        {/* ========================================================================= */}
        {/* 1. BRAND LOGO (CODASHOP / SMILE.ONE COMMERCIAL STYLE)                     */}
        {/* ========================================================================= */}
        <Link href="/top-up" className="flex items-center gap-3 shrink-0 group">
          <div className="flex items-baseline tracking-tight">
            <span className="font-black text-2xl tracking-tighter text-white group-hover:text-[#f2ca50] transition-colors">
              NEXUS
            </span>
            <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase bg-[#f2ca50] text-[#080a0f] shadow-sm">
              TOP-UP
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-white/[0.1] text-[11px] font-semibold text-neutral-400">
            <span>🇰🇭</span>
            <span>Cambodia</span>
          </div>
        </Link>

        {/* ========================================================================= */}
        {/* 2. CENTER: INTEGRATED STORE SEARCH BAR (E-COMMERCE GAMING CATALOG)        */}
        {/* ========================================================================= */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder={language === 'kh' ? 'ស្វែងរកហ្គេម (MLBB, Roblox, Free Fire, PUBG...)' : 'Search games, diamonds, vouchers...'}
              className="w-full bg-[#111520] hover:bg-[#151a26] focus:bg-[#151a26] border border-white/[0.1] focus:border-[#f2ca50]/80 rounded-lg pl-10 pr-8 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Instant Search Dropdown Popover */}
          {searchFocused && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0e121a] border border-white/[0.12] rounded-xl shadow-2xl p-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-white/[0.06] flex items-center justify-between">
                <span>{language === 'kh' ? 'លទ្ធផលហ្គេម' : 'Matched Games'}</span>
                <span>{filteredNavGames.length} {language === 'kh' ? 'ហ្គេម' : 'Found'}</span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04] mt-1">
                {filteredNavGames.length > 0 ? (
                  filteredNavGames.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => handleSelectGame(g.id)}
                      className="flex items-center justify-between p-2.5 hover:bg-[#171d2b] rounded-lg cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img src={g.icon} alt={g.title} className="w-8 h-8 rounded-lg object-cover border border-white/[0.08]" />
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-[#f2ca50] transition-colors">{g.title}</p>
                          <p className="text-[10px] text-neutral-400">{g.currency}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#f2ca50] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        <span>{language === 'kh' ? 'បញ្ចូល' : 'Top Up'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-neutral-400">
                    {language === 'kh' ? 'រកមិនឃើញហ្គេមនេះទេ' : 'No game found matching your search'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. NAVIGATION LINKS (CLEAN PRO TABS - NO AI CAPSULES)                     */}
        {/* ========================================================================= */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-bold text-neutral-300">
          <Link
            href="/top-up#hot-games"
            className="hover:text-white transition-colors relative py-1 hover:border-b-2 hover:border-[#f2ca50]"
          >
            {language === 'kh' ? 'ហ្គេមពេញនិយម' : 'Hot Games'}
          </Link>

          <Link
            href="/orders"
            className={`transition-colors relative py-1 ${
              pathname === '/orders' ? 'text-[#f2ca50] border-b-2 border-[#f2ca50]' : 'hover:text-white'
            }`}
          >
            {language === 'kh' ? 'តាមដានការកុម្ម៉ង់' : 'Track Orders'}
          </Link>
        </nav>

        {/* ========================================================================= */}
        {/* 4. RIGHT UTILITY BAR: SUPPORT, LANGUAGE & PROFILE                         */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 rounded-lg bg-[#111520] hover:bg-[#161c28] border border-white/[0.08] text-neutral-300"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Track Orders Quick Button */}
          <Link
            href="/orders"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
              pathname === '/orders'
                ? 'bg-[#f2ca50]/15 text-[#f2ca50] border-[#f2ca50]/40'
                : 'bg-[#111520] hover:bg-[#161c28] text-neutral-200 hover:text-white border-white/[0.08]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-[#f2ca50]" />
            <span>{language === 'kh' ? 'តាមដានវិក្កយបត្រ' : 'Track Orders'}</span>
          </Link>

          {/* Official Telegram Support Link */}
          <Link
            href="https://t.me/nexus_support_kh"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-[#0088cc]/15 hover:bg-[#0088cc]/25 text-[#00c3ff] hover:text-white border border-[#0088cc]/30 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span className="hidden lg:inline">{language === 'kh' ? 'Telegram ២៤/៧' : 'Telegram 24/7'}</span>
            <span className="lg:hidden">Support</span>
          </Link>

          {/* Country / Currency Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 bg-[#111520] hover:bg-[#161c28] px-2.5 py-2 rounded-lg border border-white/[0.08] text-xs font-bold text-neutral-200 hover:text-white transition-all cursor-pointer"
            >
              <span>{language === 'kh' ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN'}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-44 bg-[#0e121a] border border-white/[0.12] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setLangDropdownOpen(false)}
              >
                <div className="px-2.5 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-white/[0.06] mb-1">
                  {language === 'kh' ? 'ជ្រើសរើសភាសា' : 'Select Language'}
                </div>
                <button
                  type="button"
                  onClick={() => setLanguage('kh')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-left transition-colors ${
                    language === 'kh'
                      ? 'bg-[#f2ca50] text-[#080a0f]'
                      : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🇰🇭</span>
                    <span>ភាសាខ្មែរ (KH)</span>
                  </div>
                  <span className="text-[10px] font-semibold opacity-80">KHR ៛</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-left transition-colors mt-1 ${
                    language === 'en'
                      ? 'bg-[#f2ca50] text-[#080a0f]'
                      : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🇺🇸</span>
                    <span>English (EN)</span>
                  </div>
                  <span className="text-[10px] font-semibold opacity-80">USD $</span>
                </button>
              </div>
            )}
          </div>

          {/* User Account / Guest Profile Icon */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-[#111520] hover:bg-[#161c28] px-2.5 py-1.5 rounded-lg border border-white/[0.08] transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-[#f2ca50] text-black font-black text-xs flex items-center justify-center">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-bold text-neutral-200 hidden sm:inline max-w-[80px] truncate">
                  {user?.username}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-[#0e121a] border border-white/[0.12] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                    <p className="text-[11px] text-neutral-400">Signed in as</p>
                    <p className="text-xs font-bold text-white truncate">{user?.email}</p>
                  </div>

                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-[#f2ca50] font-bold hover:bg-white/[0.05] rounded-lg transition-colors"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>{t('navAdmin')}</span>
                    </Link>
                  )}

                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-200 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5 text-[#f2ca50]" />
                    <span>{language === 'kh' ? 'ប្រវត្តិបញ្ជាទិញ' : 'My Orders'}</span>
                  </Link>

                  <div className="my-1 border-t border-white/[0.06]" />

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('navSignOut')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/profile"
              title={language === 'kh' ? 'គណនី និង ID ដែលបានរក្សាទុក' : 'Saved Player IDs'}
              className="p-2 rounded-lg bg-[#111520] hover:bg-[#161c28] border border-white/[0.08] text-neutral-400 hover:text-white transition-all flex items-center justify-center"
            >
              <UserIcon className="w-4 h-4 text-neutral-300" />
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-[#111520] text-neutral-300 hover:text-white border border-white/[0.08]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Drawer (Shown when search icon clicked on mobile) */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-[#0a0d14] border-b border-white/[0.08] p-3 animate-in slide-in-from-top-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'kh' ? 'ស្វែងរកហ្គេម (MLBB, Roblox, Free Fire...)' : 'Search games...'}
              className="w-full bg-[#111520] border border-white/[0.1] focus:border-[#f2ca50] rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
              autoFocus
            />
          </div>

          {searchQuery.trim() && (
            <div className="mt-2 divide-y divide-white/[0.06] max-h-60 overflow-y-auto">
              {filteredNavGames.map((g) => (
                <div
                  key={g.id}
                  onClick={() => handleSelectGame(g.id)}
                  className="flex items-center justify-between py-2.5 px-2 hover:bg-white/[0.04] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={g.icon} alt={g.title} className="w-7 h-7 rounded-md object-cover" />
                    <div>
                      <p className="text-xs font-bold text-white">{g.title}</p>
                      <p className="text-[10px] text-neutral-400">{g.currency}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#f2ca50]">Top Up →</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0a0d14] border-b border-white/[0.08] px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-3">
          <Link
            href="/top-up#hot-games"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg bg-[#111520] text-xs font-bold text-white"
          >
            <span>{language === 'kh' ? '🎮 ហ្គេមពេញនិយមទាំងអស់' : '🎮 All Hot Games'}</span>
            <span className="text-neutral-400 text-[10px]">10 Games</span>
          </Link>

          <Link
            href="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg bg-[#111520] text-xs font-bold text-white"
          >
            <span>{language === 'kh' ? '🧾 តាមដានការកុម្ម៉ង់ (Track Orders)' : '🧾 Track Orders'}</span>
            <span className="text-[#f2ca50] text-[10px]">Guest & User</span>
          </Link>

          <Link
            href="https://t.me/nexus_support_kh"
            target="_blank"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg bg-[#0088cc]/15 border border-[#0088cc]/30 text-xs font-bold text-[#00c3ff]"
          >
            <div className="flex items-center gap-2">
              <Send className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'kh' ? 'Telegram ជំនួយ 24/7' : 'Telegram Support 24/7'}</span>
            </div>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </Link>
        </div>
      )}
    </header>
  );
}
