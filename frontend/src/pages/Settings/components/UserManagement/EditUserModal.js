import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, AlertCircle, User, Mail, Lock, Shield, Calendar, Activity } from 'lucide-react';
import { ROLES } from '../../utils/userManagementConstants';

const EditUserModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff',
    isActive: true,
    profile: {
      fullName: '',
      phone: '',
      position: '',
      department: ''
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  // Load user data when modal opens
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user.role || 'staff',
        isActive: user.isActive !== undefined ? user.isActive : true,
        profile: {
          fullName: user.profile?.fullName || '',
          phone: user.profile?.phone || '',
          position: user.profile?.position || '',
          department: user.profile?.department || ''
        }
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    if (field.startsWith('profile.')) {
      const profileField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: { ...prev.profile, [profileField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation (only if changing password)
    if (changePassword) {
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

    // Full name validation
    if (!formData.profile.fullName.trim()) {
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
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setErrors({ submit: 'Authentication required. Please login again.' });
        setLoading(false);
        return;
      }

      // Flatten profile data to root level (backend expects flat structure)
      const requestData = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
        fullName: formData.profile.fullName,
        phone: formData.profile.phone,
        position: formData.profile.position,
        department: formData.profile.department
      };

      // Include password if changing
      if (changePassword && formData.password) {
        requestData.password = formData.password;
      }

      // Use the new management endpoint
      const response = await fetch(`/api/users/management/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.success) {
        onSuccess && onSuccess(data.data);
        onClose();
      } else {
        setErrors({ submit: data.error || 'Failed to update user' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const selectedRole = Object.values(ROLES).find(r => r.id === formData.role);
  const RoleIcon = selectedRole?.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1A1A1A] border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <User className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit User</h2>
              <p className="text-sm text-gray-400">Update user information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{errors.submit}</span>
            </div>
          )}

          {/* User Info Summary */}
          <div className="p-4 bg-[#0A0A0A] rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              {user.lastLogin && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Activity className="h-4 w-4" />
                  <span>Last Login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500">
              User ID: {user.id}
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              Basic Information
            </h3>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.profile.fullName}
                onChange={(e) => handleChange('profile.fullName', e.target.value)}
                className={`w-full bg-[#0A0A0A] border ${errors.fullName ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500`}
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
              )}
            </div>

            {/* Username & Email (Grid) */}
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

            {/* Phone & Position (Grid) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.profile.phone}
                  onChange={(e) => handleChange('profile.phone', e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="+62 812 3456 7890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <input
                  type="text"
                  value={formData.profile.position}
                  onChange={(e) => handleChange('profile.position', e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Project Engineer"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <input
                type="text"
                value={formData.profile.department}
                onChange={(e) => handleChange('profile.department', e.target.value)}
                className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Engineering"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Lock className="h-5 w-5 text-orange-400" />
                Password
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={changePassword}
                  onChange={(e) => setChangePassword(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-[#1A1A1A] checked:bg-blue-500"
                />
                <span className="text-sm text-gray-400">Change Password</span>
              </label>
            </div>

            {changePassword && (
              <>
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Password <span className="text-red-400">*</span>
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
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm New Password <span className="text-red-400">*</span>
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
                </div>
              </>
            )}
          </div>

          {/* Role & Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              Role & Permissions
            </h3>

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
              <label htmlFor="isActive" className="flex-1">
                <div className="font-medium">Active Account</div>
                <div className="text-sm text-gray-400">User can log in and access the system</div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-[#0A0A0A] border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
