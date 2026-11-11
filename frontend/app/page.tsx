'use client';

import React from 'react';
import HeroExpress from '@/components/HeroExpress';
import GameCatalog from '@/components/GameCatalog';

export default function HomePage() {
  return (
    <div className="relative">
      {/* 1. Hero Showcase & Express 30s Top-Up Cockpit */}
      <HeroExpress />

      {/* 2. Official Game Catalog with Category Filters */}
      <GameCatalog />
    </div>
  );
}
