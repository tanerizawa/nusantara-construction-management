import React from 'react';
import { X, Save } from 'lucide-react';
import { ACCOUNT_FORM_FIELDS, ACCOUNT_FORM_CHECKBOXES } from '../config/accountFormConfig';
import { getEligibleParentAccounts } from '../utils/accountHelpers';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { colors } = CHART_OF_ACCOUNTS_CONFIG;

const InlineEditForm = ({ 
  account,
  formData, 
  errors, 
  isSubmitting, 
  allAccounts,
  subsidiaries,
  onFormChange, 
  onSubmit,
  onCancel
}) => {
  if (!account) return null;

  const eligibleParents = getEligibleParentAccounts(allAccounts || []);

  const renderField = (field) => {
    const commonStyles = {
      backgroundColor: 'rgba(30, 30, 30, 0.6)',
      color: 'rgba(255, 255, 255, 0.95)',
      border: `1px solid rgba(245, 158, 11, 0.3)`,
      fontSize: '0.875rem',
      padding: '0.625rem',
      borderRadius: '0.5rem'
    };

    const errorStyles = errors[field.name] ? {
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)'
    } : {};

    if (field.type === 'select') {
      return (
        <select
          name={field.name}
          value={formData[field.name]}
          onChange={onFormChange}
          className="w-full rounded-md focus:outline-none focus:ring-2"
          style={{ ...commonStyles, ...errorStyles }}
          required={field.required}
        >
          {(field.name === 'parentAccountId' || field.name === 'subsidiaryId') && (
            <option value="">{field.placeholder}</option>
          )}
          {field.name === 'parentAccountId' ? 
            eligibleParents.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.accountCode} - {acc.accountName}
              </option>
            )) : 
          field.name === 'subsidiaryId' ?
            subsidiaries?.map(sub => (
              <option key={sub.id} value={sub.id}>
                {sub.code} - {sub.name}
              </option>
            )) :
            field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          }
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          name={field.name}
          value={formData[field.name]}
          onChange={onFormChange}
          className="w-full rounded-md focus:outline-none focus:ring-2"
          style={{ ...commonStyles, ...errorStyles }}
          rows={2}
          placeholder={field.placeholder}
          required={field.required}
        />
      );
    }

    return (
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name]}
        onChange={onFormChange}
        className="w-full rounded-md focus:outline-none focus:ring-2"
        style={{ ...commonStyles, ...errorStyles }}
        placeholder={field.placeholder}
        required={field.required}
      />
    );
  };

  return (
    <div 
      className="border-l-4 ml-12 my-2 p-4 rounded-r-lg animate-slideDown shadow-lg"
      style={{
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        borderLeftColor: '#F59E0B',
        border: `1px solid rgba(245, 158, 11, 0.3)`,
        borderLeft: `4px solid #F59E0B`
      }}
    >
      <form onSubmit={onSubmit}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
              Edit Account
            </h4>
            <p className="text-sm mt-1 font-mono" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {account.accountCode} - {account.accountName}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
            disabled={isSubmitting}
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Fields - 2 columns */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {ACCOUNT_FORM_FIELDS.map(field => (
            <div key={field.name} className={field.type === 'textarea' ? 'col-span-2' : ''}>
              <label 
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" 
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                {field.label} {field.required && <span style={{ color: '#EF4444' }}>*</span>}
              </label>
              {renderField(field)}
              {errors[field.name] && (
                <p className="text-xs mt-1 font-medium" style={{ color: '#EF4444' }}>
                  ⚠️ {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
          {ACCOUNT_FORM_CHECKBOXES.map(checkbox => (
            <label key={checkbox.name} className="flex items-center text-sm cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
              <input
                type="checkbox"
                name={checkbox.name}
                checked={formData[checkbox.name]}
                onChange={onFormChange}
                className="mr-2 w-4 h-4 cursor-pointer"
                style={{ accentColor: '#F59E0B' }}
              />
              <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {checkbox.label}
              </span>
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all disabled:opacity-50 hover:shadow-lg font-medium"
            style={{
              background: isSubmitting ? 'rgba(16, 185, 129, 0.5)' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              fontSize: '0.875rem',
              boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
            }}
          >
            <Save size={18} />
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg transition-all disabled:opacity-50 hover:bg-white/10 font-medium"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: `1px solid rgba(255, 255, 255, 0.2)`,
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.875rem'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InlineEditForm;
