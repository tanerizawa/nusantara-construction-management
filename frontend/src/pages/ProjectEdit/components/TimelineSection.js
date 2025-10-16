import React from 'react';
import { CalendarIconWhite, DateInputWithIcon } from '../../../components/ui/CalendarIcon';

/**
 * TimelineSection component for the project's timeline information
 * 
 * @param {object} props - Component props
 * @param {object} props.formData - Form data object
 * @param {function} props.handleInputChange - Function to handle input changes
 * @param {boolean} props.saving - Whether the form is currently saving
 * @returns {JSX.Element} TimelineSection component
 */
const TimelineSection = ({ formData, handleInputChange, saving }) => {
  return (
    <div 
      style={{
        backgroundColor: '#1C1C1E',
        border: '1px solid #38383A'
      }}
      className="rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#BF5AF2]/10 flex items-center justify-center">
          <CalendarIconWhite className="w-5 h-5 text-[#BF5AF2]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Timeline Proyek
          </h2>
          <p className="text-sm text-[#8E8E93]">
            Jadwal waktu pelaksanaan
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Tanggal Mulai <span className="text-[#FF3B30]">*</span>
          </label>
          <DateInputWithIcon
            value={formData.timeline.startDate}
            onChange={(value) => handleInputChange('timeline.startDate', value)}
            placeholderText="Pilih tanggal mulai"
            required
            disabled={saving}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Tanggal Selesai <span className="text-[#FF3B30]">*</span>
          </label>
          <DateInputWithIcon
            value={formData.timeline.endDate}
            onChange={(value) => handleInputChange('timeline.endDate', value)}
            placeholderText="Pilih tanggal selesai"
            required
            disabled={saving}
            minDate={formData.timeline.startDate}
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;