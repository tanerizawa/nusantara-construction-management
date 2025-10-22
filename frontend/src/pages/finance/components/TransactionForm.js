import React from 'react';
import { validateTransactionForm } from '../utils/validators';

/**
 * TransactionForm Component
 * 
 * Form for creating and editing financial transactions
 * Includes validation and project integration
 * 
 * @param {Object} props
 * @param {Object} props.formData - Transaction form data
 * @param {Function} props.onChange - Handler for form field changes
 * @param {Function} props.onSubmit - Handler for form submission
 * @param {Function} props.onCancel - Handler for cancel action
 * @param {Array} props.projects - List of available projects
 * @param {boolean} props.loadingProjects - Loading state for projects
 * @param {Array} props.cashAccounts - List of cash/bank accounts from COA
 * @param {boolean} props.loadingCashAccounts - Loading state for cash accounts
 * @param {boolean} props.isSubmitting - Submission state
 * @param {boolean} props.isEdit - Whether in edit mode
 */
const TransactionForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  projects = [],
  loadingProjects = false,
  cashAccounts = [],
  loadingCashAccounts = false,
  isSubmitting = false,
  isEdit = false
}) => {
  const [errors, setErrors] = React.useState({});

  /**
   * Handle form submission with validation
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('🎯 FORM SUBMIT - Starting validation...');
    console.log('📝 Form Data:', formData);
    
    // Validate form
    const validation = validateTransactionForm(formData);
    
    console.log('🔍 Validation Result:', validation);
    console.log('❓ Is Valid:', validation.isValid);
    console.log('❓ Errors:', validation.errors);
    
    if (!validation.isValid) {
      console.error('❌ VALIDATION FAILED:', validation.errors);
      setErrors(validation.errors);
      alert('Validation Error: ' + JSON.stringify(validation.errors, null, 2));
      return;
    }
    
    // Clear errors and submit
    console.log('✅ Validation passed, calling onSubmit...');
    setErrors({});
    onSubmit(e);
  };

  /**
   * Handle field change with error clearing
   */
  const handleChange = (field, value) => {
    onChange(field, value);
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="rounded-xl shadow-lg" style={{
      backgroundColor: '#2C2C2E',
      border: '1px solid #38383A'
    }}>
      <div className="p-6" style={{ borderBottom: '1px solid #38383A' }}>
        <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>
          {isEdit ? 'Sunting Transaksi' : 'Buat Transaksi Baru'}
        </h3>
        <p className="text-sm mt-1" style={{ color: '#98989D' }}>
          {isEdit ? 'Perbarui detail transaksi' : 'Tambahkan transaksi keuangan baru ke pencatatan Anda'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Jenis Transaksi *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                backgroundColor: '#1C1C1E',
                color: '#FFFFFF',
                border: errors.type ? '1px solid #FF453A' : '1px solid #38383A'
              }}
              required
            >
              <option value="expense">Pengeluaran</option>
              <option value="income">Pendapatan</option>
              <option value="transfer">Transfer</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm" style={{ color: '#FF453A' }}>{errors.type}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Kategori *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                backgroundColor: '#1C1C1E',
                color: '#FFFFFF',
                border: errors.category ? '1px solid #FF453A' : '1px solid #38383A'
              }}
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="Materials">Material</option>
              <option value="Labor">Tenaga Kerja</option>
              <option value="Equipment">Peralatan</option>
              <option value="Subcontractor">Subkontraktor</option>
              <option value="Transportation">Transportasi</option>
              <option value="Administrative">Administrasi</option>
              <option value="Project Revenue">Pendapatan Proyek</option>
              <option value="Other Income">Pendapatan Lainnya</option>
              <option value="Other Expense">Pengeluaran Lainnya</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm" style={{ color: '#FF453A' }}>{errors.category}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Nilai (IDR) *
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                backgroundColor: '#1C1C1E',
                color: '#FFFFFF',
                border: errors.amount ? '1px solid #FF453A' : '1px solid #38383A'
              }}
              placeholder="0"
              min="0"
              step="0.01"
              required
            />
            {errors.amount && (
              <p className="mt-1 text-sm" style={{ color: '#FF453A' }}>{errors.amount}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Tanggal Transaksi *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                backgroundColor: '#1C1C1E',
                color: '#FFFFFF',
                border: errors.date ? '1px solid #FF453A' : '1px solid #38383A'
              }}
              required
            />
            {errors.date && (
              <p className="mt-1 text-sm" style={{ color: '#FF453A' }}>{errors.date}</p>
            )}
          </div>

          {/* Project ID */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Proyek
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => handleChange('projectId', e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                backgroundColor: '#1C1C1E',
                color: '#FFFFFF',
                border: '1px solid #38383A'
              }}
              disabled={loadingProjects}
            >
              <option value="">
                {loadingProjects ? 'Memuat Proyek...' : 'Tanpa Proyek'}
              </option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name} - {project.subsidiary?.name || 'No Subsidiary'}
                </option>
              ))}
            </select>
          </div>

          {/* Bank Account Selection - For Income & Expense */}
          {formData.type !== 'transfer' && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                {formData.type === 'income' ? 'Rekening Penerima *' : 'Rekening Pembayar *'}
              </label>
              <select
                value={formData.type === 'income' ? formData.accountTo : formData.accountFrom}
                onChange={(e) => handleChange(formData.type === 'income' ? 'accountTo' : 'accountFrom', e.target.value)}
                className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200"
                style={{
                  backgroundColor: '#1C1C1E',
                  color: '#FFFFFF',
                  border: errors.accountFrom || errors.accountTo ? '1px solid #FF453A' : '1px solid #38383A'
                }}
                required
                disabled={loadingCashAccounts}
              >
                <option value="">
                  {loadingCashAccounts ? 'Memuat rekening...' : 'Pilih Rekening Bank'}
                </option>
                {cashAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.displayName} - {account.formattedBalance}
                  </option>
                ))}
              </select>
              {(errors.accountFrom || errors.accountTo) && (
                <p className="mt-1 text-sm" style={{ color: '#FF453A' }}>
                  {errors.accountFrom || errors.accountTo}
                </p>
              )}
              <p className="mt-1 text-xs" style={{ color: '#98989D' }}>
                {formData.type === 'income' ? 'Rekening yang menerima pembayaran' : 'Rekening yang melakukan pembayaran'}
              </p>
            </div>
          )}

          {/* Transfer: From & To Accounts */}
          {formData.type === 'transfer' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                  Dari Rekening *
                </label>
                <select
                  value={formData.accountFrom}
                  onChange={(e) => handleChange('accountFrom', e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: '#1C1C1E',
                    color: '#FFFFFF',
                    border: errors.accountFrom ? '1px solid #FF453A' : '1px solid #38383A'
                  }}
                  required
                  disabled={loadingCashAccounts}
                >
                  <option value="">Pilih rekening sumber</option>
                  {cashAccounts.map(account => (
                    <option 
                      key={account.id} 
                      value={account.id}
                      disabled={account.id === formData.accountTo}
                    >
                      {account.displayName} - {account.formattedBalance}
                    </option>
                  ))}
                </select>
                {errors.accountFrom && (
                  <p className="mt-1 text-sm" style={{ color: '#FF453A' }}>{errors.accountFrom}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                  Ke Rekening *
                </label>
                <select
                  value={formData.accountTo}
                  onChange={(e) => handleChange('accountTo', e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: '#1C1C1E',
                    color: '#FFFFFF',
                    border: errors.accountTo ? '1px solid #FF453A' : '1px solid #38383A'
                  }}
                  required
                  disabled={loadingCashAccounts}
                >
                  <option value="">Pilih rekening tujuan</option>
                  {cashAccounts.map(account => (
                    <option 
                      key={account.id} 
                      value={account.id}
                      disabled={account.id === formData.accountFrom}
                    >
                      {account.displayName} - {account.formattedBalance}
                    </option>
                  ))}
                </select>
                {errors.accountTo && (
                  <p className="mt-1 text-sm" style={{ color: '#FF453A' }}>{errors.accountTo}</p>
                )}
              </div>
            </>
          )}

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Nomor Referensi
            </label>
            <input
              type="text"
              value={formData.referenceNumber}
              onChange={(e) => handleChange('referenceNumber', e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                backgroundColor: '#1C1C1E',
                color: '#FFFFFF',
                border: errors.referenceNumber ? '1px solid #FF453A' : '1px solid #38383A'
              }}
              placeholder="INV-001, REF-123, dll."
            />
            {errors.referenceNumber && (
              <p className="mt-1 text-sm" style={{ color: '#FF453A' }}>{errors.referenceNumber}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
            Deskripsi *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200"
            style={{
              backgroundColor: '#1C1C1E',
              color: '#FFFFFF',
              border: errors.description ? '1px solid #FF453A' : '1px solid #38383A'
            }}
            placeholder="Masukkan deskripsi transaksi"
            rows="3"
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm" style={{ color: '#FF453A' }}>{errors.description}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
            Catatan Tambahan
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200"
            style={{
              backgroundColor: '#1C1C1E',
              color: '#FFFFFF',
              border: '1px solid #38383A'
            }}
            placeholder="Catatan atau komentar tambahan"
            rows="2"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4" style={{ borderTop: '1px solid #38383A' }}>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200"
            style={{
              backgroundColor: 'rgba(255, 69, 58, 0.15)',
              color: '#FF453A',
              border: '1px solid rgba(255, 69, 58, 0.3)'
            }}
            disabled={isSubmitting}
          >
            Batalkan
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'rgba(10, 132, 255, 0.15)',
              color: '#0A84FF',
              border: '1px solid rgba(10, 132, 255, 0.3)'
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: '#0A84FF' }}></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>{isEdit ? 'Perbarui Transaksi' : 'Buat Transaksi'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
