import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './Input';
import { usePasswordStrength } from '../hooks/useForm';
import { PASSWORD_STRENGTH } from '../config/formConfig';

export const PasswordInput = forwardRef(({
  label = 'Password',
  placeholder = 'Masukkan password',
  showStrength = false,
  showToggle = true,
  value,
  onChange,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = usePasswordStrength(value);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getStrengthColor = () => {
    const level = passwordStrength.level;
    return level ? level.color : 'bg-gray-200';
  };

  const getStrengthText = () => {
    const level = passwordStrength.level;
    return level ? level.label : '';
  };

  const getStrengthTextColor = () => {
    const level = passwordStrength.level;
    return level ? level.textColor : 'text-gray-500';
  };

  return (
    <div>
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rightIcon={
          showToggle && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )
        }
        {...props}
      />
      
      {/* Password Strength Indicator */}
      {showStrength && value && (
        <div className="mt-3">
          <div className="flex items-center space-x-3">
            {/* Strength Bar */}
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
              />
            </div>
            
            {/* Strength Text */}
            <span className={`text-sm font-medium ${getStrengthTextColor()}`}>
              {getStrengthText()}
            </span>
          </div>
          
          {/* Password Rules */}
          {passwordStrength.errors.length > 0 && (
            <div className="mt-2 space-y-1">
              {passwordStrength.errors.map((error, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}
          
          {passwordStrength.passed.length > 0 && (
            <div className="mt-2 space-y-1">
              {passwordStrength.passed.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs text-green-600">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>
                    {PASSWORD_STRENGTH.rules[rule]?.message || 'Memenuhi persyaratan'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';