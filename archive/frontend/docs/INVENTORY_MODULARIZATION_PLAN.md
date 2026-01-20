# 🎯 Rencana Modularisasi: Inventory.js (1,049 baris)

## 📋 **ANALISIS CURRENT STATE**

### **🔍 Struktur Saat Ini (Inventory.js)**
- **Total baris:** 1,049 lines
- **Komponen utama:** Single monolithic page component
- **State management:** 15+ state variables dalam satu component
- **API calls:** Multiple fetch functions dalam component
- **UI sections:** Materials, Suppliers, Orders, Delivery tracking
- **Kompleksitas:** High - terlalu banyak responsibility dalam satu file

### **🚨 Masalah yang Ditemukan**
1. **Single Responsibility Violation** - Satu component menghandle 4 tab berbeda
2. **State Management Overload** - 15+ useState dalam satu component
3. **API Logic Mixed with UI** - Fetch functions dicampur dengan render logic
4. **Hard to Test** - Monolithic structure sulit untuk unit testing
5. **Poor Maintainability** - Sulit untuk modify specific feature
6. **Code Duplication** - Similar patterns untuk berbagai tabs

---

## 🏗️ **RENCANA MODULARISASI**

### **📁 Struktur Folder Baru**
```
pages/inventory/
├── Inventory.js                     # Main page (< 150 baris)
├── index.js                         # Exports
├── hooks/
│   ├── useInventoryTabs.js          # Tab state management
│   ├── useMaterialPlanning.js       # Materials data & logic
│   ├── useSupplierManagement.js     # Suppliers data & logic
│   ├── useProcurementOrders.js      # Orders data & logic
│   ├── useDeliveryTracking.js       # Delivery data & logic
│   └── useInventoryStats.js         # Statistics calculations
├── components/
│   ├── InventoryHeader.js           # Page header with stats
│   ├── InventoryTabs.js             # Tab navigation
│   ├── materials/
│   │   ├── MaterialPlanningView.js  # Materials tab content
│   │   ├── MaterialStatsCards.js    # Material statistics
│   │   ├── MaterialTable.js         # Materials table
│   │   ├── MaterialForm.js          # Add/Edit material form
│   │   └── ImportRABModal.js        # Import from RAB
│   ├── suppliers/
│   │   ├── SupplierManagementView.js # Suppliers tab content
│   │   ├── SupplierTable.js         # Suppliers table
│   │   ├── SupplierForm.js          # Add/Edit supplier
│   │   └── SupplierStatsCards.js    # Supplier statistics
│   ├── procurement/
│   │   ├── ProcurementOrdersView.js # Orders tab content
│   │   ├── OrdersTable.js           # Orders table
│   │   ├── CreateOrderForm.js       # Create order form
│   │   └── OrderStatusBadge.js      # Status indicator
│   ├── delivery/
│   │   ├── DeliveryTrackingView.js  # Delivery tab content
│   │   ├── DeliveryTable.js         # Delivery tracking table
│   │   ├── DeliveryForm.js          # Update delivery status
│   │   └── DeliveryTimeline.js      # Delivery timeline
│   └── shared/
│       ├── SearchFilters.js         # Common search & filters
│       ├── StatsCard.js             # Reusable stats card
│       ├── ActionButtons.js         # Common action buttons
│       └── EmptyState.js            # Empty state component
├── config/
│   ├── tabsConfig.js                # Tab configurations
│   ├── tableColumns.js              # Table column definitions
│   ├── statusConfig.js              # Status configurations
│   └── formValidation.js            # Form validation rules
├── utils/
│   ├── inventoryCalculations.js     # Business logic calculations
│   ├── dataTransformers.js          # Data transformation utilities
│   ├── exportUtils.js               # Export functionality
│   └── formatters.js                # Format currency, dates, etc.
└── services/
    ├── materialService.js           # Materials API calls
    ├── supplierService.js           # Suppliers API calls
    ├── procurementService.js        # Procurement API calls
    └── deliveryService.js           # Delivery API calls
```

---

## 🔧 **IMPLEMENTASI TAHAP 1: Main Page & Hooks**

### **1. Inventory.js (Main Page) - Target: < 150 baris**
```javascript
import React from 'react';
import { useInventoryTabs } from './hooks/useInventoryTabs';
import InventoryHeader from './components/InventoryHeader';
import InventoryTabs from './components/InventoryTabs';
import MaterialPlanningView from './components/materials/MaterialPlanningView';
import SupplierManagementView from './components/suppliers/SupplierManagementView';
import ProcurementOrdersView from './components/procurement/ProcurementOrdersView';
import DeliveryTrackingView from './components/delivery/DeliveryTrackingView';

const Inventory = () => {
  const { activeTab, setActiveTab } = useInventoryTabs();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'materials':
        return <MaterialPlanningView />;
      case 'suppliers':
        return <SupplierManagementView />;
      case 'procurement':
        return <ProcurementOrdersView />;
      case 'delivery':
        return <DeliveryTrackingView />;
      default:
        return <MaterialPlanningView />;
    }
  };

  return (
    <div className="space-y-6">
      <InventoryHeader />
      <InventoryTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      {renderTabContent()}
    </div>
  );
};

export default Inventory;
```

### **2. useInventoryTabs.js - Tab Management Hook**
```javascript
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useInventoryTabs = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('materials');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/suppliers')) {
      setActiveTab('suppliers');
    } else if (path.includes('/procurement')) {
      setActiveTab('procurement');
    } else if (path.includes('/delivery')) {
      setActiveTab('delivery');
    } else {
      setActiveTab('materials');
    }
  }, [location.pathname]);

  return {
    activeTab,
    setActiveTab
  };
};
```

### **3. useMaterialPlanning.js - Materials Data Hook**
```javascript
import { useState, useEffect } from 'react';
import { materialService } from '../services/materialService';

export const useMaterialPlanning = (searchTerm, selectedCategory) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    activeProjects: 0,
    pendingProcurement: 0,
    deliveredItems: 0,
    totalMaterialBudget: 0
  });

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await materialService.getMaterials({
        search: searchTerm,
        category: selectedCategory
      });
      
      setMaterials(data.materials);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [searchTerm, selectedCategory]);

  const addMaterial = async (materialData) => {
    try {
      const newMaterial = await materialService.createMaterial(materialData);
      setMaterials(prev => [newMaterial, ...prev]);
      return newMaterial;
    } catch (error) {
      console.error('Error adding material:', error);
      throw error;
    }
  };

  const updateMaterial = async (id, materialData) => {
    try {
      const updatedMaterial = await materialService.updateMaterial(id, materialData);
      setMaterials(prev => 
        prev.map(item => item.id === id ? updatedMaterial : item)
      );
      return updatedMaterial;
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  };

  const deleteMaterial = async (id) => {
    try {
      await materialService.deleteMaterial(id);
      setMaterials(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  };

  return {
    materials,
    loading,
    stats,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    refetch: fetchMaterials
  };
};
```

---

## 🔧 **IMPLEMENTASI TAHAP 2: UI Components**

### **4. MaterialPlanningView.js - Materials Tab Component**
```javascript
import React, { useState } from 'react';
import { useMaterialPlanning } from '../hooks/useMaterialPlanning';
import MaterialStatsCards from './MaterialStatsCards';
import MaterialTable from './MaterialTable';
import SearchFilters from '../shared/SearchFilters';
import ActionButtons from '../shared/ActionButtons';
import EmptyState from '../shared/EmptyState';

const MaterialPlanningView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const {
    materials,
    loading,
    stats,
    addMaterial,
    updateMaterial,
    deleteMaterial
  } = useMaterialPlanning(searchTerm, selectedCategory);

  if (loading) {
    return <div>Loading materials...</div>;
  }

  return (
    <div className="space-y-6">
      <MaterialStatsCards stats={stats} />
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">
          Material Planning per Proyek
        </h2>
        <ActionButtons 
          onImportRAB={() => {/* Handle import */}}
          onAddManual={() => {/* Handle manual add */}}
        />
      </div>

      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {materials.length === 0 ? (
        <EmptyState 
          title="Belum ada material planning"
          description="Mulai dengan import dari RAB atau tambah manual"
        />
      ) : (
        <MaterialTable
          materials={materials}
          onEdit={updateMaterial}
          onDelete={deleteMaterial}
        />
      )}
    </div>
  );
};

export default MaterialPlanningView;
```

---

## 📊 **BENEFITS YANG DIHARAPKAN**

### **🎯 Code Quality Improvements**
- **File size reduction:** 1,049 baris → 15 files @ avg 70 baris
- **Maintainability:** ⭐⭐⭐⭐⭐ (dari ⭐⭐)
- **Testability:** ⭐⭐⭐⭐⭐ (dari ⭐)
- **Reusability:** ⭐⭐⭐⭐⭐ (dari ⭐⭐)

### **👥 Developer Experience**
- ✅ **Easier debugging** - Isolated components
- ✅ **Faster development** - Focused files
- ✅ **Better collaboration** - Multiple devs can work on different parts
- ✅ **Clearer architecture** - Well-defined boundaries

### **🚀 Performance Benefits**
- ✅ **Code splitting potential** - Lazy load tabs
- ✅ **Better caching** - Granular component updates
- ✅ **Smaller bundles** - Tree shaking friendly
- ✅ **Faster hot reload** - Only affected components reload

---

## ⏱️ **TIMELINE IMPLEMENTASI**

### **Week 1: Core Structure**
- ✅ Create folder structure
- ✅ Extract main page (Inventory.js)
- ✅ Create tab management hook
- ✅ Create basic tab components

### **Week 2: Materials Tab**
- ✅ Implement materials hooks
- ✅ Create materials components
- ✅ Material service layer
- ✅ Testing & refinement

### **Week 3: Other Tabs**
- ✅ Suppliers tab modularization
- ✅ Procurement tab modularization
- ✅ Delivery tab modularization

### **Week 4: Polish & Testing**
- ✅ Shared components optimization
- ✅ Performance testing
- ✅ Bug fixes & refinement
- ✅ Documentation

---

## 🎯 **SUCCESS METRICS**

### **Quantitative Targets**
- [ ] **File Size:** No file > 200 lines
- [ ] **Cyclomatic Complexity:** < 10 per function
- [ ] **Test Coverage:** > 80%
- [ ] **Bundle Size:** Reduce by 15%

### **Qualitative Targets**
- [ ] **Developer Satisfaction:** Easier to work with
- [ ] **Code Review Time:** Faster reviews
- [ ] **Bug Density:** Fewer bugs per feature
- [ ] **Onboarding Time:** Faster for new developers

Apakah Anda ingin saya mulai implementasi modularisasi untuk Inventory.js atau file lain yang Anda prioritaskan?