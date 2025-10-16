/**
 * Subsidiaries Module - Basic CRUD Routes
 * Handles: List, Get by ID, Create, Update, Delete
 */

const express = require('express');
const Joi = require('joi');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const Subsidiary = require('../../models/Subsidiary');
const { upload } = require('../../config/multer');

const router = express.Router();

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
    status: Joi.string().valid('valid', 'expired', 'pending').default('valid').optional()
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
    status: Joi.string().valid('valid', 'expired', 'pending').optional()
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

// @route   POST /api/subsidiaries
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

    // Validate request body
    const { error, value } = subsidiaryUpdateSchema.validate(req.body);
    if (error) {
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

    // Remove id from update data
    delete value.id;

    const updatedSubsidiary = await subsidiary.update(value);

    res.json({
      success: true,
      data: updatedSubsidiary,
      message: 'Subsidiary updated successfully'
    });
  } catch (error) {
    console.error('Error updating subsidiary:', error);
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

// @route   POST /api/subsidiaries/:id/logo
// @desc    Upload subsidiary logo
// @access  Private
router.post('/:id/logo', upload.single('logo'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Find subsidiary
    const subsidiary = await Subsidiary.findByPk(id);
    if (!subsidiary) {
      // Delete uploaded file if subsidiary not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Subsidiary not found'
      });
    }

    // Delete old logo file if exists
    if (subsidiary.logo) {
      const oldLogoPath = path.join(__dirname, '../../uploads', subsidiary.logo);
      if (fs.existsSync(oldLogoPath)) {
        try {
          fs.unlinkSync(oldLogoPath);
        } catch (err) {
          console.error('Error deleting old logo:', err);
        }
      }
    }

    // Update subsidiary with new logo path (relative path)
    const logoPath = `subsidiaries/logos/${req.file.filename}`;
    await subsidiary.update({ logo: logoPath });

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        logo: logoPath,
        filename: req.file.filename,
        size: req.file.size,
        url: `/uploads/${logoPath}`
      }
    });
  } catch (error) {
    // Delete uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Error uploading logo:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading logo',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/subsidiaries/:id/logo
// @desc    Delete subsidiary logo
// @access  Private
router.delete('/:id/logo', async (req, res) => {
  try {
    const { id } = req.params;

    // Find subsidiary
    const subsidiary = await Subsidiary.findByPk(id);
    if (!subsidiary) {
      return res.status(404).json({
        success: false,
        message: 'Subsidiary not found'
      });
    }

    if (!subsidiary.logo) {
      return res.status(404).json({
        success: false,
        message: 'No logo to delete'
      });
    }

    // Delete logo file
    const logoPath = path.join(__dirname, '../../uploads', subsidiary.logo);
    if (fs.existsSync(logoPath)) {
      try {
        fs.unlinkSync(logoPath);
      } catch (err) {
        console.error('Error deleting logo file:', err);
      }
    }

    // Update subsidiary (remove logo)
    await subsidiary.update({ logo: null });

    res.json({
      success: true,
      message: 'Logo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting logo:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting logo',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});


module.exports = router;
