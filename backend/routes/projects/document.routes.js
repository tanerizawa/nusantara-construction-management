/**
 * Projects Module - Documents Routes
 * Handles: Document CRUD operations with file upload
 * Lines: ~380 (extracted from 3,031 line monolith)
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');
const ProjectDocument = require('../../models/ProjectDocument');
const Project = require('../../models/Project');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../uploads/projects');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `project-doc-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types
    const allowedTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|jpg|jpeg|png|dwg|dxf|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, DOC, XLS, PPT, TXT, Images, CAD, Archives'));
    }
  }
});

// Validation schema for document metadata
const documentSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  category: Joi.string().valid('contract', 'design', 'permit', 'report', 'certificate', 'specification', 'other').default('other'),
  type: Joi.string().valid('contract', 'drawing', 'specification', 'report', 'certificate', 'other').default('other'),
  version: Joi.string().default('1.0'),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
  accessLevel: Joi.string().valid('public', 'team', 'restricted').default('team'),
  isPublic: Joi.boolean().default(false),
  status: Joi.string().valid('draft', 'review', 'approved', 'archived').default('draft')
});

/**
 * @route   GET /api/projects/:id/documents
 * @desc    Get all documents for a project
 * @access  Private
 */
router.get('/:id/documents', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, type, status, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Build where clause
    const where = { projectId: id };
    if (category) where.category = category;
    if (type) where.type = type;
    if (status) where.status = status;

    const documents = await ProjectDocument.findAll({
      where,
      order: [[sortBy, sortOrder]]
    });

    // Calculate statistics
    const stats = {
      total: documents.length,
      totalSize: documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0),
      byCategory: documents.reduce((acc, doc) => {
        acc[doc.category] = (acc[doc.category] || 0) + 1;
        return acc;
      }, {}),
      byType: documents.reduce((acc, doc) => {
        acc[doc.type] = (acc[doc.type] || 0) + 1;
        return acc;
      }, {}),
      byStatus: documents.reduce((acc, doc) => {
        acc[doc.status] = (acc[doc.status] || 0) + 1;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: documents,
      stats
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

/**
 * @route   GET /api/projects/:id/documents/:documentId
 * @desc    Get single document details
 * @access  Private
 */
router.get('/:id/documents/:documentId', async (req, res) => {
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

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch document',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/documents
 * @desc    Upload document to project
 * @access  Private
 */
router.post('/:id/documents', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, type, accessLevel, tags, isPublic, status } = req.body;

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

    // Validate metadata
    const { error, value } = documentSchema.validate({
      title,
      description,
      category,
      type,
      accessLevel,
      tags,
      isPublic: isPublic === 'true' || isPublic === true,
      status
    });

    if (error) {
      // Clean up uploaded file on validation error
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    // Parse tags if it's a string
    let parsedTags = [];
    if (value.tags) {
      try {
        parsedTags = typeof value.tags === 'string' ? JSON.parse(value.tags) : value.tags;
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
      'certificate': 'certificate',
      'specification': 'specification',
      'other': 'other'
    };

    const validType = categoryToTypeMapping[value.category] || value.type || 'other';

    // Create document record
    const document = await ProjectDocument.create({
      projectId: id,
      title: value.title,
      description: value.description || '',
      type: validType,
      category: value.category || 'other',
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      version: value.version || '1.0',
      tags: JSON.stringify(parsedTags),
      accessLevel: value.accessLevel || 'team',
      isPublic: value.isPublic,
      uploadedBy: req.body.uploadedBy || 'system',
      status: value.status || 'draft',
      downloadCount: 0
    });

    console.log('✅ Document uploaded successfully:', document.id);

    res.status(201).json({
      success: true,
      data: document,
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    console.error('❌ Error uploading document:', error);

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

/**
 * @route   PUT /api/projects/:id/documents/:documentId
 * @desc    Update document metadata
 * @access  Private
 */
router.put('/:id/documents/:documentId', async (req, res) => {
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

    // Validate metadata
    const { error, value } = documentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    // Parse tags if provided
    let parsedTags = document.tags;
    if (value.tags) {
      try {
        parsedTags = typeof value.tags === 'string' ? value.tags : JSON.stringify(value.tags);
      } catch (e) {
        parsedTags = document.tags;
      }
    }

    await document.update({
      ...value,
      tags: parsedTags,
      updatedBy: req.body.updatedBy
    });

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

/**
 * @route   GET /api/projects/:id/documents/:documentId/download
 * @desc    Download document file
 * @access  Private
 */
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
    await document.increment('downloadCount');

    // Send file
    res.download(document.filePath, document.originalName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({
          success: false,
          error: 'Failed to download file',
          details: err.message
        });
      }
    });
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download document',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:id/documents/:documentId
 * @desc    Delete document
 * @access  Private
 */
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

    // Delete physical file
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
      console.log(`✅ Deleted file: ${document.filePath}`);
    }

    // Delete database record
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
