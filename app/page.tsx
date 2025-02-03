import DeliveryBanner from './components/DeliveryBanner';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <DeliveryBanner />
      <Navigation />
      <HeroSection />
      <ProductGrid />
      <Newsletter />
      <Footer />
    </main>
  );
}
