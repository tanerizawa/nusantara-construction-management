import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { financeAPI, subsidiariesAPI, projectsAPI, taxAPI } from '../services/api';
import { 
  DollarSign, 
  FileText, 
  BarChart3, 
  Calculator,
  TrendingUp,
  TrendingDown,
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
  AlertTriangle,
  BookOpen,
  ShoppingCart
} from 'lucide-react';
import FinancialWorkspaceDashboard from '../components/workspace/FinancialWorkspaceDashboard';
import FinancialAPIService from '../services/FinancialAPIService';
import InlineIncomeStatement from '../components/InlineIncomeStatement';
import InlineBalanceSheet from '../components/InlineBalanceSheet';
import InlineCashFlowStatement from '../components/InlineCashFlowStatement';
import ProjectFinanceIntegrationDashboard from '../components/finance/ProjectFinanceIntegrationDashboard';
import ChartOfAccounts from '../components/ChartOfAccounts';

const Finance = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('workspace');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  // eslint-disable-next-line no-unused-vars
  const [financialData, setFinancialData] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Transaction state
  const [transactions, setTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionSummary, setTransactionSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Financial Reports state
  const [financialReports, setFinancialReports] = useState({
    incomeStatement: {},
    balanceSheet: {},
    cashFlow: {},
    summary: {}
  });
  const [reportsLoading, setReportsLoading] = useState(false);

  // Inline detailed report states
  const [activeDetailedReport, setActiveDetailedReport] = useState(null); // 'income', 'balance', 'cashflow', or null

  // Real subsidiaries data from API
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loadingSubsidiaries, setLoadingSubsidiaries] = useState(false);

  // Transaction form state
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    projectId: '',
    paymentMethod: 'bank_transfer',
    referenceNumber: '',
    notes: ''
  });
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false);

  // Transaction actions state
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Tax Management state
  const [taxRecords, setTaxRecords] = useState([]);
  const [loadingTaxRecords, setLoadingTaxRecords] = useState(false);
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [taxForm, setTaxForm] = useState({
    type: 'pajak_penghasilan',
    amount: '',
    period: new Date().toISOString().slice(0, 7), // YYYY-MM format
    description: '',
    status: 'draft',
    dueDate: '',
    taxRate: '',
    reference: ''
  });
  const [isSubmittingTax, setIsSubmittingTax] = useState(false);

  // Projects state for cascading filter
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Fetch subsidiaries data
  const fetchSubsidiaries = async () => {
    try {
      setLoadingSubsidiaries(true);
      const response = await subsidiariesAPI.getAll();
      
      if (response.success && response.data) {
        setSubsidiaries(response.data);
      } else {
        console.error('Failed to fetch subsidiaries:', response.message);
      }
    } catch (error) {
      console.error('Error fetching subsidiaries:', error);
    } finally {
      setLoadingSubsidiaries(false);
    }
  };

  // Fetch projects data
  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await projectsAPI.getAll({ limit: 100 });
      
      if (response.success && response.data) {
        setProjects(response.data);
        setFilteredProjects(response.data); // Initially show all projects
      } else {
        console.error('Failed to fetch projects:', response.error);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Filter projects based on selected subsidiary
  const filterProjectsBySubsidiary = (subsidiaryId) => {
    if (subsidiaryId === 'all') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => project.subsidiaryId === subsidiaryId);
      setFilteredProjects(filtered);
    }
    
    // Reset selected project when subsidiary changes
    setSelectedProject('all');
  };

  // Handle Transaction Form
  const handleTransactionFormChange = (field, value) => {
    setTransactionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetTransactionForm = () => {
    setTransactionForm({
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      projectId: '',
      paymentMethod: 'bank_transfer',
      referenceNumber: '',
      notes: ''
    });
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmittingTransaction(true);
      
      // Prepare data and remove empty fields to avoid foreign key issues
      const submitData = {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount)
      };
      
      // Remove empty projectId to avoid foreign key constraints
      if (!submitData.projectId) {
        delete submitData.projectId;
      }

      const response = await financeAPI.create(submitData);
      
      if (response.success) {
        // Success: reset form, hide form, refresh transactions
        resetTransactionForm();
        setShowTransactionForm(false);
        fetchTransactions(); // Refresh the transactions list
        
        // Optional: Show success message
        alert('Transaction created successfully!');
      } else {
        throw new Error(response.error || 'Failed to create transaction');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Error creating transaction: ' + error.message);
    } finally {
      setIsSubmittingTransaction(false);
    }
  };

  // Handle Tax Form
  const fetchTaxRecords = async () => {
    try {
      setLoadingTaxRecords(true);
      const response = await taxAPI.getAll();
      
      if (response.success) {
        setTaxRecords(response.data);
      } else {
        console.error('Failed to fetch tax records:', response.error);
      }
    } catch (error) {
      console.error('Error fetching tax records:', error);
    } finally {
      setLoadingTaxRecords(false);
    }
  };

  const handleTaxFormChange = (field, value) => {
    setTaxForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetTaxForm = () => {
    setTaxForm({
      type: 'pajak_penghasilan',
      amount: '',
      period: new Date().toISOString().slice(0, 7),
      description: '',
      status: 'draft',
      dueDate: '',
      taxRate: '',
      reference: ''
    });
  };

  const handleSubmitTax = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmittingTax(true);
      
      // Prepare data and remove empty fields
      const submitData = {
        ...taxForm,
        amount: parseFloat(taxForm.amount)
      };
      
      // Remove empty fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null || submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      // Convert taxRate to number if provided
      if (submitData.taxRate) {
        submitData.taxRate = parseFloat(submitData.taxRate);
      }

      const response = await taxAPI.create(submitData);
      
      if (response.success) {
        // Success: reset form, hide form, refresh tax records
        resetTaxForm();
        setShowTaxForm(false);
        fetchTaxRecords(); // Refresh the tax records list
        
        // Show success message
        alert('Tax record created successfully!');
      } else {
        throw new Error(response.error || 'Failed to create tax record');
      }
    } catch (error) {
      console.error('Error creating tax record:', error);
      alert('Error creating tax record: ' + error.message);
    } finally {
      setIsSubmittingTax(false);
    }
  };

  // Handle Export COA
  const handleExportCOA = async () => {
    try {
      const response = await fetch('/api/coa/hierarchy');
      const data = await response.json();
      
      if (data.success) {
        // Convert to CSV format
        const csvContent = convertCOAToCSV(data.data);
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Chart_of_Accounts_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting COA:', error);
      alert('Failed to export Chart of Accounts');
    }
  };

  // Convert COA data to CSV format
  const convertCOAToCSV = (accounts) => {
    const headers = ['Account Code', 'Account Name', 'Account Type', 'Account Sub Type', 'Level', 'Normal Balance', 'Description', 'Construction Specific', 'VAT Applicable', 'Status'];
    const rows = [headers.join(',')];
    
    const flattenAccounts = (accountList, parentLevel = 0) => {
      accountList.forEach(account => {
        const row = [
          `"${account.accountCode}"`,
          `"${account.accountName}"`,
          `"${account.accountType}"`,
          `"${account.accountSubType || ''}"`,
          account.level,
          `"${account.normalBalance}"`,
          `"${account.description || ''}"`,
          account.constructionSpecific ? 'Yes' : 'No',
          account.vatApplicable ? 'Yes' : 'No',
          account.isActive ? 'Active' : 'Inactive'
        ];
        rows.push(row.join(','));
        
        if (account.SubAccounts && account.SubAccounts.length > 0) {
          flattenAccounts(account.SubAccounts, parentLevel + 1);
        }
      });
    };
    
    flattenAccounts(accounts);
    return rows.join('\n');
  };

  // Fetch financial data
  const fetchFinancialData = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const params = {
        subsidiary: selectedSubsidiary !== 'all' ? selectedSubsidiary : null,
        project: selectedProject !== 'all' ? selectedProject : null
      };
      
      const result = await FinancialAPIService.getFinancialDashboardData(params);
      setFinancialData(result);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTransactions = async (page = 1) => {
    setTransactionLoading(true);
    try {
      const params = {
        page: page,
        limit: 10,
        sort: 'date',
        order: 'desc'
      };
      
      // Add subsidiary filter if selected
      if (selectedSubsidiary !== 'all') {
        params.subsidiaryId = selectedSubsidiary;
      }
      
      // Add project filter if selected (more specific than subsidiary)
      if (selectedProject !== 'all') {
        params.projectId = selectedProject;
      }
      
      const response = await financeAPI.getTransactions(page, 10, params);
      
      if (response.success) {
        setTransactions(response.data || []);
        setTransactionSummary(response.summary || { income: 0, expense: 0, balance: 0 });
        setCurrentPage(response.pagination?.current || 1);
        setTotalPages(response.pagination?.total || 1);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setTransactionLoading(false);
    }
  };

  const fetchFinancialReports = async () => {
    setReportsLoading(true);
    try {
      const params = {};
      
      if (selectedSubsidiary !== 'all') {
        params.subsidiary_id = selectedSubsidiary;
      }
      
      if (selectedProject !== 'all') {
        params.project_id = selectedProject;
      }

      const response = await financeAPI.getFinancialReports(params);
      console.log('Financial Reports API Response:', response);
      
      if (response.success) {
        setFinancialReports(response.data);
      }
    } catch (error) {
      console.error('Error fetching financial reports:', error);
      setFinancialReports({
        incomeStatement: {},
        balanceSheet: {},
        cashFlow: {},
        summary: {}
      });
    } finally {
      setReportsLoading(false);
    }
  };

  // Transaction action handlers - Final Clean Version
  const handleViewTransaction = (transaction) => {
    console.log('🔍 View Transaction:', transaction.id);
    setSelectedTransaction(transaction);
    setShowViewModal(true);
  };

  const handleEditTransaction = (transaction) => {
    console.log('✏️ Edit Transaction:', transaction.id);
    setSelectedTransaction(transaction);
    setShowEditModal(true);
  };

  const handleDeleteTransaction = (transaction) => {
    console.log('🗑️ Delete Transaction:', transaction.id);
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };

  const confirmDeleteTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      const response = await financeAPI.delete(selectedTransaction.id);
      
      if (response.success) {
        setShowDeleteModal(false);
        setSelectedTransaction(null);
        fetchTransactions(); // Refresh the list
        alert('Transaction deleted successfully!');
      } else {
        throw new Error(response.error || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction: ' + error.message);
    }
  };

  const getSubsidiaryInfo = (transaction) => {
    if (!transaction.project || !transaction.project.subsidiaryId) {
      return {
        name: "Operasional Group Usaha",
        type: "general",
        color: "bg-gray-100 text-gray-800"
      };
    }
    
    const subsidiary = subsidiaries.find(sub => sub.id === transaction.project.subsidiaryId);
    return {
      name: subsidiary ? subsidiary.name : "Anak Usaha Tidak Dikenal",
      type: "subsidiary",
      color: "bg-blue-100 text-blue-800"
    };
  };

  useEffect(() => {
    fetchFinancialData();
    if (activeTab === 'transactions') {
      // Ensure subsidiaries are loaded before fetching transactions
      if (subsidiaries.length === 0 && !loadingSubsidiaries) {
        fetchSubsidiaries().then(() => {
          fetchTransactions();
        });
      } else {
        fetchTransactions();
      }
    } else if (activeTab === 'reports') {
      fetchFinancialReports();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubsidiary, selectedProject]);
  
  useEffect(() => {
    if (activeTab === 'transactions') {
      // Ensure subsidiaries are loaded before fetching transactions
      if (subsidiaries.length === 0 && !loadingSubsidiaries) {
        fetchSubsidiaries().then(() => {
          fetchTransactions();
        });
      } else {
        fetchTransactions();
      }
    } else if (activeTab === 'reports') {
      fetchFinancialReports();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Fetch subsidiaries when component mounts
  useEffect(() => {
    fetchSubsidiaries();
  }, []);

  // Fetch tax records when component mounts
  useEffect(() => {
    fetchTaxRecords();
  }, []);

  // Fetch projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects when subsidiary changes
  useEffect(() => {
    filterProjectsBySubsidiary(selectedSubsidiary);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubsidiary, projects]);

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
    { id: 'chart-of-accounts', label: 'Chart of Accounts', icon: BookOpen, description: 'Bagan akun standar PSAK dengan struktur hierarkis' },
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
            <ProjectFinanceIntegrationDashboard
              selectedSubsidiary={selectedSubsidiary}
              selectedProject={selectedProject}
            />
          </div>
        );

      case 'chart-of-accounts':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Chart of Accounts</h2>
                <p className="text-gray-600 mt-1">Bagan akun standar PSAK untuk perusahaan konstruksi</p>
              </div>
              <div className="flex space-x-3">
                <select 
                  value={selectedSubsidiary} 
                  onChange={(e) => setSelectedSubsidiary(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={loadingSubsidiaries}
                >
                  <option value="all">{loadingSubsidiaries ? 'Loading...' : 'Semua Anak Perusahaan'}</option>
                  {subsidiaries.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
                <button 
                  onClick={handleExportCOA}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export COA</span>
                </button>
              </div>
            </div>
            <ChartOfAccounts />
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
                  disabled={loadingSubsidiaries}
                >
                  <option value="all">{loadingSubsidiaries ? 'Loading...' : 'Semua Anak Perusahaan'}</option>
                  {subsidiaries.map(sub => (
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
              <button 
                onClick={() => setShowTaxForm(!showTaxForm)}
                className={`px-4 py-2 rounded-lg transition-colors duration-150 flex items-center space-x-2 ${
                  showTaxForm 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{showTaxForm ? 'Cancel' : 'New Tax Filing'}</span>
              </button>
            </div>

            {/* Tax Filing Form */}
            {showTaxForm && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Create New Tax Filing</h3>
                  <p className="text-sm text-gray-600 mt-1">Add a new tax obligation record</p>
                </div>
                
                <form onSubmit={handleSubmitTax} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tax Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Type *
                      </label>
                      <select
                        value={taxForm.type}
                        onChange={(e) => handleTaxFormChange('type', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="pajak_penghasilan">PPh (Pajak Penghasilan)</option>
                        <option value="ppn">PPN (Pajak Pertambahan Nilai)</option>
                        <option value="pph21">PPh 21 (Pajak Gaji)</option>
                        <option value="pph23">PPh 23 (Pajak Jasa)</option>
                        <option value="pph4_ayat2">PPh Final (Pasal 4 Ayat 2)</option>
                        <option value="other">Other Tax</option>
                      </select>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Amount (IDR) *
                      </label>
                      <input
                        type="number"
                        value={taxForm.amount}
                        onChange={(e) => handleTaxFormChange('amount', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    {/* Period */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Period (Month-Year) *
                      </label>
                      <input
                        type="month"
                        value={taxForm.period}
                        onChange={(e) => handleTaxFormChange('period', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Status *
                      </label>
                      <select
                        value={taxForm.status}
                        onChange={(e) => handleTaxFormChange('status', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="draft">Draft</option>
                        <option value="calculated">Calculated</option>
                        <option value="filed">Filed</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={taxForm.dueDate}
                        onChange={(e) => handleTaxFormChange('dueDate', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Tax Rate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        value={taxForm.taxRate}
                        onChange={(e) => handleTaxFormChange('taxRate', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={taxForm.description}
                      onChange={(e) => handleTaxFormChange('description', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter tax description or notes"
                    />
                  </div>

                  {/* Reference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      value={taxForm.reference}
                      onChange={(e) => handleTaxFormChange('reference', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SPT number, NTPN, or other reference"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTaxForm(false);
                        resetTaxForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      disabled={isSubmittingTax}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2"
                      disabled={isSubmittingTax}
                    >
                      {isSubmittingTax ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Create Tax Filing</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

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
                <h3 className="text-lg font-medium text-gray-900">Tax Filing Records</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
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
                    {loadingTaxRecords ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="text-gray-500 mt-2">Loading tax records...</p>
                        </td>
                      </tr>
                    ) : taxRecords.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Tax Records Found</h3>
                          <p className="text-gray-600 mb-4">No tax filings have been recorded yet.</p>
                          <button 
                            onClick={() => setShowTaxForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2 mx-auto"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add First Tax Filing</span>
                          </button>
                        </td>
                      </tr>
                    ) : taxRecords.map((tax) => (
                      <tr key={tax.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tax.reference || tax.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tax.type === 'pajak_penghasilan' ? 'PPh' :
                           tax.type === 'ppn' ? 'PPN' :
                           tax.type === 'pph21' ? 'PPh 21' :
                           tax.type === 'pph23' ? 'PPh 23' :
                           tax.type === 'pph4_ayat2' ? 'PPh Final' :
                           tax.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tax.period}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(tax.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            tax.status === 'paid' ? 'bg-green-100 text-green-800' :
                            tax.status === 'filed' ? 'bg-blue-100 text-blue-800' :
                            tax.status === 'calculated' ? 'bg-yellow-100 text-yellow-800' :
                            tax.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {tax.status === 'paid' ? 'Paid' : 
                             tax.status === 'filed' ? 'Filed' :
                             tax.status === 'calculated' ? 'Calculated' :
                             tax.status === 'draft' ? 'Draft' :
                             'Overdue'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tax.dueDate ? new Date(tax.dueDate).toLocaleDateString('id-ID') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Project Integration for Tax Management */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                Project Tax Overview
              </h3>
              <ProjectFinanceIntegrationDashboard
                selectedSubsidiary={selectedSubsidiary}
                selectedProject={selectedProject}
                compact={true}
              />
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Financial Reports (PSAK Compliant)</h2>
              <div className="flex space-x-3">
                <select 
                  value={selectedSubsidiary} 
                  onChange={(e) => {
                    setSelectedSubsidiary(e.target.value);
                    // Project filter akan otomatis terupdate melalui useEffect
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={loadingSubsidiaries}
                >
                  <option value="all">{loadingSubsidiaries ? 'Loading...' : 'Semua Anak Perusahaan'}</option>
                  {subsidiaries.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
                <select 
                  value={selectedProject} 
                  onChange={(e) => {
                    setSelectedProject(e.target.value);
                    fetchFinancialReports();
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={loadingProjects}
                >
                  <option value="all">{loadingProjects ? 'Loading Projects...' : 'All Projects'}</option>
                  {filteredProjects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export All Reports</span>
                </button>
              </div>
            </div>

            {reportsLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Income Statement */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Income Statement</h3>
                    <Receipt className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="font-semibold text-green-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(financialReports.incomeStatement?.revenue || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Direct Costs</span>
                      <span className="font-semibold text-red-600">
                        ({new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(financialReports.incomeStatement?.directCosts || 0)})
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-sm text-gray-600">Gross Profit</span>
                      <span className="font-semibold text-blue-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(financialReports.incomeStatement?.grossProfit || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Indirect Costs</span>
                      <span className="font-semibold text-red-600">
                        ({new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(financialReports.incomeStatement?.indirectCosts || 0)})
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3 font-bold">
                      <span className="text-gray-900">Net Income</span>
                      <span className={`${(financialReports.incomeStatement?.netIncome || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(financialReports.incomeStatement?.netIncome || 0)}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveDetailedReport(activeDetailedReport === 'income' ? null : 'income')}
                    className={`mt-4 w-full py-2 rounded-lg transition-colors text-sm font-medium ${
                      activeDetailedReport === 'income' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {activeDetailedReport === 'income' ? 'Hide Detailed Report' : 'View Detailed Report'}
                  </button>
                </div>

                {/* Balance Sheet */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Balance Sheet</h3>
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Total Assets</span>
                      <span className="font-semibold text-blue-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(financialReports.balanceSheet?.totalAssets || 0)}
                      </span>
                    </div>
                    <div className="ml-2 space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>• Current Assets</span>
                        <span>
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(financialReports.balanceSheet?.currentAssets || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>• Fixed Assets</span>
                        <span>
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(financialReports.balanceSheet?.fixedAssets || 0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Total Liabilities</span>
                      <span className="font-semibold text-red-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(financialReports.balanceSheet?.totalLiabilities || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3 font-bold">
                      <span className="text-gray-900">Total Equity</span>
                      <span className="text-emerald-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(financialReports.balanceSheet?.totalEquity || 0)}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveDetailedReport(activeDetailedReport === 'balance' ? null : 'balance')}
                    className={`mt-4 w-full py-2 rounded-lg transition-colors text-sm font-medium ${
                      activeDetailedReport === 'balance' 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {activeDetailedReport === 'balance' ? 'Hide Balance Sheet' : 'View Balance Sheet'}
                  </button>
                </div>

                {/* Cash Flow */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Cash Flow</h3>
                    <Activity className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Operating Cash Flow</span>
                      <span className={`font-semibold ${(financialReports.cashFlow?.operatingCashFlow || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(financialReports.cashFlow?.operatingCashFlow || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Investing Cash Flow</span>
                      <span className={`font-semibold ${(financialReports.cashFlow?.investingCashFlow || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(financialReports.cashFlow?.investingCashFlow || 0) < 0 ? '(' : ''}
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(financialReports.cashFlow?.investingCashFlow || 0))}
                        {(financialReports.cashFlow?.investingCashFlow || 0) < 0 ? ')' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Financing Cash Flow</span>
                      <span className={`font-semibold ${(financialReports.cashFlow?.financingCashFlow || 0) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(financialReports.cashFlow?.financingCashFlow || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3 font-bold">
                      <span className="text-gray-900">Net Cash Change</span>
                      <span className={`${(financialReports.cashFlow?.netCashChange || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(financialReports.cashFlow?.netCashChange || 0)}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveDetailedReport(activeDetailedReport === 'cashflow' ? null : 'cashflow')}
                    className={`mt-4 w-full py-2 rounded-lg transition-colors text-sm font-medium ${
                      activeDetailedReport === 'cashflow' 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {activeDetailedReport === 'cashflow' ? 'Hide Cash Flow Statement' : 'View Cash Flow Statement'}
                  </button>
                </div>
              </div>
            )}

            {/* Detailed Report Sections */}
            {activeDetailedReport === 'income' && (
              <InlineIncomeStatement 
                data={financialReports}
                onClose={() => setActiveDetailedReport(null)}
              />
            )}

            {activeDetailedReport === 'balance' && (
              <InlineBalanceSheet 
                data={financialReports}
                onClose={() => setActiveDetailedReport(null)}
              />
            )}

            {activeDetailedReport === 'cashflow' && (
              <InlineCashFlowStatement 
                data={financialReports}
                onClose={() => setActiveDetailedReport(null)}
              />
            )}

            {/* Summary Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Report Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {financialReports.summary?.totalTransactions || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {new Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR', 
                      minimumFractionDigits: 0,
                      notation: 'compact'
                    }).format(financialReports.summary?.totalIncome || 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Income</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {new Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR', 
                      minimumFractionDigits: 0,
                      notation: 'compact'
                    }).format(financialReports.summary?.totalExpense || 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${(financialReports.summary?.netBalance || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {new Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR', 
                      minimumFractionDigits: 0,
                      notation: 'compact'
                    }).format(financialReports.summary?.netBalance || 0)}
                  </p>
                  <p className="text-sm text-gray-600">Net Balance</p>
                </div>
              </div>
            </div>

            {/* Project Integration Summary */}
            {financialReports.projectIntegration && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                  Project Integration Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {financialReports.projectIntegration.totalProjects || 0}
                    </p>
                    <p className="text-sm text-gray-600">Active Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {financialReports.summary?.projectTransactions || 0}
                    </p>
                    <p className="text-sm text-gray-600">Project Transactions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {financialReports.projectIntegration.poIntegration?.totalPOTransactions || 0}
                    </p>
                    <p className="text-sm text-gray-600">PO Transactions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {financialReports.projectIntegration.poIntegration?.poPercentage || 0}%
                    </p>
                    <p className="text-sm text-gray-600">PO Coverage</p>
                  </div>
                </div>

                {/* Project Breakdown */}
                {(Object.keys(financialReports.summary?.projectBreakdown?.income || {}).length > 0 || 
                  Object.keys(financialReports.summary?.projectBreakdown?.expense || {}).length > 0) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Project Income Breakdown */}
                    {Object.keys(financialReports.summary?.projectBreakdown?.income || {}).length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                          Project Income Breakdown
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(financialReports.summary.projectBreakdown.income).map(([project, amount]) => (
                            <div key={project} className="flex justify-between items-center p-2 bg-green-50 rounded">
                              <span className="text-sm text-gray-700 truncate">{project}</span>
                              <span className="text-sm font-semibold text-green-600">
                                {new Intl.NumberFormat('id-ID', { 
                                  style: 'currency', 
                                  currency: 'IDR', 
                                  minimumFractionDigits: 0,
                                  notation: 'compact'
                                }).format(amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Project Expense Breakdown */}
                    {Object.keys(financialReports.summary?.projectBreakdown?.expense || {}).length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <TrendingDown className="w-4 h-4 mr-2 text-red-500" />
                          Project Expense Breakdown
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(financialReports.summary.projectBreakdown.expense).map(([project, amount]) => (
                            <div key={project} className="flex justify-between items-center p-2 bg-red-50 rounded">
                              <span className="text-sm text-gray-700 truncate">{project}</span>
                              <span className="text-sm font-semibold text-red-600">
                                {new Intl.NumberFormat('id-ID', { 
                                  style: 'currency', 
                                  currency: 'IDR', 
                                  minimumFractionDigits: 0,
                                  notation: 'compact'
                                }).format(amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
                  onChange={(e) => {
                    setSelectedSubsidiary(e.target.value);
                    setCurrentPage(1);
                    // Project filter akan otomatis terupdate melalui useEffect
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={loadingSubsidiaries}
                >
                  <option value="all">{loadingSubsidiaries ? 'Loading...' : 'Semua Anak Perusahaan'}</option>
                  {subsidiaries.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
                <select 
                  value={selectedProject} 
                  onChange={(e) => {
                    setSelectedProject(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={loadingProjects}
                >
                  <option value="all">{loadingProjects ? 'Loading Projects...' : 'All Projects'}</option>
                  {filteredProjects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                <button 
                  onClick={() => setShowTransactionForm(!showTransactionForm)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-150 flex items-center space-x-2 ${
                    showTransactionForm 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>{showTransactionForm ? 'Cancel' : 'New Transaction'}</span>
                </button>
              </div>
            </div>

            {/* Transaction Form */}
            {showTransactionForm && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Create New Transaction</h3>
                  <p className="text-sm text-gray-600 mt-1">Add a new financial transaction to your records</p>
                </div>
                
                <form onSubmit={handleSubmitTransaction} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Transaction Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction Type *
                      </label>
                      <select
                        value={transactionForm.type}
                        onChange={(e) => handleTransactionFormChange('type', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                        <option value="transfer">Transfer</option>
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={transactionForm.category}
                        onChange={(e) => handleTransactionFormChange('category', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Materials">Materials</option>
                        <option value="Labor">Labor</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Subcontractor">Subcontractor</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Administrative">Administrative</option>
                        <option value="Project Revenue">Project Revenue</option>
                        <option value="Other Income">Other Income</option>
                        <option value="Other Expense">Other Expense</option>
                      </select>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount (IDR) *
                      </label>
                      <input
                        type="number"
                        value={transactionForm.amount}
                        onChange={(e) => handleTransactionFormChange('amount', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction Date *
                      </label>
                      <input
                        type="date"
                        value={transactionForm.date}
                        onChange={(e) => handleTransactionFormChange('date', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Project ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project
                      </label>
                      <select
                        value={transactionForm.projectId}
                        onChange={(e) => handleTransactionFormChange('projectId', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loadingProjects}
                      >
                        <option value="">{loadingProjects ? 'Loading Projects...' : 'No Project'}</option>
                        {filteredProjects.map(project => (
                          <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <select
                        value={transactionForm.paymentMethod}
                        onChange={(e) => handleTransactionFormChange('paymentMethod', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cash">Cash</option>
                        <option value="check">Check</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={transactionForm.description}
                      onChange={(e) => handleTransactionFormChange('description', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter transaction description"
                    />
                  </div>

                  {/* Reference Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      value={transactionForm.referenceNumber}
                      onChange={(e) => handleTransactionFormChange('referenceNumber', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Invoice number, receipt number, etc."
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={transactionForm.notes}
                      onChange={(e) => handleTransactionFormChange('notes', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Additional notes or comments"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTransactionForm(false);
                        resetTransactionForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      disabled={isSubmittingTransaction}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2"
                      disabled={isSubmittingTransaction}
                    >
                      {isSubmittingTransaction ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Create Transaction</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Project Integration Dashboard */}
            <ProjectFinanceIntegrationDashboard
              selectedSubsidiary={selectedSubsidiary}
              selectedProject={selectedProject}
            />

            {/* Transaction Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-50">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transactionSummary.income)}
                    </p>
                    <p className="text-xs text-green-500">Revenue & Payments</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-red-50">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transactionSummary.expense)}
                    </p>
                    <p className="text-xs text-red-500">Costs & Payments</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Net Balance</p>
                    <p className={`text-2xl font-bold ${transactionSummary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transactionSummary.balance)}
                    </p>
                    <p className="text-xs text-blue-500">Current Balance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
              </div>
              
              {transactionLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-12 text-center">
                  <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Transactions Found</h3>
                  <p className="text-gray-600 mb-4">
                    No financial transactions have been recorded yet.
                  </p>
                  <button 
                    onClick={() => setShowTransactionForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Transaction</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subsidiary
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reference
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purchase Order
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => {
                        const subsidiaryInfo = getSubsidiaryInfo(transaction);
                        
                        return (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(transaction.date).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div>
                                <div className="font-medium">{transaction.desc || 'No description'}</div>
                                {transaction.projectId && (
                                  <div className="text-xs text-gray-500">Project: {transaction.projectId}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {transaction.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.type === 'income' ? 'Income' : 'Expense'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                {transaction.type === 'income' ? '+' : '-'}
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transaction.amount)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 text-xs rounded-full ${subsidiaryInfo.color}`}>
                                {subsidiaryInfo.name}
                              </span>
                              {subsidiaryInfo.type === 'general' && (
                                <div className="text-xs text-gray-400 mt-1">Pengeluaran Operasional</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {transaction.status === 'completed' ? 'Completed' :
                                 transaction.status === 'pending' ? 'Pending' : transaction.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                              {transaction.referenceNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {transaction.purchaseOrder ? (
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <ShoppingCart className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-blue-600">{transaction.purchaseOrder.poNumber}</span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Supplier: {transaction.purchaseOrder.supplierName}
                                  </div>
                                  <div className="text-xs">
                                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                                      transaction.purchaseOrder.status === 'approved' ? 'bg-green-100 text-green-700' :
                                      transaction.purchaseOrder.status === 'received' ? 'bg-blue-100 text-blue-700' :
                                      transaction.purchaseOrder.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      PO: {transaction.purchaseOrder.status}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs">No PO</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewTransaction(transaction)}
                                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                  type="button"
                                >
                                  Detail
                                </button>
                                <button
                                  onClick={() => handleEditTransaction(transaction)}
                                  className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                  type="button"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteTransaction(transaction)}
                                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                  type="button"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                            fetchTransactions(currentPage - 1);
                          }
                        }}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => {
                          if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                            fetchTransactions(currentPage + 1);
                          }
                        }}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
                    disabled={loadingSubsidiaries}
                  >
                    <option value="all">{loadingSubsidiaries ? 'Loading...' : 'All Subsidiaries'}</option>
                    {subsidiaries.map(sub => (
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

        {/* MODALS - Simple Implementation */}
        
        {/* Simple Test Modal */}
        {showViewModal && createPortal(
          <div 
            id="modal-root-view"
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
            style={{ 
              zIndex: 99999,
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }}
          >
            <div 
              className="bg-white rounded-lg p-6 w-96 shadow-xl"
              style={{ 
                backgroundColor: 'white',
                maxHeight: '90vh', 
                overflow: 'auto',
                position: 'relative',
                zIndex: 100000
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Detail Transaksi</h3>
                <button
                  onClick={() => {
                    console.log('🔍 Closing modal');
                    setShowViewModal(false);
                    setSelectedTransaction(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
              
              {selectedTransaction && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ID</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.id}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.desc || 'No description'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Jumlah</label>
                    <p className="text-sm font-semibold text-red-600">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedTransaction.amount)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.date}</p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        setSelectedTransaction(null);
                      }}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

        {/* Edit Transaction Modal */}
        {showEditModal && selectedTransaction && createPortal(
          <div 
            id="modal-root-edit"
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
            style={{ 
              zIndex: 99999,
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }}
          >
            <div 
              className="bg-white rounded-lg p-6 w-96 shadow-xl"
              style={{ 
                backgroundColor: 'white',
                position: 'relative',
                zIndex: 100000
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Transaksi</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedTransaction(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    defaultValue={selectedTransaction.desc}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                  <input
                    type="number"
                    defaultValue={selectedTransaction.amount}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedTransaction(null);
                    }}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      alert('Edit functionality will be implemented');
                      setShowEditModal(false);
                      setSelectedTransaction(null);
                    }}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Delete Transaction Modal */}
        {showDeleteModal && selectedTransaction && createPortal(
          <div 
            id="modal-root-delete"
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
            style={{ 
              zIndex: 99999,
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }}
          >
            <div 
              className="bg-white rounded-lg p-6 w-96 shadow-xl"
              style={{ 
                backgroundColor: 'white',
                position: 'relative',
                zIndex: 100000
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-red-600">Hapus Transaksi</h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedTransaction(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  Apakah Anda yakin ingin menghapus transaksi ini?
                </p>
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">{selectedTransaction.desc}</p>
                  <p className="text-sm text-gray-600">
                    {selectedTransaction.date} - 
                    <span className="text-red-600 font-semibold">
                      {' '}{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedTransaction.amount)}
                    </span>
                  </p>
                </div>
                <p className="text-red-600 text-sm mt-2">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedTransaction(null);
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    try {
                      // Call delete API
                      const response = await financeAPI.deleteTransaction(selectedTransaction.id);
                      
                      if (response.success) {
                        alert(`Transaction ${selectedTransaction.id} berhasil dihapus!`);
                        setShowDeleteModal(false);
                        setSelectedTransaction(null);
                        
                        // Refresh transaction list
                        fetchTransactions();
                      } else {
                        throw new Error(response.error || 'Failed to delete transaction');
                      }
                    } catch (error) {
                      console.error('Delete error:', error);
                      alert(`Error menghapus transaksi: ${error.message}`);
                    }
                  }}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default Finance;
