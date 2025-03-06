'use client';

import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', updateWindowSize);
    updateWindowSize();

    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setShowConfetti(true);
      setShowThankYou(true);
      setEmail('');
      
      // Stop confetti after 2 seconds for a burst effect
      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
    }
  };

  return (
    <section className="bg-black text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Join Our Newsletter
            </h2>
            <p className="text-gray-300 text-sm md:text-base max-w-md">
              Subscribe to get special offers, free giveaways, and product launches.
            </p>
          </div>

          {/* Form */}
          <form 
            onSubmit={handleSubmit}
            className="w-full md:w-auto flex flex-col md:flex-row gap-3 max-w-md mx-auto md:mx-0"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-3 rounded-full bg-white/10 border border-white/20 
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-white/50 w-full md:w-80"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-black rounded-full font-medium
                       hover:bg-gray-100 transition-colors
                       w-full md:w-auto"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Confetti with burst configuration */}
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          recycle={false}
          gravity={0.3}
          initialVelocityX={15}
          initialVelocityY={30}
          tweenDuration={100}
          spread={360}
          colors={['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#98FB98', '#FF1493']}
          onConfettiComplete={() => {
            setShowConfetti(false);
          }}
        />
      )}

      {/* Centered Thank you popup with backdrop */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white text-black px-8 py-6 rounded-xl shadow-xl max-w-md w-full mx-4 animate-bounce-in">
            <h3 className="text-2xl font-bold text-center mb-2">
              🎉 Thank You!
            </h3>
            <p className="text-center text-gray-600">
              Thanks for subscribing to our newsletter. Get ready for exclusive offers and updates!
            </p>
            <button
              onClick={() => {
                setShowThankYou(false);
                setShowConfetti(false);
              }}
              className="mt-4 w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </section>
  );
} 