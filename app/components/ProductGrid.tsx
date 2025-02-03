'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

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

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableFilters, setAvailableFilters] = useState<string[]>(['all']);
  const productsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
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
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  const filteredProducts = selectedFilter === 'all'
    ? products
    : products.filter(product => product.filters.includes(selectedFilter));

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

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
        <div className="flex">
          {/* Fixed Left Sidebar */}
          <div className="w-64 flex-shrink-0 min-h-screen p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Products</h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
              <div className="flex flex-col space-y-2">
                {availableFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 text-left rounded-md transition-colors ${
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
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Loading products...</div>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">No products found</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === i + 1
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid; 