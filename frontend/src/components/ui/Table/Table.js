import React, { useMemo } from 'react';
import { DataTable } from './components/DataTable';
import { SimpleTable } from './components/SimpleTable';
import { ProjectTable } from './specializedTables/ProjectTable';
import { InventoryTable } from './specializedTables/InventoryTable';
import { FinancialTable } from './specializedTables/FinancialTable';
import { UserTable } from './specializedTables/UserTable';
import { ReportTable } from './specializedTables/ReportTable';
import { TABLE_VARIANTS } from './config/tableConfig';
import { useTranslation } from '../../../i18n';

const Table = ({
  variant = TABLE_VARIANTS.DATA,
  data = [],
  columns = [],
  loading = false,
  error = null,
  ...props
}) => {
  const { common } = useTranslation();
  // Memoize column configuration
  const memoizedColumns = useMemo(() => {
    if (!columns || !columns.length) return [];
    
    return columns.map(column => ({
      key: column.key || column.dataIndex,
      title: column.title || column.label,
      dataIndex: column.dataIndex || column.key,
      align: column.align || 'left',
      width: column.width,
      sortable: column.sortable !== false,
      filterable: column.filterable !== false,
      render: column.render,
      ...column
    }));
  }, [columns]);

  // Memoize data
  const memoizedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((item, index) => ({
      ...item,
      key: item.key || item.id || index
    }));
  }, [data]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">{common.loading}</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <div className="text-red-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {typeof error === 'string' ? error : common.error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render appropriate table variant
  switch (variant) {
    case TABLE_VARIANTS.SIMPLE:
      return (
        <SimpleTable
          data={memoizedData}
          columns={memoizedColumns}
          {...props}
        />
      );

    case TABLE_VARIANTS.PROJECT:
      return (
        <ProjectTable
          data={memoizedData}
          columns={memoizedColumns}
          {...props}
        />
      );

    case TABLE_VARIANTS.INVENTORY:
      return (
        <InventoryTable
          data={memoizedData}
          columns={memoizedColumns}
          {...props}
        />
      );

    case TABLE_VARIANTS.FINANCIAL:
      return (
        <FinancialTable
          data={memoizedData}
          columns={memoizedColumns}
          {...props}
        />
      );

    case TABLE_VARIANTS.USER:
      return (
        <UserTable
          data={memoizedData}
          columns={memoizedColumns}
          {...props}
        />
      );

    case TABLE_VARIANTS.REPORT:
      return (
        <ReportTable
          data={memoizedData}
          columns={memoizedColumns}
          {...props}
        />
      );

    case TABLE_VARIANTS.DATA:
    default:
      return (
        <DataTable
          data={memoizedData}
          columns={memoizedColumns}
          {...props}
        />
      );
  }
};

export default Table;