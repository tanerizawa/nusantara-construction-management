import React, { useState, useEffect, useCallback } from 'react';
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
  Tooltip,
  Avatar,
  Divider,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel
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
  PendingActions,
  ExpandMore,
  AccountCircle,
  AttachMoney,
  Category,
  Description,
  DateRange,
  Person,
  Business,
  Build,
  Warning,
  InfoOutlined,
  ReceiptLong,
  Timeline,
  Refresh,
  FilterList,
  Search,
  AccessTime,
  TrendingUp,
  AccountBalance
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ApprovalDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    pendingCount: 0,
    recentApprovals: [],
    stats: { approved: 0, rejected: 0, total: 0 }
  });
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');
  const [conditions, setConditions] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // Setup auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchPendingApprovals(),
        fetchMySubmissions()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/approval/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status !== 404) {
        setError('Failed to load dashboard data');
      }
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const response = await api.get('/approval/pending');
      if (response.data.success) {
        setPendingApprovals(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      setPendingApprovals([]);
    }
  };

  const fetchMySubmissions = async () => {
    try {
      const response = await api.get('/approval/my-submissions');
      if (response.data.success) {
        setMySubmissions(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching my submissions:', error);
      setMySubmissions([]);
    }
  };

  const handleApprovalAction = (approval) => {
    setSelectedApproval(approval);
    setApprovalDialog(true);
    setDecision('');
    setComments('');
    setConditions('');
    setError('');
    setSuccess('');
  };

  const handleViewApproval = (approval) => {
    setSelectedApproval(approval);
    setViewDialog(true);
  };

  const submitApprovalDecision = async () => {
    if (!decision) {
      setError('Please select approve or reject');
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        decision,
        comments: comments.trim()
      };

      if (decision === 'approve_with_conditions' && conditions.trim()) {
        payload.conditions = conditions.trim();
      }

      const response = await api.post(`/approval/instance/${selectedApproval.instanceId}/decision`, payload);

      if (response.data.success) {
        setSuccess(`Approval ${decision.replace('_', ' ')} successfully`);
        setApprovalDialog(false);
        
        // Refresh data
        await fetchData();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error submitting approval decision:', error);
      setError(error.response?.data?.error || 'Failed to submit approval decision');
    } finally {
      setActionLoading(false);
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
      case 'approve_with_conditions':
        return 'info';
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
      case 'approve_with_conditions':
        return <Warning color="info" />;
      default:
        return <PendingActions />;
    }
  };

  const getEntityTypeIcon = (entityType) => {
    switch (entityType) {
      case 'rab':
        return <ReceiptLong />;
      case 'purchase_order':
        return <Business />;
      case 'project':
        return <Build />;
      default:
        return <Description />;
    }
  };

  const getEntityTypeLabel = (entityType) => {
    switch (entityType) {
      case 'rab':
        return 'RAB';
      case 'purchase_order':
        return 'Purchase Order';
      case 'project':
        return 'Project';
      default:
        return entityType;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateDaysOverdue = (dueDate) => {
    if (!dueDate) return 0;
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = now - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  const StatsCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const ApprovalCard = ({ approval, showActions = true }) => {
    const daysOverdue = calculateDaysOverdue(approval.dueDate);
    const isOverdue = daysOverdue > 0;
    
    return (
      <Card sx={{ mb: 2, border: isOverdue ? '2px solid #f44336' : '1px solid #e0e0e0' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center">
              {getEntityTypeIcon(approval.entityType)}
              <Box ml={1}>
                <Typography variant="h6" fontWeight="bold">
                  {getEntityTypeLabel(approval.entityType)} #{approval.entityId}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {approval.stepName || approval.requiredRole}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              {isOverdue && (
                <Chip 
                  label={`${daysOverdue} hari terlambat`}
                  color="error" 
                  size="small"
                  icon={<AccessTime />}
                />
              )}
              <Chip 
                label={approval.status} 
                color={getStatusColor(approval.status)}
                icon={getStatusIcon(approval.status)}
                size="small"
              />
            </Box>
          </Box>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Total Amount:</Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatCurrency(approval.totalAmount)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">Submitted:</Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDateShort(approval.submittedAt)}
              </Typography>
            </Grid>
          </Grid>

          {approval.entityData && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body2" fontWeight="medium">
                  Detail Information
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {Object.entries(approval.entityData).map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <Typography variant="body2" color="textSecondary">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          {showActions && (
            <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Visibility />}
                onClick={() => handleViewApproval(approval)}
              >
                View Details
              </Button>
              {approval.status === 'pending' && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Assignment />}
                  onClick={() => handleApprovalAction(approval)}
                >
                  Review
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Dashboard Persetujuan
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Kelola persetujuan dan pantau status approval secara real-time
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Alert Messages */}
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

      {/* Dashboard Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Menunggu Persetujuan"
            value={pendingApprovals.filter(a => a.status === 'pending').length}
            icon={<Schedule />}
            color="warning"
            subtitle="Perlu action dari Anda"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Disetujui Hari Ini"
            value={dashboardData.stats.approved || 0}
            icon={<CheckCircle />}
            color="success"
            subtitle="Approved today"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Overdue"
            value={pendingApprovals.filter(a => calculateDaysOverdue(a.dueDate) > 0).length}
            icon={<AccessTime />}
            color="error"
            subtitle="Melewati deadline"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Value"
            value={formatCurrency(pendingApprovals.reduce((sum, a) => sum + (parseFloat(a.totalAmount) || 0), 0))}
            icon={<AttachMoney />}
            color="primary"
            subtitle="Pending approval"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
          >
            <Tab 
              label={
                <Badge badgeContent={pendingApprovals.filter(a => a.status === 'pending').length} color="warning">
                  Menunggu Persetujuan
                </Badge>
              } 
              icon={<PendingActions />}
            />
            <Tab 
              label="Pengajuan Saya" 
              icon={<Person />}
            />
            <Tab 
              label="Riwayat Approval" 
              icon={<History />}
            />
          </Tabs>
        </Box>

        {/* Tab 1: Pending Approvals */}
        <TabPanel value={tabValue} index={0}>
          {pendingApprovals.length === 0 ? (
            <Box textAlign="center" py={4}>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Tidak ada approval yang menunggu
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Semua approval telah selesai diproses
              </Typography>
            </Box>
          ) : (
            <Box>
              {pendingApprovals.map((approval) => (
                <ApprovalCard key={approval.id} approval={approval} />
              ))}
            </Box>
          )}
        </TabPanel>

        {/* Tab 2: My Submissions */}
        <TabPanel value={tabValue} index={1}>
          {mySubmissions.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Assignment sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Belum ada pengajuan
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Pengajuan approval yang Anda buat akan muncul di sini
              </Typography>
            </Box>
          ) : (
            <Box>
              {mySubmissions.map((submission) => (
                <ApprovalCard key={submission.id} approval={submission} showActions={false} />
              ))}
            </Box>
          )}
        </TabPanel>

        {/* Tab 3: History */}
        <TabPanel value={tabValue} index={2}>
          {dashboardData.recentApprovals?.length === 0 ? (
            <Box textAlign="center" py={4}>
              <History sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Belum ada riwayat
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Riwayat approval akan muncul di sini
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Decision Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(dashboardData.recentApprovals || []).map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getEntityTypeIcon(approval.entityType)}
                          <Typography variant="body2" ml={1}>
                            {getEntityTypeLabel(approval.entityType)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{approval.entityId}</TableCell>
                      <TableCell>
                        <Chip 
                          label={approval.status} 
                          color={getStatusColor(approval.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatCurrency(approval.totalAmount)}</TableCell>
                      <TableCell>{formatDateShort(approval.completedAt)}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleViewApproval(approval)}>
                          <Visibility />
                        </IconButton>
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
          <Box display="flex" alignItems="center">
            {selectedApproval && getEntityTypeIcon(selectedApproval.entityType)}
            <Typography variant="h6" ml={1}>
              Keputusan Persetujuan - {getEntityTypeLabel(selectedApproval?.entityType)} #{selectedApproval?.entityId}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedApproval && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Jenis Dokumen
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {getEntityTypeLabel(selectedApproval.entityType)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Total Nilai
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" color="primary.main">
                    {formatCurrency(selectedApproval.totalAmount)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Tahap Saat Ini
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedApproval.stepName}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Tanggal Pengajuan
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(selectedApproval.submittedAt)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Keputusan Persetujuan
                </FormLabel>
                <RadioGroup
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                >
                  <FormControlLabel 
                    value="approved" 
                    control={<Radio color="success" />} 
                    label={
                      <Box display="flex" alignItems="center">
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                        Setujui
                      </Box>
                    }
                  />
                  <FormControlLabel 
                    value="approve_with_conditions" 
                    control={<Radio color="info" />} 
                    label={
                      <Box display="flex" alignItems="center">
                        <Warning color="info" sx={{ mr: 1 }} />
                        Setujui dengan Syarat
                      </Box>
                    }
                  />
                  <FormControlLabel 
                    value="rejected" 
                    control={<Radio color="error" />} 
                    label={
                      <Box display="flex" alignItems="center">
                        <Cancel color="error" sx={{ mr: 1 }} />
                        Tolak
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>

              {decision === 'approve_with_conditions' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Syarat dan Ketentuan (Wajib)"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="Tentukan syarat dan ketentuan untuk persetujuan ini..."
                  sx={{ mb: 3 }}
                  required
                />
              )}

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Komentar (Opsional)"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Tambahkan komentar atau alasan untuk keputusan ini..."
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
          <Button onClick={() => setApprovalDialog(false)} disabled={actionLoading}>
            Batal
          </Button>
          <Button
            onClick={submitApprovalDecision}
            variant="contained"
            disabled={!decision || actionLoading || (decision === 'approve_with_conditions' && !conditions.trim())}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            {actionLoading ? 'Memproses...' : 'Kirim Keputusan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Approval Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            {selectedApproval && getEntityTypeIcon(selectedApproval.entityType)}
            <Typography variant="h6" ml={1}>
              Detail Persetujuan - {getEntityTypeLabel(selectedApproval?.entityType)} #{selectedApproval?.entityId}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedApproval && (
            <Box sx={{ mt: 2 }}>
              {/* Basic Information */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Informasi Dokumen
                      </Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="textSecondary">Jenis:</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {getEntityTypeLabel(selectedApproval.entityType)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="textSecondary">ID:</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedApproval.entityId}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="textSecondary">Total Nilai:</Typography>
                          <Typography variant="h6" color="primary.main">
                            {formatCurrency(selectedApproval.totalAmount)}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Status Informasi
                      </Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="textSecondary">Status:</Typography>
                          <Chip 
                            label={selectedApproval.status} 
                            color={getStatusColor(selectedApproval.status)}
                            icon={getStatusIcon(selectedApproval.status)}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="textSecondary">Diajukan:</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatDate(selectedApproval.submittedAt)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="textSecondary">Tahap Saat Ini:</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedApproval.stepName}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Entity Data */}
              {selectedApproval.entityData && (
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Detail Dokumen
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(selectedApproval.entityData).map(([key, value]) => (
                        <Grid item xs={12} sm={6} md={4} key={key}>
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {key.toLowerCase().includes('price') || key.toLowerCase().includes('amount') 
                                ? formatCurrency(value)
                                : typeof value === 'object' 
                                  ? JSON.stringify(value, null, 2)
                                  : String(value)
                              }
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApprovalDashboard;
