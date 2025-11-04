import React, { useState } from 'react';
import { Plus, Trash2, X, Sparkles } from 'lucide-react';
import { useMilestoneForm } from '../hooks/useMilestoneForm';
import RABSelector from '../RABSelector';
import { 
  autoFillMilestoneData,
  getEstimatedDuration,
  formatCurrency 
} from '../utils/autoFillHelpers';

const MilestoneInlineForm = ({ 
  projectId,
  project = null, // Add project prop for auto-fill
  milestone = null, // Add milestone prop for edit mode
  onClose,
  onSuccess
}) => {
  const isEditMode = !!milestone;
  
  // Track which fields were auto-filled for visual indicators
  const [autoFilledFields, setAutoFilledFields] = useState({
    name: false,
    description: false,
    targetDate: false,
    priority: false,
    deliverables: false
  });
  
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
        {/* Row 1: Nama dan Tanggal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-1">
              Nama Milestone <span className="text-[#FF3B30]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setAutoFilledFields({ ...autoFilledFields, name: false });
                }}
                className={`w-full bg-[#1C1C1E] border rounded-lg px-3 py-2 text-white placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent pr-10 ${
                  autoFilledFields.name ? 'border-[#0A84FF]' : 'border-[#38383A]'
                }`}
                placeholder="Contoh: Pembangunan Pondasi"
                required
              />
              {autoFilledFields.name && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Sparkles className="h-4 w-4 text-[#0A84FF]" title="Auto-generated from RAB" />
                </div>
              )}
            </div>
            {autoFilledFields.name && (
              <p className="text-xs text-[#0A84FF] mt-1">
                ✨ Auto-generated from project name
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-1">
              Target Tanggal <span className="text-[#FF3B30]">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => {
                  setFormData({ ...formData, targetDate: e.target.value });
                  setAutoFilledFields({ ...autoFilledFields, targetDate: false });
                }}
                className={`w-full bg-[#1C1C1E] border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent ${
                  autoFilledFields.targetDate ? 'border-[#0A84FF]' : 'border-[#38383A]'
                }`}
                required
              />
              {autoFilledFields.targetDate && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Sparkles className="h-4 w-4 text-[#0A84FF]" title="Auto-calculated from budget" />
                </div>
              )}
            </div>
            {autoFilledFields.targetDate && formData.rabLink && (
              <p className="text-xs text-[#0A84FF] mt-1">
                ✨ Estimated: {getEstimatedDuration({ totalValue: formData.rabLink.totalValue })} months from approval
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Deskripsi Full Width */}
        <div>
          <label className="block text-sm font-medium text-[#8E8E93] mb-1">
            Deskripsi <span className="text-[#FF3B30]">*</span>
          </label>
          <div className="relative">
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setAutoFilledFields({ ...autoFilledFields, description: false });
              }}
              className={`w-full bg-[#1C1C1E] border rounded-lg px-3 py-2 text-white placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent ${
                autoFilledFields.description ? 'border-[#0A84FF]' : 'border-[#38383A]'
              }`}
              placeholder="Deskripsi detail milestone..."
              rows={autoFilledFields.description ? 8 : 2}
              required
            />
            {autoFilledFields.description && (
              <div className="absolute right-2 top-2">
                <Sparkles className="h-4 w-4 text-[#0A84FF]" title="Auto-generated from RAB summary" />
              </div>
            )}
          </div>
          {autoFilledFields.description && (
            <p className="text-xs text-[#0A84FF] mt-1">
              ✨ Auto-generated with RAB summary and categories breakdown
            </p>
          )}
        </div>

        {/* Row 3: RAB Link (Complete Project RAB) - MOVED UP */}
        <RABSelector
          projectId={projectId}
          value={formData.rabLink}
          onChange={(rabData) => {
            console.log('[MilestoneInlineForm] RAB data changed:', rabData);
            
            if (!rabData || !rabData.enabled) {
              // User unlinked RAB - keep current form data but remove RAB link
              setFormData({ ...formData, rabLink: null });
              setAutoFilledFields({
                name: false,
                description: false,
                targetDate: false,
                priority: false,
                deliverables: false
              });
              return;
            }
            
            // Auto-fill all fields using helper function
            const autoFilledData = autoFillMilestoneData(
              formData,
              project,
              {
                totalValue: rabData.totalValue,
                totalItems: rabData.totalItems,
                approvedDate: rabData.approvedDate,
                categories: rabData.categories || []
              },
              true // preserveUserInput = true (only fill empty fields)
            );
            
            // Add RAB link data and ensure categoryName is set (fallback to
            // first category name if the RAB summary contains categories).
            autoFilledData.rabLink = {
              ...rabData,
              categoryName: rabData.categoryName || rabData.category_name || (rabData.categories && rabData.categories.length > 0 ? rabData.categories[0].category : undefined)
            };
            
            // Track which fields were auto-filled
            const fieldsAutoFilled = {
              name: !formData.name && !!autoFilledData.name,
              description: !formData.description && !!autoFilledData.description,
              targetDate: !formData.targetDate && !!autoFilledData.targetDate,
              priority: true, // Always auto-fill priority based on budget
              deliverables: (!formData.deliverables || formData.deliverables.length === 0) && 
                           (autoFilledData.deliverables?.length > 0)
            };
            
            console.log('[MilestoneInlineForm] Auto-filled fields:', fieldsAutoFilled);
            console.log('[MilestoneInlineForm] Auto-filled data:', autoFilledData);
            
            // Calculate estimated duration for user info
            const duration = getEstimatedDuration({ totalValue: rabData.totalValue });
            console.log(`[MilestoneInlineForm] Estimated duration: ${duration} months`);
            
            setFormData(autoFilledData);
            setAutoFilledFields(fieldsAutoFilled);
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
            <div className="relative">
              <select
                value={formData.priority || 'medium'}
                onChange={(e) => {
                  setFormData({ ...formData, priority: e.target.value });
                  setAutoFilledFields({ ...autoFilledFields, priority: false });
                }}
                className={`w-full bg-[#1C1C1E] border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent ${
                  autoFilledFields.priority ? 'border-[#0A84FF]' : 'border-[#38383A]'
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              {autoFilledFields.priority && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                  <Sparkles className="h-4 w-4 text-[#0A84FF]" title="Auto-set based on budget" />
                </div>
              )}
            </div>
            {autoFilledFields.priority && formData.rabLink && (
              <p className="text-xs text-[#0A84FF] mt-1">
                ✨ Set to <span className="font-semibold">{formData.priority}</span> based on {formatCurrency(formData.rabLink.totalValue)} budget
              </p>
            )}
          </div>
        </div>

        {/* Row 5: Deliverables */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[#8E8E93]">
              Deliverables
            </label>
            {autoFilledFields.deliverables && (
              <div className="flex items-center gap-1 text-xs text-[#0A84FF]">
                <Sparkles className="h-3 w-3" />
                <span>Auto-generated from RAB categories</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {(formData.deliverables || []).map((deliverable, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={deliverable}
                  onChange={(e) => {
                    updateDeliverable(index, e.target.value);
                    setAutoFilledFields({ ...autoFilledFields, deliverables: false });
                  }}
                  className={`flex-1 bg-[#1C1C1E] border rounded-lg px-3 py-2 text-white placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent text-sm ${
                    autoFilledFields.deliverables && index === 0 ? 'border-[#0A84FF]' : 'border-[#38383A]'
                  }`}
                  placeholder={`Deliverable ${index + 1}`}
                />
                {formData.deliverables.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      removeDeliverable(index);
                      setAutoFilledFields({ ...autoFilledFields, deliverables: false });
                    }}
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
            onClick={() => {
              addDeliverable();
              setAutoFilledFields({ ...autoFilledFields, deliverables: false });
            }}
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
