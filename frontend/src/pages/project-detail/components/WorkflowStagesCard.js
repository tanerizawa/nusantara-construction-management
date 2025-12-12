import React from 'react';
import { CheckCircle } from 'lucide-react';
import { workflowStages } from '../config';

/**
 * WorkflowStagesCard Component
 * Displays the sequential workflow stages with status indicators
 * 
 * UPDATED LOGIC (Nov 4, 2025):
 * - Procurement tracking menggunakan realisasi biaya di milestone, BUKAN delivery receipts
 * - Pengadaan considered complete ketika 90%+ dari PO budget sudah direalisasikan di milestone costs
 * - Execution dimulai ketika:
 *   1. Ada milestone costs (realisasi biaya), ATAU
 *   2. Ada milestone yang sedang berjalan, ATAU
 *   3. Ada milestone yang sudah dibuat
 * - Execution progress tracked through milestone progress dan total realisasi biaya
 * - Execution dianggap SELESAI ketika:
 *   1. Semua milestone mencapai 100% progress, ATAU
 *   2. Semua milestone berstatus 'completed'
 * - Status project 'completed' sebagai fallback jika tidak ada milestone
 * - Tidak lagi menggunakan delivery receipts untuk tracking procurement/execution
 */
const WorkflowStagesCard = ({ workflowData, project }) => {
  // Calculate stages based on real project data with parallel workflow logic
  const getStageStatus = () => {
    // Stage 1: Planning - Setup awal proyek
    const planning_completed = project.status !== 'draft' && project.status !== 'pending';
    
    // Stage 2: RAB Approval - Persetujuan budget
    const rabItems_exist = project.rabItems && project.rabItems.length > 0;
    const rab_approved = rabItems_exist && workflowData.rabStatus?.approved;
    const rab_completed = planning_completed && rab_approved;
    
    // Stage 3: Procurement - Pengadaan material (dapat berjalan parallel)
    // NEW LOGIC: Procurement completed based on milestone cost realization, not delivery receipts
    const has_purchase_orders = workflowData.purchaseOrders?.length > 0;
    const po_approved = workflowData.purchaseOrders?.some(po => 
      po.status === 'approved' || po.status === 'received'
    );
    
    // Calculate procurement realization through milestone costs
    const totalPOAmount = workflowData.purchaseOrders?.reduce((sum, po) => sum + (parseFloat(po.totalAmount) || 0), 0) || 0;
    const realizedAmount = workflowData.milestoneCosts?.reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0) || 0;
    const procurement_realization = totalPOAmount > 0 ? (realizedAmount / totalPOAmount) : 0;
    
    // Procurement considered completed when 90%+ of PO budget is realized in milestones
    const procurement_completed = rab_completed && has_purchase_orders && procurement_realization >= 0.9;
    
    // Stage 4: Execution - Pelaksanaan (dimulai saat ada realisasi biaya di milestone ATAU milestone aktif)
    // NEW LOGIC: Tidak pakai delivery receipt, tapi milestone cost realization
    const has_milestone_costs = workflowData.milestoneCosts && workflowData.milestoneCosts.length > 0;
    
    // Debug milestone data
    console.log('🔍 Execution Stage Debug:', {
      milestones: workflowData.milestones,
      milestonesData: workflowData.milestones?.data,
      projectStatus: project.status,
      has_milestone_costs
    });
    
    const has_active_milestones = workflowData.milestones?.data?.some(m => {
      console.log('Checking milestone:', m.title, 'status:', m.status);
      return m.status === 'in_progress' || m.status === 'in-progress';
    }) || false;
    
    // Check if all milestones are completed (100% progress or completed status)
    const milestones = workflowData.milestones?.data || [];
    const has_milestones = milestones.length > 0;
    const all_milestones_completed = has_milestones && milestones.every(m => 
      m.status === 'completed' || m.progress === 100
    );
    
    // Check if execution should start
    // NEW: Execution starts when there are milestone costs OR active milestones OR completed milestones
    const execution_started = rab_completed && (
      has_milestone_costs ||  // Ada realisasi biaya di milestone
      has_active_milestones ||  // Ada milestone sedang berjalan
      has_milestones  // If milestones exist, execution must have started
    );
    
    console.log('✅ Execution Calculation:', {
      has_milestone_costs,
      has_active_milestones,
      rab_completed,
      po_approved,
      procurement_completed,
      execution_started,
      has_milestones,
      all_milestones_completed,
      milestones: milestones.map(m => ({ title: m.title, status: m.status, progress: m.progress }))
    });
    
    // Execution completed when all milestones reach 100% OR project status is completed
    const execution_completed = execution_started && (all_milestones_completed || project.status === 'completed');
    
    // Stage 5: Completion - Penyelesaian proyek
    const completion_completed = execution_completed && project.status === 'completed';

    return workflowStages.map((stage) => ({
      ...stage,
      completed: 
        stage.id === 'planning' ? planning_completed :
        stage.id === 'rab-approval' ? rab_completed :
        stage.id === 'procurement' ? procurement_completed :
        stage.id === 'execution' ? execution_completed :
        stage.id === 'completion' ? completion_completed :
        false,
      // Track if stage is active (in progress but not completed)
      // FIXED: Execution should NEVER go back to "waiting" once started
      active:
        stage.id === 'planning' ? !planning_completed :
        stage.id === 'rab-approval' ? (planning_completed && !rab_completed) :
        stage.id === 'procurement' ? (rab_completed && !procurement_completed) :
        stage.id === 'execution' ? (execution_started && !execution_completed) : // Active only if started but not completed
        stage.id === 'completion' ? (execution_completed && !completion_completed) :
        false
    }));
  };

  const stages = getStageStatus();
  
  // Find current active stage (first non-completed stage that is active)
  const currentStageIndex = stages.findIndex(stage => stage.active);

  return (
    <div className="space-y-4">
      <div className="relative pl-8">
        <div className="absolute left-[1.55rem] top-0 bottom-0 w-[2px] bg-white/10" />
        <div className="space-y-4">
          {stages.map((stage) => {
            const IconComponent = stage.icon;
            const isActive = stage.active;
            const isCompleted = stage.completed;

            return (
              <div key={stage.id} className="relative flex items-start gap-4">
                <div
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-[3px] text-white transition ${
                    isCompleted
                      ? 'border-[#34d399]/40 bg-gradient-to-br from-[#34d399] to-[#22c55e] shadow-[0_10px_25px_rgba(34,197,94,0.35)]'
                      : isActive
                      ? 'border-[#60a5fa]/40 bg-gradient-to-br from-[#60a5fa] to-[#2563eb] shadow-[0_10px_25px_rgba(96,165,250,0.35)]'
                      : 'border-white/10 bg-[#05070d]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <IconComponent className="h-6 w-6 text-white/80" />
                  )}
                </div>
                <div className="flex-1 rounded-2xl border border-white/10 bg-[#05070d]/80 p-4">
                  <div className="flex items-center justify-between">
                    <h5 className={`text-sm font-semibold ${
                      isCompleted ? 'text-[#34d399]' : isActive ? 'text-[#60a5fa]' : 'text-white/70'
                    }`}>
                      {stage.label}
                    </h5>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isCompleted
                        ? 'border border-[#34d399]/30 bg-[#34d399]/15 text-[#bbf7d0]'
                        : isActive
                        ? 'border border-[#60a5fa]/30 bg-[#60a5fa]/15 text-[#dbeafe]'
                        : 'border border-white/10 bg-white/5 text-white/60'
                    }`}>
                      {isCompleted ? 'Selesai' : isActive ? 'Sedang Berjalan' : 'Menunggu'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">{stage.description}</p>
                  <div className="mt-3 text-xs text-white/50">
                    {getStageDetails(stage.id, project, workflowData)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper function for stage details
const getStageDetails = (stageId, project, workflowData) => {
  switch (stageId) {
    case 'planning':
      return (
        <p>
          {project.status === 'draft' || project.status === 'pending' 
            ? 'Belum dimulai - perlu setup awal' 
            : 'Tahap perencanaan selesai'}
        </p>
      );
    case 'rab-approval':
      return (
        <p>
          {project.rabItems?.length > 0 
            ? `${project.rabItems.length} item RAP - ${workflowData.rabStatus?.approved ? 'Sudah disetujui' : 'Menunggu persetujuan'}`
            : 'Belum ada item RAP'}
        </p>
      );
    case 'procurement':
      const totalPO = workflowData.purchaseOrders?.length || 0;
      const approvedPO = workflowData.purchaseOrders?.filter(po => po.status === 'approved' || po.status === 'received')?.length || 0;
      
      // NEW LOGIC: Track procurement through milestone cost realization instead of delivery receipts
      // Calculate how much of approved PO budget has been realized in milestone costs
      const totalPOAmount = workflowData.purchaseOrders?.reduce((sum, po) => sum + (parseFloat(po.totalAmount) || 0), 0) || 0;
      const realizedAmount = workflowData.milestoneCosts?.reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0) || 0;
      
      // Calculate realization percentage
      const realizationPercentage = totalPOAmount > 0 
        ? Math.round((realizedAmount / totalPOAmount) * 100)
        : 0;
      
      return (
        <div className="space-y-1">
          <p>{totalPO > 0 ? `${totalPO} Purchase Order` : 'Belum ada Purchase Order'}</p>
          {totalPO > 0 && (
            <>
              <p>• Disetujui: {approvedPO} dari {totalPO} PO</p>
              <p>• Realisasi Biaya: {realizationPercentage}% (Rp {(realizedAmount / 1000000).toFixed(1)}M dari Rp {(totalPOAmount / 1000000).toFixed(1)}M)</p>
              {realizationPercentage > 0 && realizationPercentage < 100 && (
                <p className="text-[#0A84FF] font-medium mt-2">
                  ℹ️ Pengadaan sedang berjalan, biaya direalisasikan di milestone
                </p>
              )}
              {realizationPercentage >= 100 && (
                <p className="text-[#30D158] font-medium mt-2">
                  ✓ Semua pengadaan telah direalisasikan
                </p>
              )}
            </>
          )}
        </div>
      );
    case 'execution':
      // NEW LOGIC: Track execution through milestone costs and milestone progress
      const milestoneCosts = workflowData.milestoneCosts || [];
      const totalCostRealized = milestoneCosts.reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0);
      
      // Get all milestones
      const allMilestones = workflowData.milestones?.data || [];
      const totalMilestoneCount = allMilestones.length;
      
      // Separate milestones by status
      const completedMilestones = allMilestones.filter(m => 
        m.status === 'completed' || m.progress === 100
      );
      const activeMilestones = allMilestones.filter(m => 
        m.status === 'in_progress' || m.status === 'in-progress'
      );
      const pendingMilestones = allMilestones.filter(m => 
        m.status === 'pending' && m.progress < 100
      );
      
      const completedMilestoneCount = completedMilestones.length;
      const activeMilestoneCount = activeMilestones.length;
      
      // Calculate overall progress from all milestones
      const overallProgress = totalMilestoneCount > 0
        ? Math.round(allMilestones.reduce((sum, m) => sum + (m.progress || 0), 0) / totalMilestoneCount)
        : 0;
      
      // Calculate average progress from active milestones
      const avgProgress = activeMilestones.length > 0
        ? Math.round(activeMilestones.reduce((sum, m) => sum + (m.progress || 0), 0) / activeMilestones.length)
        : 0;
      
      // Check if all milestones are complete
      const allMilestonesComplete = totalMilestoneCount > 0 && completedMilestoneCount === totalMilestoneCount;
      
      return (
        <div className="space-y-1">
          {allMilestonesComplete ? (
            <>
              <p className="text-[#30D158] font-medium">✓ Eksekusi selesai - Semua milestone 100%</p>
              <p>• {completedMilestoneCount} dari {totalMilestoneCount} milestone selesai</p>
            </>
          ) : totalMilestoneCount > 0 ? (
            <>
              <p className="font-medium">Dalam tahap pelaksanaan ({overallProgress}% keseluruhan)</p>
              <p>• Progress: {completedMilestoneCount} selesai, {activeMilestoneCount} berjalan, {pendingMilestones.length} menunggu</p>
              
              {activeMilestoneCount > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-[#0A84FF] font-medium">Milestone sedang berjalan:</p>
                  {activeMilestones.slice(0, 3).map((m, idx) => (
                    <p key={idx} className="text-xs ml-4">
                      ‣ {m.title}: {m.progress || 0}%
                    </p>
                  ))}
                  {activeMilestones.length > 3 && (
                    <p className="text-xs ml-4">‣ +{activeMilestones.length - 3} milestone lainnya</p>
                  )}
                </div>
              )}
              
              {completedMilestoneCount > 0 && (
                <div className="mt-2">
                  <p className="text-[#30D158] text-xs">✓ {completedMilestoneCount} milestone sudah selesai</p>
                </div>
              )}
              
              {milestoneCosts.length > 0 && (
                <p className="text-xs mt-2">• Rp {(totalCostRealized / 1000000).toFixed(1)}M biaya sudah direalisasikan dari {milestoneCosts.length} transaksi</p>
              )}
            </>
          ) : (
            <>
              <p className="text-[#FF9500] font-medium">⚠️ Siap untuk eksekusi</p>
              <p className="text-xs">Belum ada milestone dibuat</p>
              {milestoneCosts.length > 0 && (
                <p className="text-xs">• Rp {(totalCostRealized / 1000000).toFixed(1)}M biaya sudah direalisasikan</p>
              )}
              <p className="text-xs text-[#0A84FF] mt-2">
                💡 Buat milestone untuk mulai tracking progress eksekusi
              </p>
            </>
          )}
        </div>
      );
    case 'completion':
      return (
        <p>
          {project.status === 'completed' ? 'Proyek telah selesai' : 'Menunggu eksekusi selesai'}
        </p>
      );
    default:
      return null;
  }
};

export default WorkflowStagesCard;
