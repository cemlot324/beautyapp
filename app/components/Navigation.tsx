'use client'
import { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { FiUser, FiShoppingBag, FiHeart, FiSearch } from "react-icons/fi";
import { useBasket } from '../context/BasketContext';
import { useRouter } from 'next/navigation';
import BasketDropdown from './BasketDropdown';
import { useWishlist } from '../context/WishlistContext';
import WishlistDropdown from './WishlistDropdown';

export default function Navigation() {
  const router = useRouter();
  const { items } = useBasket();
  const { items: wishlistItems } = useWishlist();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const basketRef = useRef<HTMLDivElement>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const wishlistRef = useRef<HTMLDivElement>(null);

  // Calculate total items in basket
  const basketItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    // Check if user is logged in by verifying the auth token
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        setIsLoggedIn(response.ok);
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  // Close basket dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (basketRef.current && !basketRef.current.contains(event.target as Node)) {
        setIsBasketOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close wishlist dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wishlistRef.current && !wishlistRef.current.contains(event.target as Node)) {
        setIsWishlistOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBasketClick = () => {
    router.push('/basket');
  };

  const handleWishlistClick = () => {
    router.push('/dashboard?section=wishlist');
  };

  return (
    <nav className="border-b py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <Image src="/logo2.png" alt="Bloom" width={120} height={40} />
        </Link>
        
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 px-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-black"
            />
            <FiSearch className="absolute right-4 top-3 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative" ref={wishlistRef}>
            <button
              onMouseEnter={() => setIsWishlistOpen(true)}
              onClick={handleWishlistClick}
              className="relative"
              aria-label="Wishlist"
            >
              <FiHeart className="w-6 h-6 cursor-pointer" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Wishlist Dropdown */}
            {isWishlistOpen && (
              <div 
                className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg z-50"
                onMouseLeave={() => setIsWishlistOpen(false)}
              >
                <WishlistDropdown />
              </div>
            )}
          </div>
          <div className="relative" ref={basketRef}>
            <button
              onMouseEnter={() => setIsBasketOpen(true)}
              onClick={handleBasketClick}
              className="relative"
              aria-label="Shopping basket"
            >
              <FiShoppingBag className="w-6 h-6 cursor-pointer" />
              {basketItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {basketItemCount}
                </span>
              )}
            </button>

            {/* Basket Dropdown */}
            {isBasketOpen && (
              <div 
                className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg z-50"
                onMouseLeave={() => setIsBasketOpen(false)}
              >
                <BasketDropdown />
              </div>
            )}
          </div>
          <Link href={isLoggedIn ? '/dashboard' : '/auth/login'}>
            <FiUser className="w-6 h-6 cursor-pointer" />
          </Link>
        </div>
      </div>
    </nav>
  );
} 