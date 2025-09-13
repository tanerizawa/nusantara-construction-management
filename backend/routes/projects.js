const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const Project = require('../models/Project');
const ProjectRAB = require('../models/ProjectRAB');
const ProjectMilestone = require('../models/ProjectMilestone');
const ProjectTeamMember = require('../models/ProjectTeamMember');
const ProjectDocument = require('../models/ProjectDocument');
// const ProjectCodeGenerator = require('../services/ProjectCodeGenerator');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/documents');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.originalname);
    const filename = `doc_${timestamp}_${randomString}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow specific file types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'application/dwg',
    'text/plain', // Allow text files for testing
    'application/zip',
    'application/x-zip-compressed'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}. Allowed types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, PNG, JPG, JPEG, GIF, DWG, TXT`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Validation schema for project creation/update
const projectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  clientName: Joi.string().required(),
  clientContact: Joi.object().optional(),
  location: Joi.object().optional(),
  budget: Joi.number().min(0).optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  status: Joi.string().valid('planning', 'active', 'on_hold', 'completed', 'cancelled').default('planning'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  progress: Joi.number().min(0).max(100).default(0),
  subsidiary: Joi.object({
    id: Joi.string().required(),
    code: Joi.string().optional(),
    name: Joi.string().optional()
  }).optional()
});

// @route   GET /api/projects
// @desc    Get all projects with filters and pagination
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      q,
      status,
      priority,
      sort = 'name',
      order = 'asc',
      limit = 10,
      page = 1
    } = req.query;

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));
    const offset = (pageNum - 1) * limitNum;

    // Build where clause for filtering
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (priority) {
      whereClause.priority = priority;
    }

    // Text search
    if (q) {
      const needle = String(q).toLowerCase();
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${needle}%` } },
        { clientName: { [Op.iLike]: `%${needle}%` } },
        { description: { [Op.iLike]: `%${needle}%` } }
      ];
    }

    // Build order clause
    const validSortFields = ['name', 'status', 'startDate', 'endDate', 'budget', 'progress', 'priority'];
    const sortField = validSortFields.includes(sort) ? sort : 'name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // Get projects from database with filters
    const { count, rows: projects } = await Project.findAndCountAll({
      where: whereClause,
      order: [[sortField, sortOrder]],
      limit: limitNum,
      offset: offset,
      attributes: [
        'id', 'name', 'description', 'clientName', 'clientContact',
        'location', 'budget', 'actualCost', 'status', 'priority',
        'progress', 'startDate', 'endDate', 'projectManagerId',
        'subsidiaryId', 'subsidiaryInfo',
        'createdAt', 'updatedAt', 'createdBy', 'updatedBy'
      ],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'email', 'role', 'profile']
        },
        {
          model: User,
          as: 'updater',
          attributes: ['id', 'username', 'email', 'role', 'profile']
        }
      ]
    });

    res.json({
      success: true,
      data: projects,
      pagination: {
        current: pageNum,
        total: Math.ceil(count / limitNum),
        count: count,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'email', 'role', 'profile'],
          required: false
        },
        {
          model: User,
          as: 'updater',
          attributes: ['id', 'username', 'email', 'role', 'profile'],
          required: false
        }
      ]
    });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Transform data for API response
    const transformedProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      clientName: project.clientName,
      clientContact: project.clientContact || {},
      client: {
        company: project.clientName,
        ...project.clientContact
      },
      location: project.location,
      budget: {
        total: project.budget,
        currency: 'IDR'
      },
      actualCost: project.actualCost,
      status: project.status,
      priority: project.priority,
      progress: {
        percentage: project.progress,
        status: project.status
      },
      timeline: {
        startDate: project.startDate,
        endDate: project.endDate
      },
      startDate: project.startDate,
      endDate: project.endDate,
      subsidiaryId: project.subsidiaryId,
      subsidiaryInfo: project.subsidiaryInfo,
      subsidiary: project.subsidiaryInfo, // For backward compatibility
      manager: project.projectManagerId ? {
        id: project.projectManagerId
      } : null,
      metadata: project.metadata || {},
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      createdBy: project.created_by,
      updatedBy: project.updated_by,
      createdByUser: project.creator ? {
        id: project.creator.id,
        username: project.creator.username,
        email: project.creator.email,
        role: project.creator.role,
        fullName: project.creator.profile?.fullName || project.creator.username,
        position: project.creator.profile?.position || project.creator.role
      } : null,
      updatedByUser: project.updater ? {
        id: project.updater.id,
        username: project.updater.username,
        email: project.updater.email,
        role: project.updater.role,
        fullName: project.updater.profile?.fullName || project.updater.username,
        position: project.updater.profile?.position || project.updater.role
      } : null
    };

    res.json({
      success: true,
      data: transformedProject
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
      details: error.message
    });
  }
});

// @route   GET /api/projects/preview-code/:subsidiaryCode
// @desc    Get preview of next project code for a subsidiary
// @access  Private
router.get('/preview-code/:subsidiaryCode', async (req, res) => {
  try {
    const { subsidiaryCode } = req.params;
    
    if (!subsidiaryCode || subsidiaryCode.length !== 3) {
      return res.status(400).json({
        success: false,
        error: 'Subsidiary code must be exactly 3 characters'
      });
    }

    try {
      const ProjectCodeGenerator = require('../services/ProjectCodeGenerator');
      const nextCode = await ProjectCodeGenerator.getNextCodePreview(subsidiaryCode, Project);
      const stats = await ProjectCodeGenerator.getProjectStats(Project, null, subsidiaryCode);
      
      res.json({
        success: true,
        data: {
          nextProjectCode: nextCode,
          subsidiaryCode: subsidiaryCode.toUpperCase(),
          year: new Date().getFullYear(),
          sequence: stats.nextSequence,
          totalProjectsThisYear: stats.totalProjects,
          format: 'YYYYCCCNNN',
          example: nextCode
        }
      });
    } catch (codeGenError) {
      console.error('ProjectCodeGenerator error:', codeGenError);
      // Fallback
      const projectCount = await Project.count();
      const nextCode = `PRJ${String(projectCount + 1).padStart(3, '0')}`;
      
      res.json({
        success: true,
        data: {
          nextProjectCode: nextCode,
          subsidiaryCode: subsidiaryCode.toUpperCase(),
          year: new Date().getFullYear(),
          sequence: projectCount + 1,
          totalProjectsThisYear: projectCount,
          format: 'PRJNNN',
          example: nextCode
        }
      });
    }
  } catch (error) {
    console.error('Error generating code preview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate code preview',
      details: error.message
    });
  }
});

// @route   GET /api/projects/stats/codes
// @desc    Get project code statistics
// @access  Private
router.get('/stats/codes', async (req, res) => {
  try {
    const { year, subsidiary } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    
    try {
      const ProjectCodeGenerator = require('../services/ProjectCodeGenerator');
      const stats = await ProjectCodeGenerator.getProjectStats(Project, targetYear, subsidiary);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (codeGenError) {
      console.error('ProjectCodeGenerator error:', codeGenError);
      // Fallback
      const projectCount = await Project.count();
      res.json({
        success: true,
        data: {
          year: targetYear,
          total: projectCount,
          nextSequence: projectCount + 1
        }
      });
    }
  } catch (error) {
    console.error('Error getting code stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get code statistics',
      details: error.message
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', verifyToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    // Generate project code automatically based on subsidiary
    let projectId;
    try {
      const ProjectCodeGenerator = require('../services/ProjectCodeGenerator');
      projectId = await ProjectCodeGenerator.generateProjectCode(value.subsidiary, Project);
      console.log('Generated project code:', projectId);
    } catch (codeGenError) {
      console.error('Error generating project code:', codeGenError);
      // Fallback to old method if generator fails
      const projectCount = await Project.count();
      projectId = `PRJ${String(projectCount + 1).padStart(3, '0')}`;
    }

    // Create project
    const project = await Project.create({
      id: projectId,
      name: value.name,
      description: value.description,
      clientName: value.clientName,
      clientContact: value.clientContact || {},
      location: value.location || {},
      budget: value.budget,
      startDate: value.startDate,
      endDate: value.endDate,
      status: value.status,
      priority: value.priority,
      progress: value.progress,
      subsidiaryId: value.subsidiary?.id,
      subsidiaryInfo: value.subsidiary || null,
      createdBy: req.user?.id || null,
      updatedBy: req.user?.id || null
    });

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
      generatedCode: projectId
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
      details: error.message
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find project
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Validate input (make fields optional for update)
    const updateSchema = projectSchema.fork(
      ['name', 'clientName', 'startDate', 'endDate'],
      (schema) => schema.optional()
    );
    
    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    // Update project
    const updateData = {
      ...value,
      subsidiaryId: value.subsidiary?.id,
      subsidiaryInfo: value.subsidiary || null,
      updatedBy: req.user?.id || null
    };
    
    // Remove subsidiary from updateData to prevent Sequelize errors
    delete updateData.subsidiary;
    
    await project.update(updateData);

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project',
      details: error.message
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    await project.destroy();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project',
      details: error.message
    });
  }
});

// @route   GET /api/projects/stats/overview
// @desc    Get project statistics overview
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Project.findAll({
      attributes: [
        'status',
        [Project.sequelize.fn('COUNT', Project.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const overview = {
      total: await Project.count(),
      byStatus: stats.reduce((acc, stat) => {
        acc[stat.status] = parseInt(stat.dataValues.count);
        return acc;
      }, {}),
      active: await Project.count({ where: { status: 'active' } }),
      completed: await Project.count({ where: { status: 'completed' } }),
      planning: await Project.count({ where: { status: 'planning' } })
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project statistics',
      details: error.message
    });
  }
});

// ========== PROJECT RAB ENDPOINTS ==========

// @route   GET /api/projects/:id/rab
// @desc    Get all RAB items for a project
// @access  Private
router.get('/:id/rab', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const rabItems = await ProjectRAB.findAll({
      where: { projectId: id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rabItems
    });
  } catch (error) {
    console.error('Error fetching RAB items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RAB items',
      details: error.message
    });
  }
});

// @route   POST /api/projects/:id/rab
// @desc    Create new RAB item for a project
// @access  Private
router.post('/:id/rab', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, description, unit, quantity, unitPrice, notes, createdBy } = req.body;

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Validate required fields
    if (!category || !description || !unit || quantity == null || unitPrice == null) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: category, description, unit, quantity, unitPrice'
      });
    }

    const rabItem = await ProjectRAB.create({
      projectId: id,
      category,
      description,
      unit,
      quantity: parseFloat(quantity),
      unitPrice: parseFloat(unitPrice),
      totalPrice: parseFloat(quantity) * parseFloat(unitPrice),
      notes,
      createdBy
    });

    res.status(201).json({
      success: true,
      data: rabItem,
      message: 'RAB item created successfully'
    });
  } catch (error) {
    console.error('Error creating RAB item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create RAB item',
      details: error.message
    });
  }
});

// @route   PUT /api/projects/:id/rab/:rabId
// @desc    Update RAB item
// @access  Private
router.put('/:id/rab/:rabId', async (req, res) => {
  try {
    const { id, rabId } = req.params;
    const { category, description, unit, quantity, unitPrice, notes, updatedBy } = req.body;

    const rabItem = await ProjectRAB.findOne({
      where: { id: rabId, projectId: id }
    });

    if (!rabItem) {
      return res.status(404).json({
        success: false,
        error: 'RAB item not found'
      });
    }

    await rabItem.update({
      category: category || rabItem.category,
      description: description || rabItem.description,
      unit: unit || rabItem.unit,
      quantity: quantity != null ? parseFloat(quantity) : rabItem.quantity,
      unitPrice: unitPrice != null ? parseFloat(unitPrice) : rabItem.unitPrice,
      totalPrice: (quantity != null ? parseFloat(quantity) : rabItem.quantity) * 
                 (unitPrice != null ? parseFloat(unitPrice) : rabItem.unitPrice),
      notes: notes !== undefined ? notes : rabItem.notes,
      updatedBy
    });

    res.json({
      success: true,
      data: rabItem,
      message: 'RAB item updated successfully'
    });
  } catch (error) {
    console.error('Error updating RAB item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update RAB item',
      details: error.message
    });
  }
});

// @route   DELETE /api/projects/:id/rab/:rabId
// @desc    Delete RAB item
// @access  Private
router.delete('/:id/rab/:rabId', async (req, res) => {
  try {
    const { id, rabId } = req.params;

    const rabItem = await ProjectRAB.findOne({
      where: { id: rabId, projectId: id }
    });

    if (!rabItem) {
      return res.status(404).json({
        success: false,
        error: 'RAB item not found'
      });
    }

    await rabItem.destroy();

    res.json({
      success: true,
      message: 'RAB item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting RAB item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete RAB item',
      details: error.message
    });
  }
});

// @route   POST /api/projects/:id/rab/approve
// @desc    Approve all RAB items for a project
// @access  Private
router.post('/:id/rab/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    const [updatedCount] = await ProjectRAB.update({
      isApproved: true,
      approvedBy,
      approvedAt: new Date()
    }, {
      where: { 
        projectId: id,
        isApproved: false
      }
    });

    res.json({
      success: true,
      message: `${updatedCount} RAB items approved successfully`
    });
  } catch (error) {
    console.error('Error approving RAB items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve RAB items',
      details: error.message
    });
  }
});

// @route   GET /api/projects/:id/rab/export
// @desc    Export RAB items to Excel
// @access  Private
router.get('/:id/rab/export', async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'excel' } = req.query;

    // Get all RAB items for the project
    const rabItems = await ProjectRAB.findAll({
      where: { projectId: id },
      order: [['createdAt', 'ASC']]
    });

    if (format === 'excel') {
      // Create workbook using ExcelJS
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('RAB Items');
      
      // Define columns
      worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Kategori', key: 'category', width: 15 },
        { header: 'Deskripsi', key: 'description', width: 30 },
        { header: 'Satuan', key: 'unit', width: 10 },
        { header: 'Kuantitas', key: 'quantity', width: 10 },
        { header: 'Harga Satuan', key: 'unitPrice', width: 15 },
        { header: 'Total', key: 'total', width: 15 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Dibuat', key: 'created', width: 12 },
        { header: 'Disetujui', key: 'approved', width: 12 }
      ];

      // Add data rows
      rabItems.forEach((item, index) => {
        worksheet.addRow({
          no: index + 1,
          category: item.category || '',
          description: item.description || '',
          unit: item.unit || '',
          quantity: item.quantity || 0,
          unitPrice: item.unitPrice || 0,
          total: item.totalPrice || 0,
          status: item.isApproved ? 'Disetujui' : 'Pending',
          created: item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '',
          approved: item.approvedAt ? new Date(item.approvedAt).toLocaleDateString('id-ID') : ''
        });
      });

      // Add summary row
      const totalRAB = rabItems.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0);
      worksheet.addRow({
        no: '',
        category: '',
        description: 'TOTAL RAB',
        unit: '',
        quantity: '',
        unitPrice: '',
        total: totalRAB,
        status: '',
        created: '',
        approved: ''
      });

      // Style the header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="RAB_${id}_${new Date().toISOString().split('T')[0]}.xlsx"`);
      
      // Send file
      res.send(buffer);
    } else if (format === 'pdf') {
      // Create PDF document with better page setup
      const doc = new PDFDocument({ 
        margin: 40,
        size: 'A4',
        bufferPages: true
      });
      const filename = `RAB_${id}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Pipe the PDF to response
      doc.pipe(res);

      // Get project info (in real app, fetch from database)
      const currentDate = new Date();
      const dateStr = currentDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Helper function to draw header on each page
      const drawHeader = () => {
        // Company header with border
        doc.rect(40, 40, 515, 80).stroke();
        
        // Company logo area (placeholder)
        doc.rect(50, 50, 60, 60).stroke();
        doc.fontSize(8).fillColor('gray').text('LOGO', 70, 75, { align: 'center', width: 20 });
        
        // Company info
        doc.fontSize(16).fillColor('black').font('Helvetica-Bold')
           .text('PT YK KONSTRUKSI INDONESIA', 120, 55);
        doc.fontSize(10).font('Helvetica')
           .text('Jl. Konstruksi Raya No. 123, Jakarta Selatan 12345', 120, 75)
           .text('Tel: (021) 1234-5678 | Email: info@yk-konstruksi.co.id', 120, 90)
           .text('Website: www.yk-konstruksi.co.id', 120, 105);
        
        return 140; // Return Y position after header
      };

      // Helper function to draw footer
      const drawFooter = (pageNum, totalPages) => {
        const footerY = 750;
        doc.fontSize(8).fillColor('gray')
           .text(`Dokumen ini dibuat secara otomatis oleh Sistem Manajemen Konstruksi YK`, 40, footerY)
           .text(`Halaman ${pageNum} dari ${totalPages}`, 40, footerY + 12)
           .text(`Dicetak pada: ${dateStr}`, 40, footerY + 24);
        
        // Footer line
        doc.moveTo(40, footerY - 5).lineTo(555, footerY - 5).stroke();
      };

      // Start first page
      let currentY = drawHeader();
      
      // Document title section
      doc.rect(40, currentY, 515, 60).fillAndStroke('#f8f9fa', '#dee2e6');
      doc.fontSize(18).fillColor('#2c3e50').font('Helvetica-Bold')
         .text('RENCANA ANGGARAN BIAYA (RAB)', 40, currentY + 15, { align: 'center', width: 515 });
      doc.fontSize(12).fillColor('#495057').font('Helvetica')
         .text(`Project: ${id}`, 40, currentY + 35, { align: 'center', width: 515 });
      
      currentY += 80;

      // Project details section
      doc.rect(40, currentY, 515, 45).fillAndStroke('#e9ecef', '#dee2e6');
      doc.fontSize(10).fillColor('#2c3e50').font('Helvetica-Bold')
         .text('INFORMASI PROYEK', 50, currentY + 8);
      
      const projectDetails = [
        `Kode Proyek: ${id}`,
        `Tanggal Export: ${dateStr}`,
        `Total Item: ${rabItems.length} item`,
        `Status: ${rabItems.every(item => item.isApproved) ? 'Semua Disetujui' : 'Menunggu Persetujuan'}`
      ];
      
      doc.fontSize(9).font('Helvetica');
      projectDetails.forEach((detail, i) => {
        const xPos = 50 + (i % 2) * 250;
        const yPos = currentY + 22 + Math.floor(i / 2) * 12;
        doc.text(detail, xPos, yPos);
      });
      
      currentY += 65;

      // Table setup with professional styling
      const tableTop = currentY;
      const headers = ['No', 'Kategori', 'Deskripsi Item', 'Satuan', 'Qty', 'Harga Satuan', 'Subtotal', 'Status'];
      // Adjusted column widths to fit A4 page (total: 515pt available width)
      const columnWidths = [30, 60, 150, 40, 35, 75, 80, 45];
      const rowHeight = 30;
      const headerHeight = 35;
      const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0); // Total: 515pt

      // Table header with gradient-like effect
      doc.rect(40, tableTop, tableWidth, headerHeight).fillAndStroke('#4a90e2', '#2c3e50');
      
      let currentX = 40;
      headers.forEach((header, i) => {
        doc.fontSize(9).fillColor('white').font('Helvetica-Bold')
           .text(header, currentX + 3, tableTop + 12, { 
             width: columnWidths[i] - 6, 
             align: 'center',
             valign: 'center'
           });
        
        // Vertical separator lines
        if (i < headers.length - 1) {
          doc.moveTo(currentX + columnWidths[i], tableTop)
             .lineTo(currentX + columnWidths[i], tableTop + headerHeight)
             .stroke('white');
        }
        currentX += columnWidths[i];
      });

      currentY = tableTop + headerHeight;
      let pageNumber = 1;
      const totalRAB = rabItems.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0);

      // Data rows with alternating colors
      rabItems.forEach((item, index) => {
        // Check if we need a new page
        if (currentY > 650) {
          doc.addPage();
          pageNumber++;
          currentY = drawHeader();
          
          // Redraw table header on new page
          doc.rect(40, currentY, tableWidth, headerHeight).fillAndStroke('#4a90e2', '#2c3e50');
          currentX = 40;
          headers.forEach((header, i) => {
            doc.fontSize(9).fillColor('white').font('Helvetica-Bold')
               .text(header, currentX + 3, currentY + 12, { 
                 width: columnWidths[i] - 6, 
                 align: 'center' 
               });
            if (i < headers.length - 1) {
              doc.moveTo(currentX + columnWidths[i], currentY)
                 .lineTo(currentX + columnWidths[i], currentY + headerHeight)
                 .stroke('white');
            }
            currentX += columnWidths[i];
          });
          currentY += headerHeight;
        }

        // Alternating row colors
        const rowColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
        doc.rect(40, currentY, tableWidth, rowHeight).fillAndStroke(rowColor, '#dee2e6');

        // Row data with proper formatting
        currentX = 40;
        const rowData = [
          (index + 1).toString(),
          (item.category || '').toUpperCase(),
          item.description || '',
          item.unit || '',
          parseFloat(item.quantity || 0).toLocaleString('id-ID'),
          `Rp ${parseFloat(item.unitPrice || 0).toLocaleString('id-ID')}`,
          `Rp ${parseFloat(item.totalPrice || 0).toLocaleString('id-ID')}`,
          item.isApproved ? '✓ Disetujui' : '⏳ Pending'
        ];
        
        rowData.forEach((data, i) => {
          const textAlign = i === 0 ? 'center' : (i >= 4 && i <= 6) ? 'right' : 'left';
          const textColor = i === 7 ? (item.isApproved ? '#28a745' : '#ffc107') : '#2c3e50';
          const fontSize = i === 2 ? 8 : 9; // Smaller font for description
          
          doc.fontSize(fontSize).fillColor(textColor).font('Helvetica')
             .text(data, currentX + 3, currentY + 8, { 
               width: columnWidths[i] - 6,
               align: textAlign
             });
          
          // Vertical separator lines
          if (i < columnWidths.length - 1) {
            doc.moveTo(currentX + columnWidths[i], currentY)
               .lineTo(currentX + columnWidths[i], currentY + rowHeight)
               .stroke('#dee2e6');
          }
          currentX += columnWidths[i];
        });
        
        currentY += rowHeight;
      });

      // Total row with emphasis
      doc.rect(40, currentY, tableWidth, 40).fillAndStroke('#e3f2fd', '#1976d2');
      currentX = 40;
      const totalRowData = ['', '', 'TOTAL RENCANA ANGGARAN BIAYA', '', '', '', `Rp ${totalRAB.toLocaleString('id-ID')}`, ''];
      
      totalRowData.forEach((data, i) => {
        const textAlign = i === 2 ? 'center' : i === 6 ? 'right' : 'left';
        const fontWeight = i === 2 || i === 6 ? 'Helvetica-Bold' : 'Helvetica';
        
        doc.fontSize(11).fillColor('#1976d2').font(fontWeight)
           .text(data, currentX + 3, currentY + 14, { 
             width: columnWidths[i] - 6,
             align: textAlign
           });
        currentX += columnWidths[i];
      });
      
      currentY += 60;

      // Summary section with better layout
      doc.rect(40, currentY, 250, 120).fillAndStroke('#f8f9fa', '#dee2e6');
      doc.fontSize(12).fillColor('#2c3e50').font('Helvetica-Bold')
         .text('RINGKASAN ANGGARAN', 50, currentY + 15);
      
      const summaryData = [
        { label: 'Total Item:', value: `${rabItems.length} item` },
        { label: 'Total Nilai:', value: `Rp ${totalRAB.toLocaleString('id-ID')}` },
        { label: 'Item Disetujui:', value: `${rabItems.filter(item => item.isApproved).length} item` },
        { label: 'Item Pending:', value: `${rabItems.filter(item => !item.isApproved).length} item` }
      ];
      
      doc.fontSize(10).font('Helvetica');
      summaryData.forEach((item, i) => {
        const yPos = currentY + 35 + (i * 18);
        doc.fillColor('#495057').text(item.label, 55, yPos);
        doc.fillColor('#2c3e50').font('Helvetica-Bold').text(item.value, 150, yPos);
        doc.font('Helvetica');
      });

      // Approval section
      doc.rect(310, currentY, 260, 120).fillAndStroke('#fff3cd', '#ffc107');
      doc.fontSize(12).fillColor('#856404').font('Helvetica-Bold')
         .text('PERSETUJUAN', 320, currentY + 15);
      
      const approvalBoxes = [
        { title: 'Disiapkan Oleh:', name: 'Tim Estimasi', date: dateStr },
        { title: 'Diperiksa Oleh:', name: '_______________', date: '___________' },
        { title: 'Disetujui Oleh:', name: '_______________', date: '___________' }
      ];
      
      doc.fontSize(9).fillColor('#495057').font('Helvetica');
      approvalBoxes.forEach((box, i) => {
        const yPos = currentY + 35 + (i * 25);
        doc.text(box.title, 320, yPos);
        doc.text(box.name, 320, yPos + 8);
        doc.text(`Tanggal: ${box.date}`, 320, yPos + 16);
      });

      // Calculate total pages and add footers
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        drawFooter(i + 1, pageCount);
      }
      
      // Finalize the PDF
      doc.end();
    } else {
      // Return JSON format
      res.json({
        success: true,
        data: rabItems,
        summary: {
          totalItems: rabItems.length,
          totalValue: rabItems.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0),
          approvedItems: rabItems.filter(item => item.isApproved).length
        }
      });
    }
  } catch (error) {
    console.error('Error exporting RAB:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export RAB',
      details: error.message
    });
  }
});

// ========== PROJECT MILESTONES ENDPOINTS ==========

// @route   GET /api/projects/:id/milestones
// @desc    Get all milestones for a project
// @access  Private
router.get('/:id/milestones', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const milestones = await ProjectMilestone.findAll({
      where: { projectId: id },
      order: [['targetDate', 'ASC']]
    });

    res.json({
      success: true,
      data: milestones
    });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch milestones',
      details: error.message
    });
  }
});

// @route   POST /api/projects/:id/milestones
// @desc    Create new milestone for a project
// @access  Private
router.post('/:id/milestones', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, targetDate, assignedTo, priority, createdBy } = req.body;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    if (!title || !targetDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, targetDate'
      });
    }

    const milestone = await ProjectMilestone.create({
      projectId: id,
      title,
      description,
      targetDate,
      assignedTo,
      priority: priority || 'medium',
      createdBy
    });

    res.status(201).json({
      success: true,
      data: milestone,
      message: 'Milestone created successfully'
    });
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create milestone',
      details: error.message
    });
  }
});

// @route   PUT /api/projects/:id/milestones/:milestoneId
// @desc    Update milestone
// @access  Private
router.put('/:id/milestones/:milestoneId', async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const updateData = { ...req.body };

    const milestone = await ProjectMilestone.findOne({
      where: { id: milestoneId, projectId: id }
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    await milestone.update(updateData);

    res.json({
      success: true,
      data: milestone,
      message: 'Milestone updated successfully'
    });
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update milestone',
      details: error.message
    });
  }
});

// @route   DELETE /api/projects/:id/milestones/:milestoneId
// @desc    Delete milestone
// @access  Private
router.delete('/:id/milestones/:milestoneId', async (req, res) => {
  try {
    const { id, milestoneId } = req.params;

    const milestone = await ProjectMilestone.findOne({
      where: { id: milestoneId, projectId: id }
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    await milestone.destroy();

    res.json({
      success: true,
      message: 'Milestone deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete milestone',
      details: error.message
    });
  }
});

// ========== PROJECT TEAM MEMBERS ENDPOINTS ==========

// @route   GET /api/projects/:id/team
// @desc    Get all team members for a project
// @access  Private
router.get('/:id/team', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const teamMembers = await ProjectTeamMember.findAll({
      where: { projectId: id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: teamMembers
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch team members',
      details: error.message
    });
  }
});

// @route   POST /api/projects/:id/team
// @desc    Add team member to project
// @access  Private
router.post('/:id/team', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, employeeId, department, skills, responsibilities, allocation, hourlyRate, startDate, endDate, contact, createdBy } = req.body;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    if (!name || !role) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, role'
      });
    }

    const teamMember = await ProjectTeamMember.create({
      projectId: id,
      employeeId,
      name,
      role,
      department,
      skills,
      responsibilities,
      allocation,
      hourlyRate,
      startDate,
      endDate,
      contact,
      createdBy
    });

    res.status(201).json({
      success: true,
      data: teamMember,
      message: 'Team member added successfully'
    });
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add team member',
      details: error.message
    });
  }
});

// @route   PUT /api/projects/:id/team/:memberId
// @desc    Update team member
// @access  Private
router.put('/:id/team/:memberId', async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const updateData = { ...req.body };

    const teamMember = await ProjectTeamMember.findOne({
      where: { id: memberId, projectId: id }
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    await teamMember.update(updateData);

    res.json({
      success: true,
      data: teamMember,
      message: 'Team member updated successfully'
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update team member',
      details: error.message
    });
  }
});

// @route   DELETE /api/projects/:id/team/:memberId
// @desc    Remove team member from project
// @access  Private
router.delete('/:id/team/:memberId', async (req, res) => {
  try {
    const { id, memberId } = req.params;

    const teamMember = await ProjectTeamMember.findOne({
      where: { id: memberId, projectId: id }
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    await teamMember.destroy();

    res.json({
      success: true,
      message: 'Team member removed successfully'
    });
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove team member',
      details: error.message
    });
  }
});

// ========== PROJECT DOCUMENTS ENDPOINTS ==========

// @route   GET /api/projects/:id/documents
// @desc    Get all documents for a project
// @access  Private
router.get('/:id/documents', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const documents = await ProjectDocument.findAll({
      where: { projectId: id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch documents',
      details: error.message
    });
  }
});

// @route   POST /api/projects/:id/documents
// @desc    Add document to project with file upload
// @access  Private
router.post('/:id/documents', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, accessLevel, tags, isPublic, projectId } = req.body;

    console.log('=== DOCUMENT UPLOAD DEBUG ===');
    console.log('Project ID:', id);
    console.log('Request body:', req.body);
    console.log('File info:', req.file ? {
      originalname: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    } : 'No file');
    console.log('=============================');

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      console.error('Project not found:', id);
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Validate required fields
    if (!title) {
      console.error('Missing title field');
      return res.status(400).json({
        success: false,
        error: 'Missing required field: title'
      });
    }

    // Parse tags if it's a string
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = [];
      }
    }

    // Map frontend categories to valid database enum types
    const categoryToTypeMapping = {
      'contract': 'contract',
      'design': 'drawing',  
      'permit': 'other',
      'report': 'report',
      'certificate': 'other',
      'specification': 'specification',
      'other': 'other'
    };
    
    const validType = categoryToTypeMapping[category] || 'other';

    // Create document record
    const document = await ProjectDocument.create({
      projectId: id,
      title: title,
      description: description || '',
      type: validType,
      category: category || 'other',
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      version: '1.0',
      tags: JSON.stringify(parsedTags),
      accessLevel: accessLevel || 'team',
      isPublic: isPublic === 'true' || isPublic === true,
      uploadedBy: 'current_user', // Should get from auth context
      status: 'draft',
      downloadCount: 0
    });

    res.status(201).json({
      success: true,
      data: document,
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to upload document',
      details: error.message
    });
  }
});

// @route   PUT /api/projects/:id/documents/:documentId
// @desc    Update document
// @access  Private
router.put('/:id/documents/:documentId', async (req, res) => {
  try {
    const { id, documentId } = req.params;
    const updateData = { ...req.body };

    const document = await ProjectDocument.findOne({
      where: { id: documentId, projectId: id }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    await document.update(updateData);

    res.json({
      success: true,
      data: document,
      message: 'Document updated successfully'
    });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update document',
      details: error.message
    });
  }
});

// @route   GET /api/projects/:id/documents/:documentId/download
// @desc    Download document file
// @access  Private
router.get('/:id/documents/:documentId/download', async (req, res) => {
  try {
    const { id, documentId } = req.params;

    const document = await ProjectDocument.findOne({
      where: { id: documentId, projectId: id }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    // Check if file exists
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found on server'
      });
    }

    // Increment download count
    await document.update({ 
      downloadCount: document.downloadCount + 1,
      lastAccessed: new Date()
    });

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Length', document.fileSize);

    // Stream the file
    const fileStream = fs.createReadStream(document.filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download document',
      details: error.message
    });
  }
});

// @route   DELETE /api/projects/:id/documents/:documentId
// @desc    Delete document
// @access  Private
router.delete('/:id/documents/:documentId', async (req, res) => {
  try {
    const { id, documentId } = req.params;

    const document = await ProjectDocument.findOne({
      where: { id: documentId, projectId: id }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    // Delete the physical file
    if (document.filePath && fs.existsSync(document.filePath)) {
      try {
        fs.unlinkSync(document.filePath);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete from database
    await document.destroy();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete document',
      details: error.message
    });
  }
});

module.exports = router;
