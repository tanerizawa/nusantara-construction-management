import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * QuickStatusBar - Status update section
 * Allows quick project status changes with optional notes
 */
const QuickStatusBar = ({ project, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(project?.status || 'in_progress');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'planning', label: 'Perencanaan', color: '#FF9500' },
    { value: 'in_progress', label: 'Dalam Pengerjaan', color: '#0A84FF' },
    { value: 'on_hold', label: 'Terhenti', color: '#FF3B30' },
    { value: 'completed', label: 'Selesai', color: '#34C759' },
    { value: 'cancelled', label: 'Dibatalkan', color: '#636366' }
  ];

  const currentStatus = statusOptions.find(opt => opt.value === selectedStatus);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleUpdate = async () => {
    if (selectedStatus === project?.status && !notes.trim()) {
      return; // No changes
    }

    setIsUpdating(true);
    try {
      await onStatusUpdate?.({
        status: selectedStatus,
        notes: notes.trim()
      });
      setNotes(''); // Clear notes after successful update
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-[#2C2C2E] rounded-xl p-4 md:p-5 mb-4 border border-[#38383A]">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Label */}
        <div className="flex-shrink-0">
          <label className="text-sm font-medium text-[#8E8E93]">
            Quick Status Update:
          </label>
        </div>

        {/* Status Dropdown */}
        <div className="relative flex-shrink-0 w-full md:w-64">
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="w-full appearance-none bg-[#1C1C1E] text-white rounded-lg px-4 py-2.5 pr-10 
                     border border-[#38383A] focus:border-[#0A84FF] focus:outline-none focus:ring-1 focus:ring-[#0A84FF]
                     transition-colors text-sm font-medium"
            style={{ color: currentStatus?.color }}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93] pointer-events-none" />
        </div>

        {/* Notes Input */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Catatan perubahan status (opsional)"
            className="w-full bg-[#1C1C1E] text-white placeholder-[#636366] rounded-lg px-4 py-2.5
                     border border-[#38383A] focus:border-[#0A84FF] focus:outline-none focus:ring-1 focus:ring-[#0A84FF]
                     transition-colors text-sm"
          />
        </div>

        {/* Update Button (shown if changes made) */}
        {(selectedStatus !== project?.status || notes.trim()) && (
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-shrink-0 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white px-5 py-2.5 rounded-lg
                     font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                     whitespace-nowrap"
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuickStatusBar;
