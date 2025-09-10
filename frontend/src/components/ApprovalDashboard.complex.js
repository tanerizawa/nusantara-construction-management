import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
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
  FormLabel,
  Paper,
  Container,
  Skeleton,
  IconButton,
  Fade,
  Slide,
  useTheme,
  alpha
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Schedule,
  Assignment,
  History,
  Visibility,
  PendingActions,
  ExpandMore,
  AttachMoney,
  Description,
  DateRange,
  Person,
  Build,
  Warning,
  InfoOutlined,
  Timeline,
  Refresh,
  AccessTime,
  TrendingUp,
  AccountBalance,
  Business,
  ReceiptLong,
  Category,
  CheckCircleOutline,
  HighlightOff,
  HourglassEmpty,
  Speed
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// ==================== UTILITY FUNCTIONS ====================

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(amount));
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  } catch (error) {
    return dateString;
  }
};

const formatDateShort = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  } catch (error) {
    return dateString;
  }
};

const getStatusColor = (status) => {
  const statusMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    approve_with_conditions: 'info',
    in_progress: 'info',
    completed: 'success'
  };
  return statusMap[status] || 'default';
};

const getStatusIcon = (status) => {
  const iconMap = {
    pending: <HourglassEmpty />,
    approved: <CheckCircleOutline />,
    rejected: <HighlightOff />,
    approve_with_conditions: <Warning />,
    in_progress: <Schedule />,
    completed: <CheckCircle />
  };
  return iconMap[status] || <InfoOutlined />;
};

const getEntityTypeIcon = (entityType) => {
  const iconMap = {
    rab: <ReceiptLong color="primary" />,
    purchase_order: <Business color="secondary" />,
    budget: <AccountBalance color="info" />,
    project: <Build color="warning" />,
    default: <Description color="action" />
  };
  return iconMap[entityType] || iconMap.default;
};

const getEntityTypeLabel = (entityType) => {
  const labelMap = {
    rab: 'RAB',
    purchase_order: 'Purchase Order',
    budget: 'Budget',
    project: 'Project',
    default: 'Document'
  };
  return labelMap[entityType] || labelMap.default;
};

const getPriorityColor = (priority) => {
  const priorityMap = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    urgent: 'error'
  };
  return priorityMap[priority] || 'default';
};

const calculateDaysOverdue = (dueDate) => {
  if (!dueDate) return 0;
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = now - due;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// ==================== MAIN COMPONENT ====================

const ApprovalDashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  // State Management
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    pendingCount: 0,
    recentApprovals: [],
    stats: { approved: 0, rejected: 0, total: 0 }
  });
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  
  // Dialog States
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  
  // Form States
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');
  const [conditions, setConditions] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Feedback States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // ==================== COMPUTED VALUES ====================
  
  const stats = useMemo(() => {
    const overdue = pendingApprovals.filter(a => calculateDaysOverdue(a.dueDate) > 0).length;
    const totalValue = pendingApprovals.reduce((sum, a) => sum + (parseFloat(a.totalAmount) || 0), 0);
    const pendingCount = pendingApprovals.filter(a => a.status === 'pending').length;
    
    return {
      pending: pendingCount,
      overdue,
      totalValue,
      mySubmissionCount: mySubmissions.length
    };
  }, [pendingApprovals, mySubmissions]);

  // ==================== API FUNCTIONS ====================

  const fetchData = useCallback(async () => {
    const isRefresh = !loading;
    if (isRefresh) setRefreshing(true);
    
    console.log('🚀 Starting data fetch...');
    
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchPendingApprovals(),
        fetchMySubmissions()
      ]);
      console.log('✅ All data fetched successfully');
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      console.log('🏁 Data fetch completed');
    }
  }, [loading]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/approval/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status !== 404) {
        throw error;
      }
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      console.log('🔍 Fetching pending approvals...');
      const response = await api.get('/approval/pending');
      console.log('📊 Pending approvals response:', response.data);
      
      if (response.data.success) {
        setPendingApprovals(response.data.data || []);
        console.log('✅ Set pending approvals:', response.data.data?.length || 0, 'items');
      } else {
        console.log('❌ Response not successful:', response.data);
        setPendingApprovals([]);
      }
    } catch (error) {
      console.error('❌ Error fetching pending approvals:', error);
      console.error('❌ Error details:', error.response?.data);
      setPendingApprovals([]);
      throw error;
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
      throw error;
    }
  };

  // ==================== EVENT HANDLERS ====================

  const handleApprovalAction = useCallback((approval) => {
    setSelectedApproval(approval);
    setApprovalDialog(true);
    setDecision('');
    setComments('');
    setConditions('');
    setError('');
    setSuccess('');
  }, []);

  const handleViewApproval = useCallback((approval) => {
    setSelectedApproval(approval);
    setViewDialog(true);
  }, []);

  const submitApprovalDecision = async () => {
    if (!decision) {
      setError('Pilih keputusan terlebih dahulu');
      return;
    }

    if (decision === 'approve_with_conditions' && !conditions.trim()) {
      setError('Syarat dan ketentuan wajib diisi untuk persetujuan bersyarat');
      return;
    }

    setActionLoading(true);
    setError('');
    
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
        setSuccess(`Keputusan "${decision.replace('_', ' ')}" berhasil dikirim`);
        setApprovalDialog(false);
        
        // Refresh data
        await fetchData();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error submitting approval decision:', error);
      setError(error.response?.data?.error || 'Gagal mengirim keputusan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // ==================== EFFECTS ====================

  useEffect(() => {
    fetchData();
    
    // Setup auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  // ==================== COMPONENTS ====================

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );

  const StatsCard = ({ title, value, icon, color, subtitle, loading: cardLoading = false }) => (
    <Card 
      sx={{ 
        height: '100%', 
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-4px)', 
          boxShadow: theme.shadows[8] 
        },
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom fontWeight={500}>
              {title}
            </Typography>
            {cardLoading ? (
              <Skeleton variant="text" width={80} height={40} />
            ) : (
              <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
                {value}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="textSecondary" fontWeight={400}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar 
            sx={{ 
              bgcolor: `${color}.main`, 
              width: 64, 
              height: 64,
              boxShadow: theme.shadows[4]
            }}
          >
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
      <Slide direction="up" in={true} timeout={300}>
        <Card 
          sx={{ 
            mb: 3, 
            border: isOverdue ? `2px solid ${theme.palette.error.main}` : `1px solid ${theme.palette.divider}`,
            transition: 'all 0.3s ease',
            '&:hover': { 
              boxShadow: theme.shadows[6],
              transform: 'translateY(-2px)'
            }
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box display="flex" alignItems="center">
                <Box mr={2}>
                  {getEntityTypeIcon(approval.entityType)}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {getEntityTypeLabel(approval.entityType)} #{approval.entityId}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {approval.stepName || approval.requiredRole}
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                {isOverdue && (
                  <Chip 
                    label={`${daysOverdue} hari terlambat`}
                    color="error" 
                    size="small"
                    icon={<AccessTime />}
                    variant="outlined"
                  />
                )}
                <Chip 
                  label={approval.status} 
                  color={getStatusColor(approval.status)}
                  icon={getStatusIcon(approval.status)}
                  size="small"
                />
              </Stack>
            </Box>

            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary" fontWeight={500}>
                    Total Amount
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {formatCurrency(approval.totalAmount)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary" fontWeight={500}>
                    Submitted
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDateShort(approval.submittedAt)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary" fontWeight={500}>
                    Due Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" color={isOverdue ? 'error' : 'inherit'}>
                    {approval.dueDate ? formatDateShort(approval.dueDate) : 'Not set'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary" fontWeight={500}>
                    Priority
                  </Typography>
                  <Chip 
                    label={approval.priority || 'Normal'} 
                    size="small"
                    color={getPriorityColor(approval.priority)}
                    variant="outlined"
                  />
                </Box>
              </Grid>
            </Grid>

            {showActions && (
              <Box display="flex" gap={1} justifyContent="flex-end">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() => handleViewApproval(approval)}
                >
                  Lihat Detail
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Assignment />}
                  onClick={() => handleApprovalAction(approval)}
                  color="primary"
                >
                  Proses Approval
                </Button>
              </Box>
            )}

            {approval.entityData && (
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="body2" fontWeight="medium">
                    Detail Information
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {Object.entries(approval.entityData).slice(0, 6).map(([key, value]) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Box>
                          <Typography variant="body2" color="textSecondary" fontWeight={500}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
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
                </AccordionDetails>
              </Accordion>
            )}
          </CardContent>
        </Card>
      </Slide>
    );
  };

  const EmptyState = ({ icon, title, subtitle }) => (
    <Box textAlign="center" py={8}>
      <Fade in={true} timeout={500}>
        <Box>
          {React.cloneElement(icon, { 
            sx: { fontSize: 80, color: 'grey.400', mb: 3 }
          })}
          <Typography variant="h5" gutterBottom fontWeight={600} color="textSecondary">
            {title}
          </Typography>
          <Typography variant="body1" color="textSecondary" maxWidth={400} mx="auto">
            {subtitle}
          </Typography>
        </Box>
      </Fade>
    </Box>
  );

  // ==================== LOADING STATE ====================
  
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={500} height={24} />
        </Box>
        
        <Grid container spacing={3} mb={4}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Skeleton variant="text" width={100} height={24} />
                      <Skeleton variant="text" width={80} height={40} />
                      <Skeleton variant="text" width={120} height={20} />
                    </Box>
                    <Skeleton variant="circular" width={56} height={56} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" width="100%" height={400} />
          </CardContent>
        </Card>
      </Container>
    );
  }

  // ==================== MAIN RENDER ====================

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Dashboard Persetujuan
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Kelola dan pantau proses persetujuan untuk RAB, Purchase Order, dan dokumen lainnya
          </Typography>
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            {refreshing ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Fade in={true}>
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        </Fade>
      )}
      
      {error && (
        <Fade in={true}>
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        </Fade>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Menunggu Approval"
            value={stats.pending}
            icon={<PendingActions />}
            color="warning"
            subtitle="Perlu tindakan"
            loading={refreshing}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Terlambat"
            value={stats.overdue}
            icon={<AccessTime />}
            color="error"
            subtitle="Melewati deadline"
            loading={refreshing}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pengajuan Saya"
            value={stats.mySubmissionCount}
            icon={<Person />}
            color="info"
            subtitle="Total pengajuan"
            loading={refreshing}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Nilai"
            value={formatCurrency(stats.totalValue)}
            icon={<AttachMoney />}
            color="primary"
            subtitle="Pending approval"
            loading={refreshing}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper 
        elevation={2}
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            sx={{ 
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 64
              }
            }}
          >
            <Tab 
              label={
                <Badge badgeContent={stats.pending} color="warning" max={99}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PendingActions />
                    Menunggu Persetujuan
                  </Box>
                </Badge>
              }
            />
            <Tab 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Person />
                  Pengajuan Saya
                </Box>
              }
            />
            <Tab 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <History />
                  Riwayat Approval
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {/* Tab 1: Pending Approvals */}
          <TabPanel value={tabValue} index={0}>
            {pendingApprovals.length === 0 ? (
              <EmptyState
                icon={<CheckCircle />}
                title="Tidak ada approval yang menunggu"
                subtitle="Semua approval telah selesai diproses. Halaman ini akan diperbarui secara otomatis ketika ada approval baru."
              />
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
              <EmptyState
                icon={<Assignment />}
                title="Belum ada pengajuan"
                subtitle="Pengajuan approval yang Anda buat akan muncul di sini. Mulai dengan membuat RAB atau dokumen baru untuk diajukan."
              />
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
              <EmptyState
                icon={<History />}
                title="Belum ada riwayat"
                subtitle="Riwayat approval yang telah Anda proses akan muncul di sini, memberikan transparansi penuh dalam proses persetujuan."
              />
            ) : (
              <Box>
                {dashboardData.recentApprovals?.map((approval) => (
                  <ApprovalCard key={approval.id} approval={approval} showActions={false} />
                ))}
              </Box>
            )}
          </TabPanel>
        </Box>
      </Paper>

      {/* Approval Decision Dialog */}
      <Dialog 
        open={approvalDialog} 
        onClose={() => setApprovalDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            {selectedApproval && getEntityTypeIcon(selectedApproval.entityType)}
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Proses Persetujuan
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {getEntityTypeLabel(selectedApproval?.entityType)} #{selectedApproval?.entityId}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {selectedApproval && (
            <Box>
              {/* Summary Card */}
              <Card variant="outlined" sx={{ mb: 3, bgcolor: 'background.default' }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" color="textSecondary" fontWeight={500}>
                          Total Amount
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                          {formatCurrency(selectedApproval.totalAmount)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" color="textSecondary" fontWeight={500}>
                          Status Saat Ini
                        </Typography>
                        <Chip 
                          label={selectedApproval.status} 
                          color={getStatusColor(selectedApproval.status)}
                          icon={getStatusIcon(selectedApproval.status)}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Divider sx={{ my: 3 }} />

              {/* Decision Form */}
              <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                  Keputusan Persetujuan *
                </FormLabel>
                <RadioGroup
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                >
                  <FormControlLabel 
                    value="approved" 
                    control={<Radio color="success" />} 
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircle color="success" />
                        <Box>
                          <Typography fontWeight={500}>Setujui</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Menyetujui pengajuan tanpa syarat
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <FormControlLabel 
                    value="approve_with_conditions" 
                    control={<Radio color="info" />} 
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Warning color="info" />
                        <Box>
                          <Typography fontWeight={500}>Setujui dengan Syarat</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Menyetujui dengan kondisi tertentu
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <FormControlLabel 
                    value="rejected" 
                    control={<Radio color="error" />} 
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Cancel color="error" />
                        <Box>
                          <Typography fontWeight={500}>Tolak</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Menolak pengajuan dengan alasan
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>

              {/* Conditions Field */}
              {decision === 'approve_with_conditions' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Syarat dan Ketentuan"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="Tentukan syarat dan ketentuan untuk persetujuan ini..."
                  sx={{ mb: 3 }}
                  required
                  error={decision === 'approve_with_conditions' && !conditions.trim()}
                  helperText={decision === 'approve_with_conditions' && !conditions.trim() ? "Wajib diisi untuk persetujuan bersyarat" : ""}
                />
              )}

              {/* Comments Field */}
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Komentar"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Tambahkan komentar atau alasan untuk keputusan ini..."
                helperText="Opsional - Berikan penjelasan tambahan jika diperlukan"
              />

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setApprovalDialog(false)} 
            disabled={actionLoading}
            variant="outlined"
          >
            Batal
          </Button>
          <Button
            onClick={submitApprovalDecision}
            variant="contained"
            disabled={!decision || actionLoading || (decision === 'approve_with_conditions' && !conditions.trim())}
            startIcon={actionLoading ? <CircularProgress size={20} /> : <Assignment />}
            size="large"
          >
            {actionLoading ? 'Memproses...' : 'Kirim Keputusan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Approval Dialog */}
      <Dialog 
        open={viewDialog} 
        onClose={() => setViewDialog(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            {selectedApproval && getEntityTypeIcon(selectedApproval.entityType)}
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Detail Persetujuan
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {getEntityTypeLabel(selectedApproval?.entityType)} #{selectedApproval?.entityId}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {selectedApproval && (
            <Box>
              {/* Basic Info */}
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                        Informasi Dasar
                      </Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="textSecondary" fontWeight={500}>
                            Total Amount
                          </Typography>
                          <Typography variant="h5" fontWeight="bold" color="primary">
                            {formatCurrency(selectedApproval.totalAmount)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="textSecondary" fontWeight={500}>
                            Status
                          </Typography>
                          <Chip 
                            label={selectedApproval.status} 
                            color={getStatusColor(selectedApproval.status)}
                            icon={getStatusIcon(selectedApproval.status)}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="textSecondary" fontWeight={500}>
                            Diajukan
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatDate(selectedApproval.submittedAt)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="textSecondary" fontWeight={500}>
                            Tahap Saat Ini
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedApproval.stepName}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  {/* Entity Data */}
                  {selectedApproval.entityData && (
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                          Detail Dokumen
                        </Typography>
                        <Stack spacing={2}>
                          {Object.entries(selectedApproval.entityData).slice(0, 8).map(([key, value]) => (
                            <Box key={key}>
                              <Typography variant="body2" color="textSecondary" fontWeight={500}>
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
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
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setViewDialog(false)} variant="contained" size="large">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ApprovalDashboard;
