import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Main Asset Management Component
import AssetManagement from '../components/AssetManagement/AssetManagement';

/**
 * Asset Management Routes
 * 
 * Routes for comprehensive asset management system with tabbed interface including:
 * - Asset Registration and Management
 * - Depreciation Tracking
 * - Maintenance Scheduling
 * - Asset Analytics and Reporting
 */
const AssetRoutes = () => {
  return (
    <Routes>
      {/* Single route for tabbed Asset Management interface */}
      <Route index element={<AssetManagement />} />
    </Routes>
  );
};

export default AssetRoutes;