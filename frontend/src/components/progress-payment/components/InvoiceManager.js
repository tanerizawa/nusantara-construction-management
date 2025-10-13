import React, { useState, useEffect } from 'react';
import { Receipt, Search, Eye, Send, Calendar, CheckCircle, Printer, Mail, XCircle, X, Truck, DollarSign, Package, AlertCircle, RefreshCw } from 'lucide-react';
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
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Inline form states (instead of modals)
  const [showMarkSentForm, setShowMarkSentForm] = useState(false);
  const [showConfirmPaymentForm, setShowConfirmPaymentForm] = useState(false);
  const [invoiceForAction, setInvoiceForAction] = useState(null);
  
  // Bank accounts from Chart of Accounts
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loadingBankAccounts, setLoadingBankAccounts] = useState(false);
  
  // Form data states
  const [markSentData, setMarkSentData] = useState({
    recipientName: '',
    sentDate: new Date().toISOString().split('T')[0],
    deliveryMethod: 'courier',
    courierService: '',
    trackingNumber: '',
    deliveryNotes: '',
    evidenceFile: null
  });
  
  const [confirmPaymentData, setConfirmPaymentData] = useState({
    paidAmount: '',
    paidDate: new Date().toISOString().split('T')[0],
    bankName: '',
    paymentReference: '',
    paymentNotes: '',
    evidenceFile: null
  });

  // Fetch bank accounts from Chart of Accounts
  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        setLoadingBankAccounts(true);
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        
        // Fetch accounts that are banks (ASSET type, containing 'Bank' or 'Cash' in name)
        const response = await fetch(`${API_BASE_URL}/chart-of-accounts?account_type=ASSET&is_active=true`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch bank accounts');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          // Filter for bank/cash accounts only
          const banks = result.data.filter(account => {
            const name = account.accountName?.toLowerCase() || '';
            const code = account.accountCode || '';
            const subType = account.accountSubType?.toLowerCase() || '';
            
            // Must be ASSET type and contain bank/cash keywords
            if (account.accountType !== 'ASSET') return false;
            
            // Check for bank/cash keywords in name or subtype
            const hasBankKeyword = name.includes('bank') || name.includes('cash') || name.includes('kas');
            const isCashBankType = subType.includes('cash') || subType.includes('bank');
            
            // Typically bank accounts start with 110x (cash and bank section in COA)
            const isBankCode = code.startsWith('110') && code.length >= 4;
            
            return (hasBankKeyword || isCashBankType) && isBankCode;
          });
          
          console.log('✓ Fetched bank accounts from COA:', banks.length);
          setBankAccounts(banks);
        }
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
                // Fallback to default banks if fetch fails
        setBankAccounts([
          { id: 'default-bca', accountCode: '1101.01', accountName: 'Bank BCA' },
          { id: 'default-mandiri', accountCode: '1101.02', accountName: 'Bank Mandiri' },
          { id: 'default-bri', accountCode: '1101.03', accountName: 'Bank BRI' },
          { id: 'default-bni', accountCode: '1101.04', accountName: 'Bank BNI' }
        ]);
      } finally {
        setLoadingBankAccounts(false);
      }
    };

    fetchBankAccounts();
  }, []);
  
  // Generate invoices from payments
  // Show invoice if payment has invoiceNumber (manual or auto-generated)
  const invoices = payments
    .filter(p => p.invoiceNumber) // Show all payments with invoice number
    .map(payment => {
            // Use backend invoiceStatus if available, otherwise determine from payment data
      let invoiceStatus = payment.invoiceStatus || 'draft';
      
      // Backend provides accurate status mapping, use it
      // Only fallback to client-side logic if not provided
      if (!payment.invoiceStatus) {
        // Fallback logic (legacy)
        if (payment.status === 'approved' || payment.status === 'payment_approved') {
          invoiceStatus = 'generated';
        }
        
        if (payment.status === 'invoice_sent' || payment.invoiceSentAt || payment.invoiceSent) {
          invoiceStatus = 'invoice_sent';
        }
        
        if (payment.status === 'paid') {
          invoiceStatus = 'paid';
        }
        
        // Check if overdue
        const dueDate = new Date(payment.dueDate);
        const today = new Date();
        if (dueDate < today && payment.status !== 'paid' && (payment.status === 'approved' || payment.status === 'invoice_sent')) {
          invoiceStatus = 'overdue';
        }
      }
      
      
      return {
        id: payment.id,
        invoiceNumber: payment.invoiceNumber || `INV-${payment.paymentNumber}`,
        invoiceDate: payment.invoiceDate || payment.createdAt,
        dueDate: payment.dueDate,
        amount: payment.amount,
        netAmount: payment.netAmount,
        taxAmount: payment.taxAmount,
        retentionAmount: payment.retentionAmount,
        status: invoiceStatus, // Clean invoice status
        paymentStatus: payment.status, // Original payment status
        paymentTerms: payment.paymentTerms || 30, // Default 30 days
        beritaAcara: payment.beritaAcara,
        notes: payment.notes,
        invoiceSentAt: payment.invoiceSentAt,
        paidAt: payment.paidAt
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

  const handleDownloadPDF = async (invoice) => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/progress-payments/${invoice.id}/invoice/pdf`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      alert(`✅ Invoice ${invoice.invoiceNumber} berhasil didownload!\n\nSilahkan cetak dan tambahkan:\n• Tanda tangan basah\n• Stempel perusahaan\n• Materai (jika diperlukan)`);
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('❌ Gagal mendownload PDF invoice: ' + error.message);
    }
  };

  const handleMarkAsSent = async (invoice) => {
    setInvoiceForAction(invoice);
    setMarkSentData({
      recipientName: invoice.beritaAcara?.baNumber || '',
      sentDate: new Date().toISOString().split('T')[0],
      deliveryMethod: 'courier',
      courierService: '',
      trackingNumber: '',
      deliveryNotes: '',
      evidenceFile: null
    });
    setShowMarkSentForm(true);
    // Scroll to form
    setTimeout(() => {
      document.getElementById('mark-sent-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSubmitMarkAsSent = async (e) => {
    e.preventDefault();
    
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const data = new FormData();
      data.append('recipientName', markSentData.recipientName);
      data.append('sentDate', markSentData.sentDate);
      data.append('deliveryMethod', markSentData.deliveryMethod);
      
      if (markSentData.deliveryNotes) {
        data.append('deliveryNotes', markSentData.deliveryNotes);
      }
      
      if (markSentData.deliveryMethod === 'courier') {
        data.append('courierService', markSentData.courierService);
        if (markSentData.trackingNumber) {
          data.append('trackingNumber', markSentData.trackingNumber);
        }
      }
      
      if (markSentData.evidenceFile) {
        data.append('delivery_evidence', markSentData.evidenceFile);
      }
      
      const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/progress-payments/${invoiceForAction.id}/mark-sent`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: data
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mark invoice as sent');
      }

      const result = await response.json();
      
      alert(`✅ ${result.message}\n\nInvoice: ${result.data.invoiceNumber}\nDiterima: ${markSentData.recipientName}\nTanggal: ${new Date(markSentData.sentDate).toLocaleDateString('id-ID')}`);
      
      // Close form and refresh
      setShowMarkSentForm(false);
      setInvoiceForAction(null);
      
      if (onRefresh) {
        await onRefresh();
      }
      
    } catch (error) {
      console.error('Error marking as sent:', error);
      alert('❌ Gagal menandai invoice sebagai terkirim: ' + error.message);
    }
  };

  const handleConfirmPayment = async (invoice) => {
    setInvoiceForAction(invoice);
    setConfirmPaymentData({
      paidAmount: invoice.netAmount,
      paidDate: new Date().toISOString().split('T')[0],
      bankName: '',
      paymentReference: '',
      paymentNotes: '',
      evidenceFile: null
    });
    setShowConfirmPaymentForm(true);
    // Scroll to form
    setTimeout(() => {
      document.getElementById('confirm-payment-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSubmitConfirmPayment = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!confirmPaymentData.paidAmount || parseFloat(confirmPaymentData.paidAmount) <= 0) {
      alert('❌ Jumlah pembayaran harus diisi dan lebih dari 0!');
      return;
    }
    
    if (!confirmPaymentData.paidDate) {
      alert('❌ Tanggal pembayaran harus diisi!');
      return;
    }
    
    if (!confirmPaymentData.bankName || confirmPaymentData.bankName.trim() === '') {
      alert('❌ Bank penerima harus dipilih!');
      return;
    }
    
    // Validate evidence file required
    if (!confirmPaymentData.evidenceFile) {
      alert('❌ Bukti transfer wajib diupload!');
      return;
    }
    
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      // Debug log
      console.log('📤 Submitting payment confirmation:', {
        paidAmount: confirmPaymentData.paidAmount,
        paidDate: confirmPaymentData.paidDate,
        bank: confirmPaymentData.bankName,
        hasEvidence: !!confirmPaymentData.evidenceFile
      });
      
      // Create FormData for file upload
      const data = new FormData();
      data.append('paidAmount', confirmPaymentData.paidAmount);
      data.append('paidDate', confirmPaymentData.paidDate);
      data.append('bank', confirmPaymentData.bankName); // Backend expects 'bank' not 'bankName'
      
      if (confirmPaymentData.paymentReference) {
        data.append('paymentReference', confirmPaymentData.paymentReference);
      }
      
      if (confirmPaymentData.paymentNotes) {
        data.append('paymentNotes', confirmPaymentData.paymentNotes);
      }
      
      // Payment evidence is REQUIRED by backend
      if (confirmPaymentData.evidenceFile) {
        data.append('payment_evidence', confirmPaymentData.evidenceFile);
      }
      
      const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/progress-payments/${invoiceForAction.id}/confirm-payment`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: data
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm payment');
      }

      const result = await response.json();
      
      alert(`✅ ${result.message}\n\nInvoice: ${result.data.invoiceNumber}\nJumlah: Rp ${parseFloat(confirmPaymentData.paidAmount).toLocaleString('id-ID')}\nBank: ${confirmPaymentData.bankName}\nTanggal: ${new Date(confirmPaymentData.paidDate).toLocaleDateString('id-ID')}`);
      
      // Close form and refresh
      setShowConfirmPaymentForm(false);
      setInvoiceForAction(null);
      
      if (onRefresh) {
        await onRefresh();
      }
      
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('❌ Gagal konfirmasi pembayaran: ' + error.message);
    }
  };

  const handleSendEmail = (invoice) => {
    // Optional: For digital invoice sending via email
    const email = window.prompt(
      '📧 Kirim Invoice via Email\n\n' +
      'Masukkan email penerima:',
      project?.clientEmail || ''
    );
    
    if (email) {
      alert(
        `📧 Kirim Invoice Digital\n\n` +
        `Invoice: ${invoice.invoiceNumber}\n` +
        `Ke: ${email}\n\n` +
        `⚠️ Fitur ini akan segera tersedia.\n\n` +
        `Untuk saat ini, gunakan:\n` +
        `1. Download PDF\n` +
        `2. Cetak & tambahkan TTD + Stempel\n` +
        `3. Kirim hardcopy ke klien\n` +
        `4. Klik "Tandai Terkirim"`
      );
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
    generated: invoices.filter(i => i.status === 'generated').length,
    sent: invoices.filter(i => i.status === 'sent' || i.status === 'invoice_sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, i) => sum + parseFloat(i.netAmount || 0), 0),
    draftAmount: invoices.filter(i => i.status === 'draft').reduce((sum, i) => sum + parseFloat(i.netAmount || 0), 0),
    sentAmount: invoices.filter(i => i.status === 'sent' || i.status === 'invoice_sent' || i.status === 'overdue').reduce((sum, i) => sum + parseFloat(i.netAmount || 0), 0),
    paidAmount: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseFloat(i.netAmount || 0), 0),
    overdueAmount: invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + parseFloat(i.netAmount || 0), 0)
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = {
      draft: { color: 'bg-[#8E8E93]/20 text-[#8E8E93]', label: 'Draft' },
      generated: { color: 'bg-[#0A84FF]/20 text-[#0A84FF]', label: 'Generated' },
      approved: { color: 'bg-[#0A84FF]/20 text-[#0A84FF]', label: 'Approved' },
      invoice_sent: { color: 'bg-[#FF9F0A]/20 text-[#FF9F0A]', label: 'Sent' },
      sent: { color: 'bg-[#FF9F0A]/20 text-[#FF9F0A]', label: 'Sent' },
      paid: { color: 'bg-[#30D158]/20 text-[#30D158]', label: 'Paid' },
      overdue: { color: 'bg-[#FF3B30]/20 text-[#FF3B30]', label: 'Overdue' },
      cancelled: { color: 'bg-[#8E8E93]/20 text-[#8E8E93]', label: 'Cancelled' }
    };
    
    const { color, label } = config[status] || config.generated;
    
    return (
      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Statistics Cards - Compact */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#0A84FF]/20 flex items-center justify-center">
              <Receipt size={16} className="text-[#0A84FF]" />
            </div>
            <p className="text-xs text-[#8E8E93]">Total Invoice</p>
          </div>
          <p className="text-xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-[#8E8E93] mt-1">{formatCurrencyCompact(stats.totalAmount)}</p>
        </div>

        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#8E8E93]/20 flex items-center justify-center">
              <Receipt size={16} className="text-[#8E8E93]" />
            </div>
            <p className="text-xs text-[#8E8E93]">Draft</p>
          </div>
          <p className="text-xl font-bold text-[#8E8E93]">{stats.draft}</p>
          <p className="text-xs text-[#8E8E93] mt-1">{formatCurrencyCompact(stats.draftAmount)}</p>
        </div>

        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF9F0A]/20 flex items-center justify-center">
              <Send size={16} className="text-[#FF9F0A]" />
            </div>
            <p className="text-xs text-[#8E8E93]">Sent / Awaiting</p>
          </div>
          <p className="text-xl font-bold text-[#FF9F0A]">{stats.sent}</p>
          <p className="text-xs text-[#8E8E93] mt-1">{formatCurrencyCompact(stats.sentAmount)}</p>
        </div>

        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#30D158]/20 flex items-center justify-center">
              <CheckCircle size={16} className="text-[#30D158]" />
            </div>
            <p className="text-xs text-[#8E8E93]">Paid</p>
          </div>
          <p className="text-xl font-bold text-[#30D158]">{stats.paid}</p>
          <p className="text-xs text-[#8E8E93] mt-1">{formatCurrencyCompact(stats.paidAmount)}</p>
        </div>

        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF3B30]/20 flex items-center justify-center">
              <Calendar size={16} className="text-[#FF3B30]" />
            </div>
            <p className="text-xs text-[#8E8E93]">Overdue</p>
          </div>
          <p className="text-xl font-bold text-[#FF3B30]">{stats.overdue}</p>
          <p className="text-xs text-[#8E8E93] mt-1">{formatCurrencyCompact(stats.overdueAmount)}</p>
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
            <option value="generated">Generated</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
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

                  {/* Actions - Based on Invoice Status */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    {/* View - Always available */}
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="p-2 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded-lg transition-colors"
                      title="Lihat Detail Invoice"
                    >
                      <Eye size={16} />
                    </button>
                    
                    {/* Download PDF - Always available for generated/sent/paid/overdue */}
                    {invoice.status !== 'draft' && (
                      <button
                        onClick={() => handleDownloadPDF(invoice)}
                        className="p-2 text-[#30D158] hover:bg-[#30D158]/10 rounded-lg transition-colors"
                        title="Download & Cetak PDF"
                      >
                        <Printer size={16} />
                      </button>
                    )}
                    
                    {/* Mark as Sent - For generated status */}
                    {invoice.status === 'generated' && (
                      <button
                        onClick={() => handleMarkAsSent(invoice)}
                        className="p-2 text-[#FF9F0A] hover:bg-[#FF9F0A]/10 rounded-lg transition-colors"
                        title="Tandai Terkirim (Hardcopy)"
                      >
                        <Send size={16} />
                      </button>
                    )}
                    
                    {/* Confirm Payment - For invoice_sent status */}
                    {invoice.status === 'invoice_sent' && (
                      <button
                        onClick={() => handleConfirmPayment(invoice)}
                        className="p-2 text-[#30D158] hover:bg-[#30D158]/10 rounded-lg transition-colors"
                        title="Konfirmasi Pembayaran Diterima"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    
                    {/* Send Email - Optional for digital copy */}
                    {(invoice.status === 'generated' || invoice.status === 'invoice_sent') && (
                      <button
                        onClick={() => handleSendEmail(invoice)}
                        className="p-2 text-[#8E8E93] hover:bg-[#8E8E93]/10 rounded-lg transition-colors"
                        title="Kirim via Email (Opsional)"
                      >
                        <Mail size={16} />
                      </button>
                    )}
                    
                    {/* Draft indicator - with Approve/Reject buttons */}
                    {invoice.status === 'draft' && (
                      <div className="flex gap-2">
                        {/* Approve Payment button for draft invoices */}
                        <button
                          onClick={() => handleApproveInvoice(invoice)}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 transition-colors"
                          title="Approve Payment to Generate Invoice"
                        >
                          <CheckCircle size={14} />
                          <span>Approve</span>
                        </button>
                        
                        {/* Reject Payment button */}
                        <button
                          onClick={() => {
                            const reason = window.prompt(
                              '⚠️ Reject Payment\n\n' +
                              'Alasan penolakan pembayaran:\n' +
                              '(Invoice akan dibatalkan)',
                              ''
                            );
                            if (reason && reason.trim()) {
                              handleRejectInvoice(invoice, reason.trim());
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-[#FF3B30] text-white rounded-lg hover:bg-[#FF3B30]/90 transition-colors"
                          title="Reject Payment"
                        >
                          <XCircle size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
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
            canApprove={true}
          />
        </div>
      )}

      {/* Mark Invoice as Sent - Inline Form */}
      {showMarkSentForm && invoiceForAction && (
        <div id="mark-sent-form" className="mt-6 bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FF9F0A]/20 rounded-lg">
                <Send className="text-[#FF9F0A]" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">Tandai Invoice Terkirim</h3>
            </div>
            <button
              onClick={() => {
                setShowMarkSentForm(false);
                setInvoiceForAction(null);
              }}
              className="p-2 text-[#8E8E93] hover:bg-[#8E8E93]/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="bg-[#1C1C1E] border border-[#38383A] rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt size={16} className="text-[#0A84FF]" />
              <p className="text-sm text-white">Invoice: <span className="font-semibold">{invoiceForAction.invoiceNumber}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-[#30D158]" />
              <p className="text-sm text-[#8E8E93]">Amount: {formatCurrency(invoiceForAction.netAmount)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmitMarkAsSent} className="space-y-4">
            {/* Recipient Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Diterima Oleh *</label>
              <input
                type="text"
                value={markSentData.recipientName}
                onChange={(e) => setMarkSentData({...markSentData, recipientName: e.target.value})}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
                required
                minLength={3}
                placeholder="Nama penerima"
              />
            </div>

            {/* Send Date */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Tanggal Kirim *</label>
              <input
                type="date"
                value={markSentData.sentDate}
                onChange={(e) => setMarkSentData({...markSentData, sentDate: e.target.value})}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
                required
              />
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Metode Pengiriman *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'courier', label: 'Kurir', icon: Truck },
                  { value: 'post', label: 'Pos', icon: Mail },
                  { value: 'hand_delivery', label: 'Hand Delivery', icon: Package },
                  { value: 'other', label: 'Lainnya', icon: Package }
                ].map(method => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setMarkSentData({...markSentData, deliveryMethod: method.value})}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        markSentData.deliveryMethod === method.value
                          ? 'bg-[#0A84FF] text-white'
                          : 'bg-[#1C1C1E] text-[#8E8E93] hover:bg-[#38383A]'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Courier Fields */}
            {markSentData.deliveryMethod === 'courier' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Nama Kurir *</label>
                  <input
                    type="text"
                    value={markSentData.courierService}
                    onChange={(e) => setMarkSentData({...markSentData, courierService: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
                    required
                    placeholder="JNE, TIKI, dll"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">No. Resi</label>
                  <input
                    type="text"
                    value={markSentData.trackingNumber}
                    onChange={(e) => setMarkSentData({...markSentData, trackingNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
                    placeholder="Optional"
                  />
                </div>
              </div>
            )}

            {/* Evidence Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Bukti Kirim (Optional)</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setMarkSentData({...markSentData, evidenceFile: e.target.files[0]})}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#0A84FF] file:text-white file:cursor-pointer"
              />
              {markSentData.evidenceFile && (
                <p className="mt-2 text-xs text-[#30D158]">✓ File selected: {markSentData.evidenceFile.name}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Catatan</label>
              <textarea
                value={markSentData.deliveryNotes}
                onChange={(e) => setMarkSentData({...markSentData, deliveryNotes: e.target.value})}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
                rows={3}
                placeholder="Catatan tambahan..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#38383A]">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors font-medium"
              >
                <Send size={18} />
                <span>Tandai Terkirim</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMarkSentForm(false);
                  setInvoiceForAction(null);
                }}
                className="px-4 py-2 bg-[#8E8E93]/20 text-white rounded-lg hover:bg-[#8E8E93]/30 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm Payment Received - Inline Form */}
      {showConfirmPaymentForm && invoiceForAction && (
        <div id="confirm-payment-form" className="mt-6 bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#30D158]/20 rounded-lg">
                <DollarSign className="text-[#30D158]" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">Konfirmasi Pembayaran Diterima</h3>
            </div>
            <button
              onClick={() => {
                setShowConfirmPaymentForm(false);
                setInvoiceForAction(null);
              }}
              className="p-2 text-[#8E8E93] hover:bg-[#8E8E93]/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="bg-[#1C1C1E] border border-[#38383A] rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt size={16} className="text-[#0A84FF]" />
              <p className="text-sm text-white">Invoice: <span className="font-semibold">{invoiceForAction.invoiceNumber}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-[#FF9F0A]" />
              <p className="text-sm text-[#8E8E93]">Expected: <span className="font-semibold text-[#FF9F0A]">{formatCurrency(invoiceForAction.netAmount)}</span></p>
            </div>
          </div>

          <div className="bg-[#FF9F0A]/10 border border-[#FF9F0A]/30 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertCircle size={16} className="text-[#FF9F0A] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#FF9F0A]">Bukti transfer wajib diupload!</p>
          </div>

          <form onSubmit={handleSubmitConfirmPayment} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Jumlah Diterima *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]">Rp</span>
                <input
                  type="number"
                  value={confirmPaymentData.paidAmount}
                  onChange={(e) => setConfirmPaymentData({...confirmPaymentData, paidAmount: e.target.value})}
                  className="w-full pl-12 pr-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
                  required
                  step="0.01"
                />
                {parseFloat(confirmPaymentData.paidAmount) === parseFloat(invoiceForAction.netAmount) && (
                  <CheckCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#30D158]" />
                )}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Tanggal Pembayaran *</label>
              <input
                type="date"
                value={confirmPaymentData.paidDate}
                onChange={(e) => setConfirmPaymentData({...confirmPaymentData, paidDate: e.target.value})}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
                required
              />
            </div>

            {/* Bank */}
            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                Bank Penerima *
                {loadingBankAccounts && (
                  <RefreshCw size={14} className="animate-spin text-[#0A84FF]" />
                )}
              </label>
              <select
                value={confirmPaymentData.bankName}
                onChange={(e) => {
                  console.log('Bank selected:', e.target.value); // Debug log
                  setConfirmPaymentData({...confirmPaymentData, bankName: e.target.value});
                }}
                className={`w-full px-3 py-2 bg-[#1C1C1E] border rounded-lg text-white focus:outline-none focus:border-[#0A84FF] ${
                  !confirmPaymentData.bankName ? 'border-[#FF453A]' : 'border-[#38383A]'
                }`}
                required
                disabled={loadingBankAccounts}
              >
                <option value="">
                  {loadingBankAccounts ? 'Loading banks...' : '-- Pilih Bank Penerima --'}
                </option>
                
                {bankAccounts.length > 0 ? (
                  <>
                    {/* Bank accounts from Chart of Accounts */}
                    {bankAccounts.map(account => (
                      <option key={account.id} value={account.accountName}>
                        {account.accountCode} - {account.accountName}
                      </option>
                    ))}
                    
                    {/* Separator */}
                    <option disabled>──────────</option>
                    <option value="Other">Lainnya (Manual Entry)</option>
                  </>
                ) : (
                  <>
                    {/* Fallback options if no COA banks found */}
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BRI">BRI</option>
                    <option value="BNI">BNI</option>
                    <option value="CIMB Niaga">CIMB Niaga</option>
                    <option value="Permata">Permata</option>
                    <option value="Danamon">Danamon</option>
                    <option value="BTN">BTN</option>
                    <option value="Other">Lainnya</option>
                  </>
                )}
              </select>
              
              {!confirmPaymentData.bankName && (
                <p className="text-xs text-[#FF453A] mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>Bank penerima wajib dipilih</span>
                </p>
              )}
              
              {bankAccounts.length > 0 && confirmPaymentData.bankName && (
                <p className="text-xs text-[#30D158] mt-1 flex items-center gap-1">
                  <CheckCircle size={12} />
                  <span>Bank dipilih: {confirmPaymentData.bankName}</span>
                </p>
              )}
              
              {bankAccounts.length > 0 && !confirmPaymentData.bankName && (
                <p className="text-xs text-[#8E8E93] mt-1">
                  {bankAccounts.length} bank tersedia dari Chart of Accounts
                </p>
              )}
            </div>

            {/* Reference */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Referensi Transfer</label>
              <input
                type="text"
                value={confirmPaymentData.paymentReference}
                onChange={(e) => setConfirmPaymentData({...confirmPaymentData, paymentReference: e.target.value})}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
                placeholder="TRF123456"
              />
            </div>

            {/* Evidence Upload (REQUIRED) */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Bukti Transfer * <span className="text-[#FF3B30]">(WAJIB)</span>
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setConfirmPaymentData({...confirmPaymentData, evidenceFile: e.target.files[0]})}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#30D158] file:text-white file:cursor-pointer"
                required
              />
              {confirmPaymentData.evidenceFile && (
                <p className="mt-2 text-xs text-[#30D158]">✓ File selected: {confirmPaymentData.evidenceFile.name}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Catatan</label>
              <textarea
                value={confirmPaymentData.paymentNotes}
                onChange={(e) => setConfirmPaymentData({...confirmPaymentData, paymentNotes: e.target.value})}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
                rows={3}
                placeholder="Catatan pembayaran..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#38383A]">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 transition-colors font-medium"
              >
                <CheckCircle size={18} />
                <span>Konfirmasi Pembayaran</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmPaymentForm(false);
                  setInvoiceForAction(null);
                }}
                className="px-4 py-2 bg-[#8E8E93]/20 text-white rounded-lg hover:bg-[#8E8E93]/30 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InvoiceManager;
