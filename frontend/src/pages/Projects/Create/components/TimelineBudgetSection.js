import React from 'react';
import { DateInputWithIcon } from '../../../../components/ui/CalendarIcon';
import { CurrencyInput } from '../../../../components/ui/NumberInput';

/**
 * Timeline & Budget Section
 * Start date, end date, contract value
 */
const TimelineBudgetSection = ({ formData, errors, handleInputChange }) => {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#080b13]/85 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="mb-5">
        <p className="eyebrow-label text-white/60">Step 4</p>
        <h2 className="text-xl font-semibold text-white">Timeline & Budget</h2>
        <p className="text-sm text-white/50">Tanggal mulai/selesai dan nilai kontrak digunakan untuk perencanaan cash flow.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Tanggal Mulai *
          </label>
          <DateInputWithIcon
            value={formData.timeline.startDate}
            onChange={(e) => handleInputChange('timeline.startDate', e.target.value)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:ring-0
                      ${errors['timeline.startDate'] ? 'border-[#fb7185] bg-[#1c0f13]' : 'border-white/10 bg-white/5'}`}
            placeholder="Pilih Tanggal Mulai"
          />
          {errors['timeline.startDate'] && (
            <p className="mt-1 text-sm text-[#FF3B30]">{errors['timeline.startDate']}</p>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Tanggal Selesai *
          </label>
          <DateInputWithIcon
            value={formData.timeline.endDate}
            onChange={(e) => handleInputChange('timeline.endDate', e.target.value)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:ring-0
                      ${errors['timeline.endDate'] ? 'border-[#fb7185] bg-[#1c0f13]' : 'border-white/10 bg-white/5'}`}
            placeholder="Pilih Tanggal Selesai"
          />
          {errors['timeline.endDate'] && (
            <p className="mt-1 text-sm text-[#FF3B30]">{errors['timeline.endDate']}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Nilai Kontrak *
          </label>
          <CurrencyInput
            value={formData.budget.contractValue}
            onChange={(value) => handleInputChange('budget.contractValue', value)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:ring-0
                      ${errors['budget.contractValue'] ? 'border-[#fb7185] bg-[#1c0f13]' : 'border-white/10 bg-white/5'}`}
            placeholder="0"
            min={1}
          />
          {errors['budget.contractValue'] && (
            <p className="mt-1 text-sm text-[#FF3B30]">{errors['budget.contractValue']}</p>
          )}
          <p className="mt-1 text-sm text-white/50">
            Masukkan nilai dalam Rupiah (contoh: 500.000.000 untuk 500 juta)
          </p>
        </div>
      </div>
    </section>
  );
};

export default TimelineBudgetSection;
