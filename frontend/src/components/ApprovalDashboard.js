import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Badge,
  Tabs,
  Tab,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Schedule,
  Assignment,
  Notifications,
  History,
  ThumbUp,
  ThumbDown,
  Visibility,
  PendingActions
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ApprovalDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    pendingCount: 0,
    recentApprovals: [],
    stats: { approved: 0, rejected: 0 }
  });
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchPendingApprovals();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/approval/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const response = await api.get('/approval/pending');
      if (response.data.success) {
        setPendingApprovals(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      setError('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = (approval) => {
    setSelectedApproval(approval);
    setApprovalDialog(true);
    setDecision('');
    setComments('');
    setError('');
  };

  const submitApprovalDecision = async () => {
    if (!decision) {
      setError('Please select approve or reject');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/approval/instance/${selectedApproval.instanceId}/decision`, {
        decision,
        comments
      });

      if (response.data.success) {
        setSuccess(`Approval ${decision} successfully`);
        setApprovalDialog(false);
        fetchDashboardData();
        fetchPendingApprovals();
      }
    } catch (error) {
      console.error('Error submitting approval decision:', error);
      setError(error.response?.data?.error || 'Failed to submit approval decision');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle color="success" />;
      case 'rejected':
        return <Cancel color="error" />;
      case 'pending':
        return <Schedule color="warning" />;
      default:
        return <PendingActions />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  if (loading && pendingApprovals.length === 0) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading approval dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Approval Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Approvals
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.pendingCount}
                  </Typography>
                </Box>
                <Badge badgeContent={dashboardData.pendingCount} color="error">
                  <PendingActions color="action" sx={{ fontSize: 40 }} />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Approved
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {dashboardData.stats.approved}
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Rejected
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {dashboardData.stats.rejected}
                  </Typography>
                </Box>
                <Cancel color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Processed
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.stats.approved + dashboardData.stats.rejected}
                  </Typography>
                </Box>
                <Assignment color="action" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different sections */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Pending Approvals" />
            <Tab label="Recent Activity" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {pendingApprovals.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No pending approvals
              </Typography>
              <Typography variant="body2" color="textSecondary">
                You're all caught up!
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Requested By</TableCell>
                    <TableCell>Step</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingApprovals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {approval.entityData?.description || 'RAB Document'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {approval.entityId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={approval.entityType.toUpperCase()}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {approval.entityData?.totalPrice ? 
                            formatCurrency(approval.entityData.totalPrice) : 
                            'N/A'
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {approval.requestedBy || 'Unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          Step {approval.currentStep}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {approval.stepName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(approval.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Review & Approve">
                            <IconButton
                              color="primary"
                              onClick={() => handleApprovalAction(approval)}
                              size="small"
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {dashboardData.recentApprovals.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <History color="action" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No recent activity
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document</TableCell>
                    <TableCell>Decision</TableCell>
                    <TableCell>Comments</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentApprovals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {approval.ApprovalInstance?.ApprovalWorkflow?.name || 'Document'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {approval.ApprovalInstance?.ApprovalWorkflow?.entityType?.toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(approval.status)}
                          <Chip
                            label={approval.status}
                            size="small"
                            color={getStatusColor(approval.status)}
                            variant="outlined"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {approval.comments || 'No comments'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(approval.updatedAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Card>

      {/* Approval Decision Dialog */}
      <Dialog open={approvalDialog} onClose={() => setApprovalDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Approval Decision - {selectedApproval?.entityType?.toUpperCase()}
        </DialogTitle>
        <DialogContent>
          {selectedApproval && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Document Details
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Document ID
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedApproval.entityId}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Current Step
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    Step {selectedApproval.currentStep} - {selectedApproval.stepName}
                  </Typography>
                </Grid>

                {selectedApproval.entityData?.totalPrice && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Amount
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(selectedApproval.entityData.totalPrice)}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Requested By
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedApproval.requestedBy || 'Unknown'}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Your Decision
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant={decision === 'approved' ? 'contained' : 'outlined'}
                  color="success"
                  startIcon={<ThumbUp />}
                  onClick={() => setDecision('approved')}
                >
                  Approve
                </Button>
                <Button
                  variant={decision === 'rejected' ? 'contained' : 'outlined'}
                  color="error"
                  startIcon={<ThumbDown />}
                  onClick={() => setDecision('rejected')}
                >
                  Reject
                </Button>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Comments (Optional)"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your comments or reasons for this decision..."
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={submitApprovalDecision}
            variant="contained"
            disabled={!decision || loading}
            color={decision === 'approved' ? 'success' : 'error'}
          >
            {loading ? 'Submitting...' : `${decision === 'approved' ? 'Approve' : 'Reject'}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApprovalDashboard;
