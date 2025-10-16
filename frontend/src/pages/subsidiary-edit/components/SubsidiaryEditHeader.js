import React from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import Button from '../../../components/ui/Button';

const SubsidiaryEditHeader = ({ 
  isEditing, 
  onSave, 
  onCancel, 
  saving = false,
  hasChanges = false,
  subsidiaryName = ''
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onCancel}
          className="flex items-center px-3 py-2 text-[#8E8E93] hover:text-white transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Anak Usaha' : 'Tambah Anak Usaha Baru'}
          </h1>
          {isEditing && subsidiaryName && (
            <p className="text-[#8E8E93] mt-1">{subsidiaryName}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={saving}
          className="flex items-center"
        >
          <X className="w-4 h-4 mr-2" />
          Batal
        </Button>
        
        <Button
          variant="primary"
          onClick={onSave}
          disabled={saving}
          className="flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </div>
  );
};

export default SubsidiaryEditHeader;