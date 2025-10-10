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
        className={`border border-gray-300 rounded-lg px-3 py-2 ${compact ? 'text-xs' : 'text-sm'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        disabled={loadingSubsidiaries}
      >
        <option value="all">
          {loadingSubsidiaries ? 'Loading...' : 'Semua Anak Perusahaan'}
        </option>
        {subsidiaries.map(sub => (
          <option key={sub.id} value={sub.id}>
            {sub.name}
          </option>
        ))}
      </select>

      {/* Project Filter */}
      <select 
        value={selectedProject} 
        onChange={(e) => onProjectChange(e.target.value)}
        className={`border border-gray-300 rounded-lg px-3 py-2 ${compact ? 'text-xs' : 'text-sm'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        disabled={loadingProjects}
      >
        <option value="all">
          {loadingProjects ? 'Loading Projects...' : 'All Projects'}
        </option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TransactionFilters;
