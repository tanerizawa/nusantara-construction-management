import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTeamForm } from '../hooks/useTeamForm';

const TeamMemberFormModal = ({ 
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
            {member ? 'Edit Team Member' : 'Tambah Team Member'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pilih Karyawan</label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
              disabled={!!member} // Can't change employee for existing member
            >
              <option value="">Pilih Karyawan</option>
              {availableEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.position}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role dalam Proyek</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                {Object.keys(roles).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Alokasi (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.allocation}
                onChange={(e) => setFormData({ ...formData, allocation: parseInt(e.target.value) || 0 })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hourly Rate (Rp)</label>
            <input
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tanggung Jawab</label>
            {formData.responsibilities.map((resp, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => updateResponsibility(index, e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2"
                  placeholder="Tanggung jawab"
                />
                <button
                  type="button"
                  onClick={() => removeResponsibility(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addResponsibility}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Plus size={16} />
              Tambah Tanggung Jawab
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catatan</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              {member ? 'Update' : 'Tambah'}
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

export default TeamMemberFormModal;
