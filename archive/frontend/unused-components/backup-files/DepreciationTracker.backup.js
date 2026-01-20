import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingDown, 
  Calculator, 
  Calendar, 
  DollarSign,
  BarChart3,
  FileText,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Filter,
  Search
} from 'lucide-react';
import axios from 'axios';

/**
 * Depreciation Tracker Component
 * 
 * Comprehensive depreciation management for construction assets
 * Features:
 * - Multiple depreciation methods (Straight Line, Declining Balance, etc.)
 * - Depreciation schedule visualization
 * - Monthly/Annual depreciation calculations
 * - Integration with Chart of Accounts
 * - Depreciation reports and analytics
 */
const DepreciationTracker = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [depreciationSchedule, setDepreciationSchedule] = useState([]);
  const [totalDepreciation, setTotalDepreciation] = useState({
    totalCost: 0,
    totalAccumulated: 0,
    totalNetBook: 0,
    monthlyDepreciation: 0
  });

  const depreciationMethods = {
    STRAIGHT_LINE: 'Garis Lurus',
    DECLINING_BALANCE: 'Saldo Menurun',
    DOUBLE_DECLINING: 'Saldo Menurun Berganda',
    UNITS_OF_PRODUCTION: 'Unit Produksi',
    SUM_OF_YEARS_DIGITS: 'Jumlah Angka Tahun'
  };

  // Fetch assets with depreciation data
  const fetchAssetsWithDepreciation = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch assets from database
      const response = await axios.get('/api/reports/fixed-asset/list');
      
      if (response.data.success) {
        const rawAssets = response.data.assets || [];
        
        // Calculate depreciation for each asset
        const assetsWithDepreciation = rawAssets.map(asset => {
          const purchasePrice = parseFloat(asset.purchase_price) || 0;
          const salvageValue = parseFloat(asset.salvage_value) || 0;
          const usefulLife = parseInt(asset.useful_life) || 5;
          const purchaseDate = new Date(asset.purchase_date);
          const currentDate = new Date();
          
          // Default depreciation method to straight line if not specified
          const depreciationMethod = asset.depreciation_method || 'STRAIGHT_LINE';
          
          // Calculate months elapsed since purchase
          const monthsElapsed = (currentDate.getFullYear() - purchaseDate.getFullYear()) * 12 + 
                               (currentDate.getMonth() - purchaseDate.getMonth());
          
          let accumulatedDepreciation = 0;
          let monthlyDepreciation = 0;
          let annualDepreciation = 0;
          
          // Calculate depreciation based on method
          if (depreciationMethod === 'STRAIGHT_LINE') {
            const depreciableAmount = purchasePrice - salvageValue;
            annualDepreciation = depreciableAmount / usefulLife;
            monthlyDepreciation = annualDepreciation / 12;
            accumulatedDepreciation = Math.min(monthlyDepreciation * monthsElapsed, depreciableAmount);
          } else if (depreciationMethod === 'DECLINING_BALANCE') {
            const depreciationRate = 2 / usefulLife; // Double declining balance
            let bookValue = purchasePrice;
            accumulatedDepreciation = 0;
            
            for (let month = 0; month < monthsElapsed && bookValue > salvageValue; month++) {
              const currentMonthlyDepreciation = (bookValue * depreciationRate) / 12;
              if (bookValue - currentMonthlyDepreciation < salvageValue) {
                accumulatedDepreciation += bookValue - salvageValue;
                break;
              }
              accumulatedDepreciation += currentMonthlyDepreciation;
              bookValue -= currentMonthlyDepreciation;
            }
            
            monthlyDepreciation = monthsElapsed > 0 ? accumulatedDepreciation / monthsElapsed : 0;
            annualDepreciation = monthlyDepreciation * 12;
          }
          
          const netBookValue = purchasePrice - accumulatedDepreciation;
          const depreciationRate = purchasePrice > 0 ? (accumulatedDepreciation / purchasePrice) * 100 : 0;
          const remainingLife = usefulLife - (monthsElapsed / 12);
          
          return {
            id: asset.id,
            assetCode: asset.asset_code,
            assetName: asset.asset_name,
            assetCategory: asset.asset_category,
            purchasePrice: purchasePrice,
            purchaseDate: asset.purchase_date,
            depreciationMethod: depreciationMethod,
            usefulLife: usefulLife,
            salvageValue: salvageValue,
            depreciationStartDate: asset.purchase_date,
            accumulatedDepreciation: Math.round(accumulatedDepreciation),
            netBookValue: Math.round(netBookValue),
            monthlyDepreciation: Math.round(monthlyDepreciation),
            annualDepreciation: Math.round(annualDepreciation),
            depreciationRate: Math.round(depreciationRate * 100) / 100,
            remainingLife: Math.max(0, Math.round(remainingLife * 100) / 100),
            lastDepreciationDate: currentDate.toISOString().split('T')[0]
          };
        });

        setAssets(assetsWithDepreciation);
        setFilteredAssets(assetsWithDepreciation);

        // Calculate totals
        const totals = assetsWithDepreciation.reduce((acc, asset) => ({
          totalCost: acc.totalCost + asset.purchasePrice,
          totalAccumulated: acc.totalAccumulated + asset.accumulatedDepreciation,
          totalNetBook: acc.totalNetBook + asset.netBookValue,
          monthlyDepreciation: acc.monthlyDepreciation + asset.monthlyDepreciation
        }), { totalCost: 0, totalAccumulated: 0, totalNetBook: 0, monthlyDepreciation: 0 });

        setTotalDepreciation(totals);
      } else {
        setError('Failed to fetch assets data');
      }
    } catch (error) {
      console.error('Error fetching depreciation data:', error);
      setError('Failed to load depreciation data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssetsWithDepreciation();
  }, [fetchAssetsWithDepreciation]);

  // Filter assets
  useEffect(() => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterMethod) {
      filtered = filtered.filter(asset => asset.depreciationMethod === filterMethod);
    }

    setFilteredAssets(filtered);
  }, [searchTerm, filterMethod, assets]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const getMethodColor = (method) => {
    const colors = {
      STRAIGHT_LINE: 'bg-blue-100 text-blue-800',
      DECLINING_BALANCE: 'bg-green-100 text-green-800',
      DOUBLE_DECLINING: 'bg-purple-100 text-purple-800',
      UNITS_OF_PRODUCTION: 'bg-orange-100 text-orange-800',
      SUM_OF_YEARS_DIGITS: 'bg-red-100 text-red-800'
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  const generateDepreciationSchedule = (asset) => {
    const schedule = [];
    const startDate = new Date(asset.depreciationStartDate);
    const annualDepreciation = asset.annualDepreciation;
    
    for (let year = 1; year <= asset.usefulLife; year++) {
      const scheduleYear = startDate.getFullYear() + year - 1;
      const accumulated = annualDepreciation * year;
      const netBookValue = asset.purchasePrice - Math.min(accumulated, asset.purchasePrice - asset.salvageValue);
      
      schedule.push({
        year: scheduleYear,
        yearNumber: year,
        depreciation: annualDepreciation,
        accumulated: Math.min(accumulated, asset.purchasePrice - asset.salvageValue),
        netBookValue: Math.max(netBookValue, asset.salvageValue)
      });
    }
    
    return schedule;
  };

  const viewDepreciationSchedule = (asset) => {
    const schedule = generateDepreciationSchedule(asset);
    setDepreciationSchedule(schedule);
    setSelectedAsset(asset);
    setShowScheduleModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <TrendingDown className="mr-3 text-blue-600" size={32} />
              Depreciation Tracker
            </h1>
            <p className="text-gray-600 mt-2">
              Tracking dan management penyusutan aset - Multiple methods & schedule visualization
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition-colors">
              <Calculator size={20} className="mr-2" />
              Calculate Depreciation
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors">
              <Download size={20} className="mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Asset Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalDepreciation.totalCost)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accumulated Depreciation</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalDepreciation.totalAccumulated)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Book Value</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalDepreciation.totalNetBook)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Depreciation</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(totalDepreciation.monthlyDepreciation)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Semua Metode</option>
            {Object.entries(depreciationMethods).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>

          <button
            onClick={fetchAssetsWithDepreciation}
            disabled={loading}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Depreciation Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Asset Depreciation Summary ({filteredAssets.length} assets)
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin text-blue-600" size={32} />
            <span className="ml-3 text-gray-600">Loading depreciation data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="text-red-600" size={32} />
            <span className="ml-3 text-red-600">{error}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accumulated Depreciation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Book Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Depreciation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining Life
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {asset.assetName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {asset.assetCode}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(asset.purchasePrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(asset.depreciationMethod)}`}>
                        {depreciationMethods[asset.depreciationMethod]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-red-600">
                        {formatCurrency(asset.accumulatedDepreciation)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPercentage(asset.depreciationRate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(asset.netBookValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(asset.monthlyDepreciation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {asset.remainingLife.toFixed(1)} years
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewDepreciationSchedule(asset)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Schedule"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Calculate"
                        >
                          <Calculator size={16} />
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-900"
                          title="Generate Report"
                        >
                          <FileText size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Depreciation Schedule Modal */}
      {showScheduleModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Depreciation Schedule - {selectedAsset.assetName}
              </h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Purchase Price</p>
                <p className="text-lg font-semibold">{formatCurrency(selectedAsset.purchasePrice)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Salvage Value</p>
                <p className="text-lg font-semibold">{formatCurrency(selectedAsset.salvageValue)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Useful Life</p>
                <p className="text-lg font-semibold">{selectedAsset.usefulLife} years</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Depreciation</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accumulated</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Book Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {depreciationSchedule.map((item) => (
                    <tr key={item.year} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.year}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.depreciation)}</td>
                      <td className="px-4 py-3 text-sm text-red-600">{formatCurrency(item.accumulated)}</td>
                      <td className="px-4 py-3 text-sm text-green-600">{formatCurrency(item.netBookValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepreciationTracker;