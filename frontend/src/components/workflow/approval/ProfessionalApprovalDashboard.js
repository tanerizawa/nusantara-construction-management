import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

// Hooks
import { useApprovalData, useApprovalActions } from './hooks';

// Config
import { approvalCategories } from './config';

// Components
import { ApprovalStatusBadge, ApprovalActions, ProgressPaymentContent } from './components';
import TandaTerimaContent from './components/TandaTerimaContent';
import BeritaAcaraContent from './components/BeritaAcaraContent';

// Utils
import { formatCurrency, formatDate } from '../../../utils/formatters';

/**
 * Professional Approval Dashboard - Modularized
 * Main container for approval workflow
 */
const ProfessionalApprovalDashboard = ({ projectId, project, userDetails, onDataChange }) => {
  // Get initial tab from URL hash (nested format: #approval-status:tandaTerima)
  const getInitialCategory = () => {
    // Priority 1: URL hash with nested format (#approval-status:tandaTerima)
    const hash = window.location.hash.replace('#', '');
    if (hash.includes(':')) {
      const [mainTab, subTab] = hash.split(':');
      // Only use subTab if mainTab is 'approval-status'
      if (mainTab === 'approval-status' && subTab && approvalCategories.some(cat => cat.id === subTab)) {
        return subTab;
      }
    }
    
    // Priority 2: localStorage
    const saved = localStorage.getItem('approvalDashboard_activeCategory');
    if (saved && approvalCategories.some(cat => cat.id === saved)) {
      return saved;
    }
    
    // Priority 3: default
    return 'rab';
  };

  const [activeCategory, setActiveCategory] = useState(getInitialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sync active category with URL hash (nested format) and localStorage
  useEffect(() => {
    // Get current main tab from hash
    const hash = window.location.hash.replace('#', '');
    const mainTab = hash.includes(':') ? hash.split(':')[0] : hash;
    
    // Update URL hash with nested format (mainTab:subTab)
    if (mainTab === 'approval-status' || mainTab === '') {
      window.location.hash = `approval-status:${activeCategory}`;
    }
    
    // Update localStorage as backup
    localStorage.setItem('approvalDashboard_activeCategory', activeCategory);
  }, [activeCategory]);

  // Listen for browser back/forward navigation (hash changes)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.includes(':')) {
        const [mainTab, subTab] = hash.split(':');
        // Only update if mainTab is 'approval-status' and subTab is valid
        if (mainTab === 'approval-status' && subTab && approvalCategories.some(cat => cat.id === subTab) && subTab !== activeCategory) {
          setActiveCategory(subTab);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeCategory]);

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
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF] mx-auto"></div>
          <p className="mt-4 text-[#8E8E93]">Memuat data approval...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-lg p-4">
        <p className="text-[#FF3B30]">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-white">Approval Dashboard</h2>
        <p className="text-sm text-[#8E8E93]">Kelola persetujuan dokumen proyek</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-[#38383A] overflow-x-auto">
        {approvalCategories.map(category => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          const count = approvalData[category.id]?.length || 0;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
                isActive 
                  ? 'border-[#0A84FF] text-[#0A84FF]' 
                  : 'border-transparent text-[#8E8E93] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span className="font-medium text-sm">{category.name}</span>
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${category.color}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
          <p className="text-xs text-[#8E8E93]">Total</p>
          <p className="text-xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#FF9F0A]/10 border border-[#FF9F0A]/30 rounded-lg p-3">
          <p className="text-xs text-[#8E8E93]">Pending</p>
          <p className="text-xl font-semibold text-[#FF9F0A]">{stats.pending}</p>
        </div>
        <div className="bg-[#30D158]/10 border border-[#30D158]/30 rounded-lg p-3">
          <p className="text-xs text-[#8E8E93]">Approved</p>
          <p className="text-xl font-semibold text-[#30D158]">{stats.approved}</p>
        </div>
        <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-lg p-3">
          <p className="text-xs text-[#8E8E93]">Rejected</p>
          <p className="text-xl font-semibold text-[#FF3B30]">{stats.rejected}</p>
        </div>
      </div>

      {/* Content Area - Different for specialized categories */}
      {activeCategory === 'tandaTerima' ? (
        <TandaTerimaContent projectId={projectId} project={project} onDataChange={onDataChange} />
      ) : activeCategory === 'beritaAcara' ? (
        <BeritaAcaraContent projectId={projectId} project={project} onDataChange={onDataChange} />
      ) : activeCategory === 'progressPayments' ? (
        <ProgressPaymentContent
          data={filteredData}
          onMarkAsReviewed={(item) => handleMarkAsReviewed(item, loadApprovalData)}
          onApprove={(item) => handleApprove(item, userDetails, loadApprovalData)}
          onReject={(item) => handleReject(item, userDetails, loadApprovalData)}
        />
      ) : (
        <>
          {/* Filters - Only for RAB and PO */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#636366]" />
              <input
                type="text"
                placeholder="Cari dokumen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  backgroundColor: '#1C1C1E !important', 
                  color: 'white !important',
                  border: '1px solid #38383A',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  paddingLeft: '2.5rem'
                }}
                className="w-full placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ 
                backgroundColor: '#1C1C1E !important', 
                color: 'white !important',
                border: '1px solid #38383A',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem'
              }}
              className="focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
            >
              <option value="all" style={{ backgroundColor: '#1C1C1E', color: 'white' }}>Semua Status</option>
              <option value="draft" style={{ backgroundColor: '#1C1C1E', color: 'white' }}>Draft</option>
              <option value="under_review" style={{ backgroundColor: '#1C1C1E', color: 'white' }}>Under Review</option>
              <option value="pending" style={{ backgroundColor: '#1C1C1E', color: 'white' }}>Pending</option>
              <option value="approved" style={{ backgroundColor: '#1C1C1E', color: 'white' }}>Approved</option>
              <option value="rejected" style={{ backgroundColor: '#1C1C1E', color: 'white' }}>Rejected</option>
            </select>
          </div>

          {/* Approval Items List - Only for RAB and PO */}
          <div className="space-y-4">
            {filteredData.length === 0 ? (
              <div className="text-center py-12 bg-[#2C2C2E] border border-[#38383A] rounded-lg">
                <p className="text-[#8E8E93]">Tidak ada data approval</p>
              </div>
        ) : (
          filteredData.map((item) => (
            <div key={item.id} className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4 hover:border-[#0A84FF]/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-white">{item.approval_id}</h3>
                    <ApprovalStatusBadge status={item.status} />
                  </div>
                  
                  <p className="text-[#98989D] mb-2">{item.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#8E8E93] mb-4">
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
                    <p className="text-sm text-[#30D158]">
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
        </>
      )}
    </div>
  );
};

export default ProfessionalApprovalDashboard;
