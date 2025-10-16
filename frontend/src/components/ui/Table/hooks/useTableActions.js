import { useState, useCallback } from 'react';

export const useTableActions = (onAction) => {
  const [loadingActions, setLoadingActions] = useState(new Set());
  const [actionErrors, setActionErrors] = useState({});

  const executeAction = useCallback(async (actionType, targetItems, options = {}) => {
    const actionId = `${actionType}-${Date.now()}`;
    
    try {
      setLoadingActions(prev => new Set([...prev, actionId]));
      setActionErrors(prev => ({
        ...prev,
        [actionType]: null
      }));

      if (onAction) {
        await onAction(actionType, targetItems, options);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error.message || `Failed to execute ${actionType}`;
      setActionErrors(prev => ({
        ...prev,
        [actionType]: errorMessage
      }));
      
      return { success: false, error: errorMessage };
    } finally {
      setLoadingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }
  }, [onAction]);

  const handleSingleAction = useCallback(async (actionType, item, options = {}) => {
    return executeAction(actionType, [item], options);
  }, [executeAction]);

  const handleBulkAction = useCallback(async (actionType, items, options = {}) => {
    return executeAction(actionType, items, options);
  }, [executeAction]);

  const clearActionError = useCallback((actionType) => {
    setActionErrors(prev => ({
      ...prev,
      [actionType]: null
    }));
  }, []);

  const clearAllActionErrors = useCallback(() => {
    setActionErrors({});
  }, []);

  const isActionLoading = useCallback((actionType) => {
    return Array.from(loadingActions).some(id => id.startsWith(`${actionType}-`));
  }, [loadingActions]);

  return {
    executeAction,
    handleSingleAction,
    handleBulkAction,
    clearActionError,
    clearAllActionErrors,
    isActionLoading,
    actionErrors,
    hasLoadingActions: loadingActions.size > 0
  };
};