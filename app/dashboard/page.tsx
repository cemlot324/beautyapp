'use client'
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '../components/Navigation';
import { FiPackage, FiHeart, FiUser, FiLogOut } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';

interface Order {
  _id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    postcode: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    title: string;
  }>;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'products';
  const [activeTab, setActiveTab] = useState(searchParams.get('section') || 'orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { items, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      
      if (response.ok) {
        router.push('/auth/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { id: 'orders', label: 'My Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'profile', label: 'Profile', icon: FiUser },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <FiPackage className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No orders yet</p>
                <Link href="/" className="text-black hover:underline mt-2 inline-block">
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-medium">Order #{order._id.slice(-6)}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        {
                          pending: 'bg-yellow-100 text-yellow-800',
                          processing: 'bg-blue-100 text-blue-800',
                          shipped: 'bg-green-100 text-green-800',
                          delivered: 'bg-purple-100 text-purple-800',
                        }[order.status]
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} × £{item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium">
                          £{(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>£{order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span>Shipping</span>
                      <span>{order.total >= 50 ? 'Free' : '£4.99'}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg mt-2 pt-2 border-t">
                      <span>Total</span>
                      <span>£{order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="text-sm text-gray-600">
                      <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'wishlist':
        return (
          <div className="space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <FiHeart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Add items you love to your wishlist. Review them anytime and easily move them to the basket.
                </p>
                <Link
                  href="/"
                  className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <Link href={`/products/${item.productId}`} className="block relative aspect-square">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                      />
                    </Link>
                    
                    <div className="p-4">
                      <Link 
                        href={`/products/${item.productId}`}
                        className="block text-lg font-medium text-gray-900 hover:text-gray-700 mb-2 line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <p className="text-lg font-semibold text-gray-900 mb-4">
                        £{item.price.toFixed(2)}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => removeFromWishlist(item.productId)}
                          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => {
                            /* Add your basket logic here */
                          }}
                          className="flex-1 px-4 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
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
        );

      case 'profile':
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <p className="text-gray-900">{userData?.firstName || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <p className="text-gray-900">{userData?.lastName || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900">{userData?.email || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900">{userData?.phone || '-'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <p className="text-gray-900">{userData?.address || '-'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <p className="text-gray-900">{userData?.city || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postcode
                    </label>
                    <p className="text-gray-900">{userData?.postcode || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => router.push('/dashboard/edit-profile')}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
          <div className="animate-pulse">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        {/* User Profile Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <FiUser className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}
              </h2>
              <p className="text-gray-500">{userData?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors
                    ${activeTab === item.id 
                      ? 'bg-black text-white' 
                      : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-6">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h1>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
} 