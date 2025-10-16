import React, { useState } from 'react';
import { Building, MapPin, Phone, Mail, Upload, X, Image as ImageIcon } from 'lucide-react';
import FormSection from '../shared/FormSection';
import FieldGroup from '../shared/FieldGroup';
import ValidationMessage from '../shared/ValidationMessage';
import { formConfig } from '../../config/formConfig';
import axios from 'axios';
import { API_URL } from '../../../../utils/config';

const BasicInfoForm = ({ 
  formData, 
  updateField, 
  errors = {},
  onFieldBlur 
}) => {
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Format file tidak valid. Gunakan JPG, PNG, SVG, atau WebP.');
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setUploadError('Ukuran file maksimal 2MB.');
        return;
      }

      setLogoFile(file);
      setUploadError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile || !formData.id) return;

    setUploading(true);
    setUploadError(null);

    const uploadFormData = new FormData();
    uploadFormData.append('logo', logoFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/subsidiaries/${formData.id}/logo`,
        uploadFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        // Update form data with new logo path
        updateField('logo', response.data.data.logo);
        setLogoFile(null);
        setLogoPreview(null);
        alert('Logo berhasil diunggah!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.response?.data?.message || 'Gagal mengunggah logo');
    } finally {
      setUploading(false);
    }
  };

  const handleLogoDelete = async () => {
    if (!formData.id || !formData.logo) return;

    if (!window.confirm('Hapus logo ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_URL}/subsidiaries/${formData.id}/logo`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        updateField('logo', null);
        alert('Logo berhasil dihapus!');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || 'Gagal menghapus logo');
    }
  };

  const cancelPreview = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setUploadError(null);
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload Section */}
      <FormSection title="Logo Anak Usaha" icon={ImageIcon}>
        <FieldGroup>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Current Logo / Preview */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-[#1C1C1E] border border-[#38383A] rounded-lg overflow-hidden flex items-center justify-center">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : formData.logo ? (
                  <img
                    src={`${window.location.origin}/uploads/${formData.logo}`}
                    alt="Current logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#0A84FF]"
                  style={{ display: (logoPreview || formData.logo) ? 'none' : 'flex' }}
                >
                  {formData.name ? formData.name.substring(0, 2).toUpperCase() : 'AU'}
                </div>
              </div>
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Upload Logo
                </label>
                <p className="text-xs text-[#8E8E93] mb-3">
                  Format: JPG, PNG, SVG, WebP. Maksimal 2MB.
                </p>
                
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
                  onChange={handleLogoSelect}
                  className="hidden"
                  id="logo-upload"
                />
                
                {!logoFile && (
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors cursor-pointer"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Pilih File
                  </label>
                )}
                
                {logoFile && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-[#8E8E93]">
                      <ImageIcon className="h-4 w-4" />
                      <span>{logoFile.name}</span>
                      <span>({(logoFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handleLogoUpload}
                        disabled={uploading || !formData.id}
                        className="inline-flex items-center px-4 py-2 bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Mengunggah...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={cancelPreview}
                        className="inline-flex items-center px-4 py-2 bg-[#8E8E93] text-white rounded-lg hover:bg-[#8E8E93]/90 transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {!formData.id && (
                  <p className="text-xs text-[#FF9F0A] mt-2">
                    Simpan data dasar terlebih dahulu sebelum mengunggah logo.
                  </p>
                )}
              </div>

              {uploadError && (
                <div className="p-3 bg-[#FF453A]/10 border border-[#FF453A] rounded-lg">
                  <p className="text-sm text-[#FF453A]">{uploadError}</p>
                </div>
              )}

              {formData.logo && !logoFile && (
                <button
                  type="button"
                  onClick={handleLogoDelete}
                  className="inline-flex items-center px-4 py-2 bg-[#FF453A] text-white rounded-lg hover:bg-[#FF453A]/90 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Hapus Logo
                </button>
              )}
            </div>
          </div>
        </FieldGroup>
      </FormSection>

      {/* Company Information */}
      <FormSection title="Informasi Perusahaan" icon={Building}>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Nama Anak Usaha *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                onBlur={() => onFieldBlur?.('name')}
                placeholder="PT Anak Usaha"
                className={`w-full px-3 py-2 bg-[#1C1C1E] border rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] ${
                  errors.name ? 'border-[#FF453A]' : 'border-[#38383A]'
                }`}
              />
              {errors.name && <ValidationMessage message={errors.name} />}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Kode Anak Usaha *
              </label>
              <input
                type="text"
                value={formData.code || ''}
                onChange={(e) => updateField('code', e.target.value.toUpperCase())}
                onBlur={() => onFieldBlur?.('code')}
                placeholder="SUB001"
                className={`w-full px-3 py-2 bg-[#1C1C1E] border rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] ${
                  errors.code ? 'border-[#FF453A]' : 'border-[#38383A]'
                }`}
              />
              {errors.code && <ValidationMessage message={errors.code} />}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Deskripsi singkat tentang anak usaha"
              rows={3}
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Spesialisasi
              </label>
              <select
                value={formData.specialization || 'general'}
                onChange={(e) => updateField('specialization', e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              >
                {formConfig.specializations.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Status
              </label>
              <select
                value={formData.status || 'active'}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              >
                {formConfig.statuses.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Perusahaan Induk
              </label>
              <input
                type="text"
                value={formData.parentCompany || ''}
                onChange={(e) => updateField('parentCompany', e.target.value)}
                placeholder="PT Nusantara Construction Group"
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tahun Didirikan
              </label>
              <input
                type="number"
                value={formData.establishedYear || ''}
                onChange={(e) => updateField('establishedYear', e.target.value)}
                onBlur={() => onFieldBlur?.('establishedYear')}
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear()}
                className={`w-full px-3 py-2 bg-[#1C1C1E] border rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] ${
                  errors.establishedYear ? 'border-[#FF453A]' : 'border-[#38383A]'
                }`}
              />
              {errors.establishedYear && <ValidationMessage message={errors.establishedYear} />}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Jumlah Karyawan
              </label>
              <input
                type="number"
                value={formData.employeeCount || ''}
                onChange={(e) => updateField('employeeCount', e.target.value)}
                onBlur={() => onFieldBlur?.('employeeCount')}
                placeholder="100"
                min="0"
                className={`w-full px-3 py-2 bg-[#1C1C1E] border rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] ${
                  errors.employeeCount ? 'border-[#FF453A]' : 'border-[#38383A]'
                }`}
              />
              {errors.employeeCount && <ValidationMessage message={errors.employeeCount} />}
            </div>
          </div>
        </FieldGroup>
      </FormSection>

      {/* Contact Information */}
      <FormSection title="Informasi Kontak" icon={Mail}>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.contactInfo?.email || ''}
                onChange={(e) => updateField('contactInfo.email', e.target.value)}
                onBlur={() => onFieldBlur?.('email')}
                placeholder="contact@subsidiary.com"
                className={`w-full px-3 py-2 bg-[#1C1C1E] border rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] ${
                  errors.email ? 'border-[#FF453A]' : 'border-[#38383A]'
                }`}
              />
              {errors.email && <ValidationMessage message={errors.email} />}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={formData.contactInfo?.phone || ''}
                onChange={(e) => updateField('contactInfo.phone', e.target.value)}
                onBlur={() => onFieldBlur?.('phone')}
                placeholder="+62 21 1234 5678"
                className={`w-full px-3 py-2 bg-[#1C1C1E] border rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] ${
                  errors.phone ? 'border-[#FF453A]' : 'border-[#38383A]'
                }`}
              />
              {errors.phone && <ValidationMessage message={errors.phone} />}
            </div>
          </div>
        </FieldGroup>
      </FormSection>

      {/* Address Information */}
      <FormSection title="Alamat" icon={MapPin}>
        <FieldGroup>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Alamat Lengkap
            </label>
            <textarea
              value={formData.address?.street || ''}
              onChange={(e) => updateField('address.street', e.target.value)}
              placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan"
              rows={3}
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Kota
              </label>
              <input
                type="text"
                value={formData.address?.city || ''}
                onChange={(e) => updateField('address.city', e.target.value)}
                placeholder="Jakarta"
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Negara
              </label>
              <select
                value={formData.address?.country || 'Indonesia'}
                onChange={(e) => updateField('address.country', e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              >
                {formConfig.countries.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FieldGroup>
      </FormSection>
    </div>
  );
};

export default BasicInfoForm;