import React from 'react';
import { Building, MapPin, Phone, Mail, Calendar, Users, Globe, ExternalLink } from 'lucide-react';

const BasicInfoView = ({ subsidiary }) => {
  const getSpecializationLabel = (value) => {
    const labels = {
      general: 'General Construction',
      residential: 'Residential',
      commercial: 'Commercial',
      infrastructure: 'Infrastructure',
      industrial: 'Industrial'
    };
    return labels[value] || value;
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/30',
      inactive: 'bg-[#8E8E93]/20 text-[#8E8E93] border-[#8E8E93]/30',
      suspended: 'bg-[#FF9F0A]/20 text-[#FF9F0A] border-[#FF9F0A]/30'
    };
    const labels = {
      active: 'Aktif',
      inactive: 'Tidak Aktif',
      suspended: 'Ditangguhkan'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.active}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Nama Perusahaan</label>
          <p className="text-white text-base">{subsidiary.name || '-'}</p>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Kode Perusahaan</label>
          <p className="text-white font-mono text-base">{subsidiary.code || '-'}</p>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Status</label>
          <div>{getStatusBadge(subsidiary.status)}</div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Spesialisasi</label>
          <p className="text-white text-base">{getSpecializationLabel(subsidiary.specialization)}</p>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Perusahaan Induk</label>
          <p className="text-white text-base">{subsidiary.parentCompany || '-'}</p>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Tahun Berdiri</label>
          <p className="text-white text-base flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-white/40" />
            {subsidiary.establishedYear || '-'}
          </p>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Jumlah Karyawan</label>
          <p className="text-white text-base flex items-center">
            <Users className="h-4 w-4 mr-2 text-white/40" />
            {subsidiary.employeeCount || '-'} karyawan
          </p>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Ukuran Perusahaan</label>
          <p className="text-white text-base">
            {subsidiary.profileInfo?.companySize === 'small' ? 'Small (1-50 employees)' :
             subsidiary.profileInfo?.companySize === 'medium' ? 'Medium (51-250 employees)' :
             subsidiary.profileInfo?.companySize === 'large' ? 'Large (251+ employees)' : '-'}
          </p>
        </div>
      </div>

      {/* Description */}
      {subsidiary.description && (
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Deskripsi</label>
          <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
            {subsidiary.description}
          </p>
        </div>
      )}

      {/* Business Description */}
      {subsidiary.profileInfo?.businessDescription && (
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Deskripsi Bisnis</label>
          <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
            {subsidiary.profileInfo.businessDescription}
          </p>
        </div>
      )}

      {/* Contact Information */}
      <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Phone className="h-5 w-5 mr-2" />
          Informasi Kontak
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Telepon</label>
            <p className="text-white text-base flex items-center">
              <Phone className="h-4 w-4 mr-2 text-white/40" />
              {subsidiary.contactInfo?.phone || '-'}
            </p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Email</label>
            <p className="text-white text-base flex items-center">
              <Mail className="h-4 w-4 mr-2 text-white/40" />
              {subsidiary.contactInfo?.email || '-'}
            </p>
          </div>
          {subsidiary.profileInfo?.website && (
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Website</label>
              <a 
                href={subsidiary.profileInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0ea5e9] text-base flex items-center hover:text-[#38bdf8] transition-colors"
              >
                <Globe className="h-4 w-4 mr-2" />
                {subsidiary.profileInfo.website}
                <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Alamat
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Alamat Lengkap</label>
            <p className="text-white text-base">
              {subsidiary.address?.street || '-'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Kota</label>
              <p className="text-white text-base">{subsidiary.address?.city || '-'}</p>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Negara</label>
              <p className="text-white text-base">{subsidiary.address?.country || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      {subsidiary.certification && subsidiary.certification.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Sertifikasi</h3>
          <div className="space-y-2">
            {subsidiary.certification.map((cert, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#30D158] rounded-full"></div>
                <p className="text-white text-base">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInfoView;
