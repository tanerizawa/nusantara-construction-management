import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Building,
  ShoppingCart,
  ClipboardList,
  Clock,
  FileText,
  BarChart3
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState(new Set());

  // Fixed menu structure - menghilangkan redundancy dan memperbaiki routing
  const menuItems = useMemo(() => [
    { 
      path: '/admin/dashboard', 
      icon: Home, 
      label: 'Dashboard'
    },
    { 
      path: '/admin/projects', 
      icon: FolderOpen, 
      label: 'Proyek'
    },
    { 
      path: '/admin/inventory', 
      icon: Package, 
      label: 'Inventory',
      hasSubmenu: true,
      submenu: [
        { path: '/admin/inventory', icon: Package, label: 'Stok Barang' },
        { path: '/admin/inventory/suppliers', icon: ShoppingCart, label: 'Supplier' },
        { path: '/admin/inventory/orders', icon: ClipboardList, label: 'Purchase Orders' }
      ]
    },
    { 
      path: '/admin/manpower', 
      icon: Users, 
      label: 'SDM',
      hasSubmenu: true,
      submenu: [
        { path: '/admin/manpower', icon: Users, label: 'Karyawan' },
        { path: '/admin/manpower/attendance', icon: Clock, label: 'Absensi & Payroll' }
      ]
    },
    { 
      path: '/admin/finance', 
      icon: DollarSign, 
      label: 'Keuangan'
    },
    { 
      path: '/admin/tax', 
      icon: FileText, 
      label: 'Pajak'
    },
    { 
      path: '/admin/analytics', 
      icon: BarChart3, 
      label: 'Analytics'
    },
    { 
      path: '/admin/users', 
      icon: Settings, 
      label: 'Users & Settings'
    }
  ], []);

  // Simple submenu toggle
  const toggleSubmenu = useCallback((path) => {
    setOpenSubmenus(prev => {
      const newOpenSubmenus = new Set(prev);
      if (newOpenSubmenus.has(path)) {
        newOpenSubmenus.delete(path);
      } else {
        newOpenSubmenus.clear(); // Close others
        newOpenSubmenus.add(path);
      }
      return newOpenSubmenus;
    });
  }, []);

  // Handle navigation
  const handleLinkClick = useCallback((e) => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  }, [onClose]);

  // Auto-open submenu for current route - improved logic
  useEffect(() => {
    const newOpenSubmenus = new Set();
    menuItems.forEach(item => {
      if (item.hasSubmenu) {
        // Check if current path matches any submenu item
        const isSubmenuActive = item.submenu.some(subItem => 
          location.pathname === subItem.path || 
          (subItem.path.includes('?') && location.pathname === subItem.path.split('?')[0])
        );
        if (isSubmenuActive || location.pathname === item.path) {
          newOpenSubmenus.add(item.path);
        }
      }
    });
    setOpenSubmenus(newOpenSubmenus);
  }, [location.pathname, menuItems]);

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">YK Group</h1>
            <p className="text-xs text-gray-500">Construction SaaS</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-150"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 sidebar-scroll">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.path}>
              {item.hasSubmenu ? (
                <>
                  {/* Menu with submenu */}
                  <button
                    onClick={() => toggleSubmenu(item.path)}
                    aria-expanded={openSubmenus.has(item.path)}
                    className={`sidebar-item group w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      openSubmenus.has(item.path)
                        ? 'sidebar-active text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <item.icon className={`w-5 h-5 transition-colors duration-150 ${
                          openSubmenus.has(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-gray-600'
                        }`} />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <ChevronDown className={`w-4 h-4 transition-all duration-150 ${
                        openSubmenus.has(item.path) 
                          ? 'rotate-180 text-white' 
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                    </div>
                  </button>

                  {/* Submenu */}
                  <div className={`overflow-hidden transition-all duration-200 ease-in-out ${
                    openSubmenus.has(item.path) 
                      ? 'max-h-48 submenu-expanded' 
                      : 'max-h-0 submenu-collapsed'
                  }`}>
                    <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                      {item.submenu.map((subItem) => {
                        // Better active state detection
                        const isActiveSubItem = location.pathname === subItem.path || 
                          (subItem.path.includes('?') && location.pathname === subItem.path.split('?')[0]);
                        
                        return (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            onClick={handleLinkClick}
                            className={() =>
                              `sidebar-item group flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                isActiveSubItem
                                  ? 'sidebar-active text-white'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                              }`
                            }
                          >
                            <div className="w-4 h-4 flex items-center justify-center">
                              <subItem.icon className={`w-4 h-4 transition-colors duration-150 ${
                                isActiveSubItem ? 'text-white' : 'text-gray-500 group-hover:text-gray-600'
                              }`} />
                            </div>
                            <span className="text-sm">{subItem.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                // Regular menu item
                <NavLink
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `sidebar-item group flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isActive
                        ? 'sidebar-active text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-800'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="w-5 h-5 flex items-center justify-center">
                        <item.icon className={`w-5 h-5 transition-colors duration-150 ${
                          isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-600'
                        }`} />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">YK</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500">System Administrator</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
