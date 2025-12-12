import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * QuickStatusBar - Status update section
 * Allows quick project status changes with optional notes
 */
const QuickStatusBar = ({ project, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(project?.status || 'active');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const statusOptions = [
    { value: 'planning', label: 'Perencanaan', color: '#FF9500' },
    { value: 'active', label: 'Aktif / Dalam Pengerjaan', color: '#0A84FF' },
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
      return;
    }

    setIsUpdating(true);
    setFeedback(null);
    try {
      const result = await onStatusUpdate?.({
        status: selectedStatus,
        notes: notes.trim()
      });
      
      setNotes('');
      setFeedback({
        type: 'success',
        message: 'Status proyek berhasil diperbarui.'
      });
    } catch (error) {
      const errorData = error.response?.data;
      let message = errorData?.message || errorData?.error || error.message || 'Terjadi kesalahan saat mengubah status.';

      if (errorData?.requirements?.length) {
        message += ` Persyaratan: ${errorData.requirements.join(', ')}`;
      }

      setFeedback({
        type: 'error',
        message
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-shrink-0">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Quick Status Update</p>
        </div>

        <div className="relative flex-shrink-0 w-full md:w-64">
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="w-full appearance-none rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 pr-10 text-sm font-semibold text-white outline-none transition focus:border-[#0ea5e9]"
            style={{ color: currentStatus?.color }}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
        </div>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Catatan perubahan status (opsional)"
            className="w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#0ea5e9]"
          />
        </div>

        {(selectedStatus !== project?.status || notes.trim()) && (
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-shrink-0 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0ea5e9] via-[#2563eb] to-[#7c3aed] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.35)] transition hover:brightness-110 disabled:opacity-60"
          >
            {isUpdating ? 'Memperbarui...' : 'Perbarui Status'}
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={`mt-3 rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-[#34d399]/40 bg-[#34d399]/15 text-[#bbf7d0]'
              : 'border-[#fb7185]/40 bg-[#fb7185]/15 text-[#fecdd3]'
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default QuickStatusBar;
