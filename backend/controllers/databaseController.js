const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

// Administrative connection (to postgres database)
const adminPool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: 'postgres',
  user: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  max: 5,
});

// User database connection (for table counting)
const userPool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'nusantara_construction',
  user: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  max: 5,
});

// Get database status and information
exports.getDatabaseStatus = async (req, res) => {
  try {
    const adminResult = await adminPool.query('SELECT NOW()');
    const userResult = await userPool.query('SELECT NOW()');
    
    const tableCountResult = await userPool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    const sizeResult = await adminPool.query(`
      SELECT pg_size_pretty(pg_database_size($1)) as size
    `, [process.env.DB_NAME || 'nusantara_construction']);
    
    // Get PostgreSQL version
    const versionResult = await adminPool.query('SELECT version()');
    
    res.json({
      success: true,
      data: {
        status: 'connected',
        currentDatabase: process.env.DB_NAME || 'nusantara_construction',
        tableCount: parseInt(tableCountResult.rows[0].count),
        databaseSize: sizeResult.rows[0].size,
        version: versionResult.rows[0].version,
        host: process.env.DB_HOST || 'postgres',
        adminConnection: adminResult.rows[0].now,
        userConnection: userResult.rows[0].now,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Database status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get database status',
      error: error.message
    });
  }
};

// List all databases
exports.listDatabases = async (req, res) => {
  try {
    const result = await adminPool.query(`
      SELECT 
        datname as name,
        pg_size_pretty(pg_database_size(datname)) as size,
        datistemplate,
        datallowconn
      FROM pg_database 
      WHERE datistemplate = false 
      AND datname NOT IN ('postgres', 'template0', 'template1')
      ORDER BY datname
    `);
    
    // Get table count for each database
    const databasesWithTableCount = await Promise.all(
      result.rows.map(async (db) => {
        try {
          const tableCountPool = new Pool({
            host: process.env.DB_HOST || 'postgres',
            port: process.env.DB_PORT || 5432,
            database: db.name,
            user: process.env.DB_USERNAME || 'admin',
            password: process.env.DB_PASSWORD || 'admin123',
            max: 1,
          });
          
          const tableCountResult = await tableCountPool.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
          `);
          
          await tableCountPool.end();
          
          return {
            ...db,
            tableCount: parseInt(tableCountResult.rows[0].count)
          };
        } catch (error) {
          console.error(`Error getting table count for ${db.name}:`, error);
          return {
            ...db,
            tableCount: 0
          };
        }
      })
    );
    
    res.json({
      success: true,
      data: databasesWithTableCount
    });
  } catch (error) {
    console.error('List databases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list databases',
      error: error.message
    });
  }
};

// Create new database
exports.createDatabase = async (req, res) => {
  try {
    const { databaseName, copyStructure = true } = req.body;
    
    if (!databaseName) {
      return res.status(400).json({
        success: false,
        message: 'Database name is required'
      });
    }
    
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(databaseName)) {
      return res.status(400).json({
        success: false,
        message: 'Database name must start with a letter and contain only letters, numbers, and underscores'
      });
    }
    
    const dbExists = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [databaseName]
    );
    
    if (dbExists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Database '${databaseName}' already exists`
      });
    }
    
    // Create the database
    await adminPool.query(`CREATE DATABASE "${databaseName}"`);
    
    // If copyStructure is true, copy table structure from main database
    if (copyStructure) {
      const sourceDb = process.env.DB_NAME || 'nusantara_construction';
      
      try {
        // Simple approach: Create database with template (copy entire structure and data, then truncate)
        await adminPool.query(`DROP DATABASE IF EXISTS "${databaseName}"`);
        await adminPool.query(`CREATE DATABASE "${databaseName}" WITH TEMPLATE "${sourceDb}"`);
        
        // Connect to the new database and truncate all tables to keep structure only
        const newDbPool = new Pool({
          host: process.env.DB_HOST || 'postgres',
          port: process.env.DB_PORT || 5432,
          database: databaseName,
          user: process.env.DB_USERNAME || 'admin',
          password: process.env.DB_PASSWORD || 'admin123',
          max: 1,
        });
        
        // Get all table names
        const tablesResult = await newDbPool.query(`
          SELECT tablename 
          FROM pg_tables 
          WHERE schemaname = 'public'
        `);
        
        // Truncate all tables
        for (const table of tablesResult.rows) {
          await newDbPool.query(`TRUNCATE TABLE "${table.tablename}" CASCADE`);
        }
        
        await newDbPool.end();
        
        res.json({
          success: true,
          message: `Database '${databaseName}' created successfully with table structure from '${sourceDb}' (${tablesResult.rows.length} tables, data cleared for demo purposes)`
        });
      } catch (templateError) {
        console.error('Template copy failed, falling back to empty database:', templateError);
        // Fallback: just create empty database
        res.json({
          success: true,
          message: `Database '${databaseName}' created successfully (empty - structure copy failed: ${templateError.message})`
        });
      }
    } else {
      res.json({
        success: true,
        message: `Empty database '${databaseName}' created successfully`
      });
    }
  } catch (error) {
    console.error('Create database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create database',
      error: error.message
    });
  }
};

// Drop database
exports.dropDatabase = async (req, res) => {
  try {
    const { databaseName } = req.body;
    
    if (!databaseName) {
      return res.status(400).json({
        success: false,
        message: 'Database name is required'
      });
    }
    
    const systemDbs = ['postgres', 'template0', 'template1'];
    if (systemDbs.includes(databaseName)) {
      return res.status(403).json({
        success: false,
        message: 'Cannot drop system database'
      });
    }
    
    const dbExists = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [databaseName]
    );
    
    if (dbExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Database '${databaseName}' does not exist`
      });
    }
    
    await adminPool.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1 AND pid <> pg_backend_pid()
    `, [databaseName]);
    
    await adminPool.query(`DROP DATABASE "${databaseName}"`);
    
    res.json({
      success: true,
      message: `Database '${databaseName}' dropped successfully`
    });
  } catch (error) {
    console.error('Drop database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to drop database',
      error: error.message
    });
  }
};

// Backup database
exports.backupDatabase = async (req, res) => {
  try {
    const { databaseName } = req.body;
    
    if (!databaseName) {
      return res.status(400).json({
        success: false,
        message: 'Database name is required'
      });
    }
    
    const dbExists = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [databaseName]
    );
    
    if (dbExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Database '${databaseName}' does not exist`
      });
    }
    
    // Create backup using database template approach
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDbName = `${databaseName}_backup_${timestamp}`;
    
    try {
      // Create backup database as a copy
      await adminPool.query(`CREATE DATABASE "${backupDbName}" WITH TEMPLATE "${databaseName}"`);
      
      // Get database size for reporting
      const sizeResult = await adminPool.query(`
        SELECT pg_size_pretty(pg_database_size($1)) as size
      `, [backupDbName]);
      
      res.json({
        success: true,
        message: `Database '${databaseName}' backed up successfully`,
        data: {
          backupDatabaseName: backupDbName,
          originalDatabase: databaseName,
          backupSize: sizeResult.rows[0].size,
          timestamp: new Date().toISOString(),
          note: 'Backup created as separate database. Use database management to switch or restore.'
        }
      });
    } catch (backupError) {
      // Fallback: Create backup info file
      const backupDir = path.join(process.cwd(), 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      const backupInfoFile = `${databaseName}_info_${timestamp}.json`;
      const backupInfoPath = path.join(backupDir, backupInfoFile);
      
      // Get basic database info
      const sizeResult = await adminPool.query(`
        SELECT pg_size_pretty(pg_database_size($1)) as size
      `, [databaseName]);
      
      const backupInfo = {
        databaseName,
        timestamp: new Date().toISOString(),
        size: sizeResult.rows[0].size,
        method: 'info_backup',
        note: 'Database information backup. For full backup, use external tools.'
      };
      
      fs.writeFileSync(backupInfoPath, JSON.stringify(backupInfo, null, 2));
      
      res.json({
        success: true,
        message: `Database info backup created for '${databaseName}'`,
        data: {
          fileName: backupInfoFile,
          filePath: backupInfoPath,
          fileSize: '1 KB',
          timestamp: new Date().toISOString(),
          note: 'Info backup only. For full backup, consider using external pg_dump tools.'
        }
      });
    }
  } catch (error) {
    console.error('Backup database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to backup database',
      error: error.message
    });
  }
};

// Restore database
exports.restoreDatabase = async (req, res) => {
  try {
    const { databaseName, backupSource } = req.body;
    
    if (!databaseName || !backupSource) {
      return res.status(400).json({
        success: false,
        message: 'Database name and backup source are required'
      });
    }
    
    // Check if target database exists
    const dbExists = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [databaseName]
    );
    
    if (dbExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Target database '${databaseName}' does not exist`
      });
    }
    
    // Check if backup source database exists
    const backupExists = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [backupSource]
    );
    
    if (backupExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Backup database '${backupSource}' not found`
      });
    }
    
    try {
      // Drop and recreate target database from backup
      await adminPool.query(`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = $1 AND pid <> pg_backend_pid()
      `, [databaseName]);
      
      await adminPool.query(`DROP DATABASE "${databaseName}"`);
      await adminPool.query(`CREATE DATABASE "${databaseName}" WITH TEMPLATE "${backupSource}"`);
      
      res.json({
        success: true,
        message: `Database '${databaseName}' restored successfully from backup '${backupSource}'`
      });
    } catch (restoreError) {
      // If restore fails, try to recreate empty database
      try {
        await adminPool.query(`CREATE DATABASE "${databaseName}"`);
        res.status(500).json({
          success: false,
          message: `Restore failed, but empty database '${databaseName}' was recreated`,
          error: restoreError.message
        });
      } catch (recreateError) {
        res.status(500).json({
          success: false,
          message: 'Restore failed and could not recreate database',
          error: restoreError.message
        });
      }
    }
  } catch (error) {
    console.error('Restore database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore database',
      error: error.message
    });
  }
};

// Switch active database
exports.switchDatabase = async (req, res) => {
  try {
    const { databaseName } = req.body;
    
    if (!databaseName) {
      return res.status(400).json({
        success: false,
        message: 'Database name is required'
      });
    }
    
    const dbExists = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1 AND datistemplate = false',
      [databaseName]
    );
    
    if (dbExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Database '${databaseName}' does not exist`
      });
    }
    
    const testPool = new Pool({
      host: process.env.DB_HOST || 'postgres',
      port: process.env.DB_PORT || 5432,
      database: databaseName,
      user: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD || 'admin123',
      max: 1,
    });
    
    try {
      await testPool.query('SELECT 1');
      await testPool.end();
      
      res.json({
        success: true,
        message: `Successfully tested connection to database '${databaseName}'`,
        data: {
          currentDatabase: process.env.DB_NAME || 'nusantara_construction',
          testedDatabase: databaseName,
          note: 'Database connection verified. To switch permanently, update environment variables and restart application.'
        }
      });
    } catch (testError) {
      await testPool.end();
      throw new Error(`Cannot connect to database '${databaseName}': ${testError.message}`);
    }
    
  } catch (error) {
    console.error('Switch database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test database connection',
      error: error.message
    });
  }
};

// Execute custom database query
exports.executeQuery = async (req, res) => {
  try {
    const { query, params = [] } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    // Execute query using user pool (current database)
    const result = await userPool.query(query, params);
    
    res.json({
      success: true,
      message: 'Query executed successfully',
      data: result.rows,
      rowCount: result.rowCount
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute query',
      error: error.message
    });
  }
};
