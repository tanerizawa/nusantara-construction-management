const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../../models/User');

const router = express.Router();

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'manager', 'staff', 'project_manager', 'finance_manager', 'inventory_manager', 'hr_manager', 'supervisor').default('staff'),
  departmentId: Joi.string().allow('').optional(),
  isActive: Joi.boolean().default(true),
  fullName: Joi.string().optional(),
  position: Joi.string().optional()
});

// ============================================================================
// USER MANAGEMENT ENDPOINTS
// ============================================================================

/**
 * @route   GET /api/auth/users
 * @desc    Get all users with filters and pagination
 * @access  Private (Admin only)
 */
router.get('/', async (req, res) => {
  try {
    const {
      role,
      department,
      active,
      q,
      sort = 'username',
      order = 'asc',
      limit = 50,
      page = 1
    } = req.query;

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause = {};
    
    if (role) {
      whereClause.role = role;
    }
    
    if (department) {
      whereClause.departmentId = department;
    }
    
    if (active !== undefined) {
      whereClause.isActive = active === 'true';
    }
    
    if (q) {
      whereClause[Op.or] = [
        { username: { [Op.iLike]: `%${q}%` } },
        { email: { [Op.iLike]: `%${q}%` } },
        { fullName: { [Op.iLike]: `%${q}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: limitNum,
      offset: offset,
      attributes: { exclude: ['password'] } // Don't return passwords
    });

    res.json({
      success: true,
      data: users,
      pagination: {
        current: pageNum,
        total: Math.ceil(count / limitNum),
        count: count,
        perPage: limitNum
      }
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
 * @route   GET /api/auth/users/:id
 * @desc    Get single user by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
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
 * @route   POST /api/auth/users
 * @desc    Create new user
 * @access  Private (Admin only)
 * @note    This is for admin creating users, different from registration
 */
router.post('/', async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
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
        error: 'Username or email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(value.password, saltRounds);

    // Generate ID
    const userCount = await User.count();
    const userId = `U${String(userCount + 1).padStart(3, '0')}`;

    const user = await User.create({
      id: userId,
      ...value,
      password: hashedPassword
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({
      success: true,
      data: userWithoutPassword,
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
 * @route   PUT /api/auth/users/:id
 * @desc    Update user
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const updateSchema = userSchema.fork(
      ['username', 'email', 'password'],
      (schema) => schema.optional()
    );
    
    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    // If password is being updated, hash it
    if (value.password) {
      const saltRounds = 10;
      value.password = await bcrypt.hash(value.password, saltRounds);
    }

    // Check if username or email is being changed and already exists
    if (value.username || value.email) {
      const whereClause = {
        id: { [Op.ne]: id } // Exclude current user
      };
      
      const orConditions = [];
      if (value.username) orConditions.push({ username: value.username });
      if (value.email) orConditions.push({ email: value.email });
      
      if (orConditions.length > 0) {
        whereClause[Op.or] = orConditions;
        
        const existingUser = await User.findOne({ where: whereClause });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            error: 'Username or email already exists'
          });
        }
      }
    }

    await user.update(value);

    // Remove password from response
    const { password, ...userWithoutPassword } = user.toJSON();

    res.json({
      success: true,
      data: userWithoutPassword,
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
 * @route   DELETE /api/auth/users/:id
 * @desc    Delete user (soft delete by setting isActive=false recommended)
 * @access  Private (Admin only)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { hard } = req.query; // ?hard=true for permanent deletion

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (hard === 'true') {
      // Permanent deletion
      await user.destroy();
      res.json({
        success: true,
        message: 'User permanently deleted'
      });
    } else {
      // Soft delete (recommended)
      await user.update({ isActive: false });
      res.json({
        success: true,
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

module.exports = router;
