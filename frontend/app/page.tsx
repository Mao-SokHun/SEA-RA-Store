'use client';

import React from 'react';
import HeroExpress from '@/components/HeroExpress';
import LiveTransactions from '@/components/LiveTransactions';
import GameCatalog from '@/components/GameCatalog';
import PromotionCards from '@/components/PromotionCards';
import TrustGuarantees from '@/components/TrustGuarantees';

export default function HomePage() {
  return (
    <div className="relative">
      {/* 1. Hero Showcase & Express 30s Top-Up Cockpit */}
      <HeroExpress />

      {/* 2. Live Verified Recharges Ticker */}
      <LiveTransactions />

      {/* 3. Official Game Catalog with Category Filters */}
      <GameCatalog />

      {/* 4. Luxury Special Offers & Pass Discounts */}
      <PromotionCards />

      {/* 5. Four Pillars of Trust & Security */}
      <TrustGuarantees />
    </div>
  );
}
