--
-- PostgreSQL database dump
--

\restrict va6t5jW1kX5d2DxxQ7TGNv2ANNDoHm8U6qvvFwJIjbmRfVQ1PTavNZ0B8aR6cv9

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_approval_instances_overall_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_approval_instances_overall_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);


ALTER TYPE public.enum_approval_instances_overall_status OWNER TO admin;

--
-- Name: enum_approval_notifications_notification_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_approval_notifications_notification_type AS ENUM (
    'approval_request',
    'approved',
    'rejected',
    'escalation',
    'completed'
);


ALTER TYPE public.enum_approval_notifications_notification_type OWNER TO admin;

--
-- Name: enum_approval_notifications_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_approval_notifications_status AS ENUM (
    'pending',
    'sent',
    'read',
    'failed'
);


ALTER TYPE public.enum_approval_notifications_status OWNER TO admin;

--
-- Name: enum_approval_steps_decision; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_approval_steps_decision AS ENUM (
    'approve',
    'reject',
    'approve_with_conditions'
);


ALTER TYPE public.enum_approval_steps_decision OWNER TO admin;

--
-- Name: enum_approval_steps_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_approval_steps_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'skipped'
);


ALTER TYPE public.enum_approval_steps_status OWNER TO admin;

--
-- Name: enum_audit_logs_action; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_audit_logs_action AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'LOGIN',
    'LOGOUT',
    'VIEW',
    'EXPORT',
    'IMPORT'
);


ALTER TYPE public.enum_audit_logs_action OWNER TO admin;

--
-- Name: enum_backup_history_backupType; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."enum_backup_history_backupType" AS ENUM (
    'FULL',
    'INCREMENTAL',
    'MANUAL'
);


ALTER TYPE public."enum_backup_history_backupType" OWNER TO admin;

--
-- Name: enum_backup_history_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_backup_history_status AS ENUM (
    'IN_PROGRESS',
    'COMPLETED',
    'FAILED',
    'VERIFIED',
    'CORRUPTED'
);


ALTER TYPE public.enum_backup_history_status OWNER TO admin;

--
-- Name: enum_berita_acara_baType; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."enum_berita_acara_baType" AS ENUM (
    'provisional',
    'final',
    'partial'
);


ALTER TYPE public."enum_berita_acara_baType" OWNER TO admin;

--
-- Name: enum_berita_acara_ba_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_berita_acara_ba_type AS ENUM (
    'provisional',
    'final',
    'partial'
);


ALTER TYPE public.enum_berita_acara_ba_type OWNER TO admin;

--
-- Name: enum_berita_acara_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_berita_acara_status AS ENUM (
    'draft',
    'submitted',
    'client_review',
    'approved',
    'rejected'
);


ALTER TYPE public.enum_berita_acara_status OWNER TO admin;

--
-- Name: enum_chart_of_accounts_account_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_chart_of_accounts_account_type AS ENUM (
    'ASSET',
    'LIABILITY',
    'EQUITY',
    'REVENUE',
    'EXPENSE'
);


ALTER TYPE public.enum_chart_of_accounts_account_type OWNER TO admin;

--
-- Name: enum_chart_of_accounts_normal_balance; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_chart_of_accounts_normal_balance AS ENUM (
    'DEBIT',
    'CREDIT'
);


ALTER TYPE public.enum_chart_of_accounts_normal_balance OWNER TO admin;

--
-- Name: enum_delivery_receipts_delivery_method; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_delivery_receipts_delivery_method AS ENUM (
    'truck',
    'pickup',
    'van',
    'container',
    'other'
);


ALTER TYPE public.enum_delivery_receipts_delivery_method OWNER TO admin;

--
-- Name: enum_delivery_receipts_inspection_result; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_delivery_receipts_inspection_result AS ENUM (
    'passed',
    'conditional',
    'rejected',
    'pending'
);


ALTER TYPE public.enum_delivery_receipts_inspection_result OWNER TO admin;

--
-- Name: enum_delivery_receipts_receipt_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_delivery_receipts_receipt_type AS ENUM (
    'full_delivery',
    'partial_delivery'
);


ALTER TYPE public.enum_delivery_receipts_receipt_type OWNER TO admin;

--
-- Name: enum_delivery_receipts_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_delivery_receipts_status AS ENUM (
    'pending_delivery',
    'partial_delivered',
    'fully_delivered',
    'received',
    'completed',
    'rejected'
);


ALTER TYPE public.enum_delivery_receipts_status OWNER TO admin;

--
-- Name: enum_entities_entity_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_entities_entity_type AS ENUM (
    'subsidiary',
    'branch',
    'project',
    'division'
);


ALTER TYPE public.enum_entities_entity_type OWNER TO admin;

--
-- Name: enum_finance_transactions_payment_method; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_finance_transactions_payment_method AS ENUM (
    'cash',
    'bank_transfer',
    'check',
    'credit_card',
    'debit_card',
    'other'
);


ALTER TYPE public.enum_finance_transactions_payment_method OWNER TO admin;

--
-- Name: enum_finance_transactions_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_finance_transactions_status AS ENUM (
    'pending',
    'completed',
    'cancelled',
    'failed'
);


ALTER TYPE public.enum_finance_transactions_status OWNER TO admin;

--
-- Name: enum_finance_transactions_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_finance_transactions_type AS ENUM (
    'income',
    'expense',
    'transfer'
);


ALTER TYPE public.enum_finance_transactions_type OWNER TO admin;

--
-- Name: enum_fixed_assets_asset_category; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_fixed_assets_asset_category AS ENUM (
    'HEAVY_EQUIPMENT',
    'VEHICLES',
    'BUILDINGS',
    'OFFICE_EQUIPMENT',
    'TOOLS_MACHINERY',
    'COMPUTERS_IT',
    'LAND',
    'INFRASTRUCTURE'
);


ALTER TYPE public.enum_fixed_assets_asset_category OWNER TO admin;

--
-- Name: enum_fixed_assets_condition; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_fixed_assets_condition AS ENUM (
    'EXCELLENT',
    'GOOD',
    'FAIR',
    'POOR'
);


ALTER TYPE public.enum_fixed_assets_condition OWNER TO admin;

--
-- Name: enum_fixed_assets_depreciation_method; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_fixed_assets_depreciation_method AS ENUM (
    'STRAIGHT_LINE',
    'DECLINING_BALANCE',
    'DOUBLE_DECLINING',
    'UNITS_OF_PRODUCTION',
    'SUM_OF_YEARS_DIGITS'
);


ALTER TYPE public.enum_fixed_assets_depreciation_method OWNER TO admin;

--
-- Name: enum_fixed_assets_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_fixed_assets_status AS ENUM (
    'ACTIVE',
    'UNDER_MAINTENANCE',
    'IDLE',
    'DISPOSED',
    'WRITTEN_OFF',
    'LEASED_OUT'
);


ALTER TYPE public.enum_fixed_assets_status OWNER TO admin;

--
-- Name: enum_journal_entries_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_journal_entries_status AS ENUM (
    'DRAFT',
    'POSTED',
    'REVERSED'
);


ALTER TYPE public.enum_journal_entries_status OWNER TO admin;

--
-- Name: enum_milestone_activities_activity_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_milestone_activities_activity_type AS ENUM (
    'created',
    'updated',
    'status_change',
    'progress_update',
    'photo_upload',
    'cost_added',
    'cost_updated',
    'issue_reported',
    'issue_resolved',
    'approved',
    'rejected',
    'comment',
    'other'
);


ALTER TYPE public.enum_milestone_activities_activity_type OWNER TO admin;

--
-- Name: enum_milestone_costs_cost_category; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_milestone_costs_cost_category AS ENUM (
    'materials',
    'labor',
    'equipment',
    'subcontractor',
    'contingency',
    'indirect',
    'other'
);


ALTER TYPE public.enum_milestone_costs_cost_category OWNER TO admin;

--
-- Name: enum_milestone_costs_cost_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_milestone_costs_cost_type AS ENUM (
    'planned',
    'actual',
    'change_order',
    'unforeseen'
);


ALTER TYPE public.enum_milestone_costs_cost_type OWNER TO admin;

--
-- Name: enum_milestone_photos_photo_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_milestone_photos_photo_type AS ENUM (
    'progress',
    'issue',
    'inspection',
    'quality',
    'before',
    'after',
    'general'
);


ALTER TYPE public.enum_milestone_photos_photo_type OWNER TO admin;

--
-- Name: enum_progress_payments_delivery_method; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_progress_payments_delivery_method AS ENUM (
    'courier',
    'post',
    'hand_delivery',
    'other'
);


ALTER TYPE public.enum_progress_payments_delivery_method OWNER TO admin;

--
-- Name: enum_progress_payments_paymentMethod; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."enum_progress_payments_paymentMethod" AS ENUM (
    'bank_transfer',
    'check',
    'cash',
    'other'
);


ALTER TYPE public."enum_progress_payments_paymentMethod" OWNER TO admin;

--
-- Name: enum_progress_payments_payment_method; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_progress_payments_payment_method AS ENUM (
    'bank_transfer',
    'check',
    'cash',
    'other'
);


ALTER TYPE public.enum_progress_payments_payment_method OWNER TO admin;

--
-- Name: enum_progress_payments_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_progress_payments_status AS ENUM (
    'pending_ba',
    'ba_approved',
    'payment_approved',
    'approved',
    'invoice_sent',
    'processing',
    'paid',
    'overdue',
    'cancelled'
);


ALTER TYPE public.enum_progress_payments_status OWNER TO admin;

--
-- Name: enum_project_additional_expenses_approval_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_project_additional_expenses_approval_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);


ALTER TYPE public.enum_project_additional_expenses_approval_status OWNER TO admin;

--
-- Name: enum_project_additional_expenses_expense_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_project_additional_expenses_expense_type AS ENUM (
    'kasbon',
    'overtime',
    'emergency',
    'transportation',
    'accommodation',
    'meals',
    'equipment_rental',
    'repair',
    'miscellaneous',
    'other'
);


ALTER TYPE public.enum_project_additional_expenses_expense_type OWNER TO admin;

--
-- Name: enum_project_additional_expenses_payment_method; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_project_additional_expenses_payment_method AS ENUM (
    'cash',
    'transfer',
    'check',
    'giro',
    'other'
);


ALTER TYPE public.enum_project_additional_expenses_payment_method OWNER TO admin;

--
-- Name: enum_project_documents_accessLevel; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."enum_project_documents_accessLevel" AS ENUM (
    'public',
    'team',
    'restricted'
);


ALTER TYPE public."enum_project_documents_accessLevel" OWNER TO admin;

--
-- Name: enum_project_documents_access_level; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_project_documents_access_level AS ENUM (
    'public',
    'team',
    'restricted'
);


ALTER TYPE public.enum_project_documents_access_level OWNER TO admin;

--
-- Name: enum_project_documents_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_project_documents_status AS ENUM (
    'draft',
    'review',
    'approved',
    'archived'
);


ALTER TYPE public.enum_project_documents_status OWNER TO admin;

--
-- Name: enum_project_documents_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_project_documents_type AS ENUM (
    'contract',
    'specification',
    'drawing',
    'report',
    'photo',
    'other'
);


ALTER TYPE public.enum_project_documents_type OWNER TO admin;

--
-- Name: enum_project_milestones_priority; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_project_milestones_priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);


ALTER TYPE public.enum_project_milestones_priority OWNER TO admin;

--
-- Name: enum_project_milestones_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_project_milestones_status AS ENUM (
    'pending',
    'in_progress',
    'completed',
    'delayed'
);


ALTER TYPE public.enum_project_milestones_status OWNER TO admin;

--
-- Name: enum_project_rab_item_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_project_rab_item_type AS ENUM (
    'material',
    'service',
    'labor',
    'equipment',
    'overhead'
);


ALTER TYPE public.enum_project_rab_item_type OWNER TO admin;

--
-- Name: enum_project_rab_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_project_rab_status AS ENUM (
    'draft',
    'under_review',
    'approved',
    'rejected'
);


ALTER TYPE public.enum_project_rab_status OWNER TO admin;

--
-- Name: enum_project_team_members_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_project_team_members_status AS ENUM (
    'active',
    'inactive',
    'completed'
);


ALTER TYPE public.enum_project_team_members_status OWNER TO admin;

--
-- Name: enum_projects_priority; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_projects_priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);


ALTER TYPE public.enum_projects_priority OWNER TO admin;

--
-- Name: enum_projects_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_projects_status AS ENUM (
    'planning',
    'active',
    'on_hold',
    'completed',
    'cancelled'
);


ALTER TYPE public.enum_projects_status OWNER TO admin;

--
-- Name: enum_purchase_orders_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_purchase_orders_status AS ENUM (
    'draft',
    'pending',
    'approved',
    'received',
    'cancelled'
);


ALTER TYPE public.enum_purchase_orders_status OWNER TO admin;

--
-- Name: enum_rab_purchase_tracking_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_rab_purchase_tracking_status AS ENUM (
    'pending',
    'approved',
    'delivered',
    'cancelled'
);


ALTER TYPE public.enum_rab_purchase_tracking_status OWNER TO admin;

--
-- Name: enum_subsidiaries_specialization; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_subsidiaries_specialization AS ENUM (
    'residential',
    'commercial',
    'industrial',
    'infrastructure',
    'renovation',
    'interior',
    'landscaping',
    'general'
);


ALTER TYPE public.enum_subsidiaries_specialization OWNER TO admin;

--
-- Name: enum_subsidiaries_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_subsidiaries_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.enum_subsidiaries_status OWNER TO admin;

--
-- Name: enum_tax_records_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_tax_records_status AS ENUM (
    'draft',
    'calculated',
    'filed',
    'paid',
    'overdue'
);


ALTER TYPE public.enum_tax_records_status OWNER TO admin;

--
-- Name: enum_tax_records_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_tax_records_type AS ENUM (
    'pajak_penghasilan',
    'ppn',
    'pph21',
    'pph23',
    'pph4_ayat2',
    'other'
);


ALTER TYPE public.enum_tax_records_type OWNER TO admin;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_users_role AS ENUM (
    'admin',
    'project_manager',
    'finance_manager',
    'inventory_manager',
    'hr_manager',
    'supervisor'
);


ALTER TYPE public.enum_users_role OWNER TO admin;

--
-- Name: enum_work_orders_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_work_orders_status AS ENUM (
    'draft',
    'pending',
    'approved',
    'in_progress',
    'completed',
    'cancelled'
);


ALTER TYPE public.enum_work_orders_status OWNER TO admin;

--
-- Name: expense_approval_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.expense_approval_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);


ALTER TYPE public.expense_approval_status OWNER TO admin;

--
-- Name: expense_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.expense_type AS ENUM (
    'kasbon',
    'overtime',
    'emergency',
    'transportation',
    'accommodation',
    'meals',
    'equipment_rental',
    'repair',
    'miscellaneous',
    'other'
);


ALTER TYPE public.expense_type OWNER TO admin;

--
-- Name: payment_method; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.payment_method AS ENUM (
    'cash',
    'transfer',
    'check',
    'giro',
    'other'
);


ALTER TYPE public.payment_method OWNER TO admin;

--
-- Name: rab_item_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.rab_item_type AS ENUM (
    'material',
    'service',
    'labor',
    'equipment',
    'overhead'
);


ALTER TYPE public.rab_item_type OWNER TO admin;

--
-- Name: calculate_work_duration(); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION public.calculate_work_duration() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.clock_out_time IS NOT NULL AND NEW.clock_in_time IS NOT NULL THEN
        NEW.work_duration_minutes = EXTRACT(EPOCH FROM (NEW.clock_out_time - NEW.clock_in_time)) / 60;
        NEW.status = 'clocked_out';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.calculate_work_duration() OWNER TO admin;

--
-- Name: update_approval_timestamp(); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION public.update_approval_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_approval_timestamp() OWNER TO admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: active_sessions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.active_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(255) NOT NULL,
    token text NOT NULL,
    ip_address character varying(45),
    user_agent text,
    browser character varying(255),
    os character varying(255),
    device character varying(255),
    location character varying(255),
    country character varying(2),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_active timestamp without time zone DEFAULT now() NOT NULL,
    expires_at timestamp without time zone NOT NULL
);


ALTER TABLE public.active_sessions OWNER TO admin;

--
-- Name: approval_instances; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.approval_instances (
    id uuid NOT NULL,
    workflow_id uuid NOT NULL,
    entity_id character varying(255) NOT NULL,
    entity_type character varying(255) NOT NULL,
    entity_data json,
    current_step integer DEFAULT 1,
    overall_status public.enum_approval_instances_overall_status DEFAULT 'pending'::public.enum_approval_instances_overall_status,
    total_amount numeric(15,2) DEFAULT 0,
    submitted_by character varying(255),
    submitted_at timestamp with time zone,
    completed_at timestamp with time zone,
    comments text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.approval_instances OWNER TO admin;

--
-- Name: TABLE approval_instances; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE public.approval_instances IS 'Individual approval instances per document/RAB';


--
-- Name: approval_notifications; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.approval_notifications (
    id uuid NOT NULL,
    instance_id uuid NOT NULL,
    step_id uuid,
    recipient_user_id character varying(255) NOT NULL,
    notification_type public.enum_approval_notifications_notification_type NOT NULL,
    subject character varying(255) NOT NULL,
    message text NOT NULL,
    status public.enum_approval_notifications_status DEFAULT 'pending'::public.enum_approval_notifications_status,
    sent_at timestamp with time zone,
    read_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id character varying(255)
);


ALTER TABLE public.approval_notifications OWNER TO admin;

--
-- Name: TABLE approval_notifications; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE public.approval_notifications IS 'Notification tracking for approval process';


--
-- Name: approval_steps; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.approval_steps (
    id uuid NOT NULL,
    instance_id uuid NOT NULL,
    step_number integer NOT NULL,
    step_name character varying(255),
    approver_role character varying(255),
    approver_user_id character varying(255),
    required_role character varying(255),
    status public.enum_approval_steps_status DEFAULT 'pending'::public.enum_approval_steps_status,
    decision public.enum_approval_steps_decision,
    comments text,
    conditions text,
    approved_at timestamp with time zone,
    due_date timestamp with time zone,
    escalated_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.approval_steps OWNER TO admin;

--
-- Name: TABLE approval_steps; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE public.approval_steps IS 'Individual approval steps within each instance';


--
-- Name: approval_workflows; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.approval_workflows (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    entity_type character varying(255) NOT NULL,
    workflow_steps json NOT NULL,
    approval_limits json,
    is_active boolean DEFAULT true,
    created_by character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.approval_workflows OWNER TO admin;

--
-- Name: TABLE approval_workflows; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE public.approval_workflows IS 'Configuration for different approval workflows';


--
-- Name: attendance_records; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.attendance_records (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    project_id character varying(255) NOT NULL,
    project_location_id character varying(255),
    clock_in_time timestamp with time zone NOT NULL,
    clock_in_latitude numeric(10,8),
    clock_in_longitude numeric(11,8),
    clock_in_address text,
    clock_in_photo_url character varying(500),
    clock_in_device_info jsonb,
    clock_in_notes text,
    clock_in_distance_meters numeric(10,2),
    clock_in_is_valid boolean DEFAULT true,
    clock_out_time timestamp with time zone,
    clock_out_latitude numeric(10,8),
    clock_out_longitude numeric(11,8),
    clock_out_address text,
    clock_out_photo_url character varying(500),
    clock_out_device_info jsonb,
    clock_out_notes text,
    clock_out_distance_meters numeric(10,2),
    clock_out_is_valid boolean,
    work_duration_minutes integer,
    attendance_date date NOT NULL,
    status character varying(50) DEFAULT 'clocked_in'::character varying,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.attendance_records OWNER TO admin;

--
-- Name: TABLE attendance_records; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE public.attendance_records IS 'Daily attendance records with GPS verification and selfie photos';


--
-- Name: COLUMN attendance_records.clock_in_distance_meters; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.attendance_records.clock_in_distance_meters IS 'Distance from project location (0 if within radius)';


--
-- Name: COLUMN attendance_records.work_duration_minutes; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.attendance_records.work_duration_minutes IS 'Auto-calculated work duration in minutes';


--
-- Name: attendance_monthly_summary; Type: VIEW; Schema: public; Owner: admin
--

CREATE VIEW public.attendance_monthly_summary AS
 SELECT attendance_records.user_id,
    attendance_records.project_id,
    date_trunc('month'::text, (attendance_records.attendance_date)::timestamp with time zone) AS month,
    count(*) AS total_days_present,
    count(*) FILTER (WHERE ((attendance_records.status)::text = 'late'::text)) AS total_days_late,
    count(*) FILTER (WHERE ((attendance_records.status)::text = 'early_leave'::text)) AS total_days_early_leave,
    count(*) FILTER (WHERE ((attendance_records.status)::text = 'incomplete'::text)) AS total_days_incomplete,
    avg(attendance_records.work_duration_minutes) FILTER (WHERE (attendance_records.work_duration_minutes IS NOT NULL)) AS avg_work_hours,
    sum(attendance_records.work_duration_minutes) AS total_work_minutes
   FROM public.attendance_records
  GROUP BY attendance_records.user_id, attendance_records.project_id, (date_trunc('month'::text, (attendance_records.attendance_date)::timestamp with time zone));


ALTER TABLE public.attendance_monthly_summary OWNER TO admin;

--
-- Name: VIEW attendance_monthly_summary; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON VIEW public.attendance_monthly_summary IS 'Monthly attendance statistics per user and project';


--
-- Name: attendance_settings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.attendance_settings (
    id character varying(255) NOT NULL,
    project_id character varying(255) NOT NULL,
    work_start_time time without time zone DEFAULT '08:00:00'::time without time zone NOT NULL,
    work_end_time time without time zone DEFAULT '17:00:00'::time without time zone NOT NULL,
    late_tolerance_minutes integer DEFAULT 15,
    early_leave_tolerance_minutes integer DEFAULT 15,
    require_gps_verification boolean DEFAULT true,
    max_distance_meters integer DEFAULT 100,
    allow_manual_location boolean DEFAULT false,
    require_clock_in_photo boolean DEFAULT true,
    require_clock_out_photo boolean DEFAULT false,
    has_break_time boolean DEFAULT true,
    break_start_time time without time zone DEFAULT '12:00:00'::time without time zone,
    break_end_time time without time zone DEFAULT '13:00:00'::time without time zone,
    work_days jsonb DEFAULT '["monday", "tuesday", "wednesday", "thursday", "friday"]'::jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.attendance_settings OWNER TO admin;

--
-- Name: TABLE attendance_settings; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE public.attendance_settings IS 'Configurable attendance rules and working hours per project';


--
-- Name: COLUMN attendance_settings.late_tolerance_minutes; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.attendance_settings.late_tolerance_minutes IS 'Grace period before marked as late (default 15 minutes)';


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(255),
    username character varying(255),
    action character varying(20) NOT NULL,
    entity_type character varying(100) NOT NULL,
    entity_id character varying(255),
    entity_name character varying(255),
    before jsonb,
    after jsonb,
    changes jsonb,
    ip_address character varying(45),
    user_agent text,
    method character varying(10),
    endpoint character varying(255),
    status_code integer,
    error_message text,
    duration integer,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO admin;

--
-- Name: backup_history; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.backup_history (
    id uuid NOT NULL,
    "backupType" public."enum_backup_history_backupType" DEFAULT 'FULL'::public."enum_backup_history_backupType" NOT NULL,
    "fileName" character varying(255) NOT NULL,
    "filePath" text NOT NULL,
    "fileSize" bigint,
    status public.enum_backup_history_status DEFAULT 'IN_PROGRESS'::public.enum_backup_history_status NOT NULL,
    "startedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp with time zone,
    duration integer,
    "databaseSize" bigint,
    "tableCount" integer,
    "rowCount" bigint,
    "compressionRatio" numeric(5,2),
    checksum character varying(64),
    "verifiedAt" timestamp with time zone,
    "isEncrypted" boolean DEFAULT false,
    "triggeredBy" character varying(50),
    "triggeredByUsername" character varying(100),
    "errorMessage" text,
    metadata jsonb,
    "retentionDays" integer DEFAULT 30,
    "expiresAt" timestamp with time zone,
    "isDeleted" boolean DEFAULT false,
    "deletedAt" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.backup_history OWNER TO admin;

--
-- Name: berita_acara; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.berita_acara (
    id uuid NOT NULL,
    project_id character varying(255) NOT NULL,
    milestone_id uuid,
    ba_number character varying(100) NOT NULL,
    ba_type public."enum_berita_acara_baType" DEFAULT 'partial'::public."enum_berita_acara_baType",
    work_description text NOT NULL,
    completion_percentage numeric(5,2) NOT NULL,
    completion_date timestamp with time zone NOT NULL,
    status public.enum_berita_acara_status DEFAULT 'draft'::public.enum_berita_acara_status,
    submitted_by character varying(255),
    submitted_at timestamp with time zone,
    reviewed_by character varying(255),
    reviewed_at timestamp with time zone,
    approved_by character varying(255),
    approved_at timestamp with time zone,
    rejection_reason text,
    payment_authorized boolean DEFAULT false,
    payment_amount numeric(15,2),
    payment_due_date timestamp with time zone,
    client_representative character varying(255),
    client_signature text,
    client_sign_date timestamp with time zone,
    client_notes text,
    photos json DEFAULT '[]'::json,
    documents json DEFAULT '[]'::json,
    notes text,
    work_location character varying(255),
    contract_reference character varying(255),
    quality_checklist json DEFAULT '[]'::json,
    created_by character varying(255),
    updated_by character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    witnesses jsonb DEFAULT '[]'::jsonb,
    contractor_signature text,
    status_history json DEFAULT '[]'::json
);


ALTER TABLE public.berita_acara OWNER TO admin;

--
-- Name: board_directors; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.board_directors (
    id character varying(255) NOT NULL,
    subsidiary_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    "position" character varying(255) NOT NULL,
    email character varying(255),
    phone character varying(50),
    appointment_date date NOT NULL,
    term_end_date date,
    is_active boolean DEFAULT true,
    education jsonb DEFAULT '{}'::jsonb,
    experience jsonb DEFAULT '[]'::jsonb,
    shareholding_percentage numeric(5,2) DEFAULT 0.00,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.board_directors OWNER TO admin;

--
-- Name: chart_of_accounts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.chart_of_accounts (
    id character varying(255) NOT NULL,
    account_code character varying(10) NOT NULL,
    account_name character varying(255) NOT NULL,
    account_type public.enum_chart_of_accounts_account_type NOT NULL,
    account_sub_type character varying(255),
    parent_account_id character varying(255),
    level integer DEFAULT 1 NOT NULL,
    normal_balance public.enum_chart_of_accounts_normal_balance NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_control_account boolean DEFAULT false NOT NULL,
    construction_specific boolean DEFAULT false NOT NULL,
    tax_deductible boolean,
    vat_applicable boolean DEFAULT false NOT NULL,
    project_cost_center boolean DEFAULT false NOT NULL,
    description text,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    current_balance numeric(15,2) DEFAULT 0,
    subsidiary_id character varying(50)
);


ALTER TABLE public.chart_of_accounts OWNER TO admin;

--
-- Name: COLUMN chart_of_accounts.account_code; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.chart_of_accounts.account_code IS 'Standard 4-level account code (e.g., 1101.01)';


--
-- Name: COLUMN chart_of_accounts.account_sub_type; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.chart_of_accounts.account_sub_type IS 'Current Asset, Fixed Asset, Current Liability, etc.';


--
-- Name: COLUMN chart_of_accounts.level; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.chart_of_accounts.level IS '1=Main, 2=Sub, 3=Detail, 4=Sub-detail';


--
-- Name: COLUMN chart_of_accounts.is_control_account; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.chart_of_accounts.is_control_account IS 'True if this account has sub-accounts';


--
-- Name: COLUMN chart_of_accounts.construction_specific; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.chart_of_accounts.construction_specific IS 'True for construction industry specific accounts';


--
-- Name: COLUMN chart_of_accounts.tax_deductible; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.chart_of_accounts.tax_deductible IS 'For expense accounts - tax deductibility';


--
-- Name: COLUMN chart_of_accounts.vat_applicable; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.chart_of_accounts.vat_applicable IS 'True if VAT applies to this account';


--
-- Name: COLUMN chart_of_accounts.project_cost_center; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.chart_of_accounts.project_cost_center IS 'True if this account can be allocated to projects';


--
-- Name: COLUMN chart_of_accounts.current_balance; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.chart_of_accounts.current_balance IS 'Saldo akun saat ini (untuk ASSET dan LIABILITY accounts)';


--
-- Name: delivery_receipts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.delivery_receipts (
    id character varying(255) NOT NULL,
    receipt_number character varying(255) NOT NULL,
    project_id character varying(255) NOT NULL,
    purchase_order_id character varying(255) NOT NULL,
    delivery_date timestamp with time zone NOT NULL,
    received_date timestamp with time zone NOT NULL,
    delivery_location text NOT NULL,
    received_by character varying(255) NOT NULL,
    receiver_name character varying(255) NOT NULL,
    receiver_position character varying(255),
    receiver_phone character varying(255),
    supplier_delivery_person character varying(255),
    supplier_delivery_phone character varying(255),
    vehicle_number character varying(255),
    delivery_method public.enum_delivery_receipts_delivery_method DEFAULT 'truck'::public.enum_delivery_receipts_delivery_method NOT NULL,
    status public.enum_delivery_receipts_status DEFAULT 'pending_delivery'::public.enum_delivery_receipts_status NOT NULL,
    receipt_type public.enum_delivery_receipts_receipt_type DEFAULT 'full_delivery'::public.enum_delivery_receipts_receipt_type NOT NULL,
    items jsonb NOT NULL,
    quality_notes text,
    condition_notes text,
    delivery_notes text,
    photos jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    inspection_result public.enum_delivery_receipts_inspection_result DEFAULT 'pending'::public.enum_delivery_receipts_inspection_result NOT NULL,
    inspected_by character varying(255),
    inspected_at timestamp with time zone,
    digital_signature text,
    approved_by character varying(255),
    approved_at timestamp with time zone,
    rejected_reason text,
    created_by character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.delivery_receipts OWNER TO admin;

--
-- Name: entities; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.entities (
    id character varying(255) NOT NULL,
    entity_code character varying(10) NOT NULL,
    entity_name character varying(255) NOT NULL,
    entity_type public.enum_entities_entity_type NOT NULL,
    parent_entity_id character varying(255),
    address text,
    is_active boolean DEFAULT true NOT NULL,
    description text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.entities OWNER TO admin;

--
-- Name: finance_transactions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.finance_transactions (
    id character varying(255) NOT NULL,
    type public.enum_finance_transactions_type NOT NULL,
    category character varying(255) NOT NULL,
    subcategory character varying(255),
    amount numeric(15,2) NOT NULL,
    description text,
    date date NOT NULL,
    project_id character varying(255),
    account_from character varying(255),
    account_to character varying(255),
    payment_method public.enum_finance_transactions_payment_method DEFAULT 'cash'::public.enum_finance_transactions_payment_method,
    reference_number character varying(255),
    status public.enum_finance_transactions_status DEFAULT 'completed'::public.enum_finance_transactions_status NOT NULL,
    is_recurring boolean DEFAULT false,
    recurring_pattern jsonb,
    attachments jsonb DEFAULT '[]'::jsonb,
    tags jsonb DEFAULT '[]'::jsonb,
    notes text,
    tax_info jsonb DEFAULT '{}'::jsonb,
    approved_by character varying(255),
    approved_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    purchase_order_id character varying(255)
);


ALTER TABLE public.finance_transactions OWNER TO admin;

--
-- Name: COLUMN finance_transactions.purchase_order_id; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.finance_transactions.purchase_order_id IS 'References PurchaseOrder.id for PO-related transactions';


--
-- Name: fixed_assets; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fixed_assets (
    id uuid NOT NULL,
    asset_code character varying(50) NOT NULL,
    asset_name character varying(255) NOT NULL,
    asset_category public.enum_fixed_assets_asset_category NOT NULL,
    asset_type character varying(100),
    description text,
    purchase_price numeric(15,2) NOT NULL,
    purchase_date timestamp with time zone NOT NULL,
    supplier character varying(255),
    invoice_number character varying(100),
    depreciation_method public.enum_fixed_assets_depreciation_method DEFAULT 'STRAIGHT_LINE'::public.enum_fixed_assets_depreciation_method,
    useful_life integer DEFAULT 5 NOT NULL,
    salvage_value numeric(15,2) DEFAULT 0,
    location character varying(255),
    department character varying(100),
    responsible_person character varying(255),
    cost_center character varying(50),
    status public.enum_fixed_assets_status DEFAULT 'ACTIVE'::public.enum_fixed_assets_status,
    condition public.enum_fixed_assets_condition DEFAULT 'GOOD'::public.enum_fixed_assets_condition,
    serial_number character varying(100),
    model_number character varying(100),
    manufacturer character varying(255),
    depreciation_start_date timestamp with time zone,
    accumulated_depreciation numeric(15,2) DEFAULT 0,
    book_value numeric(15,2),
    last_maintenance_date timestamp with time zone,
    next_maintenance_date timestamp with time zone,
    maintenance_cost numeric(15,2) DEFAULT 0,
    subsidiary_id uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.fixed_assets OWNER TO admin;

--
-- Name: inventory_items; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.inventory_items (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category character varying(255) NOT NULL,
    subcategory character varying(255),
    sku character varying(255),
    unit character varying(255) DEFAULT 'pcs'::character varying NOT NULL,
    current_stock numeric(10,2) DEFAULT 0 NOT NULL,
    minimum_stock numeric(10,2) DEFAULT 0 NOT NULL,
    maximum_stock numeric(10,2),
    unit_price numeric(12,2),
    total_value numeric(15,2),
    location character varying(255),
    warehouse character varying(255),
    supplier jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    last_stock_update timestamp with time zone,
    specifications jsonb DEFAULT '{}'::jsonb,
    images jsonb DEFAULT '[]'::jsonb,
    tags jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.inventory_items OWNER TO admin;

--
-- Name: journal_entries; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.journal_entries (
    id character varying(255) NOT NULL,
    entry_number character varying(255) NOT NULL,
    entry_date timestamp with time zone NOT NULL,
    reference character varying(255),
    description text NOT NULL,
    total_debit numeric(15,2) DEFAULT 0 NOT NULL,
    total_credit numeric(15,2) DEFAULT 0 NOT NULL,
    status public.enum_journal_entries_status DEFAULT 'DRAFT'::public.enum_journal_entries_status NOT NULL,
    project_id character varying(255),
    subsidiary_id character varying(255),
    created_by character varying(255) NOT NULL,
    posted_by character varying(255),
    posted_at timestamp with time zone,
    reversed boolean DEFAULT false NOT NULL,
    reversal_entry_id character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.journal_entries OWNER TO admin;

--
-- Name: COLUMN journal_entries.entry_number; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.journal_entries.entry_number IS 'Auto-generated journal entry number';


--
-- Name: COLUMN journal_entries.reference; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.journal_entries.reference IS 'Reference to source document';


--
-- Name: journal_entry_lines; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.journal_entry_lines (
    id character varying(255) NOT NULL,
    journal_entry_id character varying(255) NOT NULL,
    account_id character varying(255) NOT NULL,
    description text,
    debit_amount numeric(15,2) DEFAULT 0 NOT NULL,
    credit_amount numeric(15,2) DEFAULT 0 NOT NULL,
    project_id character varying(255),
    cost_center_id character varying(255),
    line_number integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.journal_entry_lines OWNER TO admin;

--
-- Name: leave_requests; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.leave_requests (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    project_id character varying(255),
    leave_type character varying(50) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_days integer NOT NULL,
    reason text NOT NULL,
    attachment_url character varying(500),
    status character varying(50) DEFAULT 'pending'::character varying,
    approved_by character varying(255),
    approved_at timestamp with time zone,
    rejection_reason text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.leave_requests OWNER TO admin;

--
-- Name: TABLE leave_requests; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE public.leave_requests IS 'Employee leave/cuti requests with approval workflow';


--
-- Name: COLUMN leave_requests.total_days; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.leave_requests.total_days IS 'Number of working days (excluding weekends)';


--
-- Name: login_history; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.login_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(255) NOT NULL,
    ip_address character varying(45),
    user_agent text,
    browser character varying(255),
    os character varying(255),
    device character varying(255),
    location character varying(255),
    country character varying(2),
    success boolean DEFAULT false NOT NULL,
    failure_reason character varying(255),
    login_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.login_history OWNER TO admin;

--
-- Name: manpower; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.manpower (
    id character varying(50) NOT NULL,
    employee_id character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    "position" character varying(255),
    department character varying(255),
    email character varying(255),
    phone character varying(50),
    join_date date,
    birth_date date,
    address text,
    status character varying(50) DEFAULT 'active'::character varying,
    employment_type character varying(50),
    salary numeric(15,2),
    current_project character varying(50),
    skills jsonb,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    subsidiary_id character varying(50)
);


ALTER TABLE public.manpower OWNER TO admin;

--
-- Name: milestone_activities; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.milestone_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    milestone_id uuid NOT NULL,
    activity_type character varying(50) NOT NULL,
    activity_title character varying(255) NOT NULL,
    activity_description text,
    performed_by character varying(255),
    performed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    related_photo_id uuid,
    related_cost_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.milestone_activities OWNER TO admin;

--
-- Name: COLUMN milestone_activities.metadata; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.milestone_activities.metadata IS 'Store old/new values, photo IDs, cost IDs, etc.';


--
-- Name: milestone_costs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.milestone_costs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    milestone_id uuid NOT NULL,
    cost_category character varying(50) NOT NULL,
    cost_type character varying(50) DEFAULT 'actual'::character varying,
    amount numeric(15,2) DEFAULT 0 NOT NULL,
    description text,
    reference_number character varying(100),
    recorded_by character varying(255),
    recorded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    approved_by character varying(255),
    approved_at timestamp without time zone,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by character varying(255),
    deleted_by character varying(255),
    deleted_at timestamp without time zone,
    account_id character varying(50),
    source_account_id character varying(50)
);


ALTER TABLE public.milestone_costs OWNER TO admin;

--
-- Name: COLUMN milestone_costs.reference_number; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.milestone_costs.reference_number IS 'PO number, invoice number, etc.';


--
-- Name: COLUMN milestone_costs.updated_by; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.milestone_costs.updated_by IS 'User who last updated this cost entry';


--
-- Name: COLUMN milestone_costs.deleted_by; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.milestone_costs.deleted_by IS 'User who soft-deleted this cost entry';


--
-- Name: COLUMN milestone_costs.deleted_at; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.milestone_costs.deleted_at IS 'Timestamp when cost entry was soft-deleted (soft delete)';


--
-- Name: COLUMN milestone_costs.account_id; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.milestone_costs.account_id IS 'Jenis/kategori pengeluaran (Expense account dari Chart of Accounts)';


--
-- Name: COLUMN milestone_costs.source_account_id; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.milestone_costs.source_account_id IS 'Sumber dana pembayaran (Bank/Kas dari Chart of Accounts)';


--
-- Name: milestone_dependencies; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.milestone_dependencies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    milestone_id uuid NOT NULL,
    depends_on_milestone_id uuid NOT NULL,
    dependency_type character varying(50) DEFAULT 'finish-to-start'::character varying,
    lag_days integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT no_self_dependency CHECK ((milestone_id <> depends_on_milestone_id))
);


ALTER TABLE public.milestone_dependencies OWNER TO admin;

--
-- Name: TABLE milestone_dependencies; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE public.milestone_dependencies IS 'Defines dependencies between milestones';


--
-- Name: milestone_items; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.milestone_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    milestone_id uuid NOT NULL,
    rab_item_id uuid,
    description text NOT NULL,
    unit character varying(50),
    quantity_planned numeric(15,2) DEFAULT 0,
    quantity_po numeric(15,2) DEFAULT 0,
    quantity_received numeric(15,2) DEFAULT 0,
    quantity_completed numeric(15,2) DEFAULT 0,
    quantity_remaining numeric(15,2) DEFAULT 0,
    value_planned numeric(15,2) DEFAULT 0,
    value_po numeric(15,2) DEFAULT 0,
    value_received numeric(15,2) DEFAULT 0,
    value_completed numeric(15,2) DEFAULT 0,
    value_paid numeric(15,2) DEFAULT 0,
    status character varying(50) DEFAULT 'planning'::character varying,
    progress_percentage integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT milestone_items_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100)))
);


ALTER TABLE public.milestone_items OWNER TO admin;

--
-- Name: TABLE milestone_items; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE public.milestone_items IS 'Tracks individual RAB items within a milestone';


--
-- Name: milestone_photos; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.milestone_photos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    milestone_id uuid NOT NULL,
    photo_url character varying(500) NOT NULL,
    photo_type character varying(50) DEFAULT 'progress'::character varying,
    title character varying(255),
    description text,
    taken_at timestamp without time zone,
    uploaded_by character varying(255),
    location_lat numeric(10,8),
    location_lng numeric(11,8),
    weather_condition character varying(50),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    thumbnail_url character varying(500)
);


ALTER TABLE public.milestone_photos OWNER TO admin;

--
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.notification_preferences (
    id character varying(50) NOT NULL,
    user_id character varying(50),
    push_enabled boolean DEFAULT true,
    email_enabled boolean DEFAULT true,
    sms_enabled boolean DEFAULT false,
    quiet_hours_start time without time zone,
    quiet_hours_end time without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notification_preferences OWNER TO admin;

--
-- Name: notification_tokens; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.notification_tokens (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    token text NOT NULL,
    device_type character varying(20) DEFAULT 'web'::character varying NOT NULL,
    browser_info jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true NOT NULL,
    last_used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notification_tokens OWNER TO admin;

--
-- Name: notification_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.notification_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notification_tokens_id_seq OWNER TO admin;

--
-- Name: notification_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.notification_tokens_id_seq OWNED BY public.notification_tokens.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.notifications (
    id character varying(50) NOT NULL,
    user_id character varying(50),
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(50) DEFAULT 'info'::character varying,
    priority character varying(20) DEFAULT 'normal'::character varying,
    data jsonb,
    channels character varying(50)[],
    read_at timestamp without time zone,
    sent_via character varying(100)[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO admin;

--
-- Name: progress_payments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.progress_payments (
    id uuid NOT NULL,
    project_id character varying(255) NOT NULL,
    berita_acara_id uuid NOT NULL,
    payment_schedule_id uuid,
    amount numeric(15,2) NOT NULL,
    percentage numeric(5,2) NOT NULL,
    due_date timestamp with time zone NOT NULL,
    status public.enum_progress_payments_status DEFAULT 'pending_ba'::public.enum_progress_payments_status,
    ba_approved_at timestamp with time zone,
    payment_approved_by character varying(255),
    payment_approved_at timestamp with time zone,
    processing_started_at timestamp with time zone,
    paid_at timestamp with time zone,
    invoice_number character varying(255),
    invoice_date timestamp with time zone,
    payment_reference character varying(255),
    tax_amount numeric(15,2) DEFAULT 0,
    retention_amount numeric(15,2) DEFAULT 0,
    net_amount numeric(15,2) NOT NULL,
    approval_workflow json DEFAULT '[]'::json,
    payment_method public."enum_progress_payments_paymentMethod" DEFAULT 'bank_transfer'::public."enum_progress_payments_paymentMethod",
    notes text,
    approval_notes text,
    created_by character varying(255),
    updated_by character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    invoice_sent boolean DEFAULT false NOT NULL,
    invoice_sent_at timestamp without time zone,
    invoice_sent_by character varying(255),
    invoice_sent_notes text,
    invoice_recipient character varying(255),
    delivery_method character varying(50),
    delivery_evidence character varying(500),
    payment_evidence character varying(500),
    payment_received_bank character varying(100),
    payment_confirmation text
);


ALTER TABLE public.progress_payments OWNER TO admin;

--
-- Name: project_additional_expenses; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.project_additional_expenses (
    id uuid NOT NULL,
    project_id character varying(255) NOT NULL,
    expense_type public.enum_project_additional_expenses_expense_type DEFAULT 'other'::public.enum_project_additional_expenses_expense_type NOT NULL,
    category character varying(100),
    description text NOT NULL,
    amount numeric(15,2) DEFAULT 0 NOT NULL,
    related_milestone_id uuid,
    related_rab_item_id uuid,
    recipient_name character varying(255),
    payment_method public.enum_project_additional_expenses_payment_method DEFAULT 'cash'::public.enum_project_additional_expenses_payment_method,
    receipt_url character varying(500),
    notes text,
    approved_by character varying(255),
    approved_at timestamp with time zone,
    approval_status public.enum_project_additional_expenses_approval_status DEFAULT 'pending'::public.enum_project_additional_expenses_approval_status NOT NULL,
    rejection_reason text,
    expense_date timestamp with time zone NOT NULL,
    created_by character varying(255),
    updated_by character varying(255),
    deleted_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.project_additional_expenses OWNER TO admin;

--
-- Name: project_documents; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.project_documents (
    id uuid NOT NULL,
    project_id character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    type public.enum_project_documents_type NOT NULL,
    category character varying(255),
    file_name character varying(255) NOT NULL,
    original_name character varying(255) NOT NULL,
    file_path character varying(255) NOT NULL,
    file_size integer NOT NULL,
    mime_type character varying(255) NOT NULL,
    version character varying(255) DEFAULT '1.0'::character varying,
    status public.enum_project_documents_status DEFAULT 'draft'::public.enum_project_documents_status,
    tags json,
    metadata json,
    uploaded_by character varying(255),
    approved_by character varying(255),
    approved_at timestamp with time zone,
    access_level public."enum_project_documents_accessLevel" DEFAULT 'team'::public."enum_project_documents_accessLevel",
    download_count integer DEFAULT 0,
    notes text,
    created_by character varying(255),
    updated_by character varying(255),
    is_public boolean DEFAULT false,
    last_accessed timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.project_documents OWNER TO admin;

--
-- Name: project_locations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.project_locations (
    id character varying(255) NOT NULL,
    project_id character varying(255) NOT NULL,
    location_name character varying(200) NOT NULL,
    latitude numeric(10,8) NOT NULL,
    longitude numeric(11,8) NOT NULL,
    radius_meters integer DEFAULT 100 NOT NULL,
    address text,
    is_active boolean DEFAULT true,
    created_by character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.project_locations OWNER TO admin;

--
-- Name: TABLE project_locations; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE public.project_locations IS 'GPS locations for project sites with verification radius';


--
-- Name: COLUMN project_locations.radius_meters; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.project_locations.radius_meters IS 'Allowed distance from location center (default 100m)';


--
-- Name: project_milestones; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.project_milestones (
    id uuid NOT NULL,
    project_id character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    target_date timestamp with time zone NOT NULL,
    completed_date timestamp with time zone,
    status public.enum_project_milestones_status DEFAULT 'pending'::public.enum_project_milestones_status,
    progress integer DEFAULT 0,
    deliverables json,
    dependencies json,
    assigned_to character varying(255),
    priority public.enum_project_milestones_priority DEFAULT 'medium'::public.enum_project_milestones_priority,
    notes text,
    created_by character varying(255),
    updated_by character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    budget numeric(15,2) DEFAULT 0,
    actual_cost numeric(15,2) DEFAULT 0,
    category_link jsonb,
    workflow_progress jsonb,
    alerts jsonb DEFAULT '[]'::jsonb,
    auto_generated boolean DEFAULT false,
    last_synced timestamp without time zone
);


ALTER TABLE public.project_milestones OWNER TO admin;

--
-- Name: COLUMN project_milestones.budget; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.project_milestones.budget IS 'Budget allocated for this milestone';


--
-- Name: COLUMN project_milestones.actual_cost; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.project_milestones.actual_cost IS 'Actual cost spent on this milestone';


--
-- Name: COLUMN project_milestones.category_link; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.project_milestones.category_link IS 'Links milestone to RAB category';


--
-- Name: COLUMN project_milestones.workflow_progress; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.project_milestones.workflow_progress IS 'Tracks workflow stages';


--
-- Name: COLUMN project_milestones.alerts; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.project_milestones.alerts IS 'Active alerts for this milestone';


--
-- Name: COLUMN project_milestones.auto_generated; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.project_milestones.auto_generated IS 'Was this milestone auto-suggested from RAB?';


--
-- Name: COLUMN project_milestones.last_synced; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.project_milestones.last_synced IS 'Last time workflow data was synced';


--
-- Name: project_rab; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.project_rab (
    id uuid NOT NULL,
    project_id character varying(255) NOT NULL,
    category character varying(255) NOT NULL,
    description text NOT NULL,
    unit character varying(255) NOT NULL,
    quantity numeric(10,2) DEFAULT 0 NOT NULL,
    unit_price numeric(15,2) DEFAULT 0 NOT NULL,
    total_price numeric(15,2) DEFAULT 0 NOT NULL,
    notes text,
    is_approved boolean DEFAULT false,
    approved_by character varying(255),
    approved_at timestamp with time zone,
    created_by character varying(255),
    updated_by character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    status public.enum_project_rab_status DEFAULT 'draft'::public.enum_project_rab_status,
    item_type public.rab_item_type DEFAULT 'material'::public.rab_item_type
);


ALTER TABLE public.project_rab OWNER TO admin;

--
-- Name: COLUMN project_rab.item_type; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.project_rab.item_type IS 'Type of RAB item: material (bahan), service (jasa), labor (tenaga kerja), equipment (peralatan), overhead (overhead)';


--
-- Name: project_team_members; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.project_team_members (
    id uuid NOT NULL,
    project_id character varying(255) NOT NULL,
    employee_id character varying(255),
    name character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    department character varying(255),
    skills json,
    responsibilities text,
    allocation numeric(5,2),
    hourly_rate numeric(10,2),
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    status public.enum_project_team_members_status DEFAULT 'active'::public.enum_project_team_members_status,
    contact json,
    notes text,
    created_by character varying(255),
    updated_by character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id character varying(255)
);


ALTER TABLE public.project_team_members OWNER TO admin;

--
-- Name: COLUMN project_team_members.allocation; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.project_team_members.allocation IS 'Percentage allocation to project (0-100)';


--
-- Name: projects; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.projects (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    client_name character varying(255) NOT NULL,
    client_contact jsonb DEFAULT '{}'::jsonb,
    location jsonb DEFAULT '{}'::jsonb,
    budget numeric(15,2),
    actual_cost numeric(15,2) DEFAULT 0,
    status public.enum_projects_status DEFAULT 'planning'::public.enum_projects_status NOT NULL,
    priority public.enum_projects_priority DEFAULT 'medium'::public.enum_projects_priority NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    start_date date,
    end_date date,
    estimated_duration integer,
    project_manager_id character varying(255),
    subsidiary_id character varying(255),
    created_by character varying(255),
    updated_by character varying(255),
    subsidiary_info jsonb DEFAULT '{}'::jsonb,
    team jsonb DEFAULT '[]'::jsonb,
    milestones jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    notes text,
    tags jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.projects OWNER TO admin;

--
-- Name: COLUMN projects.estimated_duration; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.projects.estimated_duration IS 'Duration in days';


--
-- Name: COLUMN projects.created_by; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.projects.created_by IS 'User ID who created this project';


--
-- Name: COLUMN projects.updated_by; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.projects.updated_by IS 'User ID who last updated this project';


--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.purchase_orders (
    id character varying(255) NOT NULL,
    po_number character varying(255) NOT NULL,
    supplier_id character varying(255) NOT NULL,
    supplier_name character varying(255) NOT NULL,
    order_date timestamp with time zone NOT NULL,
    expected_delivery_date timestamp with time zone,
    status public.enum_purchase_orders_status DEFAULT 'draft'::public.enum_purchase_orders_status NOT NULL,
    items jsonb DEFAULT '[]'::jsonb NOT NULL,
    subtotal numeric(15,2) DEFAULT 0 NOT NULL,
    tax_amount numeric(15,2) DEFAULT 0 NOT NULL,
    total_amount numeric(15,2) DEFAULT 0 NOT NULL,
    notes text,
    delivery_address text,
    terms text,
    project_id character varying(255),
    created_by character varying(255),
    approved_by character varying(255),
    approved_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.purchase_orders OWNER TO admin;

--
-- Name: rab_items; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.rab_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id character varying(32) NOT NULL,
    category character varying(128) NOT NULL,
    description text,
    quantity numeric(15,2) DEFAULT 0 NOT NULL,
    unit_price numeric(15,2) DEFAULT 0 NOT NULL,
    unit character varying(32),
    approval_status character varying(32) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rab_items OWNER TO admin;

--
-- Name: TABLE rab_items; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE public.rab_items IS 'RAB items for project budgeting and milestone integration.';


--
-- Name: COLUMN rab_items.category; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.rab_items.category IS 'Category name for grouping RAB items.';


--
-- Name: COLUMN rab_items.approval_status; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.rab_items.approval_status IS 'Approval status: approved, pending, rejected, etc.';


--
-- Name: rab_purchase_tracking; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.rab_purchase_tracking (
    id integer NOT NULL,
    project_id character varying(255) NOT NULL,
    rab_item_id character varying(255) NOT NULL,
    po_number character varying(255),
    quantity numeric(10,2) NOT NULL,
    unit_price numeric(15,2) NOT NULL,
    total_amount numeric(15,2) NOT NULL,
    purchase_date timestamp with time zone NOT NULL,
    status public.enum_rab_purchase_tracking_status DEFAULT 'pending'::public.enum_rab_purchase_tracking_status,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.rab_purchase_tracking OWNER TO admin;

--
-- Name: rab_purchase_tracking_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.rab_purchase_tracking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rab_purchase_tracking_id_seq OWNER TO admin;

--
-- Name: rab_purchase_tracking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.rab_purchase_tracking_id_seq OWNED BY public.rab_purchase_tracking.id;


--
-- Name: rab_work_order_tracking; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.rab_work_order_tracking (
    id integer NOT NULL,
    project_id character varying(255) NOT NULL,
    rab_item_id character varying(255) NOT NULL,
    wo_number character varying(255),
    quantity numeric(10,2) NOT NULL,
    unit_price numeric(15,2) NOT NULL,
    total_amount numeric(15,2) NOT NULL,
    work_date timestamp with time zone NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.rab_work_order_tracking OWNER TO admin;

--
-- Name: TABLE rab_work_order_tracking; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE public.rab_work_order_tracking IS 'Tracking table for RAB items used in work orders';


--
-- Name: rab_work_order_tracking_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.rab_work_order_tracking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rab_work_order_tracking_id_seq OWNER TO admin;

--
-- Name: rab_work_order_tracking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.rab_work_order_tracking_id_seq OWNED BY public.rab_work_order_tracking.id;


--
-- Name: sequelize_meta; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.sequelize_meta (
    name character varying(255) NOT NULL
);


ALTER TABLE public.sequelize_meta OWNER TO admin;

--
-- Name: subsidiaries; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.subsidiaries (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    description text,
    specialization public.enum_subsidiaries_specialization DEFAULT 'general'::public.enum_subsidiaries_specialization NOT NULL,
    contact_info jsonb DEFAULT '{}'::jsonb,
    address jsonb DEFAULT '{}'::jsonb,
    established_year integer,
    employee_count integer DEFAULT 0,
    certification jsonb DEFAULT '[]'::jsonb,
    status public.enum_subsidiaries_status DEFAULT 'active'::public.enum_subsidiaries_status NOT NULL,
    parent_company character varying(255) DEFAULT 'Nusantara Group'::character varying,
    board_of_directors jsonb DEFAULT '[]'::jsonb,
    legal_info jsonb DEFAULT '{"businessLicenseNumber": null, "vatRegistrationNumber": null, "articlesOfIncorporation": null, "taxIdentificationNumber": null, "companyRegistrationNumber": null}'::jsonb,
    permits jsonb DEFAULT '[]'::jsonb,
    financial_info jsonb DEFAULT '{"currency": "IDR", "fiscalYearEnd": null, "paidUpCapital": null, "authorizedCapital": null}'::jsonb,
    attachments jsonb DEFAULT '[]'::jsonb,
    profile_info jsonb DEFAULT '{"website": null, "companySize": null, "socialMedia": {}, "businessDescription": null, "industryClassification": null}'::jsonb,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    logo character varying(500)
);


ALTER TABLE public.subsidiaries OWNER TO admin;

--
-- Name: COLUMN subsidiaries.logo; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.subsidiaries.logo IS 'Path to company logo file (relative path from uploads directory)';


--
-- Name: tax_records; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.tax_records (
    id character varying(255) NOT NULL,
    type public.enum_tax_records_type NOT NULL,
    description text,
    period character varying(255) NOT NULL,
    base_amount numeric(15,2) DEFAULT 0 NOT NULL,
    tax_rate numeric(5,2) DEFAULT 0 NOT NULL,
    tax_amount numeric(15,2) DEFAULT 0 NOT NULL,
    is_paid boolean DEFAULT false NOT NULL,
    paid_date timestamp with time zone,
    due_date timestamp with time zone,
    payment_reference character varying(255),
    documents jsonb DEFAULT '[]'::jsonb,
    notes text,
    status public.enum_tax_records_status DEFAULT 'draft'::public.enum_tax_records_status NOT NULL,
    filing_reference character varying(255),
    project_id character varying(255),
    created_by character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.tax_records OWNER TO admin;

--
-- Name: COLUMN tax_records.period; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.tax_records.period IS 'Format: YYYY-MM';


--
-- Name: COLUMN tax_records.tax_rate; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.tax_records.tax_rate IS 'Tax rate in percentage';


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'supervisor'::public.enum_users_role NOT NULL,
    profile jsonb DEFAULT '{}'::jsonb,
    permissions jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    last_login timestamp with time zone,
    login_attempts integer DEFAULT 0,
    lock_until timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: work_orders; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.work_orders (
    id character varying(255) NOT NULL,
    wo_number character varying(255) NOT NULL,
    contractor_id character varying(255),
    contractor_name character varying(255) NOT NULL,
    contractor_contact character varying(255) NOT NULL,
    contractor_address text,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    status public.enum_work_orders_status DEFAULT 'draft'::public.enum_work_orders_status NOT NULL,
    items jsonb DEFAULT '[]'::jsonb NOT NULL,
    total_amount numeric(15,2) DEFAULT 0 NOT NULL,
    notes text,
    project_id character varying(255),
    created_by character varying(255),
    updated_by character varying(255),
    approved_by character varying(255),
    approved_at timestamp with time zone,
    approval_notes text,
    rejected_by character varying(255),
    rejected_at timestamp with time zone,
    rejection_reason text,
    deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    deleted_by character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.work_orders OWNER TO admin;

--
-- Name: TABLE work_orders; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE public.work_orders IS 'Work orders for services, labor, equipment, and overhead items';


--
-- Name: notification_tokens id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notification_tokens ALTER COLUMN id SET DEFAULT nextval('public.notification_tokens_id_seq'::regclass);


--
-- Name: rab_purchase_tracking id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rab_purchase_tracking ALTER COLUMN id SET DEFAULT nextval('public.rab_purchase_tracking_id_seq'::regclass);


--
-- Name: rab_work_order_tracking id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rab_work_order_tracking ALTER COLUMN id SET DEFAULT nextval('public.rab_work_order_tracking_id_seq'::regclass);


--
-- Data for Name: active_sessions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.active_sessions (id, user_id, token, ip_address, user_agent, browser, os, device, location, country, created_at, last_active, expires_at) FROM stdin;
146203fb-1df6-4ccc-ac5f-331b318c8a7f	USR-IT-HADEZ-001	850f80ffcfc6413603d697b6cfbdb142d6f1242471ff3f91db7795cb0cd9c3f3	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-18 14:10:04.425	2025-10-18 14:10:04.425	2025-10-19 14:10:04.418
b1dbb6f1-8661-4d0c-a779-2e692e0806c9	USR-IT-HADEZ-001	b3ccd8003a6ea4bc42b3813c68efd3234558b31fbbf8e5ddd2f27933e1ef358e	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-18 14:36:14.039	2025-10-18 14:36:14.039	2025-10-19 14:36:14.032
95e0dc41-312a-45af-b87a-3cf23d9e75cb	USR-IT-HADEZ-001	3c7b1ed8adb2bb5dcfd7968cff72cc778fb6096af47421095204d586febee8c6	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-18 14:38:14.208	2025-10-18 14:38:14.208	2025-10-19 14:38:14.203
b33cfe9c-cdfb-455c-982e-734c8354d081	USR-IT-HADEZ-001	995b7c564de90aa546a5985b803eaeb939e11819214724cb3cf787fabe1e77ca	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-18 15:52:31.432	2025-10-18 15:52:31.432	2025-10-19 15:52:31.426
09fb846b-1b7a-4b8f-ba8d-e7e0a918e7fa	USR-IT-HADEZ-001	142e53a06fdf47ef03cab0c1c94feebb4a70af2396039840896d525d0b4e3fd0	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-18 15:52:55.388	2025-10-18 15:52:55.388	2025-10-19 15:52:55.384
6dcf598f-0dff-44d6-8a99-772986a0647d	USR-IT-HADEZ-001	01ad2e35dfda8f6d251f104706bb0017a6b6d385465d2cc955fdff5e3e4b0347	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-18 15:53:04.53	2025-10-18 15:53:04.53	2025-10-19 15:53:04.528
78d0f8f2-fbab-41d9-8394-67b8fa833287	USR-IT-HADEZ-001	fc5e717bff3892a72c64bef63d6e3cb1a9c7d82aa7ac4d031d2e3c022b074377	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	Safari	macOS	Mobile	Unknown	XX	2025-10-18 17:32:18.868	2025-10-18 17:32:18.868	2025-10-19 17:32:18.858
0c1e8758-b0c4-4d23-b2d9-898bd38780ad	USR-IT-HADEZ-001	0ff8b27b33c271b90d01302899e2c073fccc41c89e252572414a11db72f898a0	::ffff:172.20.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	Chrome	macOS	Desktop	Unknown	XX	2025-10-19 09:19:35.384	2025-10-19 09:19:35.384	2025-10-20 09:19:35.363
e32440fe-60d9-444c-a00c-e026753390cf	USR-IT-HADEZ-001	e4f33fd156849045897618ab1cedf8dd16f7c090f00abc3e85f441bdd363e57d	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	2025-10-19 11:34:29.727	2025-10-19 11:34:29.727	2025-10-20 11:34:29.723
accbae81-2c54-4216-8cc2-f9ceaa9d4c0c	USR-IT-HADEZ-001	007841d5a35341597cabf2b7ce395131a25444d0662b9c45bb6eeb8d363658a7	::ffff:172.20.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	Safari	macOS	Mobile	Unknown	XX	2025-10-19 19:33:41.471	2025-10-19 19:33:41.471	2025-10-20 19:33:41.463
e9974ace-9951-4af8-824b-45f94ec66409	USR-IT-HADEZ-001	fa72973b756fd86b4374537ec3169c5b434e2076d6d66600250ee4c2fdb9578d	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	2025-10-19 20:05:59.595	2025-10-19 20:05:59.595	2025-10-20 20:05:59.59
83720406-2b0a-4d3d-b44b-1016d9b9f3eb	USR-IT-HADEZ-001	f151db7cddbeab5b86f385197ab66f998c18586688edf059519b73af5bb00090	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	2025-10-19 20:37:22.009	2025-10-19 20:37:22.009	2025-10-20 20:37:22.003
961b63e4-acb2-46b2-aefd-4a5c9bd980eb	USR-IT-HADEZ-001	72f43b844054ac41071adb259fc2e02b303c87901de4a166a6758934f8df02a1	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	2025-10-19 20:40:38.64	2025-10-19 20:40:38.64	2025-10-20 20:40:38.637
787273ef-5c81-483d-be61-0b7f74446240	USR-IT-HADEZ-001	f7b9465738113e813fc8c242b7566ebed665e8b34c0664a8dda63bedd85daf3d	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-19 20:42:18.177	2025-10-19 20:42:18.177	2025-10-20 20:42:18.174
5888d373-5741-4abe-a4f9-2fe1941d8d1a	USR-IT-HADEZ-001	4fdf72b619b3adfc40483c7ee9a7463158f1a649a8c448561098e1e4ce25bfd2	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	2025-10-19 20:53:40.917	2025-10-19 20:53:40.917	2025-10-20 20:53:40.911
18561dea-bab4-4996-aa1c-5be1cdf63b4d	USR-IT-HADEZ-001	1e3c6b1b253170ff7dfd10b1375ba896d7dbd956b1dd9c1070f70f843a5a2f69	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	2025-10-19 21:30:48.44	2025-10-19 21:30:48.44	2025-10-20 21:30:48.436
27ad6f83-049b-405f-b3e2-c5088342d7d4	USR-IT-HADEZ-001	0305301e4ad461ddfde1968f08fdcd46e59c617d10e810575cc49e370c60cffd	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	2025-10-19 21:36:32.601	2025-10-19 21:36:32.601	2025-10-20 21:36:32.598
6fe20f2c-92bf-4ff8-a6bf-3ebf35a84fac	USR-MGR-AZMY-001	2723582d6a257e56de1838f07be3a8035bd62c33c0fff7dfb304781146294c2a	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	2025-10-19 21:48:59.519	2025-10-19 21:48:59.519	2025-10-20 21:48:59.516
9241b2f5-07ea-418d-becc-8a2f31b07b3d	USR-MGR-AZMY-001	38fe5cd9b9bc9759bbb4a42a8b892630ab796a2cbbcba59fea21a21fa67d5bc3	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-19 21:55:16.964	2025-10-19 21:55:16.964	2025-10-20 21:55:16.961
56bd6535-197d-4882-b5de-73dacf2bac49	USR-MGR-AZMY-001	e79c4b81ccf13d016d65a9f30072e761fddb88f54fb06ef12376edf526801c42	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-19 21:58:01.581	2025-10-19 21:58:01.581	2025-10-20 21:58:01.577
adbc4d66-9178-4966-a741-72ff50464656	USR-MGR-AZMY-001	4314fad1b05c4e59a6a5da8294cd204f8d3ba3c022df07016d268f7ad6641ad9	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-19 21:59:15.23	2025-10-19 21:59:15.23	2025-10-20 21:59:15.223
22dcaa94-f5ed-40aa-b38e-7056339275aa	USR-MGR-AZMY-001	9f34eb21f5811712c4366878911cc637a522562acdf707f4a14aa9b3dd7d5224	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-19 21:59:28.382	2025-10-19 21:59:28.382	2025-10-20 21:59:28.379
520752c5-1e59-4330-a2e8-ced4c57a780a	USR-MGR-AZMY-001	f95e170db0e312e588609593f54b992fd19046f0e63e25857b905ad96ade694d	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-19 21:59:46.533	2025-10-19 21:59:46.533	2025-10-20 21:59:46.53
099ddea2-abf9-471f-b881-57261d5e0f07	USR-MGR-AZMY-001	30bdbff737e2b9438ecce8900c1c7d441eb162a57b1b7cab2757b66427938593	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-19 22:07:21.078	2025-10-19 22:07:21.078	2025-10-20 22:07:21.074
95849abd-c1ce-4be5-b831-0d04aa541803	USR-IT-HADEZ-001	696fb0025df9f2937b5f62d340ec93d3101e50c933dad75c4e1cbba45c37700d	::ffff:172.20.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	Chrome	macOS	Desktop	Unknown	XX	2025-10-19 22:22:37.051	2025-10-19 22:22:37.051	2025-10-20 22:22:37.046
0c89ada3-8672-4aa6-9110-83283fab9118	USR-MGR-AZMY-001	50218746305cab6d458b6087fe4abd6999f1fd43923182f6b9b48f3a2f39f9d2	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	2025-10-20 04:42:33.49	2025-10-20 04:42:33.49	2025-10-21 04:42:33.483
\.


--
-- Data for Name: approval_instances; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.approval_instances (id, workflow_id, entity_id, entity_type, entity_data, current_step, overall_status, total_amount, submitted_by, submitted_at, completed_at, comments, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: approval_notifications; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.approval_notifications (id, instance_id, step_id, recipient_user_id, notification_type, subject, message, status, sent_at, read_at, created_at, updated_at, user_id) FROM stdin;
\.


--
-- Data for Name: approval_steps; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.approval_steps (id, instance_id, step_number, step_name, approver_role, approver_user_id, required_role, status, decision, comments, conditions, approved_at, due_date, escalated_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: approval_workflows; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.approval_workflows (id, name, description, entity_type, workflow_steps, approval_limits, is_active, created_by, created_at, updated_at) FROM stdin;
4ae52c03-29fa-4053-bab6-8720966613a7	RAB Standard Approval	Standard multi-level approval workflow for RAB	rab	[\n  {"step": 1, "name": "Project Manager Review", "role": "project_manager", "required": true, "parallel": false, "conditions": {"max_amount": 500000000}},\n  {"step": 2, "name": "Operations Director Approval", "role": "director", "required": true, "parallel": false, "conditions": {"min_amount": 100000000, "max_amount": 2000000000}},\n  {"step": 3, "name": "Board of Directors Approval", "role": "board", "required": true, "parallel": false, "conditions": {"min_amount": 1000000000}}\n]	{"project_manager": 500000000, "director": 2000000000, "board": 999999999999}	t	system	2025-09-09 19:06:45.867618+07	2025-09-09 19:55:53.121315+07
482a0e51-1469-4315-b9a0-4f36f50a4468	RAB Construction Standard	Multi-level RAB approval sesuai standar konstruksi Indonesia	rab	[{"step": 1, "name": "Project Manager Review", "role": "project_manager", "required": true, "parallel": false, "conditions": {"max_amount": 500000000, "technical_validation": true, "quantity_check": true}, "sla_hours": 24}, {"step": 2, "name": "Site Manager Validation", "role": "site_manager", "required": true, "parallel": false, "conditions": {"min_amount": 100000000, "max_amount": 1000000000, "field_feasibility": true, "safety_compliance": true}, "sla_hours": 48}, {"step": 3, "name": "Operations Director Approval", "role": "operations_director", "required": true, "parallel": false, "conditions": {"min_amount": 500000000, "max_amount": 2000000000, "strategic_alignment": true, "risk_assessment": true}, "sla_hours": 72}]	{"project_manager": 500000000, "site_manager": 1000000000, "operations_director": 2000000000}	t	system	2025-09-15 01:14:42.727718+07	2025-09-15 01:14:42.727718+07
46065a3d-4994-466e-bb03-da6f26f3abeb	PO Construction Standard	Purchase Order approval untuk material konstruksi	purchase_order	[{"step": 1, "name": "Procurement Review", "role": "procurement_officer", "required": true, "parallel": false, "conditions": {"max_amount": 250000000, "vendor_verification": true, "specification_match": true}, "sla_hours": 24}, {"step": 2, "name": "Finance Director Approval", "role": "finance_director", "required": true, "parallel": false, "conditions": {"min_amount": 100000000, "max_amount": 1500000000, "budget_availability": true, "cash_flow_check": true}, "sla_hours": 48}, {"step": 3, "name": "Board Member Approval", "role": "board_member", "required": true, "parallel": false, "conditions": {"min_amount": 1000000000, "strategic_importance": true, "governance_review": true}, "sla_hours": 120}]	{"procurement_officer": 250000000, "finance_director": 1500000000, "board_member": 5000000000}	t	system	2025-09-15 01:16:06.36753+07	2025-09-15 01:16:06.36753+07
48bb2e25-3d3f-4b50-be3b-5dd66379f50d	Change Order Construction	Change order approval untuk perubahan konstruksi	change_order	[{"step": 1, "name": "Site Engineer Review", "role": "site_engineer", "required": true, "parallel": false, "conditions": {"max_amount": 100000000, "technical_impact": true, "schedule_impact": true}, "sla_hours": 24}, {"step": 2, "name": "Project Manager Approval", "role": "project_manager", "required": true, "parallel": false, "conditions": {"max_amount": 500000000, "scope_validation": true, "client_notification": true}, "sla_hours": 48}, {"step": 3, "name": "Operations Director Final", "role": "operations_director", "required": true, "parallel": false, "conditions": {"min_amount": 200000000, "business_impact": true, "risk_mitigation": true}, "sla_hours": 72}]	{"site_engineer": 100000000, "project_manager": 500000000, "operations_director": 2000000000}	t	system	2025-09-15 01:17:17.620725+07	2025-09-15 01:17:17.620725+07
\.


--
-- Data for Name: attendance_records; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.attendance_records (id, user_id, project_id, project_location_id, clock_in_time, clock_in_latitude, clock_in_longitude, clock_in_address, clock_in_photo_url, clock_in_device_info, clock_in_notes, clock_in_distance_meters, clock_in_is_valid, clock_out_time, clock_out_latitude, clock_out_longitude, clock_out_address, clock_out_photo_url, clock_out_device_info, clock_out_notes, clock_out_distance_meters, clock_out_is_valid, work_duration_minutes, attendance_date, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: attendance_settings; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.attendance_settings (id, project_id, work_start_time, work_end_time, late_tolerance_minutes, early_leave_tolerance_minutes, require_gps_verification, max_distance_meters, allow_manual_location, require_clock_in_photo, require_clock_out_photo, has_break_time, break_start_time, break_end_time, work_days, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.audit_logs (id, user_id, username, action, entity_type, entity_id, entity_name, before, after, changes, ip_address, user_agent, method, endpoint, status_code, error_message, duration, metadata, created_at) FROM stdin;
f197c995-0970-4c1f-891a-9e01bc823335	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-18 14:36:14.043
176f6121-d616-499d-afb2-3771e9583bcf	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	200	\N	153	\N	2025-10-18 14:36:14.05
bf584182-9555-4efb-bfff-90abdf22898f	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-18 14:38:14.213
a2d37913-dd20-4b2f-aca4-c60ec7e4b96a	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	200	\N	145	\N	2025-10-18 14:38:14.221
8aca677a-3113-4b5a-b3a0-5b4f4b402a6b	USR-IT-HADEZ-001	hadez	EXPORT	audit_logs	\N	audit_logs_export.csv	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	GET	/export	\N	\N	\N	{"format": "csv", "filters": {}}	2025-10-18 14:42:36.431
bffc383d-f046-489d-9e0a-bdd8c7caa989	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-18 15:52:31.435
ad61dda4-f3f4-4117-a661-a6022e7cc0f0	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	200	\N	119	\N	2025-10-18 15:52:31.441
722a66d2-e0c6-4c9f-9ba6-247d773513be	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-18 15:52:55.392
7e105ffb-bd55-4e74-ac38-c6d8e00f37bf	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	200	\N	108	\N	2025-10-18 15:52:55.398
b54950bf-fe58-4582-a031-b1fb01ee27dd	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-18 15:53:04.533
21cd2823-e1e4-4623-8688-5b5eba3ec1a6	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	200	\N	94	\N	2025-10-18 15:53:04.536
e0adbbf2-142a-4ff9-b3de-15c1c5d08346	USR-IT-HADEZ-001	hadez	CREATE	unknown	\N	\N	\N	{"uniqno": 1, "_changed": {}, "_options": {"raw": true, "_schema": null, "attributes": ["id", "backupType", "fileName", "filePath", "fileSize", "status", "startedAt", "completedAt", "duration", "databaseSize", "tableCount", "rowCount", "compressionRatio", "checksum", "verifiedAt", "isEncrypted", "triggeredBy", "triggeredByUsername", "errorMessage", "metadata", "retentionDays", "expiresAt", "isDeleted", "deletedAt", "createdAt", "updatedAt"], "isNewRecord": false, "_schemaDelimiter": ""}, "dataValues": {"id": "c703e294-54dd-4b72-83a9-707ab87ecf21", "status": "VERIFIED", "checksum": "59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2", "duration": 0, "fileName": "nusantara_backup_2025-10-18T15-58-38.sql.gz", "filePath": "/backups/database/nusantara_backup_2025-10-18T15-58-38.sql.gz", "fileSize": "20", "metadata": null, "rowCount": "82", "createdAt": "2025-10-18T15:58:39.034Z", "deletedAt": null, "expiresAt": "2025-11-17T15:58:39.032Z", "isDeleted": false, "startedAt": "2025-10-18T15:58:39.032Z", "updatedAt": "2025-10-18T15:58:39.117Z", "backupType": "MANUAL", "tableCount": 42, "verifiedAt": "2025-10-18T15:58:39.117Z", "completedAt": "2025-10-18T15:58:39.092Z", "isEncrypted": false, "triggeredBy": "USR-IT-HADEZ-001", "databaseSize": "41980719", "errorMessage": null, "retentionDays": 30, "compressionRatio": "100.00", "triggeredByUsername": "hadez"}, "isNewRecord": false, "_previousDataValues": {"id": "c703e294-54dd-4b72-83a9-707ab87ecf21", "status": "VERIFIED", "checksum": "59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2", "duration": 0, "fileName": "nusantara_backup_2025-10-18T15-58-38.sql.gz", "filePath": "/backups/database/nusantara_backup_2025-10-18T15-58-38.sql.gz", "fileSize": "20", "metadata": null, "rowCount": "82", "createdAt": "2025-10-18T15:58:39.034Z", "deletedAt": null, "expiresAt": "2025-11-17T15:58:39.032Z", "isDeleted": false, "startedAt": "2025-10-18T15:58:39.032Z", "updatedAt": "2025-10-18T15:58:39.117Z", "backupType": "MANUAL", "tableCount": 42, "verifiedAt": "2025-10-18T15:58:39.117Z", "completedAt": "2025-10-18T15:58:39.092Z", "isEncrypted": false, "triggeredBy": "USR-IT-HADEZ-001", "databaseSize": "41980719", "errorMessage": null, "retentionDays": 30, "compressionRatio": "100.00", "triggeredByUsername": "hadez"}}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/create	200	\N	132	\N	2025-10-18 15:58:39.123
16a319c7-c4da-4376-8b36-b3522adb4d1c	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-18 17:32:18.874
d5b4ce48-d178-4efa-8d1b-1da93b4a641a	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	POST	/login	200	\N	153	\N	2025-10-18 17:32:18.882
9b3cd6ea-5d56-4245-94bf-d701d56d5390	\N	\N	CREATE	unknown	\N	\N	\N	\N	\N	::ffff:127.0.0.1	curl/8.14.1	POST	/login	401	Invalid credentials	86	\N	2025-10-18 17:32:46.029
fd3d640a-4218-493c-bdae-a76931fe88e6	USR-IT-HADEZ-001	hadez	CREATE	verify	c703e294-54dd-4b72-83a9-707ab87ecf21	\N	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	POST	/c703e294-54dd-4b72-83a9-707ab87ecf21/verify	200	\N	14	\N	2025-10-18 17:40:49.235
04f3d5a0-bc99-49ee-87db-d53934af495c	USR-IT-HADEZ-001	hadez	CREATE	unknown	\N	\N	\N	{"uniqno": 1, "_changed": {}, "_options": {"raw": true, "_schema": null, "attributes": ["id", "backupType", "fileName", "filePath", "fileSize", "status", "startedAt", "completedAt", "duration", "databaseSize", "tableCount", "rowCount", "compressionRatio", "checksum", "verifiedAt", "isEncrypted", "triggeredBy", "triggeredByUsername", "errorMessage", "metadata", "retentionDays", "expiresAt", "isDeleted", "deletedAt", "createdAt", "updatedAt"], "isNewRecord": false, "_schemaDelimiter": ""}, "dataValues": {"id": "26849cd2-a4a2-4163-be4a-4a8d9d2320c6", "status": "VERIFIED", "checksum": "59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2", "duration": 0, "fileName": "nusantara_backup_2025-10-18T18-15-47.sql.gz", "filePath": "/backups/database/nusantara_backup_2025-10-18T18-15-47.sql.gz", "fileSize": "20", "metadata": null, "rowCount": "17", "createdAt": "2025-10-18T18:15:47.475Z", "deletedAt": null, "expiresAt": "2025-11-17T18:15:47.473Z", "isDeleted": false, "startedAt": "2025-10-18T18:15:47.473Z", "updatedAt": "2025-10-18T18:15:47.551Z", "backupType": "MANUAL", "tableCount": 43, "verifiedAt": "2025-10-18T18:15:47.551Z", "completedAt": "2025-10-18T18:15:47.525Z", "isEncrypted": false, "triggeredBy": "USR-IT-HADEZ-001", "databaseSize": "42144559", "errorMessage": null, "retentionDays": 30, "compressionRatio": "100.00", "triggeredByUsername": "hadez"}, "isNewRecord": false, "_previousDataValues": {"id": "26849cd2-a4a2-4163-be4a-4a8d9d2320c6", "status": "VERIFIED", "checksum": "59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2", "duration": 0, "fileName": "nusantara_backup_2025-10-18T18-15-47.sql.gz", "filePath": "/backups/database/nusantara_backup_2025-10-18T18-15-47.sql.gz", "fileSize": "20", "metadata": null, "rowCount": "17", "createdAt": "2025-10-18T18:15:47.475Z", "deletedAt": null, "expiresAt": "2025-11-17T18:15:47.473Z", "isDeleted": false, "startedAt": "2025-10-18T18:15:47.473Z", "updatedAt": "2025-10-18T18:15:47.551Z", "backupType": "MANUAL", "tableCount": 43, "verifiedAt": "2025-10-18T18:15:47.551Z", "completedAt": "2025-10-18T18:15:47.525Z", "isEncrypted": false, "triggeredBy": "USR-IT-HADEZ-001", "databaseSize": "42144559", "errorMessage": null, "retentionDays": 30, "compressionRatio": "100.00", "triggeredByUsername": "hadez"}}	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	POST	/create	200	\N	110	\N	2025-10-18 18:15:47.555
cbff3da6-44bf-4fe1-9d44-24693b104558	USR-IT-HADEZ-001	hadez	CREATE	verify	c703e294-54dd-4b72-83a9-707ab87ecf21	\N	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	POST	/c703e294-54dd-4b72-83a9-707ab87ecf21/verify	200	\N	15	\N	2025-10-18 18:15:59.147
1af4712f-0f9f-4059-8de9-2bd187d419fa	USR-IT-HADEZ-001	hadez	CREATE	verify	26849cd2-a4a2-4163-be4a-4a8d9d2320c6	\N	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	POST	/26849cd2-a4a2-4163-be4a-4a8d9d2320c6/verify	200	\N	6	\N	2025-10-18 18:17:45.638
0e1b6e8a-47cf-4962-b7e3-06be5e89e264	USR-IT-HADEZ-001	hadez	DELETE	unknown	c703e294-54dd-4b72-83a9-707ab87ecf21	\N	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	DELETE	/c703e294-54dd-4b72-83a9-707ab87ecf21	200	\N	7	\N	2025-10-18 18:17:53.721
e9465393-771e-4753-93be-04218c342a15	USR-MGR-AZMY-001	azmy	LOGIN	auth	USR-MGR-AZMY-001	azmy	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 21:55:16.967
41bd3ee9-0026-4b22-b8b1-550c5ba09168	USR-IT-HADEZ-001	hadez	CREATE	unknown	\N	\N	\N	{"uniqno": 1, "_changed": {}, "_options": {"raw": true, "_schema": null, "attributes": ["id", "backupType", "fileName", "filePath", "fileSize", "status", "startedAt", "completedAt", "duration", "databaseSize", "tableCount", "rowCount", "compressionRatio", "checksum", "verifiedAt", "isEncrypted", "triggeredBy", "triggeredByUsername", "errorMessage", "metadata", "retentionDays", "expiresAt", "isDeleted", "deletedAt", "createdAt", "updatedAt"], "isNewRecord": false, "_schemaDelimiter": ""}, "dataValues": {"id": "22fdd8ec-f081-41a1-866b-20a76cf069ee", "status": "VERIFIED", "checksum": "59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2", "duration": 0, "fileName": "nusantara_backup_2025-10-18T18-27-00.sql.gz", "filePath": "/backups/database/nusantara_backup_2025-10-18T18-27-00.sql.gz", "fileSize": "20", "metadata": null, "rowCount": "12", "createdAt": "2025-10-18T18:27:00.144Z", "deletedAt": null, "expiresAt": "2025-11-17T18:27:00.144Z", "isDeleted": false, "startedAt": "2025-10-18T18:27:00.144Z", "updatedAt": "2025-10-18T18:27:00.208Z", "backupType": "MANUAL", "tableCount": 42, "verifiedAt": "2025-10-18T18:27:00.208Z", "completedAt": "2025-10-18T18:27:00.177Z", "isEncrypted": false, "triggeredBy": "USR-IT-HADEZ-001", "databaseSize": "42054447", "errorMessage": null, "retentionDays": 30, "compressionRatio": "100.00", "triggeredByUsername": "hadez"}, "isNewRecord": false, "_previousDataValues": {"id": "22fdd8ec-f081-41a1-866b-20a76cf069ee", "status": "VERIFIED", "checksum": "59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2", "duration": 0, "fileName": "nusantara_backup_2025-10-18T18-27-00.sql.gz", "filePath": "/backups/database/nusantara_backup_2025-10-18T18-27-00.sql.gz", "fileSize": "20", "metadata": null, "rowCount": "12", "createdAt": "2025-10-18T18:27:00.144Z", "deletedAt": null, "expiresAt": "2025-11-17T18:27:00.144Z", "isDeleted": false, "startedAt": "2025-10-18T18:27:00.144Z", "updatedAt": "2025-10-18T18:27:00.208Z", "backupType": "MANUAL", "tableCount": 42, "verifiedAt": "2025-10-18T18:27:00.208Z", "completedAt": "2025-10-18T18:27:00.177Z", "isEncrypted": false, "triggeredBy": "USR-IT-HADEZ-001", "databaseSize": "42054447", "errorMessage": null, "retentionDays": 30, "compressionRatio": "100.00", "triggeredByUsername": "hadez"}}	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	POST	/create	200	\N	111	\N	2025-10-18 18:27:00.213
3c27b4a0-9927-4f69-8e66-8f740131dc15	USR-IT-HADEZ-001	hadez	CREATE	unknown	\N	\N	\N	{"uniqno": 1, "_changed": {}, "_options": {"raw": true, "_schema": null, "attributes": ["id", "backupType", "fileName", "filePath", "fileSize", "status", "startedAt", "completedAt", "duration", "databaseSize", "tableCount", "rowCount", "compressionRatio", "checksum", "verifiedAt", "isEncrypted", "triggeredBy", "triggeredByUsername", "errorMessage", "metadata", "retentionDays", "expiresAt", "isDeleted", "deletedAt", "createdAt", "updatedAt"], "isNewRecord": false, "_schemaDelimiter": ""}, "dataValues": {"id": "34143fa2-c229-43b4-8b16-b2c3fe65f312", "status": "VERIFIED", "checksum": "59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2", "duration": 0, "fileName": "nusantara_backup_2025-10-18T18-30-28.sql.gz", "filePath": "/backups/database/nusantara_backup_2025-10-18T18-30-28.sql.gz", "fileSize": "20", "metadata": null, "rowCount": "14", "createdAt": "2025-10-18T18:30:28.978Z", "deletedAt": null, "expiresAt": "2025-11-17T18:30:28.977Z", "isDeleted": false, "startedAt": "2025-10-18T18:30:28.977Z", "updatedAt": "2025-10-18T18:30:29.079Z", "backupType": "MANUAL", "tableCount": 42, "verifiedAt": "2025-10-18T18:30:29.078Z", "completedAt": "2025-10-18T18:30:29.051Z", "isEncrypted": false, "triggeredBy": "USR-IT-HADEZ-001", "databaseSize": "42087215", "errorMessage": null, "retentionDays": 30, "compressionRatio": "100.00", "triggeredByUsername": "hadez"}, "isNewRecord": false, "_previousDataValues": {"id": "34143fa2-c229-43b4-8b16-b2c3fe65f312", "status": "VERIFIED", "checksum": "59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2", "duration": 0, "fileName": "nusantara_backup_2025-10-18T18-30-28.sql.gz", "filePath": "/backups/database/nusantara_backup_2025-10-18T18-30-28.sql.gz", "fileSize": "20", "metadata": null, "rowCount": "14", "createdAt": "2025-10-18T18:30:28.978Z", "deletedAt": null, "expiresAt": "2025-11-17T18:30:28.977Z", "isDeleted": false, "startedAt": "2025-10-18T18:30:28.977Z", "updatedAt": "2025-10-18T18:30:29.079Z", "backupType": "MANUAL", "tableCount": 42, "verifiedAt": "2025-10-18T18:30:29.078Z", "completedAt": "2025-10-18T18:30:29.051Z", "isEncrypted": false, "triggeredBy": "USR-IT-HADEZ-001", "databaseSize": "42087215", "errorMessage": null, "retentionDays": 30, "compressionRatio": "100.00", "triggeredByUsername": "hadez"}}	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	POST	/create	200	\N	140	\N	2025-10-18 18:30:29.087
0317aa0f-5d8a-4e72-b062-49e5e8140b2d	USR-IT-HADEZ-001	hadez	CREATE	unknown	\N	\N	\N	{"uniqno": 1, "_changed": {}, "_options": {"raw": true, "_schema": null, "attributes": ["id", "backupType", "fileName", "filePath", "fileSize", "status", "startedAt", "completedAt", "duration", "databaseSize", "tableCount", "rowCount", "compressionRatio", "checksum", "verifiedAt", "isEncrypted", "triggeredBy", "triggeredByUsername", "errorMessage", "metadata", "retentionDays", "expiresAt", "isDeleted", "deletedAt", "createdAt", "updatedAt"], "isNewRecord": false, "_schemaDelimiter": ""}, "dataValues": {"id": "fb34c8f5-4b6b-4dde-9a62-c8b5aa7eccd6", "status": "VERIFIED", "checksum": "59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2", "duration": 0, "fileName": "nusantara_backup_2025-10-18T18-30-41.sql.gz", "filePath": "/backups/database/nusantara_backup_2025-10-18T18-30-41.sql.gz", "fileSize": "20", "metadata": null, "rowCount": "16", "createdAt": "2025-10-18T18:30:41.486Z", "deletedAt": null, "expiresAt": "2025-11-17T18:30:41.486Z", "isDeleted": false, "startedAt": "2025-10-18T18:30:41.486Z", "updatedAt": "2025-10-18T18:30:41.516Z", "backupType": "MANUAL", "tableCount": 42, "verifiedAt": "2025-10-18T18:30:41.516Z", "completedAt": "2025-10-18T18:30:41.504Z", "isEncrypted": false, "triggeredBy": "USR-IT-HADEZ-001", "databaseSize": "42087215", "errorMessage": null, "retentionDays": 30, "compressionRatio": "100.00", "triggeredByUsername": "hadez"}, "isNewRecord": false, "_previousDataValues": {"id": "fb34c8f5-4b6b-4dde-9a62-c8b5aa7eccd6", "status": "VERIFIED", "checksum": "59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2", "duration": 0, "fileName": "nusantara_backup_2025-10-18T18-30-41.sql.gz", "filePath": "/backups/database/nusantara_backup_2025-10-18T18-30-41.sql.gz", "fileSize": "20", "metadata": null, "rowCount": "16", "createdAt": "2025-10-18T18:30:41.486Z", "deletedAt": null, "expiresAt": "2025-11-17T18:30:41.486Z", "isDeleted": false, "startedAt": "2025-10-18T18:30:41.486Z", "updatedAt": "2025-10-18T18:30:41.516Z", "backupType": "MANUAL", "tableCount": 42, "verifiedAt": "2025-10-18T18:30:41.516Z", "completedAt": "2025-10-18T18:30:41.504Z", "isEncrypted": false, "triggeredBy": "USR-IT-HADEZ-001", "databaseSize": "42087215", "errorMessage": null, "retentionDays": 30, "compressionRatio": "100.00", "triggeredByUsername": "hadez"}}	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	POST	/create	200	\N	52	\N	2025-10-18 18:30:41.519
4858ed65-ca6d-48dc-9734-9824ea431531	USR-IT-HADEZ-001	hadez	UPDATE	status	2025BSR001	\N	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	PATCH	/2025BSR001/status	200	\N	10	\N	2025-10-18 18:49:14.37
977762f6-93b9-4aa6-9e64-aef6e949e1e3	USR-IT-HADEZ-001	hadez	DELETE	unknown	2025BSR001	\N	\N	\N	\N	::ffff:127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	DELETE	/2025BSR001	200	\N	145	\N	2025-10-19 08:08:59.642
0d3fbb71-df77-4fba-97ac-fec3879dcd03	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 09:19:35.4
50ae0048-c8d4-435f-8be9-5487fdaaf733	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	POST	/login	200	\N	434	\N	2025-10-19 09:19:35.415
c60f7967-3db1-41ed-9f8e-50a8b3583e89	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 11:34:29.732
f19a2aac-a32d-4743-8183-8d703f7e3945	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/login	200	\N	97	\N	2025-10-19 11:34:29.736
4c56c43c-3554-481a-8209-ba609ca2a0e3	USR-IT-HADEZ-001	hadez	CREATE	unknown	\N	\N	\N	{"uniqno": 1, "_changed": {}, "_options": {"_schema": null, "isNewRecord": true, "_schemaDelimiter": ""}, "dataValues": {"id": "2025PJK001", "name": "Proyek Uji Coba 01", "tags": [], "team": [], "notes": null, "budget": "1000000000.00", "status": "planning", "endDate": "2025-11-09", "location": {"city": "Karawang", "address": "Jl. Syeh Quro, Ruko Grandpermata Lt. 2", "province": "Jawa Barat"}, "priority": "medium", "progress": 0, "createdAt": "2025-10-19T18:19:54.280Z", "createdBy": null, "documents": [], "startDate": "2025-10-22", "updatedAt": "2025-10-19T18:19:54.280Z", "updatedBy": null, "actualCost": "0.00", "clientName": "PT. Bizmark Permit Consulting", "milestones": [], "description": "", "subsidiaryId": "NU006", "clientContact": {"email": "bizmark.konsultan@gmail.com", "phone": "081382605030", "contact": "021"}, "subsidiaryInfo": {"id": "NU006", "code": "PJK", "name": "PT. PUTRA JAYA KONSTRUKASI"}, "projectManagerId": null, "estimatedDuration": null}, "isNewRecord": false, "_previousDataValues": {"id": "2025PJK001", "name": "Proyek Uji Coba 01", "tags": [], "team": [], "notes": null, "budget": "1000000000.00", "status": "planning", "endDate": "2025-11-09", "location": {"city": "Karawang", "address": "Jl. Syeh Quro, Ruko Grandpermata Lt. 2", "province": "Jawa Barat"}, "priority": "medium", "progress": 0, "createdAt": "2025-10-19T18:19:54.280Z", "createdBy": null, "documents": [], "startDate": "2025-10-22", "updatedAt": "2025-10-19T18:19:54.280Z", "updatedBy": null, "actualCost": "0.00", "clientName": "PT. Bizmark Permit Consulting", "milestones": [], "description": "", "subsidiaryId": "NU006", "clientContact": {"email": "bizmark.konsultan@gmail.com", "phone": "081382605030", "contact": "021"}, "subsidiaryInfo": {"id": "NU006", "code": "PJK", "name": "PT. PUTRA JAYA KONSTRUKASI"}, "projectManagerId": null, "estimatedDuration": null}}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	POST	/	201	\N	34	\N	2025-10-19 18:19:54.295
880af9fe-b472-4c9d-b2c8-bcea740bf0c8	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 19:33:41.475
a6ae68b3-57ef-4b2e-9007-ec2a574b1406	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	POST	/login	200	\N	143	\N	2025-10-19 19:33:41.493
47c59c4e-c15e-44e2-8e9a-c49bab59f683	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 20:05:59.598
a32c3abc-f26d-4da3-b461-85ed2c0181a5	\N	\N	CREATE	unknown	\N	\N	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	401	Invalid credentials	81	\N	2025-10-19 21:55:47.838
73477ef5-5ee9-4c05-828a-d717d86fe3ef	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/login	200	\N	109	\N	2025-10-19 20:05:59.602
41d8893b-7b5b-4888-9cd5-9acada0f498c	USR-IT-HADEZ-001	hadez	UPDATE	status	2025PJK001	\N	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	PATCH	/2025PJK001/status	200	\N	9	\N	2025-10-19 20:07:42.536
aaa10683-ec03-4819-9f26-4ae290a04a28	USR-IT-HADEZ-001	hadez	CREATE	rab	2025PJK001	\N	\N	{"0": {"id": "54e38d26-a7e8-46f5-9041-8abed2c68ca3", "unit": "batang", "notes": "", "status": "draft", "category": "Pekerjaan Persiapan", "quantity": "100.00", "createdAt": "2025-10-19T20:08:10.174Z", "createdBy": null, "item_type": "material", "projectId": "2025PJK001", "unitPrice": "100000.00", "updatedAt": "2025-10-19T20:08:10.174Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "10000000.00", "description": "besi holo 11 inch"}}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	POST	/2025PJK001/rab/bulk	201	\N	20	\N	2025-10-19 20:08:10.18
a4af2585-7c35-4b90-9818-f6af53aafdeb	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 20:37:22.013
006e9633-6cb6-4c48-b6c9-4d2414ee0bd1	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/login	200	\N	148	\N	2025-10-19 20:37:22.02
623f9383-30ef-422e-83ea-64594c7e9c04	\N	\N	CREATE	unknown	\N	\N	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	401	Invalid credentials	96	\N	2025-10-19 20:37:48.477
fcf1d975-4477-4271-b4bc-26ad8bc3bbf5	\N	\N	CREATE	unknown	\N	\N	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	401	Invalid credentials	95	\N	2025-10-19 20:38:15.154
52cbb316-af09-4102-8eb7-5b5f31a6b48d	\N	\N	CREATE	unknown	\N	\N	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/login	401	Invalid credentials	92	\N	2025-10-19 20:40:24.565
0eb4cded-a60d-474e-a6a5-d1b04ff67c8b	\N	\N	CREATE	unknown	\N	\N	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/login	401	Invalid credentials	90	\N	2025-10-19 20:40:26.183
72354915-d55b-4ac1-9f6c-7478d3af233d	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 20:40:38.643
4f4b0df1-bc2a-4aa8-bf43-1cc370f1f387	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/login	200	\N	100	\N	2025-10-19 20:40:38.646
8da27f8e-f40b-4e7f-86fd-e3d7f41fbff9	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 20:42:18.179
e4089919-5e55-4095-8104-a16429391932	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	200	\N	99	\N	2025-10-19 20:42:18.183
e27fb8bf-8d01-4694-ae76-d00ef6b7474a	USR-IT-HADEZ-001	hadez	CREATE	rab	2025PJK001	\N	\N	{"uniqno": 1, "_changed": {}, "_options": {"_schema": null, "isNewRecord": true, "_schemaDelimiter": ""}, "dataValues": {"id": "21293fcd-4177-4983-9040-6151555c9e42", "unit": "sak", "notes": "Testing RAB notification system - LIVE TEST", "status": "under_review", "category": "Material", "quantity": "50.00", "createdAt": "2025-10-19T20:42:30.943Z", "createdBy": "USR-IT-HADEZ-001", "item_type": "material", "projectId": "2025PJK001", "unitPrice": "75000.00", "updatedAt": "2025-10-19T20:42:30.943Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "3750000.00", "description": "TEST NOTIFIKASI - Semen Portland 50 sak"}, "isNewRecord": false, "_previousDataValues": {"id": "21293fcd-4177-4983-9040-6151555c9e42", "unit": "sak", "notes": "Testing RAB notification system - LIVE TEST", "status": "under_review", "category": "Material", "quantity": "50.00", "createdAt": "2025-10-19T20:42:30.943Z", "createdBy": "USR-IT-HADEZ-001", "item_type": "material", "projectId": "2025PJK001", "unitPrice": "75000.00", "updatedAt": "2025-10-19T20:42:30.943Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "3750000.00", "description": "TEST NOTIFIKASI - Semen Portland 50 sak"}}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/2025PJK001/rab	201	\N	35	\N	2025-10-19 20:42:30.957
4a5b8064-acf5-4f74-aba2-3633132eb92e	USR-IT-HADEZ-001	hadez	CREATE	rab	2025PJK001	\N	\N	{"uniqno": 1, "_changed": {}, "_options": {"_schema": null, "isNewRecord": true, "_schemaDelimiter": ""}, "dataValues": {"id": "c4c14aac-c463-44bb-abd1-6949d5aa0e07", "unit": "sak", "notes": null, "status": "under_review", "category": "Material", "quantity": "50.00", "createdAt": "2025-10-19T20:42:41.340Z", "createdBy": "USR-IT-HADEZ-001", "item_type": "material", "projectId": "2025PJK001", "unitPrice": "75000.00", "updatedAt": "2025-10-19T20:42:41.340Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "3750000.00", "description": "TEST NOTIFIKASI - Semen Portland"}, "isNewRecord": false, "_previousDataValues": {"id": "c4c14aac-c463-44bb-abd1-6949d5aa0e07", "unit": "sak", "notes": null, "status": "under_review", "category": "Material", "quantity": "50.00", "createdAt": "2025-10-19T20:42:41.340Z", "createdBy": "USR-IT-HADEZ-001", "item_type": "material", "projectId": "2025PJK001", "unitPrice": "75000.00", "updatedAt": "2025-10-19T20:42:41.340Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "3750000.00", "description": "TEST NOTIFIKASI - Semen Portland"}}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/2025PJK001/rab	201	\N	13	\N	2025-10-19 20:42:41.349
69374692-4f32-4df5-a058-905682516972	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-MGR-AZMY-001", "role": "project_manager", "email": "azmy@nusantaragroup.co.id", "profile": {"phone": "", "fullName": "Azmy", "position": "Manager Umum", "department": "Management"}, "fullName": null, "isActive": true, "position": null, "username": "azmy", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	200	\N	100	\N	2025-10-19 21:55:16.973
30b15fc6-1fd7-46ae-9e37-8f54f9928482	\N	\N	UPDATE	rab	33950922-3372-4ec7-a24d-c0831e49c3bd	\N	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	PUT	/2025PJK001/rab	401	Invalid token	0	\N	2025-10-19 21:55:47.851
d0de89fd-f217-4a98-9723-79417cbcf9d8	USR-IT-HADEZ-001	hadez	CREATE	rab	2025PJK001	\N	\N	{"uniqno": 1, "_changed": {}, "_options": {"_schema": null, "isNewRecord": true, "_schemaDelimiter": ""}, "dataValues": {"id": "4a7ccc4f-2131-4082-ba81-9df49b674075", "unit": "hari", "notes": null, "status": "under_review", "category": "Labor", "quantity": "10.00", "createdAt": "2025-10-19T20:44:04.464Z", "createdBy": "USR-IT-HADEZ-001", "item_type": "labor", "projectId": "2025PJK001", "unitPrice": "150000.00", "updatedAt": "2025-10-19T20:44:04.464Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "1500000.00", "description": "TEST NOTIFIKASI DENGAN TOKEN - Tukang Batu"}, "isNewRecord": false, "_previousDataValues": {"id": "4a7ccc4f-2131-4082-ba81-9df49b674075", "unit": "hari", "notes": null, "status": "under_review", "category": "Labor", "quantity": "10.00", "createdAt": "2025-10-19T20:44:04.464Z", "createdBy": "USR-IT-HADEZ-001", "item_type": "labor", "projectId": "2025PJK001", "unitPrice": "150000.00", "updatedAt": "2025-10-19T20:44:04.464Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "1500000.00", "description": "TEST NOTIFIKASI DENGAN TOKEN - Tukang Batu"}}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/2025PJK001/rab	201	\N	28	\N	2025-10-19 20:44:04.477
315dd4a6-2c1c-448b-8969-122812b045c6	USR-IT-HADEZ-001	hadez	CREATE	rab	2025PJK001	\N	\N	{"uniqno": 1, "_changed": {}, "_options": {"_schema": null, "isNewRecord": true, "_schemaDelimiter": ""}, "dataValues": {"id": "35e34d84-2499-4ad4-a20c-2a843d9ec91a", "unit": "unit", "notes": null, "status": "under_review", "category": "Equipment", "quantity": "2.00", "createdAt": "2025-10-19T20:46:41.531Z", "createdBy": "USR-IT-HADEZ-001", "item_type": "equipment", "projectId": "2025PJK001", "unitPrice": "5000000.00", "updatedAt": "2025-10-19T20:46:41.531Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "10000000.00", "description": "TEST FINAL - Concrete Mixer"}, "isNewRecord": false, "_previousDataValues": {"id": "35e34d84-2499-4ad4-a20c-2a843d9ec91a", "unit": "unit", "notes": null, "status": "under_review", "category": "Equipment", "quantity": "2.00", "createdAt": "2025-10-19T20:46:41.531Z", "createdBy": "USR-IT-HADEZ-001", "item_type": "equipment", "projectId": "2025PJK001", "unitPrice": "5000000.00", "updatedAt": "2025-10-19T20:46:41.531Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "10000000.00", "description": "TEST FINAL - Concrete Mixer"}}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/2025PJK001/rab	201	\N	310	\N	2025-10-19 20:46:41.816
4b71362b-f096-491f-93a1-bcfe280cf49e	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 20:53:40.921
65af0c5e-3a5b-4b8e-b0da-a96c822b3a1b	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/login	200	\N	117	\N	2025-10-19 20:53:40.926
1b0c0756-7e27-4c94-89d5-ebae18fa223b	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 21:30:48.444
92ab0701-a5ee-4725-8e92-0533c6a63cba	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/login	200	\N	96	\N	2025-10-19 21:30:48.451
2dc746b0-37b0-47a8-881a-343178f50825	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 21:36:32.604
94d8d30f-48cd-47ed-9b58-84070c25543c	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/login	200	\N	99	\N	2025-10-19 21:36:32.608
8ce35a7b-8bba-4491-a557-4a01d034f1f7	\N	\N	CREATE	unknown	\N	\N	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/rab	401	Invalid token	0	\N	2025-10-19 21:43:51.245
26dff5f5-6ad4-4340-87a5-22499e284b92	\N	\N	CREATE	unknown	\N	\N	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/login	401	Invalid credentials	95	\N	2025-10-19 21:47:25.551
cb8179bd-0419-437f-8239-8c6a8a7807fd	\N	\N	CREATE	unknown	\N	\N	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/login	401	Invalid credentials	85	\N	2025-10-19 21:47:26.996
1b597492-f1a3-44b2-9286-1ef1be516f3e	\N	\N	CREATE	unknown	\N	\N	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/login	401	Invalid credentials	98	\N	2025-10-19 21:47:39.52
90976baa-0ad0-4962-9ded-4f6ce491e582	USR-IT-HADEZ-001	hadez	UPDATE	USR-MGR-AZMY-001	USR-MGR-AZMY-001	\N	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	PUT	/management/USR-MGR-AZMY-001	200	\N	95	\N	2025-10-19 21:48:38.909
cf250b6c-8afe-4476-b5c5-252a2bbccd48	USR-MGR-AZMY-001	azmy	LOGIN	auth	USR-MGR-AZMY-001	azmy	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 21:48:59.522
1804ed75-b0ff-4ab3-b48a-b51505e169e0	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-MGR-AZMY-001", "role": "project_manager", "email": "azmy@nusantaragroup.co.id", "profile": {"phone": "", "fullName": "Azmy", "position": "Manager Umum", "department": "Management"}, "fullName": null, "isActive": true, "position": null, "username": "azmy", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/login	200	\N	96	\N	2025-10-19 21:48:59.526
877715b2-0712-44e7-8d91-de1fbadf4e5e	USR-MGR-AZMY-001	azmy	CREATE	rab	2025PJK001	\N	\N	{"0": {"id": "33950922-3372-4ec7-a24d-c0831e49c3bd", "unit": "Kg", "notes": "", "status": "draft", "category": "Pekerjaan Persiapan", "quantity": "100.00", "createdAt": "2025-10-19T21:50:32.126Z", "createdBy": null, "item_type": "material", "projectId": "2025PJK001", "unitPrice": "100000.00", "updatedAt": "2025-10-19T21:50:32.126Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "10000000.00", "description": "Besi dan paku ukuran 11"}}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/2025PJK001/rab/bulk	201	\N	22	\N	2025-10-19 21:50:32.132
bc31008e-f60d-4c4d-a581-3e8a96ec323a	\N	\N	CREATE	unknown	\N	\N	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	401	Invalid credentials	98	\N	2025-10-19 21:54:02.213
63d16715-4b02-4d35-aa28-ce451528417d	\N	\N	CREATE	unknown	\N	\N	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	401	Invalid credentials	79	\N	2025-10-19 21:56:26.896
98466949-d3d0-4d2e-aa4a-b31331318346	USR-MGR-AZMY-001	azmy	LOGIN	auth	USR-MGR-AZMY-001	azmy	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 21:58:01.583
cad6a33a-86d6-49d1-a084-49fac759158e	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-MGR-AZMY-001", "role": "project_manager", "email": "azmy@nusantaragroup.co.id", "profile": {"phone": "", "fullName": "Azmy", "position": "Manager Umum", "department": "Management"}, "fullName": null, "isActive": true, "position": null, "username": "azmy", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	200	\N	106	\N	2025-10-19 21:58:01.587
0d91d316-1593-42e7-babd-068cd8033f16	\N	\N	CREATE	unknown	\N	\N	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	401	Invalid credentials	96	\N	2025-10-19 21:58:20.819
f21c927d-4ef2-4f31-80ff-1d8bb58411b8	\N	\N	CREATE	rab	\N	\N	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/2025PJK001/rab	401	Invalid token	0	\N	2025-10-19 21:58:20.833
b954502e-7127-495a-8e95-b46b8f184cfd	USR-MGR-AZMY-001	azmy	LOGIN	auth	USR-MGR-AZMY-001	azmy	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 21:59:15.232
007b42c5-bb9d-4d87-b283-c3574da273a2	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-MGR-AZMY-001", "role": "project_manager", "email": "azmy@nusantaragroup.co.id", "profile": {"phone": "", "fullName": "Azmy", "position": "Manager Umum", "department": "Management"}, "fullName": null, "isActive": true, "position": null, "username": "azmy", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	200	\N	95	\N	2025-10-19 21:59:15.236
0d5fb179-e501-4ee9-81fe-95540cd40e60	USR-MGR-AZMY-001	azmy	LOGIN	auth	USR-MGR-AZMY-001	azmy	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 21:59:28.384
980df9f7-c04c-41a8-8210-7071dbb5ffc1	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-MGR-AZMY-001", "role": "project_manager", "email": "azmy@nusantaragroup.co.id", "profile": {"phone": "", "fullName": "Azmy", "position": "Manager Umum", "department": "Management"}, "fullName": null, "isActive": true, "position": null, "username": "azmy", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	200	\N	97	\N	2025-10-19 21:59:28.387
630d5c1b-29be-4912-9137-4ffe2e829c38	USR-MGR-AZMY-001	azmy	LOGIN	auth	USR-MGR-AZMY-001	azmy	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 21:59:46.535
262b7de7-f6e1-4991-af4e-3ec44bc444c5	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-MGR-AZMY-001", "role": "project_manager", "email": "azmy@nusantaragroup.co.id", "profile": {"phone": "", "fullName": "Azmy", "position": "Manager Umum", "department": "Management"}, "fullName": null, "isActive": true, "position": null, "username": "azmy", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	200	\N	85	\N	2025-10-19 21:59:46.54
37869e32-5e11-4c86-8842-9b4e7c900a86	USR-MGR-AZMY-001	azmy	CREATE	rab	2025PJK001	\N	\N	{"0": {"id": "abba9424-4028-410c-bab8-747bed7a67d6", "unit": "Kg", "notes": "", "status": "draft", "category": "Pekerjaan Persiapan", "quantity": "10.00", "createdAt": "2025-10-19T22:02:23.039Z", "createdBy": null, "item_type": "material", "projectId": "2025PJK001", "unitPrice": "100000.00", "updatedAt": "2025-10-19T22:02:23.039Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "1000000.00", "description": "Beli paku payung"}}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/2025PJK001/rab/bulk	201	\N	21	\N	2025-10-19 22:02:23.044
a24582ce-502e-4a0c-86ed-b426f30065bd	USR-MGR-AZMY-001	azmy	UPDATE	rab	2025PJK001	\N	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	PUT	/2025PJK001/rab/54e38d26-a7e8-46f5-9041-8abed2c68ca3/approve	200	\N	21	\N	2025-10-19 22:02:38.468
c3e14802-0d0e-4109-b748-48af6422887e	USR-MGR-AZMY-001	azmy	CREATE	rab	2025PJK001	\N	\N	{"0": {"id": "872fec19-c169-4721-8c85-aaa90710fbdc", "unit": "Ls", "notes": "", "status": "draft", "category": "Pekerjaan Persiapan", "quantity": "1.00", "createdAt": "2025-10-19T22:05:55.815Z", "createdBy": null, "item_type": "service", "projectId": "2025PJK001", "unitPrice": "10000000.00", "updatedAt": "2025-10-19T22:05:55.815Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "10000000.00", "description": "Dhdnndjejdjj"}}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/2025PJK001/rab/bulk	201	\N	27	\N	2025-10-19 22:05:55.823
f723a964-804b-4aa2-a234-e880493107fb	USR-MGR-AZMY-001	azmy	LOGIN	auth	USR-MGR-AZMY-001	azmy	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 22:07:21.083
ef3dc49d-714d-452e-83ac-088c5db824f3	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-MGR-AZMY-001", "role": "project_manager", "email": "azmy@nusantaragroup.co.id", "profile": {"phone": "", "fullName": "Azmy", "position": "Manager Umum", "department": "Management"}, "fullName": null, "isActive": true, "position": null, "username": "azmy", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	200	\N	138	\N	2025-10-19 22:07:21.088
2c6e017e-0ce7-45ed-b311-0023ca5d6444	USR-MGR-AZMY-001	azmy	CREATE	rab	2025PJK001	\N	\N	{"0": {"id": "448d9986-253c-41c0-a2aa-d8622cae5c39", "unit": "Kg", "notes": "", "status": "draft", "category": "Pekerjaan Persiapan", "quantity": "10.00", "createdAt": "2025-10-19T22:09:51.474Z", "createdBy": null, "item_type": "material", "projectId": "2025PJK001", "unitPrice": "100000.00", "updatedAt": "2025-10-19T22:09:51.474Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "1000000.00", "description": "Beli bata merah"}}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/2025PJK001/rab/bulk	201	\N	255	\N	2025-10-19 22:09:51.716
216085a1-2107-4151-b864-bad8f5787dd4	USR-MGR-AZMY-001	azmy	CREATE	rab	2025PJK001	\N	\N	{"0": {"id": "aaf38a5e-10ad-4dce-8feb-581203560800", "unit": "Kg", "notes": "", "status": "draft", "category": "Pekerjaan Persiapan", "quantity": "1010.00", "createdAt": "2025-10-19T22:16:40.198Z", "createdBy": null, "item_type": "service", "projectId": "2025PJK001", "unitPrice": "10000.00", "updatedAt": "2025-10-19T22:16:40.198Z", "updatedBy": null, "approvedAt": null, "approvedBy": null, "isApproved": false, "totalPrice": "10100000.00", "description": "Beli paku besar"}}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	POST	/2025PJK001/rab/bulk	201	\N	225	\N	2025-10-19 22:16:40.409
393aacc1-d2bc-4a5c-92ee-95007c3cc023	USR-IT-HADEZ-001	hadez	LOGIN	auth	USR-IT-HADEZ-001	hadez	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	POST	/api/auth/login	200	\N	\N	\N	2025-10-19 22:22:37.055
5a9805c9-f122-4fe1-941a-55386f3317aa	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-IT-HADEZ-001", "role": "admin", "email": "hadez@nusantaragroup.co.id", "profile": {"fullName": "Hadez", "position": "IT Admin", "department": "IT"}, "fullName": null, "isActive": true, "position": null, "username": "hadez", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	POST	/login	200	\N	139	\N	2025-10-19 22:22:37.059
d7ea1dce-01a6-4ac3-9d2d-bb475b802792	USR-MGR-AZMY-001	azmy	LOGIN	auth	USR-MGR-AZMY-001	azmy	\N	\N	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/api/auth/login	200	\N	\N	\N	2025-10-20 04:42:33.494
d50a473b-c28f-4ae8-8d6d-5c75e2966f73	\N	\N	CREATE	unknown	\N	\N	\N	{"user": {"id": "USR-MGR-AZMY-001", "role": "project_manager", "email": "azmy@nusantaragroup.co.id", "profile": {"phone": "", "fullName": "Azmy", "position": "Manager Umum", "department": "Management"}, "fullName": null, "isActive": true, "position": null, "username": "azmy", "departmentId": null}, "token": "***REDACTED***"}	\N	::ffff:172.20.0.1	curl/8.14.1	POST	/login	200	\N	118	\N	2025-10-20 04:42:33.498
045f5830-0ec1-4921-b32c-2e65a08b1232	USR-IT-HADEZ-001	hadez	DELETE	unknown	2025PJK001	\N	\N	\N	\N	::ffff:172.20.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	DELETE	/2025PJK001	200	\N	44	\N	2025-10-20 04:48:17.098
\.


--
-- Data for Name: backup_history; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.backup_history (id, "backupType", "fileName", "filePath", "fileSize", status, "startedAt", "completedAt", duration, "databaseSize", "tableCount", "rowCount", "compressionRatio", checksum, "verifiedAt", "isEncrypted", "triggeredBy", "triggeredByUsername", "errorMessage", metadata, "retentionDays", "expiresAt", "isDeleted", "deletedAt", "createdAt", "updatedAt") FROM stdin;
26849cd2-a4a2-4163-be4a-4a8d9d2320c6	MANUAL	nusantara_backup_2025-10-18T18-15-47.sql.gz	/backups/database/nusantara_backup_2025-10-18T18-15-47.sql.gz	20	VERIFIED	2025-10-19 01:15:47.473+07	2025-10-19 01:15:47.525+07	0	42144559	43	17	100.00	59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2	2025-10-19 01:15:47.551+07	f	USR-IT-HADEZ-001	hadez	\N	\N	30	2025-11-18 01:15:47.473+07	f	\N	2025-10-19 01:15:47.475+07	2025-10-19 01:15:47.551+07
c703e294-54dd-4b72-83a9-707ab87ecf21	MANUAL	nusantara_backup_2025-10-18T15-58-38.sql.gz	/backups/database/nusantara_backup_2025-10-18T15-58-38.sql.gz	20	VERIFIED	2025-10-18 22:58:39.032+07	2025-10-18 22:58:39.092+07	0	41980719	42	82	100.00	59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2	2025-10-18 22:58:39.117+07	f	USR-IT-HADEZ-001	hadez	\N	\N	30	2025-11-17 22:58:39.032+07	t	2025-10-19 01:17:53.718+07	2025-10-18 22:58:39.034+07	2025-10-19 01:17:53.718+07
22fdd8ec-f081-41a1-866b-20a76cf069ee	MANUAL	nusantara_backup_2025-10-18T18-27-00.sql.gz	/backups/database/nusantara_backup_2025-10-18T18-27-00.sql.gz	20	VERIFIED	2025-10-19 01:27:00.144+07	2025-10-19 01:27:00.177+07	0	42054447	42	12	100.00	59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2	2025-10-19 01:27:00.208+07	f	USR-IT-HADEZ-001	hadez	\N	\N	30	2025-11-18 01:27:00.144+07	f	\N	2025-10-19 01:27:00.144+07	2025-10-19 01:27:00.208+07
34143fa2-c229-43b4-8b16-b2c3fe65f312	MANUAL	nusantara_backup_2025-10-18T18-30-28.sql.gz	/backups/database/nusantara_backup_2025-10-18T18-30-28.sql.gz	20	VERIFIED	2025-10-19 01:30:28.977+07	2025-10-19 01:30:29.051+07	0	42087215	42	14	100.00	59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2	2025-10-19 01:30:29.078+07	f	USR-IT-HADEZ-001	hadez	\N	\N	30	2025-11-18 01:30:28.977+07	f	\N	2025-10-19 01:30:28.978+07	2025-10-19 01:30:29.079+07
fb34c8f5-4b6b-4dde-9a62-c8b5aa7eccd6	MANUAL	nusantara_backup_2025-10-18T18-30-41.sql.gz	/backups/database/nusantara_backup_2025-10-18T18-30-41.sql.gz	20	VERIFIED	2025-10-19 01:30:41.486+07	2025-10-19 01:30:41.504+07	0	42087215	42	16	100.00	59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2	2025-10-19 01:30:41.516+07	f	USR-IT-HADEZ-001	hadez	\N	\N	30	2025-11-18 01:30:41.486+07	f	\N	2025-10-19 01:30:41.486+07	2025-10-19 01:30:41.516+07
d6d958ae-701d-459e-b810-858c849ac3bf	FULL	nusantara_backup_2025-10-18T19-00-00.sql.gz	/backups/database/nusantara_backup_2025-10-18T19-00-00.sql.gz	20	VERIFIED	2025-10-19 02:00:00.034+07	2025-10-19 02:00:00.058+07	0	42087215	42	19	100.00	59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2	2025-10-19 02:00:00.073+07	f	SYSTEM	scheduler	\N	\N	30	2025-11-18 02:00:00.034+07	f	\N	2025-10-19 02:00:00.034+07	2025-10-19 02:00:00.074+07
e92f19de-cc1a-46db-85ab-5714f2d009d3	FULL	nusantara_backup_2025-10-19T19-00-00.sql.gz	/backups/database/nusantara_backup_2025-10-19T19-00-00.sql.gz	20	VERIFIED	2025-10-20 02:00:00.12+07	2025-10-20 02:00:00.195+07	0	42373935	46	33	100.00	59869db34853933b239f1e2219cf7d431da006aa919635478511fabbfc8849d2	2025-10-20 02:00:00.217+07	f	SYSTEM	scheduler	\N	\N	30	2025-11-19 02:00:00.12+07	f	\N	2025-10-20 02:00:00.121+07	2025-10-20 02:00:00.217+07
\.


--
-- Data for Name: berita_acara; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.berita_acara (id, project_id, milestone_id, ba_number, ba_type, work_description, completion_percentage, completion_date, status, submitted_by, submitted_at, reviewed_by, reviewed_at, approved_by, approved_at, rejection_reason, payment_authorized, payment_amount, payment_due_date, client_representative, client_signature, client_sign_date, client_notes, photos, documents, notes, work_location, contract_reference, quality_checklist, created_by, updated_by, created_at, updated_at, witnesses, contractor_signature, status_history) FROM stdin;
\.


--
-- Data for Name: board_directors; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.board_directors (id, subsidiary_id, name, "position", email, phone, appointment_date, term_end_date, is_active, education, experience, shareholding_percentage, created_at, updated_at) FROM stdin;
DIR-NU001-01	NU001	Dr. Bambang Sutrisno, M.M.	Comanditer	bambang.cue14@nusantaragroup.co.id	+62-21-555-1500	2023-11-01	\N	t	{"field": "Manajemen", "degree": "S3", "university": "ITB"}	[{"years": 7, "company": "Previous Construction Co.", "position": "Senior Manager"}]	35.00	2025-09-09 15:25:10.103564+07	2025-09-09 15:25:10.103564+07
DIR-NU001-02	NU001	Ir. Siti Rahayu, M.T.	Pengurus Aktif	siti.cue14@nusantaragroup.co.id	+62-21-555-1501	2021-03-01	\N	t	{"field": "Arsitektur", "degree": "S2", "university": "UGM"}	[{"years": 8, "company": "Previous Construction Co.", "position": "Senior Manager"}]	25.00	2025-09-09 15:25:10.106923+07	2025-09-09 15:25:10.106923+07
DIR-NU001-03	NU001	Drs. Ahmad Fauzi	Pengurus	ahmad.cue14@nusantaragroup.co.id	+62-21-555-1502	2020-09-01	\N	t	{"field": "Teknik Sipil", "degree": "S2", "university": "UI"}	[{"years": 11, "company": "Previous Construction Co.", "position": "Senior Manager"}]	15.00	2025-09-09 15:25:10.108431+07	2025-09-09 15:25:10.108431+07
DIR-NU002-01	NU002	Ir. Maya Sari, M.Sc.	Comanditer	maya.bsr@nusantaragroup.co.id	+62-21-555-1503	2023-05-01	\N	t	{"field": "Arsitektur", "degree": "S2", "university": "UI"}	[{"years": 7, "company": "Previous Construction Co.", "position": "Senior Manager"}]	35.00	2025-09-09 15:25:10.111298+07	2025-09-09 15:25:10.111298+07
DIR-NU002-02	NU002	Dr. Hendra Wijaya, S.E.	Pengurus Aktif	hendra.bsr@nusantaragroup.co.id	+62-21-555-1504	2023-07-01	\N	t	{"field": "Ekonomi", "degree": "S1", "university": "ITB"}	[{"years": 14, "company": "Previous Construction Co.", "position": "Senior Manager"}]	25.00	2025-09-09 15:25:10.112665+07	2025-09-09 15:25:10.112665+07
DIR-NU002-03	NU002	Ir. Rina Permata, M.T.	Pengurus	rina.bsr@nusantaragroup.co.id	+62-21-555-1505	2022-02-01	\N	t	{"field": "Teknik Sipil", "degree": "S1", "university": "ITS"}	[{"years": 7, "company": "Previous Construction Co.", "position": "Senior Manager"}]	15.00	2025-09-09 15:25:10.114103+07	2025-09-09 15:25:10.114103+07
DIR-NU003-01	NU003	Drs. Agus Setiawan, M.M.	Comanditer	agus.lts@nusantaragroup.co.id	+62-21-555-1506	2021-01-01	\N	t	{"field": "Ekonomi", "degree": "S2", "university": "UGM"}	[{"years": 7, "company": "Previous Construction Co.", "position": "Senior Manager"}]	35.00	2025-09-09 15:25:10.11627+07	2025-09-09 15:25:10.11627+07
DIR-NU003-02	NU003	Dr. Dewi Kusuma, S.T.	Pengurus Aktif	dewi.lts@nusantaragroup.co.id	+62-21-555-1507	2023-10-01	\N	t	{"field": "Ekonomi", "degree": "S1", "university": "ITS"}	[{"years": 7, "company": "Previous Construction Co.", "position": "Senior Manager"}]	25.00	2025-09-09 15:25:10.117558+07	2025-09-09 15:25:10.117558+07
DIR-NU003-03	NU003	Ir. Budi Santoso	Pengurus	budi.lts@nusantaragroup.co.id	+62-21-555-1508	2022-02-01	\N	t	{"field": "Manajemen", "degree": "S3", "university": "UGM"}	[{"years": 10, "company": "Previous Construction Co.", "position": "Senior Manager"}]	15.00	2025-09-09 15:25:10.119117+07	2025-09-09 15:25:10.119117+07
DIR-NU004-01	NU004	Dr. Lestari Indah, M.Eng.	Comanditer	lestari.gbn@nusantaragroup.co.id	+62-21-555-1509	2020-09-01	\N	t	{"field": "Teknik Sipil", "degree": "S1", "university": "ITB"}	[{"years": 13, "company": "Previous Construction Co.", "position": "Senior Manager"}]	35.00	2025-09-09 15:25:10.120885+07	2025-09-09 15:25:10.120885+07
DIR-NU004-02	NU004	Ir. Joko Widodo, M.T.	Pengurus Aktif	joko.gbn@nusantaragroup.co.id	+62-21-555-1510	2022-04-01	\N	t	{"field": "Manajemen", "degree": "S3", "university": "ITS"}	[{"years": 14, "company": "Previous Construction Co.", "position": "Senior Manager"}]	25.00	2025-09-09 15:25:10.122107+07	2025-09-09 15:25:10.122107+07
DIR-NU004-03	NU004	Drs. Sri Mulyani	Pengurus	sri.gbn@nusantaragroup.co.id	+62-21-555-1511	2023-12-01	\N	t	{"field": "Teknik Sipil", "degree": "S1", "university": "ITB"}	[{"years": 8, "company": "Previous Construction Co.", "position": "Senior Manager"}]	15.00	2025-09-09 15:25:10.123217+07	2025-09-09 15:25:10.123217+07
DIR-NU005-01	NU005	Dr. Andi Pratama, S.T.	Comanditer	andi.ssr@nusantaragroup.co.id	+62-21-555-1512	2023-12-01	\N	t	{"field": "Teknik Sipil", "degree": "S3", "university": "UGM"}	[{"years": 13, "company": "Previous Construction Co.", "position": "Senior Manager"}]	35.00	2025-09-09 15:25:10.124451+07	2025-09-09 15:25:10.124451+07
DIR-NU005-02	NU005	Ir. Mega Sari, M.Sc.	Pengurus Aktif	mega.ssr@nusantaragroup.co.id	+62-21-555-1513	2023-02-01	\N	t	{"field": "Teknik Sipil", "degree": "S1", "university": "UGM"}	[{"years": 6, "company": "Previous Construction Co.", "position": "Senior Manager"}]	25.00	2025-09-09 15:25:10.125944+07	2025-09-09 15:25:10.125944+07
DIR-NU005-03	NU005	Drs. Rudi Hartono	Pengurus	rudi.ssr@nusantaragroup.co.id	+62-21-555-1514	2020-08-01	\N	t	{"field": "Manajemen", "degree": "S3", "university": "ITS"}	[{"years": 14, "company": "Previous Construction Co.", "position": "Senior Manager"}]	15.00	2025-09-09 15:25:10.127821+07	2025-09-09 15:25:10.127821+07
DIR-NU006-01	NU006	Dr. Wulan Dari, M.T.	Komisaris Utama	wulan.pjk@nusantaragroup.co.id	+62-21-555-1515	2021-07-01	\N	t	{"field": "Ekonomi", "degree": "S1", "university": "UI"}	[{"years": 9, "company": "Previous Construction Co.", "position": "Senior Manager"}]	35.00	2025-09-09 15:25:10.130597+07	2025-09-09 15:25:10.130597+07
DIR-NU006-02	NU006	Ir. Surya Dharma	Direktur Utama	surya.pjk@nusantaragroup.co.id	+62-21-555-1516	2023-09-01	\N	t	{"field": "Arsitektur", "degree": "S3", "university": "UI"}	[{"years": 6, "company": "Previous Construction Co.", "position": "Senior Manager"}]	25.00	2025-09-09 15:25:10.133533+07	2025-09-09 15:25:10.133533+07
DIR-NU006-03	NU006	Drs. Indira Sari, M.M.	Direktur	indira.pjk@nusantaragroup.co.id	+62-21-555-1517	2022-01-01	\N	t	{"field": "Ekonomi", "degree": "S2", "university": "ITS"}	[{"years": 9, "company": "Previous Construction Co.", "position": "Senior Manager"}]	15.00	2025-09-09 15:25:10.134673+07	2025-09-09 15:25:10.134673+07
\.


--
-- Data for Name: chart_of_accounts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.chart_of_accounts (id, account_code, account_name, account_type, account_sub_type, parent_account_id, level, normal_balance, is_active, is_control_account, construction_specific, tax_deductible, vat_applicable, project_cost_center, description, notes, created_at, updated_at, current_balance, subsidiary_id) FROM stdin;
COA-1000	1000	ASET	ASSET	MAIN_GROUP	\N	1	DEBIT	t	t	f	\N	f	f	Kelompok Aset	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-1100	1100	ASET LANCAR	ASSET	CURRENT_ASSET	COA-1000	2	DEBIT	t	t	f	\N	f	f	Aset yang akan berubah menjadi kas dalam waktu 1 tahun	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-1102	1102	Piutang Usaha	ASSET	ACCOUNTS_RECEIVABLE	COA-1100	3	DEBIT	t	f	t	\N	f	t	Piutang dari termin proyek konstruksi	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-1103	1103	Piutang Retensi	ASSET	RETENTION_RECEIVABLE	COA-1100	3	DEBIT	t	f	t	\N	f	t	Piutang retensi dari owner proyek (biasanya 5-10%)	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-1104	1104	Persediaan Material	ASSET	INVENTORY	COA-1100	3	DEBIT	t	f	t	\N	f	t	Persediaan material konstruksi	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-1105	1105	Uang Muka Proyek	ASSET	PREPAID	COA-1100	3	DEBIT	t	f	t	\N	f	t	Uang muka yang diberikan untuk proyek	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-1200	1200	ASET TETAP	ASSET	FIXED_ASSET	COA-1000	2	DEBIT	t	t	f	\N	f	f	Aset tetap berwujud	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-1201	1201	Alat Berat	ASSET	HEAVY_EQUIPMENT	COA-1200	3	DEBIT	t	f	t	\N	f	f	Excavator, crane, bulldozer, dll	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-1202	1202	Kendaraan	ASSET	VEHICLES	COA-1200	3	DEBIT	t	f	f	\N	f	f	Kendaraan operasional	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-2000	2000	KEWAJIBAN	LIABILITY	MAIN_GROUP	\N	1	CREDIT	t	t	f	\N	f	f	Kelompok Kewajiban	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-2100	2100	KEWAJIBAN LANCAR	LIABILITY	CURRENT_LIABILITY	COA-2000	2	CREDIT	t	t	f	\N	f	f	Kewajiban jangka pendek	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-2101	2101	Hutang Usaha	LIABILITY	ACCOUNTS_PAYABLE	COA-2100	3	CREDIT	t	f	f	\N	f	f	Hutang kepada supplier material	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-2102	2102	Hutang Subkontraktor	LIABILITY	SUBCONTRACTOR_PAYABLE	COA-2100	3	CREDIT	t	f	t	\N	f	t	Hutang kepada subkontraktor	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-2103	2103	Hutang PPh 21	LIABILITY	INCOME_TAX_PAYABLE	COA-2100	3	CREDIT	t	f	f	\N	f	f	PPh 21 karyawan yang dipotong	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-2104	2104	Hutang PPN	LIABILITY	VAT_PAYABLE	COA-2100	3	CREDIT	t	f	f	\N	t	f	PPN Output - PPN Input	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-2105	2105	Uang Muka Diterima	LIABILITY	ADVANCE_RECEIVED	COA-2100	3	CREDIT	t	f	t	\N	f	t	Down payment dari owner proyek	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-3000	3000	EKUITAS	EQUITY	MAIN_GROUP	\N	1	CREDIT	t	t	f	\N	f	f	Kelompok Modal	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-3101	3101	Modal Disetor	EQUITY	PAID_CAPITAL	COA-3000	2	CREDIT	t	f	f	\N	f	f	Modal yang disetor pemegang saham	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-3201	3201	Laba Ditahan	EQUITY	RETAINED_EARNINGS	COA-3000	2	CREDIT	t	f	f	\N	f	f	Akumulasi laba yang tidak dibagikan	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-4000	4000	PENDAPATAN	REVENUE	MAIN_GROUP	\N	1	CREDIT	t	t	f	\N	f	f	Kelompok Pendapatan	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-4101	4101	Pendapatan Kontrak Konstruksi	REVENUE	CONTRACT_REVENUE	COA-4000	2	CREDIT	t	f	t	\N	t	t	Pendapatan utama dari kontrak konstruksi	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-4102	4102	Pendapatan Perubahan Pekerjaan	REVENUE	CHANGE_ORDER_REVENUE	COA-4000	2	CREDIT	t	f	t	\N	t	t	Pendapatan dari addendum/change order	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-5000	5000	BEBAN LANGSUNG	EXPENSE	DIRECT_COST	\N	1	DEBIT	t	t	t	\N	f	f	Beban langsung proyek	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-5101	5101	Beban Material	EXPENSE	MATERIAL_COST	COA-5000	2	DEBIT	t	f	t	t	f	t	Biaya material konstruksi	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-5102	5102	Beban Tenaga Kerja	EXPENSE	LABOR_COST	COA-5000	2	DEBIT	t	f	t	t	f	t	Upah tenaga kerja langsung	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-5103	5103	Beban Subkontraktor	EXPENSE	SUBCONTRACTOR_COST	COA-5000	2	DEBIT	t	f	t	t	f	t	Biaya subkontraktor	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-5104	5104	Beban Alat Berat	EXPENSE	EQUIPMENT_COST	COA-5000	2	DEBIT	t	f	t	t	f	t	Biaya sewa/operasional alat berat	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-6000	6000	BEBAN TIDAK LANGSUNG	EXPENSE	INDIRECT_COST	\N	1	DEBIT	t	t	f	\N	f	f	Beban tidak langsung/overhead	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-6101	6101	Beban Gaji Administrasi	EXPENSE	ADMIN_SALARY	COA-6000	2	DEBIT	t	f	f	t	f	f	Gaji karyawan administrasi	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-6102	6102	Beban Penyusutan	EXPENSE	DEPRECIATION	COA-6000	2	DEBIT	t	f	f	t	f	f	Penyusutan aset tetap	\N	2025-09-17 03:21:09.03+07	2025-09-17 03:21:09.03+07	0.00	\N
COA-6103	1106	Test Kas Kecil	ASSET	CASH_AND_BANK	COA-1100	3	DEBIT	f	f	f	\N	f	f	Test account for cash management	\N	2025-09-19 15:21:41.648+07	2025-09-19 15:23:08.006+07	0.00	\N
COA-1101	1101	Kas dan Bank	ASSET	CASH_AND_BANK	COA-1100	3	DEBIT	t	f	f	\N	f	f	Updated: Cash and Bank account for operations	\N	2025-09-17 03:21:09.03+07	2025-09-19 15:25:06.17+07	0.00	\N
COA-510101	5101.01	Pembelian Semen	EXPENSE	MATERIAL_COST	COA-5101	3	DEBIT	t	f	f	\N	f	f	Biaya pembelian semen	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510102	5101.02	Pembelian Pasir	EXPENSE	MATERIAL_COST	COA-5101	3	DEBIT	t	f	f	\N	f	f	Biaya pembelian pasir	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510103	5101.03	Pembelian Bata/Batako	EXPENSE	MATERIAL_COST	COA-5101	3	DEBIT	t	f	f	\N	f	f	Biaya pembelian bata/batako	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510104	5101.04	Pembelian Besi Beton	EXPENSE	MATERIAL_COST	COA-5101	3	DEBIT	t	f	f	\N	f	f	Biaya pembelian besi beton	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510105	5101.05	Pembelian Kayu	EXPENSE	MATERIAL_COST	COA-5101	3	DEBIT	t	f	f	\N	f	f	Biaya pembelian kayu konstruksi	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510106	5101.06	Pembelian Cat	EXPENSE	MATERIAL_COST	COA-5101	3	DEBIT	t	f	f	\N	f	f	Biaya pembelian cat	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510201	5102.01	Upah Tukang Batu	EXPENSE	LABOR_COST	COA-5102	3	DEBIT	t	f	f	\N	f	f	Upah tukang batu	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510202	5102.02	Upah Tukang Kayu	EXPENSE	LABOR_COST	COA-5102	3	DEBIT	t	f	f	\N	f	f	Upah tukang kayu	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510203	5102.03	Upah Tukang Cat	EXPENSE	LABOR_COST	COA-5102	3	DEBIT	t	f	f	\N	f	f	Upah tukang cat	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510204	5102.04	Upah Pekerja Umum	EXPENSE	LABOR_COST	COA-5102	3	DEBIT	t	f	f	\N	f	f	Upah pekerja harian lepas	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510301	5103.01	Subkon Pekerjaan Struktur	EXPENSE	SUBCONTRACTOR_COST	COA-5103	3	DEBIT	t	f	f	\N	f	f	Biaya subkontraktor pekerjaan struktur	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-110101	1101.01	Bank BCA	ASSET	CASH_AND_BANK	COA-1101	4	DEBIT	t	f	f	\N	f	f	Rekening Bank BCA untuk operasional perusahaan	\N	2025-10-14 06:15:32.690721+07	2025-10-14 15:30:26.745191+07	1091000000.00	\N
COA-510302	5103.02	Subkon Pekerjaan Arsitektur	EXPENSE	SUBCONTRACTOR_COST	COA-5103	3	DEBIT	t	f	f	\N	f	f	Biaya subkontraktor pekerjaan arsitektur	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510303	5103.03	Subkon Pekerjaan MEP	EXPENSE	SUBCONTRACTOR_COST	COA-5103	3	DEBIT	t	f	f	\N	f	f	Biaya subkontraktor MEP (Mechanical, Electrical, Plumbing)	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510401	5104.01	Sewa Excavator	EXPENSE	EQUIPMENT_COST	COA-5104	3	DEBIT	t	f	f	\N	f	f	Biaya sewa excavator	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510402	5104.02	Sewa Concrete Mixer	EXPENSE	EQUIPMENT_COST	COA-5104	3	DEBIT	t	f	f	\N	f	f	Biaya sewa molen/concrete mixer	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-510403	5104.03	Sewa Scaffolding	EXPENSE	EQUIPMENT_COST	COA-5104	3	DEBIT	t	f	f	\N	f	f	Biaya sewa scaffolding/perancah	\N	2025-10-14 06:38:37.014249+07	2025-10-14 06:38:37.014249+07	0.00	\N
COA-110103	1101.03	Bank BJB	ASSET	CASH_AND_BANK	COA-1101	4	DEBIT	t	f	f	\N	f	f	Rekening Bank BJB (Bank Jabar Banten) untuk operasional perusahaan	\N	2025-10-14 06:15:32.693261+07	2025-10-14 06:15:32.693261+07	100000000.00	\N
COA-110104	1101.04	Bank Mandiri	ASSET	CASH_AND_BANK	COA-1101	4	DEBIT	t	f	f	\N	f	f	Rekening Bank Mandiri untuk operasional perusahaan	\N	2025-10-14 06:17:22.272523+07	2025-10-14 06:17:22.272523+07	1000000000.00	\N
COA-110105	1101.05	Bank BRI	ASSET	CASH_AND_BANK	COA-1101	4	DEBIT	t	f	f	\N	f	f	Rekening Bank BRI untuk operasional perusahaan	\N	2025-10-14 06:17:22.27552+07	2025-10-14 06:17:22.27552+07	100000000.00	\N
COA-110106	1101.06	Bank CIMB Niaga	ASSET	CASH_AND_BANK	COA-1101	4	DEBIT	t	f	f	\N	f	f	Rekening Bank CIMB Niaga untuk operasional perusahaan	\N	2025-10-14 06:17:22.276471+07	2025-10-14 06:17:22.276471+07	100000000.00	\N
COA-110107	1101.07	Kas Tunai	ASSET	CASH_AND_BANK	COA-1101	3	DEBIT	t	f	f	\N	f	f	Kas tunai di kantor/proyek	\N	2025-10-14 06:55:38.547292+07	2025-10-14 07:25:03.90973+07	0.00	\N
COA-110108	1101.08	Kas Kecil (Petty Cash)	ASSET	CASH_AND_BANK	COA-1101	3	DEBIT	t	f	f	\N	f	f	Kas kecil untuk operasional harian	\N	2025-10-14 06:55:38.547292+07	2025-10-14 07:29:05.59032+07	0.00	\N
COA-110102	1101.02	Bank BNI	ASSET	CASH_AND_BANK	COA-1101	4	DEBIT	t	f	f	\N	f	f	Rekening Bank BNI untuk operasional perusahaan	\N	2025-10-14 06:15:32.692582+07	2025-10-14 14:21:05.574723+07	910000000.00	\N
COA-6104	1101-10	BJB	ASSET		COA-1101	4	DEBIT	f	f	f	\N	f	f	\N	\N	2025-10-17 20:22:16.931+07	2025-10-18 00:00:42.949+07	0.00	NU002
\.


--
-- Data for Name: delivery_receipts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.delivery_receipts (id, receipt_number, project_id, purchase_order_id, delivery_date, received_date, delivery_location, received_by, receiver_name, receiver_position, receiver_phone, supplier_delivery_person, supplier_delivery_phone, vehicle_number, delivery_method, status, receipt_type, items, quality_notes, condition_notes, delivery_notes, photos, documents, inspection_result, inspected_by, inspected_at, digital_signature, approved_by, approved_at, rejected_reason, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: entities; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.entities (id, entity_code, entity_name, entity_type, parent_entity_id, address, is_active, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: finance_transactions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.finance_transactions (id, type, category, subcategory, amount, description, date, project_id, account_from, account_to, payment_method, reference_number, status, is_recurring, recurring_pattern, attachments, tags, notes, tax_info, approved_by, approved_at, created_at, updated_at, purchase_order_id) FROM stdin;
FIN-0001	expense	Materials	\N	100000.00	Test transaction from curl	2025-10-14	\N	\N	\N	bank_transfer	TEST-001	completed	f	\N	[]	[]	Testing transaction creation	{}	\N	\N	2025-10-14 17:45:24.505+07	2025-10-14 17:45:24.505+07	\N
FIN-0002	expense	Materials	\N	100000.00	Test transaction from curl	2025-10-14	\N	\N	\N	bank_transfer	TEST-001	completed	f	\N	[]	[]	Testing transaction creation	{}	\N	\N	2025-10-14 17:45:37.151+07	2025-10-14 17:45:37.151+07	\N
FIN-0003	expense	Materials	\N	5000000.00	Test COA integration - Purchase materials	2025-10-14	\N	COA-110101	\N	bank_transfer	\N	completed	f	\N	[]	[]	\N	{}	\N	\N	2025-10-14 18:08:39.04+07	2025-10-14 18:08:39.04+07	\N
FIN-0006	expense	Materials	\N	100000.00	Test material purchase for construction	2025-10-14	\N	COA-110101	\N	\N	\N	completed	f	\N	[]	[]	\N	{}	\N	\N	2025-10-14 18:35:47.037+07	2025-10-14 18:35:47.037+07	\N
FIN-0008	expense	Materials	\N	101.00	batu bata	2025-10-14	\N	COA-110101	\N	\N	\N	completed	f	\N	[]	[]	\N	{}	\N	\N	2025-10-14 18:45:25.219+07	2025-10-14 18:45:25.219+07	\N
FIN-0007	expense	Materials	\N	150000.00	Updated: Test material purchase	2025-10-14	\N	COA-110101	\N	\N	\N	completed	f	\N	[]	[]	\N	{}	\N	\N	2025-10-14 18:36:13.515+07	2025-10-14 18:51:13.776+07	\N
FIN-0005	expense	materials	\N	5000000.00	Pembelian material konstruksi	2025-10-14	\N	COA-110101	\N	\N	MAT-2025-001	completed	f	\N	[]	[]	Pembelian semen dan besi untuk proyek P1	{}	\N	\N	2025-10-14 18:30:02.797+07	2025-10-14 18:30:02.797+07	\N
\.


--
-- Data for Name: fixed_assets; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fixed_assets (id, asset_code, asset_name, asset_category, asset_type, description, purchase_price, purchase_date, supplier, invoice_number, depreciation_method, useful_life, salvage_value, location, department, responsible_person, cost_center, status, condition, serial_number, model_number, manufacturer, depreciation_start_date, accumulated_depreciation, book_value, last_maintenance_date, next_maintenance_date, maintenance_cost, subsidiary_id, created_at, updated_at) FROM stdin;
3b853ee8-8c83-4cf0-8bf0-a68cd15dc7f3	ns1	beko	HEAVY_EQUIPMENT	\N		100000000.00	2025-10-14 07:00:00+07	\N	\N	STRAIGHT_LINE	5	0.00	karawang	\N	\N	\N	ACTIVE	GOOD	\N	\N	\N	2025-10-14 07:00:00+07	0.00	100000000.00	\N	\N	0.00	\N	2025-10-14 14:43:43.562+07	2025-10-14 14:43:43.562+07
\.


--
-- Data for Name: inventory_items; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.inventory_items (id, name, description, category, subcategory, sku, unit, current_stock, minimum_stock, maximum_stock, unit_price, total_value, location, warehouse, supplier, is_active, last_stock_update, specifications, images, tags, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: journal_entries; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.journal_entries (id, entry_number, entry_date, reference, description, total_debit, total_credit, status, project_id, subsidiary_id, created_by, posted_by, posted_at, reversed, reversal_entry_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: journal_entry_lines; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.journal_entry_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount, project_id, cost_center_id, line_number, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.leave_requests (id, user_id, project_id, leave_type, start_date, end_date, total_days, reason, attachment_url, status, approved_by, approved_at, rejection_reason, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: login_history; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.login_history (id, user_id, ip_address, user_agent, browser, os, device, location, country, success, failure_reason, login_at) FROM stdin;
ef815ba5-5a00-4894-b607-bc812fb66307	USR-IT-HADEZ-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-18 14:10:04.418
090cb5f9-c9d7-4a12-858f-f86cef533fc6	USR-IT-HADEZ-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-18 14:36:14.032
0c91739f-f04f-4cee-933f-15f5a4e0caad	USR-IT-HADEZ-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-18 14:38:14.203
4d8e5913-dcd4-4aff-a9ed-fc87e607b59c	USR-IT-HADEZ-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-18 15:52:31.426
a76f59d6-ce0a-43ac-a92f-045327309931	USR-IT-HADEZ-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-18 15:52:55.384
9abf7c64-526d-4282-a24f-ce51273be860	USR-IT-HADEZ-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-18 15:53:04.528
bbb9ed68-4ef9-4e94-a510-d8d03400e8db	USR-IT-HADEZ-001	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	Safari	macOS	Mobile	Unknown	XX	t	\N	2025-10-18 17:32:18.859
55f3106e-2804-439b-a529-fadf421189dc	USR-IT-HADEZ-001	::ffff:127.0.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	f	invalid_password	2025-10-18 17:32:46.024
b17db79f-63ac-4279-bb0c-5ee6331feb91	USR-IT-HADEZ-001	::ffff:172.20.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	Chrome	macOS	Desktop	Unknown	XX	t	\N	2025-10-19 09:19:35.364
ecd8bc17-415d-4924-b3e2-f00f4e6dfcfa	USR-IT-HADEZ-001	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	t	\N	2025-10-19 11:34:29.723
490158e5-eb06-4857-bd43-3b423dd8f586	USR-IT-HADEZ-001	::ffff:172.20.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	Safari	macOS	Mobile	Unknown	XX	t	\N	2025-10-19 19:33:41.463
8269337c-bcf9-4a9c-84ef-65de23003750	USR-IT-HADEZ-001	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	t	\N	2025-10-19 20:05:59.591
8d55215e-77c6-4658-94c3-8b811aaf67a9	USR-IT-HADEZ-001	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	t	\N	2025-10-19 20:37:22.003
7a8e75f0-13c5-40bb-9514-ba3b1bac82e1	USR-IT-HADEZ-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	f	invalid_password	2025-10-19 20:37:48.468
55a2a3bb-d707-45ef-9fd6-b26a9593d6ff	USR-IT-HADEZ-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	f	invalid_password	2025-10-19 20:38:15.151
e50563c0-4b9b-45fe-b0d1-c9d79acc0a67	USR-DIR-YONO-001	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	f	invalid_password	2025-10-19 20:40:24.561
a3731cdc-2ccc-4bcb-a4d2-fd6001ce3623	USR-DIR-YONO-001	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	f	invalid_password	2025-10-19 20:40:26.18
2e93e83f-05b6-4a7b-beb2-afffda5ce5ed	USR-IT-HADEZ-001	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	t	\N	2025-10-19 20:40:38.637
9517fe13-5195-435f-a758-2606070aba9f	USR-IT-HADEZ-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-19 20:42:18.174
729a51fe-7770-458f-9401-f5c097182eed	USR-IT-HADEZ-001	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	t	\N	2025-10-19 20:53:40.912
4b0d48bf-f1ad-498d-836c-fc29b30d188c	USR-IT-HADEZ-001	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	t	\N	2025-10-19 21:30:48.436
4e11cc84-fbda-461a-b756-b5ca52229ad4	USR-IT-HADEZ-001	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	t	\N	2025-10-19 21:36:32.598
453968ca-6445-4d39-a159-7162705a725b	USR-MGR-AZMY-001	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	f	invalid_password	2025-10-19 21:47:25.547
f619b578-3fe2-44e9-9bd3-649781375790	USR-MGR-AZMY-001	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	f	invalid_password	2025-10-19 21:47:26.992
9942c869-e5ea-415d-b125-557ff1bf74f6	USR-MGR-AZMY-001	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	f	invalid_password	2025-10-19 21:47:39.513
7312e241-d7ef-4030-bed0-7de583e2579e	USR-MGR-AZMY-001	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	Chrome	Linux	Mobile	Unknown	XX	t	\N	2025-10-19 21:48:59.516
30831091-c88a-4247-852e-b0d954ca6d37	USR-MGR-AZMY-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	f	invalid_password	2025-10-19 21:54:02.207
759b6508-bffd-481d-ad25-cc41098fec84	USR-MGR-AZMY-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-19 21:55:16.961
c2bbcea4-8900-4ad2-9642-971b738daadb	USR-MGR-AZMY-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	f	invalid_password	2025-10-19 21:55:47.835
e743d761-9237-492b-bde0-0334d8e7bd47	USR-MGR-AZMY-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	f	invalid_password	2025-10-19 21:56:26.893
aad1ed84-c640-41cc-954b-a0015c4a827a	USR-MGR-AZMY-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-19 21:58:01.577
c2036236-eb3d-4b6e-b184-768869d91af8	USR-MGR-AZMY-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	f	invalid_password	2025-10-19 21:58:20.816
ca47fdfb-4b8a-45b7-8cc0-855c887ee908	USR-MGR-AZMY-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-19 21:59:15.223
dc443b10-7175-4a0e-84e8-6ad7445be53b	USR-MGR-AZMY-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-19 21:59:28.379
aea8eba4-2a05-4bd5-ac15-abcac7b8b42a	USR-MGR-AZMY-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-19 21:59:46.53
8479e377-7d32-4b9e-b11f-eda48e688380	USR-MGR-AZMY-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-19 22:07:21.074
feb76b2e-1b88-435a-a660-a7a46f61e4e7	USR-IT-HADEZ-001	::ffff:172.20.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	Chrome	macOS	Desktop	Unknown	XX	t	\N	2025-10-19 22:22:37.047
c13d56d8-b1d3-4f7e-82be-cd4952ad4377	USR-MGR-AZMY-001	::ffff:172.20.0.1	curl/8.14.1	Unknown	Unknown	Desktop	Unknown	XX	t	\N	2025-10-20 04:42:33.484
\.


--
-- Data for Name: manpower; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.manpower (id, employee_id, name, "position", department, email, phone, join_date, birth_date, address, status, employment_type, salary, current_project, skills, metadata, created_at, updated_at, subsidiary_id) FROM stdin;
EMP-PM-ENGKUS-001	PM001	Engkus Kusnadi	Project Manager Umum	Project Management	engkus.kusnadi@nusantaragroup.co.id	+62813-4567-8901	2025-09-16	1980-08-20	Bandung, Indonesia	active	permanent	15000000.00	\N	[{"name": "Project Management", "level": "expert"}, {"name": "Construction Management", "level": "advanced"}]	{"role": "Project Manager", "source": "admin_created"}	2025-09-17 00:12:54.729213+07	2025-09-17 00:12:54.729213+07	\N
EMP-MGR-AZMY-001	MGR001	Azmy	Manager Umum	Management	azmy@nusantaragroup.co.id	+62814-5678-9012	2025-09-16	1985-12-10	Surabaya, Indonesia	active	permanent	12000000.00	\N	[{"name": "Management", "level": "advanced"}, {"name": "Team Leadership", "level": "advanced"}]	{"role": "Manager", "source": "admin_created"}	2025-09-17 00:13:10.289403+07	2025-09-17 00:13:10.289403+07	\N
EMP-IT-HADEZ-001	HADEZ001	Hadez	IT Admin	IT	hadez@nusantaragroup.co.id	+62812-3456-7890	2025-09-16	1990-01-01	Jakarta, Indonesia	active	permanent	8000000.00	\N	[{"name": "System Administration", "level": "expert"}, {"name": "Database Management", "level": "advanced"}]	{"role": "IT Admin", "source": "admin_created"}	2025-09-17 00:10:40.744937+07	2025-09-17 00:10:40.744937+07	\N
EMP-DIR-YONO-001	DIR001	Yono Kurniawan, S.H	Direktur Umum/Utama	Direksi	yono.kurniawan@nusantaragroup.co.id	+62811-2345-6789	2025-09-16	1975-05-15	Jakarta, Indonesia	active	permanent	25000000.00	\N	[{"name": "Leadership", "level": "expert"}, {"name": "Strategic Planning", "level": "expert"}]	{"role": "Director", "source": "admin_created"}	2025-09-17 00:11:50.25899+07	2025-09-17 00:11:50.25899+07	\N
\.


--
-- Data for Name: milestone_activities; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.milestone_activities (id, milestone_id, activity_type, activity_title, activity_description, performed_by, performed_at, metadata, related_photo_id, related_cost_id, created_at) FROM stdin;
\.


--
-- Data for Name: milestone_costs; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.milestone_costs (id, milestone_id, cost_category, cost_type, amount, description, reference_number, recorded_by, recorded_at, approved_by, approved_at, metadata, created_at, updated_at, updated_by, deleted_by, deleted_at, account_id, source_account_id) FROM stdin;
\.


--
-- Data for Name: milestone_dependencies; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.milestone_dependencies (id, milestone_id, depends_on_milestone_id, dependency_type, lag_days, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: milestone_items; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.milestone_items (id, milestone_id, rab_item_id, description, unit, quantity_planned, quantity_po, quantity_received, quantity_completed, quantity_remaining, value_planned, value_po, value_received, value_completed, value_paid, status, progress_percentage, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: milestone_photos; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.milestone_photos (id, milestone_id, photo_url, photo_type, title, description, taken_at, uploaded_by, location_lat, location_lng, weather_condition, metadata, created_at, updated_at, thumbnail_url) FROM stdin;
\.


--
-- Data for Name: notification_preferences; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.notification_preferences (id, user_id, push_enabled, email_enabled, sms_enabled, quiet_hours_start, quiet_hours_end, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notification_tokens; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.notification_tokens (id, user_id, token, device_type, browser_info, is_active, last_used_at, created_at, updated_at) FROM stdin;
3	USR-MGR-AZMY-001	eNSdmTQQcJlICW278v1Hvn:APA91bF1RrjK_2qrBOsEcj1mmmdEt7hmM40cMHljkhNHNr5MCydb0oByypL3fcV9KMYYcw-S6jiJ-Ig6xcY6GqRS0lPDcxqHxHv-pYmeAhm81kfNnTGATa0	web	{}	t	2025-10-20 05:16:40.401+07	2025-10-20 04:43:05.671977+07	2025-10-20 05:16:40.402+07
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.notifications (id, user_id, title, message, type, priority, data, channels, read_at, sent_via, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: progress_payments; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.progress_payments (id, project_id, berita_acara_id, payment_schedule_id, amount, percentage, due_date, status, ba_approved_at, payment_approved_by, payment_approved_at, processing_started_at, paid_at, invoice_number, invoice_date, payment_reference, tax_amount, retention_amount, net_amount, approval_workflow, payment_method, notes, approval_notes, created_by, updated_by, created_at, updated_at, invoice_sent, invoice_sent_at, invoice_sent_by, invoice_sent_notes, invoice_recipient, delivery_method, delivery_evidence, payment_evidence, payment_received_bank, payment_confirmation) FROM stdin;
\.


--
-- Data for Name: project_additional_expenses; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.project_additional_expenses (id, project_id, expense_type, category, description, amount, related_milestone_id, related_rab_item_id, recipient_name, payment_method, receipt_url, notes, approved_by, approved_at, approval_status, rejection_reason, expense_date, created_by, updated_by, deleted_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: project_documents; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.project_documents (id, project_id, title, description, type, category, file_name, original_name, file_path, file_size, mime_type, version, status, tags, metadata, uploaded_by, approved_by, approved_at, access_level, download_count, notes, created_by, updated_by, is_public, last_accessed, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: project_locations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.project_locations (id, project_id, location_name, latitude, longitude, radius_meters, address, is_active, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: project_milestones; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.project_milestones (id, project_id, title, description, target_date, completed_date, status, progress, deliverables, dependencies, assigned_to, priority, notes, created_by, updated_by, created_at, updated_at, budget, actual_cost, category_link, workflow_progress, alerts, auto_generated, last_synced) FROM stdin;
\.


--
-- Data for Name: project_rab; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.project_rab (id, project_id, category, description, unit, quantity, unit_price, total_price, notes, is_approved, approved_by, approved_at, created_by, updated_by, created_at, updated_at, status, item_type) FROM stdin;
\.


--
-- Data for Name: project_team_members; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.project_team_members (id, project_id, employee_id, name, role, department, skills, responsibilities, allocation, hourly_rate, start_date, end_date, status, contact, notes, created_by, updated_by, created_at, updated_at, user_id) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.projects (id, name, description, client_name, client_contact, location, budget, actual_cost, status, priority, progress, start_date, end_date, estimated_duration, project_manager_id, subsidiary_id, created_by, updated_by, subsidiary_info, team, milestones, documents, notes, tags, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.purchase_orders (id, po_number, supplier_id, supplier_name, order_date, expected_delivery_date, status, items, subtotal, tax_amount, total_amount, notes, delivery_address, terms, project_id, created_by, approved_by, approved_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: rab_items; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.rab_items (id, project_id, category, description, quantity, unit_price, unit, approval_status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: rab_purchase_tracking; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.rab_purchase_tracking (id, project_id, rab_item_id, po_number, quantity, unit_price, total_amount, purchase_date, status, notes, created_at, updated_at) FROM stdin;
27	2025GBN001	9af47fad-ee33-484c-8168-1372bef230fb	PO-1760349236401	50.00	100000.00	5000000.00	2025-10-13 16:53:56.401+07	pending	\N	2025-10-13 16:53:56.565+07	2025-10-13 16:53:56.565+07
28	2025GBN001	9af47fad-ee33-484c-8168-1372bef230fb	PO-1760349277919	50.00	100000.00	5000000.00	2025-10-13 16:54:37.919+07	pending	\N	2025-10-13 16:54:38.031+07	2025-10-13 16:54:38.031+07
29	2025PJK001	ed0a8a5a-6c08-4980-b2c7-c17646e61409	PO-1760349755277	50.00	200000.00	10000000.00	2025-10-13 17:02:35.277+07	pending	\N	2025-10-13 17:02:35.374+07	2025-10-13 17:02:35.374+07
30	2025PJK001	8607e361-fcfe-4e33-a77e-cfebeb7a785d	PO-1760349790229	50.00	100000.00	5000000.00	2025-10-13 17:03:10.229+07	pending	\N	2025-10-13 17:03:10.312+07	2025-10-13 17:03:10.312+07
31	2025PJK001	ed0a8a5a-6c08-4980-b2c7-c17646e61409	PO-1760349819945	50.00	200000.00	10000000.00	2025-10-13 17:03:39.945+07	pending	\N	2025-10-13 17:03:40.085+07	2025-10-13 17:03:40.085+07
32	2025PJK001	8607e361-fcfe-4e33-a77e-cfebeb7a785d	PO-1760349819945	50.00	100000.00	5000000.00	2025-10-13 17:03:39.945+07	pending	\N	2025-10-13 17:03:40.085+07	2025-10-13 17:03:40.085+07
33	2025LTS001	d03f3f0c-ed7f-4875-a25b-f34a0b43ca94	PO-1760425899182	160.00	258000.00	41280000.00	2025-10-14 14:11:39.182+07	pending	\N	2025-10-14 14:11:39.364+07	2025-10-14 14:11:39.364+07
34	2025LTS001	d03f3f0c-ed7f-4875-a25b-f34a0b43ca94	PO-1760425959041	130.00	258000.00	33540000.00	2025-10-14 14:12:39.041+07	pending	\N	2025-10-14 14:12:39.226+07	2025-10-14 14:12:39.226+07
35	2025CUE14001	321c0657-9df1-4c4d-ab7e-f1fd014f2f63	PO-1760430323329	1.00	11700000.00	11700000.00	2025-10-14 15:25:23.329+07	pending	\N	2025-10-14 15:25:24.617+07	2025-10-14 15:25:24.617+07
36	2025CUE14001	f11aba3b-ca3f-4225-a8f1-6526484d55f4	PO-1760430323329	1.00	3500000.00	3500000.00	2025-10-14 15:25:23.329+07	pending	\N	2025-10-14 15:25:24.617+07	2025-10-14 15:25:24.617+07
37	2025CUE14001	5c79720e-f600-4799-86a3-656afc905d3e	PO-1760430323329	100.00	76000.00	7600000.00	2025-10-14 15:25:23.329+07	pending	\N	2025-10-14 15:25:24.617+07	2025-10-14 15:25:24.617+07
38	2025CUE14001	321c0657-9df1-4c4d-ab7e-f1fd014f2f63	PO-1760430326673	1.00	11700000.00	11700000.00	2025-10-14 15:25:26.673+07	pending	\N	2025-10-14 15:25:29.511+07	2025-10-14 15:25:29.511+07
39	2025CUE14001	f11aba3b-ca3f-4225-a8f1-6526484d55f4	PO-1760430326673	1.00	3500000.00	3500000.00	2025-10-14 15:25:26.673+07	pending	\N	2025-10-14 15:25:29.511+07	2025-10-14 15:25:29.511+07
40	2025CUE14001	5c79720e-f600-4799-86a3-656afc905d3e	PO-1760430326673	100.00	76000.00	7600000.00	2025-10-14 15:25:26.673+07	pending	\N	2025-10-14 15:25:29.511+07	2025-10-14 15:25:29.511+07
41	2025SSR001	93c254f0-d9c0-4065-93d3-6cc4cd239af5	PO-1760544009156	100.00	100000.00	10000000.00	2025-10-15 23:00:09.156+07	pending	\N	2025-10-15 23:00:09.359+07	2025-10-15 23:00:09.359+07
42	2025BSR001	a5e42b16-f4ba-4935-95d8-e19712dbc089	PO-1760549092127	100.00	100000.00	10000000.00	2025-10-16 00:24:52.127+07	pending	\N	2025-10-16 00:24:52.25+07	2025-10-16 00:24:52.25+07
43	2025PJK001	9e63a3f6-0a83-497c-a756-3e4b38f55f3c	PO-1760610349218	100.00	100000.00	10000000.00	2025-10-16 17:25:49.218+07	pending	\N	2025-10-16 17:25:49.298+07	2025-10-16 17:25:49.298+07
44	2025BSR001	9c641169-cf7e-4685-a36c-dd8e4104c151	PO-1760632626487	50.00	100000.00	5000000.00	2025-10-16 23:37:06.487+07	pending	\N	2025-10-16 23:37:06.647+07	2025-10-16 23:37:06.647+07
\.


--
-- Data for Name: rab_work_order_tracking; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.rab_work_order_tracking (id, project_id, rab_item_id, wo_number, quantity, unit_price, total_amount, work_date, status, created_at, updated_at) FROM stdin;
3	2025SSR001	aadaaedd-8f1d-4efb-8f12-492fa7a0e114	WO-20251015-003	1.00	10000000.00	10000000.00	2025-10-16 07:00:00+07	pending	2025-10-15 23:22:20.487+07	2025-10-15 23:22:20.487+07
4	2025BSR001	4e4857b4-b298-4fc2-99db-ad103f8ee5f6	WO-20251015-001	1.00	10000000.00	10000000.00	2025-10-17 07:00:00+07	pending	2025-10-16 00:25:17.795+07	2025-10-16 00:25:17.795+07
5	2025PJK001	3e3eebd2-a42c-418f-84fb-cccba0522b7b	WO-20251016-001	1.00	10000000.00	10000000.00	2025-10-17 07:00:00+07	pending	2025-10-16 17:34:28.835+07	2025-10-16 17:34:28.835+07
6	2025PJK001	3e3eebd2-a42c-418f-84fb-cccba0522b7b	WO-20251016-002	1.00	10000000.00	10000000.00	2025-10-17 07:00:00+07	pending	2025-10-16 17:34:33.998+07	2025-10-16 17:34:33.998+07
7	2025BSR001	83cf55d4-fb89-4c3b-b331-ef9c32c828aa	WO-20251016-001	1.00	10000000.00	10000000.00	2025-10-18 07:00:00+07	pending	2025-10-17 01:13:28.875+07	2025-10-17 01:13:28.875+07
\.


--
-- Data for Name: sequelize_meta; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.sequelize_meta (name) FROM stdin;
20250113000001-create-milestone-detail-tables.js
20250118000000-create-notification-tokens.js
\.


--
-- Data for Name: subsidiaries; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.subsidiaries (id, name, code, description, specialization, contact_info, address, established_year, employee_count, certification, status, parent_company, board_of_directors, legal_info, permits, financial_info, attachments, profile_info, created_at, updated_at, deleted_at, logo) FROM stdin;
NU005	CV. SAHABAT SINAR RAYA	SSR	Ahli renovasi, retrofit, dan pemeliharaan bangunan	renovation	{"fax": "+62-267-8520-1495", "email": "info@sahabatsinar.co.id", "phone": "+62-267-8520-1405", "mobile": "+62-812-9000-1405"}	{"city": "Karawang", "street": "Jl. Bukit Indah Industrial Kav. E-99", "country": "Indonesia", "village": "Dawuan", "district": "Cikampek", "province": "Jawa Barat", "postalCode": "41374"}	2018	\N	["ISO 9001:2015", "SBU Grade 5"]	active	NUSANTARA GROUP	[{"name": "Ir. Bambang Suryanto", "email": "bambang@sahabatsinarraya.co.id", "phone": "+62-817-8901-2345", "isActive": true, "position": "Direktur Utama", "appointmentDate": "2016-08-01"}]	{"businessLicenseNumber": null, "vatRegistrationNumber": null, "articlesOfIncorporation": null, "taxIdentificationNumber": null, "companyRegistrationNumber": null}	[]	{"currency": "IDR", "fiscalYearEnd": null, "paidUpCapital": null, "authorizedCapital": null}	[]	{"website": null, "companySize": null, "socialMedia": {}, "businessDescription": null, "industryClassification": null}	2025-09-09 12:58:28.024+07	2025-10-16 02:44:29.967+07	\N	\N
NU002	CV. BINTANG SURAYA	BSR	Ahli konstruksi perumahan dan komplek residensial	residential	{"fax": "+62-267-8520-1498", "email": "info@bintangsuraya.co.id", "phone": "+62-267-8520-1402", "mobile": "+62-812-9000-1402"}	{"city": "Karawang", "street": "Jl. Surya Utama Kav. B-88, Surya Cipta", "country": "Indonesia", "village": "Sukaharja", "district": "Telukjambe Timur", "province": "Jawa Barat", "postalCode": "41363"}	2012	\N	["ISO 9001:2015", "SBU Grade 5"]	active	NUSANTARA GROUP	[{"name": "Ahmad Wijaya, S.E.", "email": "ahmad@bintangsuraya.co.id", "phone": "+62-812-3456-7890", "isActive": true, "position": "Direktur Utama", "appointmentDate": "2020-03-15"}, {"name": "Siti Nurhaliza, S.Ak.", "email": "siti@bintangsuraya.co.id", "phone": "+62-813-4567-8901", "isActive": true, "position": "Direktur Keuangan", "appointmentDate": "2020-06-01"}]	{"businessLicenseNumber": "NIB-2345678901234567", "vatRegistrationNumber": "PKP-020234567890000", "articlesOfIncorporation": "Akta Pendirian Perusahaan No. 234 tanggal 20 Maret 2012, dibuat di hadapan Notaris Ir. Siti Nurhaliza, S.H., M.Kn", "taxIdentificationNumber": "02.234.567.8-015.000", "companyRegistrationNumber": "AHU-0023456.AH.01.01.2012"}	[{"name": "Izin Usaha Konstruksi (IUK)", "number": "IUK-BSR-2023-001", "status": "valid", "issuedBy": "LPJK", "expiryDate": "2026-03-10T00:00:00.000Z", "issuedDate": "2023-03-10T00:00:00.000Z"}, {"name": "Sertifikat Badan Usaha (SBU)", "number": "SBU-BSR-2022-001", "status": "valid", "issuedBy": "LPJK Jakarta", "expiryDate": "2025-11-15T00:00:00.000Z", "issuedDate": "2022-11-15T00:00:00.000Z"}]	{"currency": "IDR", "fiscalYearEnd": "31 Desember", "paidUpCapital": 1250000000, "authorizedCapital": 5000000000}	[]	{"website": "https://bintangsuraya.co.id", "companySize": "medium", "socialMedia": {"linkedin": "https://linkedin.com/company/bintang-suraya", "instagram": "https://instagram.com/bintangsuraya_official"}, "businessDescription": "CV. Bintang Suraya mengkhususkan diri dalam konstruksi bangunan residensial berkualitas tinggi. Kami membangun perumahan modern, apartemen, dan kompleks hunian yang nyaman dan berkelanjutan.", "industryClassification": "F41002 - Konstruksi Gedung Bukan Tempat Tinggal"}	2025-09-09 12:58:28.016+07	2025-10-16 03:06:09.036+07	\N	subsidiaries/logos/NU002-1760558768943.png
NU004	CV. GRAHA BANGUN NUSANTARA	GBN	Spesialis pembangunan gedung bertingkat dan mall	commercial	{"fax": "+62-267-8520-1496", "email": "info@grahabangun.co.id", "phone": "+62-267-8520-1404", "mobile": "+62-812-9000-1404"}	{"city": "Karawang", "street": "Jl. Industri Terpadu Kav. D-77, KNIC", "country": "Indonesia", "village": "Gintungkerta", "district": "Klari", "province": "Jawa Barat", "postalCode": "41364"}	2015	0	["ISO 9001:2015", "SBU Grade 6", "Green Building Council"]	active	NUSANTARA GROUP	[{"name": "Ir. Hartono Wijaya, M.M.", "email": "hartono@grahabangun.co.id", "phone": "+62-815-6789-0123", "isActive": true, "position": "Direktur Utama", "appointmentDate": "2017-05-20"}, {"name": "Dra. Maya Puspita", "email": "maya@grahabangun.co.id", "phone": "+62-816-7890-1234", "isActive": true, "position": "Direktur Operasional", "appointmentDate": "2018-02-15"}]	{"businessLicenseNumber": null, "vatRegistrationNumber": null, "articlesOfIncorporation": null, "taxIdentificationNumber": null, "companyRegistrationNumber": null}	[]	{"currency": "IDR", "fiscalYearEnd": null, "paidUpCapital": null, "authorizedCapital": null}	[]	{"website": null, "companySize": null, "socialMedia": {}, "businessDescription": null, "industryClassification": null}	2025-09-09 12:58:28.022+07	2025-10-13 09:20:26.84+07	\N	\N
NU006	PT. PUTRA JAYA KONSTRUKASI	PJK	Kontraktor industri, pabrik, dan fasilitas khusus	industrial	{"fax": "+62-267-8520-1494", "email": "info@putrajaya.co.id", "phone": "+62-267-8520-1406", "mobile": "+62-812-9000-1406"}	{"city": "Karawang", "street": "Jl. Permata Industrial Park Kav. F-123, KIIC", "country": "Indonesia", "village": "Sukaluyu", "district": "Telukjambe Timur", "province": "Jawa Barat", "postalCode": "41361"}	2005	0	["ISO 9001:2015", "SBU Grade 8", "OHSAS 18001", "ISO 14001"]	active	NUSANTARA GROUP	[]	{"businessLicenseNumber": null, "vatRegistrationNumber": null, "articlesOfIncorporation": null, "taxIdentificationNumber": null, "companyRegistrationNumber": null}	[]	{"currency": "IDR", "fiscalYearEnd": null, "paidUpCapital": null, "authorizedCapital": null}	[]	{"website": null, "companySize": null, "socialMedia": {}, "businessDescription": null, "industryClassification": null}	2025-09-09 12:58:28.027+07	2025-10-13 09:20:43.698+07	\N	\N
NU001	CV. CAHAYA UTAMA EMPATBELAS	CUE14	Spesialis pembangunan komersial dan perkantoran modern	commercial	{"fax": "+62-267-8520-1499", "email": "info@cahayautama14.co.id", "phone": "+62-267-8520-1401", "mobile": "+62-812-9000-1401"}	{"city": "Karawang", "street": "Jl. Harapan Raya Kav. A-14, KIIC", "country": "Indonesia", "village": "Sukaluyu", "district": "Telukjambe Timur", "province": "Jawa Barat", "postalCode": "41361"}	2010	0	["ISO 9001:2015", "SBU Grade 6"]	active	NUSANTARA GROUP	[{"name": "Budi Santoso, S.T.", "email": "budi@cahayautama.co.id", "phone": "+62-821-5678-9012", "isActive": true, "position": "Direktur Utama", "appointmentDate": "2019-01-10"}]	{"businessLicenseNumber": "NIB-1234567890123456", "vatRegistrationNumber": "PKP-010123456789000", "articlesOfIncorporation": "Akta Pendirian Perusahaan No. 123 tanggal 15 Januari 2010, dibuat di hadapan Notaris Dr. Ahmad Wahyudi, S.H., M.Kn", "taxIdentificationNumber": "01.123.456.7-014.000", "companyRegistrationNumber": "AHU-0012345.AH.01.01.2010"}	[{"name": "Izin Usaha Konstruksi (IUK)", "number": "IUK-CUE14-2024-001", "status": "valid", "issuedBy": "Lembaga Pengembangan Jasa Konstruksi (LPJK)", "expiryDate": "2027-01-15T00:00:00.000Z", "issuedDate": "2024-01-15T00:00:00.000Z"}, {"name": "Sertifikat Badan Usaha (SBU)", "number": "SBU-CUE14-2023-002", "status": "valid", "issuedBy": "LPJK Jakarta", "expiryDate": "2026-06-20T00:00:00.000Z", "issuedDate": "2023-06-20T00:00:00.000Z"}, {"name": "Tanda Daftar Perusahaan (TDP)", "number": "TDP-01-14-0123456", "status": "valid", "issuedBy": "Dinas Penanaman Modal dan PTSP DKI Jakarta", "expiryDate": "2025-03-10T00:00:00.000Z", "issuedDate": "2020-03-10T00:00:00.000Z"}]	{"currency": "IDR", "fiscalYearEnd": "31 Desember", "paidUpCapital": 2500000000, "authorizedCapital": 10000000000}	[]	{"website": "https://cahayautama14.co.id", "companySize": "medium", "socialMedia": {"youtube": "https://youtube.com/@cahayautama14", "facebook": "https://facebook.com/cahayautama14", "linkedin": "https://linkedin.com/company/cahaya-utama-14", "instagram": "https://instagram.com/cahayautama_official"}, "businessDescription": "CV. Cahaya Utama Empatbelas adalah perusahaan konstruksi yang berfokus pada pembangunan gedung perkantoran modern, pusat perbelanjaan, dan fasilitas komersial lainnya. Dengan pengalaman lebih dari 15 tahun, kami telah menyelesaikan berbagai proyek berkualitas tinggi di Jakarta dan sekitarnya. Tim profesional kami terdiri dari arsitek, insinyur sipil, dan manajer proyek berpengalaman yang berkomitmen memberikan hasil terbaik.", "industryClassification": "F41001 - Konstruksi Gedung Untuk Tempat Tinggal"}	2025-09-09 12:58:28.004+07	2025-10-16 02:44:07.04+07	\N	\N
NU003	CV. LATANSA	LTS	Kontraktor infrastruktur jalan, jembatan, dan fasilitas umum	infrastructure	{"fax": "+62-267-8520-1497", "email": "info@latansa.co.id", "phone": "+62-267-8520-1403", "mobile": "+62-812-9000-1403"}	{"city": "Karawang", "street": "Jl. Mitra Industri Kav. C-25, KIM Karawang", "country": "Indonesia", "village": "Sirnabaya", "district": "Telukjambe Barat", "province": "Jawa Barat", "postalCode": "41362"}	2008	\N	["ISO 9001:2015", "SBU Grade 7", "CSMS Certificate"]	active	NUSANTARA GROUP	[{"name": "Hendra Kusuma, S.T., M.Eng.", "email": "hendra@latansa.co.id", "phone": "+62-817-4455-6677", "isActive": true, "position": "Direktur Utama", "appointmentDate": "2018-01-15T00:00:00.000Z"}]	{"businessLicenseNumber": "NIB-3456789012345678", "vatRegistrationNumber": "PKP-030345678901000", "taxIdentificationNumber": "03.345.678.9-016.000", "companyRegistrationNumber": "AHU-0034567.AH.01.01.2015"}	[{"name": "Izin Usaha Konstruksi (IUK)", "number": "IUK-LTS-2024-001", "status": "valid", "issuedBy": "LPJK", "expiryDate": "2027-02-01T00:00:00.000Z", "issuedDate": "2024-02-01T00:00:00.000Z"}]	{"currency": "IDR", "fiscalYearEnd": "31 Desember", "paidUpCapital": 3200000000, "authorizedCapital": 8000000000}	[]	{"website": "https://latansa.co.id", "companySize": "medium", "socialMedia": {"linkedin": "https://linkedin.com/company/cv-latansa"}, "businessDescription": "CV. Latansa adalah kontraktor infrastruktur yang berpengalaman dalam pembangunan jalan, jembatan, dan fasilitas transportasi lainnya.", "industryClassification": "F42101 - Konstruksi Jalan dan Jalan Rel"}	2025-09-09 12:58:28.019+07	2025-10-16 02:44:17.521+07	\N	\N
\.


--
-- Data for Name: tax_records; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.tax_records (id, type, description, period, base_amount, tax_rate, tax_amount, is_paid, paid_date, due_date, payment_reference, documents, notes, status, filing_reference, project_id, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, username, email, password, role, profile, permissions, is_active, last_login, login_attempts, lock_until, created_at, updated_at) FROM stdin;
USR-PM-ENGKUS-001	engkus	engkus.kusnadi@nusantaragroup.co.id	$2a$10$kZI5Gn7jOCL7LsAOjU0AxuqrXjPdrOzmSTWPeg7uQP/XCX7RIOd7K	project_manager	{"phone": "", "fullName": "Engkus Kusnadi", "position": "Project Manager Umum", "department": "Project Management"}	["project_management", "manpower_management", "resource_allocation"]	t	2025-10-18 13:14:06.404+07	0	\N	2025-09-17 00:08:07.241449+07	2025-10-18 13:14:06.405+07
USR-DIR-YONO-001	yonokurniawan	yono.kurniawan@nusantaragroup.co.id	$2a$10$rpakkqHjZKlD8hOZg6O9x.DNpjHH0mkiKVmcJXzSEQUpv3KZx415K	admin	{"fullName": "Yono Kurniawan, S.H", "position": "Direktur Umum/Utama", "department": "Direksi"}	["admin", "project_management", "finance_management", "hr_management"]	t	2025-10-18 03:47:54.907+07	2	\N	2025-09-17 00:07:48.251551+07	2025-10-20 03:40:26.173+07
USR-IT-HADEZ-001	hadez	hadez@nusantaragroup.co.id	$2a$10$27iOP2y2gXIwJHWTAuyJDungBmgOyHFajIr/Ig8wLY02b5jYFoNBa	admin	{"fullName": "Hadez", "position": "IT Admin", "department": "IT"}	["system_admin", "user_management", "database_admin"]	t	2025-10-20 05:22:37.039+07	0	\N	2025-09-17 00:07:23.79371+07	2025-10-20 05:22:37.04+07
USR-MGR-AZMY-001	azmy	azmy@nusantaragroup.co.id	$2a$10$zHj/xvQRBaV/ptKLrTzO5.oSSskFs94W6TWObM79g2rILFON7dca2	project_manager	{"phone": "", "fullName": "Azmy", "position": "Manager Umum", "department": "Management"}	["management", "supervision", "reporting"]	t	2025-10-20 11:42:33.477+07	0	\N	2025-09-17 00:08:49.652572+07	2025-10-20 11:42:33.477+07
\.


--
-- Data for Name: work_orders; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.work_orders (id, wo_number, contractor_id, contractor_name, contractor_contact, contractor_address, start_date, end_date, status, items, total_amount, notes, project_id, created_by, updated_by, approved_by, approved_at, approval_notes, rejected_by, rejected_at, rejection_reason, deleted, deleted_at, deleted_by, created_at, updated_at) FROM stdin;
\.


--
-- Name: notification_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.notification_tokens_id_seq', 3, true);


--
-- Name: rab_purchase_tracking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.rab_purchase_tracking_id_seq', 44, true);


--
-- Name: rab_work_order_tracking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.rab_work_order_tracking_id_seq', 7, true);


--
-- Name: active_sessions active_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.active_sessions
    ADD CONSTRAINT active_sessions_pkey PRIMARY KEY (id);


--
-- Name: approval_instances approval_instances_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.approval_instances
    ADD CONSTRAINT approval_instances_pkey PRIMARY KEY (id);


--
-- Name: approval_notifications approval_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.approval_notifications
    ADD CONSTRAINT approval_notifications_pkey PRIMARY KEY (id);


--
-- Name: approval_steps approval_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.approval_steps
    ADD CONSTRAINT approval_steps_pkey PRIMARY KEY (id);


--
-- Name: approval_workflows approval_workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT approval_workflows_pkey PRIMARY KEY (id);


--
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- Name: attendance_settings attendance_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendance_settings
    ADD CONSTRAINT attendance_settings_pkey PRIMARY KEY (id);


--
-- Name: attendance_settings attendance_settings_project_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendance_settings
    ADD CONSTRAINT attendance_settings_project_id_key UNIQUE (project_id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: backup_history backup_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.backup_history
    ADD CONSTRAINT backup_history_pkey PRIMARY KEY (id);


--
-- Name: berita_acara berita_acara_ba_number_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.berita_acara
    ADD CONSTRAINT berita_acara_ba_number_key UNIQUE (ba_number);


--
-- Name: berita_acara berita_acara_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.berita_acara
    ADD CONSTRAINT berita_acara_pkey PRIMARY KEY (id);


--
-- Name: board_directors board_directors_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.board_directors
    ADD CONSTRAINT board_directors_pkey PRIMARY KEY (id);


--
-- Name: chart_of_accounts chart_of_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.chart_of_accounts
    ADD CONSTRAINT chart_of_accounts_pkey PRIMARY KEY (id);


--
-- Name: delivery_receipts delivery_receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.delivery_receipts
    ADD CONSTRAINT delivery_receipts_pkey PRIMARY KEY (id);


--
-- Name: delivery_receipts delivery_receipts_receipt_number_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.delivery_receipts
    ADD CONSTRAINT delivery_receipts_receipt_number_key UNIQUE (receipt_number);


--
-- Name: entities entities_entity_code_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.entities
    ADD CONSTRAINT entities_entity_code_key UNIQUE (entity_code);


--
-- Name: entities entities_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.entities
    ADD CONSTRAINT entities_pkey PRIMARY KEY (id);


--
-- Name: finance_transactions finance_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.finance_transactions
    ADD CONSTRAINT finance_transactions_pkey PRIMARY KEY (id);


--
-- Name: fixed_assets fixed_assets_asset_code_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fixed_assets
    ADD CONSTRAINT fixed_assets_asset_code_key UNIQUE (asset_code);


--
-- Name: fixed_assets fixed_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fixed_assets
    ADD CONSTRAINT fixed_assets_pkey PRIMARY KEY (id);


--
-- Name: inventory_items inventory_items_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_pkey PRIMARY KEY (id);


--
-- Name: inventory_items inventory_items_sku_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_sku_key UNIQUE (sku);


--
-- Name: journal_entries journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_pkey PRIMARY KEY (id);


--
-- Name: journal_entry_lines journal_entry_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.journal_entry_lines
    ADD CONSTRAINT journal_entry_lines_pkey PRIMARY KEY (id);


--
-- Name: leave_requests leave_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_pkey PRIMARY KEY (id);


--
-- Name: login_history login_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.login_history
    ADD CONSTRAINT login_history_pkey PRIMARY KEY (id);


--
-- Name: manpower manpower_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.manpower
    ADD CONSTRAINT manpower_employee_id_key UNIQUE (employee_id);


--
-- Name: manpower manpower_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.manpower
    ADD CONSTRAINT manpower_pkey PRIMARY KEY (id);


--
-- Name: milestone_activities milestone_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_activities
    ADD CONSTRAINT milestone_activities_pkey PRIMARY KEY (id);


--
-- Name: milestone_costs milestone_costs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_costs
    ADD CONSTRAINT milestone_costs_pkey PRIMARY KEY (id);


--
-- Name: milestone_dependencies milestone_dependencies_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_dependencies
    ADD CONSTRAINT milestone_dependencies_pkey PRIMARY KEY (id);


--
-- Name: milestone_items milestone_items_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_items
    ADD CONSTRAINT milestone_items_pkey PRIMARY KEY (id);


--
-- Name: milestone_photos milestone_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_photos
    ADD CONSTRAINT milestone_photos_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_key UNIQUE (user_id);


--
-- Name: notification_tokens notification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notification_tokens
    ADD CONSTRAINT notification_tokens_pkey PRIMARY KEY (id);


--
-- Name: notification_tokens notification_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notification_tokens
    ADD CONSTRAINT notification_tokens_token_key UNIQUE (token);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: progress_payments progress_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.progress_payments
    ADD CONSTRAINT progress_payments_pkey PRIMARY KEY (id);


--
-- Name: project_additional_expenses project_additional_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.project_additional_expenses
    ADD CONSTRAINT project_additional_expenses_pkey PRIMARY KEY (id);


--
-- Name: project_documents project_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.project_documents
    ADD CONSTRAINT project_documents_pkey PRIMARY KEY (id);


--
-- Name: project_locations project_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.project_locations
    ADD CONSTRAINT project_locations_pkey PRIMARY KEY (id);


--
-- Name: project_milestones project_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT project_milestones_pkey PRIMARY KEY (id);


--
-- Name: project_rab project_rab_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.project_rab
    ADD CONSTRAINT project_rab_pkey PRIMARY KEY (id);


--
-- Name: project_team_members project_team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.project_team_members
    ADD CONSTRAINT project_team_members_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_po_number_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_po_number_key UNIQUE (po_number);


--
-- Name: rab_items rab_items_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rab_items
    ADD CONSTRAINT rab_items_pkey PRIMARY KEY (id);


--
-- Name: rab_purchase_tracking rab_purchase_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rab_purchase_tracking
    ADD CONSTRAINT rab_purchase_tracking_pkey PRIMARY KEY (id);


--
-- Name: rab_work_order_tracking rab_work_order_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rab_work_order_tracking
    ADD CONSTRAINT rab_work_order_tracking_pkey PRIMARY KEY (id);


--
-- Name: sequelize_meta sequelize_meta_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sequelize_meta
    ADD CONSTRAINT sequelize_meta_pkey PRIMARY KEY (name);


--
-- Name: subsidiaries subsidiaries_code_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.subsidiaries
    ADD CONSTRAINT subsidiaries_code_key UNIQUE (code);


--
-- Name: subsidiaries subsidiaries_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.subsidiaries
    ADD CONSTRAINT subsidiaries_pkey PRIMARY KEY (id);


--
-- Name: tax_records tax_records_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tax_records
    ADD CONSTRAINT tax_records_pkey PRIMARY KEY (id);


--
-- Name: milestone_dependencies unique_dependency; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_dependencies
    ADD CONSTRAINT unique_dependency UNIQUE (milestone_id, depends_on_milestone_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: work_orders work_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_pkey PRIMARY KEY (id);


--
-- Name: work_orders work_orders_wo_number_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_wo_number_key UNIQUE (wo_number);


--
-- Name: active_sessions_expires_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX active_sessions_expires_at ON public.active_sessions USING btree (expires_at);


--
-- Name: active_sessions_expires_at_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX active_sessions_expires_at_idx ON public.active_sessions USING btree (expires_at);


--
-- Name: active_sessions_last_active; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX active_sessions_last_active ON public.active_sessions USING btree (last_active);


--
-- Name: active_sessions_last_active_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX active_sessions_last_active_idx ON public.active_sessions USING btree (last_active);


--
-- Name: active_sessions_token; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX active_sessions_token ON public.active_sessions USING btree (token);


--
-- Name: active_sessions_token_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX active_sessions_token_idx ON public.active_sessions USING hash (token);


--
-- Name: active_sessions_user_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX active_sessions_user_id ON public.active_sessions USING btree (user_id);


--
-- Name: active_sessions_user_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX active_sessions_user_id_idx ON public.active_sessions USING btree (user_id);


--
-- Name: attendance_records_attendance_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX attendance_records_attendance_date ON public.attendance_records USING btree (attendance_date);


--
-- Name: attendance_records_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX attendance_records_project_id ON public.attendance_records USING btree (project_id);


--
-- Name: attendance_records_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX attendance_records_status ON public.attendance_records USING btree (status);


--
-- Name: attendance_records_user_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX attendance_records_user_id ON public.attendance_records USING btree (user_id);


--
-- Name: attendance_records_user_id_attendance_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX attendance_records_user_id_attendance_date ON public.attendance_records USING btree (user_id, attendance_date);


--
-- Name: attendance_settings_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX attendance_settings_project_id ON public.attendance_settings USING btree (project_id);


--
-- Name: audit_logs_action; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_action ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_created_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_created_at ON public.audit_logs USING btree (created_at);


--
-- Name: audit_logs_created_at_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);


--
-- Name: audit_logs_entity_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_entity_id ON public.audit_logs USING btree (entity_id);


--
-- Name: audit_logs_entity_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_entity_id_idx ON public.audit_logs USING btree (entity_id);


--
-- Name: audit_logs_entity_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_entity_idx ON public.audit_logs USING btree (entity_type, entity_id);


--
-- Name: audit_logs_entity_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_entity_type ON public.audit_logs USING btree (entity_type);


--
-- Name: audit_logs_entity_type_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_entity_type_idx ON public.audit_logs USING btree (entity_type);


--
-- Name: audit_logs_user_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_user_id ON public.audit_logs USING btree (user_id);


--
-- Name: audit_logs_user_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs USING btree (user_id);


--
-- Name: audit_logs_user_time_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_user_time_idx ON public.audit_logs USING btree (user_id, created_at);


--
-- Name: chart_of_accounts_account_code; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX chart_of_accounts_account_code ON public.chart_of_accounts USING btree (account_code);


--
-- Name: chart_of_accounts_account_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX chart_of_accounts_account_type ON public.chart_of_accounts USING btree (account_type);


--
-- Name: chart_of_accounts_is_active; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX chart_of_accounts_is_active ON public.chart_of_accounts USING btree (is_active);


--
-- Name: chart_of_accounts_level; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX chart_of_accounts_level ON public.chart_of_accounts USING btree (level);


--
-- Name: chart_of_accounts_parent_account_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX chart_of_accounts_parent_account_id ON public.chart_of_accounts USING btree (parent_account_id);


--
-- Name: delivery_receipts_delivery_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX delivery_receipts_delivery_date ON public.delivery_receipts USING btree (delivery_date);


--
-- Name: delivery_receipts_inspection_result; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX delivery_receipts_inspection_result ON public.delivery_receipts USING btree (inspection_result);


--
-- Name: delivery_receipts_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX delivery_receipts_project_id ON public.delivery_receipts USING btree (project_id);


--
-- Name: delivery_receipts_purchase_order_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX delivery_receipts_purchase_order_id ON public.delivery_receipts USING btree (purchase_order_id);


--
-- Name: delivery_receipts_receipt_number; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX delivery_receipts_receipt_number ON public.delivery_receipts USING btree (receipt_number);


--
-- Name: delivery_receipts_received_by; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX delivery_receipts_received_by ON public.delivery_receipts USING btree (received_by);


--
-- Name: delivery_receipts_received_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX delivery_receipts_received_date ON public.delivery_receipts USING btree (received_date);


--
-- Name: delivery_receipts_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX delivery_receipts_status ON public.delivery_receipts USING btree (status);


--
-- Name: entities_entity_code; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX entities_entity_code ON public.entities USING btree (entity_code);


--
-- Name: entities_entity_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX entities_entity_type ON public.entities USING btree (entity_type);


--
-- Name: entities_is_active; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX entities_is_active ON public.entities USING btree (is_active);


--
-- Name: entities_parent_entity_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX entities_parent_entity_id ON public.entities USING btree (parent_entity_id);


--
-- Name: finance_transactions_category; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX finance_transactions_category ON public.finance_transactions USING btree (category);


--
-- Name: finance_transactions_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX finance_transactions_date ON public.finance_transactions USING btree (date);


--
-- Name: finance_transactions_payment_method; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX finance_transactions_payment_method ON public.finance_transactions USING btree (payment_method);


--
-- Name: finance_transactions_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX finance_transactions_project_id ON public.finance_transactions USING btree (project_id);


--
-- Name: finance_transactions_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX finance_transactions_status ON public.finance_transactions USING btree (status);


--
-- Name: finance_transactions_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX finance_transactions_type ON public.finance_transactions USING btree (type);


--
-- Name: fixed_assets_asset_category; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX fixed_assets_asset_category ON public.fixed_assets USING btree (asset_category);


--
-- Name: fixed_assets_asset_code; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX fixed_assets_asset_code ON public.fixed_assets USING btree (asset_code);


--
-- Name: fixed_assets_purchase_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX fixed_assets_purchase_date ON public.fixed_assets USING btree (purchase_date);


--
-- Name: fixed_assets_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX fixed_assets_status ON public.fixed_assets USING btree (status);


--
-- Name: idx_additional_expenses_created_by; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_additional_expenses_created_by ON public.project_additional_expenses USING btree (created_by);


--
-- Name: idx_additional_expenses_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_additional_expenses_date ON public.project_additional_expenses USING btree (expense_date);


--
-- Name: idx_additional_expenses_deleted_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_additional_expenses_deleted_at ON public.project_additional_expenses USING btree (deleted_at);


--
-- Name: idx_additional_expenses_project; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_additional_expenses_project ON public.project_additional_expenses USING btree (project_id);


--
-- Name: idx_additional_expenses_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_additional_expenses_status ON public.project_additional_expenses USING btree (approval_status);


--
-- Name: idx_additional_expenses_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_additional_expenses_type ON public.project_additional_expenses USING btree (expense_type);


--
-- Name: idx_approval_instances_entity; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_approval_instances_entity ON public.approval_instances USING btree (entity_id, entity_type);


--
-- Name: idx_approval_instances_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_approval_instances_status ON public.approval_instances USING btree (overall_status);


--
-- Name: idx_approval_steps_approver; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_approval_steps_approver ON public.approval_steps USING btree (approver_user_id, status);


--
-- Name: idx_approval_steps_instance; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_approval_steps_instance ON public.approval_steps USING btree (instance_id, step_number);


--
-- Name: idx_attendance_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_attendance_date ON public.attendance_records USING btree (attendance_date);


--
-- Name: idx_attendance_project; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_attendance_project ON public.attendance_records USING btree (project_id);


--
-- Name: idx_attendance_settings_project; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_attendance_settings_project ON public.attendance_settings USING btree (project_id);


--
-- Name: idx_attendance_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_attendance_status ON public.attendance_records USING btree (status);


--
-- Name: idx_attendance_unique_daily; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX idx_attendance_unique_daily ON public.attendance_records USING btree (user_id, project_id, attendance_date);


--
-- Name: idx_attendance_user; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_attendance_user ON public.attendance_records USING btree (user_id);


--
-- Name: idx_attendance_user_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_attendance_user_date ON public.attendance_records USING btree (user_id, attendance_date);


--
-- Name: idx_backup_history_completed_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_backup_history_completed_at ON public.backup_history USING btree ("completedAt");


--
-- Name: idx_backup_history_deleted; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_backup_history_deleted ON public.backup_history USING btree ("isDeleted");


--
-- Name: idx_backup_history_expires_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_backup_history_expires_at ON public.backup_history USING btree ("expiresAt");


--
-- Name: idx_backup_history_started_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_backup_history_started_at ON public.backup_history USING btree ("startedAt");


--
-- Name: idx_backup_history_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_backup_history_status ON public.backup_history USING btree (status);


--
-- Name: idx_backup_history_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_backup_history_type ON public.backup_history USING btree ("backupType");


--
-- Name: idx_board_directors_active; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_board_directors_active ON public.board_directors USING btree (is_active);


--
-- Name: idx_board_directors_position; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_board_directors_position ON public.board_directors USING btree ("position");


--
-- Name: idx_board_directors_subsidiary; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_board_directors_subsidiary ON public.board_directors USING btree (subsidiary_id);


--
-- Name: idx_chart_of_accounts_subsidiary_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_chart_of_accounts_subsidiary_id ON public.chart_of_accounts USING btree (subsidiary_id);


--
-- Name: idx_leave_requests_dates; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_leave_requests_dates ON public.leave_requests USING btree (start_date, end_date);


--
-- Name: idx_leave_requests_project; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_leave_requests_project ON public.leave_requests USING btree (project_id);


--
-- Name: idx_leave_requests_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_leave_requests_status ON public.leave_requests USING btree (status);


--
-- Name: idx_leave_requests_user; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_leave_requests_user ON public.leave_requests USING btree (user_id);


--
-- Name: idx_milestone_activities_milestone; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_activities_milestone ON public.milestone_activities USING btree (milestone_id);


--
-- Name: idx_milestone_activities_performed; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_activities_performed ON public.milestone_activities USING btree (performed_at DESC);


--
-- Name: idx_milestone_activities_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_activities_type ON public.milestone_activities USING btree (activity_type);


--
-- Name: idx_milestone_costs_category; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_costs_category ON public.milestone_costs USING btree (cost_category);


--
-- Name: idx_milestone_costs_deleted; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_costs_deleted ON public.milestone_costs USING btree (deleted_at);


--
-- Name: idx_milestone_costs_deleted_by; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_costs_deleted_by ON public.milestone_costs USING btree (deleted_by);


--
-- Name: idx_milestone_costs_milestone; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_costs_milestone ON public.milestone_costs USING btree (milestone_id);


--
-- Name: idx_milestone_costs_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_costs_type ON public.milestone_costs USING btree (cost_type);


--
-- Name: idx_milestone_costs_updated_by; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_costs_updated_by ON public.milestone_costs USING btree (updated_by);


--
-- Name: idx_milestone_deps_depends_on; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_deps_depends_on ON public.milestone_dependencies USING btree (depends_on_milestone_id);


--
-- Name: idx_milestone_deps_milestone; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_deps_milestone ON public.milestone_dependencies USING btree (milestone_id);


--
-- Name: idx_milestone_items_milestone; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_items_milestone ON public.milestone_items USING btree (milestone_id);


--
-- Name: idx_milestone_items_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_items_status ON public.milestone_items USING btree (status);


--
-- Name: idx_milestone_photos_milestone; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_photos_milestone ON public.milestone_photos USING btree (milestone_id);


--
-- Name: idx_milestone_photos_taken; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_photos_taken ON public.milestone_photos USING btree (taken_at);


--
-- Name: idx_milestone_photos_thumbnail; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_photos_thumbnail ON public.milestone_photos USING btree (thumbnail_url);


--
-- Name: idx_milestone_photos_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_milestone_photos_type ON public.milestone_photos USING btree (photo_type);


--
-- Name: idx_notification_tokens_is_active; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_notification_tokens_is_active ON public.notification_tokens USING btree (is_active);


--
-- Name: idx_notification_tokens_token; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_notification_tokens_token ON public.notification_tokens USING btree (token);


--
-- Name: idx_notification_tokens_user_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_notification_tokens_user_id ON public.notification_tokens USING btree (user_id);


--
-- Name: idx_notifications_created_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at);


--
-- Name: idx_notifications_recipient; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_notifications_recipient ON public.approval_notifications USING btree (recipient_user_id, status);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_project_locations_active; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_project_locations_active ON public.project_locations USING btree (is_active);


--
-- Name: idx_project_locations_project; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_project_locations_project ON public.project_locations USING btree (project_id);


--
-- Name: idx_rab_items_approval_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_rab_items_approval_status ON public.rab_items USING btree (approval_status);


--
-- Name: idx_rab_items_category; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_rab_items_category ON public.rab_items USING btree (category);


--
-- Name: idx_rab_items_project; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_rab_items_project ON public.rab_items USING btree (project_id);


--
-- Name: idx_rab_wo_tracking_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_rab_wo_tracking_project_id ON public.rab_work_order_tracking USING btree (project_id);


--
-- Name: idx_rab_wo_tracking_rab_item_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_rab_wo_tracking_rab_item_id ON public.rab_work_order_tracking USING btree (rab_item_id);


--
-- Name: idx_rab_wo_tracking_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_rab_wo_tracking_status ON public.rab_work_order_tracking USING btree (status);


--
-- Name: idx_rab_wo_tracking_wo_number; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_rab_wo_tracking_wo_number ON public.rab_work_order_tracking USING btree (wo_number);


--
-- Name: idx_subsidiaries_logo; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_subsidiaries_logo ON public.subsidiaries USING btree (logo) WHERE (logo IS NOT NULL);


--
-- Name: idx_work_orders_contractor_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_work_orders_contractor_id ON public.work_orders USING btree (contractor_id);


--
-- Name: idx_work_orders_created_by; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_work_orders_created_by ON public.work_orders USING btree (created_by);


--
-- Name: idx_work_orders_deleted; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_work_orders_deleted ON public.work_orders USING btree (deleted);


--
-- Name: idx_work_orders_end_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_work_orders_end_date ON public.work_orders USING btree (end_date);


--
-- Name: idx_work_orders_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_work_orders_project_id ON public.work_orders USING btree (project_id);


--
-- Name: idx_work_orders_start_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_work_orders_start_date ON public.work_orders USING btree (start_date);


--
-- Name: idx_work_orders_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_work_orders_status ON public.work_orders USING btree (status);


--
-- Name: idx_work_orders_wo_number; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_work_orders_wo_number ON public.work_orders USING btree (wo_number);


--
-- Name: inventory_items_category; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX inventory_items_category ON public.inventory_items USING btree (category);


--
-- Name: inventory_items_is_active; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX inventory_items_is_active ON public.inventory_items USING btree (is_active);


--
-- Name: inventory_items_sku; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX inventory_items_sku ON public.inventory_items USING btree (sku);


--
-- Name: inventory_items_warehouse; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX inventory_items_warehouse ON public.inventory_items USING btree (warehouse);


--
-- Name: journal_entries_entry_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX journal_entries_entry_date ON public.journal_entries USING btree (entry_date);


--
-- Name: journal_entries_entry_number; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX journal_entries_entry_number ON public.journal_entries USING btree (entry_number);


--
-- Name: journal_entries_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX journal_entries_project_id ON public.journal_entries USING btree (project_id);


--
-- Name: journal_entries_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX journal_entries_status ON public.journal_entries USING btree (status);


--
-- Name: journal_entries_subsidiary_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX journal_entries_subsidiary_id ON public.journal_entries USING btree (subsidiary_id);


--
-- Name: journal_entry_lines_account_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX journal_entry_lines_account_id ON public.journal_entry_lines USING btree (account_id);


--
-- Name: journal_entry_lines_journal_entry_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX journal_entry_lines_journal_entry_id ON public.journal_entry_lines USING btree (journal_entry_id);


--
-- Name: journal_entry_lines_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX journal_entry_lines_project_id ON public.journal_entry_lines USING btree (project_id);


--
-- Name: leave_requests_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX leave_requests_project_id ON public.leave_requests USING btree (project_id);


--
-- Name: leave_requests_start_date_end_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX leave_requests_start_date_end_date ON public.leave_requests USING btree (start_date, end_date);


--
-- Name: leave_requests_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX leave_requests_status ON public.leave_requests USING btree (status);


--
-- Name: leave_requests_user_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX leave_requests_user_id ON public.leave_requests USING btree (user_id);


--
-- Name: login_history_login_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX login_history_login_at ON public.login_history USING btree (login_at);


--
-- Name: login_history_login_at_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX login_history_login_at_idx ON public.login_history USING btree (login_at);


--
-- Name: login_history_success; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX login_history_success ON public.login_history USING btree (success);


--
-- Name: login_history_success_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX login_history_success_idx ON public.login_history USING btree (success);


--
-- Name: login_history_user_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX login_history_user_id ON public.login_history USING btree (user_id);


--
-- Name: login_history_user_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX login_history_user_id_idx ON public.login_history USING btree (user_id);


--
-- Name: login_history_user_id_login_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX login_history_user_id_login_at ON public.login_history USING btree (user_id, login_at);


--
-- Name: milestone_activities_activity_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX milestone_activities_activity_type ON public.milestone_activities USING btree (activity_type);


--
-- Name: milestone_activities_milestone_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX milestone_activities_milestone_id ON public.milestone_activities USING btree (milestone_id);


--
-- Name: milestone_activities_performed_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX milestone_activities_performed_at ON public.milestone_activities USING btree (performed_at);


--
-- Name: milestone_activities_performed_by; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX milestone_activities_performed_by ON public.milestone_activities USING btree (performed_by);


--
-- Name: milestone_costs_cost_category; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX milestone_costs_cost_category ON public.milestone_costs USING btree (cost_category);


--
-- Name: milestone_costs_cost_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX milestone_costs_cost_type ON public.milestone_costs USING btree (cost_type);


--
-- Name: milestone_costs_milestone_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX milestone_costs_milestone_id ON public.milestone_costs USING btree (milestone_id);


--
-- Name: milestone_costs_recorded_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX milestone_costs_recorded_at ON public.milestone_costs USING btree (recorded_at);


--
-- Name: milestone_photos_milestone_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX milestone_photos_milestone_id ON public.milestone_photos USING btree (milestone_id);


--
-- Name: milestone_photos_photo_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX milestone_photos_photo_type ON public.milestone_photos USING btree (photo_type);


--
-- Name: milestone_photos_taken_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX milestone_photos_taken_at ON public.milestone_photos USING btree (taken_at);


--
-- Name: milestone_photos_uploaded_by; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX milestone_photos_uploaded_by ON public.milestone_photos USING btree (uploaded_by);


--
-- Name: project_additional_expenses_approval_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX project_additional_expenses_approval_status ON public.project_additional_expenses USING btree (approval_status);


--
-- Name: project_additional_expenses_created_by; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX project_additional_expenses_created_by ON public.project_additional_expenses USING btree (created_by);


--
-- Name: project_additional_expenses_expense_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX project_additional_expenses_expense_date ON public.project_additional_expenses USING btree (expense_date);


--
-- Name: project_additional_expenses_expense_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX project_additional_expenses_expense_type ON public.project_additional_expenses USING btree (expense_type);


--
-- Name: project_additional_expenses_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX project_additional_expenses_project_id ON public.project_additional_expenses USING btree (project_id);


--
-- Name: project_locations_is_active; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX project_locations_is_active ON public.project_locations USING btree (is_active);


--
-- Name: project_locations_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX project_locations_project_id ON public.project_locations USING btree (project_id);


--
-- Name: projects_end_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX projects_end_date ON public.projects USING btree (end_date);


--
-- Name: projects_priority; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX projects_priority ON public.projects USING btree (priority);


--
-- Name: projects_project_manager_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX projects_project_manager_id ON public.projects USING btree (project_manager_id);


--
-- Name: projects_start_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX projects_start_date ON public.projects USING btree (start_date);


--
-- Name: projects_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX projects_status ON public.projects USING btree (status);


--
-- Name: purchase_orders_created_by; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX purchase_orders_created_by ON public.purchase_orders USING btree (created_by);


--
-- Name: purchase_orders_order_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX purchase_orders_order_date ON public.purchase_orders USING btree (order_date);


--
-- Name: purchase_orders_po_number; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX purchase_orders_po_number ON public.purchase_orders USING btree (po_number);


--
-- Name: purchase_orders_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX purchase_orders_project_id ON public.purchase_orders USING btree (project_id);


--
-- Name: purchase_orders_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX purchase_orders_status ON public.purchase_orders USING btree (status);


--
-- Name: purchase_orders_supplier_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX purchase_orders_supplier_id ON public.purchase_orders USING btree (supplier_id);


--
-- Name: subsidiaries_code; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX subsidiaries_code ON public.subsidiaries USING btree (code);


--
-- Name: subsidiaries_specialization; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX subsidiaries_specialization ON public.subsidiaries USING btree (specialization);


--
-- Name: subsidiaries_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX subsidiaries_status ON public.subsidiaries USING btree (status);


--
-- Name: tax_records_created_by; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX tax_records_created_by ON public.tax_records USING btree (created_by);


--
-- Name: tax_records_due_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX tax_records_due_date ON public.tax_records USING btree (due_date);


--
-- Name: tax_records_period; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX tax_records_period ON public.tax_records USING btree (period);


--
-- Name: tax_records_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX tax_records_project_id ON public.tax_records USING btree (project_id);


--
-- Name: tax_records_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX tax_records_status ON public.tax_records USING btree (status);


--
-- Name: tax_records_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX tax_records_type ON public.tax_records USING btree (type);


--
-- Name: users_email; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX users_email ON public.users USING btree (email);


--
-- Name: users_is_active; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX users_is_active ON public.users USING btree (is_active);


--
-- Name: users_role; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX users_role ON public.users USING btree (role);


--
-- Name: users_username; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX users_username ON public.users USING btree (username);


--
-- Name: work_orders_contractor_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX work_orders_contractor_id ON public.work_orders USING btree (contractor_id);


--
-- Name: work_orders_created_by; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX work_orders_created_by ON public.work_orders USING btree (created_by);


--
-- Name: work_orders_deleted; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX work_orders_deleted ON public.work_orders USING btree (deleted);


--
-- Name: work_orders_end_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX work_orders_end_date ON public.work_orders USING btree (end_date);


--
-- Name: work_orders_project_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX work_orders_project_id ON public.work_orders USING btree (project_id);


--
-- Name: work_orders_start_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX work_orders_start_date ON public.work_orders USING btree (start_date);


--
-- Name: work_orders_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX work_orders_status ON public.work_orders USING btree (status);


--
-- Name: work_orders_wo_number; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX work_orders_wo_number ON public.work_orders USING btree (wo_number);


--
-- Name: approval_instances approval_instances_updated_at; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER approval_instances_updated_at BEFORE UPDATE ON public.approval_instances FOR EACH ROW EXECUTE FUNCTION public.update_approval_timestamp();


--
-- Name: approval_steps approval_steps_updated_at; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER approval_steps_updated_at BEFORE UPDATE ON public.approval_steps FOR EACH ROW EXECUTE FUNCTION public.update_approval_timestamp();


--
-- Name: attendance_records calculate_attendance_duration; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER calculate_attendance_duration BEFORE INSERT OR UPDATE ON public.attendance_records FOR EACH ROW EXECUTE FUNCTION public.calculate_work_duration();


--
-- Name: attendance_records update_attendance_records_updated_at; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER update_attendance_records_updated_at BEFORE UPDATE ON public.attendance_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: attendance_settings update_attendance_settings_updated_at; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER update_attendance_settings_updated_at BEFORE UPDATE ON public.attendance_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: board_directors update_board_directors_updated_at; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER update_board_directors_updated_at BEFORE UPDATE ON public.board_directors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: leave_requests update_leave_requests_updated_at; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: project_locations update_project_locations_updated_at; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER update_project_locations_updated_at BEFORE UPDATE ON public.project_locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: approval_instances approval_instances_workflow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.approval_instances
    ADD CONSTRAINT approval_instances_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES public.approval_workflows(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: approval_notifications approval_notifications_instance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.approval_notifications
    ADD CONSTRAINT approval_notifications_instance_id_fkey FOREIGN KEY (instance_id) REFERENCES public.approval_instances(id);


--
-- Name: approval_notifications approval_notifications_step_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.approval_notifications
    ADD CONSTRAINT approval_notifications_step_id_fkey FOREIGN KEY (step_id) REFERENCES public.approval_steps(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: approval_notifications approval_notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.approval_notifications
    ADD CONSTRAINT approval_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: approval_steps approval_steps_approver_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.approval_steps
    ADD CONSTRAINT approval_steps_approver_user_id_fkey FOREIGN KEY (approver_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: approval_steps approval_steps_instance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.approval_steps
    ADD CONSTRAINT approval_steps_instance_id_fkey FOREIGN KEY (instance_id) REFERENCES public.approval_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendance_records attendance_records_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendance_records attendance_records_project_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_project_location_id_fkey FOREIGN KEY (project_location_id) REFERENCES public.project_locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance_records attendance_records_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendance_settings attendance_settings_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendance_settings
    ADD CONSTRAINT attendance_settings_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: berita_acara berita_acara_milestone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.berita_acara
    ADD CONSTRAINT berita_acara_milestone_id_fkey FOREIGN KEY (milestone_id) REFERENCES public.project_milestones(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: berita_acara berita_acara_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.berita_acara
    ADD CONSTRAINT berita_acara_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: board_directors board_directors_subsidiary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.board_directors
    ADD CONSTRAINT board_directors_subsidiary_id_fkey FOREIGN KEY (subsidiary_id) REFERENCES public.subsidiaries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chart_of_accounts chart_of_accounts_parent_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.chart_of_accounts
    ADD CONSTRAINT chart_of_accounts_parent_account_id_fkey FOREIGN KEY (parent_account_id) REFERENCES public.chart_of_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: chart_of_accounts chart_of_accounts_subsidiary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.chart_of_accounts
    ADD CONSTRAINT chart_of_accounts_subsidiary_id_fkey FOREIGN KEY (subsidiary_id) REFERENCES public.subsidiaries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: delivery_receipts delivery_receipts_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.delivery_receipts
    ADD CONSTRAINT delivery_receipts_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: delivery_receipts delivery_receipts_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.delivery_receipts
    ADD CONSTRAINT delivery_receipts_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: delivery_receipts delivery_receipts_inspected_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.delivery_receipts
    ADD CONSTRAINT delivery_receipts_inspected_by_fkey FOREIGN KEY (inspected_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: delivery_receipts delivery_receipts_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.delivery_receipts
    ADD CONSTRAINT delivery_receipts_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE;


--
-- Name: delivery_receipts delivery_receipts_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.delivery_receipts
    ADD CONSTRAINT delivery_receipts_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON UPDATE CASCADE;


--
-- Name: delivery_receipts delivery_receipts_received_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.delivery_receipts
    ADD CONSTRAINT delivery_receipts_received_by_fkey FOREIGN KEY (received_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: entities entities_parent_entity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.entities
    ADD CONSTRAINT entities_parent_entity_id_fkey FOREIGN KEY (parent_entity_id) REFERENCES public.entities(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_transactions finance_transactions_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.finance_transactions
    ADD CONSTRAINT finance_transactions_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_transactions finance_transactions_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.finance_transactions
    ADD CONSTRAINT finance_transactions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: finance_transactions finance_transactions_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.finance_transactions
    ADD CONSTRAINT finance_transactions_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: milestone_dependencies fk_depends_on_milestone; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_dependencies
    ADD CONSTRAINT fk_depends_on_milestone FOREIGN KEY (depends_on_milestone_id) REFERENCES public.project_milestones(id) ON DELETE CASCADE;


--
-- Name: milestone_items fk_milestone; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_items
    ADD CONSTRAINT fk_milestone FOREIGN KEY (milestone_id) REFERENCES public.project_milestones(id) ON DELETE CASCADE;


--
-- Name: milestone_dependencies fk_milestone; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_dependencies
    ADD CONSTRAINT fk_milestone FOREIGN KEY (milestone_id) REFERENCES public.project_milestones(id) ON DELETE CASCADE;


--
-- Name: journal_entry_lines journal_entry_lines_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.journal_entry_lines
    ADD CONSTRAINT journal_entry_lines_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.chart_of_accounts(id) ON UPDATE CASCADE;


--
-- Name: journal_entry_lines journal_entry_lines_journal_entry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.journal_entry_lines
    ADD CONSTRAINT journal_entry_lines_journal_entry_id_fkey FOREIGN KEY (journal_entry_id) REFERENCES public.journal_entries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_requests leave_requests_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leave_requests leave_requests_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leave_requests leave_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: manpower manpower_current_project_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.manpower
    ADD CONSTRAINT manpower_current_project_fkey FOREIGN KEY (current_project) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: manpower manpower_subsidiary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.manpower
    ADD CONSTRAINT manpower_subsidiary_id_fkey FOREIGN KEY (subsidiary_id) REFERENCES public.subsidiaries(id);


--
-- Name: milestone_activities milestone_activities_milestone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_activities
    ADD CONSTRAINT milestone_activities_milestone_id_fkey FOREIGN KEY (milestone_id) REFERENCES public.project_milestones(id) ON DELETE CASCADE;


--
-- Name: milestone_activities milestone_activities_performed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_activities
    ADD CONSTRAINT milestone_activities_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: milestone_costs milestone_costs_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_costs
    ADD CONSTRAINT milestone_costs_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.chart_of_accounts(id);


--
-- Name: milestone_costs milestone_costs_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_costs
    ADD CONSTRAINT milestone_costs_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: milestone_costs milestone_costs_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_costs
    ADD CONSTRAINT milestone_costs_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: milestone_costs milestone_costs_milestone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_costs
    ADD CONSTRAINT milestone_costs_milestone_id_fkey FOREIGN KEY (milestone_id) REFERENCES public.project_milestones(id) ON DELETE CASCADE;


--
-- Name: milestone_costs milestone_costs_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_costs
    ADD CONSTRAINT milestone_costs_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: milestone_costs milestone_costs_source_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_costs
    ADD CONSTRAINT milestone_costs_source_account_id_fkey FOREIGN KEY (source_account_id) REFERENCES public.chart_of_accounts(id);


--
-- Name: milestone_costs milestone_costs_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_costs
    ADD CONSTRAINT milestone_costs_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: milestone_photos milestone_photos_milestone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_photos
    ADD CONSTRAINT milestone_photos_milestone_id_fkey FOREIGN KEY (milestone_id) REFERENCES public.project_milestones(id) ON DELETE CASCADE;


--
-- Name: milestone_photos milestone_photos_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.milestone_photos
    ADD CONSTRAINT milestone_photos_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: notification_preferences notification_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notification_tokens notification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notification_tokens
    ADD CONSTRAINT notification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: progress_payments progress_payments_berita_acara_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.progress_payments
    ADD CONSTRAINT progress_payments_berita_acara_id_fkey FOREIGN KEY (berita_acara_id) REFERENCES public.berita_acara(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: progress_payments progress_payments_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.progress_payments
    ADD CONSTRAINT progress_payments_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_documents project_documents_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.project_documents
    ADD CONSTRAINT project_documents_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_locations project_locations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.project_locations
    ADD CONSTRAINT project_locations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: project_locations project_locations_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.project_locations
    ADD CONSTRAINT project_locations_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_milestones project_milestones_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT project_milestones_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_rab project_rab_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.project_rab
    ADD CONSTRAINT project_rab_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_team_members project_team_members_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.project_team_members
    ADD CONSTRAINT project_team_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_team_members project_team_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.project_team_members
    ADD CONSTRAINT project_team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: projects projects_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: projects projects_project_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_project_manager_id_fkey FOREIGN KEY (project_manager_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: projects projects_subsidiary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_subsidiary_id_fkey FOREIGN KEY (subsidiary_id) REFERENCES public.subsidiaries(id);


--
-- Name: projects projects_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_orders purchase_orders_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_orders purchase_orders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_orders purchase_orders_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tax_records tax_records_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tax_records
    ADD CONSTRAINT tax_records_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tax_records tax_records_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tax_records
    ADD CONSTRAINT tax_records_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: work_orders work_orders_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: work_orders work_orders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: work_orders work_orders_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id);


--
-- Name: work_orders work_orders_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: work_orders work_orders_rejected_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_rejected_by_fkey FOREIGN KEY (rejected_by) REFERENCES public.users(id);


--
-- Name: work_orders work_orders_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict va6t5jW1kX5d2DxxQ7TGNv2ANNDoHm8U6qvvFwJIjbmRfVQ1PTavNZ0B8aR6cv9

