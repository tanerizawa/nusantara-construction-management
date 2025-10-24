import React from 'react';
import { Plus, Calculator } from 'lucide-react';
import { formatCurrency, getTaxTypeLabel } from '../utils/formatters';
import { validateTaxForm } from '../utils/validators';

/**
 * TaxManagement Component
 * 
 * Comprehensive tax management interface
 * Handles tax records display and creation
 * 
 * @param {Object} props
 * @param {Array} props.taxRecords - List of tax records
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.showForm - Whether to show the form
 * @param {Function} props.onToggleForm - Handler to toggle form visibility
 * @param {Object} props.formData - Tax form data
 * @param {Function} props.onChange - Handler for form changes
 * @param {Function} props.onSubmit - Handler for form submission
 * @param {Function} props.onCancel - Handler for cancel action
 * @param {boolean} props.isSubmitting - Submission state
 */
const TaxManagement = ({
  taxRecords = [],
  loading = false,
  showForm = false,
  onToggleForm,
  formData,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting = false,
  onDelete,
  selectedTax,
  showDeleteModal,
  onConfirmDelete,
  onCancelDelete
}) => {
  const [errors, setErrors] = React.useState({});

  /**
   * Handle form submission with validation
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateTaxForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Clear errors and submit
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

  /**
   * Get status badge styling
   */
  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      filed: 'bg-blue-100 text-blue-800',
      calculated: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  /**
   * Get status label
   */
  const getStatusLabel = (status) => {
    const labels = {
      paid: 'Dibayar',
      filed: 'Dilaporkan',
      calculated: 'Dihitung',
      draft: 'Draf',
      overdue: 'Terlambat'
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold" style={{ color: "#FFFFFF" }}>Dasbor Manajemen Pajak</h2>
        <button 
          onClick={onToggleForm}
          className="px-4 py-2 rounded-lg transition-colors duration-150 flex items-center space-x-2"
          style={{ 
            background: showForm 
              ? 'linear-gradient(135deg, rgba(152, 152, 157, 0.3) 0%, rgba(152, 152, 157, 0.15) 100%)'
              : 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)',
            color: '#FFFFFF'
          }}
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Batalkan' : 'Entri Pajak Baru'}</span>
        </button>
      </div>

      {/* Tax Filing Form */}
      {showForm && (
        <div className="rounded-lg shadow-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="p-6" style={{ borderBottom: "1px solid #38383A" }}>
            <h3 className="text-lg font-medium" style={{ color: "#FFFFFF" }}>Buat Entri Pajak Baru</h3>
            <p className="text-sm mt-1" style={{ color: "#98989D" }}>Tambahkan catatan kewajiban pajak baru</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tax Type */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>
                  Jenis Pajak *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: errors.type ? "1px solid #FF453A" : "1px solid #38383A"
                  }}
                  required
                >
                  <option value="pajak_penghasilan">PPh (Pajak Penghasilan)</option>
                  <option value="ppn">PPN (Pajak Pertambahan Nilai)</option>
                  <option value="pph21">PPh 21 (Pajak Gaji)</option>
                  <option value="pph23">PPh 23 (Pajak Jasa)</option>
                  <option value="pph4_ayat2">PPh Final (Pasal 4 Ayat 2)</option>
                  <option value="other">Pajak Lainnya</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm" style={{ color: "#FF453A" }}>{errors.type}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>
                  Nilai Pajak (IDR) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: errors.amount ? "1px solid #FF453A" : "1px solid #38383A"
                  }}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
                {errors.amount && (
                  <p className="mt-1 text-sm" style={{ color: "#FF453A" }}>{errors.amount}</p>
                )}
              </div>

              {/* Period */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>
                  Periode Pajak (Bulan-Tahun) *
                </label>
                <input
                  type="month"
                  value={formData.period}
                  onChange={(e) => handleChange('period', e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: errors.period ? "1px solid #FF453A" : "1px solid #38383A"
                  }}
                  required
                />
                {errors.period && (
                  <p className="mt-1 text-sm" style={{ color: "#FF453A" }}>{errors.period}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>
                  Status Pembayaran *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: "1px solid #38383A"
                  }}
                  required
                >
                  <option value="draft">Draf</option>
                  <option value="calculated">Dihitung</option>
                  <option value="filed">Dilaporkan</option>
                  <option value="paid">Dibayar</option>
                  <option value="overdue">Terlambat</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>
                  Jatuh Tempo
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: "1px solid #38383A"
                  }}
                />
              </div>

              {/* Tax Rate */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>
                  Tarif Pajak (%)
                </label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => handleChange('taxRate', e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: "1px solid #38383A"
                  }}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>
                Deskripsi *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                style={{
                  backgroundColor: "#1C1C1E",
                  color: "#FFFFFF",
                  border: errors.description ? "1px solid #FF453A" : "1px solid #38383A"
                }}
                placeholder="Masukkan deskripsi atau catatan pajak"
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm" style={{ color: "#FF453A" }}>{errors.description}</p>
              )}
            </div>

            {/* Reference */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>
                Nomor Referensi
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => handleChange('reference', e.target.value)}
                className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                style={{
                  backgroundColor: "#1C1C1E",
                  color: "#FFFFFF",
                  border: "1px solid #38383A"
                }}
                placeholder="Nomor SPT, NTPN, atau referensi lain"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4" style={{ borderTop: "1px solid #38383A" }}>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-lg transition-colors duration-150"
                style={{ backgroundColor: "rgba(152, 152, 157, 0.15)", border: "1px solid #38383A", color: "#98989D" }}
                disabled={isSubmitting}
              >
                Batalkan
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg transition-colors duration-150 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)", color: "#FFFFFF" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Buat Entri Pajak</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tax Records Table */}
      <div className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full" style={{ borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#1C1C1E" }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>
                  Referensi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>
                  Jenis Pajak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>
                  Periode
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>
                  Nilai
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>
                  Jatuh Tempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "#2C2C2E" }}>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderBottomColor: "#0A84FF" }}></div>
                  <p className="mt-2" style={{ color: "#98989D" }}>Memuat catatan pajak...</p>
                  </td>
                </tr>
              ) : taxRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Calculator className="w-12 h-12 mx-auto mb-3" style={{ color: "#636366" }} />
                    <h3 className="text-lg font-medium mb-2" style={{ color: "#FFFFFF" }}>Belum Ada Catatan Pajak</h3>
                    <p className="mb-4" style={{ color: "#98989D" }}>Belum ada entri pajak yang dicatat.</p>
                    <button 
                      onClick={onToggleForm}
                      className="px-4 py-2 rounded-lg transition-colors duration-150 flex items-center space-x-2 mx-auto"
                      style={{ background: "linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)", color: "#FFFFFF" }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Entri Pajak Pertama</span>
                    </button>
                  </td>
                </tr>
              ) : (
                taxRecords.map((tax) => (
                  <tr key={tax.id} style={{ borderBottom: "1px solid #38383A" }} className="transition-colors duration-150 hover:bg-opacity-50" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: "#FFFFFF" }}>
                      {tax.reference || tax.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: "#FFFFFF" }}>
                      {getTaxTypeLabel(tax.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: "#98989D" }}>
                      {tax.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold" style={{ color: "#FFFFFF" }}>
                      {formatCurrency(tax.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(tax.status)}`}>
                        {getStatusLabel(tax.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tax.dueDate ? new Date(tax.dueDate).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => onDelete(tax)}
                        className="px-3 py-1.5 rounded-lg transition-colors duration-150 hover:bg-opacity-25"
                        style={{ 
                          backgroundColor: 'rgba(255, 69, 58, 0.15)', 
                          border: '1px solid #FF453A', 
                          color: '#FF453A' 
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation - Inline */}
      {showDeleteModal && selectedTax && (
        <div className="mt-6 rounded-lg p-6 shadow-lg border-l-4 animate-fadeIn" 
             style={{ 
               backgroundColor: "#2C2C2E", 
               border: "1px solid #FF453A",
               borderLeftColor: "#FF453A",
               borderLeftWidth: "4px"
             }}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: "rgba(255, 69, 58, 0.15)" }}>
                <svg className="w-6 h-6" style={{ color: "#FF453A" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2" style={{ color: "#FFFFFF" }}>
                Konfirmasi Hapus Catatan Pajak
              </h3>
              <p className="mb-4" style={{ color: "#98989D" }}>
                Anda yakin ingin menghapus catatan pajak ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A" }}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#98989D" }}>Jenis Pajak</p>
                    <p className="font-semibold" style={{ color: "#FFFFFF" }}>
                      {getTaxTypeLabel(selectedTax.type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#98989D" }}>Nilai</p>
                    <p className="font-semibold" style={{ color: "#FFFFFF" }}>
                      {formatCurrency(selectedTax.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#98989D" }}>Periode</p>
                    <p className="font-semibold" style={{ color: "#FFFFFF" }}>
                      {selectedTax.period}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#98989D" }}>Referensi</p>
                    <p className="font-semibold" style={{ color: "#FFFFFF" }}>
                      {selectedTax.reference || selectedTax.id}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={onCancelDelete}
                  className="px-4 py-2 rounded-lg transition-colors duration-150 hover:bg-opacity-20"
                  style={{ backgroundColor: "rgba(152, 152, 157, 0.15)", border: "1px solid #38383A", color: "#98989D" }}
                >
                  Batalkan
                </button>
                <button
                  onClick={onConfirmDelete}
                  className="px-4 py-2 rounded-lg transition-colors duration-150 hover:bg-opacity-25 flex items-center space-x-2"
                  style={{ backgroundColor: "rgba(255, 69, 58, 0.15)", border: "1px solid #FF453A", color: "#FF453A" }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Hapus Catatan Pajak</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxManagement;
