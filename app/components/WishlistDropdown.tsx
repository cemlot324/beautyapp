'use client';

import { useWishlist } from '../context/WishlistContext';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function WishlistDropdown() {
  const { items, removeFromWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-80">
      <div className="space-y-4">
        {items.slice(0, 3).map((item) => (
          <div key={item.productId} className="flex gap-3 group relative">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.title}
              </h4>
              <p className="text-sm text-gray-500">
                £{item.price.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => removeFromWishlist(item.productId)}
              className="opacity-0 group-hover:opacity-100 absolute -right-2 -top-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-opacity"
              aria-label="Remove from wishlist"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ))}
        
        {items.length > 3 && (
          <p className="text-sm text-gray-500 text-center">
            And {items.length - 3} more items...
          </p>
        )}

        <Link
          href="/dashboard?section=wishlist"
          className="block w-full bg-black text-white text-center py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          View Wishlist
        </Link>
      </div>
    </div>
  );
} 