import React from 'react';
import Table from '../Table';

const ProjectTable = ({ data, columns, onViewDetails, onEdit, ...props }) => {
  return (
    <Table
      data={data}
      columns={columns}
      variant="project"
      actions={[
        {
          label: 'View Details',
          onClick: onViewDetails,
          color: 'blue',
        },
        {
          label: 'Edit',
          onClick: onEdit,
          color: 'amber',
        },
      ]}
      {...props}
    />
  );
};

export { ProjectTable };