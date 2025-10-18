/**
 * User Agent Parser Utility
 * Parses user agent string to extract browser, OS, and device information
 * Lightweight alternative to ua-parser-js to avoid additional dependencies
 */

const parseUserAgent = (userAgent) => {
  if (!userAgent) {
    return {
      browser: 'Unknown',
      os: 'Unknown',
      device: 'Unknown'
    };
  }

  // Detect Browser
  let browser = 'Unknown';
  if (userAgent.includes('Edg/')) {
    browser = 'Microsoft Edge';
  } else if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/')) {
    browser = 'Google Chrome';
  } else if (userAgent.includes('Firefox/')) {
    browser = 'Mozilla Firefox';
  } else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) {
    browser = 'Safari';
  } else if (userAgent.includes('Opera/') || userAgent.includes('OPR/')) {
    browser = 'Opera';
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
    browser = 'Internet Explorer';
  }

  // Detect Operating System
  let os = 'Unknown';
  if (userAgent.includes('Windows NT 10.0')) {
    os = 'Windows 10';
  } else if (userAgent.includes('Windows NT 6.3')) {
    os = 'Windows 8.1';
  } else if (userAgent.includes('Windows NT 6.2')) {
    os = 'Windows 8';
  } else if (userAgent.includes('Windows NT 6.1')) {
    os = 'Windows 7';
  } else if (userAgent.includes('Mac OS X')) {
    os = 'macOS';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
  }

  // Detect Device Type
  let device = 'Desktop';
  if (userAgent.includes('Mobile') || userAgent.includes('Android')) {
    device = 'Mobile';
  } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
    device = 'Tablet';
  }

  return {
    browser,
    os,
    device
  };
};

module.exports = {
  parseUserAgent
};
