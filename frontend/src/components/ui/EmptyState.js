import React from 'react';
import { AlertCircle, FileX, Search, Plus, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Empty State Components - Apple HIG Compliant
 * 
 * Provides various empty states for different scenarios
 */

// Generic Empty State
export const EmptyState = ({
  icon: Icon = FileX,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      {/* Icon */}
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      
      {/* Action */}
      {action && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action}
        </div>
      )}
    </div>
  );
};

// No Data State
export const NoData = ({
  title = 'Belum ada data',
  description = 'Data akan ditampilkan di sini setelah Anda menambahkan item pertama.',
  actionLabel = 'Tambah Data',
  onAction,
  className = ''
}) => {
  return (
    <EmptyState
      icon={FileX}
      title={title}
      description={description}
      action={onAction && (
        <Button 
          variant="primary" 
          icon={<Plus size={16} />}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
      className={className}
    />
  );
};

// No Search Results
export const NoSearchResults = ({
  query,
  onClear,
  onReset,
  className = ''
}) => {
  return (
    <EmptyState
      icon={Search}
      title="Tidak ada hasil ditemukan"
      description={
        query 
          ? `Tidak ada hasil untuk "${query}". Coba kata kunci yang berbeda.`
          : 'Coba ubah filter atau kata kunci pencarian Anda.'
      }
      action={
        <div className="flex flex-col sm:flex-row gap-3">
          {onClear && (
            <Button variant="secondary" onClick={onClear}>
              Hapus Pencarian
            </Button>
          )}
          {onReset && (
            <Button variant="ghost" onClick={onReset}>
              Reset Filter
            </Button>
          )}
        </div>
      }
      className={className}
    />
  );
};

// Error State
export const ErrorState = ({
  title = 'Terjadi kesalahan',
  description = 'Terjadi kesalahan saat memuat data. Silakan coba lagi.',
  onRetry,
  className = ''
}) => {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      action={onRetry && (
        <Button 
          variant="secondary" 
          icon={<RefreshCw size={16} />}
          onClick={onRetry}
        >
          Coba Lagi
        </Button>
      )}
      className={`${className} text-red-600`}
    />
  );
};

// Maintenance State
export const MaintenanceState = ({
  title = 'Sedang dalam pemeliharaan',
  description = 'Fitur ini sedang dalam pemeliharaan. Silakan coba lagi nanti.',
  estimatedTime,
  className = ''
}) => {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={
        estimatedTime 
          ? `${description} Estimasi selesai: ${estimatedTime}.`
          : description
      }
      className={className}
    />
  );
};

// No Permission State
export const NoPermission = ({
  title = 'Akses terbatas',
  description = 'Anda tidak memiliki izin untuk mengakses data ini. Hubungi administrator jika diperlukan.',
  className = ''
}) => {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      className={className}
    />
  );
};

// Coming Soon State
export const ComingSoon = ({
  title = 'Segera hadir',
  description = 'Fitur ini sedang dalam pengembangan dan akan segera tersedia.',
  className = ''
}) => {
  return (
    <EmptyState
      icon={Plus}
      title={title}
      description={description}
      className={className}
    />
  );
};

// Empty Table
export const EmptyTable = ({
  title = 'Belum ada data',
  description = 'Tabel akan menampilkan data setelah Anda menambahkan item.',
  actionLabel = 'Tambah Item',
  onAction,
  columns = 4
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table header placeholder */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex space-x-8">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded w-24"></div>
          ))}
        </div>
      </div>
      
      {/* Empty state */}
      <div className="p-12">
        <EmptyState
          title={title}
          description={description}
          action={onAction && (
            <Button 
              variant="primary" 
              icon={<Plus size={16} />}
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        />
      </div>
    </div>
  );
};

// Empty Card Grid
export const EmptyCardGrid = ({
  title = 'Belum ada item',
  description = 'Item akan ditampilkan di sini setelah Anda menambahkannya.',
  actionLabel = 'Tambah Item',
  onAction,
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
}) => {
  return (
    <div className={`grid ${gridCols} gap-6`}>
      {/* Placeholder cards */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="border-2 border-dashed border-gray-200 rounded-xl p-8">
          <div className="text-center text-gray-400">
            <FileX size={24} className="mx-auto mb-2" />
            <p className="text-sm">Slot kosong</p>
          </div>
        </div>
      ))}
      
      {/* Main empty state in center */}
      <div className="md:col-span-2 lg:col-span-3">
        <EmptyState
          title={title}
          description={description}
          action={onAction && (
            <Button 
              variant="primary" 
              icon={<Plus size={16} />}
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        />
      </div>
    </div>
  );
};

// Contextual Empty States for specific modules

// Projects Empty State
export const EmptyProjects = ({ onCreateProject }) => (
  <NoData
    title="Belum ada proyek"
    description="Mulai dengan membuat proyek konstruksi pertama Anda. Kelola timeline, budget, dan progress dengan mudah."
    actionLabel="Buat Proyek Baru"
    onAction={onCreateProject}
  />
);

// Inventory Empty State  
export const EmptyInventory = ({ onAddItem }) => (
  <NoData
    title="Inventory kosong"
    description="Tambahkan barang dan material untuk memulai pengelolaan inventory. Pantau stok dan kelola supplier dengan efisien."
    actionLabel="Tambah Barang"
    onAction={onAddItem}
  />
);

// Finance Empty State
export const EmptyFinance = ({ onAddTransaction }) => (
  <NoData
    title="Belum ada transaksi"
    description="Catat pemasukan dan pengeluaran untuk mengelola keuangan proyek. Pantau cash flow dan buat laporan keuangan."
    actionLabel="Tambah Transaksi"
    onAction={onAddTransaction}
  />
);

// Manpower Empty State
export const EmptyManpower = ({ onAddEmployee }) => (
  <NoData
    title="Belum ada data karyawan"
    description="Kelola data karyawan dan tenaga kerja. Atur assignment ke proyek dan pantau performa tim."
    actionLabel="Tambah Karyawan"
    onAction={onAddEmployee}
  />
);

// Tax Empty State
export const EmptyTax = ({ onAddTax }) => (
  <NoData
    title="Belum ada data pajak"
    description="Kelola kewajiban pajak dan pelaporan. Pantau due date dan status pembayaran untuk compliance yang baik."
    actionLabel="Tambah Data Pajak"
    onAction={onAddTax}
  />
);

// Users Empty State
export const EmptyUsers = ({ onAddUser }) => (
  <NoData
    title="Belum ada pengguna"
    description="Tambahkan pengguna sistem dan atur role akses. Kelola tim dan permissions untuk keamanan data."
    actionLabel="Tambah Pengguna"
    onAction={onAddUser}
  />
);

const EmptyStates = {
  EmptyState,
  NoData,
  NoSearchResults,
  ErrorState,
  MaintenanceState,
  NoPermission,
  ComingSoon,
  EmptyTable,
  EmptyCardGrid,
  EmptyProjects,
  EmptyInventory,
  EmptyFinance,
  EmptyManpower,
  EmptyTax,
  EmptyUsers
};

export default EmptyStates;
