'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiPlus, FiX, FiUpload } from 'react-icons/fi';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  filters: string[];
  isNew: boolean;
  stock: number;
  ingredients?: string;
  volume?: string;
  howToUse?: string;
  benefits?: string;
  skinType?: string[];
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '0',
    filters: [] as string[],
  });
  const [newFilter, setNewFilter] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState('');
  const [volume, setVolume] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [benefits, setBenefits] = useState('');
  const [skinType, setSkinType] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload Error:', errorData);
        throw new Error(`Upload failed: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!image) {
        throw new Error('Please select an image');
      }

      const imageUrl = await handleImageUpload(image);
      
      if (!imageUrl) {
        throw new Error('Failed to get image URL');
      }

      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock || '0'),
        imageUrl,
        filters: formData.filters,
        isNew: true,
        ingredients,
        volume,
        howToUse,
        benefits,
        skinType,
      };

      console.log('Sending product data:', productData);

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      setShowAddForm(false);
      setFormData({
        title: '',
        description: '',
        price: '',
        stock: '0',
        filters: [],
      });
      setImage(null);
      fetchProducts();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addFilter = () => {
    if (newFilter.trim() && !formData.filters.includes(newFilter.trim())) {
      setFormData({
        ...formData,
        filters: [...formData.filters, newFilter.trim()],
      });
      setNewFilter('');
    }
  };

  const removeFilter = (filterToRemove: string) => {
    setFormData({
      ...formData,
      filters: formData.filters.filter(filter => filter !== filterToRemove),
    });
  };

  const skinTypeOptions = [
    'All Skin Types',
    'Normal',
    'Dry',
    'Oily',
    'Combination',
    'Sensitive'
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Products</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                  {image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600">Click to upload image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files && setImage(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            {/* Title & Description */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black"
                rows={4}
                required
              />
            </div>

            {/* Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filters
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.filters.map((filter) => (
                  <span
                    key={filter}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200"
                  >
                    {filter}
                    <button
                      type="button"
                      onClick={() => removeFilter(filter)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFilter}
                  onChange={(e) => setNewFilter(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black"
                  placeholder="Add a filter"
                />
                <button
                  type="button"
                  onClick={addFilter}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black"
                  required
                />
              </div>
            </div>

            {/* Volume */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Volume/Size
              </label>
              <input
                type="text"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="e.g., 30ml, 50g"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ingredients
              </label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="List the product ingredients"
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
              />
            </div>

            {/* How to Use */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                How to Use
              </label>
              <textarea
                value={howToUse}
                onChange={(e) => setHowToUse(e.target.value)}
                placeholder="Instructions for using the product"
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
              />
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Benefits
              </label>
              <textarea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="Key benefits and results"
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
              />
            </div>

            {/* Skin Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Suitable for Skin Types
              </label>
              <div className="mt-2 space-y-2">
                {skinTypeOptions.map((type) => (
                  <label key={type} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={skinType.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSkinType([...skinType, type]);
                        } else {
                          setSkinType(skinType.filter(t => t !== type));
                        }
                      }}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="ml-2 text-sm text-gray-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-6">Product</th>
              <th className="text-left py-4 px-6">Price</th>
              <th className="text-left py-4 px-6">Stock</th>
              <th className="text-left py-4 px-6">Filters</th>
              <th className="text-left py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 relative mr-3">
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">£{product.price}</td>
                <td className="py-4 px-6">{product.stock}</td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1">
                    {product.filters.map((filter) => (
                      <span
                        key={filter}
                        className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                      >
                        {filter}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6">
                  {product.isNew && (
                    <span className="px-2 py-1 text-xs bg-black text-white rounded-full">
                      NEW
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 