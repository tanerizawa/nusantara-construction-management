# 🔄 Milestone Workflow - Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MILESTONE AUTO-SUGGESTION WORKFLOW                     │
└─────────────────────────────────────────────────────────────────────────┘

                                START
                                  │
                                  ▼
                ┌─────────────────────────────────┐
                │  User creates Purchase Orders   │
                │  (linked to RAB items)          │
                └────────────┬────────────────────┘
                             │
                             ▼
                ┌─────────────────────────────────┐
                │  Supplier delivers materials    │
                │  to site                        │
                └────────────┬────────────────────┘
                             │
                             ▼
                ┌─────────────────────────────────┐
                │  User creates Delivery Receipt  │
                │  (Tanda Terima)                 │
                │  Status: 'received'             │
                └────────────┬────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────────────┐
        │                                                │
        │  🤖 AUTO-SUGGESTION TRIGGERS                  │
        │                                                │
        │  User clicks "Suggest Milestones" button      │
        │  API: GET /milestones/suggest                 │
        │                                                │
        └────────────┬───────────────────────────────────┘
                     │
                     ▼
    ┌────────────────────────────────────────────────────┐
    │                                                    │
    │  STEP 1: Query Database                           │
    │  ─────────────────────                            │
    │                                                    │
    │  SELECT po.*, dr.*                                │
    │  FROM purchase_orders po                          │
    │  JOIN delivery_receipts dr                        │
    │    ON dr.purchase_order_id = po.po_number         │
    │  WHERE po.project_id = '2025PJK001'               │
    │    AND dr.status = 'received'                     │
    │                                                    │
    │  Result: List of POs with received materials      │
    │                                                    │
    └────────────┬───────────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────────────┐
    │                                                    │
    │  STEP 2: Extract RAB Items                        │
    │  ───────────────────────                          │
    │                                                    │
    │  For each PO:                                     │
    │    Parse items JSONB field                        │
    │    Extract inventoryId (RAB item UUID)            │
    │    Build mapping:                                 │
    │      RAB_ID → [PO-001, PO-005, ...]              │
    │                                                    │
    │  Result: List of RAB item IDs                     │
    │                                                    │
    └────────────┬───────────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────────────┐
    │                                                    │
    │  STEP 3: Get Categories                           │
    │  ────────────────────                             │
    │                                                    │
    │  SELECT id, category, pekerjaan, description      │
    │  FROM rab_items                                   │
    │  WHERE id = ANY(rab_item_ids)                     │
    │                                                    │
    │  Result: RAB items with categories                │
    │                                                    │
    └────────────┬───────────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────────────┐
    │                                                    │
    │  STEP 4: Group by Category                        │
    │  ───────────────────────────                      │
    │                                                    │
    │  Category: "Pekerjaan Persiapan"                  │
    │    ├── RAB Items: [Urugan, Pasir, Semen]         │
    │    ├── POs: [PO-001, PO-005]                      │
    │    ├── Total Value: Rp 50.000.000                 │
    │    └── Earliest Received: 2025-10-13              │
    │                                                    │
    │  Category: "Pekerjaan Struktur"                   │
    │    ├── RAB Items: [Besi, Beton]                   │
    │    ├── POs: [PO-002]                              │
    │    ├── Total Value: Rp 200.000.000                │
    │    └── Earliest Received: 2025-10-15              │
    │                                                    │
    └────────────┬───────────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────────────┐
    │                                                    │
    │  STEP 5: Check Existing Milestones                │
    │  ────────────────────────────────                 │
    │                                                    │
    │  SELECT category_link->>'category_name'           │
    │  FROM project_milestones                          │
    │  WHERE projectId = '2025PJK001'                   │
    │    AND category_link->>'enabled' = 'true'         │
    │                                                    │
    │  Existing: ["Pekerjaan Struktur"]                 │
    │                                                    │
    │  Filter out: Skip "Pekerjaan Struktur"            │
    │                                                    │
    └────────────┬───────────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────────────┐
    │                                                    │
    │  STEP 6: Generate Suggestions                     │
    │  ──────────────────────────                       │
    │                                                    │
    │  For each NEW category:                           │
    │                                                    │
    │    Calculate:                                     │
    │      - Duration = value / 50M IDR = X weeks       │
    │      - Start = earliest receipt date              │
    │      - End = start + duration                     │
    │                                                    │
    │    Build suggestion object:                       │
    │      - Title: "Category - Fase 1"                 │
    │      - Description: Auto-generated                │
    │      - Timeline: Calculated dates                 │
    │      - Metadata: PO count, materials, value       │
    │                                                    │
    └────────────┬───────────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────────────┐
    │                                                    │
    │  RESULT: Suggestion Array                         │
    │  ──────────────────────                           │
    │                                                    │
    │  [                                                │
    │    {                                              │
    │      category: "Pekerjaan Persiapan",            │
    │      title: "Pekerjaan Persiapan - Fase 1",      │
    │      poCount: 2,                                  │
    │      poNumbers: ["PO-001", "PO-005"],            │
    │      totalValue: 50000000,                        │
    │      readyToStart: true,                          │
    │      suggestedStartDate: "2025-10-13",           │
    │      materials: [ ... ]                           │
    │    }                                              │
    │  ]                                                │
    │                                                    │
    └────────────┬───────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────────┐
        │                                        │
        │  User Reviews Suggestions in UI        │
        │                                        │
        │  ┌──────────────────────────────────┐ │
        │  │ Suggestion 1:                    │ │
        │  │ Pekerjaan Persiapan - Fase 1     │ │
        │  │ POs: PO-001, PO-005              │ │
        │  │ Value: Rp 50.000.000             │ │
        │  │ [Create Milestone] [Skip]        │ │
        │  └──────────────────────────────────┘ │
        │                                        │
        └────────────┬───────────────────────────┘
                     │
                     ▼
            ┌────────────────────┐
            │  User clicks       │
            │  "Create Milestone"│
            └────────┬───────────┘
                     │
                     ▼
    ┌────────────────────────────────────────────┐
    │                                            │
    │  POST /api/projects/:id/milestones        │
    │                                            │
    │  Body:                                     │
    │  {                                         │
    │    title: "Pekerjaan Persiapan - Fase 1", │
    │    targetDate: "2025-10-20",              │
    │    category_link: {                        │
    │      enabled: true,                        │
    │      category_name: "Pekerjaan Persiapan",│
    │      po_numbers: ["PO-001", "PO-005"]     │
    │    },                                      │
    │    ...                                     │
    │  }                                         │
    │                                            │
    └────────────┬───────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────┐
    │                                            │
    │  Milestone Created in Database             │
    │  ────────────────────────────              │
    │                                            │
    │  project_milestones table:                 │
    │    - id: UUID                              │
    │    - projectId: 2025PJK001                 │
    │    - title: "Pekerjaan Persiapan - Fase 1"│
    │    - status: 'pending'                     │
    │    - progress: 0%                          │
    │    - category_link: JSONB with POs         │
    │                                            │
    └────────────┬───────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────┐
    │                                            │
    │  Milestone Tracking Begins                 │
    │  ──────────────────────────                │
    │                                            │
    │  Stage 1: Materials ✅ (100%)              │
    │    - All POs have receipts                 │
    │                                            │
    │  Stage 2: Work Execution ⏳ (0%)           │
    │    - Waiting for Berita Acara              │
    │                                            │
    │  Stage 3: BA Documentation ⏳ (0%)         │
    │    - Not yet created                       │
    │                                            │
    │  Stage 4: Payment ⏳ (0%)                  │
    │    - Pending completion                    │
    │                                            │
    │  Overall Progress: 20%                     │
    │                                            │
    └────────────┬───────────────────────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │                        │
        │  Work Starts!          │
        │  Team uses materials   │
        │  Creates Berita Acara  │
        │  Progress updates      │
        │                        │
        └────────────────────────┘
                 │
                 ▼
              SUCCESS!


═══════════════════════════════════════════════════════════════

                      KEY BENEFITS

1. ✅ AUTOMATED
   - No manual milestone creation
   - Data-driven suggestions
   - Reduces human error

2. ✅ MATERIAL-BASED
   - Only suggest when materials arrived
   - Ready-to-execute projects
   - No empty milestones

3. ✅ CATEGORY CONSOLIDATION
   - Multiple POs → One milestone
   - Better organization
   - Easier tracking

4. ✅ INTELLIGENT ESTIMATION
   - Value-based duration
   - Actual receipt dates
   - Realistic timelines

5. ✅ COMPREHENSIVE TRACKING
   - Full material list
   - All PO numbers
   - Complete metadata

═══════════════════════════════════════════════════════════════

                    DATA RELATIONSHIPS

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│              │       │              │       │              │
│  RAB Items   │───────│ PO Items     │───────│ Purchase     │
│              │       │ (JSONB)      │       │ Orders       │
│              │       │              │       │              │
└──────┬───────┘       └──────────────┘       └──────┬───────┘
       │                                              │
       │                                              │
       │  category/pekerjaan                         │
       │                                              │
       │                              ┌───────────────▼──────┐
       │                              │                      │
       │                              │ Delivery Receipts    │
       │                              │ (Tanda Terima)       │
       │                              │                      │
       │                              └───────────┬──────────┘
       │                                          │
       │                                          │
       │                              ┌───────────▼──────────┐
       └──────────────────────────────►                      │
                                      │ Project Milestones   │
                                      │                      │
                                      │ category_link: {     │
                                      │   category,          │
                                      │   po_numbers: []     │
                                      │ }                    │
                                      │                      │
                                      └──────────────────────┘

═══════════════════════════════════════════════════════════════
