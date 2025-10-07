import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  User,
  CreditCard,
  Receipt,
  Download,
  Eye,
  Edit,
  Plus,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const ProgressPaymentManager = ({ projectId, project, onPaymentChange }) => {
  const [payments, setPayments] = useState([]);
  const [beritaAcaraList, setBeritaAcaraList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    approvedAmount: 0
  });

  useEffect(() => {
    fetchProgressPayments();
    fetchApprovedBeritaAcara();
  }, [projectId]);

  const fetchProgressPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/progress-payments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data.data || []);
        setSummary(data.summary || {
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          approvedAmount: 0
        });
      } else {
        throw new Error('Failed to load Progress Payments');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedBeritaAcara = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/berita-acara?status=approved`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBeritaAcaraList(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching approved BA:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'payment_approved': return 'bg-blue-100 text-blue-800';
      case 'ba_approved': return 'bg-purple-100 text-purple-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending_ba': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid': return 'Dibayar';
      case 'payment_approved': return 'Payment Disetujui';
      case 'ba_approved': return 'BA Disetujui';
      case 'processing': return 'Diproses';
      case 'pending_ba': return 'Menunggu BA';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  // Removed duplicate formatCurrency - using imported from utils

  const handleCreatePayment = async (paymentData) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/progress-payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        setShowCreateForm(false);
        fetchProgressPayments();
        onPaymentChange && onPaymentChange();
        alert('Progress Payment berhasil dibuat');
      } else {
        throw new Error('Gagal membuat Progress Payment');
      }
    } catch (error) {
      console.error('Error creating progress payment:', error);
      alert('Gagal membuat Progress Payment');
    }
  };

  const handleApprovePayment = async (paymentId) => {
    if (!window.confirm('Yakin ingin menyetujui pembayaran ini?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/progress-payments/${paymentId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchProgressPayments();
        onPaymentChange && onPaymentChange();
        alert('Pembayaran berhasil disetujui');
      } else {
        throw new Error('Gagal menyetujui pembayaran');
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('Gagal menyetujui pembayaran');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading Progress Payments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Progress Payments</h2>
          <p className="text-gray-600 mt-1">Manajemen pembayaran bertahap berdasarkan Berita Acara</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={beritaAcaraList.length === 0}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title={beritaAcaraList.length === 0 ? 'Perlu Berita Acara yang disetujui untuk membuat pembayaran' : 'Buat Progress Payment baru'}
        >
          <Plus className="h-4 w-4 mr-2" />
          Buat Pembayaran
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Amount</p>
              <p className="text-lg font-bold text-blue-900">{formatCurrency(summary.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Dibayar</p>
              <p className="text-lg font-bold text-green-900">{formatCurrency(summary.paidAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Disetujui</p>
              <p className="text-lg font-bold text-purple-900">{formatCurrency(summary.approvedAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-lg font-bold text-yellow-900">{formatCurrency(summary.pendingAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Logic Info */}
      {beritaAcaraList.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Berita Acara Diperlukan</h4>
              <p className="text-sm text-amber-700 mt-1">
                Untuk membuat Progress Payment, diperlukan Berita Acara yang sudah disetujui. 
                Silakan buat dan setujui Berita Acara terlebih dahulu di tab "Berita Acara".
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Payments List */}
      {payments.length === 0 ? (
        <div className="text-center py-12">
          <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Progress Payment</h3>
          <p className="text-gray-600 mb-4">
            {beritaAcaraList.length === 0 
              ? 'Buat dan setujui Berita Acara terlebih dahulu untuk membuat pembayaran.'
              : 'Buat progress payment pertama berdasarkan Berita Acara yang sudah disetujui.'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Berita Acara
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Payment #{payment.paymentNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          BA #{payment.beritaAcara?.baNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.completionPercentage}% selesai
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.netAmount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Gross: {formatCurrency(payment.grossAmount)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {payment.status === 'ba_approved' && (
                          <button
                            onClick={() => handleApprovePayment(payment.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve Payment"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Form Modal - Placeholder */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">Buat Progress Payment</h3>
            <p className="text-gray-600 mb-4">Form untuk membuat progress payment berdasarkan Berita Acara yang sudah disetujui.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  // Placeholder implementation
                  setShowCreateForm(false);
                  alert('Progress Payment form sedang dalam pengembangan');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Detail Modal - Placeholder */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <p className="text-gray-600 mb-4">Detail informasi pembayaran #{selectedPayment.paymentNumber}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressPaymentManager;