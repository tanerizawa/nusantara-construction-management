/**
 * Milestone Detail Routes
 * Handles photos, costs, and activities for milestones
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../../config/database');
const MilestonePhoto = require('../../models/MilestonePhoto');
const MilestoneCost = require('../../models/MilestoneCost');
const MilestoneActivity = require('../../models/MilestoneActivity');
const { generateThumbnail, deleteThumbnail } = require('../../utils/thumbnailGenerator');
const { generatePhotoTitle } = require('../../utils/photoTitleGenerator');

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/milestones');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// ============================================
// PHOTOS ENDPOINTS
// ============================================

/**
 * @route   GET /api/projects/:projectId/milestones/:milestoneId/photos
 * @desc    Get all photos for a milestone
 * @access  Private
 */
router.get('/:projectId/milestones/:milestoneId/photos', async (req, res) => {
  console.log('📥 [GET /photos] Fetching photos...');
  try {
    const { milestoneId } = req.params;
    const { type, limit, offset } = req.query;
    
    console.log('📥 [GET /photos] Params:', { milestoneId, type, limit, offset });

    // Build where clause
    const where = { milestone_id: milestoneId };
    if (type) where.photo_type = type;

    // Build query options
    const queryOptions = {
      where,
      order: [['taken_at', 'DESC'], ['created_at', 'DESC']],
      raw: false  // ✅ Use Sequelize instances to get camelCase field names
    };

    if (limit) queryOptions.limit = parseInt(limit);
    if (offset) queryOptions.offset = parseInt(offset);

    // Get photos using Sequelize model
    const photos = await MilestonePhoto.findAll(queryOptions);
    
    console.log('📥 [GET /photos] Raw photos from DB:', photos.length);
    if (photos.length > 0) {
      const firstPhoto = photos[0].get({ plain: true });  // Convert to plain object
      console.log('📥 [GET /photos] First photo (raw):', {
        id: firstPhoto.id,
        photoUrl: firstPhoto.photoUrl,  // ✅ Should be camelCase now!
        thumbnailUrl: firstPhoto.thumbnailUrl,
        title: firstPhoto.title
      });
    }

    // Enrich with uploader names and transform to plain objects
    const enrichedPhotos = await Promise.all(
      photos.map(async (photo) => {
        // Convert Sequelize instance to plain object
        const photoData = photo.get({ plain: true });
        
        let uploaderName = null;
        
        if (photoData.uploadedBy) {
          try {
            const user = await sequelize.query(
              'SELECT name FROM users WHERE id = :userId LIMIT 1',
              { 
                replacements: { userId: photoData.uploadedBy },
                type: sequelize.QueryTypes.SELECT,
                plain: true
              }
            );
            uploaderName = user?.name || null;
          } catch (err) {
            console.log('Could not fetch uploader user:', err.message);
          }
        }

        // Return data with uploader name (already in camelCase from model!)
        return {
          ...photoData,
          uploader_name: uploaderName,
          uploaderName: uploaderName
        };
      })
    );

    console.log('📥 [GET /photos] Enriched photos:', enrichedPhotos.length);
    if (enrichedPhotos.length > 0) {
      console.log('📥 [GET /photos] First photo (enriched):', {
        id: enrichedPhotos[0].id,
        photoUrl: enrichedPhotos[0].photoUrl,
        thumbnailUrl: enrichedPhotos[0].thumbnailUrl,
        title: enrichedPhotos[0].title,
        allKeys: Object.keys(enrichedPhotos[0])
      });
    }

    res.json({
      success: true,
      data: enrichedPhotos,
      count: enrichedPhotos.length
    });
  } catch (error) {
    console.error('Error fetching milestone photos:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch photos',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/projects/:projectId/milestones/:milestoneId/photos/test-thumbnail/:filename
 * @desc    Test if thumbnail file exists and is accessible
 * @access  Public (for debugging)
 */
router.get('/:projectId/milestones/:milestoneId/photos/test-thumbnail/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const uploadsDir = path.join(__dirname, '../../../uploads/milestones');
    const thumbnailsDir = path.join(uploadsDir, 'thumbnails');
    
    const originalPath = path.join(uploadsDir, filename);
    const thumbnailPath = path.join(thumbnailsDir, filename);
    
    const [originalExists, thumbnailExists] = await Promise.all([
      fs.access(originalPath).then(() => true).catch(() => false),
      fs.access(thumbnailPath).then(() => true).catch(() => false)
    ]);
    
    const [originalStat, thumbnailStat] = await Promise.all([
      originalExists ? fs.stat(originalPath) : null,
      thumbnailExists ? fs.stat(thumbnailPath) : null
    ]);
    
    res.json({
      filename,
      original: {
        exists: originalExists,
        path: `/uploads/milestones/${filename}`,
        size: originalStat ? `${(originalStat.size / 1024).toFixed(2)} KB` : null,
        absolutePath: originalPath
      },
      thumbnail: {
        exists: thumbnailExists,
        path: `/uploads/milestones/thumbnails/${filename}`,
        size: thumbnailStat ? `${(thumbnailStat.size / 1024).toFixed(2)} KB` : null,
        absolutePath: thumbnailPath
      },
      recommendation: thumbnailExists ? 'Use thumbnail' : 'Use original (thumbnail missing)'
    });
  } catch (error) {
    console.error('Test thumbnail error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/projects/:projectId/milestones/:milestoneId/photos
 * @desc    Upload photos for a milestone with thumbnail generation
 * @access  Private
 */
router.post('/:projectId/milestones/:milestoneId/photos', upload.array('photos', 10), async (req, res) => {
  console.log('📸 [POST /photos] Starting upload...');
  try {
    const { projectId, milestoneId } = req.params;
    const { title, description, photoType, takenAt } = req.body;
    const uploadedBy = req.user?.id || null;
    
    console.log('📸 [POST /photos] Request params:', { projectId, milestoneId, photoType, title });
    console.log('📸 [POST /photos] Files received:', req.files?.length || 0);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No photos uploaded'
      });
    }

    const photos = [];
    
    for (const file of req.files) {
      console.log(`📸 [POST /photos] Processing file: ${file.filename}`);
      const photoUrl = `/uploads/milestones/${file.filename}`;
      let thumbnailUrl = null;
      
      // Generate thumbnail
      try {
        const thumbnailResult = await generateThumbnail(file.path, file.filename);
        thumbnailUrl = thumbnailResult.thumbnailUrl;
        console.log(`✅ [POST /photos] Thumbnail generated: ${thumbnailUrl}`);
      } catch (thumbError) {
        console.warn(`⚠️  [POST /photos] Thumbnail generation failed for ${file.filename}:`, thumbError.message);
        // Continue without thumbnail - will fallback to original
      }
      
      // Auto-generate title if not provided
      const currentPhotoType = photoType || 'progress';
      let autoTitle = title;
      
      if (!autoTitle || autoTitle.trim() === '') {
        try {
          autoTitle = await generatePhotoTitle(currentPhotoType, projectId, milestoneId);
          console.log(`📝 [POST /photos] Auto-generated title: ${autoTitle}`);
        } catch (titleError) {
          console.warn('⚠️  [POST /photos] Title generation failed, using filename:', titleError.message);
          autoTitle = file.originalname;
        }
      }
      
      console.log(`💾 [POST /photos] Saving to database:`, {
        photoUrl,
        thumbnailUrl,
        title: autoTitle,
        photoType: currentPhotoType
      });
      
      // Insert photo with thumbnail_url
      const [photo] = await sequelize.query(`
        INSERT INTO milestone_photos (
          milestone_id, photo_url, thumbnail_url, photo_type, title, description, 
          taken_at, uploaded_by, created_at, updated_at
        ) VALUES (
          :milestoneId, :photoUrl, :thumbnailUrl, :photoType, :title, :description,
          :takenAt, :uploadedBy, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        ) RETURNING *
      `, {
        replacements: {
          milestoneId,
          photoUrl,
          thumbnailUrl,
          photoType: currentPhotoType,
          title: autoTitle,
          description,
          takenAt: takenAt || new Date(),
          uploadedBy
        },
        type: sequelize.QueryTypes.INSERT
      });
      
      console.log(`💾 [POST /photos] Database result (raw):`, photo[0]);

      // Transform to camelCase (consistent with GET endpoint)
      const photoData = {
        id: photo[0].id,
        milestoneId: photo[0].milestone_id,
        photoUrl: photo[0].photo_url,
        thumbnailUrl: photo[0].thumbnail_url,
        photoType: photo[0].photo_type,
        title: photo[0].title,
        description: photo[0].description,
        takenAt: photo[0].taken_at,
        uploadedBy: photo[0].uploaded_by,
        createdAt: photo[0].created_at,
        updatedAt: photo[0].updated_at
      };
      
      console.log(`✅ [POST /photos] Transformed to camelCase:`, photoData);

      photos.push(photoData);

      // Log activity
      await sequelize.query(`
        INSERT INTO milestone_activities (
          milestone_id, activity_type, activity_title, activity_description,
          performed_by, performed_at, related_photo_id, created_at
        ) VALUES (
          :milestoneId, 'photo_upload', :title, :description,
          :performedBy, CURRENT_TIMESTAMP, :photoId, CURRENT_TIMESTAMP
        )
      `, {
        replacements: {
          milestoneId,
          title: `Photo uploaded: ${autoTitle}`,
          description: description || `Uploaded ${file.originalname}`,
          performedBy: uploadedBy,
          photoId: photo[0].id
        },
        type: sequelize.QueryTypes.INSERT
      });
    }

    console.log(`📦 [POST /photos] Returning response with ${photos.length} photos`);
    console.log(`📦 [POST /photos] Response data:`, JSON.stringify(photos, null, 2));

    res.status(201).json({
      success: true,
      data: photos,
      message: `${photos.length} photo(s) uploaded successfully`,
      thumbnails_generated: photos.filter(p => p.thumbnailUrl).length
    });
  } catch (error) {
    console.error('❌ [POST /photos] Error uploading photos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload photos',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:projectId/milestones/:milestoneId/photos/:photoId
 * @desc    Delete a photo
 * @access  Private
 */
router.delete('/:projectId/milestones/:milestoneId/photos/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;

    // Get photo info first
    const [photo] = await sequelize.query(`
      SELECT * FROM milestone_photos WHERE id = :photoId
    `, {
      replacements: { photoId },
      type: sequelize.QueryTypes.SELECT
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: 'Photo not found'
      });
    }

    // Delete original file from filesystem
    const filePath = path.join(__dirname, '../../', photo.photo_url);
    try {
      await fs.unlink(filePath);
      console.log(`✅ Deleted original: ${photo.photo_url}`);
    } catch (err) {
      console.warn('⚠️  Could not delete original file:', err.message);
    }

    // Delete thumbnail file
    if (photo.thumbnail_url) {
      const thumbnailPath = path.join(__dirname, '../../', photo.thumbnail_url);
      try {
        await fs.unlink(thumbnailPath);
        console.log(`✅ Deleted thumbnail: ${photo.thumbnail_url}`);
      } catch (err) {
        console.warn('⚠️  Could not delete thumbnail file:', err.message);
      }
    }

    // Delete from database
    await sequelize.query(`
      DELETE FROM milestone_photos WHERE id = :photoId
    `, {
      replacements: { photoId },
      type: sequelize.QueryTypes.DELETE
    });

    res.json({
      success: true,
      message: 'Photo and thumbnail deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete photo',
      details: error.message
    });
  }
});

// ============================================
// COSTS ENDPOINTS
// ============================================

/**
 * @route   GET /api/projects/:projectId/milestones/:milestoneId/costs
 * @desc    Get all costs for a milestone (excludes soft-deleted by default)
 * @access  Private
 */
router.get('/:projectId/milestones/:milestoneId/costs', async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { category, type, include_deleted } = req.query;

    // Build where clause - exclude soft deleted by default
    let whereClause = { 
      milestone_id: milestoneId,
      deleted_at: null  // Only get active costs
    };
    
    // Admin can include deleted costs with ?include_deleted=true
    if (include_deleted === 'true') {
      delete whereClause.deleted_at;
    }
    
    if (category) whereClause.cost_category = category;
    if (type) whereClause.cost_type = type;

    const costs = await MilestoneCost.findAll({
      where: whereClause,
      order: [['recorded_at', 'DESC']],
      raw: true
    });

    // Enrich with user names and account info
    const enrichedCosts = await Promise.all(
      costs.map(async (cost) => {
        let recordedByName = null;
        let approvedByName = null;
        let account = null;
        let sourceAccount = null;

        if (cost.recorded_by) {
          try {
            const user = await sequelize.query(
              "SELECT profile->>'fullName' as name, username FROM users WHERE id = :userId LIMIT 1",
              { 
                replacements: { userId: cost.recorded_by },
                type: sequelize.QueryTypes.SELECT,
                plain: true
              }
            );
            recordedByName = user?.name || user?.username || null;
          } catch (err) {
            console.log('Could not fetch recorded_by user:', err.message);
          }
        }

        if (cost.approved_by) {
          try {
            const user = await sequelize.query(
              "SELECT profile->>'fullName' as name, username FROM users WHERE id = :userId LIMIT 1",
              { 
                replacements: { userId: cost.approved_by },
                type: sequelize.QueryTypes.SELECT,
                plain: true
              }
            );
            approvedByName = user?.name || user?.username || null;
          } catch (err) {
            console.log('Could not fetch approved_by user:', err.message);
          }
        }

        // Fetch expense account info if accountId exists
        if (cost.account_id) {
          try {
            const accountData = await sequelize.query(
              "SELECT id, account_code, account_name, account_type FROM chart_of_accounts WHERE id = :accountId LIMIT 1",
              { 
                replacements: { accountId: cost.account_id },
                type: sequelize.QueryTypes.SELECT,
                plain: true
              }
            );
            account = accountData || null;
          } catch (err) {
            console.log('Could not fetch account:', err.message);
          }
        }

        // Fetch source account info if sourceAccountId exists (with balance)
        if (cost.source_account_id) {
          try {
            const sourceAccountData = await sequelize.query(
              `SELECT 
                id, account_code, account_name, account_type, account_sub_type,
                current_balance
              FROM chart_of_accounts 
              WHERE id = :sourceAccountId LIMIT 1`,
              { 
                replacements: { sourceAccountId: cost.source_account_id },
                type: sequelize.QueryTypes.SELECT,
                plain: true
              }
            );
            sourceAccount = sourceAccountData || null;
          } catch (err) {
            console.log('Could not fetch source account:', err.message);
          }
        }

        return {
          ...cost,
          recorded_by_name: recordedByName,
          approved_by_name: approvedByName,
          account: account,
          source_account: sourceAccount
        };
      })
    );

    res.json({
      success: true,
      data: enrichedCosts,
      count: enrichedCosts.length
    });
  } catch (error) {
    console.error('Error fetching milestone costs:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch costs',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/projects/:projectId/milestones/:milestoneId/costs/summary
 * @desc    Get cost summary and analysis
 * @access  Private
 */
router.get('/:projectId/milestones/:milestoneId/costs/summary', async (req, res) => {
  try {
    const { milestoneId } = req.params;

    // Get milestone budget
    const [milestone] = await sequelize.query(`
      SELECT budget FROM project_milestones WHERE id = :milestoneId
    `, {
      replacements: { milestoneId },
      type: sequelize.QueryTypes.SELECT
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    // Get cost summary by category (exclude soft deleted)
    const summary = await sequelize.query(`
      SELECT 
        cost_category,
        cost_type,
        SUM(amount) as total_amount,
        COUNT(*) as entry_count
      FROM milestone_costs
      WHERE milestone_id = :milestoneId
        AND deleted_at IS NULL
      GROUP BY cost_category, cost_type
      ORDER BY cost_category, cost_type
    `, {
      replacements: { milestoneId },
      type: sequelize.QueryTypes.SELECT
    });

    // Calculate totals (exclude soft deleted)
    const totals = await sequelize.query(`
      SELECT 
        SUM(CASE WHEN cost_type = 'actual' THEN amount ELSE 0 END) as actual_cost,
        SUM(CASE WHEN cost_type = 'planned' THEN amount ELSE 0 END) as planned_cost,
        SUM(CASE WHEN cost_type = 'change_order' THEN amount ELSE 0 END) as change_orders,
        SUM(CASE WHEN cost_type = 'unforeseen' THEN amount ELSE 0 END) as unforeseen,
        SUM(amount) as total_all_costs,
        COUNT(*) as total_entries
      FROM milestone_costs
      WHERE milestone_id = :milestoneId
        AND deleted_at IS NULL
    `, {
      replacements: { milestoneId },
      type: sequelize.QueryTypes.SELECT
    });

    // Get category breakdown for chart (exclude soft deleted)
    const categoryBreakdown = await sequelize.query(`
      SELECT 
        cost_category as category,
        SUM(amount) as total
      FROM milestone_costs
      WHERE milestone_id = :milestoneId
        AND deleted_at IS NULL
      GROUP BY cost_category
      ORDER BY total DESC
    `, {
      replacements: { milestoneId },
      type: sequelize.QueryTypes.SELECT
    });

    const budget = parseFloat(milestone.budget) || 0;
    const totalActual = parseFloat(totals[0]?.actual_cost) || 0;
    const totalAllCosts = parseFloat(totals[0]?.total_all_costs) || 0;
    const variance = budget - totalActual;
    const variancePercent = budget > 0 ? ((variance / budget) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        budget,
        totalActual,        // Total of 'actual' type costs
        totalAllCosts,      // Total of all cost types
        variance,
        variancePercent: parseFloat(variancePercent),
        status: variance >= 0 ? (variance > budget * 0.1 ? 'under_budget' : 'on_budget') : 'over_budget',
        breakdown: categoryBreakdown,  // For pie chart
        detailedBreakdown: summary,    // Full breakdown with types
        totals: totals[0],
        alerts: variance < 0 ? ['Cost overrun detected!'] : []
      }
    });
  } catch (error) {
    console.error('Error fetching cost summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cost summary',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:projectId/milestones/:milestoneId/costs
 * @desc    Add cost entry
 * @access  Private
 */
router.post('/:projectId/milestones/:milestoneId/costs', async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { costCategory, costType, amount, description, referenceNumber, accountId, sourceAccountId } = req.body;
    const recordedBy = req.user?.id || null;

    if (!costCategory || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Cost category and amount are required'
      });
    }

    // Validate accountId if provided (Expense account)
    if (accountId) {
      const [account] = await sequelize.query(`
        SELECT id, account_type FROM chart_of_accounts 
        WHERE id = :accountId AND is_active = true
      `, {
        replacements: { accountId },
        type: sequelize.QueryTypes.SELECT
      });

      if (!account) {
        return res.status(400).json({
          success: false,
          error: 'Invalid expense account ID'
        });
      }

      if (account.account_type !== 'EXPENSE') {
        return res.status(400).json({
          success: false,
          error: 'Account must be of type EXPENSE'
        });
      }
    }

    // Validate sourceAccountId if provided (Bank/Cash account)
    if (sourceAccountId) {
      const [sourceAccount] = await sequelize.query(`
        SELECT id, account_type, account_sub_type, current_balance, account_name 
        FROM chart_of_accounts 
        WHERE id = :sourceAccountId AND is_active = true
      `, {
        replacements: { sourceAccountId },
        type: sequelize.QueryTypes.SELECT
      });

      if (!sourceAccount) {
        return res.status(400).json({
          success: false,
          error: 'Invalid source account ID'
        });
      }

      if (sourceAccount.account_type !== 'ASSET' || sourceAccount.account_sub_type !== 'CASH_AND_BANK') {
        return res.status(400).json({
          success: false,
          error: 'Source account must be CASH_AND_BANK type'
        });
      }

      // Check if balance is sufficient
      const currentBalance = parseFloat(sourceAccount.current_balance) || 0;
      const requestedAmount = parseFloat(amount) || 0;

      if (currentBalance < requestedAmount) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient balance',
          message: `Saldo tidak cukup! Saldo ${sourceAccount.account_name}: Rp ${currentBalance.toLocaleString('id-ID')}, Dibutuhkan: Rp ${requestedAmount.toLocaleString('id-ID')}`,
          details: {
            accountName: sourceAccount.account_name,
            currentBalance: currentBalance,
            requestedAmount: requestedAmount,
            shortfall: requestedAmount - currentBalance
          }
        });
      }
    }

    const [cost] = await sequelize.query(`
      INSERT INTO milestone_costs (
        milestone_id, cost_category, cost_type, amount, description,
        reference_number, account_id, source_account_id, recorded_by, recorded_at, created_at, updated_at
      ) VALUES (
        :milestoneId, :costCategory, :costType, :amount, :description,
        :referenceNumber, :accountId, :sourceAccountId, :recordedBy, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING *
    `, {
      replacements: {
        milestoneId,
        costCategory,
        costType: costType || 'actual',
        amount,
        description,
        referenceNumber,
        accountId: accountId || null,
        sourceAccountId: sourceAccountId || null,
        recordedBy
      },
      type: sequelize.QueryTypes.INSERT
    });

    // Update source account balance (deduct the amount)
    if (sourceAccountId) {
      await sequelize.query(`
        UPDATE chart_of_accounts 
        SET current_balance = current_balance - :amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = :sourceAccountId
      `, {
        replacements: {
          amount: parseFloat(amount),
          sourceAccountId
        },
        type: sequelize.QueryTypes.UPDATE
      });

      console.log(`[MilestoneCost] Deducted ${amount} from account ${sourceAccountId}`);
    }

    // Log activity
    await sequelize.query(`
      INSERT INTO milestone_activities (
        milestone_id, activity_type, activity_title, activity_description,
        performed_by, performed_at, related_cost_id, created_at
      ) VALUES (
        :milestoneId, 'cost_added', :title, :description,
        :performedBy, CURRENT_TIMESTAMP, :costId, CURRENT_TIMESTAMP
      )
    `, {
      replacements: {
        milestoneId,
        title: `Cost added: ${costCategory}`,
        description: `Added ${costType} cost of ${amount}`,
        performedBy: recordedBy,
        costId: cost[0].id
      },
      type: sequelize.QueryTypes.INSERT
    });

    res.status(201).json({
      success: true,
      data: cost[0],
      message: 'Cost added successfully'
    });
  } catch (error) {
    console.error('Error adding cost:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add cost',
      details: error.message
    });
  }
});

/**
 * @route   PUT /api/projects/:projectId/milestones/:milestoneId/costs/:costId
 * @desc    Update cost entry
 * @access  Private
 */
router.put('/:projectId/milestones/:milestoneId/costs/:costId', async (req, res) => {
  try {
    const { costId } = req.params;
    const { amount, description, referenceNumber, costCategory, costType, accountId, sourceAccountId } = req.body;

    // Validate accountId if provided (Expense account)
    if (accountId) {
      const [account] = await sequelize.query(`
        SELECT id, account_type FROM chart_of_accounts 
        WHERE id = :accountId AND is_active = true
      `, {
        replacements: { accountId },
        type: sequelize.QueryTypes.SELECT
      });

      if (!account) {
        return res.status(400).json({
          success: false,
          error: 'Invalid expense account ID'
        });
      }

      if (account.account_type !== 'EXPENSE') {
        return res.status(400).json({
          success: false,
          error: 'Account must be of type EXPENSE'
        });
      }
    }

    // Get old cost data for balance adjustment
    const [oldCost] = await sequelize.query(`
      SELECT amount, source_account_id FROM milestone_costs WHERE id = :costId
    `, {
      replacements: { costId },
      type: sequelize.QueryTypes.SELECT
    });

    if (!oldCost) {
      return res.status(404).json({
        success: false,
        error: 'Cost entry not found'
      });
    }

    const oldAmount = parseFloat(oldCost.amount) || 0;
    const oldSourceAccountId = oldCost.source_account_id;
    const newAmount = amount !== undefined ? parseFloat(amount) : oldAmount;
    const newSourceAccountId = sourceAccountId !== undefined ? sourceAccountId : oldSourceAccountId;

    // Validate sourceAccountId if provided (Bank/Cash account)
    if (sourceAccountId) {
      const [sourceAccount] = await sequelize.query(`
        SELECT id, account_type, account_sub_type, current_balance, account_name FROM chart_of_accounts 
        WHERE id = :sourceAccountId AND is_active = true
      `, {
        replacements: { sourceAccountId },
        type: sequelize.QueryTypes.SELECT
      });

      if (!sourceAccount) {
        return res.status(400).json({
          success: false,
          error: 'Invalid source account ID'
        });
      }

      if (sourceAccount.account_type !== 'ASSET' || sourceAccount.account_sub_type !== 'CASH_AND_BANK') {
        return res.status(400).json({
          success: false,
          error: 'Source account must be CASH_AND_BANK type'
        });
      }

      // Check balance sufficiency for new amount
      // If source account changed, check new account balance
      // If amount changed, check balance for difference
      let requiredBalance = 0;
      
      if (newSourceAccountId === oldSourceAccountId) {
        // Same account, only check if amount increased
        const amountDifference = newAmount - oldAmount;
        if (amountDifference > 0) {
          requiredBalance = amountDifference;
        }
      } else {
        // Different account, check full new amount
        requiredBalance = newAmount;
      }

      if (requiredBalance > 0) {
        const currentBalance = parseFloat(sourceAccount.current_balance) || 0;
        
        if (currentBalance < requiredBalance) {
          return res.status(400).json({
            success: false,
            error: 'Insufficient balance',
            message: `Saldo tidak cukup! Saldo ${sourceAccount.account_name}: Rp ${currentBalance.toLocaleString('id-ID')}, Dibutuhkan: Rp ${requiredBalance.toLocaleString('id-ID')}`,
            details: {
              accountName: sourceAccount.account_name,
              currentBalance: currentBalance,
              requestedAmount: requiredBalance,
              shortfall: requiredBalance - currentBalance
            }
          });
        }
      }
    }

    await sequelize.query(`
      UPDATE milestone_costs SET
        cost_category = COALESCE(:costCategory, cost_category),
        cost_type = COALESCE(:costType, cost_type),
        amount = COALESCE(:amount, amount),
        description = COALESCE(:description, description),
        reference_number = COALESCE(:referenceNumber, reference_number),
        account_id = COALESCE(:accountId, account_id),
        source_account_id = COALESCE(:sourceAccountId, source_account_id),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = :costId
    `, {
      replacements: { costId, costCategory, costType, amount, description, referenceNumber, accountId, sourceAccountId },
      type: sequelize.QueryTypes.UPDATE
    });

    // Adjust balances if source account or amount changed
    if (oldSourceAccountId || newSourceAccountId) {
      // Restore old balance if there was an old source account
      if (oldSourceAccountId) {
        await sequelize.query(`
          UPDATE chart_of_accounts 
          SET current_balance = current_balance + :oldAmount,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = :oldSourceAccountId
        `, {
          replacements: {
            oldAmount: oldAmount,
            oldSourceAccountId: oldSourceAccountId
          },
          type: sequelize.QueryTypes.UPDATE
        });
        
        console.log(`[MilestoneCost] Restored ${oldAmount} to account ${oldSourceAccountId}`);
      }

      // Deduct new balance if there is a new source account
      if (newSourceAccountId) {
        await sequelize.query(`
          UPDATE chart_of_accounts 
          SET current_balance = current_balance - :newAmount,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = :newSourceAccountId
        `, {
          replacements: {
            newAmount: newAmount,
            newSourceAccountId: newSourceAccountId
          },
          type: sequelize.QueryTypes.UPDATE
        });
        
        console.log(`[MilestoneCost] Deducted ${newAmount} from account ${newSourceAccountId}`);
      }
    }

    const [updated] = await sequelize.query(`
      SELECT * FROM milestone_costs WHERE id = :costId
    `, {
      replacements: { costId },
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: updated,
      message: 'Cost updated successfully'
    });
  } catch (error) {
    console.error('Error updating cost:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cost',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:projectId/milestones/:milestoneId/costs/:costId
 * @desc    Soft delete cost entry (preserves data for audit trail)
 * @access  Private
 */
router.delete('/:projectId/milestones/:milestoneId/costs/:costId', async (req, res) => {
  try {
    const { costId, milestoneId } = req.params;
    const userId = req.user?.id || null;

    // Get cost details before soft deleting
    const cost = await sequelize.query(
      'SELECT cost_category, cost_type, amount, source_account_id FROM milestone_costs WHERE id = :costId LIMIT 1',
      {
        replacements: { costId },
        type: sequelize.QueryTypes.SELECT,
        plain: true
      }
    );

    if (!cost) {
      return res.status(404).json({
        success: false,
        error: 'Cost not found'
      });
    }

    // Restore balance if there was a source account
    if (cost.source_account_id) {
      const amount = parseFloat(cost.amount) || 0;
      
      await sequelize.query(`
        UPDATE chart_of_accounts 
        SET current_balance = current_balance + :amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = :sourceAccountId
      `, {
        replacements: {
          amount: amount,
          sourceAccountId: cost.source_account_id
        },
        type: sequelize.QueryTypes.UPDATE
      });
      
      console.log(`[MilestoneCost] Restored ${amount} to account ${cost.source_account_id} (deleted cost ${costId})`);
    }

    // Soft delete - set deleted_by and deleted_at
    await sequelize.query(
      `UPDATE milestone_costs 
       SET deleted_by = :userId, 
           deleted_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = :costId`,
      {
        replacements: { userId, costId },
        type: sequelize.QueryTypes.UPDATE
      }
    );


    // Create activity log for deletion
    await sequelize.query(
      `INSERT INTO milestone_activities (
        id, milestone_id, activity_type, activity_title, activity_description,
        performed_by, performed_at, related_cost_id, metadata
      ) VALUES (
        gen_random_uuid(), :milestoneId, 'cost_deleted', :activityTitle, :activityDescription,
        :userId, CURRENT_TIMESTAMP, :costId, :metadata
      )`,
      {
        replacements: {
          milestoneId,
          activityTitle: `Cost deleted: ${cost.cost_category}`,
          activityDescription: `Deleted ${cost.cost_type} cost of Rp ${Number(cost.amount).toLocaleString('id-ID')}`,
          userId,
          costId,
          metadata: JSON.stringify({
            cost_category: cost.cost_category,
            cost_type: cost.cost_type,
            amount: cost.amount,
            reason: req.body.reason || 'No reason provided'
          })
        },
        type: sequelize.QueryTypes.INSERT
      }
    );

    console.log(`[INFO] Cost soft deleted: ${costId} by user ${userId}`);

    res.json({
      success: true,
      message: 'Cost deleted successfully (soft delete - data preserved for audit)'
    });
  } catch (error) {
    console.error('Error deleting cost:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete cost',
      details: error.message
    });
  }
});

// ============================================
// ACTIVITIES ENDPOINT
// ============================================

/**
 * @route   GET /api/projects/:projectId/milestones/:milestoneId/activities
 * @desc    Get activity timeline for a milestone
 * @access  Private
 */
router.get('/:projectId/milestones/:milestoneId/activities', async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { limit, offset, type } = req.query;

    // Build where clause
    const where = { milestone_id: milestoneId };
    if (type) where.activity_type = type;

    // Build query options
    const queryOptions = {
      where,
      order: [['performed_at', 'DESC']],
      raw: true
    };

    if (limit) queryOptions.limit = parseInt(limit);
    if (offset) queryOptions.offset = parseInt(offset);

    // Get activities using Sequelize model
    const activities = await MilestoneActivity.findAll(queryOptions);

    // Enrich with related data
    const enrichedActivities = await Promise.all(
      activities.map(async (activity) => {
        let performerName = null;
        let relatedPhotoUrl = null;
        let relatedCostAmount = null;

        // Get performer name
        if (activity.performed_by) {
          try {
            const user = await sequelize.query(
              "SELECT profile->>'fullName' as name, username FROM users WHERE id = :userId LIMIT 1",
              { 
                replacements: { userId: activity.performed_by },
                type: sequelize.QueryTypes.SELECT,
                plain: true
              }
            );
            performerName = user?.name || user?.username || 'Unknown User';
          } catch (err) {
            console.log('Could not fetch performer user:', err.message);
          }
        }

        // Get related photo
        if (activity.related_photo_id) {
          try {
            const photo = await sequelize.query(
              'SELECT photo_url FROM milestone_photos WHERE id = :photoId LIMIT 1',
              { 
                replacements: { photoId: activity.related_photo_id },
                type: sequelize.QueryTypes.SELECT,
                plain: true
              }
            );
            relatedPhotoUrl = photo?.photo_url || null;
          } catch (err) {
            console.log('Could not fetch related photo:', err.message);
          }
        }

        // Get related cost with user trail info
        if (activity.related_cost_id) {
          try {
            const costResult = await sequelize.query(
              `SELECT 
                c.amount, 
                c.cost_category,
                c.cost_type,
                c.deleted_at,
                COALESCE(u1.profile->>'fullName', u1.username) as recorded_by_name,
                COALESCE(u2.profile->>'fullName', u2.username) as updated_by_name,
                COALESCE(u3.profile->>'fullName', u3.username) as deleted_by_name
               FROM milestone_costs c
               LEFT JOIN users u1 ON c.recorded_by = u1.id
               LEFT JOIN users u2 ON c.updated_by = u2.id
               LEFT JOIN users u3 ON c.deleted_by = u3.id
               WHERE c.id = :costId 
               LIMIT 1`,
              { 
                replacements: { costId: activity.related_cost_id },
                type: sequelize.QueryTypes.SELECT
              }
            );
            
            const cost = costResult && costResult.length > 0 ? costResult[0] : null;
            
            if (cost) {
              // Build cost info object with user trail
              relatedCostAmount = {
                amount: cost.amount ?? null,
                category: cost.cost_category ?? null,
                type: cost.cost_type ?? null,
                is_deleted: !!cost.deleted_at,
                deleted_at: cost.deleted_at ?? null,
                recorded_by_name: cost.recorded_by_name ?? 'Unknown',
                updated_by_name: cost.updated_by_name ?? null,
                deleted_by_name: cost.deleted_by_name ?? null
              };
              
              console.log(`[INFO] Cost enriched for activity ${activity.id}:`, {
                category: cost.cost_category,
                amount: cost.amount,
                isDeleted: !!cost.deleted_at,
                deletedBy: cost.deleted_by_name || 'N/A'
              });
            } else {
              relatedCostAmount = null;
              console.log(`[WARN] Cost not found for activity ${activity.id}:`, activity.related_cost_id);
            }
          } catch (err) {
            console.log('Could not fetch related cost:', err.message);
            console.log('Error details:', err);
            relatedCostAmount = null;
          }
        }

        return {
          ...activity,
          performer_name: performerName,
          related_photo_url: relatedPhotoUrl,
          related_cost_amount: relatedCostAmount
        };
      })
    );

    res.json({
      success: true,
      data: enrichedActivities,
      count: enrichedActivities.length
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activities',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   POST /api/projects/:projectId/milestones/:milestoneId/activities
 * @desc    Add manual activity log
 * @access  Private
 */
router.post('/:projectId/milestones/:milestoneId/activities', async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { activityType, activityTitle, activityDescription, metadata } = req.body;
    const performedBy = req.user?.id || null;

    if (!activityType || !activityTitle) {
      return res.status(400).json({
        success: false,
        error: 'Activity type and title are required'
      });
    }

    const [activity] = await sequelize.query(`
      INSERT INTO milestone_activities (
        milestone_id, activity_type, activity_title, activity_description,
        performed_by, performed_at, metadata, created_at
      ) VALUES (
        :milestoneId, :activityType, :activityTitle, :activityDescription,
        :performedBy, CURRENT_TIMESTAMP, :metadata, CURRENT_TIMESTAMP
      ) RETURNING *
    `, {
      replacements: {
        milestoneId,
        activityType,
        activityTitle,
        activityDescription,
        performedBy,
        metadata: metadata ? JSON.stringify(metadata) : '{}'
      },
      type: sequelize.QueryTypes.INSERT
    });

    res.status(201).json({
      success: true,
      data: activity[0],
      message: 'Activity logged successfully'
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log activity',
      details: error.message
    });
  }
});

module.exports = router;
