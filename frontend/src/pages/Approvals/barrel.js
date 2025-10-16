/**
 * Approval module exports
 * This file re-exports all components, hooks, and utilities from the Approvals module
 */

// Main component
export { default } from './index';
export { default as Approvals } from './index';

// Components
export { default as ApprovalDashboard } from './components/ApprovalDashboard';
export { default as ApprovalStats } from './components/ApprovalStats';
export { default as WorkflowList } from './components/WorkflowList';
export { default as WorkflowCard } from './components/WorkflowCard';
export { default as ActivityHistory } from './components/ActivityHistory';

// Hooks
export { useApprovalData } from './hooks/useApprovalData';

// Utils
export * from './utils/constants';
export * from './utils/approvalApi';