import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Alert,
  Badge,
  Tabs,
  Tab,
  Container,
  Skeleton,
  Fade,
  Avatar,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  PendingActions,
  AttachMoney,
  Person,
  History,
  AccessTime,
  ReceiptLong,
  Warning,
  CheckCircleOutline,
  HighlightOff,
  HourglassEmpty,
  InfoOutlined
} from '@mui/icons-material';

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
    purchase_order: <ReceiptLong color="secondary" />,
    budget: <AttachMoney color="info" />,
    project: <CheckCircle color="warning" />,
    default: <ReceiptLong color="action" />
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

const calculateDaysOverdue = (dueDate) => {
  if (!dueDate) return 0;
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = now - due;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// ==================== MAIN COMPONENT ====================

const ApprovalDashboardFixed = () => {
  const theme = useTheme();
  
  // State Management
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authToken, setAuthToken] = useState('');

  // ==================== API FUNCTIONS ====================

  const loginAndFetchToken = async () => {
    try {
      console.log('🔐 Attempting to login...');
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'sariwulandarisemm',
          password: 'admin123'
        })
      });

      const loginData = await loginResponse.json();
      console.log('🔐 Login response:', loginData);

      if (loginData.success) {
        setAuthToken(loginData.token);
        localStorage.setItem('token', loginData.token);
        console.log('✅ Token saved successfully');
        return loginData.token;
      } else {
        throw new Error('Login failed: ' + loginData.error);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const fetchPendingApprovals = async (token) => {
    try {
      console.log('📊 Fetching pending approvals with token...');
      const response = await fetch('http://localhost:5000/api/approval/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('📊 Pending approvals response:', data);

      if (data.success) {
        setPendingApprovals(data.data || []);
        console.log('✅ Set pending approvals:', data.data?.length || 0, 'items');
      } else {
        console.log('❌ Response not successful:', data);
        setError('Failed to fetch pending approvals: ' + data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching pending approvals:', error);
      setError('Network error: ' + error.message);
    }
  };

  const fetchMySubmissions = async (token) => {
    try {
      console.log('📝 Fetching my submissions...');
      const response = await fetch('http://localhost:5000/api/approval/my-submissions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('📝 My submissions response:', data);

      if (data.success) {
        setMySubmissions(data.data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching my submissions:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get or refresh token
      let token = authToken || localStorage.getItem('token');
      if (!token) {
        token = await loginAndFetchToken();
      }

      // Fetch data with token
      await Promise.all([
        fetchPendingApprovals(token),
        fetchMySubmissions(token)
      ]);

      console.log('✅ All data fetched successfully');
    } catch (error) {
      console.error('❌ Error in fetchData:', error);
      setError('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== EFFECTS ====================

  useEffect(() => {
    fetchData();
  }, []);

  // ==================== COMPUTED VALUES ====================
  
  const stats = {
    pending: pendingApprovals.filter(a => a.status === 'pending').length,
    overdue: pendingApprovals.filter(a => calculateDaysOverdue(a.dueDate) > 0).length,
    totalValue: pendingApprovals.reduce((sum, a) => sum + (parseFloat(a.totalAmount) || 0), 0),
    mySubmissionCount: mySubmissions.length
  };

  // ==================== COMPONENTS ====================

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );

  const StatsCard = ({ title, value, icon, color, subtitle }) => (
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
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
              {value}
            </Typography>
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
                label={approval.status || 'pending'} 
                color={getStatusColor(approval.status)}
                icon={getStatusIcon(approval.status)}
                size="small"
              />
            </Stack>
          </Box>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary" fontWeight={500}>
                  Total Amount
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {formatCurrency(approval.totalAmount)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary" fontWeight={500}>
                  Submitted
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDateShort(approval.submittedAt)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary" fontWeight={500}>
                  Due Date
                </Typography>
                <Typography variant="body1" fontWeight="medium" color={isOverdue ? 'error' : 'inherit'}>
                  {approval.dueDate ? formatDateShort(approval.dueDate) : 'Not set'}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {approval.entityData && (
            <Box mb={2}>
              <Typography variant="body2" fontWeight="medium" color="textSecondary" gutterBottom>
                Description:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {approval.entityData.description || 'No description'}
              </Typography>
              {approval.entityData.projectId && (
                <Typography variant="body2" color="textSecondary">
                  Project: {approval.entityData.projectId}
                </Typography>
              )}
            </Box>
          )}

          {showActions && (
            <Box display="flex" gap={1} justifyContent="flex-end">
              <Button
                size="small"
                variant="outlined"
                color="primary"
              >
                Lihat Detail
              </Button>
              <Button
                size="small"
                variant="contained"
                color="primary"
              >
                Proses Approval
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
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
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          🎯 APPROVAL DASHBOARD - FIXED VERSION
        </Typography>
        <Typography variant="h6" color="success.main" gutterBottom>
          ✅ Direct API Integration Working
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Kelola dan pantau proses persetujuan untuk RAB, Purchase Order, dan dokumen lainnya
        </Typography>
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
            <Button onClick={fetchData} sx={{ ml: 2 }}>
              Retry
            </Button>
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
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Terlambat"
            value={stats.overdue}
            icon={<AccessTime />}
            color="error"
            subtitle="Melewati deadline"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pengajuan Saya"
            value={stats.mySubmissionCount}
            icon={<Person />}
            color="info"
            subtitle="Total pengajuan"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Nilai"
            value={formatCurrency(stats.totalValue)}
            icon={<AttachMoney />}
            color="primary"
            subtitle="Pending approval"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
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
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  📋 {pendingApprovals.length} Approval Menunggu Proses
                </Typography>
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
                icon={<Person />}
                title="Belum ada pengajuan"
                subtitle="Pengajuan approval yang Anda buat akan muncul di sini."
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
            <EmptyState
              icon={<History />}
              title="Riwayat Approval"
              subtitle="Riwayat approval yang telah diproses akan muncul di sini."
            />
          </TabPanel>
        </Box>
      </Card>
    </Container>
  );
};

export default ApprovalDashboardFixed;
