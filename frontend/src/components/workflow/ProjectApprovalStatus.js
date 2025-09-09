import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Calendar,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  AlertCircle
} from 'lucide-react';

const ProjectApprovalStatus = ({ projectId, project, onDataChange }) => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApprovalData();
  }, [projectId]);

  const fetchApprovalData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/approval/project/${projectId}/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApprovals(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching approval data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (instanceId, action, comments = '') => {
    try {
      const response = await fetch(`/api/approval/instance/${instanceId}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          decision: action,
          comments
        })
      });

      if (response.ok) {
        await fetchApprovalData();
        if (onDataChange) onDataChange();
        alert(`Approval ${action} berhasil`);
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      alert('Gagal memproses approval');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'conditional': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return Clock;
      case 'conditional': return AlertTriangle;
      default: return AlertCircle;
    }
  };

  const filteredApprovals = approvals.filter(approval => {
    if (filter === 'all') return true;
    return approval.status === filter;
  });

  const approvalSummary = {
    total: approvals.length,
    pending: approvals.filter(a => a.status === 'pending').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    rejected: approvals.filter(a => a.status === 'rejected').length,
    conditional: approvals.filter(a => a.status === 'conditional').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Status Persetujuan</h2>
          <p className="text-gray-600">Tracking workflow approval untuk {project.name}</p>
        </div>
        
        <button
          onClick={fetchApprovalData}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ClipboardCheck className="h-8 w-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{approvalSummary.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-yellow-600">{approvalSummary.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-green-600">{approvalSummary.approved}</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-red-600">{approvalSummary.rejected}</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-blue-600">{approvalSummary.conditional}</p>
              <p className="text-sm text-gray-600">Conditional</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'all', label: 'Semua', count: approvalSummary.total },
              { key: 'pending', label: 'Pending', count: approvalSummary.pending },
              { key: 'approved', label: 'Approved', count: approvalSummary.approved },
              { key: 'rejected', label: 'Rejected', count: approvalSummary.rejected }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Approval List */}
        <div className="divide-y divide-gray-200">
          {filteredApprovals.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'Belum ada approval' : `Tidak ada approval ${filter}`}
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Approval akan muncul ketika ada dokumen yang disubmit'
                  : `Tidak ada dokumen dengan status ${filter}`
                }
              </p>
            </div>
          ) : (
            filteredApprovals.map((approval) => (
              <ApprovalCard
                key={approval.id}
                approval={approval}
                onAction={handleApprovalAction}
                onView={() => setSelectedApproval(approval)}
              />
            ))
          )}
        </div>
      </div>

      {/* Approval Detail Modal */}
      {selectedApproval && (
        <ApprovalDetailModal
          approval={selectedApproval}
          onClose={() => setSelectedApproval(null)}
          onAction={handleApprovalAction}
        />
      )}
    </div>
  );
};

// Approval Card Component
const ApprovalCard = ({ approval, onAction, onView }) => {
  const StatusIcon = getStatusIcon(approval.status);
  
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-2">
            <StatusIcon className={`h-5 w-5 ${getStatusColor(approval.status).split(' ')[0]}`} />
            <h3 className="text-lg font-medium text-gray-900">{approval.entityType.toUpperCase()}</h3>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(approval.status)}`}>
              {approval.status}
            </span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Document ID</p>
              <p className="font-medium">{approval.entityId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Submitted By</p>
              <p className="font-medium">{approval.submittedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Submitted Date</p>
              <p className="font-medium">{new Date(approval.submittedAt).toLocaleDateString('id-ID')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Step</p>
              <p className="font-medium">{approval.currentStep} of {approval.totalSteps}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(approval.currentStep / approval.totalSteps) * 100}%` }}
            ></div>
          </div>

          {/* Latest Comment */}
          {approval.latestComment && (
            <div className="bg-gray-50 rounded p-3 mb-4">
              <p className="text-sm text-gray-600">{approval.latestComment}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onView(approval)}
            className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Eye className="h-4 w-4 mr-1" />
            Detail
          </button>
          
          {approval.canApprove && approval.status === 'pending' && (
            <>
              <button
                onClick={() => onAction(approval.id, 'approved')}
                className="flex items-center px-3 py-1 text-green-600 hover:bg-green-50 rounded transition-colors"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Approve
              </button>
              
              <button
                onClick={() => onAction(approval.id, 'rejected')}
                className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Approval Detail Modal Component
const ApprovalDetailModal = ({ approval, onClose, onAction }) => {
  const [comments, setComments] = useState('');
  const [actionType, setActionType] = useState('');

  const handleSubmitAction = () => {
    if (actionType) {
      onAction(approval.id, actionType, comments);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Approval Detail</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Document Type</label>
              <p className="font-medium">{approval.entityType.toUpperCase()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Document ID</label>
              <p className="font-medium">{approval.entityId}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(approval.status)}`}>
                {approval.status}
              </span>
            </div>
            <div>
              <label className="text-sm text-gray-500">Progress</label>
              <p className="font-medium">{approval.currentStep} of {approval.totalSteps} steps</p>
            </div>
          </div>

          {/* Approval Steps */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Approval Steps</h3>
            <div className="space-y-4">
              {approval.steps?.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-4 h-4 rounded-full mt-1 ${
                    step.status === 'approved' ? 'bg-green-500' :
                    step.status === 'rejected' ? 'bg-red-500' :
                    step.status === 'pending' && step.isCurrent ? 'bg-blue-500' :
                    'bg-gray-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{step.stepName}</p>
                      <p className="text-sm text-gray-500">{step.approverRole}</p>
                    </div>
                    {step.approver && (
                      <p className="text-sm text-gray-600">by {step.approver}</p>
                    )}
                    {step.approvedAt && (
                      <p className="text-sm text-gray-500">{new Date(step.approvedAt).toLocaleString('id-ID')}</p>
                    )}
                    {step.comments && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        {step.comments}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Section */}
          {approval.canApprove && approval.status === 'pending' && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Take Action</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decision
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="approved"
                        onChange={(e) => setActionType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-green-600">Approve</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="conditional"
                        onChange={(e) => setActionType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-blue-600">Conditional Approve</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="rejected"
                        onChange={(e) => setActionType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-red-600">Reject</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add your comments..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          
          {approval.canApprove && approval.status === 'pending' && actionType && (
            <button
              onClick={handleSubmitAction}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Decision
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions (same as in previous component)
const getStatusColor = (status) => {
  switch (status) {
    case 'approved': return 'text-green-600 bg-green-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'conditional': return 'text-blue-600 bg-blue-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'approved': return CheckCircle;
    case 'rejected': return XCircle;
    case 'pending': return Clock;
    case 'conditional': return AlertTriangle;
    default: return AlertCircle;
  }
};

export default ProjectApprovalStatus;
