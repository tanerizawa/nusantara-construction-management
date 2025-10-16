import React, { useState, useEffect } from 'react';
import { X, Search, Building, DollarSign, Package, Calendar } from 'lucide-react';

const ProjectSelectionDialog = ({ isOpen, onClose, onSelectProject, documentType = 'po' }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

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

  const filteredProjects = projects.filter(project =>
    project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleSelectProject = () => {
    if (selectedProject && onSelectProject) {
      onSelectProject(selectedProject);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pilih Proyek</h2>
            <p className="text-gray-600">
              {documentType === 'po' 
                ? 'Pilih proyek untuk membuat Purchase Order' 
                : 'Pilih proyek untuk membuat Work Order'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari proyek berdasarkan nama, ID, atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Memuat proyek...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project) => {
                const statusInfo = getProjectStatus(project.status);
                const isSelected = selectedProject?.id === project.id;
                
                return (
                  <div
                    key={project.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{project.id}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Building className="h-4 w-4 mr-2" />
                        {project.location || 'Lokasi tidak diset'}
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {formatCurrency(project.budget)}
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Package className="h-4 w-4 mr-2" />
                        RAB Items: {project.rabItemsCount || 0}
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(project.createdAt).toLocaleDateString('id-ID')}
                      </div>
                    </div>

                    {project.description && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {selectedProject ? (
                <span>Dipilih: <strong>{selectedProject.name}</strong></span>
              ) : (
                <span>Pilih proyek untuk melanjutkan</span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSelectProject}
                disabled={!selectedProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Pilih Proyek
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelectionDialog;
