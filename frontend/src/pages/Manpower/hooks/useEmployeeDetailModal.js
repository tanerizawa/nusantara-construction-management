import { useState } from 'react';

/**
 * Custom hook for employee detail modal management
 * @returns {Object} Modal state and handler functions
 */
const useEmployeeDetailModal = () => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  /**
   * Open modal with employee data
   * @param {Object} employee - Employee data to display
   */
  const openDetailModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  /**
   * Close the modal and clear selection
   */
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedEmployee(null);
  };

  return {
    showDetailModal,
    selectedEmployee,
    openDetailModal,
    closeDetailModal,
  };
};

export default useEmployeeDetailModal;