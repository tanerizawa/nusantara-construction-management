import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  Clock,
  DollarSign,
  Filter
} from 'lucide-react';
import useAdditionalExpenses from '../hooks/useAdditionalExpenses';
import useBudgetCalculations from '../hooks/useBudgetCalculations';

/**
 * Additional Expenses Section Component
 * Manage kasbon, overtime, emergency expenses, etc.
 */
const AdditionalExpensesSection = ({ projectId, expenses, onRefresh, onAddExpense, onEditExpense }) => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const {
    deleting,
    approving,
    rejecting,
    deleteExpense,
    approveExpense,
    rejectExpense
  } = useAdditionalExpenses(projectId, onRefresh);

  const {
    formatCurrency,
    getExpenseTypeLabel,
    getApprovalStatusBadge
  } = useBudgetCalculations();

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    if (!Array.isArray(expenses)) return [];

    let filtered = expenses;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(exp => exp.approvalStatus === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(exp => exp.expenseType === selectedType);
    }

    return filtered.sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));
  }, [expenses, selectedStatus, selectedType]);

  // Calculate totals
  const totals = useMemo(() => {
    const pending = filteredExpenses
      .filter(exp => exp.approvalStatus === 'pending')
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);

    const approved = filteredExpenses
      .filter(exp => exp.approvalStatus === 'approved')
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);

    return { pending, approved, total: pending + approved };
  }, [filteredExpenses]);

  // Get unique expense types
  const expenseTypes = useMemo(() => {
    if (!Array.isArray(expenses)) return [];
    return [...new Set(expenses.map(exp => exp.expenseType))];
  }, [expenses]);

  const handleDelete = async (expenseId) => {
    const result = await deleteExpense(expenseId);
    if (result.success) {
      setShowDeleteConfirm(null);
    }
  };

  const handleApprove = async (expenseId) => {
    await approveExpense(expenseId);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Alasan penolakan harus diisi');
      return;
    }

    const result = await rejectExpense(showRejectModal, rejectReason);
    if (result.success) {
      setShowRejectModal(null);
      setRejectReason('');
    }
  };

  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg overflow-hidden">
      {/* Compact Header */}
      <div className="p-3 border-b border-[#38383A]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Pengeluaran Tambahan
            </h3>
            <p className="text-xs text-[#8E8E93] mt-0.5">
              Kasbon, lembur, dan pengeluaran lainnya
            </p>
          </div>
          <button
            onClick={() => onAddExpense()}
            className="flex items-center px-2.5 py-1.5 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white rounded-lg transition-colors text-xs"
          >
            <Plus className="mr-1.5 w-3.5 h-3.5" />
            Tambah
          </button>
        </div>

        {/* Compact Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="bg-[#FFD60A]/10 border border-[#FFD60A]/30 rounded-lg p-2.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#FFD60A] font-medium">
                  Menunggu
                </p>
                <p className="text-base font-bold text-white mt-0.5">
                  {formatCurrency(totals.pending)}
                </p>
              </div>
              <Clock className="text-[#FFD60A] w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#30D158]/10 border border-[#30D158]/30 rounded-lg p-2.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#30D158] font-medium">
                  Disetujui
                </p>
                <p className="text-base font-bold text-white mt-0.5">
                  {formatCurrency(totals.approved)}
                </p>
              </div>
              <Check className="text-[#30D158] w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded-lg p-2.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#0A84FF] font-medium">
                  Total
                </p>
                <p className="text-base font-bold text-white mt-0.5">
                  {formatCurrency(totals.total)}
                </p>
              </div>
              <DollarSign className="text-[#0A84FF] w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Compact Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 border border-[#38383A] rounded-lg bg-[#1C1C1E] text-white text-sm focus:ring-1 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
            <option value="cancelled">Dibatalkan</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 border border-[#38383A] rounded-lg bg-[#1C1C1E] text-white text-sm focus:ring-1 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
          >
            <option value="all">Semua Jenis</option>
            {expenseTypes.map(type => (
              <option key={type} value={type}>
                {getExpenseTypeLabel(type)}
              </option>
            ))}
          </select>

          <div className="flex items-center text-xs text-[#8E8E93]">
            <Filter className="mr-1.5 w-3.5 h-3.5" />
            {filteredExpenses.length} pengeluaran
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="overflow-x-auto">
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center text-[#8E8E93]">
            <p>Belum ada pengeluaran tambahan</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#1C1C1E] border-b border-[#38383A]">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#8E8E93] uppercase">
                  Tanggal
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#8E8E93] uppercase">
                  Jenis
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#8E8E93] uppercase">
                  Deskripsi
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#8E8E93] uppercase">
                  Penerima
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-[#8E8E93] uppercase">
                  Jumlah
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-[#8E8E93] uppercase">
                  Status
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-[#8E8E93] uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38383A]">
              {filteredExpenses.map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  onEdit={() => onEditExpense(expense)}
                  onDelete={() => setShowDeleteConfirm(expense.id)}
                  onApprove={() => handleApprove(expense.id)}
                  onReject={() => setShowRejectModal(expense.id)}
                  approving={approving}
                  deleting={deleting}
                  formatCurrency={formatCurrency}
                  getExpenseTypeLabel={getExpenseTypeLabel}
                  getApprovalStatusBadge={getApprovalStatusBadge}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Apakah Anda yakin ingin menghapus pengeluaran ini?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={deleting}
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                disabled={deleting}
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4 max-w-md w-full mx-4">
            <h3 className="text-base font-semibold text-white mb-3">
              Tolak Pengeluaran
            </h3>
            <p className="text-sm text-[#8E8E93] mb-3">
              Berikan alasan penolakan:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-[#38383A] rounded-lg bg-[#1C1C1E] text-white placeholder-[#8E8E93] focus:ring-1 focus:ring-[#0A84FF] focus:border-[#0A84FF] mb-3 text-sm"
              rows="4"
              placeholder="Masukkan alasan penolakan..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
                className="px-3 py-1.5 bg-[#38383A] text-white rounded-lg hover:bg-[#48484A] transition-colors text-sm"
                disabled={rejecting}
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                className="px-3 py-1.5 bg-[#FF453A] hover:bg-[#FF453A]/90 text-white rounded-lg transition-colors text-sm"
                disabled={rejecting || !rejectReason.trim()}
              >
                {rejecting ? 'Menolak...' : 'Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Individual Expense Row Component
 */
const ExpenseRow = ({
  expense,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  approving,
  deleting,
  formatCurrency,
  getExpenseTypeLabel,
  getApprovalStatusBadge
}) => {
  const statusBadge = getApprovalStatusBadge(expense.approvalStatus);
  const isPending = expense.approvalStatus === 'pending';
  const canEdit = isPending;
  const canDelete = isPending;

  return (
    <tr className="hover:bg-[#1C1C1E] transition-colors">
      <td className="px-3 py-2.5 whitespace-nowrap text-sm text-white">
        {new Date(expense.expenseDate).toLocaleDateString('id-ID')}
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap text-sm">
        <span className="px-2 py-0.5 bg-[#0A84FF]/20 text-[#0A84FF] rounded text-xs">
          {getExpenseTypeLabel(expense.expenseType)}
        </span>
      </td>
      <td className="px-3 py-2.5 text-sm text-white">
        <div className="max-w-xs">
          {expense.description}
        </div>
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap text-sm text-[#8E8E93]">
        {expense.recipientName}
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap text-sm text-right font-medium text-white">
        {formatCurrency(expense.amount)}
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap text-center">
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusBadge.color}`}>
          {statusBadge.label}
        </span>
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap text-center">
        <div className="flex items-center justify-center space-x-2">
          {isPending && (
            <>
              <button
                onClick={onApprove}
                className="p-1.5 bg-[#30D158]/20 text-[#30D158] rounded hover:bg-[#30D158]/30 transition-colors"
                title="Setujui"
                disabled={approving}
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={onReject}
                className="p-1.5 bg-[#FF453A]/20 text-[#FF453A] rounded hover:bg-[#FF453A]/30 transition-colors"
                title="Tolak"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          {canEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 bg-[#0A84FF]/20 text-[#0A84FF] rounded hover:bg-[#0A84FF]/30 transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={onDelete}
              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Hapus"
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {expense.receiptUrl && (
            <a
              href={expense.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              title="Lihat Bukti"
            >
              <Eye className="w-4 h-4" />
            </a>
          )}
        </div>
      </td>
    </tr>
  );
};

export default AdditionalExpensesSection;
