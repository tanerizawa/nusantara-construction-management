import React, { useState } from 'react';
import { Building, Save, X } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

/**
 * Add New Subsidiary Component
 * Simple form to add new subsidiary companies to YK Group
 */
const AddNewSubsidiary = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    specialization: 'residential',
    description: '',
    address: '',
    phone: '',
    email: '',
    established_year: new Date().getFullYear()
  });

  const specializationOptions = [
    { value: 'residential', label: 'Perumahan & Residential' },
    { value: 'commercial', label: 'Komersial & Perkantoran' },
    { value: 'infrastructure', label: 'Infrastruktur & Jalan' },
    { value: 'industrial', label: 'Industri & Pabrik' },
    { value: 'renovation', label: 'Renovasi & Pemeliharaan' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSubsidiary = {
      ...formData,
      id: formData.code,
      status: 'active',
      project_count: 0,
      total_value: 0,
      certifications: []
    };
    onAdd(newSubsidiary);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Tambah Anak Usaha Baru
          </h2>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Perusahaan *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: YK Mechanical"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kode Perusahaan *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: YKM"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spesialisasi *
            </label>
            <select
              required
              value={formData.specialization}
              onChange={(e) => handleChange('specialization', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {specializationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi singkat tentang perusahaan..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telepon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+62-21-555-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@ykgroup.co.id"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Alamat lengkap perusahaan..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tahun Didirikan
            </label>
            <input
              type="number"
              min="1950"
              max={new Date().getFullYear()}
              value={formData.established_year}
              onChange={(e) => handleChange('established_year', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Simpan Anak Usaha
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddNewSubsidiary;
