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
    <div className="rounded-2xl border border-[#FF453A]/30 bg-[#FF453A]/10 px-4 py-3 flex items-center justify-between backdrop-blur-xl">
      <span className="text-[#FF453A]">{error}</span>
      <button onClick={onDismiss} className="p-1 text-[#FF453A] hover:bg-[#FF453A]/10 rounded-lg transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ErrorAlert;