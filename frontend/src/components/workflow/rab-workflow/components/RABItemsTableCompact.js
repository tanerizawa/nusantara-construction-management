import React, { useCallback } from 'react';
import { Trash2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import StatusBadge from './StatusBadge';
import { executeWorkflowAction } from '../utils/workflowLogic';
import { rejectRABItem, deleteRABItem } from '../utils/rabApprovalHelpers';

/**
 * RABItemsTableCompact Component
 * Streamlined RAB items table with compact single-line layout and consolidated approval buttons
 */
const RABItemsTableCompact = ({ 
  rabItems, 
  onDelete, 
  onApprove, 
  onReject 
}) => {
  // Handle delete with confirmation
  const handleDelete = useCallback((id, description) => {
    if (id) {
      // First delete through the helper function
      deleteRABItem(id).then(() => {
        // Then notify parent component
        onDelete(id, description);
      }).catch(err => {
        console.error("Error deleting item:", err);
        // Show error message to user
        alert("Error deleting item: " + err.message);
      });
    }
  }, [onDelete]);

  const handleApprove = useCallback((item) => {
    onApprove(item);
  }, [onApprove]);

  const handleReject = useCallback((item) => {
    // Use the rejectRABItem helper instead of directly calling onReject
    // This ensures proper workflow tracking and audit trail
    rejectRABItem(item).then(updatedItem => {
      onReject(updatedItem);
    }).catch(err => {
      console.error("Error rejecting item:", err);
    });
  }, [onReject]);

  // Handle workflow action execution with useCallback for stable reference
  const handleWorkflowAction = useCallback(async (action, item) => {
    try {
      const result = await executeWorkflowAction(action, item);
      
      // Handle different action types
      switch (action) {
        case 'createPO':
          console.log('PO created for item:', item.id, result);
          break;
        case 'processPayroll':
          console.log('Payroll processed for item:', item.id, result);
          break;
        case 'createContract':
          console.log('Contract created for item:', item.id, result);
          break;
        case 'directPayment':
          console.log('Direct payment processed for item:', item.id, result);
          break;
        case 'scheduleRental':
          console.log('Rental scheduled for item:', item.id, result);
          break;
        default:
          console.log('Action executed:', action, result);
      }
    } catch (error) {
      console.error('Error executing workflow action:', error);
    }
  }, []);

  // No editing functionality needed anymore

  // Calculate totals
  const totalAmount = rabItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const pendingItems = rabItems.filter(item => !item.isApproved);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#38383A]">
        <thead className="bg-[#1C1C1E]">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Kategori
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Deskripsi
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Qty & Harga
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Subtotal
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Status & Aksi
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Tindakan
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#2C2C2E] divide-y divide-[#38383A]">
          {rabItems.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-[#1C1C1E]">
              <td className="px-4 py-2 whitespace-nowrap text-sm text-white">
                <div className="font-medium">{item.category}</div>
              </td>
              <td className="px-4 py-2 text-sm text-white">
                <div className="flex items-center">
                  <div className="mr-2">
                    <div className="font-medium">{item.description}</div>
                    <div className="text-xs text-[#8E8E93] flex items-center gap-1.5">
                      <span className="font-medium text-[#5AC8FA]">{item.unit}</span>
                      {(item.itemType || item.item_type) && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-[#0A84FF]/20 text-[#0A84FF]">
                            {(item.itemType || item.item_type) === 'material' ? 'Material' :
                             (item.itemType || item.item_type) === 'service' ? 'Jasa' :
                             (item.itemType || item.item_type) === 'labor' ? 'Tenaga' :
                             (item.itemType || item.item_type) === 'equipment' ? 'Alat' :
                             (item.itemType || item.item_type) === 'overhead' ? 'Overhead' :
                             (item.itemType || item.item_type) === 'tax' ? 'Pajak' : (item.itemType || item.item_type)}
                          </span>
                        </>
                      )}
                      {item.specifications && (
                        <>
                          <span>•</span>
                          <span>{item.specifications.length > 25 ? item.specifications.substring(0, 25) + '...' : item.specifications}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-white">
                <div>
                  <span>{item.quantity}</span>
                  <span className="text-[#8E8E93] mx-1">×</span>
                  <span>{formatCurrency(item.unitPrice)}</span>
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">
                {formatCurrency(item.quantity * item.unitPrice)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                <div className="flex items-center space-x-2">
                  <StatusBadge status={item.isApproved ? 'approved' : item.status === 'rejected' ? 'rejected' : 'draft'} />
                  
                  {!item.isApproved && onApprove && onReject && (
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleApprove(item)}
                        className="p-1 text-[#30D158] hover:bg-[#30D158]/10 rounded transition-colors"
                        title="Approve"
                        data-testid={`approve-button-${item.id || index}`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleReject(item)}
                        className="p-1 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded transition-colors"
                        title="Reject - Item remains in system with rejected status"
                        data-testid={`reject-button-${item.id || index}`}
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                      {item.status === 'rejected' && (
                        <span className="text-xs text-[#FF3B30]">
                          <AlertTriangle className="h-3 w-3 inline mr-1" />
                          Rejected
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right">
                <div className="flex items-center justify-end space-x-1">
                  {/* Only Delete button - disabled when item is approved */}
                  <button 
                    onClick={() => {
                      if (window.confirm(`Yakin ingin menghapus item "${item.description}"?`)) {
                        handleDelete(item.id, item.description);
                      }
                    }}
                    disabled={item.isApproved}
                    className={`p-1 rounded transition-colors ${
                      item.isApproved 
                        ? 'text-[#8E8E93] cursor-not-allowed opacity-50' 
                        : 'text-[#FF3B30] hover:bg-[#FF3B30]/10'
                    }`}
                    title={item.isApproved ? "Tidak dapat menghapus item yang sudah disetujui" : "Hapus item"}
                    data-testid={`delete-button-${item.id || index}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        
        <tfoot className="bg-[#1C1C1E] border-t-2 border-[#38383A]">
          <tr>
            <td colSpan="4" className="px-4 py-3 text-right text-sm font-semibold text-white">
              Total RAP:
            </td>
            <td colSpan="2" className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#0A84FF]">
                  {formatCurrency(totalAmount)}
                </span>
                <div>
                  {pendingItems.length > 0 && (
                    <button
                      onClick={() => {
                        pendingItems.forEach(item => handleApprove(item));
                      }}
                      className="inline-flex items-center px-3 py-1.5 bg-[#30D158] text-white text-xs font-medium rounded-lg hover:bg-[#30D158]/90 transition-colors"
                      title={`Approve ${pendingItems.length} pending items`}
                      data-testid="approve-all-button"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Approve All ({pendingItems.length})
                    </button>
                  )}
                  {pendingItems.length === 0 && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#30D158]/20 text-[#30D158]">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Semua item disetujui
                    </span>
                  )}
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

// Export without memo to ensure updates happen properly
export default RABItemsTableCompact;
