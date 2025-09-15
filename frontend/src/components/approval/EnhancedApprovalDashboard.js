import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/material';
import {
  Assignment,
  ShoppingCart,
  ChangeHistory,
  CheckCircle,
  Cancel,
  Schedule,
  Warning,
  TrendingUp,
  Business,
  Person,
  AccountBalance,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

const EnhancedApprovalDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState('approve');
  const [approvalComments, setApprovalComments] = useState('');
  const [userRole, setUserRole] = useState('project_manager');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  useEffect(() => {
    fetchUserRole();
    fetchPendingApprovals();
    fetchApprovalHistory();
    fetchApprovalStats();
  }, []);

  const fetchUserRole = () => {
    // Get user role from localStorage or API
    const role = localStorage.getItem('userRole') || 'project_manager';
    setUserRole(role);
  };

  const fetchPendingApprovals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/approval/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingApprovals(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    }
  };

  const fetchApprovalHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/approval/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setApprovalHistory(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching approval history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovalStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/approval/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data || stats);
      }
    } catch (error) {
      console.error('Error fetching approval stats:', error);
    }
  };

  const handleApprovalAction = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/approval/${selectedApproval.id}/action`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: approvalAction,
          comments: approvalComments,
          approved_by: localStorage.getItem('username')
        })
      });
      
      if (response.ok) {
        setApprovalDialog(false);
        setApprovalComments('');
        setSelectedApproval(null);
        // Refresh data
        fetchPendingApprovals();
        fetchApprovalHistory();
        fetchApprovalStats();
      }
    } catch (error) {
      console.error('Error processing approval:', error);
    }
  };

  const getEntityIcon = (entityType) => {
    switch (entityType) {
      case 'rab':
        return <Assignment color="primary" />;
      case 'purchase_order':
        return <ShoppingCart color="secondary" />;
      case 'change_order':
        return <ChangeHistory color="warning" />;
      default:
        return <AssignmentIcon />;
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getSLAProgress = (createdAt, slaHours) => {
    const created = new Date(createdAt);
    const now = new Date();
    const elapsed = (now - created) / (1000 * 60 * 60); // hours
    const progress = Math.min((elapsed / slaHours) * 100, 100);
    return progress;
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'project_manager': 'Project Manager',
      'site_manager': 'Site Manager',
      'site_engineer': 'Site Engineer',
      'procurement_officer': 'Procurement Officer',
      'operations_director': 'Operations Director',
      'finance_director': 'Finance Director',
      'board_member': 'Board Member'
    };
    return roleNames[role] || role;
  };

  const StatsCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const PendingApprovalsTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Submitted</TableCell>
            <TableCell>SLA Progress</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingApprovals.map((approval) => {
            const slaProgress = getSLAProgress(
              approval.created_at, 
              approval.ApprovalWorkflow?.workflow_steps?.[approval.currentStep - 1]?.sla_hours || 24
            );
            
            return (
              <TableRow key={approval.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getEntityIcon(approval.entity_type)}
                    <Typography variant="body2">
                      {approval.entity_type.toUpperCase()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{approval.entity_id}</TableCell>
                <TableCell>
                  {approval.amount ? formatCurrency(approval.amount) : '-'}
                </TableCell>
                <TableCell>{formatDate(approval.created_at)}</TableCell>
                <TableCell>
                  <Box sx={{ width: 100 }}>
                    <LinearProgress
                      variant="determinate"
                      value={slaProgress}
                      color={slaProgress > 80 ? 'error' : slaProgress > 60 ? 'warning' : 'success'}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {Math.round(slaProgress)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={approval.priority}
                    size="small"
                    color={approval.priority === 'high' ? 'error' : approval.priority === 'medium' ? 'warning' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setSelectedApproval(approval);
                      setApprovalDialog(true);
                    }}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Enhanced Approval Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Role: {getRoleDisplayName(userRole)}
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending Approvals"
            value={stats.pending}
            icon={<Schedule fontSize="large" />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Approved"
            value={stats.approved}
            icon={<CheckCircle fontSize="large" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Rejected"
            value={stats.rejected}
            icon={<Cancel fontSize="large" />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Processed"
            value={stats.total}
            icon={<TrendingUp fontSize="large" />}
            color="primary"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab 
            label={
              <Badge badgeContent={pendingApprovals.length} color="error">
                Pending Approvals
              </Badge>
            } 
          />
          <Tab label="Approval History" />
          <Tab label="Workflow Analytics" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {currentTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pending Approvals
            </Typography>
            {pendingApprovals.length === 0 ? (
              <Alert severity="info">No pending approvals</Alert>
            ) : (
              <PendingApprovalsTable />
            )}
          </CardContent>
        </Card>
      )}

      {currentTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Approval History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Processed Date</TableCell>
                    <TableCell>Processed By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {approvalHistory.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getEntityIcon(approval.entity_type)}
                          <Typography variant="body2">
                            {approval.entity_type.toUpperCase()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{approval.entity_id}</TableCell>
                      <TableCell>
                        <Chip
                          label={approval.overallStatus}
                          color={getStatusColor(approval.overallStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(approval.updated_at)}</TableCell>
                      <TableCell>{approval.processed_by || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Approval Action Dialog */}
      <Dialog open={approvalDialog} onClose={() => setApprovalDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Process Approval</DialogTitle>
        <DialogContent>
          {selectedApproval && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Type:</Typography>
                  <Typography>{selectedApproval.entity_type.toUpperCase()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Project:</Typography>
                  <Typography>{selectedApproval.entity_id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Amount:</Typography>
                  <Typography>
                    {selectedApproval.amount ? formatCurrency(selectedApproval.amount) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Priority:</Typography>
                  <Chip label={selectedApproval.priority} size="small" />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Action</InputLabel>
                  <Select
                    value={approvalAction}
                    onChange={(e) => setApprovalAction(e.target.value)}
                  >
                    <MenuItem value="approve">Approve</MenuItem>
                    <MenuItem value="reject">Reject</MenuItem>
                    <MenuItem value="request_info">Request More Information</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Comments"
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  placeholder="Add your comments here..."
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleApprovalAction} 
            variant="contained"
            color={approvalAction === 'approve' ? 'success' : approvalAction === 'reject' ? 'error' : 'primary'}
          >
            {approvalAction === 'approve' ? 'Approve' : approvalAction === 'reject' ? 'Reject' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnhancedApprovalDashboard;