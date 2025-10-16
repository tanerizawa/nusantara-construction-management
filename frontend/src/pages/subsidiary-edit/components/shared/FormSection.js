import React from 'react';

const FormSection = ({ title, icon: Icon, children, className = '' }) => {
  return (
    <div className={`bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6 ${className}`}>
      {title && (
        <div className="flex items-center mb-6">
          {Icon && <Icon className="w-5 h-5 text-[#0A84FF] mr-3" />}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default FormSection;