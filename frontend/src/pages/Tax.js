import React, { useState, useEffect } from 'react';
import { FileText, Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import PageActions from '../components/PageActions';
import { DataLoader, DataEmpty } from '../components/DataStates';

const Tax = () => {
  const [taxes, setTaxes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [compact, setCompact] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [serverPagination, setServerPagination] = useState({ current: 1, total: 1, count: 0 });

  useEffect(() => {
    fetchTaxData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, searchTerm, sortBy, sortOrder]);

  // reset page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchTerm, sortBy, sortOrder]);

  // stats only once
  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTaxData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/tax', {
        params: {
          q: searchTerm || undefined,
          status: statusFilter || undefined,
          sort: sortBy,
          order: sortOrder,
          limit: pageSize,
          page
        }
      });
      const data = response.data?.data || [];
      const pagination = response.data?.pagination || { current: page, total: 1, count: data.length };
      setTaxes(data);
      setServerPagination({
        current: parseInt(pagination.current || 1, 10),
        total: parseInt(pagination.total || 1, 10),
        count: parseInt(pagination.count || data.length || 0, 10)
      });
    } catch (error) {
      console.error('Error fetching tax data:', error);
      setTaxes([]);
      setServerPagination({ current: 1, total: 1, count: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/tax/stats/overview');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching tax stats:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Lunas' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      overdue: { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Terlambat' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        <Icon size={12} className="mr-1" />
        {config.text}
      </span>
    );
  };

  // Server-side mode
  const filteredTaxes = taxes;

  if (loading) {
    return <DataLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pajak</h1>
          <p className="text-gray-600">Kelola kewajiban pajak terkait proyek di Karawang</p>
        </div>
        <div className="text-sm text-gray-500">{serverPagination.count} entri</div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <FileText size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pajak</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(stats?.totalTax || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sudah Dibayar</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(stats?.paidTax || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-50">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">
                {formatCurrency(stats?.pendingTax || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-50">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terlambat</p>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(stats?.overdueTax || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <PageActions
        searchPlaceholder="Cari deskripsi, referensi, atau jenis pajak..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            id: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: '', label: 'Semua Status' },
              { value: 'paid', label: 'Lunas' },
              { value: 'pending', label: 'Pending' },
              { value: 'overdue', label: 'Terlambat' },
            ]
          }
        ]}
        sortOptions={[
          { value: 'date:desc', label: 'Tanggal terbaru' },
          { value: 'date:asc', label: 'Tanggal terlama' },
          { value: 'amount:desc', label: 'Nominal terbesar' },
          { value: 'amount:asc', label: 'Nominal terkecil' },
        ]}
        sortValue={`${sortBy}:${sortOrder}`}
        onSortChange={(val) => {
          const [key, ord] = val.split(':');
          setSortBy(key);
          setSortOrder(ord);
        }}
        compact={compact}
        onCompactChange={setCompact}
        right={(<button className="btn-primary"><Plus size={20} className="mr-2" />Tambah Pajak</button>)}
      />

      {/* Tax Table */}
  <div className={`card overflow-hidden ${compact ? 'density-compact' : ''}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Tanggal</th>
                <th className="table-header">Jenis Pajak</th>
                <th className="table-header">Deskripsi</th>
                <th className="table-header">Jumlah</th>
                <th className="table-header">Periode</th>
                <th className="table-header">Jatuh Tempo</th>
                <th className="table-header">Status</th>
                <th className="table-header">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTaxes.map((tax) => (
                <tr key={tax.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    {new Date(tax.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="table-cell">
                    <span className="font-medium text-blue-600">{tax.type}</span>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">
                      {tax.desc || tax.description}
                    </div>
                    {tax.reference && (
                      <div className="text-sm text-gray-500">
                        Ref: {tax.reference}
                      </div>
                    )}
                  </td>
                  <td className="table-cell">
                    <span className="font-bold text-gray-900">
                      {formatCurrency(tax.amount)}
                    </span>
                  </td>
                  <td className="table-cell">
                    {tax.period || '-'}
                  </td>
                  <td className="table-cell">
                    {tax.dueDate ? new Date(tax.dueDate).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(tax.status || 'pending')}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      {tax.status !== 'paid' && (
                        <button className="text-green-600 hover:text-green-900 text-sm">Bayar</button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Types Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan per Jenis Pajak</h3>
        <div className="space-y-3">
          {stats?.byType && Object.entries(stats.byType).map(([type, amount]) => (
            <div key={type} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="font-medium text-gray-700">{type}</span>
              <span className="font-bold text-blue-600">{formatCurrency(amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredTaxes.length === 0 && (
        <DataEmpty
          icon={FileText}
          title={statusFilter || searchTerm ? 'Tidak ada data pajak yang ditemukan' : 'Belum ada data pajak'}
          description={statusFilter || searchTerm ? 'Coba ubah filter atau tambahkan data pajak baru' : 'Mulai dengan menambahkan kewajiban pajak'}
        />
      )}

      {/* Pagination */}
      {serverPagination.count > 0 && (
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-600">
            Menampilkan {((serverPagination.current - 1) * pageSize) + 1}
            –{Math.min(serverPagination.current * pageSize, serverPagination.count)}
            {` dari ${serverPagination.count} entri`}
          </div>
          <div className="inline-flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Halaman sebelumnya"
            >
              Sebelumnya
            </button>
            <div className="px-3 py-2 text-sm text-gray-700 bg-gray-50">{page} / {serverPagination.total}</div>
            <button
              className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(serverPagination.total, p + 1))}
              disabled={page === serverPagination.total}
              aria-label="Halaman berikutnya"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tax;
