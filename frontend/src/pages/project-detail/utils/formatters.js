/**
 * Utility functions for project detail formatting
 */

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Rp 0';
  const numericAmount = parseFloat(amount);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateDaysDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  return Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
};

export const calculateBudgetUtilization = (totalBudget, actualSpent) => {
  const budget = parseFloat(totalBudget) || 0;
  const spent = parseFloat(actualSpent) || 0;
  
  if (budget === 0) return 0;
  return Math.round((spent / budget) * 100);
};

export const calculateProjectProgress = (workflowData, project) => {
  if (!workflowData || !project) return 0;
  
  let completedStages = 0;
  const totalStages = 5; // Planning, RAB, Procurement, Execution, Completion
  
  // Stage 1: Planning - project not in draft/pending
  if (project.status !== 'draft' && project.status !== 'pending') {
    completedStages += 1;
  }
  
  // Stage 2: RAB Approval - has approved RAB items
  const hasRab = project.rabItems && project.rabItems.length > 0;
  const rabApproved = workflowData.rabStatus?.approved;
  if (hasRab && rabApproved) {
    completedStages += 1;
  }
  
  // Stage 3: Procurement - has approved PO
  const hasPO = workflowData.purchaseOrders?.length > 0;
  const poApproved = workflowData.purchaseOrders?.some(po => po.status === 'approved');
  if (hasPO && poApproved) {
    completedStages += 1;
  }
  
  // Stage 4: Execution - has delivery receipts
  const hasDelivery = workflowData.deliveryReceipts?.length > 0;
  if (hasDelivery) {
    completedStages += 1;
  }
  
  // Stage 5: Completion - project completed
  if (project.status === 'completed') {
    completedStages += 1;
  }
  
  return Math.round((completedStages / totalStages) * 100);
};
