import React from 'react';
import { CheckCircle } from 'lucide-react';
import { workflowStages } from '../config';

/**
 * WorkflowStagesCard Component
 * Displays the sequential workflow stages with status indicators
 * 
 * UPDATED LOGIC (Oct 9, 2025):
 * - Procurement dapat berjalan parallel dengan Execution
 * - Execution dimulai ketika ada Delivery Receipt (tanda terima PO)
 * - Procurement tidak perlu 100% selesai untuk mulai Execution
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
    const has_purchase_orders = workflowData.purchaseOrders?.length > 0;
    const po_approved = workflowData.purchaseOrders?.some(po => po.status === 'approved');
    const all_po_received = workflowData.purchaseOrders?.every(po => po.status === 'received');
    const procurement_completed = rab_completed && has_purchase_orders && all_po_received;
    
    // Stage 4: Execution - Pelaksanaan (dimulai saat ada delivery receipt ATAU milestone aktif)
    // LOGIC BARU: Tidak perlu tunggu procurement selesai 100%
    // Execution dimulai jika ada delivery receipt ATAU ada milestone yang sedang berjalan
    const has_delivery_receipts = workflowData.deliveryReceipts?.length > 0;
    
    // Debug milestone data
    console.log('🔍 Execution Stage Debug:', {
      milestones: workflowData.milestones,
      milestonesData: workflowData.milestones?.data,
      projectStatus: project.status
    });
    
    const has_active_milestones = workflowData.milestones?.data?.some(m => {
      console.log('Checking milestone:', m.title, 'status:', m.status);
      return m.status === 'in_progress' || m.status === 'in-progress';
    }) || false;
    
    console.log('✅ Execution Calculation:', {
      has_delivery_receipts,
      has_active_milestones,
      rab_completed,
      po_approved
    });
    
    const execution_started = rab_completed && po_approved && (has_delivery_receipts || has_active_milestones);
    const execution_completed = execution_started && project.status === 'completed'; // Only completed when project is completed
    
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
      active:
        stage.id === 'planning' ? !planning_completed :
        stage.id === 'rab-approval' ? (planning_completed && !rab_completed) :
        stage.id === 'procurement' ? (rab_completed && !procurement_completed) :
        stage.id === 'execution' ? (execution_started && !execution_completed) :
        stage.id === 'completion' ? (execution_completed && !completion_completed) :
        false
    }));
  };

  const stages = getStageStatus();
  
  // Find current active stage (first non-completed stage that is active)
  const currentStageIndex = stages.findIndex(stage => stage.active);

  return (
    <div className="space-y-4">
      {/* Progress Line */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#38383A]"></div>
        
        {/* Stages */}
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const IconComponent = stage.icon;
            const isActive = stage.active; // Use computed active state
            const isCompleted = stage.completed;
            
            return (
              <div key={stage.id} className="relative flex items-start">
                {/* Stage Indicator */}
                <div className={`
                  relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-[#30D158] border-[#30D158]/30 text-white' 
                      : isActive 
                      ? 'bg-[#0A84FF] border-[#0A84FF]/30 text-white' 
                      : 'bg-[#2C2C2E] border-[#38383A] text-[#636366]'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <IconComponent className="h-6 w-6" />
                  )}
                </div>

                {/* Stage Content */}
                <div className="ml-4 flex-1 min-w-0">
                  <div className={`
                    p-4 rounded-lg border transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-[#30D158]/10 border-[#30D158]/30' 
                        : isActive 
                        ? 'bg-[#0A84FF]/10 border-[#0A84FF]/30' 
                        : 'bg-[#1C1C1E] border-[#38383A]'
                    }
                  `}>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className={`font-semibold ${
                        isCompleted 
                          ? 'text-[#30D158]' 
                          : isActive 
                          ? 'text-[#0A84FF]' 
                          : 'text-[#8E8E93]'
                      }`}>
                        {stage.label}
                      </h5>
                      
                      <div className="flex items-center space-x-2">
                        {isCompleted && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#30D158]/20 text-[#30D158]">
                            Selesai
                          </span>
                        )}
                        {isActive && !isCompleted && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#0A84FF]/20 text-[#0A84FF]">
                            Sedang Berjalan
                          </span>
                        )}
                        {!isCompleted && !isActive && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3A3A3C] text-[#8E8E93]">
                            Menunggu
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Stage Description */}
                    <p className="text-sm text-[#8E8E93] mb-2">{stage.description}</p>
                    
                    {/* Stage Details */}
                    <div className="text-xs text-[#98989D]">
                      {getStageDetails(stage.id, project, workflowData)}
                    </div>
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
            ? `${project.rabItems.length} item RAB - ${workflowData.rabStatus?.approved ? 'Sudah disetujui' : 'Menunggu persetujuan'}`
            : 'Belum ada item RAB'}
        </p>
      );
    case 'procurement':
      const totalPO = workflowData.purchaseOrders?.length || 0;
      const approvedPO = workflowData.purchaseOrders?.filter(po => po.status === 'approved' || po.status === 'received')?.length || 0;
      
      // Count PO that have delivery receipts (received status)
      const receivedPO = workflowData.purchaseOrders?.filter(po => {
        // Check if this PO has any delivery receipt with received/completed status
        return workflowData.deliveryReceipts?.some(dr => 
          dr.poNumber === po.id && (dr.status === 'received' || dr.status === 'completed')
        );
      })?.length || 0;
      
      const hasExecution = workflowData.deliveryReceipts?.length > 0;
      
      return (
        <div className="space-y-1">
          <p>{totalPO > 0 ? `${totalPO} Purchase Order` : 'Belum ada Purchase Order'}</p>
          {totalPO > 0 && (
            <>
              <p>• Disetujui: {approvedPO} dari {totalPO} PO</p>
              <p>• Diterima: {receivedPO} dari {totalPO} PO</p>
              {hasExecution && receivedPO < totalPO && (
                <p className="text-[#0A84FF] font-medium mt-2">
                  ℹ️ Material sedang diterima bertahap, eksekusi sudah dimulai
                </p>
              )}
              {receivedPO === totalPO && (
                <p className="text-[#30D158] font-medium mt-2">
                  ✓ Semua material sudah diterima lengkap
                </p>
              )}
            </>
          )}
        </div>
      );
    case 'execution':
      const hasDeliveryReceipts = workflowData.deliveryReceipts?.length > 0;
      const deliveryCount = workflowData.deliveryReceipts?.length || 0;
      const activeMilestones = workflowData.milestones?.data?.filter(m => 
        m.status === 'in_progress' || m.status === 'in-progress'
      ) || [];
      const activeMilestoneCount = activeMilestones.length;
      
      // Calculate average progress from active milestones
      const avgProgress = activeMilestones.length > 0
        ? Math.round(activeMilestones.reduce((sum, m) => sum + (m.progress || 0), 0) / activeMilestones.length)
        : 0;
      
      return (
        <div className="space-y-1">
          {project.status === 'completed' ? (
            <p>✓ Eksekusi selesai</p>
          ) : project.status === 'active' ? (
            <>
              <p>Dalam tahap pelaksanaan</p>
              {activeMilestoneCount > 0 && (
                <>
                  <p>• {activeMilestoneCount} milestone sedang berjalan ({avgProgress}% rata-rata progress)</p>
                  {activeMilestones.slice(0, 2).map((m, idx) => (
                    <p key={idx} className="text-xs ml-4">
                      ‣ {m.title}: {m.progress || 0}%
                    </p>
                  ))}
                  {activeMilestones.length > 2 && (
                    <p className="text-xs ml-4">‣ +{activeMilestones.length - 2} milestone lainnya</p>
                  )}
                </>
              )}
              {hasDeliveryReceipts && (
                <p>• {deliveryCount} tanda terima material sudah diterima</p>
              )}
            </>
          ) : (hasDeliveryReceipts || activeMilestoneCount > 0) ? (
            <>
              <p className="text-[#30D158] font-medium">✓ Siap untuk eksekusi</p>
              {activeMilestoneCount > 0 && (
                <>
                  <p>• {activeMilestoneCount} milestone sedang berjalan ({avgProgress}% rata-rata progress)</p>
                  {activeMilestones.slice(0, 2).map((m, idx) => (
                    <p key={idx} className="text-xs ml-4">
                      ‣ {m.title}: {m.progress || 0}%
                    </p>
                  ))}
                </>
              )}
              {hasDeliveryReceipts && (
                <p>• {deliveryCount} tanda terima material sudah diterima</p>
              )}
            </>
          ) : (
            <p>Menunggu tanda terima material pertama atau milestone dimulai</p>
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
