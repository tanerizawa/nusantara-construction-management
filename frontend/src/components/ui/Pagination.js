import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import Button from './Button';

/**
 * Pagination Components - Apple HIG Compliant
 * 
 * Comprehensive pagination system with various styles and configurations
 * Following Apple Human Interface Guidelines for navigation patterns
 */

// Base Pagination Component
export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  const sizes = {
    sm: {
      button: 'px-2 py-1 text-xs',
      spacing: 'space-x-1'
    },
    md: {
      button: 'px-3 py-2 text-sm',
      spacing: 'space-x-1'
    },
    lg: {
      button: 'px-4 py-2 text-base',
      spacing: 'space-x-2'
    }
  };
  
  const sizeConfig = sizes[size];
  
  // Generate page numbers to display
  const getVisiblePages = () => {
    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[0] > 2;
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !disabled) {
      onPageChange?.(page);
    }
  };
  
  const handlePageSizeChange = (newSize) => {
    if (onPageSizeChange && !disabled) {
      onPageSizeChange(newSize);
    }
  };
  
  if (totalPages <= 1 && !showInfo) return null;
  
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 ${className}`} {...props}>
      {/* Info */}
      {showInfo && (
        <div className="flex-1">
          <p className="text-sm text-gray-700">
            Menampilkan{' '}
            <span className="font-medium">{startItem}</span>
            {' '}-{' '}
            <span className="font-medium">{endItem}</span>
            {' '}dari{' '}
            <span className="font-medium">{totalItems.toLocaleString('id-ID')}</span>
            {' '}hasil
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between sm:justify-end space-x-4">
        {/* Page Size Selector */}
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Tampilkan:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              disabled={disabled}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav className={`flex items-center ${sizeConfig.spacing}`}>
            {/* First Page */}
            {showFirstLast && (
              <Button
                variant="ghost"
                size={size}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || disabled}
                icon={<ChevronsLeft size={16} />}
                className="hidden sm:inline-flex"
              >
                Pertama
              </Button>
            )}
            
            {/* Previous Page */}
            <Button
              variant="ghost"
              size={size}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || disabled}
              icon={<ChevronLeft size={16} />}
            >
              <span className="hidden sm:inline">Sebelumnya</span>
            </Button>
            
            {/* First page number */}
            {visiblePages[0] > 1 && (
              <>
                <Button
                  variant={1 === currentPage ? "primary" : "ghost"}
                  size={size}
                  onClick={() => handlePageChange(1)}
                  disabled={disabled}
                >
                  1
                </Button>
                {showLeftEllipsis && (
                  <span className="px-2 py-1 text-gray-500">
                    <MoreHorizontal size={16} />
                  </span>
                )}
              </>
            )}
            
            {/* Visible page numbers */}
            {visiblePages.map(page => (
              <Button
                key={page}
                variant={page === currentPage ? "primary" : "ghost"}
                size={size}
                onClick={() => handlePageChange(page)}
                disabled={disabled}
                className="min-w-[40px]"
              >
                {page}
              </Button>
            ))}
            
            {/* Last page number */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {showRightEllipsis && (
                  <span className="px-2 py-1 text-gray-500">
                    <MoreHorizontal size={16} />
                  </span>
                )}
                <Button
                  variant={totalPages === currentPage ? "primary" : "ghost"}
                  size={size}
                  onClick={() => handlePageChange(totalPages)}
                  disabled={disabled}
                >
                  {totalPages}
                </Button>
              </>
            )}
            
            {/* Next Page */}
            <Button
              variant="ghost"
              size={size}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || disabled}
              iconPosition="right"
              icon={<ChevronRight size={16} />}
            >
              <span className="hidden sm:inline">Berikutnya</span>
            </Button>
            
            {/* Last Page */}
            {showFirstLast && (
              <Button
                variant="ghost"
                size={size}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || disabled}
                iconPosition="right"
                icon={<ChevronsRight size={16} />}
                className="hidden sm:inline-flex"
              >
                Terakhir
              </Button>
            )}
          </nav>
        )}
      </div>
    </div>
  );
};

// Simple Pagination (Previous/Next only)
export const SimplePagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showLabels = true,
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !disabled) {
      onPageChange?.(page);
    }
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <div className={`flex items-center justify-between ${className}`} {...props}>
      <Button
        variant="ghost"
        size={size}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
        icon={<ChevronLeft size={16} />}
      >
        {showLabels && <span className="hidden sm:inline">Sebelumnya</span>}
      </Button>
      
      <span className="text-sm text-gray-700">
        Halaman {currentPage} dari {totalPages}
      </span>
      
      <Button
        variant="ghost"
        size={size}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
        iconPosition="right"
        icon={<ChevronRight size={16} />}
      >
        {showLabels && <span className="hidden sm:inline">Berikutnya</span>}
      </Button>
    </div>
  );
};

// Infinite Scroll Pagination (Load More button)
export const InfinitePagination = ({
  hasMore = false,
  loading = false,
  onLoadMore,
  loadMoreText = 'Muat Lebih Banyak',
  loadingText = 'Memuat...',
  endText = 'Tidak ada data lagi',
  size = 'md',
  className = '',
  ...props
}) => {
  if (!hasMore && !loading) {
    return (
      <div className={`text-center py-4 ${className}`} {...props}>
        <p className="text-sm text-gray-500">{endText}</p>
      </div>
    );
  }
  
  return (
    <div className={`text-center py-4 ${className}`} {...props}>
      <Button
        variant="secondary"
        size={size}
        onClick={onLoadMore}
        disabled={loading}
        loading={loading}
      >
        {loading ? loadingText : loadMoreText}
      </Button>
    </div>
  );
};

// Numbered Pagination (for step-by-step processes)
export const StepPagination = ({
  currentStep = 1,
  totalSteps = 1,
  steps = [],
  onStepChange,
  allowBacktrack = true,
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };
  
  const sizeClass = sizes[size];
  
  const handleStepChange = (step) => {
    if (disabled) return;
    
    // Allow moving to completed steps or next step
    if (allowBacktrack || step <= currentStep + 1) {
      onStepChange?.(step);
    }
  };
  
  return (
    <nav className={`flex items-center justify-center ${className}`} {...props}>
      <ol className="flex items-center space-x-2 sm:space-x-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const stepData = steps[index];
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = allowBacktrack || stepNumber <= currentStep + 1;
          
          return (
            <li key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <button
                type="button"
                onClick={() => handleStepChange(stepNumber)}
                disabled={!isClickable || disabled}
                className={`
                  ${sizeClass} rounded-full border-2 flex items-center justify-center font-medium
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : isCompleted 
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-gray-300 text-gray-500 bg-white'
                  }
                  ${isClickable && !disabled 
                    ? 'hover:border-blue-500 cursor-pointer' 
                    : 'cursor-not-allowed opacity-50'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </button>
              
              {/* Step Label */}
              {stepData?.label && (
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {stepData.label}
                </span>
              )}
              
              {/* Connector Line */}
              {stepNumber < totalSteps && (
                <div className={`ml-4 w-8 sm:w-12 h-0.5 ${
                  stepNumber < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Pagination Hook for easy state management
export const usePagination = ({
  totalItems = 0,
  itemsPerPage = 10,
  initialPage = 1
} = {}) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [pageSize, setPageSize] = React.useState(itemsPerPage);
  
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };
  
  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };
  
  const goToFirstPage = () => {
    goToPage(1);
  };
  
  const goToLastPage = () => {
    goToPage(totalPages);
  };
  
  const changePageSize = (newSize) => {
    setPageSize(newSize);
    // Recalculate current page to maintain roughly the same position
    const currentItem = (currentPage - 1) * pageSize + 1;
    const newPage = Math.ceil(currentItem / newSize);
    setCurrentPage(newPage);
  };
  
  // Calculate data slice for current page
  const getPageData = (data) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };
  
  // Reset to first page when total items change
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalItems, pageSize, currentPage, totalPages]);
  
  return {
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    changePageSize,
    getPageData,
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
    startItem: (currentPage - 1) * pageSize + 1,
    endItem: Math.min(currentPage * pageSize, totalItems)
  };
};

const PaginationComponents = {
  Pagination,
  SimplePagination,
  InfinitePagination,
  StepPagination,
  usePagination
};

export default PaginationComponents;
