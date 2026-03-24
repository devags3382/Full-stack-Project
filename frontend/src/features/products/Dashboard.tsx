import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { isAdmin } = useAuth();
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, imageUrl: 'https://via.placeholder.com/150' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '', price: 0, imageUrl: 'https://via.placeholder.com/150' });
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({ name: product.name, description: product.description, price: product.price, imageUrl: product.imageUrl });
    setShowForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products Dashboard</h1>
        {isAdmin && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', description: '', price: 0, imageUrl: 'https://via.placeholder.com/150' }) }}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Product
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="sm:col-span-2 flex justify-end space-x-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{editingId ? 'Update' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
            <img className="h-48 w-full object-cover" src={product.imageUrl} alt={product.name} />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="mt-1 text-xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
              <p className="mt-2 text-sm text-gray-500 flex-1">{product.description}</p>
              
              {isAdmin && (
                <div className="mt-4 flex space-x-2 pt-4 border-t border-gray-100">
                  <button onClick={() => handleEdit(product)} className="flex-1 flex justify-center items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Edit2 className="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="flex-1 flex justify-center items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
