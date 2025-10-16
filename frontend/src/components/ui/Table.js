// Legacy Table.js - Now using modular architecture
// Original 932-line monolithic file has been modularized into 25+ focused files
// For detailed implementation, see: /src/components/ui/Table/

export { default } from './Table/Table';

// Re-export commonly used variants for backward compatibility
export { 
  DataTable,
  SimpleTable,
  ProjectTable,
  InventoryTable,
  FinancialTable,
  UserTable,
  ReportTable,
  TableTypes
} from './Table';

// Re-export base components
export {
  BaseTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  TableControls,
  TablePagination,
  TableActions
} from './Table';

// Re-export hooks
export {
  useTableData,
  useTableActions,
  useTableColumns
} from './Table';

// Re-export utilities
export {
  filterData,
  sortData,
  searchData,
  paginateData,
  getColumnValue,
  formatColumnValue,
  renderCell
} from './Table';

// Re-export configuration
export {
  TABLE_CONFIG,
  TABLE_VARIANTS,
  DENSITY_OPTIONS,
  SORT_DIRECTIONS,
  FILTER_TYPES,
  DEFAULT_COLUMNS,
  PROJECT_COLUMNS,
  INVENTORY_COLUMNS,
  FINANCIAL_COLUMNS,
  USER_COLUMNS,
  REPORT_COLUMNS
} from './Table';
