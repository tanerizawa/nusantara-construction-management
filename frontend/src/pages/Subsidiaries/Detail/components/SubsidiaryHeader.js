import React from 'react';
import { Building, CheckCircle, XCircle, ArrowLeft, Edit, Users, Trash2 } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import { getSpecializationLabel } from '../utils';

/**
 * Header component for subsidiary detail page
 * Shows company name, code, status, and action buttons
 */
const SubsidiaryHeader = ({ subsidiary, onBack, onEdit, onToggleStatus, onDelete }) => {
  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="flex items-center mb-4 transition-colors"
        style={{ color: "#98989D" }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#98989D'}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Daftar
      </button>
      
      <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="p-3 rounded-lg" style={{ background: "linear-gradient(135deg, rgba(10, 132, 255, 0.2) 0%, rgba(10, 132, 255, 0.1) 100%)" }}>
              <Building className="h-8 w-8" style={{ color: "#0A84FF" }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#FFFFFF" }}>{subsidiary.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm font-medium" style={{ color: "#98989D" }}>Kode: {subsidiary.code}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{
                  backgroundColor: subsidiary.status === 'active' ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 69, 58, 0.15)',
                  color: subsidiary.status === 'active' ? '#30D158' : '#FF453A'
                }}>
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
                <span className="text-sm px-2 py-1 rounded" style={{ color: "#98989D", backgroundColor: "#1C1C1E" }}>
                  {getSpecializationLabel(subsidiary.specialization)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onEdit}
              className="flex items-center space-x-2"
              style={{ 
                borderColor: "#38383A",
                color: "#0A84FF"
              }}
            >
              <Edit className="h-4 w-4" />
              <span>Edit Data</span>
            </Button>
            <Button
              variant="outline"
              onClick={onToggleStatus}
              className="flex items-center space-x-2"
              style={{
                borderColor: "#38383A",
                color: subsidiary.status === 'active' ? '#FF9F0A' : '#30D158'
              }}
            >
              <Users className="h-4 w-4" />
              <span>{subsidiary.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={onDelete}
              className="flex items-center space-x-2"
              style={{
                borderColor: "#38383A",
                color: "#FF453A"
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span>Hapus</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubsidiaryHeader;
