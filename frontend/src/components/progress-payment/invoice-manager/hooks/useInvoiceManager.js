import { useMemo } from 'react';
import { generateInvoicesFromPayments, filterInvoices, calculateInvoiceStatistics } from '../utils/invoiceUtils';

/**
 * Main custom hook for Invoice Manager
 */
export const useInvoiceManager = (payments, searchTerm, statusFilter) => {
  // Generate invoices from payments
  const invoices = useMemo(() => {
    return generateInvoicesFromPayments(payments || []);
  }, [payments]);

  // Apply filters
  const filteredInvoices = useMemo(() => {
    return filterInvoices(invoices, searchTerm, statusFilter);
  }, [invoices, searchTerm, statusFilter]);

  // Calculate statistics
  const statistics = useMemo(() => {
    return calculateInvoiceStatistics(invoices);
  }, [invoices]);

  return {
    invoices,
    filteredInvoices,
    statistics
  };
};