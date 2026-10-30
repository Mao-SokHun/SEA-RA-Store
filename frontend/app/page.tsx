import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import FeaturedGames from '@/components/FeaturedGames';
import TrendingNow from '@/components/TrendingNow';
import CommunityHub from '@/components/CommunityHub';
import NewsAndStore from '@/components/NewsAndStore';
import WhyChooseUs from '@/components/WhyChooseUs';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <HeroBanner />
      <FeaturedGames />
      <TrendingNow />
      <CommunityHub />
      <NewsAndStore />
      <WhyChooseUs />
      <Footer />
    </main>
  );
}
