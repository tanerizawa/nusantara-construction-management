import React, { useState } from 'react';
import { ArrowLeft, Eye, FileText, Calendar, Building, User, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import { POStatusBadge } from '../components';
import { formatPONumber } from '../utils/poFormatters';

/**
 * PO List View - History Mode
 * Displays list of all purchase orders with filtering and detail view in table format
 */
const POListView = ({ 
  purchaseOrders, 
  onCreateNew,
  projectName, 
  projectAddress, 
  projectId,
  loading,
  onApprovePO,
  onRejectPO,
  onApproveAllPO
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
          <p className="mt-4 text-[#8E8E93]">Memuat data Purchase Orders...</p>
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
              style={{
                backgroundColor: '#2C2C2E',
                border: '1px solid #38383A'
              }}
              className="mr-4 p-2 hover:bg-[#3A3A3C] rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {formatPONumber(selectedPO.poNumber || selectedPO.po_number)}
              </h3>
              <p className="text-sm text-[#8E8E93]">
                Detail Purchase Order
              </p>
            </div>
          </div>
          <POStatusBadge status={selectedPO.status} />
        </div>

        {/* PO Detail Card */}
        <div 
          style={{
            backgroundColor: '#1C1C1E',
            border: '1px solid #38383A'
          }}
          className="rounded-lg p-6 space-y-6"
        >
          {/* Supplier Info */}
          <div>
            <h4 className="text-md font-semibold text-white mb-3 flex items-center">
              <Building className="h-5 w-5 mr-2 text-[#0A84FF]" />
              Informasi Supplier
            </h4>
            <div 
              style={{
                backgroundColor: '#2C2C2E',
                border: '1px solid #38383A'
              }}
              className="rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#98989D] block mb-1">Nama:</span>
                  <p className="font-medium text-white">{selectedPO.supplierName || selectedPO.supplier_name || '-'}</p>
                </div>
                <div>
                  <span className="text-[#98989D] block mb-1">Kontak:</span>
                  <p className="font-medium text-white">{selectedPO.supplierContact || selectedPO.supplier_contact || '-'}</p>
                </div>
                <div>
                  <span className="text-[#98989D] block mb-1">Alamat:</span>
                  <p className="font-medium text-white">{selectedPO.supplierAddress || selectedPO.supplier_address || '-'}</p>
                </div>
                <div>
                  <span className="text-[#98989D] block mb-1">Tanggal Pengiriman:</span>
                  <p className="font-medium text-[#0A84FF]">
                    {formatDate(selectedPO.deliveryDate || selectedPO.delivery_date || selectedPO.expectedDeliveryDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items List - Scrollable Table */}
          <div>
            <h4 className="text-md font-semibold text-white mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-[#0A84FF]" />
              Daftar Item
            </h4>
            <div 
              style={{
                backgroundColor: '#2C2C2E',
                border: '1px solid #38383A'
              }}
              className="rounded-lg overflow-hidden"
            >
              <div 
                className="overflow-x-auto po-detail-items-scroll"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#38383A #2C2C2E'
                }}
              >
                <style>{`
                  .po-detail-items-scroll::-webkit-scrollbar {
                    height: 8px;
                  }
                  .po-detail-items-scroll::-webkit-scrollbar-track {
                    background: #2C2C2E;
                  }
                  .po-detail-items-scroll::-webkit-scrollbar-thumb {
                    background: #38383A;
                    border-radius: 4px;
                  }
                  .po-detail-items-scroll::-webkit-scrollbar-thumb:hover {
                    background: #48484A;
                  }
                `}</style>
                <table className="min-w-full divide-y divide-[#38383A]">
                  <thead style={{ backgroundColor: '#1C1C1E' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Item</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#98989D] uppercase tracking-wider">Jumlah</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#98989D] uppercase tracking-wider">Harga Satuan</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#98989D] uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: '#2C2C2E' }} className="divide-y divide-[#38383A]">
                    {(selectedPO.items || []).map((item, index) => {
                      const qty = parseFloat(item.quantity) || 0;
                      const price = parseFloat(item.unitPrice || item.unit_price) || 0;
                      const total = qty * price;
                      
                      return (
                        <tr key={index} className="hover:bg-[#3A3A3C] transition-colors">
                          <td className="px-4 py-3 text-sm text-white">{item.itemName || item.item_name || item.description}</td>
                          <td className="px-4 py-3 text-sm text-right">
                            <span className="text-[#0A84FF] font-medium">{Math.floor(qty)}</span>
                            <span className="text-[#8E8E93] ml-1">{item.unit}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-white text-right">{formatCurrency(price)}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-[#30D158] text-right">{formatCurrency(total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Total */}
          <div 
            style={{
              backgroundColor: 'rgba(10, 132, 255, 0.1)',
              border: '1px solid rgba(10, 132, 255, 0.3)'
            }}
            className="rounded-lg p-4 mt-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">Total Purchase Order</span>
              <span className="text-2xl font-bold text-[#0A84FF]">
                {formatCurrency(selectedPO.totalAmount || selectedPO.total_amount || 0)}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div 
            style={{
              backgroundColor: '#1C1C1E',
              border: '1px solid #38383A'
            }}
            className="rounded-lg p-4 mt-4"
          >
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-[#0A84FF]" />
              Informasi Tambahan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-[#98989D] block mb-1 text-sm">Dibuat:</span>
                <span className="font-medium text-white">
                  {formatDate(selectedPO.createdAt || selectedPO.created_at)}
                </span>
              </div>
              {selectedPO.approved_at && (
                <div>
                  <span className="text-[#98989D] block mb-1 text-sm">Disetujui:</span>
                  <span className="font-medium text-white">
                    {formatDate(selectedPO.approved_at)}
                  </span>
                </div>
              )}
              {selectedPO.approved_by && (
                <div>
                  <span className="text-[#98989D] block mb-1 text-sm">Oleh:</span>
                  <span className="font-medium text-white">{selectedPO.approved_by}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View - Table Format
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total PO */}
        <div 
          style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A'
          }}
          className="rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8E8E93]">Total PO</p>
              <p className="text-2xl font-bold text-white">{purchaseOrders.length}</p>
            </div>
            <div 
              style={{
                backgroundColor: 'rgba(10, 132, 255, 0.2)'
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
            >
              <FileText className="w-6 h-6 text-[#0A84FF]" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div 
          style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A'
          }}
          className="rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8E8E93]">Menunggu</p>
              <p className="text-2xl font-bold text-[#FF9F0A]">
                {purchaseOrders.filter(po => po.status?.toLowerCase() === 'pending').length}
              </p>
            </div>
            <div 
              style={{
                backgroundColor: 'rgba(255, 159, 10, 0.2)'
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
            >
              <Clock className="w-6 h-6 text-[#FF9F0A]" />
            </div>
          </div>
        </div>

        {/* Approved */}
        <div 
          style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A'
          }}
          className="rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8E8E93]">Disetujui</p>
              <p className="text-2xl font-bold text-[#30D158]">
                {purchaseOrders.filter(po => po.status?.toLowerCase() === 'approved').length}
              </p>
            </div>
            <div 
              style={{
                backgroundColor: 'rgba(48, 209, 88, 0.2)'
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-[#30D158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div 
          style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A'
          }}
          className="rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8E8E93]">Ditolak</p>
              <p className="text-2xl font-bold text-[#FF3B30]">
                {purchaseOrders.filter(po => po.status?.toLowerCase() === 'rejected').length}
              </p>
            </div>
            <div 
              style={{
                backgroundColor: 'rgba(255, 59, 48, 0.2)'
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-[#FF3B30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div 
          style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A'
          }}
          className="rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8E8E93]">Total Nilai</p>
              <p className="text-lg font-bold text-white">
                {formatCurrency(
                  purchaseOrders.reduce((sum, po) => sum + (parseFloat(po.totalAmount) || parseFloat(po.total_amount) || 0), 0)
                )}
              </p>
            </div>
            <div 
              style={{
                backgroundColor: 'rgba(191, 90, 242, 0.2)'
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-[#BF5AF2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section Header with Filter Only */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Daftar Purchase Orders</h3>
          <p className="text-sm text-[#8E8E93]">{filteredPOs.length} PO ditemukan</p>
        </div>
        
        {/* Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A',
            color: 'white',
            colorScheme: 'dark'
          }}
          className="px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>

      {/* PO Table or Empty State */}
      {filteredPOs.length === 0 ? (
        <div 
          style={{
            backgroundColor: '#1C1C1E',
            border: '1px solid #38383A'
          }}
          className="text-center py-12 rounded-lg"
        >
          <FileText className="h-12 w-12 text-[#636366] mx-auto mb-4" />
          <p className="text-[#8E8E93] mb-2">
            {filterStatus === 'all' ? 'Belum ada Purchase Order' : `Tidak ada PO dengan status "${filterStatus}"`}
          </p>
          <p className="text-[#636366] text-sm mb-4">
            {filterStatus === 'all' 
              ? 'Buat PO pertama dengan beralih ke tab "Buat PO Baru"'
              : 'Coba ubah filter untuk melihat PO lainnya'
            }
          </p>
          {onCreateNew && filterStatus === 'all' && (
            <button
              onClick={onCreateNew}
              style={{
                backgroundColor: '#0A84FF',
                border: '1px solid #0A84FF'
              }}
              className="inline-flex items-center px-6 py-2.5 text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors shadow-lg shadow-[#0A84FF]/20"
            >
              <FileText className="h-4 w-4 mr-2" />
              Buat PO Pertama
            </button>
          )}
        </div>
      ) : (
        <div 
          style={{
            backgroundColor: '#1C1C1E',
            border: '1px solid #38383A'
          }}
          className="rounded-lg overflow-hidden"
        >
          <div 
            className="overflow-x-auto po-list-scroll"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#38383A #1C1C1E'
            }}
          >
            <style>{`
              .po-list-scroll::-webkit-scrollbar {
                height: 8px;
              }
              .po-list-scroll::-webkit-scrollbar-track {
                background: #1C1C1E;
              }
              .po-list-scroll::-webkit-scrollbar-thumb {
                background: #38383A;
                border-radius: 4px;
              }
              .po-list-scroll::-webkit-scrollbar-thumb:hover {
                background: #48484A;
              }
            `}</style>
            <table className="min-w-full divide-y divide-[#38383A]">
              <thead style={{ backgroundColor: '#2C2C2E' }}>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                    No. PO
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                    Tanggal Kirim
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                    Total Nilai
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                    Approval
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#1C1C1E' }} className="divide-y divide-[#38383A]">
                {filteredPOs.map((po, index) => {
                  const itemCount = (po.items || []).length;
                  const totalAmount = po.totalAmount || po.total_amount || 0;
                  
                  return (
                    <tr 
                      key={po.id}
                      className="hover:bg-[#2C2C2E] transition-colors"
                    >
                      {/* No. PO */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1.5 text-[#0A84FF]" />
                          <span className="text-sm font-medium text-white">
                            {formatPONumber(po.poNumber || po.po_number)}
                          </span>
                        </div>
                      </td>
                      
                      {/* Supplier */}
                      <td className="px-3 py-3">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1.5 text-[#0A84FF] flex-shrink-0" />
                          <div className="max-w-[180px]">
                            <p className="text-sm font-medium text-white truncate">
                              {po.supplierName || po.supplier_name || '-'}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      {/* Tanggal Kirim */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5 text-[#0A84FF]" />
                          <span className="text-sm text-[#0A84FF]">
                            {formatDate(po.deliveryDate || po.delivery_date)}
                          </span>
                        </div>
                      </td>
                      
                      {/* Total Nilai */}
                      <td className="px-3 py-3 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-[#0A84FF]">
                          {formatCurrency(totalAmount)}
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <POStatusBadge status={po.status} />
                      </td>
                      
                      {/* Approval */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        {po.status === 'pending' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onApprovePO && onApprovePO(po);
                              }}
                              style={{
                                backgroundColor: 'rgba(48, 209, 88, 0.1)',
                                border: '1px solid rgba(48, 209, 88, 0.3)'
                              }}
                              className="p-1.5 rounded-lg hover:bg-[#30D158]/20 transition-all group"
                              title="Approve PO"
                            >
                              <CheckCircle2 className="h-4 w-4 text-[#30D158] group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRejectPO && onRejectPO(po);
                              }}
                              style={{
                                backgroundColor: 'rgba(255, 69, 58, 0.1)',
                                border: '1px solid rgba(255, 69, 58, 0.3)'
                              }}
                              className="p-1.5 rounded-lg hover:bg-[#FF453A]/20 transition-all group"
                              title="Reject PO"
                            >
                              <XCircle className="h-4 w-4 text-[#FF453A] group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        ) : po.status === 'approved' ? (
                          <span 
                            style={{
                              backgroundColor: 'rgba(48, 209, 88, 0.1)',
                              border: '1px solid rgba(48, 209, 88, 0.3)'
                            }}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-[#30D158]"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Approved
                          </span>
                        ) : po.status === 'rejected' ? (
                          <span 
                            style={{
                              backgroundColor: 'rgba(255, 69, 58, 0.1)',
                              border: '1px solid rgba(255, 69, 58, 0.3)'
                            }}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-[#FF453A]"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Rejected
                          </span>
                        ) : (
                          <span className="text-[#8E8E93] text-sm">-</span>
                        )}
                      </td>
                      
                      {/* Aksi */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <button
                          onClick={() => showPODetail(po)}
                          style={{
                            backgroundColor: '#0A84FF',
                            border: '1px solid #0A84FF'
                          }}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-white hover:bg-[#0A84FF]/80 transition-all shadow-md shadow-[#0A84FF]/20 hover:shadow-lg hover:shadow-[#0A84FF]/30"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              
              {/* Table Footer - Approval Summary */}
              <tfoot style={{ backgroundColor: '#2C2C2E', borderTop: '2px solid #38383A' }}>
                <tr>
                  <td colSpan="3" className="px-3 py-3 text-left">
                    <span className="text-sm font-semibold text-white">Total PO:</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="text-sm font-bold text-[#0A84FF]">
                      {formatCurrency(filteredPOs.reduce((sum, po) => sum + (parseFloat(po.totalAmount) || parseFloat(po.total_amount) || 0), 0))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-xs text-white">
                      {filteredPOs.filter(po => po.status === 'approved').length}/{filteredPOs.length}
                    </span>
                  </td>
                  <td colSpan="2" className="px-3 py-3 text-center">
                    {filteredPOs.filter(po => po.status === 'pending').length > 0 && onApproveAllPO && (
                      <button
                        onClick={onApproveAllPO}
                        style={{
                          backgroundColor: 'rgba(48, 209, 88, 0.15)',
                          border: '1px solid rgba(48, 209, 88, 0.4)'
                        }}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-[#30D158] hover:bg-[#30D158]/25 transition-all"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                        Approve All ({filteredPOs.filter(po => po.status === 'pending').length})
                      </button>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default POListView;
