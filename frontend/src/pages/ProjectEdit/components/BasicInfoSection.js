import React from 'react';
import { FileText } from 'lucide-react';

/**
 * BasicInfoSection component for the project's basic information form section
 * 
 * @param {object} props - Component props
 * @param {object} props.formData - Form data object
 * @param {function} props.handleInputChange - Function to handle input changes
 * @param {function} props.handleSubsidiaryChange - Function to handle subsidiary selection
 * @param {array} props.subsidiaries - List of available subsidiaries
 * @param {boolean} props.loadingSubsidiaries - Whether subsidiaries are loading
 * @param {boolean} props.saving - Whether the form is currently saving
 * @returns {JSX.Element} BasicInfoSection component
 */
const BasicInfoSection = ({ 
  formData, 
  handleInputChange, 
  handleSubsidiaryChange, 
  subsidiaries, 
  loadingSubsidiaries, 
  saving 
}) => {
  return (
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
            placeholder="Deskripsi singkat tentang proyek"
            disabled={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;