import { useMemo } from 'react';

/**
 * Custom hook untuk menghitung statistik Berita Acara
 * Provides: summary statistics from BA list
 */
export const useBAStatistics = (baList) => {
  const statistics = useMemo(() => {
    if (!Array.isArray(baList) || baList.length === 0) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        paymentReady: 0,
        draft: 0,
        rejected: 0
      };
    }

    return {
      total: baList.length,
      pending: baList.filter(ba => 
        ['draft', 'submitted', 'client_review'].includes(ba.status)
      ).length,
      approved: baList.filter(ba => ba.status === 'approved').length,
      paymentReady: baList.filter(ba => 
        ba.status === 'approved' && ba.paymentAuthorized
      ).length,
      draft: baList.filter(ba => ba.status === 'draft').length,
      rejected: baList.filter(ba => ba.status === 'rejected').length
    };
  }, [baList]);

  return statistics;
};
