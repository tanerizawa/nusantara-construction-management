import React from 'react';

/**
 * Client Information Section
 * Company name, contact person, phone, email
 */
const ClientInfoSection = ({ formData, errors, handleInputChange }) => {
  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#0A84FF] rounded-full"></span>
        Informasi Klien
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Nama Perusahaan *
          </label>
          <input
            type="text"
            value={formData.client.company}
            onChange={(e) => handleInputChange('client.company', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                      ${errors['client.company'] ? 'border-[#FF3B30]' : 'border-[#38383A]'}
                      bg-[#1C1C1E] text-white`}
            placeholder="Nama perusahaan klien"
          />
          {errors['client.company'] && (
            <p className="mt-1 text-sm text-[#FF3B30]">{errors['client.company']}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Kontak Person
          </label>
          <input
            type="text"
            value={formData.client.contact}
            onChange={(e) => handleInputChange('client.contact', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            placeholder="Nama kontak person"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Telepon Klien
          </label>
          <input
            type="tel"
            value={formData.client.phone}
            onChange={(e) => handleInputChange('client.phone', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            placeholder="081234567890"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Email Klien
          </label>
          <input
            type="email"
            value={formData.client.email}
            onChange={(e) => handleInputChange('client.email', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            placeholder="email@client.com"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoSection;
