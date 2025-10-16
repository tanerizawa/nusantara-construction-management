import React from 'react';
import { Users } from 'lucide-react';
import { CalendarIconWhite } from '../../../components/ui/CalendarIcon';

/**
 * Legal information section of the subsidiary create form
 * 
 * @param {Object} props Component props
 * @param {Object} props.formData Form data state
 * @param {Function} props.handleChange Form input change handler
 * @returns {JSX.Element} Legal info form section
 */
const LegalSection = ({ formData, handleChange }) => {
  return (
    <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: "#FFFFFF" }}>
        <Users size={20} />
        Informasi Legal
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Nomor Registrasi Perusahaan
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="123.456.789-0.123.456"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            NPWP
          </label>
          <input
            type="text"
            name="taxNumber"
            value={formData.taxNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="12.345.678.9-012.000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Nama Direktur
          </label>
          <input
            type="text"
            name="legalInfo.directorName"
            value={formData.legalInfo.directorName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Nama Komisaris
          </label>
          <input
            type="text"
            name="legalInfo.commissionerName"
            value={formData.legalInfo.commissionerName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="Jane Smith"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Nama Notaris
          </label>
          <input
            type="text"
            name="legalInfo.notaryName"
            value={formData.legalInfo.notaryName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="Notaris Budi"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Nomor Akta Notaris
          </label>
          <input
            type="text"
            name="legalInfo.notaryNumber"
            value={formData.legalInfo.notaryNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="123/NOT/2023"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Tanggal Akta Notaris
          </label>
          <div className="relative">
            <input
              type="date"
              name="legalInfo.notaryDate"
              value={formData.legalInfo.notaryDate}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              style={{
                backgroundColor: "#1C1C1E",
                border: "1px solid #38383A",
                color: "#FFFFFF"
              }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <CalendarIconWhite />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalSection;