import React from 'react';
import { 
  Building, MapPin, Phone, Mail, Award, Eye, FileText, DollarSign, Shield, 
  User, Briefcase, Globe, ExternalLink
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

// Components
import SubsidiaryHeader from './components/SubsidiaryHeader';

// Hooks
import { useSubsidiaryDetail, useSubsidiaryActions } from './hooks';

// Utils
import { 
  getSpecializationLabel, 
  getCategoryLabel, 
  getCompanySizeLabel, 
  formatCurrency, 
  getPermitStatusColor 
} from './utils';

/**
 * Professional Subsidiary Detail Page - MODULAR VERSION
 * Enterprise-grade detail view with comprehensive company information
 * 
 * Modularized: October 15, 2025
 */
const SubsidiaryDetail = () => {
  // Data hook
  const { 
    id,
    subsidiary, 
    loading, 
    statistics, 
    error,
    setSubsidiary,
    refreshData
  } = useSubsidiaryDetail();

  // Actions hook
  const {
    handleDelete,
    handleToggleStatus,
    downloadAttachment,
    handleEdit,
    handleBack
  } = useSubsidiaryActions(id, subsidiary, setSubsidiary);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1C1C1E" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: "#0A84FF" }}></div>
          <p style={{ color: "#98989D" }}>Memuat data perusahaan...</p>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!subsidiary) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1C1C1E" }}>
        <div className="text-center">
          <Building className="h-16 w-16 mx-auto mb-4" style={{ color: "#636366" }} />
          <h2 className="text-xl font-semibold mb-2" style={{ color: "#FFFFFF" }}>Perusahaan Tidak Ditemukan</h2>
          <p className="mb-4" style={{ color: "#98989D" }}>Data perusahaan yang Anda cari tidak tersedia.</p>
          <Button onClick={handleBack}>
            Kembali ke Daftar
          </Button>
        </div>
      </div>
    );
  }

  // Main Content
  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: "#1C1C1E" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SubsidiaryHeader
          subsidiary={subsidiary}
          onBack={handleBack}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
              <h2 className="text-xl font-semibold mb-6 flex items-center" style={{ color: "#FFFFFF" }}>
                <Building className="h-5 w-5 mr-2" />
                Informasi Dasar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Nama Perusahaan</label>
                  <p style={{ color: "#FFFFFF" }}>{subsidiary.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Kode Perusahaan</label>
                  <p className="font-mono" style={{ color: "#FFFFFF" }}>{subsidiary.code}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Deskripsi</label>
                  <p style={{ color: "#FFFFFF" }}>{subsidiary.description || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Spesialisasi</label>
                  <p style={{ color: "#FFFFFF" }}>{getSpecializationLabel(subsidiary.specialization)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Perusahaan Induk</label>
                  <p style={{ color: "#FFFFFF" }}>{subsidiary.parentCompany}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
              <h2 className="text-xl font-semibold mb-6 flex items-center" style={{ color: "#FFFFFF" }}>
                <Phone className="h-5 w-5 mr-2" />
                Informasi Kontak
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Telepon</label>
                  <p className="flex items-center" style={{ color: "#FFFFFF" }}>
                    <Phone className="h-4 w-4 mr-2" />
                    {subsidiary.contactInfo?.phone || '-'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Email</label>
                  <p className="flex items-center" style={{ color: "#FFFFFF" }}>
                    <Mail className="h-4 w-4 mr-2" />
                    {subsidiary.contactInfo?.email || '-'}
                  </p>
                </div>
                {subsidiary.profileInfo?.website && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Website</label>
                    <a 
                      href={subsidiary.profileInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                      style={{ color: "#0A84FF" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#409CFF'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#0A84FF'}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      {subsidiary.profileInfo.website}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
              <h2 className="text-xl font-semibold mb-6 flex items-center" style={{ color: "#FFFFFF" }}>
                <MapPin className="h-5 w-5 mr-2" />
                Alamat
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Alamat Lengkap</label>
                  <p style={{ color: "#FFFFFF" }}>{subsidiary.address?.street || '-'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Kota</label>
                    <p style={{ color: "#FFFFFF" }}>{subsidiary.address?.city || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Negara</label>
                    <p style={{ color: "#FFFFFF" }}>{subsidiary.address?.country || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Board of Directors */}
            {subsidiary.boardOfDirectors && subsidiary.boardOfDirectors.length > 0 && (
              <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
                <h2 className="text-xl font-semibold mb-6 flex items-center" style={{ color: "#FFFFFF" }}>
                  <User className="h-5 w-5 mr-2" />
                  Dewan Direksi
                </h2>
                <div className="space-y-4">
                  {subsidiary.boardOfDirectors.map((director, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: "#1C1C1E" }}>
                      <div>
                        <p className="font-semibold" style={{ color: "#FFFFFF" }}>{director.name}</p>
                        <p className="text-sm" style={{ color: "#98989D" }}>{director.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#FFFFFF" }}>Informasi Cepat</h3>
              <div className="space-y-4">
                {subsidiary.profileInfo?.companySize && (
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#98989D" }}>Ukuran Perusahaan</span>
                    <span className="font-medium" style={{ color: "#FFFFFF" }}>
                      {getCompanySizeLabel(subsidiary.profileInfo.companySize)}
                    </span>
                  </div>
                )}
                {subsidiary.profileInfo?.registrationDate && (
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#98989D" }}>Tanggal Berdiri</span>
                    <span className="font-medium" style={{ color: "#FFFFFF" }}>
                      {new Date(subsidiary.profileInfo.registrationDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Overall Statistics */}
            {statistics && (
              <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "#FFFFFF" }}>Statistik Grup</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#98989D" }}>Total Anak Usaha</span>
                    <span className="font-bold" style={{ color: "#FFFFFF" }}>{statistics.totalSubsidiaries}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#98989D" }}>Anak Usaha Aktif</span>
                    <span className="font-bold text-green-600">{statistics.activeSubsidiaries}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#98989D" }}>Total Proyek</span>
                    <span className="font-bold" style={{ color: "#FFFFFF" }}>{statistics.totalProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#98989D" }}>Proyek Aktif</span>
                    <span className="font-bold text-blue-600">{statistics.activeProjects}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubsidiaryDetail;
