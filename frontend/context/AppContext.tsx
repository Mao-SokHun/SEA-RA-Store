'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Currency, GameItem, PackageItem, TopUpOrder } from '@/types';
import { GAMES } from '@/data/games';
import { TRANSLATIONS } from '@/data/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  t: typeof TRANSLATIONS.en;
  
  // Top-Up Cockpit Modal
  isTopUpOpen: boolean;
  selectedGame: GameItem | null;
  selectedPackage: PackageItem | null;
  openTopUp: (gameSlugOrId?: string, packageId?: string) => void;
  closeTopUp: () => void;
  setSelectedPackage: (pkg: PackageItem) => void;

  // Track Order Modal
  isTrackOpen: boolean;
  openTrack: () => void;
  closeTrack: () => void;

  // Active Checkout Order State
  activeOrder: TopUpOrder | null;
  setActiveOrder: (order: TopUpOrder | null) => void;
  recentOrders: TopUpOrder[];
  saveOrder: (order: TopUpOrder) => void;
  completeOrder: (orderNumber: string) => void;

  // Search & Navigation
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Helpers
  formatPrice: (usd: number) => string;
  toKHR: (usd: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const EXCHANGE_RATE = 4100; // $1 = 4,100 KHR

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('km');
  const [currency, setCurrencyState] = useState<Currency>('USD');

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Top-Up Modal
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);

  // Track Order Modal
  const [isTrackOpen, setIsTrackOpen] = useState(false);

  // Active Order & History
  const [activeOrder, setActiveOrder] = useState<TopUpOrder | null>(null);
  const [recentOrders, setRecentOrders] = useState<TopUpOrder[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('seara_lang') as Language;
      if (savedLang === 'km' || savedLang === 'en') {
        setLanguageState(savedLang);
      }
      const savedCur = localStorage.getItem('seara_currency') as Currency;
      if (savedCur === 'USD' || savedCur === 'KHR') {
        setCurrencyState(savedCur);
      }
      const savedOrders = localStorage.getItem('seara_orders');
      if (savedOrders) {
        setRecentOrders(JSON.parse(savedOrders));
      }
    } catch (e) {
      console.warn('LocalStorage access error', e);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('seara_lang', lang);
    } catch (e) {}
  };

  const setCurrency = (cur: Currency) => {
    setCurrencyState(cur);
    try {
      localStorage.setItem('seara_currency', cur);
    } catch (e) {}
  };

  const openTopUp = (gameSlugOrId?: string, packageId?: string) => {
    const game = gameSlugOrId
      ? GAMES.find((g) => g.id === gameSlugOrId || g.slug === gameSlugOrId) || GAMES[0]
      : GAMES[0];
    
    setSelectedGame(game);
    const pkg = packageId
      ? game.packages.find((p) => p.id === packageId) || game.packages[0]
      : game.packages[0];
    setSelectedPackage(pkg);
    setIsTopUpOpen(true);
  };

  const closeTopUp = () => {
    setIsTopUpOpen(false);
  };

  const openTrack = () => setIsTrackOpen(true);
  const closeTrack = () => setIsTrackOpen(false);

  const saveOrder = (order: TopUpOrder) => {
    const updated = [order, ...recentOrders.filter((o) => o.orderNumber !== order.orderNumber)].slice(0, 20);
    setRecentOrders(updated);
    try {
      localStorage.setItem('seara_orders', JSON.stringify(updated));
    } catch (e) {}
  };

  const completeOrder = (orderNumber: string) => {
    const updated = recentOrders.map((o) => {
      if (o.orderNumber === orderNumber) {
        return {
          ...o,
          status: 'completed' as const,
          completedAt: new Date().toISOString(),
          deliveryProof: `TXN-${orderNumber}-API-DELIVERED`,
        };
      }
      return o;
    });
    setRecentOrders(updated);
    if (activeOrder && activeOrder.orderNumber === orderNumber) {
      setActiveOrder({
        ...activeOrder,
        status: 'completed',
        completedAt: new Date().toISOString(),
        deliveryProof: `TXN-${orderNumber}-API-DELIVERED`,
      });
    }
    try {
      localStorage.setItem('seara_orders', JSON.stringify(updated));
    } catch (e) {}
  };

  const formatPrice = (usd: number): string => {
    if (currency === 'KHR') {
      return (usd * EXCHANGE_RATE).toLocaleString('km-KH') + ' ៛';
    }
    return `$${usd.toFixed(2)}`;
  };

  const toKHR = (usd: number): string => {
    return (usd * EXCHANGE_RATE).toLocaleString('km-KH') + ' ៛';
  };

  const t = TRANSLATIONS[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        isTopUpOpen,
        selectedGame,
        selectedPackage,
        openTopUp,
        closeTopUp,
        setSelectedPackage,
        isTrackOpen,
        openTrack,
        closeTrack,
        activeOrder,
        setActiveOrder,
        recentOrders,
        saveOrder,
        completeOrder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        formatPrice,
        toKHR,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
