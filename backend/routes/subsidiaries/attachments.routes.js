/**
 * Subsidiaries Module - Attachments Routes
 * Handles: File Upload, Download, Delete
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Subsidiary = require('../../models/Subsidiary');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/subsidiaries');
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
