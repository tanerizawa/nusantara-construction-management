/**
 * Auto-Fill Helper Functions for Milestone Creation
 * 
 * Purpose: Generate intelligent defaults for milestone fields
 * based on project and RAB data
 */

/**
 * Generate milestone name from project and RAB data
 * 
 * @param {Object} project - Project data
 * @param {Object} rabSummary - RAB summary data
 * @returns {string} Generated milestone name
 */
export const generateMilestoneName = (project, rabSummary) => {
  if (!project) return '';
  
  // Extract year from RAB approval or current year
  const year = rabSummary?.approvedDate 
    ? new Date(rabSummary.approvedDate).getFullYear()
    : new Date().getFullYear();
  
  const projectName = project.name || project.projectName || 'Project';
  
  // Generate descriptive name
  return `Implementasi RAB - ${projectName} ${year}`;
};

/**
 * Generate comprehensive milestone description
 * 
 * @param {Object} project - Project data
 * @param {Object} rabSummary - RAB summary data
 * @returns {string} Generated description with formatting
 */
export const generateDescription = (project, rabSummary) => {
  if (!rabSummary) return project?.description || '';
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Build comprehensive description
  let description = '';
  
  // Part 1: Project Context
  if (project?.description) {
    description += `${project.description}\n\n`;
  }
  
  // Part 2: RAB Summary
  description += `📋 RINGKASAN RAB:\n`;
  description += `• Total Budget: ${formatCurrency(rabSummary.totalValue)}\n`;
  description += `• Total Items: ${rabSummary.totalItems} item pekerjaan\n`;
  description += `• Tanggal Approval: ${formatDate(rabSummary.approvedDate)}\n`;
  
  // Part 3: Categories Breakdown (if available)
  if (rabSummary.categories && rabSummary.categories.length > 0) {
    description += `\n📊 KATEGORI PEKERJAAN:\n`;
    
    // Show top 5 categories
    const topCategories = rabSummary.categories.slice(0, 5);
    topCategories.forEach(cat => {
      description += `• ${cat.category}: ${formatCurrency(cat.totalValue)} (${cat.percentage}%)\n`;
    });
    
    // Show remaining count
    if (rabSummary.categories.length > 5) {
      description += `• +${rabSummary.categories.length - 5} kategori lainnya\n`;
    }
  }
  
  // Part 4: Deliverables Note
  description += `\n🎯 DELIVERABLES:\n`;
  description += `Milestone ini mencakup penyelesaian seluruh pekerjaan sesuai RAB yang telah disetujui.`;
  
  return description;
};

/**
 * Calculate target date based on budget and RAB approval
 * 
 * Formula: 1 month per 100 million IDR (conservative estimate)
 * Min: 1 month, Max: 24 months
 * 
 * @param {Object} rabSummary - RAB summary data
 * @param {Object} project - Project data
 * @returns {string} Target date in YYYY-MM-DD format
 */
export const calculateTargetDate = (rabSummary, project) => {
  // Start date: RAB approved date or today
  const startDate = rabSummary?.approvedDate 
    ? new Date(rabSummary.approvedDate)
    : new Date();
  
  // Calculate duration based on budget
  // Formula: 1 month per 100 million IDR
  const budgetInMillions = (rabSummary?.totalValue || 0) / 1000000;
  const estimatedMonths = Math.ceil(budgetInMillions / 100);
  
  // Apply constraints
  const minMonths = 1;  // Minimum 1 month
  const maxMonths = 24; // Maximum 2 years
  const duration = Math.max(minMonths, Math.min(maxMonths, estimatedMonths));
  
  // Calculate target date
  const targetDate = new Date(startDate);
  targetDate.setMonth(targetDate.getMonth() + duration);
  
  // If project has end date, don't exceed it
  if (project?.endDate) {
    const projectEndDate = new Date(project.endDate);
    if (targetDate > projectEndDate) {
      return projectEndDate.toISOString().split('T')[0];
    }
  }
  
  return targetDate.toISOString().split('T')[0];
};

/**
 * Calculate priority based on budget size
 * 
 * Thresholds:
 * - > 500M = Urgent (highest priority in DB enum)
 * - 200M-500M = High
 * - 50M-200M = Medium
 * - < 50M = Low
 * 
 * Valid priority enum values: 'low', 'medium', 'high', 'urgent'
 * 
 * @param {Object} rabSummary - RAB summary data
 * @returns {string} Priority level
 */
export const calculatePriority = (rabSummary) => {
  const budget = rabSummary?.totalValue || 0;
  
  if (budget > 500000000) {
    return 'urgent';   // > 500M (was 'critical', fixed to match DB enum)
  } else if (budget > 200000000) {
    return 'high';     // 200M - 500M
  } else if (budget > 50000000) {
    return 'medium';   // 50M - 200M
  } else {
    return 'low';      // < 50M
  }
};

/**
 * Generate deliverables from RAB categories
 * 
 * @param {Object} rabSummary - RAB summary data
 * @returns {Array<string>} Array of deliverable items
 */
export const generateDeliverables = (rabSummary) => {
  if (!rabSummary?.categories || rabSummary.categories.length === 0) {
    return ['Penyelesaian seluruh pekerjaan sesuai RAB'];
  }
  
  // Generate deliverable for each top category
  const deliverables = rabSummary.categories
    .slice(0, 5) // Top 5 categories
    .map(cat => `Penyelesaian ${cat.category}`)
    .filter(Boolean);
  
  // Add overall completion
  deliverables.push('Dokumentasi dan Berita Acara Penyelesaian');
  
  return deliverables;
};

/**
 * Format currency for display
 * 
 * @param {number} amount - Amount in IDR
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

/**
 * Get estimated duration in months
 * 
 * @param {Object} rabSummary - RAB summary data
 * @returns {number} Duration in months
 */
export const getEstimatedDuration = (rabSummary) => {
  const budgetInMillions = (rabSummary?.totalValue || 0) / 1000000;
  const estimatedMonths = Math.ceil(budgetInMillions / 100);
  
  // Apply constraints
  const minMonths = 1;
  const maxMonths = 24;
  
  return Math.max(minMonths, Math.min(maxMonths, estimatedMonths));
};

/**
 * Auto-fill all milestone fields
 * 
 * Main orchestrator function that combines all helpers
 * 
 * @param {Object} currentFormData - Current form state
 * @param {Object} project - Project data
 * @param {Object} rabSummary - RAB summary data
 * @param {boolean} preserveUserInput - Whether to preserve existing user input
 * @returns {Object} Updated form data with auto-filled values
 */
export const autoFillMilestoneData = (currentFormData, project, rabSummary, preserveUserInput = true) => {
  const newFormData = { ...currentFormData };
  
  // 1. Budget (always update from RAB)
  if (rabSummary?.totalValue) {
    newFormData.budget = rabSummary.totalValue;
  }
  
  // 2. Name (only if empty or preserveUserInput = false)
  if (!preserveUserInput || !currentFormData.name) {
    newFormData.name = generateMilestoneName(project, rabSummary);
  }
  
  // 3. Description (only if empty or preserveUserInput = false)
  if (!preserveUserInput || !currentFormData.description) {
    newFormData.description = generateDescription(project, rabSummary);
  }
  
  // 4. Target Date (only if empty or preserveUserInput = false)
  if (!preserveUserInput || !currentFormData.targetDate) {
    newFormData.targetDate = calculateTargetDate(rabSummary, project);
  }
  
  // 5. Priority (always update based on budget)
  newFormData.priority = calculatePriority(rabSummary);
  
  // 6. Deliverables (only if empty or preserveUserInput = false)
  if (!preserveUserInput || !currentFormData.deliverables || currentFormData.deliverables.length === 0) {
    newFormData.deliverables = generateDeliverables(rabSummary);
  }
  
  return newFormData;
};

/**
 * Create auto-fill metadata for visual indicators
 * 
 * @param {Object} rabSummary - RAB summary data
 * @returns {Object} Metadata object
 */
export const createAutoFillMetadata = (rabSummary) => {
  return {
    autoFilled: true,
    source: 'RAB',
    timestamp: new Date().toISOString(),
    rabTotalValue: rabSummary?.totalValue,
    rabTotalItems: rabSummary?.totalItems,
    rabApprovedDate: rabSummary?.approvedDate
  };
};
