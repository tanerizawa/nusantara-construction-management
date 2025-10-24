import React from 'react';
import { DateInputWithIcon } from '../../../components/ui/CalendarIcon';

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
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#BF5AF2] rounded-full"></span>
        Timeline Proyek
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Tanggal Mulai <span className="text-red-500">*</span>
          </label>
          <DateInputWithIcon
            value={formData.timeline.startDate}
            onChange={(e) => handleInputChange('timeline.startDate', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            placeholderText="Pilih tanggal mulai"
            required
            disabled={saving}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Tanggal Selesai <span className="text-red-500">*</span>
          </label>
          <DateInputWithIcon
            value={formData.timeline.endDate}
            onChange={(e) => handleInputChange('timeline.endDate', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            placeholderText="Pilih tanggal selesai"
            required
            disabled={saving}
            min={formData.timeline.startDate || ''}
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
