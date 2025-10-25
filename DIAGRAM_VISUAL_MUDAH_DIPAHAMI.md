# 📊 Diagram Visual Sistem Nusantara - Mudah Dipahami

**Versi**: 2.0  
**Tanggal**: 25 Oktober 2025  
**Bahasa**: Indonesia (dengan istilah teknis dalam English)

---

## 📑 Daftar Diagram

1. [Struktur Role & Permission](#diagram-1-struktur-role--permission)
2. [Siklus Proyek Lengkap](#diagram-2-siklus-proyek-lengkap)
3. [Workflow RAB ke Milestone](#diagram-3-workflow-rab-ke-milestone)
4. [Workflow Berita Acara](#diagram-4-workflow-berita-acara)
5. [Workflow Progress Payment](#diagram-5-workflow-progress-payment)
6. [Workflow Purchase Order](#diagram-6-workflow-purchase-order)
7. [Workflow Attendance](#diagram-7-workflow-attendance)
8. [Arsitektur Sistem](#diagram-8-arsitektur-sistem)

---

## Diagram 1: Struktur Role & Permission

### Hierarki Role

```mermaid
graph TD
    Admin[👤 Admin<br/>Full Access]
    
    Admin --> PM[👷 Project Manager<br/>Manage Projects]
    Admin --> Finance[💰 Finance Manager<br/>Manage Finance]
    Admin --> HR[👥 HR Manager<br/>Manage Manpower]
    Admin --> Inv[📦 Inventory Manager<br/>Manage Assets]
    Admin --> Sup[👁️ Supervisor<br/>Monitor & Attendance]
    
    style Admin fill:#e74c3c,color:#fff
    style PM fill:#3498db,color:#fff
    style Finance fill:#27ae60,color:#fff
    style HR fill:#f39c12,color:#fff
    style Inv fill:#9b59b6,color:#fff
    style Sup fill:#95a5a6,color:#fff
```

### Permission Matrix

| Aksi | Admin | PM | Finance | Supervisor | Inv Mgr | HR Mgr |
|------|-------|-----|---------|------------|---------|---------|
| **Create Project** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Approve RAB** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Create BA** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Approve BA** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Approve PO** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Process Payment** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Manage Manpower** | ✅ | 👁️ | 👁️ | 👁️ | ❌ | ✅ |
| **Clock In/Out** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend**: ✅ Full Access | 👁️ Read Only | ❌ No Access

---

## Diagram 2: Siklus Proyek Lengkap

```mermaid
graph TB
    Start([🎬 Mulai Proyek]) --> Step1[1️⃣ PM Membuat Project]
    
    Step1 --> Step2[2️⃣ PM Membuat RAB Items]
    Step2 --> Step3{Admin<br/>Approve RAB?}
    
    Step3 -->|✅ Approve| Step4[3️⃣ RAB Approved]
    Step3 -->|❌ Reject| Step2
    
    Step4 --> Step5[4️⃣ PM Membuat Milestones<br/>dari RAB]
    
    Step5 --> Step6[5️⃣ PM Assign Team<br/>& Start Work]
    
    Step6 --> Step7[6️⃣ Update Progress<br/>0% → 100%]
    
    Step7 --> Step8{Milestone<br/>Complete?}
    Step8 -->|Belum| Step7
    Step8 -->|✅ Ya| Step9[7️⃣ PM Membuat<br/>Berita Acara]
    
    Step9 --> Step10{BA Approved<br/>& Client Sign?}
    Step10 -->|Belum| Step9
    Step10 -->|✅ Ya| Step11[8️⃣ PM Request<br/>Progress Payment]
    
    Step11 --> Step12[9️⃣ Finance Generate<br/>Invoice & Send]
    
    Step12 --> Step13[🔟 Client Bayar]
    
    Step13 --> Step14{Masih Ada<br/>Milestone Lain?}
    Step14 -->|Ya| Step6
    Step14 -->|Tidak| End([✅ Proyek Selesai])
    
    style Start fill:#27ae60,color:#fff
    style End fill:#27ae60,color:#fff
    style Step3 fill:#e74c3c,color:#fff
    style Step10 fill:#e74c3c,color:#fff
    style Step14 fill:#3498db,color:#fff
```

---

## Diagram 3: Workflow RAB ke Milestone

### Proses RAB Approval

```mermaid
stateDiagram-v2
    [*] --> Draft: PM Membuat RAB
    
    Draft --> PendingApproval: PM Submit
    note right of PendingApproval: Notifikasi ke Admin
    
    PendingApproval --> Reviewing: Admin Review
    
    Reviewing --> Approved: Admin Approve ✅
    Reviewing --> Rejected: Admin Reject ❌
    
    Rejected --> Draft: PM Revisi
    note right of Rejected: Feedback dari Admin
    
    Approved --> Locked: RAB Locked
    note right of Locked: Tidak bisa edit lagi
    
    Locked --> [*]
```

### RAB ke Milestone

```mermaid
graph LR
    A[📊 RAB Approved] --> B[🔍 System Analisis<br/>RAB Categories]
    
    B --> C1[Material]
    B --> C2[Upah]
    B --> C3[Alat]
    B --> C4[Overhead]
    B --> C5[Subkon]
    
    C1 --> D[💡 Suggest Milestones]
    C2 --> D
    C3 --> D
    C4 --> D
    C5 --> D
    
    D --> E[👷 PM Creates Milestones<br/>Based on Suggestions]
    
    E --> F[✅ Milestone Created<br/>with Estimated Costs]
    
    style A fill:#27ae60,color:#fff
    style D fill:#f39c12,color:#fff
    style F fill:#3498db,color:#fff
```

---

## Diagram 4: Workflow Berita Acara

```mermaid
stateDiagram-v2
    [*] --> MilestoneComplete: Milestone 100%
    
    MilestoneComplete --> CreateBA: PM Membuat BA
    note right of CreateBA: Link ke Milestone<br/>Upload Foto Bukti
    
    CreateBA --> Draft: BA Draft
    
    Draft --> Submitted: PM Submit BA
    note right of Submitted: Notifikasi ke Admin
    
    Submitted --> PMApprove: PM Approve (Self)
    
    PMApprove --> AdminReview: Admin Review
    
    AdminReview --> AdminApprove: Admin Approve ✅
    AdminReview --> Rejected: Admin Reject ❌
    
    Rejected --> Draft: Revisi BA
    
    AdminApprove --> WaitingClient: Waiting Client Sign
    note right of WaitingClient: Kirim BA ke Client
    
    WaitingClient --> ClientSigned: Client Sign ✍️
    note right of ClientSigned: Digital Signature<br/>QR Code
    
    ClientSigned --> Completed: BA Complete
    note right of Completed: Immutable<br/>Can create Payment
    
    Completed --> [*]
```

### Approval Chain

```mermaid
graph LR
    A[👷 Project Manager] -->|Submit| B[✅ PM Approve]
    B -->|Forward| C[👤 Admin]
    C -->|Approve| D[👥 Client]
    D -->|Sign| E[✅ BA Complete]
    
    style A fill:#3498db,color:#fff
    style C fill:#e74c3c,color:#fff
    style D fill:#9b59b6,color:#fff
    style E fill:#27ae60,color:#fff
```

---

## Diagram 5: Workflow Progress Payment

```mermaid
graph TD
    Start[🎯 BA Client-Signed] --> Step1[1️⃣ PM Request<br/>Progress Payment]
    
    Step1 --> Step2[2️⃣ Input Payment Details<br/>Amount, Terms, Due Date]
    
    Step2 --> Step3[3️⃣ Status: PENDING<br/>⏳ Menunggu Invoice]
    
    Step3 --> Step4[4️⃣ Finance Generate<br/>Invoice PDF 📄]
    
    Step4 --> Step5[5️⃣ Finance Mark as SENT<br/>📤 Upload Bukti Kirim]
    
    Step5 --> Step6[6️⃣ Kirim Invoice ke Client<br/>via Email/Kurir]
    
    Step6 --> Step7[7️⃣ Client Terima Invoice]
    
    Step7 --> Step8[8️⃣ Finance Confirm<br/>Status: CONFIRMED ✅]
    
    Step8 --> Step9[9️⃣ Client Proses<br/>Pembayaran 💰]
    
    Step9 --> Step10[🔟 Finance Upload<br/>Bukti Pembayaran]
    
    Step10 --> Step11[1️⃣1️⃣ Status: PAID ✅<br/>Payment Complete]
    
    Step11 --> Step12[1️⃣2️⃣ Finance Record<br/>Journal Entry]
    
    Step12 --> End([✅ Pembayaran Selesai])
    
    style Start fill:#27ae60,color:#fff
    style Step4 fill:#f39c12,color:#fff
    style Step11 fill:#27ae60,color:#fff
    style End fill:#27ae60,color:#fff
```

### Status Timeline

```mermaid
graph LR
    A[⏳ PENDING] -->|Generate Invoice| B[📤 SENT]
    B -->|Client Acknowledge| C[✅ CONFIRMED]
    C -->|Payment Received| D[💰 PAID]
    
    style A fill:#95a5a6,color:#fff
    style B fill:#3498db,color:#fff
    style C fill:#f39c12,color:#fff
    style D fill:#27ae60,color:#fff
```

---

## Diagram 6: Workflow Purchase Order

```mermaid
graph TB
    Start([🛒 Butuh Material/Service]) --> Step1{Jenis Order?}
    
    Step1 -->|Material| PO[📦 Purchase Order]
    Step1 -->|Service/Subkon| WO[🔧 Work Order]
    
    PO --> Step2
    WO --> Step2
    
    Step2[1️⃣ PM Membuat PO/WO] --> Step3[2️⃣ Input Details<br/>Vendor, Items, Qty, Price]
    
    Step3 --> Step4[3️⃣ Submit for Approval]
    
    Step4 --> Step5{💰 Finance<br/>Review}
    
    Step5 -->|✅ Approve| Step6[4️⃣ PO Approved]
    Step5 -->|❌ Reject| Step3
    
    Step6 --> Step7[5️⃣ Send PO ke Vendor]
    
    Step7 --> Step8[6️⃣ Vendor Kirim Barang]
    
    Step8 --> Step9[7️⃣ Barang Tiba di Site]
    
    Step9 --> Step10[8️⃣ Inventory Manager<br/>Create Delivery Receipt]
    
    Step10 --> Step11[9️⃣ Inspeksi Kualitas<br/>& Kuantitas]
    
    Step11 --> Step12{Inspeksi OK?}
    
    Step12 -->|❌ Reject| Step13[Return to Vendor]
    Step12 -->|✅ Approve| Step14[🔟 Approve DR]
    
    Step13 --> End1([❌ PO Cancelled])
    
    Step14 --> Step15[1️⃣1️⃣ Update PO<br/>Status: COMPLETED]
    
    Step15 --> Step16[1️⃣2️⃣ Finance Process<br/>Payment to Vendor]
    
    Step16 --> End2([✅ PO Complete])
    
    style Start fill:#3498db,color:#fff
    style Step5 fill:#e74c3c,color:#fff
    style Step12 fill:#e74c3c,color:#fff
    style End1 fill:#e74c3c,color:#fff
    style End2 fill:#27ae60,color:#fff
```

### PO Status Flow

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Pending: Submit
    Pending --> Approved: Finance Approve
    Pending --> Rejected: Finance Reject
    Rejected --> Draft: Revise
    Approved --> InProgress: Vendor Process
    InProgress --> Delivered: Goods Delivered
    Delivered --> Completed: DR Approved
    Completed --> [*]
```

---

## Diagram 7: Workflow Attendance

### Daily Clock In/Out

```mermaid
graph TD
    Start([⏰ Waktu Kerja]) --> Step1{Waktu?}
    
    Step1 -->|Pagi| ClockIn[📍 Clock In]
    Step1 -->|Sore| ClockOut[📍 Clock Out]
    
    ClockIn --> Step2[1️⃣ Buka PWA App]
    Step2 --> Step3[2️⃣ Check GPS Location]
    
    Step3 --> Step4{Dalam Radius<br/>Project?}
    
    Step4 -->|❌ No| Error[❌ Error:<br/>Location Invalid]
    Step4 -->|✅ Yes| Step5[3️⃣ Ambil Foto Selfie 📸]
    
    Error --> End1([Tidak Bisa Clock In])
    
    Step5 --> Step6[4️⃣ Submit Clock In]
    
    Step6 --> Step7[✅ Clock In Recorded]
    
    Step7 --> Step8[⏳ Waktu Kerja...]
    
    Step8 --> ClockOut
    
    ClockOut --> Step9[1️⃣ Buka PWA App]
    Step9 --> Step10[2️⃣ Ambil Foto Selfie 📸]
    
    Step10 --> Step11[3️⃣ Submit Clock Out]
    
    Step11 --> Step12[4️⃣ Calculate Hours<br/>& Overtime]
    
    Step12 --> Step13[✅ Clock Out Recorded]
    
    Step13 --> End2([✅ Attendance Complete])
    
    style Start fill:#3498db,color:#fff
    style Step4 fill:#e74c3c,color:#fff
    style Error fill:#e74c3c,color:#fff
    style End1 fill:#e74c3c,color:#fff
    style Step7 fill:#27ae60,color:#fff
    style Step13 fill:#27ae60,color:#fff
    style End2 fill:#27ae60,color:#fff
```

### Leave Request Flow

```mermaid
stateDiagram-v2
    [*] --> CreateRequest: Employee Submit Leave
    
    CreateRequest --> Pending
    note right of Pending: Notifikasi ke Supervisor
    
    Pending --> SupervisorReview: Supervisor Review
    
    SupervisorReview --> Approved: Supervisor Approve ✅
    SupervisorReview --> Rejected: Supervisor Reject ❌
    
    Rejected --> [*]
    note right of Rejected: Employee diberitahu
    
    Approved --> HRReview: Forward to HR
    note right of HRReview: Final Approval
    
    HRReview --> FinalApproved: HR Approve ✅
    HRReview --> FinalRejected: HR Reject ❌
    
    FinalApproved --> [*]
    FinalRejected --> [*]
    
    note right of FinalApproved: Leave granted<br/>Update calendar
```

---

## Diagram 8: Arsitektur Sistem

### Technology Stack

```mermaid
graph TB
    subgraph "Frontend"
        A[React 18]
        B[Tailwind CSS]
        C[PWA Service Worker]
    end
    
    subgraph "Backend"
        D[Node.js + Express]
        E[JWT Auth]
        F[Sequelize ORM]
    end
    
    subgraph "Database"
        G[PostgreSQL 15]
    end
    
    subgraph "External Services"
        H[Firebase FCM<br/>Push Notifications]
        I[Google Maps API<br/>Geocoding]
    end
    
    subgraph "Infrastructure"
        J[Docker Containers]
        K[Nginx Reverse Proxy]
        L[SSL Let's Encrypt]
    end
    
    A --> D
    B --> A
    C --> A
    D --> F
    E --> D
    F --> G
    D --> H
    A --> I
    J --> K
    K --> L
    
    style A fill:#61dafb,color:#000
    style D fill:#68a063,color:#fff
    style G fill:#336791,color:#fff
    style H fill:#ffa000,color:#fff
```

### Deployment Architecture

```mermaid
graph LR
    User[👤 User Browser] -->|HTTPS| Nginx[Nginx<br/>Reverse Proxy]
    
    Nginx --> Frontend[React Frontend<br/>Port 3000]
    Nginx --> Backend[Express Backend<br/>Port 5000]
    
    Backend --> DB[(PostgreSQL<br/>Database)]
    Backend --> Redis[(Redis<br/>Cache)]
    Backend --> Storage[File Storage<br/>uploads/]
    
    Backend --> FCM[Firebase FCM]
    FCM --> Device[📱 User Device<br/>Push Notification]
    
    style User fill:#3498db,color:#fff
    style Nginx fill:#27ae60,color:#fff
    style Frontend fill:#61dafb,color:#000
    style Backend fill:#68a063,color:#fff
    style DB fill:#336791,color:#fff
```

### Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database
    participant N as Notification
    
    U->>F: Login Request
    F->>B: POST /api/auth/login
    B->>D: Verify Credentials
    D-->>B: User Data
    B-->>F: JWT Token
    F-->>U: Login Success
    
    U->>F: Create RAB
    F->>B: POST /api/projects/:id/rab
    B->>D: Insert RAB Data
    D-->>B: RAB Created
    B->>N: Send Notification to Admin
    N-->>Admin: Push Notification
    B-->>F: Success Response
    F-->>U: RAB Created
```

---

## 📊 Ringkasan Modul

### Modul Utama (10 Modul)

```mermaid
mindmap
  root((Nusantara<br/>System))
    Proyek
      Projects
      RAB/BOQ
      Milestones
      Team
    Dokumentasi
      Berita Acara
      Progress Payment
      Documents
    Procurement
      Purchase Orders
      Work Orders
      Delivery Receipts
    Keuangan
      Transactions
      COA
      Journals
      Tax
    SDM
      Manpower
      Attendance
      Leave Requests
    Assets
      Fixed Assets
      Maintenance
    Multi Company
      Subsidiaries
    Approval
      Workflows
      Notifications
    Analytics
      Dashboard
      Reports
```

---

## 🎯 Quick Reference: Siapa Bisa Apa?

### Admin = Full Control ✅

```
✅ Approve semua workflow (RAB, BA, PO, Payment)
✅ Create/Edit/Delete semua data
✅ Manage users & subsidiaries
✅ View semua reports
✅ System settings
```

### Project Manager = Project Focus 👷

```
✅ Manage projects (Create, Edit)
✅ Create RAB → Submit untuk approval
✅ Create Milestones
✅ Create Berita Acara → Submit untuk approval
✅ Request Progress Payment
✅ Create PO/WO → Submit untuk approval
❌ Tidak bisa approve apapun
❌ Tidak bisa manage users
```

### Finance Manager = Money Focus 💰

```
✅ Approve PO/WO
✅ Process payments
✅ Generate invoices
✅ Manage COA & journals
✅ Financial reports
❌ Tidak bisa create projects
❌ Tidak bisa create RAB/BA
```

### Supervisor = Monitor Only 👁️

```
✅ View projects & reports
✅ Clock in/out attendance
✅ Approve leave requests (team)
❌ Tidak bisa create/edit apapun
❌ Tidak bisa approve workflows
```

### Inventory Manager = Asset Focus 📦

```
✅ Manage fixed assets
✅ Receive & inspect deliveries
✅ Create delivery receipts
❌ TIDAK ADA stock management
❌ TIDAK ADA material inventory
```

### HR Manager = Manpower Focus 👥

```
✅ Manage employee data (manpower)
✅ View attendance reports
✅ Approve leave requests
❌ TIDAK ADA payroll
❌ TIDAK ADA recruitment
❌ TIDAK ADA training
```

---

## 🔗 Hubungan Antar Modul

```mermaid
graph TD
    Project[📁 Project] --> RAB[📊 RAB]
    RAB --> Milestone[📋 Milestone]
    Milestone --> BA[📝 Berita Acara]
    BA --> Payment[💰 Progress Payment]
    Payment --> Invoice[🧾 Invoice]
    Invoice --> Transaction[💵 Finance Transaction]
    Transaction --> Journal[📖 Journal Entry]
    
    Project --> PO[🛒 Purchase Order]
    PO --> DR[📦 Delivery Receipt]
    DR --> Transaction
    
    Project --> Team[👥 Project Team]
    Team --> Manpower[👷 Manpower]
    Manpower --> Attendance[⏰ Attendance]
    Attendance --> Leave[📅 Leave Request]
    
    Project --> Sub[🏢 Subsidiary]
    Sub --> COA[💳 Chart of Accounts]
    COA --> Journal
    
    style Project fill:#3498db,color:#fff
    style BA fill:#e74c3c,color:#fff
    style Payment fill:#27ae60,color:#fff
    style Transaction fill:#f39c12,color:#fff
```

---

## 📱 PWA Features

### What is PWA?

```mermaid
graph LR
    A[📱 Progressive Web App] --> B[Install di Home Screen]
    A --> C[Works Offline]
    A --> D[Push Notifications]
    A --> E[Access Camera/GPS]
    A --> F[Fast Loading]
    
    style A fill:#5e35b1,color:#fff
    style B fill:#43a047,color:#fff
    style C fill:#1e88e5,color:#fff
    style D fill:#fb8c00,color:#fff
    style E fill:#e53935,color:#fff
    style F fill:#00acc1,color:#fff
```

### Use Cases

- ✅ **Attendance**: Clock in/out di lapangan tanpa buka browser
- ✅ **Notifications**: Terima notifikasi approval real-time
- ✅ **Offline**: View data meski internet lemah
- ✅ **Quick Access**: Buka app dari home screen

---

## ✅ Checklist untuk Pengguna Baru

### Untuk Admin:

- [ ] Login pertama kali
- [ ] Create subsidiary (jika multi-company)
- [ ] Setup Chart of Accounts
- [ ] Create users (PM, Finance, dll)
- [ ] Assign roles & permissions
- [ ] Configure attendance settings
- [ ] Test notification system

### Untuk Project Manager:

- [ ] Login & update profile
- [ ] Familiarisasi dengan dashboard
- [ ] Create project pertama
- [ ] Create RAB items
- [ ] Submit RAB untuk approval
- [ ] Create milestones setelah RAB approved
- [ ] Install PWA untuk attendance

### Untuk Finance Manager:

- [ ] Login & update profile
- [ ] Review Chart of Accounts
- [ ] Test PO approval workflow
- [ ] Practice generate invoice
- [ ] Familiarisasi dengan financial reports

---

**© 2025 Nusantara Group**  
**Dokumentasi ini akurat sesuai implementasi sistem aktual**  
**Untuk pertanyaan, hubungi Admin sistem**
