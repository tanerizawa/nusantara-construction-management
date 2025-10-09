import React from 'react';
import { CheckCircle } from 'lucide-react';
import { workflowStages } from '../config';

/**
 * WorkflowStagesCard Component
 * Displays the sequential workflow stages with status indicators
 */
const WorkflowStagesCard = ({ workflowData, project }) => {
  // Calculate stages based on real project data with proper sequential logic
  const getStageStatus = () => {
    // Stage completion must follow sequential order
    const planning_completed = project.status !== 'draft' && project.status !== 'pending';
    
    const rabItems_exist = project.rabItems && project.rabItems.length > 0;
    const rab_approved = rabItems_exist && workflowData.rabStatus?.approved;
    const rab_completed = planning_completed && rab_approved;
    
    const po_approved = workflowData.purchaseOrders?.some(po => po.status === 'approved');
    const procurement_completed = rab_completed && po_approved;
    
    const execution_completed = procurement_completed && (project.status === 'active' || project.status === 'completed');
    const completion_completed = execution_completed && project.status === 'completed';

    return workflowStages.map((stage) => ({
      ...stage,
      completed: 
        stage.id === 'planning' ? planning_completed :
        stage.id === 'rab-approval' ? rab_completed :
        stage.id === 'procurement' ? procurement_completed :
        stage.id === 'execution' ? execution_completed :
        stage.id === 'completion' ? completion_completed :
        false
    }));
  };

  const stages = getStageStatus();
  const currentStageIndex = stages.findIndex(stage => 
    !stage.completed && (workflowData.currentStage === stage.id || 
    (workflowData.currentStage === 'planning' && stage.id === 'planning'))
  );

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
            const isActive = currentStageIndex === index;
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
      return (
        <p>
          {workflowData.purchaseOrders?.length > 0 
            ? `${workflowData.purchaseOrders.length} PO - ${workflowData.purchaseOrders?.some(po => po.status === 'approved') ? 'Ada yang disetujui' : 'Menunggu persetujuan'}`
            : 'Belum ada Purchase Order'}
        </p>
      );
    case 'execution':
      return (
        <p>
          {project.status === 'completed' ? 'Eksekusi selesai' : 
           project.status === 'active' ? 'Dalam tahap pelaksanaan' : 
           'Menunggu procurement selesai'}
        </p>
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
