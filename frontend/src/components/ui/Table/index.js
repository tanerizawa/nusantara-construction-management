// Main Table Component
export { default as Table } from './Table';

// Table Variants
export { DataTable } from './components/DataTable';
export { SimpleTable } from './components/SimpleTable';

// Specialized Tables
export { ProjectTable } from './specializedTables/ProjectTable';
export { InventoryTable } from './specializedTables/InventoryTable';
export { FinancialTable } from './specializedTables/FinancialTable';
export { UserTable } from './specializedTables/UserTable';
export { ReportTable } from './specializedTables/ReportTable';

// Base Components
export { 
  BaseTable, 
  TableHeader, 
  TableBody, 
  TableRow 
} from './components/BaseTable';

export { 
  TableHeaderCell, 
  TableCell 
} from './components/TableCells';

export { TableControls } from './components/TableControls';
export { TablePagination } from './components/TablePagination';
export { TableActions } from './components/TableActions';
export { TableStates } from './components/TableStates';

// Hooks
export { useTableData } from './hooks/useTableData';
export { useTableActions } from './hooks/useTableActions';
export { useTableColumns } from './hooks/useTableColumns';

// Utilities
export { 
  filterData,
  sortData,
  searchData,
  paginateData,
  getColumnValue,
  formatColumnValue
} from './utils/tableUtils';

export { renderCell } from './utils/cellRenderers';

// Configuration
export { 
  TABLE_CONFIG,
  TABLE_VARIANTS,
  DENSITY_OPTIONS,
  SORT_DIRECTIONS,
  FILTER_TYPES
} from './config/tableConfig';

export { 
  DEFAULT_COLUMNS,
  PROJECT_COLUMNS,
  INVENTORY_COLUMNS,
  FINANCIAL_COLUMNS,
  USER_COLUMNS,
  REPORT_COLUMNS
} from './config/columnConfig';

// Types (for TypeScript users)
export const TableTypes = {
  TABLE_VARIANTS,
  DENSITY_OPTIONS,
  SORT_DIRECTIONS,
  FILTER_TYPES
};