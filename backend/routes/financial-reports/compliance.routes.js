/**
 * ============================================================================
 * COMPLIANCE & AUDIT ROUTES - Regulatory Compliance & Audit Trail
 * ============================================================================
 * 
 * Module: compliance.routes.js
 * Purpose: Audit trail tracking, PSAK compliance, data integrity, and regulatory reporting
 * 
 * ENDPOINTS: 4 total
 * - GET /audit-trail              - Comprehensive audit trail report
 * - GET /psak                     - PSAK compliance report (Indonesian accounting standards)
 * - GET /data-integrity           - Data integrity verification report
 * - GET /dashboard                - Regulatory compliance dashboard
 * 
 * EXTRACTED FROM: financialReports.js (lines 790-870)
 * DEPENDENCIES: ComplianceAuditService
 * 
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

// Import compliance audit service
const ComplianceAuditService = require('../../services/ComplianceAuditService');

// ============================================================================
// AUDIT TRAIL
// ============================================================================

/**
 * @route   GET /api/reports/compliance/audit-trail
 * @desc    Generate comprehensive audit trail with all financial transactions
 * @access  Private (Auditor / Management)
 * @query   start_date - Start date for audit trail (optional)
 * @query   end_date - End date for audit trail (optional)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 * @query   user_id - Filter by user ID (optional)
 * @query   transaction_type - Filter by transaction type (optional)
 */
router.get('/audit-trail', async (req, res) => {
  try {
    const { start_date, end_date, subsidiary_id, user_id, transaction_type } = req.query;
    
    const result = await ComplianceAuditService.generateAuditTrail({
      startDate: start_date ? new Date(start_date) : undefined,
      endDate: end_date ? new Date(end_date) : undefined,
      subsidiaryId: subsidiary_id,
      userId: user_id,
      transactionType: transaction_type
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error generating audit trail:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating audit trail',
      error: error.message 
    });
  }
});

// ============================================================================
// PSAK COMPLIANCE REPORT
// ============================================================================

/**
 * @route   GET /api/reports/compliance/psak
 * @desc    Generate PSAK (Indonesian Accounting Standards) compliance report
 * @access  Private (Auditor / Management)
 * @query   start_date - Start date for compliance check (optional)
 * @query   end_date - End date for compliance check (optional)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/psak', async (req, res) => {
  try {
    const { start_date, end_date, subsidiary_id } = req.query;
    
    const result = await ComplianceAuditService.generatePSAKComplianceReport({
      startDate: start_date ? new Date(start_date) : undefined,
      endDate: end_date ? new Date(end_date) : undefined,
      subsidiaryId: subsidiary_id
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error generating PSAK compliance report:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating PSAK compliance report',
      error: error.message 
    });
  }
});

// ============================================================================
// DATA INTEGRITY REPORT
// ============================================================================

/**
 * @route   GET /api/reports/compliance/data-integrity
 * @desc    Generate data integrity verification report (balance checks, orphaned records, etc.)
 * @access  Private (Auditor / IT)
 * @query   start_date - Start date for integrity check (optional)
 * @query   end_date - End date for integrity check (optional)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/data-integrity', async (req, res) => {
  try {
    const { start_date, end_date, subsidiary_id } = req.query;
    
    const result = await ComplianceAuditService.generateDataIntegrityReport({
      startDate: start_date ? new Date(start_date) : undefined,
      endDate: end_date ? new Date(end_date) : undefined,
      subsidiaryId: subsidiary_id
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error generating data integrity report:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating data integrity report',
      error: error.message 
    });
  }
});

// ============================================================================
// REGULATORY COMPLIANCE DASHBOARD
// ============================================================================

/**
 * @route   GET /api/reports/compliance/dashboard
 * @desc    Generate regulatory compliance dashboard with overall compliance score
 * @access  Private (Management / Auditor)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/dashboard', async (req, res) => {
  try {
    const { subsidiary_id } = req.query;
    
    const result = await ComplianceAuditService.generateRegulatoryComplianceDashboard({
      subsidiaryId: subsidiary_id
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error generating compliance dashboard:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating regulatory compliance dashboard',
      error: error.message 
    });
  }
});

// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
