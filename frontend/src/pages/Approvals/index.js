import React from 'react';
import ApprovalDashboard from './components/ApprovalDashboard';
import { Box } from '@mui/material';

/**
 * Main Approvals page component
 * Follows the standard modular pattern used across the application
 */
const Approvals = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <ApprovalDashboard />
    </Box>
  );
};

export default Approvals;