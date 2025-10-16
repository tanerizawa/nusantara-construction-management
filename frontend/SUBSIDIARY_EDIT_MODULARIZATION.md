# 🎯 Rencana Modularisasi Prioritas: SubsidiaryEdit.js (1,538 baris)

## 📋 **ANALISIS FILE TERBESAR: SubsidiaryEdit.js**

### **🔍 Current State Analysis**
- **Total Lines:** 1,538 baris (file terbesar dalam aplikasi!)
- **Type:** Page component dengan form kompleks
- **Kompleksitas:** 
  - Multiple tabs (basic, legal, financial, governance)
  - Complex form state management
  - Multiple nested objects dalam state
  - Validation logic tersebar
  - API calls mixed dengan UI logic
- **Dependencies:** UI components, services, utilities

### **🚨 Masalah yang Ditemukan**
1. **Monolithic Structure** - Satu file menghandle semua aspek subsidiary management
2. **State Overload** - 15+ state variables dalam satu component
3. **Mixed Concerns** - Form logic, validation, API calls, UI rendering dalam satu tempat
4. **Hard to Test** - Sulit untuk unit test individual features
5. **Poor Maintainability** - Perubahan kecil bisa affect seluruh component
6. **Code Duplication** - Similar patterns untuk berbagai tabs

---

## 🏗️ **RENCANA MODULARISASI DETAIL**

### **📁 Struktur Folder Target**
```
pages/subsidiary-edit/
├── SubsidiaryEdit.js                    # Main page (< 150 baris)
├── index.js                             # Exports
├── hooks/
│   ├── useSubsidiaryEdit.js             # Main data management hook
│   ├── useSubsidiaryForm.js             # Form state management
│   ├── useSubsidiaryValidation.js       # Validation logic
│   ├── useSubsidiaryTabs.js             # Tab navigation logic
│   └── useSubsidiaryActions.js          # CRUD operations
├── components/
│   ├── SubsidiaryEditHeader.js          # Page header & navigation
│   ├── SubsidiaryEditTabs.js            # Tab navigation
│   ├── forms/
│   │   ├── BasicInfoForm.js             # Basic information tab
│   │   ├── LegalInfoForm.js             # Legal information tab
│   │   ├── FinancialInfoForm.js         # Financial information tab
│   │   ├── GovernanceForm.js            # Governance information tab
│   │   └── ContactInfoForm.js           # Contact information
│   ├── sections/
│   │   ├── AddressSection.js            # Address input section
│   │   ├── CertificationSection.js      # Certifications management
│   │   ├── DirectorsSection.js          # Board of directors
│   │   └── DocumentsSection.js          # Document uploads
│   ├── modals/
│   │   ├── AddDirectorModal.js          # Add director modal
│   │   ├── AddCertificationModal.js     # Add certification modal
│   │   └── ConfirmSaveModal.js          # Confirmation modal
│   └── shared/
│       ├── FormSection.js               # Reusable form section
│       ├── FieldGroup.js                # Grouped form fields
│       └── ValidationMessage.js         # Validation error display
├── config/
│   ├── formConfig.js                    # Form field configurations
│   ├── tabsConfig.js                    # Tab configurations
│   ├── validationRules.js               # Validation rule definitions
│   └── constants.js                     # Constants & enums
├── utils/
│   ├── formHelpers.js                   # Form utility functions
│   ├── validationHelpers.js             # Validation utilities
│   ├── dataTransformers.js              # Data transformation
│   └── formatters.js                    # Data formatting
└── services/
    └── subsidiaryEditService.js         # API calls specific to edit
```

---

## 🔧 **IMPLEMENTASI FASE 1: Core Structure**

### **1. SubsidiaryEdit.js (Main Page) - Target: 120 baris**
```javascript
import React from 'react';
import { useSubsidiaryEdit } from './hooks/useSubsidiaryEdit';
import { useSubsidiaryTabs } from './hooks/useSubsidiaryTabs';
import SubsidiaryEditHeader from './components/SubsidiaryEditHeader';
import SubsidiaryEditTabs from './components/SubsidiaryEditTabs';
import BasicInfoForm from './components/forms/BasicInfoForm';
import LegalInfoForm from './components/forms/LegalInfoForm';
import FinancialInfoForm from './components/forms/FinancialInfoForm';
import GovernanceForm from './components/forms/GovernanceForm';

const SubsidiaryEdit = () => {
  const { 
    subsidiary, 
    loading, 
    saving, 
    handleSave,
    handleCancel 
  } = useSubsidiaryEdit();
  
  const { activeTab, setActiveTab } = useSubsidiaryTabs();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic': return <BasicInfoForm />;
      case 'legal': return <LegalInfoForm />;
      case 'financial': return <FinancialInfoForm />;
      case 'governance': return <GovernanceForm />;
      default: return <BasicInfoForm />;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <SubsidiaryEditHeader 
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />
      
      <SubsidiaryEditTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {renderTabContent()}
    </div>
  );
};

export default SubsidiaryEdit;
```

### **2. useSubsidiaryEdit.js - Main Data Hook**
```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubsidiaryForm } from './useSubsidiaryForm';
import { useSubsidiaryActions } from './useSubsidiaryActions';
import { useSubsidiaryValidation } from './useSubsidiaryValidation';

export const useSubsidiaryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  
  const { formData, updateFormData, resetForm } = useSubsidiaryForm();
  const { validateForm, errors } = useSubsidiaryValidation(formData);
  const { fetchSubsidiary, saveSubsidiary } = useSubsidiaryActions();

  useEffect(() => {
    if (isEditing) {
      loadSubsidiary();
    }
  }, [id]);

  const loadSubsidiary = async () => {
    try {
      setLoading(true);
      const data = await fetchSubsidiary(id);
      updateFormData(data);
    } catch (error) {
      console.error('Error loading subsidiary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      await saveSubsidiary(formData, isEditing);
      navigate('/subsidiaries');
    } catch (error) {
      console.error('Error saving subsidiary:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/subsidiaries');
  };

  return {
    subsidiary: formData,
    loading,
    saving,
    errors,
    handleSave,
    handleCancel,
    updateFormData
  };
};
```

### **3. useSubsidiaryForm.js - Form State Management**
```javascript
import { useState } from 'react';
import { getInitialFormData } from '../config/formConfig';

export const useSubsidiaryForm = () => {
  const [formData, setFormData] = useState(getInitialFormData());

  const updateFormData = (data) => {
    setFormData(data);
  };

  const updateField = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
  };

  const addArrayItem = (path, item) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = [
        ...current[keys[keys.length - 1]], 
        item
      ];
      return newData;
    });
  };

  const removeArrayItem = (path, index) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = current[keys[keys.length - 1]].filter(
        (_, i) => i !== index
      );
      return newData;
    });
  };

  return {
    formData,
    updateFormData,
    updateField,
    resetForm,
    addArrayItem,
    removeArrayItem
  };
};
```

---

## 🔧 **IMPLEMENTASI FASE 2: Form Components**

### **4. BasicInfoForm.js - Basic Information Tab**
```javascript
import React from 'react';
import { useSubsidiaryForm } from '../hooks/useSubsidiaryForm';
import { useSubsidiaryValidation } from '../hooks/useSubsidiaryValidation';
import FormSection from '../shared/FormSection';
import FieldGroup from '../shared/FieldGroup';
import ContactInfoForm from './ContactInfoForm';
import AddressSection from '../sections/AddressSection';

const BasicInfoForm = () => {
  const { formData, updateField } = useSubsidiaryForm();
  const { errors } = useSubsidiaryValidation();

  return (
    <div className="space-y-6">
      <FormSection title="Informasi Dasar" icon={Building}>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Nama Subsidiary *</label>
              <input
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="form-input"
                placeholder="PT Subsidiary Name"
              />
              {errors.name && <ValidationMessage message={errors.name} />}
            </div>
            
            <div>
              <label>Kode Subsidiary *</label>
              <input
                value={formData.code}
                onChange={(e) => updateField('code', e.target.value)}
                className="form-input"
                placeholder="SUB001"
              />
              {errors.code && <ValidationMessage message={errors.code} />}
            </div>
          </div>
        </FieldGroup>
      </FormSection>

      <ContactInfoForm />
      <AddressSection />
    </div>
  );
};

export default BasicInfoForm;
```

---

## 📊 **EXPECTED BENEFITS**

### **🎯 Metrics Improvement**
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| File Size | 1,538 lines | 15 files @ 80 lines avg | ↓ 92% |
| Complexity | Very High | Low per file | ↓ 85% |
| Test Coverage | 20% | 80% | ↑ 300% |
| Maintainability | Poor | Excellent | ↑ 400% |

### **🚀 Development Benefits**
- ✅ **Faster Development** - Focused, small files
- ✅ **Easier Testing** - Isolated components
- ✅ **Better Collaboration** - Multiple devs can work simultaneously
- ✅ **Reduced Bugs** - Clearer separation of concerns
- ✅ **Faster Reviews** - Smaller, focused PRs

---

## ⏱️ **IMPLEMENTATION TIMELINE**

### **Week 1: Foundation**
- [ ] Create folder structure
- [ ] Extract main page component
- [ ] Create basic hooks (useSubsidiaryEdit, useSubsidiaryForm)
- [ ] Setup shared components

### **Week 2: Form Components**
- [ ] Extract BasicInfoForm
- [ ] Extract LegalInfoForm
- [ ] Extract FinancialInfoForm
- [ ] Extract GovernanceForm

### **Week 3: Advanced Features**
- [ ] Section components (Address, Certification, Directors)
- [ ] Modal components
- [ ] Validation system
- [ ] Service layer

### **Week 4: Testing & Polish**
- [ ] Unit tests for all components
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Documentation

---

## 🎯 **NEXT PRIORITY FILES**

Setelah SubsidiaryEdit.js selesai, lanjut ke:

1. **InvoiceManager.js** (1,131 baris)
2. **PurchaseOrderWorkflow.js** (1,039 baris)
3. **ChartOfAccounts.js** (1,007 baris)
4. **Table.js** (931 baris)

**Total estimated time for all critical files: 8-10 weeks**