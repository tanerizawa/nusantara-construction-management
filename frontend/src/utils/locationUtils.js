/**
 * Utility functions for formatting location objects
 */

/**
 * Format location object to display string
 * @param {Object} location - Location object with city, address, province properties
 * @param {string} fallback - Fallback text when location is empty
 * @returns {string} Formatted location string
 */
export const formatLocation = (location, fallback = 'Lokasi belum ditentukan') => {
  if (!location || typeof location !== 'object') {
    return fallback;
  }

  const city = location.city?.trim();
  const address = location.address?.trim();
  const province = location.province?.trim();
  const state = location.state?.trim();

  // Check if any location field has value
  if (city || address || province || state) {
    // Create location string based on available fields
    const parts = [];
    if (city) parts.push(city);
    if (state || province) parts.push(state || province);
    
    return parts.join(', ') || address || fallback;
  }

  return fallback;
};

/**
 * Format full address from location object
 * @param {Object} location - Location object
 * @param {string} fallback - Fallback text when address is empty
 * @returns {string} Formatted address string
 */
export const formatAddress = (location, fallback = 'Alamat belum ditentukan') => {
  if (!location || typeof location !== 'object') {
    return fallback;
  }

  const address = location.address?.trim();
  const city = location.city?.trim();
  const province = location.province?.trim();
  const state = location.state?.trim();
  const postalCode = location.postalCode?.trim();

  const parts = [];
  if (address) parts.push(address);
  if (city) parts.push(city);
  if (state || province) parts.push(state || province);
  if (postalCode) parts.push(postalCode);

  return parts.length > 0 ? parts.join(', ') : fallback;
};

/**
 * Safe render function for handling various data types including location objects
 * @param {any} value - Value to render
 * @param {string} fallback - Fallback text
 * @returns {string} Safe string representation
 */
export const safeRender = (value, fallback = '-') => {
  if (value === null || value === undefined) return fallback;
  
  if (typeof value === 'object') {
    // Handle location objects specifically
    if (value.city !== undefined || value.address !== undefined || value.province !== undefined) {
      return formatLocation(value, fallback);
    }
    
    // Handle other objects
    if (value.name && value.name.trim()) return value.name.trim();
    
    // For complex objects, try to find a meaningful display value
    const displayKeys = ['title', 'label', 'description', 'text'];
    for (const key of displayKeys) {
      if (value[key] && typeof value[key] === 'string' && value[key].trim()) {
        return value[key].trim();
      }
    }
    
    // Last resort: JSON string
    return JSON.stringify(value);
  }
  
  return String(value);
};