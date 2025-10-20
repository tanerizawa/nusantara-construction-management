import React, { useState, useEffect } from 'react';
import {
  Zap,
  Check,
  X,
  AlertCircle,
  Package,
  Loader,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  getAccountTemplates,
  createAccountsFromTemplate
} from '../services/accountService';

/**
 * Template Card Component
 */
const TemplateCard = ({ template, onApply, isApplying, isExpanded, onToggle }) => {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ backgroundColor: '#2C2C2E', borderColor: '#38383A' }}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Package className="w-5 h-5" style={{ color: '#0A84FF' }} />
              <h3 className="font-semibold" style={{ color: '#FFFFFF' }}>
                {template.name}
              </h3>
            </div>
            <p className="text-sm mb-2" style={{ color: '#98989D' }}>
              {template.description}
            </p>
            <div className="flex items-center space-x-4 text-xs">
              <span
                className="px-2 py-1 rounded"
                style={{ backgroundColor: '#0A84FF20', color: '#0A84FF' }}
              >
                {template.category}
              </span>
              <span style={{ color: '#98989D' }}>
                {template.accounts.length} akun
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <button
              onClick={() => onApply(template.id)}
              disabled={isApplying}
              className="px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1"
              style={{
                background: 'linear-gradient(135deg, #30D158 0%, #28A745 100%)',
                color: '#FFFFFF'
              }}
            >
              {isApplying ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Membuat...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Terapkan</span>
                </>
              )}
            </button>

            <button
              onClick={onToggle}
              className="px-3 py-1.5 rounded-lg text-sm flex items-center justify-center"
              style={{ backgroundColor: '#3A3A3C', color: '#FFFFFF' }}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Account List (Expandable) */}
      {isExpanded && (
        <div
          className="px-4 pb-4 border-t"
          style={{ borderColor: '#38383A' }}
        >
          <div className="space-y-2 mt-4">
            {template.accounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded text-sm"
                style={{ backgroundColor: '#1C1C1E' }}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="font-mono text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: '#0A84FF20', color: '#0A84FF' }}
                  >
                    {account.code}
                  </span>
                  <span style={{ color: '#FFFFFF' }}>{account.name}</span>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: account.normalBalance === 'DEBIT' ? '#30D15820' : '#FF9F0A20',
                    color: account.normalBalance === 'DEBIT' ? '#30D158' : '#FF9F0A'
                  }}
                >
                  {account.normalBalance}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * QuickTemplates Component
 * Display and apply account templates for quick setup
 */
const QuickTemplates = ({ onComplete, onCancel, subsidiaryId }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [applyingTemplate, setApplyingTemplate] = useState(null);
  const [expandedTemplates, setExpandedTemplates] = useState({});
  const [filter, setFilter] = useState('all'); // 'all', 'quick', or specific type

  /**
   * Load templates on mount
   */
  useEffect(() => {
    loadTemplates();
  }, [filter]);

  /**
   * Load templates from API
   */
  const loadTemplates = async () => {
    setLoading(true);
    setError(null);

    try {
      const quickStart = filter === 'quick';
      const type = filter !== 'all' && filter !== 'quick' ? filter : null;

      const result = await getAccountTemplates(type, quickStart);

      if (result.success) {
        setTemplates(result.data);
      } else {
        setError(result.error || 'Gagal memuat template');
      }
    } catch (err) {
      console.error('Error loading templates:', err);
      setError('Terjadi kesalahan saat memuat template');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply template (create accounts)
   */
  const handleApplyTemplate = async (templateId) => {
    setApplyingTemplate(templateId);
    setError(null);
    setSuccess(null);

    try {
      const result = await createAccountsFromTemplate(templateId, subsidiaryId);

      if (result.success) {
        const data = result.data;
        setSuccess(
          `Berhasil membuat ${data.created} akun${data.errors && data.errors.length > 0 ? `, ${data.errors.length} gagal (kode sudah ada)` : ''}`
        );

        // Auto close success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
          if (onComplete) {
            onComplete(data);
          }
        }, 3000);
      } else {
        setError(result.error || 'Gagal menerapkan template');
      }
    } catch (err) {
      console.error('Error applying template:', err);
      setError('Terjadi kesalahan saat menerapkan template');
    } finally {
      setApplyingTemplate(null);
    }
  };

  /**
   * Toggle template expansion
   */
  const toggleTemplate = (templateId) => {
    setExpandedTemplates({
      ...expandedTemplates,
      [templateId]: !expandedTemplates[templateId]
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div
        className="w-full max-w-5xl rounded-lg shadow-xl overflow-hidden flex flex-col"
        style={{ backgroundColor: '#1C1C1E', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: '#38383A' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: '#0A84FF20' }}
              >
                <Zap className="w-6 h-6" style={{ color: '#0A84FF' }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                  Template Akun Cepat
                </h2>
                <p className="text-sm" style={{ color: '#98989D' }}>
                  Buat beberapa akun sekaligus dengan template siap pakai
                </p>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#2C2C2E', color: '#FFFFFF' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{
                backgroundColor: filter === 'all' ? '#0A84FF' : '#2C2C2E',
                color: '#FFFFFF'
              }}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('quick')}
              className="px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1"
              style={{
                backgroundColor: filter === 'quick' ? '#0A84FF' : '#2C2C2E',
                color: '#FFFFFF'
              }}
            >
              <Zap className="w-4 h-4" />
              <span>Quick Start</span>
            </button>
            <button
              onClick={() => setFilter('ASSET')}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{
                backgroundColor: filter === 'ASSET' ? '#30D158' : '#2C2C2E',
                color: '#FFFFFF'
              }}
            >
              Aset
            </button>
            <button
              onClick={() => setFilter('EXPENSE')}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{
                backgroundColor: filter === 'EXPENSE' ? '#FF9F0A' : '#2C2C2E',
                color: '#FFFFFF'
              }}
            >
              Biaya
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div
            className="mx-6 mt-4 p-3 rounded-lg flex items-center space-x-2"
            style={{ backgroundColor: '#FF453A20', border: '1px solid #FF453A' }}
          >
            <AlertCircle className="w-5 h-5" style={{ color: '#FF453A' }} />
            <span className="text-sm" style={{ color: '#FF453A' }}>
              {error}
            </span>
          </div>
        )}

        {success && (
          <div
            className="mx-6 mt-4 p-3 rounded-lg flex items-center space-x-2"
            style={{ backgroundColor: '#30D15820', border: '1px solid #30D158' }}
          >
            <Check className="w-5 h-5" style={{ color: '#30D158' }} />
            <span className="text-sm" style={{ color: '#30D158' }}>
              {success}
            </span>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin" style={{ color: '#0A84FF' }} />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-3" style={{ color: '#98989D' }} />
              <p style={{ color: '#98989D' }}>Tidak ada template tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onApply={handleApplyTemplate}
                  isApplying={applyingTemplate === template.id}
                  isExpanded={expandedTemplates[template.id]}
                  onToggle={() => toggleTemplate(template.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-6 border-t"
          style={{ borderColor: '#38383A' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: '#98989D' }}>
              Template akan membuat akun dengan kode otomatis sesuai PSAK
            </p>
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: '#2C2C2E', color: '#FFFFFF' }}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickTemplates;
