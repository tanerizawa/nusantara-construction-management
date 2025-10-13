const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * File Upload Configuration for Evidence Files
 * Supports: Payment evidence, Invoice delivery evidence
 */

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../uploads');
const evidenceDir = path.join(uploadDir, 'evidence');
const invoiceDir = path.join(uploadDir, 'invoices');

[uploadDir, evidenceDir, invoiceDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on fieldname
    let dest = evidenceDir;
    
    if (file.fieldname === 'payment_evidence') {
      dest = path.join(evidenceDir, 'payments');
    } else if (file.fieldname === 'delivery_evidence') {
      dest = path.join(evidenceDir, 'deliveries');
    }
    
    // Ensure subdirectory exists
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: type_date_random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const type = file.fieldname === 'payment_evidence' ? 'PAYMENT' : 'DELIVERY';
    const filename = `${type}_${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

// File filter - only accept images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and PDF files are allowed!'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

/**
 * Middleware for uploading payment evidence
 */
const uploadPaymentEvidence = upload.single('payment_evidence');

/**
 * Middleware for uploading delivery evidence
 */
const uploadDeliveryEvidence = upload.single('delivery_evidence');

/**
 * Get file URL from file path
 */
const getFileUrl = (filePath) => {
  if (!filePath) return null;
  // Return relative URL for frontend
  return filePath.replace(/\\/g, '/').replace(/^.*uploads/, '/uploads');
};

/**
 * Delete file by path
 */
const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

module.exports = {
  uploadPaymentEvidence,
  uploadDeliveryEvidence,
  getFileUrl,
  deleteFile
};
