import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  ChevronRight,
  ChevronDown,
  DollarSign,
  Building2,
  Package,
  Users,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';

const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [lastUpdate, setLastUpdate] = useState(null);
  const [totalBalances, setTotalBalances] = useState({ totalDebit: 0, totalCredit: 0 });
  
  // Modal and form states
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showAddEntityModal, setShowAddEntityModal] = useState(false);
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loadingSubsidiaries, setLoadingSubsidiaries] = useState(false);
  const [addAccountForm, setAddAccountForm] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'ASSET',
    accountSubType: '',
    parentAccountId: '',
    level: 1,
    normalBalance: 'DEBIT',
    description: '',
    constructionSpecific: false,
    projectCostCenter: false,
    vatApplicable: false,
    taxDeductible: false
  });

  // Debug modal state
  useEffect(() => {
    console.log('Modal state:', showAddAccountModal);
  }, [showAddAccountModal]);  const fetchAccounts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Include balance information for real-time data
      const response = await axios.get('/api/coa/hierarchy?include_balances=true');
      
      if (response.data.success) {
        const accountsData = response.data.data || [];
        setAccounts(accountsData);
        
        // Calculate total balances
        const calculateTotals = (accounts) => {
          return accounts.reduce((totals, account) => {
            totals.totalDebit += account.debit || 0;
            totals.totalCredit += account.credit || 0;
            
            // Include child accounts
            if (account.children && account.children.length > 0) {
              const childTotals = calculateTotals(account.children);
              totals.totalDebit += childTotals.totalDebit;
              totals.totalCredit += childTotals.totalCredit;
            }
            
            return totals;
          }, { totalDebit: 0, totalCredit: 0 });
        };
        
        const totals = calculateTotals(accountsData);
        setTotalBalances(totals);
        setLastUpdate(new Date());
      } else {
        throw new Error(response.data.message || 'Failed to fetch accounts');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load accounts');
      setAccounts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchSubsidiaries = useCallback(async () => {
    try {
      setLoadingSubsidiaries(true);
      const response = await axios.get('/api/subsidiaries');
      
      if (response.data.success) {
        setSubsidiaries(response.data.data || []);
      } else {
        console.error('Failed to fetch subsidiaries:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching subsidiaries:', error);
    } finally {
      setLoadingSubsidiaries(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
    
    // Auto-refresh every 30 seconds for real-time data
    const interval = setInterval(() => {
      fetchAccounts(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAccounts]);

  const handleRefresh = () => {
    fetchAccounts(true);
  };

  const toggleNode = (accountId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedNodes(newExpanded);
  };

  // Handler functions for modals and forms
  const handleAddAccountFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddAccountForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAccountSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/coa', {
        ...addAccountForm,
        id: `COA-${Date.now()}` // Generate unique ID
      });
      
      if (response.data.success) {
        setShowAddAccountModal(false);
        setAddAccountForm({
          accountCode: '',
          accountName: '',
          accountType: 'ASSET',
          accountSubType: '',
          parentAccountId: '',
          level: 1,
          normalBalance: 'DEBIT',
          description: '',
          constructionSpecific: false,
          projectCostCenter: false,
          vatApplicable: false,
          taxDeductible: false
        });
        fetchAccounts(true); // Refresh accounts
      }
    } catch (error) {
      console.error('Error adding account:', error);
      alert('Failed to add account. Please try again.');
    }
  };

  const handleAddEntitySubmit = async (e) => {
    e.preventDefault();
    // For now, we'll use a placeholder - this would need proper entity management
    alert('Add Entity functionality will be implemented based on your entity requirements');
    setShowAddEntityModal(false);
  };

  // Export COA to CSV
  const handleExportCOA = () => {
    try {
      // Flatten all accounts (including sub accounts) into a single array
      const flattenAccounts = (accounts, level = 0) => {
        let result = [];
        accounts.forEach(account => {
          result.push({
            ...account,
            level: level + 1
          });
          if (account.SubAccounts && account.SubAccounts.length > 0) {
            result = result.concat(flattenAccounts(account.SubAccounts, level + 1));
          }
        });
        return result;
      };

      const allAccounts = flattenAccounts(accounts);
      
      // Create CSV content
      const headers = [
        'Account Code',
        'Account Name', 
        'Account Type',
        'Sub Type',
        'Level',
        'Normal Balance',
        'Construction Specific',
        'Project Cost Center',
        'VAT Applicable',
        'Tax Deductible',
        'Description',
        'Status'
      ];

      const csvContent = [
        headers.join(','),
        ...allAccounts.map(account => [
          account.accountCode,
          `"${account.accountName}"`,
          account.accountType,
          account.accountSubType || '',
          account.level,
          account.normalBalance,
          account.constructionSpecific ? 'Yes' : 'No',
          account.projectCostCenter ? 'Yes' : 'No',
          account.vatApplicable ? 'Yes' : 'No',
          account.taxDeductible ? 'Yes' : 'No',
          `"${account.description || ''}"`,
          account.isActive ? 'Active' : 'Inactive'
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `chart-of-accounts-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`Exported ${allAccounts.length} accounts to CSV`);
    } catch (error) {
      console.error('Error exporting COA:', error);
      alert('Failed to export Chart of Accounts. Please try again.');
    }
  };

  // Count total accounts including sub accounts
  const getTotalAccountCount = (accounts) => {
    let count = 0;
    accounts.forEach(account => {
      count += 1; // Count current account
      if (account.SubAccounts && account.SubAccounts.length > 0) {
        count += getTotalAccountCount(account.SubAccounts); // Recursively count sub accounts
      }
    });
    return count;
  };

  const getAccountTypeIcon = (type) => {
    const icons = {
      'ASSET': <Package className="text-green-600" size={16} />,
      'LIABILITY': <DollarSign className="text-red-600" size={16} />,
      'EQUITY': <Building2 className="text-blue-600" size={16} />,
      'REVENUE': <TrendingUp className="text-purple-600" size={16} />,
      'EXPENSE': <Users className="text-orange-600" size={16} />
    };
    return icons[type] || <FileText size={16} />;
  };

  const getAccountTypeColor = (type) => {
    const colors = {
      'ASSET': 'text-green-800 bg-green-100',
      'LIABILITY': 'text-red-800 bg-red-100',
      'EQUITY': 'text-blue-800 bg-blue-100',
      'REVENUE': 'text-purple-800 bg-purple-100',
      'EXPENSE': 'text-orange-800 bg-orange-100'
    };
    return colors[type] || 'text-gray-800 bg-gray-100';
  };

  const renderAccount = (account, level = 0) => {
    const hasSubAccounts = account.SubAccounts && account.SubAccounts.length > 0;
    const isExpanded = expandedNodes.has(account.id);
    const paddingLeft = level * 24;

    return (
      <div key={account.id} className="border-b border-gray-100">
        <div 
          className="flex items-center py-3 hover:bg-gray-50 cursor-pointer"
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
          onClick={() => hasSubAccounts && toggleNode(account.id)}
        >
          <div className="flex items-center flex-1">
            {hasSubAccounts && (
              <button className="mr-2 p-1">
                {isExpanded ? 
                  <ChevronDown size={16} className="text-gray-400" /> : 
                  <ChevronRight size={16} className="text-gray-400" />
                }
              </button>
            )}
            {!hasSubAccounts && <div className="w-6" />}
            
            <div className="mr-3">
              {getAccountTypeIcon(account.accountType)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-mono text-sm text-gray-600 mr-3">
                    {account.accountCode}
                  </span>
                  <span className="font-medium text-gray-900">
                    {account.accountName}
                  </span>
                  {account.constructionSpecific && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Konstruksi
                    </span>
                  )}
                  {account.projectCostCenter && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Cost Center
                    </span>
                  )}
                </div>
                
                {/* Balance Information */}
                <div className="flex items-center space-x-4">
                  {(account.debit > 0 || account.credit > 0) && (
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        account.balance > 0 ? 'text-green-600' : 
                        account.balance < 0 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {account.balance > 0 ? '+' : account.balance < 0 ? '-' : ''}
                        {new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0 
                        }).format(Math.abs(account.balance || 0))}
                      </div>
                      <div className="text-xs text-gray-500">
                        D: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(account.debit || 0)} |
                        C: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(account.credit || 0)}
                      </div>
                    </div>
                  )}
                  
                  <span className={`text-xs px-2 py-1 rounded-full ${getAccountTypeColor(account.accountType)}`}>
                    {account.accountType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {hasSubAccounts && isExpanded && (
          <div>
            {account.SubAccounts.map(subAccount => renderAccount(subAccount, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Filter accounts based on search and type filter
  useEffect(() => {
    const filtered = accounts.filter(account => {
      const matchesSearch = searchTerm === '' || 
        account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountCode.includes(searchTerm);
      
      const matchesType = filterType === '' || account.accountType === filterType;
      
      return matchesSearch && matchesType;
    });
    setFilteredAccounts(filtered);
  }, [accounts, searchTerm, filterType]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">Chart of Accounts</h1>
            {!error && accounts.length > 0 && (
              <span className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                <CheckCircle size={14} className="mr-1" />
                {getTotalAccountCount(accounts)} accounts loaded
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-1">
            Bagan akun standar industri konstruksi sesuai PSAK - Real-time data
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            onClick={() => {
              console.log('Add Account button clicked');
              setShowAddAccountModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Tambah Akun
          </button>
          <button 
            onClick={() => {
              setShowAddEntityModal(true);
              fetchSubsidiaries();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition-colors"
          >
            <Building2 size={16} className="mr-2" />
            Kelola Entitas
          </button>
        </div>
      </div>

      {/* Summary Panel */}
      {!loading && !error && accounts.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('id-ID', { 
                  style: 'currency', 
                  currency: 'IDR',
                  minimumFractionDigits: 0 
                }).format(totalBalances.totalDebit)}
              </div>
              <div className="text-sm text-gray-600">Total Debit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('id-ID', { 
                  style: 'currency', 
                  currency: 'IDR',
                  minimumFractionDigits: 0 
                }).format(totalBalances.totalCredit)}
              </div>
              <div className="text-sm text-gray-600">Total Credit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                {Math.abs(totalBalances.totalDebit - totalBalances.totalCredit) < 0.01 ? 
                  <span className="text-green-600">✓ Balanced</span> : 
                  <span className="text-red-600">⚠ Unbalanced</span>
                }
              </div>
              <div className="text-sm text-gray-600">
                {lastUpdate && `Last Update: ${lastUpdate.toLocaleTimeString('id-ID')}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="text-red-600 mr-3" size={20} />
            <div>
              <h3 className="text-red-800 font-medium">Error loading accounts</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button 
                onClick={handleRefresh}
                className="text-red-600 hover:text-red-800 text-sm font-medium mt-2 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari nama akun atau kode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Tipe</option>
              <option value="ASSET">Asset</option>
              <option value="LIABILITY">Kewajiban</option>
              <option value="EQUITY">Ekuitas</option>
              <option value="REVENUE">Pendapatan</option>
              <option value="EXPENSE">Beban</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Tree */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Struktur Akun</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredAccounts.map(account => renderAccount(account))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'].map(type => {
          const count = accounts.reduce((acc, account) => {
            const countSubAccounts = (acc, subAccounts) => {
              return subAccounts.reduce((subAcc, subAccount) => {
                if (subAccount.accountType === type) subAcc++;
                if (subAccount.SubAccounts) {
                  subAcc += countSubAccounts(0, subAccount.SubAccounts);
                }
                return subAcc;
              }, acc);
            };
            
            if (account.accountType === type) acc++;
            if (account.SubAccounts) {
              acc = countSubAccounts(acc, account.SubAccounts);
            }
            return acc;
          }, 0);

          return (
            <div key={type} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="mr-3">
                  {getAccountTypeIcon(type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{type}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Account Modal */}
      {showAddAccountModal && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" 
          style={{
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} 
          onClick={(e) => e.target === e.currentTarget && setShowAddAccountModal(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl"
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              width: '100%',
              maxWidth: '28rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tambah Akun Baru</h3>
              <button
                onClick={() => {
                  console.log('🔄 Close modal clicked');
                  setShowAddAccountModal(false);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Akun *</label>
                <input
                  type="text"
                  name="accountCode"
                  value={addAccountForm.accountCode}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1103"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Akun *</label>
                <input
                  type="text"
                  name="accountName"
                  value={addAccountForm.accountName}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Piutang Lain-lain"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Akun *</label>
                <select
                  name="accountType"
                  value={addAccountForm.accountType}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="ASSET">Asset</option>
                  <option value="LIABILITY">Kewajiban</option>
                  <option value="EQUITY">Ekuitas</option>
                  <option value="REVENUE">Pendapatan</option>
                  <option value="EXPENSE">Beban</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Tipe</label>
                <input
                  type="text"
                  name="accountSubType"
                  value={addAccountForm.accountSubType}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., CURRENT_ASSET"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Account ID</label>
                <select
                  name="parentAccountId"
                  value={addAccountForm.parentAccountId}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Parent Account --</option>
                  {accounts.filter(acc => acc.level < 4).map(account => (
                    <option key={account.id} value={account.id}>
                      {account.accountCode} - {account.accountName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                <select
                  name="level"
                  value={addAccountForm.level}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={1}>1 - Main Group</option>
                  <option value={2}>2 - Sub Group</option>
                  <option value={3}>3 - Detail Account</option>
                  <option value={4}>4 - Sub Detail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Normal Balance *</label>
                <select
                  name="normalBalance"
                  value={addAccountForm.normalBalance}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="DEBIT">Debit</option>
                  <option value="CREDIT">Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={addAccountForm.description}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Jelaskan fungsi akun ini..."
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="constructionSpecific"
                    checked={addAccountForm.constructionSpecific}
                    onChange={handleAddAccountFormChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Spesifik Konstruksi</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="projectCostCenter"
                    checked={addAccountForm.projectCostCenter}
                    onChange={handleAddAccountFormChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Project Cost Center</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="vatApplicable"
                    checked={addAccountForm.vatApplicable}
                    onChange={handleAddAccountFormChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">VAT Applicable</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="taxDeductible"
                    checked={addAccountForm.taxDeductible}
                    onChange={handleAddAccountFormChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Tax Deductible</span>
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Tambah Akun
                </button>
              </div>
            </form>
          </div>
        </div>, 
        document.body
      )}

      {/* Subsidiaries Management Modal */}
      {showAddEntityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Manajemen Entitas/Subsidiaries</h3>
              <button
                onClick={() => setShowAddEntityModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {loadingSubsidiaries ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  Berikut adalah daftar anak perusahaan/subsidiaries yang terdaftar dalam sistem:
                </div>
                
                <div className="grid gap-4">
                  {subsidiaries.map((subsidiary) => (
                    <div key={subsidiary.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{subsidiary.name}</h4>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {subsidiary.code}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              subsidiary.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {subsidiary.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{subsidiary.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Spesialisasi:</span>
                              <span className="ml-2 capitalize">{subsidiary.specialization}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Karyawan:</span>
                              <span className="ml-2">{subsidiary.employeeCount} orang</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Didirikan:</span>
                              <span className="ml-2">{subsidiary.establishedYear}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Kota:</span>
                              <span className="ml-2">{subsidiary.address?.city || 'N/A'}</span>
                            </div>
                          </div>
                          
                          {subsidiary.certification && subsidiary.certification.length > 0 && (
                            <div className="mt-2">
                              <span className="font-medium text-gray-700 text-sm">Sertifikasi:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {subsidiary.certification.map((cert, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                                    {cert}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {subsidiaries.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Tidak ada data subsidiaries yang ditemukan.
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
              <button
                onClick={() => setShowAddEntityModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartOfAccounts;
