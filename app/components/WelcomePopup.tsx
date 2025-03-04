'use client';

import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import Image from 'next/image';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Short delay before showing popup
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden max-w-md mx-4 relative animate-fade-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <FiX className="w-5 h-5" />
        </button>
        
        <div className="relative w-full h-48">
          <Image
            src="/Image4.png"
            alt="Welcome to Bloom"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Welcome to Bloom!</h2>
          <p className="text-gray-600 mb-6">
            Discover our range of vegan and cruelty-free skincare products. 
            Get 10% off your first order when you sign up!
          </p>
          
          <button
            onClick={handleClose}
            className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
} 