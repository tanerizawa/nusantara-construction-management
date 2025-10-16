import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import FormSection from '../shared/FormSection';
import FieldGroup from '../shared/FieldGroup';
import ValidationMessage from '../shared/ValidationMessage';

const FinancialInfoForm = ({ formData, updateField, errors, onFieldBlur }) => {
  // Handle financial info fields
  const handleFinancialInfoChange = (field, value) => {
    updateField('financialInfo', {
      ...formData.financialInfo,
      [field]: value
    });
  };

  // Handle profile info fields
  const handleProfileInfoChange = (field, value) => {
    updateField('profileInfo', {
      ...formData.profileInfo,
      [field]: value
    });
  };

  // Calculate utilization percentage
  const calculateUtilization = () => {
    const authorized = parseFloat(formData.financialInfo?.authorizedCapital) || 0;
    const paidUp = parseFloat(formData.financialInfo?.paidUpCapital) || 0;
    if (authorized > 0) {
      return ((paidUp / authorized) * 100).toFixed(1);
    }
    return 0;
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const parseCurrency = (value) => {
    return value.replace(/\D/g, '');
  };

  return (
    <div className="space-y-6">
      {/* Capital Structure */}
      <FormSection
        icon={DollarSign}
        title="Struktur Modal"
        description="Informasi modal dasar dan modal disetor perusahaan"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldGroup
            label="Modal Dasar"
            htmlFor="authorizedCapital"
            error={errors.financialInfo?.authorizedCapital}
            hint="Dalam Rupiah (IDR)"
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#636366]">
                Rp
              </span>
              <input
                type="text"
                id="authorizedCapital"
                value={formatCurrency(formData.financialInfo?.authorizedCapital || '')}
                onChange={(e) => handleFinancialInfoChange('authorizedCapital', parseCurrency(e.target.value))}
                onBlur={() => onFieldBlur?.('financialInfo.authorizedCapital')}
                placeholder="10.000.000.000"
                className="w-full pl-10 pr-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>
            <ValidationMessage error={errors.financialInfo?.authorizedCapital} />
          </FieldGroup>

          <FieldGroup
            label="Modal Disetor"
            htmlFor="paidUpCapital"
            error={errors.financialInfo?.paidUpCapital}
            hint="Dalam Rupiah (IDR)"
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#636366]">
                Rp
              </span>
              <input
                type="text"
                id="paidUpCapital"
                value={formatCurrency(formData.financialInfo?.paidUpCapital || '')}
                onChange={(e) => handleFinancialInfoChange('paidUpCapital', parseCurrency(e.target.value))}
                onBlur={() => onFieldBlur?.('financialInfo.paidUpCapital')}
                placeholder="2.500.000.000"
                className="w-full pl-10 pr-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>
            <ValidationMessage error={errors.financialInfo?.paidUpCapital} />
          </FieldGroup>

          <FieldGroup
            label="Mata Uang"
            htmlFor="currency"
            error={errors.financialInfo?.currency}
          >
            <select
              id="currency"
              value={formData.financialInfo?.currency || 'IDR'}
              onChange={(e) => handleFinancialInfoChange('currency', e.target.value)}
              onBlur={() => onFieldBlur?.('financialInfo.currency')}
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            >
              <option value="IDR">Indonesian Rupiah (IDR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="SGD">Singapore Dollar (SGD)</option>
            </select>
            <ValidationMessage error={errors.financialInfo?.currency} />
          </FieldGroup>

          <FieldGroup
            label="Akhir Tahun Fiskal"
            htmlFor="fiscalYearEnd"
            error={errors.financialInfo?.fiscalYearEnd}
            hint="Contoh: 31 Desember"
          >
            <input
              type="text"
              id="fiscalYearEnd"
              value={formData.financialInfo?.fiscalYearEnd || ''}
              onChange={(e) => handleFinancialInfoChange('fiscalYearEnd', e.target.value)}
              onBlur={() => onFieldBlur?.('financialInfo.fiscalYearEnd')}
              placeholder="31 Desember"
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
            <ValidationMessage error={errors.financialInfo?.fiscalYearEnd} />
          </FieldGroup>
        </div>

        {/* Capital Utilization Preview */}
        {formData.financialInfo?.authorizedCapital && formData.financialInfo?.paidUpCapital && (
          <div className="mt-6 p-4 bg-[#1C1C1E] border border-[#38383A] rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-4 w-4 text-[#0A84FF]" />
              <h4 className="text-sm font-semibold text-white">Utilisasi Modal</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#8E8E93]">Persentase Modal Disetor</span>
                <span className="text-white font-semibold">{calculateUtilization()}%</span>
              </div>
              <div className="w-full bg-[#38383A] rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    calculateUtilization() >= 80 ? 'bg-[#30D158]' :
                    calculateUtilization() >= 50 ? 'bg-[#0A84FF]' :
                    calculateUtilization() >= 25 ? 'bg-[#FF9F0A]' :
                    'bg-[#FF453A]'
                  }`}
                  style={{ width: `${Math.min(calculateUtilization(), 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#636366]">
                  Sisa: Rp {formatCurrency(
                    (parseFloat(formData.financialInfo.authorizedCapital) || 0) -
                    (parseFloat(formData.financialInfo.paidUpCapital) || 0)
                  )}
                </span>
                <span className="text-[#636366]">
                  {(100 - calculateUtilization()).toFixed(1)}% belum disetor
                </span>
              </div>
            </div>
          </div>
        )}
      </FormSection>

      {/* Industry Classification */}
      <FormSection
        icon={DollarSign}
        title="Klasifikasi Industri"
        description="Kategori dan klasifikasi bisnis perusahaan"
      >
        <FieldGroup
          label="Klasifikasi Industri"
          htmlFor="industryClassification"
          error={errors.profileInfo?.industryClassification}
          hint="Contoh: F41001 - Konstruksi Gedung Untuk Tempat Tinggal"
        >
          <input
            type="text"
            id="industryClassification"
            value={formData.profileInfo?.industryClassification || ''}
            onChange={(e) => handleProfileInfoChange('industryClassification', e.target.value)}
            onBlur={() => onFieldBlur?.('profileInfo.industryClassification')}
            placeholder="F41001 - Konstruksi Gedung Untuk Tempat Tinggal"
            className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
          />
          <ValidationMessage error={errors.profileInfo?.industryClassification} />
        </FieldGroup>

        <FieldGroup
          label="Deskripsi Bisnis"
          htmlFor="businessDescription"
          error={errors.profileInfo?.businessDescription}
          hint="Deskripsi detail tentang fokus bisnis dan layanan perusahaan"
        >
          <textarea
            id="businessDescription"
            value={formData.profileInfo?.businessDescription || ''}
            onChange={(e) => handleProfileInfoChange('businessDescription', e.target.value)}
            onBlur={() => onFieldBlur?.('profileInfo.businessDescription')}
            placeholder="Perusahaan konstruksi yang berfokus pada pembangunan gedung perkantoran modern, pusat perbelanjaan, dan fasilitas komersial lainnya..."
            rows="4"
            className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] resize-none"
          />
          <ValidationMessage error={errors.profileInfo?.businessDescription} />
        </FieldGroup>
      </FormSection>
    </div>
  );
};

export default FinancialInfoForm;
