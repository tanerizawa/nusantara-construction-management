// Workflow Helper Functions
export const formatCurrency = (amount) => {
  if (!amount) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getStatusColor = (status) => {
  const statusColors = {
    'completed': 'text-green-600 bg-green-100',
    'in_progress': 'text-blue-600 bg-blue-100',
    'pending': 'text-yellow-600 bg-yellow-100',
    'cancelled': 'text-red-600 bg-red-100',
    'approved': 'text-green-600 bg-green-100',
    'rejected': 'text-red-600 bg-red-100',
    'draft': 'text-gray-600 bg-gray-100'
  };
  return statusColors[status] || 'text-gray-600 bg-gray-100';
};

export const getApprovalStatusColor = (status) => {
  switch (status) {
    case 'approved': return 'text-green-600 bg-green-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    case 'revision_required': return 'text-orange-600 bg-orange-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const calculateBudgetVariance = (budgeted, actual) => {
  if (budgeted === 0) return 0;
  return ((actual - budgeted) / budgeted) * 100;
};

export const getWorkflowStage = (project, rabStatus, approvalStatus, poStatus) => {
  if (!rabStatus || rabStatus.length === 0) return 'planning';
  if (rabStatus.some(rab => rab.status === 'pending_approval')) return 'rab-approval';
  if (rabStatus.every(rab => rab.status === 'approved') && (!poStatus || poStatus.length === 0)) return 'procurement-planning';
  if (poStatus && poStatus.some(po => po.status === 'pending')) return 'po-approval';
  return 'execution';
};

export const getVarianceColor = (percentage) => {
  if (percentage <= 5) return 'text-green-600';
  if (percentage <= 15) return 'text-yellow-600';
  return 'text-red-600';
};
