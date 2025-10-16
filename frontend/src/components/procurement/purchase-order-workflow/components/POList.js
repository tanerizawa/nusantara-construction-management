import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import POCard from './POCard';

/**
 * Purchase Order List Component
 */
const POList = ({ filteredPOs, onShowProjectSelection, onViewPODetail }) => {
  if (filteredPOs.length === 0) {
    return (
      <div className="bg-white rounded-lg border divide-y">
        <div className="p-12 text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada Purchase Order</h3>
          <p className="text-gray-500 mb-4">Mulai dengan membuat Purchase Order pertama untuk proyek Anda.</p>
          <button
            onClick={onShowProjectSelection}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Buat PO Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border divide-y">
      {filteredPOs.map((po) => (
        <POCard 
          key={po.id} 
          po={po} 
          onView={onViewPODetail}
        />
      ))}
    </div>
  );
};

export default POList;