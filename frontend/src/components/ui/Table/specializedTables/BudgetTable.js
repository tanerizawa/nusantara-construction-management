import React from 'react';
import Table from '../Table';

const BudgetTable = ({ data, columns, onAllocate, onView, ...props }) => {
  return (
    <Table
      data={data}
      columns={columns}
      variant="budget"
      actions={[
        {
          label: 'Allocate',
          onClick: onAllocate,
          color: 'green',
        },
        {
          label: 'View',
          onClick: onView,
          color: 'blue',
        },
      ]}
      {...props}
    />
  );
};

export { BudgetTable };