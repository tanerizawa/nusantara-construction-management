import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  Package, 
  Users, 
  DollarSign, 
  Settings,
  X,
  BarChart3,
  Building,
  ChevronDown,
  ChevronRight,
  Calculator,
  CheckCircle,
  ShoppingCart,
  Calendar,
  FileText,
  Activity
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(['projects']); // Expand projects by default

  // Enhanced menu structure with submenus for Manajemen Proyek
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'projects',
      label: 'Manajemen Proyek',
      icon: FolderOpen,
      path: '/projects'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      path: '/inventory'
    },
    {
      id: 'manpower',
      label: 'SDM',
      icon: Users,
      path: '/manpower'
    },
    {
      id: 'finance',
      label: 'Keuangan',
      icon: DollarSign,
      path: '/finance'
    },
    {
      id: 'subsidiaries',
      label: 'Perusahaan',
      icon: Building,
      path: '/subsidiaries'
    },
    {
      id: 'reports',
      label: 'Laporan',
      icon: BarChart3,
      path: '/analytics'
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      icon: Settings,
      path: '/settings'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isSubmenuExpanded = (menuId) => {
    return expandedMenus.includes(menuId);
  };

  const renderMenuItem = (item, level = 0) => {
    const Icon = item.icon;
    const itemActive = isActive(item.path);
    const hasSubmenu = item.hasSubmenu && item.submenu;
    const isExpanded = isSubmenuExpanded(item.id);
    const indentClass = level > 0 ? 'ml-6' : '';

    return (
      <li key={item.id} className={indentClass}>
        {hasSubmenu ? (
          <>
            {/* Parent menu with toggle */}
            <button
              onClick={() => toggleSubmenu(item.id)}
              className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                itemActive || item.submenu?.some(sub => isActive(sub.path))
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon size={20} className={itemActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </button>
            
            {/* Submenu items */}
            {isExpanded && (
              <ul className="mt-2 space-y-1">
                {item.submenu.map(subItem => renderMenuItem(subItem, level + 1))}
              </ul>
            )}
          </>
        ) : (
          /* Regular menu item */
          <NavLink
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                level > 0 ? 'text-sm' : ''
              } ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
              }`
            }
          >
            <Icon size={level > 0 ? 16 : 20} className={itemActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">NG</span>
            </div>
            <span className="text-white font-semibold text-lg">Nusantara Group</span>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700/50 transition-colors lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => renderMenuItem(item))}
          </ul>
        </nav>

        {/* Footer - Version Info */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-slate-800/30 to-slate-700/30">
            <div className="text-center">
              <p className="text-xs text-gray-400">Version 2.1.0</p>
              <p className="text-xs text-gray-500">© 2025 Nusantara Group</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
