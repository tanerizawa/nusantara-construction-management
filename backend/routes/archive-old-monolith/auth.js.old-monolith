const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const userService = require('../services/userService');

const router = express.Router();

// Validation schemas
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().required(),
  position: Joi.string().required(),
  role: Joi.string().valid('admin', 'project_manager', 'finance_manager', 'inventory_manager', 'hr_manager', 'supervisor').required()
});

// @route   POST /api/auth/login
// @desc    Login user with hybrid authentication (database or JSON)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        error: error.details[0].message 
      });
    }

    const { username, password } = req.body;

    // Find user (handles both database and JSON modes)
    const user = await userService.findByIdentifier(username);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Check if account is locked (database mode only)
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return res.status(423).json({ 
        success: false,
        error: 'Account temporarily locked due to multiple failed attempts. Try again later.' 
      });
    }

    // Verify password
    const isValidPassword = await userService.verifyPassword(user, password);
    
    if (!isValidPassword) {
      // Update failed login attempts
      await userService.updateLoginAttempts(user, false);
      
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Update successful login
    await userService.updateLoginAttempts(user, true);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during login' 
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user with hybrid storage (database or JSON)
// @access  Admin only
router.post('/register', async (req, res) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        error: error.details[0].message 
      });
    }

    const { username, email, password, fullName, position, role } = req.body;

    // Create new user (handles both database and JSON modes)
    const newUser = await userService.createUser({
      username,
      email,
      password,
      fullName,
      position,
      role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
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
      error: 'Server error during registration' 
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user from hybrid storage (database or JSON)
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await userService.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found or inactive' 
      });
    }

    res.json({
      success: true,
      user,
      storageMode: userService.isUsingDatabase() ? 'database' : 'json'
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ 
      success: false,
      error: 'Invalid token' 
    });
  }
});

module.exports = router;
