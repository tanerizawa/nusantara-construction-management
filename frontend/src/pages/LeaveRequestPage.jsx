import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaveRequestForm from '../components/Attendance/LeaveRequestForm';
import LeaveRequestList from '../components/Attendance/LeaveRequestList';
import './LeaveRequestPage.css';

const LeaveRequestPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        setCurrentUser(data.user);
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // Fetch leave requests
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/attendance/leave-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch leave requests');
      }

      const data = await response.json();
      setRequests(data.data || []);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Handle submit leave request
  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/attendance/leave-request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData // FormData with multipart/form-data
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit leave request');
      }

      const data = await response.json();
      
      // Show success message
      alert('Leave request submitted successfully!');
      
      // Refresh requests list
      await fetchRequests();
      
      // Switch to list tab
      setActiveTab('list');
    } catch (err) {
      console.error('Error submitting leave request:', err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle approve leave request
  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/attendance/leave-request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'approved'
        })
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve leave request');
      }

      // Show success message
      alert('Leave request approved successfully!');
      
      // Refresh requests list
      await fetchRequests();
    } catch (err) {
      console.error('Error approving leave request:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Handle reject leave request
  const handleReject = async (requestId, reason) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/attendance/leave-request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'rejected',
          rejection_reason: reason
        })
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject leave request');
      }

      // Show success message
      alert('Leave request rejected successfully!');
      
      // Refresh requests list
      await fetchRequests();
    } catch (err) {
      console.error('Error rejecting leave request:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Handle cancel form
  const handleCancel = () => {
    setActiveTab('list');
  };

  return (
    <div className="leave-request-page">
      {/* Page Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/attendance')}>
          <span>←</span>
          <span>Back</span>
        </button>
        <div className="header-content">
          <h1>Leave Requests</h1>
          <p>Manage your leave requests and approvals</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <span className="tab-icon">📋</span>
          <span className="tab-label">My Requests</span>
          <span className="tab-count">{requests.length}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          <span className="tab-icon">➕</span>
          <span className="tab-label">New Request</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-alert">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
          <button className="error-close" onClick={() => setError(null)}>✗</button>
        </div>
      )}

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'list' ? (
          <LeaveRequestList
            requests={requests}
            onApprove={handleApprove}
            onReject={handleReject}
            isAdmin={currentUser?.role === 'admin'}
            isLoading={loading}
          />
        ) : (
          <LeaveRequestForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={submitting}
          />
        )}
      </div>
    </div>
  );
};

export default LeaveRequestPage;
