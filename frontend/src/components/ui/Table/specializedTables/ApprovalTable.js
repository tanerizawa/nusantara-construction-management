import React from 'react';
import Table from '../Table';

const ApprovalTable = ({ data, columns, onApprove, onReject, ...props }) => {
  return (
    <Table
      data={data}
      columns={columns}
      variant="approval"
      actions={[
        {
          label: 'Approve',
          onClick: onApprove,
          color: 'green',
        },
        {
          label: 'Reject',
          onClick: onReject,
          color: 'red',
        },
      ]}
      {...props}
    />
  );
};

export { ApprovalTable };