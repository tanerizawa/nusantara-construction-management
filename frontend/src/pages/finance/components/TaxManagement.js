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
  isSubmitting = false
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
      paid: 'Paid',
      filed: 'Filed',
      calculated: 'Calculated',
      draft: 'Draft',
      overdue: 'Overdue'
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold" style={{ color: "#FFFFFF" }}>Tax Management Dashboard</h2>
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
          <span>{showForm ? 'Cancel' : 'New Tax Filing'}</span>
        </button>
      </div>

      {/* Tax Filing Form */}
      {showForm && (
        <div className="rounded-lg shadow-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="p-6" style={{ borderBottom: "1px solid #38383A" }}>
            <h3 className="text-lg font-medium" style={{ color: "#FFFFFF" }}>Create New Tax Filing</h3>
            <p className="text-sm mt-1" style={{ color: "#98989D" }}>Add a new tax obligation record</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tax Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className={`w-full border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                >
                  <option value="pajak_penghasilan">PPh (Pajak Penghasilan)</option>
                  <option value="ppn">PPN (Pajak Pertambahan Nilai)</option>
                  <option value="pph21">PPh 21 (Pajak Gaji)</option>
                  <option value="pph23">PPh 23 (Pajak Jasa)</option>
                  <option value="pph4_ayat2">PPh Final (Pasal 4 Ayat 2)</option>
                  <option value="other">Other Tax</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Amount (IDR) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  className={`w-full border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              {/* Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Period (Month-Year) *
                </label>
                <input
                  type="month"
                  value={formData.period}
                  onChange={(e) => handleChange('period', e.target.value)}
                  className={`w-full border ${errors.period ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                />
                {errors.period && (
                  <p className="mt-1 text-sm text-red-600">{errors.period}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="calculated">Calculated</option>
                  <option value="filed">Filed</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Tax Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => handleChange('taxRate', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter tax description or notes"
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Reference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Number
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => handleChange('reference', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SPT number, NTPN, or other reference"
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
                Cancel
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Create Tax Filing</span>
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
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>
                  Tax Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>
                  Period
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "#2C2C2E" }}>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderBottomColor: "#0A84FF" }}></div>
                    <p className="mt-2" style={{ color: "#98989D" }}>Loading tax records...</p>
                  </td>
                </tr>
              ) : taxRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Calculator className="w-12 h-12 mx-auto mb-3" style={{ color: "#636366" }} />
                    <h3 className="text-lg font-medium mb-2" style={{ color: "#FFFFFF" }}>No Tax Records Found</h3>
                    <p className="mb-4" style={{ color: "#98989D" }}>No tax filings have been recorded yet.</p>
                    <button 
                      onClick={onToggleForm}
                      className="px-4 py-2 rounded-lg transition-colors duration-150 flex items-center space-x-2 mx-auto"
                      style={{ background: "linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)", color: "#FFFFFF" }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Tax Filing</span>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaxManagement;
