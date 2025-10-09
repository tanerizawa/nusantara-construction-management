import { useState, useEffect } from 'react';

/**
 * Custom hook for managing available Purchase Orders
 */
const useAvailablePOs = (projectId) => {
  const [availablePOs, setAvailablePOs] = useState([]);

  const fetchAvailablePOs = async () => {
    // Try primary endpoint silently (backend not implemented yet)
    try {
      const response = await fetch(`/api/projects/${projectId}/delivery-receipts/available-pos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }).catch(() => null); // Suppress network errors
      
      if (response && response.ok) {
        const result = await response.json();
        setAvailablePOs(result.data || []);
        return;
      }
    } catch (error) {
      // Silent - endpoint not implemented yet
    }

    // Fallback to purchase-orders endpoint
    try {
      const poResponse = await fetch(`/api/purchase-orders?projectId=${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (poResponse.ok) {
        const poResult = await poResponse.json();
        // Filter only approved POs that can have delivery receipts
        const approvedPOs = (poResult.data || [])
          .filter(po => po.status === 'approved' || po.status === 'delivered')
          .map(po => ({
            ...po,
            canCreateReceipt: true
          }));
        setAvailablePOs(approvedPOs);
      } else {
        setAvailablePOs([]);
      }
    } catch (fallbackError) {
      // Fallback also failed - set empty array
      setAvailablePOs([]);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchAvailablePOs();
    }
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    availablePOs,
    fetchAvailablePOs
  };
};

export default useAvailablePOs;
