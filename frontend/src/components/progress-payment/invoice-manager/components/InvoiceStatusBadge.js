import React from 'react';
import { STATUS_CONFIG } from '../config/invoiceConfig';

/**
 * Invoice Status Badge Component
 */
const InvoiceStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.generated;
  const { color, label } = config;
  
  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>
      {label}
    </span>
  );
};

export default InvoiceStatusBadge;