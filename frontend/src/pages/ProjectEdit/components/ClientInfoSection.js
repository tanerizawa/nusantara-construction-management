import React from 'react';

/**
 * ClientInfoSection component for the project's client contact information
 * 
 * @param {object} props - Component props
 * @param {object} props.formData - Form data object
 * @param {function} props.handleInputChange - Function to handle input changes
 * @param {boolean} props.saving - Whether the form is currently saving
 * @returns {JSX.Element} ClientInfoSection component
 */
const ClientInfoSection = ({ formData, handleInputChange, saving }) => {
  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#30D158] rounded-full"></span>
        Informasi Kontak Klien
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Nama Kontak
          </label>
          <input
            type="text"
            value={formData.client.contact}
            onChange={(e) => handleInputChange('client.contact', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white placeholder-[#636366]"
            placeholder="Nama lengkap contact person"
            disabled={saving}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Nomor Telepon
          </label>
          <input
            type="tel"
            value={formData.client.phone}
            onChange={(e) => handleInputChange('client.phone', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white placeholder-[#636366]"
            placeholder="Nomor telepon kontak"
            disabled={saving}
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.client.email}
            onChange={(e) => handleInputChange('client.email', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white placeholder-[#636366]"
            placeholder="Email kontak"
            disabled={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoSection;