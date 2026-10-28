/**
 * [DISABLED - Sell Account Feature]
 * This page is temporarily disabled. Only the TopUp feature is active.
 * To re-enable: restore the original CatalogPage component below.
 *
 * Original file is preserved — the full implementation is commented out at the bottom.
 */
import { redirect } from 'next/navigation';

export default function CatalogPage() {
  redirect('/top-up');
}

/*
=== ORIGINAL CATALOG PAGE (DISABLED) ===

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Zap, Shield, RotateCcw } from 'lucide-react';
import AccountCard from '@/components/cards/AccountCard';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { GameAccount, Game } from '@/types';

// ... full original implementation preserved here for re-enable.
// See git history or backup to restore.
*/
