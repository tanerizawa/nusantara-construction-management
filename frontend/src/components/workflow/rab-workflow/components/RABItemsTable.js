import React from 'react';
import { Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

/**
 * RABItemsTable Component
 * Displays RAB items in a table format with inline approval
 */
const RABItemsTable = ({ rabItems, onEdit, onDelete, onApprove, onReject, onApproveAll }) => {
  // Calculate totals
  const totalAmount = rabItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const pendingItems = rabItems.filter(item => !item.isApproved);
  const approvedCount = rabItems.filter(item => item.isApproved).length;
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
              Satuan
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Harga Satuan
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Total
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Approval
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#2C2C2E] divide-y divide-[#38383A]">
          {rabItems.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-[#1C1C1E]">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                {item.category}
              </td>
              <td className="px-4 py-3 text-sm text-white">
                {item.description}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                {item.unit}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                {item.quantity}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                {formatCurrency(item.quantity * item.unitPrice)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.isApproved ? 'bg-[#30D158]/20 text-[#30D158]' : 'bg-[#FF9F0A]/20 text-[#FF9F0A]'
                }`}>
                  {item.isApproved ? 'Approved' : 'Pending'}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {!item.isApproved && onApprove && onReject ? (
                  <div className="flex items-center justify-center space-x-1">
                    <button 
                      onClick={() => onApprove(item)}
                      className="p-1.5 text-[#30D158] hover:bg-[#30D158]/10 rounded transition-colors"
                      title="Approve"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onReject(item)}
                      className="p-1.5 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded transition-colors"
                      title="Reject"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="text-xs text-[#30D158]">✓</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-[#98989D]">
                <div className="flex items-center justify-center space-x-2">
                  <button 
                    onClick={() => onEdit(item)}
                    className="text-[#0A84FF] hover:text-[#0A84FF]/80"
                    title="Edit item"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(item.id, item.description)}
                    className="text-[#FF3B30] hover:text-[#FF3B30]/80"
                    title="Hapus item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        
        {/* Table Footer with Total and Approve All */}
        <tfoot className="bg-[#1C1C1E] border-t-2 border-[#38383A]">
          <tr>
            <td colSpan="5" className="px-4 py-4 text-right text-sm font-semibold text-white">
              Total RAB:
            </td>
            <td className="px-4 py-4 text-sm font-bold text-[#0A84FF]">
              {formatCurrency(totalAmount)}
            </td>
            <td className="px-4 py-4 text-center">
              <span className="text-xs text-[#98989D]">
                {approvedCount}/{rabItems.length} Approved
              </span>
            </td>
            <td colSpan="2" className="px-4 py-4 text-center">
              {pendingItems.length > 0 && onApproveAll && (
                <button
                  onClick={onApproveAll}
                  className="inline-flex items-center px-4 py-2 bg-[#30D158] text-white text-sm font-medium rounded-lg hover:bg-[#30D158]/90 transition-colors"
                  title={`Approve ${pendingItems.length} pending items`}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve All ({pendingItems.length})
                </button>
              )}
              {pendingItems.length === 0 && (
                <span className="text-xs text-[#30D158]">✓ All items approved</span>
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default RABItemsTable;
