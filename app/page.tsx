import DeliveryBanner from './components/DeliveryBanner';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import GalleryWall from './components/GalleryWall';

export default function Home() {
  return (
    <main className="min-h-screen">
      <DeliveryBanner />
      <Navigation />
      <HeroSection />
      <ProductGrid />
      <GalleryWall />
      <Newsletter />
      <Footer />
    </main>
  );
}
