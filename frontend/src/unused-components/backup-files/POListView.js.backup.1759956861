import React, { useState } from 'react';
import { ArrowLeft, Eye, FileText, Calendar, Building, User } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import { POStatusBadge } from '../components';
import { formatPONumber } from '../utils/poFormatters';

/**
 * PO List View
 * Displays list of all purchase orders with filtering and detail view
 * 
 * TODO: Extract full functionality from original ProjectPurchaseOrders.js lines 1363-1830
 */
const POListView = ({ 
  purchaseOrders, 
  onBack, 
  projectName, 
  projectAddress, 
  projectId,
  loading 
}) => {
  const [selectedPO, setSelectedPO] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter POs
  const filteredPOs = filterStatus === 'all' 
    ? purchaseOrders 
    : purchaseOrders.filter(po => po.status?.toLowerCase() === filterStatus.toLowerCase());

  // Show PO detail
  const showPODetail = (po) => {
    setSelectedPO(po);
  };

  // Close detail view
  const closeDetail = () => {
    setSelectedPO(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data Purchase Orders...</p>
        </div>
      </div>
    );
  }

  // Detail View
  if (selectedPO) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={closeDetail}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {formatPONumber(selectedPO.poNumber || selectedPO.po_number)}
              </h3>
              <p className="text-sm text-gray-600">
                Detail Purchase Order
              </p>
            </div>
          </div>
          <POStatusBadge status={selectedPO.status} />
        </div>

        {/* PO Detail Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          {/* Supplier Info */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-600" />
              Informasi Supplier
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nama:</span>
                <p className="font-medium text-gray-900">{selectedPO.supplierName || selectedPO.supplier_name || '-'}</p>
              </div>
              <div>
                <span className="text-gray-600">Kontak:</span>
                <p className="font-medium text-gray-900">{selectedPO.supplierContact || selectedPO.supplier_contact || '-'}</p>
              </div>
              <div>
                <span className="text-gray-600">Alamat:</span>
                <p className="font-medium text-gray-900">{selectedPO.supplierAddress || selectedPO.supplier_address || '-'}</p>
              </div>
              <div>
                <span className="text-gray-600">Tanggal Pengiriman:</span>
                <p className="font-medium text-gray-900">
                  {formatDate(selectedPO.deliveryDate || selectedPO.delivery_date || selectedPO.expectedDeliveryDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Daftar Item
            </h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga Satuan</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(selectedPO.items || []).map((item, index) => {
                    const qty = parseFloat(item.quantity) || 0;
                    const price = parseFloat(item.unitPrice || item.unit_price) || 0;
                    const total = qty * price;
                    
                    return (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.itemName || item.item_name || item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {qty.toFixed(2)} {item.unit}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(price)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(selectedPO.totalAmount || selectedPO.total_amount || 0)}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="block text-gray-500">Dibuat:</span>
              <span className="font-medium text-gray-900">
                {formatDate(selectedPO.createdAt || selectedPO.created_at)}
              </span>
            </div>
            {selectedPO.approved_at && (
              <div>
                <span className="block text-gray-500">Disetujui:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(selectedPO.approved_at)}
                </span>
              </div>
            )}
            {selectedPO.approved_by && (
              <div>
                <span className="block text-gray-500">Oleh:</span>
                <span className="font-medium text-gray-900">{selectedPO.approved_by}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-4">
      {/* Header with filter */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Riwayat Purchase Orders</h3>
          <p className="text-sm text-gray-600">{filteredPOs.length} PO ditemukan</p>
        </div>
        
        {/* Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>

      {/* PO List */}
      {filteredPOs.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Belum ada Purchase Order</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPOs.map((po) => (
            <div
              key={po.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => showPODetail(po)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {formatPONumber(po.poNumber || po.po_number)}
                    </h4>
                    <POStatusBadge status={po.status} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      <span>{po.supplierName || po.supplier_name || '-'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(po.createdAt || po.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>{(po.items || []).length} item</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Nilai</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(po.totalAmount || po.total_amount || 0, true)}
                  </p>
                </div>
              </div>
              
              {/* View Detail Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                  <Eye className="h-4 w-4 mr-1" />
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default POListView;
