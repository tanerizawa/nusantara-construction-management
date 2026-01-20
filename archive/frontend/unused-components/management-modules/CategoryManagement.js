import React, { useState, useEffect } from 'react';
import { Plus, Tag, Edit, Trash2, Package } from 'lucide-react';
import axios from 'axios';

// Phase 3 Components
import Button from './ui/Button';
import Card from './ui/Card';
import DataCard from './ui/DataCard';
import PageLoader from './ui/PageLoader';
import { Modal } from './ui/Modal';
import { Alert } from './ui/Alert';

/**
 * Category Management Component - Phase 3 Week 5
 * Material/Equipment category management for inventory
 */

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/inventory/categories');
      console.log('Categories API response:', response.data);
      setCategories(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      return;
    }

    try {
      await axios.delete(`/inventory/categories/${categoryId}`);
      fetchCategories();
      Alert.success('Kategori berhasil dihapus');
    } catch (error) {
      console.error('Error deleting category:', error);
      Alert.error('Gagal menghapus kategori');
    }
  };

  if (loading) {
    return <PageLoader size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategori Material</h1>
          <p className="text-gray-600">Kelola kategori untuk material dan equipment</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowNewCategoryModal(true)}
          icon={<Plus />}
        >
          Kategori Baru
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${
                  category.color ? `bg-${category.color}-100` : 'bg-blue-100'
                }`}>
                  <Tag size={24} className={`${
                    category.color ? `text-${category.color}-600` : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.code}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingCategory(category)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {category.description && (
                <p className="text-sm text-gray-600">{category.description}</p>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <Package size={16} className="mr-2" />
                  <span>{category.itemCount || 0} item</span>
                </div>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  category.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <DataCard
          title="Belum ada kategori"
          subtitle="Mulai dengan menambahkan kategori material pertama"
          isEmpty
        />
      )}

      {/* New/Edit Category Modal */}
      <Modal
        isOpen={showNewCategoryModal || editingCategory}
        onClose={() => {
          setShowNewCategoryModal(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? 'Edit Kategori' : 'Kategori Baru'}
      >
        <CategoryForm
          category={editingCategory}
          onSuccess={() => {
            setShowNewCategoryModal(false);
            setEditingCategory(null);
            fetchCategories();
          }}
        />
      </Modal>
    </div>
  );
};

// Category Form Component
const CategoryForm = ({ category, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    code: category?.code || '',
    description: category?.description || '',
    color: category?.color || 'blue',
    status: category?.status || 'active'
  });
  const [loading, setLoading] = useState(false);

  const colorOptions = [
    { value: 'blue', label: 'Biru' },
    { value: 'green', label: 'Hijau' },
    { value: 'purple', label: 'Ungu' },
    { value: 'red', label: 'Merah' },
    { value: 'orange', label: 'Orange' },
    { value: 'yellow', label: 'Kuning' },
    { value: 'pink', label: 'Pink' },
    { value: 'gray', label: 'Abu-abu' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (category) {
        await axios.put(`/inventory/categories/${category.id}`, formData);
        Alert.success('Kategori berhasil diperbarui');
      } else {
        await axios.post('/inventory/categories', formData);
        Alert.success('Kategori berhasil ditambahkan');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving category:', error);
      Alert.error(category ? 'Gagal memperbarui kategori' : 'Gagal menambahkan kategori');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Kategori *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Material Bangunan"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kode Kategori *
          </label>
          <input
            type="text"
            required
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="MB"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Warna *
          </label>
          <select
            required
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {colorOptions.map((color) => (
              <option key={color.value} value={color.value}>{color.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Kategori untuk material konstruksi seperti semen, besi, dll"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onSuccess}>
          Batal
        </Button>
        <Button variant="primary" type="submit" loading={loading}>
          {category ? 'Perbarui' : 'Simpan'} Kategori
        </Button>
      </div>
    </form>
  );
};

export default CategoryManagement;
