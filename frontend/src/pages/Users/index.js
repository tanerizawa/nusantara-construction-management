import React from 'react';
import UsersHeader from './components/UsersHeader';
import UserSearchBar from './components/UserSearchBar';
import UsersList from './components/UsersList';
import UsersStats from './components/UsersStats';
import { useUsers } from './hooks/useUsers';
import { useTranslation } from '../../i18n';

/**
 * Main Users component
 * Container for user management functionality
 */
const Users = () => {
  const { users: userTranslations } = useTranslation();
  const {
    users,
    loading,
    searchTerm,
    roleFilter,
    stats,
    page,
    serverPagination,
    setSearchTerm,
    setRoleFilter,
    setPage,
    handleEditUser,
    handleResetPassword,
    handleToggleStatus
  } = useUsers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <UsersHeader count={serverPagination.count} />
      
      {/* Search and Filters */}
      <UserSearchBar 
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        onSearchChange={setSearchTerm}
        onRoleFilterChange={setRoleFilter}
      />
      
      {/* Users Table */}
      <UsersList
        users={users}
        loading={loading}
        page={page}
        pagination={serverPagination}
        onPageChange={setPage}
        onEdit={handleEditUser}
        onResetPassword={handleResetPassword}
        onToggleStatus={handleToggleStatus}
      />
      
      {/* Stats Cards */}
      <UsersStats stats={stats} serverCount={serverPagination.count} />
    </div>
  );
};

export default Users;