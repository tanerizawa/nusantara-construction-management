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
import NotificationPanel from './NotificationPanel';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
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
    <header className="sticky top-0 z-30 bg-[#1C1C1E] backdrop-blur-xl border-b border-[#38383A] shadow-lg">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-[#98989D] hover:text-white hover:bg-[#2C2C2E] transition-colors duration-150 lg:hidden focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
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
            className="p-2 rounded-lg text-[#98989D] hover:text-white hover:bg-[#2C2C2E] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications - Using NotificationPanel */}
          <NotificationPanel />

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#2C2C2E] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#636366] to-[#48484A] rounded-full flex items-center justify-center shadow-lg">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white">
                  {user?.profile?.fullName || 'Admin User'}
                </p>
              </div>
              <ChevronDown size={16} className="text-[#636366]" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#2C2C2E] rounded-xl shadow-xl border border-[#38383A] py-2 z-50">
                <div className="px-4 py-3 border-b border-[#38383A]">
                  <p className="text-sm font-medium text-white">
                    {user?.profile?.fullName || 'Admin User'}
                  </p>
                  <p className="text-xs text-[#98989D]">System Administrator</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/settings/profile');
                  }}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-[#98989D] hover:text-white hover:bg-[#3A3A3C] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                >
                  <User size={16} className="mr-3" />
                  Profile
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-[#98989D] hover:text-white hover:bg-[#3A3A3C] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                >
                  <Settings size={16} className="mr-3" />
                  Pengaturan
                </button>
                
                <hr className="my-2 border-[#38383A]" />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-[#FF453A] hover:bg-[#FF453A]/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF453A]"
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
