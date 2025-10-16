import React from 'react';

const FieldGroup = ({ children, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
};

export default FieldGroup;