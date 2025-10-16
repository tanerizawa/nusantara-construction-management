import React from 'react';
import { FileText } from 'lucide-react';
import { NumberInput } from '../../../components/ui/NumberInput';
import { SPECIALIZATIONS } from '../utils';

/**
 * Basic information section of the subsidiary create form
 * 
 * @param {Object} props Component props
 * @param {Object} props.formData Form data state
 * @param {Function} props.handleChange Form input change handler
 * @returns {JSX.Element} Basic info form section
 */
const BasicInfoSection = ({ formData, handleChange }) => {
  return (
    <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: "#FFFFFF" }}>
        <FileText size={20} />
        Informasi Dasar
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Nama Anak Usaha *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="PT. Konstruksi Nusantara"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Kode Anak Usaha *
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="KN001"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Spesialisasi *
          </label>
          <select
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
          >
            <option value="">Pilih Spesialisasi</option>
            {SPECIALIZATIONS.map(spec => (
              <option key={spec.value} value={spec.value}>
                {spec.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            style={{ 
              backgroundColor: "#1C1C1E", 
              border: "1px solid #38383A", 
              color: "#FFFFFF" 
            }}
          >
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Tahun Berdiri
          </label>
          <NumberInput
            name="establishedYear"
            value={formData.establishedYear}
            onChange={(value) => handleChange({ target: { name: 'establishedYear', value } })}
            min={1900}
            max={new Date().getFullYear()}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="e.g. 2015"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Jumlah Karyawan
          </label>
          <NumberInput
            name="employeeCount"
            value={formData.employeeCount}
            onChange={(value) => handleChange({ target: { name: 'employeeCount', value } })}
            min={0}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="e.g. 50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Deskripsi
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="Deskripsi tentang anak usaha..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;