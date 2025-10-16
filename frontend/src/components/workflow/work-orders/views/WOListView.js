import React, { useState } from 'react';
import { ArrowLeft, Eye, FileText, Calendar, Building, User, Clock, Download, Printer } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/formatters';

/**
 * Status Badge Component for Work Orders
 */
const WOStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { bg: 'rgba(255, 159, 10, 0.15)', text: '#FF9F0A', label: 'Pending' };
      case 'approved':
        return { bg: 'rgba(48, 209, 88, 0.15)', text: '#30D158', label: 'Approved' };
      case 'rejected':
        return { bg: 'rgba(255, 69, 58, 0.15)', text: '#FF453A', label: 'Rejected' };
      case 'in_progress':
        return { bg: 'rgba(10, 132, 255, 0.15)', text: '#0A84FF', label: 'In Progress' };
      case 'completed':
        return { bg: 'rgba(175, 82, 222, 0.15)', text: '#AF52DE', label: 'Completed' };
      default:
        return { bg: 'rgba(142, 142, 147, 0.15)', text: '#8E8E93', label: status || 'Unknown' };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      style={{
        backgroundColor: config.bg,
        color: config.text,
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
      }}
    >
      {config.label}
    </span>
  );
};

/**
 * WO List View - History Mode
 * Displays list of all work orders with filtering and detail view
 */
const WOListView = ({ 
  workOrders, 
  onCreateNew,
  projectName, 
  projectAddress, 
  projectId,
  loading,
  onApproveWO,
  onRejectWO
}) => {
  const [selectedWO, setSelectedWO] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Filter WOs
  const filteredWOs = filterStatus === 'all' 
    ? workOrders 
    : workOrders.filter(wo => wo.status?.toLowerCase() === filterStatus.toLowerCase());

  // Generate and view PDF Perintah Kerja
  const handleGeneratePerintahKerja = async (wo) => {
    try {
      setGeneratingPDF(true);
      
      // Get API URL and remove trailing /api if present
      let API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      API_URL = API_URL.replace(/\/api\/?$/, ''); // Remove /api or /api/ from end
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/projects/${projectId}/work-orders/${wo.id}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Gagal generate Perintah Kerja PDF');
      }

      // Get PDF blob
      const blob = await response.blob();
      
      // Create blob URL and open in new tab
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      
      // Clean up blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

      // Show success notification
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { 
          type: 'success', 
          message: 'Perintah Kerja PDF berhasil dibuat!',
          duration: 3000 
        }
      }));

    } catch (error) {
      console.error('Error generating PDF:', error);
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { 
          type: 'error', 
          message: 'Gagal generate Perintah Kerja: ' + error.message,
          duration: 5000 
        }
      }));
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Show WO detail
  const showWODetail = (wo) => {
    setSelectedWO(wo);
  };

  // Close detail view
  const closeDetail = () => {
    setSelectedWO(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-[#8E8E93]">Memuat data Work Orders...</p>
        </div>
      </div>
    );
  }

  // Detail View
  if (selectedWO) {
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
                {selectedWO.woNumber || selectedWO.wo_number || 'WO-XXXX'}
              </h3>
              <p className="text-sm text-[#8E8E93]">
                Detail Work Order
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleGeneratePerintahKerja(selectedWO)}
              disabled={generatingPDF}
              style={{
                backgroundColor: generatingPDF ? '#3A3A3C' : '#AF52DE',
                border: '1px solid #38383A'
              }}
              className="px-4 py-2 rounded-lg hover:bg-[#9D3FCC] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-sm font-medium text-white">Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Generate Perintah Kerja</span>
                </>
              )}
            </button>
            <WOStatusBadge status={selectedWO.status} />
          </div>
        </div>

        {/* WO Detail Card */}
        <div 
          style={{
            backgroundColor: '#1C1C1E',
            border: '1px solid #38383A'
          }}
          className="rounded-lg p-6 space-y-6"
        >
          {/* Contractor Info */}
          <div>
            <h4 className="text-md font-semibold text-white mb-3 flex items-center">
              <Building className="h-5 w-5 mr-2 text-[#AF52DE]" />
              Informasi Kontraktor
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
                  <p className="font-medium text-white">{selectedWO.contractorName || selectedWO.contractor_name || '-'}</p>
                </div>
                <div>
                  <span className="text-[#98989D] block mb-1">Kontak:</span>
                  <p className="font-medium text-white">{selectedWO.contractorContact || selectedWO.contractor_contact || '-'}</p>
                </div>
                <div>
                  <span className="text-[#98989D] block mb-1">Alamat:</span>
                  <p className="font-medium text-white">{selectedWO.contractorAddress || selectedWO.contractor_address || '-'}</p>
                </div>
                <div>
                  <span className="text-[#98989D] block mb-1">Periode:</span>
                  <p className="font-medium text-[#AF52DE]">
                    {formatDate(selectedWO.startDate || selectedWO.start_date)} - {formatDate(selectedWO.endDate || selectedWO.end_date)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div>
            <h4 className="text-md font-semibold text-white mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-[#AF52DE]" />
              Daftar Pekerjaan
            </h4>
            <div 
              style={{
                backgroundColor: '#2C2C2E',
                border: '1px solid #38383A'
              }}
              className="rounded-lg overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#38383A]">
                  <thead style={{ backgroundColor: '#1C1C1E' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Pekerjaan</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider">Tipe</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#98989D] uppercase tracking-wider">Volume</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#98989D] uppercase tracking-wider">Harga Satuan</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#98989D] uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: '#2C2C2E' }} className="divide-y divide-[#38383A]">
                    {(selectedWO.items || []).map((item, index) => {
                      const qty = parseFloat(item.quantity) || 0;
                      const price = parseFloat(item.unitPrice || item.unit_price) || 0;
                      const total = qty * price;
                      
                      // Get item type badge
                      const itemType = item.itemType || item.item_type || 'service';
                      const typeBadge = itemType === 'labor' ? '👷 Tenaga' : 
                                       itemType === 'equipment' ? '🚛 Alat' : '🔨 Jasa';
                      
                      return (
                        <tr key={index} className="hover:bg-[#3A3A3C] transition-colors">
                          <td className="px-4 py-3 text-sm text-white">{item.itemName || item.item_name || item.description}</td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className="text-xs px-2 py-1 rounded-full" style={{
                              backgroundColor: 'rgba(175, 82, 222, 0.15)',
                              color: '#AF52DE'
                            }}>
                              {typeBadge}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <span className="text-[#AF52DE] font-medium">{Math.floor(qty)}</span>
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
              backgroundColor: 'rgba(175, 82, 222, 0.1)',
              border: '1px solid rgba(175, 82, 222, 0.3)'
            }}
            className="rounded-lg p-4 mt-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-[#98989D] font-medium">Total Nilai Work Order:</span>
              <span className="text-2xl font-bold text-[#AF52DE]">
                {formatCurrency(selectedWO.totalAmount || selectedWO.total_amount || 0)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {selectedWO.status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t border-[#38383A]">
              <button
                onClick={() => {
                  closeDetail();
                  onApproveWO(selectedWO);
                }}
                className="flex-1 bg-[#30D158] hover:bg-[#30D158]/90 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors"
              >
                ✓ Approve Work Order
              </button>
              <button
                onClick={() => {
                  closeDetail();
                  onRejectWO(selectedWO);
                }}
                className="flex-1 bg-[#FF453A] hover:bg-[#FF453A]/90 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors"
              >
                ✕ Reject Work Order
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Work Orders</h2>
          <p className="text-[#8E8E93] mt-1">
            Manajemen Work Order untuk {projectName || 'proyek ini'}
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-[#AF52DE] hover:bg-[#AF52DE]/90 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center"
        >
          + Buat Work Order Baru
        </button>
      </div>

      {/* Filter & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setFilterStatus('all')}
          style={{
            backgroundColor: filterStatus === 'all' ? 'rgba(175, 82, 222, 0.15)' : '#2C2C2E',
            border: filterStatus === 'all' ? '2px solid #AF52DE' : '1px solid #38383A'
          }}
          className="p-4 rounded-lg hover:border-[#AF52DE] transition-all"
        >
          <div className="text-2xl font-bold text-white">{workOrders.length}</div>
          <div className="text-sm text-[#8E8E93]">Total WO</div>
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          style={{
            backgroundColor: filterStatus === 'pending' ? 'rgba(255, 159, 10, 0.15)' : '#2C2C2E',
            border: filterStatus === 'pending' ? '2px solid #FF9F0A' : '1px solid #38383A'
          }}
          className="p-4 rounded-lg hover:border-[#FF9F0A] transition-all"
        >
          <div className="text-2xl font-bold text-[#FF9F0A]">
            {workOrders.filter(wo => wo.status === 'pending').length}
          </div>
          <div className="text-sm text-[#8E8E93]">Pending</div>
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          style={{
            backgroundColor: filterStatus === 'approved' ? 'rgba(48, 209, 88, 0.15)' : '#2C2C2E',
            border: filterStatus === 'approved' ? '2px solid #30D158' : '1px solid #38383A'
          }}
          className="p-4 rounded-lg hover:border-[#30D158] transition-all"
        >
          <div className="text-2xl font-bold text-[#30D158]">
            {workOrders.filter(wo => wo.status === 'approved').length}
          </div>
          <div className="text-sm text-[#8E8E93]">Approved</div>
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          style={{
            backgroundColor: filterStatus === 'completed' ? 'rgba(10, 132, 255, 0.15)' : '#2C2C2E',
            border: filterStatus === 'completed' ? '2px solid #0A84FF' : '1px solid #38383A'
          }}
          className="p-4 rounded-lg hover:border-[#0A84FF] transition-all"
        >
          <div className="text-2xl font-bold text-[#0A84FF]">
            {workOrders.filter(wo => wo.status === 'completed').length}
          </div>
          <div className="text-sm text-[#8E8E93]">Completed</div>
        </button>
      </div>

      {/* WO List Table */}
      <div 
        style={{
          backgroundColor: '#1C1C1E',
          border: '1px solid #38383A'
        }}
        className="rounded-lg overflow-hidden"
      >
        {filteredWOs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-[#48484A] mx-auto mb-4" />
            <p className="text-[#8E8E93] text-lg">
              {filterStatus === 'all' 
                ? 'Belum ada Work Order. Klik tombol di atas untuk membuat yang pertama.'
                : `Tidak ada Work Order dengan status ${filterStatus}`
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#38383A]">
              <thead style={{ backgroundColor: '#2C2C2E' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">WO Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Kontraktor</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#98989D] uppercase tracking-wider">Total Nilai</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider">Periode</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider">Approval</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#1C1C1E' }} className="divide-y divide-[#38383A]">
                {filteredWOs.map((wo) => (
                  <tr key={wo.id} className="hover:bg-[#2C2C2E] transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{wo.woNumber || wo.wo_number || 'WO-XXXX'}</div>
                      <div className="text-xs text-[#8E8E93]">{formatDate(wo.createdAt || wo.created_at)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-white">{wo.contractorName || wo.contractor_name || '-'}</div>
                      <div className="text-xs text-[#8E8E93]">{wo.contractorContact || wo.contractor_contact || '-'}</div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-[#AF52DE] font-semibold">{(wo.items || []).length}</span>
                      <span className="text-[#8E8E93] text-xs ml-1">items</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="text-sm font-semibold text-[#30D158]">
                        {formatCurrency(wo.totalAmount || wo.total_amount || 0)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-xs text-[#8E8E93]">
                      {formatDate(wo.startDate || wo.start_date)}
                      <br />
                      s/d
                      <br />
                      {formatDate(wo.endDate || wo.end_date)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <WOStatusBadge status={wo.status} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      {wo.status === 'pending' && onApproveWO && onRejectWO ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onApproveWO(wo);
                            }}
                            className="p-1.5 hover:bg-green-500/20 rounded-lg transition-colors group"
                            title="Approve"
                          >
                            <span className="text-green-500 group-hover:text-green-400 text-lg">✓</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRejectWO(wo);
                            }}
                            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors group"
                            title="Reject"
                          >
                            <span className="text-red-500 group-hover:text-red-400 text-lg">✕</span>
                          </button>
                        </div>
                      ) : wo.status === 'approved' ? (
                        <span className="text-xs text-[#30D158]">✓ Approved</span>
                      ) : wo.status === 'rejected' ? (
                        <span className="text-xs text-[#FF453A]">✕ Rejected</span>
                      ) : (
                        <span className="text-xs text-[#8E8E93]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => showWODetail(wo)}
                        className="p-2 hover:bg-[#3A3A3C] rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="h-5 w-5 text-[#AF52DE]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WOListView;
