import React from 'react';

/**
 * TransactionFilters Component
 * 
 * Provides filtering controls for subsidiary and project selection
 * Used across multiple finance views (transactions, reports, tax)
 * 
 * @param {Object} props
 * @param {string} props.selectedSubsidiary - Currently selected subsidiary ID
 * @param {Function} props.onSubsidiaryChange - Handler for subsidiary change
 * @param {Array} props.subsidiaries - List of subsidiaries
 * @param {boolean} props.loadingSubsidiaries - Loading state for subsidiaries
 * @param {string} props.selectedProject - Currently selected project ID
 * @param {Function} props.onProjectChange - Handler for project change
 * @param {Array} props.projects - List of projects (filtered)
 * @param {boolean} props.loadingProjects - Loading state for projects
 * @param {boolean} props.compact - Use compact layout (optional)
 */
const TransactionFilters = ({
  selectedSubsidiary,
  onSubsidiaryChange,
  subsidiaries = [],
  loadingSubsidiaries = false,
  selectedProject,
  onProjectChange,
  projects = [],
  loadingProjects = false,
  compact = false
}) => {
  return (
    <div className={`flex ${compact ? 'space-x-2' : 'space-x-3'}`}>
      {/* Subsidiary Filter */}
      <select 
        value={selectedSubsidiary} 
        onChange={(e) => onSubsidiaryChange(e.target.value)}
        className={`rounded-lg px-4 py-2 ${compact ? 'text-xs' : 'text-sm'} font-medium transition-all duration-200 focus:outline-none focus:ring-2`}
        style={{
          backgroundColor: '#2C2C2E',
          color: '#FFFFFF',
          border: '1px solid #38383A'
        }}
        disabled={loadingSubsidiaries}
      >
        <option value="all" style={{ backgroundColor: '#2C2C2E', color: '#FFFFFF' }}>
          {loadingSubsidiaries ? 'Memuat...' : 'Semua Anak Perusahaan'}
        </option>
        {subsidiaries.map(sub => (
          <option key={sub.id} value={sub.id} style={{ backgroundColor: '#2C2C2E', color: '#FFFFFF' }}>
            {sub.name}
          </option>
        ))}
      </select>

      {/* Project Filter */}
      <select 
        value={selectedProject} 
        onChange={(e) => onProjectChange(e.target.value)}
        className={`rounded-lg px-4 py-2 ${compact ? 'text-xs' : 'text-sm'} font-medium transition-all duration-200 focus:outline-none focus:ring-2`}
        style={{
          backgroundColor: '#2C2C2E',
          color: '#FFFFFF',
          border: '1px solid #38383A'
        }}
        disabled={loadingProjects}
      >
        <option value="all" style={{ backgroundColor: '#2C2C2E', color: '#FFFFFF' }}>
          {loadingProjects ? 'Memuat Proyek...' : 'Semua Proyek'}
        </option>
        {projects.map(project => (
          <option key={project.id} value={project.id} style={{ backgroundColor: '#2C2C2E', color: '#FFFFFF' }}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TransactionFilters;
