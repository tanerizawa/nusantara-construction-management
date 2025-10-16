import React from 'react';

/**
 * Basic Information Section
 * Project name, code preview, subsidiary selection
 */
const BasicInfoSection = ({
  formData,
  errors,
  handleInputChange,
  handleSubsidiaryChange,
  subsidiaries,
  loadingSubsidiaries,
  subsidiaryError,
  noSubsidiaries,
  getSubsidiaryById,
  projectCodePreview,
  loadingPreview
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
            Nama Proyek *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] transition-colors
                      ${errors.name ? 'border-[#FF3B30]' : 'border-[#38383A]'}
                      bg-[#1C1C1E] text-white placeholder-[#636366]`}
            placeholder="Masukkan nama proyek"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-[#FF3B30]">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Kode Proyek (Auto Generated)
          </label>
          <div className="relative">
            <div className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                           bg-[#2C2C2E] text-[#98989D]
                           flex items-center justify-between">
              <span className="font-mono text-lg">
                {loadingPreview ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Generating...
                  </span>
                ) : projectCodePreview ? (
                  projectCodePreview
                ) : formData.subsidiary.code ? (
                  <span className="text-[#636366]">Kode akan dibuat setelah memilih subsidiary</span>
                ) : (
                  <span className="text-[#636366]">Pilih subsidiary untuk generate kode</span>
                )}
              </span>
              {projectCodePreview && (
                <span className="text-xs bg-[#30D158]/20 text-[#30D158] px-2 py-1 rounded">
                  Auto Generated
                </span>
              )}
            </div>
          </div>
          {projectCodePreview && (
            <p className="mt-1 text-xs text-[#8E8E93]">
              Format: Tahun + Kode Subsidiary + Urutan (contoh: {new Date().getFullYear()}{formData.subsidiary.code}001)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Anak Perusahaan Pelaksana *
          </label>
          {loadingSubsidiaries ? (
            <div className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                         bg-[#2C2C2E] text-[#8E8E93]
                         flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Memuat data anak perusahaan...
            </div>
          ) : subsidiaryError ? (
            <div className="w-full px-4 py-2.5 border border-[#FF3B30]/50 rounded-lg bg-[#FF3B30]/10 text-[#FF3B30]">
              Gagal memuat data anak perusahaan: {subsidiaryError}
            </div>
          ) : noSubsidiaries ? (
            <div className="w-full px-4 py-2.5 border border-[#FF9F0A]/50 rounded-lg bg-[#FF9F0A]/10 text-[#FF9F0A]">
              Tidak ada anak perusahaan yang tersedia
            </div>
          ) : (
            <select
              value={formData.subsidiary.id}
              onChange={(e) => handleSubsidiaryChange(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                        ${errors.subsidiary ? 'border-[#FF3B30]' : 'border-[#38383A]'}
                        bg-[#1C1C1E] text-white`}
            >
              <option value="">Pilih anak perusahaan yang akan menjalankan proyek</option>
              {subsidiaries.map(subsidiary => (
                <option 
                  key={subsidiary.id} 
                  value={subsidiary.id} 
                  title={`Spesialisasi: ${subsidiary.specialization} | Karyawan: ${subsidiary.total_employees} | Lokasi: ${subsidiary.location}`}
                >
                  {subsidiary.code} - {subsidiary.name} ({subsidiary.specialization})
                </option>
              ))}
            </select>
          )}
          
          {/* Subsidiary Information Display */}
          {formData.subsidiary.id && !loadingSubsidiaries && getSubsidiaryById && (
            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <div className="font-medium mb-2">Informasi Anak Perusahaan:</div>
                {(() => {
                  const selectedSub = getSubsidiaryById(formData.subsidiary.id);
                  if (!selectedSub) return null;
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-medium">Spesialisasi:</span>
                        <span className="ml-2 capitalize">{selectedSub.specialization}</span>
                      </div>
                      <div>
                        <span className="font-medium">Jumlah Karyawan:</span>
                        <span className="ml-2">{selectedSub.total_employees || 'N/A'} orang</span>
                      </div>
                      <div>
                        <span className="font-medium">Lokasi:</span>
                        <span className="ml-2">{selectedSub.location || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">{selectedSub.email || 'N/A'}</span>
                      </div>
                      {selectedSub.phone && (
                        <div>
                          <span className="font-medium">Telepon:</span>
                          <span className="ml-2">{selectedSub.phone}</span>
                        </div>
                      )}
                      {selectedSub.description && (
                        <div className="md:col-span-2">
                          <span className="font-medium">Deskripsi:</span>
                          <span className="ml-2">{selectedSub.description}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
          
          {!loadingSubsidiaries && noSubsidiaries && (
            <div className="mt-3 p-4 bg-[#FF9F0A]/10 rounded-lg border border-[#FF9F0A]/30">
              <div className="text-sm text-[#FF9F0A]">
                <div className="font-medium mb-1">⚠️ Belum Ada Data Anak Perusahaan</div>
                <div>Silakan tambahkan data anak perusahaan terlebih dahulu di menu Subsidiaries.</div>
              </div>
            </div>
          )}
          {errors.subsidiary && (
            <p className="mt-1 text-sm text-[#FF3B30]">{errors.subsidiary}</p>
          )}
          {formData.subsidiary.id && (
            <p className="mt-1 text-sm text-gray-500">
              Proyek akan dilaksanakan oleh: <span className="font-medium">{formData.subsidiary.name}</span>
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
                     bg-[#1C1C1E] text-white"
            placeholder="Deskripsikan detail proyek..."
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
