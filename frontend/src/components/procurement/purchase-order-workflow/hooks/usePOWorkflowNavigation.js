import { useState } from 'react';
import { VIEWS } from '../config/poConfig';

/**
 * Custom hook for managing purchase order workflow navigation
 */
export const usePOWorkflowNavigation = () => {
  const [currentView, setCurrentView] = useState(VIEWS.LIST);
  const [selectedPO, setSelectedPO] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const showList = () => {
    setCurrentView(VIEWS.LIST);
    setSelectedProject(null);
    setSelectedPO(null);
  };

  const showProjectSelection = () => {
    setCurrentView(VIEWS.PROJECT_SELECTION);
    setSelectedPO(null);
  };

  const showCreateForm = (project) => {
    setSelectedProject(project);
    setCurrentView(VIEWS.CREATE_FORM);
  };

  const showPODetail = (po) => {
    setSelectedPO(po);
    setCurrentView(VIEWS.PO_DETAIL);
  };

  const goBackToProjectSelection = () => {
    setCurrentView(VIEWS.PROJECT_SELECTION);
  };

  const handleProjectSelect = (project) => {
    showCreateForm(project);
  };

  const handleViewPODetail = (po) => {
    showPODetail(po);
  };

  const handleBackToList = () => {
    showList();
  };

  const handleShowProjectSelection = () => {
    showProjectSelection();
  };

  return {
    // State
    currentView,
    selectedPO,
    selectedProject,
    
    // Navigation actions
    showList,
    showProjectSelection,
    showCreateForm,
    showPODetail,
    goBackToProjectSelection,
    
    // Event handlers
    handleProjectSelect,
    handleViewPODetail,
    handleBackToList,
    handleShowProjectSelection
  };
};