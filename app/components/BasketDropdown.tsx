'use client';

import { useBasket } from '../context/BasketContext';
import Image from 'next/image';
import Link from 'next/link';

export default function BasketDropdown() {
  const { items } = useBasket();
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Your basket is empty</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-80">
      <div className="space-y-4">
        {items.slice(0, 3).map((item) => (
          <div key={item.productId} className="flex gap-3">
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
                {item.quantity} × £{item.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
        
        {items.length > 3 && (
          <p className="text-sm text-gray-500 text-center">
            And {items.length - 3} more items...
          </p>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between text-sm font-medium">
            <span>Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
        </div>

        <Link
          href="/basket"
          className="block w-full bg-black text-white text-center py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          View Basket
        </Link>
      </div>
    </div>
  );
} 