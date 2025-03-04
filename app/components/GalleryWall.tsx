'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const galleryImages = [
  '/Beauty1.jpg',
  '/Beauty2.jpg',
  '/Beauty3.jpg',
  '/Beauty4.jpg',
  '/Beauty5.jpg',
  '/Beauty6.jpg',
  '/Beauty7.jpg',
  '/Beauty8.jpg',
];

export default function GalleryWall() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const firstRow = [...galleryImages, ...galleryImages];
  const secondRow = [...galleryImages.reverse(), ...galleryImages];

  return (
    <section className="py-8 md:py-16 bg-gradient-to-b from-white via-pink-50/30 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-3 md:mb-4">
          Welcome to the Beauty Verse
        </h2>
        <p className="text-gray-600 text-center text-base md:text-lg mb-3 md:mb-4 px-4">
          Check out the latest trending beauty content from our community
        </p>
        <p className="text-center">
          <span className="relative inline-block">
            <span className="absolute inset-0 transform translate-y-2 scale-110">
              <svg className="fill-pink-200 w-full" viewBox="0 0 200 40">
                <path d="M10,30 Q50,10 90,30 T170,30" stroke="none" />
              </svg>
            </span>
            <span className="relative text-pink-800 text-lg md:text-xl font-medium px-4">
              #bloomed
            </span>
          </span>
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* First Row */}
        <div className="flex animate-scroll-left gap-3 md:gap-6 mb-3 md:mb-6 whitespace-nowrap">
          {firstRow.map((src, index) => (
            <div
              key={`first-${index}`}
              className="inline-flex flex-shrink-0 w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 
                       relative rounded-xl overflow-hidden shadow-lg"
            >
              <Image
                src={src}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 192px, (max-width: 1200px) 288px, 320px"
                priority={index < 2}
              />
            </div>
          ))}
        </div>

        {/* Second Row */}
        <div className="flex animate-scroll-right gap-3 md:gap-6 whitespace-nowrap">
          {secondRow.map((src, index) => (
            <div
              key={`second-${index}`}
              className="inline-flex flex-shrink-0 w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 
                       relative rounded-xl overflow-hidden shadow-lg"
            >
              <Image
                src={src}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 192px, (max-width: 1200px) 288px, 320px"
                priority={index < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 