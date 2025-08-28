import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const LABELS = {
  dashboard: 'Dashboard',
  projects: 'Proyek',
  inventory: 'Inventory',
  manpower: 'SDM',
  finance: 'Finance',
  tax: 'Pajak',
  users: 'Pengguna',
  analytics: 'Analytics',
  suppliers: 'Supplier',
  orders: 'Purchase Orders',
  warehouses: 'Gudang',
  categories: 'Kategori',
  'purchase-orders': 'Purchase Orders',
  'supplier-performance': 'Kinerja Supplier',
  'reorder-alerts': 'Alert Reorder',
  'stock-opname': 'Stock Opname',
  'cost-allocation': 'Alokasi Biaya',
  attendance: 'Absensi',
  'performance-analytics': 'Analisis Kinerja'
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on landing page, login, or if not in admin area
  if (pathnames.length === 0 || pathnames[0] !== 'admin') {
    return null;
  }

  // Remove 'admin' from pathnames since we don't want it in breadcrumbs
  const adminPathnames = pathnames.slice(1);

  // Don't show breadcrumbs if only on dashboard
  if (adminPathnames.length === 0 || (adminPathnames.length === 1 && adminPathnames[0] === 'dashboard')) {
    return null;
  }

  // Generate breadcrumb items
  const breadcrumbItems = [];

  // Always start with Dashboard
  breadcrumbItems.push({
    path: '/admin/dashboard',
    label: 'Dashboard',
    isLast: false
  });

  // Add current path items
  let currentPath = '/admin';
  adminPathnames.forEach((pathname, index) => {
    currentPath += `/${pathname}`;
    const isLast = index === adminPathnames.length - 1;
    
    // Handle special cases for dynamic routes (like IDs)
    let label;
    if (/^\d+$/.test(pathname)) {
      // If pathname is a number (ID), show "Detail"
      label = 'Detail';
    } else {
      label = LABELS[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
    }

    // Skip dashboard since we already added it
    if (pathname !== 'dashboard') {
      breadcrumbItems.push({
        path: currentPath,
        label,
        isLast
      });
    }
  });

  return (
    <nav className="bg-white border-b border-gray-200" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-3">
          <div className="flex items-center space-x-2">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.path}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                {item.isLast ? (
                  <span className="text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
