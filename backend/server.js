const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('./config/database');
const { models } = require('./models');

// Set timezone to WIB (Asia/Jakarta)
process.env.TZ = 'Asia/Jakarta';

// Environment configuration
const environment = process.env.NODE_ENV || 'development';
const envFile = environment === 'production' ? '.env.production' : '.env.development';

if (fs.existsSync(envFile)) {
  require('dotenv').config({ path: envFile });
} else {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Logging setup
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Error logging function
const logError = (error, req = null) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ERROR: ${error.message}\n${error.stack}\n`;
  
  if (req) {
    console.error(`Request: ${req.method} ${req.url}`, logMessage);
  } else {
    console.error(logMessage);
  }
  
  // Log to file in production
  if (isProduction && process.env.LOG_FILE) {
    fs.appendFileSync(process.env.LOG_FILE, logMessage);
  }
};

// Security middleware with production configuration
// Temporarily disabled for CORS debugging
/*
app.use(helmet({
  contentSecurityPolicy: isProduction ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  } : false,
  hsts: isProduction ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false
}));
*/

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: isProduction ? 6 : 1
}));

// Rate limiting with environment-based configuration
const limiter = rateLimit({
  windowMs: parseInt(process.env.API_RATE_WINDOW) || 15 * 60 * 1000, // 15 minutes default
  max: parseInt(process.env.API_RATE_LIMIT) || (isProduction ? 100 : 10000), // Much higher limit for development
  message: { 
    error: 'Terlalu banyak request, coba lagi nanti',
    retryAfter: Math.ceil((parseInt(process.env.API_RATE_WINDOW) || 900000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and in development mode
    if (!isProduction) return true; // Skip all rate limiting in development
    return req.path === '/health' || req.path === '/api/health';
  }
});
app.use(limiter);

// CORS configuration with environment-based origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allowed origins
    const allowedOrigins = [
      'https://nusantaragroup.co',
      'https://www.nusantaragroup.co',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];
    
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (!isProduction) return callback(null, true);
    
    // In production, check against allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked request from origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-auth-token', 
    'x-api-key', 
    'Accept',
    'Origin',
    'X-Requested-With'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Debug CORS
console.log('🔧 CORS Configuration:', { isProduction, corsOptions });

app.use(cors(corsOptions));

// Additional explicit OPTIONS handling for problematic routes
app.options('*', cors(corsOptions));

// Debug middleware untuk melihat request
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'no-origin'}`);
  console.log(`🔧 Headers: ${JSON.stringify(req.headers, null, 2)}`);
  next();
});

// Request parsing with security limits
app.use(express.json({ 
  limit: process.env.MAX_FILE_SIZE ? `${process.env.MAX_FILE_SIZE}b` : '10mb',
  verify: (req, res, buf, encoding) => {
    // Basic JSON validation
    try {
      JSON.parse(buf);
    } catch (err) {
      const error = new Error('Invalid JSON');
      error.status = 400;
      throw error;
    }
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.MAX_FILE_SIZE ? `${process.env.MAX_FILE_SIZE}b` : '10mb'
}));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging with environment configuration
const logFormat = isProduction 
  ? 'combined' 
  : (process.env.DEBUG_MODE === 'true' ? 'dev' : 'common');

app.use(morgan(logFormat, {
  skip: (req, res) => {
    // Skip logging for health checks in production
    return isProduction && (req.path === '/health' || req.path === '/api/health');
  }
}));

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  next();
});

// Static files with security
app.use('/uploads', express.static('uploads', {
  maxAge: isProduction ? parseInt(process.env.STATIC_CACHE_TTL) || 86400000 : 0,
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Security headers for static files
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Only allow specific file types
    const allowedExtensions = (process.env.ALLOWED_EXTENSIONS || 'pdf,doc,docx,xls,xlsx,jpg,jpeg,png,zip').split(',');
    const fileExtension = path.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      res.status(403).end();
      return;
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.API_VERSION || 'v1'
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'API healthy',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1'
  });
});

// API Routes with error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Route middleware with logging
app.use('/api', (req, res, next) => {
  req.startTime = Date.now();
  next();
});

// Auth & Users API - Modular Routes (Phase 2B Complete - 12 endpoints)
// Consolidates: auth.js (194 lines), users.js (349 lines), users_db.js (349 lines duplicate)
// Result: 4 modules (912 lines), eliminated 350 lines of duplication
// Backup: auth.js.backup, users.js.backup available if needed
app.use('/api/auth', require('./routes/auth'));

// Stats API - Public statistics for landing page
app.use('/api/stats', require('./routes/stats'));

// Projects API - Modular Routes (Phase 1 Complete - 54 endpoints)
app.use('/api/projects', require('./routes/projects/index'));

// Subsidiaries API - Updated for COA Integration
// OLD: app.use('/api/subsidiaries', require('./routes/subsidiaries/index')); // Modular routes (Phase 5)
app.use('/api/subsidiaries', require('./routes/subsidiaries')); // COA-integrated subsidiary management
app.use('/api/manpower', require('./routes/manpower'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/tax', require('./routes/tax'));
app.use('/api/coa', require('./routes/coa'));
app.use('/api/chart-of-accounts', require('./routes/coa')); // Alias for backward compatibility
app.use('/api/entities', require('./routes/entities'));
app.use('/api/journal-entries', require('./routes/journalEntries'));

// Financial Reports API - Modular Routes (Phase 3A - 9/44 endpoints implemented)
// Phase 3A modules: Financial Statements (5), Tax Reports (4)
// Phase 3B pending: Project Analytics, Fixed Assets, Executive, Budget, Cost Center, Compliance
app.use('/api/reports', require('./routes/financial-reports'));

// Financial Dashboard API - Real-time integration (Revenue from invoices, Expenses from milestone costs)
app.use('/api/financial/dashboard', require('./routes/financial/dashboard.routes'));

// app.use('/api/users', require('./routes/users')); // DEPRECATED: Now handled by /api/auth/users
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/approval', require('./routes/approval'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/database', require('./routes/database'));
app.use('/api/rab-tracking', require('./routes/rabPurchaseTracking'));
app.use('/api/rab-view', require('./routes/rab-view')); // Real-time RAB with availability
console.log('Loading purchase-orders route...');
app.use('/api/purchase-orders', require('./routes/purchaseOrders'));
console.log('Purchase-orders route loaded successfully');
console.log('Loading work-orders route...');
app.use('/api/work-orders', require('./routes/workOrders'));
console.log('Work-orders route loaded successfully');

// Root endpoint for health check
app.get('/', (req, res) => {
  res.json({
    message: 'Nusantara YK Construction API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      projects: '/api/projects',
      dashboard: '/api/dashboard'
    }
  });
});

// API health check
app.get('/api', (req, res) => {
  res.json({
    message: 'API is running',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  logError(error, req);
  
  // Don't expose internal errors in production
  const isDevelopment = !isProduction;
  
  const errorResponse = {
    error: error.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(isDevelopment && {
      stack: error.stack,
      details: error
    })
  };
  
  const statusCode = error.status || error.statusCode || 500;
  res.status(statusCode).json(errorResponse);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  // Close database connection first
  if (sequelize) {
    sequelize.close().then(() => {
      console.log('💾 Database connection closed');
      process.exit(0);
    }).catch((error) => {
      console.error('❌ Error closing database:', error);
      process.exit(1);
    });
  } else {
    process.exit(0);
  }
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server with database initialization
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Sync database models (create tables if they don't exist)
    // Note: Using alter: false to avoid conflicts with database views
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false }); // Changed to false to prevent view conflicts
      console.log('🔄 Database models synchronized (no alter)');
    } else {
      await sequelize.sync();
      console.log('🔒 Database models verified');
    }

    startServerWithDatabase();

  } catch (error) {
    console.error('⚠️  Database connection failed:', error.message);
    console.log('🔄 Starting server in fallback mode (using JSON files)...');
    startServerFallback();
  }
};

const startServerWithDatabase = () => {
  // Start the server
  const server = app.listen(PORT, () => {
    console.log(`
🚀 Nusantara Group SaaS Server Running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Server: http://localhost:${PORT}
🌍 Environment: ${environment}
📊 Health Check: http://localhost:${PORT}/health
🔒 Security: ${isProduction ? 'PRODUCTION MODE' : 'DEVELOPMENT MODE'}
📦 API Version: ${process.env.API_VERSION || 'v1'}
💾 Database: PostgreSQL Connected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
    
    if (isProduction) {
      console.log('✅ Production configuration loaded');
      console.log('🔐 Security hardening enabled');
      console.log('📊 Performance monitoring active');
      console.log('🛡️ Error logging configured');
    } else {
      console.log('🔧 Development mode active');
      console.log('📝 Debug logging enabled');
      console.log('🔥 Hot reload ready');
    }
  });

  // Error handling for server
  server.on('error', onError);
};

const startServerFallback = () => {
  // Start the server without database
  const server = app.listen(PORT, () => {
    console.log(`
🚀 Nusantara Group SaaS Server Running (FALLBACK MODE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Server: http://localhost:${PORT}
🌍 Environment: ${environment}
📊 Health Check: http://localhost:${PORT}/health
🔒 Security: ${isProduction ? 'PRODUCTION MODE' : 'DEVELOPMENT MODE'}
📦 API Version: ${process.env.API_VERSION || 'v1'}
💾 Database: JSON Files (Fallback)
⚠️  Note: Database unavailable, using JSON file storage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
    
    console.log('⚠️  Running in fallback mode - some features may be limited');
    console.log('🔧 To enable full functionality, start PostgreSQL and restart server');
  });

  // Error handling for server
  server.on('error', onError);
};

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Initialize server
startServer();

// Process event handlers for graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  logError(error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  logError(new Error(`Unhandled Rejection: ${reason}`));
  process.exit(1);
});

module.exports = app;
