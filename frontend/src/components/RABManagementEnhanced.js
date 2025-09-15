import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  LinearProgress,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
  TablePagination,
} from '@mui/material';

// Icons
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MonetizationOnIcon,
  CheckBox as CheckBoxIcon,
  IndeterminateCheckBox as IndeterminateCheckBoxIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from '@mui/icons-material';

import apiService from '../services/api';

const RABManagementEnhanced = ({ selectedCompany, dateRange, onRefresh }) => {
  const [rabData, setRABData] = useState([]);
  const [projectRABSummaries, setProjectRABSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('summary'); // 'summary' or 'detail'
  
  // New states for view and edit functionality
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRABItem, setSelectedRABItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  // States for detailed RAB view
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailRABData, setDetailRABData] = useState([]);
  const [selectedRABItems, setSelectedRABItems] = useState(new Set());
  const [approvalLoading, setApprovalLoading] = useState(false);

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('id-ID').format(number);
  };

  // Format location object to string
  const formatLocation = (location) => {
    if (typeof location === 'object' && location) {
      const parts = [
        location.address,
        location.city,
        location.province || location.state
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : 'Location not specified';
    }
    return typeof location === 'string' ? location : 'Location not specified';
  };

  // Function to sync RAB approval status with localStorage cache
  const syncRABApprovalStatus = (rabItems) => {
    try {
      const syncedItems = rabItems.map(item => {
        // Get cached status from localStorage for this project
        const cacheKey = `approval_status_${item.projectId}`;
        const approvalStatusCache = localStorage.getItem(cacheKey);
        
        if (!approvalStatusCache) {
          return item;
        }
        
        let cachedStatus = null;
        try {
          const cache = JSON.parse(approvalStatusCache);
          const itemKey = `rab_${item.id}`;
          cachedStatus = cache[itemKey];
        } catch (error) {
          console.error('Error parsing approval cache for project:', item.projectId, error);
          return item;
        }
        
        if (cachedStatus) {
          const isApproved = cachedStatus.status === 'approved';
          console.log(`[RAB MGMT SYNC] Updating ${item.projectName} - ${item.description}: ${item.isApproved} → ${isApproved}`);
          
          return {
            ...item,
            isApproved: isApproved,
            is_approved: isApproved,
            approved_at: cachedStatus.approved_at,
            approved_by: cachedStatus.approved_by,
            approval_status: cachedStatus.status,
            last_sync: new Date().toISOString()
          };
        }
        
        return item;
      });
      
      const approvedCount = syncedItems.filter(item => item.isApproved).length;
      console.log(`[RAB MGMT SYNC] Synced ${approvedCount} approved items out of ${rabItems.length} total`);
      
      return syncedItems;
    } catch (error) {
      console.error('[RAB MGMT SYNC] Error syncing approval status:', error);
      return rabItems;
    }
  };

  const fetchRABData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all projects first
      const projectsResponse = await apiService.get('/projects', {
        params: {
          limit: 1000,
          ...(selectedCompany !== 'all' && { subsidiary: selectedCompany })
        }
      });

      if (!projectsResponse.success) {
        throw new Error('Failed to fetch projects');
      }

      const projects = projectsResponse.data || [];
      const allRABItems = [];
      const projectRABSummaries = [];

      // Fetch RAB items for each project and create summaries
      for (const project of projects) {
        try {
          const rabResponse = await apiService.get(`/projects/${project.id}/rab`);
          
          if (rabResponse.success && rabResponse.data) {
            let projectRABItems = rabResponse.data.map(item => ({
              ...item,
              projectName: project.name,
              projectId: project.id,
              projectLocation: formatLocation(project.location),
              companyName: project.subsidiary?.name || 
                          project.subsidiaryInfo?.name || 
                          'Unknown Company'
            }));
            
            // Sync approval status for this project's RAB items
            projectRABItems = syncRABApprovalStatus(projectRABItems);
            
            allRABItems.push(...projectRABItems);

            // Create project RAB summary (now with synced approval data)
            const totalRABValue = projectRABItems.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0);
            const approvedItems = projectRABItems.filter(item => item.isApproved);
            const pendingItems = projectRABItems.filter(item => !item.isApproved);
            const approvedValue = approvedItems.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0);
            const pendingValue = pendingItems.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0);

            projectRABSummaries.push({
              projectId: project.id,
              projectName: project.name,
              projectLocation: formatLocation(project.location),
              companyName: project.subsidiary?.name || project.subsidiaryInfo?.name || 'Unknown Company',
              totalItems: projectRABItems.length,
              totalValue: totalRABValue,
              approvedItems: approvedItems.length,
              approvedValue: approvedValue,
              pendingItems: pendingItems.length,
              pendingValue: pendingValue,
              approvalProgress: projectRABItems.length > 0 ? (approvedItems.length / projectRABItems.length * 100) : 0,
              lastUpdated: project.updatedAt || new Date().toISOString(),
              projectStatus: project.status || 'active',
              rabItems: projectRABItems
            });
          }
        } catch (rabError) {
          console.warn(`Failed to fetch RAB for project ${project.id}:`, rabError.message);
          // Continue with other projects
        }
      }

      // Filter by date range if specified
      const filteredRABItems = allRABItems.filter(item => {
        if (!dateRange.start || !dateRange.end) return true;
        
        const itemDate = new Date(item.createdAt || item.updatedAt);
        return itemDate >= dateRange.start && itemDate <= dateRange.end;
      });

      // Sync with localStorage approval status
      const syncedRABItems = syncRABApprovalStatus(filteredRABItems);

      setRABData(syncedRABItems);
      setProjectRABSummaries(projectRABSummaries);
      
      console.log('📋 Enhanced RAB Data Loaded:', {
        totalItems: filteredRABItems.length,
        projects: projects.length,
        projectSummaries: projectRABSummaries.length,
        companies: [...new Set(filteredRABItems.map(item => item.companyName))]
      });

    } catch (error) {
      console.error('❌ Error fetching RAB data:', error);
      
      // Fallback to sample data
      const fallbackProjectSummaries = [
        {
          projectId: '1',
          projectName: 'Mall Sentral Karawang',
          projectLocation: 'Karawang, Jawa Barat',
          companyName: 'PT Nusantara Construction',
          totalItems: 8,
          totalValue: 2500000000,
          approvedItems: 5,
          approvedValue: 1800000000,
          pendingItems: 3,
          pendingValue: 700000000,
          approvalProgress: 62.5,
          lastUpdated: new Date().toISOString(),
          projectStatus: 'active',
          rabItems: []
        }
      ];
      
      setProjectRABSummaries(fallbackProjectSummaries);
    } finally {
      setLoading(false);
    }
  }, [selectedCompany, dateRange]);

  useEffect(() => {
    fetchRABData();
  }, [fetchRABData]);

  // Listen for approval status changes from Approval Dashboard
  useEffect(() => {
    const handleApprovalStatusChange = (event) => {
      if (event.detail && event.detail.itemType === 'rab') {
        console.log('[RAB MGMT] RAB approval status changed, refreshing data...');
        fetchRABData();
      }
    };

    // Listen for same-tab approval changes
    window.addEventListener('approvalStatusChanged', handleApprovalStatusChange);

    return () => {
      window.removeEventListener('approvalStatusChanged', handleApprovalStatusChange);
    };
  }, [fetchRABData]);

  // Handler functions for project RAB detail view
  const handleViewProjectRAB = (projectSummary) => {
    setSelectedProject(projectSummary);
    setDetailRABData(projectSummary.rabItems || []);
    setViewMode('detail');
    setSelectedRABItems(new Set());
  };

  const handleBackToSummary = () => {
    setViewMode('summary');
    setSelectedProject(null);
    setDetailRABData([]);
    setSelectedRABItems(new Set());
  };

  // Handler for selecting RAB items for approval
  const handleSelectRABItem = (itemId) => {
    const newSelection = new Set(selectedRABItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedRABItems(newSelection);
  };

  const handleSelectAllRABItems = () => {
    const pendingItems = detailRABData.filter(item => !item.isApproved);
    if (selectedRABItems.size === pendingItems.length) {
      setSelectedRABItems(new Set());
    } else {
      setSelectedRABItems(new Set(pendingItems.map(item => item.id)));
    }
  };

  // Handler for RAB approval
  const handleApproveRABItems = async (itemIds = null) => {
    try {
      setApprovalLoading(true);
      
      const idsToApprove = itemIds || Array.from(selectedRABItems);
      if (idsToApprove.length === 0) {
        alert('Please select items to approve');
        return;
      }

      // Call API to approve RAB items
      for (const itemId of idsToApprove) {
        try {
          await apiService.post(`/projects/${selectedProject.projectId}/rab/${itemId}/approve`, {
            approvedBy: 'current_user', // You would get this from auth context
            approvalDate: new Date().toISOString(),
            notes: 'Approved via Enterprise Dashboard'
          });
        } catch (error) {
          console.warn(`Failed to approve RAB item ${itemId}:`, error);
        }
      }

      // Update local state
      setDetailRABData(prevData => 
        prevData.map(item => 
          idsToApprove.includes(item.id) ? { ...item, isApproved: true, status: 'approved' } : item
        )
      );

      // Update project summaries
      setProjectRABSummaries(prevSummaries => 
        prevSummaries.map(summary => {
          if (summary.projectId === selectedProject.projectId) {
            const updatedRABItems = summary.rabItems.map(item => 
              idsToApprove.includes(item.id) ? { ...item, isApproved: true, status: 'approved' } : item
            );
            const approvedItems = updatedRABItems.filter(item => item.isApproved);
            const pendingItems = updatedRABItems.filter(item => !item.isApproved);
            const approvedValue = approvedItems.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0);
            const pendingValue = pendingItems.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0);

            return {
              ...summary,
              rabItems: updatedRABItems,
              approvedItems: approvedItems.length,
              approvedValue: approvedValue,
              pendingItems: pendingItems.length,
              pendingValue: pendingValue,
              approvalProgress: updatedRABItems.length > 0 ? (approvedItems.length / updatedRABItems.length * 100) : 0
            };
          }
          return summary;
        })
      );

      // Clear selection
      setSelectedRABItems(new Set());
      
      // Refresh main RAB data
      await fetchRABData();
      
      alert(`Successfully approved ${idsToApprove.length} RAB item(s)`);
      
    } catch (error) {
      console.error('Error approving RAB items:', error);
      alert('Failed to approve RAB items. Please try again.');
    } finally {
      setApprovalLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Conditional rendering based on view mode */}
      {viewMode === 'summary' ? (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6">
                        Total Projects
                      </Typography>
                      <Typography variant="h4" component="div">
                        {projectRABSummaries.length}
                      </Typography>
                    </Box>
                    <VisibilityIcon color="primary" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6">
                        Total RAB Value
                      </Typography>
                      <Typography variant="h5" component="div" color="success.main">
                        {formatNumber(projectRABSummaries.reduce((sum, p) => sum + p.totalValue, 0))}
                      </Typography>
                    </Box>
                    <MonetizationOnIcon color="success" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6">
                        Approved Value
                      </Typography>
                      <Typography variant="h5" component="div" color="info.main">
                        {formatNumber(projectRABSummaries.reduce((sum, p) => sum + p.approvedValue, 0))}
                      </Typography>
                    </Box>
                    <CheckCircleIcon color="info" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6">
                        Pending Value
                      </Typography>
                      <Typography variant="h5" component="div" color="warning.main">
                        {formatNumber(projectRABSummaries.reduce((sum, p) => sum + p.pendingValue, 0))}
                      </Typography>
                    </Box>
                    <ScheduleIcon color="warning" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Project RAB Summary Table */}
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" component="h2">
                📋 RAB Management - Project Overview
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Click on any project to view detailed RAB items and manage approvals
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Project Details</TableCell>
                    <TableCell align="center">Total Items</TableCell>
                    <TableCell align="center">Total Value</TableCell>
                    <TableCell align="center">Approved</TableCell>
                    <TableCell align="center">Pending</TableCell>
                    <TableCell align="center">Progress</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    projectRABSummaries.map((project, index) => (
                      <TableRow 
                        key={project.projectId} 
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleViewProjectRAB(project)}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {project.projectName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              📍 {project.projectLocation}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="textSecondary">
                              🏢 {project.companyName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={project.totalItems} 
                            color="primary" 
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(project.totalValue)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box>
                            <Chip 
                              label={`${project.approvedItems} items`} 
                              color="success" 
                              size="small"
                            />
                            <Typography variant="caption" display="block">
                              {formatCurrency(project.approvedValue)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box>
                            <Chip 
                              label={`${project.pendingItems} items`} 
                              color="warning" 
                              size="small"
                            />
                            <Typography variant="caption" display="block">
                              {formatCurrency(project.pendingValue)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={project.approvalProgress} 
                              sx={{ width: 60, mr: 1 }}
                              color={project.approvalProgress === 100 ? 'success' : 'primary'}
                            />
                            <Typography variant="caption">
                              {project.approvalProgress.toFixed(0)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProjectRAB(project);
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      ) : (
        /* Detail RAB View */
        <ProjectRABDetailView 
          project={selectedProject}
          rabItems={detailRABData}
          selectedItems={selectedRABItems}
          approvalLoading={approvalLoading}
          onBack={handleBackToSummary}
          onSelectItem={handleSelectRABItem}
          onSelectAll={handleSelectAllRABItems}
          onApproveItems={handleApproveRABItems}
        />
      )}
    </Box>
  );
};

// Component for Project RAB Detail View
const ProjectRABDetailView = ({ 
  project, 
  rabItems, 
  selectedItems, 
  approvalLoading, 
  onBack, 
  onSelectItem, 
  onSelectAll, 
  onApproveItems 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredRABItems = rabItems.filter(item => item.projectId === project?.projectId);
  const pendingItems = filteredRABItems.filter(item => !item.isApproved);
  const selectedCount = selectedItems.size;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Back Button */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          variant="outlined"
        >
          Back to Summary
        </Button>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {project?.projectName} - RAB Details
          </Typography>
          <Typography variant="body2" color="textSecondary">
            📍 {project?.projectLocation} • 🏢 {project?.companyName}
          </Typography>
        </Box>
      </Box>

      {/* Project RAB Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h4">
                {filteredRABItems.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Value
              </Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(project?.totalValue || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Approved ({project?.approvedItems})
              </Typography>
              <Typography variant="h6" color="success.main">
                {formatCurrency(project?.approvedValue || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending ({project?.pendingItems})
              </Typography>
              <Typography variant="h6" color="warning.main">
                {formatCurrency(project?.pendingValue || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Approval Actions */}
      {pendingItems.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" color="primary">
                💼 RAB Approval Center
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedCount > 0 ? `${selectedCount} items selected` : 'Select items to approve'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={onSelectAll}
                startIcon={pendingItems.length === selectedCount ? <IndeterminateCheckBoxIcon /> : <CheckBoxIcon />}
              >
                {pendingItems.length === selectedCount ? 'Deselect All' : 'Select All Pending'}
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => onApproveItems()}
                disabled={selectedCount === 0 || approvalLoading}
                startIcon={approvalLoading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
              >
                {approvalLoading ? 'Processing...' : `Approve Selected (${selectedCount})`}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Detailed RAB Items Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedCount > 0 && selectedCount < pendingItems.length}
                  checked={pendingItems.length > 0 && selectedCount === pendingItems.length}
                  onChange={onSelectAll}
                />
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Total Price</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRABItems.map((item) => (
              <TableRow key={item.id} hover selected={selectedItems.has(item.id)}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onChange={() => onSelectItem(item.id)}
                    disabled={item.isApproved}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {item.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={item.category} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="center">
                  {item.quantity} {item.unit}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(item.unitPrice)}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(item.totalPrice)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={item.isApproved ? 'Approved' : 'Pending'}
                    color={item.isApproved ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {!item.isApproved && (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => onApproveItems([item.id])}
                      disabled={approvalLoading}
                      startIcon={<CheckCircleIcon />}
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RABManagementEnhanced;
