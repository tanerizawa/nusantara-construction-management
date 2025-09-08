import React, { useState, useEffect } from 'react';
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
  Users
} from 'lucide-react';
import axios from 'axios';

const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/coa/hierarchy');
      setAccounts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
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
            </div>
            
            <span className={`text-xs px-2 py-1 rounded-full ${getAccountTypeColor(account.accountType)}`}>
              {account.accountType}
            </span>
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

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = searchTerm === '' || 
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountCode.includes(searchTerm);
    
    const matchesType = filterType === '' || account.accountType === filterType;
    
    return matchesSearch && matchesType;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Chart of Accounts</h1>
          <p className="text-gray-600 mt-1">
            Bagan akun standar industri konstruksi sesuai PSAK
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus size={20} className="mr-2" />
          Tambah Akun
        </button>
      </div>

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
    </div>
  );
};

export default ChartOfAccounts;
