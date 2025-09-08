import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, X, Building, MapPin, Phone, Mail, Users, Calendar,
  Plus, Trash2, DollarSign, Shield, User, Globe, Upload,
  FileText, Award
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { subsidiaryAPI } from '../services/api';

/**
 * Professional Subsidiary Edit Page
 * Enterprise-grade form with comprehensive validation and professional data management
 */
const SubsidiaryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    specialization: 'general',
    status: 'active',
    parentCompany: 'PT Nusantara Construction Group',
    establishedYear: '',
    employeeCount: '',
    contactInfo: {
      phone: '',
      email: ''
    },
    address: {
      street: '',
      city: '',
      country: 'Indonesia'
    },
    certification: [],
    boardOfDirectors: [],
    legalInfo: {
      companyRegistrationNumber: '',
      taxIdentificationNumber: '',
      businessLicenseNumber: '',
      articlesOfIncorporation: '',
      vatRegistrationNumber: ''
    },
    permits: [],
    financialInfo: {
      authorizedCapital: '',
      paidUpCapital: '',
      currency: 'IDR',
      fiscalYearEnd: ''
    },
    profileInfo: {
      website: '',
      socialMedia: {},
      companySize: '',
      industryClassification: '',
      businessDescription: ''
    },
    attachments: []
  });

  // Form states for dynamic sections
  const [newCertification, setNewCertification] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newDirector, setNewDirector] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    appointmentDate: '',
    isActive: true
  });
  const [newPermit, setNewPermit] = useState({
    name: '',
    number: '',
    issuedBy: '',
    issuedDate: '',
    expiryDate: '',
    status: 'active'
  });

  useEffect(() => {
    if (isEditing) {
      fetchSubsidiaryDetail();
    }
  }, [id, isEditing]);

  const fetchSubsidiaryDetail = async () => {
    try {
      setLoading(true);
      const response = await subsidiaryAPI.getById(id);
      if (response.success) {
        const subsidiary = response.data;
        setFormData({
          name: subsidiary.name || '',
          code: subsidiary.code || '',
          description: subsidiary.description || '',
          specialization: subsidiary.specialization || 'general',
          status: subsidiary.status || 'active',
          parentCompany: subsidiary.parentCompany || 'PT Nusantara Construction Group',
          establishedYear: subsidiary.establishedYear || '',
          employeeCount: subsidiary.employeeCount || '',
          contactInfo: {
            phone: subsidiary.contactInfo?.phone || '',
            email: subsidiary.contactInfo?.email || ''
          },
          address: {
            street: subsidiary.address?.street || '',
            city: subsidiary.address?.city || '',
            country: subsidiary.address?.country || 'Indonesia'
          },
          certification: subsidiary.certification || [],
          boardOfDirectors: subsidiary.boardOfDirectors || [],
          legalInfo: {
            companyRegistrationNumber: subsidiary.legalInfo?.companyRegistrationNumber || '',
            taxIdentificationNumber: subsidiary.legalInfo?.taxIdentificationNumber || '',
            businessLicenseNumber: subsidiary.legalInfo?.businessLicenseNumber || '',
            articlesOfIncorporation: subsidiary.legalInfo?.articlesOfIncorporation || '',
            vatRegistrationNumber: subsidiary.legalInfo?.vatRegistrationNumber || ''
          },
          permits: subsidiary.permits || [],
          financialInfo: {
            authorizedCapital: subsidiary.financialInfo?.authorizedCapital || '',
            paidUpCapital: subsidiary.financialInfo?.paidUpCapital || '',
            currency: subsidiary.financialInfo?.currency || 'IDR',
            fiscalYearEnd: subsidiary.financialInfo?.fiscalYearEnd || ''
          },
          profileInfo: {
            website: subsidiary.profileInfo?.website || '',
            socialMedia: subsidiary.profileInfo?.socialMedia || {},
            companySize: subsidiary.profileInfo?.companySize || '',
            industryClassification: subsidiary.profileInfo?.industryClassification || '',
            businessDescription: subsidiary.profileInfo?.businessDescription || ''
          },
          attachments: subsidiary.attachments || []
        });
      }
    } catch (error) {
      console.error('Error fetching subsidiary:', error);
      alert('Gagal memuat data anak usaha');
      navigate('/admin/subsidiaries');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // HANYA VALIDASI FIELD WAJIB - name dan code
    if (!formData.name.trim()) {
      newErrors.name = 'Nama perusahaan wajib diisi';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Kode perusahaan wajib diisi';
    } else if (formData.code.length < 2 || formData.code.length > 10) {
      newErrors.code = 'Kode harus antara 2-10 karakter';
    }

    // VALIDASI OPSIONAL - hanya jika diisi
    // Email validation - only if provided
    if (formData.contactInfo.email && formData.contactInfo.email.trim() && 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Website validation - only if provided
    if (formData.profileInfo.website && formData.profileInfo.website.trim() && 
        !/^https?:\/\/.+\..+/.test(formData.profileInfo.website)) {
      newErrors.website = 'Format website tidak valid (harus dimulai dengan http:// atau https://)';
    }

    // Year validation - only if provided
    if (formData.establishedYear && formData.establishedYear.toString().trim()) {
      const year = parseInt(formData.establishedYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear) {
        newErrors.establishedYear = `Tahun harus antara 1900-${currentYear}`;
      }
    }

    // Employee count validation - only if provided
    if (formData.employeeCount && formData.employeeCount.toString().trim()) {
      const count = parseInt(formData.employeeCount);
      if (isNaN(count) || count < 0) {
        newErrors.employeeCount = 'Jumlah karyawan harus berupa angka positif';
      }
    }

    // Financial validation - only if provided
    if (formData.financialInfo.authorizedCapital && formData.financialInfo.authorizedCapital.toString().trim()) {
      const capital = parseFloat(formData.financialInfo.authorizedCapital);
      if (isNaN(capital) || capital < 0) {
        newErrors.authorizedCapital = 'Modal dasar harus berupa angka positif';
      }
    }

    if (formData.financialInfo.paidUpCapital && formData.financialInfo.paidUpCapital.toString().trim()) {
      const capital = parseFloat(formData.financialInfo.paidUpCapital);
      if (isNaN(capital) || capital < 0) {
        newErrors.paidUpCapital = 'Modal disetor harus berupa angka positif';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      // Prepare data for API - CLEAN DATA with only essential fields
      const cleanApiData = {
        // REQUIRED FIELDS
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        
        // OPTIONAL FIELDS - only send if they have meaningful values
        ...(formData.description.trim() && { description: formData.description.trim() }),
        ...(formData.specialization && { specialization: formData.specialization }),
        ...(formData.status && { status: formData.status }),
        ...(formData.parentCompany.trim() && { parentCompany: formData.parentCompany.trim() }),
        
        // Numbers - convert properly or send null
        ...(formData.establishedYear && formData.establishedYear.toString().trim() && 
            !isNaN(parseInt(formData.establishedYear)) && { 
              establishedYear: parseInt(formData.establishedYear) 
            }),
        ...(formData.employeeCount && formData.employeeCount.toString().trim() && 
            !isNaN(parseInt(formData.employeeCount)) && { 
              employeeCount: parseInt(formData.employeeCount) 
            }),
        
        // Contact info - only if not empty
        ...((formData.contactInfo.phone.trim() || formData.contactInfo.email.trim()) && {
          contactInfo: {
            ...(formData.contactInfo.phone.trim() && { phone: formData.contactInfo.phone.trim() }),
            ...(formData.contactInfo.email.trim() && { email: formData.contactInfo.email.trim() })
          }
        }),
        
        // Address - only if not empty
        ...((formData.address.street.trim() || formData.address.city.trim() || formData.address.country.trim()) && {
          address: {
            ...(formData.address.street.trim() && { street: formData.address.street.trim() }),
            ...(formData.address.city.trim() && { city: formData.address.city.trim() }),
            ...(formData.address.country.trim() && { country: formData.address.country.trim() })
          }
        }),
        
        // Certification - only if has items
        ...(formData.certification.length > 0 && {
          certification: formData.certification.filter(cert => cert.trim())
        }),
        
        // Board of Directors - only if has items
        ...(formData.boardOfDirectors.length > 0 && {
          boardOfDirectors: formData.boardOfDirectors
        }),
        
        // Legal info - only if has values
        ...((formData.legalInfo.companyRegistrationNumber.trim() || 
             formData.legalInfo.taxIdentificationNumber.trim() ||
             formData.legalInfo.businessLicenseNumber.trim() ||
             formData.legalInfo.articlesOfIncorporation.trim() ||
             formData.legalInfo.vatRegistrationNumber.trim()) && {
          legalInfo: {
            ...(formData.legalInfo.companyRegistrationNumber.trim() && 
                { companyRegistrationNumber: formData.legalInfo.companyRegistrationNumber.trim() }),
            ...(formData.legalInfo.taxIdentificationNumber.trim() && 
                { taxIdentificationNumber: formData.legalInfo.taxIdentificationNumber.trim() }),
            ...(formData.legalInfo.businessLicenseNumber.trim() && 
                { businessLicenseNumber: formData.legalInfo.businessLicenseNumber.trim() }),
            ...(formData.legalInfo.articlesOfIncorporation.trim() && 
                { articlesOfIncorporation: formData.legalInfo.articlesOfIncorporation.trim() }),
            ...(formData.legalInfo.vatRegistrationNumber.trim() && 
                { vatRegistrationNumber: formData.legalInfo.vatRegistrationNumber.trim() })
          }
        }),
        
        // Permits - only if has items
        ...(formData.permits.length > 0 && {
          permits: formData.permits
        }),
        
        // Financial info - only if has values
        ...((formData.financialInfo.authorizedCapital && formData.financialInfo.authorizedCapital.toString().trim()) ||
            (formData.financialInfo.paidUpCapital && formData.financialInfo.paidUpCapital.toString().trim()) ||
            formData.financialInfo.fiscalYearEnd.trim() && {
          financialInfo: {
            ...(formData.financialInfo.authorizedCapital && 
                formData.financialInfo.authorizedCapital.toString().trim() &&
                !isNaN(parseFloat(formData.financialInfo.authorizedCapital)) && { 
                  authorizedCapital: parseFloat(formData.financialInfo.authorizedCapital) 
                }),
            ...(formData.financialInfo.paidUpCapital && 
                formData.financialInfo.paidUpCapital.toString().trim() &&
                !isNaN(parseFloat(formData.financialInfo.paidUpCapital)) && { 
                  paidUpCapital: parseFloat(formData.financialInfo.paidUpCapital) 
                }),
            ...(formData.financialInfo.currency && { currency: formData.financialInfo.currency }),
            ...(formData.financialInfo.fiscalYearEnd.trim() && { 
                fiscalYearEnd: formData.financialInfo.fiscalYearEnd.trim() 
              })
          }
        }),
        
        // Profile info - only if has values
        ...((formData.profileInfo.website.trim() || 
             formData.profileInfo.companySize ||
             formData.profileInfo.industryClassification.trim() ||
             formData.profileInfo.businessDescription.trim()) && {
          profileInfo: {
            ...(formData.profileInfo.website.trim() && { website: formData.profileInfo.website.trim() }),
            ...(formData.profileInfo.companySize && { companySize: formData.profileInfo.companySize }),
            ...(formData.profileInfo.industryClassification.trim() && { 
                industryClassification: formData.profileInfo.industryClassification.trim() 
              }),
            ...(formData.profileInfo.businessDescription.trim() && { 
                businessDescription: formData.profileInfo.businessDescription.trim() 
              }),
            ...(Object.keys(formData.profileInfo.socialMedia || {}).length > 0 && {
                socialMedia: formData.profileInfo.socialMedia
              })
          }
        })
      };

      console.log('🚀 Sending clean API data:', cleanApiData);

      let response;
      if (isEditing) {
        response = await subsidiaryAPI.update(id, cleanApiData);
      } else {
        response = await subsidiaryAPI.create(cleanApiData);
      }

      if (response.success) {
        navigate('/admin/subsidiaries', {
          state: { 
            message: isEditing 
              ? 'Anak usaha berhasil diperbarui' 
              : 'Anak usaha berhasil ditambahkan' 
          }
        });
      } else {
        throw new Error(response.message || 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error saving subsidiary:', error);
      alert(error.message || 'Gagal menyimpan data. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Dynamic form handlers
  const addCertification = () => {
    if (newCertification.trim() && !formData.certification.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certification: [...prev.certification, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certification: prev.certification.filter((_, i) => i !== index)
    }));
  };

  const addDirector = () => {
    if (newDirector.name.trim() && newDirector.position.trim()) {
      setFormData(prev => ({
        ...prev,
        boardOfDirectors: [...prev.boardOfDirectors, { ...newDirector }]
      }));
      setNewDirector({
        name: '',
        position: '',
        email: '',
        phone: '',
        appointmentDate: '',
        isActive: true
      });
    }
  };

  const removeDirector = (index) => {
    setFormData(prev => ({
      ...prev,
      boardOfDirectors: prev.boardOfDirectors.filter((_, i) => i !== index)
    }));
  };

  const addPermit = () => {
    if (newPermit.name.trim() && newPermit.number.trim() && newPermit.issuedBy.trim()) {
      setFormData(prev => ({
        ...prev,
        permits: [...prev.permits, { ...newPermit }]
      }));
      setNewPermit({
        name: '',
        number: '',
        issuedBy: '',
        issuedDate: '',
        expiryDate: '',
        status: 'active'
      });
    }
  };

  const removePermit = (index) => {
    setFormData(prev => ({
      ...prev,
      permits: prev.permits.filter((_, i) => i !== index)
    }));
  };

  // Document upload functions
  const getCategoryLabel = (category) => {
    const categories = {
      siup: 'SIUP (Surat Izin Usaha Perdagangan)',
      situ: 'SITU (Surat Izin Tempat Usaha)',
      siujk: 'SIUJK (Surat Izin Usaha Jasa Konstruksi)',
      sbu: 'SBU (Sertifikat Badan Usaha)',
      iso: 'Sertifikat ISO',
      k3: 'Sertifikat K3 (Keselamatan & Kesehatan Kerja)',
      npwp: 'NPWP Perusahaan',
      tdp: 'TDP (Tanda Daftar Perusahaan)',
      akta: 'Akta Pendirian Perusahaan',
      sk: 'SK Kemenkumham',
      other: 'Dokumen Lainnya'
    };
    return categories[category] || category;
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !uploadCategory) {
      alert('Pilih file dan kategori dokumen');
      return;
    }

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', uploadFile);
      uploadData.append('category', uploadCategory);
      uploadData.append('description', uploadDescription);

      const response = await subsidiaryAPI.uploadDocument(id, uploadData);
      
      if (response.success) {
        // Add to attachments
        setFormData(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), response.data]
        }));
        
        // Reset upload form
        setUploadFile(null);
        setUploadCategory('');
        setUploadDescription('');
        setIsUploadModalOpen(false);
        
        alert('Dokumen berhasil diupload');
      } else {
        throw new Error(response.error || 'Gagal upload dokumen');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert(error.message || 'Gagal upload dokumen');
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = async (attachmentId) => {
    if (!window.confirm('Hapus dokumen ini?')) return;
    
    try {
      await subsidiaryAPI.deleteDocument(id, attachmentId);
      setFormData(prev => ({
        ...prev,
        attachments: prev.attachments.filter(att => att.id !== attachmentId)
      }));
      alert('Dokumen berhasil dihapus');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Gagal menghapus dokumen');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Informasi Dasar', icon: Building },
    { id: 'contact', label: 'Kontak & Alamat', icon: MapPin },
    { id: 'directors', label: 'Dewan Direksi', icon: User },
    { id: 'legal', label: 'Legalitas', icon: Shield },
    { id: 'permits', label: 'Perizinan', icon: Award },
    { id: 'financial', label: 'Keuangan', icon: DollarSign },
    { id: 'profile', label: 'Profil Perusahaan', icon: Globe }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/subsidiaries')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Edit Anak Usaha' : 'Tambah Anak Usaha'}
                </h1>
                <p className="text-gray-600">
                  {isEditing ? 'Perbarui informasi lengkap anak usaha' : 'Tambahkan anak usaha baru dengan informasi lengkap'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Perusahaan *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan nama perusahaan"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kode Perusahaan *
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.code ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan kode (2-10 karakter)"
                        maxLength={10}
                      />
                      {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Deskripsi perusahaan..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Spesialisasi
                      </label>
                      <select
                        value={formData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="general">Konstruksi Umum</option>
                        <option value="residential">Bangunan Gedung Tempat Tinggal</option>
                        <option value="commercial">Bangunan Gedung Perkantoran & Komersial</option>
                        <option value="infrastructure">Infrastruktur Jalan & Jembatan</option>
                        <option value="industrial">Bangunan Industri & Pabrik</option>
                        <option value="renovation">Pemeliharaan & Renovasi Bangunan</option>
                        <option value="interior">Finishing & Interior</option>
                        <option value="landscaping">Pertamanan & Lansekap</option>
                        <option value="civil">Teknik Sipil</option>
                        <option value="mechanical">Mekanikal & Elektrikal (ME)</option>
                        <option value="specialstructure">Konstruksi Khusus & Struktur Berat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="active">Aktif</option>
                        <option value="inactive">Nonaktif</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Tahun Didirikan
                      </label>
                      <input
                        type="number"
                        value={formData.establishedYear}
                        onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                        min="1900"
                        max={new Date().getFullYear()}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.establishedYear ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="2020"
                      />
                      {errors.establishedYear && <p className="mt-1 text-sm text-red-600">{errors.establishedYear}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Jumlah Karyawan
                      </label>
                      <input
                        type="number"
                        value={formData.employeeCount}
                        onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                        min="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.employeeCount ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="50"
                      />
                      {errors.employeeCount && <p className="mt-1 text-sm text-red-600">{errors.employeeCount}</p>}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sertifikasi
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tambah sertifikasi..."
                      />
                      <Button type="button" onClick={addCertification} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {formData.certification.length > 0 && (
                      <div className="space-y-2">
                        {formData.certification.map((cert, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-900 flex items-center">
                              <Award className="h-4 w-4 mr-2 text-blue-600" />
                              {cert}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeCertification(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact & Address Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-8">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Informasi Kontak
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telepon
                        </label>
                        <input
                          type="tel"
                          value={formData.contactInfo.phone}
                          onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+62-21-xxx-xxxx"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.contactInfo.email}
                          onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="email@perusahaan.com"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Alamat
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alamat Lengkap
                        </label>
                        <textarea
                          value={formData.address.street}
                          onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Jalan, nomor, kompleks..."
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kota
                          </label>
                          <input
                            type="text"
                            value={formData.address.city}
                            onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Jakarta"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Negara
                          </label>
                          <input
                            type="text"
                            value={formData.address.country}
                            onChange={(e) => handleNestedInputChange('address', 'country', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Indonesia"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Board of Directors Tab */}
              {activeTab === 'directors' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Dewan Direksi
                    </h3>
                  </div>

                  {/* Add New Director Form */}
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-4">Tambah Direksi Baru</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          value={newDirector.name}
                          onChange={(e) => setNewDirector(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nama lengkap"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={newDirector.position}
                          onChange={(e) => setNewDirector(prev => ({ ...prev, position: e.target.value }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Jabatan"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          value={newDirector.email}
                          onChange={(e) => setNewDirector(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Email (opsional)"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          value={newDirector.phone}
                          onChange={(e) => setNewDirector(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Telepon (opsional)"
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          value={newDirector.appointmentDate}
                          onChange={(e) => setNewDirector(prev => ({ ...prev, appointmentDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          onClick={addDirector}
                          disabled={!newDirector.name.trim() || !newDirector.position.trim()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Direksi
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Directors List */}
                  <div className="space-y-4">
                    {formData.boardOfDirectors.map((director, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{director.name}</h4>
                            <p className="text-sm text-gray-600">{director.position}</p>
                            {director.email && (
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <Mail className="h-3 w-3 mr-1" />
                                {director.email}
                              </p>
                            )}
                            {director.phone && (
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <Phone className="h-3 w-3 mr-1" />
                                {director.phone}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              director.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {director.isActive ? 'Aktif' : 'Non-aktif'}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeDirector(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Legal Information Tab */}
              {activeTab === 'legal' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Informasi Legalitas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Akta Pendirian</label>
                      <input
                        type="text"
                        value={formData.legalInfo.companyRegistrationNumber}
                        onChange={(e) => handleNestedInputChange('legalInfo', 'companyRegistrationNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nomor akta pendirian"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NPWP</label>
                      <input
                        type="text"
                        value={formData.legalInfo.taxIdentificationNumber}
                        onChange={(e) => handleNestedInputChange('legalInfo', 'taxIdentificationNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nomor NPWP"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Izin Usaha</label>
                      <input
                        type="text"
                        value={formData.legalInfo.businessLicenseNumber}
                        onChange={(e) => handleNestedInputChange('legalInfo', 'businessLicenseNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nomor izin usaha"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NPPKP</label>
                      <input
                        type="text"
                        value={formData.legalInfo.vatRegistrationNumber}
                        onChange={(e) => handleNestedInputChange('legalInfo', 'vatRegistrationNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nomor NPPKP"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Anggaran Dasar</label>
                      <input
                        type="text"
                        value={formData.legalInfo.articlesOfIncorporation}
                        onChange={(e) => handleNestedInputChange('legalInfo', 'articlesOfIncorporation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Referensi anggaran dasar"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Permits Tab */}
              {activeTab === 'permits' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Perizinan & Lisensi
                    </h3>
                  </div>

                  {/* Add New Permit Form */}
                  <Card className="p-4 bg-yellow-50 border-yellow-200">
                    <h4 className="font-medium text-yellow-900 mb-4">Tambah Perizinan Baru</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          value={newPermit.name}
                          onChange={(e) => setNewPermit(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="Nama izin/lisensi"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={newPermit.number}
                          onChange={(e) => setNewPermit(prev => ({ ...prev, number: e.target.value }))}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="Nomor izin"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={newPermit.issuedBy}
                          onChange={(e) => setNewPermit(prev => ({ ...prev, issuedBy: e.target.value }))}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="Penerbit"
                        />
                      </div>
                      <div>
                        <select
                          value={newPermit.status}
                          onChange={(e) => setNewPermit(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        >
                          <option value="active">Aktif</option>
                          <option value="expired">Kadaluarsa</option>
                          <option value="pending">Proses</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="date"
                          value={newPermit.issuedDate}
                          onChange={(e) => setNewPermit(prev => ({ ...prev, issuedDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          value={newPermit.expiryDate}
                          onChange={(e) => setNewPermit(prev => ({ ...prev, expiryDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <Button
                        type="button"
                        onClick={addPermit}
                        disabled={!newPermit.name.trim() || !newPermit.number.trim() || !newPermit.issuedBy.trim()}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Perizinan
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setIsUploadModalOpen(true)}
                        variant="outline"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Dokumen
                      </Button>
                    </div>
                  </Card>

                  {/* Permits List */}
                  <div className="space-y-4">
                    {formData.permits.map((permit, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{permit.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              permit.status === 'active' ? 'bg-green-100 text-green-800' :
                              permit.status === 'expired' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {permit.status === 'active' && 'Aktif'}
                              {permit.status === 'expired' && 'Kadaluarsa'}
                              {permit.status === 'pending' && 'Proses'}
                            </span>
                            <button
                              type="button"
                              onClick={() => removePermit(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <label className="block text-gray-500">Nomor</label>
                            <p className="text-gray-900">{permit.number}</p>
                          </div>
                          <div>
                            <label className="block text-gray-500">Penerbit</label>
                            <p className="text-gray-900">{permit.issuedBy}</p>
                          </div>
                          <div>
                            <label className="block text-gray-500">Berlaku Hingga</label>
                            <p className="text-gray-900">
                              {permit.expiryDate 
                                ? new Date(permit.expiryDate).toLocaleDateString('id-ID')
                                : '-'
                              }
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Legal & Permit Documents */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Dokumen Legalitas & Perizinan
                    </h4>
                    
                    {formData.attachments && formData.attachments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.attachments.map((attachment) => (
                          <Card key={attachment.id} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-900">
                                  {getCategoryLabel(attachment.category)}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAttachment(attachment.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{attachment.originalName}</p>
                            {attachment.description && (
                              <p className="text-xs text-gray-500 mb-2">{attachment.description}</p>
                            )}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{new Date(attachment.uploadedAt).toLocaleDateString('id-ID')}</span>
                              <a
                                href={`/api/subsidiaries/${id}/documents/${attachment.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Lihat
                              </a>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="p-6 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada dokumen yang diupload</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Klik tombol "Upload Dokumen" untuk menambahkan dokumen legalitas dan perizinan
                        </p>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* Financial Information Tab */}
              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Informasi Keuangan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Modal Dasar</label>
                      <input
                        type="number"
                        value={formData.financialInfo.authorizedCapital}
                        onChange={(e) => handleNestedInputChange('financialInfo', 'authorizedCapital', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.authorizedCapital ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="1000000000"
                      />
                      {errors.authorizedCapital && <p className="mt-1 text-sm text-red-600">{errors.authorizedCapital}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Modal Disetor</label>
                      <input
                        type="number"
                        value={formData.financialInfo.paidUpCapital}
                        onChange={(e) => handleNestedInputChange('financialInfo', 'paidUpCapital', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.paidUpCapital ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="500000000"
                      />
                      {errors.paidUpCapital && <p className="mt-1 text-sm text-red-600">{errors.paidUpCapital}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mata Uang</label>
                      <select
                        value={formData.financialInfo.currency}
                        onChange={(e) => handleNestedInputChange('financialInfo', 'currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="IDR">IDR (Rupiah)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Akhir Tahun Fiskal</label>
                      <select
                        value={formData.financialInfo.fiscalYearEnd}
                        onChange={(e) => handleNestedInputChange('financialInfo', 'fiscalYearEnd', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Pilih bulan</option>
                        <option value="December">Desember</option>
                        <option value="March">Maret</option>
                        <option value="June">Juni</option>
                        <option value="September">September</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Profil Perusahaan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={formData.profileInfo.website}
                        onChange={(e) => handleNestedInputChange('profileInfo', 'website', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.website ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://www.perusahaan.com"
                      />
                      {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skala Perusahaan</label>
                      <select
                        value={formData.profileInfo.companySize}
                        onChange={(e) => handleNestedInputChange('profileInfo', 'companySize', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Pilih skala</option>
                        <option value="small">Kecil (1-50 karyawan)</option>
                        <option value="medium">Menengah (51-200 karyawan)</option>
                        <option value="large">Besar (200+ karyawan)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Klasifikasi Industri</label>
                      <input
                        type="text"
                        value={formData.profileInfo.industryClassification}
                        onChange={(e) => handleNestedInputChange('profileInfo', 'industryClassification', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="KBLI atau klasifikasi industri"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Bisnis</label>
                      <textarea
                        value={formData.profileInfo.businessDescription}
                        onChange={(e) => handleNestedInputChange('profileInfo', 'businessDescription', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Deskripsi detail tentang bisnis dan layanan perusahaan..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/subsidiaries')}
              disabled={saving}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Perbarui' : 'Simpan'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Dokumen Legalitas</h3>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadFile(null);
                  setUploadCategory('');
                  setUploadDescription('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Dokumen</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Pilih kategori...</option>
                  <option value="siujk">SIUJK (Surat Izin Usaha Jasa Konstruksi)</option>
                  <option value="sbu">SBU (Sertifikat Badan Usaha)</option>
                  <option value="iso">Sertifikat ISO</option>
                  <option value="k3">Sertifikat K3 (Keselamatan & Kesehatan Kerja)</option>
                  <option value="siup">SIUP (Surat Izin Usaha Perdagangan)</option>
                  <option value="situ">SITU (Surat Izin Tempat Usaha)</option>
                  <option value="npwp">NPWP Perusahaan</option>
                  <option value="tdp">TDP (Tanda Daftar Perusahaan)</option>
                  <option value="akta">Akta Pendirian Perusahaan</option>
                  <option value="sk">SK Kemenkumham</option>
                  <option value="other">Dokumen Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih File</label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: PDF, DOC, DOCX, JPG, PNG (Max: 10MB)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi (Opsional)</label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Deskripsi atau catatan dokumen..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadFile(null);
                  setUploadCategory('');
                  setUploadDescription('');
                }}
                disabled={uploading}
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleFileUpload}
                disabled={!uploadFile || !uploadCategory || uploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubsidiaryEdit;
