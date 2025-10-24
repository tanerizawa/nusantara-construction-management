import React from 'react';
import { CurrencyInput } from '../../../components/ui/NumberInput';

/**
 * FinancialSection component for the project's budget information
 * 
 * @param {object} props - Component props
 * @param {object} props.formData - Form data object
 * @param {function} props.handleInputChange - Function to handle input changes
 * @param {boolean} props.saving - Whether the form is currently saving
 * @returns {JSX.Element} FinancialSection component
 */
const FinancialSection = ({ formData, handleInputChange, saving }) => {
  const handleCurrencyChange = (value) => {
    handleInputChange('budget.contractValue', value);
  };
  
  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#32D74B] rounded-full"></span>
        Informasi Keuangan
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Nilai Kontrak <span className="text-red-500">*</span>
          </label>
          <CurrencyInput
            value={formData.budget.contractValue}
            onChange={handleCurrencyChange}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white placeholder-[#636366]"
            placeholder="0"
            required
            disabled={saving}
          />
          <p className="mt-2 text-xs text-[#8E8E93]">
            Nilai total kontrak proyek (dalam Rupiah)
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialSection;