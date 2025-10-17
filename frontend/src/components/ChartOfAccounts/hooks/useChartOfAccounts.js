import { useState, useEffect, useCallback } from 'react';
import { fetchAccounts } from '../services/accountService';
import { calculateTotalBalances } from '../utils/accountCalculations';
import { useAccountTree } from './useAccountTree';
import { useAccountFilters } from './useAccountFilters';

export const useChartOfAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]); // NEW: Unfiltered accounts for modal dropdowns
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState(null); // NEW: Subsidiary filter
  const [totalBalances, setTotalBalances] = useState({
    totalDebit: 0,
    totalCredit: 0,
    netBalance: 0
  });

  // Use tree and filter hooks
  const treeState = useAccountTree();
  const filterState = useAccountFilters(accounts);

  // Fetch accounts data
  const loadAccounts = useCallback(async (forceRefresh = false, subsidiaryId = null) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      
      const result = await fetchAccounts(forceRefresh, subsidiaryId);
      
      if (result.success) {
        setAccounts(result.data);
        setLastUpdate(new Date());
        
        // Calculate total balances
        const balances = calculateTotalBalances(result.data);
        setTotalBalances(balances);
        
        // NEW: If this is filtered data, also load ALL accounts for modal dropdowns
        if (subsidiaryId) {
          // Fetch all accounts in background (without filter)
          const allResult = await fetchAccounts(false, null);
          if (allResult.success) {
            setAllAccounts(allResult.data);
          }
        } else {
          // No filter, so accounts = allAccounts
          setAllAccounts(result.data);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error loading accounts:', err);
      setError('Failed to load accounts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await loadAccounts(true, selectedSubsidiary);
  }, [loadAccounts, selectedSubsidiary]);

  // Handle account creation success
  const handleAccountCreated = useCallback(() => {
    loadAccounts(true, selectedSubsidiary); // Refresh accounts after creation
  }, [loadAccounts, selectedSubsidiary]);
  
  // Handle subsidiary filter change
  const handleSubsidiaryChange = useCallback((subsidiaryId) => {
    setSelectedSubsidiary(subsidiaryId);
    loadAccounts(false, subsidiaryId);
  }, [loadAccounts]);

  // Recalculate balances when accounts change
  useEffect(() => {
    if (accounts.length > 0) {
      const balances = calculateTotalBalances(accounts);
      setTotalBalances(balances);
    }
  }, [accounts]);

  // Initial load
  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        handleRefresh();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, refreshing, handleRefresh]);

  return {
    // Data
    accounts,
    allAccounts, // NEW: Unfiltered accounts for modal dropdowns
    totalBalances,
    lastUpdate,
    
    // State
    loading,
    error,
    refreshing,
    selectedSubsidiary,
    
    // Actions
    loadAccounts,
    handleRefresh,
    handleAccountCreated,
    handleSubsidiaryChange,
    
    // Tree state
    ...treeState,
    
    // Filter state
    ...filterState
  };
};