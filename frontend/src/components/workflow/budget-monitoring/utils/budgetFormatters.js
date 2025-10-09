/**
 * Format currency to IDR format
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Rp 0';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Format large numbers with suffixes (K, M, B)
 */
export const formatCompactNumber = (value) => {
  if (!value && value !== 0) return '0';
  
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  
  return value.toString();
};
