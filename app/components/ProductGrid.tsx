'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  filters: string[];
  isFeatured: boolean;
  stock: number;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [availableFilters, setAvailableFilters] = useState<string[]>(['all']);
  const productsPerPage = 9;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        
        const response = await fetch('/api/products');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Product[] = await response.json();
        console.log('Products received:', data?.length || 0);
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }

        setProducts(data);

        // Create a set of unique filters
        const filterSet = new Set<string>(['all']);
        data.forEach(product => {
          if (Array.isArray(product.filters)) {
            product.filters.forEach((filter: string) => filterSet.add(filter));
          }
        });
        
        const filterArray = Array.from(filterSet);
        console.log('Available filters:', filterArray);
        setAvailableFilters(filterArray);

      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  const sortProducts = (productsToSort: Product[]) => {
    const sorted = [...productsToSort];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  };

  // First filter, then sort
  const processedProducts = sortProducts(
    selectedFilter === 'all'
      ? products
      : products.filter(product => product.filters.includes(selectedFilter))
  );

  // Then paginate
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Products</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Mobile Header and Filter Button */}
          <div className="md:hidden p-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Products</h1>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full px-4 py-2 bg-black text-white rounded-md flex items-center justify-center"
            >
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Sidebar - Filters */}
          <div className={`
            w-full md:w-64 md:flex-shrink-0 p-4 md:p-6
            ${isFilterOpen ? 'block' : 'hidden md:block'}
            bg-white md:bg-transparent
            fixed md:relative
            top-0 left-0 right-0
            h-screen md:h-auto
            z-50 md:z-0
            overflow-y-auto
          `}>
            {/* Close button for mobile */}
            <div className="md:hidden flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {availableFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setSelectedFilter(filter);
                    setIsFilterOpen(false); // Close filter on mobile after selection
                  }}
                  className={`w-full px-4 py-2 text-left rounded-md transition-colors ${
                    selectedFilter === filter
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-4 md:p-8">
            {/* Header section with filters and sort */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Active Filter:</span>
                <span className="px-3 py-1 bg-black text-white rounded-full text-sm">
                  {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
                </span>
              </div>

              {/* Redesigned sort dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm 
                                 hover:border-black transition-colors flex items-center gap-2 min-w-[200px]">
                  <span className="flex-1 text-left">
                    {sortBy === 'featured' && 'Featured'}
                    {sortBy === 'price-low' && 'Price: Low to High'}
                    {sortBy === 'price-high' && 'Price: High to Low'}
                    {sortBy === 'name-asc' && 'Name: A to Z'}
                    {sortBy === 'name-desc' && 'Name: Z to A'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="absolute right-0 mt-2 py-2 w-full bg-white border border-gray-100 
                              rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 
                              group-hover:visible transition-all z-50">
                  {[
                    { value: 'featured', label: 'Featured' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'name-asc', label: 'Name: A to Z' },
                    { value: 'name-desc', label: 'Name: Z to A' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 
                                ${sortBy === option.value ? 'text-black font-medium' : 'text-gray-600'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {paginatedProducts.map((product) => (
                <div key={product._id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
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
                    <button
                      onClick={() => {
                        const isInWishlist = wishlistItems.some(item => item.productId === product._id);
                        if (isInWishlist) {
                          removeFromWishlist(product._id);
                        } else {
                          addToWishlist({
                            productId: product._id,
                            title: product.title,
                            price: product.price,
                            imageUrl: product.imageUrl
                          });
                        }
                      }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-sm
                                 hover:bg-gray-50 transition-colors"
                    >
                      <FiHeart
                        className={`w-5 h-5 ${
                          wishlistItems.some(item => item.productId === product._id)
                            ? 'fill-black stroke-black'
                            : 'stroke-gray-600'
                        }`}
                      />
                    </button>
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
                        onClick={() => {
                          // Add to basket logic here
                        }}
                        className="flex-shrink-0 border-2 border-black text-black px-4 py-2 rounded-full 
                                 hover:bg-black hover:text-white transition-all text-sm font-medium whitespace-nowrap"
                      >
                        Add to Basket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Responsive pagination */}
            {processedProducts.length > productsPerPage && (
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 md:px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Prev
                </button>
                
                {[...Array(Math.ceil(processedProducts.length / productsPerPage))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 md:px-4 py-2 rounded-md ${
                      currentPage === i + 1
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(processedProducts.length / productsPerPage)))}
                  disabled={currentPage === Math.ceil(processedProducts.length / productsPerPage)}
                  className={`px-3 md:px-4 py-2 rounded-md ${
                    currentPage === Math.ceil(processedProducts.length / productsPerPage)
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile filters */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
};