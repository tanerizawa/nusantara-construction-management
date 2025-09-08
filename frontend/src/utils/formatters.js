// Currency formatter for Indonesian Rupiah
export const formatCurrency = (amount, options = {}) => {
  const {
    currency = 'IDR',
    locale = 'id-ID',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    compact = false,
  } = options;

  if (compact && Math.abs(amount) >= 1000000000) {
    const billions = amount / 1000000000;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(billions) + 'B';
  }

  if (compact && Math.abs(amount) >= 1000000) {
    const millions = amount / 1000000;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(millions) + 'M';
  }

  if (compact && Math.abs(amount) >= 1000) {
    const thousands = amount / 1000;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(thousands) + 'K';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
};

// Number formatter
export const formatNumber = (number, options = {}) => {
  const {
    locale = 'id-ID',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  if (compact && Math.abs(number) >= 1000000000) {
    const billions = number / 1000000000;
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(billions) + 'B';
  }

  if (compact && Math.abs(number) >= 1000000) {
    const millions = number / 1000000;
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(millions) + 'M';
  }

  if (compact && Math.abs(number) >= 1000) {
    const thousands = number / 1000;
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(thousands) + 'K';
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(number);
};

// Percentage formatter
export const formatPercentage = (value, options = {}) => {
  const {
    locale = 'id-ID',
    minimumFractionDigits = 1,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value / 100);
};

// Date formatter for Indonesian locale
export const formatDate = (date, options = {}) => {
  const {
    locale = 'id-ID',
    format = 'short', // 'short', 'medium', 'long', 'full'
  } = options;

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const formats = {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    full: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  };

  return new Intl.DateTimeFormat(locale, formats[format]).format(dateObj);
};

// Time formatter
export const formatTime = (date, options = {}) => {
  const {
    locale = 'id-ID',
    hour12 = false,
  } = options;

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12,
  }).format(dateObj);
};

// Relative time formatter (e.g., "2 hours ago")
export const formatRelativeTime = (date, options = {}) => {
  const {
    locale = 'id-ID',
  } = options;

  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-interval, unit);
    }
  }

  return 'just now';
};

// File size formatter
export const formatFileSize = (bytes, options = {}) => {
  const {
    locale = 'id-ID',
    binary = false, // true for 1024-based, false for 1000-based
  } = options;

  const base = binary ? 1024 : 1000;
  const units = binary 
    ? ['B', 'KiB', 'MiB', 'GiB', 'TiB']
    : ['B', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 B';

  const exponent = Math.floor(Math.log(bytes) / Math.log(base));
  const value = bytes / Math.pow(base, exponent);
  const unit = units[exponent];

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: exponent === 0 ? 0 : 1,
  }).format(value) + ' ' + unit;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Format account number with masking
export const formatAccountNumber = (accountNumber, maskLength = 4) => {
  if (!accountNumber) return '';
  const str = accountNumber.toString();
  if (str.length <= maskLength * 2) return str;
  
  const start = str.substring(0, maskLength);
  const end = str.substring(str.length - maskLength);
  const masked = '*'.repeat(str.length - maskLength * 2);
  
  return `${start}${masked}${end}`;
};

// Format Indonesian phone number
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check for Indonesian format
  if (cleaned.startsWith('62')) {
    // International format: +62
    const number = cleaned.substring(2);
    if (number.length >= 9) {
      return `+62 ${number.substring(0, 3)} ${number.substring(3, 7)} ${number.substring(7)}`;
    }
  } else if (cleaned.startsWith('0')) {
    // Domestic format: 0
    if (cleaned.length >= 10) {
      return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 8)} ${cleaned.substring(8)}`;
    }
  }
  
  return phoneNumber;
};

// Format Indonesian postal code
export const formatPostalCode = (postalCode) => {
  if (!postalCode) return '';
  const cleaned = postalCode.replace(/\D/g, '');
  if (cleaned.length === 5) {
    return cleaned;
  }
  return postalCode;
};
