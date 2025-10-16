import React from 'react';
import { MapPin } from 'lucide-react';

/**
 * Address section of the subsidiary create form
 * 
 * @param {Object} props Component props
 * @param {Object} props.formData Form data state
 * @param {Function} props.handleChange Form input change handler
 * @returns {JSX.Element} Address form section
 */
const AddressSection = ({ formData, handleChange }) => {
  return (
    <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: "#FFFFFF" }}>
        <MapPin size={20} />
        Alamat
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Alamat Jalan
          </label>
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="Jl. Nusantara No. 123"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Kota
          </label>
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="Jakarta"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Provinsi
          </label>
          <input
            type="text"
            name="address.province"
            value={formData.address.province}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="DKI Jakarta"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Kode Pos
          </label>
          <input
            type="text"
            name="address.postalCode"
            value={formData.address.postalCode}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="12345"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Negara
          </label>
          <input
            type="text"
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="Indonesia"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressSection;