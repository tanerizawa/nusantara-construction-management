# 🚀 Panduan Cepat Penggunaan Sistem - Per Role

**Versi**: 2.0  
**Tanggal**: 25 Oktober 2025  
**Untuk**: Pengguna Harian Sistem Nusantara

---

## 📑 Daftar Isi

1. [Panduan Admin](#-panduan-admin)
2. [Panduan Project Manager](#-panduan-project-manager)
3. [Panduan Finance Manager](#-panduan-finance-manager)
4. [Panduan Supervisor](#-panduan-supervisor)
5. [Panduan Inventory Manager](#-panduan-inventory-manager)
6. [Panduan HR Manager](#-panduan-hr-manager)
7. [FAQ Umum](#-faq-umum)

---

## 👤 Panduan Admin

### Login
```
URL: https://nusantaragroup.co
Username: admin
Password: [hubungi IT]
```

### Dashboard Pertama Kali

Setelah login, Anda akan melihat:
- 📊 Total projects (active, completed, on hold)
- 💰 Financial overview (income, expenses, profit)
- 👥 Team overview
- ⏰ Recent activities
- 🔔 Pending approvals (RAB, BA, PO yang perlu di-approve)

### Task Harian

#### ✅ Morning Routine (30 menit)

1. **Check Pending Approvals**
   ```
   Dashboard → Notifications → Lihat pending approvals
   ```
   
   **Yang Perlu Di-Approve**:
   - RAB (Rencana Anggaran Biaya)
   - Berita Acara
   - Purchase Orders
   - Work Orders
   - Progress Payments

2. **Review Projects**
   ```
   Menu → Manajemen Proyek → Lihat status semua proyek
   ```
   - Cek proyek yang delay
   - Cek budget utilization
   - Cek milestones yang tertunda

3. **Check Financial Reports**
   ```
   Menu → Keuangan → Dashboard Keuangan
   ```
   - Cash flow hari ini
   - Outstanding payments
   - Recent transactions

#### 📋 Approval RAB (5-10 menit per RAB)

**Step by Step**:

1. Klik notifikasi "RAB Pending Approval" atau ke:
   ```
   Dashboard → Pending Approvals → RAB
   ```

2. Review RAB details:
   - Project name
   - Total amount
   - Items (material, upah, alat, overhead, subkon)
   - Created by (Project Manager)

3. Cek detail setiap item:
   - Quantity masuk akal?
   - Unit price wajar?
   - Category sudah benar?
   - Total calculation sudah benar?

4. Keputusan:
   - ✅ **Approve**: Klik tombol "Approve RAB"
   - ❌ **Reject**: Klik "Reject" → Tulis alasan → Submit

5. Setelah approve:
   - RAB status berubah "Approved"
   - PM dapat membuat milestones
   - PM mendapat notifikasi

#### 📝 Approval Berita Acara (10-15 menit per BA)

**Step by Step**:

1. Klik notifikasi "BA Pending Approval" atau ke:
   ```
   Dashboard → Pending Approvals → Berita Acara
   ```

2. Review BA details:
   - Project & milestone terkait
   - Progress completion (harus 100%)
   - Photos/documentation
   - PM approval status (harus sudah approved)

3. Verify:
   - Milestone benar-benar complete?
   - Documentation lengkap?
   - Sesuai dengan RAB?

4. Keputusan:
   - ✅ **Approve**: Klik "Approve BA"
   - ❌ **Reject**: Klik "Reject" → Tulis feedback → Submit

5. Setelah approve:
   - BA dikirim ke client untuk signature
   - Setelah client sign → PM bisa request payment

#### 🛒 Approval Purchase Order (5-10 menit per PO)

**Step by Step**:

1. Klik notifikasi "PO Pending Approval" atau ke:
   ```
   Dashboard → Pending Approvals → Purchase Orders
   ```

2. Review PO details:
   - Vendor information
   - Items & quantities
   - Unit prices & total amount
   - Project linked
   - Budget availability

3. Finance Manager review (jika sudah approve Finance, Admin tinggal final approval)

4. Verify:
   - Harga vendor wajar?
   - Ada budget?
   - Vendor terpercaya?

5. Keputusan:
   - ✅ **Approve**: Klik "Approve PO"
   - ❌ **Reject**: Klik "Reject" → Tulis alasan → Submit

6. Setelah approve:
   - PO dikirim ke vendor
   - Status "Approved" → "Sent to Vendor"

### Task Mingguan

#### 📊 Weekly Review (Setiap Jumat Sore, 1-2 jam)

1. **Project Performance**
   ```
   Analytics → Project Reports
   ```
   - Proyek mana yang on track?
   - Proyek mana yang delay?
   - Action plan untuk proyek bermasalah

2. **Financial Health**
   ```
   Analytics → Financial Reports
   ```
   - Weekly cash flow
   - Profit margin per project
   - Outstanding receivables

3. **Team Performance**
   ```
   SDM → Attendance Reports
   ```
   - Attendance rate
   - Overtime hours
   - Leave requests

4. **System Health**
   ```
   Operations → System Dashboard
   ```
   - Active users
   - System errors (jika ada)
   - Backup status

### Tips & Tricks untuk Admin

✅ **Do's**:
- Approve RAB dalam 1-2 hari kerja (jangan biarkan PM tunggu terlalu lama)
- Review BA dengan teliti sebelum approve (ini bukti pembayaran!)
- Check budget availability sebelum approve PO
- Regular backup system (otomatis, tapi pastikan berjalan)
- Monitor notification system (pastikan semua role terima notif)

❌ **Don'ts**:
- Jangan approve RAB tanpa review detail
- Jangan approve BA tanpa dokumentasi lengkap
- Jangan approve PO over budget tanpa justifikasi
- Jangan hapus data tanpa backup
- Jangan share password admin

### Troubleshooting Umum

**Problem**: Tidak bisa approve RAB  
**Solution**: 
- Cek RAB status harus "pending_approval"
- Cek user role Anda (harus admin)
- Refresh browser

**Problem**: Notifikasi tidak muncul  
**Solution**:
- Check notification settings (Settings → Notifications)
- Allow browser notifications
- Check FCM token registration

**Problem**: Report tidak muncul  
**Solution**:
- Check date range filter
- Check subsidiary filter (jika multi-subsidiary)
- Refresh page

---

## 👷 Panduan Project Manager

### Login
```
URL: https://nusantaragroup.co
Username: [username PM Anda]
Password: [password Anda]
```

### Dashboard PM

Yang Anda lihat:
- 📁 Your projects (projects yang Anda manage)
- ⏰ Upcoming milestones
- 📋 Pending tasks
- 🔔 Notifications (RAB approved/rejected, BA status, dll)

### Workflow Lengkap: Dari Create Project sampai Payment

#### 📁 Step 1: Create Project (15-30 menit)

1. Klik menu **Manajemen Proyek** → **Create Project**

2. Isi form:
   ```
   Nama Project: [nama proyek]
   Client: [nama client]
   Subsidiary: [pilih subsidiary]
   Contract Value: [nilai kontrak]
   Start Date: [tanggal mulai]
   End Date: [estimasi selesai]
   Location: [lokasi proyek]
   GPS Coordinates: [klik "Cari Lokasi" untuk auto-fill]
   Description: [deskripsi singkat]
   ```

3. Klik **Save Project**

4. Project created! Status: "Planning"

#### 📊 Step 2: Create RAB (1-2 jam)

**RAB = Rencana Anggaran Biaya / Bill of Quantities (BOQ)**

1. Buka project → Tab **RAB**

2. Ada 2 cara input RAB:

   **Cara 1: Single Input** (untuk item sedikit)
   ```
   Klik "Add RAB Item"
   
   Form:
   - Category: Material / Upah / Alat / Overhead / Subkon
   - Description: [nama item, misal: Semen Portland 50kg]
   - Quantity: [jumlah]
   - Unit: [satuan, misal: sak]
   - Unit Price: [harga per unit]
   - Item Type: Borongan / Mandor (jika category = Upah)
   - Notes: [catatan optional]
   
   Klik "Save"
   ```

   **Cara 2: Bulk Input** (untuk banyak item)
   ```
   Klik "Bulk Input"
   
   Paste data dari Excel (format CSV):
   category,description,quantity,unit,unitPrice,itemType
   Material,Semen Portland,100,sak,65000,
   Upah,Tukang Batu,10,hari,150000,borongan
   Alat,Molen,1,unit,500000,
   
   Klik "Import"
   ```

3. System akan auto-calculate:
   - Total per item = quantity × unit price
   - Subtotal per category
   - Grand total

4. Review semua items

5. Klik **Submit for Approval** → RAB dikirim ke Admin

6. **Tunggu Admin Approval** (biasanya 1-2 hari kerja)
   - Anda akan dapat notifikasi: "RAB Approved" atau "RAB Rejected"
   - Jika rejected → revisi → submit lagi

#### 📋 Step 3: Create Milestones (30 menit - 1 jam)

**Setelah RAB Approved**:

1. Buka project → Tab **Milestones**

2. System akan auto-suggest milestones berdasarkan RAB categories:
   ```
   Klik "Suggest Milestones from RAB"
   
   System akan generate suggestions:
   - Milestone 1: Pekerjaan Persiapan (Overhead + Alat)
   - Milestone 2: Pekerjaan Material (Material)
   - Milestone 3: Pekerjaan Upah (Upah)
   - Milestone 4: Pekerjaan Subkon (Subkon)
   ```

3. Atau create manual:
   ```
   Klik "Add Milestone"
   
   Form:
   - Title: [nama milestone, misal: Pekerjaan Pondasi]
   - Description: [deskripsi detail]
   - Start Date: [tanggal mulai]
   - End Date: [target selesai]
   - Estimated Cost: [biaya estimasi, bisa dari RAB]
   - Assigned To: [assign ke user lain, optional]
   - Status: Planned
   - Progress: 0%
   
   Klik "Save"
   ```

4. Milestone created!

#### ⚙️ Step 4: Execute & Update Progress (Daily/Weekly)

1. Buka project → Tab **Milestones**

2. Klik milestone yang sedang dikerjakan

3. Update progress:
   ```
   Progress: [geser slider 0-100%]
   Status: In Progress
   Notes: [update apa yang sudah dikerjakan]
   Photos: [upload foto progress]
   
   Klik "Save"
   ```

4. Update secara berkala:
   - **Daily**: Jika proyek cepat
   - **Weekly**: Jika proyek panjang
   - **Major changes**: Upload foto bukti

5. Saat progress mencapai **100%**:
   ```
   Progress: 100%
   Status: Completed
   Completion Date: [tanggal selesai]
   Final Photos: [upload foto final]
   
   Klik "Mark as Complete"
   ```

#### 📝 Step 5: Create Berita Acara (30 menit)

**Setelah Milestone Complete**:

1. Buka project → Tab **Berita Acara**

2. Klik **Create BA**

3. Form:
   ```
   Milestone: [pilih milestone yang sudah complete]
   BA Number: [auto-generated, misal: BA/001/2025]
   BA Date: [tanggal BA]
   Work Description: [deskripsi pekerjaan yang selesai]
   Completion Percentage: [dari milestone, biasanya 100%]
   Amount: [nilai BA, dari milestone estimated cost]
   Photos: [upload min. 3-5 foto bukti pekerjaan]
   Notes: [catatan tambahan]
   ```

4. Klik **Save as Draft**

5. Review BA dengan teliti

6. Klik **Submit BA** → BA dikirim untuk approval

7. **Approval Chain BA**:
   ```
   1. PM Approve (Anda sendiri) ✅
      ↓
   2. Admin Review & Approve
      ↓
   3. Client Sign (digital signature)
      ↓
   4. BA Complete ✅
   ```

8. **Tunggu Approval** (2-5 hari kerja)
   - PM approve: Otomatis atau manual
   - Admin approve: Tunggu notifikasi
   - Client sign: Forward BA ke client

#### 💰 Step 6: Request Progress Payment (15 menit)

**Setelah BA Client-Signed**:

1. Buka project → Tab **Progress Payment**

2. Klik **Create Payment Request**

3. Form:
   ```
   Berita Acara: [pilih BA yang sudah client-signed]
   Payment Number: [auto-generated]
   Amount: [nilai dari BA]
   Payment Terms: [termin pembayaran, misal: Net 30]
   Due Date: [kapan harus dibayar]
   Notes: [catatan untuk finance/client]
   ```

4. Klik **Submit Payment Request**

5. **Finance Manager akan**:
   - Generate invoice PDF
   - Send invoice ke client
   - Upload bukti pengiriman
   - Konfirmasi pembayaran saat client bayar

6. **Anda akan dapat notifikasi** saat:
   - Invoice generated
   - Invoice sent to client
   - Payment confirmed
   - Payment received

7. Status payment akan berubah:
   ```
   Pending → Sent → Confirmed → Paid ✅
   ```

#### 🔄 Repeat untuk Milestone Berikutnya

```
Step 4: Execute Milestone 2
   ↓
Step 5: Create BA 2
   ↓
Step 6: Request Payment 2
   ↓
... sampai semua milestones complete
   ↓
Project Completed! 🎉
```

### Fitur Tambahan untuk PM

#### 🛒 Create Purchase Order (PO)

**Kapan perlu PO?**  
Ketika butuh material/equipment dari vendor

1. Menu **Purchase Orders** → **Create PO**

2. Form:
   ```
   PO Type: Purchase Order (material) / Work Order (subkon)
   Project: [pilih project]
   Vendor Name: [nama vendor]
   Vendor Contact: [nomor HP/email]
   
   Items:
   - Description: [nama barang/jasa]
   - Quantity: [jumlah]
   - Unit: [satuan]
   - Unit Price: [harga per unit]
   - Total: [auto-calculate]
   
   Add more items...
   
   Notes: [catatan untuk vendor]
   Expected Delivery: [kapan barang harus tiba]
   ```

3. Klik **Submit for Approval**

4. **Tunggu Finance Manager Approval**

5. Setelah approved → PO dikirim ke vendor

6. Saat barang tiba → **Inventory Manager** akan:
   - Create Delivery Receipt
   - Inspect barang
   - Approve receipt

#### 👥 Manage Project Team

1. Buka project → Tab **Team**

2. **Add Team Member**:
   ```
   Klik "Add Member"
   
   Form:
   - Employee: [pilih dari daftar manpower]
   - Role: [role di project ini, misal: Foreman, Tukang, dll]
   - Join Date: [tanggal bergabung]
   
   Klik "Add"
   ```

3. **Remove Team Member**:
   ```
   Klik "Remove" pada member yang mau dihapus
   Confirm
   ```

4. View team attendance & performance

### Tips & Tricks untuk PM

✅ **Do's**:
- Create RAB se-detail mungkin (jangan nanti revisi terus)
- Update progress milestone secara berkala (jangan lupa!)
- Upload foto bukti pekerjaan yang jelas
- Submit BA sesegera mungkin setelah milestone complete
- Komunikasi dengan Admin jika RAB/BA rejected

❌ **Don'ts**:
- Jangan submit RAB yang belum complete
- Jangan create BA sebelum milestone 100%
- Jangan request payment sebelum BA client-signed
- Jangan create PO over budget tanpa koordinasi

### Troubleshooting PM

**Problem**: Tidak bisa create milestone  
**Solution**: RAB harus approved dulu

**Problem**: Tidak bisa submit BA  
**Solution**: Milestone harus 100% complete

**Problem**: Tidak bisa request payment  
**Solution**: BA harus sudah client-signed

---

## 💰 Panduan Finance Manager

### Login
```
URL: https://nusantaragroup.co
Username: [username Finance]
Password: [password Anda]
```

### Dashboard Finance

Yang Anda lihat:
- 💵 Cash flow overview
- 📊 Financial metrics (income, expenses, profit)
- 🛒 Pending PO approvals
- 💰 Pending payments
- 📈 Recent transactions

### Daily Tasks

#### ✅ Morning Routine (30-45 menit)

1. **Check Pending PO Approvals**
   ```
   Dashboard → Pending Approvals → Purchase Orders
   ```
   
2. **Review Payment Requests**
   ```
   Dashboard → Progress Payments → Status: Pending
   ```

3. **Check Bank Accounts**
   - Incoming payments
   - Outstanding invoices
   - Cash balance

#### 🛒 Approve Purchase Order (10 menit per PO)

**Step by Step**:

1. Klik notifikasi "PO Pending Approval"

2. Review PO details:
   ```
   Check:
   - Project budget availability
   - Vendor terpercaya?
   - Harga wajar?
   - Items sesuai kebutuhan project?
   - Total amount masuk akal?
   ```

3. Verify budget:
   ```
   Buka project → Tab Budget
   
   Check:
   - Allocated budget: Rp 100,000,000
   - Spent to date: Rp 60,000,000
   - This PO: Rp 15,000,000
   - Remaining: Rp 25,000,000 ✅
   
   Budget OK? → Approve
   Budget over? → Reject atau minta approval admin
   ```

4. Keputusan:
   - ✅ **Approve**: Klik "Approve PO"
   - ❌ **Reject**: Klik "Reject" → Tulis reason → Submit

5. Setelah approve:
   - PO sent to vendor
   - Track delivery

#### 💰 Process Progress Payment (20-30 menit per payment)

**Step by Step**:

1. **Payment Request Received**
   ```
   Dashboard → Progress Payments → Pending
   ```

2. **Verify Payment**:
   ```
   Check:
   - BA sudah client-signed? ✅
   - Amount sesuai BA? ✅
   - Payment terms OK? ✅
   - No pending issues? ✅
   ```

3. **Generate Invoice**:
   ```
   Klik payment → "Generate Invoice"
   
   Invoice akan include:
   - Project details
   - BA reference
   - Amount
   - Payment terms
   - Due date
   - Company details
   - Bank account
   
   Klik "Generate PDF"
   ```

4. **Send Invoice to Client**:
   ```
   Option 1: Email
   - Klik "Send via Email"
   - Input client email
   - Attach invoice PDF
   - Send
   
   Option 2: Courier/Hand Delivery
   - Download invoice PDF
   - Print & send via courier
   ```

5. **Mark as Sent**:
   ```
   Klik "Mark as Sent"
   Upload bukti pengiriman (optional):
   - Screenshot email sent
   - Foto resi courier
   - Foto bukti serah terima
   
   Status: Pending → Sent ✅
   ```

6. **Wait for Client Confirmation**

7. **Client Confirms Receipt**:
   ```
   Klik "Confirm Receipt"
   Status: Sent → Confirmed ✅
   ```

8. **Payment Received from Client**:
   ```
   Klik "Record Payment"
   
   Form:
   - Payment Date: [tanggal terima]
   - Payment Method: [transfer, cek, cash]
   - Bank Account: [rekening mana yang terima]
   - Amount: [jumlah yang diterima]
   - Upload bukti: [screenshot transfer, foto cek]
   
   Klik "Save"
   
   Status: Confirmed → Paid ✅
   ```

9. **Create Journal Entry** (otomatis atau manual):
   ```
   Debit: Bank Account [amount]
   Credit: Revenue [amount]
   
   Reference: Payment #XXX - Project ABC
   ```

#### 📊 Financial Reporting (Weekly)

1. **Generate Reports**:
   ```
   Menu Analytics → Financial Reports
   
   Reports available:
   - Cash Flow Statement
   - Profit & Loss
   - Balance Sheet
   - Budget vs Actual
   - Tax Summary
   ```

2. **Review Financial Health**:
   ```
   Check:
   - Cash balance positive? ✅
   - No overdue payments?
   - Profit margin healthy? (min. 15-20%)
   - Budget utilization per project
   ```

3. **Export Reports**:
   ```
   Klik "Export" → Choose format:
   - PDF (untuk print/present)
   - Excel (untuk analisis)
   - CSV (untuk import ke sistem lain)
   ```

### Tips Finance Manager

✅ **Do's**:
- Approve PO dalam 1-2 hari (jangan tunda proyek)
- Generate invoice segera setelah BA signed
- Follow up outstanding payments
- Maintain accurate records
- Regular reconciliation

❌ **Don'ts**:
- Jangan approve PO over budget tanpa justifikasi
- Jangan delay invoice generation
- Jangan lupa record semua payments
- Jangan skip journal entries

---

## 👁️ Panduan Supervisor

### Login & Dashboard

```
URL: https://nusantaragroup.co
Username: [username Anda]
Password: [password Anda]
```

Dashboard Supervisor:
- 📊 Projects overview (view only)
- 👥 Team attendance
- 📋 Pending leave requests
- ⏰ Your attendance history

### Daily Tasks

#### ⏰ Clock In/Out (5 menit)

**Morning - Clock In**:

1. Buka PWA app (jika sudah install) atau buka browser

2. Menu **Attendance** → **Clock In**

3. System check GPS location:
   ```
   ✅ Location valid (dalam radius project)
   ❌ Location invalid (diluar radius)
   ```

4. Jika valid → Ambil foto selfie 📸

5. Klik **Submit Clock In**

6. ✅ Clock in recorded!

**Evening - Clock Out**:

1. Menu **Attendance** → **Clock Out**

2. Ambil foto selfie 📸

3. Klik **Submit Clock Out**

4. System calculate:
   - Total hours worked
   - Overtime (if any)
   - Late/early status

5. ✅ Clock out recorded!

#### 📋 Approve Leave Requests (5 menit per request)

1. Dashboard → **Leave Requests** → **Pending**

2. Review request:
   ```
   Employee: [nama]
   Leave Type: Sick / Annual / Emergency
   Date: [tanggal cuti]
   Duration: [berapa hari]
   Reason: [alasan]
   ```

3. Keputusan:
   - ✅ **Approve**: Klik "Approve"
   - ❌ **Reject**: Klik "Reject" → Tulis reason

4. Request forwarded to HR for final approval

### Tips Supervisor

✅ **Do's**:
- Clock in/out tepat waktu
- Review leave requests dengan adil
- Report jika ada masalah attendance

❌ **Don'ts**:
- Jangan lupa clock in/out
- Jangan approve leave requests tanpa pertimbangan

---

## 📦 Panduan Inventory Manager

### Login & Dashboard

Dashboard:
- 📦 Fixed assets overview
- 🚚 Pending deliveries
- 🔧 Maintenance due
- 📋 Delivery receipts

### Tasks

#### 🚚 Receive Delivery (30 menit per delivery)

**When**: Vendor kirim barang sesuai PO

1. **Check Delivery**:
   ```
   - Ada PO reference?
   - Barang sesuai PO?
   - Quantity benar?
   - Kondisi barang?
   ```

2. **Create Delivery Receipt**:
   ```
   Menu Purchase Orders → Find PO → "Create DR"
   
   Form:
   - PO Reference: [auto-filled]
   - Delivery Date: [tanggal terima]
   - Items: [cek satu per satu]
   - Quantity Received: [input actual quantity]
   - Condition: Good / Damaged
   - Photos: [ambil foto barang]
   - Inspector: [nama Anda]
   
   Klik "Save"
   ```

3. **Inspect Quality**:
   ```
   Check:
   - Sesuai spesifikasi?
   - Tidak rusak?
   - Quantity match?
   
   Status: Pass / Fail
   ```

4. **Approve or Reject**:
   - ✅ **Approve**: Barang OK → Klik "Approve DR"
   - ❌ **Reject**: Barang rusak/salah → Klik "Reject DR" → Return to vendor

5. After approve:
   - PO status updated
   - Finance process payment to vendor

#### 🔧 Manage Fixed Assets

**Add New Asset**:
```
Menu Assets → "Add Asset"

Form:
- Asset Name: [nama asset, misal: Excavator]
- Category: [Equipment, Vehicle, Tool]
- Acquisition Date: [tanggal beli]
- Cost: [harga beli]
- Location: [dimana asset sekarang]
- Status: Available / In Use / Maintenance

Klik "Save"
```

**Track Asset Maintenance**:
```
Open asset → "Record Maintenance"

Form:
- Maintenance Date
- Type: Routine / Repair
- Cost
- Notes

Klik "Save"
```

### Tips Inventory Manager

✅ **Do's**:
- Inspect semua deliveries dengan teliti
- Take photos sebagai bukti
- Update asset status secara berkala
- Schedule regular maintenance

❌ **Don'ts**:
- Jangan approve delivery tanpa inspect
- Jangan terima barang rusak
- Jangan lupa record maintenance

---

## 👥 Panduan HR Manager

### Login & Dashboard

Dashboard:
- 👥 Total employees
- ⏰ Attendance overview
- 📋 Leave requests
- 📊 Manpower utilization

### Tasks

#### 👷 Manage Employee Data

**Add New Employee**:
```
Menu SDM → "Add Employee"

Form:
- Full Name
- ID Number (KTP)
- Position
- Current Project (optional)
- Contact (phone, email)
- Join Date
- Status: Active / Inactive

Klik "Save"
```

**Link to User Account** (jika employee perlu login):
```
Buka employee → "Link User Account"

Select user dari daftar users
Klik "Link"

Sekarang employee bisa login dan data terhubung
```

#### ⏰ View Attendance Reports

```
Menu Attendance → "Reports"

Filter:
- Date range
- Employee
- Project

Report shows:
- Daily attendance
- Total hours
- Overtime
- Late/absent days
- Leave taken

Export: PDF / Excel
```

#### 📋 Approve Leave Requests

**Final Approval** (after supervisor approve):

1. Dashboard → **Leave Requests** → **Pending HR**

2. Review:
   ```
   - Supervisor sudah approve? ✅
   - Leave balance mencukupi?
   - Tidak bentrok dengan jadwal penting?
   ```

3. Keputusan:
   - ✅ **Approve**: Final approval ✅
   - ❌ **Reject**: Tulis reason

4. Employee notified

### Tips HR Manager

✅ **Do's**:
- Update employee data regularly
- Monitor attendance trends
- Fair leave approval
- Regular attendance reports

❌ **Don'ts**:
- Jangan approve leave tanpa cek balance
- Jangan lupa update employee status
- Jangan delay leave approval

---

## ❓ FAQ Umum

### Login & Access

**Q: Lupa password, gimana?**  
A: Hubungi admin untuk reset password

**Q: Tidak bisa login?**  
A: 
- Check username & password
- Check internet connection
- Clear browser cache
- Hubungi admin

**Q: Role saya salah?**  
A: Hubungi admin untuk update role

### Notifications

**Q: Tidak terima notifikasi?**  
A:
- Check Settings → Notifications → Enable
- Allow browser notifications
- Check FCM token (admin can check)

**Q: Notifikasi terlalu banyak?**  
A: Settings → Notifications → Customize preferences

### Approval

**Q: Berapa lama approval biasanya?**  
A:
- RAB: 1-2 hari kerja
- BA: 2-5 hari kerja (include client sign)
- PO: 1-2 hari kerja

**Q: Approval ditolak, kenapa?**  
A: Check rejection reason dari approver, revisi sesuai feedback

### Technical Issues

**Q: Page tidak load?**  
A:
- Refresh browser (Ctrl+F5)
- Clear cache
- Check internet
- Hubungi IT support

**Q: File tidak bisa upload?**  
A:
- Check file size (max 10MB)
- Check file type (PDF, JPG, PNG allowed)
- Try different browser

**Q: Report tidak keluar?**  
A:
- Check date range
- Check filters
- Try export to PDF/Excel

### PWA

**Q: Cara install PWA?**  
A: 
**Android**: Browser menu → "Add to Home Screen"  
**iOS**: Share button → "Add to Home Screen"

**Q: PWA tidak bisa clock in?**  
A:
- Check GPS permission
- Check location accuracy
- Must be within project radius

**Q: Camera tidak jalan?**  
A: Allow camera permission in browser settings

---

## 🆘 Kontak Support

**Technical Support**:
- Admin: [hubungi admin sistem]
- IT Support: [hubungi IT team]

**Training**:
- Request training session: Hubungi admin

**Feedback & Suggestions**:
- Kirim feedback: Settings → Send Feedback

---

**© 2025 Nusantara Group**  
**Happy working! 🚀**
