import { useState, useMemo } from 'react';
import { calculatePOSummary, filterPOsByStatus } from '../utils/poUtils';

/**
 * Custom hook for managing purchase order filters and summary
 */
export const usePOFilters = (purchaseOrders) => {
  const [filter, setFilter] = useState('all');

  // Calculate summary statistics
  const poSummary = useMemo(() => {
    return calculatePOSummary(purchaseOrders);
  }, [purchaseOrders]);

  // Filter purchase orders based on status
  const filteredPOs = useMemo(() => {
    return filterPOsByStatus(purchaseOrders, filter);
  }, [purchaseOrders, filter]);

  const resetFilter = () => {
    setFilter('all');
  };

  return {
    filter,
    setFilter,
    resetFilter,
    poSummary,
    filteredPOs
  };
};