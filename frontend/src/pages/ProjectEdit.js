import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectAPI, subsidiaryAPI } from '../services/api';
import { 
  ArrowLeft, 
  Save, 
  X,
  Calendar, 
  DollarSign, 
  Building, 
  Users, 
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State Management
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loadingSubsidiaries, setLoadingSubsidiaries] = useState(true);
  
  // Form Data State - Aligned with ProjectCreate structure
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client: {
      company: '',
      contact: '',
      phone: '',
      email: ''
    },
    location: {
      address: '',
      city: '',
      province: ''
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
    progress: 0,
    subsidiary: {
      id: '',
      name: '',
      code: ''
    }
  });

  // Fetch project data
  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getById(id);
      const projectData = response.data || response;
      
      console.log('Fetched project data:', projectData); // Debug log
      
      setProject(projectData);
      
      // Format dates for HTML input (YYYY-MM-DD)
      const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      };
      
      // Handle different possible data structures from API
      const clientCompany = projectData.clientName || projectData.client?.company || '';
      
      // For contact field, check multiple possible locations
      const clientContact = 
        projectData.clientContact?.contact ||      // New format: clientContact.contact
        projectData.client?.contact ||             // Alternative: client.contact
        projectData.clientContact?.contactPerson || // Legacy: clientContact.contactPerson
        projectData.clientContact?.person ||       // Alternative: clientContact.person
        '';
        
      const clientPhone = projectData.clientContact?.phone || projectData.client?.phone || '';
      const clientEmail = projectData.clientContact?.email || projectData.client?.email || '';
      
      const budgetValue = projectData.budget?.contractValue || projectData.budget?.total || projectData.budget || 0;
      const startDate = projectData.timeline?.startDate || projectData.startDate || '';
      const endDate = projectData.timeline?.endDate || projectData.endDate || '';
      const progress = projectData.progress?.percentage || projectData.progress || 0;
      
      // Handle subsidiary data
      const subsidiary = projectData.subsidiary || projectData.subsidiaryInfo || {
        id: '',
        name: '',
        code: ''
      };
      
      console.log('Parsed data:', { // Debug log
        clientCompany,
        clientContact,
        clientPhone,
        clientEmail,
        budgetValue,
        startDate,
        endDate,
        progress,
        subsidiary
      });
      
      // Additional debug for clientContact
      console.log('ClientContact debug:', {
        'projectData.clientContact': projectData.clientContact,
        'extracted clientContact': clientContact
      });
      
      // Populate form with existing data - use same structure as ProjectCreate
      setFormData({
        name: projectData.name || '',
        description: projectData.description || '',
        client: {
          company: clientCompany,
          contact: clientContact,
          phone: clientPhone,
          email: clientEmail
        },
        location: {
          address: projectData.location?.address || '',
          city: projectData.location?.city || '',
          province: projectData.location?.province || ''
        },
        timeline: {
          startDate: formatDateForInput(startDate),
          endDate: formatDateForInput(endDate)
        },
        budget: {
          contractValue: Number(budgetValue) || 0
        },
        status: projectData.status || 'planning',
        priority: projectData.priority || 'medium',
        progress: Number(progress) || 0,
        subsidiary: {
          id: subsidiary.id || '',
          name: subsidiary.name || '',
          code: subsidiary.code || ''
        }
      });
      
      setError('');
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Gagal memuat data proyek. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch subsidiaries
  const fetchSubsidiaries = useCallback(async () => {
    try {
      setLoadingSubsidiaries(true);
      const response = await subsidiaryAPI.getAll();
      if (response.success) {
        setSubsidiaries(response.data);
      } else {
        console.error('Failed to fetch subsidiaries:', response.message);
      }
    } catch (error) {
      console.error('Error fetching subsidiaries:', error);
      // No fallback data - system must have real subsidiaries only
      setSubsidiaries([]);
    } finally {
      setLoadingSubsidiaries(false);
    }
  }, []);

  useEffect(() => {
    fetchProject();
    fetchSubsidiaries();
  }, [fetchProject, fetchSubsidiaries]);

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
  };

  // Handle subsidiary selection
  const handleSubsidiaryChange = (subsidiaryId) => {
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
    } else {
      setFormData(prev => ({
        ...prev,
        subsidiary: { id: '', name: '', code: '' }
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // Prepare data with consistent structure
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        clientName: formData.client.company.trim(),
        clientContact: {
          contact: formData.client.contact.trim(),
          phone: formData.client.phone.trim(),
          email: formData.client.email.trim()
        },
        location: {
          address: formData.location.address.trim(),
          city: formData.location.city.trim(),
          province: formData.location.province.trim()
        },
        budget: Number(formData.budget.contractValue) || 0,
        startDate: formData.timeline.startDate,
        endDate: formData.timeline.endDate,
        status: formData.status,
        priority: formData.priority,
        progress: Number(formData.progress) || 0,
        subsidiary: {
          id: formData.subsidiary.id,
          code: formData.subsidiary.code,
          name: formData.subsidiary.name
        }
      };

      console.log('Updating project with data:', updateData); // Debug log

      const response = await projectAPI.update(id, updateData);
      
      if (response.success !== false) {
        setSuccessMessage('Proyek berhasil diperbarui!');
        setTimeout(() => {
          navigate(`/admin/projects/${id}`);
        }, 1500);
      } else {
        throw new Error(response.message || 'Gagal memperbarui proyek');
      }
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err.response?.data?.message || err.message || 'Gagal memperbarui proyek. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF] mx-auto mb-4"></div>
          <p className="text-[#8E8E93]">Memuat data proyek...</p>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#FF3B30]/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-[#FF3B30]" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Terjadi Kesalahan</h2>
          <p className="text-[#8E8E93] mb-6">{error}</p>
          <Link 
            to="/admin/projects" 
            className="inline-flex items-center px-4 py-2.5 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Proyek
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to={`/admin/projects/${id}`}
              style={{
                backgroundColor: '#1C1C1E',
                border: '1px solid #38383A'
              }}
              className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#2C2C2E] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Edit Proyek
            </h1>
            <p className="text-[#8E8E93]">
              {project?.name}
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div 
            style={{
              backgroundColor: '#30D158',
              opacity: 0.1,
              border: '1px solid rgba(48, 209, 88, 0.3)'
            }}
            className="mb-6 rounded-lg p-4 relative"
          >
            <div 
              style={{ backgroundColor: 'transparent', opacity: 1 }}
              className="flex items-center absolute inset-0 p-4"
            >
              <CheckCircle className="w-5 h-5 text-[#30D158] mr-3 flex-shrink-0" />
              <p className="text-sm font-medium text-[#30D158]">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div 
            style={{
              backgroundColor: '#FF3B30',
              opacity: 0.1,
              border: '1px solid rgba(255, 59, 48, 0.3)'
            }}
            className="mb-6 rounded-lg p-4 relative"
          >
            <div 
              style={{ backgroundColor: 'transparent', opacity: 1 }}
              className="flex items-center absolute inset-0 p-4"
            >
              <AlertTriangle className="w-5 h-5 text-[#FF3B30] mr-3 flex-shrink-0" />
              <p className="text-sm font-medium text-[#FF3B30]">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div 
            style={{
              backgroundColor: '#1C1C1E',
              border: '1px solid #38383A'
            }}
            className="rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#0A84FF]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0A84FF]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Informasi Dasar
                </h2>
                <p className="text-sm text-[#8E8E93]">
                  Data utama proyek
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2">
                  Nama Proyek <span className="text-[#FF3B30]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
                  placeholder="Masukkan nama proyek"
                  required
                  disabled={saving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2">
                  Perusahaan Klien <span className="text-[#FF3B30]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.client.company}
                  onChange={(e) => handleInputChange('client.company', e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
                  placeholder="Nama perusahaan klien"
                  required
                  disabled={saving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2">
                  Anak Perusahaan Pelaksana <span className="text-[#FF3B30]">*</span>
                </label>
                <select
                  value={formData.subsidiary.id}
                  onChange={(e) => handleSubsidiaryChange(e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all"
                  required
                  disabled={saving || loadingSubsidiaries}
                >
                  <option value="" style={{ backgroundColor: '#2C2C2E', color: 'white' }}>
                    {loadingSubsidiaries ? 'Memuat...' : 'Pilih anak perusahaan'}
                  </option>
                  {subsidiaries.map(subsidiary => (
                    <option key={subsidiary.id} value={subsidiary.id} style={{ backgroundColor: '#2C2C2E', color: 'white' }}>
                      {subsidiary.code} - {subsidiary.name}
                    </option>
                  ))}
                </select>
                {formData.subsidiary.id && (
                  <p className="mt-2 text-sm text-[#8E8E93]">
                    Dilaksanakan oleh: <span className="font-medium text-[#0A84FF]">{formData.subsidiary.name}</span>
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#98989D] mb-2">
                  Deskripsi Proyek
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366] resize-none"
                  placeholder="Deskripsi detail tentang proyek..."
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Client Contact */}
          <div 
            style={{
              backgroundColor: '#1C1C1E',
              border: '1px solid #38383A'
            }}
            className="rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#30D158]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#30D158]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Kontak Klien
                </h2>
                <p className="text-sm text-[#8E8E93]">
                  Informasi kontak pihak klien
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2">
                  Nama Kontak
                </label>
                <input
                  type="text"
                  value={formData.client.contact}
                  onChange={(e) => handleInputChange('client.contact', e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
                  placeholder="Nama person in charge"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2">
                  Telepon
                </label>
                <input
                  type="tel"
                  value={formData.client.phone}
                  onChange={(e) => handleInputChange('client.phone', e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
                  placeholder="+62 xxx xxxx xxxx"
                  disabled={saving}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#98989D] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.client.email}
                  onChange={(e) => handleInputChange('client.email', e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
                  placeholder="email@example.com"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div 
            style={{
              backgroundColor: '#1C1C1E',
              border: '1px solid #38383A'
            }}
            className="rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#FF9F0A]/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#FF9F0A]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Lokasi Proyek
                </h2>
                <p className="text-sm text-[#8E8E93]">
                  Lokasi pelaksanaan proyek
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-[#98989D] mb-2">
                  Alamat Proyek
                </label>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
                  placeholder="Alamat lengkap lokasi proyek"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2">
                  Kota
                </label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleInputChange('location.city', e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
                  placeholder="Nama kota"
                  disabled={saving}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#98989D] mb-2">
                  Provinsi
                </label>
                <input
                  type="text"
                  value={formData.location.province}
                  onChange={(e) => handleInputChange('location.province', e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
                  placeholder="Nama provinsi"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div 
            style={{
              backgroundColor: '#1C1C1E',
              border: '1px solid #38383A'
            }}
            className="rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#BF5AF2]/10 flex items-center justify-center">
                <Building className="w-5 h-5 text-[#BF5AF2]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Detail Proyek
                </h2>
                <p className="text-sm text-[#8E8E93]">
                  Anggaran, timeline, dan status proyek
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Nilai Kontrak (IDR)
                </label>
                <input
                  type="number"
                  value={formData.budget.contractValue}
                  onChange={(e) => handleInputChange('budget.contractValue', e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
                  placeholder="0"
                  min="0"
                  disabled={saving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2">
                  Progress (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => handleInputChange('progress', e.target.value)}
                    style={{
                      backgroundColor: '#2C2C2E',
                      border: '1px solid #38383A',
                      color: 'white'
                    }}
                    className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
                    placeholder="0"
                    disabled={saving}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#636366] pointer-events-none">
                    %
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Mulai <span className="text-[#FF3B30]">*</span>
                </label>
                <input
                  type="date"
                  value={formData.timeline.startDate}
                  onChange={(e) => handleInputChange('timeline.startDate', e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white',
                    colorScheme: 'dark'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all"
                  required
                  disabled={saving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Selesai <span className="text-[#FF3B30]">*</span>
                </label>
                <input
                  type="date"
                  value={formData.timeline.endDate}
                  onChange={(e) => handleInputChange('timeline.endDate', e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white',
                    colorScheme: 'dark'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all"
                  required
                  disabled={saving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2">
                  Status Proyek
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all"
                  disabled={saving}
                >
                  <option value="planning" style={{ backgroundColor: '#2C2C2E', color: 'white' }}>🔵 Planning</option>
                  <option value="active" style={{ backgroundColor: '#2C2C2E', color: 'white' }}>🟢 Active</option>
                  <option value="on_hold" style={{ backgroundColor: '#2C2C2E', color: 'white' }}>🟡 On Hold</option>
                  <option value="completed" style={{ backgroundColor: '#2C2C2E', color: 'white' }}>✅ Completed</option>
                  <option value="cancelled" style={{ backgroundColor: '#2C2C2E', color: 'white' }}>🔴 Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2">
                  Prioritas
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  style={{
                    backgroundColor: '#2C2C2E',
                    border: '1px solid #38383A',
                    color: 'white'
                  }}
                  className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all"
                  disabled={saving}
                >
                  <option value="low" style={{ backgroundColor: '#2C2C2E', color: 'white' }}>⚪ Low</option>
                  <option value="medium" style={{ backgroundColor: '#2C2C2E', color: 'white' }}>🟡 Medium</option>
                  <option value="high" style={{ backgroundColor: '#2C2C2E', color: 'white' }}>🟠 High</option>
                  <option value="urgent" style={{ backgroundColor: '#2C2C2E', color: 'white' }}>🔴 Urgent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-[#38383A]">
            <Link
              to={`/admin/projects/${id}`}
              style={{
                backgroundColor: '#1C1C1E',
                border: '1px solid #38383A'
              }}
              className="inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#2C2C2E] transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Link>
            
            <button
              type="submit"
              disabled={saving}
              style={{
                backgroundColor: saving ? '#0A84FF80' : '#0A84FF'
              }}
              className="inline-flex items-center px-8 py-2.5 rounded-lg text-white font-semibold hover:bg-[#0A84FF]/90 focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-2 focus:ring-offset-[#000000] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#0A84FF]/20"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan Perubahan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEdit;
