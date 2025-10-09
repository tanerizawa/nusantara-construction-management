import React from 'react';
import { Users } from 'lucide-react';

const TeamEmptyState = ({ searchTerm, filterRole }) => {
  return (
    <div className="text-center py-12">
      <Users size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada anggota tim</h3>
      <p className="text-gray-600">
        {searchTerm || filterRole !== 'all' 
          ? 'Tidak ada anggota yang sesuai dengan filter' 
          : 'Belum ada anggota tim yang ditambahkan'
        }
      </p>
    </div>
  );
};

export default TeamEmptyState;
