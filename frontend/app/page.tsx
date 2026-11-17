'use client';

import React from 'react';
import HeroExpress from '@/components/HeroExpress';
import TrendingGames from '@/components/TrendingGames';
import GameCatalog from '@/components/GameCatalog';

export default function HomePage() {
  return (
    <div className="relative">
      {/* 1. Hero Centered Futuristic Showcase */}
      <HeroExpress />

      {/* 2. Trending Games Section (Compact Top Reload Games) */}
      <TrendingGames />

      {/* 3. Official Game Catalog with Category Filters */}
      <GameCatalog />
    </div>
  );
}
