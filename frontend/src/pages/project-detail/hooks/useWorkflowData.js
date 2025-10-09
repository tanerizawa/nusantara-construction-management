import { useState, useMemo } from 'react';

/**
 * Calculate project stage based on sequential workflow logic
 */
const calculateProjectStage = (projectData) => {
  // Stage 1: Planning - Always start here
  if (!projectData || projectData.status === 'draft' || projectData.status === 'pending') {
    return 'planning';
  }

  // Stage 2: RAB Approval - Only after planning is complete
  const hasRABItems = projectData.rabItems && projectData.rabItems.length > 0;
  const hasApprovedRAB = projectData.rabItems?.some(item => item.status === 'approved');
  
  if (hasRABItems && !hasApprovedRAB) {
    return 'rab-approval';
  }

  // Stage 3: Procurement - Only after RAB is approved
  if (hasApprovedRAB) {
    const hasPurchaseOrders = projectData.purchaseOrders && projectData.purchaseOrders.length > 0;
    const hasApprovedPO = projectData.purchaseOrders?.some(po => po.status === 'approved');
    
    if (!hasPurchaseOrders || !hasApprovedPO) {
      return 'procurement';
    }

    // Stage 4: Execution - Only after procurement is complete
    if (hasApprovedPO && projectData.status === 'active') {
      return 'execution';
    }
  }

  // Stage 5: Completion - Only when project is truly completed
  if (projectData.status === 'completed') {
    return 'completion';
  }

  // Default fallback - if no conditions met, stay in planning
  return 'planning';
};

/**
 * Custom hook untuk mengelola workflow data
 * Handles: RAB status, approval status, PO, budget summary, current stage
 */
export const useWorkflowData = (project) => {
  const [workflowData, setWorkflowData] = useState({
    rabStatus: null,
    approvalStatus: null,
    purchaseOrders: [],
    budgetSummary: null,
    currentStage: 'planning'
  });

  // Calculate enhanced workflow data
  useMemo(() => {
    if (!project) return;

    const enhancedWorkflowData = {
      rabStatus: {
        pendingApproval: project.rabItems?.filter(item => item.status === 'pending').length || 0,
        approved: project.rabItems?.some(item => item.status === 'approved') || false,
        data: project.rabItems || []
      },
      approvalStatus: {
        pending: project.pendingApprovals?.length || 0,
        data: project.approvalHistory || []
      },
      purchaseOrders: project.purchaseOrders || [],
      deliveryReceipts: project.deliveryReceipts || [], // Added delivery receipts for execution tracking
      budgetSummary: {
        totalBudget: parseFloat(project.totalBudget) || 0,
        approvedAmount: project.rabItems?.reduce((sum, item) => 
          item.status === 'approved' ? sum + (parseFloat(item.amount) || 0) : sum, 0) || 0,
        committedAmount: project.purchaseOrders?.reduce((sum, po) => 
          po.status === 'approved' ? sum + (parseFloat(po.amount) || 0) : sum, 0) || 0,
        actualSpent: project.actualExpenses?.reduce((sum, expense) => 
          sum + (parseFloat(expense.amount) || 0), 0) || 0
      },
      currentStage: project.currentStage || calculateProjectStage(project),
      milestones: {
        pending: project.milestones?.filter(m => m.status === 'pending').length || 0
      },
      beritaAcara: {
        pending: project.beritaAcara?.filter(ba => ba.status === 'pending').length || 0
      },
      progressPayments: {
        pending: project.progressPayments?.filter(pp => pp.status === 'pending').length || 0
      }
    };

    setWorkflowData(enhancedWorkflowData);
  }, [project]);

  return { workflowData, setWorkflowData };
};
