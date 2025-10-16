import React from 'react';

/**
 * Component for displaying pagination controls
 * @param {Object} props Component props
 * @param {number} props.page Current page
 * @param {Function} props.setPage Function to set page
 * @param {Object} props.pagination Pagination data
 * @param {number} props.pageSize Number of items per page
 * @returns {JSX.Element} Pagination controls UI
 */
const Pagination = ({ page, setPage, pagination, pageSize }) => {
  if (!pagination || pagination.count === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-2">
      <div className="text-sm text-gray-600">
        Menampilkan {((pagination.current - 1) * pageSize) + 1}
        –{Math.min(pagination.current * pageSize, pagination.count)}
        {` dari ${pagination.count} entri`}
      </div>
      <div className="inline-flex border border-gray-300 rounded-lg overflow-hidden">
        <button
          className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Halaman sebelumnya"
        >
          Sebelumnya
        </button>
        <div className="px-3 py-2 text-sm text-gray-700 bg-gray-50">{page} / {pagination.total}</div>
        <button
          className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(pagination.total, p + 1))}
          disabled={page === pagination.total}
          aria-label="Halaman berikutnya"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
};

export default Pagination;