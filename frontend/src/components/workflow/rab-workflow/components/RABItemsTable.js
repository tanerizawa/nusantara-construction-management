import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

/**
 * RABItemsTable Component
 * Displays RAB items in a table format
 */
const RABItemsTable = ({ rabItems, onEdit, onDelete }) => {
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
            <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
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
              <td className="px-4 py-3 whitespace-nowrap text-sm text-[#98989D]">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onEdit(item)}
                    className="text-[#0A84FF] hover:text-[#0A84FF]"
                    title="Edit item"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(item.id, item.description)}
                    className="text-[#FF3B30] hover:text-[#FF3B30]"
                    title="Hapus item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RABItemsTable;
