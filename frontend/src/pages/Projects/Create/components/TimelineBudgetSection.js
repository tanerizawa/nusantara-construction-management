import React from 'react';
import { DateInputWithIcon } from '../../../../components/ui/CalendarIcon';
import { CurrencyInput } from '../../../../components/ui/NumberInput';

/**
 * Timeline & Budget Section
 * Start date, end date, contract value
 */
const TimelineBudgetSection = ({ formData, errors, handleInputChange }) => {
  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#0A84FF] rounded-full"></span>
        Timeline & Budget
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Tanggal Mulai *
          </label>
          <DateInputWithIcon
            value={formData.timeline.startDate}
            onChange={(e) => handleInputChange('timeline.startDate', e.target.value)}
            className={`w-full pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                      ${errors['timeline.startDate'] ? 'border-[#FF3B30]' : 'border-[#38383A]'}
                      bg-[#1C1C1E] text-white`}
            placeholder="Pilih Tanggal Mulai"
          />
          {errors['timeline.startDate'] && (
            <p className="mt-1 text-sm text-[#FF3B30]">{errors['timeline.startDate']}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Tanggal Selesai *
          </label>
          <DateInputWithIcon
            value={formData.timeline.endDate}
            onChange={(e) => handleInputChange('timeline.endDate', e.target.value)}
            className={`w-full pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                      ${errors['timeline.endDate'] ? 'border-[#FF3B30]' : 'border-[#38383A]'}
                      bg-[#1C1C1E] text-white`}
            placeholder="Pilih Tanggal Selesai"
          />
          {errors['timeline.endDate'] && (
            <p className="mt-1 text-sm text-[#FF3B30]">{errors['timeline.endDate']}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Nilai Kontrak *
          </label>
          <CurrencyInput
            value={formData.budget.contractValue}
            onChange={(value) => handleInputChange('budget.contractValue', value)}
            className={`w-full pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                      ${errors['budget.contractValue'] ? 'border-[#FF3B30]' : 'border-[#38383A]'}
                      bg-[#1C1C1E] text-white`}
            placeholder="0"
            min={1}
          />
          {errors['budget.contractValue'] && (
            <p className="mt-1 text-sm text-[#FF3B30]">{errors['budget.contractValue']}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Masukkan nilai dalam Rupiah (contoh: 500.000.000 untuk 500 juta)
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelineBudgetSection;
