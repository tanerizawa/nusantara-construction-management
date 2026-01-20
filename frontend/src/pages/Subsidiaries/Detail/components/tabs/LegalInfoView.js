import React from 'react';
import { Shield, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const LegalInfoView = ({ subsidiary }) => {
  const getPermitStatusBadge = (status) => {
    const styles = {
      valid: 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/30',
      expired: 'bg-[#FF453A]/20 text-[#FF453A] border-[#FF453A]/30',
      pending: 'bg-[#FF9F0A]/20 text-[#FF9F0A] border-[#FF9F0A]/30'
    };
    const labels = {
      valid: 'Berlaku',
      expired: 'Kadaluarsa',
      pending: 'Pending'
    };
    const icons = {
      valid: CheckCircle,
      expired: XCircle,
      pending: Clock
    };
    
    const Icon = icons[status] || CheckCircle;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.valid}`}>
        <Icon className="h-3 w-3 mr-1" />
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return date;
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Legal Info */}
      <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Informasi Legal Perusahaan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Nomor Registrasi Perusahaan</label>
            <p className="text-white text-base font-mono">
              {subsidiary.legalInfo?.companyRegistrationNumber || '-'}
            </p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">NPWP</label>
            <p className="text-white text-base font-mono">
              {subsidiary.legalInfo?.taxIdentificationNumber || '-'}
            </p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Nomor Izin Usaha</label>
            <p className="text-white text-base font-mono">
              {subsidiary.legalInfo?.businessLicenseNumber || '-'}
            </p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Nomor Registrasi PPN</label>
            <p className="text-white text-base font-mono">
              {subsidiary.legalInfo?.vatRegistrationNumber || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Articles of Incorporation */}
      {subsidiary.legalInfo?.articlesOfIncorporation && (
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Akta Pendirian
          </h3>
          <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
            {subsidiary.legalInfo.articlesOfIncorporation}
          </p>
        </div>
      )}

      {/* Permits and Licenses */}
      {subsidiary.permits && subsidiary.permits.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Izin & Perizinan</h3>
          <div className="space-y-4">
            {subsidiary.permits.map((permit, index) => (
              <div 
                key={index}
                className="rounded-xl border border-white/5 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold text-base">{permit.name || `Izin ${index + 1}`}</h4>
                    {permit.number && (
                      <p className="text-white/60 text-sm font-mono mt-1">No: {permit.number}</p>
                    )}
                  </div>
                  {getPermitStatusBadge(permit.status)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Diterbitkan Oleh</label>
                    <p className="text-white">{permit.issuedBy || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Tanggal Terbit</label>
                    <p className="text-white">{formatDate(permit.issuedDate)}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Tanggal Kadaluarsa</label>
                    <p className="text-white">{formatDate(permit.expiryDate)}</p>
                  </div>
                </div>
                {permit.description && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-white/60 text-sm">{permit.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!subsidiary.legalInfo || Object.keys(subsidiary.legalInfo).length === 0) && 
       (!subsidiary.permits || subsidiary.permits.length === 0) && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/60">Belum ada informasi legal yang tersedia</p>
        </div>
      )}
    </div>
  );
};

export default LegalInfoView;
