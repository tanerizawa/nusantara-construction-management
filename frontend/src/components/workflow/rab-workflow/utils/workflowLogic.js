/**
 * Workflow Logic for RAB Items
 * Determines appropriate workflow and actions based on item type
 */

import { getItemTypeConfig } from '../config/rabCategories';

/**
 * Determine workflow configuration for RAB item
 */
export const determineWorkflow = (rabItem) => {
  const itemTypeConfig = getItemTypeConfig(rabItem.itemType);
  
  if (!itemTypeConfig) {
    return getDefaultWorkflow();
  }

  switch(rabItem.itemType) {
    case 'material':
      return {
        canCreatePO: true,
        canDirectPay: false,
        paymentMethod: 'po_payment',
        trackingMethod: 'inventory',
        approvalFlow: 'purchase_approval',
        requiredFields: ['supplier', 'specifications'],
        actions: ['create_po', 'request_quote', 'check_inventory'],
        workflow: 'purchase_order'
      };
      
    case 'labor':
      return {
        canCreatePO: false,
        canDirectPay: true,
        paymentMethod: 'payroll',
        trackingMethod: 'timesheet',
        approvalFlow: 'payroll_approval',
        requiredFields: ['laborCategory', 'workSchedule'],
        actions: ['add_to_payroll', 'create_timesheet', 'assign_worker'],
        workflow: 'direct_payment'
      };
      
    case 'service':
      return {
        canCreatePO: false,
        canDirectPay: true,
        paymentMethod: 'contract_payment',
        trackingMethod: 'milestone',
        approvalFlow: 'contract_approval',
        requiredFields: ['serviceScope', 'contractTerms'],
        actions: ['create_contract', 'set_milestones', 'vendor_selection'],
        workflow: 'service_contract'
      };
      
    case 'equipment':
      return {
        canCreatePO: false,
        canDirectPay: true,
        paymentMethod: 'rental_payment',
        trackingMethod: 'usage_hours',
        approvalFlow: 'rental_approval',
        requiredFields: ['rentalPeriod', 'equipmentSpecs'],
        actions: ['create_rental', 'schedule_delivery', 'setup_monitoring'],
        workflow: 'rental_agreement'
      };
      
    case 'overhead':
      return {
        canCreatePO: false,
        canDirectPay: true,
        paymentMethod: 'expense_payment',
        trackingMethod: 'manual',
        approvalFlow: 'expense_approval',
        requiredFields: ['expenseCategory', 'justification'],
        actions: ['create_expense', 'attach_receipt', 'manager_approval'],
        workflow: 'direct_payment'
      };
      
    default:
      return getDefaultWorkflow();
  }
};

/**
 * Get default workflow for unknown item types
 */
const getDefaultWorkflow = () => ({
  canCreatePO: false,
  canDirectPay: true,
  paymentMethod: 'direct_payment',
  trackingMethod: 'manual',
  approvalFlow: 'standard_approval',
  requiredFields: [],
  actions: ['manual_process'],
  workflow: 'direct_payment'
});

/**
 * Validate RAB item based on workflow requirements
 */
export const validateRABItemWorkflow = (item) => {
  const workflow = determineWorkflow(item);
  const errors = [];

  // Check required fields
  workflow.requiredFields.forEach(field => {
    if (!item[field] || item[field].trim() === '') {
      errors.push(`${field} is required for ${item.itemType} items`);
    }
  });

  // Type-specific validations
  switch(item.itemType) {
    case 'material':
      if (!item.supplier) {
        errors.push('Material items require supplier information');
      }
      break;
      
    case 'labor':
      if (!item.laborCategory) {
        errors.push('Labor items require labor category');
      }
      if (item.quantity <= 0) {
        errors.push('Labor items require positive quantity (work hours/days)');
      }
      break;
      
    case 'service':
      if (!item.serviceScope) {
        errors.push('Service items require scope definition');
      }
      break;
      
    case 'equipment':
      if (!item.rentalPeriod) {
        errors.push('Equipment items require rental period');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors: errors,
    workflow: workflow
  };
};

/**
 * Get available actions for RAB item
 */
export const getAvailableActions = (rabItem) => {
  const workflow = determineWorkflow(rabItem);
  const validation = validateRABItemWorkflow(rabItem);
  
  if (!validation.valid) {
    return [{
      id: 'fix_validation',
      label: 'Fix Validation Issues',
      type: 'warning',
      disabled: false
    }];
  }

  const actions = [];

  // Approval action (always available for approved items)
  if (!rabItem.isApproved) {
    actions.push({
      id: 'approve',
      label: 'Approve Item',
      type: 'primary',
      disabled: false
    });
  }

  // Workflow-specific actions
  workflow.actions.forEach(actionId => {
    switch(actionId) {
      case 'create_po':
        actions.push({
          id: 'create_po',
          label: 'Buat Purchase Order',
          type: 'success',
          disabled: !rabItem.isApproved,
          icon: 'ShoppingCart'
        });
        break;
        
      case 'add_to_payroll':
        actions.push({
          id: 'add_to_payroll',
          label: 'Tambah ke Payroll',
          type: 'info',
          disabled: !rabItem.isApproved,
          icon: 'Users'
        });
        break;
        
      case 'create_contract':
        actions.push({
          id: 'create_contract',
          label: 'Buat Kontrak',
          type: 'purple',
          disabled: !rabItem.isApproved,
          icon: 'FileText'
        });
        break;
        
      case 'create_rental':
        actions.push({
          id: 'create_rental',
          label: 'Buat Sewa',
          type: 'yellow',
          disabled: !rabItem.isApproved,
          icon: 'Truck'
        });
        break;
        
      case 'create_expense':
        actions.push({
          id: 'create_expense',
          label: 'Buat Expense',
          type: 'gray',
          disabled: !rabItem.isApproved,
          icon: 'Receipt'
        });
        break;
    }
  });

  return actions;
};

/**
 * Execute workflow action
 */
export const executeWorkflowAction = async (actionId, rabItem, additionalData = {}) => {
  const workflow = determineWorkflow(rabItem);
  
  try {
    switch(actionId) {
      case 'create_po':
        return await createPurchaseOrderFromRAB(rabItem, additionalData);
        
      case 'add_to_payroll':
        return await addToPayroll(rabItem, additionalData);
        
      case 'create_contract':
        return await createServiceContract(rabItem, additionalData);
        
      case 'create_rental':
        return await createRentalAgreement(rabItem, additionalData);
        
      case 'create_expense':
        return await createExpenseEntry(rabItem, additionalData);
        
      default:
        throw new Error(`Unknown action: ${actionId}`);
    }
  } catch (error) {
    console.error(`Error executing action ${actionId}:`, error);
    throw error;
  }
};

// Workflow action implementations
const createPurchaseOrderFromRAB = async (rabItem, data) => {
  // Implementation for creating PO from material RAB item
  return {
    success: true,
    message: 'Purchase Order created successfully',
    poId: `PO-${Date.now()}`,
    workflowStatus: 'po_created'
  };
};

const addToPayroll = async (rabItem, data) => {
  // Implementation for adding labor to payroll
  return {
    success: true,
    message: 'Added to payroll successfully',
    payrollId: `PAY-${Date.now()}`,
    workflowStatus: 'payroll_added'
  };
};

const createServiceContract = async (rabItem, data) => {
  // Implementation for creating service contract
  return {
    success: true,
    message: 'Service contract created successfully',
    contractId: `CON-${Date.now()}`,
    workflowStatus: 'contract_created'
  };
};

const createRentalAgreement = async (rabItem, data) => {
  // Implementation for creating rental agreement
  return {
    success: true,
    message: 'Rental agreement created successfully',
    rentalId: `REN-${Date.now()}`,
    workflowStatus: 'rental_created'
  };
};

const createExpenseEntry = async (rabItem, data) => {
  // Implementation for creating expense entry
  return {
    success: true,
    message: 'Expense entry created successfully',
    expenseId: `EXP-${Date.now()}`,
    workflowStatus: 'expense_created'
  };
};

/**
 * Get workflow status badge configuration
 */
export const getWorkflowStatusBadge = (rabItem) => {
  const workflow = determineWorkflow(rabItem);
  const workflowStatus = rabItem.workflowStatus || 'draft';
  
  const statusConfig = {
    draft: { color: 'gray', label: 'Draft' },
    approved: { color: 'green', label: 'Approved' },
    po_created: { color: 'blue', label: 'PO Created' },
    payroll_added: { color: 'purple', label: 'In Payroll' },
    contract_created: { color: 'indigo', label: 'Contract Created' },
    rental_created: { color: 'yellow', label: 'Rental Active' },
    expense_created: { color: 'orange', label: 'Expense Recorded' },
    completed: { color: 'green', label: 'Completed' }
  };
  
  return statusConfig[workflowStatus] || statusConfig.draft;
};