const axios = require('axios');

/**
 * IP Geolocation Utility
 * Uses free ipapi.co service (up to 1000 requests/day)
 * Fallback to ip-api.com if needed
 */

/**
 * Get location from IP address
 * @param {string} ipAddress - IP address to lookup
 * @returns {Promise<Object>} Location data
 */
const getLocationFromIP = async (ipAddress) => {
  // Skip for local/private IPs
  if (!ipAddress || 
      ipAddress === '127.0.0.1' || 
      ipAddress === 'localhost' ||
      ipAddress === '::1' ||
      ipAddress.startsWith('192.168.') ||
      ipAddress.startsWith('10.') ||
      ipAddress.startsWith('172.16.')) {
    return {
      location: 'Local Network',
      country: null,
      city: null
    };
  }

  try {
    // Try ipapi.co first (more reliable, 1000 req/day free)
    const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`, {
      timeout: 3000 // 3 second timeout
    });

    if (response.data && response.data.city) {
      return {
        location: `${response.data.city}, ${response.data.country_name}`,
        country: response.data.country_code,
        city: response.data.city,
        region: response.data.region
      };
    }
  } catch (error) {
    console.warn('ipapi.co failed, trying fallback:', error.message);
    
    // Fallback to ip-api.com (15000 req/hour free)
    try {
      const fallbackResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`, {
        timeout: 3000
      });

      if (fallbackResponse.data && fallbackResponse.data.status === 'success') {
        return {
          location: `${fallbackResponse.data.city}, ${fallbackResponse.data.country}`,
          country: fallbackResponse.data.countryCode,
          city: fallbackResponse.data.city,
          region: fallbackResponse.data.regionName
        };
      }
    } catch (fallbackError) {
      console.error('Both geolocation services failed:', fallbackError.message);
    }
  }

  // If all fails, return unknown
  return {
    location: 'Unknown',
    country: null,
    city: null
  };
};

/**
 * Get client IP from request
 * Handles various proxy headers
 * @param {Object} req - Express request object
 * @returns {string} Client IP address
 */
const getClientIP = (req) => {
  // Check various headers in order of reliability
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }

  return req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         req.ip ||
         '127.0.0.1';
};

module.exports = {
  getLocationFromIP,
  getClientIP
};
