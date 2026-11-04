'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import LiveTicker from '@/components/LiveTicker';
import HeroBanner from '@/components/HeroBanner';
import FeaturedGames from '@/components/FeaturedGames';
import TrendingNow from '@/components/TrendingNow';
import CommunityHub from '@/components/CommunityHub';
import NewsAndStore from '@/components/NewsAndStore';
import WhyChooseUs from '@/components/WhyChooseUs';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#030712] text-white overflow-x-hidden flex flex-col justify-between">
      
      {/* ── Ambient Outer Gutter Cyber Particle Glows (Matches cyan & orange glowing square pixels in mockup) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left Side Floating Glowing Pixels */}
        <div className="absolute top-[30%] left-4 xl:left-12 w-2.5 h-2.5 bg-[#00A3FF] opacity-70 blur-[1px] shadow-[0_0_12px_#00A3FF]" />
        <div className="absolute top-[40%] left-8 xl:left-20 w-1.5 h-1.5 bg-[#00FFCC] opacity-60 shadow-[0_0_8px_#00FFCC]" />
        <div className="absolute top-[55%] left-3 xl:left-10 w-2 h-2 bg-[#00A3FF] opacity-40" />
        <div className="absolute top-[68%] left-6 xl:left-16 w-3 h-3 bg-[#00A3FF] opacity-50 blur-[2px] shadow-[0_0_15px_#00A3FF]" />
        <div className="absolute top-[80%] left-10 xl:left-24 w-1.5 h-1.5 bg-[#FF5500] opacity-70 shadow-[0_0_10px_#FF5500]" />

        {/* Right Side Floating Glowing Pixels */}
        <div className="absolute top-[28%] right-5 xl:right-14 w-2 h-2 bg-[#FF5500] opacity-80 shadow-[0_0_10px_#FF5500]" />
        <div className="absolute top-[42%] right-8 xl:right-20 w-1.5 h-1.5 bg-[#00A3FF] opacity-60" />
        <div className="absolute top-[58%] right-4 xl:right-10 w-3 h-3 bg-[#00A3FF] opacity-60 blur-[1.5px] shadow-[0_0_15px_#00A3FF]" />
        <div className="absolute top-[72%] right-7 xl:right-16 w-2 h-2 bg-[#FFB800] opacity-70 shadow-[0_0_8px_#FFB800]" />
        <div className="absolute top-[85%] right-6 xl:right-22 w-2.5 h-2.5 bg-[#00A3FF] opacity-50 shadow-[0_0_12px_#00A3FF]" />
      </div>

      {/* ── Main Layout Components Exactly Matching Mockup ── */}
      <div className="relative z-10 flex-1">
        {/* Full-width sticky navbar */}
        <Navbar />

        {/* Real-time live top-up transaction ticker bar */}
        <LiveTicker />

        {/* Cinematic hero carousel banner */}
        <HeroBanner />

        {/* 4 Featured vertical games with category tabs */}
        <FeaturedGames />

        {/* 6 Trending now games matching mockup */}
        <TrendingNow />

        {/* 3 Column Community Hub (Forum, Live Streams, Leaderboard) */}
        <CommunityHub />

        {/* Latest news (60%) & Game Store deals (40%) */}
        <NewsAndStore />

        {/* Why Choose GameVerse trust guarantees (Instant delivery, 0% Bakong KHQR fee) */}
        <WhyChooseUs />
      </div>

      {/* Full matching footer */}
      <Footer />

    </div>
  );
}
