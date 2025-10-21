const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');
const Manpower = require('../models/Manpower');

const router = express.Router();

// Validation schemas
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'manager', 'staff').default('staff'),
  departmentId: Joi.string().allow('').optional(),
  employeeId: Joi.string().allow('', null).optional(), // ← NEW: Link to employee
  isActive: Joi.boolean().default(true)
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
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
        { email: { [Op.iLike]: `%${q}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: limitNum,
      offset: offset,
      attributes: { exclude: ['password'] }, // Don't return passwords
      include: [{
        model: Manpower,
        as: 'employee',
        required: false, // Left join - not all users have employee records
        attributes: ['id', 'employeeId', 'name', 'position', 'department', 'email']
      }]
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

// @route   GET /api/users/:id
// @desc    Get single user with employee data
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Manpower,
        as: 'employee',
        required: false, // Left join
        attributes: ['id', 'employeeId', 'name', 'position', 'department', 'email', 'phone', 'status']
      }]
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

// @route   POST /api/users
// @desc    Create new user with optional employee linking
// @access  Private (Admin only)
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

    // ⭐ NEW: Validate employee if provided
    if (value.employeeId) {
      const employee = await Manpower.findByPk(value.employeeId);
      
      if (!employee) {
        return res.status(400).json({
          success: false,
          error: 'Employee not found',
          details: 'The specified employee ID does not exist'
        });
      }
      
      // Check if employee already has a user account
      if (employee.userId) {
        return res.status(400).json({
          success: false,
          error: 'Employee already has a user account',
          details: `Employee ${employee.name} is already linked to another user account`
        });
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(value.password, saltRounds);

    // Generate ID
    const userCount = await User.count();
    const userId = `U${String(userCount + 1).padStart(3, '0')}`;

    // Create user
    const user = await User.create({
      id: userId,
      ...value,
      password: hashedPassword
    });

    // ⭐ NEW: Update employee with userId if linked
    if (value.employeeId) {
      await Manpower.update(
        { userId: user.id },
        { where: { id: value.employeeId } }
      );
      
      console.log(`✅ Linked user ${user.username} to employee ${value.employeeId}`);
    }

    // Fetch user with employee data
    const userWithEmployee = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Manpower,
        as: 'employee',
        required: false,
        attributes: ['id', 'employeeId', 'name', 'position', 'department']
      }]
    });

    res.status(201).json({
      success: true,
      data: userWithEmployee,
      message: value.employeeId 
        ? 'User created and linked to employee successfully'
        : 'User created successfully'
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

// @route   PUT /api/users/:id
// @desc    Update user with employee linking support
// @access  Private
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

    // ⭐ NEW: Validate employee if being updated
    if (value.employeeId !== undefined) {
      // If changing employee link
      if (value.employeeId) {
        const employee = await Manpower.findByPk(value.employeeId);
        
        if (!employee) {
          return res.status(400).json({
            success: false,
            error: 'Employee not found',
            details: 'The specified employee ID does not exist'
          });
        }
        
        // Check if employee already has a different user account
        if (employee.userId && employee.userId !== id) {
          return res.status(400).json({
            success: false,
            error: 'Employee already has a user account',
            details: `Employee ${employee.name} is already linked to another user account`
          });
        }
      }
      
      // ⭐ Handle employee link changes
      const oldEmployeeId = user.employeeId;
      
      // If unlinking from old employee
      if (oldEmployeeId && oldEmployeeId !== value.employeeId) {
        await Manpower.update(
          { userId: null },
          { where: { id: oldEmployeeId } }
        );
        console.log(`✅ Unlinked user ${user.username} from employee ${oldEmployeeId}`);
      }
      
      // If linking to new employee
      if (value.employeeId) {
        await Manpower.update(
          { userId: user.id },
          { where: { id: value.employeeId } }
        );
        console.log(`✅ Linked user ${user.username} to employee ${value.employeeId}`);
      }
    }

    // If password is being updated, hash it
    if (value.password) {
      const saltRounds = 10;
      value.password = await bcrypt.hash(value.password, saltRounds);
    }

    await user.update(value);

    // Fetch updated user with employee data
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Manpower,
        as: 'employee',
        required: false,
        attributes: ['id', 'employeeId', 'name', 'position', 'department']
      }]
    });

    res.json({
      success: true,
      data: updatedUser,
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

// @route   DELETE /api/users/:id
// @desc    Delete user and unlink from employee
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // ⭐ NEW: Unlink from employee if linked
    if (user.employeeId) {
      await Manpower.update(
        { userId: null },
        { where: { id: user.employeeId } }
      );
      console.log(`✅ Unlinked employee ${user.employeeId} from deleted user ${user.username}`);
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      details: error.message
    });
  }
});

// @route   GET /api/users/available-employees
// @desc    Get employees without user accounts (for linking)
// @access  Private
router.get('/available-employees', async (req, res) => {
  try {
    const employees = await Manpower.findAll({
      where: {
        userId: null, // Only employees without user accounts
        status: 'active' // Only active employees
      },
      attributes: ['id', 'employeeId', 'name', 'position', 'department', 'email', 'phone'],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: employees,
      count: employees.length
    });
  } catch (error) {
    console.error('Error fetching available employees:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available employees',
      details: error.message
    });
  }
});

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    const { username, password } = value;

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: username }
        ]
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: userPassword, ...userWithoutPassword } = user.toJSON();

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: token
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      details: error.message
    });
  }
});

module.exports = router;
