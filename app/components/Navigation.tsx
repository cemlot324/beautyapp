'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMenu, FiX, FiShoppingBag, FiHeart, FiUser } from 'react-icons/fi';
import { useBasket } from '../context/BasketContext';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { items } = useBasket();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="relative w-[80px] md:w-[120px] h-[40px] md:h-[60px]">
            <Image
              src={isMobile ? '/logo2.png' : '/logo2.png'}
              alt="Bloom"
              fill
              className="object-contain"
              priority
            />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="hover:text-gray-600">
              Shop
            </Link>
            <Link href="/about" className="hover:text-gray-600">
              About
            </Link>
            <Link href="/contact" className="hover:text-gray-600">
              Contact
            </Link>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/wishlist" className="p-2">
              <FiHeart className="h-6 w-6" />
            </Link>
            <Link href="/basket" className="p-2 relative">
              <FiShoppingBag className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            <Link href="/dashboard" className="p-2">
              <FiUser className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/products"
                className="block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="border-t border-gray-200 my-2"></div>
              <Link
                href="/wishlist"
                className="block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Wishlist
              </Link>
              <Link
                href="/basket"
                className="block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Basket ({items.length})
              </Link>
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 