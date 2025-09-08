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
  BarChart3,
  Calendar,
  Calculator,
  Shield,
  Clipboard,
  Truck,
  PieChart,
  TrendingUp,
  Database,
  Bell,
  Search,
  UserCheck,
  Cog,
  Award,
  Target,
  Activity
} from 'lucide-react';

const SidebarProfessional = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const navRef = useRef(null);

  // Professional Construction Industry Menu Structure
  const menuItems = useMemo(() => [
    // === DASHBOARD SECTION ===
    { 
      path: '/admin/dashboard', 
      icon: Home, 
      label: 'Dashboard Utama',
      color: 'text-blue-600',
      hoverColor: 'hover:bg-blue-50',
      category: 'main'
    },
    
    // === PROJECT MANAGEMENT SECTION ===
    { 
      path: '/admin/projects', 
      icon: FolderOpen, 
      label: 'Manajemen Proyek',
      color: 'text-green-600',
      hoverColor: 'hover:bg-green-50',
      category: 'operations',
      hasSubmenu: true,
      submenu: [
        { 
          path: '/admin/projects', 
          icon: FolderOpen, 
          label: 'Daftar Proyek',
          description: 'Master proyek konstruksi'
        },
        { 
          path: '/admin/projects/scheduling', 
          icon: Calendar, 
          label: 'Penjadwalan',
          description: 'Timeline & milestone'
        },
        { 
          path: '/admin/projects/progress', 
          icon: TrendingUp, 
          label: 'Progress Tracking',
          description: 'Monitor kemajuan proyek'
        },
        { 
          path: '/admin/projects/quality', 
          icon: Award, 
          label: 'Quality Control',
          description: 'QA/QC & inspeksi'
        },
        { 
          path: '/admin/projects/safety', 
          icon: Shield, 
          label: 'Safety Management',
          description: 'K3 & safety protocol'
        }
      ]
    },

    // === INVENTORY & MATERIAL SECTION ===
    { 
      path: '/admin/inventory', 
      icon: Package, 
      label: 'Inventory & Material',
      color: 'text-purple-600',
      hoverColor: 'hover:bg-purple-50',
      category: 'operations',
      hasSubmenu: true,
      submenu: [
        { 
          path: '/admin/inventory', 
          icon: Package, 
          label: 'Master Material',
          description: 'Database material konstruksi'
        },
        { 
          path: '/admin/inventory/warehouses', 
          icon: Building, 
          label: 'Manajemen Gudang',
          description: 'Multi-warehouse management'
        },
        { 
          path: '/admin/inventory/stock-opname', 
          icon: ClipboardList, 
          label: 'Stock Opname',
          description: 'Audit stok & cycle count'
        },
        { 
          path: '/admin/inventory/reservations', 
          icon: Calendar, 
          label: 'Material Reservations',
          description: 'Booking material per proyek'
        },
        { 
          path: '/admin/inventory/boq-integration', 
          icon: FileText, 
          label: 'BOQ Integration',
          description: 'RAB & material planning'
        },
        { 
          path: '/admin/inventory/unit-converter', 
          icon: Calculator, 
          label: 'Unit Converter',
          description: 'Konversi satuan konstruksi'
        }
      ]
    },

    // === EQUIPMENT & MAINTENANCE SECTION ===
    { 
      path: '/admin/equipment', 
      icon: Cog, 
      label: 'Equipment & Maintenance',
      color: 'text-amber-600',
      hoverColor: 'hover:bg-amber-50',
      category: 'operations',
      hasSubmenu: true,
      submenu: [
        { 
          path: '/admin/inventory/maintenance', 
          icon: Settings, 
          label: 'Equipment Maintenance',
          description: 'Maintenance alat berat'
        },
        { 
          path: '/admin/equipment/fleet', 
          icon: Truck, 
          label: 'Fleet Management',
          description: 'Kendaraan & transport'
        },
        { 
          path: '/admin/equipment/rental', 
          icon: Calendar, 
          label: 'Equipment Rental',
          description: 'Sewa & rental tracking'
        }
      ]
    },

    // === PROCUREMENT SECTION ===
    { 
      path: '/admin/procurement', 
      icon: ShoppingCart, 
      label: 'Procurement',
      color: 'text-indigo-600',
      hoverColor: 'hover:bg-indigo-50',
      category: 'operations',
      hasSubmenu: true,
      submenu: [
        { 
          path: '/admin/inventory/purchase-orders', 
          icon: ShoppingCart, 
          label: 'Purchase Orders',
          description: 'PO & vendor management'
        },
        { 
          path: '/admin/procurement/vendors', 
          icon: Users, 
          label: 'Vendor Management',
          description: 'Supplier & kontrak'
        },
        { 
          path: '/admin/procurement/quotations', 
          icon: FileText, 
          label: 'Quotation Management',
          description: 'RFQ & price comparison'
        }
      ]
    },

    // === HUMAN RESOURCES SECTION ===
    { 
      path: '/admin/manpower', 
      icon: Users, 
      label: 'Human Resources',
      color: 'text-orange-600',
      hoverColor: 'hover:bg-orange-50',
      category: 'management',
      hasSubmenu: true,
      submenu: [
        { 
          path: '/admin/manpower', 
          icon: Users, 
          label: 'Manajemen Karyawan',
          description: 'Master data karyawan'
        },
        { 
          path: '/admin/manpower/attendance-payroll', 
          icon: Clock, 
          label: 'Absensi & Payroll',
          description: 'Kehadiran & penggajian'
        },
        { 
          path: '/admin/manpower/performance-analytics', 
          icon: Target, 
          label: 'Performance Analytics',
          description: 'KPI & evaluasi kinerja'
        },
        { 
          path: '/admin/manpower/training', 
          icon: Award, 
          label: 'Training & Certification',
          description: 'Pelatihan & sertifikasi'
        }
      ]
    },

    // === FINANCIAL MANAGEMENT SECTION ===
    { 
      path: '/admin/finance', 
      icon: DollarSign, 
      label: 'Financial Management',
      color: 'text-emerald-600',
      hoverColor: 'hover:bg-emerald-50',
      category: 'management',
      hasSubmenu: true,
      submenu: [
        { 
          path: '/admin/finance', 
          icon: DollarSign, 
          label: 'Cash Flow Management',
          description: 'Arus kas & transaksi'
        },
        { 
          path: '/admin/finance/budgeting', 
          icon: PieChart, 
          label: 'Project Budgeting',
          description: 'Budget planning & control'
        },
        { 
          path: '/admin/finance/cost-control', 
          icon: TrendingUp, 
          label: 'Cost Control',
          description: 'Cost tracking & variance'
        },
        { 
          path: '/admin/tax', 
          icon: FileText, 
          label: 'Tax Management',
          description: 'Perpajakan & compliance'
        }
      ]
    },

    // === REPORTING & ANALYTICS SECTION ===
    { 
      path: '/admin/reports', 
      icon: BarChart3, 
      label: 'Reports & Analytics',
      color: 'text-violet-600',
      hoverColor: 'hover:bg-violet-50',
      category: 'analytics',
      hasSubmenu: true,
      submenu: [
        { 
          path: '/admin/reports/executive', 
          icon: Activity, 
          label: 'Executive Dashboard',
          description: 'KPI & executive summary'
        },
        { 
          path: '/admin/reports/projects', 
          icon: FolderOpen, 
          label: 'Project Reports',
          description: 'Progress & milestone reports'
        },
        { 
          path: '/admin/reports/financial', 
          icon: DollarSign, 
          label: 'Financial Reports',
          description: 'P&L, cash flow, budget'
        },
        { 
          path: '/admin/reports/inventory', 
          icon: Package, 
          label: 'Inventory Reports',
          description: 'Stock movement & usage'
        },
        { 
          path: '/admin/reports/hr', 
          icon: Users, 
          label: 'HR Reports',
          description: 'Productivity & payroll'
        }
      ]
    },

    // === DOCUMENT MANAGEMENT SECTION ===
    { 
      path: '/admin/documents', 
      icon: Clipboard, 
      label: 'Document Management',
      color: 'text-teal-600',
      hoverColor: 'hover:bg-teal-50',
      category: 'system'
    },

    // === SYSTEM ADMINISTRATION SECTION ===
    { 
      path: '/admin/system', 
      icon: Settings, 
      label: 'System Administration',
      color: 'text-gray-600',
      hoverColor: 'hover:bg-gray-50',
      category: 'system',
      hasSubmenu: true,
      submenu: [
        { 
          path: '/admin/users', 
          icon: UserCheck, 
          label: 'User Management',
          description: 'Users, roles & permissions'
        },
        { 
          path: '/admin/system/settings', 
          icon: Cog, 
          label: 'System Settings',
          description: 'Configuration & preferences'
        },
        { 
          path: '/admin/system/backup', 
          icon: Database, 
          label: 'Backup & Recovery',
          description: 'Data backup & restore'
        },
        { 
          path: '/admin/system/logs', 
          icon: FileText, 
          label: 'System Logs',
          description: 'Activity & audit logs'
        }
      ]
    }
  ], []);

  // Group menu items by category for better organization
  const menuCategories = useMemo(() => {
    const categories = {
      main: { label: 'Dashboard', items: [] },
      operations: { label: 'Operations', items: [] },
      management: { label: 'Management', items: [] },
      analytics: { label: 'Analytics & Reports', items: [] },
      system: { label: 'System', items: [] }
    };

    menuItems.forEach(item => {
      const category = item.category || 'system';
      if (categories[category]) {
        categories[category].items.push(item);
      }
    });

    return categories;
  }, [menuItems]);

  // Filter menu items based on search query
  const filteredMenuItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems;
    
    return menuItems.filter(item => {
      const labelMatch = item.label.toLowerCase().includes(searchQuery.toLowerCase());
      const submenuMatch = item.submenu?.some(subItem => 
        subItem.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subItem.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return labelMatch || submenuMatch;
    });
  }, [menuItems, searchQuery]);

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
        const activeElement = navRef.current.querySelector('.sidebar-active');
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
      
      {/* Professional Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-gradient-to-b from-white to-gray-50/50 backdrop-blur-md supports-[backdrop-filter]:bg-white/95 shadow-xl border-r border-gray-200/50 transform transition-all duration-300 ease-in-out flex flex-col
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Enhanced Header with Search */}
        <div className="flex-shrink-0 border-b border-gray-200/70">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white text-lg font-bold tracking-wider">YK</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-wide">NUSANTARA GROUP</h1>
                <p className="text-xs text-gray-500 font-medium">Management System</p>
              </div>
            </div>
            <button
              onClick={onClose}
              onKeyDown={(e) => handleKeyNavigation(e, 'close')}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Professional Search Bar */}
          <div className="p-4 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Professional Navigation with Category Grouping */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" ref={navRef}>
          <div className="space-y-6">
            {searchQuery ? (
              /* Search Results */
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Search Results</h3>
                {filteredMenuItems.map((item, index) => (
                  <div key={`search-${item.path}`}>
                    {item.hasSubmenu ? (
                      <>
                        <button
                          onClick={() => toggleSubmenu(item.path)}
                          className="sidebar-item w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 bg-yellow-50 border border-yellow-200 text-yellow-800"
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.label}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                            openSubmenus.has(item.path) ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        {openSubmenus.has(item.path) && (
                          <div className="mt-2 ml-6 space-y-1 border-l-2 border-yellow-300 pl-4">
                            {item.submenu.map((subItem) => (
                              <NavLink
                                key={`search-sub-${subItem.path}`}
                                to={subItem.path}
                                onClick={handleLinkClick}
                                className={({ isActive }) =>
                                  `flex items-start space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                                    isActive
                                      ? 'bg-blue-500 text-white shadow-md sidebar-active'
                                      : 'text-gray-600 hover:bg-gray-50'
                                  }`
                                }
                              >
                                <subItem.icon className="w-4 h-4 mt-0.5" />
                                <div>
                                  <div className="text-sm font-medium">{subItem.label}</div>
                                  {subItem.description && (
                                    <div className="text-xs opacity-75">{subItem.description}</div>
                                  )}
                                </div>
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <NavLink
                        to={item.path}
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                          `sidebar-item flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                            isActive
                              ? 'bg-blue-500 text-white shadow-md sidebar-active'
                              : 'bg-yellow-50 border border-yellow-200 text-yellow-800 hover:bg-yellow-100'
                          }`
                        }
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </NavLink>
                    )}
                  </div>
                ))}
                {filteredMenuItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No menu items found</p>
                  </div>
                )}
              </div>
            ) : (
              /* Grouped Navigation */
              Object.entries(menuCategories).map(([categoryKey, category]) => (
                category.items.length > 0 && (
                  <div key={categoryKey} className="space-y-2">
                    {/* Category Header */}
                    <div className="flex items-center px-2 py-1">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {category.label}
                      </h3>
                      <div className="flex-1 ml-3 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                    </div>
                    
                    {/* Category Items */}
                    <div className="space-y-1">
                      {category.items.map((item, index) => (
                        <div key={item.path} className="group">
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
                                  {item.submenu.map((subItem, subIndex) => (
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
                                        transitionDelay: openSubmenus.has(item.path) ? `${subIndex * 50}ms` : '0ms'
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
                  </div>
                )
              ))
            )}
          </div>
        </nav>

        {/* Professional Footer */}
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

export default SidebarProfessional;
