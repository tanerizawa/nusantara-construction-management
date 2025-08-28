import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  ChevronDown,
  Building,
  ShoppingCart,
  ClipboardList,
  Clock,
  BarChart3
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState(new Set());
  const navRef = useRef(null);

  // Enhanced menu items dengan struktur yang sudah dioptimisasi
  const menuItems = useMemo(() => [
    { 
      path: '/admin/dashboard', 
      icon: Home, 
      label: 'Dashboard',
      color: 'text-blue-600',
      hoverColor: 'hover:bg-blue-50'
    },
    { 
      path: '/admin/projects', 
      icon: FolderOpen, 
      label: 'Proyek',
      color: 'text-green-600',
      hoverColor: 'hover:bg-green-50'
    },
    { 
      path: '/admin/inventory', 
      icon: Package, 
      label: 'Inventory',
      color: 'text-purple-600',
      hoverColor: 'hover:bg-purple-50',
      hasSubmenu: true,
      submenu: [
        { 
          path: '/admin/inventory', 
          icon: Package, 
          label: 'Stok & Material',
          description: 'Kelola stok dan item'
        },
        { 
          path: '/admin/inventory/warehouses', 
          icon: Building, 
          label: 'Gudang',
          description: 'Manajemen gudang'
        },
        { 
          path: '/admin/inventory/purchase-orders', 
          icon: ShoppingCart, 
          label: 'Purchase Order',
          description: 'Order & supplier'
        },
        { 
          path: '/admin/inventory/stock-opname', 
          icon: ClipboardList, 
          label: 'Stock Opname',
          description: 'Audit stok fisik'
        }
      ]
    },
    { 
      path: '/admin/manpower', 
      icon: Users, 
      label: 'SDM',
      color: 'text-orange-600',
      hoverColor: 'hover:bg-orange-50',
      hasSubmenu: true,
      submenu: [
        { 
          path: '/admin/manpower', 
          icon: Users, 
          label: 'Karyawan',
          description: 'Data karyawan'
        },
        { 
          path: '/admin/manpower/attendance-payroll', 
          icon: Clock, 
          label: 'Absensi & Payroll',
          description: 'Absensi dan gaji'
        },
        { 
          path: '/admin/manpower/performance-analytics', 
          icon: BarChart3, 
          label: 'Analisis Kinerja',
          description: 'Evaluasi performance'
        }
      ]
    },
    { 
      path: '/admin/finance', 
      icon: DollarSign, 
      label: 'Keuangan',
      color: 'text-emerald-600',
      hoverColor: 'hover:bg-emerald-50',
      hasSubmenu: true,
      submenu: [
        { 
          path: '/admin/finance', 
          icon: DollarSign, 
          label: 'Transaksi',
          description: 'Arus kas & transaksi'
        },
        { 
          path: '/admin/tax', 
          icon: FileText, 
          label: 'Pajak',
          description: 'Manajemen pajak'
        }
      ]
    },
    { 
      path: '/admin/reports', 
      icon: BarChart3, 
      label: 'Laporan',
      color: 'text-indigo-600',
      hoverColor: 'hover:bg-indigo-50',
      hasSubmenu: true,
      submenu: [
        { 
          path: '/admin/reports/projects', 
          icon: FolderOpen, 
          label: 'Laporan Proyek',
          description: 'Progress & budget'
        },
        { 
          path: '/admin/reports/financial', 
          icon: DollarSign, 
          label: 'Laporan Keuangan',
          description: 'P&L & cash flow'
        },
        { 
          path: '/admin/reports/inventory', 
          icon: Package, 
          label: 'Laporan Inventory',
          description: 'Stok & penggunaan'
        },
        { 
          path: '/admin/reports/hr', 
          icon: Users, 
          label: 'Laporan SDM',
          description: 'Absensi & kinerja'
        }
      ]
    },
    { 
      path: '/admin/users', 
      icon: Settings, 
      label: 'Sistem Admin',
      color: 'text-gray-600',
      hoverColor: 'hover:bg-gray-50'
    },
  ], []);

  // Enhanced submenu toggle - close others when one opens
  const toggleSubmenu = useCallback((path) => {
    setOpenSubmenus(prev => {
      const newSet = new Set();
      if (!prev.has(path)) {
        newSet.add(path);
      }
      return newSet;
    });
  }, []);

  // Keyboard navigation support
  const handleKeyNavigation = useCallback((event, action, path) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (action === 'toggle') {
        toggleSubmenu(path);
      } else if (action === 'close') {
        onClose();
      }
    }
    if (event.key === 'Escape') {
      onClose();
    }
  }, [toggleSubmenu, onClose]);

  // Auto-expand menus if on related pages and scroll to active item
  useEffect(() => {
    const newOpenSubmenus = new Set();
    
    menuItems.forEach(item => {
      if (item.hasSubmenu && location.pathname.startsWith(item.path)) {
        newOpenSubmenus.add(item.path);
      }
    });
    
    setOpenSubmenus(newOpenSubmenus);

    // Scroll to active menu item after a short delay
    setTimeout(() => {
      if (navRef.current) {
        const activeElement = navRef.current.querySelector('.bg-gradient-to-r.from-blue-500');
        if (activeElement) {
          activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
          });
        }
      }
    }, 100);
  }, [location.pathname, menuItems]);

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = useCallback(() => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  }, [onClose]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Enhanced Sidebar with dynamic height */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-white to-gray-50/50 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-xl border-r border-gray-200/50 transform transition-all duration-300 ease-in-out flex flex-col
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Clean Header with perfect symmetry */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
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
            onKeyDown={(e) => handleKeyNavigation(e, 'close')}
            aria-label="Close sidebar"
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-150"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Enhanced Navigation with perfect symmetry */}
        <nav ref={navRef} className="flex-1 overflow-y-auto px-3 py-6 sidebar-scroll min-h-0">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.path} className="transition-all duration-200">
                {/* Main Menu Item */}
                {item.hasSubmenu ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.path)}
                      onKeyDown={(e) => handleKeyNavigation(e, 'toggle', item.path)}
                      aria-expanded={openSubmenus.has(item.path)}
                      aria-controls={`submenu-${item.path}`}
                      aria-label={`Toggle ${item.label} submenu`}
                      className={`sidebar-item w-full flex items-center justify-between px-4 py-3.5 rounded-lg transition-all duration-200 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                        ${openSubmenus.has(item.path)
                          ? 'sidebar-active bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md border border-blue-100'
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm hover:border hover:border-gray-200'
                        }
                      `}
                  >
                    {/* Professional hover background with perfect alignment */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                    
                    <div className="flex items-center space-x-3.5 relative z-10">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <item.icon className={`w-5 h-5 transition-all duration-200 ${
                          openSubmenus.has(item.path) 
                            ? 'text-blue-600 scale-110' 
                            : `${item.color || 'text-gray-500'} group-hover:scale-110 group-hover:text-blue-600`
                        }`} />
                      </div>
                      <span className="text-sm font-medium tracking-wide">{item.label}</span>
                    </div>
                    <div className="flex-shrink-0 ml-auto">
                      <ChevronDown className={`w-4 h-4 transition-all duration-200 relative z-10 ${
                        openSubmenus.has(item.path) 
                          ? 'rotate-180 text-blue-600' 
                          : 'text-gray-400 group-hover:text-blue-600'
                      }`} />
                    </div>
                  </button>

                  {/* Professional Submenu with perfect spacing */}
                  <div 
                    id={`submenu-${item.path}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openSubmenus.has(item.path) 
                        ? 'max-h-96 opacity-100 submenu-expanded' 
                        : 'max-h-0 opacity-0 submenu-collapsed'
                    }`}
                    role="region"
                    aria-labelledby={`button-${item.path}`}
                  >
                    <div className="mt-2 ml-6 mr-2 space-y-1.5 border-l-2 border-gray-100 pl-4 pb-2">
                      {item.submenu.map((subItem, index) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          onClick={handleLinkClick}
                          className={({ isActive }) =>
                            `sidebar-item flex items-start space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                              isActive
                                ? 'sidebar-active bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50 hover:shadow-sm'
                            }`
                          }
                          style={{
                            transitionDelay: openSubmenus.has(item.path) ? `${index * 50}ms` : '0ms'
                          }}
                          aria-label={`Navigate to ${subItem.label}`}
                        >
                          {({ isActive }) => (
                            <>
                              {/* Professional submenu hover effect */}
                              {!isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                              )}
                              
                              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center relative z-10">
                                <subItem.icon className={`w-4 h-4 transition-all duration-200 ${
                                  isActive 
                                    ? 'text-white scale-110' 
                                    : 'text-gray-500 group-hover:scale-110 group-hover:text-blue-600'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0 relative z-10">
                                <div className={`text-sm font-medium truncate tracking-wide ${
                                  isActive ? 'text-white' : 'group-hover:text-gray-900'
                                }`}>{subItem.label}</div>
                                {subItem.description && (
                                  <div className={`text-xs opacity-75 truncate mt-0.5 ${
                                    isActive ? 'text-blue-100' : 'text-gray-500 group-hover:text-gray-600'
                                  }`}>{subItem.description}</div>
                                )}
                              </div>
                            </>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `sidebar-item flex items-center space-x-3.5 px-4 py-3.5 rounded-lg transition-all duration-200 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                      isActive
                        ? 'sidebar-active bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                    }`
                  }
                  aria-label={`Navigate to ${item.label}`}
                >
                  {({ isActive }) => (
                    <>
                      {/* Professional hover background for non-active items */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                      )}
                      
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <item.icon className={`w-5 h-5 transition-all duration-200 relative z-10 ${
                          isActive 
                            ? 'text-white scale-110' 
                            : `${item.color || 'text-gray-500'} group-hover:scale-110 group-hover:text-blue-600`
                        }`} />
                      </div>
                      <span className={`text-sm font-medium relative z-10 tracking-wide ${
                        isActive ? 'text-white' : 'group-hover:text-gray-900'
                      }`}>{item.label}</span>
                    </>
                  )}
                </NavLink>
              )}
              </div>
            ))}
          </div>
        </nav>

        {/* Professional Footer - Fixed at bottom with perfect alignment */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200/50 bg-gradient-to-r from-white via-gray-50/30 to-white backdrop-blur-sm">
          <div className="group flex items-center space-x-3.5 px-4 py-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50/50 hover:from-blue-50 hover:to-purple-50/50 transition-all duration-200 cursor-pointer hover:shadow-md shadow-sm">
            <div className="w-9 h-9 bg-gradient-to-br from-gray-400 to-gray-600 group-hover:from-blue-500 group-hover:to-purple-600 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-sm">
              <span className="text-white text-sm font-bold tracking-wide">YK</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-800 truncate transition-colors duration-200 tracking-wide">Admin User</p>
              <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200 font-medium">System Administrator</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm group-hover:shadow-green-400/50"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
