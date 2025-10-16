import { useState } from 'react';

/**
 * Custom hook for managing invoice filters
 */
export const useInvoiceFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    resetFilters
  };
};