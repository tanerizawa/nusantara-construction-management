import React from 'react';
import { Building } from 'lucide-react';
import { formatCurrency } from '../utils/poUtils';

/**
 * Project Selection View Component
 */
const ProjectSelectionView = ({ projects, onSelectProject, onBack }) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Pilih Proyek</h2>
          <p className="text-gray-600">Pilih proyek untuk membuat Purchase Order baru</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Kembali
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={onSelectProject}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada proyek tersedia</h3>
          <p className="text-gray-500">Hubungi administrator untuk menambahkan proyek baru.</p>
        </div>
      )}
    </>
  );
};

/**
 * Project Card Component
 */
const ProjectCard = ({ project, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(project)}
      className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <Building className="h-8 w-8 text-blue-500" />
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Aktif
        </span>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">{project.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{project.location?.city || 'Lokasi tidak tersedia'}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Nilai Proyek:</span>
          <span className="font-medium">
            {formatCurrency(project.totalValue || 0)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Progress:</span>
          <span className="font-medium">{project.progress || 0}%</span>
        </div>
      </div>
      
      <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Pilih Proyek
      </button>
    </div>
  );
};

export default ProjectSelectionView;