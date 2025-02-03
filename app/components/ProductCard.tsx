'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBasket } from '../context/BasketContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    filters: string[];
    isFeatured: boolean;
    stock: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const { addToBasket } = useBasket();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAddingToBasket, setIsAddingToBasket] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const isWishlisted = isInWishlist(product._id);

  const handleAddToBasket = async () => {
    try {
      setIsAddingToBasket(true);
      
      // Check if user is logged in
      const authResponse = await fetch('/api/auth/check');
      if (!authResponse.ok) {
        router.push('/auth/login');
        return;
      }

      await addToBasket({
        productId: product._id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      });

      // Show success feedback (you could add a toast notification here)
    } catch (error) {
      console.error('Error adding to basket:', error);
    } finally {
      setIsAddingToBasket(false);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      setIsAddingToWishlist(true);
      
      // Check if user is logged in
      const authResponse = await fetch('/api/auth/check');
      if (!authResponse.ok) {
        router.push('/auth/login');
        return;
      }

      if (isWishlisted) {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-square">
        <button
          className={`absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors ${
            isWishlisted ? 'bg-pink-50' : ''
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={handleAddToWishlist}
          disabled={isAddingToWishlist}
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isWishlisted 
                ? 'text-pink-500 fill-pink-500' 
                : 'text-pink-500 hover:text-pink-600'
            }`} 
          />
        </button>
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 truncate">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          £{product.price.toFixed(2)}
        </p>
        <button 
          className={`mt-4 w-full py-2 px-4 rounded-md transition-colors ${
            product.stock > 0 
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          disabled={product.stock === 0 || isAddingToBasket}
          onClick={handleAddToBasket}
        >
          {isAddingToBasket ? 'Adding...' : product.stock > 0 ? 'Add to Basket' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 