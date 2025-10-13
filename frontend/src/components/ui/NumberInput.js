import React, { useState, useEffect } from 'react';

/**
 * NumberInput Component - Input angka dengan format separator ribuan (titik)
 * 
 * Features:
 * - Auto format angka dengan titik sebagai separator (1.000.000)
 * - Support decimal dengan koma (1.000,50)
 * - Real-time formatting saat user mengetik
 * - Compatible dengan dark theme
 * 
 * @param {object} props - Component props
 * @param {number|string} props.value - Nilai number (tanpa format)
 * @param {function} props.onChange - Callback ketika value berubah
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.allowDecimal - Izinkan decimal (default: false)
 * @param {number} props.maxDecimal - Max decimal places (default: 2)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disabled state
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 */
export const NumberInput = ({ 
  value = '', 
  onChange, 
  placeholder = '0',
  allowDecimal = false,
  maxDecimal = 2,
  className = '',
  disabled = false,
  min,
  max,
  ...props 
}) => {
  const [displayValue, setDisplayValue] = useState('');

  // Format number ke display string (dengan titik)
  const formatNumber = (num) => {
    if (!num && num !== 0) return '';
    
    const numStr = num.toString().replace(/\./g, '').replace(/,/g, '.');
    const parts = numStr.split('.');
    
    // Format bagian integer dengan titik sebagai separator
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Jika ada decimal
    if (allowDecimal && parts.length > 1) {
      const decimalPart = parts[1].slice(0, maxDecimal);
      return `${integerPart},${decimalPart}`;
    }
    
    return integerPart;
  };

  // Parse display string ke raw number
  const parseNumber = (str) => {
    if (!str) return '';
    
    // Remove dots (thousand separator) and replace comma with dot
    const cleaned = str.replace(/\./g, '').replace(/,/g, '.');
    const num = parseFloat(cleaned);
    
    return isNaN(num) ? '' : num;
  };

  // Update display value ketika prop value berubah
  useEffect(() => {
    setDisplayValue(formatNumber(value));
  }, [value]);

  const handleChange = (e) => {
    let input = e.target.value;
    
    // Allow empty
    if (input === '') {
      setDisplayValue('');
      onChange && onChange('');
      return;
    }

    // Remove any character that is not digit, dot, or comma
    input = input.replace(/[^\d.,]/g, '');
    
    // If decimal not allowed, remove comma
    if (!allowDecimal) {
      input = input.replace(/,/g, '');
    }
    
    // Parse to number
    const rawValue = parseNumber(input);
    
    // Check min/max
    if (min !== undefined && rawValue < min) return;
    if (max !== undefined && rawValue > max) return;
    
    // Format and set display value
    const formatted = formatNumber(rawValue);
    setDisplayValue(formatted);
    
    // Send raw number value to parent
    onChange && onChange(rawValue);
  };

  const handleBlur = () => {
    // Re-format on blur to ensure consistency
    if (displayValue) {
      const rawValue = parseNumber(displayValue);
      setDisplayValue(formatNumber(rawValue));
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      {...props}
    />
  );
};

/**
 * CurrencyInput Component - Input untuk mata uang dengan prefix Rp
 */
export const CurrencyInput = ({ 
  value, 
  onChange, 
  placeholder = 'Rp 0',
  className = '',
  ...props 
}) => {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
        Rp
      </span>
      <NumberInput
        value={value}
        onChange={onChange}
        placeholder={placeholder.replace('Rp ', '')}
        className={`pl-12 ${className}`}
        {...props}
      />
    </div>
  );
};

/**
 * QuantityInput Component - Input untuk qty/quantity
 */
export const QuantityInput = ({ 
  value, 
  onChange, 
  placeholder = '0',
  className = '',
  ...props 
}) => {
  return (
    <NumberInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      allowDecimal={true}
      maxDecimal={2}
      className={className}
      {...props}
    />
  );
};

/**
 * PercentageInput Component - Input untuk persentase dengan suffix %
 */
export const PercentageInput = ({ 
  value, 
  onChange, 
  placeholder = '0',
  className = '',
  ...props 
}) => {
  return (
    <div className="relative">
      <NumberInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        allowDecimal={true}
        maxDecimal={2}
        min={0}
        max={100}
        className={`pr-10 ${className}`}
        {...props}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
        %
      </span>
    </div>
  );
};

export default NumberInput;
