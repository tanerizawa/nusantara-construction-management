/**
 * Utility functions for table data processing
 */

/**
 * Sort data array by column key and direction
 */
export const sortData = (data, sortConfig) => {
  if (!sortConfig.key || !sortConfig.direction) {
    return data;
  }

  return [...data].sort((a, b) => {
    const aValue = getNestedValue(a, sortConfig.key);
    const bValue = getNestedValue(b, sortConfig.key);
    
    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    // Handle different data types
    const comparison = compareValues(aValue, bValue);
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
};

/**
 * Filter data array based on search query and column filters
 */
export const filterData = (data, searchQuery, columnFilters = {}) => {
  let filteredData = [...data];
  
  // Apply search query
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredData = filteredData.filter(item => {
      return Object.values(item).some(value => {
        if (value == null) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  }
  
  // Apply column filters
  Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
    if (filterValue && filterValue.trim()) {
      const filter = filterValue.toLowerCase().trim();
      filteredData = filteredData.filter(item => {
        const cellValue = getNestedValue(item, columnKey);
        if (cellValue == null) return false;
        return String(cellValue).toLowerCase().includes(filter);
      });
    }
  });
  
  return filteredData;
};

/**
 * Paginate data array
 */
export const paginateData = (data, currentPage, pageSize) => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    data: data.slice(startIndex, endIndex),
    totalItems: data.length,
    totalPages: Math.ceil(data.length / pageSize),
    currentPage,
    pageSize,
    startIndex,
    endIndex: Math.min(endIndex, data.length)
  };
};

/**
 * Get nested object value by dot notation key
 */
export const getNestedValue = (obj, key) => {
  if (!key) return obj;
  
  return key.split('.').reduce((current, prop) => {
    return current && current[prop] !== undefined ? current[prop] : null;
  }, obj);
};

/**
 * Compare two values for sorting
 */
const compareValues = (a, b) => {
  // Handle numbers
  const aNum = Number(a);
  const bNum = Number(b);
  if (!isNaN(aNum) && !isNaN(bNum)) {
    return aNum - bNum;
  }
  
  // Handle dates
  const aDate = new Date(a);
  const bDate = new Date(b);
  if (isValidDate(aDate) && isValidDate(bDate)) {
    return aDate.getTime() - bDate.getTime();
  }
  
  // Handle strings (case-insensitive)
  const aStr = String(a).toLowerCase();
  const bStr = String(b).toLowerCase();
  return aStr.localeCompare(bStr);
};

/**
 * Check if date is valid
 */
const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Format currency value
 */
export const formatCurrency = (amount, options = {}) => {
  const {
    locale = 'id-ID',
    currency = 'IDR',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0
  } = options;
  
  if (amount == null || isNaN(amount)) return '-';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(amount);
};

/**
 * Format percentage value
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value == null || isNaN(value)) return '-';
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Format date value
 */
export const formatDate = (date, options = {}) => {
  const {
    locale = 'id-ID',
    dateStyle = 'medium'
  } = options;
  
  if (!date) return '-';
  
  const dateObj = new Date(date);
  if (!isValidDate(dateObj)) return '-';
  
  return new Intl.DateTimeFormat(locale, { dateStyle }).format(dateObj);
};

/**
 * Format location object to string
 */
export const formatLocation = (location) => {
  if (typeof location === 'string') return location;
  
  if (typeof location === 'object' && location) {
    const parts = [
      location.address,
      location.city,
      location.province || location.state
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : '-';
  }
  
  return '-';
};

/**
 * Get column value with proper formatting
 */
export const getColumnValue = (item, column) => {
  const rawValue = getNestedValue(item, column.key);
  
  // If column has custom render function, use it
  if (column.render && typeof column.render === 'function') {
    return column.render(rawValue, item);
  }
  
  // Apply default formatting based on column type
  if (column.type === 'currency') {
    return formatCurrency(rawValue);
  }
  
  if (column.type === 'percentage') {
    return formatPercentage(rawValue);
  }
  
  if (column.type === 'date') {
    return formatDate(rawValue);
  }
  
  if (column.type === 'location') {
    return formatLocation(rawValue);
  }
  
  return rawValue;
};

/**
 * Generate pagination info text
 */
export const getPaginationInfo = (paginationData) => {
  const { startIndex, endIndex, totalItems } = paginationData;
  
  if (totalItems === 0) {
    return 'Tidak ada data';
  }
  
  return `Menampilkan ${startIndex + 1} - ${endIndex} dari ${totalItems} data`;
};

/**
 * Calculate visible page numbers for pagination
 */
export const getVisiblePages = (currentPage, totalPages, maxVisible = 5) => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(currentPage - half, 1);
  let end = Math.min(start + maxVisible - 1, totalPages);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(end - maxVisible + 1, 1);
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/**
 * Debounce function for search input
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};