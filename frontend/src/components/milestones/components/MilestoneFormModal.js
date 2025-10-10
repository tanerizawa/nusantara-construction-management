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
        className="bg-[#2C2C2E] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#38383A]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#38383A]">
          <h3 className="text-lg font-semibold text-white">
            {milestone ? 'Edit Milestone' : 'Tambah Milestone'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-1">Nama Milestone</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#1C1C1E] border border-[#38383A] rounded-lg px-3 py-2 text-white placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
              placeholder="Masukkan nama milestone"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-1">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#1C1C1E] border border-[#38383A] rounded-lg px-3 py-2 text-white placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
              placeholder="Deskripsi milestone"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-1">Target Tanggal</label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full bg-[#1C1C1E] border border-[#38383A] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-1">Budget (Rp)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#1C1C1E] border border-[#38383A] rounded-lg px-3 py-2 text-white placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-2">Deliverables</label>
            <div className="space-y-2">
              {(formData.deliverables || []).map((deliverable, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={deliverable}
                    onChange={(e) => updateDeliverable(index, e.target.value)}
                    className="flex-1 bg-[#1C1C1E] border border-[#38383A] rounded-lg px-3 py-2 text-white placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                    placeholder="Deliverable item"
                  />
                  <button
                    type="button"
                    onClick={() => removeDeliverable(index)}
                    className="text-[#FF3B30] hover:text-[#FF3B30]/80 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addDeliverable}
              className="flex items-center gap-2 text-[#0A84FF] hover:text-[#0A84FF]/80 transition-colors mt-2"
            >
              <Plus size={16} />
              Tambah Deliverable
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-1">Catatan</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#1C1C1E] border border-[#38383A] rounded-lg px-3 py-2 text-white placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
              placeholder="Catatan tambahan (opsional)"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[#0A84FF] text-white py-2.5 px-4 rounded-lg hover:bg-[#0A84FF]/90 transition-colors font-medium"
            >
              {milestone ? 'Update' : 'Tambah'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#48484A] text-white py-2.5 px-4 rounded-lg hover:bg-[#48484A]/80 transition-colors font-medium"
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
