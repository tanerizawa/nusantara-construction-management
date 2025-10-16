import React from 'react';
import { Users } from 'lucide-react';

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
    <div 
      style={{
        backgroundColor: '#1C1C1E',
        border: '1px solid #38383A'
      }}
      className="rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#30D158]/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-[#30D158]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Informasi Kontak Klien
          </h2>
          <p className="text-sm text-[#8E8E93]">
            Data kontak PIC klien
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Nama Kontak
          </label>
          <input
            type="text"
            value={formData.client.contact}
            onChange={(e) => handleInputChange('client.contact', e.target.value)}
            style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A',
              color: 'white'
            }}
            className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
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
            style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A',
              color: 'white'
            }}
            className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
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
            style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A',
              color: 'white'
            }}
            className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
            placeholder="Email kontak"
            disabled={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoSection;