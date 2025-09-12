import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Existing Inventory Components
import Inventory from '../pages/Inventory';
import WarehouseManagement from '../components/WarehouseManagement';
import StockOpname from '../components/StockOpname';

// New Priority 1 Enhancement Components
import EquipmentMaintenanceManagement from '../components/EquipmentMaintenanceManagement';
import MaterialReservationSystem from '../components/MaterialReservationSystem';
import BOQIntegrationModule from '../components/BOQIntegrationModule';
import UnitConversionComponent from '../components/UnitConversionComponent';

/**
 * Enhanced Inventory Routes
 * Construction Industry Best Practice Implementation
 * Includes Priority 1 enhancements for construction project management
 */

const InventoryRoutes = () => {
  return (
    <Routes>
      {/* Main Inventory Dashboard */}
      <Route path="/" element={<Inventory />} />
      
      {/* Existing Inventory Features */}
      <Route path="/warehouses" element={<WarehouseManagement />} />
      <Route path="/stock-opname" element={<StockOpname />} />
      
      {/* Priority 1 Construction Enhancements */}
      <Route path="/maintenance" element={<EquipmentMaintenanceManagement />} />
      <Route path="/reservations" element={<MaterialReservationSystem />} />
      <Route path="/boq-integration" element={<BOQIntegrationModule />} />
      <Route path="/unit-converter" element={<UnitConversionComponent />} />
    </Routes>
  );
};

export default InventoryRoutes;
