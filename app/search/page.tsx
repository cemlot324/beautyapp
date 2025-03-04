'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

interface Product {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white h-48 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Search Results for "{query}"
          </h1>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <h2 className="text-xl font-medium mb-4">No products found</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try searching with different keywords or browse our categories
              </p>
              <Link
                href="/"
                className="inline-block bg-black text-white px-8 py-3 rounded-full 
                         hover:bg-gray-800 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} 
                     className="group bg-white rounded-xl shadow-md hover:shadow-xl 
                              transition-shadow duration-300">
                  <div className="relative aspect-square">
                    <Link href={`/products/${product._id}`}>
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover rounded-t-xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </Link>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Link href={`/products/${product._id}`}>
                          <h3 className="font-medium text-gray-900 group-hover:text-gray-600 
                                     transition-colors line-clamp-1 mb-1">
                            {product.title}
                          </h3>
                          <p className="text-gray-900 font-semibold">
                            £{product.price.toFixed(2)}
                          </p>
                        </Link>
                      </div>
                      <button
                        className="flex-shrink-0 border-2 border-black text-black px-4 py-2 
                                 rounded-full hover:bg-black hover:text-white transition-all 
                                 text-sm font-medium whitespace-nowrap"
                      >
                        Add to Basket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchResults() {
  return (
    <Suspense 
      fallback={
        <>
          <Navigation />
          <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
              <div className="animate-pulse space-y-6">
                <div className="h-10 bg-gray-200 rounded-lg w-3/4 mx-auto" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md p-4 space-y-4">
                      <div className="aspect-square bg-gray-200 rounded-lg" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
} 