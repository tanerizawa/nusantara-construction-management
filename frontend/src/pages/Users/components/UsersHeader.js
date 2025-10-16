import React from 'react';
import { useTranslation } from '../../../i18n';

/**
 * Users page header component
 */
const UsersHeader = ({ count }) => {
  const { users } = useTranslation();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{users.title}</h1>
        <p className="text-gray-600">{users.subtitle}</p>
      </div>
      <div className="text-sm text-gray-500">{users.userCount.replace('{count}', count)}</div>
    </div>
  );
};

export default UsersHeader;