# 🏗️ MILESTONE & RAB INTEGRATION - COMPREHENSIVE SPECIFICATION

## 📋 Table of Contents
1. [Overview](#overview)
2. [Business Requirements](#business-requirements)
3. [Technical Architecture](#technical-architecture)
4. [Data Models](#data-models)
5. [API Specifications](#api-specifications)
6. [Frontend Components](#frontend-components)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Testing Strategy](#testing-strategy)

---

## 1. Overview

### Purpose
Integrate Milestones with RAB categories to enable automated progress tracking throughout the construction workflow (RAB → PO → Tanda Terima → BA → Payment).

### Key Features
- ✅ Link milestones to RAB categories
- ✅ Auto-suggest milestones from approved RAB
- ✅ Real-time progress tracking across workflow stages
- ✅ Item-level quantity and value tracking
- ✅ Automated alerts for delays
- ✅ Visual workflow progress indicators

### Approach
**Hybrid Model**: Combine automation with flexibility
- Auto-suggest milestones from RAB categories
- Allow manual milestone creation
- Optional category linking
- Real-time workflow synchronization

---

## 2. Business Requirements

### User Stories

**US-1: As a Project Manager, I want milestones auto-suggested from RAB categories**
- Given: RAB is approved
- When: I navigate to Milestones
- Then: System suggests creating milestones for each RAB category
- And: I can accept, modify, or skip suggestions

**US-2: As a PM, I want to see workflow progress for each milestone**
- Given: Milestone is linked to RAB category
- When: I view milestone details
- Then: I see progress for RAB → PO → Receipt → BA → Payment
- And: Progress percentage is calculated automatically

**US-3: As a PM, I want alerts for workflow delays**
- Given: PO is approved but no receipt after 7 days
- When: I check milestone
- Then: I see warning alert
- And: I can investigate the delay

**US-4: As a PM, I want item-level tracking**
- Given: Milestone has multiple RAB items
- When: I expand item details
- Then: I see quantity/value for each stage (planned, PO, received, completed, paid)

---

## 3. Technical Architecture

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
├─────────────────────────────────────────────────────────┤
│ Milestone Card │ Progress Chart │ Alert Panel │ Gantt   │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC                       │
├─────────────────────────────────────────────────────────┤
│ • Progress Calculation Engine                            │
│ • Alert Generation System                                │
│ • Sync Orchestrator                                      │
│ • Dependency Manager                                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      DATA LAYER                          │
├─────────────────────────────────────────────────────────┤
│ Milestones │ RAB Items │ POs │ Receipts │ BAs │ Payments│
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
RAB Approved
    │
    ↓
Auto-Suggest Milestones ──→ User Creates Milestone
    │                              │
    │                              ↓
    │                      Link to RAB Category
    │                              │
    ├──────────────────────────────┤
    │                              │
    ↓                              ↓
PO Created ─────────────→ Update Milestone Progress (20%)
    │
    ↓
PO Approved ────────────→ Update Progress (30%)
    │
    ↓
Tanda Terima Received ──→ Update Progress (50%)
    │                      Generate Alert if delayed
    ↓
BA Created ─────────────→ Update Progress (75%)
    │
    ↓
Payment Completed ──────→ Update Progress (100%)
                          Mark Milestone Complete
```

---

## 4. Data Models

### Enhanced Milestone Model

```javascript
{
  // Core fields
  id: "uuid",
  project_id: "uuid",
  title: "Pekerjaan Tanah - Fase 1",
  description: "Galian, urugan, pemadatan",
  start_date: "2025-01-01",
  end_date: "2025-01-31",
  status: "in-progress", // planning, in-progress, completed, delayed
  progress_percentage: 45,
  
  // RAB Category Link
  category_link: {
    enabled: true,
    category_id: "uuid",
    category_name: "Pekerjaan Tanah",
    auto_generated: false
  },
  
  // Workflow Progress
  workflow_progress: {
    rab_approved: {
      status: true,
      total_value: 50000000,
      total_items: 8,
      approved_date: "2024-12-15"
    },
    purchase_orders: {
      total_count: 3,
      approved_count: 2,
      pending_count: 1,
      total_value: 48000000
    },
    receipts: {
      received_count: 1,
      expected_count: 2,
      received_value: 20000000,
      pending_value: 28000000
    },
    berita_acara: {
      total_count: 0,
      completed_percentage: 0,
      total_value: 0
    },
    payments: {
      paid_count: 0,
      paid_value: 0,
      pending_value: 50000000,
      payment_percentage: 0
    }
  },
  
  // Alerts
  alerts: [
    {
      id: "uuid",
      type: "delivery_delay",
      severity: "medium",
      message: "PO-002 approved 7 days ago, no receipt yet",
      created_at: "2025-01-05",
      dismissed: false
    }
  ],
  
  // Audit
  created_at: "2024-12-01",
  updated_at: "2025-01-12",
  created_by: "user_id",
  last_synced: "2025-01-12 10:30:00"
}
```

### Milestone Item Model

```javascript
{
  id: "uuid",
  milestone_id: "uuid",
  rab_item_id: "uuid",
  description: "Galian Tanah",
  unit: "m³",
  
  // Quantity Tracking
  quantity_planned: 100,
  quantity_po: 100,
  quantity_received: 50,
  quantity_completed: 30,
  quantity_remaining: 70,
  
  // Value Tracking
  value_planned: 10000000,
  value_po: 10000000,
  value_received: 5000000,
  value_completed: 3000000,
  value_paid: 0,
  
  // Status
  status: "in-progress",
  progress_percentage: 30,
  
  created_at: "2024-12-01",
  updated_at: "2025-01-12"
}
```

---

## 5. API Specifications

### POST /api/projects/:projectId/milestones/suggest

Auto-suggest milestones from approved RAB categories.

**Request:**
```json
GET /api/projects/123/milestones/suggest
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "category_id": "uuid-1",
        "category_name": "Pekerjaan Tanah",
        "total_value": 50000000,
        "total_items": 8,
        "suggested_title": "Pekerjaan Tanah",
        "suggested_timeline": {
          "start_date": "2025-01-01",
          "end_date": "2025-01-31",
          "duration_days": 30
        },
        "rab_items": [
          {
            "id": "uuid",
            "description": "Galian Tanah",
            "quantity": 100,
            "unit": "m³",
            "unit_price": 100000,
            "total_price": 10000000
          }
        ]
      }
    ]
  }
}
```

### GET /api/projects/:projectId/milestones/:id/progress

Get detailed progress data for a milestone.

**Response:**
```json
{
  "success": true,
  "data": {
    "milestone_id": "uuid",
    "progress_percentage": 45,
    "workflow_progress": {
      // ... detailed workflow data
    },
    "items": [
      // ... item-level tracking
    ],
    "alerts": [
      // ... active alerts
    ],
    "timeline": {
      "days_elapsed": 12,
      "days_remaining": 19,
      "days_total": 31,
      "on_track": false,
      "expected_progress": 55,
      "actual_progress": 45,
      "variance": -10
    }
  }
}
```

### POST /api/projects/:projectId/milestones/:id/sync

Manually trigger synchronization with workflow data.

**Response:**
```json
{
  "success": true,
  "data": {
    "synced_at": "2025-01-12 10:30:00",
    "changes": {
      "progress_updated": true,
      "new_alerts": 1,
      "items_updated": 3
    }
  }
}
```

---

## 6. Frontend Components

### Component Tree

```
MilestoneManager
├── MilestoneAutoSuggest (modal)
├── MilestoneForm (create/edit)
│   ├── CategorySelector
│   └── TimelineEditor
├── MilestoneGrid
│   └── MilestoneCard
│       ├── WorkflowProgress
│       │   ├── RABStage
│       │   ├── POStage
│       │   ├── ReceiptStage
│       │   ├── BAStage
│       │   └── PaymentStage
│       ├── AlertPanel
│       └── ItemsTable
└── GanttChart (optional)
```

### Key Components

**MilestoneCard.js**
```javascript
const MilestoneCard = ({ milestone, onSync, onEdit }) => {
  return (
    <div className="milestone-card">
      <header>
        <h3>{milestone.title}</h3>
        {milestone.category_link.enabled && (
          <Badge>{milestone.category_link.category_name}</Badge>
        )}
      </header>
      
      <ProgressBar value={milestone.progress_percentage} />
      
      <WorkflowProgress data={milestone.workflow_progress} />
      
      {milestone.alerts.length > 0 && (
        <AlertPanel alerts={milestone.alerts} />
      )}
      
      <footer>
        <Button onClick={() => onEdit(milestone)}>Edit</Button>
        <Button onClick={() => onSync(milestone.id)}>Sync Now</Button>
      </footer>
    </div>
  );
};
```

**WorkflowProgress.js**
```javascript
const WorkflowProgress = ({ data }) => {
  const stages = [
    { key: 'rab_approved', label: 'RAB', icon: CheckCircle },
    { key: 'purchase_orders', label: 'PO', icon: ShoppingCart },
    { key: 'receipts', label: 'Receipt', icon: Package },
    { key: 'berita_acara', label: 'BA', icon: FileCheck },
    { key: 'payments', label: 'Payment', icon: CreditCard }
  ];
  
  return (
    <div className="workflow-stages">
      {stages.map((stage, index) => (
        <WorkflowStage
          key={stage.key}
          stage={stage}
          data={data[stage.key]}
          isLast={index === stages.length - 1}
        />
      ))}
    </div>
  );
};
```

---

## 7. Implementation Roadmap

### Phase 1: Foundation (2 weeks)
- Database schema updates
- Basic API endpoints
- Category selector in milestone form
- Simple progress display

### Phase 2: Auto-Sync (2 weeks)
- Background sync job
- Progress calculation
- Auto-suggest feature
- Enhanced milestone card

### Phase 3: Item Tracking (2 weeks)
- Item-level APIs
- Item details modal
- Quantity/value tracking
- Item progress indicators

### Phase 4: Alerts (1 week)
- Alert generation logic
- Alert panel UI
- Notification system
- Email integration

### Phase 5: Advanced Features (2 weeks)
- Dependencies
- Gantt chart
- Critical path
- Timeline optimization

---

## 8. Testing Strategy

### Unit Tests
- Progress calculation functions
- Alert generation logic
- Data transformation utilities

### Integration Tests
- API endpoints
- Database operations
- Workflow synchronization

### E2E Tests
- Create milestone flow
- Auto-suggest acceptance
- Progress tracking updates
- Alert generation

### Test Scenarios

**Scenario 1: Happy Path**
1. RAB approved with 3 categories
2. System suggests 3 milestones
3. User accepts all suggestions
4. Milestones created with category links
5. Progress updates as workflow progresses

**Scenario 2: Delayed Delivery**
1. PO approved
2. 7 days pass without receipt
3. Alert generated
4. User investigates via alert link
5. Receipt created
6. Alert auto-dismissed

**Scenario 3: Manual Milestone**
1. User creates milestone without category link
2. Milestone functions normally
3. No auto-sync
4. Manual progress updates only

---

## 📝 Notes & Considerations

### Performance
- Use background jobs for sync (don't block UI)
- Cache progress calculations
- Paginate item lists for large milestones

### Data Integrity
- Soft delete for milestones
- Audit log for all updates
- Version control for progress data

### Scalability
- Index foreign keys
- Optimize queries for large datasets
- Consider read replicas for reporting

### Future Enhancements
- Machine learning for timeline prediction
- Photo documentation integration
- Weather impact tracking
- Resource allocation optimization

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-12  
**Author:** System Architect  
**Status:** Draft for Review
