const express = require("express");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const User = require("../../models/User");
const userService = require("../../services/userService");

const router = express.Router();

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
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
router.post("/login", async (req, res) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
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
          [Op.or]: [{ username: username }, { email: username }],
        },
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if account is active (database mode)
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        error: "Account is inactive",
      });
    }

    // Check if account is locked (hybrid mode only)
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return res.status(423).json({
        success: false,
        error:
          "Account temporarily locked due to multiple failed attempts. Try again later.",
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
        error: "Invalid credentials",
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
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
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
      isActive: user.isActive !== false,
    };

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
      data: {
        user: userResponse,
        token,
      },
      storageMode: isHybridMode
        ? userService.isUsingDatabase()
          ? "database"
          : "json"
        : "database",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during login",
      details: error.message,
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user from hybrid storage (database or JSON)
 * @access  Private
 */
router.get("/me", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    );

    // Try userService first (hybrid mode)
    let user = await userService.findById(decoded.id || decoded.userId);
    let isHybridMode = true;

    // Fallback to direct database query
    if (!user) {
      isHybridMode = false;
      user = await User.findByPk(decoded.id || decoded.userId, {
        attributes: { exclude: ["password"] },
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found or inactive",
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
      isActive: user.isActive !== false,
    };

    res.json({
      success: true,
      user: userResponse,
      data: userResponse,
      storageMode: isHybridMode
        ? userService.isUsingDatabase()
          ? "database"
          : "json"
        : "database",
    });
  } catch (error) {
    console.error("Auth error:", error);
    
    // Handle JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired",
        tokenExpired: true
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Server error",
      details: error.message,
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post("/logout", async (req, res) => {
  try {
    // JWT is stateless, so logout is handled client-side
    // This endpoint is for logging purposes and future enhancements
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret"
      );
      // Logout successful - token verification passed
    }

    res.json({
      success: true,
      message: "Logout successful. Please remove token from client.",
    });
  } catch (error) {
    // Even if token is invalid, return success (client should remove token)
    res.json({
      success: true,
      message: "Logout successful. Please remove token from client.",
    });
  }
});

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post("/refresh-token", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    // Verify current token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    );

    // Verify user still exists and is active
    let user = await userService.findById(decoded.id || decoded.userId);
    if (!user) {
      user = await User.findByPk(decoded.id || decoded.userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        error: "Account is inactive",
      });
    }

    // Generate new token
    const newToken = jwt.sign(
      {
        id: user.id,
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Token refreshed successfully",
      token: newToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error during token refresh",
      details: error.message,
    });
  }
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private (requires authentication)
 */
router.post("/change-password", async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.userId;

    // Validate input
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long",
      });
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ password: hashedPassword });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error during password change",
      details: error.message,
    });
  }
});

/**
 * @route   GET /api/auth/login-history
 * @desc    Get user's login history (mock for now)
 * @access  Private
 */
router.get("/login-history", async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Mock data for now - in production, fetch from LoginHistory table
    const mockHistory = [
      {
        loginAt: new Date(),
        ipAddress: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "Unknown",
        success: true,
        location: "Unknown",
      },
    ];

    res.json({
      success: true,
      history: mockHistory,
    });
  } catch (error) {
    console.error("Login history error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching login history",
    });
  }
});

/**
 * @route   GET /api/auth/sessions
 * @desc    Get user's active sessions (mock for now)
 * @access  Private
 */
router.get("/sessions", async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Mock data for now - in production, track sessions in database
    const mockSessions = [
      {
        id: "current",
        device: "Current Browser",
        ipAddress: req.ip || "127.0.0.1",
        location: "Unknown",
        lastActive: new Date(),
        current: true,
      },
    ];

    res.json({
      success: true,
      sessions: mockSessions,
    });
  } catch (error) {
    console.error("Sessions error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching sessions",
    });
  }
});

/**
 * @route   POST /api/auth/logout-all
 * @desc    Logout from all devices (invalidate all tokens)
 * @access  Private
 */
router.post("/logout-all", async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // In production: Invalidate all refresh tokens for this user
    // For now, just return success
    res.json({
      success: true,
      message: "Logged out from all devices",
    });
  } catch (error) {
    console.error("Logout all error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during logout",
    });
  }
});

// ===================================
// PROFILE MANAGEMENT ENDPOINTS
// ===================================

const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for avatar upload
const storage = multer.memoryStorage(); // Store in memory for processing
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF) are allowed'));
    }
  },
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userService.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching profile",
    });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile (personal information)
 * @access  Private
 */
router.put("/profile", async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validation schema for profile update
    const profileSchema = Joi.object({
      fullName: Joi.string().min(2).max(100).required(),
      phone: Joi.string().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/).allow(''),
      position: Joi.string().max(100).allow(''),
      department: Joi.string().max(100).allow(''),
      bio: Joi.string().max(500).allow(''),
    });

    const { error, value } = profileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    // Update user profile
    const updatedUser = await userService.updateUser(decoded.id, {
      fullName: value.fullName,
      phone: value.phone,
      position: value.position,
      department: value.department,
      bio: value.bio,
      updatedAt: new Date(),
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating profile",
    });
  }
});

/**
 * @route   PUT /api/auth/profile/preferences
 * @desc    Update user preferences (auto-save)
 * @access  Private
 */
router.put("/profile/preferences", async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validation schema for preferences
    const preferencesSchema = Joi.object({
      defaultLandingPage: Joi.string().valid('dashboard', 'projects', 'finance', 'inventory'),
      itemsPerPage: Joi.number().valid(10, 25, 50, 100),
      timezone: Joi.string().valid('Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura', 'Asia/Singapore', 'UTC'),
      dateFormat: Joi.string().valid('DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'),
      numberFormat: Joi.string().valid('1,234.56', '1.234,56', '1 234,56'),
    }).min(1); // At least one preference must be provided

    const { error, value } = preferencesSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    // Get current user to merge preferences
    const user = await userService.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Merge with existing preferences
    const updatedPreferences = {
      ...(user.preferences || {}),
      ...value,
    };

    // Update user preferences
    const updatedUser = await userService.updateUser(decoded.id, {
      preferences: updatedPreferences,
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Preferences updated successfully",
      data: updatedPreferences,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating preferences",
    });
  }
});

/**
 * @route   POST /api/auth/avatar
 * @desc    Upload user avatar
 * @access  Private
 */
router.post("/avatar", upload.single('avatar'), async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // Create uploads directory if not exists
    const uploadDir = path.join(__dirname, '../../uploads/avatars');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Process image with sharp (resize to 400x400)
    const filename = `avatar-${decoded.id}-${Date.now()}.jpg`;
    const filepath = path.join(uploadDir, filename);

    await sharp(req.file.buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 90 })
      .toFile(filepath);

    // Get current user to delete old avatar
    const user = await userService.findById(decoded.id);
    if (user && user.avatar) {
      // Delete old avatar file
      const oldFilepath = path.join(__dirname, '../../', user.avatar);
      try {
        await fs.unlink(oldFilepath);
      } catch (err) {
        console.error("Error deleting old avatar:", err);
      }
    }

    // Update user avatar path
    const avatarUrl = `/uploads/avatars/${filename}`;
    const updatedUser = await userService.updateUser(decoded.id, {
      avatar: avatarUrl,
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      avatarUrl: avatarUrl,
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error uploading avatar",
    });
  }
});

/**
 * @route   DELETE /api/auth/avatar
 * @desc    Remove user avatar
 * @access  Private
 */
router.delete("/avatar", async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get current user
    const user = await userService.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Delete avatar file if exists
    if (user.avatar) {
      const filepath = path.join(__dirname, '../../', user.avatar);
      try {
        await fs.unlink(filepath);
      } catch (err) {
        console.error("Error deleting avatar file:", err);
      }
    }

    // Update user to remove avatar
    await userService.updateUser(decoded.id, {
      avatar: null,
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Avatar removed successfully",
    });
  } catch (error) {
    console.error("Remove avatar error:", error);
    res.status(500).json({
      success: false,
      error: "Server error removing avatar",
    });
  }
});

module.exports = router;

