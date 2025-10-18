const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../models/User');
const { ROLES, hasPermission } = require('../utils/rolePermissions');

const router = express.Router();

// ====================================================================
// VALIDATION SCHEMAS
// ====================================================================

const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).allow('').optional(),
  position: Joi.string().max(100).allow('').optional(),
  department: Joi.string().max(100).allow('').optional(),
  role: Joi.string().valid(
    'super_admin', 'admin', 'project_manager', 'finance_manager', 
    'inventory_manager', 'hr_manager', 'staff', 'supervisor'
  ).required(),
  isActive: Joi.boolean().default(true)
});

const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  fullName: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).allow('').optional(),
  position: Joi.string().max(100).allow('').optional(),
  department: Joi.string().max(100).allow('').optional(),
  role: Joi.string().valid(
    'super_admin', 'admin', 'project_manager', 'finance_manager', 
    'inventory_manager', 'hr_manager', 'staff', 'supervisor'
  ).optional(),
  isActive: Joi.boolean().optional()
});

// ====================================================================
// HELPER FUNCTIONS
// ====================================================================

/**
 * Generate next user ID
 */
async function generateUserId() {
  const lastUser = await User.findOne({
    where: {
      id: { [Op.like]: 'U%' }
    },
    order: [['createdAt', 'DESC']]
  });

  if (!lastUser) {
    return 'U001';
  }

  const lastNumber = parseInt(lastUser.id.substring(1));
  const nextNumber = lastNumber + 1;
  return `U${String(nextNumber).padStart(3, '0')}`;
}

/**
 * Format user data for response (remove sensitive fields)
 */
function formatUserResponse(user) {
  const userObj = user.toJSON ? user.toJSON() : user;
  const { password, loginAttempts, lockUntil, ...safeUser } = userObj;
  
  // Ensure profile fields are accessible at top level
  if (safeUser.profile) {
    safeUser.fullName = safeUser.profile.fullName || '';
    safeUser.phone = safeUser.profile.phone || '';
    safeUser.position = safeUser.profile.position || '';
    safeUser.department = safeUser.profile.department || '';
  }
  
  return safeUser;
}

/**
 * Build profile object from request data
 */
function buildProfile(data) {
  return {
    fullName: data.fullName || '',
    phone: data.phone || '',
    position: data.position || '',
    department: data.department || '',
    avatar: data.avatar || null
  };
}

// ====================================================================
// ROUTES - USER MANAGEMENT
// ====================================================================

/**
 * @route   GET /api/users/management
 * @desc    Get all users with advanced filtering for User Management
 * @access  Private (Admin, Super Admin)
 */
router.get('/management', async (req, res) => {
  try {
    const {
      role,
      status,
      search,
      sort = 'createdAt',
      order = 'DESC',
      limit = 20,
      page = 1
    } = req.query;

    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const pageNum = Math.max(1, parseInt(page));
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause = {};
    
    if (role && role !== 'all') {
      whereClause.role = role;
    }
    
    if (status === 'active') {
      whereClause.isActive = true;
    } else if (status === 'inactive') {
      whereClause.isActive = false;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { 'profile.fullName': { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Fetch users
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: limitNum,
      offset: offset,
      attributes: { exclude: ['password', 'loginAttempts', 'lockUntil'] }
    });

    // Calculate statistics
    const stats = await User.findAll({
      attributes: [
        'role',
        'isActive',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
      ],
      group: ['role', 'isActive']
    });

    const statistics = {
      total: count,
      active: 0,
      inactive: 0,
      byRole: {}
    };

    stats.forEach(stat => {
      const data = stat.toJSON();
      if (data.isActive) {
        statistics.active += parseInt(data.count);
      } else {
        statistics.inactive += parseInt(data.count);
      }
      
      if (!statistics.byRole[data.role]) {
        statistics.byRole[data.role] = { active: 0, inactive: 0 };
      }
      
      if (data.isActive) {
        statistics.byRole[data.role].active = parseInt(data.count);
      } else {
        statistics.byRole[data.role].inactive = parseInt(data.count);
      }
    });

    res.json({
      success: true,
      data: users.map(formatUserResponse),
      pagination: {
        current: pageNum,
        total: Math.ceil(count / limitNum),
        count: count,
        perPage: limitNum
      },
      statistics
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/users/management/stats
 * @desc    Get user statistics for dashboard
 * @access  Private (Admin, Super Admin)
 */
router.get('/management/stats', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const inactiveUsers = await User.count({ where: { isActive: false } });

    const roleStats = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
      ],
      group: ['role']
    });

    const byRole = {};
    roleStats.forEach(stat => {
      const data = stat.toJSON();
      byRole[data.role] = parseInt(data.count);
    });

    res.json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        byRole
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/users/management/:id
 * @desc    Get single user details
 * @access  Private
 */
router.get('/management/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'loginAttempts', 'lockUntil'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/users/management
 * @desc    Create new user
 * @access  Private (Admin, Super Admin)
 */
router.post('/management', async (req, res) => {
  try {
    // Validate request
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username: value.username },
          { email: value.email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: existingUser.username === value.username 
          ? 'Username already exists' 
          : 'Email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(value.password, saltRounds);

    // Generate user ID
    const userId = await generateUserId();

    // Build profile object
    const profile = buildProfile(value);

    // Create user
    const user = await User.create({
      id: userId,
      username: value.username,
      email: value.email,
      password: hashedPassword,
      role: value.role,
      profile: profile,
      isActive: value.isActive !== undefined ? value.isActive : true
    });

    res.status(201).json({
      success: true,
      data: formatUserResponse(user),
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      details: error.message
    });
  }
});

/**
 * @route   PUT /api/users/management/:id
 * @desc    Update user
 * @access  Private (Admin, Super Admin, Self)
 */
router.put('/management/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Validate request
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    // Check if username or email already exists (exclude current user)
    if (value.username || value.email) {
      const whereClause = {
        id: { [Op.ne]: id }
      };
      
      if (value.username && value.email) {
        whereClause[Op.or] = [
          { username: value.username },
          { email: value.email }
        ];
      } else if (value.username) {
        whereClause.username = value.username;
      } else if (value.email) {
        whereClause.email = value.email;
      }

      const existingUser = await User.findOne({ where: whereClause });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: existingUser.username === value.username 
            ? 'Username already exists' 
            : 'Email already exists'
        });
      }
    }

    // Prepare update data
    const updateData = {};
    
    if (value.username) updateData.username = value.username;
    if (value.email) updateData.email = value.email;
    if (value.role) updateData.role = value.role;
    if (value.isActive !== undefined) updateData.isActive = value.isActive;

    // Hash password if provided
    if (value.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(value.password, saltRounds);
    }

    // Update profile if any profile fields provided
    if (value.fullName || value.phone || value.position || value.department) {
      const currentProfile = user.profile || {};
      updateData.profile = {
        ...currentProfile,
        ...(value.fullName && { fullName: value.fullName }),
        ...(value.phone !== undefined && { phone: value.phone }),
        ...(value.position !== undefined && { position: value.position }),
        ...(value.department !== undefined && { department: value.department })
      };
    }

    // Update user
    await user.update(updateData);

    res.json({
      success: true,
      data: formatUserResponse(user),
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      details: error.message
    });
  }
});

/**
 * @route   PATCH /api/users/management/:id/status
 * @desc    Toggle user active status
 * @access  Private (Admin, Super Admin)
 */
router.patch('/management/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isActive must be a boolean'
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.update({ isActive });

    res.json({
      success: true,
      data: formatUserResponse(user),
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user status',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/users/management/:id
 * @desc    Delete user (soft delete by deactivating)
 * @access  Private (Admin, Super Admin)
 */
router.delete('/management/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent deletion of super_admin
    if (user.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete super admin user'
      });
    }

    if (permanent === 'true') {
      // Permanent deletion
      await user.destroy();
      res.json({
        success: true,
        message: 'User permanently deleted'
      });
    } else {
      // Soft delete (deactivate)
      await user.update({ isActive: false });
      res.json({
        success: true,
        data: formatUserResponse(user),
        message: 'User deactivated successfully'
      });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/users/management/bulk-delete
 * @desc    Bulk delete users
 * @access  Private (Admin, Super Admin)
 */
router.post('/management/bulk-delete', async (req, res) => {
  try {
    const { userIds, permanent } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'userIds must be a non-empty array'
      });
    }

    // Prevent deletion of super_admin users
    const superAdmins = await User.findAll({
      where: {
        id: { [Op.in]: userIds },
        role: 'super_admin'
      }
    });

    if (superAdmins.length > 0) {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete super admin users',
        details: `Found ${superAdmins.length} super admin(s) in selection`
      });
    }

    let result;
    if (permanent === true) {
      // Permanent deletion
      result = await User.destroy({
        where: { id: { [Op.in]: userIds } }
      });
    } else {
      // Soft delete (deactivate)
      result = await User.update(
        { isActive: false },
        { where: { id: { [Op.in]: userIds } } }
      );
    }

    res.json({
      success: true,
      data: {
        affected: Array.isArray(result) ? result[0] : result,
        permanent: permanent === true
      },
      message: `${Array.isArray(result) ? result[0] : result} user(s) ${permanent ? 'deleted' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error bulk deleting users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk delete users',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/users/management/bulk-status
 * @desc    Bulk change user status
 * @access  Private (Admin, Super Admin)
 */
router.post('/management/bulk-status', async (req, res) => {
  try {
    const { userIds, isActive } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'userIds must be a non-empty array'
      });
    }

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isActive must be a boolean'
      });
    }

    const [affectedCount] = await User.update(
      { isActive },
      { where: { id: { [Op.in]: userIds } } }
    );

    res.json({
      success: true,
      data: { affected: affectedCount },
      message: `${affectedCount} user(s) ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error bulk updating status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk update status',
      details: error.message
    });
  }
});

module.exports = router;
