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
  Tag,
  ShoppingCart,
  TrendingUp,
  Bell,
  ClipboardList,
  Calculator,
  Clock,
  BarChart3
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState(new Set());
  const navRef = useRef(null);

  // Enhanced menu items dengan struktur yang lebih baik
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
          label: 'Stok Barang',
          description: 'Kelola stok dan item'
        },
        { 
          path: '/admin/inventory/warehouses', 
          icon: Building, 
          label: 'Gudang',
          description: 'Manajemen gudang'
        },
        { 
          path: '/admin/inventory/categories', 
          icon: Tag, 
          label: 'Kategori',
          description: 'Kategori produk'
        },
        { 
          path: '/admin/inventory/purchase-orders', 
          icon: ShoppingCart, 
          label: 'Purchase Order',
          description: 'Order pembelian'
        },
        { 
          path: '/admin/inventory/supplier-performance', 
          icon: TrendingUp, 
          label: 'Supplier Performance',
          description: 'Evaluasi supplier'
        },
        { 
          path: '/admin/inventory/reorder-alerts', 
          icon: Bell, 
          label: 'Reorder Alerts',
          description: 'Notifikasi restock'
        },
        { 
          path: '/admin/inventory/stock-opname', 
          icon: ClipboardList, 
          label: 'Stock Opname',
          description: 'Audit stok fisik'
        },
        { 
          path: '/admin/inventory/cost-allocation', 
          icon: Calculator, 
          label: 'Cost Allocation',
          description: 'Alokasi biaya material'
        }
      ]
    },
    { 
      path: '/admin/manpower', 
      icon: Users, 
      label: 'Manpower',
      color: 'text-orange-600',
      hoverColor: 'hover:bg-orange-50',
      hasSubmenu: true,
      submenu: [
        { 
          path: '/admin/manpower', 
          icon: Users, 
          label: 'Employee Overview',
          description: 'Daftar karyawan'
        },
        { 
          path: '/admin/manpower/attendance-payroll', 
          icon: Clock, 
          label: 'Attendance & Payroll',
          description: 'Absensi dan gaji'
        },
        { 
          path: '/admin/manpower/performance-analytics', 
          icon: BarChart3, 
          label: 'Performance Analytics',
          description: 'Analisis kinerja'
        }
      ]
    },
    { 
      path: '/admin/finance', 
      icon: DollarSign, 
      label: 'Keuangan',
      color: 'text-emerald-600',
      hoverColor: 'hover:bg-emerald-50'
    },
    { 
      path: '/admin/tax', 
      icon: FileText, 
      label: 'Pajak',
      color: 'text-red-600',
      hoverColor: 'hover:bg-red-50'
    },
    { 
      path: '/admin/users', 
      icon: Settings, 
      label: 'Users',
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
        {/* Enhanced Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/70 bg-white/80">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                YK Group
              </h1>
              <p className="text-xs text-gray-500">Construction SaaS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Enhanced Navigation with scrollable content and dynamic height */}
        <nav ref={navRef} className="flex-1 overflow-y-auto p-4 space-y-2 sidebar-scroll min-h-0">
          {menuItems.map((item) => (
            <div key={item.path} className="space-y-1">
              {/* Main Menu Item */}
              {item.hasSubmenu ? (
                <button
                  onClick={() => toggleSubmenu(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-200 group transform
                    ${openSubmenus.has(item.path)
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm scale-105'
                      : `text-gray-700 ${item.hoverColor || 'hover:bg-gray-100'} hover:scale-105`
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 transition-colors ${
                      openSubmenus.has(item.path) 
                        ? 'text-blue-600' 
                        : item.color || 'text-gray-500'
                    }`} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    openSubmenus.has(item.path) ? 'rotate-180' : ''
                  }`} />
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group transform ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                        : `text-gray-700 ${item.hoverColor || 'hover:bg-gray-100'} hover:translate-x-1 hover:scale-105`
                    }`
                  }
                >
                  <item.icon className={`w-5 h-5 transition-colors`} />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              )}

              {/* Enhanced Submenu with animations and unlimited height */}
              {item.hasSubmenu && (
                <div className={`transition-all duration-300 ease-in-out ${
                  openSubmenus.has(item.path) 
                    ? 'opacity-100 visible' 
                    : 'opacity-0 invisible h-0'
                }`}>
                  {openSubmenus.has(item.path) && (
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          onClick={handleLinkClick}
                          className={({ isActive }) =>
                            `flex items-start space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group transform ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md scale-105'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1 hover:scale-105'
                            }`
                          }
                        >
                          <subItem.icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{subItem.label}</div>
                            {subItem.description && (
                              <div className="text-xs opacity-75 truncate">{subItem.description}</div>
                            )}
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Enhanced Footer - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200/70 bg-white/60">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">YK</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500">System Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
