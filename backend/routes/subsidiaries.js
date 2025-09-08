const express = require('express');
const Joi = require('joi');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Subsidiary = require('../models/Subsidiary');
const Project = require('../models/Project'); // Add Project model

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/subsidiaries');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow only specific file types
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents allowed.'));
    }
  }
});

// Enhanced validation schema for subsidiary creation - ONLY ESSENTIAL FIELDS REQUIRED
const subsidiarySchema = Joi.object({
  // REQUIRED FIELDS - Only absolute essentials
  name: Joi.string().min(1).max(255).trim().required(),
  code: Joi.string().min(2).max(10).trim().uppercase().required(),
  
  // OPTIONAL FIELDS - Everything else can be empty/null
  description: Joi.string().allow('', null).max(1000).optional(),
  specialization: Joi.string().valid(
    'residential', 'commercial', 'industrial', 
    'infrastructure', 'renovation', 'interior', 
    'landscaping', 'general'
  ).default('general').optional(),
  
  // Contact info - all optional
  contactInfo: Joi.object({
    phone: Joi.string().allow('', null).optional(),
    email: Joi.string().email().allow('', null).optional(),
    fax: Joi.string().allow('', null).optional()
  }).default({}).optional(),
  
  // Address - all optional
  address: Joi.object({
    street: Joi.string().allow('', null).optional(),
    city: Joi.string().allow('', null).optional(),
    state: Joi.string().allow('', null).optional(),
    country: Joi.string().allow('', null).default('Indonesia').optional(),
    postalCode: Joi.string().allow('', null).optional()
  }).default({}).optional(),
  
  // Company details - all optional
  establishedYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).allow(null).optional(),
  employeeCount: Joi.number().integer().min(0).allow(null).optional(),
  certification: Joi.array().items(Joi.string()).default([]).optional(),
  status: Joi.string().valid('active', 'inactive').default('active').optional(),
  parentCompany: Joi.string().allow('', null).default('NUSANTARA GROUP').optional(),
  
  // Professional fields - all completely optional
  boardOfDirectors: Joi.array().items(Joi.object({
    name: Joi.string().allow('', null).optional(),
    position: Joi.string().allow('', null).optional(),
    email: Joi.string().email().allow('', null).optional(),
    phone: Joi.string().allow('', null).optional(),
    appointmentDate: Joi.date().allow(null).optional(),
    isActive: Joi.boolean().default(true).optional()
  })).default([]).optional(),
  
  legalInfo: Joi.object({
    companyRegistrationNumber: Joi.string().allow('', null).optional(),
    taxIdentificationNumber: Joi.string().allow('', null).optional(),
    businessLicenseNumber: Joi.string().allow('', null).optional(),
    articlesOfIncorporation: Joi.string().allow('', null).optional(),
    vatRegistrationNumber: Joi.string().allow('', null).optional()
  }).default({}).optional(),
  
  permits: Joi.array().items(Joi.object({
    name: Joi.string().allow('', null).optional(),
    number: Joi.string().allow('', null).optional(),
    issuedBy: Joi.string().allow('', null).optional(),
    issuedDate: Joi.date().allow(null).optional(),
    expiryDate: Joi.date().allow(null).optional(),
    status: Joi.string().valid('active', 'expired', 'pending').default('active').optional()
  })).default([]).optional(),
  
  financialInfo: Joi.object({
    authorizedCapital: Joi.number().min(0).allow(null).optional(),
    paidUpCapital: Joi.number().min(0).allow(null).optional(),
    currency: Joi.string().default('IDR').optional(),
    fiscalYearEnd: Joi.string().allow('', null).optional()
  }).default({}).optional(),
  
  profileInfo: Joi.object({
    website: Joi.string().uri().allow('', null).optional(),
    socialMedia: Joi.object().default({}).optional(),
    companySize: Joi.string().valid('small', 'medium', 'large', '').allow('', null).optional(),
    industryClassification: Joi.string().allow('', null).optional(),
    businessDescription: Joi.string().allow('', null).optional()
  }).default({}).optional(),
  
  attachments: Joi.array().default([]).optional()
}).options({ 
  stripUnknown: true,
  abortEarly: false // Show all validation errors at once
});

// Enhanced validation schema for subsidiary updates - MAXIMUM FLEXIBILITY
const subsidiaryUpdateSchema = Joi.object({
  // Basic fields - only name and code validation when provided
  name: Joi.string().min(1).max(255).trim().optional(),
  code: Joi.string().min(2).max(10).trim().uppercase().optional(),
  description: Joi.string().allow('', null).max(1000).optional(),
  specialization: Joi.string().valid(
    'residential', 'commercial', 'industrial', 
    'infrastructure', 'renovation', 'interior', 
    'landscaping', 'general'
  ).optional(),
  
  // Contact info - completely flexible
  contactInfo: Joi.object({
    phone: Joi.string().allow('', null).optional(),
    email: Joi.string().email().allow('', null).optional(),
    fax: Joi.string().allow('', null).optional()
  }).optional(),
  
  // Address - completely flexible  
  address: Joi.object({
    street: Joi.string().allow('', null).optional(),
    city: Joi.string().allow('', null).optional(),
    state: Joi.string().allow('', null).optional(),
    country: Joi.string().allow('', null).optional(),
    postalCode: Joi.string().allow('', null).optional()
  }).optional(),
  
  // Company details - all optional with proper validation when provided
  establishedYear: Joi.alternatives().try(
    Joi.number().integer().min(1900).max(new Date().getFullYear()),
    Joi.string().allow('', null),
    Joi.allow(null)
  ).optional(),
  employeeCount: Joi.alternatives().try(
    Joi.number().integer().min(0),
    Joi.string().allow('', null),
    Joi.allow(null)
  ).optional(),
  certification: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
  parentCompany: Joi.string().allow('', null).optional(),
  
  // Professional fields - no required sub-fields
  boardOfDirectors: Joi.array().items(Joi.object({
    name: Joi.string().allow('', null).optional(),
    position: Joi.string().allow('', null).optional(),
    email: Joi.string().email().allow('', null).optional(),
    phone: Joi.string().allow('', null).optional(),
    appointmentDate: Joi.date().allow(null).optional(),
    isActive: Joi.boolean().optional()
  })).optional(),
  
  legalInfo: Joi.object({
    companyRegistrationNumber: Joi.string().allow('', null).optional(),
    taxIdentificationNumber: Joi.string().allow('', null).optional(),
    businessLicenseNumber: Joi.string().allow('', null).optional(),
    articlesOfIncorporation: Joi.string().allow('', null).optional(),
    vatRegistrationNumber: Joi.string().allow('', null).optional()
  }).optional(),
  
  permits: Joi.array().items(Joi.object({
    name: Joi.string().allow('', null).optional(),
    number: Joi.string().allow('', null).optional(),
    issuedBy: Joi.string().allow('', null).optional(),
    issuedDate: Joi.date().allow(null).optional(),
    expiryDate: Joi.date().allow(null).optional(),
    status: Joi.string().valid('active', 'expired', 'pending').optional()
  })).optional(),
  
  financialInfo: Joi.object({
    authorizedCapital: Joi.alternatives().try(
      Joi.number().min(0),
      Joi.string().allow('', null),
      Joi.allow(null)
    ).optional(),
    paidUpCapital: Joi.alternatives().try(
      Joi.number().min(0),
      Joi.string().allow('', null),
      Joi.allow(null)
    ).optional(),
    currency: Joi.string().allow('', null).optional(),
    fiscalYearEnd: Joi.string().allow('', null).optional()
  }).optional(),
  
  profileInfo: Joi.object({
    website: Joi.string().uri().allow('', null).optional(),
    socialMedia: Joi.object().optional(),
    companySize: Joi.string().valid('small', 'medium', 'large', '').allow('', null).optional(),
    industryClassification: Joi.string().allow('', null).optional(),
    businessDescription: Joi.string().allow('', null).optional()
  }).optional(),
  
  attachments: Joi.array().optional()
}).options({ 
  stripUnknown: true,
  abortEarly: false,
  allowUnknown: false // Still strict about unknown fields for security
});

// @route   GET /api/subsidiaries
// @desc    Get all subsidiaries with filters
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      q,
      specialization,
      status,
      sort = 'name',
      order = 'asc',
      limit = 50,
      page = 1
    } = req.query;

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));
    const offset = (pageNum - 1) * limitNum;

    // Build where clause for filtering
    const whereClause = {};
    
    if (specialization) {
      whereClause.specialization = specialization;
    }
    
    if (status) {
      whereClause.status = status;
    }

    // Text search
    if (q) {
      const needle = String(q).toLowerCase();
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${needle}%` } },
        { code: { [Op.iLike]: `%${needle}%` } },
        { description: { [Op.iLike]: `%${needle}%` } }
      ];
    }

    // Build order clause
    const validSortFields = ['name', 'code', 'specialization', 'status', 'establishedYear', 'employeeCount'];
    const sortField = validSortFields.includes(sort) ? sort : 'name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // Get subsidiaries from database
    const { count, rows: subsidiaries } = await Subsidiary.findAndCountAll({
      where: whereClause,
      order: [[sortField, sortOrder]],
      limit: limitNum,
      offset: offset
    });

    res.json({
      success: true,
      data: subsidiaries,
      pagination: {
        current: pageNum,
        total: Math.ceil(count / limitNum),
        count: count,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching subsidiaries:', error);
    
    // No fallback data - system must use database only
    res.status(500).json({
      success: false,
      message: 'Server error while fetching subsidiaries',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/subsidiaries/:id
// @desc    Get single subsidiary by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const subsidiary = await Subsidiary.findByPk(req.params.id);
    
    if (!subsidiary) {
      return res.status(404).json({
        success: false,
        message: 'Subsidiary not found'
      });
    }

    res.json({
      success: true,
      data: subsidiary
    });
  } catch (error) {
    console.error('Error fetching subsidiary:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching subsidiary',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/subsidiaries/stats/overview
// @desc    Get subsidiaries statistics with real project counts  
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    // Get total subsidiaries count
    const totalSubsidiaries = await Subsidiary.count();
    
    // Get active subsidiaries count
    const activeSubsidiaries = await Subsidiary.count({
      where: { status: 'active' }
    });
    
    // Get total projects count - fallback to 0 if Project model not available
    let totalProjects = 0;
    let activeProjects = 0;
    
    try {
      if (Project) {
        totalProjects = await Project.count();
        activeProjects = await Project.count({
          where: { status: 'active' }
        });
      }
    } catch (projectError) {
      console.warn('Project model not available, using fallback values');
    }

    res.json({
      success: true,
      data: {
        totalSubsidiaries,
        activeSubsidiaries,
        inactiveSubsidiaries: totalSubsidiaries - activeSubsidiaries,
        totalProjects,
        activeProjects
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/subsidiaries/:id
// @desc    Create new subsidiary
// @access  Private
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = subsidiarySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Generate ID if not provided
    if (!value.id) {
      const lastSubsidiary = await Subsidiary.findOne({
        order: [['createdAt', 'DESC']]
      });
      
      let newNumber = 1;
      if (lastSubsidiary) {
        const lastNumber = parseInt(lastSubsidiary.id.replace('SUB', ''));
        newNumber = lastNumber + 1;
      }
      
      value.id = `SUB${String(newNumber).padStart(3, '0')}`;
    }

    const subsidiary = await Subsidiary.create(value);

    res.status(201).json({
      success: true,
      data: subsidiary,
      message: 'Subsidiary created successfully'
    });
  } catch (error) {
    console.error('Error creating subsidiary:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Subsidiary code already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating subsidiary',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/subsidiaries/:id
// @desc    Update subsidiary
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const subsidiary = await Subsidiary.findByPk(req.params.id);
    
    if (!subsidiary) {
      return res.status(404).json({
        success: false,
        message: 'Subsidiary not found'
      });
    }

    console.log('🔍 UPDATE REQUEST for ID:', req.params.id);
    console.log('📝 Request body keys:', Object.keys(req.body));
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));

    // Validate request body
    const { error, value } = subsidiaryUpdateSchema.validate(req.body);
    if (error) {
      console.log('❌ Validation error:', error.details);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))
      });
    }

    console.log('✅ Validation passed, updating with:', Object.keys(value));

    // Remove id from update data
    delete value.id;

    const updatedSubsidiary = await subsidiary.update(value);

    console.log('✅ Update successful for:', updatedSubsidiary.name);

    res.json({
      success: true,
      data: updatedSubsidiary,
      message: 'Subsidiary updated successfully'
    });
  } catch (error) {
    console.error('💥 Error updating subsidiary:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating subsidiary',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/subsidiaries/:id
// @desc    Delete subsidiary (soft delete)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const subsidiary = await Subsidiary.findByPk(req.params.id);
    
    if (!subsidiary) {
      return res.status(404).json({
        success: false,
        message: 'Subsidiary not found'
      });
    }

    await subsidiary.destroy(); // Soft delete due to paranoid: true

    res.json({
      success: true,
      message: 'Subsidiary deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subsidiary:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting subsidiary',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/subsidiaries/stats/overview
// @desc    Get subsidiary statistics
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Subsidiary.findAll({
      attributes: [
        'specialization',
        [sequelize.fn('count', sequelize.col('id')), 'count']
      ],
      group: ['specialization'],
      raw: true
    });

    const totalCount = await Subsidiary.count();
    const activeCount = await Subsidiary.count({ where: { status: 'active' } });

    res.json({
      success: true,
      data: {
        total: totalCount,
        active: activeCount,
        bySpecialization: stats
      }
    });
  } catch (error) {
    console.error('Error fetching subsidiary stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Clear and seed NUSANTARA GROUP subsidiaries
router.post('/seed-nusantara', async (req, res) => {
  try {
    console.log('🗑️  Clearing existing subsidiaries...');
    
    // Clear existing subsidiaries
    const deletedCount = await Subsidiary.destroy({
      where: {},
      force: true
    });
    
    console.log(`✅ Cleared ${deletedCount} existing subsidiaries`);
    
    // Seed NUSANTARA GROUP subsidiaries
    const subsidiaries = [
      {
        id: 'NU001',
        code: 'CUE14',
        name: 'CV. CAHAYA UTAMA EMPATBELAS',
        specialization: 'commercial',
        description: 'Spesialis pembangunan komersial dan perkantoran modern',
        contactInfo: {
          phone: '+62-21-555-1401',
          email: 'info@cahayautama14.co.id'
        },
        address: {
          street: 'Jl. Raya Utama No. 14',
          city: 'Jakarta',
          country: 'Indonesia'
        },
        establishedYear: 2010,
        employeeCount: 45,
        certification: ['ISO 9001:2015', 'SBU Grade 6'],
        status: 'active',
        parentCompany: 'NUSANTARA GROUP'
      },
      {
        id: 'NU002',
        code: 'BSR',
        name: 'CV. BINTANG SURAYA',
        specialization: 'residential',
        description: 'Ahli konstruksi perumahan dan komplek residensial',
        contactInfo: {
          phone: '+62-21-555-1402',
          email: 'info@bintangsuraya.co.id'
        },
        address: {
          street: 'Jl. Bintang Suraya No. 88',
          city: 'Jakarta',
          country: 'Indonesia'
        },
        establishedYear: 2012,
        employeeCount: 38,
        certification: ['ISO 9001:2015', 'SBU Grade 5'],
        status: 'active',
        parentCompany: 'NUSANTARA GROUP'
      },
      {
        id: 'NU003',
        code: 'LTS',
        name: 'CV. LATANSA',
        specialization: 'infrastructure',
        description: 'Kontraktor infrastruktur jalan, jembatan, dan fasilitas umum',
        contactInfo: {
          phone: '+62-21-555-1403',
          email: 'info@latansa.co.id'
        },
        address: {
          street: 'Jl. Infrastruktur Raya No. 25',
          city: 'Jakarta',
          country: 'Indonesia'
        },
        establishedYear: 2008,
        employeeCount: 52,
        certification: ['ISO 9001:2015', 'SBU Grade 7', 'CSMS Certificate'],
        status: 'active',
        parentCompany: 'NUSANTARA GROUP'
      },
      {
        id: 'NU004',
        code: 'GBN',
        name: 'CV. GRAHA BANGUN NUSANTARA',
        specialization: 'commercial',
        description: 'Spesialis pembangunan gedung bertingkat dan mall',
        contactInfo: {
          phone: '+62-21-555-1404',
          email: 'info@grahabangun.co.id'
        },
        address: {
          street: 'Jl. Graha Bangun No. 77',
          city: 'Jakarta',
          country: 'Indonesia'
        },
        establishedYear: 2015,
        employeeCount: 42,
        certification: ['ISO 9001:2015', 'SBU Grade 6', 'Green Building Council'],
        status: 'active',
        parentCompany: 'NUSANTARA GROUP'
      },
      {
        id: 'NU005',
        code: 'SSR',
        name: 'CV. SAHABAT SINAR RAYA',
        specialization: 'renovation',
        description: 'Ahli renovasi, retrofit, dan pemeliharaan bangunan',
        contactInfo: {
          phone: '+62-21-555-1405',
          email: 'info@sahabatsinar.co.id'
        },
        address: {
          street: 'Jl. Sahabat Sinar No. 99',
          city: 'Jakarta',
          country: 'Indonesia'
        },
        establishedYear: 2018,
        employeeCount: 35,
        certification: ['ISO 9001:2015', 'SBU Grade 5'],
        status: 'active',
        parentCompany: 'NUSANTARA GROUP'
      },
      {
        id: 'NU006',
        code: 'PJK',
        name: 'PT. PUTRA JAYA KONSTRUKSI',
        specialization: 'industrial',
        description: 'Kontraktor industri, pabrik, dan fasilitas khusus',
        contactInfo: {
          phone: '+62-21-555-1406',
          email: 'info@putrajaya.co.id'
        },
        address: {
          street: 'Jl. Putra Jaya Industrial No. 123',
          city: 'Jakarta',
          country: 'Indonesia'
        },
        establishedYear: 2005,
        employeeCount: 68,
        certification: ['ISO 9001:2015', 'SBU Grade 8', 'OHSAS 18001', 'ISO 14001'],
        status: 'active',
        parentCompany: 'NUSANTARA GROUP'
      }
    ];
    
    console.log('🌱 Seeding NUSANTARA GROUP subsidiaries...');
    
    const createdSubsidiaries = [];
    for (const subsidiaryData of subsidiaries) {
      const subsidiary = await Subsidiary.create(subsidiaryData);
      createdSubsidiaries.push(subsidiary);
      console.log(`✅ Created: ${subsidiary.name} (${subsidiary.code})`);
    }
    
    res.json({
      success: true,
      message: `Successfully seeded ${createdSubsidiaries.length} NUSANTARA GROUP subsidiaries`,
      data: createdSubsidiaries,
      cleared: deletedCount
    });
    
  } catch (error) {
    console.error('❌ Error seeding subsidiaries:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding NUSANTARA GROUP subsidiaries',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/subsidiaries/:id/upload
// @desc    Upload files for a subsidiary
// @access  Private
router.post('/:id/upload', upload.array('files', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const { category = 'general' } = req.body;

    const subsidiary = await Subsidiary.findByPk(id);
    if (!subsidiary) {
      return res.status(404).json({
        success: false,
        message: 'Subsidiary not found'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Process uploaded files
    const uploadedFiles = req.files.map(file => ({
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      category: category,
      uploadedAt: new Date(),
      uploadedBy: req.user?.id || 'system'
    }));

    // Update subsidiary attachments
    const currentAttachments = subsidiary.attachments || [];
    const updatedAttachments = [...currentAttachments, ...uploadedFiles];

    await subsidiary.update({
      attachments: updatedAttachments
    });

    res.json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      data: {
        files: uploadedFiles,
        totalAttachments: updatedAttachments.length
      }
    });

  } catch (error) {
    console.error('❌ Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading files',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/subsidiaries/:id/attachments/:attachmentId
// @desc    Delete a specific attachment
// @access  Private
router.delete('/:id/attachments/:attachmentId', async (req, res) => {
  try {
    const { id, attachmentId } = req.params;

    const subsidiary = await Subsidiary.findByPk(id);
    if (!subsidiary) {
      return res.status(404).json({
        success: false,
        message: 'Subsidiary not found'
      });
    }

    const attachments = subsidiary.attachments || [];
    const attachmentIndex = attachments.findIndex(att => att.id === attachmentId);

    if (attachmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    const attachment = attachments[attachmentIndex];

    // Delete physical file
    try {
      if (fs.existsSync(attachment.path)) {
        fs.unlinkSync(attachment.path);
      }
    } catch (fileError) {
      console.warn('Warning: Could not delete physical file:', fileError.message);
    }

    // Remove from attachments array
    const updatedAttachments = attachments.filter(att => att.id !== attachmentId);

    await subsidiary.update({
      attachments: updatedAttachments
    });

    res.json({
      success: true,
      message: 'Attachment deleted successfully',
      data: {
        deletedAttachment: attachment,
        remainingAttachments: updatedAttachments.length
      }
    });

  } catch (error) {
    console.error('❌ Error deleting attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting attachment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/subsidiaries/:id/attachments/:attachmentId/download
// @desc    Download a specific attachment
// @access  Private
router.get('/:id/attachments/:attachmentId/download', async (req, res) => {
  try {
    const { id, attachmentId } = req.params;

    const subsidiary = await Subsidiary.findByPk(id);
    if (!subsidiary) {
      return res.status(404).json({
        success: false,
        message: 'Subsidiary not found'
      });
    }

    const attachments = subsidiary.attachments || [];
    const attachment = attachments.find(att => att.id === attachmentId);

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    if (!fs.existsSync(attachment.path)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    res.download(attachment.path, attachment.originalName);

  } catch (error) {
    console.error('❌ Error downloading attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading attachment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
