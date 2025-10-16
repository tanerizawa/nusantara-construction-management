// FormActions.js - Modular composite for form action buttons
import React from 'react';

const FormActions = ({ children, className = '' }) => (
  <div className={`flex items-center gap-2 mt-4 ${className}`}>
    {children}
  </div>
);

export { FormActions };
export default FormActions;
