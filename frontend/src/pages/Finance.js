import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  DollarSign, 
  FileText, 
  BarChart3, 
  ClipboardList,
  Calculator,
  TrendingUp,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  FolderOpen,
  Users,
  Package,
  ChevronDown
} from 'lucide-react';

const Finance = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('transaksi');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [viewLevel, setViewLevel] = useState('group'); // group, subsidiary, project

  // Mock data untuk hierarki Nusantara Group
  const nusantaraGroupData = {
    subsidiaries: [
      { id: 'nkg', name: 'PT Nusantara Konstruksi Global', npwp: '01.234.567.8-901.000' },
      { id: 'nip', name: 'PT Nusantara Infrastruktur Prima', npwp: '01.234.567.8-902.000' },
      { id: 'nrp', name: 'PT Nusantara Realty Property', npwp: '01.234.567.8-903.000' },
      { id: 'nte', name: 'PT Nusantara Trading Engineering', npwp: '01.234.567.8-904.000' }
    ],
    projects: {
      'nkg': [
        { id: 'mall-bintaro', name: 'Shopping Mall Bintaro', budget: 25500000000 },
        { id: 'office-bsd', name: 'Office Complex BSD', budget: 32700000000 }
      ],
      'nip': [
        { id: 'toll-road', name: 'Tol Jakarta-Bandung', budget: 125000000000 },
        { id: 'bridge-suramadu', name: 'Jembatan Suramadu Phase 2', budget: 85000000000 }
      ],
      'nrp': [
        { id: 'apt-kemang', name: 'Apartemen Kemang', budget: 18200000000 },
        { id: 'hotel-bali', name: 'Resort Hotel Bali', budget: 45000000000 }
      ],
      'nte': [
        { id: 'supply-chain', name: 'Supply Chain Management', budget: 5000000000 },
        { id: 'equipment-rental', name: 'Equipment Rental', budget: 8500000000 }
      ]
    }
  };

  // Handle URL params untuk tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['transaksi', 'pajak', 'laporan', 'budget', 'analytics'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const tabs = [
    { id: 'transaksi', label: 'Transaksi Keuangan', icon: DollarSign },
    { id: 'pajak', label: 'Manajemen Pajak', icon: Calculator },
    { id: 'laporan', label: 'Laporan Keuangan', icon: BarChart3 },
    { id: 'budget', label: 'Budget & Planning', icon: ClipboardList },
    { id: 'analytics', label: 'Financial Analytics', icon: TrendingUp }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'transaksi':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Transaksi Keuangan</h2>
              <div className="flex space-x-3">
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Semua Transaksi</option>
                  <option>Material Procurement</option>
                  <option>Manpower Payroll</option>
                  <option>Equipment Rental</option>
                  <option>Project Expenses</option>
                  <option>Subsidiary Overhead</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Tambah Transaksi</span>
                </button>
              </div>
            </div>
            
            {/* Financial Summary Cards by Hierarchy */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">Rp 125.8B</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Consolidated Group</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Project Costs</p>
                    <p className="text-2xl font-bold text-blue-600">Rp 89.2B</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">All Active Projects</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Material Costs</p>
                    <p className="text-2xl font-bold text-purple-600">Rp 40.1B</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">45% dari total cost</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Manpower Costs</p>
                    <p className="text-2xl font-bold text-orange-600">Rp 28.5B</p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">32% dari total cost</p>
              </div>
            </div>

            {/* Hierarchical Transaction Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Transaksi Terkini</h3>
                  <div className="flex space-x-2">
                    <button className="text-sm px-3 py-1 bg-gray-100 rounded-lg">Export</button>
                    <button className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-lg">Filter</button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anak Usaha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">01 Sep 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PT Nusantara Konstruksi Global</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Shopping Mall Bintaro</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Material</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Procurement Besi Beton Grade 40</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-Rp 2,500,000,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Approved</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">31 Aug 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PT Nusantara Infrastruktur Prima</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tol Jakarta-Bandung</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Manpower</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Payroll Agustus 2025 - 250 workers</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-Rp 3,750,000,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">30 Aug 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PT Nusantara Realty Property</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apartemen Kemang</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Revenue</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pembayaran Unit 15A-20A (5 units)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+Rp 8,500,000,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Received</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">29 Aug 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PT Nusantara Trading Engineering</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Equipment Rental</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Equipment</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rental Tower Crane - Mall Bintaro</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+Rp 450,000,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
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
            
            {/* Tax Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Pajak Group</p>
                    <p className="text-xl font-bold text-blue-600">Rp 89.2B</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">4 Entities Combined</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-50">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                    <p className="text-xl font-bold text-green-600">96.5%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Tax Filing Accuracy</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow-50">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-xl font-bold text-yellow-600">7</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Across all subsidiaries</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-red-50">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-xl font-bold text-red-600">2</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Need immediate action</p>
              </div>
            </div>

            {/* Tax by Subsidiary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tax by Subsidiary</h3>
                <div className="space-y-4">
                  {nusantaraGroupData.subsidiaries.map((subsidiary, index) => {
                    const taxAmounts = [28500000000, 22300000000, 18750000000, 12450000000];
                    const statuses = ['current', 'current', 'pending', 'overdue'];
                    const statusColors = {
                      current: 'bg-green-100 text-green-800',
                      pending: 'bg-yellow-100 text-yellow-800',
                      overdue: 'bg-red-100 text-red-800'
                    };
                    
                    return (
                      <div key={subsidiary.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{subsidiary.name}</h4>
                            <p className="text-sm text-gray-500">NPWP: {subsidiary.npwp}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[statuses[index]]}`}>
                            {statuses[index] === 'current' ? 'Current' : statuses[index] === 'pending' ? 'Pending' : 'Overdue'}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">
                            Rp {(taxAmounts[index] / 1000000000).toFixed(1)}B
                          </p>
                          <p className="text-xs text-gray-500">Tax liability YTD</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Categories Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium">PPh Badan (Corporate Tax)</span>
                    </div>
                    <span className="text-sm font-bold">Rp 45.2B</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium">PPN (VAT)</span>
                    </div>
                    <span className="text-sm font-bold">Rp 25.8B</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium">PPh 21 (Employee Tax)</span>
                    </div>
                    <span className="text-sm font-bold">Rp 12.4B</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium">PPh Final & Others</span>
                    </div>
                    <span className="text-sm font-bold">Rp 5.8B</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Multi-Entity Tax Records Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Riwayat Pajak Multi-Entity</h3>
                  <div className="flex space-x-2">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>Semua Anak Usaha</option>
                      <option>PT Nusantara Konstruksi Global</option>
                      <option>PT Nusantara Infrastruktur Prima</option>
                      <option>PT Nusantara Realty Property</option>
                      <option>PT Nusantara Trading Engineering</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anak Usaha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pajak</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">01 Sep 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PT Nusantara Konstruksi Global</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PPh Badan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Agustus 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Shopping Mall Bintaro</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 12,500,000,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">Detail</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">31 Aug 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PT Nusantara Infrastruktur Prima</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PPN</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Agustus 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tol Jakarta-Bandung</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 8,750,000,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">Detail</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">30 Aug 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PT Nusantara Realty Property</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PPh 21</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Agustus 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apartemen Kemang</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 750,000,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-orange-600 hover:text-orange-900">Process</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">28 Aug 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PT Nusantara Trading Engineering</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PPh Final</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Juli 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Equipment Rental</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 125,000,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Overdue</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-red-600 hover:text-red-900">Urgent</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
      
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Financial Analytics</h2>
              <div className="flex space-x-3">
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Bulan ini</option>
                  <option>3 Bulan terakhir</option>
                  <option>6 Bulan terakhir</option>
                  <option>Tahun ini</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 text-sm">
                  Export Report
                </button>
              </div>
            </div>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
                    <p className="text-2xl font-bold text-green-600">+12.5%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">vs bulan lalu</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                    <p className="text-2xl font-bold text-blue-600">23.8%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Target: 25%</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cash Flow</p>
                    <p className="text-2xl font-bold text-purple-600">Rp 245M</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-green-500 mt-2">+8.2% bulan ini</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">ROI Projects</p>
                    <p className="text-2xl font-bold text-orange-600">18.4%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Rata-rata semua project</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend (6 Bulan)</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart Revenue Trend</p>
                    <p className="text-sm text-gray-400">Data visualisasi akan ditampilkan di sini</p>
                  </div>
                </div>
              </div>
              
              {/* Expense Breakdown */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Breakdown Pengeluaran</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">Material & Supplies</span>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">Tenaga Kerja</span>
                    </div>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">Equipment & Tools</span>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">Overhead</span>
                    </div>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Financial Performance with Hierarchy */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Performance Keuangan Hierarki Nusantara Group</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subsidiary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manpower Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PT Nusantara Konstruksi Global</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Shopping Mall Bintaro</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 25.5B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 23.8B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">Rp 10.7B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">Rp 7.6B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">-6.7%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">22.1%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">On Track</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PT Nusantara Konstruksi Global</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Office Complex BSD</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 32.7B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 31.2B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">Rp 14.0B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">Rp 10.0B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">-4.6%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">19.8%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">On Track</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PT Nusantara Infrastruktur Prima</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tol Jakarta-Bandung</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 125.0B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 118.5B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">Rp 53.3B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">Rp 37.9B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">-5.2%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">18.9%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">On Track</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PT Nusantara Realty Property</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Apartemen Kemang</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 18.2B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 19.1B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">Rp 8.6B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">Rp 6.1B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">+4.9%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">15.3%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Over Budget</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PT Nusantara Trading Engineering</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Equipment Rental Services</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 8.5B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 7.8B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">Rp 2.3B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">Rp 3.9B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">-8.2%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">24.1%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Excellent</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
        {/* Header with Nusantara Group Hierarchy */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Keuangan & Perpajakan</h1>
              <p className="mt-2 text-gray-600">Sistem manajemen keuangan Nusantara Group</p>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Nusantara Group</span>
            </div>
          </div>
          
          {/* Hierarchy Selector */}
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filter Hierarki</h3>
              <div className="flex items-center space-x-2">
                <select 
                  value={viewLevel} 
                  onChange={(e) => setViewLevel(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="group">View Group Level</option>
                  <option value="subsidiary">View per Anak Usaha</option>
                  <option value="project">View per Project</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Subsidiary Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Anak Usaha</label>
                <select 
                  value={selectedSubsidiary} 
                  onChange={(e) => setSelectedSubsidiary(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">Semua Anak Usaha</option>
                  {nusantaraGroupData.subsidiaries.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Project Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select 
                  value={selectedProject} 
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  disabled={selectedSubsidiary === 'all'}
                >
                  <option value="all">Semua Project</option>
                  {selectedSubsidiary !== 'all' && nusantaraGroupData.projects[selectedSubsidiary]?.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Period Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>September 2025</option>
                  <option>Q3 2025</option>
                  <option>Tahun 2025</option>
                  <option>YTD 2025</option>
                </select>
              </div>
            </div>
            
            {/* Quick Stats for Selected Level */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">Total Subsidiaries</p>
                    <p className="text-2xl font-bold text-blue-600">4</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <FolderOpen className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-900">Active Projects</p>
                    <p className="text-2xl font-bold text-green-600">8</p>
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
