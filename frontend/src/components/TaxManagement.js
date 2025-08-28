import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calculator,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Plus,
  Eye,
  Edit3,
  Search,
  Clock,
  DollarSign
} from 'lucide-react';

const TaxManagement = () => {
  const [taxData, setTaxData] = useState({});
  const [taxReports, setTaxReports] = useState([]);
  const [taxCalculations, setTaxCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock tax data
    const mockTaxData = {
    totalTaxLiability: 2850000000,
    paidTaxes: 2100000000,
    pendingTaxes: 750000000,
    taxRate: 25,
    vatCollected: 1250000000,
    vatPaid: 950000000,
    monthlyTaxSaving: 125000000,
    complianceScore: 95.5,
    upcomingDeadlines: 3,
    completedFilings: 12
    };

    const mockTaxReports = [
    {
      id: 1,
      type: 'Corporate Income Tax',
      period: '2025 Q2',
      dueDate: '2025-09-30',
      status: 'pending',
      amount: 875000000,
      description: 'Quarterly corporate income tax filing',
      reference: 'CIT-2025-Q2-001'
    },
    {
      id: 2,
      type: 'VAT Return',
      period: 'August 2025',
      dueDate: '2025-09-10',
      status: 'completed',
      amount: 325000000,
      description: 'Monthly VAT return filing',
      reference: 'VAT-2025-08-001'
    },
    {
      id: 3,
      type: 'Withholding Tax',
      period: 'August 2025',
      dueDate: '2025-09-10',
      status: 'overdue',
      amount: 150000000,
      description: 'Employee withholding tax',
      reference: 'WHT-2025-08-001'
    },
    {
      id: 4,
      type: 'Property Tax',
      period: '2025',
      dueDate: '2025-12-31',
      status: 'upcoming',
      amount: 420000000,
      description: 'Annual property tax for office buildings',
      reference: 'PBB-2025-001'
    }
    ];

    const mockTaxCalculations = [
    {
      id: 1,
      projectId: 'PRJ-001',
      projectName: 'Mall Construction',
      revenue: 15000000000,
      expenses: 12000000000,
      taxableIncome: 3000000000,
      corporateTax: 750000000,
      vatOnSales: 1500000000,
      vatOnPurchases: 1200000000,
      netVAT: 300000000,
      totalTaxLiability: 1050000000,
      effectiveTaxRate: 7.0
    },
    {
      id: 2,
      projectId: 'PRJ-002',
      projectName: 'Office Building',
      revenue: 12000000000,
      expenses: 9500000000,
      taxableIncome: 2500000000,
      corporateTax: 625000000,
      vatOnSales: 1200000000,
      vatOnPurchases: 950000000,
      netVAT: 250000000,
      totalTaxLiability: 875000000,
      effectiveTaxRate: 7.3
    },
    {
      id: 3,
      projectId: 'PRJ-003',
      projectName: 'Residential Complex',
      revenue: 8500000000,
      expenses: 7200000000,
      taxableIncome: 1300000000,
      corporateTax: 325000000,
      vatOnSales: 850000000,
      vatOnPurchases: 720000000,
      netVAT: 130000000,
      totalTaxLiability: 455000000,
      effectiveTaxRate: 5.4
    }
    ];

    // Simulate API call
    setTimeout(() => {
      setTaxData(mockTaxData);
      setTaxReports(mockTaxReports);
      setTaxCalculations(mockTaxCalculations);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      case 'upcoming': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'upcoming': return <Calendar className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatCurrency = (amount) => {
    return `Rp ${(amount / 1000000000).toFixed(1)}B`;
  };

  const filteredReports = taxReports.filter(report => {
    const matchesSearch = report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Management</h1>
          <p className="text-gray-600 mt-1">Manage tax calculations, compliance, and reporting</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4" />
            Import Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            New Tax Filing
          </button>
        </div>
      </div>

      {/* Tax Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tax Liability</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(taxData.totalTaxLiability)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-sm text-red-600">{taxData.taxRate}% rate</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <Calculator className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Taxes</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(taxData.paidTaxes)}</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">Completed</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Taxes</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(taxData.pendingTaxes)}</p>
              <div className="flex items-center mt-2">
                <Clock className="h-4 w-4 text-yellow-600 mr-1" />
                <span className="text-sm text-yellow-600">{taxData.upcomingDeadlines} deadlines</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-blue-600">{taxData.complianceScore}%</p>
              <div className="flex items-center mt-2">
                <FileText className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm text-blue-600">{taxData.completedFilings} filings</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tax Overview
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tax Reports & Filings
            </button>
            <button
              onClick={() => setActiveTab('calculations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'calculations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tax Calculations
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Tax Summary Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">VAT Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">VAT Collected</span>
                      <span className="text-lg font-bold text-green-600">{formatCurrency(taxData.vatCollected)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">VAT Paid</span>
                      <span className="text-lg font-bold text-red-600">{formatCurrency(taxData.vatPaid)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-900">Net VAT</span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatCurrency(taxData.vatCollected - taxData.vatPaid)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Tax Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Tax Efficiency</span>
                        <span className="text-sm font-medium text-green-600">92.3%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '92.3%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Compliance Rate</span>
                        <span className="text-sm font-medium text-blue-600">{taxData.complianceScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${taxData.complianceScore}%` }}></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Monthly Tax Saving</span>
                        <span className="text-lg font-bold text-purple-600">{formatCurrency(taxData.monthlyTaxSaving)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Tax Deadlines</h3>
                <div className="space-y-3">
                  {taxReports.filter(report => report.status === 'pending' || report.status === 'upcoming').map((report) => (
                    <div key={report.id} className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(report.status)}
                        <div>
                          <p className="font-medium text-gray-900">{report.type}</p>
                          <p className="text-sm text-gray-600">{report.period}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(report.amount)}</p>
                        <p className="text-sm text-gray-600">Due: {report.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tax Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Search Filter */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search tax reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4" />
                  Export Reports
                </button>
              </div>

              {/* Tax Reports Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Type</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Period</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Due Date</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Amount</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Reference</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{report.type}</div>
                          <div className="text-sm text-gray-500">{report.description}</div>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{report.period}</td>
                        <td className="py-4 px-6 text-gray-700">{report.dueDate}</td>
                        <td className="py-4 px-6 font-bold text-gray-900">{formatCurrency(report.amount)}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-700 font-mono text-sm">{report.reference}</td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tax Calculations Tab */}
          {activeTab === 'calculations' && (
            <div className="space-y-6">
              {taxCalculations.map((calc) => (
                <div key={calc.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{calc.projectName}</h3>
                      <p className="text-sm text-gray-600">Project ID: {calc.projectId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Effective Tax Rate</p>
                      <p className="text-2xl font-bold text-blue-600">{calc.effectiveTaxRate}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Revenue & Expenses</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Revenue</span>
                          <span className="text-sm font-medium text-green-600">{formatCurrency(calc.revenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Expenses</span>
                          <span className="text-sm font-medium text-red-600">{formatCurrency(calc.expenses)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-sm font-medium text-gray-900">Taxable Income</span>
                          <span className="text-sm font-bold text-blue-600">{formatCurrency(calc.taxableIncome)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Corporate Tax</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tax Rate</span>
                          <span className="text-sm font-medium text-gray-900">{taxData.taxRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Taxable Income</span>
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(calc.taxableIncome)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-sm font-medium text-gray-900">Corporate Tax</span>
                          <span className="text-sm font-bold text-red-600">{formatCurrency(calc.corporateTax)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">VAT Calculation</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">VAT on Sales</span>
                          <span className="text-sm font-medium text-green-600">{formatCurrency(calc.vatOnSales)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">VAT on Purchases</span>
                          <span className="text-sm font-medium text-red-600">{formatCurrency(calc.vatOnPurchases)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-sm font-medium text-gray-900">Net VAT</span>
                          <span className="text-sm font-bold text-blue-600">{formatCurrency(calc.netVAT)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">Total Tax Liability</h4>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(calc.totalTaxLiability)}</p>
                        <p className="text-sm text-gray-600">
                          Corporate Tax: {formatCurrency(calc.corporateTax)} + VAT: {formatCurrency(calc.netVAT)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxManagement;
