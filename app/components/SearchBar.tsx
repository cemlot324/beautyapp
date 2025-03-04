'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim()) {
        try {
          const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
          if (response.ok) {
            const data = await response.json();
            setResults(data);
            setShowResults(true);
          }
        } catch (error) {
          console.error('Error searching products:', error);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </form>

      {/* Dropdown Results */}
      {showResults && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-96 overflow-y-auto">
          {results.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              onClick={() => setShowResults(false)}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {product.title}
                </h3>
                <p className="text-sm font-semibold text-gray-900">
                  £{product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
          <div className="p-4 border-t">
            <button
              onClick={() => {
                router.push(`/search?q=${encodeURIComponent(query)}`);
                setShowResults(false);
              }}
              className="w-full text-center text-sm text-gray-600 hover:text-black"
            >
              View all results
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 