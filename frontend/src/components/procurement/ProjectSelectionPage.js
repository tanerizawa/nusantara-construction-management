import React, { useState, useEffect } from 'react';
import { Building, Search, Eye, ChevronRight, Package, DollarSign } from 'lucide-react';

const ProjectSelectionPage = ({ onProjectSelect, onBack }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = projects.filter(project =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchTerm, projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || data || []);
      } else {
        console.error('Failed to fetch projects');
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount || 0);
  };

  const getProjectStatus = (status) => {
    const statusMap = {
      'active': { label: 'Aktif', color: 'bg-green-100 text-green-800' },
      'planning': { label: 'Perencanaan', color: 'bg-blue-100 text-blue-800' },
      'on-hold': { label: 'Ditunda', color: 'bg-yellow-100 text-yellow-800' },
      'completed': { label: 'Selesai', color: 'bg-gray-100 text-gray-800' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Memuat data proyek...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Building className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Pilih Proyek</h1>
        </div>
        <p className="text-gray-600">Pilih proyek untuk membuat Purchase Order</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari proyek berdasarkan nama, ID, atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Tidak ada proyek yang ditemukan' : 'Belum ada proyek'}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Coba gunakan kata kunci yang berbeda' : 'Proyek akan muncul di sini setelah dibuat'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const statusInfo = getProjectStatus(project.status);
            
            return (
              <div
                key={project.id}
                className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => onProjectSelect(project)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{project.id}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    {project.location || 'Lokasi tidak diset'}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {formatCurrency(project.budget)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="h-4 w-4 mr-2" />
                    RAB Items: {project.rabItemsCount || 0}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Dibuat: {new Date(project.createdAt).toLocaleDateString('id-ID')}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Pilih Proyek
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Back Button */}
      {onBack && (
        <div className="mt-8 flex justify-start">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            Kembali
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectSelectionPage;
