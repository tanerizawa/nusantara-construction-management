import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AttendanceListItem from '../components/Attendance/AttendanceListItem';
import AttendanceFilters from '../components/Attendance/AttendanceFilters';
import PhotoViewer from '../components/Attendance/PhotoViewer';
import ErrorBoundary from '../components/ErrorBoundary';
import './AttendanceHistory.css';

/**
 * AttendanceHistory Component
 * 
 * Display paginated list of attendance records with:
 * - Date range filtering
 * - Status filtering (all/present/late/absent)
 * - Search by notes
 * - Photo viewer modal
 * - Pagination (20 records per page)
 * - Export to CSV
 */
const AttendanceHistory = () => {
  const navigate = useNavigate();

  // State
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    startDate: getDefaultStartDate(),
    endDate: new Date().toISOString().split('T')[0],
    status: 'all',
    search: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const recordsPerPage = 20;

  // Get token
  const getToken = () => localStorage.getItem('token');

  // Get default start date (30 days ago)
  function getDefaultStartDate() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }

  // Fetch attendance records
  const fetchRecords = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Build query params
      const params = new URLSearchParams({
        start_date: filters.startDate,
        end_date: filters.endDate,
        page: currentPage,
        limit: recordsPerPage
      });

      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }

      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await fetch(`/api/attendance/history?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch attendance history');
      }

      const data = await response.json();
      
      setRecords(data.data || []);
      setTotalRecords(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / recordsPerPage));
    } catch (err) {
      console.error('Error fetching records:', err);
      setError(err.message || 'Failed to load attendance history');
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage, navigate]);

  // Fetch records on mount and when filters/page change
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle photo view
  const handleViewPhoto = (photoUrl) => {
    setSelectedPhoto(photoUrl);
  };

  // Handle photo close
  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    try {
      // Prepare CSV data
      const headers = [
        'Date',
        'Clock In',
        'Clock Out',
        'Duration (hours)',
        'Status',
        'Location',
        'Notes'
      ];

      const rows = records.map(record => [
        new Date(record.clock_in_time).toLocaleDateString('id-ID'),
        new Date(record.clock_in_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        record.clock_out_time 
          ? new Date(record.clock_out_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          : '-',
        record.total_duration_minutes 
          ? (record.total_duration_minutes / 60).toFixed(2)
          : '-',
        record.status || 'present',
        record.location_name || '-',
        record.notes || '-'
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `attendance_history_${filters.startDate}_to_${filters.endDate}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      setError('Failed to export CSV. Please try again.');
    }
  };

  // Handle back
  const handleBack = () => {
    navigate('/attendance');
  };

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        className="pagination-btn"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Prev
      </button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="pagination-btn"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="pagination-dots">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="pagination-dots">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="pagination-btn"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        className="pagination-btn"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    );

    return <div className="pagination">{pages}</div>;
  };

  return (
    <ErrorBoundary message="Failed to load attendance history">
      <div className="attendance-history">
        {/* Header */}
        <div className="history-header">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <div className="header-content">
            <h1>Attendance History</h1>
            <p>View your past attendance records</p>
          </div>
          <button className="export-btn" onClick={handleExportCSV} disabled={records.length === 0}>
            📥 Export CSV
          </button>
        </div>

        {/* Filters */}
        <AttendanceFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          recordCount={totalRecords}
        />

        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <strong>Error</strong>
              <p>{error}</p>
            </div>
            <button className="alert-close" onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading attendance history...</p>
          </div>
        )}

        {/* Records List */}
        {!isLoading && records.length > 0 && (
          <div className="records-container">
            <div className="records-header">
              <h2>
                Showing {records.length} of {totalRecords} records
              </h2>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="records-list">
              {records.map((record) => (
                <AttendanceListItem
                  key={record.id}
                  record={record}
                  onViewPhoto={handleViewPhoto}
                />
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && records.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h2>No Records Found</h2>
            <p>
              {filters.search
                ? `No records match "${filters.search}"`
                : filters.status !== 'all'
                ? `No ${filters.status} records in this date range`
                : 'No attendance records found for the selected date range'}
            </p>
            <button className="reset-btn" onClick={() => handleFilterChange({
              startDate: getDefaultStartDate(),
              endDate: new Date().toISOString().split('T')[0],
              status: 'all',
              search: ''
            })}>
              Reset Filters
            </button>
          </div>
        )}

        {/* Photo Viewer Modal */}
        {selectedPhoto && (
          <PhotoViewer
            photoUrl={selectedPhoto}
            onClose={handleClosePhoto}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AttendanceHistory;
