import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * AlertMessage component for displaying success or error messages
 * 
 * @param {object} props - Component props
 * @param {string} props.type - The type of message ('success' or 'error')
 * @param {string} props.message - The message text to display
 * @returns {JSX.Element|null} AlertMessage component or null if no message
 */
const AlertMessage = ({ type, message }) => {
  if (!message) return null;

  if (type === 'success') {
    return (
      <div 
        style={{
          backgroundColor: '#30D158',
          opacity: 0.1,
          border: '1px solid rgba(48, 209, 88, 0.3)'
        }}
        className="mb-6 rounded-lg p-4 relative"
      >
        <div 
          style={{ backgroundColor: 'transparent', opacity: 1 }}
          className="flex items-center absolute inset-0 p-4"
        >
          <CheckCircle className="w-5 h-5 text-[#30D158] mr-3 flex-shrink-0" />
          <p className="text-sm font-medium text-[#30D158]">
            {message}
          </p>
        </div>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div 
        style={{
          backgroundColor: '#FF3B30',
          opacity: 0.1,
          border: '1px solid rgba(255, 59, 48, 0.3)'
        }}
        className="mb-6 rounded-lg p-4 relative"
      >
        <div 
          style={{ backgroundColor: 'transparent', opacity: 1 }}
          className="flex items-center absolute inset-0 p-4"
        >
          <AlertTriangle className="w-5 h-5 text-[#FF3B30] mr-3 flex-shrink-0" />
          <p className="text-sm font-medium text-[#FF3B30]">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default AlertMessage;