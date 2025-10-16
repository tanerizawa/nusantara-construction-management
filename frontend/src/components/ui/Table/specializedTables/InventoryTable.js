import React from 'react';
import Table from '../Table';

const InventoryTable = ({ data, columns, onUpdate, onDelete, ...props }) => {
  return (
    <Table
      data={data}
      columns={columns}
      variant="inventory"
      actions={[
        {
          label: 'Update',
          onClick: onUpdate,
          color: 'blue',
        },
        {
          label: 'Delete',
          onClick: onDelete,
          color: 'red',
        },
      ]}
      {...props}
    />
  );
};

export { InventoryTable };