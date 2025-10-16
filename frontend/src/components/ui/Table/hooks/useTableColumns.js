import { useState, useCallback, useEffect } from 'react';

export const useTableColumns = (initialColumns = [], options = {}) => {
  const {
    hiddenByDefault = [],
    fixedColumns = [], // Columns that cannot be hidden
    defaultSort = null
  } = options;

  const [columns, setColumns] = useState(initialColumns);
  const [hiddenColumns, setHiddenColumns] = useState(new Set(hiddenByDefault));
  const [columnOrder, setColumnOrder] = useState(
    initialColumns.map((col, index) => col.key || index)
  );

  // Update columns when initialColumns change
  useEffect(() => {
    setColumns(initialColumns);
    setColumnOrder(initialColumns.map((col, index) => col.key || index));
  }, [initialColumns]);

  // Get visible columns in the correct order
  const visibleColumns = useCallback(() => {
    return columnOrder
      .map(key => columns.find(col => (col.key || columns.indexOf(col)) === key))
      .filter(col => col && !hiddenColumns.has(col.key || columns.indexOf(col)));
  }, [columns, columnOrder, hiddenColumns]);

  // Toggle column visibility
  const toggleColumn = useCallback((columnKey) => {
    if (fixedColumns.includes(columnKey)) return; // Can't hide fixed columns
    
    setHiddenColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  }, [fixedColumns]);

  // Show column
  const showColumn = useCallback((columnKey) => {
    setHiddenColumns(prev => {
      const newSet = new Set(prev);
      newSet.delete(columnKey);
      return newSet;
    });
  }, []);

  // Hide column
  const hideColumn = useCallback((columnKey) => {
    if (fixedColumns.includes(columnKey)) return; // Can't hide fixed columns
    
    setHiddenColumns(prev => new Set([...prev, columnKey]));
  }, [fixedColumns]);

  // Reset column visibility
  const resetColumnVisibility = useCallback(() => {
    setHiddenColumns(new Set(hiddenByDefault));
  }, [hiddenByDefault]);

  // Reorder columns
  const reorderColumns = useCallback((startIndex, endIndex) => {
    setColumnOrder(prev => {
      const newOrder = [...prev];
      const [removed] = newOrder.splice(startIndex, 1);
      newOrder.splice(endIndex, 0, removed);
      return newOrder;
    });
  }, []);

  // Update column configuration
  const updateColumn = useCallback((columnKey, updates) => {
    setColumns(prev => prev.map(col => 
      (col.key || prev.indexOf(col)) === columnKey 
        ? { ...col, ...updates }
        : col
    ));
  }, []);

  // Add new column
  const addColumn = useCallback((column, position = -1) => {
    setColumns(prev => {
      const newColumns = [...prev];
      if (position >= 0 && position < newColumns.length) {
        newColumns.splice(position, 0, column);
      } else {
        newColumns.push(column);
      }
      return newColumns;
    });

    const columnKey = column.key || columns.length;
    setColumnOrder(prev => {
      const newOrder = [...prev];
      if (position >= 0 && position < newOrder.length) {
        newOrder.splice(position, 0, columnKey);
      } else {
        newOrder.push(columnKey);
      }
      return newOrder;
    });
  }, [columns.length]);

  // Remove column
  const removeColumn = useCallback((columnKey) => {
    if (fixedColumns.includes(columnKey)) return; // Can't remove fixed columns
    
    setColumns(prev => prev.filter(col => 
      (col.key || prev.indexOf(col)) !== columnKey
    ));
    
    setColumnOrder(prev => prev.filter(key => key !== columnKey));
    setHiddenColumns(prev => {
      const newSet = new Set(prev);
      newSet.delete(columnKey);
      return newSet;
    });
  }, [fixedColumns]);

  // Get column visibility info
  const getColumnInfo = useCallback(() => {
    return columns.map(col => {
      const key = col.key || columns.indexOf(col);
      return {
        key,
        title: col.title,
        visible: !hiddenColumns.has(key),
        fixed: fixedColumns.includes(key),
        sortable: col.sortable,
        filterable: col.filterable
      };
    });
  }, [columns, hiddenColumns, fixedColumns]);

  return {
    // Current state
    columns,
    visibleColumns: visibleColumns(),
    hiddenColumns,
    columnOrder,
    
    // Actions
    toggleColumn,
    showColumn,
    hideColumn,
    resetColumnVisibility,
    reorderColumns,
    updateColumn,
    addColumn,
    removeColumn,
    
    // Info
    getColumnInfo,
    totalColumns: columns.length,
    visibleColumnCount: columns.length - hiddenColumns.size,
    hiddenColumnCount: hiddenColumns.size
  };
};