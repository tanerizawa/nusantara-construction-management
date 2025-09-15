// Approval Matrix Configuration for Indonesian Construction Industry
// Sesuai dengan best practices dan regulasi konstruksi Indonesia

export const approvalMatrix = {
  // RAB (Rencana Anggaran Biaya) Approval Matrix
  rab: {
    name: 'RAB & BOQ Approval',
    description: 'Approval matrix untuk Rencana Anggaran Biaya dan Bill of Quantities',
    thresholds: [
      {
        max: 25000000, // 25 juta
        roles: ['Site Engineer'],
        description: 'Material dan pekerjaan kecil',
        timeLimit: 24, // hours
        autoEscalate: true
      },
      {
        max: 100000000, // 100 juta  
        roles: ['Site Engineer', 'Project Manager'],
        description: 'Pekerjaan struktur dan arsitektur',
        timeLimit: 48,
        autoEscalate: true
      },
      {
        max: 500000000, // 500 juta
        roles: ['Site Engineer', 'Project Manager', 'Area Manager'],
        description: 'Pekerjaan mayor dan MEP',
        timeLimit: 72,
        autoEscalate: true
      },
      {
        max: 1000000000, // 1 miliar
        roles: ['Site Engineer', 'Project Manager', 'Area Manager', 'Operations Director'],
        description: 'Kontrak besar dan infrastruktur',
        timeLimit: 96,
        autoEscalate: true
      },
      {
        max: Infinity,
        roles: ['Site Engineer', 'Project Manager', 'Area Manager', 'Operations Director', 'Finance Director'],
        description: 'Proyek strategis dan mega project',
        timeLimit: 168, // 1 week
        autoEscalate: false
      }
    ],
    specialConditions: {
      hazardousWork: {
        additionalRoles: ['Safety Manager', 'Environmental Officer'],
        description: 'Pekerjaan berbahaya atau berdampak lingkungan'
      },
      clientApproval: {
        additionalRoles: ['Client Representative'],
        description: 'Perubahan yang mempengaruhi kontrak dengan client'
      }
    }
  },

  // Purchase Order Approval Matrix
  purchaseOrders: {
    name: 'Purchase Order Approval',
    description: 'Approval matrix untuk pembelian material, equipment, dan services',
    thresholds: [
      {
        max: 15000000, // 15 juta
        roles: ['Project Manager'],
        description: 'Material rutin dan consumables',
        timeLimit: 24,
        autoEscalate: true
      },
      {
        max: 75000000, // 75 juta
        roles: ['Project Manager', 'Procurement Manager'],
        description: 'Material struktural dan equipment kecil',
        timeLimit: 48,
        autoEscalate: true
      },
      {
        max: 300000000, // 300 juta
        roles: ['Project Manager', 'Procurement Manager', 'Area Manager'],
        description: 'Equipment berat dan material khusus',
        timeLimit: 72,
        autoEscalate: true
      },
      {
        max: 1000000000, // 1 miliar
        roles: ['Project Manager', 'Procurement Manager', 'Area Manager', 'Operations Director'],
        description: 'Kontrak supplier mayor',
        timeLimit: 96,
        autoEscalate: true
      },
      {
        max: Infinity,
        roles: ['Project Manager', 'Procurement Manager', 'Area Manager', 'Operations Director', 'Finance Director'],
        description: 'Strategic procurement dan vendor utama',
        timeLimit: 168,
        autoEscalate: false
      }
    ],
    specialConditions: {
      importedMaterial: {
        additionalRoles: ['Import/Export Manager', 'Finance Director'],
        description: 'Material import dengan Letter of Credit'
      },
      longTermContract: {
        additionalRoles: ['Legal Officer', 'Finance Director'],
        description: 'Kontrak jangka panjang > 1 tahun'
      }
    }
  },

  // Work Order Approval Matrix
  workOrders: {
    name: 'Work Order Approval',
    description: 'Approval matrix untuk perintah kerja dan assignment',
    thresholds: [
      {
        max: 50000000, // 50 juta
        roles: ['Site Engineer', 'Project Manager'],
        description: 'Pekerjaan rutin dan maintenance',
        timeLimit: 24,
        autoEscalate: true
      },
      {
        max: 200000000, // 200 juta
        roles: ['Site Engineer', 'Project Manager', 'Area Manager'],
        description: 'Subkontraktor khusus dan pekerjaan kompleks',
        timeLimit: 48,
        autoEscalate: true
      },
      {
        max: 500000000, // 500 juta
        roles: ['Site Engineer', 'Project Manager', 'Area Manager', 'Operations Director'],
        description: 'Major subcontractor dan specialized work',
        timeLimit: 72,
        autoEscalate: true
      },
      {
        max: Infinity,
        roles: ['Site Engineer', 'Project Manager', 'Area Manager', 'Operations Director', 'Finance Director'],
        description: 'Strategic partnership dan JO (Joint Operation)',
        timeLimit: 168,
        autoEscalate: false
      }
    ],
    specialConditions: {
      criticalPath: {
        additionalRoles: ['Planning Manager'],
        description: 'Pekerjaan di critical path yang mempengaruhi schedule'
      },
      qualityCritical: {
        additionalRoles: ['QA/QC Manager'],
        description: 'Pekerjaan yang memerlukan quality assurance khusus'
      }
    }
  },

  // Change Order Approval Matrix
  changeOrders: {
    name: 'Change Order Approval',
    description: 'Approval matrix untuk perubahan kontrak dan variasi pekerjaan',
    thresholds: [
      {
        max: 100000000, // 100 juta atau 5% contract value
        roles: ['Project Manager', 'Client Representative'],
        description: 'Minor changes dan design adjustment',
        timeLimit: 72,
        autoEscalate: true
      },
      {
        max: 500000000, // 500 juta atau 10% contract value
        roles: ['Project Manager', 'Area Manager', 'Client Representative', 'Design Consultant'],
        description: 'Significant changes dengan impact schedule',
        timeLimit: 120,
        autoEscalate: true
      },
      {
        max: Infinity,
        roles: ['Project Manager', 'Area Manager', 'Operations Director', 'Client Representative', 'Design Consultant', 'Finance Director'],
        description: 'Major contract variations dan scope changes',
        timeLimit: 240, // 10 days
        autoEscalate: false
      }
    ],
    specialConditions: {
      scheduleImpact: {
        additionalRoles: ['Planning Manager'],
        description: 'Perubahan yang mempengaruhi milestone kontrak'
      },
      regulatory: {
        additionalRoles: ['Legal Officer', 'Regulatory Affairs'],
        description: 'Perubahan yang memerlukan permit tambahan'
      }
    }
  },

  // Material Request Approval Matrix
  materialRequests: {
    name: 'Material Request Approval',
    description: 'Approval matrix untuk permintaan material dari site',
    thresholds: [
      {
        max: 25000000, // 25 juta
        roles: ['Site Engineer'],
        description: 'Material rutin dan emergency stock',
        timeLimit: 8, // hours
        autoEscalate: true
      },
      {
        max: 100000000, // 100 juta
        roles: ['Site Engineer', 'Project Manager'],
        description: 'Material khusus dan additional requirements',
        timeLimit: 24,
        autoEscalate: true
      },
      {
        max: 300000000, // 300 juta
        roles: ['Site Engineer', 'Project Manager', 'Procurement Manager'],
        description: 'Bulk material dan long lead time items',
        timeLimit: 48,
        autoEscalate: true
      },
      {
        max: Infinity,
        roles: ['Site Engineer', 'Project Manager', 'Procurement Manager', 'Area Manager'],
        description: 'Strategic material dan contract amendments',
        timeLimit: 72,
        autoEscalate: true
      }
    ],
    specialConditions: {
      urgent: {
        timeLimit: 4, // hours
        description: 'Emergency material request untuk critical activities'
      },
      qualityControl: {
        additionalRoles: ['QA/QC Manager'],
        description: 'Material dengan spesifikasi khusus atau testing requirements'
      }
    }
  },

  // Progress Payment Approval Matrix
  progressPayments: {
    name: 'Progress Payment Approval',
    description: 'Approval matrix untuk pembayaran berdasarkan progress pekerjaan',
    thresholds: [
      {
        max: 500000000, // 500 juta
        roles: ['Project Manager', 'Quantity Surveyor'],
        description: 'Regular progress payment sesuai termin',
        timeLimit: 48,
        autoEscalate: true
      },
      {
        max: 2000000000, // 2 miliar
        roles: ['Project Manager', 'Quantity Surveyor', 'Area Manager'],
        description: 'Major milestone payment',
        timeLimit: 72,
        autoEscalate: true
      },
      {
        max: Infinity,
        roles: ['Project Manager', 'Quantity Surveyor', 'Area Manager', 'Finance Director'],
        description: 'Final payment dan retention release',
        timeLimit: 120,
        autoEscalate: false
      }
    ],
    specialConditions: {
      clientApproval: {
        additionalRoles: ['Client Representative'],
        description: 'Payment yang memerlukan approval client'
      },
      warranty: {
        additionalRoles: ['Legal Officer'],
        description: 'Payment terkait warranty dan guarantee'
      }
    }
  },

  // Contract Variation Approval Matrix
  contractVariations: {
    name: 'Contract Variation Approval',
    description: 'Approval matrix untuk variasi kontrak dan addendum',
    thresholds: [
      {
        max: 200000000, // 200 juta atau 3% contract value
        roles: ['Project Manager', 'Legal Officer'],
        description: 'Minor contract adjustments',
        timeLimit: 96,
        autoEscalate: true
      },
      {
        max: 1000000000, // 1 miliar atau 15% contract value
        roles: ['Project Manager', 'Legal Officer', 'Area Manager', 'Client Representative'],
        description: 'Significant contract modifications',
        timeLimit: 168,
        autoEscalate: true
      },
      {
        max: Infinity,
        roles: ['Project Manager', 'Legal Officer', 'Area Manager', 'Operations Director', 'Client Representative', 'Finance Director'],
        description: 'Major contract amendments dan extensions',
        timeLimit: 336, // 2 weeks
        autoEscalate: false
      }
    ],
    specialConditions: {
      timeExtension: {
        additionalRoles: ['Planning Manager'],
        description: 'Variasi yang melibatkan perpanjangan waktu'
      },
      scopeChange: {
        additionalRoles: ['Design Consultant', 'Technical Manager'],
        description: 'Perubahan scope of work yang signifikan'
      }
    }
  }
};

// Role hierarchy and authority levels
export const roleHierarchy = {
  'Site Engineer': {
    level: 1,
    maxApprovalLimit: 25000000,
    canDelegate: false,
    department: 'Engineering'
  },
  'Project Manager': {
    level: 2,
    maxApprovalLimit: 100000000,
    canDelegate: true,
    department: 'Project Management'
  },
  'Procurement Manager': {
    level: 2,
    maxApprovalLimit: 75000000,
    canDelegate: true,
    department: 'Procurement'
  },
  'QA/QC Manager': {
    level: 2,
    maxApprovalLimit: 50000000,
    canDelegate: false,
    department: 'Quality Assurance'
  },
  'Safety Manager': {
    level: 2,
    maxApprovalLimit: 0, // Advisory role only
    canDelegate: false,
    department: 'HSE'
  },
  'Area Manager': {
    level: 3,
    maxApprovalLimit: 500000000,
    canDelegate: true,
    department: 'Operations'
  },
  'Planning Manager': {
    level: 3,
    maxApprovalLimit: 200000000,
    canDelegate: true,
    department: 'Planning'
  },
  'Operations Director': {
    level: 4,
    maxApprovalLimit: 2000000000,
    canDelegate: true,
    department: 'Operations'
  },
  'Finance Director': {
    level: 4,
    maxApprovalLimit: 5000000000,
    canDelegate: true,
    department: 'Finance'
  },
  'Legal Officer': {
    level: 3,
    maxApprovalLimit: 0, // Advisory role only
    canDelegate: false,
    department: 'Legal'
  },
  'Client Representative': {
    level: 5,
    maxApprovalLimit: Infinity,
    canDelegate: false,
    department: 'Client'
  },
  'Design Consultant': {
    level: 3,
    maxApprovalLimit: 0, // Advisory role only
    canDelegate: false,
    department: 'Design'
  }
};

// Get approval requirements for a specific item
export const getApprovalRequirements = (approvalType, amount, specialConditions = []) => {
  const matrix = approvalMatrix[approvalType];
  if (!matrix) {
    throw new Error(`Approval type ${approvalType} not found in matrix`);
  }

  // Find the appropriate threshold
  const threshold = matrix.thresholds.find(t => amount <= t.max);
  if (!threshold) {
    throw new Error(`No threshold found for amount ${amount} in ${approvalType}`);
  }

  let requiredRoles = [...threshold.roles];
  let timeLimit = threshold.timeLimit;

  // Apply special conditions
  specialConditions.forEach(condition => {
    const specialCondition = matrix.specialConditions[condition];
    if (specialCondition) {
      if (specialCondition.additionalRoles) {
        requiredRoles = [...new Set([...requiredRoles, ...specialCondition.additionalRoles])];
      }
      if (specialCondition.timeLimit) {
        timeLimit = Math.min(timeLimit, specialCondition.timeLimit);
      }
    }
  });

  return {
    approvalType,
    amount,
    requiredRoles,
    timeLimit,
    autoEscalate: threshold.autoEscalate,
    description: threshold.description,
    specialConditions,
    matrix: threshold
  };
};

// Check if user has approval authority
export const hasApprovalAuthority = (userRole, approvalType, amount) => {
  const roleConfig = roleHierarchy[userRole];
  if (!roleConfig) {
    return false;
  }

  const requirements = getApprovalRequirements(approvalType, amount);
  return requirements.requiredRoles.includes(userRole);
};

// Get next approver in the chain
export const getNextApprover = (approvalType, amount, currentApprovals = []) => {
  const requirements = getApprovalRequirements(approvalType, amount);
  const approvedRoles = currentApprovals.map(approval => approval.role);
  
  const pendingRoles = requirements.requiredRoles.filter(role => !approvedRoles.includes(role));
  
  if (pendingRoles.length === 0) {
    return null; // All required approvals completed
  }

  // Return the highest level pending role
  return pendingRoles.reduce((highest, current) => {
    const currentLevel = roleHierarchy[current]?.level || 0;
    const highestLevel = roleHierarchy[highest]?.level || 0;
    return currentLevel > highestLevel ? current : highest;
  });
};

// Calculate approval progress
export const calculateApprovalProgress = (approvalType, amount, currentApprovals = []) => {
  const requirements = getApprovalRequirements(approvalType, amount);
  const approvedCount = currentApprovals.filter(approval => approval.status === 'approved').length;
  const totalRequired = requirements.requiredRoles.length;
  
  return {
    approvedCount,
    totalRequired,
    percentage: Math.round((approvedCount / totalRequired) * 100),
    isComplete: approvedCount === totalRequired,
    pendingApprovers: requirements.requiredRoles.filter(role => 
      !currentApprovals.some(approval => approval.role === role && approval.status === 'approved')
    )
  };
};