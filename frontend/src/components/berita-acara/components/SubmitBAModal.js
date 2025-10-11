import React, { useState } from 'react';
import { X, User, CheckCircle, FileText, PenTool } from 'lucide-react';

/**
 * Submit BA Form - Inline version
 * Captures signatures before submitting BA
 * Displays as expandable section instead of modal
 */
const SubmitBAModal = ({ beritaAcara, project, onSubmit, onCancel }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Contractor Signature
  const [formData, setFormData] = useState({
    clientRepresentative: '',
    workLocation: beritaAcara.workLocation || 
                  (typeof project?.location === 'string' 
                    ? project.location 
                    : project?.location?.address || project?.location?.fullAddress || ''),
    contractReference: beritaAcara.contractReference || '',
    contractorName: localStorage.getItem('username') || '',
    notes: beritaAcara.notes || ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validate form
    if (!formData.clientRepresentative.trim()) {
      alert('Nama perwakilan klien harus diisi');
      return;
    }
    if (!formData.workLocation.trim()) {
      alert('Lokasi pekerjaan harus diisi');
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    console.log('📝 SubmitBAModal - handleSubmit called');
    console.log('Current form data:', formData);
    
    // Validate contractor name
    if (!formData.contractorName.trim()) {
      console.warn('⚠️ Missing contractor name');
      alert('Nama kontraktor harus diisi');
      return;
    }

    console.log('✅ Validation passed, calling onSubmit...');
    // Submit with handover data (use name as signature)
    onSubmit({
      ...formData,
      contractorSignature: `Signed by: ${formData.contractorName}`,
      submittedBy: formData.contractorName || localStorage.getItem('username') || 'current_user'
    });
  };

  return (
    <div className="bg-[#2C2C2E] rounded-lg border border-[#0A84FF] mb-6 overflow-hidden animate-slideDown">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A84FF]/10 to-transparent border-b border-[#38383A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0A84FF]/20 flex items-center justify-center">
            <FileText size={20} className="text-[#0A84FF]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Submit Berita Acara</h3>
            <p className="text-sm text-[#8E8E93]">{beritaAcara.baNumber}</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-[#8E8E93] hover:text-white transition-colors p-2 hover:bg-[#38383A] rounded"
          title="Batal"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-[#38383A] bg-[#1C1C1E]">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#0A84FF]' : 'text-[#48484A]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#0A84FF]' : 'bg-[#48484A]'}`}>
              <FileText size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium">Data Serah Terima</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-[#0A84FF]' : 'bg-[#48484A]'}`} />
          
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#0A84FF]' : 'text-[#48484A]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#0A84FF]' : 'bg-[#48484A]'}`}>
              <PenTool size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium">Tanda Tangan</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <FileText className="text-[#0A84FF] flex-shrink-0" size={20} />
                <div>
                  <p className="text-white font-medium mb-1">Form Berita Acara Serah Terima</p>
                  <p className="text-sm text-[#8E8E93]">
                    Lengkapi data serah terima sebelum submit. Data ini akan digunakan untuk generate dokumen formal.
                  </p>
                </div>
              </div>
            </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nama Perwakilan Klien <span className="text-[#FF3B30]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.clientRepresentative}
                  onChange={(e) => handleInputChange('clientRepresentative', e.target.value)}
                  placeholder="Nama lengkap perwakilan klien"
                  className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A84FF] placeholder-[#48484A]"
                />
                <p className="text-xs text-[#8E8E93] mt-1">
                  Nama yang akan menandatangani sebagai perwakilan klien
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Lokasi Pekerjaan <span className="text-[#FF3B30]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.workLocation}
                  onChange={(e) => handleInputChange('workLocation', e.target.value)}
                  placeholder="Lokasi lengkap pekerjaan"
                  className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A84FF] placeholder-[#48484A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nomor Kontrak/Referensi
                </label>
                <input
                  type="text"
                  value={formData.contractReference}
                  onChange={(e) => handleInputChange('contractReference', e.target.value)}
                  placeholder="Nomor kontrak atau referensi dokumen"
                  className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A84FF] placeholder-[#48484A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Catatan Tambahan
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  placeholder="Catatan tambahan untuk dokumen serah terima..."
                  className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A84FF] placeholder-[#48484A]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onCancel}
                  className="flex-1 bg-[#48484A] text-white px-4 py-2.5 rounded-lg hover:bg-[#48484A]/80 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-[#0A84FF] text-white px-4 py-2.5 rounded-lg hover:bg-[#0A84FF]/90 transition-colors"
                >
                  Lanjut ke Tanda Tangan
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-[#30D158]/10 border border-[#30D158]/30 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <CheckCircle className="text-[#30D158] flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white font-medium mb-1">Konfirmasi Submit</p>
                    <p className="text-sm text-[#8E8E93]">
                      Masukkan nama Anda sebagai perwakilan kontraktor untuk melengkapi dokumen serah terima.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Nama Kontraktor <span className="text-[#FF3B30]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contractorName}
                  onChange={(e) => handleInputChange('contractorName', e.target.value)}
                  placeholder="Nama lengkap kontraktor"
                  className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A84FF] placeholder-[#48484A]"
                />
                <p className="text-xs text-[#8E8E93] mt-1">
                  Nama yang akan tercatat sebagai perwakilan kontraktor
                </p>
              </div>

              <div className="bg-[#1C1C1E] border border-[#38383A] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <User size={16} className="text-[#8E8E93] mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white mb-1">Yang Bertanda Tangan:</p>
                    <p className="text-sm text-[#8E8E93]">
                      {formData.contractorName || 'Belum diisi'}
                    </p>
                    <p className="text-xs text-[#98989D] mt-1">
                      Jabatan: Project Manager / Site Manager
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-[#48484A] text-white px-4 py-2.5 rounded-lg hover:bg-[#48484A]/80 transition-colors"
                >
                  Kembali
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.contractorName.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#30D158] text-white px-4 py-2.5 rounded-lg hover:bg-[#30D158]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle size={16} />
                  Submit Berita Acara
                </button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default SubmitBAModal;
