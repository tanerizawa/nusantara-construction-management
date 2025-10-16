import React from 'react';
import { Inbox, Search } from 'lucide-react';
import Button from '../../Button';
import { TABLE_CONFIG } from '../config/tableConfig';

export const TableSkeleton = ({ 
  rows = TABLE_CONFIG.states.loading.rows,
  columns = 5 
}) => {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div 
              key={index} 
              className="h-4 bg-gray-300 rounded flex-1"
            />
          ))}
        </div>
      </div>
      
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={rowIndex} 
          className="px-6 py-4 border-b border-gray-200"
        >
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div 
                key={colIndex} 
                className="h-4 bg-gray-200 rounded flex-1"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const EmptyTable = ({ 
  message,
  searchQuery,
  onClearSearch,
  icon: Icon = Inbox,
  actionButton,
  className = ''
}) => {
  const isSearchResult = searchQuery && searchQuery.trim();
  const displayMessage = message || (
    isSearchResult 
      ? TABLE_CONFIG.states.empty.searchMessage
      : TABLE_CONFIG.states.empty.message
  );

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="flex flex-col items-center">
        {isSearchResult ? (
          <Search size={48} className="text-gray-300 mb-4" />
        ) : (
          <Icon size={48} className="text-gray-300 mb-4" />
        )}
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isSearchResult ? 'Tidak ada hasil ditemukan' : 'Tidak ada data'}
        </h3>
        
        <p className="text-gray-500 mb-6 max-w-sm">
          {isSearchResult 
            ? `Tidak ada hasil untuk "${searchQuery}"` 
            : displayMessage
          }
        </p>
        
        <div className="flex space-x-3">
          {isSearchResult && onClearSearch && (
            <Button 
              variant="secondary" 
              onClick={onClearSearch}
            >
              Hapus Pencarian
            </Button>
          )}
          
          {actionButton}
        </div>
      </div>
    </div>
  );
};

export const TableError = ({ 
  error,
  onRetry,
  className = ''
}) => {
  const errorMessage = error || TABLE_CONFIG.states.error.message;

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Terjadi Kesalahan
        </h3>
        
        <p className="text-gray-500 mb-6 max-w-sm">
          {errorMessage}
        </p>
        
        {onRetry && (
          <Button 
            variant="primary" 
            onClick={onRetry}
          >
            Coba Lagi
          </Button>
        )}
      </div>
    </div>
  );
};

export const LoadingOverlay = ({ 
  loading = false,
  message = TABLE_CONFIG.states.loading.message,
  className = ''
}) => {
  if (!loading) return null;

  return (
    <div className={`absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
};