import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  LogOut, 
  User, 
  Settings, 
  Moon,
  Sun,
  ChevronDown
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

  // Mock notifications - simplified
  const notifications = [
    { id: 1, title: 'Proyek Selesai', message: 'Residential Complex A telah selesai', time: '2h' },
    { id: 2, title: 'Update Budget', message: 'Budget proyek perlu direview', time: '4h' },
    { id: 3, title: 'Material Tiba', message: 'Pengiriman material telah sampai', time: '6h' }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
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

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifikasi</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white">
                  {user?.profile?.fullName || 'Admin User'}
                </p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.profile?.fullName || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-600">System Administrator</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={16} className="mr-3" />
                  Profile
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={16} className="mr-3" />
                  Pengaturan
                </button>
                
                <hr className="my-2" />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} className="mr-3" />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
