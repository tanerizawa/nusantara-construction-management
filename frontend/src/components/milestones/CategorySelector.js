import React, { useState, useEffect, useCallback } from 'react';
import { Package, CheckCircle, AlertCircle, X } from 'lucide-react';
import api from '../../services/api';

/**
 * CategorySelector Component
 * Allows selecting and linking a milestone to an approved RAB category
 */
const CategorySelector = ({ projectId, value, onChange, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(value || null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[CategorySelector] Fetching categories for project:', projectId);
      
      // api.get() returns response.data directly (not the full axios response)
      const data = await api.get(`/projects/${projectId}/milestones/rab-categories`);
      console.log('[CategorySelector] Received data:', data);
      console.log('[CategorySelector] Data.success:', data?.success);
      console.log('[CategorySelector] Data.data:', data?.data);

      // Check if response is successful
      if (data && data.success === true) {
        console.log('[CategorySelector] ✅ Categories loaded successfully:', data.data);
        setCategories(data.data || []);
      } 
      // Handle case where response is directly an array
      else if (Array.isArray(data)) {
        console.warn('[CategorySelector] ⚠️ Response is array, using directly:', data);
        setCategories(data);
      } 
      // Handle case where success is undefined but data exists
      else if (data && data.data && Array.isArray(data.data)) {
        console.warn('[CategorySelector] ⚠️ Using data.data array (success undefined):', data.data);
        setCategories(data.data);
      }
      // Error case
      else {
        console.error('[CategorySelector] ❌ API returned unexpected format:', data);
        setError(data?.message || data?.error || 'Failed to load categories');
        setCategories([]);
      }
    } catch (err) {
      console.error('[CategorySelector] ❌ Error fetching RAB categories:', err);
      setError('Failed to load RAB categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchCategories();
    }
  }, [projectId, fetchCategories]);

  useEffect(() => {
    setSelectedCategory(value);
  }, [value]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false);
    
    if (onChange) {
      onChange(category);
    }
    
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    if (onChange) {
      onChange(null);
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

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-white mb-2">
        Link ke Kategori RAB (Opsional)
      </label>

      {/* Selected Category Display */}
      {selectedCategory ? (
        <div className="bg-[#2C2C2E] border border-[#0A84FF] rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#0A84FF]/20 flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 text-[#0A84FF]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white">{selectedCategory.name}</h4>
                  <CheckCircle className="h-4 w-4 text-[#30D158]" />
                </div>
                <div className="text-sm text-[#8E8E93] space-y-1">
                  <p>{selectedCategory.itemCount} items • {formatCurrency(selectedCategory.totalValue)}</p>
                  {selectedCategory.lastUpdated && (
                    <p>Last updated: {new Date(selectedCategory.lastUpdated).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleClearSelection}
              className="p-1.5 text-[#8E8E93] hover:text-white hover:bg-[#3A3A3C] rounded-lg transition-colors"
              title="Remove link"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mt-3 pt-3 border-t border-[#38383A]">
            <p className="text-xs text-[#8E8E93]">
              ✓ Auto-sync dengan workflow RAB → PO → Tanda Terima → BA → Payment
            </p>
          </div>
        </div>
      ) : (
        /* Category Selector Button */
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-left text-white hover:border-[#0A84FF] transition-colors"
        >
          {loading ? (
            <span className="text-[#8E8E93]">Loading categories...</span>
          ) : error ? (
            <span className="text-[#FF453A]">{error}</span>
          ) : (
            <span className="text-[#8E8E93]">Select RAB category to link...</span>
          )}
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && !selectedCategory && (
        <div className="absolute z-10 mt-2 w-full bg-[#2C2C2E] border border-[#38383A] rounded-lg shadow-xl max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A84FF]"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <AlertCircle className="h-8 w-8 text-[#FF453A] mx-auto mb-2" />
              <p className="text-sm text-[#FF453A]">{error}</p>
              <button
                onClick={fetchCategories}
                className="mt-3 px-4 py-2 bg-[#0A84FF] text-white text-sm rounded-lg hover:bg-[#0A84FF]/90"
              >
                Retry
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-center">
              <Package className="h-8 w-8 text-[#8E8E93] mx-auto mb-2" />
              <p className="text-sm text-[#8E8E93]">No approved RAB categories available</p>
              <p className="text-xs text-[#8E8E93] mt-1">Create and approve RAB items first</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className="w-full px-4 py-3 text-left hover:bg-[#3A3A3C] rounded-lg transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0A84FF]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0A84FF]/20">
                      <Package className="h-4 w-4 text-[#0A84FF]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{category.name}</h4>
                      <div className="text-xs text-[#8E8E93] space-y-0.5">
                        <p>{category.itemCount} items • {formatCurrency(category.totalValue)}</p>
                        {category.lastUpdated && (
                          <p>Updated: {new Date(category.lastUpdated).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
