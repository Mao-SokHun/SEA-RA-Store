'use client';

import React from 'react';
import Hero from '@/components/home/Hero';
import CategoryTabs from '@/components/home/CategoryTabs';
import FeaturedGames from '@/components/home/FeaturedGames';
import TrendingRow from '@/components/home/TrendingRow';
import LiveOrdersAndTopBuyers from '@/components/home/LiveOrdersAndTopBuyers';
import PromotionsAndDeals from '@/components/home/PromotionsAndDeals';
import WhyChooseUs from '@/components/home/WhyChooseUs';

export default function HomePage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* 2. Hero Carousel (Full-width panoramic battle banner) */}
      <Hero />

      {/* 3. Top-Up Categories (The 6 required category filter chips) */}
      <CategoryTabs />

      {/* 4. Featured Games (4 Cards with ratings & cyan button) */}
      <FeaturedGames />

      {/* 5. Trending Now (Horizontal scroll row with orders today count) */}
      <TrendingRow />

      {/* 6. Live Orders & Top Buyers (Replaces Community Hub) */}
      <LiveOrdersAndTopBuyers />

      {/* 7 & 8. Promotions & News + Game Store Deals / Best Sellers */}
      <PromotionsAndDeals />

      {/* 9. Why Choose Us (Instant delivery, 24/7 support, secure payment, best price) */}
      <WhyChooseUs />
    </div>
  );
}

