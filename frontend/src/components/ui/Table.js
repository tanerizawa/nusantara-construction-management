import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, MoreHorizontal, ArrowUpDown, Filter, Search, Download, RefreshCw, Shield, User } from 'lucide-react';
import { StatusBadge, ProgressBadge, CategoryBadge, InventoryStatusBadge } from './Badge';
import Button from './Button';
import { Dropdown, DropdownItem, DropdownSeparator } from './Dropdown';
import { Input } from './Form';
import { EmptyTable } from './EmptyState';
import { TableSkeleton } from './Loading';

/**
 * Enhanced Table Components - Apple HIG Compliant
 * 
 * Comprehensive table system with sorting, filtering, search, and actions
 * Following Apple Human Interface Guidelines for data presentation
 */

// Base Table Component
export const Table = ({
  children,
  density = 'normal',
  bordered = true,
  striped = false,
  hoverable = true,
  className = '',
  ...props
}) => {
  const densityClasses = {
    compact: 'text-sm',
    normal: 'text-base',
    comfortable: 'text-lg'
  };
  
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table
          className={`
            w-full ${densityClasses[density]}
            ${striped ? '[&_tbody_tr:nth-child(even)]:bg-gray-50' : ''}
            ${hoverable ? '[&_tbody_tr]:hover:bg-gray-50' : ''}
            ${className}
          `}
          {...props}
        >
          {children}
        </table>
      </div>
    </div>
  );
};

// Table Header
export const TableHeader = ({ children, className = '', ...props }) => (
  <thead className={`bg-gray-50 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </thead>
);

// Table Body
export const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={`divide-y divide-gray-200 ${className}`} {...props}>
    {children}
  </tbody>
);

// Table Row
export const TableRow = ({ 
  children, 
  selected = false,
  onClick,
  className = '',
  ...props 
}) => (
  <tr
    onClick={onClick}
    className={`
      transition-colors duration-200
      ${selected ? 'bg-blue-50 border-blue-200' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </tr>
);

// Table Header Cell
export const TableHeaderCell = ({
  children,
  sortable = false,
  sortDirection,
  onSort,
  align = 'left',
  className = '',
  ...props
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  
  const content = sortable ? (
    <button
      type="button"
      onClick={onSort}
      className="group inline-flex items-center space-x-2 font-medium text-gray-700 hover:text-gray-900"
    >
      <span>{children}</span>
      <span className="flex flex-col">
        {sortDirection === 'asc' ? (
          <ChevronUp size={16} className="text-blue-600" />
        ) : sortDirection === 'desc' ? (
          <ChevronDown size={16} className="text-blue-600" />
        ) : (
          <ArrowUpDown size={16} className="text-gray-400 group-hover:text-gray-600" />
        )}
      </span>
    </button>
  ) : (
    <span className="font-medium text-gray-700">{children}</span>
  );
  
  return (
    <th
      className={`
        px-6 py-4 ${alignClasses[align]}
        text-xs font-medium text-gray-500 uppercase tracking-wider
        ${className}
      `}
      {...props}
    >
      {content}
    </th>
  );
};

// Table Cell
export const TableCell = ({
  children,
  align = 'left',
  className = '',
  ...props
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  
  return (
    <td
      className={`
        px-6 py-4 whitespace-nowrap text-gray-900
        ${alignClasses[align]}
        ${className}
      `}
      {...props}
    >
      {children}
    </td>
  );
};

// Enhanced Data Table
export const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  error = null,
  sortable = true,
  searchable = true,
  filterable = false,
  selectable = false,
  actions = [],
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  onSort,
  onSearch,
  onFilter,
  onSelect,
  onAction,
  emptyState,
  className = '',
  density = 'normal',
  ...props
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [filters, setFilters] = useState({});
  
  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filteredData = [...data];
    
    // Apply search
    if (searchQuery && searchable) {
      filteredData = filteredData.filter(row =>
        columns.some(column => {
          const value = row[column.key];
          return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filteredData = filteredData.filter(row => {
          const rowValue = row[key];
          return rowValue?.toString().toLowerCase().includes(value.toLowerCase());
        });
      }
    });
    
    // Apply sorting
    if (sortConfig.key && sortable) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filteredData;
  }, [data, searchQuery, filters, sortConfig, columns, searchable, sortable]);
  
  // Pagination
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = processedData.slice(startIndex, endIndex);
  
  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    const direction = 
      sortConfig.key === columnKey && sortConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc';
    
    const newSortConfig = { key: columnKey, direction };
    setSortConfig(newSortConfig);
    onSort?.(newSortConfig);
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch?.(query);
  };
  
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = paginatedData.map(row => row.id);
      setSelectedRows(allIds);
      onSelect?.(allIds);
    } else {
      setSelectedRows([]);
      onSelect?.([]);
    }
  };
  
  const handleSelectRow = (id, checked) => {
    const newSelected = checked
      ? [...selectedRows, id]
      : selectedRows.filter(rowId => rowId !== id);
    
    setSelectedRows(newSelected);
    onSelect?.(newSelected);
  };
  
  const handleBulkAction = (action) => {
    onAction?.(action, selectedRows);
  };
  
  if (loading) {
    return <TableSkeleton rows={pageSize} columns={columns.length} />;
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>
          Coba Lagi
        </Button>
      </div>
    );
  }
  
  if (processedData.length === 0 && !searchQuery) {
    return emptyState || <EmptyTable />;
  }
  
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          {/* Search */}
          {searchable && (
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari data..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          )}
          
          {/* Filters */}
          {filterable && (
            <Dropdown
              trigger={
                <Button variant="secondary" icon={<Filter size={16} />}>
                  Filter
                </Button>
              }
            >
              <div className="p-4 w-64">
                <h4 className="font-medium mb-3">Filter Data</h4>
                {columns
                  .filter(col => col.filterable)
                  .map(column => (
                    <div key={column.key} className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {column.title}
                      </label>
                      <Input
                        type="text"
                        placeholder={`Filter ${column.title.toLowerCase()}...`}
                        value={filters[column.key] || ''}
                        onChange={(e) => {
                          const newFilters = { ...filters, [column.key]: e.target.value };
                          setFilters(newFilters);
                          onFilter?.(newFilters);
                        }}
                      />
                    </div>
                  ))}
              </div>
            </Dropdown>
          )}
          
          {/* Bulk Actions */}
          {selectable && selectedRows.length > 0 && (
            <Dropdown
              trigger={
                <Button variant="secondary">
                  {selectedRows.length} dipilih
                </Button>
              }
            >
              {actions.map((action, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => handleBulkAction(action)}
                  variant={action.variant}
                  icon={action.icon}
                >
                  {action.label}
                </DropdownItem>
              ))}
            </Dropdown>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Refresh */}
          <Button variant="ghost" size="sm" icon={<RefreshCw size={16} />}>
            Refresh
          </Button>
          
          {/* Export */}
          <Button variant="ghost" size="sm" icon={<Download size={16} />}>
            Export
          </Button>
        </div>
      </div>
      
      {/* Table */}
      <Table density={density}>
        <TableHeader>
          <TableRow>
            {/* Select All Checkbox */}
            {selectable && (
              <TableHeaderCell className="w-4">
                <input
                  type="checkbox"
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </TableHeaderCell>
            )}
            
            {/* Column Headers */}
            {columns.map((column) => (
              <TableHeaderCell
                key={column.key}
                sortable={column.sortable !== false && sortable}
                sortDirection={sortConfig.key === column.key ? sortConfig.direction : null}
                onSort={() => handleSort(column.key)}
                align={column.align}
                className={column.headerClassName}
              >
                {column.title}
              </TableHeaderCell>
            ))}
            
            {/* Actions Column */}
            {actions.length > 0 && (
              <TableHeaderCell align="right" className="w-20">
                Aksi
              </TableHeaderCell>
            )}
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {paginatedData.map((row, rowIndex) => (
            <TableRow
              key={row.id || rowIndex}
              selected={selectedRows.includes(row.id)}
              className={row.className}
            >
              {/* Select Checkbox */}
              {selectable && (
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </TableCell>
              )}
              
              {/* Data Cells */}
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  className={column.className}
                >
                  {column.render 
                    ? column.render(row[column.key], row, rowIndex)
                    : row[column.key]
                  }
                </TableCell>
              ))}
              
              {/* Row Actions */}
              {actions.length > 0 && (
                <TableCell align="right">
                  <Dropdown
                    trigger={
                      <Button variant="ghost" size="sm" icon={<MoreHorizontal size={16} />} />
                    }
                  >
                    {actions.map((action, index) => (
                      <React.Fragment key={index}>
                        {action.type === 'separator' ? (
                          <DropdownSeparator />
                        ) : (
                          <DropdownItem
                            onClick={() => onAction?.(action, [row.id], row)}
                            variant={action.variant}
                            icon={action.icon}
                            disabled={action.disabled?.(row)}
                          >
                            {action.label}
                          </DropdownItem>
                        )}
                      </React.Fragment>
                    ))}
                  </Dropdown>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* No Results */}
      {processedData.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Tidak ada hasil untuk "{searchQuery}"
          </p>
          <Button 
            variant="ghost" 
            className="mt-2"
            onClick={() => handleSearch('')}
          >
            Hapus Pencarian
          </Button>
        </div>
      )}
      
      {/* Pagination Info */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Menampilkan {startIndex + 1} - {Math.min(endIndex, totalItems)} dari {totalItems} data
          </p>
          
          {totalPages > 1 && onPageChange && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                Sebelumnya
              </Button>
              
              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = currentPage - 2 + i;
                  if (pageNumber < 1 || pageNumber > totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => onPageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                Berikutnya
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Quick Table for simple data display
export const SimpleTable = ({
  data = [],
  columns = [],
  className = '',
  ...props
}) => {
  return (
    <Table className={className} {...props}>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHeaderCell key={index} align={column.align}>
              {column.title}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column, colIndex) => (
              <TableCell key={colIndex} align={column.align}>
                {column.render 
                  ? column.render(row[column.key], row, rowIndex)
                  : row[column.key]
                }
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Table components for YK Project modules
export const ProjectTable = ({ projects = [], ...props }) => {
  const columns = [
    {
      key: 'name',
      title: 'Nama Proyek',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{row.location}</div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'progress',
      title: 'Progress',
      align: 'center',
      render: (value) => <ProgressBadge progress={Number(value) || 0} />
    },
    {
      key: 'budget',
      title: 'Budget',
      align: 'right',
      render: (value) => {
        const num = typeof value === 'number'
          ? value
          : (value?.approvedBudget ?? value?.contractValue ?? value?.total ?? 0);
        return `Rp ${Number(num || 0).toLocaleString('id-ID')}`;
      }
    },
    {
      key: 'deadline',
      title: 'Deadline',
      render: (value) => (value ? new Date(value).toLocaleDateString('id-ID') : '-')
    }
  ];
  
  return <DataTable data={projects} columns={columns} {...props} />;
};

export const InventoryTable = ({ items = [], ...props }) => {
  const columns = [
    {
      key: 'name',
      title: 'Nama Barang',
      sortable: true
    },
    {
      key: 'category',
      title: 'Kategori',
      render: (value) => <CategoryBadge category={value} />
    },
    {
      key: 'quantity',
      title: 'Stok',
      align: 'center',
      render: (value, row) => (
        <div>
          <span className="font-medium">{value}</span>
          <span className="text-sm text-gray-500 ml-1">{row.unit}</span>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Harga',
      align: 'right',
  render: (value) => `Rp ${(Number(value) || 0).toLocaleString('id-ID')}`
    },
    {
      key: 'status',
      title: 'Status',
      render: (value, row) => (
        <InventoryStatusBadge 
          inStock={row.quantity > 0}
          quantity={row.quantity}
          minStock={row.minStock}
        />
      )
    }
  ];
  
  return <DataTable data={items} columns={columns} {...props} />;
};

// Financial Table Component
export const FinancialTable = ({ data = [], onEdit, onDelete, ...props }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const columns = [
    {
      key: 'date',
      title: 'Tanggal',
      render: (_value, item) => (item?.date ? new Date(item.date).toLocaleDateString('id-ID') : '-')
    },
    {
      key: 'type',
      title: 'Tipe',
      render: (_value, item) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item?.type === 'Pemasukan' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {item?.type || 'Transaksi'}
        </span>
      )
    },
    {
      key: 'description',
      title: 'Deskripsi',
      render: (_value, item) => (
        <div>
          <div className="font-medium">{item?.desc || item?.description || '-'}</div>
          {item?.reference && <div className="text-sm text-gray-500">Ref: {item.reference}</div>}
        </div>
      )
    },
    {
      key: 'amount',
      title: 'Jumlah',
      render: (_value, item) => (
        <span className={`font-bold ${
          item?.type === 'Pemasukan' ? 'text-green-600' : 'text-red-600'
        }`}>
          {item?.type === 'Pemasukan' ? '+' : '-'}
          {formatCurrency(Number(item?.amount) || 0)}
        </span>
      )
    },
    {
      key: 'category',
      title: 'Kategori',
      render: (_value, item) => <span className="capitalize">{item?.category || 'General'}</span>
    },
    {
      key: 'actions',
      title: 'Aksi',
      render: (_value, item) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit?.(item)}
            className="text-blue-600 hover:text-blue-900 text-sm"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete?.(item)}
            className="text-red-600 hover:text-red-900 text-sm"
          >
            Hapus
          </button>
        </div>
      )
    }
  ];

  return <DataTable data={data} columns={columns} {...props} />;
};

// User Table Component
export const UserTable = ({ data = [], onEdit, onResetPassword, onToggleStatus, ...props }) => {
  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-red-100 text-red-800', text: 'Administrator' },
      project_manager: { color: 'bg-blue-100 text-blue-800', text: 'Project Manager' },
      finance_manager: { color: 'bg-green-100 text-green-800', text: 'Finance Manager' },
      inventory_manager: { color: 'bg-purple-100 text-purple-800', text: 'Inventory Manager' },
      hr_manager: { color: 'bg-yellow-100 text-yellow-800', text: 'HR Manager' },
      supervisor: { color: 'bg-gray-100 text-gray-800', text: 'Supervisor' }
    };
    
    const config = roleConfig[role] || { color: 'bg-gray-100 text-gray-800', text: role };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Aktif</span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Tidak Aktif</span>
    );
  };

  const columns = [
    {
      key: 'user',
      title: 'Pengguna',
      render: (_value, item) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            {item?.role === 'admin' ? (
              <Shield size={16} className="text-red-600" />
            ) : (
              <User size={16} className="text-blue-600" />
            )}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">
              {item?.profile?.fullName || item?.username || '-'}
            </div>
            <div className="text-sm text-gray-500">{item?.email || '-'}</div>
            <div className="text-xs text-gray-400">{item?.username ? `@${item.username}` : '-'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      title: 'Role',
      render: (_value, item) => getRoleBadge(item?.role)
    },
    {
      key: 'position',
      title: 'Posisi',
      render: (_value, item) => item?.profile?.position || '-'
    },
    {
      key: 'joinDate',
      title: 'Bergabung',
      render: (_value, item) => item?.profile?.joinDate 
        ? new Date(item.profile.joinDate).toLocaleDateString('id-ID')
        : '-'
    },
    {
      key: 'status',
      title: 'Status',
      render: (_value, item) => getStatusBadge(item?.profile?.isActive)
    },
    {
      key: 'actions',
      title: 'Aksi',
      render: (_value, item) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit?.(item)}
            className="text-blue-600 hover:text-blue-900 text-sm"
          >
            Edit
          </button>
          {item?.role !== 'admin' && (
            <>
              <button 
                onClick={() => onResetPassword?.(item)}
                className="text-yellow-600 hover:text-yellow-900 text-sm"
              >
                Reset Password
              </button>
              <button 
                onClick={() => onToggleStatus?.(item)}
                className={`text-sm ${
                  item?.profile?.isActive 
                    ? 'text-red-600 hover:text-red-900' 
                    : 'text-green-600 hover:text-green-900'
                }`}
              >
                {item?.profile?.isActive ? 'Nonaktif' : 'Aktifkan'}
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return <DataTable data={data} columns={columns} {...props} />;
};

const TableComponents = {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  DataTable,
  SimpleTable,
  ProjectTable,
  InventoryTable,
  FinancialTable,
  UserTable
};

export default TableComponents;
