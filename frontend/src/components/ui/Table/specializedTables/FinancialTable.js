import React from 'react';
import Table from '../Table';

const FinancialTable = ({ data, columns, onViewDetails, onExport, ...props }) => {
  return (
    <Table
      data={data}
      columns={columns}
      variant="financial"
      actions={[
        {
          label: 'View Details',
          onClick: onViewDetails,
          color: 'blue',
        },
        {
          label: 'Export',
          onClick: onExport,
          color: 'green',
        },
      ]}
      {...props}
    />
  );
};

export { FinancialTable };