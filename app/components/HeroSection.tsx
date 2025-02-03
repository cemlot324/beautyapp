'use client'
import { useState, useEffect } from "react";
import Image from "next/image";

const slideshowImages = [
  '/Image1.png',
  '/Image2.png',
  '/Image3.png'
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full h-[calc(100vh-116px)] relative">
      <div className="flex h-full">
        {/* Left container - single static image */}
        <div className="w-1/2 relative">
          <Image
            src="/Image4.png"
            alt="Promotion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <button className="px-8 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors duration-300 text-black font-medium rounded-full">
              Find Out More
            </button>
          </div>
        </div>

        {/* Right container - animated slideshow */}
        <div className="w-1/2 relative overflow-hidden">
          {slideshowImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
                ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <Image
                src={img}
                alt={`Slideshow ${index + 1}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          ))}
          
          {/* Navigation dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {slideshowImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300
                  ${index === currentSlide 
                    ? 'bg-white w-4' 
                    : 'bg-white/50 hover:bg-white/75'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 