import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building, MapPin, Calendar, Users, Phone, Mail, Award, ArrowLeft, Edit, Trash2,
  CheckCircle, XCircle, Upload, Download, Eye, FileText, DollarSign, Shield, 
  User, Briefcase, Globe, Star, ExternalLink, Plus, X, AlertCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { subsidiaryAPI } from '../services/api';

/**
 * Professional Subsidiary Detail Page
 * Enterprise-grade detail view with comprehensive company information
 */
const SubsidiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subsidiary, setSubsidiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchSubsidiaryDetail();
  }, [id]);

  const fetchSubsidiaryDetail = async () => {
    try {
      setLoading(true);
      const [subsidiaryResponse, statsResponse] = await Promise.all([
        subsidiaryAPI.getById(id),
        subsidiaryAPI.getStats()
      ]);

      if (subsidiaryResponse.success) {
        setSubsidiary(subsidiaryResponse.data);
      } else {
        throw new Error('Subsidiary not found');
      }

      if (statsResponse.success) {
        setStatistics(statsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching subsidiary:', error);
      alert('Gagal memuat data anak usaha');
      navigate('/admin/subsidiaries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${subsidiary.name}?`)) {
      return;
    }

    try {
      const response = await subsidiaryAPI.delete(id);
      if (response.success) {
        navigate('/admin/subsidiaries', {
          state: { message: 'Anak usaha berhasil dihapus' }
        });
      }
    } catch (error) {
      console.error('Error deleting subsidiary:', error);
      alert('Gagal menghapus anak usaha');
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = subsidiary.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'mengaktifkan' : 'menonaktifkan';
    
    if (!window.confirm(`Apakah Anda yakin ingin ${action} ${subsidiary.name}?`)) {
      return;
    }

    try {
      const response = await subsidiaryAPI.update(id, { status: newStatus });
      if (response.success) {
        setSubsidiary(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal mengubah status');
    }
  };

  const downloadAttachment = async (attachmentId, filename) => {
    try {
      const response = await fetch(`/api/subsidiaries/${id}/attachments/${attachmentId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Gagal mendownload file');
    }
  };

  const getSpecializationLabel = (spec) => {
    const labels = {
      residential: 'Bangunan Gedung Tempat Tinggal',
      commercial: 'Bangunan Gedung Perkantoran & Komersial',
      infrastructure: 'Infrastruktur Jalan & Jembatan',
      industrial: 'Bangunan Industri & Pabrik',
      renovation: 'Pemeliharaan & Renovasi Bangunan',
      interior: 'Finishing & Interior',
      landscaping: 'Pertamanan & Lansekap',
      general: 'Konstruksi Umum',
      civil: 'Teknik Sipil',
      mechanical: 'Mekanikal & Elektrikal (ME)',
      specialstructure: 'Konstruksi Khusus & Struktur Berat'
    };
    return labels[spec] || 'Konstruksi Umum';
  };

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

  const getCompanySizeLabel = (size) => {
    const labels = {
      small: 'Kecil (1-50 karyawan)',
      medium: 'Menengah (51-200 karyawan)', 
      large: 'Besar (200+ karyawan)'
    };
    return labels[size] || size;
  };

  const formatCurrency = (amount, currency = 'IDR') => {
    if (!amount) return '-';
    
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
    
    return formatted;
  };

  const getPermitStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data perusahaan...</p>
        </div>
      </div>
    );
  }

  if (!subsidiary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Perusahaan Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Data perusahaan yang Anda cari tidak tersedia.</p>
          <Button onClick={() => navigate('/admin/subsidiaries')}>
            Kembali ke Daftar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/subsidiaries')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{subsidiary.name}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm font-medium text-gray-500">Kode: {subsidiary.code}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      subsidiary.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subsidiary.status === 'active' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Aktif
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Nonaktif
                        </>
                      )}
                    </span>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {getSpecializationLabel(subsidiary.specialization)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/subsidiaries/${id}/edit`)}
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Data</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleStatus}
                  className={`flex items-center space-x-2 ${
                    subsidiary.status === 'active'
                      ? 'text-orange-600 hover:bg-orange-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>{subsidiary.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Hapus</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Informasi Dasar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
                  <p className="text-gray-900">{subsidiary.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Perusahaan</label>
                  <p className="text-gray-900 font-mono">{subsidiary.code}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <p className="text-gray-900">{subsidiary.description || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spesialisasi</label>
                  <p className="text-gray-900">{getSpecializationLabel(subsidiary.specialization)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Perusahaan Induk</label>
                  <p className="text-gray-900">{subsidiary.parentCompany}</p>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Informasi Kontak
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                  <p className="text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {subsidiary.contactInfo?.phone || '-'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {subsidiary.contactInfo?.email || '-'}
                  </p>
                </div>
                {subsidiary.profileInfo?.website && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <a 
                      href={subsidiary.profileInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      {subsidiary.profileInfo.website}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Address */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Alamat
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                  <p className="text-gray-900">{subsidiary.address?.street || '-'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kota</label>
                    <p className="text-gray-900">{subsidiary.address?.city || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Negara</label>
                    <p className="text-gray-900">{subsidiary.address?.country || '-'}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Board of Directors */}
            {subsidiary.boardOfDirectors && subsidiary.boardOfDirectors.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Dewan Direksi
                </h2>
                <div className="space-y-4">
                  {subsidiary.boardOfDirectors.map((director, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{director.name}</h3>
                        <p className="text-sm text-gray-600">{director.position}</p>
                        {director.email && (
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {director.email}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {director.appointmentDate && (
                          <p className="text-xs text-gray-500">
                            Diangkat: {new Date(director.appointmentDate).toLocaleDateString('id-ID')}
                          </p>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          director.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {director.isActive ? 'Aktif' : 'Non-aktif'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Documents & Attachments */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Dokumen Legalitas & Perizinan
              </h2>
              
              <div className="space-y-6">
                {/* Legal Information Documents */}
                {subsidiary.legalInfo && Object.values(subsidiary.legalInfo).some(val => val) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Informasi Legalitas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subsidiary.legalInfo.companyRegistrationNumber && (
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">Nomor Registrasi Perusahaan</p>
                              <p className="text-sm text-gray-600">{subsidiary.legalInfo.companyRegistrationNumber}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {subsidiary.legalInfo.taxIdentificationNumber && (
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">NPWP</p>
                              <p className="text-sm text-gray-600">{subsidiary.legalInfo.taxIdentificationNumber}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {subsidiary.legalInfo.businessLicenseNumber && (
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">Nomor Izin Usaha</p>
                              <p className="text-sm text-gray-600">{subsidiary.legalInfo.businessLicenseNumber}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {subsidiary.legalInfo.vatRegistrationNumber && (
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">NPPKP</p>
                              <p className="text-sm text-gray-600">{subsidiary.legalInfo.vatRegistrationNumber}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {subsidiary.legalInfo.articlesOfIncorporation && (
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">Anggaran Dasar</p>
                              <p className="text-sm text-gray-600">{subsidiary.legalInfo.articlesOfIncorporation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Permits and Licenses */}
                {subsidiary.permits && subsidiary.permits.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Perizinan & Lisensi
                    </h3>
                    <div className="space-y-3">
                      {subsidiary.permits.map((permit, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Award className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-gray-900">{permit.name}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span>No: {permit.number}</span>
                                <span>Penerbit: {permit.issuedBy}</span>
                                {permit.expiryDate && (
                                  <span>Berlaku hingga: {new Date(permit.expiryDate).toLocaleDateString('id-ID')}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPermitStatusColor(permit.status)}`}>
                            {permit.status === 'active' && 'Aktif'}
                            {permit.status === 'expired' && 'Kadaluarsa'}
                            {permit.status === 'pending' && 'Proses'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Uploaded Documents with View Option */}
                {subsidiary.attachments && subsidiary.attachments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Dokumen Terlampir
                    </h3>
                    <div className="space-y-3">
                      {subsidiary.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">{getCategoryLabel(attachment.category)}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span>{attachment.originalName}</span>
                                <span>{(attachment.size / 1024).toFixed(1)} KB</span>
                                <span>{new Date(attachment.uploadedAt).toLocaleDateString('id-ID')}</span>
                              </div>
                              {attachment.description && (
                                <p className="text-xs text-gray-500 mt-1">{attachment.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadAttachment(attachment.id, attachment.originalName)}
                              className="flex items-center space-x-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Lihat</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {(!subsidiary.legalInfo || !Object.values(subsidiary.legalInfo).some(val => val)) && 
                 (!subsidiary.permits || subsidiary.permits.length === 0) && 
                 (!subsidiary.attachments || subsidiary.attachments.length === 0) && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">Belum ada data legalitas dan perizinan</p>
                    <p className="text-sm mt-2">Data legalitas, perizinan, dan dokumen akan ditampilkan di sini setelah diisi melalui menu Edit</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Company Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Perusahaan</h3>
              <div className="space-y-4">
                {subsidiary.establishedYear && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Didirikan
                    </span>
                    <span className="font-medium text-gray-900">{subsidiary.establishedYear}</span>
                  </div>
                )}
                {subsidiary.employeeCount && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Karyawan
                    </span>
                    <span className="font-medium text-gray-900">{subsidiary.employeeCount} orang</span>
                  </div>
                )}
                {subsidiary.profileInfo?.companySize && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Skala
                    </span>
                    <span className="font-medium text-gray-900">{getCompanySizeLabel(subsidiary.profileInfo.companySize)}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Financial Information */}
            {subsidiary.financialInfo && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Informasi Keuangan
                </h3>
                <div className="space-y-4">
                  {subsidiary.financialInfo.authorizedCapital && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Modal Dasar</label>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(subsidiary.financialInfo.authorizedCapital, subsidiary.financialInfo.currency)}
                      </p>
                    </div>
                  )}
                  {subsidiary.financialInfo.paidUpCapital && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Modal Disetor</label>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(subsidiary.financialInfo.paidUpCapital, subsidiary.financialInfo.currency)}
                      </p>
                    </div>
                  )}
                  {subsidiary.financialInfo.fiscalYearEnd && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Akhir Tahun Fiskal</label>
                      <p className="font-medium text-gray-900">{subsidiary.financialInfo.fiscalYearEnd}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Certifications */}
            {subsidiary.certification && subsidiary.certification.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Sertifikasi
                </h3>
                <div className="space-y-2">
                  {subsidiary.certification.map((cert, index) => (
                    <div key={index} className="flex items-center p-2 bg-blue-50 rounded-lg">
                      <Star className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-900">{cert}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Overall Statistics */}
            {statistics && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Grup</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Anak Usaha</span>
                    <span className="font-bold text-gray-900">{statistics.totalSubsidiaries}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Anak Usaha Aktif</span>
                    <span className="font-bold text-green-600">{statistics.activeSubsidiaries}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Proyek</span>
                    <span className="font-bold text-gray-900">{statistics.totalProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Proyek Aktif</span>
                    <span className="font-bold text-blue-600">{statistics.activeProjects}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubsidiaryDetail;
