import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Plus,
  AlertTriangle,
  CheckCircle,
  FileDown
} from 'lucide-react';
import useBudgetCalculations from '../hooks/useBudgetCalculations';

/**
 * RAB Comparison Table Component
 * Main table showing RAB items with actual costs and variance
 */
const RABComparisonTable = ({ rabItems, loading, onAddActual }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'itemNumber', direction: 'asc' });
  const [expandedRows, setExpandedRows] = useState(new Set());

  const {
    formatCurrency,
    formatPercent,
    calculateItemVariance,
    calculateProgress,
    getProgressColor,
    getVarianceStatus
  } = useBudgetCalculations();

  // Get unique categories
  const categories = useMemo(() => {
    if (!Array.isArray(rabItems)) return [];
    const cats = [...new Set(rabItems.map(item => item.category))];
    return cats.filter(Boolean);
  }, [rabItems]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    if (!Array.isArray(rabItems)) return [];

    let filtered = rabItems;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.workName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => {
        const progress = calculateProgress(item.actualSpent || 0, item.totalPrice || 0);
        if (selectedStatus === 'on-track') return progress <= 90;
        if (selectedStatus === 'warning') return progress > 90 && progress <= 100;
        if (selectedStatus === 'over-budget') return progress > 100;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle numeric values
      if (sortConfig.key === 'totalPrice' || sortConfig.key === 'actualSpent') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [rabItems, searchTerm, selectedCategory, selectedStatus, sortConfig, calculateProgress]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      acc.budget += item.totalPrice || 0;
      acc.actual += item.actualSpent || 0;
      return acc;
    }, { budget: 0, actual: 0 });
  }, [filteredItems]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleRowExpanded = (id) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const exportToExcel = () => {
    // TODO: Implement Excel export
    console.log('Export to Excel', filteredItems);
  };

  if (loading) {
    return (
      <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-3 bg-[#38383A] rounded w-1/4"></div>
          <div className="h-8 bg-[#38383A] rounded"></div>
          <div className="h-8 bg-[#38383A] rounded"></div>
          <div className="h-8 bg-[#38383A] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg overflow-hidden">
      {/* Compact Header */}
      <div className="p-3 border-b border-[#38383A]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">
            Perbandingan RAB vs Realisasi
          </h3>
          <button
            onClick={exportToExcel}
            className="flex items-center px-2.5 py-1.5 bg-[#30D158] hover:bg-[#30D158]/90 text-white text-xs rounded-lg transition-colors"
          >
            <FileDown className="mr-1.5 w-3.5 h-3.5" />
            Export
          </button>
        </div>

        {/* Compact Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[#8E8E93] w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Cari pekerjaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-[#38383A] rounded-lg bg-[#1C1C1E] text-white text-sm placeholder-[#8E8E93] focus:ring-1 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 border border-[#38383A] rounded-lg bg-[#1C1C1E] text-white text-sm focus:ring-1 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
          >
            <option value="all">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 border border-[#38383A] rounded-lg bg-[#1C1C1E] text-white text-sm focus:ring-1 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
          >
            <option value="all">Semua Status</option>
            <option value="on-track">Sesuai Anggaran</option>
            <option value="warning">Mendekati Limit</option>
            <option value="over-budget">Melebihi Anggaran</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center text-xs text-[#8E8E93]">
            <Filter className="mr-1.5 w-3.5 h-3.5" />
            {filteredItems.length} dari {rabItems?.length || 0} item
          </div>
        </div>
      </div>

      {/* Compact Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1C1C1E] border-b border-[#38383A]">
            <tr>
              <th className="w-8"></th>
              <SortableHeader
                label="No"
                sortKey="itemNumber"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                label="Pekerjaan"
                sortKey="workName"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                label="Kategori"
                sortKey="category"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                label="Anggaran"
                sortKey="totalPrice"
                sortConfig={sortConfig}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Realisasi"
                sortKey="actualSpent"
                sortConfig={sortConfig}
                onSort={handleSort}
                align="right"
              />
              <th className="px-3 py-2 text-right text-xs font-medium text-[#8E8E93] uppercase">
                Selisih
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-[#8E8E93] uppercase">
                Progress
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-[#8E8E93] uppercase">
                Status
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-[#8E8E93] uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Tidak ada data yang sesuai dengan filter
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <RABTableRow
                  key={item.id}
                  item={item}
                  expanded={expandedRows.has(item.id)}
                  onToggleExpand={() => toggleRowExpanded(item.id)}
                  onAddActual={onAddActual}
                  formatCurrency={formatCurrency}
                  formatPercent={formatPercent}
                  calculateItemVariance={calculateItemVariance}
                  calculateProgress={calculateProgress}
                  getProgressColor={getProgressColor}
                  getVarianceStatus={getVarianceStatus}
                />
              ))
            )}
          </tbody>
          {filteredItems.length > 0 && (
            <tfoot className="bg-gray-50 dark:bg-gray-900 font-semibold">
              <tr>
                <td colSpan="4" className="px-6 py-4 text-right text-gray-900 dark:text-white">
                  Total:
                </td>
                <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                  {formatCurrency(totals.budget)}
                </td>
                <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                  {formatCurrency(totals.actual)}
                </td>
                <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                  {formatCurrency(totals.actual - totals.budget)}
                </td>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-900 dark:text-white">
                  {formatPercent(calculateProgress(totals.actual, totals.budget))}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

/**
 * Sortable Table Header Component - Compact
 */
const SortableHeader = ({ label, sortKey, sortConfig, onSort, align = 'left' }) => {
  const isActive = sortConfig.key === sortKey;
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

  return (
    <th
      className={`px-3 py-2 ${alignClass} text-xs font-medium text-[#8E8E93] uppercase cursor-pointer hover:bg-[#2C2C2E] transition-colors`}
      onClick={() => onSort(sortKey)}
    >
      <div className={`flex items-center ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : ''}`}>
        <span>{label}</span>
        {isActive && (
          sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
        )}
      </div>
    </th>
  );
};

/**
 * Individual RAB Table Row Component
 */
const RABTableRow = ({
  item,
  expanded,
  onToggleExpand,
  onAddActual,
  formatCurrency,
  formatPercent,
  calculateItemVariance,
  calculateProgress,
  getProgressColor,
  getVarianceStatus
}) => {
  const variance = calculateItemVariance(item.totalPrice || 0, item.actualSpent || 0);
  const progress = calculateProgress(item.actualSpent || 0, item.totalPrice || 0);
  const status = getVarianceStatus(variance);

  return (
    <>
      <tr className="hover:bg-[#1C1C1E] transition-colors border-b border-[#38383A]">
        {/* Expand Button */}
        <td className="px-2 py-2.5">
          <button
            onClick={onToggleExpand}
            className="text-[#8E8E93] hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </td>

        {/* Item Number */}
        <td className="px-3 py-2.5 whitespace-nowrap text-sm text-white">
          {item.itemNumber}
        </td>

        {/* Work Name */}
        <td className="px-3 py-2.5 text-sm text-white">
          <div className="max-w-xs">
            {item.workName}
          </div>
        </td>

        {/* Category */}
        <td className="px-3 py-2.5 whitespace-nowrap text-sm">
          <span className="px-2 py-0.5 bg-[#38383A] text-[#8E8E93] rounded text-xs">
            {item.category}
          </span>
        </td>

        {/* Budget */}
        <td className="px-3 py-2.5 whitespace-nowrap text-sm text-right text-white">
          {formatCurrency(item.totalPrice)}
        </td>

        {/* Actual Spent */}
        <td className="px-3 py-2.5 whitespace-nowrap text-sm text-right font-medium text-white">
          {formatCurrency(item.actualSpent || 0)}
        </td>

        {/* Variance */}
        <td className={`px-3 py-2.5 whitespace-nowrap text-sm text-right font-medium ${
          variance > 0 ? 'text-[#FF453A]' : 'text-[#30D158]'
        }`}>
          {variance > 0 ? '+' : ''}{formatCurrency((item.actualSpent || 0) - (item.totalPrice || 0))}
        </td>

        {/* Progress Bar */}
        <td className="px-3 py-2.5 whitespace-nowrap">
          <div className="w-full bg-[#38383A] rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${getProgressColor(progress)}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-center mt-1 text-[#8E8E93]">
            {formatPercent(progress)}
          </p>
        </td>

        {/* Status */}
        <td className="px-3 py-2.5 whitespace-nowrap text-center">
          {progress > 100 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FF453A]/20 text-[#FF453A]">
              <AlertTriangle className="mr-1 w-3 h-3" />
              {status}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#30D158]/20 text-[#30D158]">
              <CheckCircle className="mr-1 w-3 h-3" />
              {status}
            </span>
          )}
        </td>

        {/* Actions */}
        <td className="px-3 py-2.5 whitespace-nowrap text-center">
          <button
            onClick={() => onAddActual(item)}
            className="inline-flex items-center px-2.5 py-1 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white text-xs rounded transition-colors"
          >
            <Plus className="mr-1 w-3 h-3" />
            Input
          </button>
        </td>
      </tr>

      {/* Expanded Row Details */}
      {expanded && (
        <tr className="bg-[#1C1C1E] border-t border-[#38383A]">
          <td colSpan="10" className="px-3 py-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-[#8E8E93] text-xs mb-1">Volume</p>
                <p className="font-medium text-white">
                  {item.quantity} {item.unit}
                </p>
              </div>
              <div>
                <p className="text-[#8E8E93] text-xs mb-1">Harga Satuan</p>
                <p className="font-medium text-white">
                  {formatCurrency(item.unitPrice)}
                </p>
              </div>
              <div>
                <p className="text-[#8E8E93] text-xs mb-1">Sisa Anggaran</p>
                <p className={`font-medium ${
                  (item.totalPrice || 0) - (item.actualSpent || 0) < 0 
                    ? 'text-[#FF453A]' 
                    : 'text-[#30D158]'
                }`}>
                  {formatCurrency((item.totalPrice || 0) - (item.actualSpent || 0))}
                </p>
              </div>
              <div>
                <p className="text-[#8E8E93] text-xs mb-1">Selisih %</p>
                <p className={`font-medium ${variance > 0 ? 'text-[#FF453A]' : 'text-[#30D158]'}`}>
                  {variance > 0 ? '+' : ''}{formatPercent(variance)}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default RABComparisonTable;
