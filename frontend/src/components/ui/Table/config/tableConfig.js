export const TABLE_CONFIG = {
  // Default settings
  defaults: {
    density: 'normal',
    pageSize: 10,
    sortable: true,
    searchable: true,
    filterable: false,
    selectable: false,
    bordered: true,
    striped: false,
    hoverable: true
  },
  
  // Density configurations
  density: {
    compact: {
      textSize: 'text-sm',
      padding: 'px-3 py-2',
      headerPadding: 'px-3 py-3'
    },
    normal: {
      textSize: 'text-base',
      padding: 'px-6 py-4',
      headerPadding: 'px-6 py-4'
    },
    comfortable: {
      textSize: 'text-lg',
      padding: 'px-8 py-5',
      headerPadding: 'px-8 py-5'
    }
  },
  
  // Alignment options
  alignment: {
    left: 'text-left',
    center: 'text-center', 
    right: 'text-right'
  },
  
  // Style variants
  variants: {
    default: 'border-gray-200 bg-white',
    minimal: 'border-0 bg-transparent',
    outlined: 'border-2 border-gray-300 bg-white',
    elevated: 'border-gray-200 bg-white shadow-lg'
  },
  
  // Colors and theming
  colors: {
    border: 'border-gray-200',
    background: 'bg-white',
    backgroundSecondary: 'bg-gray-50',
    text: 'text-gray-900',
    textSecondary: 'text-gray-500',
    textMuted: 'text-gray-400',
    hover: 'hover:bg-gray-50',
    selected: 'bg-blue-50',
    sortActive: 'text-blue-600'
  },
  
  // Icons and visual elements
  icons: {
    size: 16,
    sortUp: 'ChevronUp',
    sortDown: 'ChevronDown', 
    sortNeutral: 'ArrowUpDown',
    search: 'Search',
    filter: 'Filter',
    refresh: 'RefreshCw',
    download: 'Download',
    moreActions: 'MoreHorizontal'
  },
  
  // Animation settings
  animations: {
    duration: '150ms',
    timing: 'ease-in-out'
  },
  
  // Responsive breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px'
  },
  
  // Pagination settings
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100],
    maxVisiblePages: 5,
    showSizeSelector: true,
    showInfo: true
  },
  
  // Search and filter settings
  search: {
    placeholder: 'Cari data...',
    debounceMs: 300,
    minCharacters: 1
  },
  
  // Loading and empty states
  states: {
    loading: {
      rows: 5,
      message: 'Memuat data...'
    },
    empty: {
      message: 'Tidak ada data tersedia',
      searchMessage: 'Tidak ada hasil ditemukan'
    },
    error: {
      message: 'Terjadi kesalahan saat memuat data'
    }
  }
};

// Table variants
export const TABLE_VARIANTS = {
  DEFAULT: 'default',
  APPROVAL: 'approval',
  PROJECT: 'project',
  INVENTORY: 'inventory',
  BUDGET: 'budget',
  EMPLOYEE: 'employee',
  FINANCIAL: 'financial',
  USER: 'user',
  REPORT: 'report',
};

// Sort directions
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
};

// Filter types
export const FILTER_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  SELECT: 'select',
  BOOLEAN: 'boolean',
};

// Density options
export const DENSITY_OPTIONS = {
  COMPACT: 'compact',
  NORMAL: 'normal',
  COMFORTABLE: 'comfortable',
};

export default TABLE_CONFIG;