const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required()
      .messages({
        'string.alphanum': 'Username hanya boleh mengandung huruf dan angka',
        'string.min': 'Username minimal 3 karakter',
        'string.max': 'Username maksimal 30 karakter',
        'any.required': 'Username wajib diisi'
      }),
    
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Format email tidak valid',
        'any.required': 'Email wajib diisi'
      }),
    
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
      .required()
      .messages({
        'string.min': 'Password minimal 8 karakter',
        'string.pattern.base': 'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol',
        'any.required': 'Password wajib diisi'
      }),
    
    fullName: Joi.string().min(2).max(100).required()
      .messages({
        'string.min': 'Nama lengkap minimal 2 karakter',
        'string.max': 'Nama lengkap maksimal 100 karakter',
        'any.required': 'Nama lengkap wajib diisi'
      }),
    
    role: Joi.string().valid('admin', 'manager', 'user').default('user'),
    
    phone: Joi.string().pattern(/^[0-9+\-\s]+$/).min(10).max(20)
      .messages({
        'string.pattern.base': 'Nomor telepon tidak valid',
        'string.min': 'Nomor telepon minimal 10 digit',
        'string.max': 'Nomor telepon maksimal 20 digit'
      }),
    
    department: Joi.string().max(50)
  }),

  login: Joi.object({
    username: Joi.string().required()
      .messages({
        'any.required': 'Username wajib diisi'
      }),
    
    password: Joi.string().required()
      .messages({
        'any.required': 'Password wajib diisi'
      })
  }),

  updateProfile: Joi.object({
    fullName: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9+\-\s]+$/).min(10).max(20),
    department: Joi.string().max(50)
  })
};

// Project validation schemas
const projectSchemas = {
  create: Joi.object({
    name: Joi.string().min(3).max(200).required()
      .messages({
        'string.min': 'Nama proyek minimal 3 karakter',
        'string.max': 'Nama proyek maksimal 200 karakter',
        'any.required': 'Nama proyek wajib diisi'
      }),
    
    description: Joi.string().max(1000)
      .messages({
        'string.max': 'Deskripsi maksimal 1000 karakter'
      }),
    
    client: Joi.string().min(2).max(100).required()
      .messages({
        'string.min': 'Nama klien minimal 2 karakter',
        'string.max': 'Nama klien maksimal 100 karakter',
        'any.required': 'Nama klien wajib diisi'
      }),
    
    budget: Joi.number().positive().required()
      .messages({
        'number.positive': 'Budget harus bernilai positif',
        'any.required': 'Budget wajib diisi'
      }),
    
    startDate: Joi.date().iso().required()
      .messages({
        'date.iso': 'Format tanggal mulai tidak valid',
        'any.required': 'Tanggal mulai wajib diisi'
      }),
    
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required()
      .messages({
        'date.iso': 'Format tanggal selesai tidak valid',
        'date.greater': 'Tanggal selesai harus setelah tanggal mulai',
        'any.required': 'Tanggal selesai wajib diisi'
      }),
    
    status: Joi.string().valid('planning', 'active', 'completed', 'cancelled').default('planning'),
    
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    
    location: Joi.string().max(200)
      .messages({
        'string.max': 'Lokasi maksimal 200 karakter'
      }),
    
    managerId: Joi.number().integer().positive()
      .messages({
        'number.positive': 'Manager ID harus bernilai positif'
      })
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(200),
    description: Joi.string().max(1000),
    client: Joi.string().min(2).max(100),
    budget: Joi.number().positive(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    status: Joi.string().valid('planning', 'active', 'completed', 'cancelled'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    location: Joi.string().max(200),
    managerId: Joi.number().integer().positive(),
    progress: Joi.number().min(0).max(100)
  })
};

// Finance validation schemas
const financeSchemas = {
  create: Joi.object({
    type: Joi.string().valid('income', 'expense').required()
      .messages({
        'any.only': 'Tipe transaksi harus income atau expense',
        'any.required': 'Tipe transaksi wajib diisi'
      }),
    
    amount: Joi.number().positive().required()
      .messages({
        'number.positive': 'Jumlah harus bernilai positif',
        'any.required': 'Jumlah wajib diisi'
      }),
    
    description: Joi.string().min(3).max(500).required()
      .messages({
        'string.min': 'Deskripsi minimal 3 karakter',
        'string.max': 'Deskripsi maksimal 500 karakter',
        'any.required': 'Deskripsi wajib diisi'
      }),
    
    category: Joi.string().max(100).required()
      .messages({
        'string.max': 'Kategori maksimal 100 karakter',
        'any.required': 'Kategori wajib diisi'
      }),
    
    date: Joi.date().iso().required()
      .messages({
        'date.iso': 'Format tanggal tidak valid',
        'any.required': 'Tanggal wajib diisi'
      }),
    
    projectId: Joi.number().integer().positive()
      .messages({
        'number.positive': 'Project ID harus bernilai positif'
      }),
    
    reference: Joi.string().max(100)
      .messages({
        'string.max': 'Referensi maksimal 100 karakter'
      })
  })
};

// Inventory validation schemas
const inventorySchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(200).required()
      .messages({
        'string.min': 'Nama item minimal 2 karakter',
        'string.max': 'Nama item maksimal 200 karakter',
        'any.required': 'Nama item wajib diisi'
      }),
    
    category: Joi.string().max(100).required()
      .messages({
        'string.max': 'Kategori maksimal 100 karakter',
        'any.required': 'Kategori wajib diisi'
      }),
    
    quantity: Joi.number().integer().min(0).required()
      .messages({
        'number.min': 'Quantity tidak boleh negatif',
        'any.required': 'Quantity wajib diisi'
      }),
    
    unit: Joi.string().max(50).required()
      .messages({
        'string.max': 'Unit maksimal 50 karakter',
        'any.required': 'Unit wajib diisi'
      }),
    
    price: Joi.number().positive().required()
      .messages({
        'number.positive': 'Harga harus bernilai positif',
        'any.required': 'Harga wajib diisi'
      }),
    
    supplier: Joi.string().max(200)
      .messages({
        'string.max': 'Supplier maksimal 200 karakter'
      }),
    
    minStock: Joi.number().integer().min(0).default(0)
      .messages({
        'number.min': 'Minimum stock tidak boleh negatif'
      }),
    
    description: Joi.string().max(500)
      .messages({
        'string.max': 'Deskripsi maksimal 500 karakter'
      })
  })
};

// Manpower validation schemas
const manpowerSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required()
      .messages({
        'string.min': 'Nama minimal 2 karakter',
        'string.max': 'Nama maksimal 100 karakter',
        'any.required': 'Nama wajib diisi'
      }),
    
    position: Joi.string().max(100).required()
      .messages({
        'string.max': 'Posisi maksimal 100 karakter',
        'any.required': 'Posisi wajib diisi'
      }),
    
    email: Joi.string().email()
      .messages({
        'string.email': 'Format email tidak valid'
      }),
    
    phone: Joi.string().pattern(/^[0-9+\-\s]+$/).min(10).max(20)
      .messages({
        'string.pattern.base': 'Nomor telepon tidak valid',
        'string.min': 'Nomor telepon minimal 10 digit',
        'string.max': 'Nomor telepon maksimal 20 digit'
      }),
    
    salary: Joi.number().positive()
      .messages({
        'number.positive': 'Gaji harus bernilai positif'
      }),
    
    hireDate: Joi.date().iso().max('now')
      .messages({
        'date.iso': 'Format tanggal tidak valid',
        'date.max': 'Tanggal tidak boleh di masa depan'
      }),
    
    status: Joi.string().valid('active', 'inactive', 'terminated').default('active'),
    
    department: Joi.string().max(100)
      .messages({
        'string.max': 'Departemen maksimal 100 karakter'
      })
  })
};

// Common validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errorDetails,
        timestamp: new Date().toISOString()
      });
    }

    req.validatedBody = value;
    next();
  };
};

// File upload validation
const validateFileUpload = (allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return next();
    }

    const files = req.files || [req.file];
    const errors = [];

    files.forEach((file, index) => {
      // Check file type
      if (allowedTypes.length > 0) {
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
          errors.push(`File ${index + 1}: Tipe file tidak diizinkan. Allowed: ${allowedTypes.join(', ')}`);
        }
      }

      // Check file size
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        errors.push(`File ${index + 1}: Ukuran file terlalu besar. Maksimal: ${maxSizeMB}MB`);
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'File validation failed',
        details: errors,
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

module.exports = {
  userSchemas,
  projectSchemas,
  financeSchemas,
  inventorySchemas,
  manpowerSchemas,
  validate,
  validateFileUpload
};
