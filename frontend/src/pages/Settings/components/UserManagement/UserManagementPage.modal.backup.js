import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, Filter, MoreVertical, 
  Edit, Trash2, Lock, Unlock, Download, RefreshCw 
} from 'lucide-react';
import { ROLES, getRoleBadgeClasses, getUserStatusBadgeClasses, getUserStatusLabel } from '../../utils/userManagementConstants';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    locked: 0,
    newThisWeek: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      
      // Use the new management endpoint with stats
      const response = await fetch('/api/users/management', {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data || []);
        
        // Use statistics from API response if available
        if (data.statistics) {
          const apiStats = data.statistics;
          setStats({
            total: apiStats.total || 0,
            active: apiStats.active || 0,
            inactive: apiStats.inactive || 0,
            locked: 0, // API doesn't track locked users yet
            newThisWeek: 0 // Calculate if needed
          });
        } else {
          calculateStats(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      window.showToast && window.showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userList) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    setStats({
      total: userList.length,
      active: userList.filter(u => u.isActive && !u.lockUntil).length,
      inactive: userList.filter(u => !u.isActive).length,
      locked: userList.filter(u => u.lockUntil && new Date(u.lockUntil) > now).length,
      newThisWeek: userList.filter(u => new Date(u.createdAt) > weekAgo).length
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive) ||
                         (statusFilter === 'locked' && user.lockUntil);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      
      // Use the new management endpoint
      const response = await fetch(`/api/users/management/${userId}`, {
        method: 'DELETE',
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchUsers();
        if (window.showToast) {
          window.showToast(data.message || 'User deleted successfully!', 'success');
        }
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      if (window.showToast) {
        window.showToast('Failed to delete user. Please try again.', 'error');
      }
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      window.showToast && window.showToast('Please select users first', 'warning');
      return;
    }

    const confirmMsg = `Are you sure you want to ${action} ${selectedUsers.length} user(s)?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      let endpoint, body;
      
      if (action === 'delete') {
        endpoint = '/api/users/management/bulk-delete';
        body = { userIds: selectedUsers, permanent: false };
      } else if (action === 'activate') {
        endpoint = '/api/users/management/bulk-status';
        body = { userIds: selectedUsers, isActive: true };
      } else if (action === 'deactivate') {
        endpoint = '/api/users/management/bulk-status';
        body = { userIds: selectedUsers, isActive: false };
      }

      // Get JWT token from localStorage
      const token = localStorage.getItem('token');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        fetchUsers();
        setSelectedUsers([]);
        if (window.showToast) {
          window.showToast(data.message || `Bulk ${action} completed!`, 'success');
        }
      } else {
        throw new Error(data.error || 'Bulk action failed');
      }
    } catch (error) {
      console.error(`Error in bulk ${action}:`, error);
      if (window.showToast) {
        window.showToast(`Failed to ${action} users. ${error.message}`, 'error');
      }
    }
  };

  const handleUserCreated = (newUser) => {
    fetchUsers();
    if (window.showToast) {
      window.showToast('User created successfully!', 'success');
    }
  };

  const handleUserUpdated = (updatedUser) => {
    fetchUsers();
    if (window.showToast) {
      window.showToast('User updated successfully!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-gray-400">Manage users, roles, and permissions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            Add New User
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <StatCard 
          label="Total Users" 
          value={stats.total} 
          icon={Users}
          color="blue"
        />
        <StatCard 
          label="Active" 
          value={stats.active} 
          icon={Unlock}
          color="green"
        />
        <StatCard 
          label="Inactive" 
          value={stats.inactive} 
          icon={Lock}
          color="gray"
        />
        <StatCard 
          label="Locked" 
          value={stats.locked} 
          icon={Lock}
          color="red"
        />
        <StatCard 
          label="New (7 days)" 
          value={stats.newThisWeek} 
          icon={UserPlus}
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="bg-[#1A1A1A] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            {Object.values(ROLES).map(role => (
              <option key={role.id} value={role.id}>{role.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="locked">Locked</option>
          </select>

          {/* Refresh */}
          <button
            onClick={fetchUsers}
            className="p-2 bg-[#0A0A0A] border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-400">{selectedUsers.length} selected</span>
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded hover:bg-gray-500/30"
            >
              Deactivate
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* User Table */}
      <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0A0A0A] border-b border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-600"
                />
              </th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Last Login</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => {
                const role = Object.values(ROLES).find(r => r.id === user.role);
                const RoleIcon = role?.icon;
                const isLocked = user.lockUntil && new Date(user.lockUntil) > new Date();

                return (
                  <tr key={user.id} className="hover:bg-[#0A0A0A] transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-600"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-gray-400">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${getRoleBadgeClasses(user.role)}`}>
                        {RoleIcon && <RoleIcon className="h-4 w-4" />}
                        {role?.label || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getUserStatusBadgeClasses(user.isActive, isLocked)}`}>
                        {getUserStatusLabel(user.isActive, isLocked)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowEditModal(true);
                          }}
                          className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
            1
          </button>
          <button className="px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleUserCreated}
      />
      
      <EditUserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        onSuccess={handleUserUpdated}
        user={editingUser}
      />
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/10 text-green-400',
    gray: 'bg-gray-500/10 text-gray-400',
    red: 'bg-red-500/10 text-red-400',
    purple: 'bg-purple-500/10 text-purple-400'
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{label}</span>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

export default UserManagementPage;
