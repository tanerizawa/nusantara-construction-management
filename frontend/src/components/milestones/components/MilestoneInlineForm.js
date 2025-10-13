import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useMilestoneForm } from '../hooks/useMilestoneForm';
import CategorySelector from '../CategorySelector';

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
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Row 3.5: RAB Category Link */}
        <CategorySelector
          projectId={projectId}
          value={formData.categoryLink}
          onChange={(category) => {
            setFormData({ 
              ...formData, 
              categoryLink: category ? {
                enabled: true,
                category_id: category.id || null,
                category_name: category.name,
                // Preserve full category data for display
                name: category.name,
                itemCount: category.itemCount || 0,
                totalValue: category.totalValue || 0,
                lastUpdated: category.lastUpdated,
                source: category.source,
                auto_generated: false
              } : null
            });
          }}
          onCategorySelect={(category) => {
            // Auto-populate fields when category selected
            if (category && !isEditMode) {
              // Estimate duration: 1 month per 100M rupiah
              const estimatedMonths = Math.max(1, Math.ceil((category.totalValue || 0) / 100000000));
              const estimatedDays = estimatedMonths * 30;
              
              const startDate = new Date();
              const endDate = new Date();
              endDate.setDate(endDate.getDate() + estimatedDays);
              
              setFormData({
                ...formData,
                name: formData.name || `${category.name} - Fase 1`,
                budget: category.totalValue || formData.budget,
                categoryLink: {
                  enabled: true,
                  category_id: category.id || null,
                  category_name: category.name,
                  // Preserve full category data for display
                  name: category.name,
                  itemCount: category.itemCount || 0,
                  totalValue: category.totalValue || 0,
                  lastUpdated: category.lastUpdated,
                  source: category.source,
                  auto_generated: false
                }
              });
            }
          }}
        />

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
