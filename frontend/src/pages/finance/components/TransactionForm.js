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
  isSubmitting = false,
  isEdit = false
}) => {
  const [errors, setErrors] = React.useState({});

  /**
   * Handle form submission with validation
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateTransactionForm(formData);
    
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

  return (
    <div className="rounded-xl shadow-lg" style={{
      backgroundColor: '#2C2C2E',
      border: '1px solid #38383A'
    }}>
      <div className="p-6" style={{ borderBottom: '1px solid #38383A' }}>
        <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>
          {isEdit ? 'Edit Transaction' : 'Create New Transaction'}
        </h3>
        <p className="text-sm mt-1" style={{ color: '#98989D' }}>
          {isEdit ? 'Update transaction details' : 'Add a new financial transaction to your records'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Transaction Type *
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
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="transfer">Transfer</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm" style={{ color: '#FF453A' }}>{errors.type}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Category *
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
              <option value="">Select Category</option>
              <option value="Materials">Materials</option>
              <option value="Labor">Labor</option>
              <option value="Equipment">Equipment</option>
              <option value="Subcontractor">Subcontractor</option>
              <option value="Transportation">Transportation</option>
              <option value="Administrative">Administrative</option>
              <option value="Project Revenue">Project Revenue</option>
              <option value="Other Income">Other Income</option>
              <option value="Other Expense">Other Expense</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm" style={{ color: '#FF453A' }}>{errors.category}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Amount (IDR) *
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
              Transaction Date *
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
              Project
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
                {loadingProjects ? 'Loading Projects...' : 'No Project'}
              </option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Payment Method *
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                backgroundColor: '#1C1C1E',
                color: '#FFFFFF',
                border: errors.paymentMethod ? '1px solid #FF453A' : '1px solid #38383A'
              }}
              required
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="e_wallet">E-Wallet</option>
            </select>
            {errors.paymentMethod && (
              <p className="mt-1 text-sm" style={{ color: '#FF453A' }}>{errors.paymentMethod}</p>
            )}
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Reference Number
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
              placeholder="INV-001, REF-123, etc."
            />
            {errors.referenceNumber && (
              <p className="mt-1 text-sm" style={{ color: '#FF453A' }}>{errors.referenceNumber}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
            Description *
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
            placeholder="Enter transaction description"
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
            Additional Notes
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
            placeholder="Any additional notes or comments"
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
            Cancel
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
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEdit ? 'Update Transaction' : 'Create Transaction'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
