import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  ArrowLeft, 
  Save, 
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Calendar,
  FileText
} from 'lucide-react';
import { subsidiaryAPI } from '../services/api';

const SubsidiaryCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    specialization: '',
    description: '',
    establishedYear: '',
    employeeCount: '',
    registrationNumber: '',
    taxNumber: '',
    status: 'active',
    address: {
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Indonesia'
    },
    contactInfo: {
      phone: '',
      email: '',
      website: '',
      fax: ''
    },
    legalInfo: {
      directorName: '',
      commissionerName: '',
      notaryName: '',
      notaryNumber: '',
      notaryDate: ''
    },
    financialInfo: {
      paidUpCapital: '',
      authorizedCapital: '',
      bankName: '',
      bankAccount: ''
    }
  });

  const specializations = [
    { value: 'residential', label: 'Perumahan' },
    { value: 'commercial', label: 'Komersial' },
    { value: 'industrial', label: 'Industri' },
    { value: 'infrastructure', label: 'Infrastruktur' },
    { value: 'renovation', label: 'Renovasi' },
    { value: 'interior', label: 'Interior' },
    { value: 'landscaping', label: 'Lansekap' },
    { value: 'general', label: 'Umum' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare data - convert empty strings to null for optional fields
      const submitData = {
        ...formData,
        employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : null,
        establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : null,
        financialInfo: {
          ...formData.financialInfo,
          paidUpCapital: formData.financialInfo.paidUpCapital ? parseFloat(formData.financialInfo.paidUpCapital) : null,
          authorizedCapital: formData.financialInfo.authorizedCapital ? parseFloat(formData.financialInfo.authorizedCapital) : null
        }
      };

      const response = await subsidiaryAPI.create(submitData);
      
      if (response.success) {
        alert('Anak usaha berhasil dibuat');
        navigate('/subsidiaries');
      } else {
        alert('Gagal membuat anak usaha: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating subsidiary:', error);
      alert('Gagal membuat anak usaha');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: "#1C1C1E" }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/subsidiaries')}
            className="flex items-center gap-2 transition-colors"
            style={{ color: "#98989D" }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#98989D'}
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: "#FFFFFF" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)'
              }}>
                <Building className="w-6 h-6 text-white" />
              </div>
              Tambah Anak Usaha Baru
            </h1>
            <p className="mt-2" style={{ color: "#98989D" }}>Daftarkan anak usaha baru Nusantara Group</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
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
                  {specializations.map(spec => (
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
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Tahun Berdiri
                </label>
                <input
                  type="number"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="2020"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Jumlah Karyawan
                </label>
                <input
                  type="number"
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="50"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                Deskripsi
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                placeholder="Deskripsi singkat tentang anak usaha..."
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="rounded-xl p-6 shadow-sm " style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: "#FFFFFF" }}>
              <MapPin size={20} />
              Alamat
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Alamat Lengkap
                </label>
                <textarea
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="Jl. Konstruksi No. 123, RT/RW 01/02"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Kota
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="Jakarta"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Provinsi
                </label>
                <input
                  type="text"
                  name="address.province"
                  value={formData.address.province}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="DKI Jakarta"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Kode Pos
                </label>
                <input
                  type="text"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="12345"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Negara
                </label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-xl p-6 shadow-sm " style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: "#FFFFFF" }}>
              <Phone size={20} />
              Kontak
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Telepon
                </label>
                <input
                  type="tel"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="+62 21 1234567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Email
                </label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="info@anakusaha.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Website
                </label>
                <input
                  type="url"
                  name="contactInfo.website"
                  value={formData.contactInfo.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="https://www.anakusaha.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Fax
                </label>
                <input
                  type="tel"
                  name="contactInfo.fax"
                  value={formData.contactInfo.fax}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="+62 21 7654321"
                />
              </div>
            </div>
          </div>

          {/* Legal Information */}
          <div className="rounded-xl p-6 shadow-sm " style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: "#FFFFFF" }}>
              <FileText size={20} />
              Informasi Legal
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Nomor Registrasi
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="1234567890123456"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  NPWP
                </label>
                <input
                  type="text"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="12.345.678.9-012.000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Nama Direktur
                </label>
                <input
                  type="text"
                  name="legalInfo.directorName"
                  value={formData.legalInfo.directorName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
                  Nama Komisaris
                </label>
                <input
                  type="text"
                  name="legalInfo.commissionerName"
                  value={formData.legalInfo.commissionerName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}
                  placeholder="Jane Doe"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/subsidiaries')}
              className="px-6 py-3 rounded-lg transition-colors font-medium"
              style={{
                border: "1px solid #38383A",
                color: "#98989D",
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2C2C2E'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)',
                color: '#FFFFFF'
              }}
            >
              <Save size={20} />
              {loading ? 'Menyimpan...' : 'Simpan Anak Usaha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubsidiaryCreate;
