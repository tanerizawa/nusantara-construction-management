import React from 'react';
import { BaseTable, TableHeader, TableBody, TableRow } from './BaseTable';
import { TableHeaderCell, TableCell } from './TableCells';
import { TableControls } from './TableControls';
import { TablePagination } from './TablePagination';
import { TableActions } from './TableActions';
import { TableSkeleton, EmptyTable, TableError, LoadingOverlay } from './TableStates';
import { useTableData } from '../hooks/useTableData';
import { useTableActions } from '../hooks/useTableActions';
import { renderCell } from '../utils/cellRenderers';
import { getColumnValue } from '../utils/tableUtils';

export const DataTable = ({
  // Data and columns
  data = [],
  columns = [],
  
  // Table behavior
  sortable = true,
  searchable = true,
  filterable = false,
  selectable = false,
  
  // Pagination
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  
  // Styling
  density = 'normal',
  className = '',
  
  // States
  loading = false,
  error = null,
  
  // Actions
  actions = [],
  bulkActions = [],
  onAction,
  onRefresh,
  onExport,
  
  // Advanced options
  emptyState,
  searchPlaceholder,
  
  // Event handlers
  onSort,
  onSearch,
  onFilter,
  onSelect,
  
  ...props
}) => {
  // Use table data hook for state management
  const {
    data: processedData,
    totalItems,
    totalPages,
    currentPage: currentPageState,
    pageSize: pageSizeState,
    loading: dataLoading,
    error: dataError,
    sortConfig,
    searchQuery,
    columnFilters,
    selectedItems,
    handleSort,
    handleSearch,
    handleFilter,
    handlePageChange,
    handlePageSizeChange,
    handleSelectItem,
    handleSelectAll,
    clearAllFilters,
    hasFilters,
    hasSelection,
    isAllSelected,
    paginationInfo
  } = useTableData(data, {
    initialPageSize: pageSize,
    initialPage: currentPage
  });

  // Use actions hook for action management
  const {
    handleSingleAction,
    handleBulkAction,
    isActionLoading,
    actionErrors
  } = useTableActions(onAction);

  // Use controlled pagination if provided
  const finalCurrentPage = onPageChange ? currentPage : currentPageState;
  const finalPageSize = onPageChange ? pageSize : pageSizeState;
  const finalTotalPages = onPageChange ? Math.ceil(data.length / finalPageSize) : totalPages;

  // Handle page changes
  const handlePageChangeInternal = (page) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      handlePageChange(page);
    }
  };

  // Loading and error states
  const isLoading = loading || dataLoading;
  const displayError = error || dataError;

  // Select all checkbox state
  const selectAllState = isAllSelected ? 'checked' : 
                        hasSelection ? 'indeterminate' : 'unchecked';

  if (displayError) {
    return (
      <div className={className}>
        <TableError 
          error={displayError}
          onRetry={onRefresh}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 relative ${className}`} {...props}>
      {/* Loading Overlay */}
      <LoadingOverlay loading={isLoading} />
      
      {/* Table Controls */}
      <TableControls
        searchable={searchable}
        filterable={filterable}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        columns={columns}
        filters={columnFilters}
        onFilterChange={handleFilter}
        onClearFilters={clearAllFilters}
        onRefresh={onRefresh}
        onExport={onExport}
        selectedCount={selectedItems.size}
        bulkActions={bulkActions}
        onBulkAction={handleBulkAction}
      />

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <TableSkeleton 
            rows={5} 
            columns={columns.length + (selectable ? 1 : 0)} 
          />
        </div>
      ) : processedData.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyTable
            searchQuery={searchQuery}
            onClearSearch={() => handleSearch('')}
            {...emptyState}
          />
        </div>
      ) : (
        <BaseTable density={density}>
          <TableHeader>
            <TableRow>
              {/* Select All Checkbox */}
              {selectable && (
                <TableHeaderCell className="w-4">
                  <input
                    type="checkbox"
                    checked={selectAllState === 'checked'}
                    ref={input => {
                      if (input) input.indeterminate = selectAllState === 'indeterminate';
                    }}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </TableHeaderCell>
              )}
              
              {/* Column Headers */}
              {columns.map((column, index) => (
                <TableHeaderCell
                  key={column.key || index}
                  sortable={sortable && column.sortable}
                  sortDirection={
                    sortConfig.key === column.key ? sortConfig.direction : null
                  }
                  onSort={() => sortable && column.sortable && handleSort(column.key)}
                  align={column.align}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.title}
                </TableHeaderCell>
              ))}
              
              {/* Actions Column */}
              {actions.length > 0 && (
                <TableHeaderCell align="center" className="w-20">
                  Aksi
                </TableHeaderCell>
              )}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {processedData.map((item, rowIndex) => {
              const itemId = item.id || rowIndex;
              const isSelected = selectedItems.has(itemId);
              
              return (
                <TableRow 
                  key={itemId}
                  selected={isSelected}
                >
                  {/* Select Checkbox */}
                  {selectable && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectItem(itemId)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </TableCell>
                  )}
                  
                  {/* Data Cells */}
                  {columns.map((column, colIndex) => {
                    const cellValue = getColumnValue(item, column);
                    
                    return (
                      <TableCell 
                        key={column.key || colIndex}
                        align={column.align}
                      >
                        {typeof cellValue === 'object' && cellValue?.type 
                          ? renderCell(cellValue)
                          : cellValue
                        }
                      </TableCell>
                    );
                  })}
                  
                  {/* Actions Cell */}
                  {actions.length > 0 && (
                    <TableCell align="center">
                      <TableActions
                        actions={actions}
                        item={item}
                        onAction={handleSingleAction}
                        loading={isActionLoading('any')}
                      />
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </BaseTable>
      )}

      {/* Pagination */}
      {!isLoading && processedData.length > 0 && (
        <TablePagination
          currentPage={finalCurrentPage}
          totalPages={finalTotalPages}
          totalItems={totalItems}
          pageSize={finalPageSize}
          onPageChange={handlePageChangeInternal}
          onPageSizeChange={onPageChange ? undefined : handlePageSizeChange}
        />
      )}
    </div>
  );
};