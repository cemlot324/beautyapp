'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Try to fetch a small resource to test connection
      const response = await fetch('/api/health-check');
      if (response.ok) {
        window.location.reload();
      } else {
        throw new Error('Still offline');
      }
    } catch (error) {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    // Listen for online status changes
    const handleOnline = () => window.location.reload();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Image
            src="/logo2.png"
            alt="Bloom"
            width={120}
            height={40}
            className="mx-auto"
          />
        </div>
        <h1 className="text-2xl font-bold mb-4">You're Offline</h1>
        <p className="text-gray-600 mb-6">
          Please check your internet connection and try again.
        </p>
        <button 
          onClick={handleRetry}
          disabled={isRetrying}
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 
                   disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isRetrying ? 'Checking Connection...' : 'Try Again'}
        </button>
      </div>
    </div>
  );
} 