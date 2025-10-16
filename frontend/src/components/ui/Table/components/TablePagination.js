import React from 'react';
import Button from '../../Button';
import { getVisiblePages, getPaginationInfo } from '../utils/tableUtils';

export const TablePagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50, 100],
  showSizeSelector = true,
  showInfo = true,
  maxVisiblePages = 5,
  className = ''
}) => {
  const paginationInfo = getPaginationInfo({
    startIndex: (currentPage - 1) * pageSize,
    endIndex: Math.min(currentPage * pageSize, totalItems),
    totalItems
  });

  const visiblePages = getVisiblePages(currentPage, totalPages, maxVisiblePages);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 ${className}`}>
      {/* Info and Page Size Selector */}
      <div className="flex items-center space-x-4">
        {showInfo && (
          <p className="text-sm text-gray-700">
            {paginationInfo}
          </p>
        )}
        
        {showSizeSelector && onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">per halaman</span>
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
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
            {/* First page if not visible */}
            {visiblePages[0] > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange(1)}
                >
                  1
                </Button>
                {visiblePages[0] > 2 && (
                  <span className="px-2 py-1 text-gray-500">...</span>
                )}
              </>
            )}
            
            {/* Visible page numbers */}
            {visiblePages.map(pageNumber => (
              <Button
                key={pageNumber}
                variant={pageNumber === currentPage ? "primary" : "ghost"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                className={pageNumber === currentPage ? 'min-w-[2rem]' : 'min-w-[2rem]'}
              >
                {pageNumber}
              </Button>
            ))}
            
            {/* Last page if not visible */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span className="px-2 py-1 text-gray-500">...</span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          
          {/* Next Button */}
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
  );
};