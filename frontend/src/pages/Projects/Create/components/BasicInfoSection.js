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
    <section className="rounded-3xl border border-white/5 bg-[#080b13]/85 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="eyebrow-label text-white/60">Step 1</p>
          <h2 className="text-xl font-semibold text-white">Informasi Dasar</h2>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">Required</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Nama Proyek *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder-white/40 transition focus:border-[#0ea5e9] focus:ring-0
                      ${errors.name ? 'border-[#fb7185] bg-[#1c0f13]' : 'border-white/10 bg-white/5'}`}
            placeholder="Masukkan nama proyek"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-[#FF3B30]">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Kode Proyek (Auto Generated)
          </label>
          <div className="relative">
            <div className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/70">
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
                <span className="rounded-full border border-[#34d399]/30 bg-[#34d399]/10 px-2 py-1 text-xs text-[#a7f3d0]">
                  Auto Generated
                </span>
              )}
            </div>
          </div>
          {projectCodePreview && (
            <p className="mt-1 text-xs text-white/50">
              Format: Tahun + Kode Subsidiary + Urutan (contoh: {new Date().getFullYear()}{formData.subsidiary.code}001)
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Anak Perusahaan Pelaksana *
          </label>
          {loadingSubsidiaries ? (
            <div className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/70">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Memuat data anak perusahaan...
            </div>
          ) : subsidiaryError ? (
            <div className="rounded-2xl border border-[#fb7185]/40 bg-[#fb7185]/10 px-4 py-3 text-[#fecdd3]">
              Gagal memuat data anak perusahaan: {subsidiaryError}
            </div>
          ) : noSubsidiaries ? (
            <div className="rounded-2xl border border-[#facc15]/40 bg-[#facc15]/10 px-4 py-3 text-[#fde68a]">
              Tidak ada anak perusahaan yang tersedia
            </div>
          ) : (
            <select
              value={formData.subsidiary.id}
              onChange={(e) => handleSubsidiaryChange(e.target.value)}
              className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition focus:border-[#0ea5e9] focus:ring-0
                        ${errors.subsidiary ? 'border-[#fb7185] bg-[#1c0f13]' : 'border-white/10 bg-white/5'}`}
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
            <div className="mt-3 rounded-2xl border border-[#0ea5e9]/30 bg-[#0ea5e9]/10 p-4 text-white">
              <div className="text-sm">
                <div className="mb-2 font-medium">Informasi Anak Perusahaan:</div>
                {(() => {
                  const selectedSub = getSubsidiaryById(formData.subsidiary.id);
                  if (!selectedSub) return null;
                  return (
                    <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
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
            <div className="mt-3 rounded-2xl border border-[#f97316]/30 bg-[#f97316]/10 p-4 text-[#fdba74]">
              <div className="text-sm">
                <div className="font-medium mb-1">⚠️ Belum Ada Data Anak Perusahaan</div>
                <div>Silakan tambahkan data anak perusahaan terlebih dahulu di menu Subsidiaries.</div>
              </div>
            </div>
          )}
          {errors.subsidiary && (
            <p className="mt-1 text-sm text-[#FF3B30]">{errors.subsidiary}</p>
          )}
          {formData.subsidiary.id && (
            <p className="mt-1 text-sm text-white/50">
              Proyek akan dilaksanakan oleh: <span className="font-medium">{formData.subsidiary.name}</span>
            </p>
          )}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Deskripsi Proyek
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:ring-0"
            placeholder="Deskripsikan detail proyek..."
          />
        </div>
      </div>
    </section>
  );
};

export default BasicInfoSection;
