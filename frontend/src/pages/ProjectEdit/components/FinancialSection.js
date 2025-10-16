import React from 'react';
import { DollarSign } from 'lucide-react';
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
    <div 
      style={{
        backgroundColor: '#1C1C1E',
        border: '1px solid #38383A'
      }}
      className="rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#32D74B]/10 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-[#32D74B]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Informasi Keuangan
          </h2>
          <p className="text-sm text-[#8E8E93]">
            Anggaran dan nilai kontrak
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Nilai Kontrak <span className="text-[#FF3B30]">*</span>
          </label>
          <CurrencyInput
            value={formData.budget.contractValue}
            onChange={handleCurrencyChange}
            style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A',
              color: 'white'
            }}
            className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
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