import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  DollarSign,
  FileText,
  Zap,
  RefreshCw,
  BarChart3,
  Activity,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdvancedAnalyticsDashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchAnalyticsData();
    
    // Auto-refresh removed to save resources
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return 'Rp 0';
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return 'Rp 0';
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) {
      return '0';
    }
    const numValue = parseFloat(num);
    if (isNaN(numValue)) {
      return '0';
    }
    return new Intl.NumberFormat('id-ID').format(numValue);
  };

  const safeToFixed = (value, decimals = 1) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return '0';
    }
    return numValue.toFixed(decimals);
  };

  const getApprovalRateColor = (rate) => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'error';
  };

  const getEfficiencyColor = (hours) => {
    if (hours <= 2) return 'success';
    if (hours <= 8) return 'warning';
    return 'error';
  };

  if (loading && !analyticsData) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#1C1C1E' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: '#0A84FF' }}></div>
          <p style={{ color: '#98989D' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6" style={{ backgroundColor: '#1C1C1E', minHeight: '100vh' }}>
        <div className="rounded-lg p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6" style={{ color: '#FF453A' }} />
            <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>Error Loading Analytics</h3>
          </div>
          <p className="mb-4" style={{ color: '#98989D' }}>{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#FFFFFF'
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { financial, efficiency, dashboard } = analyticsData || {};
  const overview = financial?.overview || {};
  const approvalRate = overview.total_approvals > 0 
    ? safeToFixed((overview.approved_count / overview.total_approvals) * 100, 1)
    : '0';

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#1C1C1E' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2" style={{ color: '#FFFFFF' }}>
            <BarChart3 className="h-8 w-8" style={{ color: '#0A84FF' }} />
            Advanced Analytics Dashboard
          </h1>
          <p style={{ color: '#98989D' }}>
            Last updated: {lastUpdated.toLocaleTimeString('id-ID')}
          </p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          disabled={loading}
          className="p-3 rounded-lg transition-colors"
          style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A',
            color: loading ? '#636366' : '#0A84FF',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading Bar */}
      {loading && (
        <div className="h-1 mb-6 rounded-full overflow-hidden" style={{ backgroundColor: '#38383A' }}>
          <div className="h-full animate-pulse" style={{ backgroundColor: '#0A84FF', width: '60%' }}></div>
        </div>
      )}

      {/* Real-time Dashboard Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Activity */}
        <div className="rounded-xl p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(10, 132, 255, 0.1)' }}>
              <FileText className="h-6 w-6" style={{ color: '#0A84FF' }} />
            </div>
            <div>
              <h3 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                {dashboard?.today_submissions || 0}
              </h3>
              <p className="text-sm" style={{ color: '#98989D' }}>Today's Submissions</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(48, 209, 88, 0.1)' }}>
              <CheckCircle className="h-6 w-6" style={{ color: '#30D158' }} />
            </div>
            <div>
              <h3 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                {dashboard?.today_completions || 0}
              </h3>
              <p className="text-sm" style={{ color: '#98989D' }}>Today's Completions</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 159, 10, 0.1)' }}>
              <Clock className="h-6 w-6" style={{ color: '#FF9F0A' }} />
            </div>
            <div>
              <h3 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                {dashboard?.total_pending || 0}
              </h3>
              <p className="text-sm" style={{ color: '#98989D' }}>Pending Approvals</p>
            </div>
          </div>
          {dashboard?.overdue_pending > 0 && (
            <div className="mt-3 px-3 py-1 rounded-full inline-block text-xs font-medium" style={{ backgroundColor: 'rgba(255, 69, 58, 0.1)', color: '#FF453A' }}>
              {dashboard.overdue_pending} Overdue
            </div>
          )}
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(48, 209, 88, 0.1)' }}>
              <DollarSign className="h-6 w-6" style={{ color: '#30D158' }} />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                {formatCurrency(dashboard?.today_approved_amount || 0)}
              </h3>
              <p className="text-sm" style={{ color: '#98989D' }}>Today's Approved Amount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Financial Overview */}
        <div className="lg:col-span-2 rounded-xl p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
            <DollarSign className="h-5 w-5" style={{ color: '#30D158' }} />
            Financial Overview
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-3xl font-bold" style={{ color: '#0A84FF' }}>
                {formatNumber(overview.total_approvals || 0)}
              </h3>
              <p className="text-sm" style={{ color: '#98989D' }}>Total RAB Submissions</p>
            </div>
            
            <div>
              <h3 className="text-3xl font-bold" style={{ color: '#30D158' }}>
                {formatCurrency(overview.approved_amount || 0)}
              </h3>
              <p className="text-sm" style={{ color: '#98989D' }}>Total Approved Amount</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>
                {approvalRate}%
              </h3>
              <p className="text-sm mb-2" style={{ color: '#98989D' }}>Approval Rate</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium`} style={{
                backgroundColor: approvalRate >= 80 ? 'rgba(48, 209, 88, 0.1)' : approvalRate >= 60 ? 'rgba(255, 159, 10, 0.1)' : 'rgba(255, 69, 58, 0.1)',
                color: approvalRate >= 80 ? '#30D158' : approvalRate >= 60 ? '#FF9F0A' : '#FF453A'
              }}>
                {approvalRate >= 80 ? 'Excellent' : approvalRate >= 60 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>

            <div>
              <h3 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>
                {safeToFixed(overview.avg_approval_time_hours, 1)}h
              </h3>
              <p className="text-sm mb-2" style={{ color: '#98989D' }}>Average Approval Time</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium`} style={{
                backgroundColor: overview.avg_approval_time_hours <= 2 ? 'rgba(48, 209, 88, 0.1)' : overview.avg_approval_time_hours <= 8 ? 'rgba(255, 159, 10, 0.1)' : 'rgba(255, 69, 58, 0.1)',
                color: overview.avg_approval_time_hours <= 2 ? '#30D158' : overview.avg_approval_time_hours <= 8 ? '#FF9F0A' : '#FF453A'
              }}>
                {overview.avg_approval_time_hours <= 2 ? 'Fast' : overview.avg_approval_time_hours <= 8 ? 'Normal' : 'Slow'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="rounded-xl p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
            <Activity className="h-5 w-5" style={{ color: '#0A84FF' }} />
            Status Breakdown
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" style={{ color: '#30D158' }} />
                <span style={{ color: '#98989D' }}>Approved</span>
              </div>
              <span className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
                {overview.approved_count || 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" style={{ color: '#FF9F0A' }} />
                <span style={{ color: '#98989D' }}>Pending</span>
              </div>
              <span className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
                {overview.pending_count || 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5" style={{ color: '#FF453A' }} />
                <span style={{ color: '#98989D' }}>Rejected</span>
              </div>
              <span className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
                {overview.rejected_count || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance & Step Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
            <Target className="h-5 w-5" style={{ color: '#0A84FF' }} />
            Category Performance
          </h2>
          
          {financial?.categoryBreakdown?.map((category, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium" style={{ color: '#FFFFFF' }}>
                  {category.category}
                </span>
                <span className="text-sm" style={{ color: '#98989D' }}>
                  {category.count} items
                </span>
              </div>
              <p className="text-sm mb-2" style={{ color: '#30D158' }}>
                {formatCurrency(category.approved_amount || 0)}
              </p>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#38383A' }}>
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    backgroundColor: '#0A84FF',
                    width: `${category.approved_amount ? Math.min((category.approved_amount / 1000000000) * 10, 100) : 0}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
            <Zap className="h-5 w-5" style={{ color: '#FF9F0A' }} />
            Step Performance Analysis
          </h2>
          
          {efficiency?.stepPerformance?.map((step, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium" style={{ color: '#FFFFFF' }}>
                  {step.step_name}
                </span>
                <span className="px-2 py-1 rounded text-xs font-medium" style={{ 
                  backgroundColor: 'rgba(10, 132, 255, 0.1)',
                  color: '#0A84FF',
                  border: '1px solid rgba(10, 132, 255, 0.2)'
                }}>
                  {step.required_role}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm" style={{ color: '#98989D' }}>
                  {step.approved_steps}/{step.total_steps} approved
                </span>
                <span className="text-sm" style={{ color: '#0A84FF' }}>
                  {step.avg_processing_hours ? `${safeToFixed(step.avg_processing_hours, 1)}h avg` : 'N/A'}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#38383A' }}>
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    backgroundColor: step.approved_steps === step.total_steps ? '#30D158' : '#0A84FF',
                    width: `${step.total_steps > 0 ? (step.approved_steps / step.total_steps) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Efficiency Metrics */}
      <div className="rounded-xl p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
          <BarChart3 className="h-5 w-5" style={{ color: '#0A84FF' }} />
          Approval Efficiency by Amount Range
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {efficiency?.approvalRatesByAmount?.map((range, index) => (
            <div key={index} className="text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(10, 132, 255, 0.05)', border: '1px solid #38383A' }}>
              <h3 className="text-3xl font-bold" style={{ color: '#0A84FF' }}>
                {range.approval_rate_percent}%
              </h3>
              <p className="font-medium my-2" style={{ color: '#FFFFFF' }}>
                {range.amount_range}
              </p>
              <p className="text-sm mb-3" style={{ color: '#98989D' }}>
                {range.approved_count}/{range.total_count} approved
              </p>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#38383A' }}>
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    backgroundColor: range.approval_rate_percent >= 80 ? '#30D158' : range.approval_rate_percent >= 60 ? '#FF9F0A' : '#FF453A',
                    width: `${range.approval_rate_percent}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
