import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ValidationMessage = ({ message, type = 'error' }) => {
  if (!message) return null;

  const getStyles = () => {
    switch (type) {
      case 'error':
        return 'text-[#FF453A] bg-[#FF453A]/10 border-[#FF453A]/30';
      case 'warning':
        return 'text-[#FF9F0A] bg-[#FF9F0A]/10 border-[#FF9F0A]/30';
      case 'success':
        return 'text-[#30D158] bg-[#30D158]/10 border-[#30D158]/30';
      default:
        return 'text-[#FF453A] bg-[#FF453A]/10 border-[#FF453A]/30';
    }
  };

  return (
    <div className={`flex items-center mt-1 px-2 py-1 rounded text-xs border ${getStyles()}`}>
      <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default ValidationMessage;