import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading State Components - Apple HIG Compliant
 * 
 * Provides various loading states for different UI scenarios
 */

// Main Loading Spinner
export const LoadingSpinner = ({ 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <Loader2 
      className={`animate-spin text-primary-600 ${sizes[size]} ${className}`}
      {...props}
    />
  );
};

// Page Loading State
export const PageLoader = ({ message = 'Memuat data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-gray-500 font-medium">{message}</p>
    </div>
  );
};

// Card Loading Skeleton
export const CardSkeleton = ({ rows = 3, className = '' }) => {
  return (
    <div className={`card animate-pulse ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* Content rows */}
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
        
        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

// Table Loading Skeleton
export const TableSkeleton = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-xl overflow-hidden border border-gray-200 ${className}`}>
      {/* Table Header Skeleton */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex space-x-8">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* Table Rows Skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
          <div className="flex space-x-8">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div 
                key={colIndex} 
                className={`h-4 bg-gray-200 rounded animate-pulse ${
                  colIndex === 0 ? 'w-32' : colIndex === columns - 1 ? 'w-16' : 'w-24'
                }`} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// List Loading Skeleton
export const ListSkeleton = ({ 
  items = 5, 
  showImage = false,
  className = '' 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="flex items-center space-x-4">
            {showImage && (
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
            )}
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Chart Loading Skeleton
export const ChartSkeleton = ({ 
  height = 'h-64',
  title = true,
  className = '' 
}) => {
  return (
    <div className={`card animate-pulse ${className}`}>
      {title && (
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      )}
      
      <div className={`bg-gray-200 rounded ${height} flex items-end justify-center space-x-2 p-4`}>
        {/* Simulated chart bars */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index} 
            className="bg-gray-300 rounded-t"
            style={{ 
              height: `${Math.random() * 60 + 20}%`, 
              width: '12px' 
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Button Loading State
export const ButtonLoading = ({ 
  children, 
  loading = false,
  loadingText = 'Memproses...',
  ...props 
}) => {
  return (
    <button 
      disabled={loading}
      className="btn-primary flex items-center space-x-2"
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      <span>{loading ? loadingText : children}</span>
    </button>
  );
};

// Inline Loading (for small areas)
export const InlineLoader = ({ 
  size = 'sm',
  text,
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <LoadingSpinner size={size} />
      {text && <span className="text-sm text-gray-500">{text}</span>}
    </div>
  );
};

// Loading overlay for existing content
export const LoadingOverlay = ({ 
  loading = false,
  children,
  message = 'Memuat...'
}) => {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
          <div className="flex flex-col items-center space-y-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-gray-600 font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Progress Loading (with percentage)
export const ProgressLoader = ({ 
  progress = 0,
  message = 'Memproses...',
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{message}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Pulse animation for any content
export const PulseLoader = ({ 
  children,
  loading = false,
  className = ''
}) => {
  return (
    <div className={`${loading ? 'animate-pulse' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Default export for easy importing
const LoadingComponents = {
  LoadingSpinner,
  PageLoader,
  CardSkeleton,
  TableSkeleton,
  ListSkeleton,
  ChartSkeleton,
  ButtonLoading,
  InlineLoader,
  LoadingOverlay,
  ProgressLoader,
  PulseLoader
};

export default LoadingComponents;
