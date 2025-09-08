import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { projectAPI, apiClient } from '../services/api';
import useSubsidiaries from '../hooks/useSubsidiaries';

/**
 * Professional Project Create Page
 * Enterprise-grade form with validation
 */
const ProjectCreate = () => {
  const navigate = useNavigate();
  
  // Form state management
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client: {
      company: '',
      contact: '',
      email: '',
      phone: ''
    },
    location: {
      city: '',
      province: '',
      address: ''
    },
    timeline: {
      startDate: '',
      endDate: ''
    },
    budget: {
      contractValue: 0
    },
    status: 'planning',
    priority: 'medium',
    subsidiary: {
      id: '',
      name: '',
      code: ''
    },
    team: {
      projectManager: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [projectCodePreview, setProjectCodePreview] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Use custom subsidiary hook for better performance and caching
  const { 
    subsidiaries, 
    loading: loadingSubsidiaries, 
    error: subsidiaryError,
    getSubsidiaryById,
    isEmpty: noSubsidiaries 
  } = useSubsidiaries({
    filterBy: { status: 'active' }, // Only active subsidiaries for project creation
    includeStats: false
  });

  // Handle subsidiary selection
  const handleSubsidiaryChange = async (subsidiaryId) => {
    const selectedSubsidiary = subsidiaries.find(sub => sub.id === subsidiaryId);
    if (selectedSubsidiary) {
      setFormData(prev => ({
        ...prev,
        subsidiary: {
          id: selectedSubsidiary.id,
          code: selectedSubsidiary.code,
          name: selectedSubsidiary.name
        }
      }));
      
      // Fetch project code preview
      await fetchProjectCodePreview(selectedSubsidiary.code);
    } else {
      setFormData(prev => ({
        ...prev,
        subsidiary: { id: '', name: '', code: '' }
      }));
      setProjectCodePreview('');
    }
    
    // Clear subsidiary error
    if (errors.subsidiary) {
      setErrors(prev => ({
        ...prev,
        subsidiary: ''
      }));
    }
  };

  // Fetch project code preview
  const fetchProjectCodePreview = async (subsidiaryCode) => {
    if (!subsidiaryCode || subsidiaryCode.length !== 3) {
      setProjectCodePreview('');
      return;
    }

    try {
      setLoadingPreview(true);
      const response = await apiClient.get(`/projects/preview-code/${subsidiaryCode}`);
      const data = response.data;
      
      if (data.success) {
        setProjectCodePreview(data.data.nextProjectCode);
      } else {
        console.error('Failed to fetch code preview:', data.error);
        setProjectCodePreview('');
      }
    } catch (error) {
      console.error('Error fetching code preview:', error);
      setProjectCodePreview('');
    } finally {
      setLoadingPreview(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    console.log('Validating form data:', {
      name: formData.name,
      company: formData.client.company,
      startDate: formData.timeline.startDate,
      endDate: formData.timeline.endDate,
      budget: formData.budget.contractValue,
      subsidiary: formData.subsidiary.id
    });
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama proyek harus diisi';
      console.log('❌ Name validation failed');
    }
    
    if (!formData.client.company.trim()) {
      newErrors['client.company'] = 'Nama perusahaan klien harus diisi';
      console.log('❌ Client company validation failed');
    }
    
    if (!formData.timeline.startDate) {
      newErrors['timeline.startDate'] = 'Tanggal mulai harus diisi';
      console.log('❌ Start date validation failed');
    }
    
    if (!formData.timeline.endDate) {
      newErrors['timeline.endDate'] = 'Tanggal selesai harus diisi';
      console.log('❌ End date validation failed');
    }
    
    if (formData.timeline.startDate && formData.timeline.endDate) {
      if (new Date(formData.timeline.startDate) >= new Date(formData.timeline.endDate)) {
        newErrors['timeline.endDate'] = 'Tanggal selesai harus setelah tanggal mulai';
        console.log('❌ Date range validation failed');
      }
    }
    
    if (!formData.budget.contractValue || formData.budget.contractValue <= 0) {
      newErrors['budget.contractValue'] = 'Nilai kontrak harus lebih dari 0';
      console.log('❌ Budget validation failed:', formData.budget.contractValue);
    }
    
    if (!formData.subsidiary.id) {
      newErrors.subsidiary = 'Anak perusahaan yang menjalankan proyek harus dipilih';
      console.log('❌ Subsidiary validation failed');
    }
    
    console.log('Validation errors found:', newErrors);
    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Form validation result:', isValid ? '✅ VALID' : '❌ INVALID');
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Form submit triggered');
    
    if (!validateForm()) {
      console.log('❌ Form validation failed, stopping submission');
      return;
    }
    
    console.log('✅ Validation passed, proceeding with API call');
    setLoading(true);
    
    try {
      // Prepare data for API
      const projectData = {
        name: formData.name,
        description: formData.description,
        clientName: formData.client.company,
        clientContact: {
          phone: formData.client.phone,
          email: formData.client.email || ''
        },
        location: {
          address: formData.location?.address || '',
          city: formData.location?.city || '',
          province: formData.location?.province || ''
        },
        budget: formData.budget.contractValue,
        status: 'planning',
        priority: formData.priority || 'medium',
        progress: 0,
        startDate: formData.timeline.startDate,
        endDate: formData.timeline.endDate,
        subsidiary: {
          id: formData.subsidiary.id,
          code: formData.subsidiary.code || '',
          name: formData.subsidiary.name || ''
        }
      };
      
      console.log('Creating project with data:', projectData);
      
      // Call API to create project using projectAPI
      const result = await projectAPI.create(projectData);
      console.log('API Response data:', result);
      
      if (result.success) {
        console.log('Project created successfully:', result.data);
        // Navigate back to projects list
        navigate('/admin/projects');
      } else {
        console.error('Failed to create project:', result.message);
        alert('Gagal membuat proyek: ' + result.message);
      }
      
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Terjadi kesalahan saat membuat proyek. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/admin/projects');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Buat Proyek Baru
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Informasi Dasar
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Proyek *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                            bg-white dark:bg-slate-800 text-gray-900 dark:text-white`}
                  placeholder="Masukkan nama proyek"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kode Proyek (Auto Generated)
                </label>
                <div className="relative">
                  <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300
                                 flex items-center justify-between">
                    <span className="font-mono text-lg">
                      {loadingPreview ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          Generating...
                        </span>
                      ) : projectCodePreview ? (
                        projectCodePreview
                      ) : formData.subsidiary.code ? (
                        <span className="text-gray-400">Kode akan dibuat setelah memilih subsidiary</span>
                      ) : (
                        <span className="text-gray-400">Pilih subsidiary untuk generate kode</span>
                      )}
                    </span>
                    {projectCodePreview && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Auto Generated
                      </span>
                    )}
                  </div>
                </div>
                {projectCodePreview && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Format: Tahun + Kode Subsidiary + Urutan (contoh: {new Date().getFullYear()}{formData.subsidiary.code}001)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Anak Perusahaan Pelaksana *
                </label>
                {loadingSubsidiaries ? (
                  <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-400
                               flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Memuat data anak perusahaan...
                  </div>
                ) : subsidiaryError ? (
                  <div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                    Gagal memuat data anak perusahaan: {subsidiaryError}
                  </div>
                ) : noSubsidiaries ? (
                  <div className="w-full px-4 py-3 border border-amber-300 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                    Tidak ada anak perusahaan yang tersedia
                  </div>
                ) : (
                  <select
                    value={formData.subsidiary.id}
                    onChange={(e) => handleSubsidiaryChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              ${errors.subsidiary ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                              bg-white dark:bg-slate-800 text-gray-900 dark:text-white`}
                  >
                    <option value="">Pilih anak perusahaan yang akan menjalankan proyek</option>
                    {subsidiaries.map(subsidiary => (
                      <option 
                        key={subsidiary.id} 
                        value={subsidiary.id} 
                        title={`Spesialisasi: ${subsidiary.specialization} | Karyawan: ${subsidiary.total_employees} | Lokasi: ${subsidiary.location}`}
                      >
                        {subsidiary.code} - {subsidiary.name} ({subsidiary.specialization})
                      </option>
                    ))}
                  </select>
                )}
                
                {/* Subsidiary Information Display */}
                {formData.subsidiary.id && !loadingSubsidiaries && getSubsidiaryById && (
                  <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <div className="font-medium mb-2">Informasi Anak Perusahaan:</div>
                      {(() => {
                        const selectedSub = getSubsidiaryById(formData.subsidiary.id);
                        if (!selectedSub) return null;
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="font-medium">Spesialisasi:</span>
                              <span className="ml-2 capitalize">{selectedSub.specialization}</span>
                            </div>
                            <div>
                              <span className="font-medium">Jumlah Karyawan:</span>
                              <span className="ml-2">{selectedSub.total_employees || 'N/A'} orang</span>
                            </div>
                            <div>
                              <span className="font-medium">Lokasi:</span>
                              <span className="ml-2">{selectedSub.location || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Email:</span>
                              <span className="ml-2">{selectedSub.email || 'N/A'}</span>
                            </div>
                            {selectedSub.phone && (
                              <div>
                                <span className="font-medium">Telepon:</span>
                                <span className="ml-2">{selectedSub.phone}</span>
                              </div>
                            )}
                            {selectedSub.description && (
                              <div className="md:col-span-2">
                                <span className="font-medium">Deskripsi:</span>
                                <span className="ml-2">{selectedSub.description}</span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
                
                {!loadingSubsidiaries && noSubsidiaries && (
                  <div className="mt-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                    <div className="text-sm text-amber-800 dark:text-amber-200">
                      <div className="font-medium mb-1">⚠️ Belum Ada Data Anak Perusahaan</div>
                      <div>Silakan tambahkan data anak perusahaan terlebih dahulu di menu Subsidiaries.</div>
                    </div>
                  </div>
                )}
                {errors.subsidiary && (
                  <p className="mt-1 text-sm text-red-600">{errors.subsidiary}</p>
                )}
                {formData.subsidiary.id && (
                  <p className="mt-1 text-sm text-gray-500">
                    Proyek akan dilaksanakan oleh: <span className="font-medium">{formData.subsidiary.name}</span>
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deskripsi Proyek
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  placeholder="Deskripsikan detail proyek..."
                />
              </div>
            </div>
          </Card>

          {/* Client Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Informasi Klien
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Perusahaan *
                </label>
                <input
                  type="text"
                  value={formData.client.company}
                  onChange={(e) => handleInputChange('client.company', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${errors['client.company'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                            bg-white dark:bg-slate-800 text-gray-900 dark:text-white`}
                  placeholder="Nama perusahaan klien"
                />
                {errors['client.company'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['client.company']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kontak Person
                </label>
                <input
                  type="text"
                  value={formData.client.contact}
                  onChange={(e) => handleInputChange('client.contact', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  placeholder="Nama kontak person"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Klien
                </label>
                <input
                  type="email"
                  value={formData.client.email}
                  onChange={(e) => handleInputChange('client.email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  placeholder="email@client.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telepon Klien
                </label>
                <input
                  type="tel"
                  value={formData.client.phone}
                  onChange={(e) => handleInputChange('client.phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  placeholder="081234567890"
                />
              </div>
            </div>
          </Card>

          {/* Timeline & Budget */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Timeline & Budget
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tanggal Mulai *
                </label>
                <input
                  type="date"
                  value={formData.timeline.startDate}
                  onChange={(e) => handleInputChange('timeline.startDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${errors['timeline.startDate'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                            bg-white dark:bg-slate-800 text-gray-900 dark:text-white`}
                />
                {errors['timeline.startDate'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['timeline.startDate']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tanggal Selesai *
                </label>
                <input
                  type="date"
                  value={formData.timeline.endDate}
                  onChange={(e) => handleInputChange('timeline.endDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${errors['timeline.endDate'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                            bg-white dark:bg-slate-800 text-gray-900 dark:text-white`}
                />
                {errors['timeline.endDate'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['timeline.endDate']}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nilai Kontrak *
                </label>
                <input
                  type="number"
                  value={formData.budget.contractValue}
                  onChange={(e) => handleInputChange('budget.contractValue', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${errors['budget.contractValue'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                            bg-white dark:bg-slate-800 text-gray-900 dark:text-white`}
                  placeholder="0"
                  min="1"
                />
                {errors['budget.contractValue'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['budget.contractValue']}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Masukkan nilai dalam Rupiah (contoh: 500000000 untuk 500 juta)
                </p>
              </div>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              disabled={loading}
            >
              Batal
            </Button>
            
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Proyek
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreate;
