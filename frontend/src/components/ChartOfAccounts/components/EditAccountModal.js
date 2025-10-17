import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ACCOUNT_FORM_FIELDS, ACCOUNT_FORM_CHECKBOXES } from '../config/accountFormConfig';
import { getEligibleParentAccounts } from '../utils/accountHelpers';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';
import { fetchSubsidiaries } from '../services/subsidiaryService';

const { colors, modal } = CHART_OF_ACCOUNTS_CONFIG;

const EditAccountModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  errors, 
  isSubmitting, 
  accounts,
  onFormChange, 
  onSubmit 
}) => {
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loadingSubsidiaries, setLoadingSubsidiaries] = useState(false);
  const [inheritedSubsidiary, setInheritedSubsidiary] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadSubsidiaries();
    }
  }, [isOpen]);

  const loadSubsidiaries = async () => {
    setLoadingSubsidiaries(true);
    const result = await fetchSubsidiaries(true); // Active only
    if (result.success) {
      setSubsidiaries(result.data);
    }
    setLoadingSubsidiaries(false);
  };

  // Phase 2D-A1: Subsidiary Inheritance
  // Auto-assign parent's subsidiary to child account
  useEffect(() => {
    if (formData.parentAccountId && accounts.length > 0) {
      const parentAccount = accounts.find(acc => acc.id === formData.parentAccountId);
      
      if (parentAccount?.subsidiaryId) {
        // Only auto-assign if user hasn't manually selected a subsidiary
        if (!formData.subsidiaryId || formData.subsidiaryId === '') {
          // Find subsidiary info for display
          const subsidiary = subsidiaries.find(s => s.id === parentAccount.subsidiaryId);
          
          // Auto-fill subsidiaryId from parent
          onFormChange({
            target: {
              name: 'subsidiaryId',
              value: parentAccount.subsidiaryId
            }
          });
          
          // Set inherited flag for UI feedback
          setInheritedSubsidiary(subsidiary);
        }
      } else {
        // Parent has no subsidiary, clear inherited flag
        setInheritedSubsidiary(null);
      }
    } else {
      // No parent selected, clear inherited flag
      setInheritedSubsidiary(null);
    }
  }, [formData.parentAccountId, accounts, subsidiaries]);

  if (!isOpen) return null;

  const eligibleParents = getEligibleParentAccounts(accounts);

  // Handler for subsidiary change - clear inherited flag when user manually changes
  const handleSubsidiaryChange = (e) => {
    setInheritedSubsidiary(null); // Clear inherited flag
    onFormChange(e); // Call parent handler
  };

  const renderFormField = (field) => {
    const commonStyles = {
      backgroundColor: colors.backgroundSecondary,
      color: colors.text,
      border: `1px solid ${colors.border}`
    };

    const errorStyles = errors[field.name] ? {
      borderColor: colors.error
    } : {};

    switch (field.type) {
      case 'select':
        return (
          <select
            key={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={field.name === 'subsidiaryId' ? handleSubsidiaryChange : onFormChange}
            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
            style={{ ...commonStyles, ...errorStyles }}
            required={field.required}
            disabled={field.name === 'subsidiaryId' && loadingSubsidiaries}
          >
            {(field.name === 'parentAccountId' || field.name === 'subsidiaryId') && (
              <option value="">{field.placeholder}</option>
            )}
            {field.name === 'parentAccountId' ? 
              eligibleParents.map(account => (
                <option key={account.id} value={account.id}>
                  {account.accountCode} - {account.accountName}
                </option>
              )) : 
            field.name === 'subsidiaryId' ?
              subsidiaries.map(subsidiary => (
                <option key={subsidiary.id} value={subsidiary.id}>
                  {subsidiary.code} - {subsidiary.name}
                </option>
              )) :
              field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            }
          </select>
        );

      case 'textarea':
        return (
          <textarea
            key={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={onFormChange}
            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
            style={{ ...commonStyles, ...errorStyles }}
            rows={field.rows || 3}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      default:
        return (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={onFormChange}
            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
            style={{ ...commonStyles, ...errorStyles }}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" 
      style={{
        zIndex: modal.zIndex,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="rounded-lg p-6 w-full shadow-2xl"
        style={{
          backgroundColor: colors.background,
          borderRadius: '8px',
          padding: '24px',
          width: '100%',
          maxWidth: modal.maxWidth,
          maxHeight: modal.maxHeight,
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: `1px solid ${colors.border}`
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
            Edit Account
          </h3>
          <button
            onClick={onClose}
            className="text-2xl leading-none hover:opacity-70 transition-opacity"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: colors.textSecondary
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {ACCOUNT_FORM_FIELDS.map(field => (
            <div key={field.name}>
              <label 
                className="block text-sm font-medium mb-1" 
                style={{ color: colors.textSecondary }}
              >
                {field.label} {field.required && '*'}
              </label>
              {renderFormField(field)}
              
              {/* Phase 2D-A1: Show inheritance message for subsidiaryId */}
              {field.name === 'subsidiaryId' && inheritedSubsidiary && (
                <div 
                  className="text-xs mt-2 px-2 py-1.5 rounded flex items-center gap-1.5" 
                  style={{ 
                    backgroundColor: "rgba(48, 209, 88, 0.1)", 
                    color: "#30D158",
                    border: "1px solid rgba(48, 209, 88, 0.2)"
                  }}
                >
                  <span style={{ fontSize: '14px' }}>ℹ️</span>
                  <span>
                    Inherited from parent: <strong>{inheritedSubsidiary.code}</strong> (can be changed)
                  </span>
                </div>
              )}
              
              {field.description && (
                <p className="text-xs mt-1" style={{ color: colors.textTertiary }}>
                  {field.description}
                </p>
              )}
              {errors[field.name] && (
                <p className="text-sm mt-1" style={{ color: colors.error }}>
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          <div className="space-y-2">
            {ACCOUNT_FORM_CHECKBOXES.map(checkbox => (
              <label key={checkbox.name} className="flex items-center">
                <input
                  type="checkbox"
                  name={checkbox.name}
                  checked={formData[checkbox.name]}
                  onChange={onFormChange}
                  className="mr-2"
                />
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  {checkbox.label}
                </span>
              </label>
            ))}
          </div>

          {errors.submit && (
            <div 
              className="rounded-lg p-3" 
              style={{ 
                backgroundColor: "rgba(255, 69, 58, 0.1)", 
                border: `1px solid ${colors.error}` 
              }}
            >
              <p className="text-sm" style={{ color: colors.error }}>
                {errors.submit}
              </p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-md transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: "rgba(152, 152, 157, 0.15)",
                border: `1px solid ${colors.border}`,
                color: colors.textSecondary
              }}
            >
              Batal
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-md transition-all duration-200 disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, #0066CC 100%)`,
                color: colors.text
              }}
            >
              {isSubmitting ? 'Updating...' : 'Update Account'}
            </button>
          </div>
        </form>
      </div>
    </div>, 
    document.body
  );
};

export default EditAccountModal;
