import React from 'react';
import { UserTable } from '../../../components/ui/Table';
import { Pagination } from '../../../components/ui/Pagination';
import PageLoader from '../../../components/ui/PageLoader';
import { DataCard } from '../../../components/ui/Card';
import { useTranslation } from '../../../i18n';

/**
 * Component for displaying users list and pagination
 */
const UsersList = ({ 
  users, 
  loading, 
  page, 
  pagination, 
  onPageChange, 
  onEdit,
  onResetPassword,
  onToggleStatus
}) => {
  const { users: usersTranslations } = useTranslation();
  
  // Show loader while fetching data
  if (loading) {
    return <PageLoader size="lg" />;
  }

  return (
    <>
      {/* Users Table */}
      <UserTable 
        data={users}
        onEdit={onEdit}
        onResetPassword={onResetPassword}
        onToggleStatus={onToggleStatus}
      />

      {/* Empty State */}
      {users.length === 0 && (
        <DataCard
          title={usersTranslations.noResults.title}
          subtitle={usersTranslations.noResults.subtitle}
        />
      )}

      {/* Pagination */}
      {pagination.count > 0 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.total}
          onPageChange={onPageChange}
          showInfo={true}
          totalItems={pagination.count}
          itemsPerPage={20}
        />
      )}
    </>
  );
};

export default UsersList;