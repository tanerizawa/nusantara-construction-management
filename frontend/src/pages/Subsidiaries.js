import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Award, 
  ExternalLink, 
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';
import { subsidiaryAPI } from '../services/api';

const Subsidiaries = () => {
  const navigate = useNavigate();
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);

  // Specialization options from backend model
  const specializations = [
    { value: '', label: 'Semua Spesialisasi' },
    { value: 'residential', label: 'Perumahan' },
    { value: 'commercial', label: 'Komersial' },
    { value: 'industrial', label: 'Industri' },
    { value: 'infrastructure', label: 'Infrastruktur' },
    { value: 'renovation', label: 'Renovasi' },
    { value: 'interior', label: 'Interior' },
    { value: 'landscaping', label: 'Lansekap' },
    { value: 'general', label: 'Umum' }
  ];

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Tidak Aktif' }
  ];

  useEffect(() => {
    fetchSubsidiaries();
    fetchStats();
  }, []);

  const fetchSubsidiaries = async () => {
    try {
      setLoading(true);
      const response = await subsidiaryAPI.getAll();
      if (response.success) {
        setSubsidiaries(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching subsidiaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await subsidiaryAPI.getStats();
      if (response.success) {
        // Use new statistics endpoint response structure
        const data = response.data;
        if (data.overview) {
          // New comprehensive statistics format
          setStats({
            total: data.overview.total,
            active: data.overview.active,
            totalEmployees: data.overview.totalEmployees,
            specializations: data.specializations?.length || 0
          });
        } else {
          // Fallback to old format
          setStats({
            total: data.total || 0,
            active: data.active || 0,
            totalEmployees: data.totalEmployees || 0,
            specializations: data.bySpecialization?.length || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Filter subsidiaries based on search and filters
  const filteredSubsidiaries = subsidiaries.filter(subsidiary => {
    const matchesSearch = subsidiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subsidiary.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !specializationFilter || subsidiary.specialization === specializationFilter;
    const matchesStatus = !statusFilter || subsidiary.status === statusFilter;
    
    return matchesSearch && matchesSpecialization && matchesStatus;
  });

  const handleView = (id) => {
    navigate(`/subsidiaries/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/subsidiaries/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus anak usaha ini?')) {
      try {
        await subsidiaryAPI.delete(id);
        fetchSubsidiaries();
      } catch (error) {
        console.error('Error deleting subsidiary:', error);
        alert('Gagal menghapus anak usaha');
      }
    }
  };

  const getSpecializationLabel = (value) => {
    const spec = specializations.find(s => s.value === value);
    return spec ? spec.label : value;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: "#1C1C1E" }}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 rounded w-64 mb-6" style={{ backgroundColor: "#2C2C2E" }}></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 rounded-lg" style={{ backgroundColor: "#2C2C2E" }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1C1C1E" }}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: "#FFFFFF" }}>
              <Building className="w-8 h-8" style={{ color: "#0A84FF" }} />
              Anak Usaha Nusantara Group
            </h1>
            <p className="mt-2" style={{ color: "#98989D" }}>Kelola anak usaha dan spesialisasi konstruksi</p>
          </div>
          <button
            onClick={() => navigate('/subsidiaries/create')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium"
            style={{ background: "linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)", color: "#FFFFFF" }}
          >
            <Plus size={20} />
            Tambah Anak Usaha
          </button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="rounded-xl p-6 shadow-sm" style={{ background: "linear-gradient(135deg, rgba(10, 132, 255, 0.2) 0%, rgba(10, 132, 255, 0.1) 100%)", border: "1px solid rgba(10, 132, 255, 0.3)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: "#98989D" }}>Total Anak Usaha</p>
                  <p className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>{stats.total || 0}</p>
                </div>
                <Building className="w-8 h-8" style={{ color: "#0A84FF" }} />
              </div>
            </div>
            <div className="rounded-xl p-6 shadow-sm" style={{ background: "linear-gradient(135deg, rgba(48, 209, 88, 0.2) 0%, rgba(48, 209, 88, 0.1) 100%)", border: "1px solid rgba(48, 209, 88, 0.3)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: "#98989D" }}>Aktif</p>
                  <p className="text-2xl font-bold" style={{ color: "#30D158" }}>{stats.active || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8" style={{ color: "#30D158" }} />
              </div>
            </div>
            <div className="rounded-xl p-6 shadow-sm" style={{ background: "linear-gradient(135deg, rgba(191, 90, 242, 0.2) 0%, rgba(191, 90, 242, 0.1) 100%)", border: "1px solid rgba(191, 90, 242, 0.3)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: "#98989D" }}>Total Karyawan</p>
                  <p className="text-2xl font-bold" style={{ color: "#BF5AF2" }}>{stats.totalEmployees || 0}</p>
                </div>
                <Users className="w-8 h-8" style={{ color: "#BF5AF2" }} />
              </div>
            </div>
            <div className="rounded-xl p-6 shadow-sm" style={{ background: "linear-gradient(135deg, rgba(255, 159, 10, 0.2) 0%, rgba(255, 159, 10, 0.1) 100%)", border: "1px solid rgba(255, 159, 10, 0.3)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: "#98989D" }}>Spesialisasi</p>
                  <p className="text-2xl font-bold" style={{ color: "#FF9F0A" }}>{stats.specializations || 0}</p>
                </div>
                <Award className="w-8 h-8" style={{ color: "#FF9F0A" }} />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="rounded-xl p-6 shadow-sm mb-8" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#636366" }} size={20} />
              <input
                type="text"
                placeholder="Cari nama atau kode anak usaha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:outline-none"
                style={{ 
                  backgroundColor: "#1C1C1E", 
                  border: "1px solid #38383A", 
                  color: "#FFFFFF",
                  focusRingColor: "#0A84FF"
                }}
              />
            </div>

            {/* Specialization Filter */}
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:outline-none"
              style={{ 
                backgroundColor: "#1C1C1E", 
                border: "1px solid #38383A", 
                color: "#FFFFFF"
              }}
            >
              {specializations.map(spec => (
                <option key={spec.value} value={spec.value} style={{ backgroundColor: "#1C1C1E" }}>
                  {spec.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:outline-none"
              style={{ 
                backgroundColor: "#1C1C1E", 
                border: "1px solid #38383A", 
                color: "#FFFFFF"
              }}
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value} style={{ backgroundColor: "#1C1C1E" }}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subsidiaries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubsidiaries.map(subsidiary => (
            <div key={subsidiary.id} className="rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1" style={{ color: "#FFFFFF" }}>{subsidiary.name}</h3>
                    <p className="text-sm font-mono" style={{ color: "#98989D" }}>{subsidiary.code}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium" style={{
                    backgroundColor: subsidiary.status === 'active' ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 69, 58, 0.15)',
                    color: subsidiary.status === 'active' ? '#30D158' : '#FF453A'
                  }}>
                    {subsidiary.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#98989D" }}>
                    <Award size={16} />
                    <span>{getSpecializationLabel(subsidiary.specialization)}</span>
                  </div>
                  
                  {subsidiary.address && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#98989D" }}>
                      <MapPin size={16} />
                      <span className="truncate">{subsidiary.address.city || subsidiary.address.province || 'Alamat tidak tersedia'}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#98989D" }}>
                    <Users size={16} />
                    <span>{subsidiary.employeeCount || 0} Karyawan</span>
                  </div>

                  {subsidiary.establishedYear && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#98989D" }}>
                      <Calendar size={16} />
                      <span>Didirikan {subsidiary.establishedYear}</span>
                    </div>
                  )}
                </div>

                {subsidiary.description && (
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: "#98989D" }}>
                    {subsidiary.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 py-4" style={{ backgroundColor: "#1C1C1E", borderTop: "1px solid #38383A" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(subsidiary.id)}
                      className="flex items-center gap-1 text-sm font-medium transition-colors"
                      style={{ color: "#0A84FF" }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <Eye size={16} />
                      Lihat
                    </button>
                    <button
                      onClick={() => handleEdit(subsidiary.id)}
                      className="flex items-center gap-1 text-sm font-medium transition-colors"
                      style={{ color: "#30D158" }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(subsidiary.id)}
                    className="flex items-center gap-1 text-sm font-medium transition-colors"
                    style={{ color: "#FF453A" }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    <Trash2 size={16} />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSubsidiaries.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 mx-auto mb-4" style={{ color: "#636366" }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: "#FFFFFF" }}>Tidak ada anak usaha</h3>
            <p className="mb-6" style={{ color: "#98989D" }}>
              {searchTerm || specializationFilter || statusFilter 
                ? 'Tidak ada anak usaha yang sesuai dengan filter'
                : 'Belum ada anak usaha yang terdaftar'
              }
            </p>
            {!searchTerm && !specializationFilter && !statusFilter && (
              <button
                onClick={() => navigate('/subsidiaries/create')}
                className="px-6 py-3 rounded-lg transition-colors font-medium"
                style={{ background: "linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)", color: "#FFFFFF" }}
              >
                Tambah Anak Usaha Pertama
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subsidiaries;
