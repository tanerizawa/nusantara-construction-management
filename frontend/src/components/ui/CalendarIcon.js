import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

/**
 * CalendarIconWhite Component - Calendar icon yang selalu putih di dark mode
 * 
 * Component ini memastikan icon calendar terlihat jelas di dark theme
 * dengan memberikan warna putih secara eksplisit.
 * 
 * @param {object} props - Component props (diteruskan ke lucide-react Calendar)
 * @param {string|number} props.size - Ukuran icon (default: 16)
 * @param {string} props.className - Additional CSS classes
 */
export const CalendarIconWhite = ({ 
  size = 16, 
  className = '', 
  ...props 
}) => {
  return (
    <CalendarIcon
      size={size}
      className={`text-gray-700 dark:text-white ${className}`}
      {...props}
    />
  );
};

/**
 * DateInputWithIcon Component - Input date dengan icon calendar yang jelas
 * 
 * Features:
 * - Icon calendar berwarna putih di dark mode
 * - Tidak mengubah styling input yang sudah ada
 * - Hanya menambahkan icon di dalam input
 * 
 * @param {object} props - Component props
 * @param {string} props.value - Date value (YYYY-MM-DD)
 * @param {function} props.onChange - Callback ketika date berubah
 * @param {string} props.className - CSS classes untuk input (dipertahankan)
 * @param {object} props.style - Inline styles untuk input (dipertahankan)
 */
export const DateInputWithIcon = ({ 
  value, 
  onChange, 
  className = '',
  style = {},
  disabled = false,
  ...props 
}) => {
  return (
    <div className="relative">
      {/* Icon calendar - putih untuk visibility di dark mode */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
        <CalendarIconWhite size={18} className="text-white" />
      </div>
      {/* Input dengan text putih untuk dark mode */}
      <input
        type="date"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`pl-11 ${className}`}
        style={{
          colorScheme: 'dark',
          color: '#FFFFFF', // Force white text color
          WebkitTextFillColor: '#FFFFFF', // Override webkit styling
          ...style
        }}
        {...props}
      />
    </div>
  );
};

export default CalendarIconWhite;
