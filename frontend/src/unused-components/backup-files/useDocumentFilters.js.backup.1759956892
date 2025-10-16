import { useState, useMemo } from 'react';

/**
 * Custom hook untuk filtering dan searching dokumen
 * Handles: search, category filter, computed filtered results
 */
export const useDocumentFilters = (documents) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Filter documents based on search and category
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [documents, searchTerm, filterCategory]);

  return {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filteredDocuments
  };
};
