'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Add your newsletter signup logic here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStatus('success');
    setEmail('');
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
              disabled={status === 'loading'}
              className="px-6 py-3 bg-white text-black rounded-full font-medium
                       hover:bg-gray-100 transition-colors disabled:opacity-50
                       w-full md:w-auto"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {/* Success Message */}
          {status === 'success' && (
            <p className="text-green-400 mt-2 text-center md:text-left">
              Thanks for subscribing!
            </p>
          )}
        </div>
      </div>
    </section>
  );
} 