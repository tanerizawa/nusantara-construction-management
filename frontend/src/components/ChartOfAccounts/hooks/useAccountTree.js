import { useState, useCallback } from 'react';

export const useAccountTree = () => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedNodes, setSelectedNodes] = useState(new Set());

  // Toggle node expansion
  const toggleNode = useCallback((nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // Expand specific node
  const expandNode = useCallback((nodeId) => {
    setExpandedNodes(prev => new Set([...prev, nodeId]));
  }, []);

  // Collapse specific node
  const collapseNode = useCallback((nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
  }, []);

  // Expand all nodes
  const expandAll = useCallback((accounts) => {
    const allNodeIds = new Set();
    
    const collectNodeIds = (accountsList) => {
      accountsList.forEach(account => {
        allNodeIds.add(account.id);
        if (account.SubAccounts && account.SubAccounts.length > 0) {
          collectNodeIds(account.SubAccounts);
        }
      });
    };
    
    collectNodeIds(accounts);
    setExpandedNodes(allNodeIds);
  }, []);

  // Collapse all nodes
  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  // Toggle node selection
  const toggleNodeSelection = useCallback((nodeId) => {
    setSelectedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // Select specific node
  const selectNode = useCallback((nodeId) => {
    setSelectedNodes(prev => new Set([...prev, nodeId]));
  }, []);

  // Deselect specific node
  const deselectNode = useCallback((nodeId) => {
    setSelectedNodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
  }, []);

  // Select all nodes
  const selectAll = useCallback((accounts) => {
    const allNodeIds = new Set();
    
    const collectNodeIds = (accountsList) => {
      accountsList.forEach(account => {
        allNodeIds.add(account.id);
        if (account.SubAccounts && account.SubAccounts.length > 0) {
          collectNodeIds(account.SubAccounts);
        }
      });
    };
    
    collectNodeIds(accounts);
    setSelectedNodes(allNodeIds);
  }, []);

  // Deselect all nodes
  const deselectAll = useCallback(() => {
    setSelectedNodes(new Set());
  }, []);

  // Check if node is expanded
  const isNodeExpanded = useCallback((nodeId) => {
    return expandedNodes.has(nodeId);
  }, [expandedNodes]);

  // Check if node is selected
  const isNodeSelected = useCallback((nodeId) => {
    return selectedNodes.has(nodeId);
  }, [selectedNodes]);

  // Get expansion state
  const getExpansionState = useCallback(() => {
    return {
      expandedCount: expandedNodes.size,
      expandedNodes: Array.from(expandedNodes)
    };
  }, [expandedNodes]);

  // Get selection state
  const getSelectionState = useCallback(() => {
    return {
      selectedCount: selectedNodes.size,
      selectedNodes: Array.from(selectedNodes)
    };
  }, [selectedNodes]);

  return {
    expandedNodes,
    selectedNodes,
    toggleNode,
    expandNode,
    collapseNode,
    expandAll,
    collapseAll,
    toggleNodeSelection,
    selectNode,
    deselectNode,
    selectAll,
    deselectAll,
    isNodeExpanded,
    isNodeSelected,
    getExpansionState,
    getSelectionState
  };
};