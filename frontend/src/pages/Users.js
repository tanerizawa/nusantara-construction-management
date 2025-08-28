import React, { useState, useEffect } from 'react';
import { User, Plus, Shield, UserCheck } from 'lucide-react';
import axios from 'axios';

// Phase 1 UI Components
import Button from '../components/ui/Button';
import Card, { KPICard, DataCard } from '../components/ui/Card';
import PageLoader from '../components/ui/PageLoader';
import { UserTable } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy] = useState('name');
  const [sortOrder] = useState('asc');
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [serverPagination, setServerPagination] = useState({ current: 1, total: 1, count: 0 });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, searchTerm, sortBy, sortOrder]);

  // Fetch stats once
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/users/stats/overview');
        setStats(res.data.data);
      } catch (e) {
        // noop
      }
    };
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users', {
        params: {
          q: searchTerm || undefined,
          role: roleFilter || undefined,
          sort: sortBy,
          order: sortOrder,
          limit: pageSize,
          page
        }
      });
      const data = response.data?.data || [];
      const pagination = response.data?.pagination || { current: page, total: 1, count: data.length };
      setUsers(data);
      setServerPagination({
        current: parseInt(pagination.current || 1, 10),
        total: parseInt(pagination.total || 1, 10),
        count: parseInt(pagination.count || data.length || 0, 10)
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setServerPagination({ current: 1, total: 1, count: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Server-side mode
  const filteredUsers = users;

  if (loading) {
    return <PageLoader size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-gray-600">Kelola akun dan hak akses tim proyek Karawang</p>
        </div>
  <div className="text-sm text-gray-500">{serverPagination.count} pengguna</div>
      </div>

      {/* Actions */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berdasarkan username, email, atau nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-base w-80"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-base w-48"
            >
              <option value="">Semua Role</option>
              <option value="admin">Administrator</option>
              <option value="project_manager">Project Manager</option>
              <option value="finance_manager">Finance Manager</option>
              <option value="inventory_manager">Inventory Manager</option>
              <option value="hr_manager">HR Manager</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus />}
          >
            Pengguna Baru
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <UserTable 
        data={filteredUsers}
        onEdit={(user) => console.log('Edit user:', user)}
        onResetPassword={(user) => console.log('Reset password:', user)}
        onToggleStatus={(user) => console.log('Toggle status:', user)}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Total Pengguna"
          value={stats?.total ?? serverPagination.count}
          icon={User}
          color="blue"
        />
        <KPICard
          title="Pengguna Aktif"
          value={stats?.active ?? '-'}
          icon={UserCheck}
          color="green"
        />
        <KPICard
          title="Administrator"
          value={stats?.byRole?.admin ?? '-'}
          icon={Shield}
          color="red"
        />
        <KPICard
          title="Manager"
          value={
            (stats?.byRole?.project_manager || 0) +
            (stats?.byRole?.finance_manager || 0) +
            (stats?.byRole?.inventory_manager || 0) +
            (stats?.byRole?.hr_manager || 0)
          }
          icon={User}
          color="purple"
        />
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <DataCard
          title={searchTerm || roleFilter ? 'Tidak ada pengguna yang ditemukan' : 'Belum ada pengguna'}
          subtitle={searchTerm || roleFilter ? 'Coba ubah filter pencarian Anda' : 'Mulai dengan menambahkan pengguna baru'}
        />
      )}

      {/* Pagination */}
      {serverPagination.count > 0 && (
        <Pagination
          currentPage={page}
          totalPages={serverPagination.total}
          onPageChange={setPage}
          showInfo={true}
          totalItems={serverPagination.count}
          itemsPerPage={pageSize}
        />
      )}
    </div>
  );
};

export default Users;
