import React, { useState } from 'react';
import { ArrowLeft, Eye, FileText, Calendar, Building, User, Clock, CheckCircle2, XCircle, Download, Printer } from 'lucide-react';
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
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Filter POs
  const filteredPOs = filterStatus === 'all' 
    ? purchaseOrders 
    : purchaseOrders.filter(po => po.status?.toLowerCase() === filterStatus.toLowerCase());

  // Generate and view PDF Invoice
  const handleGenerateInvoice = async (po) => {
    try {
      setGeneratingPDF(true);
      
      // Detect environment based on hostname
      const hostname = window.location.hostname;
      let API_URL;
      
      if (hostname === 'nusantaragroup.co' || hostname === 'www.nusantaragroup.co') {
        // Production environment
        API_URL = 'https://nusantaragroup.co';
      } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Development environment
        API_URL = 'http://localhost:5000';
      } else {
        // Fallback to current origin
        API_URL = window.location.origin;
      }
      
      const token = localStorage.getItem('token');
      
      // Use either id or poNumber as the identifier
      const poIdentifier = po.id || po.poNumber || po.po_number;
      
      console.log('Generating PDF for PO:', poIdentifier);
      console.log('Using API URL:', API_URL);
      
      const response = await fetch(`${API_URL}/api/purchase-orders/${poIdentifier}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf'
        }
      });

      if (!response.ok) {
        console.error('PDF Generation failed with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        // Coba parse error response
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || `Gagal generate invoice PDF (${response.status})`);
        } catch (e) {
          throw new Error(`Gagal generate invoice PDF (${response.status})`);
        }
      }

      // Get PDF blob
      const blob = await response.blob();
      
      // Create blob URL and open in new tab
      const blobUrl = URL.createObjectURL(blob);
      const pdfWindow = window.open(blobUrl, '_blank');
      
      // Fallback jika browser memblokir pop-up
      if (!pdfWindow || pdfWindow.closed || typeof pdfWindow.closed === 'undefined') {
        // Buat link untuk download manual
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = `PO-${po.poNumber || po.id || 'document'}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        window.dispatchEvent(new CustomEvent('show-notification', {
          detail: { 
            type: 'info', 
            message: 'Download PDF dimulai. Jika tidak muncul, periksa pengaturan pop-up browser Anda.',
            duration: 5000 
          }
        }));
      }
      
      // Clean up blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);

      // Show success notification
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { 
          type: 'success', 
          message: 'Invoice PDF berhasil dibuat!',
          duration: 3000 
        }
      }));

    } catch (error) {
      console.error('Error generating PDF:', error);
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { 
          type: 'error', 
          message: 'Gagal generate invoice: ' + error.message,
          duration: 5000 
        }
      }));
    } finally {
      setGeneratingPDF(false);
    }
  };

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
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleGenerateInvoice(selectedPO)}
              disabled={generatingPDF}
              style={{
                backgroundColor: generatingPDF ? '#3A3A3C' : '#0A84FF',
                border: '1px solid #38383A'
              }}
              className="px-4 py-2 rounded-lg hover:bg-[#0077ED] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-sm font-medium text-white">Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Generate PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-[#38383A] rounded-lg overflow-hidden">
          <thead className="bg-[#1C1C1E] border-b border-[#38383A]">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                PO Number
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Supplier
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#2C2C2E] divide-y divide-[#38383A]">
            {filteredPOs.map(po => (
              <tr key={po.id} className="hover:bg-[#3A3A3C] cursor-pointer transition-colors">
                <td className="px-4 py-3" onClick={() => showPODetail(po)}>
                  <div className="text-white font-medium">
                    {formatPONumber(po.poNumber || po.po_number)}
                  </div>
                </td>
                <td className="px-4 py-3" onClick={() => showPODetail(po)}>
                  <div className="text-white">
                    {po.supplierName || po.supplier_name}
                  </div>
                </td>
                <td className="px-4 py-3" onClick={() => showPODetail(po)}>
                  <div className="text-white">
                    {formatDate(po.orderDate || po.order_date || po.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-3" onClick={() => showPODetail(po)}>
                  <div className="text-white">
                    {formatCurrency(po.totalAmount || po.total_amount || 0)}
                  </div>
                </td>
                <td className="px-4 py-3" onClick={() => showPODetail(po)}>
                  <POStatusBadge status={po.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleGenerateInvoice(po)}
                      className="p-2 hover:bg-[#3A3A3C] rounded-lg transition-colors"
                      title="Generate PDF"
                    >
                      <FileText className="h-4 w-4 text-[#0A84FF]" />
                    </button>
                    <button
                      onClick={() => showPODetail(po)}
                      className="p-2 hover:bg-[#3A3A3C] rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4 text-[#64D2FF]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default POListView;
