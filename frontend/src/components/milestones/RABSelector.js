import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';

/**
 * RABSelector Component
 * 
 * PURPOSE: Links milestone to COMPLETE project RAB (NOT per-category!)
 * 
 * BUSINESS LOGIC:
 * - Shows total RAB budget (e.g., 1 Billion) instead of per-category
 * - Milestone budget = % of total RAB
 * - Enables accurate budget tracking and variance analysis
 * 
 * BEFORE (WRONG):
 * - Selected category: "Struktur" (Rp 500M)
 * - Milestone budget: Could be 10B (inconsistent!)
 * 
 * AFTER (CORRECT):
 * - Total RAB: Rp 1,000,000,000 (1B)
 * - Milestone budget: 50% = Rp 500M (consistent!)
 */
const RABSelector = ({ projectId, value, onChange }) => {
  const [rabSummary, setRabSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLinked, setIsLinked] = useState(value || false);
  const [selectedCategory, setSelectedCategory] = useState(value?.categoryName || value?.category_name || null);

  useEffect(() => {
    if (projectId) {
      fetchRABSummary();
    }
  }, [projectId]);

  const fetchRABSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[RABSelector] Fetching RAB summary for project:', projectId);
      
      const response = await api.get(`/projects/${projectId}/milestones/rab-summary`);
      
      console.log('[RABSelector] Response:', response);
      
      if (response?.success && response?.data) {
        setRabSummary(response.data);
        console.log('[RABSelector] RAB Summary loaded:', response.data);
      } else {
        setError('No RAB found for this project');
        console.warn('[RABSelector] No RAB data:', response);
      }
    } catch (err) {
      console.error('[RABSelector] Error fetching RAB summary:', err);
      setError(err.response?.data?.error || 'Failed to load RAB');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLink = () => {
    const newValue = !isLinked;
    
    if (newValue && !selectedCategory) {
      alert('Silakan pilih kategori RAB terlebih dahulu!');
      return;
    }
    
    setIsLinked(newValue);
    
    if (onChange) {
      if (newValue) {
        // When linking, must have selected category
        const categoryToUse = selectedCategory;
        
        if (!categoryToUse) {
          alert('Tidak ada kategori RAB yang dipilih. Silakan pilih kategori terlebih dahulu.');
          return;
        }
        
        onChange({
          enabled: true,
          categoryName: categoryToUse, // ✅ REQUIRED: Backend needs this to filter RAB items
          category_name: categoryToUse, // Support both naming conventions
          totalValue: rabSummary.totalValue,
          totalItems: rabSummary.totalItems,
          approvedDate: rabSummary.approvedDate,
          linkedAt: new Date().toISOString(),
          categories: rabSummary.categories // Pass full categories for reference
        });
      } else {
        // When unlinking
        onChange(null);
        setSelectedCategory(null);
      }
    }
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    
    // Update the rab_link with new category if already linked
    if (isLinked && onChange) {
      onChange({
        enabled: true,
        categoryName: newCategory,
        category_name: newCategory,
        totalValue: rabSummary.totalValue,
        totalItems: rabSummary.totalItems,
        approvedDate: rabSummary.approvedDate,
        linkedAt: new Date().toISOString(),
        categories: rabSummary.categories
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          Link ke RAB Proyek (Opsional)
        </label>
        <div className="p-4 bg-[#2C2C2E] border border-[#38383A] rounded-lg">
          <div className="flex items-center gap-2 text-[#8E8E93]">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm">Loading RAB summary...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !rabSummary || !rabSummary.hasRAB) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          Link ke RAB Proyek (Opsional)
        </label>
        <div className="p-4 bg-[#2C2C2E] border border-[#38383A] rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#FF9F0A] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#8E8E93]">
                {error || 'No approved RAB found for this project'}
              </p>
              <p className="text-xs text-[#8E8E93] mt-1">
                RAB harus di-approve terlebih dahulu sebelum dapat dilink ke milestone
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success State - Show RAB Summary
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        Link ke RAB Proyek (Opsional)
      </label>

      <div className={`p-4 rounded-lg border transition-all ${
        isLinked 
          ? 'bg-[#0A84FF]/10 border-[#0A84FF]' 
          : 'bg-[#2C2C2E] border-[#38383A] hover:border-[#48484A]'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              isLinked ? 'bg-[#0A84FF]/20' : 'bg-[#38383A]'
            }`}>
              <Package className={`h-5 w-5 ${isLinked ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-white">RAB Proyek Keseluruhan</h4>
                {isLinked && (
                  <CheckCircle className="h-4 w-4 text-[#30D158] flex-shrink-0" />
                )}
              </div>

              {/* Total Budget */}
              <div className="space-y-1">
                <p className="text-base font-medium text-white">
                  Total Budget: {formatCurrency(rabSummary.totalValue)}
                </p>
                <p className="text-sm text-[#8E8E93]">
                  {rabSummary.totalItems} items • Approved: {formatDate(rabSummary.approvedDate)}
                </p>
              </div>

              {/* Category Selection Dropdown - REQUIRED */}
              {rabSummary.categories && rabSummary.categories.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#38383A]">
                  <label className="block text-xs font-medium text-white mb-2">
                    Pilih Kategori RAB untuk Milestone Ini: <span className="text-[#FF453A]">*</span>
                  </label>
                  <select
                    value={selectedCategory || ''}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                    required
                  >
                    <option value="" disabled>
                      -- Pilih kategori yang akan di-track --
                    </option>
                    {rabSummary.categories.map((cat, idx) => (
                      <option key={idx} value={cat.category}>
                        {cat.category} - {formatCurrency(cat.totalValue)} ({cat.percentage}%)
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-[#8E8E93] mt-1">
                    💡 Milestone ini akan track item RAB dari kategori yang dipilih
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleToggleLink}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
              isLinked
                ? 'bg-[#FF453A] text-white hover:bg-[#FF453A]/90'
                : 'bg-[#0A84FF] text-white hover:bg-[#0A84FF]/90'
            }`}
          >
            {isLinked ? 'Unlink' : 'Link to RAB'}
          </button>
        </div>
        
        {/* Linked Info */}
        {isLinked && (
          <div className="mt-3 pt-3 border-t border-[#0A84FF]/30">
            <p className="text-xs text-[#30D158] flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Milestone ini akan track budget terhadap RAB keseluruhan
            </p>
          </div>
        )}
      </div>

      {/* Help Text */}
      {!isLinked && (
        <p className="text-xs text-[#8E8E93]">
          💡 Link milestone ke RAB untuk tracking budget dan progress yang akurat
        </p>
      )}
    </div>
  );
};

export default RABSelector;
