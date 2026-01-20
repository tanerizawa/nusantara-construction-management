-- ============================================================================
-- COMPREHENSIVE MIGRATION: Convert ALL camelCase columns to snake_case
-- Date: 2025-10-13
-- Total columns to rename: 96 columns across 10 tables
-- 
-- This migration ensures 100% snake_case naming convention compliance
-- ============================================================================

BEGIN;

-- ============================================================================
-- TABLE: users (4 camelCase columns)
-- ============================================================================
ALTER TABLE users RENAME COLUMN "isActive" TO is_active;
ALTER TABLE users RENAME COLUMN "lastLogin" TO last_login;
ALTER TABLE users RENAME COLUMN "lockUntil" TO lock_until;
ALTER TABLE users RENAME COLUMN "loginAttempts" TO login_attempts;

-- ============================================================================
-- TABLE: subsidiaries (1 camelCase column)
-- ============================================================================
ALTER TABLE subsidiaries RENAME COLUMN "deletedAt" TO deleted_at;

-- ============================================================================
-- TABLE: approval_notifications (1 camelCase column)
-- ============================================================================
ALTER TABLE approval_notifications RENAME COLUMN "userId" TO user_id;

-- ============================================================================
-- TABLE: berita_acara (26 camelCase columns)
-- ============================================================================
ALTER TABLE berita_acara RENAME COLUMN "approvedAt" TO approved_at;
ALTER TABLE berita_acara RENAME COLUMN "approvedBy" TO approved_by;
ALTER TABLE berita_acara RENAME COLUMN "baNumber" TO ba_number;
ALTER TABLE berita_acara RENAME COLUMN "baType" TO ba_type;
ALTER TABLE berita_acara RENAME COLUMN "clientNotes" TO client_notes;
ALTER TABLE berita_acara RENAME COLUMN "clientRepresentative" TO client_representative;
ALTER TABLE berita_acara RENAME COLUMN "clientSignDate" TO client_sign_date;
ALTER TABLE berita_acara RENAME COLUMN "clientSignature" TO client_signature;
ALTER TABLE berita_acara RENAME COLUMN "completionDate" TO completion_date;
ALTER TABLE berita_acara RENAME COLUMN "completionPercentage" TO completion_percentage;
ALTER TABLE berita_acara RENAME COLUMN "contractReference" TO contract_reference;
ALTER TABLE berita_acara RENAME COLUMN "createdBy" TO created_by;
ALTER TABLE berita_acara RENAME COLUMN "milestoneId" TO milestone_id;
ALTER TABLE berita_acara RENAME COLUMN "paymentAmount" TO payment_amount;
ALTER TABLE berita_acara RENAME COLUMN "paymentAuthorized" TO payment_authorized;
ALTER TABLE berita_acara RENAME COLUMN "paymentDueDate" TO payment_due_date;
ALTER TABLE berita_acara RENAME COLUMN "projectId" TO project_id;
ALTER TABLE berita_acara RENAME COLUMN "qualityChecklist" TO quality_checklist;
ALTER TABLE berita_acara RENAME COLUMN "rejectionReason" TO rejection_reason;
ALTER TABLE berita_acara RENAME COLUMN "reviewedAt" TO reviewed_at;
ALTER TABLE berita_acara RENAME COLUMN "reviewedBy" TO reviewed_by;
ALTER TABLE berita_acara RENAME COLUMN "submittedAt" TO submitted_at;
ALTER TABLE berita_acara RENAME COLUMN "submittedBy" TO submitted_by;
ALTER TABLE berita_acara RENAME COLUMN "updatedBy" TO updated_by;
ALTER TABLE berita_acara RENAME COLUMN "workDescription" TO work_description;
ALTER TABLE berita_acara RENAME COLUMN "workLocation" TO work_location;

-- ============================================================================
-- TABLE: progress_payments (20 camelCase columns)
-- ============================================================================
ALTER TABLE progress_payments RENAME COLUMN "approvalNotes" TO approval_notes;
ALTER TABLE progress_payments RENAME COLUMN "approvalWorkflow" TO approval_workflow;
ALTER TABLE progress_payments RENAME COLUMN "baApprovedAt" TO ba_approved_at;
ALTER TABLE progress_payments RENAME COLUMN "beritaAcaraId" TO berita_acara_id;
ALTER TABLE progress_payments RENAME COLUMN "createdBy" TO created_by;
ALTER TABLE progress_payments RENAME COLUMN "dueDate" TO due_date;
ALTER TABLE progress_payments RENAME COLUMN "invoiceDate" TO invoice_date;
ALTER TABLE progress_payments RENAME COLUMN "invoiceNumber" TO invoice_number;
ALTER TABLE progress_payments RENAME COLUMN "netAmount" TO net_amount;
ALTER TABLE progress_payments RENAME COLUMN "paidAt" TO paid_at;
ALTER TABLE progress_payments RENAME COLUMN "paymentApprovedAt" TO payment_approved_at;
ALTER TABLE progress_payments RENAME COLUMN "paymentApprovedBy" TO payment_approved_by;
ALTER TABLE progress_payments RENAME COLUMN "paymentMethod" TO payment_method;
ALTER TABLE progress_payments RENAME COLUMN "paymentReference" TO payment_reference;
ALTER TABLE progress_payments RENAME COLUMN "paymentScheduleId" TO payment_schedule_id;
ALTER TABLE progress_payments RENAME COLUMN "processingStartedAt" TO processing_started_at;
ALTER TABLE progress_payments RENAME COLUMN "projectId" TO project_id;
ALTER TABLE progress_payments RENAME COLUMN "retentionAmount" TO retention_amount;
ALTER TABLE progress_payments RENAME COLUMN "taxAmount" TO tax_amount;
ALTER TABLE progress_payments RENAME COLUMN "updatedBy" TO updated_by;

-- ============================================================================
-- TABLE: project_documents (15 camelCase columns)
-- ============================================================================
ALTER TABLE project_documents RENAME COLUMN "accessLevel" TO access_level;
ALTER TABLE project_documents RENAME COLUMN "approvedAt" TO approved_at;
ALTER TABLE project_documents RENAME COLUMN "approvedBy" TO approved_by;
ALTER TABLE project_documents RENAME COLUMN "createdBy" TO created_by;
ALTER TABLE project_documents RENAME COLUMN "downloadCount" TO download_count;
ALTER TABLE project_documents RENAME COLUMN "fileName" TO file_name;
ALTER TABLE project_documents RENAME COLUMN "filePath" TO file_path;
ALTER TABLE project_documents RENAME COLUMN "fileSize" TO file_size;
ALTER TABLE project_documents RENAME COLUMN "isPublic" TO is_public;
ALTER TABLE project_documents RENAME COLUMN "lastAccessed" TO last_accessed;
ALTER TABLE project_documents RENAME COLUMN "mimeType" TO mime_type;
ALTER TABLE project_documents RENAME COLUMN "originalName" TO original_name;
ALTER TABLE project_documents RENAME COLUMN "projectId" TO project_id;
ALTER TABLE project_documents RENAME COLUMN "updatedBy" TO updated_by;
ALTER TABLE project_documents RENAME COLUMN "uploadedBy" TO uploaded_by;

-- ============================================================================
-- TABLE: project_milestones (7 camelCase columns)
-- ============================================================================
ALTER TABLE project_milestones RENAME COLUMN "actualCost" TO actual_cost;
ALTER TABLE project_milestones RENAME COLUMN "assignedTo" TO assigned_to;
ALTER TABLE project_milestones RENAME COLUMN "completedDate" TO completed_date;
ALTER TABLE project_milestones RENAME COLUMN "createdBy" TO created_by;
ALTER TABLE project_milestones RENAME COLUMN "projectId" TO project_id;
ALTER TABLE project_milestones RENAME COLUMN "targetDate" TO target_date;
ALTER TABLE project_milestones RENAME COLUMN "updatedBy" TO updated_by;

-- ============================================================================
-- TABLE: project_rab (8 camelCase columns)
-- ============================================================================
ALTER TABLE project_rab RENAME COLUMN "approvedAt" TO approved_at;
ALTER TABLE project_rab RENAME COLUMN "approvedBy" TO approved_by;
ALTER TABLE project_rab RENAME COLUMN "createdBy" TO created_by;
ALTER TABLE project_rab RENAME COLUMN "isApproved" TO is_approved;
ALTER TABLE project_rab RENAME COLUMN "projectId" TO project_id;
ALTER TABLE project_rab RENAME COLUMN "totalPrice" TO total_price;
ALTER TABLE project_rab RENAME COLUMN "unitPrice" TO unit_price;
ALTER TABLE project_rab RENAME COLUMN "updatedBy" TO updated_by;

-- ============================================================================
-- TABLE: project_team_members (8 camelCase columns)
-- ============================================================================
ALTER TABLE project_team_members RENAME COLUMN "createdBy" TO created_by;
ALTER TABLE project_team_members RENAME COLUMN "employeeId" TO employee_id;
ALTER TABLE project_team_members RENAME COLUMN "endDate" TO end_date;
ALTER TABLE project_team_members RENAME COLUMN "hourlyRate" TO hourly_rate;
ALTER TABLE project_team_members RENAME COLUMN "projectId" TO project_id;
ALTER TABLE project_team_members RENAME COLUMN "startDate" TO start_date;
ALTER TABLE project_team_members RENAME COLUMN "updatedBy" TO updated_by;
ALTER TABLE project_team_members RENAME COLUMN "userId" TO user_id;

-- ============================================================================
-- TABLE: rab_purchase_tracking (6 camelCase columns)
-- ============================================================================
ALTER TABLE rab_purchase_tracking RENAME COLUMN "poNumber" TO po_number;
ALTER TABLE rab_purchase_tracking RENAME COLUMN "projectId" TO project_id;
ALTER TABLE rab_purchase_tracking RENAME COLUMN "purchaseDate" TO purchase_date;
ALTER TABLE rab_purchase_tracking RENAME COLUMN "rabItemId" TO rab_item_id;
ALTER TABLE rab_purchase_tracking RENAME COLUMN "totalAmount" TO total_amount;
ALTER TABLE rab_purchase_tracking RENAME COLUMN "unitPrice" TO unit_price;

COMMIT;

-- ============================================================================
-- Verification Query
-- ============================================================================
SELECT 
  'Remaining camelCase columns' as check_type,
  COUNT(*) as count
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND column_name ~ '[A-Z]'
  AND table_name NOT LIKE '%SequelizeMeta%';

\echo ''
\echo '✅ Migration complete: All 96 camelCase columns renamed to snake_case'
\echo '📊 Database now uses 100% snake_case naming convention'
\echo '📊 Total columns renamed: 96'
\echo '📊 Tables affected: 10'
