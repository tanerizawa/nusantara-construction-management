import { useMemo } from 'react';
import { documentCategories } from '../config/documentCategories';

/**
 * Custom hook untuk menghitung statistik dokumen
 * Handles: total count, size, category breakdown, status breakdown
 */
export const useDocumentStats = (documents) => {
  const stats = useMemo(() => {
    const totalDocuments = documents.length;
    const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
    
    const byCategory = Object.keys(documentCategories).reduce((acc, cat) => {
      acc[cat] = documents.filter(doc => doc.category === cat).length;
      return acc;
    }, {});
    
    const byStatus = {
      approved: documents.filter(doc => doc.status === 'approved').length,
      review: documents.filter(doc => doc.status === 'review').length,
      draft: documents.filter(doc => doc.status === 'draft').length
    };
    
    return { totalDocuments, totalSize, byCategory, byStatus };
  }, [documents]);

  return stats;
};
