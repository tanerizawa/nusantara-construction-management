# 📋 Best Practice: Payment & Invoice Lifecycle Management

## 🎯 Konsep Dasar

### Payment-Centric Approach
**Payment adalah source of truth**, Invoice adalah dokumen turunan.

```
Payment Lifecycle:
┌─────────────────┐
│ BA Approved     │ → BA disetujui client
└────────┬────────┘
         ↓
┌─────────────────┐
│ Payment Request │ → Status: pending_approval
│ Created         │ → Waiting: Finance approval
└────────┬────────┘
         ↓ [Finance Approve]
┌─────────────────┐
│ Payment Approved│ → Status: approved
│ Invoice Generated│ → Invoice Number assigned
└────────┬────────┘
         ↓ [Print & Send Hardcopy]
┌─────────────────┐
│ Invoice Sent    │ → Status: invoice_sent
│ (Hardcopy)      │ → Evidence: Bukti kirim, penerima
└────────┬────────┘
         ↓ [Wait for Transfer]
         ↓ [Receive Payment]
┌─────────────────┐
│ Payment Received│ → Status: paid
│ (Completed)     │ → Evidence: Bukti transfer, receipt
└─────────────────┘
```

---

## 🔄 Status Workflow

### Status Enum (Backend)
```javascript
status: {
  type: DataTypes.ENUM(
    'pending_approval',  // Menunggu approval finance
    'approved',          // Approved, invoice generated
    'invoice_sent',      // Invoice hardcopy sudah dikirim
    'paid',              // Payment diterima
    'overdue',           // Lewat due date, belum paid
    'cancelled'          // Dibatalkan
  )
}
```

### Status Mapping (Frontend)

| Backend Status | Display Label | Color | Meaning |
|----------------|---------------|-------|---------|
| `pending_approval` | Pending Approval | 🟡 Kuning | Menunggu approval finance |
| `approved` | Invoice Generated | 🔵 Biru | Invoice siap dicetak & dikirim |
| `invoice_sent` | Invoice Sent | 🟠 Orange | Hardcopy terkirim, tunggu bayar |
| `paid` | Paid | 🟢 Hijau | Payment diterima & complete |
| `overdue` | Overdue | 🔴 Merah | Lewat due date, belum dibayar |
| `cancelled` | Cancelled | ⚫ Abu-abu | Dibatalkan |

---

## 📝 Action Flow dengan Konfirmasi

### **Action 1: Approve Payment** (Finance)
```
Tab: Progress Payments
Current Status: pending_approval
  ↓
[Klik Approve Button]
  ↓
Modal Konfirmasi:
  ✓ Approve payment?
  📝 Notes (optional)
  ↓
Backend: Update status → approved
Backend: Generate invoice_number
Backend: Set invoice_date = today
Backend: Add to status_history
  ↓
Success Alert:
  "✅ Payment approved!
   Invoice: INV-2025-001
   Silahkan download & cetak invoice"
```

### **Action 2: Send Invoice** (Admin/Staff)
```
Tab: Invoice Management
Current Status: approved (Invoice Generated)
  ↓
[Download PDF] → Print → TTD + Stempel
  ↓
[Klik "Mark as Sent" Button]
  ↓
Modal Konfirmasi:
  📋 Invoice sudah dikirim?
  👤 Diterima oleh: [Input nama]
  📅 Tanggal kirim: [Today]
  📦 Metode: [Kurir/Pos/Langsung]
  📄 Upload bukti kirim (optional): [File]
  📝 Catatan: [Text area]
  ↓
Backend: Update status → invoice_sent
Backend: Set invoice_sent_at = input date
Backend: Set invoice_recipient = nama
Backend: Set delivery_method = metode
Backend: Upload delivery_evidence
Backend: Add to status_history
  ↓
Success Alert:
  "✅ Invoice ditandai sebagai terkirim!
   Diterima: [Nama]
   Tanggal: [Date]
   
   Status monitoring:
   • Jatuh tempo: [Due Date]
   • Sisa waktu: X hari"
```

### **Action 3: Receive Payment** (Finance)
```
Tab: Progress Payments OR Invoice Management
Current Status: invoice_sent
  ↓
[Klik "Mark as Paid" Button]
  ↓
Modal Konfirmasi:
  ✅ Konfirmasi pembayaran diterima?
  💰 Jumlah diterima: [Auto-fill from invoice]
  📅 Tanggal terima: [Date picker]
  🏦 Bank: [Select]
  📄 Upload bukti transfer: [File] *Required*
  📝 Reference/No. Rek: [Text]
  📝 Catatan: [Text area]
  ↓
Backend: Validate bukti transfer exists
Backend: Update status → paid
Backend: Set paid_at = input date
Backend: Set payment_evidence = file
Backend: Set payment_reference = ref
Backend: Add to status_history
Backend: Send notification to stakeholders
  ↓
Success Alert:
  "✅ Payment berhasil dikonfirmasi!
   
   Details:
   • Invoice: [Number]
   • Jumlah: [Amount]
   • Tanggal: [Date]
   • Status: LUNAS ✓
   
   Bukti transfer tersimpan."
```

---

## 🗃️ Database Schema Enhancement

### **1. Add Status History Table**
```sql
CREATE TABLE payment_status_history (
  id UUID PRIMARY KEY,
  payment_id UUID REFERENCES progress_payments(id),
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_by VARCHAR(255),
  changed_at TIMESTAMP,
  notes TEXT,
  evidence_file VARCHAR(500),
  metadata JSON,
  created_at TIMESTAMP
);
```

### **2. Add Evidence Fields to ProgressPayment**
```javascript
// Invoice delivery evidence
deliveryMethod: ENUM('courier', 'post', 'hand_delivery', 'other'),
deliveryEvidence: VARCHAR(500), // File path
deliveryNotes: TEXT,

// Payment receipt evidence
paymentEvidence: VARCHAR(500), // File path bukti transfer
paymentReference: VARCHAR(255), // No. rekening/reference
paymentReceivedBank: VARCHAR(100),
```

---

## 🎨 UI Components

### **Tab 1: Progress Payments**

**Display Columns:**
```
| Payment No | BA | Amount | Status | Due Date | Actions |
|------------|----|---------|---------| ---------|---------|
| PAY-001    | BA-001 | 50M | 🟡 Pending | 30 days | [Approve] [Reject] |
| PAY-002    | BA-002 | 75M | 🔵 Generated | 25 days | [View Invoice] |
| PAY-003    | BA-003 | 100M | 🟠 Sent | 15 days | [Mark Paid] |
| PAY-004    | BA-004 | 60M | 🟢 Paid | - | [View] |
| PAY-005    | BA-005 | 80M | 🔴 Overdue | -5 days | [Reminder] [Mark Paid] |
```

**Action Buttons by Status:**
```javascript
pending_approval: [👁️ View] [✅ Approve] [❌ Reject]
approved:         [👁️ View] [📄 View Invoice]
invoice_sent:     [👁️ View] [💰 Mark as Paid]
paid:             [👁️ View] [📊 Details]
overdue:          [👁️ View] [📧 Send Reminder] [💰 Mark as Paid]
```

### **Tab 2: Invoice Management**

**Display Columns:**
```
| Invoice No | Payment | Amount | Status | Due Date | Actions |
|------------|---------|---------|---------|----------|---------|
| INV-001    | PAY-002 | 50M | 🔵 Generated | 30 days | [🖨️ Print] |
| INV-002    | PAY-003 | 75M | 🟠 Sent | 15 days | [👁️ View] [📄 Details] |
| INV-003    | PAY-004 | 100M | 🟢 Paid | - | [👁️ View] [📊 History] |
| INV-004    | PAY-005 | 60M | 🔴 Overdue | -5 days | [📧 Reminder] |
```

**Action Buttons by Status:**
```javascript
generated:    [👁️ View] [🖨️ Download PDF] [✉️ Mark as Sent]
invoice_sent: [👁️ View] [🖨️ Download PDF] [💰 Confirm Payment]
paid:         [👁️ View] [🖨️ Download PDF] [📊 Payment History]
overdue:      [👁️ View] [🖨️ Download PDF] [📧 Send Reminder] [💰 Confirm Payment]
```

---

## 📊 Status Tracking Dashboard

### **Summary Cards**
```javascript
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Total Invoices  │ │ Pending Payment │ │ Total Received  │
│     15          │ │      8          │ │   Rp 500M       │
│  Rp 1.5B        │ │   Rp 800M       │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Overdue         │ │ Due in 7 Days   │ │ Collection Rate │
│      3          │ │      2          │ │      85%        │
│  Rp 200M        │ │   Rp 150M       │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### **Timeline View**
```
Invoice INV-2025-001 Timeline:

2025-01-15  ✅ Payment Created
            └─ By: Admin
            └─ Amount: Rp 50,000,000

2025-01-16  ✅ Payment Approved
            └─ By: Finance Manager
            └─ Notes: Approved by budget holder

2025-01-16  ✅ Invoice Generated
            └─ Invoice No: INV-2025-001
            └─ Due Date: 2025-02-15

2025-01-18  ✅ Invoice Sent
            └─ By: Staff Admin
            └─ Received by: Bpk. Budi (Client)
            └─ Method: Courier (JNE)
            └─ Evidence: [📎 delivery_proof.jpg]

2025-02-10  ⏳ Waiting Payment
            └─ Days remaining: 5 days

2025-02-12  ✅ Payment Received
            └─ By: Finance Team
            └─ Amount: Rp 50,000,000
            └─ Bank: Bank Mandiri
            └─ Reference: TRF2025021200123
            └─ Evidence: [📎 transfer_proof.pdf]
            └─ Status: LUNAS ✓
```

---

## 🔔 Notification & Reminder

### **Auto Notifications**
```javascript
// When status changes
- Payment Approved → Notify: Admin (to print invoice)
- Invoice Sent → Notify: Finance (tracking)
- Payment Received → Notify: PM, Client, Accounting

// Reminders
- 7 days before due → Reminder to client
- On due date → Reminder + flag
- 3 days overdue → Escalation to manager
- 7 days overdue → Final warning
```

---

## 📱 Modal Konfirmasi Examples

### **Modal: Mark Invoice as Sent**
```
┌──────────────────────────────────────────┐
│  📦 Konfirmasi Pengiriman Invoice        │
├──────────────────────────────────────────┤
│                                          │
│  Invoice: INV-2025-001                   │
│  Amount: Rp 50,000,000                   │
│                                          │
│  ✓ Invoice sudah dicetak & ditandatangani│
│  ✓ Stempel sudah dibubuhkan              │
│  ✓ Hardcopy siap dikirim                 │
│                                          │
│  📋 Detail Pengiriman:                   │
│  ┌────────────────────────────────────┐ │
│  │ Diterima oleh: [_______________]   │ │
│  │                                    │ │
│  │ Tanggal kirim:                     │ │
│  │ [📅 13/10/2025  ]                 │ │
│  │                                    │ │
│  │ Metode pengiriman:                 │ │
│  │ ◉ Kurir (JNE/JNT/dll)            │ │
│  │ ○ Pos Indonesia                    │ │
│  │ ○ Diantar langsung                 │ │
│  │ ○ Lainnya                          │ │
│  │                                    │ │
│  │ Upload bukti kirim (optional):     │ │
│  │ [📎 Choose File... ] No file       │ │
│  │                                    │ │
│  │ Catatan:                           │ │
│  │ ┌──────────────────────────────┐ │ │
│  │ │ Invoice dikirim via JNE      │ │ │
│  │ │ No. Resi: JNE12345           │ │ │
│  │ │                              │ │ │
│  │ └──────────────────────────────┘ │ │
│  └────────────────────────────────────┘ │
│                                          │
│         [❌ Batal]      [✅ Konfirmasi]  │
└──────────────────────────────────────────┘
```

### **Modal: Confirm Payment Received**
```
┌──────────────────────────────────────────┐
│  💰 Konfirmasi Pembayaran Diterima       │
├──────────────────────────────────────────┤
│                                          │
│  Invoice: INV-2025-001                   │
│  Amount: Rp 50,000,000                   │
│  Due Date: 15 Feb 2025                   │
│                                          │
│  📋 Detail Pembayaran:                   │
│  ┌────────────────────────────────────┐ │
│  │ Jumlah diterima: *                 │ │
│  │ Rp [50,000,000__] ✓ Match          │ │
│  │                                    │ │
│  │ Tanggal terima: *                  │ │
│  │ [📅 12/02/2025  ]                 │ │
│  │                                    │ │
│  │ Bank penerima: *                   │ │
│  │ [▼ Bank Mandiri    ]              │ │
│  │                                    │ │
│  │ No. Referensi/Rekening:            │ │
│  │ [TRF2025021200123_______________]  │ │
│  │                                    │ │
│  │ Upload bukti transfer: *           │ │
│  │ [📎 transfer_proof.pdf ] ✓        │ │
│  │                                    │ │
│  │ Catatan:                           │ │
│  │ ┌──────────────────────────────┐ │ │
│  │ │ Transfer diterima full amount │ │ │
│  │ │                              │ │ │
│  │ └──────────────────────────────┘ │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ⚠️ * = Required field                   │
│                                          │
│         [❌ Batal]      [✅ Konfirmasi]  │
└──────────────────────────────────────────┘
```

---

## 🔐 Security & Validation

### **Validation Rules**
```javascript
// Mark as Sent
- recipientName: Required, min 3 chars
- sentDate: Required, cannot be future date
- deliveryMethod: Required

// Mark as Paid
- paidAmount: Required, must match invoice amount
- paidDate: Required, cannot be before invoice_sent_at
- bank: Required
- paymentEvidence: Required (file upload)
- File types: PDF, JPG, PNG only
- Max file size: 5MB
```

### **Permission Matrix**
```
Role              | Approve Payment | Send Invoice | Confirm Payment |
------------------|-----------------|--------------|-----------------|
Super Admin       |       ✓         |      ✓       |       ✓        |
Finance Manager   |       ✓         |      ✗       |       ✓        |
Project Manager   |       ✗         |      ✗       |       ✗        |
Admin Staff       |       ✗         |      ✓       |       ✗        |
Accountant        |       ✗         |      ✗       |       ✓        |
```

---

## 📈 Reporting & Analytics

### **Reports Available**
1. **Payment Aging Report** - Umur piutang
2. **Collection Report** - Tingkat penagihan
3. **Overdue Analysis** - Analisis keterlambatan
4. **Cash Flow Forecast** - Proyeksi cash flow
5. **Audit Trail Report** - Histori perubahan status

---

Ini adalah best practice yang comprehensive untuk construction management system! 🎉
