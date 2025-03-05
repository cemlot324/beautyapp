'use client'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMenu, FiX, FiShoppingBag, FiHeart, FiUser } from 'react-icons/fi';
import { useBasket } from '../context/BasketContext';
import { useWishlist } from '../context/WishlistContext';
import SearchBar from './SearchBar';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { items: basketItems, addToBasket, showPreview, setShowPreview } = useBasket();
  const { items: wishlistItems } = useWishlist();
  const previewRef = useRef<HTMLDivElement>(null);
  const [showWishlistPreview, setShowWishlistPreview] = useState(false);
  const wishlistPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (previewRef.current && !previewRef.current.contains(event.target as Node)) {
        setShowPreview(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowPreview]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wishlistPreviewRef.current && !wishlistPreviewRef.current.contains(event.target as Node)) {
        setShowWishlistPreview(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalItems = basketItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
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

          {/* Search Bar */}
          <div className="flex-1 mx-6 hidden md:block">
            <SearchBar />
          </div>

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

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={wishlistPreviewRef}>
              <button
                className="p-2 relative"
                onMouseEnter={() => setShowWishlistPreview(true)}
              >
                <FiHeart className="h-6 w-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs 
                                 rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {showWishlistPreview && wishlistItems.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border 
                               border-gray-100 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Wishlist ({wishlistItems.length} items)
                    </h3>
                    <div className="space-y-3">
                      {wishlistItems.slice(0, 3).map((item) => (
                        <div key={item.productId} className="flex gap-3">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              £{item.price.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              addToBasket({
                                productId: item.productId,
                                title: item.title,
                                price: item.price,
                                imageUrl: item.imageUrl,
                                quantity: 1
                              });
                              setShowWishlistPreview(false);
                            }}
                            className="text-xs px-2 py-1 border border-black text-black 
                                     rounded-full hover:bg-black hover:text-white transition-all 
                                     whitespace-nowrap"
                          >
                            Add to Basket
                          </button>
                        </div>
                      ))}
                      {wishlistItems.length > 3 && (
                        <p className="text-sm text-gray-500 text-center">
                          and {wishlistItems.length - 3} more items...
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Link
                        href="/dashboard?section=wishlist"
                        className="block w-full bg-black text-white text-center px-4 py-2 
                                 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium"
                        onClick={() => setShowWishlistPreview(false)}
                      >
                        View Wishlist
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={previewRef}>
              <button
                className="relative p-2"
                onMouseEnter={() => setShowPreview(true)}
              >
                <FiShoppingBag className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 
                                 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Basket Preview Dropdown */}
              {showPreview && basketItems.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border 
                               border-gray-100 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Shopping Basket ({totalItems} items)
                    </h3>
                    <div className="space-y-3">
                      {basketItems.slice(0, 3).map((item) => (
                        <div key={item.productId} className="flex gap-3">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity} × £{item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {basketItems.length > 3 && (
                        <p className="text-sm text-gray-500 text-center">
                          and {basketItems.length - 3} more items...
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Total</span>
                        <span>
                          £{basketItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                        </span>
                      </div>
                      <Link
                        href="/basket"
                        className="mt-4 block w-full bg-black text-white text-center px-4 py-2 
                                 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium"
                        onClick={() => setShowPreview(false)}
                      >
                        View Basket
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link href="/dashboard" className="p-2">
              <FiUser className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 py-3">
              <SearchBar />
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard?section=wishlist"
                className="block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Wishlist ({wishlistItems.length})
              </Link>
              <Link
                href="/basket"
                className="block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Basket ({basketItems.length})
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