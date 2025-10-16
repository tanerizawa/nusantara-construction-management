/**
 * RAB Calculation Utilities
 */

export const calculateItemTotal = (quantity, unitPrice) => {
  return parseFloat(quantity || 0) * parseFloat(unitPrice || 0);
};

export const calculateTotalRAB = (rabItems) => {
  return rabItems.reduce((total, item) => {
    return total + (item.quantity * item.unitPrice);
  }, 0);
};

export const calculateCategoryBreakdown = (rabItems) => {
  const breakdown = {};
  const categories = ['Material', 'Tenaga Kerja', 'Peralatan', 'Subkontraktor', 'Overhead'];
  
  categories.forEach(category => {
    const categoryItems = rabItems.filter(item => item.category === category);
    const categoryTotal = categoryItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    
    breakdown[category] = categoryTotal;
  });
  
  return breakdown;
};

export const calculateCategoryPercentage = (categoryTotal, totalRAB) => {
  if (totalRAB === 0) return 0;
  return ((categoryTotal / totalRAB) * 100).toFixed(1);
};

export const getUniqueCategories = (rabItems) => {
  return new Set(rabItems.map(item => item.category)).size;
};
