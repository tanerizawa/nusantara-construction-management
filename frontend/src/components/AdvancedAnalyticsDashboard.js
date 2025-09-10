import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  LinearProgress,
  Divider,
  Alert,
  Stack
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Schedule,
  CheckCircle,
  Pending,
  Cancel,
  AttachMoney,
  Assignment,
  Speed,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const AdvancedAnalyticsDashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchAnalyticsData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAnalyticsData, 5 * 60 * 1000);
    return () => clearInterval(interval);
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading analytics: {error}
        <Button onClick={fetchAnalyticsData} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  const { financial, efficiency, dashboard } = analyticsData || {};
  const overview = financial?.overview || {};
  const approvalRate = overview.total_approvals > 0 
    ? safeToFixed((overview.approved_count / overview.total_approvals) * 100, 1)
    : '0';

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          📊 Advanced Analytics Dashboard
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdated.toLocaleTimeString('id-ID')}
          </Typography>
          <IconButton onClick={fetchAnalyticsData} disabled={loading}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Real-time Dashboard Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Today's Activity */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Assignment color="primary" />
                <Box>
                  <Typography variant="h6">
                    {dashboard?.today_submissions || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today's Submissions
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircle color="success" />
                <Box>
                  <Typography variant="h6">
                    {dashboard?.today_completions || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today's Completions
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Pending color="warning" />
                <Box>
                  <Typography variant="h6">
                    {dashboard?.total_pending || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Approvals
                  </Typography>
                </Box>
              </Box>
              {dashboard?.overdue_pending > 0 && (
                <Chip 
                  label={`${dashboard.overdue_pending} Overdue`}
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AttachMoney color="success" />
                <Box>
                  <Typography variant="h6">
                    {formatCurrency(dashboard?.today_approved_amount || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today's Approved Amount
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Financial Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💰 Financial Overview
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="h4" color="primary">
                      {formatNumber(overview.total_approvals || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total RAB Submissions
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="h4" color="success.main">
                      {formatCurrency(overview.approved_amount || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Approved Amount
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="h4">
                      {approvalRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Approval Rate
                    </Typography>
                    <Chip 
                      label={approvalRate >= 80 ? 'Excellent' : approvalRate >= 60 ? 'Good' : 'Needs Improvement'}
                      color={getApprovalRateColor(approvalRate)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="h4">
                      {safeToFixed(overview.avg_approval_time_hours, 1)}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Approval Time
                    </Typography>
                    <Chip 
                      label={overview.avg_approval_time_hours <= 2 ? 'Fast' : overview.avg_approval_time_hours <= 8 ? 'Normal' : 'Slow'}
                      color={getEfficiencyColor(overview.avg_approval_time_hours)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Status Breakdown
              </Typography>
              
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">Approved</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="bold">
                    {overview.approved_count || 0}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Pending color="warning" fontSize="small" />
                    <Typography variant="body2">Pending</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="bold">
                    {overview.pending_count || 0}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Cancel color="error" fontSize="small" />
                    <Typography variant="body2">Rejected</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="bold">
                    {overview.rejected_count || 0}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Performance */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏗️ Category Performance
              </Typography>
              
              {financial?.categoryBreakdown?.map((category, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body1" fontWeight="medium">
                      {category.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.count} items
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="success.main" gutterBottom>
                    {formatCurrency(category.approved_amount || 0)}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={category.approved_amount ? Math.min((category.approved_amount / 1000000000) * 10, 100) : 0}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⚡ Step Performance Analysis
              </Typography>
              
              {efficiency?.stepPerformance?.map((step, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body1" fontWeight="medium">
                      {step.step_name}
                    </Typography>
                    <Chip 
                      label={step.required_role}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {step.approved_steps}/{step.total_steps} approved
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {step.avg_processing_hours ? `${safeToFixed(step.avg_processing_hours, 1)}h avg` : 'N/A'}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={step.total_steps > 0 ? (step.approved_steps / step.total_steps) * 100 : 0}
                    color={step.approved_steps === step.total_steps ? 'success' : 'primary'}
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Efficiency Metrics */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Approval Efficiency by Amount Range
          </Typography>
          
          <Grid container spacing={3}>
            {efficiency?.approvalRatesByAmount?.map((range, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" color="primary">
                    {range.approval_rate_percent}%
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    {range.amount_range}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {range.approved_count}/{range.total_count} approved
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={range.approval_rate_percent}
                    color={getApprovalRateColor(range.approval_rate_percent)}
                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdvancedAnalyticsDashboard;
