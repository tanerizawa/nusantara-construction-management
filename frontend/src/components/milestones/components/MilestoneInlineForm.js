import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useMilestoneForm } from '../hooks/useMilestoneForm';
import RABSelector from '../RABSelector';

const MilestoneInlineForm = ({ 
  projectId,
  milestone = null, // Add milestone prop for edit mode
  onClose,
  onSuccess
}) => {
  const isEditMode = !!milestone;
  
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
    <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-white">
          {isEditMode ? 'Edit Milestone' : 'Tambah Milestone Baru'}
        </h4>
        <button
          onClick={onClose}
          className="text-[#8E8E93] hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Nama dan Deskripsi */}
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

        {/* Row 3: RAB Link (Complete Project RAB) - MOVED UP */}
        <RABSelector
          projectId={projectId}
          value={formData.rabLink}
          onChange={(rabData) => {
            console.log('[MilestoneInlineForm] RAB data changed:', rabData);
            
            // Auto-populate budget from RAB total value when linked
            const newFormData = { 
              ...formData, 
              rabLink: rabData
            };
            
            if (rabData && rabData.enabled && rabData.totalValue) {
              console.log('[MilestoneInlineForm] Auto-setting budget from RAB:', rabData.totalValue);
              newFormData.budget = rabData.totalValue;
            }
            
            setFormData(newFormData);
          }}
        />

        {/* Row 4: Budget dan Priority */}
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
              readOnly={formData.rabLink?.enabled}
              title={formData.rabLink?.enabled ? 'Budget diambil dari total nilai RAB yang di-link' : 'Masukkan budget milestone'}
            />
            {formData.rabLink?.enabled && (
              <p className="text-xs text-[#0A84FF] mt-1">
                ✓ Budget diambil dari total RAB proyek
              </p>
            )}
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
              <option value="critical">Critical</option>
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
            {isEditMode ? 'Update Milestone' : 'Simpan Milestone'}
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
  );
};

export default MilestoneInlineForm;
