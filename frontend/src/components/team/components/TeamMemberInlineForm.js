import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useTeamForm } from '../hooks/useTeamForm';

/**
 * Inline dark-themed form for adding/editing team members
 * Collapses into the page instead of modal overlay
 */
const TeamMemberInlineForm = ({ 
  projectId,
  member, 
  availableEmployees, 
  roles,
  onClose,
  onSuccess
}) => {
  const {
    formData,
    setFormData,
    updateResponsibility,
    addResponsibility,
    removeResponsibility,
    handleSubmit
  } = useTeamForm(projectId, member, availableEmployees, () => {
    onSuccess();
    onClose();
  });

  return (
    <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border border-[#38383A] rounded-xl p-6 mb-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {member ? 'Edit Team Member' : 'Tambah Team Member Baru'}
          </h3>
          <p className="text-sm text-[#8E8E93] mt-1">
            {member ? 'Update informasi anggota tim' : 'Isi form di bawah untuk menambah anggota tim'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[#8E8E93] hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Employee Selection */}
        <div>
          <label className="block text-sm font-medium text-[#8E8E93] mb-2">
            Pilih Karyawan <span className="text-[#FF453A]">*</span>
          </label>
          <select
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            className="w-full bg-[#2C2C2E] border border-[#38383A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-colors"
            required
            disabled={!!member}
          >
            <option value="">Pilih Karyawan</option>
            {availableEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} - {emp.position}
              </option>
            ))}
          </select>
          {member && (
            <p className="text-xs text-[#8E8E93] mt-1">
              Karyawan tidak dapat diubah setelah ditambahkan
            </p>
          )}
        </div>

        {/* Role and Allocation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-2">
              Role dalam Proyek <span className="text-[#FF453A]">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-[#2C2C2E] border border-[#38383A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-colors"
              required
            >
              {Object.keys(roles).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-2">
              Alokasi (%) <span className="text-[#FF453A]">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.allocation}
              onChange={(e) => setFormData({ ...formData, allocation: parseInt(e.target.value) || 0 })}
              className="w-full bg-[#2C2C2E] border border-[#38383A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-colors"
              required
              placeholder="100"
            />
          </div>
        </div>

        {/* Hourly Rate */}
        <div>
          <label className="block text-sm font-medium text-[#8E8E93] mb-2">
            Hourly Rate (Rp) <span className="text-[#FF453A]">*</span>
          </label>
          <input
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })}
            className="w-full bg-[#2C2C2E] border border-[#38383A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-colors"
            required
            placeholder="50000"
          />
          <p className="text-xs text-[#8E8E93] mt-1">
            Tarif per jam untuk perhitungan biaya
          </p>
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block text-sm font-medium text-[#8E8E93] mb-2">
            Tanggung Jawab
          </label>
          <div className="space-y-2 mb-3">
            {formData.responsibilities.map((resp, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => updateResponsibility(index, e.target.value)}
                  className="flex-1 bg-[#2C2C2E] border border-[#38383A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-colors"
                  placeholder={`Tanggung jawab ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeResponsibility(index)}
                  className="text-[#FF453A] hover:text-[#FF6961] transition-colors p-2.5 hover:bg-[#FF453A]/10 rounded-lg"
                  title="Hapus tanggung jawab"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addResponsibility}
            className="flex items-center gap-2 text-[#0A84FF] hover:text-[#409CFF] transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Tambah Tanggung Jawab
          </button>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-[#8E8E93] mb-2">
            Catatan
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-[#2C2C2E] border border-[#38383A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-colors resize-none"
            rows={3}
            placeholder="Catatan tambahan tentang anggota tim..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-[#38383A]">
          <button
            type="submit"
            className="flex-1 bg-[#0A84FF] text-white py-2.5 px-4 rounded-lg hover:bg-[#409CFF] font-medium transition-colors"
          >
            {member ? 'Update Member' : 'Tambah Member'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#38383A] text-white py-2.5 px-4 rounded-lg hover:bg-[#48484A] font-medium transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamMemberInlineForm;
