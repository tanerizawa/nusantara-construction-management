import React from 'react';
import Table from '../Table';
import { useTranslation } from '../../../../i18n';

const UserTable = ({ data, columns, onViewProfile, onEdit, ...props }) => {
  const { ui } = useTranslation();
  
  return (
    <Table
      data={data}
      columns={columns}
      variant="user"
      actions={[
        {
          label: ui.table.actions.view,
          onClick: onViewProfile,
          color: 'blue',
        },
        {
          label: ui.table.actions.edit,
          onClick: onEdit,
          color: 'amber',
        },
      ]}
      {...props}
    />
  );
};

export { UserTable };