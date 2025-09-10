import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ReceiptLong,
  Business,
  Build,
  AttachMoney,
  CheckCircle
} from '@mui/icons-material';

const ApprovalTestPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestData();
  }, []);

  const fetchTestData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/approval/test/data');
      const result = await response.json();
      
      console.log('Test data response:', result);
      
      if (result.success) {
        setData(result.data);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching test data:', error);
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(Number(amount));
  };

  const getEntityIcon = (entityType) => {
    switch (entityType) {
      case 'rab': return <ReceiptLong color="primary" />;
      case 'purchase_order': return <Business color="secondary" />;
      default: return <Build color="action" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'primary';
      case 'project_manager': return 'secondary';
      case 'board': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Approval Data...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchTestData}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          🚀 APPROVAL TEST PAGE - WORKING!
        </Typography>
        <Typography variant="h6" color="success.main" gutterBottom>
          ✅ Backend API Working: {data.length} Pending Approvals Found
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This page bypasses authentication to show raw approval data from database
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircle sx={{ fontSize: 48 }} />
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {data.length}
                  </Typography>
                  <Typography variant="h6">
                    Pending Approvals
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AttachMoney sx={{ fontSize: 48 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(data.reduce((sum, item) => sum + Number(item.total_amount || 0), 0))}
                  </Typography>
                  <Typography variant="h6">
                    Total Value
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Business sx={{ fontSize: 48 }} />
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {new Set(data.map(item => item.entity_data?.projectId)).size}
                  </Typography>
                  <Typography variant="h6">
                    Projects
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Approval Cards */}
      <Typography variant="h5" fontWeight="bold" mb={3}>
        📋 Pending Approvals
      </Typography>
      
      {data.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="textSecondary">
              No pending approvals found
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {data.map((approval, index) => (
            <Grid item xs={12} md={6} lg={4} key={approval.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s'
                  }
                }}
              >
                <CardContent>
                  {/* Header */}
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {getEntityIcon(approval.entity_type)}
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {approval.entity_type.toUpperCase()} #{index + 1}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {approval.step_name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Content */}
                  <Box mb={2}>
                    <Typography variant="body1" fontWeight="medium" mb={1}>
                      {approval.entity_data?.description || 'No description'}
                    </Typography>
                    
                    <Box mb={2}>
                      <Typography variant="body2" color="textSecondary">
                        Project: {approval.entity_data?.projectId}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Category: {approval.entity_data?.category}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Quantity: {approval.entity_data?.quantity} {approval.entity_data?.unit}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Total Amount
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          {formatCurrency(approval.total_amount)}
                        </Typography>
                      </Box>
                      <Chip 
                        label={approval.required_role}
                        color={getRoleColor(approval.required_role)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box display="flex" gap={1}>
                    <Button 
                      variant="contained" 
                      color="success" 
                      size="small"
                      fullWidth
                    >
                      ✅ Approve
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      fullWidth
                    >
                      ❌ Reject
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Debug Info */}
      <Card sx={{ mt: 4, bgcolor: 'grey.100' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔧 Debug Information
          </Typography>
          <Typography variant="body2" component="pre" sx={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify({ count: data.length, sampleData: data[0] }, null, 2)}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ApprovalTestPage;
