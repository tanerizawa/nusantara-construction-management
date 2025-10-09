import React from 'react';
import { Search } from 'lucide-react';

const TeamSearchBar = ({ searchTerm, onSearchChange, filterRole, onFilterChange, roles }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Cari anggota tim..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>
      <select
        value={filterRole}
        onChange={(e) => onFilterChange(e.target.value)}
        className="border rounded-lg px-3 py-2"
      >
        <option value="all">Semua Role</option>
        {Object.keys(roles).map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
    </div>
  );
};

export default TeamSearchBar;
