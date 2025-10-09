import React, { useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';

// Hooks
import { useApprovalData, useApprovalActions, useApprovalSync } from './hooks';

// Config
import { approvalCategories } from './config';

// Components
import { ApprovalStatusBadge, ApprovalActions } from './components';

// External components
import TandaTerimaManager from '../tanda-terima/TandaTerimaManager';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Professional Approval Dashboard - Modularized
 * Main container for approval workflow
 */
const ProfessionalApprovalDashboard = ({ projectId, project, userDetails, onDataChange }) => {
  const [activeCategory, setActiveCategory] = useState('rab');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Custom hooks
  const { 
    approvalData, 
    setApprovalData,
    loading, 
    error, 
    loadApprovalData 
  } = useApprovalData(projectId);
  
  const { 
    handleMarkAsReviewed, 
    handleApprove, 
    handleReject 
  } = useApprovalActions(projectId, setApprovalData, activeCategory, onDataChange);
  
  useApprovalSync(projectId, loadApprovalData);

  // Get current category data
  const currentCategoryData = approvalData[activeCategory] || [];
  
  // Apply filters
  const filteredData = currentCategoryData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.approval_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: currentCategoryData.length,
    pending: currentCategoryData.filter(i => i.status === 'pending' || i.status === 'under_review').length,
    approved: currentCategoryData.filter(i => i.status === 'approved').length,
    rejected: currentCategoryData.filter(i => i.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data approval...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  // Special handling for Tanda Terima
  if (activeCategory === 'tandaTerima') {
    return <TandaTerimaManager projectId={projectId} project={project} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Approval Dashboard</h2>
          <p className="text-gray-600">Kelola persetujuan dokumen proyek</p>
        </div>
        <button
          onClick={loadApprovalData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {approvalCategories.map(category => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          const count = approvalData[category.id]?.length || 0;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-4 py-3 border-b-2 transition-colors ${
                isActive 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              <span className="font-medium">{category.name}</span>
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${category.color}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">Approved</p>
          <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">Rejected</p>
          <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari dokumen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="under_review">Under Review</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Approval Items List */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <p className="text-gray-600">Tidak ada data approval</p>
          </div>
        ) : (
          filteredData.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.approval_id}</h3>
                    <ApprovalStatusBadge status={item.status} />
                  </div>
                  
                  <p className="text-gray-700 mb-2">{item.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    {item.quantity && (
                      <div>
                        <span className="font-medium">Quantity:</span> {item.quantity} {item.unit}
                      </div>
                    )}
                    {item.total_price && (
                      <div>
                        <span className="font-medium">Total:</span> {formatCurrency(item.total_price)}
                      </div>
                    )}
                    {item.total_amount && (
                      <div>
                        <span className="font-medium">Amount:</span> {formatCurrency(item.total_amount)}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Created:</span> {formatDate(item.created_at)}
                    </div>
                  </div>
                  
                  {item.approved_by && (
                    <p className="text-sm text-green-600">
                      Approved by {item.approved_by} on {formatDate(item.approved_at)}
                    </p>
                  )}
                </div>
                
                <ApprovalActions
                  item={item}
                  userDetails={userDetails}
                  onReview={() => handleMarkAsReviewed(item, loadApprovalData)}
                  onApprove={() => handleApprove(item, userDetails, loadApprovalData)}
                  onReject={() => handleReject(item, userDetails, loadApprovalData)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfessionalApprovalDashboard;
