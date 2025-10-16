import React from 'react';
import { Users, User, Plus, Trash2, Globe } from 'lucide-react';
import FormSection from '../shared/FormSection';
import FieldGroup from '../shared/FieldGroup';
import ValidationMessage from '../shared/ValidationMessage';

const GovernanceForm = ({ formData, updateField, errors, onFieldBlur }) => {
  // Handle board of directors array
  const addDirector = () => {
    const newDirector = {
      name: '',
      position: '',
      email: '',
      phone: '',
      appointmentDate: '',
      endDate: '',
      isActive: true
    };
    updateField('boardOfDirectors', [...(formData.boardOfDirectors || []), newDirector]);
  };

  const updateDirector = (index, field, value) => {
    const updatedDirectors = [...(formData.boardOfDirectors || [])];
    updatedDirectors[index] = {
      ...updatedDirectors[index],
      [field]: value
    };
    updateField('boardOfDirectors', updatedDirectors);
  };

  const removeDirector = (index) => {
    const updatedDirectors = formData.boardOfDirectors.filter((_, i) => i !== index);
    updateField('boardOfDirectors', updatedDirectors);
  };

  // Handle social media object
  const handleSocialMediaChange = (platform, value) => {
    const currentSocialMedia = formData.profileInfo?.socialMedia || {};
    if (value.trim() === '') {
      // Remove platform if value is empty
      const { [platform]: removed, ...rest } = currentSocialMedia;
      updateField('profileInfo', {
        ...formData.profileInfo,
        socialMedia: rest
      });
    } else {
      updateField('profileInfo', {
        ...formData.profileInfo,
        socialMedia: {
          ...currentSocialMedia,
          [platform]: value
        }
      });
    }
  };

  // Handle profile info fields
  const handleProfileInfoChange = (field, value) => {
    updateField('profileInfo', {
      ...formData.profileInfo,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Board of Directors */}
      <FormSection
        icon={Users}
        title="Dewan Direksi"
        description="Struktur kepemimpinan dan manajemen perusahaan"
      >
        <div className="space-y-4">
          {(formData.boardOfDirectors || []).map((director, index) => (
            <div
              key={index}
              className="bg-[#1C1C1E] border border-[#38383A] rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#0A84FF]/20 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-[#0A84FF]" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">Direktur #{index + 1}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => removeDirector(index)}
                  className="p-1 text-[#FF453A] hover:bg-[#FF453A]/10 rounded transition-colors"
                  title="Hapus direktur"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={director.name || ''}
                    onChange={(e) => updateDirector(index, 'name', e.target.value)}
                    placeholder="Budi Santoso, S.T., M.T."
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                    Posisi/Jabatan *
                  </label>
                  <input
                    type="text"
                    value={director.position || ''}
                    onChange={(e) => updateDirector(index, 'position', e.target.value)}
                    placeholder="Direktur Utama"
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={director.email || ''}
                    onChange={(e) => updateDirector(index, 'email', e.target.value)}
                    placeholder="budi.santoso@company.com"
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                    Telepon
                  </label>
                  <input
                    type="tel"
                    value={director.phone || ''}
                    onChange={(e) => updateDirector(index, 'phone', e.target.value)}
                    placeholder="+62-812-3456-7890"
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                    Tanggal Penunjukan
                  </label>
                  <input
                    type="date"
                    value={director.appointmentDate || ''}
                    onChange={(e) => updateDirector(index, 'appointmentDate', e.target.value)}
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                    Tanggal Berakhir
                  </label>
                  <input
                    type="date"
                    value={director.endDate || ''}
                    onChange={(e) => updateDirector(index, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={director.isActive !== false}
                      onChange={(e) => updateDirector(index, 'isActive', e.target.checked)}
                      className="w-4 h-4 rounded border-[#38383A] bg-[#2C2C2E] text-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-0"
                    />
                    <span className="text-sm text-white">Status Aktif</span>
                  </label>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addDirector}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#1C1C1E] border-2 border-dashed border-[#38383A] rounded-lg text-[#8E8E93] hover:border-[#0A84FF] hover:text-[#0A84FF] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Direktur</span>
          </button>
        </div>
      </FormSection>

      {/* Company Profile */}
      <FormSection
        icon={Globe}
        title="Profil Perusahaan"
        description="Website dan informasi tambahan perusahaan"
      >
        <div className="space-y-6">
          <FieldGroup
            label="Website Perusahaan"
            htmlFor="website"
            error={errors.profileInfo?.website}
            hint="URL lengkap website perusahaan"
          >
            <input
              type="url"
              id="website"
              value={formData.profileInfo?.website || ''}
              onChange={(e) => handleProfileInfoChange('website', e.target.value)}
              onBlur={() => onFieldBlur?.('profileInfo.website')}
              placeholder="https://company.co.id"
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
            <ValidationMessage error={errors.profileInfo?.website} />
          </FieldGroup>

          <FieldGroup
            label="Ukuran Perusahaan"
            htmlFor="companySize"
            error={errors.profileInfo?.companySize}
          >
            <select
              id="companySize"
              value={formData.profileInfo?.companySize || ''}
              onChange={(e) => handleProfileInfoChange('companySize', e.target.value)}
              onBlur={() => onFieldBlur?.('profileInfo.companySize')}
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            >
              <option value="">Pilih ukuran perusahaan</option>
              <option value="small">Small (1-50 karyawan)</option>
              <option value="medium">Medium (51-250 karyawan)</option>
              <option value="large">Large (251+ karyawan)</option>
            </select>
            <ValidationMessage error={errors.profileInfo?.companySize} />
          </FieldGroup>
        </div>
      </FormSection>

      {/* Social Media */}
      <FormSection
        icon={Globe}
        title="Media Sosial"
        description="Akun media sosial resmi perusahaan"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldGroup
            label="LinkedIn"
            htmlFor="linkedin"
          >
            <input
              type="url"
              id="linkedin"
              value={formData.profileInfo?.socialMedia?.linkedin || ''}
              onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/company/..."
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </FieldGroup>

          <FieldGroup
            label="Facebook"
            htmlFor="facebook"
          >
            <input
              type="url"
              id="facebook"
              value={formData.profileInfo?.socialMedia?.facebook || ''}
              onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </FieldGroup>

          <FieldGroup
            label="Instagram"
            htmlFor="instagram"
          >
            <input
              type="url"
              id="instagram"
              value={formData.profileInfo?.socialMedia?.instagram || ''}
              onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </FieldGroup>

          <FieldGroup
            label="YouTube"
            htmlFor="youtube"
          >
            <input
              type="url"
              id="youtube"
              value={formData.profileInfo?.socialMedia?.youtube || ''}
              onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
              placeholder="https://youtube.com/@..."
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </FieldGroup>

          <FieldGroup
            label="Twitter/X"
            htmlFor="twitter"
          >
            <input
              type="url"
              id="twitter"
              value={formData.profileInfo?.socialMedia?.twitter || ''}
              onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
              placeholder="https://twitter.com/..."
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </FieldGroup>

          <FieldGroup
            label="TikTok"
            htmlFor="tiktok"
          >
            <input
              type="url"
              id="tiktok"
              value={formData.profileInfo?.socialMedia?.tiktok || ''}
              onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
              placeholder="https://tiktok.com/@..."
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </FieldGroup>
        </div>
      </FormSection>
    </div>
  );
};

export default GovernanceForm;
