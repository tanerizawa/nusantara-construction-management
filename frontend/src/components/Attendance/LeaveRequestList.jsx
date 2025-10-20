import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './LeaveRequestList.css';

const LeaveRequestList = ({ 
  requests = [], 
  onApprove, 
  onReject, 
  isAdmin = false,
  isLoading = false 
}) => {
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Filter requests by status
  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(req => req.status === filter);

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All', icon: '📋', count: requests.length },
    { value: 'pending', label: 'Pending', icon: '⏳', count: requests.filter(r => r.status === 'pending').length },
    { value: 'approved', label: 'Approved', icon: '✓', count: requests.filter(r => r.status === 'approved').length },
    { value: 'rejected', label: 'Rejected', icon: '✗', count: requests.filter(r => r.status === 'rejected').length }
  ];

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate duration
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'Pending', color: 'warning', icon: '⏳' },
      approved: { text: 'Approved', color: 'success', icon: '✓' },
      rejected: { text: 'Rejected', color: 'danger', icon: '✗' }
    };
    return statusMap[status] || statusMap.pending;
  };

  // Get leave type info
  const getLeaveTypeInfo = (type) => {
    const typeMap = {
      vacation: { icon: '🏖️', label: 'Vacation' },
      sick: { icon: '🤒', label: 'Sick Leave' },
      personal: { icon: '👤', label: 'Personal' },
      emergency: { icon: '🚨', label: 'Emergency' },
      bereavement: { icon: '💐', label: 'Bereavement' }
    };
    return typeMap[type] || { icon: '📋', label: type };
  };

  // Handle approve
  const handleApprove = async (requestId) => {
    if (!window.confirm('Are you sure you want to approve this leave request?')) {
      return;
    }

    setActionLoading(`approve-${requestId}`);
    try {
      await onApprove(requestId);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle reject
  const handleReject = async (requestId) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) {
      return;
    }

    setActionLoading(`reject-${requestId}`);
    try {
      await onReject(requestId, reason);
    } finally {
      setActionLoading(null);
    }
  };

  // View details modal
  const openDetailsModal = (request) => {
    setSelectedRequest(request);
  };

  const closeDetailsModal = () => {
    setSelectedRequest(null);
  };

  if (isLoading) {
    return (
      <div className="leave-request-list loading">
        <div className="loading-spinner"></div>
        <p>Loading leave requests...</p>
      </div>
    );
  }

  return (
    <div className="leave-request-list">
      {/* Filter Tabs */}
      <div className="filter-tabs">
        {statusOptions.map(option => (
          <button
            key={option.value}
            className={`filter-tab ${filter === option.value ? 'active' : ''}`}
            onClick={() => setFilter(option.value)}
          >
            <span className="tab-icon">{option.icon}</span>
            <span className="tab-label">{option.label}</span>
            <span className="tab-count">{option.count}</span>
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Leave Requests</h3>
          <p>
            {filter === 'all' 
              ? 'No leave requests yet. Create your first request!' 
              : `No ${filter} leave requests found.`}
          </p>
        </div>
      ) : (
        <div className="requests-grid">
          {filteredRequests.map(request => {
            const status = getStatusBadge(request.status);
            const leaveType = getLeaveTypeInfo(request.leave_type);
            const duration = calculateDuration(request.start_date, request.end_date);

            return (
              <div key={request.id} className={`request-card ${request.status}`}>
                {/* Card Header */}
                <div className="card-header">
                  <div className="leave-type-badge">
                    <span className="type-icon">{leaveType.icon}</span>
                    <span className="type-label">{leaveType.label}</span>
                  </div>
                  <div className={`status-badge ${status.color}`}>
                    <span>{status.icon}</span>
                    <span>{status.text}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  {/* Date Range */}
                  <div className="date-range">
                    <div className="date-item">
                      <span className="date-label">From:</span>
                      <span className="date-value">{formatDate(request.start_date)}</span>
                    </div>
                    <span className="date-separator">→</span>
                    <div className="date-item">
                      <span className="date-label">To:</span>
                      <span className="date-value">{formatDate(request.end_date)}</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="duration-badge">
                    <span className="duration-icon">📅</span>
                    <span>{duration} {duration === 1 ? 'day' : 'days'}</span>
                  </div>

                  {/* Reason Preview */}
                  <div className="reason-preview">
                    <strong>Reason:</strong>
                    <p>{request.reason.substring(0, 100)}{request.reason.length > 100 ? '...' : ''}</p>
                  </div>

                  {/* Attachment Indicator */}
                  {request.attachment_url && (
                    <div className="attachment-indicator">
                      <span>📎</span>
                      <span>Has attachment</span>
                    </div>
                  )}

                  {/* Submitted Info */}
                  <div className="submitted-info">
                    <span className="submitted-label">Submitted:</span>
                    <span className="submitted-date">{formatDate(request.created_at)}</span>
                  </div>

                  {/* Approval Info */}
                  {request.status !== 'pending' && request.reviewed_at && (
                    <div className="review-info">
                      <span className="review-label">
                        {request.status === 'approved' ? 'Approved' : 'Rejected'} by:
                      </span>
                      <span className="reviewer-name">{request.reviewer_name || 'Admin'}</span>
                      <span className="review-date">{formatDate(request.reviewed_at)}</span>
                      {request.rejection_reason && (
                        <div className="rejection-reason">
                          <strong>Reason:</strong> {request.rejection_reason}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="card-footer">
                  <button
                    className="view-details-btn"
                    onClick={() => openDetailsModal(request)}
                  >
                    View Details
                  </button>

                  {/* Admin Actions */}
                  {isAdmin && request.status === 'pending' && (
                    <div className="admin-actions">
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(request.id)}
                        disabled={actionLoading === `approve-${request.id}`}
                      >
                        {actionLoading === `approve-${request.id}` ? (
                          <span className="spinner"></span>
                        ) : (
                          <>
                            <span>✓</span>
                            <span>Approve</span>
                          </>
                        )}
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(request.id)}
                        disabled={actionLoading === `reject-${request.id}`}
                      >
                        {actionLoading === `reject-${request.id}` ? (
                          <span className="spinner"></span>
                        ) : (
                          <>
                            <span>✗</span>
                            <span>Reject</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Leave Request Details</h3>
              <button className="close-btn" onClick={closeDetailsModal}>✗</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Employee:</span>
                <span className="detail-value">{selectedRequest.employee_name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Leave Type:</span>
                <span className="detail-value">
                  {getLeaveTypeInfo(selectedRequest.leave_type).icon} {getLeaveTypeInfo(selectedRequest.leave_type).label}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date Range:</span>
                <span className="detail-value">
                  {formatDate(selectedRequest.start_date)} → {formatDate(selectedRequest.end_date)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">
                  {calculateDuration(selectedRequest.start_date, selectedRequest.end_date)} days
                </span>
              </div>
              <div className="detail-row full">
                <span className="detail-label">Reason:</span>
                <p className="detail-value">{selectedRequest.reason}</p>
              </div>
              {selectedRequest.attachment_url && (
                <div className="detail-row full">
                  <span className="detail-label">Attachment:</span>
                  <a 
                    href={selectedRequest.attachment_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="attachment-link"
                  >
                    📎 View Attachment
                  </a>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${getStatusBadge(selectedRequest.status).color}`}>
                  {getStatusBadge(selectedRequest.status).icon} {getStatusBadge(selectedRequest.status).text}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

LeaveRequestList.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      employee_name: PropTypes.string,
      leave_type: PropTypes.string.isRequired,
      start_date: PropTypes.string.isRequired,
      end_date: PropTypes.string.isRequired,
      reason: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['pending', 'approved', 'rejected']).isRequired,
      attachment_url: PropTypes.string,
      created_at: PropTypes.string.isRequired,
      reviewed_at: PropTypes.string,
      reviewer_name: PropTypes.string,
      rejection_reason: PropTypes.string
    })
  ),
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  isAdmin: PropTypes.bool,
  isLoading: PropTypes.bool
};

export default LeaveRequestList;
