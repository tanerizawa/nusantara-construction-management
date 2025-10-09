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
  Activity,
  HardHat,
  TrendingDown,
  Wrench,
  PieChart
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
      id: 'assets',
      label: 'Asset Management',
      icon: HardHat,
      path: '/assets'
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
              className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 group focus:outline-none focus:ring-2 focus:ring-[#0A84FF] ${
                itemActive || item.submenu?.some(sub => isActive(sub.path))
                  ? 'bg-[#0A84FF]/20 text-[#0A84FF] border border-[#0A84FF]/30'
                  : 'text-[#98989D] hover:text-white hover:bg-[#2C2C2E]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon size={20} className={itemActive ? 'text-[#0A84FF]' : 'text-[#636366] group-hover:text-white'} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isExpanded ? (
                <ChevronDown size={16} className="text-[#636366]" />
              ) : (
                <ChevronRight size={16} className="text-[#636366]" />
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
              `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-150 group focus:outline-none focus:ring-2 focus:ring-[#0A84FF] ${
                level > 0 ? 'text-sm' : ''
              } ${
                isActive
                  ? 'bg-[#0A84FF]/20 text-[#0A84FF] border border-[#0A84FF]/30'
                  : 'text-[#98989D] hover:text-white hover:bg-[#2C2C2E]'
              }`
            }
          >
            <Icon size={level > 0 ? 16 : 20} className={itemActive ? 'text-[#0A84FF]' : 'text-[#636366] group-hover:text-white'} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1C1C1E] border-r border-[#38383A] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#38383A]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0A84FF] to-[#5E5CE6] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">NG</span>
            </div>
            <span className="text-white font-semibold text-lg">Nusantara Group</span>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#98989D] hover:text-white hover:bg-[#2C2C2E] transition-colors duration-150 lg:hidden focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
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
        <div className="p-4 border-t border-[#38383A]">
          <div className="px-4 py-2 rounded-lg bg-[#2C2C2E]">
            <div className="text-center">
              <p className="text-xs text-[#98989D]">Version 2.1.0</p>
              <p className="text-xs text-[#636366]">© 2025 Nusantara Group</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
