import { useState, useMemo } from 'react';

/**
 * Custom hook for subsidiary filtering
 * @param {Array} subsidiaries - List of subsidiaries 
 * @returns {Object} Filter state and filtered subsidiaries
 */
const useSubsidiaryFilters = (subsidiaries) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Get filtered subsidiaries based on filters
   */
  const filteredSubsidiaries = useMemo(() => {
    return subsidiaries.filter(subsidiary => {
      // Search term filter (case-insensitive)
      const matchesSearch = !searchTerm || 
        subsidiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subsidiary.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Specialization filter
      const matchesSpecialization = !specializationFilter || 
        subsidiary.specialization === specializationFilter;
      
      // Status filter
      const matchesStatus = !statusFilter || 
        subsidiary.status === statusFilter;
      
      // Return true if all conditions are met
      return matchesSearch && matchesSpecialization && matchesStatus;
    });
  }, [subsidiaries, searchTerm, specializationFilter, statusFilter]);

  /**
   * Reset all filters
   */
  const resetFilters = () => {
    setSearchTerm('');
    setSpecializationFilter('');
    setStatusFilter('');
  };

  /**
   * Check if any filter is active
   */
  const hasActiveFilters = searchTerm || specializationFilter || statusFilter;

  return {
    searchTerm,
    setSearchTerm,
    specializationFilter,
    setSpecializationFilter,
    statusFilter,
    setStatusFilter,
    showFilters,
    setShowFilters,
    filteredSubsidiaries,
    resetFilters,
    hasActiveFilters
  };
};

export default useSubsidiaryFilters;