import React from 'react';
import { FileText } from 'lucide-react';
import { DataEmpty } from '../../../components/DataStates';

/**
 * Component for displaying empty tax data state
 * @param {Object} props Component props
 * @param {boolean} props.hasFilters Whether filters are applied
 * @returns {JSX.Element} Empty state UI
 */
const EmptyState = ({ hasFilters }) => {
  return (
    <DataEmpty
      icon={FileText}
      title={hasFilters ? 'Tidak ada data pajak yang ditemukan' : 'Belum ada data pajak'}
      description={hasFilters ? 'Coba ubah filter atau tambahkan data pajak baru' : 'Mulai dengan menambahkan kewajiban pajak'}
    />
  );
};

export default EmptyState;