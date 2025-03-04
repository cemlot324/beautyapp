'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import { useBasket } from '@/app/context/BasketContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { Heart } from 'lucide-react';
import { FiArrowLeft } from 'react-icons/fi';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  filters: string[];
  stock: number;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToBasket } = useBasket();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAddingToBasket, setIsAddingToBasket] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="aspect-square w-full max-w-2xl mx-auto bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        </div>
      </div>
    );
  }

  const handleAddToBasket = async () => {
    try {
      setIsAddingToBasket(true);
      await addToBasket({
        productId: product._id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      });
    } catch (error) {
      console.error('Error adding to basket:', error);
    } finally {
      setIsAddingToBasket(false);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      setIsAddingToWishlist(true);
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist({
          productId: product._id,
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl,
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-xl font-semibold text-gray-900">
              £{product.price.toFixed(2)}
            </p>
            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-4">
              <button
                onClick={handleAddToBasket}
                disabled={isAddingToBasket || product.stock === 0}
                className={`w-full py-3 px-8 rounded-full font-medium
                  ${product.stock > 0 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                {isAddingToBasket 
                  ? 'Adding...' 
                  : product.stock > 0 
                    ? 'Add to Basket' 
                    : 'Out of Stock'}
              </button>

              <button
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
                className="w-full py-3 px-8 rounded-full font-medium border
                  border-black hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Heart 
                  className={isInWishlist(product._id) ? 'fill-black' : ''} 
                />
                {isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Additional Product Info */}
            <div className="border-t pt-6 mt-8">
              <h2 className="text-lg font-semibold mb-4">Product Details</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Categories:</span>{' '}
                  {product.filters.join(', ')}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Stock:</span>{' '}
                  {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 