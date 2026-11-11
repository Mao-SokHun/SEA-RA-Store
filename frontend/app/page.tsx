'use client';

import React from 'react';
import HeroExpress from '@/components/HeroExpress';
import GameShowcase from '@/components/GameShowcase';
import TrendingGames from '@/components/TrendingGames';
import GameCatalog from '@/components/GameCatalog';

export default function HomePage() {
  return (
    <div className="relative">
      {/* 1. Hero Centered Futuristic Showcase */}
      <HeroExpress />

      {/* 2. Interactive Game Showcase Section (About Game & Direct Action) */}
      <GameShowcase />

      {/* 3. Trending Games Section (Top Reload Games) */}
      <TrendingGames />

      {/* 4. Official Game Catalog with 5 Cards Per Row */}
      <GameCatalog />
    </div>
  );
}
