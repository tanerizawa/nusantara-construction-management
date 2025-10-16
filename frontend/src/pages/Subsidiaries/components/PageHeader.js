import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Plus } from 'lucide-react';

/**
 * Header component for Subsidiaries page
 * @returns {JSX.Element} Header UI
 */
const PageHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: "#FFFFFF" }}>
          <Building className="w-8 h-8" style={{ color: "#0A84FF" }} />
          Anak Usaha Nusantara Group
        </h1>
        <p className="mt-2" style={{ color: "#98989D" }}>Kelola anak usaha dan spesialisasi konstruksi</p>
      </div>
      <button
        onClick={() => navigate('/subsidiaries/create')}
        className="flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium"
        style={{ background: "linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)", color: "#FFFFFF" }}
      >
        <Plus size={20} />
        Tambah Anak Usaha
      </button>
    </div>
  );
};

export default PageHeader;