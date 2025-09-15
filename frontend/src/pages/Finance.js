import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  DollarSign, 
  FileText, 
  BarChart3, 
  Calculator,
  TrendingUp,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  Banknote,
  Activity,
  Receipt,
  Download,
  Eye,
  Info,
  AlertTriangle
} from 'lucide-react';
import FinancialWorkspaceDashboard from '../components/workspace/FinancialWorkspaceDashboard';
import FinancialAPIService from '../services/FinancialAPIService';

const Finance = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('workspace');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [financialData, setFinancialData] = useState({});
  const [loading, setLoading] = useState(false);

  // Nusantara Group subsidiaries data
  const nusantaraGroupData = {
    subsidiaries: [
      { id: 'nkg', name: 'PT Nusantara Konstruksi Global', npwp: '01.234.567.8-901.000' },
      { id: 'nip', name: 'PT Nusantara Infrastruktur Prima', npwp: '01.234.567.8-902.000' },
      { id: 'nrp', name: 'PT Nusantara Realty Property', npwp: '01.234.567.8-903.000' },
      { id: 'nte', name: 'PT Nusantara Trading Engineering', npwp: '01.234.567.8-904.000' }
    ]
  };

  // Fetch financial data
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const params = {
        subsidiaryId: selectedSubsidiary === 'all' ? null : selectedSubsidiary,
        projectId: selectedProject === 'all' ? null : selectedProject
      };
      
      const result = await FinancialAPIService.getFinancialDashboardData(params);
      setFinancialData(result);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [selectedSubsidiary, selectedProject]);

  // Handle URL params untuk tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['workspace', 'psak-compliance', 'tax-management', 'reports', 'transactions'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const tabs = [
    { id: 'workspace', label: 'Financial Workspace', icon: Banknote, description: 'Dashboard keuangan terintegrasi dengan analisis PSAK' },
    { id: 'psak-compliance', label: 'PSAK Compliance', icon: FileText, description: 'Laporan kepatuhan standar akuntansi Indonesia' },
    { id: 'tax-management', label: 'Tax Management', icon: Calculator, description: 'Manajemen pajak dan kepatuhan fiskal' },
    { id: 'reports', label: 'Financial Reports', icon: BarChart3, description: 'Laporan keuangan lengkap (Neraca, L/R, Arus Kas)' },
    { id: 'transactions', label: 'Transactions', icon: Receipt, description: 'Manajemen transaksi keuangan harian' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'workspace':
        return (
          <div className="space-y-6">
            <FinancialWorkspaceDashboard 
              selectedSubsidiary={selectedSubsidiary}
              selectedProject={selectedProject}
            />
          </div>
        );

      case 'psak-compliance':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">PSAK Compliance Dashboard</h2>
              <div className="flex space-x-3">
                <select 
                  value={selectedSubsidiary} 
                  onChange={(e) => setSelectedSubsidiary(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">Semua Anak Perusahaan</option>
                  {nusantaraGroupData.subsidiaries.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export Compliance Report</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overall PSAK Score</p>
                    <p className="text-3xl font-bold text-green-600">92.5%</p>
                    <p className="text-xs text-green-500 mt-1">✅ Excellent Compliance</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Standards Compliance</p>
                    <p className="text-3xl font-bold text-blue-600">14/15</p>
                    <p className="text-xs text-blue-500 mt-1">📋 Passed Checks</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Construction Accounting</p>
                    <p className="text-3xl font-bold text-amber-600">85%</p>
                    <p className="text-xs text-amber-500 mt-1">⚠️ Needs Attention</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Detailed PSAK Compliance Checks</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { name: 'Double Entry Compliance', status: 'passed', score: 100 },
                    { name: 'Account Classification', status: 'passed', score: 95 },
                    { name: 'Transaction Documentation', status: 'passed', score: 90 },
                    { name: 'Chronological Order', status: 'passed', score: 100 },
                    { name: 'Currency Consistency', status: 'passed', score: 98 },
                    { name: 'Construction Accounting', status: 'warning', score: 85 }
                  ].map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        {check.status === 'passed' ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-500 mr-3" />
                        )}
                        <span className="font-medium text-gray-900">{check.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`font-semibold ${check.status === 'passed' ? 'text-green-600' : 'text-amber-600'}`}>
                          {check.score}%
                        </span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'tax-management':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Tax Management Dashboard</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Tax Filing</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Tax Group</p>
                    <p className="text-2xl font-bold text-blue-600">Rp 2.8B</p>
                    <p className="text-xs text-blue-500">This Month</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-50">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                    <p className="text-2xl font-bold text-green-600">98.5%</p>
                    <p className="text-xs text-green-500">Excellent</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-amber-50">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Filings</p>
                    <p className="text-2xl font-bold text-amber-600">3</p>
                    <p className="text-xs text-amber-500">Due Soon</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-50">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">YTD Savings</p>
                    <p className="text-2xl font-bold text-purple-600">Rp 850M</p>
                    <p className="text-xs text-purple-500">Tax Optimization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Management Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Tax Filing Status by Subsidiary</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subsidiary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tax Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { subsidiary: 'PT NKG', type: 'PPh 25', period: 'Sep 2025', amount: 450000000, status: 'paid', due: '2025-10-15' },
                      { subsidiary: 'PT NIP', type: 'PPN', period: 'Sep 2025', amount: 1200000000, status: 'pending', due: '2025-10-20' },
                      { subsidiary: 'PT NRP', type: 'PPh 21', period: 'Sep 2025', amount: 185000000, status: 'paid', due: '2025-10-10' },
                      { subsidiary: 'PT NTE', type: 'PPh Final', period: 'Sep 2025', amount: 125000000, status: 'overdue', due: '2025-09-30' }
                    ].map((tax, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tax.subsidiary}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tax.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tax.period}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(tax.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            tax.status === 'paid' ? 'bg-green-100 text-green-800' :
                            tax.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {tax.status === 'paid' ? 'Paid' : tax.status === 'pending' ? 'Pending' : 'Overdue'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tax.due}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Financial Reports (PSAK Compliant)</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export All Reports</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Income Statement</h3>
                  <Receipt className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="font-semibold text-green-600">Rp 15.75B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Direct Costs</span>
                    <span className="font-semibold text-red-600">(Rp 9.83B)</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-sm text-gray-600">Gross Profit</span>
                    <span className="font-semibold text-blue-600">Rp 5.92B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Indirect Costs</span>
                    <span className="font-semibold text-red-600">(Rp 2.58B)</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 font-bold">
                    <span className="text-gray-900">Net Income</span>
                    <span className="text-emerald-600">Rp 3.35B</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  View Detailed Report
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Balance Sheet</h3>
                  <Building2 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Assets</span>
                    <span className="font-semibold text-blue-600">Rp 45.12B</span>
                  </div>
                  <div className="ml-2 space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>• Current Assets</span>
                      <span>Rp 8.62B</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>• Fixed Assets</span>
                      <span>Rp 36.50B</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Liabilities</span>
                    <span className="font-semibold text-red-600">Rp 12.69B</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 font-bold">
                    <span className="text-gray-900">Total Equity</span>
                    <span className="text-emerald-600">Rp 32.43B</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  View Balance Sheet
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Cash Flow</h3>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Operating Cash Flow</span>
                    <span className="font-semibold text-green-600">Rp 3.88B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Investing Cash Flow</span>
                    <span className="font-semibold text-red-600">(Rp 2.10B)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Financing Cash Flow</span>
                    <span className="font-semibold text-blue-600">Rp 700M</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 font-bold">
                    <span className="text-gray-900">Net Cash Change</span>
                    <span className="text-emerald-600">Rp 2.48B</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  View Cash Flow Statement
                </button>
              </div>
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Transaction Management</h2>
              <div className="flex space-x-3">
                <select 
                  value={selectedSubsidiary} 
                  onChange={(e) => setSelectedSubsidiary(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Subsidiaries</option>
                  {nusantaraGroupData.subsidiaries.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Transaction</span>
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Transaction Management Module</h3>
              <p className="text-gray-600 mb-4">
                Advanced transaction management with PSAK-compliant journal entries is being developed.
              </p>
              <p className="text-sm text-gray-500">
                This module will include: Chart of Accounts integration, automated journal entries, 
                multi-currency support, and real-time financial reporting.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Select a tab to view content</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center mb-4">
                <Banknote className="w-10 h-10 text-blue-600 mr-4" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Financial Management System</h1>
                  <p className="text-gray-600 mt-1">
                    PSAK-compliant financial management for Nusantara Construction Group
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Subsidiary:</span>
                  <select
                    value={selectedSubsidiary}
                    onChange={(e) => setSelectedSubsidiary(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Subsidiaries</option>
                    {nusantaraGroupData.subsidiaries.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">Total Revenue</p>
                    <p className="text-2xl font-bold text-blue-600">Rp 125.8B</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-900">Net Profit</p>
                    <p className="text-2xl font-bold text-green-600">Rp 28.5B</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-900">Total Budget</p>
                    <p className="text-2xl font-bold text-purple-600">Rp 344.9B</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-orange-900">Group ROI</p>
                    <p className="text-2xl font-bold text-orange-600">19.2%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    title={tab.description}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default Finance;
