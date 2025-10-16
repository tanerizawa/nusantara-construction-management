import React from 'react';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { colors, modal } = CHART_OF_ACCOUNTS_CONFIG;

const SubsidiaryModal = ({ 
  isOpen, 
  onClose, 
  subsidiaries, 
  loading, 
  error 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50" 
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div 
        className="rounded-lg p-6 w-full overflow-y-auto" 
        style={{ 
          backgroundColor: colors.background, 
          border: `1px solid ${colors.border}`,
          maxWidth: modal.maxWidthLarge,
          maxHeight: modal.maxHeight
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
            Manajemen Entitas/Subsidiaries
          </h3>
          <button
            onClick={onClose}
            className="hover:opacity-70 transition-opacity"
            style={{ color: colors.textSecondary }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div 
              className="animate-spin rounded-full h-8 w-8 border-b-2" 
              style={{ borderBottomColor: colors.primary }}
            ></div>
          </div>
        ) : error ? (
          <div 
            className="rounded-lg p-4" 
            style={{ 
              backgroundColor: "rgba(255, 69, 58, 0.1)", 
              border: `1px solid ${colors.error}` 
            }}
          >
            <p style={{ color: colors.error }}>{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              Berikut adalah daftar anak perusahaan/subsidiaries yang terdaftar dalam sistem:
            </div>
            
            <div className="grid gap-4">
              {subsidiaries.map((subsidiary) => (
                <div 
                  key={subsidiary.id} 
                  className="rounded-lg p-4 transition-all duration-200" 
                  style={{ 
                    backgroundColor: colors.backgroundSecondary, 
                    border: `1px solid ${colors.border}` 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.backgroundSecondary}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold" style={{ color: colors.text }}>
                          {subsidiary.name}
                        </h4>
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                          style={{ 
                            backgroundColor: "rgba(10, 132, 255, 0.15)", 
                            color: colors.primary 
                          }}
                        >
                          {subsidiary.code}
                        </span>
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: subsidiary.status === 'active' ? 
                              'rgba(50, 215, 75, 0.15)' : 'rgba(255, 69, 58, 0.15)',
                            color: subsidiary.status === 'active' ? colors.success : colors.error
                          }}
                        >
                          {subsidiary.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        {subsidiary.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium" style={{ color: colors.textSecondary }}>
                            Spesialisasi:
                          </span>
                          <span className="ml-2 capitalize" style={{ color: colors.text }}>
                            {subsidiary.specialization}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: colors.textSecondary }}>
                            Karyawan:
                          </span>
                          <span className="ml-2" style={{ color: colors.text }}>
                            {subsidiary.employeeCount} orang
                          </span>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: colors.textSecondary }}>
                            Didirikan:
                          </span>
                          <span className="ml-2" style={{ color: colors.text }}>
                            {subsidiary.establishedYear}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: colors.textSecondary }}>
                            Kota:
                          </span>
                          <span className="ml-2" style={{ color: colors.text }}>
                            {subsidiary.address?.city || 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      {subsidiary.certification && subsidiary.certification.length > 0 && (
                        <div className="mt-2">
                          <span className="font-medium text-sm" style={{ color: colors.textSecondary }}>
                            Sertifikasi:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {subsidiary.certification.map((cert, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2 py-1 rounded text-xs" 
                                style={{ 
                                  backgroundColor: "rgba(152, 152, 157, 0.15)", 
                                  color: colors.textSecondary 
                                }}
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {subsidiaries.length === 0 && (
              <div className="text-center py-8" style={{ color: colors.textSecondary }}>
                Tidak ada data subsidiaries yang ditemukan.
              </div>
            )}
          </div>
        )}
        
        <div 
          className="flex justify-end pt-4 mt-6" 
          style={{ borderTop: `1px solid ${colors.border}` }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md transition-all duration-200"
            style={{
              backgroundColor: "rgba(152, 152, 157, 0.15)",
              border: `1px solid ${colors.border}`,
              color: colors.textSecondary
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubsidiaryModal;