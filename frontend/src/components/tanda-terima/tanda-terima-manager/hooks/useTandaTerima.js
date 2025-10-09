import { useState, useEffect } from 'react';

/**
 * Custom hook for managing Tanda Terima data
 */
const useTandaTerima = (projectId, onReceiptChange) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/delivery-receipts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }).catch(() => null); // Suppress network errors
      
      if (response && response.ok) {
        const result = await response.json();
        setReceipts(result.data || []);
      } else {
        // Endpoint not implemented yet - show empty state silently
        setReceipts([]);
      }
    } catch (error) {
      // Silent - endpoint not implemented yet
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  };

  const approveReceipt = async (receiptId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/delivery-receipts/${receiptId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inspectionResult: 'passed',
          qualityNotes: 'Approved by system',
          conditionNotes: 'Quality check passed',
          approvedAt: new Date().toISOString()
        })
      }).catch(() => null); // Suppress network errors (API not implemented yet)

      if (response && response.ok) {
        // Success - refresh data
        await fetchReceipts();
        if (onReceiptChange) onReceiptChange();
        alert('✅ Tanda terima berhasil disetujui!');
        return { success: true };
      } else if (!response || response.status === 500 || response.status === 404) {
        // API not implemented yet
        alert('⚠️ Endpoint approval belum tersedia. Backend sedang dalam pengembangan.');
        return { success: false, notImplemented: true };
      } else {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`❌ Error: ${error.error || 'Gagal menyetujui tanda terima'}`);
        return { success: false };
      }
    } catch (error) {
      console.error('Error approving receipt:', error);
      alert('❌ Terjadi kesalahan saat menyetujui tanda terima');
      return { success: false };
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchReceipts();
    }
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    receipts,
    loading,
    fetchReceipts,
    approveReceipt
  };
};

export default useTandaTerima;
