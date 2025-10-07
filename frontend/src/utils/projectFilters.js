/**
 * Project Filtering Utilities
 * 
 * Centralized filtering logic for project management
 * Reduces redundancy and improves maintainability
 */

/**
 * Safely parse date with error handling
 * @param {string|Date} dateString - Date to parse
 * @param {string} projectId - Project ID for logging
 * @param {string} fieldName - Field name for logging
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDateSafely = (dateString, projectId, fieldName = 'date') => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid ${fieldName} format for project:`, projectId);
      return null;
    }
    return date;
  } catch (err) {
    console.warn(`Error parsing ${fieldName} for project:`, projectId, err);
    return null;
  }
};

/**
 * Calculate critical score for a project
 * Based on project management best practices
 * 
 * @param {Object} project - Project object
 * @returns {number} Critical score (0-10+)
 */
export const calculateCriticalScore = (project) => {
  if (!project) return 0;
  
  let score = 0;
  const now = new Date();
  
  // High priority projects get base score
  if (project.priority === 'high') {
    score += 3;
  }
  
  // Active/in-progress projects are more critical
  if (project.status === 'active' || project.status === 'in_progress') {
    score += 2;
  }
  
  // Check deadline proximity
  const projectEndDate = project.endDate || project.timeline?.endDate;
  if (projectEndDate) {
    const endDate = parseDateSafely(projectEndDate, project.id, 'endDate');
    if (endDate) {
      const daysToDeadline = Math.floor((endDate - now) / (24 * 60 * 60 * 1000));
      
      if (daysToDeadline <= 0) {
        // Overdue projects are extremely critical
        score += 5;
      } else if (daysToDeadline <= 180) {
        // Projects within 6 months are critical
        score += 2;
      }
    }
  }
  
  return score;
};

/**
 * Check if project was created recently (within 1 week)
 * @param {Object} project - Project object
 * @returns {boolean}
 */
export const isRecentProject = (project) => {
  if (!project?.createdAt) return false;
  
  const now = new Date();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const createdDate = parseDateSafely(project.createdAt, project.id, 'createdAt');
  
  if (!createdDate) return false;
  
  return (now - createdDate) <= oneWeek;
};

/**
 * Check if project is near deadline (within 1 month and not overdue)
 * @param {Object} project - Project object
 * @returns {boolean}
 */
export const isNearDeadline = (project) => {
  const deadlineEndDate = project?.endDate || project?.timeline?.endDate;
  if (!deadlineEndDate) return false;
  
  const now = new Date();
  const oneMonth = 30 * 24 * 60 * 60 * 1000;
  const endDate = parseDateSafely(deadlineEndDate, project.id, 'endDate');
  
  if (!endDate) return false;
  
  return (endDate - now) <= oneMonth && endDate > now;
};

/**
 * Main category filter function
 * Determines if a project matches the selected category
 * 
 * @param {Object} project - Project object
 * @param {string} category - Category filter ('all', 'critical', 'recent', 'deadline', etc.)
 * @returns {boolean} True if project matches category
 */
export const matchesCategory = (project, category) => {
  if (!category || category === 'all') return true;
  if (!project) return false;
  
  switch (category) {
    case 'critical':
      // A project is critical if score >= 5 (combination of factors)
      return calculateCriticalScore(project) >= 5;
      
    case 'recent':
      return isRecentProject(project);
      
    case 'deadline':
      return isNearDeadline(project);
      
    case 'in_progress':
      return project.status === 'in_progress';
      
    case 'completed':
      return project.status === 'completed';
      
    case 'planning':
      return project.status === 'planning';
      
    case 'on_hold':
      return project.status === 'on_hold';
      
    default:
      return true;
  }
};

/**
 * Check if project matches subsidiary filter
 * Handles multiple subsidiary field formats for compatibility
 * 
 * @param {Object} project - Project object
 * @param {string} subsidiaryFilter - Subsidiary ID or code to filter by
 * @returns {boolean} True if project matches subsidiary
 */
export const matchesSubsidiary = (project, subsidiaryFilter) => {
  if (!subsidiaryFilter) return true;
  if (!project) return false;
  
  return (
    project.subsidiaryId === subsidiaryFilter ||
    project.subsidiary?.id === subsidiaryFilter ||
    project.subsidiary?.code === subsidiaryFilter ||
    (project.subsidiaryInfo && (
      project.subsidiaryInfo.id === subsidiaryFilter ||
      project.subsidiaryInfo.code === subsidiaryFilter
    ))
  );
};

/**
 * Apply all filters to a project
 * Centralized filtering logic
 * 
 * @param {Object} project - Project object
 * @param {Object} filters - Filter object
 * @param {string} filters.category - Category filter
 * @param {string} filters.subsidiary - Subsidiary filter
 * @returns {boolean} True if project passes all filters
 */
export const applyFilters = (project, filters = {}) => {
  if (!project) return false;
  
  const categoryMatch = matchesCategory(project, filters.category);
  const subsidiaryMatch = matchesSubsidiary(project, filters.subsidiary);
  
  return categoryMatch && subsidiaryMatch;
};

/**
 * Filter array of projects
 * @param {Array} projects - Array of project objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered projects
 */
export const filterProjects = (projects, filters) => {
  if (!Array.isArray(projects)) return [];
  return projects.filter(project => applyFilters(project, filters));
};
