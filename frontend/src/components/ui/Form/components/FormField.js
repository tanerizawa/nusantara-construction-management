// FormField.js - Modular composite for form field wrapper
import React from 'react';

const FormField = ({ label, htmlFor, children, error, required }) => (
  <div className="mb-4">
    {label && (
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    {children}
    {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
  </div>
);

export { FormField };
export default FormField;
