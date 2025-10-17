import React from 'react';
import { X, Building2, MapPin, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { colors } = CHART_OF_ACCOUNTS_CONFIG;

const InlineSubsidiaryPanel = ({ isOpen, onClose, subsidiaries, loading, error }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="rounded-lg p-6 mb-6 animate-slideDown shadow-xl"
      style={{
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        border: `1px solid rgba(16, 185, 129, 0.3)`,
        borderLeft: `4px solid #10B981`
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#FFFFFF' }}>
            <Building2 size={28} style={{ color: '#10B981' }} />
            Manajemen Entitas / Subsidiaries
          </h3>
          <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Daftar semua entitas perusahaan yang terdaftar dalam sistem
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
          title="Close"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          <X size={24} />
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-4 mb-4" 
            style={{ borderBottomColor: '#10B981' }}
          ></div>
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Loading subsidiaries...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div 
          className="p-4 rounded-lg flex items-center gap-3"
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <XCircle size={24} style={{ color: '#EF4444' }} />
          <div>
            <p className="font-medium" style={{ color: '#EF4444' }}>Error Loading Subsidiaries</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{error}</p>
          </div>
        </div>
      )}

      {/* Subsidiaries Grid */}
      {!loading && !error && (
        <>
          {subsidiaries && subsidiaries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subsidiaries.map((subsidiary) => (
                <div
                  key={subsidiary.id}
                  className="p-4 rounded-lg transition-all duration-200 hover:shadow-lg cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid rgba(255, 255, 255, 0.1)`,
                    ':hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'rgba(16, 185, 129, 0.5)'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {/* Header with Status */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 size={20} style={{ color: '#10B981' }} />
                      <span 
                        className="text-xs font-mono px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          color: '#10B981'
                        }}
                      >
                        {subsidiary.code}
                      </span>
                    </div>
                    {subsidiary.isActive ? (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#10B981' }}>
                        <CheckCircle size={14} />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#EF4444' }}>
                        <XCircle size={14} />
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h4 className="text-base font-bold mb-3" style={{ color: '#FFFFFF' }}>
                    {subsidiary.name}
                  </h4>

                  {/* Details */}
                  <div className="space-y-2 text-xs">
                    {subsidiary.address && (
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {subsidiary.address}
                        </span>
                      </div>
                    )}
                    {subsidiary.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {subsidiary.phone}
                        </span>
                      </div>
                    )}
                    {subsidiary.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {subsidiary.email}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Type Badge */}
                  {subsidiary.type && (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: 'rgba(139, 92, 246, 0.2)',
                          color: '#8B5CF6'
                        }}
                      >
                        {subsidiary.type}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 size={48} style={{ color: 'rgba(255, 255, 255, 0.3)', margin: '0 auto' }} />
              <p className="mt-4 text-lg font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                No subsidiaries found
              </p>
              <p className="text-sm mt-2" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                There are no subsidiaries registered in the system yet.
              </p>
            </div>
          )}

          {/* Summary Footer */}
          {subsidiaries && subsidiaries.length > 0 && (
            <div 
              className="mt-6 p-4 rounded-lg flex items-center justify-between"
              style={{ 
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={18} style={{ color: '#10B981' }} />
                <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Total Subsidiaries: <strong style={{ color: '#FFFFFF' }}>{subsidiaries.length}</strong>
                </span>
              </div>
              <div className="flex gap-4 text-xs">
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Active: <strong style={{ color: '#10B981' }}>
                    {subsidiaries.filter(s => s.isActive).length}
                  </strong>
                </span>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Inactive: <strong style={{ color: '#EF4444' }}>
                    {subsidiaries.filter(s => !s.isActive).length}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InlineSubsidiaryPanel;
