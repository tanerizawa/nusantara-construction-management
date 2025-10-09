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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          maxWidth: '672px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {milestone ? 'Edit Milestone' : 'Tambah Milestone'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Milestone</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Target Tanggal</label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Budget</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deliverables</label>
            {(formData.deliverables || []).map((deliverable, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={deliverable}
                  onChange={(e) => updateDeliverable(index, e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2"
                  placeholder="Deliverable item"
                />
                <button
                  type="button"
                  onClick={() => removeDeliverable(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDeliverable}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Plus size={16} />
              Tambah Deliverable
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catatan</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              {milestone ? 'Update' : 'Tambah'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
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
