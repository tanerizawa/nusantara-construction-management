const express = require('express');
const Joi = require('joi');
const userService = require('../../services/userService');
const { verifyToken, requireAdmin } = require('../../middleware/auth');

const router = express.Router();

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().required(),
  position: Joi.string().required(),
  role: Joi.string().valid(
    'admin', 
    'project_manager', 
    'finance_manager', 
    'inventory_manager', 
    'hr_manager', 
    'supervisor',
    'manager',
    'staff'
  ).required(),
  departmentId: Joi.string().allow('').optional()
});

// ============================================================================
// REGISTRATION ENDPOINTS (ADMIN ONLY - Internal User Management)
// ============================================================================
// NOTE: These endpoints are NOT for public registration!
// Only authenticated admins can create new users in the system.
// For admin user management, use POST /api/auth/users instead.

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (ADMIN ONLY - Internal use)
 * @access  Private (Admin only)
 * @deprecated Use POST /api/auth/users instead
 */
router.post('/register', verifyToken, requireAdmin, async (req, res) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        error: error.details[0].message,
        details: error.details
      });
    }

    const { username, email, password, fullName, position, role, departmentId } = req.body;

    // Create new user (handles both database and JSON modes)
    const newUser = await userService.createUser({
      username,
      email,
      password,
      fullName,
      position,
      role,
      departmentId: departmentId || null
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
      data: newUser,
      storageMode: userService.isUsingDatabase() ? 'database' : 'json'
    });

  } catch (error) {
    console.error('Register error:', error);
    
    if (error.message.includes('already exists')) {
      return res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Server error during registration',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/auth/check-username
 * @desc    Check if username is available (ADMIN ONLY - When creating users)
 * @access  Private (Admin only)
 */
router.post('/check-username', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Username must be at least 3 characters'
      });
    }

    // Check if username exists
    const user = await userService.findByIdentifier(username);

    res.json({
      success: true,
      available: !user,
      message: user ? 'Username is already taken' : 'Username is available'
    });

  } catch (error) {
    console.error('Check username error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during username check',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/auth/check-email
 * @desc    Check if email is available (ADMIN ONLY - When creating users)
 * @access  Private (Admin only)
 */
router.post('/check-email', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Check if email exists
    const user = await userService.findByIdentifier(email);

    res.json({
      success: true,
      available: !user,
      message: user ? 'Email is already registered' : 'Email is available'
    });

  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during email check',
      details: error.message
    });
  }
});

module.exports = router;
