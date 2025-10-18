import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, Filter, MoreVertical, 
  Edit, Trash2, Lock, Unlock, Download, RefreshCw,
  X, Eye, EyeOff, Save, ChevronDown, ChevronUp, Shield, AlertCircle, CheckCircle
} from 'lucide-react';
import { ROLES, getRoleBadgeClasses, getUserStatusBadgeClasses, getUserStatusLabel } from '../../utils/userManagementConstants';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // Inline editing states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);

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
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/management', {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data || []);
        
        if (data.statistics) {
          const apiStats = data.statistics;
          setStats({
            total: apiStats.total || 0,
            active: apiStats.active || 0,
            inactive: apiStats.inactive || 0,
            locked: 0,
            newThisWeek: 0
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
      const token = localStorage.getItem('token');
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

  const handleAddUser = () => {
    setShowAddForm(true);
    setEditingUserId(null);
    setExpandedUserId(null);
  };

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    setExpandedUserId(userId);
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setExpandedUserId(null);
    setShowAddForm(false);
  };

  const handleUserSaved = () => {
    fetchUsers();
    setEditingUserId(null);
    setExpandedUserId(null);
    setShowAddForm(false);
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
            onClick={handleAddUser}
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

      {/* Inline Add User Form */}
      {showAddForm && (
        <InlineUserForm
          mode="add"
          onSave={handleUserSaved}
          onCancel={handleCancelEdit}
        />
      )}

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
                const isExpanded = expandedUserId === user.id;
                const isEditing = editingUserId === user.id;

                return (
                  <React.Fragment key={user.id}>
                    <tr className="hover:bg-[#0A0A0A] transition-colors">
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
                            onClick={() => isExpanded ? setExpandedUserId(null) : setExpandedUserId(user.id)}
                            className="p-2 hover:bg-gray-500/20 rounded-lg transition-colors"
                            title={isExpanded ? "Collapse" : "Expand details"}
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Inline Edit/Detail Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="7" className="p-0">
                          <div className="bg-[#0A0A0A] border-t border-b border-gray-700">
                            {isEditing ? (
                              <InlineUserForm
                                mode="edit"
                                user={user}
                                onSave={handleUserSaved}
                                onCancel={handleCancelEdit}
                              />
                            ) : (
                              <UserDetailView user={user} onEdit={() => handleEditUser(user.id)} />
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
      </div>
    </div>
  );
};

// Inline User Form Component (Add/Edit)
const InlineUserForm = ({ mode = 'add', user = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    role: user?.role || 'staff',
    isActive: user?.isActive !== undefined ? user.isActive : true,
    fullName: user?.profile?.fullName || '',
    phone: user?.profile?.phone || '',
    position: user?.profile?.position || '',
    department: user?.profile?.department || ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [changePassword, setChangePassword] = useState(false);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
    return strength;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (mode === 'add' || (mode === 'edit' && changePassword)) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrors({ submit: 'Authentication required. Please login again.' });
        setLoading(false);
        return;
      }

      const requestData = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
        fullName: formData.fullName,
        phone: formData.phone,
        position: formData.position,
        department: formData.department
      };

      // Include password only if adding or changing
      if (mode === 'add' || (mode === 'edit' && changePassword && formData.password)) {
        requestData.password = formData.password;
      }

      const url = mode === 'add' 
        ? '/api/users/management'
        : `/api/users/management/${user.id}`;
      
      const method = mode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.success) {
        window.showToast && window.showToast(
          mode === 'add' ? 'User created successfully!' : 'User updated successfully!',
          'success'
        );
        onSave && onSave();
      } else {
        setErrors({ submit: data.error || `Failed to ${mode} user` });
      }
    } catch (error) {
      console.error(`Error ${mode}ing user:`, error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = Object.values(ROLES).find(r => r.id === formData.role);
  const RoleIcon = selectedRole?.icon;

  return (
    <div className="p-6 animate-slideDown">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {mode === 'add' ? 'Add New User' : 'Edit User'}
              </h3>
              <p className="text-sm text-gray-400">
                {mode === 'add' ? 'Create a new user account' : 'Update user information'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errors.submit && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-[#1A1A1A] rounded-lg p-6 space-y-4">
            <h4 className="text-lg font-semibold mb-4">Basic Information</h4>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={`w-full bg-[#0A0A0A] border ${errors.fullName ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500`}
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
              )}
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className={`w-full bg-[#0A0A0A] border ${errors.username ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500`}
                  placeholder="johndoe"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full bg-[#0A0A0A] border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Phone & Position */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="+62 812 3456 7890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Project Manager"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Engineering"
              />
            </div>
          </div>

          {/* Password Section */}
          {(mode === 'add' || changePassword) && (
            <div className="bg-[#1A1A1A] rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Password</h4>
                {mode === 'edit' && (
                  <button
                    type="button"
                    onClick={() => setChangePassword(!changePassword)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Cancel password change
                  </button>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className={`w-full bg-[#0A0A0A] border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-blue-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
                
                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">Password Strength</span>
                      <span className={`font-medium ${
                        passwordStrength < 40 ? 'text-red-400' :
                        passwordStrength < 70 ? 'text-orange-400' :
                        passwordStrength < 90 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Fair' : passwordStrength < 90 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength < 40 ? 'bg-red-500' :
                          passwordStrength < 70 ? 'bg-orange-500' :
                          passwordStrength < 90 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className={`w-full bg-[#0A0A0A] border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-blue-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Change Password Toggle for Edit Mode */}
          {mode === 'edit' && !changePassword && (
            <div className="bg-[#1A1A1A] rounded-lg p-6">
              <button
                type="button"
                onClick={() => setChangePassword(true)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                + Change Password
              </button>
            </div>
          )}

          {/* Role & Permissions */}
          <div className="bg-[#1A1A1A] rounded-lg p-6 space-y-4">
            <h4 className="text-lg font-semibold mb-4">Role & Permissions</h4>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Role <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                {Object.values(ROLES).map(role => (
                  <option key={role.id} value={role.id}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Preview */}
            {selectedRole && (
              <div className={`p-4 rounded-lg ${selectedRole.bgColor} border border-gray-700`}>
                <div className="flex items-center gap-3 mb-2">
                  {RoleIcon && <RoleIcon className={`h-5 w-5 ${selectedRole.textColor}`} />}
                  <span className={`font-semibold ${selectedRole.textColor}`}>{selectedRole.label}</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{selectedRole.description}</p>
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Permissions: </span>
                  {selectedRole.permissions.join(', ')}
                </div>
              </div>
            )}

            {/* Active Status */}
            <div className="flex items-center gap-3 p-4 bg-[#0A0A0A] rounded-lg border border-gray-700">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-[#1A1A1A] checked:bg-blue-500"
              />
              <label htmlFor="isActive" className="flex-1 cursor-pointer">
                <div className="font-medium">Active Account</div>
                <div className="text-sm text-gray-400">User can log in and access the system</div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {mode === 'add' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {mode === 'add' ? 'Create User' : 'Update User'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// User Detail View Component
const UserDetailView = ({ user, onEdit }) => {
  const role = Object.values(ROLES).find(r => r.id === user.role);
  const RoleIcon = role?.icon;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">User Details</h3>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit User
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-[#1A1A1A] rounded-lg p-4">
            <h4 className="font-semibold mb-4">Basic Information</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Full Name:</span>
                <span className="ml-2 text-white">{user.profile?.fullName || '-'}</span>
              </div>
              <div>
                <span className="text-gray-400">Username:</span>
                <span className="ml-2 text-white">{user.username}</span>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <span className="ml-2 text-white">{user.email}</span>
              </div>
              <div>
                <span className="text-gray-400">Phone:</span>
                <span className="ml-2 text-white">{user.profile?.phone || '-'}</span>
              </div>
            </div>
          </div>

          {/* Role & Status */}
          <div className="bg-[#1A1A1A] rounded-lg p-4">
            <h4 className="font-semibold mb-4">Role & Status</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Role:</span>
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${getRoleBadgeClasses(user.role)}`}>
                    {RoleIcon && <RoleIcon className="h-4 w-4" />}
                    {role?.label || user.role}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getUserStatusBadgeClasses(user.isActive, false)}`}>
                    {getUserStatusLabel(user.isActive, false)}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-400">Position:</span>
                <span className="ml-2 text-white">{user.profile?.position || '-'}</span>
              </div>
              <div>
                <span className="text-gray-400">Department:</span>
                <span className="ml-2 text-white">{user.profile?.department || '-'}</span>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-[#1A1A1A] rounded-lg p-4 col-span-2">
            <h4 className="font-semibold mb-4">Activity</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Created:</span>
                <span className="ml-2 text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-400">Last Updated:</span>
                <span className="ml-2 text-white">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-'}</span>
              </div>
              <div>
                <span className="text-gray-400">Last Login:</span>
                <span className="ml-2 text-white">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
