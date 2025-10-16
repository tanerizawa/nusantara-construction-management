import React from 'react';
import PageActions from '../../../components/PageActions';
import { Plus } from 'lucide-react';
import { STATUS_FILTERS, SORT_OPTIONS } from '../utils';

/**
 * Component for managing tax data filtering, sorting, and actions
 * @param {Object} props Component props
 * @param {string} props.searchTerm Current search term
 * @param {Function} props.setSearchTerm Function to set search term
 * @param {string} props.statusFilter Current status filter
 * @param {Function} props.setStatusFilter Function to set status filter
 * @param {string} props.sortBy Current sort field
 * @param {string} props.sortOrder Current sort order
 * @param {Function} props.handleSortChange Function to handle sort change
 * @param {boolean} props.compact Whether to use compact view
 * @param {Function} props.setCompact Function to set compact view
 * @returns {JSX.Element} Tax actions UI
 */
const TaxActions = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortBy,
  sortOrder,
  handleSortChange,
  compact,
  setCompact
}) => {
  return (
    <PageActions
      searchPlaceholder="Cari deskripsi, referensi, atau jenis pajak..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      filters={[
        {
          id: 'status',
          label: 'Status',
          value: statusFilter,
          onChange: setStatusFilter,
          options: STATUS_FILTERS
        }
      ]}
      sortOptions={SORT_OPTIONS}
      sortValue={`${sortBy}:${sortOrder}`}
      onSortChange={handleSortChange}
      compact={compact}
      onCompactChange={setCompact}
      right={(<button className="btn-primary"><Plus size={20} className="mr-2" />Tambah Pajak</button>)}
    />
  );
};

export default TaxActions;