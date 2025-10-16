// Chart configuration

// Chart style constants
export const CHART_STYLES = {
  containerBg: 'bg-white',
  containerBgDark: 'bg-gray-900',
  headerBg: 'bg-gray-50',
  headerBgDark: 'bg-gray-800',
  textPrimary: 'text-gray-900',
  textPrimaryDark: 'text-white',
  textSecondary: 'text-gray-500',
  textSecondaryDark: 'text-gray-400',
  border: 'border border-gray-200',
  borderDark: 'border border-gray-700',
  shadow: 'shadow-md',
  radius: 'rounded-lg',
};

// Chart colors
export const CHART_COLORS = {
  primary: {
    default: '#3B82F6', // blue-500
    light: '#93C5FD',   // blue-300
    dark: '#1E40AF',    // blue-800
  },
  success: {
    default: '#10B981', // green-500
    light: '#6EE7B7',   // green-300
    dark: '#065F46',    // green-800
  },
  warning: {
    default: '#F59E0B', // amber-500
    light: '#FCD34D',   // amber-300
    dark: '#92400E',    // amber-800
  },
  danger: {
    default: '#EF4444', // red-500
    light: '#FCA5A5',   // red-300
    dark: '#991B1B',    // red-800
  },
  info: {
    default: '#0EA5E9', // sky-500
    light: '#7DD3FC',   // sky-300
    dark: '#0C4A6E',    // sky-800
  },
};

// Format options
export const CHART_FORMAT_OPTIONS = {
  currency: {
    locale: 'id-ID',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
  percent: {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  },
  date: {
    locale: 'id-ID',
    dateStyle: 'medium',
  },
  shortDate: {
    locale: 'id-ID',
    day: 'numeric',
    month: 'short',
  },
};

// Chart animation durations
export const CHART_ANIMATIONS = {
  fast: 300,
  default: 500,
  slow: 800,
};

// Chart icon sizes
export const CHART_ICON_SIZES = {
  small: 16,
  medium: 20,
  large: 24,
};

export default {
  CHART_STYLES,
  CHART_COLORS,
  CHART_FORMAT_OPTIONS,
  CHART_ANIMATIONS,
  CHART_ICON_SIZES,
};