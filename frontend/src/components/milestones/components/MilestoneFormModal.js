import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useMilestoneForm } from '../hooks/useMilestoneForm';

const MilestoneFormModal = ({ 
  projectId,
  milestone, 
  onClose,
  onSuccess
}) => {
  const {
    formData,
    setFormData,
    updateDeliverable,
    addDeliverable,
    removeDeliverable,
    handleSubmit
  } = useMilestoneForm(projectId, milestone, () => {
    onSuccess();
    onClose();
  });

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#2C2C2E] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#38383A]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#38383A] flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {milestone ? 'Edit Milestone' : 'Tambah Milestone Baru'}
          </h3>
          <button
            onClick={onClose}
            className="text-[#8E8E93] hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Row 1: Nama dan Target Tanggal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-1">
                Nama Milestone <span className="text-[#FF3B30]">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#1C1C1E] border border-[#38383A] rounded-lg px-3 py-2 text-white placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                placeholder="Contoh: Pembangunan Pondasi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-1">
                Target Tanggal <span className="text-[#FF3B30]">*</span>
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full bg-[#1C1C1E] border border-[#38383A] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Row 2: Deskripsi Full Width */}
          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-1">
              Deskripsi <span className="text-[#FF3B30]">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#1C1C1E] border border-[#38383A] rounded-lg px-3 py-2 text-white placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
              placeholder="Deskripsi detail milestone..."
              rows={2}
              required
            />
          </div>

          {/* Row 3: Budget dan Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-1">
                Budget (Rp) <span className="text-[#FF3B30]">*</span>
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#1C1C1E] border border-[#38383A] rounded-lg px-3 py-2 text-white placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                placeholder="50000000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-1">
                Priority
              </label>
              <select
                value={formData.priority || 'medium'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-[#1C1C1E] border border-[#38383A] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Row 4: Deliverables */}
          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-2">
              Deliverables
            </label>
            <div className="space-y-2">
              {(formData.deliverables || []).map((deliverable, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={deliverable}
                    onChange={(e) => updateDeliverable(index, e.target.value)}
                    className="flex-1 bg-[#1C1C1E] border border-[#38383A] rounded-lg px-3 py-2 text-white placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent text-sm"
                    placeholder={`Deliverable ${index + 1}`}
                  />
                  {formData.deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDeliverable(index)}
                      className="text-[#FF3B30] hover:text-[#FF3B30]/80 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addDeliverable}
              className="flex items-center gap-1 text-sm text-[#0A84FF] hover:text-[#0A84FF]/80 transition-colors mt-2"
            >
              <Plus size={14} />
              Tambah Deliverable
            </button>
          </div>

          {/* Row 5: Notes */}
          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-1">
              Catatan
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#1C1C1E] border border-[#38383A] rounded-lg px-3 py-2 text-white placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
              placeholder="Catatan tambahan (opsional)"
              rows={2}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors font-medium"
            >
              {milestone ? 'Update Milestone' : 'Simpan Milestone'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-[#48484A] text-white rounded-lg hover:bg-[#48484A]/80 transition-colors font-medium"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilestoneFormModal;
