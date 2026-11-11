'use client';

import React from 'react';
import HeroExpress from '@/components/HeroExpress';
import GameCatalog from '@/components/GameCatalog';
import PromotionCards from '@/components/PromotionCards';

export default function HomePage() {
  return (
    <div className="relative">
      {/* 1. Hero Showcase & Express 30s Top-Up Cockpit */}
      <HeroExpress />

      {/* 2. Official Game Catalog with Category Filters */}
      <GameCatalog />

      {/* 3. Luxury Special Offers & Pass Discounts */}
      <PromotionCards />
    </div>
  );
}
