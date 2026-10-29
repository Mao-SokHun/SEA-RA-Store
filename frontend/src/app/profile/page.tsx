'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  User as UserIcon,
  Globe,
  Gamepad2,
  Receipt,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Trash2,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Zap,
  Check,
  LogOut,
  HelpCircle,
  Copy,
} from 'lucide-react';

interface SavedPlayer {
  gameTitle: string;
  playerId: string;
  zoneId?: string;
  serverRegion?: string;
  playerNickname?: string;
  lastUsedAt?: string;
}

export default function ProfilePage() {
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  const [savedPlayers, setSavedPlayers] = useState<SavedPlayer[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load saved player IDs from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('nexus_saved_players');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setSavedPlayers(parsed);
          }
        }
      } catch (e) {
        console.warn('Failed to parse saved players', e);
      }
    }
  }, []);

  const handleRemovePlayer = (gameTitle: string, playerId: string) => {
    const updated = savedPlayers.filter(
      (p) => !(p.gameTitle === gameTitle && p.playerId === playerId)
    );
    setSavedPlayers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_saved_players', JSON.stringify(updated));
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#e1e2eb] pb-24 selection:bg-[#f2ca50] selection:text-black">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#f2ca50]/10 via-[#00e4f2]/5 to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-6">
          <Link href="/top-up" className="hover:text-[#f2ca50] transition-colors flex items-center gap-1">
            <Gamepad2 className="w-3.5 h-3.5 text-[#f2ca50]" />
            <span>{language === 'kh' ? 'ទំព័រដើម Top-Up' : 'Home Top-Up'}</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-[#f2ca50]">
            {language === 'kh' ? 'គណនី និងការកំណត់' : 'Profile & Settings'}
          </span>
        </div>

        {/* User / Guest Header Card */}
        <div className="bg-[#0e131d]/90 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.5)] mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffe088] via-[#f2ca50] to-[#8f6b10] p-[2px] shadow-[0_0_20px_rgba(242,202,80,0.3)] shrink-0">
                <div className="w-full h-full bg-[#0b0e14] rounded-[14px] flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-[#f2ca50]" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {isAuthenticated ? user?.username || user?.email : (language === 'kh' ? 'គណនីភ្ញៀវ (Guest Gamer)' : 'Guest Gamer')}
                  </h1>
                  {!isAuthenticated && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-bold">
                      GUEST
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  {isAuthenticated
                    ? user?.email
                    : (language === 'kh'
                        ? '✨ មិនបាច់ចុះឈ្មោះ • ស្កេន KHQR ចូលហ្គេមភ្លាមៗ'
                        : '✨ Instant top-up via Bakong KHQR with zero login needed')}
                </p>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'kh' ? 'ចាកចេញ' : 'Sign Out'}</span>
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-xl bg-[#171f2c] hover:bg-[#202b3d] border border-white/[0.08] hover:border-[#f2ca50]/40 text-neutral-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>{language === 'kh' ? 'ចូលគណនី Admin / Wallet' : 'Sign In (Optional)'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Section 1: Saved Player IDs for 1-Click Reorder */}
        <div className="bg-[#0e131d]/90 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.5)] mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-[#f2ca50]">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">
                  {language === 'kh' ? 'គណនីហ្គេមដែលបានរក្សាទុក (Saved Game IDs)' : 'Saved Game IDs'}
                </h2>
                <p className="text-xs text-neutral-400">
                  {language === 'kh'
                    ? 'Player ID ដែលអ្នកធ្លាប់បញ្ចូល សម្រាប់ចុចបញ្ចូលពេជ្រម្ដងទៀតត្រឹម ១ ចុច'
                    : 'Saved IDs from your recent reloads for fast 1-click reorders'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-500">
              {savedPlayers.length} IDs
            </span>
          </div>

          {savedPlayers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {savedPlayers.map((item, idx) => (
                <div
                  key={`${item.gameTitle}-${item.playerId}-${idx}`}
                  className="bg-[#141a24] hover:bg-[#1a2230] border border-white/[0.06] hover:border-[#f2ca50]/40 rounded-2xl p-4 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 overflow-hidden">
                    <span className="text-[10px] font-bold text-[#f2ca50] uppercase tracking-wider block">
                      {item.gameTitle}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-white text-sm">
                        {item.playerId}
                        {item.zoneId ? ` (${item.zoneId})` : ''}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.playerId, `${item.gameTitle}-${item.playerId}`)}
                        className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
                        title="Copy Player ID"
                      >
                        {copiedId === `${item.gameTitle}-${item.playerId}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    {item.playerNickname && (
                      <span className="text-xs text-neutral-400 block truncate font-medium">
                        {item.playerNickname}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href="/top-up"
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black text-xs font-extrabold flex items-center gap-1 transition-all shadow-sm"
                    >
                      <Zap className="w-3 h-3 fill-black" />
                      <span>{language === 'kh' ? 'បញ្ចូល' : 'Top Up'}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(item.gameTitle, item.playerId)}
                      className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-neutral-500 border border-dashed border-white/[0.08] rounded-2xl">
              <Gamepad2 className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p>
                {language === 'kh'
                  ? 'មិនទាន់មាន Player ID ដែលបានរក្សាទុកនៅឡើយ។ រាល់ពេលអ្នកបញ្ចូលពេជ្រ ប្រព័ន្ធនឹងរក្សាទុកដោយស្វ័យប្រវត្តិតាមការស្ម័គ្រចិត្ត។'
                  : 'No saved Game IDs yet. When you top-up, your account IDs are automatically saved here for quick reorders.'}
              </p>
              <Link
                href="/top-up"
                className="inline-flex items-center gap-1.5 mt-3 text-[#f2ca50] font-bold hover:underline"
              >
                <span>{language === 'kh' ? 'ទៅកាន់ទំព័រ Top-Up ឥឡូវនេះ' : 'Go to Top-Up Catalog'}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Section 2: Language Preference Selector */}
        <div className="bg-[#0e131d]/90 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.5)] mb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-[#00e4f2]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {language === 'kh' ? 'ភាសាប្រព័ន្ធ (Language Preference)' : 'Language Preference'}
              </h2>
              <p className="text-xs text-neutral-400">
                {language === 'kh' ? 'ជ្រើសរើសភាសាដែលអ្នកពេញចិត្តប្រើប្រាស់' : 'Choose your preferred platform language'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Khmer Toggle Card */}
            <button
              type="button"
              onClick={() => setLanguage('kh')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                language === 'kh'
                  ? 'bg-[#f2ca50]/15 border-[#f2ca50] shadow-[0_0_20px_rgba(242,202,80,0.2)]'
                  : 'bg-[#141a24] border-white/[0.06] hover:bg-[#1a2230]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇰🇭</span>
                <div>
                  <h4 className="font-extrabold text-sm text-white">ភាសាខ្មែរ (Khmer)</h4>
                  <span className="text-xs text-neutral-400">Default official language</span>
                </div>
              </div>
              {language === 'kh' && (
                <div className="w-6 h-6 rounded-full bg-[#f2ca50] text-black flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>

            {/* English Toggle Card */}
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                language === 'en'
                  ? 'bg-[#00e4f2]/15 border-[#00e4f2] shadow-[0_0_20px_rgba(0,228,242,0.2)]'
                  : 'bg-[#141a24] border-white/[0.06] hover:bg-[#1a2230]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇺🇸</span>
                <div>
                  <h4 className="font-extrabold text-sm text-white">English</h4>
                  <span className="text-xs text-neutral-400">International English</span>
                </div>
              </div>
              {language === 'en' && (
                <div className="w-6 h-6 rounded-full bg-[#00e4f2] text-black flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Section 3: Direct Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/orders"
            className="p-5 rounded-3xl bg-[#0e131d]/90 border border-white/[0.08] hover:border-[#f2ca50]/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-[#f2ca50]">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-[#f2ca50] transition-colors">
                  {language === 'kh' ? 'តាមដានការកុម្ម៉ង់ (Track Orders)' : 'Track Orders & Receipts'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {language === 'kh' ? 'ពិនិត្យរាល់វិក្កយបត្រតាម Phone / Player ID' : 'Check all past orders and receipts'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </Link>

          <Link
            href="https://t.me/nexus_support_kh"
            target="_blank"
            className="p-5 rounded-3xl bg-[#0e131d]/90 border border-white/[0.08] hover:border-[#00e4f2]/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#0088cc]/15 border border-[#0088cc]/30 flex items-center justify-center text-[#00e4f2]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-[#00e4f2] transition-colors">
                  {language === 'kh' ? 'ជំនួយអតិថិជន ២៤/៧' : 'Customer Support 24/7'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {language === 'kh' ? 'ឆាតទៅ Telegram: @nexus_support_kh' : 'Chat via Telegram: @nexus_support_kh'}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
