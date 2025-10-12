# 📸 UI Screenshots & Visual Guide

## Quick Actions - Before & After

### Before Implementation ❌
```
┌─────────────────────────────┐
│    QUICK ACTIONS            │
├─────────────────────────────┤
│                             │
│  📊 Create RAB         ✅   │
│  📝 Create PO          ✅   │
│  ✓  Add Approval       ✅   │
│  👥 Assign Team        ✅   │
│                             │
│  🗂️  Project Files     ❌   │  ← Tidak berfungsi
│  📈 Generate Report    ❌   │  ← Tidak berfungsi
│                             │
└─────────────────────────────┘
```

### After Implementation ✅
```
┌─────────────────────────────┐
│    QUICK ACTIONS            │
├─────────────────────────────┤
│                             │
│  📊 Create RAB         ✅   │
│  📝 Create PO          ✅   │
│  ✓  Add Approval       ✅   │
│  👥 Assign Team        ✅   │
│                             │
│  🗂️  Project Files     ✅   │  ← FIXED! Opens Documents
│  📈 Generate Report    ✅   │  ← NEW! Opens Modal
│                             │
└─────────────────────────────┘
```

---

## Report Generator Modal - Full UI

### Initial State (No Selection)
```
╔═══════════════════════════════════════════════════════════╗
║ Generate Report                                       [X] ║
║ Project: Pembangunan Jalan Kalimantan 2025               ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║ Pilih Jenis Report                                        ║
║                                                           ║
║ ╔════════════════════╗  ╔════════════════════╗          ║
║ ║  💰                ║  ║  📈                ║          ║
║ ║  Project Cost      ║  ║  Profitability     ║          ║
║ ║  Analysis          ║  ║  Analysis          ║          ║
║ ║                    ║  ║                    ║          ║
║ ║  Analisis detail   ║  ║  Analisis profit   ║          ║
║ ║  breakdown biaya   ║  ║  dan margin        ║          ║
║ ╚════════════════════╝  ╚════════════════════╝          ║
║                                                           ║
║ ╔════════════════════╗  ╔════════════════════╗          ║
║ ║  📊                ║  ║  🔧                ║          ║
║ ║  Budget Variance   ║  ║  Resource          ║          ║
║ ║  Report            ║  ║  Utilization       ║          ║
║ ║                    ║  ║                    ║          ║
║ ║  Perbandingan      ║  ║  Penggunaan        ║          ║
║ ║  budget vs aktual  ║  ║  resource          ║          ║
║ ╚════════════════════╝  ╚════════════════════╝          ║
║                                                           ║
║ ╔════════════════════╗                                   ║
║ ║  📄                ║                                   ║
║ ║  Executive         ║                                   ║
║ ║  Summary           ║                                   ║
║ ║                    ║                                   ║
║ ║  Ringkasan untuk   ║                                   ║
║ ║  management        ║                                   ║
║ ╚════════════════════╝                                   ║
║                                                           ║
║ 📅 Periode (Opsional)                                    ║
║ ╔══════════════╗  ╔══════════════╗                      ║
║ ║ Tanggal Mulai║  ║ Tanggal Selesai║                    ║
║ ║              ║  ║                ║                    ║
║ ╚══════════════╝  ╚══════════════╝                      ║
║                                                           ║
║                                                           ║
║   ┌─────────────┐  ┌────────────────────────┐          ║
║   │    Batal    │  │  📊 Generate Report    │          ║
║   └─────────────┘  └────────────────────────┘          ║
║                       (Disabled - No selection)          ║
╚═══════════════════════════════════════════════════════════╝
```

### With Selection (Cost Analysis Selected)
```
╔═══════════════════════════════════════════════════════════╗
║ Generate Report                                       [X] ║
║ Project: Pembangunan Jalan Kalimantan 2025               ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║ Pilih Jenis Report                                        ║
║                                                           ║
║ ╔════════════════════╗  ╔════════════════════╗          ║
║ ║  💰          ● ✓   ║  ║  📈                ║          ║
║ ║  Project Cost      ║  ║  Profitability     ║          ║
║ ║  Analysis          ║  ║  Analysis          ║          ║
║ ║                    ║  ║                    ║          ║
║ ║  Analisis detail   ║  ║  Analisis profit   ║          ║
║ ║  breakdown biaya   ║  ║  dan margin        ║          ║
║ ╚════════════════════╝  ╚════════════════════╝          ║
║   ↑ SELECTED (Blue border + indicator)                   ║
║                                                           ║
║ ╔════════════════════╗  ╔════════════════════╗          ║
║ ║  📊                ║  ║  🔧                ║          ║
║ ║  Budget Variance   ║  ║  Resource          ║          ║
║ ║  Report            ║  ║  Utilization       ║          ║
║ ╚════════════════════╝  ╚════════════════════╝          ║
║                                                           ║
║ ╔════════════════════╗                                   ║
║ ║  📄                ║                                   ║
║ ║  Executive Summary ║                                   ║
║ ╚════════════════════╝                                   ║
║                                                           ║
║ 📅 Periode (Opsional)                                    ║
║ ╔══════════════╗  ╔══════════════╗                      ║
║ ║ 2025-01-01   ║  ║ 2025-10-11   ║                      ║
║ ╚══════════════╝  ╚══════════════╝                      ║
║                                                           ║
║ ╔═══════════════════════════════════════════════════╗   ║
║ ║ ℹ️  Akan generate: Project Cost Analysis          ║   ║
║ ║    Report akan berisi analisis detail breakdown   ║   ║
║ ║    biaya proyek untuk periode 2025-01-01 sampai   ║   ║
║ ║    2025-10-11                                      ║   ║
║ ╚═══════════════════════════════════════════════════╝   ║
║                                                           ║
║   ┌─────────────┐  ┌────────────────────────┐          ║
║   │    Batal    │  │  📊 Generate Report    │          ║
║   └─────────────┘  └────────────────────────┘          ║
║                       (Now ENABLED - Blue button)        ║
╚═══════════════════════════════════════════════════════════╝
```

### Loading State (Generating...)
```
╔═══════════════════════════════════════════════════════════╗
║ Generate Report                                       [X] ║
║ Project: Pembangunan Jalan Kalimantan 2025               ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║ Pilih Jenis Report                                        ║
║                                                           ║
║ ╔════════════════════╗  (Cards remain visible)           ║
║ ║  💰          ● ✓   ║                                   ║
║ ║  Project Cost      ║                                   ║
║ ║  Analysis          ║                                   ║
║ ╚════════════════════╝                                   ║
║                                                           ║
║ ... (other cards) ...                                     ║
║                                                           ║
║ 📅 Periode: 2025-01-01 to 2025-10-11                     ║
║                                                           ║
║ ╔═══════════════════════════════════════════════════╗   ║
║ ║ ℹ️  Akan generate: Project Cost Analysis          ║   ║
║ ╚═══════════════════════════════════════════════════╝   ║
║                                                           ║
║   ┌─────────────┐  ┌────────────────────────┐          ║
║   │    Batal    │  │  ⭕ Generating...       │          ║
║   └─────────────┘  └────────────────────────┘          ║
║                       (Spinner animation + disabled)     ║
╚═══════════════════════════════════════════════════════════╝
```

### Report Preview (After Generation)
```
╔═══════════════════════════════════════════════════════════╗
║ Generate Report                                       [X] ║
║ Project: Pembangunan Jalan Kalimantan 2025               ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║ Project Cost Analysis            [Generate Ulang]         ║
║ Generated on Oct 11, 2025 10:30:45 AM                    ║
║                                                           ║
║ ╔═══════════════════════════════════════════════════╗   ║
║ ║ {                                                  ║   ║
║ ║   "projectId": "2025PJK001",                       ║   ║
║ ║   "projectName": "Pembangunan Jalan Kalimantan",  ║   ║
║ ║   "period": {                                      ║   ║
║ ║     "startDate": "2025-01-01",                     ║   ║
║ ║     "endDate": "2025-10-11"                        ║   ║
║ ║   },                                               ║   ║
║ ║   "costAnalysis": {                                ║   ║
║ ║     "totalBudget": 5000000000,                     ║   ║
║ ║     "totalActual": 3250000000,                     ║   ║
║ ║     "variance": 1750000000,                        ║   ║
║ ║     "variancePercentage": 35.0,                    ║   ║
║ ║     "breakdown": {                                 ║   ║
║ ║       "material": {                                ║   ║
║ ║         "budget": 2000000000,                      ║   ║
║ ║         "actual": 1500000000,                      ║   ║
║ ║         "variance": 500000000                      ║   ║
║ ║       },                                           ║   ║
║ ║       "labor": {                                   ║   ║
║ ║         "budget": 1500000000,                      ║   ║
║ ║         "actual": 1000000000,                      ║   ║
║ ║         "variance": 500000000                      ║   ║
║ ║       },                                           ║   ║
║ ║       "equipment": {                               ║   ║
║ ║         "budget": 1000000000,                      ║   ║
║ ║         "actual": 500000000,                       ║   ║
║ ║         "variance": 500000000                      ║   ║
║ ║       },                                           ║   ║
║ ║       "overhead": {                                ║   ║
║ ║         "budget": 500000000,                       ║   ║
║ ║         "actual": 250000000,                       ║   ║
║ ║         "variance": 250000000                      ║   ║
║ ║       }                                            ║   ║
║ ║     },                                             ║   ║
║ ║     "status": "under_budget",                      ║   ║
║ ║     "recommendation": "Project is under budget..." ║   ║
║ ║   }                                                ║   ║
║ ║ }                                                  ║   ║
║ ╚═══════════════════════════════════════════════════╝   ║
║                   ↑ Scrollable JSON preview              ║
║                                                           ║
║   ┌─────────────┐  ┌────────────────────────┐          ║
║   │    Tutup    │  │  ⬇️ Download Report     │          ║
║   └─────────────┘  └────────────────────────┘          ║
║                       (Green button - ready to download) ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Color Scheme (iOS Dark Theme)

### Report Type Cards Colors
```
💰 Project Cost Analysis
   ┌──────────────┐
   │ Icon: #0A84FF (Blue)
   │ Background: #0A84FF20 (20% opacity)
   └──────────────┘

📈 Profitability Analysis
   ┌──────────────┐
   │ Icon: #30D158 (Green)
   │ Background: #30D15820
   └──────────────┘

📊 Budget Variance Report
   ┌──────────────┐
   │ Icon: #FFD60A (Yellow)
   │ Background: #FFD60A20
   └──────────────┘

🔧 Resource Utilization
   ┌──────────────┐
   │ Icon: #BF5AF2 (Purple)
   │ Background: #BF5AF220
   └──────────────┘

📄 Executive Summary
   ┌──────────────┐
   │ Icon: #FF453A (Red)
   │ Background: #FF453A20
   └──────────────┘
```

### UI Elements
```
Background Colors:
- Modal: Gradient from #1C1C1E to #2C2C2E
- Cards: #2C2C2E
- Input fields: #2C2C2E

Border Colors:
- Default: #38383A
- Hover: #48484A
- Selected: #0A84FF
- Focus ring: #0A84FF (2px)

Text Colors:
- Primary: #FFFFFF
- Secondary: #8E8E93

Button Colors:
- Primary (Generate): #0A84FF
- Success (Download): #30D158
- Cancel: #2C2C2E
- Disabled: #38383A

State Colors:
- Info box: #0A84FF/10 background, #0A84FF/30 border
- Error box: #FF453A/10 background, #FF453A/30 border
```

---

## Interactive States

### Card Hover Effect
```
Normal:
┌────────────────────┐
│ border: #38383A    │
│ bg: #2C2C2E        │
└────────────────────┘

Hover:
┌────────────────────┐
│ border: #48484A    │  ← Lighter border
│ bg: #2C2C2E        │
│ cursor: pointer    │
└────────────────────┘

Selected:
┌────────────────────┐
│ border: #0A84FF    │  ← Blue border (2px)
│ bg: #0A84FF/10     │  ← Blue tint
│    ● ✓             │  ← Blue indicator dot
└────────────────────┘
```

### Button States
```
Generate Report Button:

Disabled (No selection):
┌──────────────────────┐
│ bg: #38383A          │
│ text: #8E8E93        │
│ cursor: not-allowed  │
└──────────────────────┘

Enabled:
┌──────────────────────┐
│ bg: #0A84FF          │  ← Blue
│ text: #FFFFFF        │
│ cursor: pointer      │
└──────────────────────┘

Hover:
┌──────────────────────┐
│ bg: #0A84FF/90       │  ← Slightly darker
│ text: #FFFFFF        │
└──────────────────────┘

Loading:
┌──────────────────────┐
│ ⭕ Generating...     │  ← Spinner
│ bg: #0A84FF          │
│ cursor: wait         │
└──────────────────────┘
```

---

## Responsive Behavior

### Desktop (1280px+)
```
┌───────────────────────────────────────┐
│ Report cards: 2 columns                │
│ ┌─────────┐  ┌─────────┐             │
│ │ Card 1  │  │ Card 2  │             │
│ └─────────┘  └─────────┘             │
│ ┌─────────┐  ┌─────────┐             │
│ │ Card 3  │  │ Card 4  │             │
│ └─────────┘  └─────────┘             │
│ ┌─────────┐                           │
│ │ Card 5  │                           │
│ └─────────┘                           │
│                                        │
│ Date range: 2 columns                  │
│ ┌──────────┐  ┌──────────┐           │
│ │ Start    │  │ End      │           │
│ └──────────┘  └──────────┘           │
└───────────────────────────────────────┘
```

### Tablet (768px - 1279px)
```
┌────────────────────────────┐
│ Report cards: 2 columns     │
│ ┌──────┐  ┌──────┐         │
│ │ Card │  │ Card │         │
│ └──────┘  └──────┘         │
│                             │
│ Date range: 2 columns       │
│ ┌─────┐  ┌─────┐           │
│ │Start│  │ End │           │
│ └─────┘  └─────┘           │
└────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────┐
│ Report cards:    │
│ 1 column         │
│ ┌──────────────┐ │
│ │   Card 1     │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │   Card 2     │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │   Card 3     │ │
│ └──────────────┘ │
│                  │
│ Date range:      │
│ 1 column         │
│ ┌──────────────┐ │
│ │ Start Date   │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ End Date     │ │
│ └──────────────┘ │
└──────────────────┘
```

---

## Animation & Transitions

### Modal Open
```
1. Backdrop fades in (200ms)
2. Modal scales from 0.95 to 1.0 (300ms)
3. Content fades in (200ms)
```

### Card Selection
```
1. Border color change (150ms)
2. Background color change (150ms)
3. Indicator dot appears (100ms)
```

### Button Hover
```
1. Background color transition (200ms)
2. Transform scale 1.0 → 1.02 (150ms)
```

### Loading Spinner
```
⭕ Continuous rotation (1s linear infinite)
```

---

## Accessibility Features

### Keyboard Navigation
```
✅ Tab to navigate between elements
✅ Enter/Space to select cards
✅ Esc to close modal
✅ Tab order: Cards → Date inputs → Buttons
```

### Screen Reader Support
```
✅ ARIA labels on buttons
✅ ARIA roles on modal
✅ ARIA live regions for status updates
✅ Descriptive alt text
```

### Focus Indicators
```
✅ Blue focus ring (2px) on all interactive elements
✅ Visible focus state on all buttons
✅ Focus trap within modal
```

---

## User Flow Diagram

```
┌─────────────────────────────────────────┐
│         PROJECT DETAIL PAGE             │
│                                         │
│  Sidebar                Main Content    │
│  ┌──────────┐          ┌────────────┐  │
│  │Quick     │          │ Overview   │  │
│  │Actions   │          │ Tab        │  │
│  │          │          └────────────┘  │
│  │ [Files]  │                          │
│  │ [Report] │←─ Click here             │
│  └──────────┘                          │
└─────────────────────────────────────────┘
            ↓
            ↓ Modal opens
            ↓
┌─────────────────────────────────────────┐
│      REPORT GENERATOR MODAL             │
│                                         │
│  1. Select report type (required)       │
│     ┌───┐ ┌───┐ ┌───┐                  │
│     │ ✓ │ │   │ │   │                  │
│     └───┘ └───┘ └───┘                  │
│                                         │
│  2. Choose date range (optional)        │
│     [Start Date] [End Date]             │
│                                         │
│  3. Review selection                    │
│     ℹ️ Will generate: Cost Analysis     │
│                                         │
│  4. Generate                            │
│     [Cancel] [Generate Report] ←─Click  │
└─────────────────────────────────────────┘
            ↓
            ↓ API call
            ↓
┌─────────────────────────────────────────┐
│      LOADING STATE                      │
│                                         │
│  ⭕ Generating report...                │
│                                         │
│  Please wait...                         │
└─────────────────────────────────────────┘
            ↓
            ↓ Data received
            ↓
┌─────────────────────────────────────────┐
│      REPORT PREVIEW                     │
│                                         │
│  Cost Analysis Report                   │
│  Generated: Oct 11, 2025                │
│                                         │
│  ┌────────────────────────────────────┐│
│  │ JSON data preview (scrollable)     ││
│  │ { ... }                            ││
│  └────────────────────────────────────┘│
│                                         │
│  [Close] [Download Report] ←─Download   │
└─────────────────────────────────────────┘
            ↓
            ↓ Download
            ↓
      File saved to disk! ✅
```

---

**Visual Documentation Complete**  
*Ready for development team reference*
