import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building, Users, Edit, Trash2, Eye, ChevronRight, MapPin, Calendar, Award, Phone, Mail } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import AddNewSubsidiary from './AddNewSubsidiary';
import { subsidiaryAPI } from '../services/api';

/**
 * Simple Subsidiary List Component
 * Displays existing subsidiaries and allows adding new ones
 */
const SubsidiaryList = () => {
  const navigate = useNavigate();
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubsidiary, setEditingSubsidiary] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState(null);
  const [loading, setLoading] = useState(true);

        // Load existing subsidiaries from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch subsidiaries and statistics in parallel
        const [subsidiariesResponse, statisticsResponse] = await Promise.all([
          subsidiaryAPI.getAll(),
          subsidiaryAPI.getStats()
        ]);
        
        if (subsidiariesResponse.success) {
          setSubsidiaries(subsidiariesResponse.data);
        } else {
          throw new Error('Failed to fetch subsidiaries');
        }
        
        if (statisticsResponse.success) {
          setStatistics(statisticsResponse.data);
        } else {
          console.warn('Failed to fetch statistics, using fallback');
          // Fallback to local calculation
          setStatistics({
            totalSubsidiaries: subsidiariesResponse.data?.length || 0,
            activeSubsidiaries: subsidiariesResponse.data?.filter(s => s.status === 'active').length || 0,
            totalProjects: 0,
            activeProjects: 0
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty array if API fails
        setSubsidiaries([]);
        setStatistics({
          totalSubsidiaries: 0,
          activeSubsidiaries: 0,
          totalProjects: 0,
          activeProjects: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle view subsidiary details
  const handleViewDetails = (subsidiary) => {
    navigate(`/admin/subsidiaries/${subsidiary.id}`);
  };

  // Handle edit subsidiary
  const handleEditSubsidiary = (subsidiary) => {
    navigate(`/admin/subsidiaries/${subsidiary.id}/edit`);
  };

  // Handle delete subsidiary
  const handleDeleteSubsidiary = async (subsidiaryId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus anak usaha ini?')) {
      return;
    }

    try {
      await subsidiaryAPI.delete(subsidiaryId);
      setSubsidiaries(prev => prev.filter(s => s.id !== subsidiaryId));
    } catch (error) {
      console.error('Error deleting subsidiary:', error);
      alert('Gagal menghapus anak usaha. Silakan coba lagi.');
    }
  };

  // Handle toggle subsidiary status (active/inactive)
  const handleToggleStatus = async (subsidiaryId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'mengaktifkan' : 'menonaktifkan';
    
    if (!window.confirm(`Apakah Anda yakin ingin ${action} anak usaha ini?`)) {
      return;
    }

    try {
      await subsidiaryAPI.update(subsidiaryId, {
        status: newStatus
      });
      
      setSubsidiaries(prev => 
        prev.map(s => 
          s.id === subsidiaryId 
            ? { ...s, status: newStatus }
            : s
        )
      );
    } catch (error) {
      console.error('Error updating subsidiary status:', error);
      alert('Gagal mengubah status anak usaha. Silakan coba lagi.');
    }
  };

  const handleAddSubsidiary = async (newSubsidiary) => {
    try {
      // Convert form data to API format
      const apiData = {
        name: newSubsidiary.name,
        code: newSubsidiary.code,
        specialization: newSubsidiary.specialization,
        description: newSubsidiary.description,
        address: {
          street: newSubsidiary.address || '',
          city: '',
          country: 'Indonesia'
        },
        contactInfo: {
          phone: newSubsidiary.phone || '',
          email: newSubsidiary.email || ''
        },
        establishedYear: newSubsidiary.established_year
      };

      const response = await subsidiaryAPI.create(apiData);
      if (response.success) {
        setSubsidiaries(prev => [...prev, response.data]);
      } else {
        throw new Error('Failed to create subsidiary');
      }
    } catch (error) {
      console.error('Error creating subsidiary:', error);
      // Fallback: add to local state if API fails
      setSubsidiaries(prev => [...prev, newSubsidiary]);
    }
    setShowAddForm(false);
  };

  const getSpecializationLabel = (spec) => {
    const labels = {
      residential: 'Perumahan & Residential',
      commercial: 'Komersial & Perkantoran',
      infrastructure: 'Infrastruktur & Jalan',
      industrial: 'Industri & Pabrik',
      renovation: 'Renovasi & Pemeliharaan'
    };
    return labels[spec] || spec;
  };

  const getSpecializationColor = (spec) => {
    const colors = {
      residential: 'bg-blue-50 text-blue-600',
      commercial: 'bg-green-50 text-green-600',
      infrastructure: 'bg-orange-50 text-orange-600',
      industrial: 'bg-purple-50 text-purple-600',
      renovation: 'bg-pink-50 text-pink-600'
    };
    return colors[spec] || 'bg-gray-50 text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anak Usaha YK Group</h1>
          <p className="text-gray-500">
            Kelola {subsidiaries.length} perusahaan dalam grup konstruksi YK
          </p>
        </div>
        <Button onClick={() => navigate('/admin/subsidiaries/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Anak Usaha
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Anak Usaha</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics?.totalSubsidiaries || subsidiaries.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Perusahaan Aktif</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics?.activeSubsidiaries || subsidiaries.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Building className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Proyek</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics?.totalProjects || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Proyek Aktif</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics?.activeProjects || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Subsidiaries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subsidiaries.map(subsidiary => (
          <Card key={subsidiary.id} className="p-6 hover:shadow-lg transition-shadow">
            {/* Header dengan status */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{subsidiary.name}</h3>
                  <p className="text-sm text-gray-500">Kode: {subsidiary.code}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                subsidiary.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {subsidiary.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>

            {/* Content */}
            <div className="space-y-3 mb-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {subsidiary.description || 'Tidak ada deskripsi'}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Spesialisasi:</span>
                <span className="text-gray-900 font-medium">
                  {getSpecializationLabel(subsidiary.specialization)}
                </span>
              </div>
              
              {subsidiary.establishedYear && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Didirikan:</span>
                  <span className="text-gray-900">{subsidiary.establishedYear}</span>
                </div>
              )}
              
              {subsidiary.employeeCount && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Karyawan:</span>
                  <span className="text-gray-900">{subsidiary.employeeCount} orang</span>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 gap-3">
              {/* Primary Action */}
              <Button
                onClick={() => handleViewDetails(subsidiary)}
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 
                         font-medium transition-all duration-200 flex items-center gap-2 flex-1 min-w-0"
              >
                <Eye className="w-4 h-4 shrink-0" />
                <span className="truncate">Lihat Detail</span>
                <ChevronRight className="w-3 h-3 shrink-0" />
              </Button>
              
              {/* Secondary Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  onClick={() => handleEditSubsidiary(subsidiary)}
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 p-0 text-gray-600 hover:text-blue-600 
                           hover:bg-blue-50 transition-all duration-200 rounded-lg"
                  title="Edit Anak Usaha"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={() => handleToggleStatus(subsidiary.id, subsidiary.status)}
                  variant="ghost"
                  size="sm"
                  className={`w-9 h-9 p-0 transition-all duration-200 rounded-lg ${
                    subsidiary.status === 'active'
                      ? 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                  title={subsidiary.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                >
                  <Users className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={() => handleDeleteSubsidiary(subsidiary.id)}
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 p-0 text-gray-600 hover:text-red-600 
                           hover:bg-red-50 transition-all duration-200 rounded-lg"
                  title="Hapus Anak Usaha"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add New Subsidiary Modal */}
      {showAddForm && (
        <AddNewSubsidiary
          onAdd={handleAddSubsidiary}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-yellow-100 p-2 rounded text-xs">
          Modal: {showDetailModal ? 'Open' : 'Closed'} | 
          Selected: {selectedSubsidiary?.name || 'None'}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedSubsidiary && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" 
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            // Close modal if clicking on backdrop
            if (e.target === e.currentTarget) {
              setShowDetailModal(false);
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Detail Anak Usaha</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
                  <p className="text-gray-900 font-semibold">{selectedSubsidiary.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode</label>
                  <p className="text-gray-900">{selectedSubsidiary.code}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <p className="text-gray-600">{selectedSubsidiary.description || 'Tidak ada deskripsi'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spesialisasi</label>
                  <p className="text-gray-900">{getSpecializationLabel(selectedSubsidiary.specialization)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    selectedSubsidiary.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedSubsidiary.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              {selectedSubsidiary.contactInfo && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Informasi Kontak
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSubsidiary.contactInfo.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                        <p className="text-gray-900">{selectedSubsidiary.contactInfo.phone}</p>
                      </div>
                    )}
                    {selectedSubsidiary.contactInfo.email && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="text-gray-900">{selectedSubsidiary.contactInfo.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Address */}
              {selectedSubsidiary.address && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Alamat
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSubsidiary.address.street && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                        <p className="text-gray-900">{selectedSubsidiary.address.street}</p>
                      </div>
                    )}
                    {selectedSubsidiary.address.city && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kota</label>
                        <p className="text-gray-900">{selectedSubsidiary.address.city}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSubsidiary.establishedYear && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Tahun Didirikan
                    </label>
                    <p className="text-gray-900">{selectedSubsidiary.establishedYear}</p>
                  </div>
                )}
                {selectedSubsidiary.employeeCount && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Jumlah Karyawan
                    </label>
                    <p className="text-gray-900">{selectedSubsidiary.employeeCount} orang</p>
                  </div>
                )}
              </div>

              {/* Certifications */}
              {selectedSubsidiary.certification && selectedSubsidiary.certification.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    Sertifikasi
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubsidiary.certification.map((cert, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Tutup
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEditSubsidiary(selectedSubsidiary);
                    }}
                  >
                    Edit Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubsidiaryList;
