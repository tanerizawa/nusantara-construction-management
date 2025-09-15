import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Schedule,
  Send,
  Person,
  Business,
  AccountBalance
} from '@mui/icons-material';
import api from '../services/api';

const RABApprovalStatus = ({ rabId, open, onClose, onSubmitForApproval }) => {
  const [loading, setLoading] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [rabData, setRabData] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && rabId) {
      fetchApprovalStatus();
      fetchRABData();
    }
  }, [open, rabId]);

  const fetchApprovalStatus = async () => {
    try {
      // Use enhanced approval status endpoint
      const response = await fetch(`http://localhost:5000/api/approval/rab/${rabId}/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setApprovalStatus(data.data);
        }
      } else if (response.status !== 404) {
        throw new Error('Failed to load approval status');
      }
      // 404 means no approval process exists yet, which is fine
      if (response.status === 404) {
        setApprovalStatus(null);
      }
    } catch (error) {
      console.error('Error fetching approval status:', error);
      setError('Failed to load approval status');
      setApprovalStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRABData = async () => {
    try {
      // Get project ID first from RAB
      const rabResponse = await api.get(`/projects/1/rab`); // This needs to be dynamic
      const currentRAB = rabResponse.data.data.find(rab => rab.id === parseInt(rabId));
      setRabData(currentRAB);
    } catch (error) {
      console.error('Error fetching RAB data:', error);
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      setSubmitting(true);
      
      // Submit to enhanced approval system
      const response = await fetch(`http://localhost:5000/api/approval/rab/${rabId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflow_type: 'RAB Construction Standard',
          priority: 'normal',
          requested_by: localStorage.getItem('username') || 'system'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setApprovalStatus(data.data);
        if (onSubmitForApproval) {
          onSubmitForApproval(data.data);
        }
        // Refresh the status
        await fetchApprovalStatus();
      } else {
        throw new Error(data.error || 'Failed to submit for approval');
      }
    } catch (error) {
      console.error('Error submitting for approval:', error);
      setError(error.message || 'Failed to submit for approval');
    } finally {
      setSubmitting(false);
    }
  };

  const getStepStatus = (step) => {
    if (!approvalStatus) return 'pending';
    
    const currentStep = approvalStatus.ApprovalSteps?.find(s => s.stepOrder === step.step);
    if (!currentStep) return 'pending';
    
    return currentStep.status;
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
        return <Schedule color="disabled" />;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'project_manager':
        return <Person />;
      case 'site_manager':
        return <Business />;
      case 'site_engineer':
        return <Business />;
      case 'procurement_officer':
        return <Business />;
      case 'operations_director':
      case 'finance_director':
      case 'board_member':
      case 'ceo':
        return <AccountBalance />;
      default:
        return <Person />;
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

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  // Get workflow steps from approval status or enhanced construction workflow
  const workflowSteps = approvalStatus?.ApprovalWorkflow?.workflow_steps || [
    { 
      step: 1, 
      name: "Project Manager Review", 
      role: "project_manager",
      conditions: { max_amount: 500000000, technical_validation: true },
      sla_hours: 24
    },
    { 
      step: 2, 
      name: "Site Manager Validation", 
      role: "site_manager",
      conditions: { max_amount: 1000000000, field_feasibility: true },
      sla_hours: 48
    },
    { 
      step: 3, 
      name: "Operations Director Approval", 
      role: "operations_director",
      conditions: { max_amount: 2000000000, strategic_alignment: true },
      sla_hours: 72
    }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            RAB Approval Status
          </Typography>
          {approvalStatus && (
            <Chip
              label={approvalStatus.overallStatus}
              color={getStatusColor(approvalStatus.overallStatus)}
              icon={getStatusIcon(approvalStatus.overallStatus)}
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* RAB Summary */}
        {rabData && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                RAB Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Description
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {rabData.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Category
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {rabData.category}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Quantity & Unit
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {rabData.quantity} {rabData.unit}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(rabData.totalPrice)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {!approvalStatus ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Send color="action" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Ready for Approval
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              This RAB has not been submitted for approval yet.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Send />}
              onClick={handleSubmitForApproval}
              disabled={submitting}
              size="large"
            >
              {submitting ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Approval Progress
            </Typography>
            
            {/* Progress Stepper */}
            <Stepper orientation="vertical" sx={{ mb: 4 }}>
              {workflowSteps.map((step, index) => {
                const stepStatus = getStepStatus(step);
                const approvalStep = approvalStatus.ApprovalSteps?.find(s => s.stepOrder === step.step);
                
                return (
                  <Step key={step.step} active={stepStatus === 'pending'} completed={stepStatus === 'approved'}>
                    <StepLabel
                      error={stepStatus === 'rejected'}
                      icon={stepStatus === 'rejected' ? <Cancel color="error" /> : undefined}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getRoleIcon(step.role)}
                        <Typography variant="subtitle1">
                          {step.name}
                        </Typography>
                        <Chip
                          label={stepStatus}
                          size="small"
                          color={getStatusColor(stepStatus)}
                          variant="outlined"
                        />
                      </Box>
                    </StepLabel>
                    <StepContent>
                      {approvalStep && (
                        <Box sx={{ mt: 1 }}>
                          {approvalStep.approver && (
                            <Typography variant="body2" color="textSecondary">
                              Approver: {approvalStep.approver.name}
                            </Typography>
                          )}
                          {approvalStep.processedAt && (
                            <Typography variant="body2" color="textSecondary">
                              Processed: {formatDate(approvalStep.processedAt)}
                            </Typography>
                          )}
                          {approvalStep.comments && (
                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                              "{approvalStep.comments}"
                            </Typography>
                          )}
                        </Box>
                      )}
                    </StepContent>
                  </Step>
                );
              })}
            </Stepper>

            {/* Timeline View */}
            <Typography variant="h6" gutterBottom>
              Approval Timeline
            </Typography>
            
            <Timeline>
              <TimelineItem>
                <TimelineOppositeContent color="textSecondary">
                  {formatDate(approvalStatus.createdAt)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <Send />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6">
                    Submitted for Approval
                  </Typography>
                  <Typography color="textSecondary">
                    RAB submitted to approval workflow
                  </Typography>
                </TimelineContent>
              </TimelineItem>

              {approvalStatus.ApprovalSteps?.map((step, index) => (
                step.status !== 'pending' && (
                  <TimelineItem key={step.id}>
                    <TimelineOppositeContent color="textSecondary">
                      {step.processedAt ? formatDate(step.processedAt) : 'Pending'}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={getStatusColor(step.status)}>
                        {getStatusIcon(step.status)}
                      </TimelineDot>
                      {index < approvalStatus.ApprovalSteps.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6">
                        {step.stepName}
                      </Typography>
                      <Typography color="textSecondary">
                        {step.status === 'approved' ? 'Approved' : 'Rejected'} by {step.approver?.name || 'Unknown'}
                      </Typography>
                      {step.comments && (
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                          "{step.comments}"
                        </Typography>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                )
              ))}
            </Timeline>

            {/* Current Status Summary */}
            <Card sx={{ mt: 3, bgcolor: approvalStatus.overallStatus === 'approved' ? 'success.light' : 
                                       approvalStatus.overallStatus === 'rejected' ? 'error.light' : 'warning.light' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {getStatusIcon(approvalStatus.overallStatus)}
                  <Box>
                    <Typography variant="h6">
                      Current Status: {approvalStatus.overallStatus.toUpperCase()}
                    </Typography>
                    <Typography variant="body2">
                      {approvalStatus.overallStatus === 'pending' && 
                        `Waiting for approval at step ${approvalStatus.currentStep}`}
                      {approvalStatus.overallStatus === 'approved' && 
                        'All approvals completed successfully'}
                      {approvalStatus.overallStatus === 'rejected' && 
                        'Approval request has been rejected'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
        {!approvalStatus && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Send />}
            onClick={handleSubmitForApproval}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RABApprovalStatus;
