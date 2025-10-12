import React, { useState, useEffect } from 'react';
import { Lightbulb, Package, CheckCircle, X, Plus, Loader } from 'lucide-react';
import api from '../../services/api';

/**
 * MilestoneSuggestionModal Component
 * Shows auto-generated milestone suggestions from approved RAB categories
 */
const MilestoneSuggestionModal = ({ projectId, onClose, onCreateMilestones }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, [projectId]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/projects/${projectId}/milestones/suggest`);
      const data = response.data;

      if (data.success) {
        setSuggestions(data.data || []);
        // Auto-select all suggestions by default
        setSelectedIds(new Set(data.data.map((_, idx) => idx)));
      } else {
        setError(data.message || 'Failed to load suggestions');
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Failed to load milestone suggestions');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (index) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    setSelectedIds(new Set(suggestions.map((_, idx) => idx)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleCreate = async () => {
    if (selectedIds.size === 0) return;

    const selectedSuggestions = suggestions.filter((_, idx) => selectedIds.has(idx));

    try {
      setCreating(true);

      // Create milestones from suggestions
      if (onCreateMilestones) {
        await onCreateMilestones(selectedSuggestions);
      }

      onClose();
    } catch (err) {
      console.error('Error creating milestones:', err);
      setError('Failed to create milestones');
    } finally {
      setCreating(false);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#1C1C1E] rounded-lg max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#38383A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF9F0A]/20 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-[#FF9F0A]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Milestone Suggestions</h2>
              <p className="text-sm text-[#8E8E93]">Auto-generated from approved RAB categories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E] rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="h-12 w-12 text-[#0A84FF] animate-spin mb-4" />
              <p className="text-[#8E8E93]">Analyzing RAB data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#FF453A]/20 flex items-center justify-center mb-4">
                <X className="h-8 w-8 text-[#FF453A]" />
              </div>
              <p className="text-white mb-2">{error}</p>
              <button
                onClick={fetchSuggestions}
                className="px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90"
              >
                Try Again
              </button>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#636366]/20 flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-[#636366]" />
              </div>
              <p className="text-white mb-2">No suggestions available</p>
              <p className="text-sm text-[#8E8E93] text-center max-w-md">
                All RAB categories already have milestones or no approved RAB data found
              </p>
            </div>
          ) : (
            <>
              {/* Selection Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-[#8E8E93]">
                  {selectedIds.size} of {suggestions.length} selected
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAll}
                    className="px-3 py-1.5 text-sm text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded-lg"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAll}
                    className="px-3 py-1.5 text-sm text-[#8E8E93] hover:bg-[#2C2C2E] rounded-lg"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Suggestions Grid */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => toggleSelection(index)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedIds.has(index)
                        ? 'border-[#0A84FF] bg-[#0A84FF]/10'
                        : 'border-[#38383A] bg-[#2C2C2E] hover:border-[#0A84FF]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedIds.has(index)
                          ? 'bg-[#0A84FF] border-[#0A84FF]'
                          : 'border-[#636366]'
                      }`}>
                        {selectedIds.has(index) && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </div>

                      {/* Icon */}
                      <div className="w-10 h-10 rounded-lg bg-[#0A84FF]/20 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-[#0A84FF]" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white mb-2">
                          {suggestion.suggestedTitle}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-[#636366] text-xs mb-0.5">Category</p>
                            <p className="text-white">{suggestion.category.name}</p>
                          </div>
                          <div>
                            <p className="text-[#636366] text-xs mb-0.5">Total Value</p>
                            <p className="text-white">{formatCurrency(suggestion.category.totalValue)}</p>
                          </div>
                          <div>
                            <p className="text-[#636366] text-xs mb-0.5">Items</p>
                            <p className="text-white">{suggestion.category.itemCount} items</p>
                          </div>
                          <div>
                            <p className="text-[#636366] text-xs mb-0.5">Estimated Duration</p>
                            <p className="text-white">{suggestion.estimatedDuration} days</p>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="mt-3 flex items-center gap-2 text-xs">
                          <span className="text-[#636366]">Timeline:</span>
                          <span className="text-[#0A84FF]">
                            {new Date(suggestion.suggestedStartDate).toLocaleDateString()} - {new Date(suggestion.suggestedEndDate).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Auto-generated badge */}
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-[#FF9F0A]/20 rounded text-xs text-[#FF9F0A]">
                          <Lightbulb className="h-3 w-3" />
                          Auto-generated
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && suggestions.length > 0 && (
          <div className="p-6 border-t border-[#38383A] flex items-center justify-between">
            <p className="text-sm text-[#636366]">
              Selected milestones will be created and automatically linked to RAB workflow
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-white hover:bg-[#2C2C2E] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={selectedIds.size === 0 || creating}
                className="px-6 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create {selectedIds.size} Milestone{selectedIds.size !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneSuggestionModal;
