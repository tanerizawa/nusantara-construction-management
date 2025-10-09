/**
 * Format tanggal ke format Indonesia
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * Format currency ke format Rupiah
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '-';
  
  try {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '-';
  }
};

/**
 * Format percentage
 */
export const formatPercentage = (value) => {
  if (!value && value !== 0) return '0%';
  return `${value}%`;
};

/**
 * Generate BA number format
 */
export const generateBANumber = (projectCode, sequence) => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const seq = String(sequence).padStart(3, '0');
  
  return `BA/${projectCode}/${year}${month}/${seq}`;
};

/**
 * Parse BA number to get components
 */
export const parseBANumber = (baNumber) => {
  if (!baNumber) return null;
  
  const parts = baNumber.split('/');
  if (parts.length < 4) return null;
  
  return {
    prefix: parts[0],
    projectCode: parts[1],
    yearMonth: parts[2],
    sequence: parts[3]
  };
};
