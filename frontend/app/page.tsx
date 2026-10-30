import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import FeaturedGames from '@/components/FeaturedGames';
import TrendingNow from '@/components/TrendingNow';
import CommunityHub from '@/components/CommunityHub';
import NewsAndStore from '@/components/NewsAndStore';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#030712] text-white overflow-x-hidden">
      
      {/* ── Outer Gutter Cyber Particle Glows (Matches cyan & orange glowing square pixels in mockup) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left Side Floating Glowing Squares */}
        <div className="absolute top-[32%] left-4 xl:left-12 w-2.5 h-2.5 bg-[#00A3FF] opacity-70 blur-[1px] shadow-[0_0_12px_#00A3FF]" />
        <div className="absolute top-[38%] left-8 xl:left-20 w-1.5 h-1.5 bg-[#00FFCC] opacity-60 shadow-[0_0_8px_#00FFCC]" />
        <div className="absolute top-[48%] left-3 xl:left-10 w-2 h-2 bg-[#00A3FF] opacity-40" />
        <div className="absolute top-[65%] left-6 xl:left-16 w-3 h-3 bg-[#00A3FF] opacity-50 blur-[2px] shadow-[0_0_15px_#00A3FF]" />
        <div className="absolute top-[75%] left-10 xl:left-24 w-1.5 h-1.5 bg-[#FF5500] opacity-70 shadow-[0_0_10px_#FF5500]" />

        {/* Right Side Floating Glowing Squares */}
        <div className="absolute top-[28%] right-5 xl:right-14 w-2 h-2 bg-[#FF5500] opacity-80 shadow-[0_0_10px_#FF5500]" />
        <div className="absolute top-[35%] right-8 xl:right-20 w-1.5 h-1.5 bg-[#00A3FF] opacity-60" />
        <div className="absolute top-[52%] right-4 xl:right-10 w-3 h-3 bg-[#00A3FF] opacity-60 blur-[1.5px] shadow-[0_0_15px_#00A3FF]" />
        <div className="absolute top-[68%] right-7 xl:right-16 w-2 h-2 bg-[#FFB800] opacity-70 shadow-[0_0_8px_#FFB800]" />
        <div className="absolute top-[82%] right-6 xl:right-22 w-2.5 h-2.5 bg-[#00A3FF] opacity-50 shadow-[0_0_12px_#00A3FF]" />
      </div>

      {/* ── Main Layout Components Exactly Matching Mockup ── */}
      <div className="relative z-10">
        <Navbar />
        <HeroBanner />
        <FeaturedGames />
        <TrendingNow />
        <CommunityHub />
        <NewsAndStore />
        <Footer />
      </div>

    </div>
  );
}
