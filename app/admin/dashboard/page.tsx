'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiUsers, FiPackage, FiBox, FiLogOut } from 'react-icons/fi';
import ProductManagement from '@/app/components/admin/ProductManagement';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

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

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        let endpoint = '';
        switch (activeSection) {
          case 'users':
            endpoint = '/api/admin/users';
            break;
          case 'orders':
            endpoint = '/api/admin/orders';
            break;
        }

        if (!endpoint) return;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${activeSection}`);
        }

        const data = await response.json();

        switch (activeSection) {
          case 'users':
            setUsers(data);
            break;
          case 'orders':
            setOrders(data);
            break;
        }
      } catch (err) {
        console.error(`Error fetching ${activeSection}:`, err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (!['products'].includes(activeSection)) {
      fetchData();
    }
  }, [activeSection]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        // Refresh orders after update
        const updatedOrders = orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const renderContent = () => {
    if (loading && activeSection !== 'products') {
      return (
        <div className="p-6 text-center">
          <p>Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    switch (activeSection) {
      case 'users':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-6">Name</th>
                  <th className="text-left py-4 px-6">Email</th>
                  <th className="text-left py-4 px-6">Role</th>
                  <th className="text-left py-4 px-6">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">{user.name}</td>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">{user.role}</td>
                      <td className="py-4 px-6">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Orders</h2>
              <div className="flex gap-2">
                {/* Add any filters or actions here */}
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            #{order._id.slice(-6)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">
                                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                              </p>
                              <p className="text-gray-500">{order.shippingAddress?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            className="text-sm rounded-full px-3 py-1 font-medium"
                            style={{
                              backgroundColor: {
                                pending: '#FEF3C7',
                                processing: '#DBEAFE',
                                shipped: '#D1FAE5',
                                delivered: '#E0E7FF',
                              }[order.status],
                              color: {
                                pending: '#92400E',
                                processing: '#1E40AF',
                                shipped: '#065F46',
                                delivered: '#3730A3',
                              }[order.status],
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            £{order.total.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => {/* Add view details logic */}}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'products':
        return <ProductManagement />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/logo2.png"
                alt="Bloom"
                width={100}
                height={32}
              />
              <span className="ml-4 text-sm font-medium text-gray-500">Admin Dashboard</span>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <FiLogOut className="w-5 h-5 mr-2" />
              Exit
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation */}
        <div className="flex space-x-4 mb-8">
          {[
            { id: 'users', label: 'Users', icon: FiUsers },
            { id: 'orders', label: 'Orders', icon: FiPackage },
            { id: 'products', label: 'Products', icon: FiBox },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center px-6 py-3 rounded-xl transition-colors ${
                activeSection === item.id
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 