import React from 'react';
import { Box } from '@mui/material';
import ApprovalDashboard from '../components/ApprovalDashboard';

const Approvals = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <ApprovalDashboard />
    </Box>
  );
};

export default Approvals;
