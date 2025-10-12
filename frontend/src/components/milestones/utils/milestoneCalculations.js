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
  
  // Calculate progress: weighted by budget if available, otherwise simple average
  let progressWeighted = 0;
  if (milestones.length > 0) {
    if (totalBudget > 0) {
      // Weighted average: (sum of progress * budget) / total budget
      progressWeighted = milestones.reduce((sum, m) => sum + (m.progress * m.budget), 0) / totalBudget;
    } else {
      // Simple average: sum of all progress / count
      progressWeighted = milestones.reduce((sum, m) => sum + m.progress, 0) / milestones.length;
    }
  }
  
  return {
    total,
    completed,
    inProgress,
    overdue,
    completionRate: total > 0 ? (completed / total) * 100 : 0,
    totalBudget,
    totalActualCost,
    progressWeighted: progressWeighted || 0
  };
};
