import React from 'react';
import { Plus } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { USER_ROLES } from '../utils/constants';
import { useTranslation } from '../../../i18n';

/**
 * Component for search and filter bar
 */
const UserSearchBar = ({ searchTerm, roleFilter, onSearchChange, onRoleFilterChange }) => {
  const { users } = useTranslation();
  
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder={users.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input-base w-80"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="input-base w-48"
          >
            <option value="">{users.allRoles}</option>
            {USER_ROLES.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus />}
        >
          {users.newUser}
        </Button>
      </div>
    </Card>
  );
};

export default UserSearchBar;