const crypto = require('crypto');
const geoip = require('geoip-lite');
const LoginHistory = require('../models/LoginHistory');
const ActiveSession = require('../models/ActiveSession');

/**
 * Parse User Agent string to extract device info
 */
function parseUserAgent(userAgent) {
  if (!userAgent) {
    return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' };
  }

  // Parse browser
  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  else if (userAgent.includes('Opera')) browser = 'Opera';

  // Parse OS
  let os = 'Unknown';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac OS')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';

  // Parse device type
  let device = 'Desktop';
  if (userAgent.includes('Mobile')) device = 'Mobile';
  else if (userAgent.includes('Tablet')) device = 'Tablet';

  return { browser, os, device };
}

/**
 * Get location from IP address
 */
function getLocationFromIP(ipAddress) {
  if (!ipAddress || ipAddress === '::1' || ipAddress === '127.0.0.1') {
    return {
      location: 'Localhost',
      country: 'LC', // 2-char code for localhost
      city: 'Local'
    };
  }

  const geo = geoip.lookup(ipAddress);
  if (!geo) {
    return {
      location: 'Unknown',
      country: 'XX', // 2-char code for unknown
      city: 'Unknown'
    };
  }

  const city = geo.city || 'Unknown';
  const country = geo.country || 'XX'; // ISO country code (2 chars)
  
  return {
    location: `${city}, ${country}`,
    country: country,
    city: city
  };
}

/**
 * Hash token for storage (to avoid storing full JWT)
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Log login attempt
 */
async function logLoginAttempt(userId, req, success, failureReason = null) {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const { browser, os, device } = parseUserAgent(userAgent);
    const { location, country, city } = getLocationFromIP(ipAddress);

    await LoginHistory.create({
      userId,
      ipAddress,
      userAgent,
      browser,
      os,
      device,
      location,
      country,
      success,
      failureReason,
      loginAt: new Date()
    });

    console.log(`Login attempt logged: User ${userId}, Success: ${success}`);
  } catch (error) {
    console.error('Error logging login attempt:', error);
    // Don't throw - logging failure shouldn't block login
  }
}

/**
 * Create active session
 */
async function createSession(userId, token, req, expiresAt) {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const { browser, os, device } = parseUserAgent(userAgent);
    const { location, country } = getLocationFromIP(ipAddress);
    const tokenHash = hashToken(token);

    const session = await ActiveSession.create({
      userId,
      token: tokenHash,
      ipAddress,
      userAgent,
      browser,
      os,
      device,
      location,
      country,
      expiresAt,
      createdAt: new Date(),
      lastActive: new Date()
    });

    console.log(`Active session created: User ${userId}, Session ${session.id}`);
    return session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Update session activity
 */
async function updateSessionActivity(token) {
  try {
    const tokenHash = hashToken(token);
    
    await ActiveSession.update(
      { lastActive: new Date() },
      { where: { token: tokenHash } }
    );
  } catch (error) {
    console.error('Error updating session activity:', error);
    // Don't throw - activity update failure shouldn't block requests
  }
}

/**
 * Remove session (logout)
 */
async function removeSession(token) {
  try {
    const tokenHash = hashToken(token);
    
    await ActiveSession.destroy({
      where: { token: tokenHash }
    });

    console.log('Session removed');
  } catch (error) {
    console.error('Error removing session:', error);
    throw error;
  }
}

/**
 * Remove all sessions for a user (logout from all devices)
 */
async function removeAllUserSessions(userId) {
  try {
    const result = await ActiveSession.destroy({
      where: { userId }
    });

    console.log(`Removed ${result} sessions for user ${userId}`);
    return result;
  } catch (error) {
    console.error('Error removing user sessions:', error);
    throw error;
  }
}

/**
 * Get user's login history
 */
async function getLoginHistory(userId, limit = 10) {
  try {
    const history = await LoginHistory.findAll({
      where: { userId },
      order: [['loginAt', 'DESC']],
      limit,
      raw: true
    });

    return history;
  } catch (error) {
    console.error('Error fetching login history:', error);
    throw error;
  }
}

/**
 * Get user's active sessions
 */
async function getActiveSessions(userId) {
  try {
    const sessions = await ActiveSession.findAll({
      where: { userId },
      order: [['lastActive', 'DESC']],
      raw: true
    });

    return sessions;
  } catch (error) {
    console.error('Error fetching active sessions:', error);
    throw error;
  }
}

/**
 * Clean up expired sessions
 */
async function cleanupExpiredSessions() {
  try {
    const result = await ActiveSession.destroy({
      where: {
        expiresAt: {
          [require('sequelize').Op.lt]: new Date()
        }
      }
    });

    if (result > 0) {
      console.log(`Cleaned up ${result} expired sessions`);
    }
    
    return result;
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    throw error;
  }
}

module.exports = {
  logLoginAttempt,
  createSession,
  updateSessionActivity,
  removeSession,
  removeAllUserSessions,
  getLoginHistory,
  getActiveSessions,
  cleanupExpiredSessions,
  parseUserAgent,
  getLocationFromIP
};
