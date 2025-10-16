import React from 'react';
import Table from '../Table';

const ReportTable = ({ data, columns, onView, onExport, ...props }) => {
  return (
    <Table
      data={data}
      columns={columns}
      variant="report"
      actions={[
        {
          label: 'View',
          onClick: onView,
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

export { ReportTable };