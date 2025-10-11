import React, { useState } from 'react';
import { Receipt, Search, Download, Eye, Send, Calendar, DollarSign, CheckCircle, X } from 'lucide-react';
import { formatCurrency, formatDate, formatCurrencyCompact } from '../../../utils/formatters';
import InvoiceDetailView from './InvoiceDetailView';

/**
 * Invoice Manager Component
 * Manages invoices generated from progress payments
 */
const InvoiceManager = ({ 
  projectId, 
  payments, 
  project, 
  onApprovePayment,
  onSendInvoice,
  onMarkAsPaid
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Generate invoices from payments
  const invoices = payments
    .filter(p => p.invoiceNumber) // Only payments with invoice
    .map(payment => {
      // Determine invoice status based on payment workflow
      // Backend already transforms status to frontend format:
      // - 'pending_ba' / 'ba_approved' → stays as-is (Draft)
      // - 'processing' → stays as-is (Pending)
      // - 'payment_approved' → 'approved' (Approved)
      // - 'paid' → 'paid' (Paid)
      // - 'cancelled' → 'rejected' (Rejected)
      
      let realInvoiceStatus = 'draft';
      
      if (payment.status === 'paid') {
        realInvoiceStatus = 'paid';
      } else if (payment.status === 'approved') {
        // Backend sends 'approved' (already transformed from 'payment_approved')
        realInvoiceStatus = 'approved';
      } else if (payment.status === 'processing') {
        realInvoiceStatus = 'pending';
      } else if (payment.status === 'rejected') {
        // Backend sends 'rejected' (already transformed from 'cancelled')
        realInvoiceStatus = 'rejected';
      } else if (payment.status === 'pending_ba' || payment.status === 'ba_approved' || payment.status === 'pending_approval') {
        realInvoiceStatus = 'draft';
      }
      
      return {
        id: payment.id,
        invoiceNumber: payment.invoiceNumber,
        invoiceDate: payment.invoiceDate,
        dueDate: payment.dueDate,
        amount: payment.amount,
        netAmount: payment.netAmount,
        taxAmount: payment.taxAmount,
        retentionAmount: payment.retentionAmount,
        status: realInvoiceStatus, // Use real status from payment workflow
        paymentStatus: payment.status, // Keep original payment status
        paymentTerms: 30, // Default 30 days
        beritaAcara: payment.beritaAcara,
        notes: payment.notes
      };
    });

  // Handler functions
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseDetail = () => {
    setSelectedInvoice(null);
  };

  const handleApproveInvoice = async (invoice) => {
    if (onApprovePayment) {
      try {
        await onApprovePayment(invoice.id, 'approved');
        // Close detail view after approval
        setSelectedInvoice(null);
        alert(`Invoice ${invoice.invoiceNumber} berhasil disetujui!`);
      } catch (error) {
        alert('Gagal menyetujui invoice: ' + error.message);
      }
    }
  };

  const handleRejectInvoice = async (invoice, reason) => {
    if (onApprovePayment) {
      try {
        await onApprovePayment(invoice.id, 'rejected', reason);
        // Close detail view after rejection
        setSelectedInvoice(null);
        alert(`Invoice ${invoice.invoiceNumber} ditolak.\nAlasan: ${reason}`);
      } catch (error) {
        alert('Gagal menolak invoice: ' + error.message);
      }
    }
  };

  const handleSendInvoice = async (invoice) => {
    if (onSendInvoice) {
      try {
        const result = await onSendInvoice(invoice.id);
        if (result.success) {
          alert(result.message || `Invoice ${invoice.invoiceNumber} berhasil dikirim!`);
          // Refresh invoice to show updated status
          const updatedPayment = payments.find(p => p.id === invoice.id);
          if (updatedPayment) {
            setSelectedInvoice({
              ...invoice,
              paymentStatus: updatedPayment.status
            });
          }
        } else {
          alert(result.message || 'Gagal mengirim invoice');
        }
      } catch (error) {
        alert('Gagal mengirim invoice: ' + error.message);
      }
    }
  };

  const handleMarkAsPaid = async (invoice) => {
    if (onMarkAsPaid) {
      try {
        const result = await onMarkAsPaid(invoice.id);
        if (result.success && !result.cancelled) {
          setSelectedInvoice(null); // Close detail view
          alert(result.message || `Invoice ${invoice.invoiceNumber} berhasil ditandai sebagai paid!`);
        } else if (!result.success && !result.cancelled) {
          alert(result.message || 'Gagal menandai invoice sebagai paid');
        }
      } catch (error) {
        alert('Gagal menandai invoice sebagai paid: ' + error.message);
      }
    }
  };

  const handleDownloadPDF = (invoice) => {
    // TODO: Implement PDF generation
    alert(`Download PDF untuk invoice: ${invoice.invoiceNumber}\n\nFitur ini akan segera tersedia.`);
  };

  const handleSendEmail = (invoice) => {
    // TODO: Implement email sending
    const email = prompt('Masukkan email penerima:', project?.clientEmail || '');
    if (email) {
      alert(`Mengirim invoice ${invoice.invoiceNumber} ke ${email}\n\nFitur ini akan segera tersedia.`);
    }
  };

  // Apply filters
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.beritaAcara?.baNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    pending: invoices.filter(i => i.status === 'pending').length,
    approved: invoices.filter(i => i.status === 'approved').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    rejected: invoices.filter(i => i.status === 'rejected').length,
    totalAmount: invoices.reduce((sum, i) => sum + parseFloat(i.netAmount || 0), 0),
    approvedAmount: invoices.filter(i => i.status === 'approved' || i.status === 'paid').reduce((sum, i) => sum + parseFloat(i.netAmount || 0), 0),
    paidAmount: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseFloat(i.netAmount || 0), 0)
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = {
      draft: { color: 'bg-[#8E8E93]/20 text-[#8E8E93]', label: 'Draft' },
      pending: { color: 'bg-[#FF9F0A]/20 text-[#FF9F0A]', label: 'Pending' },
      approved: { color: 'bg-[#30D158]/20 text-[#30D158]', label: 'Approved' },
      paid: { color: 'bg-[#30D158]/20 text-[#30D158]', label: 'Paid' },
      rejected: { color: 'bg-[#FF3B30]/20 text-[#FF3B30]', label: 'Rejected' }
    };
    
    const { color, label } = config[status] || config.draft;
    
    return (
      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Statistics Cards - Compact Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#0A84FF]/20 flex items-center justify-center">
              <Receipt size={16} className="text-[#0A84FF]" />
            </div>
            <p className="text-xs text-[#8E8E93]">Total</p>
          </div>
          <p className="text-xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF9F0A]/20 flex items-center justify-center">
              <Calendar size={16} className="text-[#FF9F0A]" />
            </div>
            <p className="text-xs text-[#8E8E93]">Pending</p>
          </div>
          <p className="text-xl font-bold text-[#FF9F0A]">{stats.pending}</p>
        </div>

        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#30D158]/20 flex items-center justify-center">
              <CheckCircle size={16} className="text-[#30D158]" />
            </div>
            <p className="text-xs text-[#8E8E93]">Approved</p>
          </div>
          <p className="text-xl font-bold text-[#30D158]">{stats.approved}</p>
        </div>

        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#30D158]/20 flex items-center justify-center">
              <DollarSign size={16} className="text-[#30D158]" />
            </div>
            <p className="text-xs text-[#8E8E93]">Paid</p>
          </div>
          <p className="text-xl font-bold text-[#30D158]">{stats.paid}</p>
        </div>

        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF3B30]/20 flex items-center justify-center">
              <X size={16} className="text-[#FF3B30]" />
            </div>
            <p className="text-xs text-[#8E8E93]">Rejected</p>
          </div>
          <p className="text-xl font-bold text-[#FF3B30]">{stats.rejected}</p>
        </div>

        <div className="bg-gradient-to-br from-[#0A84FF]/10 to-[#0A84FF]/5 border border-[#0A84FF]/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#0A84FF]/20 flex items-center justify-center">
              <DollarSign size={16} className="text-[#0A84FF]" />
            </div>
            <p className="text-xs text-[#8E8E93]">Amount</p>
          </div>
          <p className="text-base font-bold text-white leading-tight" title={formatCurrency(stats.totalAmount)}>
            {formatCurrencyCompact(stats.totalAmount)}
          </p>
        </div>
      </div>

      {/* Filters - Compact */}
      <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#636366]" />
            <input
              type="text"
              placeholder="Cari invoice atau BA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1C1C1E] text-white text-sm border border-[#38383A] rounded-lg pl-9 pr-3 py-2 placeholder-[#636366] focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1C1C1E] text-white text-sm border border-[#38383A] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0A84FF] min-w-[140px]"
          >
            <option value="all">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Invoice List - Compact */}
      <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#38383A] bg-[#1C1C1E] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Daftar Invoice</h3>
            <p className="text-xs text-[#8E8E93] mt-0.5">{filteredInvoices.length} invoice ditemukan</p>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="p-8 text-center">
            <Receipt size={40} className="text-[#8E8E93] mx-auto mb-3" />
            <p className="text-sm text-[#8E8E93]">Tidak ada invoice ditemukan</p>
          </div>
        ) : (
          <div className="divide-y divide-[#38383A]">
            {filteredInvoices.map(invoice => (
              <div
                key={invoice.id}
                className="p-4 hover:bg-[#38383A]/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Invoice Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#FF453A]/20 flex items-center justify-center flex-shrink-0">
                      <Receipt size={20} className="text-[#FF453A]" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {invoice.invoiceNumber}
                        </h4>
                        <StatusBadge status={invoice.status} />
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs mb-2">
                        <div>
                          <p className="text-[#8E8E93] mb-0.5">Invoice Date</p>
                          <p className="text-white">{formatDate(invoice.invoiceDate)}</p>
                        </div>
                        <div>
                          <p className="text-[#8E8E93] mb-0.5">Due Date</p>
                          <p className="text-white">{formatDate(invoice.dueDate)}</p>
                        </div>
                        <div>
                          <p className="text-[#8E8E93] mb-0.5">Berita Acara</p>
                          <p className="text-white truncate">{invoice.beritaAcara?.baNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[#8E8E93] mb-0.5">Amount</p>
                          <p className="text-white font-semibold">{formatCurrency(invoice.netAmount)}</p>
                        </div>
                      </div>

                      {invoice.notes && (
                        <p className="text-xs text-[#8E8E93] line-clamp-1">{invoice.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions - Compact */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="p-2 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded-lg transition-colors"
                      title="View Invoice"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(invoice)}
                      className="p-2 text-[#30D158] hover:bg-[#30D158]/10 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleSendEmail(invoice)}
                      className="p-2 text-[#FF9F0A] hover:bg-[#FF9F0A]/10 rounded-lg transition-colors"
                      title="Send Email"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Detail View */}
      {selectedInvoice && (
        <div className="mt-6">
          <InvoiceDetailView
            invoice={selectedInvoice}
            onClose={handleCloseDetail}
            projectInfo={project}
            onApprove={handleApproveInvoice}
            onReject={handleRejectInvoice}
            onSend={handleSendInvoice}
            onMarkAsPaid={handleMarkAsPaid}
            canApprove={true}
          />
        </div>
      )}
    </div>
  );
};

export default InvoiceManager;
