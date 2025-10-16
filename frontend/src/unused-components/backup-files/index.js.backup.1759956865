/**
 * Utility functions untuk sidebar
 * (Reserved for future use)
 */

export const formatProjectLocation = (location) => {
  if (typeof location === 'object' && location) {
    const parts = [
      location.address,
      location.city,
      location.province
    ].filter(Boolean);
    
    return parts.join(', ') || 'Project Location';
  }
  return location || 'Project Location';
};
