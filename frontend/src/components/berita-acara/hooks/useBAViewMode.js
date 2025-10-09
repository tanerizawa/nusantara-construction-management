import { useState, useCallback } from 'react';

/**
 * Custom hook untuk mengelola view mode Berita Acara
 * Handles: switching between list, form, and view modes
 */
export const useBAViewMode = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list', 'form', 'view'
  const [selectedBA, setSelectedBA] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Handle create new BA
  const handleCreateBA = useCallback(() => {
    setSelectedBA(null);
    setViewMode('form');
    setShowCreateForm(true);
  }, []);

  // Handle edit existing BA
  const handleEditBA = useCallback((ba) => {
    setSelectedBA(ba);
    setViewMode('form');
    setShowCreateForm(true);
  }, []);

  // Handle view BA details
  const handleViewBA = useCallback((ba) => {
    setSelectedBA(ba);
    setViewMode('view');
  }, []);

  // Reset to list view
  const resetToList = useCallback(() => {
    setViewMode('list');
    setSelectedBA(null);
    setShowCreateForm(false);
  }, []);

  // Switch from view to edit mode
  const switchToEdit = useCallback(() => {
    setViewMode('form');
    setShowCreateForm(true);
  }, []);

  return {
    viewMode,
    selectedBA,
    showCreateForm,
    handleCreateBA,
    handleEditBA,
    handleViewBA,
    resetToList,
    switchToEdit
  };
};
