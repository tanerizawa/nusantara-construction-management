import React from 'react';
import { Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import RABItemActions from './RABItemActions';
import { executeWorkflowAction } from '../utils/workflowLogic';

/**
 * RABItemsTable Component
 * Displays RAB items in a table format with inline approval and workflow actions
 */
const RABItemsTable = ({ 
  rabItems, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject 
}) => {
  // Handle workflow action execution
  const handleWorkflowAction = async (action, item) => {
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
  };

  // Calculate totals
  const totalAmount = rabItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const pendingItems = rabItems.filter(item => !item.isApproved);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#38383A]">
        <thead className="bg-[#1C1C1E]">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Kategori
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Deskripsi
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Unit
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Qty & Harga
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Subtotal
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#2C2C2E] divide-y divide-[#38383A]">
          {rabItems.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-[#1C1C1E]">
              <td className="px-4 py-3 text-sm text-white">
                <div className="font-medium">{item.category}</div>
              </td>
              <td className="px-4 py-3 text-sm text-white">
                <div className="max-w-xs">
                  <div>{item.description}</div>
                  {item.specifications && (
                    <div className="text-xs text-[#8E8E93] mt-1 truncate" title={item.specifications}>
                      {item.specifications.length > 50 ? item.specifications.substring(0, 50) + '...' : item.specifications}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                {item.unit}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                <div>
                  <span>{item.quantity}</span>
                  <span className="text-[#8E8E93] mx-1">×</span>
                  <span>{formatCurrency(item.unitPrice)}</span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                {formatCurrency(item.quantity * item.unitPrice)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                {!item.isApproved ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FF9F0A]/20 text-[#FF9F0A]">
                    Draft
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#30D158]/20 text-[#30D158]">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Disetujui
                  </span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center justify-center space-x-1">
                  {/* Edit/Delete buttons */}
                  <button 
                    onClick={() => onEdit(item)}
                    className="p-1 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded transition-colors"
                    title="Edit item"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(item.id, item.description)}
                    className="p-1 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded transition-colors" 
                    title="Hapus item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Approval buttons */}
                  {!item.isApproved && onApprove && onReject && (
                    <>
                      <button 
                        onClick={() => onApprove(item)}
                        className="p-1 text-[#30D158] hover:bg-[#30D158]/10 rounded transition-colors"
                        title="Approve"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onReject(item)}
                        className="p-1 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded transition-colors"
                        title="Reject"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        
        <tfoot className="bg-[#1C1C1E] border-t-2 border-[#38383A]">
          <tr>
            <td colSpan="5" className="px-4 py-4 text-right text-sm font-semibold text-white">
              Total RAP:
            </td>
            <td colSpan="2" className="px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#0A84FF]">
                  {formatCurrency(totalAmount)}
                </span>
                <div>
                  {pendingItems.length > 0 && (
                    <button
                      onClick={() => {
                        pendingItems.forEach(item => onApprove(item));
                      }}
                      className="inline-flex items-center px-4 py-2 bg-[#30D158] text-white text-sm font-medium rounded-lg hover:bg-[#30D158]/90 transition-colors"
                      title={`Approve ${pendingItems.length} pending items`}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
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

export default RABItemsTable;
