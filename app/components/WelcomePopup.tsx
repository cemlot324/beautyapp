'use client';

import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup');
    if (hasSeenPopup) {
      setIsOpen(false);
    }
    setHasCheckedStorage(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcomePopup', 'true');
  };

  // Don't render anything until we've checked localStorage
  if (!hasCheckedStorage) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 relative animate-fade-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Welcome to Bloom!</h2>
        <p className="text-gray-600 mb-6">
          Discover our range of vegan and cruelty-free skincare products. 
          Get 10% off your first order when you sign up!
        </p>
        
        <button
          onClick={handleClose}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
} 