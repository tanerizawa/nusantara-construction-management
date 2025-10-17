import React, { useState, useEffect } from 'react';
import { Building2, ChevronDown, Check, X } from 'lucide-react';
import { fetchSubsidiaries } from '../services/subsidiaryService';

const SubsidiarySelector = ({ selectedSubsidiary, onSubsidiaryChange, className = '' }) => {
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubsidiaries();
  }, []);

  const loadSubsidiaries = async () => {
    setLoading(true);
    const result = await fetchSubsidiaries(true); // Active only
    if (result.success) {
      setSubsidiaries(result.data);
    }
    setLoading(false);
  };

  const handleSelect = (subsidiaryId) => {
    console.log('🔍 [SubsidiarySelector] Selected:', subsidiaryId); // DEBUG
    console.log('🔍 [SubsidiarySelector] onSubsidiaryChange exists?', !!onSubsidiaryChange); // DEBUG
    if (onSubsidiaryChange) {
      onSubsidiaryChange(subsidiaryId);
    } else {
      console.error('❌ [SubsidiarySelector] onSubsidiaryChange is undefined!'); // ERROR
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onSubsidiaryChange(null);
    setIsOpen(false);
  };

  const selectedSub = subsidiaries.find(s => s.id === selectedSubsidiary);

  return (
    <div className={`relative ${className}`}>
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 
                   text-gray-100 rounded-lg transition-colors border border-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Building2 size={18} className="text-gray-400" />
        <span className="text-sm font-medium">
          {selectedSub ? selectedSub.name : 'All Entities'}
        </span>
        {selectedSubsidiary && (
          <span
            onClick={(e) => {
              e.stopPropagation(); // Prevent dropdown from opening
              handleClear();
            }}
            className="ml-2 p-0.5 hover:bg-gray-600 rounded cursor-pointer inline-flex"
          >
            <X size={14} />
          </span>
        )}
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 
                          rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-100">
                Select Entity
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Filter accounts by subsidiary
              </p>
            </div>

            {/* All Entities Option */}
            <button
              onClick={() => handleSelect(null)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors
                         flex items-center justify-between border-b border-gray-700
                         ${!selectedSubsidiary ? 'bg-gray-700/50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Building2 size={18} className="text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-100">
                    All Entities
                  </div>
                  <div className="text-xs text-gray-400">
                    Show all accounts
                  </div>
                </div>
              </div>
              {!selectedSubsidiary && (
                <Check size={16} className="text-green-400" />
              )}
            </button>

            {/* Loading State */}
            {loading && (
              <div className="px-4 py-8 text-center text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto" />
                <p className="text-xs mt-2">Loading subsidiaries...</p>
              </div>
            )}

            {/* Subsidiaries List */}
            {!loading && subsidiaries.map((subsidiary) => (
              <button
                key={subsidiary.id}
                onClick={() => handleSelect(subsidiary.id)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors
                           flex items-center justify-between
                           ${selectedSubsidiary === subsidiary.id ? 'bg-gray-700/50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center 
                                  justify-center text-xs font-bold text-gray-300">
                    {subsidiary.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-100 truncate">
                      {subsidiary.name}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                      <span className="capitalize">{subsidiary.specialization}</span>
                      {subsidiary.accountCount > 0 && (
                        <>
                          <span>•</span>
                          <span>{subsidiary.accountCount} accounts</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {selectedSubsidiary === subsidiary.id && (
                  <Check size={16} className="text-green-400 flex-shrink-0" />
                )}
              </button>
            ))}

            {/* Empty State */}
            {!loading && subsidiaries.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-400">
                <Building2 size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No subsidiaries found</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SubsidiarySelector;
