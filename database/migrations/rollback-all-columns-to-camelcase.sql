-- ============================================================================
-- ROLLBACK: Revert snake_case columns back to camelCase
-- Date: 2025-10-13
-- Purpose: Rollback for rename-all-columns-to-snake-case.sql if needed
-- ============================================================================

BEGIN;

-- Revert users
ALTER TABLE users RENAME COLUMN is_active TO "isActive";
ALTER TABLE users RENAME COLUMN last_login TO "lastLogin";
ALTER TABLE users RENAME COLUMN lock_until TO "lockUntil";
ALTER TABLE users RENAME COLUMN login_attempts TO "loginAttempts";

-- Revert subsidiaries
ALTER TABLE subsidiaries RENAME COLUMN deleted_at TO "deletedAt";

-- Revert approval_notifications
ALTER TABLE approval_notifications RENAME COLUMN user_id TO "userId";

-- Revert berita_acara
ALTER TABLE berita_acara RENAME COLUMN approved_at TO "approvedAt";
ALTER TABLE berita_acara RENAME COLUMN approved_by TO "approvedBy";
ALTER TABLE berita_acara RENAME COLUMN ba_number TO "baNumber";
ALTER TABLE berita_acara RENAME COLUMN ba_type TO "baType";
ALTER TABLE berita_acara RENAME COLUMN client_notes TO "clientNotes";
ALTER TABLE berita_acara RENAME COLUMN client_representative TO "clientRepresentative";
ALTER TABLE berita_acara RENAME COLUMN client_sign_date TO "clientSignDate";
ALTER TABLE berita_acara RENAME COLUMN client_signature TO "clientSignature";
ALTER TABLE berita_acara RENAME COLUMN completion_date TO "completionDate";
ALTER TABLE berita_acara RENAME COLUMN completion_percentage TO "completionPercentage";
ALTER TABLE berita_acara RENAME COLUMN contract_reference TO "contractReference";
ALTER TABLE berita_acara RENAME COLUMN created_by TO "createdBy";
ALTER TABLE berita_acara RENAME COLUMN milestone_id TO "milestoneId";
ALTER TABLE berita_acara RENAME COLUMN payment_amount TO "paymentAmount";
ALTER TABLE berita_acara RENAME COLUMN payment_authorized TO "paymentAuthorized";
ALTER TABLE berita_acara RENAME COLUMN payment_due_date TO "paymentDueDate";
ALTER TABLE berita_acara RENAME COLUMN project_id TO "projectId";
ALTER TABLE berita_acara RENAME COLUMN quality_checklist TO "qualityChecklist";
ALTER TABLE berita_acara RENAME COLUMN rejection_reason TO "rejectionReason";
ALTER TABLE berita_acara RENAME COLUMN reviewed_at TO "reviewedAt";
ALTER TABLE berita_acara RENAME COLUMN reviewed_by TO "reviewedBy";
ALTER TABLE berita_acara RENAME COLUMN submitted_at TO "submittedAt";
ALTER TABLE berita_acara RENAME COLUMN submitted_by TO "submittedBy";
ALTER TABLE berita_acara RENAME COLUMN updated_by TO "updatedBy";
ALTER TABLE berita_acara RENAME COLUMN work_description TO "workDescription";
ALTER TABLE berita_acara RENAME COLUMN work_location TO "workLocation";

-- Revert progress_payments
ALTER TABLE progress_payments RENAME COLUMN approval_notes TO "approvalNotes";
ALTER TABLE progress_payments RENAME COLUMN approval_workflow TO "approvalWorkflow";
ALTER TABLE progress_payments RENAME COLUMN ba_approved_at TO "baApprovedAt";
ALTER TABLE progress_payments RENAME COLUMN berita_acara_id TO "beritaAcaraId";
ALTER TABLE progress_payments RENAME COLUMN created_by TO "createdBy";
ALTER TABLE progress_payments RENAME COLUMN due_date TO "dueDate";
ALTER TABLE progress_payments RENAME COLUMN invoice_date TO "invoiceDate";
ALTER TABLE progress_payments RENAME COLUMN invoice_number TO "invoiceNumber";
ALTER TABLE progress_payments RENAME COLUMN net_amount TO "netAmount";
ALTER TABLE progress_payments RENAME COLUMN paid_at TO "paidAt";
ALTER TABLE progress_payments RENAME COLUMN payment_approved_at TO "paymentApprovedAt";
ALTER TABLE progress_payments RENAME COLUMN payment_approved_by TO "paymentApprovedBy";
ALTER TABLE progress_payments RENAME COLUMN payment_method TO "paymentMethod";
ALTER TABLE progress_payments RENAME COLUMN payment_reference TO "paymentReference";
ALTER TABLE progress_payments RENAME COLUMN payment_schedule_id TO "paymentScheduleId";
ALTER TABLE progress_payments RENAME COLUMN processing_started_at TO "processingStartedAt";
ALTER TABLE progress_payments RENAME COLUMN project_id TO "projectId";
ALTER TABLE progress_payments RENAME COLUMN retention_amount TO "retentionAmount";
ALTER TABLE progress_payments RENAME COLUMN tax_amount TO "taxAmount";
ALTER TABLE progress_payments RENAME COLUMN updated_by TO "updatedBy";

-- Revert project_documents
ALTER TABLE project_documents RENAME COLUMN access_level TO "accessLevel";
ALTER TABLE project_documents RENAME COLUMN approved_at TO "approvedAt";
ALTER TABLE project_documents RENAME COLUMN approved_by TO "approvedBy";
ALTER TABLE project_documents RENAME COLUMN created_by TO "createdBy";
ALTER TABLE project_documents RENAME COLUMN download_count TO "downloadCount";
ALTER TABLE project_documents RENAME COLUMN file_name TO "fileName";
ALTER TABLE project_documents RENAME COLUMN file_path TO "filePath";
ALTER TABLE project_documents RENAME COLUMN file_size TO "fileSize";
ALTER TABLE project_documents RENAME COLUMN is_public TO "isPublic";
ALTER TABLE project_documents RENAME COLUMN last_accessed TO "lastAccessed";
ALTER TABLE project_documents RENAME COLUMN mime_type TO "mimeType";
ALTER TABLE project_documents RENAME COLUMN original_name TO "originalName";
ALTER TABLE project_documents RENAME COLUMN project_id TO "projectId";
ALTER TABLE project_documents RENAME COLUMN updated_by TO "updatedBy";
ALTER TABLE project_documents RENAME COLUMN uploaded_by TO "uploadedBy";

-- Revert project_milestones
ALTER TABLE project_milestones RENAME COLUMN actual_cost TO "actualCost";
ALTER TABLE project_milestones RENAME COLUMN assigned_to TO "assignedTo";
ALTER TABLE project_milestones RENAME COLUMN completed_date TO "completedDate";
ALTER TABLE project_milestones RENAME COLUMN created_by TO "createdBy";
ALTER TABLE project_milestones RENAME COLUMN project_id TO "projectId";
ALTER TABLE project_milestones RENAME COLUMN target_date TO "targetDate";
ALTER TABLE project_milestones RENAME COLUMN updated_by TO "updatedBy";

-- Revert project_rab
ALTER TABLE project_rab RENAME COLUMN approved_at TO "approvedAt";
ALTER TABLE project_rab RENAME COLUMN approved_by TO "approvedBy";
ALTER TABLE project_rab RENAME COLUMN created_by TO "createdBy";
ALTER TABLE project_rab RENAME COLUMN is_approved TO "isApproved";
ALTER TABLE project_rab RENAME COLUMN project_id TO "projectId";
ALTER TABLE project_rab RENAME COLUMN total_price TO "totalPrice";
ALTER TABLE project_rab RENAME COLUMN unit_price TO "unitPrice";
ALTER TABLE project_rab RENAME COLUMN updated_by TO "updatedBy";

-- Revert project_team_members
ALTER TABLE project_team_members RENAME COLUMN created_by TO "createdBy";
ALTER TABLE project_team_members RENAME COLUMN employee_id TO "employeeId";
ALTER TABLE project_team_members RENAME COLUMN end_date TO "endDate";
ALTER TABLE project_team_members RENAME COLUMN hourly_rate TO "hourlyRate";
ALTER TABLE project_team_members RENAME COLUMN project_id TO "projectId";
ALTER TABLE project_team_members RENAME COLUMN start_date TO "startDate";
ALTER TABLE project_team_members RENAME COLUMN updated_by TO "updatedBy";
ALTER TABLE project_team_members RENAME COLUMN user_id TO "userId";

-- Revert rab_purchase_tracking
ALTER TABLE rab_purchase_tracking RENAME COLUMN po_number TO "poNumber";
ALTER TABLE rab_purchase_tracking RENAME COLUMN project_id TO "projectId";
ALTER TABLE rab_purchase_tracking RENAME COLUMN purchase_date TO "purchaseDate";
ALTER TABLE rab_purchase_tracking RENAME COLUMN rab_item_id TO "rabItemId";
ALTER TABLE rab_purchase_tracking RENAME COLUMN total_amount TO "totalAmount";
ALTER TABLE rab_purchase_tracking RENAME COLUMN unit_price TO "unitPrice";

COMMIT;

\echo '✅ Rollback complete: All columns reverted to camelCase'
