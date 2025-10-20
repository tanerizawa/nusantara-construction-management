import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Wand2, 
  Edit3, 
  Sparkles, 
  Info, 
  AlertCircle,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { ACCOUNT_FORM_FIELDS, ACCOUNT_FORM_CHECKBOXES } from '../config/accountFormConfig';
import { getEligibleParentAccounts } from '../utils/accountHelpers';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';
import { fetchSubsidiaries } from '../services/subsidiaryService';
import {
  generateAccountCode,
  getAvailableParents,
  smartCreateAccount
} from '../services/accountService';

const { colors, modal } = CHART_OF_ACCOUNTS_CONFIG;

/**
 * AddAccountModal - Enhanced with Semi-Automatic Features
 * Supports both Manual and Wizard/Smart modes
 */
const AddAccountModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  errors, 
  isSubmitting, 
  accounts,
  onFormChange, 
  onSubmit 
}) => {
  // Mode: 'manual' or 'smart'
  const [mode, setMode] = useState('smart');
  
  // Subsidiaries
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loadingSubsidiaries, setLoadingSubsidiaries] = useState(false);
  const [inheritedSubsidiary, setInheritedSubsidiary] = useState(null);

  // Smart mode states
  const [availableParents, setAvailableParents] = useState([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [codePreview, setCodePreview] = useState(null);
  const [loadingCodePreview, setLoadingCodePreview] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadSubsidiaries();
    }
  }, [isOpen]);

  const loadSubsidiaries = async () => {
    setLoadingSubsidiaries(true);
    const result = await fetchSubsidiaries(true);
    if (result.success) {
      setSubsidiaries(result.data);
    }
    setLoadingSubsidiaries(false);
  };

  // Load available parents when account type and level change (Smart Mode)
  useEffect(() => {
    if (mode === 'smart' && formData.accountType && formData.level > 1) {
      loadAvailableParents();
    }
  }, [mode, formData.accountType, formData.level]);

  // Generate code preview when parent is selected (Smart Mode)
  useEffect(() => {
    if (mode === 'smart' && formData.accountType && formData.level) {
      generateCodePreview();
    }
  }, [mode, formData.accountType, formData.parentAccountId, formData.level]);

  const loadAvailableParents = async () => {
    setLoadingParents(true);
    try {
      const result = await getAvailableParents(
        formData.accountType,
        parseInt(formData.level)
      );
      
      if (result.success) {
        setAvailableParents(result.data);
      }
    } catch (err) {
      console.error('Error loading parents:', err);
    } finally {
      setLoadingParents(false);
    }
  };

  const generateCodePreview = async () => {
    // Only generate if we have necessary data
    if (!formData.accountType || !formData.level) return;
    
    // For level 1, no parent needed
    // For level > 1, parent is required
    if (formData.level > 1 && !formData.parentAccountId) {
      setCodePreview(null);
      return;
    }

    setLoadingCodePreview(true);
    try {
      const result = await generateAccountCode({
        accountType: formData.accountType,
        parentId: formData.parentAccountId,
        level: parseInt(formData.level)
      });
      
      if (result.success) {
        setCodePreview(result.data);
        setSmartSuggestions(result.data.suggestedProperties);
        
        // Auto-fill account code in form
        onFormChange({
          target: {
            name: 'accountCode',
            value: result.data.suggestedCode
          }
        });
        
        // Auto-fill suggested properties
        if (result.data.suggestedProperties) {
          const props = result.data.suggestedProperties;
          
          // Update multiple fields
          Object.entries(props).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              onFormChange({
                target: {
                  name: key,
                  value: value
                }
              });
            }
          });
        }
      }
    } catch (err) {
      console.error('Error generating code:', err);
    } finally {
      setLoadingCodePreview(false);
    }
  };

  // Subsidiary Inheritance
  useEffect(() => {
    if (formData.parentAccountId && accounts.length > 0) {
      const parentAccount = accounts.find(acc => acc.id === formData.parentAccountId);
      
      if (parentAccount?.subsidiaryId) {
        if (!formData.subsidiaryId || formData.subsidiaryId === '') {
          const subsidiary = subsidiaries.find(s => s.id === parentAccount.subsidiaryId);
          
          onFormChange({
            target: {
              name: 'subsidiaryId',
              value: parentAccount.subsidiaryId
            }
          });
          
          setInheritedSubsidiary(subsidiary);
        }
      } else {
        setInheritedSubsidiary(null);
      }
    } else {
      setInheritedSubsidiary(null);
    }
  }, [formData.parentAccountId, accounts, subsidiaries]);

  if (!isOpen) return null;

  const eligibleParents = mode === 'manual' 
    ? getEligibleParentAccounts(accounts)
    : availableParents;

  const handleSubsidiaryChange = (e) => {
    setInheritedSubsidiary(null);
    onFormChange(e);
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    // Reset some fields when switching modes
    if (newMode === 'smart') {
      // Clear account code for auto-generation
      onFormChange({
        target: {
          name: 'accountCode',
          value: ''
        }
      });
    }
  };

  const renderModeSelector = () => (
    <div className="mb-6 flex gap-2">
      <button
        type="button"
        onClick={() => handleModeSwitch('smart')}
        className="flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
        style={{
          backgroundColor: mode === 'smart' ? 'rgba(10, 132, 255, 0.2)' : 'rgba(60, 60, 67, 0.3)',
          border: mode === 'smart' ? '2px solid #0A84FF' : '2px solid transparent',
          color: mode === 'smart' ? '#0A84FF' : colors.textSecondary
        }}
      >
        <Wand2 className="w-5 h-5" />
        <span className="font-medium">Smart Mode</span>
        {mode === 'smart' && <CheckCircle className="w-4 h-4" />}
      </button>
      
      <button
        type="button"
        onClick={() => handleModeSwitch('manual')}
        className="flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
        style={{
          backgroundColor: mode === 'manual' ? 'rgba(10, 132, 255, 0.2)' : 'rgba(60, 60, 67, 0.3)',
          border: mode === 'manual' ? '2px solid #0A84FF' : '2px solid transparent',
          color: mode === 'manual' ? '#0A84FF' : colors.textSecondary
        }}
      >
        <Edit3 className="w-5 h-5" />
        <span className="font-medium">Manual Mode</span>
        {mode === 'manual' && <CheckCircle className="w-4 h-4" />}
      </button>
    </div>
  );

  const renderCodePreview = () => {
    if (mode !== 'smart' || !codePreview) return null;

    return (
      <div 
        className="mb-4 p-4 rounded-lg border-2"
        style={{ 
          backgroundColor: 'rgba(10, 132, 255, 0.1)',
          borderColor: '#0A84FF'
        }}
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 mt-0.5" style={{ color: '#0A84FF' }} />
          <div className="flex-1">
            <p className="text-sm font-medium mb-1" style={{ color: '#0A84FF' }}>
              Kode Otomatis Ter-generate
            </p>
            <p className="text-2xl font-mono font-bold mb-2" style={{ color: '#0A84FF' }}>
              {codePreview.suggestedCode}
            </p>
            {smartSuggestions && (
              <div className="space-y-1 text-xs" style={{ color: colors.textSecondary }}>
                <p>Pattern: <span className="font-mono">{codePreview.codePattern}</span></p>
                <p>Normal Balance: <span className="font-semibold">{smartSuggestions.normalBalance}</span></p>
                {smartSuggestions.accountSubType && (
                  <p>Sub Type: <span className="font-semibold">{smartSuggestions.accountSubType}</span></p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSmartModeInfo = () => {
    if (mode !== 'smart') return null;

    return (
      <div 
        className="mb-4 p-3 rounded-lg flex items-start gap-2"
        style={{ 
          backgroundColor: 'rgba(48, 209, 88, 0.1)',
          border: '1px solid rgba(48, 209, 88, 0.3)'
        }}
      >
        <Info className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#30D158' }} />
        <div className="text-sm" style={{ color: '#30D158' }}>
          <p className="font-medium mb-1">Mode Otomatis Aktif</p>
          <p className="opacity-90">
            Kode akun akan di-generate otomatis sesuai PSAK. Properties seperti Normal Balance, 
            Sub Type, dan flags akan ter-isi secara cerdas berdasarkan jenis dan level akun.
          </p>
        </div>
      </div>
    );
  };

  const renderFormField = (field) => {
    // Skip account_code field in smart mode (auto-generated)
    if (mode === 'smart' && field.name === 'accountCode') {
      return null;
    }

    // For smart mode, use available parents from API
    const shouldUseSmartParents = mode === 'smart' && field.name === 'parentAccountId';

    const commonStyles = {
      backgroundColor: colors.backgroundSecondary,
      color: colors.text,
      border: `1px solid ${colors.border}`
    };

    const errorStyles = errors[field.name] ? {
      borderColor: colors.error
    } : {};

    // Auto-filled fields in smart mode (read-only or disabled)
    const isAutoFilled = mode === 'smart' && smartSuggestions && [
      'normalBalance', 
      'accountSubType'
    ].includes(field.name);

    const autoFilledStyles = isAutoFilled ? {
      backgroundColor: 'rgba(10, 132, 255, 0.1)',
      borderColor: '#0A84FF',
      cursor: 'not-allowed'
    } : {};

    switch (field.type) {
      case 'select':
        return (
          <div className="relative">
            <select
              key={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={field.name === 'subsidiaryId' ? handleSubsidiaryChange : onFormChange}
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
              style={{ ...commonStyles, ...errorStyles, ...autoFilledStyles }}
              required={field.required}
              disabled={
                field.name === 'subsidiaryId' && loadingSubsidiaries ||
                shouldUseSmartParents && loadingParents ||
                isAutoFilled
              }
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
            {isAutoFilled && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Sparkles className="w-4 h-4" style={{ color: '#0A84FF' }} />
                <span className="text-xs" style={{ color: '#0A84FF' }}>Auto</span>
              </div>
            )}
          </div>
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
          <div className="relative">
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={onFormChange}
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
              style={{ ...commonStyles, ...errorStyles, ...autoFilledStyles }}
              placeholder={field.placeholder}
              required={field.required}
              disabled={isAutoFilled}
            />
            {isAutoFilled && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Sparkles className="w-4 h-4" style={{ color: '#0A84FF' }} />
                <span className="text-xs" style={{ color: '#0A84FF' }}>Auto</span>
              </div>
            )}
          </div>
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold" style={{ color: colors.text }}>
              Tambah Akun Baru
            </h3>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              Pilih mode pembuatan akun sesuai kebutuhan
            </p>
          </div>
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

        {/* Mode Selector */}
        {renderModeSelector()}

        {/* Smart Mode Info */}
        {renderSmartModeInfo()}

        {/* Code Preview */}
        {renderCodePreview()}

        <form onSubmit={onSubmit} className="space-y-4">
          {ACCOUNT_FORM_FIELDS.map(field => {
            const renderedField = renderFormField(field);
            if (!renderedField) return null;

            return (
              <div key={field.name}>
                <label 
                  className="block text-sm font-medium mb-1" 
                  style={{ color: colors.textSecondary }}
                >
                  {field.label} {field.required && '*'}
                </label>
                {renderedField}
                
                {/* Subsidiary Inheritance Message */}
                {field.name === 'subsidiaryId' && inheritedSubsidiary && (
                  <div 
                    className="text-xs mt-2 px-2 py-1.5 rounded flex items-center gap-1.5" 
                    style={{ 
                      backgroundColor: "rgba(48, 209, 88, 0.1)", 
                      color: "#30D158",
                      border: "1px solid rgba(48, 209, 88, 0.2)"
                    }}
                  >
                    <Info className="w-4 h-4" />
                    <span>
                      Inherited from parent: <strong>{inheritedSubsidiary.code}</strong> (dapat diubah)
                    </span>
                  </div>
                )}
                
                {field.description && (
                  <p className="text-xs mt-1" style={{ color: colors.textTertiary }}>
                    {field.description}
                  </p>
                )}
                {errors[field.name] && (
                  <p className="text-sm mt-1 flex items-center gap-1" style={{ color: colors.error }}>
                    <AlertCircle className="w-4 h-4" />
                    {errors[field.name]}
                  </p>
                )}
              </div>
            );
          })}

          {/* Checkboxes */}
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium block mb-2" style={{ color: colors.textSecondary }}>
              Additional Settings
            </label>
            {ACCOUNT_FORM_CHECKBOXES.map(checkbox => (
              <label key={checkbox.name} className="flex items-center">
                <input
                  type="checkbox"
                  name={checkbox.name}
                  checked={formData[checkbox.name]}
                  onChange={onFormChange}
                  className="mr-2"
                  style={{ accentColor: colors.primary }}
                />
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  {checkbox.label}
                </span>
              </label>
            ))}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div 
              className="rounded-lg p-3 flex items-start gap-2" 
              style={{ 
                backgroundColor: "rgba(255, 69, 58, 0.1)", 
                border: `1px solid ${colors.error}` 
              }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: colors.error }} />
              <p className="text-sm" style={{ color: colors.error }}>
                {errors.submit}
              </p>
            </div>
          )}

          {/* Action Buttons */}
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
              disabled={isSubmitting || loadingCodePreview}
              className="flex-1 px-4 py-2 rounded-md transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, #0066CC 100%)`,
                color: colors.text
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  {mode === 'smart' && <Sparkles className="w-4 h-4" />}
                  <span>Tambah Akun</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>, 
    document.body
  );
};

export default AddAccountModal;
