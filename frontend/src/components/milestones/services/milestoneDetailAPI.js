// Milestone Detail API Service
// All endpoints for milestone photos, costs, and activities

import apiService from '../../../services/api';

export const milestoneDetailAPI = {
  // ========== PHOTOS ==========
  
  /**
   * Get all photos for a milestone
   * @param {string} projectId
   * @param {string} milestoneId
   * @param {object} params - { photoType?, limit?, offset? }
   */
  getPhotos: (projectId, milestoneId, params = {}) => 
    apiService.get(`/projects/${projectId}/milestones/${milestoneId}/photos`, { params }),

  /**
   * Upload photos for a milestone
   * @param {string} projectId
   * @param {string} milestoneId
   * @param {FormData} formData - Should contain files and metadata
   */
  uploadPhotos: (projectId, milestoneId, formData) =>
    apiService.post(`/projects/${projectId}/milestones/${milestoneId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  /**
   * Delete a photo
   * @param {string} projectId
   * @param {string} milestoneId
   * @param {string} photoId
   */
  deletePhoto: (projectId, milestoneId, photoId) =>
    apiService.delete(`/projects/${projectId}/milestones/${milestoneId}/photos/${photoId}`),

  // ========== COSTS ==========
  
  /**
   * Get all cost entries for a milestone
   * @param {string} projectId
   * @param {string} milestoneId
   * @param {object} params - { costCategory?, costType? }
   */
  getCosts: (projectId, milestoneId, params = {}) =>
    apiService.get(`/projects/${projectId}/milestones/${milestoneId}/costs`, { params }),

  /**
   * Get cost summary with budget analysis
   * @param {string} projectId
   * @param {string} milestoneId
   */
  getCostSummary: (projectId, milestoneId) =>
    apiService.get(`/projects/${projectId}/milestones/${milestoneId}/costs/summary`),

  /**
   * Add a new cost entry
   * @param {string} projectId
   * @param {string} milestoneId
   * @param {object} data - { costCategory, costType, amount, description, referenceNumber?, approvedBy?, approvedAt?, metadata? }
   */
  addCost: (projectId, milestoneId, data) =>
    apiService.post(`/projects/${projectId}/milestones/${milestoneId}/costs`, data),

  /**
   * Update a cost entry
   * @param {string} projectId
   * @param {string} milestoneId
   * @param {string} costId
   * @param {object} data - Partial cost object
   */
  updateCost: (projectId, milestoneId, costId, data) =>
    apiService.put(`/projects/${projectId}/milestones/${milestoneId}/costs/${costId}`, data),

  /**
   * Delete a cost entry
   * @param {string} projectId
   * @param {string} milestoneId
   * @param {string} costId
   */
  deleteCost: (projectId, milestoneId, costId) =>
    apiService.delete(`/projects/${projectId}/milestones/${milestoneId}/costs/${costId}`),

  // ========== ACTIVITIES ==========
  
  /**
   * Get activity timeline for a milestone
   * @param {string} projectId
   * @param {string} milestoneId
   * @param {object} params - { activityType?, limit?, offset? }
   */
  getActivities: (projectId, milestoneId, params = {}) =>
    apiService.get(`/projects/${projectId}/milestones/${milestoneId}/activities`, { params }),

  /**
   * Add a manual activity log entry
   * @param {string} projectId
   * @param {string} milestoneId
   * @param {object} data - { activityType, activityTitle, activityDescription, metadata? }
   */
  addActivity: (projectId, milestoneId, data) =>
    apiService.post(`/projects/${projectId}/milestones/${milestoneId}/activities`, data)
};

// Photo types enum
export const PHOTO_TYPES = {
  PROGRESS: 'progress',
  ISSUE: 'issue',
  INSPECTION: 'inspection',
  QUALITY: 'quality',
  BEFORE: 'before',
  AFTER: 'after',
  GENERAL: 'general'
};

// Cost categories enum
export const COST_CATEGORIES = {
  MATERIALS: 'materials',
  LABOR: 'labor',
  EQUIPMENT: 'equipment',
  SUBCONTRACTOR: 'subcontractor',
  CONTINGENCY: 'contingency',
  INDIRECT: 'indirect',
  OTHER: 'other'
};

// Cost types enum
export const COST_TYPES = {
  PLANNED: 'planned',
  ACTUAL: 'actual',
  CHANGE_ORDER: 'change_order',
  UNFORESEEN: 'unforeseen'
};

// Activity types enum
export const ACTIVITY_TYPES = {
  CREATED: 'created',
  UPDATED: 'updated',
  STATUS_CHANGE: 'status_change',
  PROGRESS_UPDATE: 'progress_update',
  PHOTO_UPLOAD: 'photo_upload',
  COST_ADDED: 'cost_added',
  COST_UPDATED: 'cost_updated',
  ISSUE_REPORTED: 'issue_reported',
  ISSUE_RESOLVED: 'issue_resolved',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMMENT: 'comment',
  OTHER: 'other'
};
