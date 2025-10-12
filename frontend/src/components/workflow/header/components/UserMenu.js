import React from 'react';
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useDropdown } from '../hooks';

/**
 * UserMenu Component
 * Displays notifications and user dropdown menu
 */
export const UserMenu = () => {
  const {
    isOpen,
    dropdownRef,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    closeDropdown
  } = useDropdown();

  // Mock notification count - should come from props/context
  const notificationCount = 3;

  // Mock user data - should come from auth context
  const user = {
    name: 'Admin User',
    email: 'admin@nusantara.com',
    role: 'Project Manager',
    avatar: null
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Notifications */}
      <button
        className="relative p-2 text-[#8E8E93] hover:text-white hover:bg-[#3A3A3C] rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell size={20} />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF3B30] text-white text-xs font-semibold rounded-full flex items-center justify-center">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>

      {/* User Dropdown */}
      <div
        ref={dropdownRef}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Trigger Button */}
        <button
          onClick={handleClick}
          className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-[#3A3A3C] rounded-lg transition-colors"
        >
          {/* Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-[#0A84FF] to-[#5E5CE6] rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          
          {/* User Name (hidden on mobile) */}
          <span className="text-sm font-medium hidden md:block">
            {user.name}
          </span>
          
          {/* Chevron */}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 hidden md:block ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-[#2C2C2E] border border-[#38383A] rounded-lg shadow-xl overflow-hidden z-50">
            {/* User Info */}
            <div className="p-4 border-b border-[#38383A]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0A84FF] to-[#5E5CE6] rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {user.name}
                  </p>
                  <p className="text-[#8E8E93] text-xs truncate">
                    {user.email}
                  </p>
                  <p className="text-[#8E8E93] text-xs mt-0.5">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  closeDropdown();
                  // Navigate to profile
                }}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-white hover:bg-[#3A3A3C] transition-colors"
              >
                <User size={18} className="text-[#8E8E93]" />
                <span className="text-sm">Profile Settings</span>
              </button>

              <button
                onClick={() => {
                  closeDropdown();
                  // Navigate to settings
                }}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-white hover:bg-[#3A3A3C] transition-colors"
              >
                <Settings size={18} className="text-[#8E8E93]" />
                <span className="text-sm">Account Settings</span>
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-[#38383A]">
              <button
                onClick={() => {
                  closeDropdown();
                  // Handle logout
                }}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-[#FF3B30] hover:bg-[#3A3A3C] transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu;
