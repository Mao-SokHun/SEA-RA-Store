'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { GameItem, OrderInvoice } from '@/types';
import { ALL_GAMES } from '@/data/gamesData';

interface TopUpContextType {
  currency: 'USD' | 'KHR';
  setCurrency: (c: 'USD' | 'KHR') => void;
  toggleCurrency: () => void;
  formatPrice: (priceUSD: number) => string;
  exchangeRate: number;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: GameItem[];

  selectedGame: GameItem | null;
  setSelectedGame: (game: GameItem | null) => void;

  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  openCheckout: (game: GameItem) => void;

  currentInvoice: OrderInvoice | null;
  setCurrentInvoice: (invoice: OrderInvoice | null) => void;
  isInvoiceOpen: boolean;
  setIsInvoiceOpen: (open: boolean) => void;

  isSupportOpen: boolean;
  setIsSupportOpen: (open: boolean) => void;

  userBalance: number;
  setUserBalance: React.Dispatch<React.SetStateAction<number>>;
}

const TopUpContext = createContext<TopUpContextType | undefined>(undefined);

export function TopUpProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<'USD' | 'KHR'>('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<OrderInvoice | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [userBalance, setUserBalance] = useState(0.00);

  const exchangeRate = 4100;

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'USD' ? 'KHR' : 'USD'));
  };

  const formatPrice = (priceUSD: number): string => {
    if (currency === 'KHR') {
      const khr = Math.round(priceUSD * exchangeRate);
      return `${khr.toLocaleString()} ៛`;
    }
    return `$${priceUSD.toFixed(2)}`;
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_GAMES.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.genre.toLowerCase().includes(q) ||
        g.currencyName.toLowerCase().includes(q) ||
        g.developer.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const openCheckout = (game: GameItem) => {
    setSelectedGame(game);
    setIsCheckoutOpen(true);
  };

  return (
    <TopUpContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        formatPrice,
        exchangeRate,
        searchQuery,
        setSearchQuery,
        searchResults,
        selectedGame,
        setSelectedGame,
        isCheckoutOpen,
        setIsCheckoutOpen,
        openCheckout,
        currentInvoice,
        setCurrentInvoice,
        isInvoiceOpen,
        setIsInvoiceOpen,
        isSupportOpen,
        setIsSupportOpen,
        userBalance,
        setUserBalance,
      }}
    >
      {children}
    </TopUpContext.Provider>
  );
}

export function useTopUp() {
  const context = useContext(TopUpContext);
  if (!context) {
    throw new Error('useTopUp must be used within a TopUpProvider');
  }
  return context;
}
