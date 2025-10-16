import React from 'react';
import { X } from 'lucide-react';

/**
 * Error alert component
 * @param {string} error - Error message
 * @param {Function} onDismiss - Click handler for dismiss button
 * @returns {JSX.Element|null} Error alert or null if no error
 */
const ErrorAlert = ({ error, onDismiss }) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center justify-between">
      <span>{error}</span>
      <button onClick={onDismiss} className="text-red-400 hover:text-red-300">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ErrorAlert;