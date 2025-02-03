'use client';

import Link from 'next/link';
import { FiCheck } from 'react-icons/fi';
import Navigation from '@/app/components/Navigation';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <div className="mb-8">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <FiCheck className="w-6 h-6 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
        <p className="text-gray-600 mb-8">
          We&apos;ve received your order and will send you an email confirmation shortly.
        </p>
        
        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
} 