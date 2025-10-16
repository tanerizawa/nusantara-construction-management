import React from 'react';
import { Shield, FileText, Plus, Trash2 } from 'lucide-react';
import FormSection from '../shared/FormSection';
import FieldGroup from '../shared/FieldGroup';
import ValidationMessage from '../shared/ValidationMessage';

const LegalInfoForm = ({ formData, updateField, errors, onFieldBlur }) => {
  // Handle legal info fields
  const handleLegalInfoChange = (field, value) => {
    updateField('legalInfo', {
      ...formData.legalInfo,
      [field]: value
    });
  };

  // Handle permits array
  const addPermit = () => {
    const newPermit = {
      name: '',
      number: '',
      status: 'valid',
      issuedBy: '',
      issuedDate: '',
      expiryDate: '',
      description: ''
    };
    updateField('permits', [...(formData.permits || []), newPermit]);
  };

  const updatePermit = (index, field, value) => {
    const updatedPermits = [...(formData.permits || [])];
    updatedPermits[index] = {
      ...updatedPermits[index],
      [field]: value
    };
    updateField('permits', updatedPermits);
  };

  const removePermit = (index) => {
    const updatedPermits = formData.permits.filter((_, i) => i !== index);
    updateField('permits', updatedPermits);
  };

  return (
    <div className="space-y-6">
      {/* Company Legal Information */}
      <FormSection
        icon={Shield}
        title="Informasi Legal Perusahaan"
        description="Dokumen legal dan registrasi perusahaan"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldGroup
            label="Nomor Registrasi Perusahaan"
            htmlFor="companyRegistrationNumber"
            error={errors.legalInfo?.companyRegistrationNumber}
          >
            <input
              type="text"
              id="companyRegistrationNumber"
              value={formData.legalInfo?.companyRegistrationNumber || ''}
              onChange={(e) => handleLegalInfoChange('companyRegistrationNumber', e.target.value)}
              onBlur={() => onFieldBlur?.('legalInfo.companyRegistrationNumber')}
              placeholder="AHU-1234567.AH.01.01.YYYY"
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] font-mono"
            />
            <ValidationMessage error={errors.legalInfo?.companyRegistrationNumber} />
          </FieldGroup>

          <FieldGroup
            label="NPWP (Nomor Pokok Wajib Pajak)"
            htmlFor="taxIdentificationNumber"
            error={errors.legalInfo?.taxIdentificationNumber}
          >
            <input
              type="text"
              id="taxIdentificationNumber"
              value={formData.legalInfo?.taxIdentificationNumber || ''}
              onChange={(e) => handleLegalInfoChange('taxIdentificationNumber', e.target.value)}
              onBlur={() => onFieldBlur?.('legalInfo.taxIdentificationNumber')}
              placeholder="01.123.456.7-890.000"
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] font-mono"
            />
            <ValidationMessage error={errors.legalInfo?.taxIdentificationNumber} />
          </FieldGroup>

          <FieldGroup
            label="Nomor Izin Usaha (NIB)"
            htmlFor="businessLicenseNumber"
            error={errors.legalInfo?.businessLicenseNumber}
          >
            <input
              type="text"
              id="businessLicenseNumber"
              value={formData.legalInfo?.businessLicenseNumber || ''}
              onChange={(e) => handleLegalInfoChange('businessLicenseNumber', e.target.value)}
              onBlur={() => onFieldBlur?.('legalInfo.businessLicenseNumber')}
              placeholder="NIB-1234567890123456"
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] font-mono"
            />
            <ValidationMessage error={errors.legalInfo?.businessLicenseNumber} />
          </FieldGroup>

          <FieldGroup
            label="Nomor Registrasi PPN (PKP)"
            htmlFor="vatRegistrationNumber"
            error={errors.legalInfo?.vatRegistrationNumber}
          >
            <input
              type="text"
              id="vatRegistrationNumber"
              value={formData.legalInfo?.vatRegistrationNumber || ''}
              onChange={(e) => handleLegalInfoChange('vatRegistrationNumber', e.target.value)}
              onBlur={() => onFieldBlur?.('legalInfo.vatRegistrationNumber')}
              placeholder="PKP-01234567890"
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] font-mono"
            />
            <ValidationMessage error={errors.legalInfo?.vatRegistrationNumber} />
          </FieldGroup>
        </div>

        <div className="mt-6">
          <FieldGroup
            label="Akta Pendirian"
            htmlFor="articlesOfIncorporation"
            error={errors.legalInfo?.articlesOfIncorporation}
            hint="Detail lengkap akta pendirian perusahaan"
          >
            <textarea
              id="articlesOfIncorporation"
              value={formData.legalInfo?.articlesOfIncorporation || ''}
              onChange={(e) => handleLegalInfoChange('articlesOfIncorporation', e.target.value)}
              onBlur={() => onFieldBlur?.('legalInfo.articlesOfIncorporation')}
              placeholder="Akta Pendirian Perusahaan No. ... tanggal ..., dibuat di hadapan Notaris ..."
              rows="4"
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] resize-none"
            />
            <ValidationMessage error={errors.legalInfo?.articlesOfIncorporation} />
          </FieldGroup>
        </div>
      </FormSection>

      {/* Permits and Licenses */}
      <FormSection
        icon={FileText}
        title="Izin & Perizinan"
        description="Daftar izin dan lisensi yang dimiliki perusahaan"
      >
        <div className="space-y-4">
          {(formData.permits || []).map((permit, index) => (
            <div
              key={index}
              className="bg-[#1C1C1E] border border-[#38383A] rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-white">Izin #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removePermit(index)}
                  className="p-1 text-[#FF453A] hover:bg-[#FF453A]/10 rounded transition-colors"
                  title="Hapus izin"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                    Nama Izin *
                  </label>
                  <input
                    type="text"
                    value={permit.name || ''}
                    onChange={(e) => updatePermit(index, 'name', e.target.value)}
                    placeholder="Izin Usaha Konstruksi"
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                    Nomor Izin
                  </label>
                  <input
                    type="text"
                    value={permit.number || ''}
                    onChange={(e) => updatePermit(index, 'number', e.target.value)}
                    placeholder="IUK-123456"
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                    Status *
                  </label>
                  <select
                    value={permit.status || 'valid'}
                    onChange={(e) => updatePermit(index, 'status', e.target.value)}
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                  >
                    <option value="valid">Berlaku</option>
                    <option value="expired">Kadaluarsa</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                    Diterbitkan Oleh
                  </label>
                  <input
                    type="text"
                    value={permit.issuedBy || ''}
                    onChange={(e) => updatePermit(index, 'issuedBy', e.target.value)}
                    placeholder="LPJK"
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                    Tanggal Terbit
                  </label>
                  <input
                    type="date"
                    value={permit.issuedDate || ''}
                    onChange={(e) => updatePermit(index, 'issuedDate', e.target.value)}
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                    Tanggal Kadaluarsa
                  </label>
                  <input
                    type="date"
                    value={permit.expiryDate || ''}
                    onChange={(e) => updatePermit(index, 'expiryDate', e.target.value)}
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={permit.description || ''}
                    onChange={(e) => updatePermit(index, 'description', e.target.value)}
                    placeholder="Deskripsi singkat tentang izin ini"
                    rows="2"
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] resize-none"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addPermit}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#1C1C1E] border-2 border-dashed border-[#38383A] rounded-lg text-[#8E8E93] hover:border-[#0A84FF] hover:text-[#0A84FF] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Izin</span>
          </button>
        </div>
      </FormSection>
    </div>
  );
};

export default LegalInfoForm;
