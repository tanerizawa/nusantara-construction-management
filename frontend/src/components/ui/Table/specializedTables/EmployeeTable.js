import React from 'react';
import Table from '../Table';

const EmployeeTable = ({ data, columns, onViewProfile, onAssign, ...props }) => {
  return (
    <Table
      data={data}
      columns={columns}
      variant="employee"
      actions={[
        {
          label: 'View Profile',
          onClick: onViewProfile,
          color: 'blue',
        },
        {
          label: 'Assign',
          onClick: onAssign,
          color: 'green',
        },
      ]}
      {...props}
    />
  );
};

export { EmployeeTable };