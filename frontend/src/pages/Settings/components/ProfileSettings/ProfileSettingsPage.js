import React, { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Phone, Briefcase, Building2, FileText, Camera, X, Save,
  Edit, Check, AlertCircle, Upload, Trash2, RefreshCw, Clock, MapPin,
  Calendar, Globe, Layout, Monitor
} from 'lucide-react';

const ProfileSettingsPage = () => {
  // User data state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Edit mode states
  const [editingSection, setEditingSection] = useState(null); // 'personal' | 'preferences' | null
  
  // Form data
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    bio: ''
  });
  
  const [preferences, setPreferences] = useState({
    defaultLandingPage: 'dashboard',
    itemsPerPage: 25,
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1,234.56'
  });
  
  // Avatar states
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  
  // Errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setProfile(data.data);
        
        // Set personal info
        setPersonalInfo({
          fullName: data.data.profile?.fullName || data.data.fullName || '',
          email: data.data.email || '',
          phone: data.data.profile?.phone || '',
          position: data.data.profile?.position || '',
          department: data.data.profile?.department || '',
          bio: data.data.profile?.bio || ''
        });
        
        // Set preferences
        setPreferences({
          defaultLandingPage: data.data.preferences?.defaultLandingPage || 'dashboard',
          itemsPerPage: data.data.preferences?.itemsPerPage || 25,
          timezone: data.data.preferences?.timezone || 'Asia/Jakarta',
          dateFormat: data.data.preferences?.dateFormat || 'DD/MM/YYYY',
          numberFormat: data.data.preferences?.numberFormat || '1,234.56'
        });
        
        // Set avatar
        if (data.data.avatar) {
          setAvatar(data.data.avatar);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      window.showToast && window.showToast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
    // Auto-save preferences
    savePreferences({ ...preferences, [field]: value });
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    
    if (!personalInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (personalInfo.phone && !/^[0-9+\-\s()]+$/.test(personalInfo.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const savePersonalInfo = async () => {
    if (!validatePersonalInfo()) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          fullName: personalInfo.fullName,
          phone: personalInfo.phone,
          position: personalInfo.position,
          department: personalInfo.department,
          bio: personalInfo.bio
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        window.showToast && window.showToast('Profile updated successfully!', 'success');
        setEditingSection(null);
        fetchProfile();
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      window.showToast && window.showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = async (prefs) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/auth/profile/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(prefs)
      });
      
      window.showToast && window.showToast('Preference saved', 'success');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      window.showToast && window.showToast('Please select an image file', 'error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      window.showToast && window.showToast('Image size must be less than 5MB', 'error');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Upload avatar
    uploadAvatar(file);
  };

  const uploadAvatar = async (file) => {
    setUploadingAvatar(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch('/api/auth/avatar', {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAvatar(data.avatarUrl);
        setAvatarPreview(null);
        window.showToast && window.showToast('Avatar updated successfully!', 'success');
      } else {
        throw new Error(data.error || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      window.showToast && window.showToast('Failed to upload avatar', 'error');
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeAvatar = async () => {
    if (!window.confirm('Are you sure you want to remove your avatar?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/avatar', {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAvatar(null);
        setAvatarPreview(null);
        window.showToast && window.showToast('Avatar removed successfully!', 'success');
      }
    } catch (error) {
      console.error('Error removing avatar:', error);
      window.showToast && window.showToast('Failed to remove avatar', 'error');
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const cancelEdit = () => {
    // Reset form to original values
    if (profile) {
      setPersonalInfo({
        fullName: profile.profile?.fullName || profile.fullName || '',
        email: profile.email || '',
        phone: profile.profile?.phone || '',
        position: profile.profile?.position || '',
        department: profile.profile?.department || '',
        bio: profile.profile?.bio || ''
      });
    }
    setEditingSection(null);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-400">Manage your personal information and preferences</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Avatar Section */}
        <div className="bg-[#1A1A1A] rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Profile Picture</h2>
          
          <div className="flex items-center gap-6">
            {/* Avatar Display */}
            <div className="relative">
              {avatarPreview || avatar ? (
                <img
                  src={avatarPreview || avatar}
                  alt="Avatar"
                  className="h-32 w-32 rounded-full object-cover border-4 border-gray-700"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold border-4 border-gray-700">
                  {getInitials(personalInfo.fullName || profile?.username)}
                </div>
              )}
              
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            {/* Avatar Actions */}
            <div className="flex-1">
              <h3 className="font-semibold mb-2">
                {personalInfo.fullName || profile?.username || 'User'}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                {personalInfo.position || 'No position set'} • {personalInfo.department || 'No department'}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  Upload New
                </button>
                
                {avatar && (
                  <button
                    onClick={removeAvatar}
                    disabled={uploadingAvatar}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG or GIF. Max size 5MB. Recommended 400x400px.
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-[#1A1A1A] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Personal Information</h2>
                <p className="text-sm text-gray-400">Your basic account details</p>
              </div>
            </div>
            
            {editingSection !== 'personal' && (
              <button
                onClick={() => setEditingSection('personal')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>

          {editingSection === 'personal' ? (
            // Edit Mode
            <div className="space-y-4 animate-slideDown">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                  className={`w-full bg-[#0A0A0A] border ${errors.fullName ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={personalInfo.email}
                    disabled
                    className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    Cannot be changed
                  </span>
                </div>
              </div>

              {/* Phone & Position */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    className={`w-full bg-[#0A0A0A] border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500`}
                    placeholder="+62 812 3456 7890"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <input
                    type="text"
                    value={personalInfo.position}
                    onChange={(e) => handlePersonalInfoChange('position', e.target.value)}
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
                  value={personalInfo.department}
                  onChange={(e) => handlePersonalInfoChange('department', e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Engineering"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={personalInfo.bio}
                  onChange={(e) => handlePersonalInfoChange('bio', e.target.value)}
                  rows={4}
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Tell us about yourself..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  {personalInfo.bio.length}/500 characters
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={cancelEdit}
                  disabled={saving}
                  className="px-6 py-2 bg-[#0A0A0A] border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={savePersonalInfo}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-4">
              <InfoItem icon={User} label="Full Name" value={personalInfo.fullName || '-'} />
              <InfoItem icon={Mail} label="Email" value={personalInfo.email || '-'} />
              <InfoItem icon={Phone} label="Phone" value={personalInfo.phone || '-'} />
              <InfoItem icon={Briefcase} label="Position" value={personalInfo.position || '-'} />
              <InfoItem icon={Building2} label="Department" value={personalInfo.department || '-'} />
              {personalInfo.bio && (
                <InfoItem icon={FileText} label="Bio" value={personalInfo.bio} />
              )}
            </div>
          )}
        </div>

        {/* Preferences Section */}
        <div className="bg-[#1A1A1A] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Monitor className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Preferences</h2>
              <p className="text-sm text-gray-400">Customize your experience</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Default Landing Page */}
            <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg">
              <div className="flex items-center gap-3">
                <Layout className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Default Landing Page</div>
                  <div className="text-sm text-gray-400">Page to show after login</div>
                </div>
              </div>
              <select
                value={preferences.defaultLandingPage}
                onChange={(e) => handlePreferenceChange('defaultLandingPage', e.target.value)}
                className="bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="dashboard">Dashboard</option>
                <option value="projects">Projects</option>
                <option value="finance">Finance</option>
                <option value="inventory">Inventory</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg">
              <div className="flex items-center gap-3">
                <Layout className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Items Per Page</div>
                  <div className="text-sm text-gray-400">Default page size for tables</div>
                </div>
              </div>
              <select
                value={preferences.itemsPerPage}
                onChange={(e) => handlePreferenceChange('itemsPerPage', parseInt(e.target.value))}
                className="bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Timezone */}
            <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Timezone</div>
                  <div className="text-sm text-gray-400">Your local timezone</div>
                </div>
              </div>
              <select
                value={preferences.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="Asia/Jakarta">Jakarta (WIB)</option>
                <option value="Asia/Makassar">Makassar (WITA)</option>
                <option value="Asia/Jayapura">Jayapura (WIT)</option>
                <option value="Asia/Singapore">Singapore</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            {/* Date Format */}
            <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Date Format</div>
                  <div className="text-sm text-gray-400">How dates are displayed</div>
                </div>
              </div>
              <select
                value={preferences.dateFormat}
                onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                className="bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (18/10/2025)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (10/18/2025)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2025-10-18)</option>
              </select>
            </div>

            {/* Number Format */}
            <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg">
              <div className="flex items-center gap-3">
                <span className="h-5 w-5 text-gray-400 flex items-center justify-center font-bold">123</span>
                <div>
                  <div className="font-medium">Number Format</div>
                  <div className="text-sm text-gray-400">Decimal and thousand separators</div>
                </div>
              </div>
              <select
                value={preferences.numberFormat}
                onChange={(e) => handlePreferenceChange('numberFormat', e.target.value)}
                className="bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="1,234.56">1,234.56 (US)</option>
                <option value="1.234,56">1.234,56 (EU)</option>
                <option value="1 234,56">1 234,56 (FR)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Activity */}
        <div className="bg-[#1A1A1A] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Clock className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Account Activity</h2>
              <p className="text-sm text-gray-400">Your recent account information</p>
            </div>
          </div>

          <div className="space-y-4">
            <InfoItem 
              icon={Clock} 
              label="Account Created" 
              value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }) : '-'} 
            />
            <InfoItem 
              icon={RefreshCw} 
              label="Last Updated" 
              value={profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : '-'} 
            />
            <InfoItem 
              icon={Clock} 
              label="Last Login" 
              value={profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Never'} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Info Item Component
const InfoItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#0A0A0A] transition-colors">
      <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
      <div className="flex-1">
        <div className="text-sm text-gray-400 mb-1">{label}</div>
        <div className="text-white">{value}</div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
