import { useState, useEffect, useCallback, useMemo } from 'react';
import { filterAccounts } from '../utils/accountHelpers';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

export const useAccountFilters = (accounts) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, CHART_OF_ACCOUNTS_CONFIG.search.debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter accounts based on search and type
  const filteredAccounts = useMemo(() => {
    return filterAccounts(accounts, debouncedSearchTerm, filterType);
  }, [accounts, debouncedSearchTerm, filterType]);

  // Handle search term change
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle filter type change
  const handleFilterTypeChange = useCallback((e) => {
    setFilterType(e.target.value);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  // Clear filter type
  const clearFilterType = useCallback(() => {
    setFilterType('');
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setFilterType('');
  }, []);

  // Set filter type programmatically
  const setAccountTypeFilter = useCallback((accountType) => {
    setFilterType(accountType);
  }, []);

  // Get filter stats
  const getFilterStats = useCallback(() => {
    const totalAccounts = accounts.length;
    const filteredCount = filteredAccounts.length;
    const hasActiveFilters = debouncedSearchTerm || filterType;
    
    return {
      totalAccounts,
      filteredCount,
      hasActiveFilters,
      filteredPercentage: totalAccounts > 0 ? (filteredCount / totalAccounts) * 100 : 0
    };
  }, [accounts.length, filteredAccounts.length, debouncedSearchTerm, filterType]);

  // Check if search is active
  const isSearchActive = useCallback(() => {
    return debouncedSearchTerm.length > 0;
  }, [debouncedSearchTerm]);

  // Check if type filter is active
  const isTypeFilterActive = useCallback(() => {
    return filterType !== '';
  }, [filterType]);

  // Check if any filter is active
  const hasActiveFilters = useCallback(() => {
    return isSearchActive() || isTypeFilterActive();
  }, [isSearchActive, isTypeFilterActive]);

  return {
    searchTerm,
    filterType,
    debouncedSearchTerm,
    filteredAccounts,
    handleSearchChange,
    handleFilterTypeChange,
    clearSearch,
    clearFilterType,
    clearAllFilters,
    setAccountTypeFilter,
    getFilterStats,
    isSearchActive,
    isTypeFilterActive,
    hasActiveFilters
  };
};