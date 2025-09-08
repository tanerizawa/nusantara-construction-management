const { Op } = require('sequelize');

/**
 * Generate Project Code Algorithm
 * Format: {YEAR}{SUBSIDIARY_CODE}{SEQUENCE}
 * Example: 2025HDL001, 2025BSR002, 2025YKS003
 * 
 * Algorithm:
 * 1. Get current year (4 digits)
 * 2. Get subsidiary code (3 letters)
 * 3. Get next sequence number for this year+subsidiary combination
 * 4. Combine into format: YYYYCCCNNN
 */

class ProjectCodeGenerator {
  /**
   * Generate unique project code
   * @param {Object} subsidiaryInfo - Subsidiary information
   * @param {string} subsidiaryInfo.code - 3-letter subsidiary code (HDL, BSR, etc)
   * @param {Object} Project - Sequelize Project model
   * @returns {Promise<string>} Generated project code
   */
  static async generateProjectCode(subsidiaryInfo, Project) {
    try {
      // Get current year
      const currentYear = new Date().getFullYear().toString();
      
      // Get subsidiary code (ensure 3 characters, uppercase)
      const subsidiaryCode = subsidiaryInfo?.code?.toString().toUpperCase().padEnd(3, 'X').substring(0, 3) || 'XXX';
      
      // Create base pattern for this year and subsidiary
      const basePattern = `${currentYear}${subsidiaryCode}`;
      
      // Find all existing projects with this pattern
      const existingProjects = await Project.findAll({
        where: {
          id: {
            [Op.like]: `${basePattern}%`
          }
        },
        attributes: ['id'],
        order: [['id', 'DESC']],
        limit: 1
      });
      
      let nextSequence = 1;
      
      // If projects exist, get the highest sequence number
      if (existingProjects.length > 0) {
        const lastProjectCode = existingProjects[0].id;
        const sequencePart = lastProjectCode.substring(basePattern.length);
        const lastSequence = parseInt(sequencePart) || 0;
        nextSequence = lastSequence + 1;
      }
      
      // Format sequence as 3-digit number with leading zeros
      const sequenceStr = nextSequence.toString().padStart(3, '0');
      
      // Generate final project code
      const projectCode = `${basePattern}${sequenceStr}`;
      
      // Validate uniqueness (double-check)
      const existingProject = await Project.findByPk(projectCode);
      if (existingProject) {
        // If somehow the generated code exists, try next sequence
        return this.generateProjectCode(subsidiaryInfo, Project, nextSequence + 1);
      }
      
      return projectCode;
      
    } catch (error) {
      console.error('Error generating project code:', error);
      // Fallback: generate random code if algorithm fails
      const timestamp = Date.now().toString().slice(-6);
      const fallbackCode = `PRJ${timestamp}`;
      return fallbackCode;
    }
  }
  
  /**
   * Generate project code with custom sequence (for recursion)
   * @private
   */
  static async generateProjectCodeWithSequence(subsidiaryInfo, Project, startSequence = 1) {
    const currentYear = new Date().getFullYear().toString();
    const subsidiaryCode = subsidiaryInfo?.code?.toString().toUpperCase().padEnd(3, 'X').substring(0, 3) || 'XXX';
    const basePattern = `${currentYear}${subsidiaryCode}`;
    const sequenceStr = startSequence.toString().padStart(3, '0');
    const projectCode = `${basePattern}${sequenceStr}`;
    
    const existingProject = await Project.findByPk(projectCode);
    if (existingProject) {
      // Try next sequence
      return this.generateProjectCodeWithSequence(subsidiaryInfo, Project, startSequence + 1);
    }
    
    return projectCode;
  }
  
  /**
   * Parse project code to extract information
   * @param {string} projectCode - Project code to parse
   * @returns {Object} Parsed information
   */
  static parseProjectCode(projectCode) {
    if (!projectCode || projectCode.length < 10) {
      return null;
    }
    
    try {
      const year = projectCode.substring(0, 4);
      const subsidiaryCode = projectCode.substring(4, 7);
      const sequence = projectCode.substring(7);
      
      return {
        year: parseInt(year),
        subsidiaryCode: subsidiaryCode,
        sequence: parseInt(sequence),
        fullCode: projectCode
      };
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Get project statistics by year and subsidiary
   * @param {Object} Project - Sequelize Project model
   * @param {number} year - Year to filter
   * @param {string} subsidiaryCode - Subsidiary code to filter
   * @returns {Promise<Object>} Statistics
   */
  static async getProjectStats(Project, year = null, subsidiaryCode = null) {
    const currentYear = year || new Date().getFullYear();
    const pattern = subsidiaryCode ? 
      `${currentYear}${subsidiaryCode.toUpperCase()}%` : 
      `${currentYear}%`;
    
    const projects = await Project.findAll({
      where: {
        id: {
          [Op.like]: pattern
        }
      },
      attributes: ['id', 'createdAt']
    });
    
    return {
      year: currentYear,
      subsidiaryCode: subsidiaryCode,
      totalProjects: projects.length,
      nextSequence: projects.length + 1,
      projects: projects.map(p => ({
        code: p.id,
        parsed: this.parseProjectCode(p.id),
        createdAt: p.createdAt
      }))
    };
  }
  
  /**
   * Validate project code format
   * @param {string} projectCode - Code to validate
   * @returns {boolean} Is valid format
   */
  static isValidProjectCode(projectCode) {
    if (!projectCode || typeof projectCode !== 'string') {
      return false;
    }
    
    // Check length (should be 10 characters: YYYYCCCNNN)
    if (projectCode.length !== 10) {
      return false;
    }
    
    // Check format with regex
    const codePattern = /^20\d{2}[A-Z]{3}\d{3}$/;
    return codePattern.test(projectCode);
  }
  
  /**
   * Get next available project code preview
   * @param {string} subsidiaryCode - Subsidiary code
   * @param {Object} Project - Sequelize Project model
   * @returns {Promise<string>} Preview of next code
   */
  static async getNextCodePreview(subsidiaryCode, Project) {
    const currentYear = new Date().getFullYear().toString();
    const cleanSubsidiaryCode = subsidiaryCode?.toString().toUpperCase().padEnd(3, 'X').substring(0, 3) || 'XXX';
    const basePattern = `${currentYear}${cleanSubsidiaryCode}`;
    
    const existingProjects = await Project.count({
      where: {
        id: {
          [Op.like]: `${basePattern}%`
        }
      }
    });
    
    const nextSequence = (existingProjects + 1).toString().padStart(3, '0');
    return `${basePattern}${nextSequence}`;
  }
}

module.exports = ProjectCodeGenerator;
