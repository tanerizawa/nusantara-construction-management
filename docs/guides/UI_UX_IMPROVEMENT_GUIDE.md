# 🎨 UI/UX IMPROVEMENT GUIDE

**Date:** October 13, 2025  
**Task:** Fix Calendar Icons & Number Input Formatting

---

## 🎯 **OBJECTIVES**

1. **Calendar Icons:** Pastikan semua icon calendar berwarna putih di dark mode
2. **Number Input:** Tambahkan separator titik untuk ribuan/juta (format: 1.000.000)

---

## 📦 **NEW COMPONENTS CREATED**

### 1. **NumberInput Component** (`/frontend/src/components/ui/NumberInput.js`)

Komponen input angka dengan auto-formatting:

**Features:**
- ✅ Auto format dengan titik sebagai separator (1.000.000)
- ✅ Support decimal dengan koma (1.000,50)
- ✅ Real-time formatting saat user mengetik
- ✅ Dark theme compatible

**Usage:**
```javascript
import { NumberInput, CurrencyInput, QuantityInput, PercentageInput } from '../components/ui/NumberInput';

// Basic number input
<NumberInput
  value={amount}
  onChange={(val) => setAmount(val)}
  placeholder="0"
/>

// Currency input (with Rp prefix)
<CurrencyInput
  value={price}
  onChange={(val) => setPrice(val)}
  placeholder="Rp 0"
/>

// Quantity input (with decimal)
<QuantityInput
  value={qty}
  onChange={(val) => setQty(val)}
  placeholder="0"
/>

// Percentage input (with % suffix)
<PercentageInput
  value={percentage}
  onChange={(val) => setPercentage(val)}
  placeholder="0"
/>
```

### 2. **CalendarIcon Component** (`/frontend/src/components/ui/CalendarIcon.js`)

Icon calendar yang selalu terlihat di dark mode:

**Features:**
- ✅ Icon calendar berwarna putih di dark mode
- ✅ DateInputWithIcon component untuk input date

**Usage:**
```javascript
import { CalendarIconWhite, DateInputWithIcon } from '../components/ui/CalendarIcon';

// Standalone icon
<CalendarIconWhite size={16} />

// Date input with icon
<DateInputWithIcon
  label="Tanggal"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  required
/>
```

---

## 🔧 **MIGRATION GUIDE**

### **Step 1: Replace Calendar Icons**

**BEFORE:**
```javascript
import { Calendar } from 'lucide-react';

<Calendar size={16} />
<Calendar className="h-4 w-4 mr-2" />
```

**AFTER:**
```javascript
import { CalendarIconWhite } from '../components/ui/CalendarIcon';

<CalendarIconWhite size={16} />
<CalendarIconWhite className="mr-2" />
```

### **Step 2: Replace Number Inputs**

**BEFORE:**
```javascript
<input
  type="number"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  placeholder="Masukkan nominal"
/>
```

**AFTER:**
```javascript
import { CurrencyInput } from '../components/ui/NumberInput';

<CurrencyInput
  value={amount}
  onChange={(val) => setAmount(val)}
  placeholder="Rp 0"
/>
```

### **Step 3: Replace Date Inputs**

**BEFORE:**
```javascript
<input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
/>
```

**AFTER:**
```javascript
import { DateInputWithIcon } from '../components/ui/CalendarIcon';

<DateInputWithIcon
  value={date}
  onChange={(e) => setDate(e.target.value)}
  label="Tanggal"
/>
```

---

## 📋 **FILES TO UPDATE**

Priority list of files that need updates:

### **High Priority (Most Visible):**

1. ✅ `/frontend/src/components/ui/NumberInput.js` - NEW
2. ✅ `/frontend/src/components/ui/CalendarIcon.js` - NEW
3. 🔄 `/frontend/src/pages/SubsidiaryEdit.js` - Update number inputs & calendar icons
4. 🔄 `/frontend/src/pages/SubsidiaryCreate.js` - Update number inputs
5. 🔄 `/frontend/src/components/procurement/CreatePurchaseOrder.js` - Update inputs
6. 🔄 `/frontend/src/components/procurement/PurchaseOrderWorkflow.js` - Update inputs
7. 🔄 `/frontend/src/components/berita-acara/components/BeritaAcaraForm.js` - Update inputs

### **Medium Priority:**

8. 🔄 `/frontend/src/components/milestones/components/MilestoneFormModal.js`
9. 🔄 `/frontend/src/components/milestones/components/MilestoneInlineForm.js`
10. 🔄 `/frontend/src/components/workflow/rab-workflow/components/RABItemForm.js`
11. 🔄 `/frontend/src/components/ProjectMilestoneManager.js`
12. 🔄 `/frontend/src/components/tanda-terima/tanda-terima-manager/components/CreateTandaTerimaForm.js`

### **Low Priority (Less Visible):**

13. `/frontend/src/components/WarehouseManagement.js`
14. `/frontend/src/components/UnitConversionComponent.js`
15. `/frontend/src/components/HR/HRWorkflow.js`
16. `/frontend/src/components/AddNewSubsidiary.js`

---

## ✅ **TESTING CHECKLIST**

After updating each file:

- [ ] Calendar icons terlihat jelas (putih) di dark mode
- [ ] Number inputs menampilkan format dengan titik (1.000.000)
- [ ] Input masih bisa menerima angka dengan benar
- [ ] Saving data tidak error
- [ ] Dark theme berfungsi dengan baik
- [ ] No console errors

---

## 📝 **EXAMPLE: SubsidiaryEdit.js Update**

**Location:** Lines 720-750 (Financial Info section)

**BEFORE:**
```javascript
import { Calendar } from 'lucide-react';

// ...

<div>
  <label>
    <Calendar className="h-4 w-4 mr-1" />
    Established Year
  </label>
  <input
    type="number"
    value={formData.establishedYear}
    onChange={(e) => setFormData({...formData, establishedYear: e.target.value})}
  />
</div>

<div>
  <label>Employee Count</label>
  <input
    type="number"
    value={formData.employeeCount}
    onChange={(e) => setFormData({...formData, employeeCount: e.target.value})}
  />
</div>
```

**AFTER:**
```javascript
import { CalendarIconWhite } from '../components/ui/CalendarIcon';
import { NumberInput } from '../components/ui/NumberInput';

// ...

<div>
  <label>
    <CalendarIconWhite size={16} className="mr-1 inline" />
    Established Year
  </label>
  <NumberInput
    value={formData.establishedYear}
    onChange={(val) => setFormData({...formData, establishedYear: val})}
    placeholder="Contoh: 2020"
  />
</div>

<div>
  <label>Employee Count</label>
  <NumberInput
    value={formData.employeeCount}
    onChange={(val) => setFormData({...formData, employeeCount: val})}
    placeholder="Contoh: 50"
  />
</div>
```

---

## 🎨 **VISUAL EXAMPLES**

### **Number Input Formatting:**

| User Input | Display | Stored Value |
|------------|---------|--------------|
| 1000 | 1.000 | 1000 |
| 1000000 | 1.000.000 | 1000000 |
| 1500.50 | 1.500,50 | 1500.50 |

### **Calendar Icon:**

**Light Mode:** Gray icon (text-gray-700)  
**Dark Mode:** White icon (dark:text-white) ✅

---

## 🚀 **DEPLOYMENT STEPS**

1. ✅ Create new components:
   - `NumberInput.js`
   - `CalendarIcon.js`

2. 🔄 Update priority files (in order):
   - SubsidiaryEdit.js
   - SubsidiaryCreate.js
   - CreatePurchaseOrder.js
   - BeritaAcaraForm.js

3. ✅ Test each update:
   - Light mode
   - Dark mode
   - Input functionality
   - Save functionality

4. 📋 Update remaining files

5. ✅ Final testing:
   - Full app walkthrough
   - All forms tested
   - All dark mode pages checked

---

## 📊 **PROGRESS TRACKING**

| Component | Status | Notes |
|-----------|--------|-------|
| NumberInput.js | ✅ DONE | New component created |
| CalendarIcon.js | ✅ DONE | New component created |
| SubsidiaryEdit.js | 🔄 IN PROGRESS | Updating... |
| SubsidiaryCreate.js | ⏳ PENDING | - |
| CreatePurchaseOrder.js | ⏳ PENDING | - |
| BeritaAcaraForm.js | ⏳ PENDING | - |
| Others | ⏳ PENDING | - |

---

## 💡 **TIPS & BEST PRACTICES**

1. **Always test in dark mode** after changes
2. **Use semantic naming** for input fields
3. **Maintain existing functionality** - only enhance UX
4. **Check console for errors** after each update
5. **Test with real data** - try large numbers (billions)

---

**Status:** 🔄 IN PROGRESS  
**Next Action:** Update SubsidiaryEdit.js with new components

---

*End of Guide*
