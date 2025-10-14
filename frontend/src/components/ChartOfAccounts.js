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
    
    // Auto-refresh removed to save resources
    // Users can manually refresh using the refresh button
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
      'ASSET': <Package style={{ color: "#32D74B" }} size={16} />,
      'LIABILITY': <DollarSign style={{ color: "#FF453A" }} size={16} />,
      'EQUITY': <Building2 style={{ color: "#0A84FF" }} size={16} />,
      'REVENUE': <TrendingUp style={{ color: "#BF5AF2" }} size={16} />,
      'EXPENSE': <Users style={{ color: "#FF9F0A" }} size={16} />
    };
    return icons[type] || <FileText size={16} />;
  };

  const getAccountTypeColor = (type) => {
    const colors = {
      'ASSET': { bg: 'rgba(50, 215, 75, 0.15)', color: '#32D74B' },
      'LIABILITY': { bg: 'rgba(255, 69, 58, 0.15)', color: '#FF453A' },
      'EQUITY': { bg: 'rgba(10, 132, 255, 0.15)', color: '#0A84FF' },
      'REVENUE': { bg: 'rgba(191, 90, 242, 0.15)', color: '#BF5AF2' },
      'EXPENSE': { bg: 'rgba(255, 159, 10, 0.15)', color: '#FF9F0A' }
    };
    return colors[type] || { bg: 'rgba(152, 152, 157, 0.15)', color: '#98989D' };
  };

  const renderAccount = (account, level = 0) => {
    const hasSubAccounts = account.SubAccounts && account.SubAccounts.length > 0;
    const isExpanded = expandedNodes.has(account.id);
    const paddingLeft = level * 24;

    return (
      <div key={account.id} style={{ borderBottom: "1px solid #38383A" }}>
        <div 
          className="flex items-center py-3 cursor-pointer transition-colors duration-150"
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
          onClick={() => hasSubAccounts && toggleNode(account.id)}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div className="flex items-center flex-1">
            {hasSubAccounts && (
              <button className="mr-2 p-1">
                {isExpanded ? 
                  <ChevronDown size={16} style={{ color: "#98989D" }} /> : 
                  <ChevronRight size={16} style={{ color: "#98989D" }} />
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
                  <span className="font-mono text-sm mr-3" style={{ color: "#98989D" }}>
                    {account.accountCode}
                  </span>
                  <span className="font-medium" style={{ color: "#FFFFFF" }}>
                    {account.accountName}
                  </span>
                  {account.constructionSpecific && (
                    <span className="ml-2 text-xs px-2 py-1 rounded" style={{ backgroundColor: "rgba(10, 132, 255, 0.15)", color: "#0A84FF" }}>
                      Konstruksi
                    </span>
                  )}
                  {account.projectCostCenter && (
                    <span className="ml-2 text-xs px-2 py-1 rounded" style={{ backgroundColor: "rgba(50, 215, 75, 0.15)", color: "#32D74B" }}>
                      Cost Center
                    </span>
                  )}
                </div>
                
                {/* Balance Information */}
                <div className="flex items-center space-x-4">
                  {(account.debit > 0 || account.credit > 0) && (
                    <div className="text-right">
                      <div className={`text-sm font-medium`} style={{
                        color: account.balance > 0 ? '#32D74B' : account.balance < 0 ? '#FF453A' : '#FFFFFF'
                      }}>
                        {account.balance > 0 ? '+' : account.balance < 0 ? '-' : ''}
                        {new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0 
                        }).format(Math.abs(account.balance || 0))}
                      </div>
                      <div className="text-xs" style={{ color: "#636366" }}>
                        D: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(account.debit || 0)} |
                        C: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(account.credit || 0)}
                      </div>
                    </div>
                  )}
                  
                  <span className={`text-xs px-2 py-1 rounded-full`} style={{
                    backgroundColor: getAccountTypeColor(account.accountType).bg,
                    color: getAccountTypeColor(account.accountType).color
                  }}>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: "#0A84FF" }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>Chart of Accounts</h1>
            {!error && accounts.length > 0 && (
              <span className="flex items-center text-sm px-2 py-1 rounded" style={{ backgroundColor: "rgba(50, 215, 75, 0.15)", color: "#32D74B" }}>
                <CheckCircle size={14} className="mr-1" />
                {getTotalAccountCount(accounts)} accounts loaded
              </span>
            )}
          </div>
          <p className="mt-1" style={{ color: "#98989D" }}>
            Bagan akun standar industri konstruksi sesuai PSAK - Real-time data
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 rounded-lg flex items-center transition-colors duration-150 disabled:opacity-50"
            style={{ backgroundColor: "rgba(152, 152, 157, 0.15)", border: "1px solid #38383A", color: "#98989D" }}
          >
            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            onClick={() => {
              console.log('Add Account button clicked');
              setShowAddAccountModal(true);
            }}
            className="px-4 py-2 rounded-lg flex items-center transition-colors duration-150"
            style={{ background: "linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)", color: "#FFFFFF" }}
          >
            <Plus size={16} className="mr-2" />
            Tambah Akun
          </button>
          <button 
            onClick={() => {
              setShowAddEntityModal(true);
              fetchSubsidiaries();
            }}
            className="px-4 py-2 rounded-lg flex items-center transition-colors duration-150"
            style={{ background: "linear-gradient(135deg, #32D74B 0%, #28B842 100%)", color: "#FFFFFF" }}
          >
            <Building2 size={16} className="mr-2" />
            Kelola Entitas
          </button>
        </div>
      </div>

      {/* Summary Panel */}
      {!loading && !error && accounts.length > 0 && (
        <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#0A84FF" }}>
                {new Intl.NumberFormat('id-ID', { 
                  style: 'currency', 
                  currency: 'IDR',
                  minimumFractionDigits: 0 
                }).format(totalBalances.totalDebit)}
              </div>
              <div className="text-sm" style={{ color: "#98989D" }}>Total Debit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#32D74B" }}>
                {new Intl.NumberFormat('id-ID', { 
                  style: 'currency', 
                  currency: 'IDR',
                  minimumFractionDigits: 0 
                }).format(totalBalances.totalCredit)}
              </div>
              <div className="text-sm" style={{ color: "#98989D" }}>Total Credit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.abs(totalBalances.totalDebit - totalBalances.totalCredit) < 0.01 ? 
                  <span style={{ color: "#32D74B" }}>✓ Balanced</span> : 
                  <span style={{ color: "#FF453A" }}>⚠ Unbalanced</span>
                }
              </div>
              <div className="text-sm" style={{ color: "#98989D" }}>
                {lastUpdate && `Last Update: ${lastUpdate.toLocaleTimeString('id-ID')}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="rounded-lg p-4" style={{ backgroundColor: "rgba(255, 69, 58, 0.1)", border: "1px solid #FF453A" }}>
          <div className="flex items-center">
            <AlertCircle style={{ color: "#FF453A" }} className="mr-3" size={20} />
            <div>
              <h3 className="font-medium" style={{ color: "#FF453A" }}>Error loading accounts</h3>
              <p className="text-sm mt-1" style={{ color: "#FF453A" }}>{error}</p>
              <button 
                onClick={handleRefresh}
                className="text-sm font-medium mt-2 underline"
                style={{ color: "#FF453A" }}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-lg p-4" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#636366" }} size={20} />
              <input
                type="text"
                placeholder="Cari nama akun atau kode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200"
                style={{
                  backgroundColor: "#1C1C1E",
                  color: "#FFFFFF",
                  border: "1px solid #38383A"
                }}
              />
            </div>
          </div>
          <div className="w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200"
              style={{
                backgroundColor: "#1C1C1E",
                color: "#FFFFFF",
                border: "1px solid #38383A"
              }}
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
      <div className="rounded-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid #38383A" }}>
          <h2 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Struktur Akun</h2>
        </div>
        <div style={{ borderTop: "1px solid #38383A" }}>
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
            <div key={type} className="rounded-lg p-4" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
              <div className="flex items-center">
                <div className="mr-3">
                  {getAccountTypeIcon(type)}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#98989D" }}>{type}</p>
                  <p className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>{count}</p>
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
            className="rounded-lg p-6 w-full max-w-md shadow-2xl"
            style={{
              backgroundColor: '#2C2C2E',
              borderRadius: '8px',
              padding: '24px',
              width: '100%',
              maxWidth: '28rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #38383A'
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Tambah Akun Baru</h3>
              <button
                onClick={() => {
                  console.log('🔄 Close modal clicked');
                  setShowAddAccountModal(false);
                }}
                className="text-2xl leading-none hover:opacity-70 transition-opacity"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#98989D'
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Kode Akun *</label>
                <input
                  type="text"
                  name="accountCode"
                  value={addAccountForm.accountCode}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: "1px solid #38383A"
                  }}
                  placeholder="e.g., 1103"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Nama Akun *</label>
                <input
                  type="text"
                  name="accountName"
                  value={addAccountForm.accountName}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: "1px solid #38383A"
                  }}
                  placeholder="e.g., Piutang Lain-lain"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Tipe Akun *</label>
                <select
                  name="accountType"
                  value={addAccountForm.accountType}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: "1px solid #38383A"
                  }}
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
                <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Sub Tipe</label>
                <input
                  type="text"
                  name="accountSubType"
                  value={addAccountForm.accountSubType}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: "1px solid #38383A"
                  }}
                  placeholder="e.g., CURRENT_ASSET"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Parent Account ID</label>
                <select
                  name="parentAccountId"
                  value={addAccountForm.parentAccountId}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: "1px solid #38383A"
                  }}
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
                <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Level *</label>
                <select
                  name="level"
                  value={addAccountForm.level}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: "1px solid #38383A"
                  }}
                  required
                >
                  <option value={1}>1 - Main Group</option>
                  <option value={2}>2 - Sub Group</option>
                  <option value={3}>3 - Detail Account</option>
                  <option value={4}>4 - Sub Detail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Normal Balance *</label>
                <select
                  name="normalBalance"
                  value={addAccountForm.normalBalance}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: "1px solid #38383A"
                  }}
                  required
                >
                  <option value="DEBIT">Debit</option>
                  <option value="CREDIT">Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}>Deskripsi</label>
                <textarea
                  name="description"
                  value={addAccountForm.description}
                  onChange={handleAddAccountFormChange}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: "#1C1C1E",
                    color: "#FFFFFF",
                    border: "1px solid #38383A"
                  }}
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
                  <span className="text-sm" style={{ color: "#98989D" }}>Spesifik Konstruksi</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="projectCostCenter"
                    checked={addAccountForm.projectCostCenter}
                    onChange={handleAddAccountFormChange}
                    className="mr-2"
                  />
                  <span className="text-sm" style={{ color: "#98989D" }}>Project Cost Center</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="vatApplicable"
                    checked={addAccountForm.vatApplicable}
                    onChange={handleAddAccountFormChange}
                    className="mr-2"
                  />
                  <span className="text-sm" style={{ color: "#98989D" }}>VAT Applicable</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="taxDeductible"
                    checked={addAccountForm.taxDeductible}
                    onChange={handleAddAccountFormChange}
                    className="mr-2"
                  />
                  <span className="text-sm" style={{ color: "#98989D" }}>Tax Deductible</span>
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="flex-1 px-4 py-2 rounded-md transition-all duration-200"
                  style={{
                    backgroundColor: "rgba(152, 152, 157, 0.15)",
                    border: "1px solid #38383A",
                    color: "#98989D"
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-md transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)",
                    color: "#FFFFFF"
                  }}
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
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
          <div className="rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Manajemen Entitas/Subsidiaries</h3>
              <button
                onClick={() => setShowAddEntityModal(false)}
                className="hover:opacity-70 transition-opacity"
                style={{ color: "#98989D" }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {loadingSubsidiaries ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: "#0A84FF" }}></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm mb-4" style={{ color: "#98989D" }}>
                  Berikut adalah daftar anak perusahaan/subsidiaries yang terdaftar dalam sistem:
                </div>
                
                <div className="grid gap-4">
                  {subsidiaries.map((subsidiary) => (
                    <div key={subsidiary.id} className="rounded-lg p-4 transition-all duration-200" style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1C1C1E'}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold" style={{ color: "#FFFFFF" }}>{subsidiary.name}</h4>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "rgba(10, 132, 255, 0.15)", color: "#0A84FF" }}>
                              {subsidiary.code}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`} style={{
                              backgroundColor: subsidiary.status === 'active' ? 'rgba(50, 215, 75, 0.15)' : 'rgba(255, 69, 58, 0.15)',
                              color: subsidiary.status === 'active' ? '#32D74B' : '#FF453A'
                            }}>
                              {subsidiary.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                            </span>
                          </div>
                          
                          <p className="text-sm mb-2" style={{ color: "#98989D" }}>{subsidiary.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium" style={{ color: "#98989D" }}>Spesialisasi:</span>
                              <span className="ml-2 capitalize" style={{ color: "#FFFFFF" }}>{subsidiary.specialization}</span>
                            </div>
                            <div>
                              <span className="font-medium" style={{ color: "#98989D" }}>Karyawan:</span>
                              <span className="ml-2" style={{ color: "#FFFFFF" }}>{subsidiary.employeeCount} orang</span>
                            </div>
                            <div>
                              <span className="font-medium" style={{ color: "#98989D" }}>Didirikan:</span>
                              <span className="ml-2" style={{ color: "#FFFFFF" }}>{subsidiary.establishedYear}</span>
                            </div>
                            <div>
                              <span className="font-medium" style={{ color: "#98989D" }}>Kota:</span>
                              <span className="ml-2" style={{ color: "#FFFFFF" }}>{subsidiary.address?.city || 'N/A'}</span>
                            </div>
                          </div>
                          
                          {subsidiary.certification && subsidiary.certification.length > 0 && (
                            <div className="mt-2">
                              <span className="font-medium text-sm" style={{ color: "#98989D" }}>Sertifikasi:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {subsidiary.certification.map((cert, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs" style={{ backgroundColor: "rgba(152, 152, 157, 0.15)", color: "#98989D" }}>
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
                  <div className="text-center py-8" style={{ color: "#98989D" }}>
                    Tidak ada data subsidiaries yang ditemukan.
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end pt-4 mt-6" style={{ borderTop: "1px solid #38383A" }}>
              <button
                onClick={() => setShowAddEntityModal(false)}
                className="px-4 py-2 rounded-md transition-all duration-200"
                style={{
                  backgroundColor: "rgba(152, 152, 157, 0.15)",
                  border: "1px solid #38383A",
                  color: "#98989D"
                }}
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
