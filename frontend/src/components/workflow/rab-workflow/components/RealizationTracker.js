import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Calendar, DollarSign, Package, X, Save } from 'lucide-react';
import api from '../../../../services/api';

/**
 * RealizationTracker Component
 * Main component for RAB Budget Realization tracking
 * Displays RAP items with realization data and variance analysis
 */
const RealizationTracker = ({ projectId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  // State untuk inline form input realisasi (SIMPLE MODE)
  const [expandedItem, setExpandedItem] = useState(null);
  const [formData, setFormData] = useState({
    realizationDate: new Date().toISOString().split('T')[0],
    quantity: '',
    unitPrice: '',
    vendor: '',
    invoiceNumber: '',
    cashAccountId: '', // ID akun kas/bank yang dipilih
    notes: ''
  });
  
  const [saving, setSaving] = useState(false);
  
  // State untuk akun kas (cash & bank accounts)
  const [cashAccounts, setCashAccounts] = useState([]);
  
  // State untuk pengeluaran di luar RAB
  const [showNonRABForm, setShowNonRABForm] = useState(false);
  const [nonRABExpenses, setNonRABExpenses] = useState([]);
  const [loadingNonRAB, setLoadingNonRAB] = useState(false);
  const [nonRABFormData, setNonRABFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'overhead',
    description: '',
    amount: '',
    vendor: '',
    notes: ''
  });

  // Fetch realization data
  const fetchRealizationData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/projects/${projectId}/rab/realizations`);
      
      // api.get() already returns response.data, not the full axios response
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch realization data');
      }
    } catch (err) {
      console.error('Error fetching realization data:', err);
      setError(err.message || 'Failed to load realization data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchRealizationData();
      fetchNonRABExpenses();
      fetchCashAccounts();
    }
  }, [projectId]);

  // Fetch akun kas & bank dari chart of accounts
  const fetchCashAccounts = async () => {
    try {
      const response = await api.get('/chart-of-accounts/cash/accounts');
      if (response.success && response.data) {
        // Filter hanya child accounts (yang punya parent_account_id, bukan parent itu sendiri)
        // Biasanya parent account seperti "1101 - Kas & Bank" tidak boleh dipakai untuk transaksi
        const childAccounts = response.data.filter(acc => {
          // Filter berdasarkan level atau kode akun
          // Parent biasanya level 3, child level 4 atau lebih
          // Atau cek jika kode akun punya desimal (1101.01, bukan 1101)
          return acc.code && acc.code.includes('.');
        });
        setCashAccounts(childAccounts);
      }
    } catch (err) {
      console.error('Error fetching cash accounts:', err);
      // Non-critical
    }
  };

  // Fetch pengeluaran di luar RAB
  const fetchNonRABExpenses = async () => {
    try {
      setLoadingNonRAB(true);
      const response = await api.get(`/projects/${projectId}/non-rab-expenses`);
      if (response.success && response.data) {
        setNonRABExpenses(response.data);
      }
    } catch (err) {
      console.error('Error fetching non-RAB expenses:', err);
      // Non-critical, just log
    } finally {
      setLoadingNonRAB(false);
    }
  };

  // Handle submit pengeluaran non-RAB
  const handleSubmitNonRAB = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const payload = {
        date: nonRABFormData.date,
        category: nonRABFormData.category,
        description: nonRABFormData.description,
        amount: parseFloat(nonRABFormData.amount),
        vendor: nonRABFormData.vendor,
        notes: nonRABFormData.notes
      };

      await api.post(`/projects/${projectId}/non-rab-expenses`, payload);
      
      // Refresh data
      await fetchNonRABExpenses();
      await fetchRealizationData(); // Update total expenses
      
      // Reset form
      setNonRABFormData({
        date: new Date().toISOString().split('T')[0],
        category: 'overhead',
        description: '',
        amount: '',
        vendor: '',
        notes: ''
      });
      setShowNonRABForm(false);
      
      alert('✅ Pengeluaran berhasil dicatat!');
    } catch (err) {
      console.error('Error saving non-RAB expense:', err);
      alert('❌ Gagal menyimpan: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Handle delete pengeluaran non-RAB
  const handleDeleteNonRAB = async (expenseId) => {
    if (!confirm('Yakin ingin menghapus pengeluaran ini?')) return;
    
    try {
      await api.delete(`/projects/${projectId}/non-rab-expenses/${expenseId}`);
      await fetchNonRABExpenses();
      await fetchRealizationData();
      alert('✅ Pengeluaran berhasil dihapus!');
    } catch (err) {
      console.error('Error deleting non-RAB expense:', err);
      alert('❌ Gagal menghapus: ' + (err.response?.data?.error || err.message));
    }
  };

  // Handle toggle inline form (SIMPLE MODE - hanya expand/collapse)
  const handleToggleForm = (item) => {
    if (expandedItem?.rabItem?.id === item.rabItem.id) {
      // Close form
      setExpandedItem(null);
      setFormData({
        realizationDate: new Date().toISOString().split('T')[0],
        quantity: '',
        unitPrice: '',
        vendor: '',
        invoiceNumber: '',
        cashAccountId: '',
        notes: ''
      });
    } else {
      // Open form dengan pre-fill dari RAB item
      setExpandedItem(item);
      setFormData({
        realizationDate: new Date().toISOString().split('T')[0],
        quantity: '',
        unitPrice: item.rabItem.unitPrice || '',
        vendor: '',
        invoiceNumber: '',
        cashAccountId: '',
        notes: ''
      });
    }
  };

  // Handle form input change
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle submit realization
  const handleSubmitRealization = async () => {
    if (!expandedItem) return;

    try {
      setSaving(true);
      
      // Validasi
      if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
        alert('❌ Quantity harus diisi dan lebih dari 0');
        return;
      }
      
      if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
        alert('❌ Harga satuan harus diisi dan lebih dari 0');
        return;
      }
      
      if (!formData.cashAccountId) {
        alert('❌ Akun Kas/Bank harus dipilih');
        return;
      }

      const payload = {
        realizationDate: formData.realizationDate,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        totalAmount: parseFloat(formData.quantity) * parseFloat(formData.unitPrice),
        referenceType: 'DIRECT',
        poNumber: null,
        woNumber: null,
        vendor: formData.vendor,
        invoiceNumber: formData.invoiceNumber || null,
        cashAccountId: formData.cashAccountId, // Akun kas/bank yang dipilih
        notes: formData.notes
      };

      await api.post(
        `/projects/${projectId}/rab/${expandedItem.rabItem.id}/realizations`,
        payload
      );

      alert('✅ Realisasi berhasil disimpan!');
      
      // Refresh data
      await fetchRealizationData();
      
      // Reset form
      setExpandedItem(null);
      setFormData({
        realizationDate: new Date().toISOString().split('T')[0],
        quantity: '',
        unitPrice: '',
        vendor: '',
        invoiceNumber: '',
        cashAccountId: '',
        notes: ''
      });
    } catch (err) {
      console.error('Error saving realization:', err);
      alert('❌ Gagal menyimpan realisasi: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${Number(value).toFixed(2)}%`;
  };

  // Get variance badge color
  const getVarianceBadgeColor = (variance) => {
    if (variance < -10) return 'bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/30 border-green-200 dark:border-green-700'; // Under budget - good
    if (variance > 10) return 'bg-[#FF453A]/20 text-[#FF453A] border border-[#FF453A]/30 border-red-200 dark:border-red-700'; // Over budget - bad
    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700'; // Within tolerance
  };

  // Get variance icon
  const getVarianceIcon = (variance) => {
    if (variance < 0) return <TrendingDown className="w-4 h-4" />;
    if (variance > 0) return <TrendingUp className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data realisasi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Gagal Memuat Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchRealizationData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Data RAP</h3>
          <p className="text-gray-600">
            Silakan tambahkan item RAP terlebih dahulu di tab "Daftar RAB"
          </p>
        </div>
      </div>
    );
  }

  const { summary, items } = data;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#8E8E93]">Total Anggaran</span>
            <DollarSign className="w-5 h-5 text-[#0A84FF]" />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(summary.totalBudget)}
          </p>
          <p className="text-xs text-[#98989D] mt-1">
            {summary.itemsCount} item RAP
          </p>
        </div>

        {/* Total Realization */}
        <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#8E8E93]">Total Realisasi</span>
            <Package className="w-5 h-5 text-[#30D158]" />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(summary.totalRealization)}
          </p>
          <p className="text-xs text-[#98989D] mt-1">
            {summary.realizedItemsCount} item direalisasi
          </p>
        </div>

        {/* Variance */}
        <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#8E8E93]">Selisih</span>
            {getVarianceIcon(summary.variancePercentage)}
          </div>
          <p className={`text-2xl font-bold ${summary.variance >= 0 ? 'text-[#FF453A]' : 'text-[#30D158]'}`}>
            {formatCurrency(Math.abs(summary.variance))}
          </p>
          <p className="text-xs text-[#98989D] mt-1">
            {formatPercentage(summary.variancePercentage)}
          </p>
        </div>

        {/* Completion Rate */}
        <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#8E8E93]">Tingkat Realisasi</span>
            <Calendar className="w-5 h-5 text-[#BF5AF2]" />
          </div>
          <p className="text-2xl font-bold text-white">
            {summary.completionRate}%
          </p>
          <div className="mt-2">
            <div className="w-full bg-[#38383A] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#0A84FF] to-[#BF5AF2] h-2 rounded-full transition-all"
                style={{ width: `${summary.completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pengeluaran di Luar RAB Section */}
      <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] overflow-hidden">
        <div className="p-6 border-b border-[#38383A] bg-[#1C1C1E]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#FF9F0A]" />
                Pengeluaran di Luar RAB
              </h3>
              <p className="text-sm text-[#8E8E93] mt-1">
                Overhead, biaya tak terduga, dan pengeluaran lainnya di luar anggaran RAP
              </p>
            </div>
            <button
              onClick={() => setShowNonRABForm(!showNonRABForm)}
              className="px-4 py-2 bg-[#FF9F0A] text-white rounded-lg hover:bg-[#FF9500] transition-colors flex items-center gap-2"
            >
              {showNonRABForm ? <X className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
              {showNonRABForm ? 'Tutup' : 'Tambah Pengeluaran'}
            </button>
          </div>
        </div>

        {/* Form Input Pengeluaran Non-RAB */}
        {showNonRABForm && (
          <div className="p-6 bg-[#1C1C1E] border-b border-[#38383A]">
            <form onSubmit={handleSubmitNonRAB} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#8E8E93] mb-1">
                    Tanggal *
                  </label>
                  <input
                    type="date"
                    value={nonRABFormData.date}
                    onChange={(e) => setNonRABFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-[#38383A] rounded-lg bg-[#2C2C2E] text-white focus:ring-2 focus:ring-[#FF9F0A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#8E8E93] mb-1">
                    Kategori *
                  </label>
                  <select
                    value={nonRABFormData.category}
                    onChange={(e) => setNonRABFormData(prev => ({ ...prev, category: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-[#38383A] rounded-lg bg-[#2C2C2E] text-white focus:ring-2 focus:ring-[#FF9F0A] focus:border-transparent"
                  >
                    <option value="overhead">Overhead</option>
                    <option value="emergency">Biaya Tak Terduga</option>
                    <option value="admin">Administrasi</option>
                    <option value="operational">Operasional</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#8E8E93] mb-1">
                    Jumlah (Rp) *
                  </label>
                  <input
                    type="number"
                    value={nonRABFormData.amount}
                    onChange={(e) => setNonRABFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0"
                    step="1000"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-[#38383A] rounded-lg bg-[#2C2C2E] text-white focus:ring-2 focus:ring-[#FF9F0A] focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#8E8E93] mb-1">
                    Deskripsi *
                  </label>
                  <input
                    type="text"
                    value={nonRABFormData.description}
                    onChange={(e) => setNonRABFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Contoh: Biaya listrik kantor proyek Januari 2024"
                    required
                    className="w-full px-3 py-2 border border-[#38383A] rounded-lg bg-[#2C2C2E] text-white focus:ring-2 focus:ring-[#FF9F0A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#8E8E93] mb-1">
                    Vendor/Penerima
                  </label>
                  <input
                    type="text"
                    value={nonRABFormData.vendor}
                    onChange={(e) => setNonRABFormData(prev => ({ ...prev, vendor: e.target.value }))}
                    placeholder="Nama vendor/penerima"
                    className="w-full px-3 py-2 border border-[#38383A] rounded-lg bg-[#2C2C2E] text-white focus:ring-2 focus:ring-[#FF9F0A] focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-[#8E8E93] mb-1">
                    Catatan
                  </label>
                  <textarea
                    value={nonRABFormData.notes}
                    onChange={(e) => setNonRABFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows="2"
                    placeholder="Catatan tambahan (opsional)"
                    className="w-full px-3 py-2 border border-[#38383A] rounded-lg bg-[#2C2C2E] text-white focus:ring-2 focus:ring-[#FF9F0A] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNonRABForm(false)}
                  className="px-4 py-2 text-sm font-medium text-[#8E8E93] bg-[#1C1C1E] border border-[#38383A] rounded-lg hover:bg-[#38383A]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#FF9F0A] rounded-lg hover:bg-[#FF9500] disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabel Pengeluaran Non-RAB */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#1C1C1E]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Tanggal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Deskripsi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Vendor</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#98989D] uppercase">Jumlah</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#98989D] uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-[#2C2C2E] divide-y divide-[#38383A]">
              {loadingNonRAB ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#98989D] dark:text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : nonRABExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#98989D] dark:text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                    Belum ada pengeluaran di luar RAB
                  </td>
                </tr>
              ) : (
                nonRABExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-[#38383A]">
                    <td className="px-4 py-3 text-sm text-white">
                      {new Date(expense.date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        expense.category === 'overhead' ? 'bg-[#0A84FF]/20 text-[#0A84FF] border border-[#0A84FF]/30' :
                        expense.category === 'emergency' ? 'bg-[#FF453A]/20 text-[#FF453A] border border-[#FF453A]/30' :
                        expense.category === 'admin' ? 'bg-[#BF5AF2]/20 text-[#BF5AF2] border border-[#BF5AF2]/30' :
                        expense.category === 'operational' ? 'bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/30' :
                        'bg-[#38383A] text-[#8E8E93] border border-[#38383A]'
                      }`}>
                        {expense.category === 'overhead' ? 'Overhead' :
                         expense.category === 'emergency' ? 'Tak Terduga' :
                         expense.category === 'admin' ? 'Admin' :
                         expense.category === 'operational' ? 'Operasional' :
                         'Lainnya'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">{expense.description}</td>
                    <td className="px-4 py-3 text-sm text-[#8E8E93] dark:text-gray-500">{expense.vendor || '-'}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-white">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteNonRAB(expense.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Hapus"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {nonRABExpenses.length > 0 && (
                <tr className="bg-orange-50 dark:bg-slate-800/50 font-semibold">
                  <td colSpan="4" className="px-4 py-3 text-sm text-white text-right">
                    Total Pengeluaran di Luar RAB:
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-orange-700 dark:text-orange-400">
                    {formatCurrency(nonRABExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0))}
                  </td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RAP Items Table with Realization */}
      <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] overflow-hidden">
        <div className="p-6 border-b border-[#38383A] bg-[#1C1C1E]">
          <h3 className="text-lg font-semibold text-white">
            Daftar Item RAP & Realisasi Belanja
          </h3>
          <p className="text-sm text-[#8E8E93] mt-1">
            Klik pada item untuk melihat detail dan riwayat realisasi
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-[#1C1C1E]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                  Item RAP
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#98989D] uppercase tracking-wider">
                  Anggaran
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#98989D] uppercase tracking-wider">
                  Realisasi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#98989D] uppercase tracking-wider">
                  Selisih
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider">
                  Transaksi
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#2C2C2E] divide-y divide-[#38383A]">
              {items.map((item) => {
                const { rabItem, realizations } = item;
                const hasRealization = realizations.count > 0;
                const isExpanded = expandedItem?.rabItem?.id === rabItem.id;
                
                return (
                  <React.Fragment key={rabItem.id}>
                    <tr className="hover:bg-[#38383A] transition-colors">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-white">
                            {rabItem.description}
                          </p>
                          <p className="text-xs text-[#98989D] dark:text-gray-500">
                            {rabItem.category}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[#8E8E93] dark:text-gray-500">
                            <span>{rabItem.quantity} {rabItem.unit}</span>
                            <span>•</span>
                            <span>{formatCurrency(rabItem.unitPrice)}/{rabItem.unit}</span>
                          </div>
                        </div>
                      </td>
                    
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-medium text-white">
                        {formatCurrency(rabItem.totalBudget)}
                      </p>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      {hasRealization ? (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-white">
                            {formatCurrency(realizations.totalAmount)}
                          </p>
                          <p className="text-xs text-[#98989D] dark:text-gray-500">
                            {realizations.totalQuantity} {rabItem.unit}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500">-</p>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      {hasRealization ? (
                        <div className="space-y-1">
                          <p className={`text-sm font-medium ${realizations.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(Math.abs(realizations.variance))}
                          </p>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getVarianceBadgeColor(realizations.variancePercentage)}`}>
                            {getVarianceIcon(realizations.variancePercentage)}
                            {formatPercentage(realizations.variancePercentage)}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500">-</p>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      {hasRealization ? (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-white">
                            {realizations.count}x
                          </p>
                          {realizations.lastTransaction && (
                            <p className="text-xs text-[#98989D] dark:text-gray-500">
                              {new Date(realizations.lastTransaction).toLocaleDateString('id-ID')}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500">0</p>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleForm(item);
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isExpanded
                            ? 'bg-[#8E8E93] text-white hover:bg-[#8E8E93]/80'
                            : 'bg-[#0A84FF] text-white hover:bg-[#0A84FF]/80'
                        }`}
                      >
                        {isExpanded ? 'Tutup' : 'Input Realisasi'}
                      </button>
                    </td>
                  </tr>

                  {/* Inline Form untuk Input Realisasi - SIMPLE MODE */}
                  {isExpanded && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-[#1C1C1E]">
                        <div className="bg-[#2C2C2E] rounded-lg p-6 border-2 border-[#0A84FF]/30">
                          {/* Header */}
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                              <DollarSign className="w-5 h-5 text-[#0A84FF]" />
                              Input Realisasi: {rabItem.description}
                            </h4>
                            <p className="text-sm text-[#8E8E93]">
                              Catat pengeluaran aktual untuk item ini
                            </p>
                          </div>

                          {/* Item Info Box */}
                          <div className="mb-6 p-4 bg-[#1C1C1E] rounded-lg border border-[#BF5AF2]/30">
                            <h5 className="text-sm font-semibold text-[#BF5AF2] mb-3">Item Pekerjaan</h5>
                            <div className="space-y-2">
                              <p className="text-base font-medium text-white">{rabItem.description}</p>
                              <div className="flex items-center gap-4 text-sm text-[#8E8E93]">
                                <span>Kategori: {rabItem.category}</span>
                                <span>•</span>
                                <span>Tipe: {rabItem.itemType || 'Material'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Budget Info Box */}
                          <div className="mb-6 p-4 bg-[#1C1C1E] rounded-lg border border-[#0A84FF]/30">
                            <h5 className="text-sm font-semibold text-[#0A84FF] mb-3">Informasi Budget</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-[#8E8E93] mb-1">Quantity Budget</p>
                                <p className="text-sm font-medium text-white">{rabItem.quantity} {rabItem.unit}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[#8E8E93] mb-1">Harga Budget</p>
                                <p className="text-sm font-medium text-white">{formatCurrency(rabItem.unitPrice)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[#8E8E93] mb-1">Total Budget</p>
                                <p className="text-sm font-medium text-white">{formatCurrency(rabItem.totalBudget)}</p>
                              </div>
                              {hasRealization && (
                                <div>
                                  <p className="text-xs text-[#8E8E93] mb-1">Sudah Terealisasi</p>
                                  <p className="text-sm font-medium text-[#30D158]">{formatCurrency(realizations.totalAmount)}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Form Input */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Tanggal Realisasi */}
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Tanggal Realisasi *
                              </label>
                              <input
                                type="date"
                                value={formData.realizationDate}
                                onChange={(e) => handleFormChange('realizationDate', e.target.value)}
                                className="w-full px-4 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                              />
                            </div>

                            {/* Quantity */}
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                <Package className="w-4 h-4 inline mr-1" />
                                Quantity ({rabItem.unit}) *
                              </label>
                              <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => handleFormChange('quantity', e.target.value)}
                                placeholder="0"
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                              />
                            </div>

                            {/* Unit Price */}
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Harga Satuan (Rp) *
                              </label>
                              <input
                                type="number"
                                value={formData.unitPrice}
                                onChange={(e) => handleFormChange('unitPrice', e.target.value)}
                                placeholder="0"
                                step="1000"
                                min="0"
                                className="w-full px-4 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                              />
                            </div>

                            {/* Total otomatis */}
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Total Pengeluaran
                              </label>
                              <div className="px-4 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-[#0A84FF] font-semibold">
                                {formData.quantity && formData.unitPrice 
                                  ? formatCurrency(parseFloat(formData.quantity) * parseFloat(formData.unitPrice))
                                  : 'Rp 0'}
                              </div>
                            </div>

                            {/* Vendor */}
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Vendor/Supplier
                              </label>
                              <input
                                type="text"
                                value={formData.vendor}
                                onChange={(e) => handleFormChange('vendor', e.target.value)}
                                placeholder="Nama vendor"
                                className="w-full px-4 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                              />
                            </div>

                            {/* Invoice Number */}
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                No. Invoice/Faktur
                              </label>
                              <input
                                type="text"
                                value={formData.invoiceNumber}
                                onChange={(e) => handleFormChange('invoiceNumber', e.target.value)}
                                placeholder="No. invoice"
                                className="w-full px-4 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                              />
                            </div>

                            {/* Akun Kas/Bank */}
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Akun Kas/Bank *
                              </label>
                              <select
                                value={formData.cashAccountId}
                                onChange={(e) => handleFormChange('cashAccountId', e.target.value)}
                                className="w-full px-4 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                              >
                                <option value="">-- Pilih Akun Kas/Bank --</option>
                                {cashAccounts.map(acc => (
                                  <option key={acc.id} value={acc.id}>
                                    {acc.displayName} - {acc.formattedBalance}
                                  </option>
                                ))}
                              </select>
                              {cashAccounts.length === 0 && (
                                <p className="text-xs text-[#FF453A] mt-1">
                                  <AlertCircle className="w-3 h-3 inline mr-1" />
                                  Tidak ada akun kas tersedia
                                </p>
                              )}
                            </div>

                            {/* Notes - full width */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-white mb-2">
                                Catatan
                              </label>
                              <textarea
                                value={formData.notes}
                                onChange={(e) => handleFormChange('notes', e.target.value)}
                                placeholder="Catatan tambahan..."
                                rows="3"
                                className="w-full px-4 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                              />
                            </div>
                          </div>

                          {/* Variance Alert */}
                          {formData.quantity && formData.unitPrice && (
                            <div className={`mb-6 p-4 rounded-lg border ${
                              (parseFloat(formData.quantity) * parseFloat(formData.unitPrice)) > rabItem.totalBudget
                                ? 'bg-[#FF453A]/10 border-[#FF453A]/30'
                                : 'bg-[#30D158]/10 border-[#30D158]/30'
                            }`}>
                              <p className={`text-sm font-medium ${
                                (parseFloat(formData.quantity) * parseFloat(formData.unitPrice)) > rabItem.totalBudget
                                  ? 'text-[#FF453A]'
                                  : 'text-[#30D158]'
                              }`}>
                                <AlertCircle className="w-4 h-4 inline mr-1" />
                                {(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)) > rabItem.totalBudget
                                  ? '⚠️ Pengeluaran melebihi budget!'
                                  : '✅ Pengeluaran dalam batas budget'}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#38383A]">
                            <button
                              onClick={() => handleToggleForm(item)}
                              className="px-4 py-2 text-sm font-medium text-[#8E8E93] bg-[#38383A] hover:bg-[#38383A]/80 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4 inline mr-1" />
                              Batal
                            </button>
                            <button
                              onClick={handleSubmitRealization}
                              disabled={saving || !formData.quantity || !formData.unitPrice || !formData.cashAccountId}
                              className="px-4 py-2 text-sm font-medium text-white bg-[#0A84FF] hover:bg-[#0A84FF]/80 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              {saving ? 'Menyimpan...' : 'Simpan Realisasi'}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RealizationTracker;
