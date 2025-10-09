// Calculate milestone statistics
export const calculateMilestoneStats = (milestones) => {
  const total = milestones.length;
  const completed = milestones.filter(m => m.status === 'completed').length;
  const inProgress = milestones.filter(m => m.status === 'in_progress').length;
  const overdue = milestones.filter(m => {
    if (m.status === 'completed') return false;
    return new Date(m.targetDate) < new Date();
  }).length;
  
  const totalBudget = milestones.reduce((sum, m) => sum + m.budget, 0);
  const totalActualCost = milestones.reduce((sum, m) => sum + m.actualCost, 0);
  const progressWeighted = milestones.reduce((sum, m) => sum + (m.progress * m.budget), 0) / totalBudget;
  
  return {
    total,
    completed,
    inProgress,
    overdue,
    completionRate: (completed / total) * 100,
    totalBudget,
    totalActualCost,
    progressWeighted: progressWeighted || 0
  };
};
