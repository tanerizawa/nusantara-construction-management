import { useState, useEffect } from 'react';
import { fetchBankAccounts } from '../services/invoiceAPI';
import { DEFAULT_BANKS } from '../config/invoiceConfig';

/**
 * Custom hook for managing bank accounts
 */
export const useBankAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loadingBankAccounts, setLoadingBankAccounts] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBankAccounts = async () => {
      try {
        setLoadingBankAccounts(true);
        setError(null);
        
        const result = await fetchBankAccounts();
        
        if (result.success) {
          console.log('✓ Fetched bank accounts from COA:', result.data.length);
          setBankAccounts(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch bank accounts');
        }
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
        setError(error.message);
        
        // Fallback to default banks if fetch fails
        setBankAccounts(DEFAULT_BANKS);
      } finally {
        setLoadingBankAccounts(false);
      }
    };

    loadBankAccounts();
  }, []);

  return {
    bankAccounts,
    loadingBankAccounts,
    error,
    refetch: () => {
      // Allow manual refresh if needed
      const loadBankAccounts = async () => {
        try {
          setLoadingBankAccounts(true);
          setError(null);
          
          const result = await fetchBankAccounts();
          
          if (result.success) {
            setBankAccounts(result.data);
          } else {
            throw new Error(result.error || 'Failed to fetch bank accounts');
          }
        } catch (error) {
          console.error('Error fetching bank accounts:', error);
          setError(error.message);
          setBankAccounts(DEFAULT_BANKS);
        } finally {
          setLoadingBankAccounts(false);
        }
      };
      
      loadBankAccounts();
    }
  };
};