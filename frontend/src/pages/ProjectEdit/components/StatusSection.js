import React from 'react';
import { PercentageInput } from '../../../components/ui/NumberInput';

/**
 * StatusSection component for the project's status and progress information
 * 
 * @param {object} props - Component props
 * @param {object} props.formData - Form data object
 * @param {function} props.handleInputChange - Function to handle input changes
 * @param {boolean} props.saving - Whether the form is currently saving
 * @returns {JSX.Element} StatusSection component
 */
const StatusSection = ({ formData, handleInputChange, saving }) => {
  const statusOptions = [
    { value: 'planning', label: 'Perencanaan' },
    { value: 'active', label: 'Sedang Berjalan' },
    { value: 'on_hold', label: 'Ditunda' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Rendah' },
    { value: 'medium', label: 'Sedang' },
    { value: 'high', label: 'Tinggi' },
    { value: 'urgent', label: 'Mendesak' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-blue-500';
      case 'active': return 'bg-yellow-500';
      case 'on_hold': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#FF9F0A] rounded-full"></span>
        Status & Progress
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Status Proyek
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                       focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                       bg-[#1C1C1E] text-white appearance-none"
              disabled={saving}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(formData.status)}`}></div>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Prioritas
          </label>
          <div className="relative">
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                       focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                       bg-[#1C1C1E] text-white appearance-none"
              disabled={saving}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(formData.priority)}`}></div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Progress Fisik (%)
          </label>
          <PercentageInput
            value={formData.progress}
            onChange={(value) => handleInputChange('progress', value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white placeholder-[#636366]"
            placeholder="0"
            min={0}
            max={100}
            disabled={saving}
          />
          
          {formData.progress > 0 && (
            <div className="mt-4">
              <div className="w-full bg-[#1C1C1E] border border-[#38383A] rounded-full h-2.5">
                <div 
                  className="bg-[#30D158] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${formData.progress}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-[#8E8E93] mt-1">
                {formData.progress}% selesai
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusSection;
