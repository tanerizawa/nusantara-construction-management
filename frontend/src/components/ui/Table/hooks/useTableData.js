import { useState, useMemo, useCallback } from 'react';
import { sortData, filterData, paginateData, debounce } from '../utils/tableUtils';
import { TABLE_CONFIG } from '../config/tableConfig';

export const useTableData = (initialData = [], options = {}) => {
  const {
    initialSort = { key: null, direction: null },
    initialSearch = '',
    initialFilters = {},
    initialPageSize = TABLE_CONFIG.defaults.pageSize,
    debounceMs = TABLE_CONFIG.search.debounceMs
  } = options;

  // State management
  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [columnFilters, setColumnFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setCurrentPage(1); // Reset to first page on search
    }, debounceMs),
    [debounceMs]
  );

  // Processed data with memoization for performance
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply filters and search
    result = filterData(result, searchQuery, columnFilters);
    
    // Apply sorting
    result = sortData(result, sortConfig);
    
    return result;
  }, [data, searchQuery, columnFilters, sortConfig]);

  // Paginated data
  const paginatedData = useMemo(() => {
    return paginateData(processedData, currentPage, pageSize);
  }, [processedData, currentPage, pageSize]);

  // Handlers
  const handleSort = useCallback((columnKey) => {
    setSortConfig(prevSort => {
      if (prevSort.key === columnKey) {
        // Cycle through: asc -> desc -> none -> asc
        if (prevSort.direction === 'asc') {
          return { key: columnKey, direction: 'desc' };
        } else if (prevSort.direction === 'desc') {
          return { key: null, direction: null };
        }
      }
      return { key: columnKey, direction: 'asc' };
    });
  }, []);

  const handleSearch = useCallback((query) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  const handleFilter = useCallback((columnKey, filterValue) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnKey]: filterValue
    }));
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page on page size change
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setColumnFilters({});
    setSortConfig({ key: null, direction: null });
    setCurrentPage(1);
  }, []);

  const updateData = useCallback((newData) => {
    setData(newData);
    setError(null);
  }, []);

  const refreshData = useCallback(async (dataFetcher) => {
    if (!dataFetcher) return;
    
    try {
      setLoading(true);
      setError(null);
      const newData = await dataFetcher();
      setData(newData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Selection state (for bulk operations)
  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleSelectItem = useCallback((itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = paginatedData.data.map((item, index) => item.id || index);
    if (selectedItems.size === allIds.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(allIds));
    }
  }, [paginatedData.data, selectedItems.size]);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  return {
    // Data
    data: paginatedData.data,
    totalItems: paginatedData.totalItems,
    totalPages: paginatedData.totalPages,
    currentPage: paginatedData.currentPage,
    pageSize: paginatedData.pageSize,
    
    // State
    loading,
    error,
    sortConfig,
    searchQuery,
    columnFilters,
    selectedItems,
    
    // Actions
    handleSort,
    handleSearch,
    handleFilter,
    handlePageChange,
    handlePageSizeChange,
    handleSelectItem,
    handleSelectAll,
    clearAllFilters,
    clearSelection,
    updateData,
    refreshData,
    
    // Computed values
    hasFilters: searchQuery || Object.keys(columnFilters).length > 0,
    hasSelection: selectedItems.size > 0,
    isAllSelected: selectedItems.size === paginatedData.data.length && paginatedData.data.length > 0,
    paginationInfo: {
      startIndex: paginatedData.startIndex,
      endIndex: paginatedData.endIndex,
      totalItems: paginatedData.totalItems,
      totalPages: paginatedData.totalPages,
      currentPage: paginatedData.currentPage
    }
  };
};