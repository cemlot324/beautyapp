'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const HERO_IMAGES = [
  '/Image4.png',
  '/Image1.png',
  '/Image2.png',
  '/Image3.png'
];

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isMobile) {
    return (
      <section className="relative">
        <div className="h-[calc(100vh-64px)]">
          {/* Image Carousel */}
          {HERO_IMAGES.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/30">
            <h1 className="text-3xl font-bold mb-4 text-white">
              Natural Beauty,
              <br />
              Naturally You
            </h1>
            <p className="text-white/90 text-sm mb-8 max-w-md">
              Discover our range of vegan and cruelty-free skincare products
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <a
                href="/products"
                className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </a>
              <a
                href="/about"
                className="px-8 py-3 border border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                Learn More
              </a>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-8 flex gap-2">
              {HERO_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Return original desktop version
  return (
    <section className="relative bg-black text-white">
      <div className="max-w-7xl mx-auto">
        {/* Logo - Different versions for mobile/desktop */}
        <div className="absolute top-4 left-4 z-10">
          <Image
            src={isMobile ? '/logo2.png' : '/logo.png'}
            alt="Bloom Logo"
            width={isMobile ? 80 : 120}
            height={isMobile ? 40 : 60}
            className="object-contain"
          />
        </div>

        {/* Main content with mobile-first layout */}
        <div className="flex flex-col md:flex-row items-center">
          {/* Text Content - Full width on mobile */}
          <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16 order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Natural Beauty,
              <br />
              Naturally You
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-8 max-w-md">
              Discover our range of vegan and cruelty-free skincare products, 
              made with natural ingredients for radiant, healthy skin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/products"
                className="px-8 py-3 bg-white text-black rounded-full font-medium
                         hover:bg-gray-100 transition-colors text-center"
              >
                Shop Now
              </a>
              <a
                href="/about"
                className="px-8 py-3 border border-white rounded-full font-medium
                         hover:bg-white/10 transition-colors text-center"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Image Section - Full width on mobile */}
          <div className="w-full md:w-1/2 h-[400px] md:h-[600px] relative order-1 md:order-2">
            <div className="absolute inset-0 bg-[url('/hero-image.jpg')] 
                          bg-cover bg-center bg-no-repeat">
              {/* Darker overlay for mobile */}
              <div className={`absolute inset-0 ${
                isMobile ? 'bg-black/40' : 'bg-black/20'
              }`}></div>
            </div>
          </div>
        </div>

        {/* Features Bar - Adjusted for better mobile display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-6 bg-white/5 backdrop-blur-sm">
          {[
            { text: "Vegan", icon: "🌱" },
            { text: "Cruelty Free", icon: "🐰" },
            { text: "Natural", icon: "🌿" },
            { text: "Eco-Friendly", icon: "♻️" },
          ].map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col md:flex-row items-center justify-center text-center p-2 gap-2"
            >
              <span className="text-2xl md:text-xl md:mr-2">{feature.icon}</span>
              <span className="text-xs md:text-base">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 