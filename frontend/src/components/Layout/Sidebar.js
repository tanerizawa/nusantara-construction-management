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
  ChevronDown,
  BarChart3,
  Building
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState(new Set());

  // Simplified menu structure - only essential items
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'projects',
      label: 'Proyek',
      icon: FolderOpen,
      path: '/projects'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      path: '/inventory',
      submenu: [
        { label: 'Stok Material', path: '/inventory' },
        { label: 'Supplier', path: '/inventory/suppliers' },
        { label: 'Pengadaan', path: '/inventory/procurement' }
      ]
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

  const toggleSubmenu = (itemId) => {
    const newOpenSubmenus = new Set(openSubmenus);
    if (newOpenSubmenus.has(itemId)) {
      newOpenSubmenus.delete(itemId);
    } else {
      newOpenSubmenus.add(itemId);
    }
    setOpenSubmenus(newOpenSubmenus);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSubmenuActive = (submenu) => {
    return submenu.some(item => isActive(item.path));
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
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuOpen = openSubmenus.has(item.id);
              const itemActive = isActive(item.path) || (hasSubmenu && isSubmenuActive(item.submenu));

              return (
                <li key={item.id}>
                  {hasSubmenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                          itemActive
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30'
                            : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon size={20} className={itemActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      
                      {/* Submenu */}
                      {isSubmenuOpen && (
                        <ul className="mt-2 ml-4 space-y-1 border-l border-slate-600/50 pl-4">
                          {item.submenu.map((subItem, index) => (
                            <li key={index}>
                              <NavLink
                                to={subItem.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                  `block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                    isActive
                                      ? 'text-blue-300 bg-blue-500/10'
                                      : 'text-gray-400 hover:text-white hover:bg-slate-700/30'
                                  }`
                                }
                              >
                                {subItem.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30'
                            : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                        }`
                      }
                    >
                      <Icon size={20} className={itemActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'} />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-700/50">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">NG</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
