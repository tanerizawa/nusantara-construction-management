import React from 'react';

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
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#0A84FF] rounded-full"></span>
        Informasi Dasar
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Nama Proyek <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white placeholder-[#636366]"
            placeholder="Masukkan nama proyek"
            required
            disabled={saving}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Perusahaan Klien <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.client.company}
            onChange={(e) => handleInputChange('client.company', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white placeholder-[#636366]"
            placeholder="Nama perusahaan klien"
            required
            disabled={saving}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Anak Perusahaan Pelaksana <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.subsidiary.id}
            onChange={(e) => handleSubsidiaryChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            required
            disabled={saving || loadingSubsidiaries}
          >
            <option value="">
              {loadingSubsidiaries ? 'Memuat...' : 'Pilih anak perusahaan'}
            </option>
            {subsidiaries.map(subsidiary => (
              <option key={subsidiary.id} value={subsidiary.id}>
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
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white placeholder-[#636366] resize-none"
            placeholder="Deskripsi singkat tentang proyek"
            disabled={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;