# ANALISIS KOMPREHENSIF: SISTEM REALISASI BELANJA RAP

**Tanggal**: 12 November 2025  
**Proyek**: Nusantara Construction Management System  
**Fase**: Redesign Tab Progres → Realisasi Belanja RAP

---

## 📋 EXECUTIVE SUMMARY

### Situasi Saat Ini
Tab "Progres" (dulunya "Timeline") masih memiliki fitur timeline yang tidak relevan. Kebutuhan sebenarnya adalah sistem tracking realisasi belanja yang menampilkan:
- List RAP items yang sudah dibuat
- Kolom realisasi aktual vs budget
- Dokumentasi dan log pencatatan

### Tujuan Transformasi
Mengubah tab Progres menjadi **"Realisasi Belanja"** dengan fitur:
1. **RAP Budget Tracking** - Menampilkan semua item RAP dengan budget
2. **Actual Spending Input** - Input realisasi belanja actual (bisa lebih/kurang dari budget)
3. **Variance Analysis** - Analisis selisih budget vs actual
4. **Documentation** - Photo/file upload per realisasi
5. **Activity Log** - History semua input realisasi
6. **Progressive Realization** - Multiple entries per RAP item (bertahap)

---

## 🎯 KEBUTUHAN FUNGSIONAL

### 1. **Tampilan Utama: RAP Items dengan Realisasi**

**Tabel RAP Budget vs Actual:**
```
┌────────────────────────────────────────────────────────────────────────────┐
│ REALISASI BELANJA - Projek Uji Coba                                        │
├────────────────────────────────────────────────────────────────────────────┤
│ Status: 2 dari 10 items terealisasi | Budget: Rp 100jt | Actual: Rp 95jt  │
│ Variance: -Rp 5jt (-5%) Under Budget ✅                                    │
├────┬──────────────┬──────┬──────┬──────────┬──────────┬─────────┬─────────┤
│ #  │ Item RAP     │ Unit │ Qty  │ Budget   │ Realisasi│ Variance│ Status  │
├────┼──────────────┼──────┼──────┼──────────┼──────────┼─────────┼─────────┤
│ 1  │ Semen PC     │ sak  │ 100  │ Rp 6.5jt │ Rp 6.8jt │ +4.6%   │ ⚠️Over  │
│    │ [Material]   │      │      │          │          │         │         │
│    │ └─ 2 realisasi                                   │         │ [Detail]│
├────┼──────────────┼──────┼──────┼──────────┼──────────┼─────────┼─────────┤
│ 2  │ Jasa Cat     │ m²   │ 250  │ Rp 10jt  │ Rp 9.5jt │ -5%     │ ✅Under │
│    │ [Service]    │      │      │          │          │         │         │
│    │ └─ 3 realisasi                                   │         │ [Detail]│
└────┴──────────────┴──────┴──────┴──────────┴──────────┴─────────┴─────────┘
```

### 2. **Form Input Realisasi**

**Modal: Tambah Realisasi Belanja**
```
┌─────────────────────────────────────────────────────┐
│ Input Realisasi - Semen PC                          │
├─────────────────────────────────────────────────────┤
│ RAP Budget: Rp 6,500,000 (100 sak @ Rp 65,000)    │
│ Realisasi Sebelumnya: Rp 3,200,000 (2 transaksi)  │
│ Sisa Budget: Rp 3,300,000                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 📅 Tanggal Transaksi: [12 Nov 2025]                │
│                                                     │
│ 💰 Jumlah Realisasi:                                │
│    ┌──────────────┬──────────────┬──────────────┐  │
│    │ Qty          │ Harga Unit   │ Total        │  │
│    ├──────────────┼──────────────┼──────────────┤  │
│    │ [50] sak     │ [Rp 68,000]  │ Rp 3,400,000 │  │
│    └──────────────┴──────────────┴──────────────┘  │
│                                                     │
│ 📝 Catatan:                                         │
│    [Harga naik karena inflasi...]                  │
│                                                     │
│ 📎 Dokumentasi:                                     │
│    [Upload] Struk pembelian, Foto material         │
│    • struk_semen_121125.pdf ❌                     │
│    • foto_material.jpg ❌                          │
│                                                     │
│ ⚠️ Variance: +Rp 150,000 (+4.6%) dari budget unit  │
│                                                     │
│ [Batalkan]                           [Simpan] 💾   │
└─────────────────────────────────────────────────────┘
```

### 3. **Detail Realisasi per Item**

**Expandable Row Detail:**
```
┌────────────────────────────────────────────────────────────────┐
│ Detail Realisasi: Semen PC                                      │
├────────────────────────────────────────────────────────────────┤
│ Budget Total: Rp 6,500,000 (100 sak @ Rp 65,000)              │
│ Total Realisasi: Rp 6,800,000 (100 sak @ rata² Rp 68,000)     │
│ Variance: +Rp 300,000 (+4.6%) OVER BUDGET ⚠️                  │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 📊 Riwayat Realisasi (2 transaksi):                            │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ #1 - 5 Nov 2025                                             ││
│ │ • Qty: 50 sak @ Rp 66,000 = Rp 3,300,000                   ││
│ │ • Vendor: Toko Bangunan ABC                                 ││
│ │ • Catatan: Pembelian tahap pertama                          ││
│ │ • Dokumen: [struk.pdf] [foto.jpg]                          ││
│ │ • Input by: Hadez - 5 Nov 2025 14:30                       ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ #2 - 12 Nov 2025                                            ││
│ │ • Qty: 50 sak @ Rp 70,000 = Rp 3,500,000                   ││
│ │ • Vendor: Toko Bangunan XYZ                                 ││
│ │ • Catatan: Harga naik karena inflasi, supplier lama habis  ││
│ │ • Dokumen: [struk2.pdf] [foto2.jpg]                        ││
│ │ • Input by: Hadez - 12 Nov 2025 10:15                      ││
│ │ • ⚠️ Alert: Harga melebihi budget unit (+7.7%)              ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ [+ Tambah Realisasi]                         [Export Detail]   │
└─────────────────────────────────────────────────────────────────┘
```

### 4. **Dashboard Summary**

**Summary Cards:**
```
┌────────────────┬────────────────┬────────────────┬────────────────┐
│ Total Budget   │ Total Realisasi│ Variance       │ Completion     │
├────────────────┼────────────────┼────────────────┼────────────────┤
│ Rp 100,000,000 │ Rp 95,000,000  │ -Rp 5,000,000  │ 95%            │
│                │                │ (-5%)          │                │
│                │                │ ✅ Under Budget│ [████████░░]   │
└────────────────┴────────────────┴────────────────┴────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Breakdown by Category:                                           │
├────────────────┬──────────┬───────────┬──────────┬──────────────┤
│ Kategori       │ Budget   │ Realisasi │ Variance │ Status       │
├────────────────┼──────────┼───────────┼──────────┼──────────────┤
│ Material       │ Rp 50jt  │ Rp 52jt   │ +4%      │ ⚠️ Over      │
│ Jasa           │ Rp 30jt  │ Rp 28jt   │ -6.7%    │ ✅ Under     │
│ Tenaga         │ Rp 20jt  │ Rp 15jt   │ -25%     │ ✅ Under     │
└────────────────┴──────────┴───────────┴──────────┴──────────────┘
```

---

## 🏗️ ARSITEKTUR TEKNIS

### **1. Database Schema**

#### **Tabel: rab_realizations**
```sql
CREATE TABLE rab_realizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) NOT NULL REFERENCES projects(id),
    rab_item_id UUID NOT NULL REFERENCES project_rab(id),
    
    -- Transaction Details
    transaction_date DATE NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    
    -- Metadata
    vendor_name VARCHAR(255),
    invoice_number VARCHAR(100),
    payment_method VARCHAR(50),
    notes TEXT,
    
    -- Variance Tracking
    budget_unit_price DECIMAL(15,2), -- Snapshot from RAP at time of input
    variance_amount DECIMAL(15,2),
    variance_percentage DECIMAL(5,2),
    
    -- Status & Approval
    status VARCHAR(20) DEFAULT 'draft', -- draft, approved, rejected
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    
    -- Audit Trail
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Soft Delete
    deleted_at TIMESTAMP,
    
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_rab_item FOREIGN KEY (rab_item_id) REFERENCES project_rab(id) ON DELETE CASCADE
);

CREATE INDEX idx_realizations_project ON rab_realizations(project_id);
CREATE INDEX idx_realizations_rab_item ON rab_realizations(rab_item_id);
CREATE INDEX idx_realizations_date ON rab_realizations(transaction_date);
CREATE INDEX idx_realizations_status ON rab_realizations(status);
```

#### **Tabel: realization_documents**
```sql
CREATE TABLE realization_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    realization_id UUID NOT NULL REFERENCES rab_realizations(id) ON DELETE CASCADE,
    
    -- File Details
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Document Type
    document_type VARCHAR(50), -- invoice, receipt, photo, other
    description TEXT,
    
    -- Metadata
    uploaded_by VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_realization FOREIGN KEY (realization_id) REFERENCES rab_realizations(id)
);

CREATE INDEX idx_docs_realization ON realization_documents(realization_id);
```

### **2. API Endpoints**

#### **GET /api/projects/:projectId/rab/realizations**
Mendapatkan semua item RAP dengan agregasi realisasi
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBudget": 100000000,
      "totalRealization": 95000000,
      "variance": -5000000,
      "variancePercentage": -5,
      "completionRate": 95,
      "itemsCount": 10,
      "realizedItemsCount": 8
    },
    "items": [
      {
        "rabItem": {
          "id": "uuid",
          "category": "Pekerjaan Struktur",
          "description": "Semen PC 40kg",
          "itemType": "material",
          "unit": "sak",
          "quantity": 100,
          "unitPrice": 65000,
          "totalBudget": 6500000
        },
        "realizations": {
          "count": 2,
          "totalQuantity": 100,
          "totalAmount": 6800000,
          "variance": 300000,
          "variancePercentage": 4.6,
          "lastTransaction": "2025-11-12",
          "entries": [...]
        }
      }
    ]
  }
}
```

#### **POST /api/projects/:projectId/rab/:rabItemId/realizations**
Input realisasi baru
```json
{
  "transactionDate": "2025-11-12",
  "quantity": 50,
  "unitPrice": 68000,
  "vendorName": "Toko Bangunan ABC",
  "invoiceNumber": "INV-001",
  "notes": "Pembelian tahap pertama",
  "documents": ["file1.pdf", "file2.jpg"]
}
```

#### **GET /api/projects/:projectId/rab/:rabItemId/realizations**
Detail realisasi per RAP item
```json
{
  "success": true,
  "data": {
    "rabItem": {...},
    "budget": {
      "quantity": 100,
      "unitPrice": 65000,
      "totalBudget": 6500000
    },
    "realizations": [
      {
        "id": "uuid",
        "transactionDate": "2025-11-05",
        "quantity": 50,
        "unitPrice": 66000,
        "totalAmount": 3300000,
        "vendorName": "Toko ABC",
        "variance": 50000,
        "documents": [...],
        "createdBy": "Hadez",
        "createdAt": "2025-11-05T14:30:00Z"
      }
    ],
    "totals": {
      "totalQuantity": 100,
      "totalAmount": 6800000,
      "avgUnitPrice": 68000,
      "variance": 300000,
      "variancePercentage": 4.6
    }
  }
}
```

---

## 💻 KOMPONEN FRONTEND

### **1. Main Component: RealizationTracker.js**
```javascript
// frontend/src/pages/project-detail/tabs/RealizationTracker.js
const RealizationTracker = ({ projectId, project }) => {
  // States
  const [rabItems, setRabItems] = useState([]);
  const [realizations, setRealizations] = useState([]);
  const [summary, setSummary] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [showInputModal, setShowInputModal] = useState(false);

  // Features:
  // - Load RAP items with realization data
  // - Display summary cards
  // - Table with budget vs actual
  // - Variance analysis
  // - Action buttons
};
```

### **2. RealizationInputForm.js**
Form input realisasi dengan:
- Date picker
- Qty & unit price calculator
- Vendor info
- Notes
- Document upload
- Variance warning
- Validation

### **3. RealizationDetailPanel.js**
Detail panel per RAP item:
- Budget info
- Realization history
- Timeline visualization
- Document gallery
- Add realization button

### **4. RealizationSummary.js**
Dashboard cards:
- Total budget vs actual
- Variance indicators
- Completion percentage
- Category breakdown
- Alert for overbudget items

---

## 📊 FITUR & BEST PRACTICES

### **Fitur Utama:**

1. **Progressive Realization**
   - Multiple entries per RAP item
   - Track pembelian bertahap
   - Cumulative calculation

2. **Variance Analysis**
   - Auto-calculate variance
   - Color-coded indicators (green/yellow/red)
   - Alert jika over budget
   - Percentage & nominal display

3. **Documentation**
   - Multi-file upload
   - Support PDF, images
   - Preview & download
   - Categorized by type (invoice, receipt, photo)

4. **Activity Log**
   - Immutable records
   - Audit trail (who, when, what)
   - Change history
   - Export capability

5. **Approval Workflow** (Future)
   - Draft → Review → Approved
   - Multi-level approval
   - Rejection with notes

### **Best Practices Implementation:**

1. **Data Integrity**
   - Immutable realization records
   - Soft delete only
   - Full audit trail
   - Version control

2. **User Experience**
   - Auto-fill from RAP budget
   - Variance warning sebelum save
   - Bulk import dari Excel
   - Quick filters (by status, date range, category)

3. **Performance**
   - Paginated table
   - Lazy load documents
   - Cached calculations
   - Indexed queries

4. **Security**
   - Role-based access (input vs view)
   - Document access control
   - Encrypted file storage
   - Approval required for edit/delete

---

## 🚀 FASE IMPLEMENTASI

### **FASE 1: Foundation (Week 1)**
- [ ] Database migration: rab_realizations table
- [ ] Database migration: realization_documents table
- [ ] Backend API: GET /rab/realizations
- [ ] Backend API: POST /rab/:id/realizations
- [ ] Backend model & validation

### **FASE 2: Core UI (Week 2)**
- [ ] RealizationTracker main component
- [ ] RAP items table with budget vs actual
- [ ] RealizationInputForm component
- [ ] Document upload functionality
- [ ] Basic variance calculation

### **FASE 3: Detail & Enhancement (Week 3)**
- [ ] RealizationDetailPanel with history
- [ ] RealizationSummary dashboard
- [ ] Variance analysis & alerts
- [ ] Export to Excel/PDF
- [ ] Filters & search

### **FASE 4: Advanced Features (Week 4)**
- [ ] Approval workflow
- [ ] Bulk import dari Excel
- [ ] Advanced reporting
- [ ] Integration with PO/WO
- [ ] Email notifications

---

## 📝 CATATAN PENTING

### **Perbedaan dengan Sistem Milestone:**
- **Milestone**: Track progress pekerjaan fisik (0-100%)
- **Realisasi**: Track pengeluaran actual uang (Rp vs Rp)
- **Keduanya independen** tapi bisa cross-reference

### **Integrasi dengan Sistem Existing:**
1. **RAP** → Source of truth untuk budget
2. **PO/WO** → Bisa auto-generate realisasi
3. **Milestone** → Tetap track progress fisik
4. **Budget Monitoring** → Aggregate dari realisasi

### **Migration Path:**
- Tab "Progres" diubah nama → "Realisasi Belanja"
- Timeline feature di-disable (softcode, bukan dihapus)
- Data existing milestone tetap utuh
- New tab khusus untuk realisasi

---

## 🎯 KPI & SUCCESS METRICS

1. **Accuracy**: Variance < 10% di 80% items
2. **Completeness**: 90% RAP items ada realisasi
3. **Timeliness**: Input realisasi max 7 hari dari transaksi
4. **Documentation**: 100% realisasi ada dokumen pendukung
5. **User Adoption**: 80% project aktif gunakan fitur ini

---

**Dibuat oleh**: AI Assistant  
**Review**: Tim Development  
**Approval**: Project Owner

---

## 🔧 NEXT STEPS

1. **Review** dokumen ini dengan team
2. **Approve** scope dan timeline
3. **Create** database migration scripts
4. **Start** FASE 1 implementation
5. **Setup** daily standup untuk tracking progress

**Questions?** Contact technical lead atau create issue di repository.
