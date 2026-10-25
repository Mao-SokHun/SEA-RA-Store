'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Zap, Shield, RotateCcw } from 'lucide-react';
import AccountCard from '@/components/cards/AccountCard';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { GameAccount, Game } from '@/types';

function CatalogContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const initialGame = searchParams.get('game') || 'all';

  const [accounts, setAccounts] = useState<GameAccount[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameId, setSelectedGameId] = useState<string>(initialGame);
  const [selectedDelivery, setSelectedDelivery] = useState<string>('all');
  const [selectedBind, setSelectedBind] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [gamesRes, accountsRes] = await Promise.all([
          api.games.list().catch(() => []),
          api.accounts.list({ limit: 50 }).catch(() => ({ accounts: [] })),
        ]);
        setGames(gamesRes || []);
        setAccounts(accountsRes.accounts || []);
      } catch (err) {
        console.error('Error loading catalog:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter & Sort Logic
  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((acc) => {
        // Search filter
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = acc.title.toLowerCase().includes(q);
          const matchesGame = acc.game?.title.toLowerCase().includes(q);
          const matchesTier = acc.tierRank.toLowerCase().includes(q);
          if (!matchesTitle && !matchesGame && !matchesTier) return false;
        }

        // Game filter
        if (selectedGameId !== 'all') {
          const gameTitle = acc.game?.title?.toLowerCase() || '';
          const target = selectedGameId.toLowerCase();
          if (
            acc.gameId !== selectedGameId &&
            acc.game?.slug !== selectedGameId &&
            !gameTitle.includes(target)
          ) {
            return false;
          }
        }

        // Delivery type
        if (selectedDelivery !== 'all' && acc.deliveryType !== selectedDelivery) {
          return false;
        }

        // Bind filter
        if (selectedBind === 'clean') {
          const isClean = acc.binds?.some((b) => b.bindType === 'clean');
          if (!isClean) return false;
        }

        // Price range
        if (acc.price < minPrice || acc.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
        if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
        if (sortBy === 'escrow_score') return (b.escrowScore || 0) - (a.escrowScore || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [accounts, searchQuery, selectedGameId, selectedDelivery, selectedBind, minPrice, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGameId('all');
    setSelectedDelivery('all');
    setSelectedBind('all');
    setMinPrice(0);
    setMaxPrice(2000);
    setSortBy('newest');
  };

  return (
    <div className={`min-h-screen bg-[#0b0e14] py-8 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
            <span>{language === 'kh' ? 'ទីផ្សារ' : 'Marketplace'}</span>
            <span>/</span>
            <span className="text-[#f2ca50] font-semibold">{t('catalogSubtitle')}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {t('catalogTitle')}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            {language === 'kh'
              ? 'រុករកគណនីដែលបានផ្ទៀងផ្ទាត់ត្រឹមត្រូវ និងធានាសុវត្ថិភាព ១០០% ដោយប្រព័ន្ធ Escrow។'
              : 'Browse verified game accounts protected by our 100% money-back escrow guarantee.'}
          </p>
        </div>

        {/* Top Control Bar: Search + Game Tabs + Sort */}
        <div className="bg-[#151a23] p-4 rounded-2xl border border-white/[0.08] mb-8 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0b0e14] rounded-xl border border-white/[0.08] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-[#0b0e14] rounded-xl border border-white/[0.08] text-xs font-semibold text-neutral-200 focus:outline-none focus:border-[#d4af37] appearance-none"
                >
                  <option value="newest">{t('sortNewest')}</option>
                  <option value="price_asc">{t('sortPriceAsc')}</option>
                  <option value="price_desc">{t('sortPriceDesc')}</option>
                  <option value="escrow_score">{t('sortEscrowScore')}</option>
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden p-2.5 bg-[#0b0e14] border border-white/[0.08] rounded-xl text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#f2ca50]" />
                <span>{language === 'kh' ? 'ចម្រាញ់' : 'Filters'}</span>
              </button>
            </div>
          </div>

          {/* Game Quick Select Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-white/[0.06] pt-3">
            <button
              onClick={() => setSelectedGameId('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                selectedGameId === 'all'
                  ? 'bg-[#f2ca50] text-[#0b0e14] shadow-[0_0_12px_rgba(242,202,80,0.3)]'
                  : 'bg-[#0b0e14] text-neutral-400 hover:text-white'
              }`}
            >
              {t('allGames')} ({accounts.length})
            </button>
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGameId(g.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                  selectedGameId === g.id
                    ? 'bg-[#f2ca50] text-[#0b0e14] shadow-[0_0_12px_rgba(242,202,80,0.3)]'
                    : 'bg-[#0b0e14] text-neutral-400 hover:text-white'
                }`}
              >
                {g.title}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Body: Filters Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6`}>
            <div className="bg-[#151a23] p-5 rounded-2xl border border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Filter className="w-4 h-4 text-[#f2ca50]" />
                  <span>{language === 'kh' ? 'លក្ខខណ្ឌចម្រាញ់' : 'Filter Attributes'}</span>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-neutral-400 hover:text-[#f2ca50] flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  {t('clearFilters')}
                </button>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                  {t('filterPriceBudget')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full bg-[#0b0e14] border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs text-white"
                    placeholder="Min"
                  />
                  <span className="text-neutral-500">-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full bg-[#0b0e14] border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs text-white"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="2500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#f2ca50] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
                  <span>$0</span>
                  <span>${maxPrice}</span>
                </div>
              </div>

              {/* Delivery Mechanism */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                  {t('filterDelivery')}
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      checked={selectedDelivery === 'all'}
                      onChange={() => setSelectedDelivery('all')}
                      className="accent-[#f2ca50]"
                    />
                    <span>{t('filterDeliveryAll')}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      checked={selectedDelivery === 'instant'}
                      onChange={() => setSelectedDelivery('instant')}
                      className="accent-[#f2ca50]"
                    />
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      {t('instantDelivery')} (&lt;3s)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      checked={selectedDelivery === 'manual'}
                      onChange={() => setSelectedDelivery('manual')}
                      className="accent-[#f2ca50]"
                    />
                    <span>{t('escrowChat')}</span>
                  </label>
                </div>
              </div>

              {/* Bind Health */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                  {t('filterBindHealth')}
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="radio"
                      name="bind"
                      checked={selectedBind === 'all'}
                      onChange={() => setSelectedBind('all')}
                      className="accent-[#f2ca50]"
                    />
                    <span>{t('filterBindAll')}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="radio"
                      name="bind"
                      checked={selectedBind === 'clean'}
                      onChange={() => setSelectedBind('clean')}
                      className="accent-[#f2ca50]"
                    />
                    <span className="text-emerald-300">{t('filterCleanOnly')}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Account Results Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-[#f2ca50] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-neutral-400 font-mono">
                  {language === 'kh' ? 'កំពុងទាញយកទិន្នន័យគណនី...' : 'Loading marketplace inventory...'}
                </p>
              </div>
            ) : filteredAccounts.length > 0 ? (
              <div className="space-y-4">
                <div className="text-xs text-neutral-400">
                  {t('showing')} <span className="text-white font-bold">{filteredAccounts.length}</span> {t('verifiedAssets')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAccounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-20 bg-[#151a23]/60 rounded-2xl border border-white/[0.08] text-center p-8">
                <Shield className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-neutral-200">
                  {t('noAccountsFound')}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                  {language === 'kh'
                    ? 'សូមសាកល្បងកែប្រែថវិកាតម្លៃ ឈ្មោះស្វែងរក ឬចុចកំណត់ឡើងវិញ។'
                    : 'Try adjusting your price range, search terms, or clear filters to see more results.'}
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#f2ca50] text-[#0b0e14]"
                >
                  {t('clearFilters')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-[#f2ca50] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-neutral-400 font-mono">Loading marketplace catalog...</p>
        </div>
      }
    >
      <CatalogContent />
    </React.Suspense>
  );
}
