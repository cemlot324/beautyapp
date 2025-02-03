'use client';

import { useBasket } from '../context/BasketContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import DeliveryBanner from '../components/DeliveryBanner';

export default function BasketPage() {
  const router = useRouter();
  const { items, removeFromBasket, updateQuantity } = useBasket();

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your basket is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to your basket to see them here.</p>
          <Link 
            href="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <DeliveryBanner />
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-8">Shopping Basket</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 border-b py-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-gray-600">£{item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <select
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                      className="border rounded-md px-2 py-1"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => removeFromBasket(item.productId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{subtotal >= 50 ? 'Free' : '£4.99'}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>£{(subtotal + (subtotal >= 50 ? 0 : 4.99)).toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-black text-white py-3 rounded-md mt-6 hover:bg-gray-800"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 