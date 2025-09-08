import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  Package, 
  Users, 
  DollarSign, 
  FileText, 
  Settings,
  X,
  ChevronRight,
  Shield
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(new Set());

  // Navigation items - memoized to prevent unnecessary re-renders
  const navigationItems = React.useMemo(() => [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: FolderOpen
    },
    {
      name: 'Finance',
      href: '/finance',
      icon: DollarSign,
      submenu: [
        { name: 'Overview', href: '/finance' },
        { name: 'Transactions', href: '/finance/transactions' },
        { name: 'Reports', href: '/finance/reports' }
      ]
    },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: Package,
      submenu: [
        { name: 'Materials', href: '/inventory/materials' },
        { name: 'Equipment', href: '/inventory/equipment' },
        { name: 'Suppliers', href: '/inventory/suppliers' }
      ]
    },
    {
      name: 'Manpower',
      href: '/manpower',
      icon: Users,
      submenu: [
        { name: 'Employees', href: '/manpower' },
        { name: 'Attendance', href: '/manpower/attendance' },
        { name: 'Payroll', href: '/manpower/payroll' }
      ]
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: FileText,
      submenu: [
        { name: 'Project Reports', href: '/reports/projects' },
        { name: 'Financial Reports', href: '/reports/finance' },
        { name: 'Analytics', href: '/analytics' }
      ]
    },
    {
      name: 'Safety',
      href: '/safety',
      icon: Shield
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings
    }
  ], []);

  // Close sidebar on mobile when route changes
  const handleRouteChange = useCallback(() => {
    if (isOpen && window.innerWidth < 1024) {
      onClose();
    }
  }, [isOpen, onClose]);

  // Toggle submenu
  const toggleSubmenu = (itemName) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedMenus(newExpanded);
  };

  // Auto-expand active menu
  useEffect(() => {
    const activeItem = navigationItems.find(item => 
      item.submenu?.some(sub => location.pathname === sub.href) ||
      location.pathname.startsWith(item.href)
    );
    
    if (activeItem && activeItem.submenu) {
      setExpandedMenus(prev => new Set([...prev, activeItem.name]));
    }
  }, [location.pathname, navigationItems]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    handleRouteChange();
  }, [location.pathname, handleRouteChange]);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ${isOpen ? 'lg:w-64' : 'lg:w-16'}`}>
        <div className="flex flex-col w-full">
          <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 bg-gray-900/50">
              {isOpen && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">YK</span>
                  </div>
                  <h2 className="text-white text-lg font-semibold">Menu</h2>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.submenu ? (
                    // Menu with submenu
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                          location.pathname.startsWith(item.href)
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                          {isOpen && <span>{item.name}</span>}
                        </div>
                        {isOpen && (
                          <ChevronRight 
                            className={`w-4 h-4 transition-transform ${
                              expandedMenus.has(item.name) ? 'rotate-90' : ''
                            }`}
                          />
                        )}
                      </button>
                      
                      {/* Submenu */}
                      {isOpen && expandedMenus.has(item.name) && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <NavLink
                              key={subItem.href}
                              to={subItem.href}
                              className={({ isActive }) =>
                                `block px-3 py-2 text-sm rounded-lg transition-colors ${
                                  isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`
                              }
                            >
                              {subItem.name}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Simple menu item
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      {isOpen && <span>{item.name}</span>}
                    </NavLink>
                  )}
                </div>
              ))}
            </nav>

            {/* Footer */}
            {isOpen && (
              <div className="p-4 bg-gray-900/50">
                <div className="flex items-center space-x-3 px-3 py-2 bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">YK</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">YK Construction</p>
                    <p className="text-xs text-gray-400">Professional</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 bg-gray-900/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">YK</span>
              </div>
              <h2 className="text-white text-lg font-semibold">Menu</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  // Menu with submenu
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                        location.pathname.startsWith(item.href)
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform ${
                          expandedMenus.has(item.name) ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    
                    {/* Submenu */}
                    {expandedMenus.has(item.name) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <NavLink
                            key={subItem.href}
                            to={subItem.href}
                            className={({ isActive }) =>
                              `block px-3 py-2 text-sm rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                              }`
                            }
                          >
                            {subItem.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Simple menu item
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 bg-gray-900/50">
            <div className="flex items-center space-x-3 px-3 py-2 bg-gray-800 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">YK</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">YK Construction</p>
                <p className="text-xs text-gray-400">Professional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
