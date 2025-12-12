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
    <div className="rounded-3xl border border-white/5 bg-[#05070d]/90 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-[0.3em]">
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
          <tbody className="divide-y divide-white/5 bg-transparent">
            {rabItems.map((item, index) => (
            <tr key={item.id || index} className="transition hover:bg-white/5">
              <td className="px-4 py-3 text-sm text-white">
                <div className="font-medium">{item.category}</div>
              </td>
              <td className="px-4 py-3 text-sm text-white">
                <div className="max-w-xs">
                  <div>{item.description}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {(item.itemType || item.item_type) && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-[#0A84FF]/20 text-[#0A84FF]">
                        {(item.itemType || item.item_type) === 'material' ? 'Material' :
                         (item.itemType || item.item_type) === 'service' ? 'Jasa' :
                         (item.itemType || item.item_type) === 'labor' ? 'Tenaga' :
                         (item.itemType || item.item_type) === 'equipment' ? 'Alat' :
                         (item.itemType || item.item_type) === 'overhead' ? 'Overhead' :
                         (item.itemType || item.item_type) === 'tax' ? 'Pajak' : (item.itemType || item.item_type)}
                      </span>
                    )}
                    {item.specifications && (
                      <div className="text-xs text-[#8E8E93] truncate flex-1" title={item.specifications}>
                        {item.specifications.length > 40 ? item.specifications.substring(0, 40) + '...' : item.specifications}
                      </div>
                    )}
                  </div>
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
                  <span className="inline-flex items-center rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/15 px-2.5 py-0.5 text-xs font-medium text-[#fcd34d]">
                    Draft
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-[#34d399]/30 bg-[#34d399]/15 px-2.5 py-0.5 text-xs font-medium text-[#bbf7d0]">
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
                    className="rounded-full border border-white/10 p-1 text-[#60a5fa] transition hover:border-white/40 hover:bg-white/5"
                    title="Edit item"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(item.id, item.description)}
                    className="rounded-full border border-white/10 p-1 text-[#fb7185] transition hover:border-white/40 hover:bg-white/5" 
                    title="Hapus item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Approval buttons */}
                  {!item.isApproved && onApprove && onReject && (
                    <>
                      <button 
                        onClick={() => onApprove(item)}
                        className="rounded-full border border-white/10 p-1 text-[#34d399] transition hover:border-white/40 hover:bg-white/5"
                        title="Approve"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onReject(item)}
                        className="rounded-full border border-white/10 p-1 text-[#fb7185] transition hover:border-white/40 hover:bg-white/5"
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
          
          <tfoot className="border-t border-white/10 bg-white/5 text-white">
          <tr>
            <td colSpan="5" className="px-4 py-4 text-right text-sm font-semibold text-white">
              Total RAP:
            </td>
            <td colSpan="2" className="px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#60a5fa]">
                  {formatCurrency(totalAmount)}
                </span>
                <div>
                  {pendingItems.length > 0 && (
                    <button
                      onClick={() => {
                        pendingItems.forEach(item => onApprove(item));
                      }}
                      className="inline-flex items-center rounded-2xl border border-white/10 bg-gradient-to-r from-[#34d399] to-[#22c55e] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(34,197,94,0.35)] transition hover:brightness-110"
                      title={`Approve ${pendingItems.length} pending items`}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve All ({pendingItems.length})
                    </button>
                  )}
                  {pendingItems.length === 0 && (
                    <span className="inline-flex items-center rounded-full border border-[#34d399]/30 bg-[#34d399]/15 px-3 py-1.5 text-xs font-medium text-[#bbf7d0]">
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
    </div>
  );
};

export default RABItemsTable;
