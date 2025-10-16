# Implementation Plan for Separating Purchase Orders and Work Orders

## Overview
This document outlines the plan for implementing a separation between Purchase Orders (PO) for materials and Work Orders (Perintah Kerja) for services in the project detail tab.

## Current Situation
- All RAB items (materials, services, labor) are treated the same way in PO creation
- No distinction between items that should be Purchase Orders vs Work Orders
- The "Create PO" tab doesn't filter items by type

## Implementation Plan

### Phase 1: Item Type Differentiation (Current Implementation)
1. **Update RAB Selection Logic**
   - Filter items by type in RABSelectionView
   - Only show material items for Purchase Orders
   - Identify service, labor, and equipment items for Work Orders
   - Added new utility functions in `workOrderTypes.js`

2. **UI Updates**
   - Update labels to clearly indicate which items are for PO vs Work Order
   - Added placeholder for Work Orders tab

### Phase 2: Work Order Implementation (Future)
1. **Create Work Order Data Model**
   - Define work order structure
   - Create backend endpoints

2. **Work Order UI Components**
   - Implement Work Order creation form
   - Implement Work Order list view
   - Implement Work Order details view

3. **Workflow Integration**
   - Connect Work Orders to approval workflow
   - Add tracking for Work Order progress

## Technical Details

### Item Type Classification
- **Purchase Orders**: For `material` item types
- **Work Orders**: For `service`, `labor`, and `equipment` item types

### New Components
1. `RABSelectionViewEnhanced.js` - Updated selection view with filtering
2. `workOrderTypes.js` - New configuration for Work Order types
3. `WorkOrdersNotImplemented.js` - Placeholder for Work Orders feature

## Implementation Status
- ✅ Item type differentiation
- ✅ Updated RAB selection with filtering
- ✅ Placeholder for Work Orders
- ❌ Work Order creation form (Future)
- ❌ Work Order tracking (Future)
- ❌ Work Order approval workflow (Future)