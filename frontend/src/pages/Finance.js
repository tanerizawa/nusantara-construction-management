import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  DollarSign, 
  FileText, 
  BarChart3, 
  ClipboardList,
  Plus,
  Search,
  Filter
} from 'lucide-react';

const Finance = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('transaksi');

  // Handle URL params untuk tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['transaksi', 'pajak', 'laporan', 'budget'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const tabs = [
    { id: 'transaksi', label: 'Transaksi', icon: DollarSign },
    { id: 'pajak', label: 'Pajak', icon: FileText },
    { id: 'laporan', label: 'Laporan', icon: BarChart3 },
    { id: 'budget', label: 'Budget', icon: ClipboardList }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'transaksi':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Transaksi Keuangan</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Tambah Transaksi</span>
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Cari transaksi..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">28 Aug 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pembelian Material</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Pengeluaran</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 15,000,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Selesai
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'pajak':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Manajemen Pajak</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Tambah Laporan Pajak</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">PPh 21</h3>
                <p className="text-3xl font-bold text-blue-600">Rp 2,500,000</p>
                <p className="text-sm text-gray-500">Bulan ini</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">PPN</h3>
                <p className="text-3xl font-bold text-green-600">Rp 11,000,000</p>
                <p className="text-sm text-gray-500">Bulan ini</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">PPh Badan</h3>
                <p className="text-3xl font-bold text-purple-600">Rp 8,750,000</p>
                <p className="text-sm text-gray-500">Bulan ini</p>
              </div>
            </div>
          </div>
        );
      
      case 'laporan':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Laporan Keuangan</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150">
                Export PDF
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Laba Rugi</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pendapatan</span>
                    <span className="font-semibold text-green-600">Rp 125,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pengeluaran</span>
                    <span className="font-semibold text-red-600">Rp 87,500,000</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Laba Bersih</span>
                    <span className="text-green-600">Rp 37,500,000</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Arus Kas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kas Masuk</span>
                    <span className="font-semibold text-green-600">Rp 150,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kas Keluar</span>
                    <span className="font-semibold text-red-600">Rp 112,500,000</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Saldo Akhir</span>
                    <span className="text-blue-600">Rp 37,500,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'budget':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Budget Planning</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Buat Budget</span>
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Budget vs Actual</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Material & Supplies</span>
                    <span className="text-sm text-gray-500">75% dari budget</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-gray-600">
                    <span>Rp 75,000,000</span>
                    <span>Budget: Rp 100,000,000</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Tenaga Kerja</span>
                    <span className="text-sm text-gray-500">60% dari budget</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-gray-600">
                    <span>Rp 30,000,000</span>
                    <span>Budget: Rp 50,000,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Keuangan</h1>
          <p className="mt-2 text-gray-600">Kelola keuangan, pajak, dan laporan perusahaan</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Finance;
