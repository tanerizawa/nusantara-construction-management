import React from 'react';
import { Globe } from 'lucide-react';
import { NumberInput } from '../../../components/ui/NumberInput';

/**
 * Financial information section of the subsidiary create form
 * 
 * @param {Object} props Component props
 * @param {Object} props.formData Form data state
 * @param {Function} props.handleChange Form input change handler
 * @returns {JSX.Element} Financial info form section
 */
const FinancialSection = ({ formData, handleChange }) => {
  return (
    <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: "#FFFFFF" }}>
        <Globe size={20} />
        Informasi Keuangan
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Modal Disetor (Rp)
          </label>
          <NumberInput
            name="financialInfo.paidUpCapital"
            value={formData.financialInfo.paidUpCapital}
            onChange={(value) => handleChange({ target: { name: 'financialInfo.paidUpCapital', value } })}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="e.g. 1000000000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Modal Dasar (Rp)
          </label>
          <NumberInput
            name="financialInfo.authorizedCapital"
            value={formData.financialInfo.authorizedCapital}
            onChange={(value) => handleChange({ target: { name: 'financialInfo.authorizedCapital', value } })}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="e.g. 4000000000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Nama Bank
          </label>
          <input
            type="text"
            name="financialInfo.bankName"
            value={formData.financialInfo.bankName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="e.g. Bank Central Asia"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
            Nomor Rekening Bank
          </label>
          <input
            type="text"
            name="financialInfo.bankAccount"
            value={formData.financialInfo.bankAccount}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
            placeholder="e.g. 1234567890"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialSection;