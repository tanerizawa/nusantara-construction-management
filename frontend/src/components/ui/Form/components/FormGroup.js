// FormGroup.js - Modular composite for grouping form fields
import React from 'react';

const FormGroup = ({ children, className = '' }) => (
  <div className={`flex flex-wrap gap-4 ${className}`}>
    {children}
  </div>
);

export { FormGroup };
export default FormGroup;
