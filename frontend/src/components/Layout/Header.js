import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  LogOut, 
  User, 
  Home, 
  ChevronDown, 
  Settings, 
  HelpCircle,
  Moon,
  Sun,
  CheckCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Proyek Selesai',
      message: 'Proyek Residential Complex A telah selesai dikerjakan',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      action: '/projects/1'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Sertifikat Akan Berakhir',
      message: 'Sertifikat K3 Ahmad Rizki akan berakhir dalam 30 hari',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
      action: '/manpower'
    },
    {
      id: 3,
      type: 'info',
      title: 'Update Sistem',
      message: 'Sistem telah diperbarui dengan fitur-fitur terbaru',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      action: null
    },
    {
      id: 4,
      type: 'error',
      title: 'Stok Menipis',
      message: 'Stok semen Portland kurang dari batas minimum',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      read: false,
      action: '/inventory'
    }
  ]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Navigate to notification action
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.action) {
      navigate(notification.action);
    }
    setShowNotifications(false);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} jam yang lalu`;
    } else if (minutes > 0) {
      return `${minutes} menit yang lalu`;
    } else {
      return 'Baru saja';
    }
  };

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-gray-200/60 dark:border-slate-700/60 shadow-lg shadow-gray-200/20 dark:shadow-slate-900/30 transition-all duration-300">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6 w-full">
        {/* Left side - Mobile menu button only */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-slate-700/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Right side - Notifications and User Menu - Positioned at far right */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-slate-700/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              title="Notifikasi"
            >
              <Bell size={20} />
              {/* Notification badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 lg:w-96 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/60 dark:border-slate-700/60 z-50 max-h-96 overflow-hidden transition-all duration-300 transform origin-top-right"
                style={{
                  maxWidth: 'calc(100vw - 2rem)',
                  right: '0',
                  top: '100%'
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100/80 dark:border-slate-700/80 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-slate-800/50 dark:to-slate-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifikasi</h3>
                  <div className="flex items-center space-x-2">
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-150"
                      >
                        Hapus Semua
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-150"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">Tidak ada notifikasi</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`flex items-start p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex-shrink-0 mr-3 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {formatTimestamp(notification.timestamp)}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-2"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="border-t border-gray-100 p-3">
                    <button
                      onClick={() => {
                        navigate('/notifications');
                        setShowNotifications(false);
                      }}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
                    >
                      Lihat Semua Notifikasi
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Subtle divider */}
          <div className="h-6 w-px bg-gray-200 dark:bg-slate-600 mx-1"></div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-100/80 dark:hover:bg-slate-700/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 group"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/40 transition-all duration-200">
                <User size={16} className="text-white" />
              </div>
              
              {/* User info - Hidden on mobile */}
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-tight">
                  {user?.profile?.fullName || user?.name || user?.username || 'User'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight font-medium">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Administrator'}
                </div>
              </div>
              
              {/* Dropdown arrow */}
              <ChevronDown 
                size={16} 
                className={`text-gray-400 dark:text-gray-500 transition-all duration-200 ${
                  showUserMenu ? 'rotate-180 text-blue-500' : 'group-hover:text-gray-600 dark:group-hover:text-gray-300'
                }`} 
              />
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-72 lg:w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/60 dark:border-slate-700/60 py-2 z-50 transition-all duration-300 transform origin-top-right"
                style={{
                  maxWidth: 'calc(100vw - 2rem)',
                  right: '0',
                  top: '100%'
                }}
              >
                {/* User info header - Always visible in dropdown */}
                <div className="px-4 py-3 border-b border-gray-100/80 dark:border-slate-700/80 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-slate-800/50 dark:to-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                      <User size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user?.profile?.fullName || user?.name || user?.username || 'User'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.profile?.email || user?.email || 'admin@ykconstruction.com'}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Administrator'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  {/* Navigation Section */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/admin/dashboard');
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-slate-700/80 transition-all duration-200"
                  >
                    <Home size={16} className="mr-3 text-blue-500 dark:text-blue-400" />
                    <div>
                      <div className="font-medium text-left">Dashboard</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-left">Kembali ke dashboard utama</div>
                    </div>
                  </button>

                  {/* User Account Section */}
                  <div className="border-t border-gray-100/80 dark:border-slate-700/80 mt-2 pt-2">
                    <div className="px-4 py-2">
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Akun Saya</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/admin/users');
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-slate-700/80 transition-all duration-200"
                    >
                      <User size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium">Profil Pengguna</span>
                    </button>

                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-slate-700/80 transition-all duration-200"
                    >
                      {isDarkMode ? (
                        <Sun size={16} className="mr-3 text-yellow-500" />
                      ) : (
                        <Moon size={16} className="mr-3 text-indigo-500" />
                      )}
                      <span className="font-medium">{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
                    </button>
                  </div>

                  {/* System Section */}
                  <div className="border-t border-gray-100/80 dark:border-slate-700/80 mt-2 pt-2">
                    <div className="px-4 py-2">
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sistem</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/admin/settings');
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-slate-700/80 transition-all duration-200"
                    >
                      <Settings size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium">Pengaturan</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        window.open('https://docs.ykconstruction.com', '_blank');
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-slate-700/80 transition-all duration-200"
                    >
                      <HelpCircle size={16} className="mr-3 text-green-500 dark:text-green-400" />
                      <span className="font-medium">Bantuan</span>
                    </button>
                  </div>
                </div>

                {/* System Status */}
                <div className="border-t border-gray-100 px-4 py-3">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500 font-medium">Status Sistem</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-semibold">Online</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Versi</span>
                      <p className="font-semibold text-gray-700">v2.1.0</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Server</span>
                      <p className="font-semibold text-gray-700">Jakarta</p>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100/80 dark:border-slate-700/80 pt-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 group"
                  >
                    <LogOut size={16} className="mr-3 group-hover:animate-pulse" />
                    <span className="font-medium">Keluar dari Sistem</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
