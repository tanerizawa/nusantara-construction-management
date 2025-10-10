import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { projectAPI } from '../../../services/api';

/**
 * Form component untuk membuat atau mengedit Berita Acara
 * Full implementation with dark theme
 */
const BeritaAcaraForm = ({ 
  projectId, 
  project, 
  beritaAcara, 
  onSave, 
  onCancel 
}) => {
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [formData, setFormData] = useState({
    milestoneId: '',
    baType: 'partial',
    workDescription: '',
    completionPercentage: 0,
    completionDate: new Date().toISOString().split('T')[0],
    clientNotes: '',
    attachments: [],
    witnesses: [{ name: '', position: '', organization: '' }]
  });

  // Load milestones on mount
  useEffect(() => {
    const loadMilestones = async () => {
      try {
        const response = await projectAPI.getMilestones(projectId);
        setMilestones(response.data || []);
      } catch (error) {
        console.error('Error loading milestones:', error);
      }
    };
    loadMilestones();
  }, [projectId]);

  // Load existing BA data if editing
  useEffect(() => {
    if (beritaAcara) {
      setFormData({
        milestoneId: beritaAcara.milestoneId || '',
        baType: beritaAcara.baType || 'partial',
        workDescription: beritaAcara.workDescription || '',
        completionPercentage: beritaAcara.completionPercentage || 0,
        completionDate: beritaAcara.completionDate?.split('T')[0] || '',
        clientNotes: beritaAcara.clientNotes || '',
        attachments: beritaAcara.attachments || [],
        witnesses: beritaAcara.witnesses || [{ name: '', position: '', organization: '' }]
      });
    }
  }, [beritaAcara]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWitnessChange = (index, field, value) => {
    const updatedWitnesses = [...formData.witnesses];
    updatedWitnesses[index][field] = value;
    setFormData(prev => ({ ...prev, witnesses: updatedWitnesses }));
  };

  const addWitness = () => {
    setFormData(prev => ({
      ...prev,
      witnesses: [...prev.witnesses, { name: '', position: '', organization: '' }]
    }));
  };

  const removeWitness = (index) => {
    if (formData.witnesses.length > 1) {
      setFormData(prev => ({
        ...prev,
        witnesses: prev.witnesses.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty witnesses
      const validWitnesses = formData.witnesses.filter(w => w.name.trim() !== '');
      
      const dataToSubmit = {
        ...formData,
        witnesses: validWitnesses.length > 0 ? validWitnesses : undefined,
        status: 'draft'
      };

      if (beritaAcara) {
        await projectAPI.updateBeritaAcara(projectId, beritaAcara.id, dataToSubmit);
        alert('Berita Acara berhasil diperbarui!');
      } else {
        await projectAPI.createBeritaAcara(projectId, dataToSubmit);
        alert('Berita Acara berhasil dibuat!');
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving BA:', error);
      alert('Gagal menyimpan Berita Acara. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 text-[#8E8E93] hover:text-white hover:bg-[#48484A] rounded transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="text-xl font-semibold text-white">
              {beritaAcara ? 'Edit Berita Acara' : 'Buat Berita Acara Baru'}
            </h3>
            <p className="text-sm text-[#8E8E93] mt-1">
              {project?.name || projectId}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
        <div className="space-y-6">
          {/* Row 1: Milestone + BA Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Milestone (Opsional)
              </label>
              <select
                value={formData.milestoneId}
                onChange={(e) => handleChange('milestoneId', e.target.value)}
                className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              >
                <option value="">-- Pilih Milestone --</option>
                {milestones.map(milestone => (
                  <option key={milestone.id} value={milestone.id}>
                    {milestone.title || milestone.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tipe BA <span className="text-[#FF3B30]">*</span>
              </label>
              <select
                value={formData.baType}
                onChange={(e) => handleChange('baType', e.target.value)}
                required
                className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              >
                <option value="partial">Sebagian (Partial)</option>
                <option value="final">Final</option>
                <option value="handover">Serah Terima (Handover)</option>
                <option value="inspection">Inspeksi</option>
              </select>
            </div>
          </div>

          {/* Row 2: Work Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Deskripsi Pekerjaan <span className="text-[#FF3B30]">*</span>
            </label>
            <textarea
              value={formData.workDescription}
              onChange={(e) => handleChange('workDescription', e.target.value)}
              required
              rows={4}
              placeholder="Jelaskan pekerjaan yang telah diselesaikan..."
              className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A84FF] placeholder-[#48484A]"
            />
          </div>

          {/* Row 3: Completion % + Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Persentase Penyelesaian (%) <span className="text-[#FF3B30]">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.completionPercentage}
                onChange={(e) => handleChange('completionPercentage', parseFloat(e.target.value))}
                required
                className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tanggal Penyelesaian <span className="text-[#FF3B30]">*</span>
              </label>
              <input
                type="date"
                value={formData.completionDate}
                onChange={(e) => handleChange('completionDate', e.target.value)}
                required
                className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>
          </div>

          {/* Row 4: Client Notes */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Catatan untuk Klien
            </label>
            <textarea
              value={formData.clientNotes}
              onChange={(e) => handleChange('clientNotes', e.target.value)}
              rows={3}
              placeholder="Catatan tambahan untuk klien (opsional)..."
              className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A84FF] placeholder-[#48484A]"
            />
          </div>

          {/* Row 5: Witnesses */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-white">
                Saksi-saksi
              </label>
              <button
                type="button"
                onClick={addWitness}
                className="flex items-center gap-1 text-sm text-[#0A84FF] hover:text-[#0A84FF]/80"
              >
                <Plus size={16} />
                Tambah Saksi
              </button>
            </div>

            <div className="space-y-3">
              {formData.witnesses.map((witness, index) => (
                <div key={index} className="bg-[#1C1C1E] border border-[#38383A] rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={witness.name}
                        onChange={(e) => handleWitnessChange(index, 'name', e.target.value)}
                        placeholder="Nama Saksi"
                        className="bg-[#2C2C2E] border border-[#38383A] text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF] placeholder-[#48484A]"
                      />
                      <input
                        type="text"
                        value={witness.position}
                        onChange={(e) => handleWitnessChange(index, 'position', e.target.value)}
                        placeholder="Jabatan"
                        className="bg-[#2C2C2E] border border-[#38383A] text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF] placeholder-[#48484A]"
                      />
                      <input
                        type="text"
                        value={witness.organization}
                        onChange={(e) => handleWitnessChange(index, 'organization', e.target.value)}
                        placeholder="Organisasi"
                        className="bg-[#2C2C2E] border border-[#38383A] text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF] placeholder-[#48484A]"
                      />
                    </div>
                    {formData.witnesses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWitness(index)}
                        className="p-2 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#38383A]">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#0A84FF] text-white px-6 py-2.5 rounded-lg hover:bg-[#0A84FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {loading ? 'Menyimpan...' : 'Simpan BA'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-[#48484A] text-white px-6 py-2.5 rounded-lg hover:bg-[#48484A]/80 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BeritaAcaraForm;
