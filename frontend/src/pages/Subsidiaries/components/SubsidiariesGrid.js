import React from 'react';
import SubsidiaryCard from './SubsidiaryCard';

/**
 * Subsidiaries grid component
 * 
 * @param {Object} props Component props
 * @param {Array} props.subsidiaries List of subsidiaries
 * @param {boolean} props.loading Loading state
 * @param {Function} props.onDelete Delete handler
 * @returns {JSX.Element} Subsidiaries grid UI
 */
const SubsidiariesGrid = ({ subsidiaries, loading, onDelete }) => {
  // Show loading skeletons when loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 rounded-lg animate-pulse" style={{ backgroundColor: "#2C2C2E" }}></div>
        ))}
      </div>
    );
  }

  // Show empty state when no subsidiaries
  if (subsidiaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
        <p className="text-xl font-medium mb-2" style={{ color: "#FFFFFF" }}>Tidak ada anak usaha ditemukan</p>
        <p style={{ color: "#98989D" }}>Tidak ada anak usaha yang sesuai dengan filter yang dipilih</p>
      </div>
    );
  }

  // Show subsidiaries grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subsidiaries.map(subsidiary => (
        <SubsidiaryCard
          key={subsidiary.id}
          subsidiary={subsidiary}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SubsidiariesGrid;