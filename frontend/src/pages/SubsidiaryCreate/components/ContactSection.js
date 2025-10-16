import React from 'react';
import { Phone, Mail } from 'lucide-react';

/**
 * Contact information section of the subsidiary create form
 * 
 * @param {Object} props Component props
 * @param {Object} props.formData Form data state
 * @param {Function} props.handleChange Form input change handler
 * @returns {JSX.Element} Contact info form section
 */
const ContactSection = ({ formData, handleChange }) => {
  return (
    <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: "#FFFFFF" }}>
        <Phone size={20} />
        Informasi Kontak
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            No. Telepon
          </label>
          <input
            type="tel"
            name="contactInfo.phone"
            value={formData.contactInfo.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="+62 21 1234 5678"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Email
          </label>
          <input
            type="email"
            name="contactInfo.email"
            value={formData.contactInfo.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="info@konstruksinusantara.co.id"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Website
          </label>
          <input
            type="url"
            name="contactInfo.website"
            value={formData.contactInfo.website}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="https://konstruksinusantara.co.id"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Fax
          </label>
          <input
            type="text"
            name="contactInfo.fax"
            value={formData.contactInfo.fax}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="+62 21 1234 5679"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactSection;