const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../../models/User');
const userService = require('../../services/userService');

const router = express.Router();

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required()
});

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * @route   POST /api/auth/login
 * @desc    Login user with hybrid authentication (database or JSON)
 * @access  Public
 * @unified Consolidates login from auth.js and users.js
 */
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

    // Try userService first (hybrid mode - database or JSON)
    let user = await userService.findByIdentifier(username);
    let isHybridMode = true;

    // Fallback to direct database query if userService doesn't find user
    if (!user) {
      isHybridMode = false;
      user = await User.findOne({
        where: {
          [Op.or]: [
            { username: username },
            { email: username }
          ]
        }
      });
    }
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Check if account is active (database mode)
    if (user.isActive === false) {
      return res.status(403).json({ 
        success: false,
        error: 'Account is inactive' 
      });
    }

    // Check if account is locked (hybrid mode only)
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return res.status(423).json({ 
        success: false,
        error: 'Account temporarily locked due to multiple failed attempts. Try again later.' 
      });
    }

    // Verify password
    let isValidPassword = false;
    if (isHybridMode && userService.verifyPassword) {
      isValidPassword = await userService.verifyPassword(user, password);
    } else {
      // Direct bcrypt comparison for database mode
      isValidPassword = await bcrypt.compare(password, user.password);
    }
    
    if (!isValidPassword) {
      // Update failed login attempts (hybrid mode only)
      if (isHybridMode && userService.updateLoginAttempts) {
        await userService.updateLoginAttempts(user, false);
      }
      
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Update successful login (hybrid mode only)
    if (isHybridMode && userService.updateLoginAttempts) {
      await userService.updateLoginAttempts(user, true);
    }

    // Generate JWT token with consistent payload
    const token = jwt.sign(
      { 
        id: user.id,
        userId: user.id, // For backwards compatibility
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    // Prepare user response (exclude password)
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile || null,
      fullName: user.fullName || null,
      position: user.position || null,
      departmentId: user.departmentId || null,
      isActive: user.isActive !== false
    };

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
      data: {
        user: userResponse,
        token
      },
      storageMode: isHybridMode ? (userService.isUsingDatabase() ? 'database' : 'json') : 'database'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during login',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user from hybrid storage (database or JSON)
 * @access  Private
 */
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
    
    // Try userService first (hybrid mode)
    let user = await userService.findById(decoded.id || decoded.userId);
    let isHybridMode = true;

    // Fallback to direct database query
    if (!user) {
      isHybridMode = false;
      user = await User.findByPk(decoded.id || decoded.userId, {
        attributes: { exclude: ['password'] }
      });
    }

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found or inactive' 
      });
    }

    // Exclude password from response
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile || null,
      fullName: user.fullName || null,
      position: user.position || null,
      departmentId: user.departmentId || null,
      isActive: user.isActive !== false
    };

    res.json({
      success: true,
      user: userResponse,
      data: userResponse,
      storageMode: isHybridMode ? (userService.isUsingDatabase() ? 'database' : 'json') : 'database'
    });

  } catch (error) {
    console.error('Auth error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', async (req, res) => {
  try {
    // JWT is stateless, so logout is handled client-side
    // This endpoint is for logging purposes and future enhancements
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      // Logout successful - token verification passed
    }

    res.json({
      success: true,
      message: 'Logout successful. Please remove token from client.'
    });
  } catch (error) {
    // Even if token is invalid, return success (client should remove token)
    res.json({
      success: true,
      message: 'Logout successful. Please remove token from client.'
    });
  }
});

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh-token', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided' 
      });
    }

    // Verify current token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Verify user still exists and is active
    let user = await userService.findById(decoded.id || decoded.userId);
    if (!user) {
      user = await User.findByPk(decoded.id || decoded.userId);
    }

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({ 
        success: false,
        error: 'Account is inactive' 
      });
    }

    // Generate new token
    const newToken = jwt.sign(
      { 
        id: user.id,
        userId: user.id,
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token: newToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid or expired token' 
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Server error during token refresh',
      details: error.message
    });
  }
});

module.exports = router;
