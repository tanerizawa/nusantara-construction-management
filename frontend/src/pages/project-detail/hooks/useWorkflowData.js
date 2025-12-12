import { useState, useEffect } from 'react';

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
 * 
 * UPDATED (Oct 11, 2025):
 * - Fixed to use actual backend data structure
 * - Maps budgetSummary, purchaseOrders, deliveryReceipts from project object
 * - Proper null safety checks
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
  useEffect(() => {
    if (!project) return;

    console.log('=== useWorkflowData: Processing project ===', {
      projectId: project.id,
      hasRabItems: !!project.rabItems,
      rabItemsCount: project.rabItems?.length || 0,
      hasBudgetSummary: !!project.budgetSummary,
      hasPurchaseOrders: !!project.purchaseOrders,
      purchaseOrdersCount: project.purchaseOrders?.length || 0,
      hasMilestonesList: !!project.milestonesList,
      milestonesListCount: project.milestonesList?.length || 0,
      hasMilestones: !!project.milestones,
      milestonesCount: project.milestones?.length || 0,
      milestonesSample: project.milestonesList?.[0] || project.milestones?.[0] || 'No milestones'
    });

    const enhancedWorkflowData = {
      // RAB Status - use rabItems from project
      rabStatus: {
        pendingApproval: project.rabItems?.filter(item => item.status === 'pending').length || 0,
        approved: project.rabItems?.some(item => item.status === 'approved') || false,
        data: project.rabItems || []
      },
      
      // Approval Status
      approvalStatus: project.approvalStatus || {
        pending: project.rabItems?.filter(item => item.status === 'pending').length || 0,
        approved: project.rabItems?.filter(item => item.status === 'approved').length || 0,
        rejected: project.rabItems?.filter(item => item.status === 'rejected').length || 0
      },
      
      // Purchase Orders - ALREADY in project from backend
      purchaseOrders: project.purchaseOrders || [],
      
      // Delivery Receipts - ALREADY in project from backend
      deliveryReceipts: project.deliveryReceipts || [],
      
      // Budget Summary - ALREADY in project from backend
      budgetSummary: project.budgetSummary || {
        totalBudget: parseFloat(project.budget || project.totalBudget) || 0,
        // FIX: Use totalPrice or amount (backend sends both for compatibility)
        approvedAmount: project.rabItems?.reduce((sum, item) => 
          (item.status === 'approved' || item.isApproved === true) ? 
          sum + (parseFloat(item.totalPrice || item.amount) || 0) : sum, 0) || 0,
        committedAmount: project.purchaseOrders?.reduce((sum, po) => 
          (po.status === 'approved' || po.status === 'received') ? 
          sum + (parseFloat(po.totalAmount) || 0) : sum, 0) || 0,
        actualSpent: project.budgetSummary?.actualSpent || 0
      },
      
      // Current Stage
      currentStage: project.currentStage || calculateProjectStage(project),
      
      // Milestones - Support both milestonesList (backend) and milestones (fallback)
      milestones: {
        pending: (project.milestonesList || project.milestones || []).filter(m => m.status === 'pending').length || 0,
        data: project.milestonesList || project.milestones || []
      },
      
      // Milestone Costs - Extract from all milestones' costs arrays
      // Each milestone may have costs array, we need to flatten all of them
      milestoneCosts: (project.milestonesList || project.milestones || [])
        .flatMap(milestone => milestone.costs || [])
        .filter(cost => cost && !cost.deleted_at), // Filter out deleted costs
      
      // Berita Acara - ALREADY in project from backend
      beritaAcara: project.beritaAcara || [],
      beritaAcaraStatus: {
        pending: project.beritaAcara?.filter(ba => ba.status === 'pending').length || 0
      },
      
      // Progress Payments
      progressPayments: {
        pending: project.progressPayments?.filter(pp => pp.status === 'pending').length || 0,
        data: project.progressPayments || []
      }
    };

    console.log('=== useWorkflowData: Enhanced data ===', {
      rabItemsCount: enhancedWorkflowData.rabStatus.data.length,
      approvedAmount: enhancedWorkflowData.budgetSummary.approvedAmount,
      committedAmount: enhancedWorkflowData.budgetSummary.committedAmount,
      actualSpent: enhancedWorkflowData.budgetSummary.actualSpent,
      purchaseOrdersCount: enhancedWorkflowData.purchaseOrders.length,
      deliveryReceiptsCount: enhancedWorkflowData.deliveryReceipts.length,
      pendingApprovals: enhancedWorkflowData.approvalStatus.pending,
      milestonesDataCount: enhancedWorkflowData.milestones.data.length,
      milestoneCostsCount: enhancedWorkflowData.milestoneCosts.length,
      totalMilestoneCosts: enhancedWorkflowData.milestoneCosts.reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0),
      milestonesData: enhancedWorkflowData.milestones.data.map(m => ({
        id: m.id,
        title: m.title,
        status: m.status,
        progress: m.progress,
        costsCount: m.costs?.length || 0
      }))
    });

    setWorkflowData(enhancedWorkflowData);
  }, [project]);

  return { workflowData, setWorkflowData };
};
